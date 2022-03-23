// import


function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
  if (config.signal && config.signal.aborted) {
    throw new Cancel('canceled')
  }
}