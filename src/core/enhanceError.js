module.exports = (error, config, code, request, response) => {
  error.config = config
  if (code) {
    error.code = code
  }
  error.request = request
  error.response = response
  error.isAxiosError = true
  error.toJSON = function toJSON() {
    return {
      message: this.message,
      name: this.name,
      description: this.description,
      number: this.number,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    }
  }
  return error
}