const utils = require('../utils')
const Cancel = require('../cancel/Cancel')
const defaults = require('../defaults')
const isCancel = require('../cancel/isCancel')
const transformData = require('./transformData')

function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
  if (config.signal && config.signal.aborted) {
    throw new Cancel('canceled')
  }
}

module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config)
  config.headers = config.headers || {}

  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  )

  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  )

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    (method) => {
      delete config.headers[method]
    }
  )

  const adapter = config.adapter || defaults.adapter
  return adapter(config).then(function onAdapterResolution(response) {
    console.log(config)
    throwIfCancellationRequested(config)
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    )
    return response
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config)
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        )
      }
    }
    return Promise.reject(reason)
  })
}