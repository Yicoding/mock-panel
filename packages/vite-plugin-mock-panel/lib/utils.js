var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils.ts
var utils_exports = {};
__export(utils_exports, {
  is: () => is,
  isAbsPath: () => isAbsPath,
  isArray: () => isArray,
  isFunction: () => isFunction,
  isRegExp: () => isRegExp,
  sleep: () => sleep
});
module.exports = __toCommonJS(utils_exports);
var toString = Object.prototype.toString;
function is(val, type) {
  return toString.call(val) === `[object ${type}]`;
}
function isFunction(val) {
  return is(val, "Function") || is(val, "AsyncFunction");
}
function isArray(val) {
  return val && Array.isArray(val);
}
function isRegExp(val) {
  return is(val, "RegExp");
}
function isAbsPath(path) {
  if (!path) {
    return false;
  }
  if (/^([a-zA-Z]:\\|\\\\|(?:\/|\uFF0F){2,})/.test(path)) {
    return true;
  }
  return /^\/[^/]/.test(path);
}
function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, time);
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  is,
  isAbsPath,
  isArray,
  isFunction,
  isRegExp,
  sleep
});
