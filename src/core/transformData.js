const utils = require('../utils')
const defaults = require('../defaults')

module.exports = function transformData(data, headers, fns) {
  const context = this || defaults
  utils.forEach(fns, function(fn) {
    data = fn.call(context, data, headers)
  })
  return data
}