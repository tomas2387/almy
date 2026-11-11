var state = {};
var listeners = {};
var has = Object.prototype.hasOwnProperty;
var almy = {
  create: function () {
    state = {};
    listeners = {};
  },
  state: function (key) {
    return key ? state[key] : state;
  },
  dispatch: function dispatch(
    key,
    value,
    skipOptimization,
    skipDownPropagation,
    skipUpPropagation,
  ) {
    if (!key || typeof key !== 'string') return;
    var parts = key.split('->');
    for (var j = 0; j < parts.length; ++j) {
      var part = parts[j];
      if (
        part === '__proto__' ||
        part === 'constructor' ||
        part === 'prototype'
      )
        return;
    }
    if (has.call(state, key) && state[key] === value && !skipOptimization) {
      return;
    }
    state[key] = value;
    if (listeners[key]) {
      for (var i = 0; i < listeners[key].length; ++i) {
        listeners[key][i](value);
      }
    }

    if (typeof value === 'object' && value !== null && !skipDownPropagation) {
      for (var prop in value) {
        if (has.call(value, prop)) {
          dispatch(
            key + '->' + prop,
            value[prop],
            skipOptimization,
            false,
            true,
          );
        }
      }
    }

    if (!skipUpPropagation) {
      if (parts.length > 1) {
        var child = parts[parts.length - 1];
        var parentKey = parts.slice(0, -1).join('->');
        // Only reuse own properties so an inherited one (e.g. Object.prototype)
        // can never be the target of the assignment below.
        var parent = has.call(state, parentKey) ? state[parentKey] : null;
        if (!parent || typeof parent !== 'object') {
          parent = state[parentKey] = {};
        }
        parent[child] = value;
        dispatch(parentKey, parent, true, true, false);
      }
    }
  },
  subscribe: function (key, callback) {
    if (!key || typeof key !== 'string') return;
    if (!listeners[key]) listeners[key] = [];
    listeners[key].push(callback);
    if (has.call(state, key)) callback(state[key]);
    return function () {
      if (!listeners[key]) return;
      var index = listeners[key].indexOf(callback);
      if (index !== -1) {
        listeners[key].splice(index, 1);
        if (listeners[key].length === 0) {
          delete listeners[key];
        }
      }
    };
  },
};
export default almy;
