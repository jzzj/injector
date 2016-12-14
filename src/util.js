const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/g;

export default {
	getParamNames(func) {
		const code = func.toString().replace(COMMENTS, '');
		const result = code.slice(code.indexOf('(') + 1, code.indexOf(')'))
			.match(/([^\s,]+)/g);

		return result === null
			? []
			: result;
	},

	cachify(func, ctx){
		let cache, called=false;
		return function(...args){
			if(!called){
				cache = func.apply(ctx, args);
				called = true;
			}
			return cache;
		}
	},

	isGenerator(func){
		return 'function' == typeof func.next && 'function' == typeof func.throw;
	}
}