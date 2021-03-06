var Injector = require("../")
var assert = require('assert');

describe('should inject works', function() {
    var injector;
    beforeEach(function(){
        injector = Injector();
    });
    it('register a module', function(done) {
        injector.service('name', 'zhangsan');

        injector.invoke(function(name) {
            assert.equal(name, 'zhangsan');
            done();
        });
    });

    it('register 3 modules', function(done) {
        injector.service('name', 'zhangsan');
        injector.service('age', '18');
        injector.service('lover', {
        	name: "lisi",
        	age: 17
        });

        injector.invoke(["age", "name"], function(age, name, lover) {
            assert.equal(name, 'zhangsan');
            assert.equal(age, 18);
            assert.equal(lover.name, 'lisi');
            done();
        });
    });

    it('multiple dependencies found', function(done){
    	injector.service('a', 'b');
    	injector.service('C', function C(){
    		this.name = "C";
    	});
    	injector.service('Person', function Person(C){
    		this.a = 123;
    	});
    	injector.invoke(function(Person, a, C){
    		assert.equal(Person.a, '123');
    		assert.equal(C.name, 'C');
    		done();
    	})
    });
});