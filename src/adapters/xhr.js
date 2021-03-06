const utils = require('../utils')
const buildFullPath = require('../core/buildFullPath')
const buildURL = require('../helpers/buildURL')
const settle = require('../core/settle')
const parseHeaders = require('../core/parseHeaders')
const createError = require('../core/createError')
const defaults = require('../defaults')
const isURLSameOrigin = require('./../helpers/isURLSameOrigin');
const cookies = require('../helpers/cookies')
const Cancel = require('../cancel/Cancel')

module.exports = function xhrAdapter(config) {
  return new Promise((resolve, reject) => {
    let requestData = config.data
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
    let request = new XMLHttpRequest()
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
        console.log(JSON.parse(responseData))
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
        done()
      }, function _rejected(err) {
        reject(err)
        done()
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
        // readystatechange ?????????onloadend???????????????onerror???ontimeout???????????????????????????????????????????????????onLoadend??????
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
      const xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xrsfCookieName ?
        cookies.read(config.xrsfCookieName) : undefined
      if (xsrfValue) {
        requestHeaders[config.xrsfCookieName] = xsrfValue
      }
    }

    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, (val, key) => {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          delete requestData[key]
        } else {
          request.setRequestHeader(key, val)
        }
      })
    }

    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!request.withCredentials
    }
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType
    }
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress)
    }
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress)
    }

    if (config.cancelToken || config.signal) {
      onCanceled = function(cancel) {
        if (!request) {
          return
        }
        reject(cancel && (cancel && cancel.type) ? new Cancel('canceled') : cancel)
        request.abort()
        request = null
      }

      config.cancelToken &&  config.cancelToken.subscribe(onCanceled)
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled)
      }
    }

    if (!requestData) {
      requestData = null
    }

    request.send(requestData)

  })
}