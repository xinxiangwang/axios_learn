const Axios = require('./core/Axios')
const mergeConfig = require('./core/mergeConfig')
const defaults = require('./defaults')
const bind = require('./helpers/bind')
const utils = require('./utils')

function createInstance(defaultConfig) {
  const context = new Axios(defaultConfig)
  const instance = bind(Axios.prototype.request, context)
  utils.extend(instance, Axios.prototype, context)
  utils.extend(instance, context)

  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig))
  }
  return instance
}

const axios = createInstance(defaults)
axios.Axios = axios
axios.Cancel = require('./cancel/Cancel')
axios.CancelToken = require('./cancel/CancelToken')
axios.isCancel = require('./cancel/CancelToken')
axios.VERSION = require('./env/data').version
axios.all = function all(promise) {
  return Promise.all(promise)
}
axios.spread = require('./helpers/spread')



module.exports = axios

const selfAxios = axios.create({
  baseURL: 'http://rap2api.taobao.org/app/mock',
  validateStatus: (status) => {
    console.log(status)
    return status === 200
  }
})

try {
  selfAxios.get('/272261/fetchStudentAchivement')
} catch (err) {
  console.log(err)
}

module.exports.default = axios