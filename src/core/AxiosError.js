const utils = require('utils');
const Axios = require('./Axios');

function AxiosError(message, code, config, request, response) {
    Error.call(this)
    this.message = message,
    this.name = "AxiosError"
    code && (this.code = code)
    config && (this.config = config)
    request && (this.request = request)
    response && (this.response = response)
}

utils.inherits(AxiosError, Error, {
    toJSON() {
        return {
            message: this.message,
            name: this.name,
            description: this.description,
            number: this.number,
            fileName: this.fileName,
            lineNumber: this.lineNumber,
            columnNumber: this.columnNumber,
            stack: this.stack,
            config: this.config,
            code: this.code,
            status: this.response && this.response.status ? this.response.status : null
        }
    }
})

const prototype = Axios.prototype
const descriptors = {}

[
    'ERR_BAD_OPTION_VALUE',
    'ERR_BAD_OPTION',
    'ECONNABORTED',
    'ETIMEDOUT',
    'ERR_NETWORK',
    'ERR_FR_TOO_MANY_REDIRECTS',
    'ERR_DEPRECATED',
    'ERR_BAD_RESPONSE',
    'ERR_BAD_REQUEST',
    'ERR_CANCELED'
].forEach(code => {
    descriptors[code] = {
        value: code // value 给Object.defineProperties
    }
})

Object.defineProperties(AxiosError, descriptors)
Object.defineProperty(AxiosError, 'isAxiosError', { value: true })

AxiosError.from = function(error, code, config, request, response, customProps) {
    const axiosError = Object.create(prototype)
    utils.toFlatObject(error, AxiosError, (obj) => {
        return obj !== Error.prototype
    })
    Axios.call(axiosError, error.message, code, config, request, response)
    axiosError.name = error.name
    customProps && Object.assign(axiosError, customProps)
    return axiosError
}

module.exports = AxiosError