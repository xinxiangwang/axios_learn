const utils = require('../utils')
const buildFullPath = require('../core/buildFullPath')
const buildURL = require('../helpers/buildURL')
import settle from '../core/settle'
import parseHeaders from '../core/parseHeaders'
import createError from '../core/createError'
import defaults from '../defaults'

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

    const fullPath = buildFullPath(config.baseURL, config.url)
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true)
    request.timeout = config.timeout

    function onloadend() {
      if (!request) {
        return
      }

      const responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      }
      settle(function _resolve(value) {
        resolve(value)
      }, function _rejected(err) {
        reject(err)
      }, response)

      request = null
    }

    if ('onloadend' in request) {
      request.onloadend = onloadend
    } else {
      request.onreadystatechange = () => {
        if (!request || request.readyState !== 4) {
          return
        }

        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return
        }
        // readystatechange 事件和onloadend不同，会在onerror，ontimeout事件前调用，所以此处使用定时器达到onLoadend效果
        setTimeout(onloadend)
      }
    }
    request.onabort = () => {
      if (!request) return
      reject(createError('Request aborted', config, 'ECONNABORTED', request))
      request = null
    }

    request.onerror = () => {
      reject(createError('Network Error', config, null, request))
      request = null
    }

    request.ontimeout = () => {
      const timeoutErrorMessage = config.timeout ? 'timeout of' + config.timeout + 'ms exceeded' : 'timeout exceeded'
      const transitional = config.transitional || defaults.transitional
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        transitional.clarifyTimeoutError ? 'ETIMEOUT' : 'ECONNABORTED',
        request
      ))
      request = null
    }


    if (utils.isStandardBrowserEnv()) {
      // const xsrfValue = (config.withCredentials || )
    }

  })
}