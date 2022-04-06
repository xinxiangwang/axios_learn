const Cancel = require('./Cancel')

function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function')
  }
  let resolvePromise
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve
  })
  this.promise.then((cancel) => {
    if (!this._listeners) return
    for (let i = 0, l = this._listeners.length; i < l; i++) {
      this._listeners[i](cancel)
    }
    CancelToken._listeners = null
  })
  this.promise.then = (onfulfilled) => {
    let _resolve
    const promise = new Promise((resolve) => {
      this.subscribe(resolve)
      _resolve = resolve
    }).then(onfulfilled)
    promise.cancel = function reject() {
      this.unsubscribe(_resolve)
    }
    return promise
  }
  executor((message) => {
    if (this.reason) {
      return
    }
    this.reason = new Cancel(message)
    resolvePromise(this.reason)
  })
}

CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason
  }
}

CancelToken.prototype.subscribe = function subscribe(listener) {
  if (this.reason) {
    listener(this.reason)
    return
  }
  if (this._listeners) {
    this._listeners.push(listener)
  } else {
    this._listeners = [listener]
  }
}

CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
  if (!this._listeners) {
    return
  }
  const index = this._listeners.indexOf(listener)
  if (index !== -1) {
    this._listeners.splice(index, 1)
  }
}

CancelToken.prototype.source = function source() {
  let cancel
  const token = new CancelToken(function executor(c) {
    cancel = c
  })
  return {
    token,
    cancel
  }
}

module.exports = CancelToken