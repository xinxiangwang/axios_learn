const utils = require('../utils')

function encode(str) {
  return encodeURIComponent(str).
    replace(/%3A/gi, ':').
    replace(/%24/gi, '$').
    replace(/%2C/gi, ',').
    replace(/%20/gi, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']')
}

module.exports = function buildURL(url, params, paramsSerializer) {
  if (!params) return url
  let serializedParams
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    const parts = []
    utils.forEach(params, (val, key) => {
      if (val === null || typeof val === undefined) return
      if (utils.isArray(val)) {
        key = key + '[]'
      } else {
        val = [val]
      }
      utils.forEach(val, (v) => {
        if (utils.isDate(v)) {
          v = v.toISOString()
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v)
        }
        parts.push(encode(key) + '=' + encode(v))
      })
    })
    serializedParams = parts.join('&')
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf('#')
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex)
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') +  serializedParams
  }
  return url
}