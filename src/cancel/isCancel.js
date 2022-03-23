const Cancel = require('./Cancel')
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new Error('executor must be a function')
  }
  let resolvePromise
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve
  })
  const token = this
  this.promise.then(function(cancel) {
    if (!token._listeners) return
    for (let i = 0, l = token._listeners.length; i < l; i++) {
      token._listeners[i](cancel)
    }
    token._listeners = null
  })
}