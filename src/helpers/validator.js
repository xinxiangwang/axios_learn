const VERSION = require('../env/data')
const validators = {}

['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, idx) => {
  validators[type] = (thing) => {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : '') + type
  }
})

const deprecatedWarnings = {}

validators.transitional = function transitional(validator, version, message) {
  
}