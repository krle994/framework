import { helpers } from './helpers';
export let VirtualDOM = (function() {

  const classsMap         = {};
  let   classCounter      = 0;
  const HARMONY_COMPONENT = 'HARMONY_COMPONENT';

  function _setBooleanProp(target, name, value) {
    if (value) {
      target.setAttribute(name, value);
      target[name] = true;
    } else {
      target[name] = false;
    }
  }

  function _removeBooleanProp(target, name) {
    target.removeAttribute(name);
    target[name] = false;
  }

  function _setProp(target, name, value) {
    if (helpers.isCustomProp(name)) {
      return;
    } else if (name === 'className') {
      target.setAttribute('class', value);
    } else if (typeof value === 'boolean') {
      _setBooleanProp(target, name, value);
    } else {
      target.setAttribute(name, value);
    }
  }

  function _removeProp(target, name, value) {
    if (helpers.isCustomProp(name)) {
      return;
    } else if (name === 'className') {
      target.removeAttribute('class');
    } else if (typeof value === 'boolean') {
      _removeBooleanProp(target, name);
    } else {
      target.removeAttribute(name);
    }
  }

  function _setProps(target, props) {
    Object.keys(props).forEach(name => {
      _setProp(target, name, props[name]);
    });
  }

  function _updateProp(target, name, newVal, oldVal) {
    if (!newVal) {
      _removeProp(target, name, oldVal);
    } else if (!oldVal || newVal !== oldVal) {
      _setProp(target, name, newVal);
    }
  }

  function _updateProps(target, newProps, oldProps = {}) {
    const props = Object.assign({}, newProps, oldProps);
    Object.keys(props).forEach(name => {
      _updateProp(target, name, newProps[name], oldProps[name]);
    });
  }

  function _addEventListeners(target, props) {
    Object.keys(props).forEach(name => {
      if (helpers.isEventProp(name)) {
        target.addEventListener(
          helpers.extractEventName(name),
          props[name]
        );
      }
    });
  }

  function isStateLessComponent(element) {
    return !isClass(element) && typeof element === 'function';
  }

  function isClass(elFunc) {
    return typeof elFunc === 'function' &&
           /^class\s/.test(Function.prototype.toString.call(elFunc));
  }

  function handleHtmlElement(type, props, children) {
    const el = document.createElement(type);
    _setProps(el, props);
    _addEventListeners(el, props);
    children
      .map(createElement)
      .forEach(el.appendChild.bind(el));
    return el;
  }

  class Component {
    constructor(props) {
      this.props = props;
    }

    setState(state) {
      this.state = Object.assign({}, this.state, state);
    }
  }

  function reUpdate() {
    while(parent.hasChildNodes()) {
      parent.removeChild(parent.lastChild)
    }

    classCounter = 1;
    updateElement()
  }

  function handleClass(clazz, props, children) {

    const harmonyElement = new clazz(props);
    harmonyElement.children = children;
    harmonyElement.type = HARMONY_COMPONENT;
    classMap[classCounter] = harmonyElement;

    return harmonyElement;
  }

  function h(type, props, ...children) {
    const node = {type, props, children};
    return createElement(node);
  }

  function createElement(node) {
    if (!helpers.isObject(node)) {
      return document.createTextNode(node);
    } else if (typeof node.type == 'function') {
      return handleClass(node.type, node.props, node.children)
    } else if (isStateLessComponent(node.type)) {
      return node.type(props);
    } else {
      return handleHtmlElement(node.type, node.props, node.children);
    }
  }


  function updateElement(parent, newNode, oldNode, childNode = parent.childNodes[0]) {
    if (newNode.type === HARMONY_COMPONENT || helpers.isNull(oldNode)) {
      parent.appendChild(createElement(newNode));
    } else if (helpers.isNull(newNode)) {
      parent.removeChild(childNode);
      return -1; // suggests that an element has been removed
    } else if (helpers.changed(newNode, oldNode)) {
      parent.replaceChild(createElement(newNode), childNode);
    } else if (newNode.type) {
      _updateProps(childNode, newNode.props, oldNode.props);
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


  return {
    h,
    updateElement,
    createElement
  }

})();
