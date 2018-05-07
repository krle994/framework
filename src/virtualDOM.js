/** @jsx h */

  export function h(type, props, ...children) {
    return {
      type,
      props: props || {},
      children: [].concat(...children) // flatten children
        .map(ensureNullValue) // ensures null/undefined values are shown
    };
  }

  export function setBooleanProp(target, name, value) {
    if (value) {
      target.setAttribute(name, value);
      target[name] = true;
    } else {
      target[name] = false;
    }
  }

  export function removeBooleanProp(target, name) {
    target.removeAttribute(name);
    target[name] = false;
  }

  export function ensureNullValue(value) {
    return isNull(value) ? ('' + value) : value;
  }

  export function isEventProp(name) {
    return /^on/.test(name);
  }

  export function isObject(value) {
    return typeof value === 'object';
  }

  export function isNull(value) {
    return value == null;
  }

  export function extractEventName(name) {
    return name.slice(2).toLowerCase();
  }

  export function isCustomProp(name) {
    return isEventProp(name) || name === 'forceUpdate';
  }

  export function setProp(target, name, value) {
    if (isCustomProp(name)) {
      return;
    } else if (name === 'className') {
      target.setAttribute('class', value);
    } else if (typeof value === 'boolean') {
      setBooleanProp(target, name, value);
    } else {
      target.setAttribute(name, value);
    }
  }

  export function removeProp(target, name, value) {
    if (isCustomProp(name)) {
      return;
    } else if (name === 'className') {
      target.removeAttribute('class');
    } else if (typeof value === 'boolean') {
      removeBooleanProp(target, name);
    } else {
      target.removeAttribute(name);
    }
  }

  export function setProps(target, props) {
    Object.keys(props).forEach(name => {
      setProp(target, name, props[name]);
    });
  }

  export function updateProp(target, name, newVal, oldVal) {
    if (!newVal) {
      removeProp(target, name, oldVal);
    } else if (!oldVal || newVal !== oldVal) {
      setProp(target, name, newVal);
    }
  }

  export function updateProps(target, newProps, oldProps = {}) {
    const props = Object.assign({}, newProps, oldProps);
    Object.keys(props).forEach(name => {
      updateProp(target, name, newProps[name], oldProps[name]);
    });
  }

  export function addEventListeners(target, props) {
    Object.keys(props).forEach(name => {
      if (isEventProp(name)) {
        target.addEventListener(
          extractEventName(name),
          props[name]
        );
      }
    });
  }

  export function createElement(node) {
    if (typeof node === 'string') {
      return document.createTextNode(node);
    }
    const el = document.createElement(node.type);
    setProps(el, node.props);
    addEventListeners(el, node.props);
    node.children
      .map(createElement)
      .forEach(el.appendChild.bind(el));
    return el;
  }

  export function changed(node1, node2) {
    return typeof node1 !== typeof node2 ||
      typeof node1 === 'string' && node1 !== node2 ||
      node1.type !== node2.type ||
      node1.props && node1.props.forceUpdate;
  }

  export function updateElement(parent, newNode, oldNode, childNode = parent.childNodes[0]) {
    if (isNull(oldNode)) {
      parent.appendChild(createElement(newNode));
    } else if (isNull(newNode)) {
      parent.removeChild(childNode);
      return -1; // suggests that an element has been removed
    } else if (changed(newNode, oldNode)) {
      parent.replaceChild(createElement(newNode), childNode);
    } else if (newNode.type) {
      updateProps(childNode, newNode.props, oldNode.props);
      const max = Math.max(newNode.children.length, oldNode.children.length);
      let adjustment = 0;
      for (let i = 0; i < max; i++) {
        adjustment += updateElement(
          childNode,
          newNode.children[i],
          oldNode.children[i],
          childNode.childNodes[i + adjustment]
        );
      }
    }
    return 0; // suggest that an element has not been removed
  }
