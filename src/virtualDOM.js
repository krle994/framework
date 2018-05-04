

/** @jsx h */

export function h(type, props, ...children) {
  return {
    type,
    props: props || {},
    children
  };
}

export function isCustomProp() {
  return false;
}

export function setProp(target, name, value) {
  if(isCustomProp(name)) {
    return;
  } else if (name === 'className') {
    target.setAttribute('class', value);
  } else if (typeof value === 'boolean') {
    setBooleanProp(target, name, value);
  } else {
    target.setAttribute(name, value);
  }
}

export function setProps(target, props) {
  Object.keys(props).forEach(name => {
    setProp(target, name, props[name]);
  });
}

export function updateProp(target, name, newValue, oldValue) {
  if (!newValue) {
    removeProp(target, name, oldValue);
  } else if (!oldValue) {
    setProp(target, name, newValue);
  }
}

export function updateProps(target, newProps, oldProps = {}) {
  const props = Object.assign({}, newProps, oldProps);
  Object.keys(props).forEach(name => {
    updateProp(target, name, newProps[name], oldProps[name]);
  });
}

export function setBooleanProp(target, name, value) {
  if (value) {
    target.setAttribute(name, value);
    target[name] = true;
  } else {
    target[name] = false;
  }
}

export function removeProp(target, name, value) {
  if(isCustomProp(name)) {
    return;
  } else if (name === 'className') {
    target.removeAttribute('class');
  } else if (typeof value === 'boolean') {
    removeBooleanProp(target, name);
  } else {
    target.removeAttribute(name, value);
  }
}

export function removeBooleanProp(target, name) {
  target.removeAttribute(name);
  target[name] = false;
}

export function createElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }
  const elem = document.createElement(node.type);
  setProps(elem, node.props)
  node.children
    .map(createElement)
    .forEach(elem.appendChild.bind(elem));
  return elem;
}

export function changed(node1, node2) {
  return typeof node1 !== typeof node2 ||
    typeof node1 === 'string' && node1 !== node2 ||
    node1.type !== node2.type
}

export function updateElement(parent, newNode, oldNode, index = 0) {
  if (!oldNode) {
    parent.appendChild(
      createElement(newNode)
    );
  } else if (!newNode) {
    parent.removeChild(
      parent.childNodes[index]
    );
  } else if (changed(newNode, oldNode)) {
    parent.replaceChild(
      createElement(newNode),
      parent.childNodes[index]
    );
  } else if (newNode.type) {
    updateProps(
      parent.childNodes[index],
      newNode.props,
      oldNode.props
    );
    const newLength = newNode.children.length;
    const oldLength = oldNode.children.length;
    for (let i = 0; i < newLength || i < oldLength; i++) {
      updateElement(
        parent.childNodes[index],
        newNode.children[i],
        oldNode.children[i],
        i
      );
    }
  }
}
