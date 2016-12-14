import util from './util';

const {getParamNames, cachify, isGenerator} = util;

const fnBind = Function.prototype.bind;

export default class Injector {
	constructor(){
		this.modules = [];
	}

	service(name, value){
		const isFunction = typeof value === 'function';
		this.modules[name] = isFunction ? {
			value: cachify((ctx)=>{
				this._loading = this._loading || {};
				if (this._loading[name]) throw new Error('circular dependencies found for ' + name);
				this._loading[name] = true;
				let ret;
				try{
					ret = this.invoke(value, ctx);
				}catch(e){
					return Promise.reject(e);
				}
				this._loading[name] = false;
				return ret;
			})
		} : {
			value: ()=>value
		};
	}

	invoke(dependencies, func, ctx){
		if(typeof dependencies === 'function'){
			ctx = func;
			func = dependencies;
			dependencies = [];
		}
		
		let actualParams;
		
		const params = getParamNames(func);
		
		try{
			actualParams = params.map((param, idx)=>this.get(dependencies[idx] || param, ctx));
		}catch(e){
			return Promise.reject(e);
		}
		
		return Promise.all(actualParams)
			.then(args=>{
				args.unshift(ctx);
				return (isGenerator(func) || !func.prototype) ? func.apply(ctx, args) : new (fnBind.apply(func, args));
			}, console.error);
	}

	get(name, ctx) {
        const module = this.modules[name];
        if (!module) throw new Error(name + ' is not found!');
        return Promise.resolve(module.value(ctx));
    }

}

