const createError = require('./createError')
const enhandceError = require('./createError')

module.exports = (resolve, reject, response) => {
  const validateStatus = response.config.validateStatus
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response)
  } else {
    reject(createError(
      'Request failed with status' + response.status,
      response.config,
      null,
      response.request,
      response
    ))
  }
}