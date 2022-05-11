const Cancel = require('./Cancel')

// new CancenToken后有两种情况，
// 一种是调用了executor传递给外部的函数，这种的有reason，这里暂且叫外部函数为 outsideFun
// outsideFun主要作用是调用所有订阅的事件
// 另一种是没有调用，这种是没有reason
// 在有reason时，也就是在new CancenToken后调用了 outsideFun，在subscribe时，会直接调用要订阅的事件，而不是放进listeners
// 在没有reason时，也就是在new CancenToken后没有调用了 outsideFun，在subscribe时，会直接订阅事件，等待outsideFun执行触发

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
  executor((message) => { // 此函数传递给外部使用
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

CancelToken.prototype.source = function source() { // 方便外部使用，直接生成token 以及 调用函数
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