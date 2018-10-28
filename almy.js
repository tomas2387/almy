;(function (exports) {
  var state = {}
  var listeners = {}
  exports.almy = {
    create: function () {
      state = {}
      listeners = {}
    },
    state: function (key) {
      return key ? state[key] : state
    },
    dispatch: function (key, value, doNotOptimize, doNotChainDispatch) {
      if (!key || typeof key !== 'string') return
      if (state[key] === value && !doNotOptimize) return
      state[key] = value
      if (listeners[key]) {
        for (var i = 0; i < listeners[key].length; ++i) {
          listeners[key][i](value)
        }
      }
      if (typeof value === 'object' && !doNotChainDispatch) {
        for (var prop in value) {
          if (value.hasOwnProperty(prop)) {
            this.dispatch(key + '->' + prop, value[prop], doNotOptimize, true)
          }
        }
      }
      if (/->/.test(key) && !doNotChainDispatch) {
        var parentAndChild = key.split('->')
        var parent = parentAndChild[0]
        var child = parentAndChild[1]
        if (typeof state[parent] === 'undefined') {
          var objectToDispatch = {}
          objectToDispatch[child] = value
          this.dispatch(parent, objectToDispatch, true, true)
        } else {
          state[parent][child] = value
          this.dispatch(parent, state[parent], true, true)
        }
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
