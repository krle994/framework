export let Harmony = (() => {
    let rootDOMElement = null;
    const TEXT_NODE = "TEXT_NODE";

    function formatNode(harmon) {
      const { type, props } = harmon;
      const isDomElement = typeof type === "string";

      if (isDomElement) {
        // formatNode target harmon
        const isTextElement = type === TEXT_NODE;
        const target = isTextElement
          ? document.createTextNode("")
          : document.createElement(type);

        updateDomProps(target, [], props);

        const childElements = props.children || [];
        const childNodes = childElements.map(formatNode);
        const childDoms = childNodes.map(childNode => childNode.target);
        childDoms.forEach(childDom => target.appendChild(childDom));

        const node = { target, harmon, childNodes };
        return node;
      } else {
        // formatNode component harmon
        const node = {};
        const newComponent = createNewComponent(harmon, node);
        const childElement = newComponent.harmonize();
        const childNode = formatNode(childElement);
        const target = childNode.target;

        Object.assign(node, { target, harmon, childNode, newComponent });
        return node;
      }
    }

    function updateDomProps(target, oldProps, newProps) {
      const isEvent = name => name.startsWith("on");
      const isAttribute = name => !isEvent(name) && name != "children";

      // Remove event listeners
      Object.keys(oldProps)
        .filter(isEvent)
        .forEach(name => {
          const eventType = name.toLowerCase().slice(2);
          target.removeEventListener(eventType, oldProps[name]);
        });

      // Remove attributes
      Object.keys(oldProps)
        .filter(isAttribute)
        .forEach(name => {
          target[name] = null;
        });

      // Set attributes
      Object.keys(newProps)
        .filter(isAttribute)
        .forEach(name => {
          target[name] = newProps[name];
        });

      // Add event listeners
      Object.keys(newProps)
        .filter(isEvent)
        .forEach(name => {
          const eventType = name.toLowerCase().substring(2);
          target.addEventListener(eventType, newProps[name]);
        });
    }

    class Component {
      constructor(props) {
        this.props = props;
        this.state = this.state || {};
      }

      setState(newState) {
        this.state = Object.assign({}, this.state, newState);
        updateInstance(this.existingNode);
      }
    }

    function updateInstance(existingNode) {
      const parentDom = existingNode.target.parentNode;
      const harmon = existingNode.harmon;
      updateDOM(parentDom, existingNode, harmon);
    }

    function createNewComponent(harmon, existingNode) {
      const { type, props } = harmon;
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
      return { type, props };
    }

    function createTextElement(value) {
      return createElement(TEXT_NODE, { nodeValue: value });
    }

    function harmonize(harmon, root) {
      const oldNode = rootDOMElement;
      const newNode = updateDOM(root, oldNode, harmon);
      rootDOMElement = newNode;
    }

    function updateDOM(parentDom, node, harmon) {
      if (node == null) {
        const newElement = formatNode(harmon);
        parentDom.appendChild(newElement.target);
        return newElement;

      } else if (harmon == null) {
        parentDom.removeChild(node.target);
        return null;

      } else if (node.harmon.type !== harmon.type) {
        const newElement = formatNode(harmon);
        parentDom.replaceChild(newElement.target, node.target);
        return newElement;

      } else if (typeof harmon.type === "string") {
        updateDomProps(node.target, node.harmon.props, harmon.props);
        node.childNodes = updateDOMChildren(node, harmon);
        node.harmon = harmon;
        return node;

      } else {
        node.newComponent.props = harmon.props;
        const childElement = node.newComponent.harmonize();
        const oldChildInstance = node.childNode;
        const childNode = updateDOM(
          parentDom,
          oldChildInstance,
          childElement
        );
        node.target = childNode.target;
        node.childNode = childNode;
        node.harmon = harmon;
        return node;
      }
    }

    function updateDOMChildren(node, harmon) {
      const target = node.target;
      const childNodes = node.childNodes;
      const nextChildElements = harmon.props.children || [];
      const newChildNodes = [];
      const count = Math.max(childNodes.length, nextChildElements.length);
      for (let i = 0; i < count; i++) {
        const childNode = childNodes[i];
        const childElement = nextChildElements[i];
        const newChildInstance = updateDOM(target, childNode, childElement);
        newChildNodes.push(newChildInstance);
      }
      return newChildNodes.filter(node => node != null);
    }

    return {
      createElement,
      harmonize,
      Component
    };

})();
