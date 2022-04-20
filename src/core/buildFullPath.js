const isAbsoluteURL = require('../helpers/isAbsoluteURL')
const combineURLs = require('../helpers/combineURLs')

module.exports = (baseURL, requestedURL) => {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL)
  }
  return requestedURL
}