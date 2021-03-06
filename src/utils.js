const bind = require("./helpers/bind")

function isArray(val) {
  return Array.isArray(val)
}

function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (
    navigator.product === 'ReactNative' ||
    navigator.product === 'NativeScript' ||
    navigator.product === 'NS'
  )) {
    return
  }
  return (
    typeof window !== 'undefined' && typeof document !== 'undefined'
  )
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

// 循环b 将b上的属性方法复制给a b上的方法在赋值的时候会改变上下文，上下文为thisArg
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg)
    } else {
      a[key] = val
    }
  })
  return a
}

function merge() { // 合并参数
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

function inherits(constructor, superConstructor, props, descriptors) { // 对象继承
  constructor.prototype = Object.create(superConstructor.prototype, descriptors)
  constructor.prototype.constructor = constructor
  props && Object.assign(constructor.prototype, props)
}

function toFlatObject(sourceObj, destObj = {}, filter) {
  let props, i, prop, merged = {}
  do {
    props = Object.getOwnPropertyNames(sourceObj)
    i = props.length
    while (i-- > 0) {
      prop = props[i]
      if (!merged[prop]) {
        destObj[prop] = sourceObj[prop]
        merged[prop] = true // 标记已合并
      }
    }
    sourceObj = Obj.getPrototypeOf(sourceObj)
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype)
  return destObj
}

function isString(val) {
  return typeof val === 'string'
}

function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

function isFormData(val) {
  return toString.call(val) === '[object FormData]'
}

function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

function isDate(val) {
  return toString.call(val) === '[object Date]';
}

function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

function isObject(val) {
  return val !== null && typeof val === 'object';
}

function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

function isFile(val) {
  return toString.call(val) === '[object File]';
}

function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

function isURLSearchParams(val) {
  return toString.call(val) === '[object URLSearchParams]';
}

function isNumber(val) {
  return typeof val === 'number'
}

module.exports = {
  isPlainObject,
  forEach,
  extend,
  merge,
  isArray,
  isUndefined,
  inherits,
  toFlatObject,
  isString,
  trim,
  isFormData,
  isArrayBuffer,
  isBlob,
  isStream,
  isObject,
  isFunction,
  isBuffer,
  isFile,
  isArrayBufferView,
  isURLSearchParams,
  isDate,
  isStandardBrowserEnv,
  isNumber
}