var state = {};
var listeners = {};
var almy = {
  create: function() {
    state = {};
    listeners = {};
  },
  state: function(key) {
    return key ? state[key] : state;
  },
  dispatch: function(key, value, doNotOptimize, doNotChainDispatch) {
    if (!key || typeof key !== 'string') return;
    if (state[key] === value && !doNotOptimize) return;
    state[key] = value;
    if (listeners[key]) {
      for (var i = 0; i < listeners[key].length; ++i) {
        listeners[key][i](value);
      }
    }
    if (typeof value === 'object' && !doNotChainDispatch) {
      for (var prop in value) {
        if (value.hasOwnProperty(prop)) {
          this.dispatch(key + '->' + prop, value[prop], doNotOptimize, true);
        }
      }
    }
    if (/->/.test(key) && !doNotChainDispatch) {
      var parentAndChild = key.split('->');
      var parent = parentAndChild[0];
      var child = parentAndChild[1];
      if (!state[parent]) state[parent] = {};
      state[parent][child] = value;
      this.dispatch(parent, state[parent], true, true);
    }
  },
  subscribe: function(key, callback) {
    if (!listeners[key]) listeners[key] = [];
    listeners[key].push(callback);
    if (state[key]) callback(state[key]);
  }
};
export { almy };
