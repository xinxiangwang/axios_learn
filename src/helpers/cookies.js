const utils = require('../utils')
module.exports = (
  utils.isStandardBrowserEnv() ?
    (function standardBrowserEnv() {
      return {
        write(name, value, expires, path, domain, secure) {
          const cookie = []
          cookie.push(name + '=' + encodeURIComponent(value))
          if (utils.isNumber(expires)) {
            cookie.push(`expires=${new Date(expires).toGMTString()}`)
          }
          if (utils.isString(path)) {
            cookie.push(`path=${path}`)
          }
          if (utils.isString(domain)) {
            cookie.push(`domain=${domain}`)
          }
          if (secure === true) {
            cookie.push('secure')
          }
        },
        read(name) {
          const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))
          return match ? decodeURIComponent(match[3]) : null
        },
        remove(name) {
          this.write(name, '', Date.now() - 86400000)
        }
      }
    })() : (function noStandardBrowserEnv() {
      return {
        write() {},
        read() {
          return null
        },
        remove() {}
      }
    })
)