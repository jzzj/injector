'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Injector = function () {
	function Injector() {
		_classCallCheck(this, Injector);

		this.modules = [];
		this._cache = [];
	}

	_createClass(Injector, [{
		key: 'service',
		value: function service(name, value) {
			this.modules[name] = value;
		}
	}, {
		key: 'invoke',
		value: function invoke(dependencies, func) {
			var _this = this;

			if (typeof dependencies === 'function') {
				func = dependencies;
				dependencies = [];
			}
			var fnStr = func.toString();
			var actualParams = void 0;
			if (this._cache[fnStr]) {
				actualParams = this._cache[fnStr];
			} else {
				var params = (0, _util2.default)(func);
				try {
					actualParams = params.map(function (param, idx) {
						return _this.get(dependencies[idx] || param);
					});
				} catch (e) {
					return Promise.reject(e);
				}
				//there is no limit for the string length (as long as it fits into memory)
				this._cache[fnStr] = actualParams;
			}
			return Promise.all(actualParams).then(function (args) {
				return Promise.resolve(func.apply(null, args));
			});
		}
	}, {
		key: 'get',
		value: function get(name) {
			var module = this.modules[name];
			if (!module) throw new Error(name + ' is not found!');
			return Promise.resolve(module);
		}
	}]);

	return Injector;
}();

exports.default = Injector;
