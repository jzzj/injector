import getParamNames from './util';

export default class Injector {
	constructor(){
		this.modules = [];
		this._cache = [];
	}

	service(name, value){
		this.modules[name] = value;
	}

	invoke(dependencies, func){
		if(typeof dependencies === 'function'){
			func = dependencies;
			dependencies = [];
		}
		const fnStr = func.toString();
		let actualParams;
		if(this._cache[fnStr]){
			actualParams = this._cache[fnStr];
		}else{
			const params = getParamNames(func);
			try{
				actualParams = params.map((param, idx)=>this.get(dependencies[idx] || param));
			}catch(e){
				return Promise.reject(e);
			}
			//there is no limit for the string length (as long as it fits into memory)
			this._cache[fnStr] = actualParams;
		}
		return Promise.all(actualParams).then(args=>Promise.resolve(func.apply(null, args)));
	}

	get(name) {
        const module = this.modules[name];
        if (!module) throw new Error(name + ' is not found!');
        return Promise.resolve(module);
    }

}

