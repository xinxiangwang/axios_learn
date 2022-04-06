const utils = require('../utils.js')

module.exports = (headers, normalizeName) => {
  utils.forEach(headers, (value, name) => {
    if (name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
      headers[normalizeName] = value
      delete headers[name]
    }
  })
}