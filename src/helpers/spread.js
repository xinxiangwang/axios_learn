module.exports = function spread(callback) {
  return function wrap() {
    return callback.apply(null, arr)
  }
}