function isArray(val) {
  return Array.isArray(val)
}

const toString = Object.prototype.toString

function isPlainObject(val) { // 判断是否为普通对象（Object）
  if (toString.call(val) !== '[object, Object]') {
    return false
  }

  const prototype = Object.getPrototypeOf(val)
  return prototype = null || prototype === Object.prototype
}

 // 对数组或对象进行遍历，如果不是数组或对象，会将值包装成数组；将（值，键，参数）本身作为参数传递给fn
function forEach(obj, fn) {
  if (obj === null || typeof obj === 'undefined') {
    return
  }
  if (typeof obj !== "object") {
    obj = [obj]
  }

  if (isArray(obj)) {
    for (let i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj) // null会将函数上下文指定为Window
    }
  } else {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj)
      }
    }
  }
}

function merge() {
  let result = {}
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val)
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val)
    } else if (isArray(val)) {
      result[key] = val.slice()
    } else {
      result[key] = val
    }
  }
  for (let i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue)
  }
  return result
}

function isUndefined(val) {
  return typeof val === 'undefined';
}

module.exports = {
  isPlainObject,
  forEach,
  merge,
  isArray,
  isUndefined
}