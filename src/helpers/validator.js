const VERSION = require('../env/data')
const validators = {}
const arr = ['object', 'boolean', 'number', 'function', 'string', 'symbol']
arr.forEach((type, idx) => {
  validators[type] = (thing) => {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : '') + type
  }
})

const deprecatedWarnings = {}

validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return `[Axios v ${VERSION}] Transitional option '${opt}'${desc} ${message ? '. ' + message : ''}`
  }
}