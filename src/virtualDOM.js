export let VirtualDOM = (function() {

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

  function _ensureNullValue(value) {
  	return _isNull(value)? ('' + value): value;
  }

  function _isEventProp(name) {
    return /^on/.test(name);
  }

  function _isObject(value) {
  	return typeof value === 'object';
  }

  function _isNull(value) {
  	return value == null;
  }

  function _extractEventName(name) {
    return name.slice(2).toLowerCase();
  }

  function _isCustomProp(name) {
    return _isEventProp(name) || name === 'forceUpdate';
  }

  function _setProp(target, name, value) {
    if (_isCustomProp(name)) {
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
    if (_isCustomProp(name)) {
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
      if (_isEventProp(name)) {
        target.addEventListener(
          _extractEventName(name),
          props[name]
        );
      }
    });
  }

  function _changed(node1, node2) {
    return typeof node1 !== typeof node2 ||
           !_isObject(node1) && node1 !== node2 ||
           node1.type !== node2.type ||
           node1.props && node1.props.forceUpdate;
  }


  function h(type, props, ...children) {
    return {
     type,
      props: props || {},
      children: [].concat.apply([], children)
   };
  }

  function createElement(node) {
    if (!_isObject(node)) {
      return document.createTextNode(node);
    }
    const el = document.createElement(node.type);
    _setProps(el, node.props);
    _addEventListeners(el, node.props);
    node.children
      .map(createElement)
      .forEach(el.appendChild.bind(el));
    return el;
  }


  function updateElement(parent, newNode, oldNode, childNode = parent.childNodes[0]) {
    if (_isNull(oldNode)) {
      parent.appendChild(createElement(newNode));
    } else if (_isNull(newNode)) {
      parent.removeChild(childNode);
      return -1; // suggests that an element has been removed
    } else if (_changed(newNode, oldNode)) {
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
    h: h,
    updateElement: updateElement,
    createElement: createElement
  }

})();
