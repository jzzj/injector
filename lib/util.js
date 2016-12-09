'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getParamNames;
var COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/g;
function getParamNames(func) {
  var code = func.toString().replace(COMMENTS, '');
  var result = code.slice(code.indexOf('(') + 1, code.indexOf(')')).match(/([^\s,]+)/g);

  return result === null ? [] : result;
}
