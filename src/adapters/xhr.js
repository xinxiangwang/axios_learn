const utils = require('../utils')
const buildeFullPath = require('../core/buildFullPath')

module.exports = function xhrAdapter(config) {
  return new Promise((resolve, reject) => {
    const requestData = config.data
    const requestHeaders = config.headers
    const responseType = config.responseType
    let onCanceled
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled)
      }
      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled)
      }
    }
    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']
    }
    const request = new XMLHttpRequest()
    if (config.auth) {
      const username = config.auth.username || ''
      const password = config.auth.password ? decodeURI(encodeURIComponent(config.auth.password)) : ''
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password)
    }

    const fullPath = buildeFullPath(config.baseURL, config.url)
    request.open(config.method.toUpperCase(), build)
  })
}