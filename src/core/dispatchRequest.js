import utils from '../utils'
import Cancel from '../cancel/Cancel'


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

  config.data = transform
}