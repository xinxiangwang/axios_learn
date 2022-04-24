const utils = require('../utils')

// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [ // node请求中，这些项如果有重复就会被丢弃多余的，所以不需要进行特殊处理，其他的有重复，需要进行特殊处理
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]

module.exports = function parseHeaders(headers) {
  const parsed = {}
  let key, val, i
  if (!headers) return parsed
  utils.forEach(headers.split('\n'), (line) => {
    i = line.indexOf(':')
    key = utils.trim(line.substr('0', i)).toLowerCase()
    val = utils.trim(line.substr(i + 1))
    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) { // 需要忽略的直接不做处理
        return
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val])
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val
      }
    }
  })
  return parsed
}