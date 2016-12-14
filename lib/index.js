'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getParamNames = _util2.default.getParamNames,
    cachify = _util2.default.cachify,
    isGenerator = _util2.default.isGenerator;


var fnBind = Function.prototype.bind;

var Injector = function () {
	function Injector() {
		_classCallCheck(this, Injector);

		this.modules = [];
	}

	_createClass(Injector, [{
		key: 'service',
		value: function service(name, _value) {
			var _this = this;

			var isFunction = typeof _value === 'function';
			this.modules[name] = isFunction ? {
				value: cachify(function (ctx) {
					_this._loading = _this._loading || {};
					if (_this._loading[name]) throw new Error('circular dependencies found for ' + name);
					_this._loading[name] = true;
					var ret = void 0;
					try {
						ret = _this.invoke(_value, ctx);
					} catch (e) {
						return Promise.reject(e);
					}
					_this._loading[name] = false;
					return ret;
				})
			} : {
				value: function value() {
					return _value;
				}
			};
		}
	}, {
		key: 'invoke',
		value: function invoke(dependencies, func, ctx) {
			var _this2 = this;

			if (typeof dependencies === 'function') {
				ctx = func;
				func = dependencies;
				dependencies = [];
			}

			var actualParams = void 0;

			var params = getParamNames(func);

			try {
				actualParams = params.map(function (param, idx) {
					return _this2.get(dependencies[idx] || param, ctx);
				});
			} catch (e) {
				return Promise.reject(e);
			}

			return Promise.all(actualParams).then(function (args) {
				args.unshift(ctx);
				return isGenerator(func) || !func.prototype ? func.apply(ctx, args) : new (fnBind.apply(func, args))();
			}, console.error);
		}
	}, {
		key: 'get',
		value: function get(name, ctx) {
			var module = this.modules[name];
			if (!module) throw new Error(name + ' is not found!');
			return Promise.resolve(module.value(ctx));
		}
	}]);

	return Injector;
}();

exports.default = Injector;
