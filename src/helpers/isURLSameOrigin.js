const utils = require('../utils')

module.exports = (
  utils.isStandardBrowserEnv() ?
    (function standardBrowserEnv() {
      const msie = /(msie|trident)/i.test(navigator.userAgent)
      const urlParsingNode = document.createElement('a')
      let originURL
      function resolveURL(url) {
        const href = url
        if (msie) {
          urlParsingNode.setAttribute('href', href)
          href = urlParsingNode.href
        }
        urlParsingNode.setAttribute('href', href)
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ? urlParsingNode.pathname : '/' + urlParsingNode.pathname
        }
      }
      originURL = resolveURL(window.location.href)
      return function isURLSameOrigin(requestURL) {
        const parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL
        return (parsed.protocol === originURL.protocol && parsed.host === originURL.host)
      }
    })() : (function notStandardBrowserEnv() { // 不是浏览器，不会存在跨域问题，直接return true
      return function isURLSameOrigin() {
        return true
      }
    })()
)