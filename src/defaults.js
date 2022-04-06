const utils = require('./utils')
const normalizeName = require('./helpers/normalizeHeaderName')
const enhanceError = require('./core/enhanceError')

const DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencode'
}

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value
  }
}

function getDefaultAdapter() {
  let adapter
  if (typeof XMLHttpRequest !== undefined) { // browsers use
    adapter = ''
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') { // node use
    adapter = ''
  }
  return adapter
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue)
      return utils.trim(rawValue)
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e
      }
    }
  }
  return (encoder || JSON.stringify)(rawValue)
}

