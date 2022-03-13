const InterceptorManager = require("./InterceptorManager")
const mergeConfig = require('./mergeConfig')

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
    
  }
}

module.exports = Axios