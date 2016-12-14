'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/g;

exports.default = {
	getParamNames: function getParamNames(func) {
		var code = func.toString().replace(COMMENTS, '');
		var result = code.slice(code.indexOf('(') + 1, code.indexOf(')')).match(/([^\s,]+)/g);

		return result === null ? [] : result;
	},
	cachify: function cachify(func, ctx) {
		var cache = void 0,
		    called = false;
		return function () {
			if (!called) {
				for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
					args[_key] = arguments[_key];
				}

				cache = func.apply(ctx, args);
				called = true;
			}
			return cache;
		};
	},
	isGenerator: function isGenerator(func) {
		return 'function' == typeof func.next && 'function' == typeof func.throw;
	}
};
