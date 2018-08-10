;(function (exports) {
  var state = {}, listeners = {}
  exports.almy = {
    newInstance: function () {
      state = {}
      listeners = {}
    },
    getState: function (key) {
      return key ? state[key] : state
    },
    dispatch: function (key, value) {
      if (!key || typeof key !== 'string') {
        return
      }
      if (state[key] === value) return;
      state[key] = value
      if (listeners[key]) {
        for (var i = 0; i < listeners[key].length; ++i) {
          listeners[key][i](value)
        }
      }
      if (typeof value === 'object') {
        for(var prop in value) {
          if (value.hasOwnProperty(prop)) { 
            state[key+'->'+prop] = value[prop]
          }
        }
      }
      if (/\->/.test(key)) {
        var parentAndChild = key.split('->');
        var parent = parentAndChild[0]
        var child = parentAndChild[1]
        var objectToDispatch = state[parent] 
        if (typeof objectToDispatch === 'undefined') {
          objectToDispatch = {};
        }
        objectToDispatch[child] = value
        this.dispatch(parent, objectToDispatch)
      }
    },
    subscribe: function (key, callback) {
      if (typeof listeners[key] === 'undefined') {
        listeners[key] = []
      }
      listeners[key].push(callback)
      if (typeof state[key] !== 'undefined') {
        callback(state[key])
      }
    }
  }
}(typeof module === 'object' ? module.exports : window))
