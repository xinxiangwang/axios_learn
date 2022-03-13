const Axios = require('./core/Axios')
const axios = new Axios({})

axios.request()

module.exports = axios
module.exports.default = axios