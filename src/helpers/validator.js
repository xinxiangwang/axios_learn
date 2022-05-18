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
  return function(value, opt, opts) {
    if (validator === false) {
       throw new Error(formatMessage(opt, 'has been removed' + (bersion ? ' in ' + version : '')))
    }
    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      )
    }
    return validator ? validator(value, opt, opts) : true
  }
}

function assertOptions(options, schema, allUnknow) {
  if (typeof options !== 'object') {
    throw new Error('options must be an object')
  }
  const keys = Object.keys(options)
  let i = keys.length
  while(i -- > 0) {
    const opt = keys[i]
    const validator = schema[opt]
    if (validator) {
      const value = options[opt]
      const result = value === undefined || validator(value, opt, options)
      if (result !== true) {
        throw new Error('option' + opt + ' must be' + result)
      }
      continue
    }
    if (allUnknow !== true) {
      throw new Error('Unknow option ' + opt)
    }
  }
}

module.exports = {
  assertOptions: assertOptions,
  validators: validators
}