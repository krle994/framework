export let VirtualDOM = (() => {
  const TEXT_NODE = "TEXT NODE";
  let rootDOMElement = null;

  function formatNode(harmon) {
    const { type, props } = harmon;
    const isDOMElement = typeof type === 'string';

    if(isDOMElement) {
      // Create DOM element
      const isTextElement = type === "TEXT NODE";
      const target = isTextElement ?
        document.createTextNode("") :
        document.createElement(type);

      updateDOMProps(target, [], props);

      // Create and append children
      const childElements = props.children || [];
      const childNodes = childElements.map(formatNode);
      const childDoms = childNodes.map(childNode => childNode.target);
      childDoms.forEach(childDom => target.appendChild(childDom));

      const node = {
        target,
        harmon,
        childNodes
      };
      return node;

    } else {

      const node = {};
      const newComponent = createNewComponent(harmon, node);
      const childNode = newComponent.harmonize();
      const formattedChild = formatNode(childNode);
      const target = formattedChild.target;

      Object.assign(node, { target, harmon, formattedChild, newComponent});
      return node;
    }
  }

  function updateDOMProps(target, prevProps, nextProps) {
    const isEvent = name => name.startsWith("on");
    const isAttribute = name => !isEvent(name) && name != "children";
    // Remove event listeners
    Object.keys(prevProps)
      .filter(isEvent).forEach(name => {
        const eventType = name.toLowerCase().slice(2);
        target.removeEventListener(eventType, prevProps[name]);
      });

    // Remove attributes
    Object.keys(prevProps)
      .filter(isAttribute).forEach(name => {
        target[name] = null;
      });

    // Set attributes
    Object.keys(nextProps)
      .filter(isAttribute).forEach(name => {
        target[name] = nextProps[name];
      });

    // Add event listeners
    Object.keys(nextProps)
      .filter(isEvent).forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        target.addEventListener(eventType, nextProps[name]);
      });
  }

  class Component {
    constructor(props) {
      this.props = props;
      this.state = this.state || {};
    }

    setState(newState) {
      this.state = Object.assign({}, this.state, newState);
      updateNode(this.existingNode)
    }
  }

  function updateNode(existingNode) {
    console.log(existingNode, 'exist');
    const parentDom = existingNode.target.parentNode;
    const harmon = existingNode.harmon;
    updateDOM(parentDom, existingNode, harmon);
  }

  function createNewComponent(harmon, existingNode) {
    const {type, props} = harmon;
    const newComponent = new type(props);
    newComponent.existingNode = existingNode;
    return newComponent;
  }

  function createElement(type, config, ...args) {
    const props = Object.assign({}, config);
    const hasChildren = args.length > 0;
    const flattenChildren = hasChildren ? [].concat(...args) : [];
    props.children = flattenChildren
      .filter(child => child != null && child !== false)
      .map(child => child instanceof Object ? child : createTextElement(child));
    return {
      type,
      props
    };
  }

  function createTextElement(value) {
    return createElement(TEXT_NODE, {
      nodeValue: value
    });
  }

  function harmonize(harmon, root) {
    const oldHarmon = rootDOMElement;
    const newHarmon = updateDOM(root, oldHarmon, harmon);
    rootDOMElement = newHarmon;
  }

  function updateDOM(parentDom, node, harmon) {
    console.log(node, 'NODE: ovde harmon');
    if (node == null) {
      const newNode = formatNode(harmon);
      parentDom.appendChild(newNode.target);
      return newNode;

    } else if (harmon == null) {
      parentDom.removeChild(node.target);
      return null;

    } else if (node.harmon.type !== harmon.type) {
      const newNode = formatNode(harmon);
      parentDom.replaceChild(newNode.target, node.target);
      return newNode;

    } else if (typeof harmon === 'string') {
      updateDOMProps(node.target, node.harmon.props, harmon.props);
      node.childNodes = updateDOMChildren(node, harmon);
      node.harmon = harmon;
      return node;

    } else {
      node.newComponent.props = harmon.props;
      const componentChild = node.newComponent.harmonize();
      const oldChildElement = node.childNode;
      const newChildElement = updateDOM(parentDom, oldChildElement, componentChild);
      node.target = newChildElement.target;
      node.newChildElement = newChildElement;
      node.harmon = harmon;
      return node;
    }
  }

  function updateDOMChildren(node, harmon) {
    const target = node.target;
    const childNodes = node.childNodes;
    const nextChildElements = harmon.props.children || [];
    const newchildNodes = [];
    const count = Math.max(childNodes.length, nextChildElements.length);
    for (let i = 0; i < count; i++) {
      const childNode = childNodes[i];
      const childElement = nextChildElements[i];
      const newChildNode = updateDOM(target, childNode, childElement);
      newchildNodes.push(newChildNode);
    }
    return newchildNodes.filter(node => node != null);
  }

  return {
    Component,
    harmonize,
    createElement
  };

})();
