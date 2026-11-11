var state = Object.create(null);
var listeners = Object.create(null);
var has = Object.prototype.hasOwnProperty;
var UNSAFE_KEYS = ['__proto__', 'constructor', 'prototype'];
var almy = {
  create: function () {
    state = Object.create(null);
    listeners = Object.create(null);
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
    if (
      parts.some(function (part) {
        return UNSAFE_KEYS.indexOf(part) !== -1;
      })
    )
      return;
    if (has.call(state, key) && state[key] === value && !skipOptimization) {
      return;
    }
    state[key] = value;
    if (listeners[key]) {
      for (var i = 0; i < listeners[key].length; ++i) {
        listeners[key][i](value);
      }
    }

    if (typeof value === 'object' && !skipDownPropagation) {
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
        if (!state[parentKey] || typeof state[parentKey] !== 'object') {
          state[parentKey] = {};
        }
        state[parentKey][child] = value;
        dispatch(parentKey, state[parentKey], true, true, false);
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
        // Only frees memory: an empty listener list behaves like a missing one,
        // so skipping the delete is not observable through the public API.
        // Stryker disable next-line ConditionalExpression,BlockStatement: equivalent mutants
        if (listeners[key].length === 0) {
          delete listeners[key];
        }
      }
    };
  },
};
export default almy;
