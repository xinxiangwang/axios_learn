const utils = require('../utils')
module.exports = function isAxiosError(payload) {
  return utils.isObject(payload) && (payload.isAxiosError === true)
}