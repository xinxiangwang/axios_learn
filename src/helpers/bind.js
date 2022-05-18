// 修改函数fn执行上下文，返回一个全新的函数
module.exports = function bind(fn, thisArg) {
  return function wrap() {
    console.log(arguments.length);
    let args = new Array(arguments.length)
    args = Array.from(arguments)
    // for (let i = 0; i < args.length; i++) {
    //   args = arguments[i]
    // }
    console.log(args)
    return fn.apply(thisArg, args)
  }
}