
export let helpers = (() => {

  function isEventProp(name) {
    return /^on/.test(name);
  }

  function isObject(value) {
    return typeof value === 'object';
  }

  function isNull(value) {
    return value == null;
  }

  function extractEventName(name) {
    return name.slice(2).toLowerCase();
  }

  function isCustomProp(name) {
    return isEventProp(name) || name === 'forceUpdate';
  }

  function changed(node1, node2) {
    return typeof node1 !== typeof node2 ||
      !isObject(node1) && node1 !== node2 ||
      node1.type !== node2.type ||
      node1.props && node1.props.forceUpdate;
  }

  return {
    isEventProp,
    isObject,
    isNull,
    extractEventName,
    isCustomProp,
    changed
  }

})();
