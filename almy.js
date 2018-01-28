;(function (exports) {
  var state = {}
  var listeners = {}
  exports.almy = {
    newInstance: function () {
      state = {}
      listeners = {}
    },
    getState: function () {
      return state
    },
    dispatch: function (key, value) {
      if (!key || typeof key !== 'string') {
        return
      }
      state[key] = value
      if (typeof listeners[key] === 'undefined') {
        return
      }
      for (var i = 0; i < listeners[key].length; ++i) {
        listeners[key][i](value)
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
