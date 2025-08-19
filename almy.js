var state = {};
var listeners = {};
var almy = {
  create: function () {
    state = {};
    listeners = {};
  },
  state: function (key) {
    return key ? state[key] : state;
  },
  dispatch: function (
    key,
    value,
    skipOptimization,
    skipDownPropagation,
    skipUpPropagation,
  ) {
    if (!key || typeof key !== 'string') return;
    if (
      Object.prototype.hasOwnProperty.call(state, key) &&
      state[key] === value &&
      !skipOptimization
    ) {
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
        if (Object.prototype.hasOwnProperty.call(value, prop)) {
          this.dispatch(
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
      var parts = key.split('->');
      if (parts.length > 1) {
        var child = parts.pop();
        var parentKey = parts.join('->');
        if (!state[parentKey] || typeof state[parentKey] !== 'object') {
          state[parentKey] = {};
        }
        state[parentKey][child] = value;
        this.dispatch(parentKey, state[parentKey], true, true, false);
      }
    }
  },
  subscribe: function (key, callback) {
    if (!key || typeof key !== 'string') return;
    if (!listeners[key]) listeners[key] = [];
    listeners[key].push(callback);
    if (Object.prototype.hasOwnProperty.call(state, key)) callback(state[key]);
  },
};
export { almy };
