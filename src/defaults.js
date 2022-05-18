const utils = require('./utils')
const enhanceError = require('./core/enhanceError')
const normalizeHeaderName = require('./helpers/normalizeHeaderName')

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
    adapter = require('./adapters/xhr')
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') { // node use
    adapter = require('./adapters/xhr')
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

const defaults = {
  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },
  adapter: getDefaultAdapter(),
  transformResponse: [
    (data, headers) => {
      console.log(data)
      normalizeHeaderName(headers, 'Accept')
      normalizeHeaderName(headers, 'Content-Type')
      if (
        utils.isFormData(data) ||
        utils.isArrayBuffer(data) ||
        utils.isBuffer(data) ||
        utils.isStream(data) ||
        utils.isFile(data) ||
        utils.isBlob(data)
      ) {
        return data
      }

      if (utils.isArrayBufferView(data)) {
        return data.buffer
      }
      if (utils.isURLSearchParams(data)) {
        setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset:utf-8')
        return data.toString()
      }
      if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
        setContentTypeIfUnset(headers, 'application/json')
        return stringifySafely(data)
      }
      return data
    }
  ],
  transformResponse: [function transformResponse(data) {
    console.log('zxczxczxczcccccccccccccc')
    const transitional = this.transitional || defaults.transitional
    const silentJSONParsing = transitional && transitional.silentJSONParsing
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing
    const strictJSONParsing = !silentJSONParsing && this.responseType === 'json'
    console.log(strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length))
    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data)
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE')
          }
        }
      }
    }
    return data
  }],
  timeout: 0,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  maxContentLength: -1,
  maxBodyLength: -1,
  validateStatus(status) {
    return status >= 200 && status < 300
  },
  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
}

utils.forEach(['post', 'put', 'patch'], (method) => {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE)
})

utils.forEach(['delete', 'get', 'head'], (method) => {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE)
})

module.exports = defaults