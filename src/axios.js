const Axios = require('./core/Axios')
const axios = new Axios({})

axios.get('http://www.baidu.com')

module.exports = axios
module.exports.default = axios