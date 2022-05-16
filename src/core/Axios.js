const InterceptorManager = require("./InterceptorManager")
const mergeConfig = require('./mergeConfig')
const validator = require('../helpers/validator')
const validators = validator.validators
import buildURL from '../helpers/buildURL'
import dispatchRequest from './dispatchRequest'

function Axios(instanceConfig) {
  this.defaults = instanceConfig
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  }
}

Axios.prototype.request = function request(configOrUrl, config) {
  if (typeof configOrUrl === 'string') {
    config = config || {}
    config.url = configOrUrl
  } else {
    config = configOrUrl || {}
  }
  config = mergeConfig(this.defaults, config)

  if (config.method) {
    config.method = config.method.toLowerCase()
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase()
  } else {
    config.method = 'get'
  }
  const transitional = config.transitional
  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false)
  }

  const requestInterceptorChain = []
  let synchronousRequestInterceptors = true
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) { // interceptor 为handlers每一项
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return
    }
    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronousRequestInterceptors
    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected)
  })

  const responseInterceptorChain = []
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected)
  })

  const promise = null;
  if (!synchronousRequestInterceptors) {
    let chain = [dispatchRequest, undefined]
    Array.prototype.unshift.apply(chain, requestInterceptorChain)
    chain = chain.concat(responseInterceptorChain)
    promise = Promise.resolve(config)
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift())
    }
    return promise
  }

  let newConfig = config
  while (requestInterceptorChain.length) {
    const onFulfilled = requestInterceptorChain.shift()
    const onRejected = requestInterceptorChain.shift()
    try {
      newConfig = onFulfilled(newConfig)
    } catch (err) {
      onRejected(err)
      break
    }
  }

  try {
    promise = dispatchRequest(newConfig)
  } catch (err) {
    return Promise.reject(err)
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift())
  }
  return promise
}

Axios.prototype.getUri = (config) => {
  config = mergeConfig(this.defaults, config)
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '')
}

module.exports = Axios