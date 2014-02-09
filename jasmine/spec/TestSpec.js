
describe("Backend tests", function() {

	//var l = returnHello();
	//console.log("Hi : ", l);
	it('says hello', function() {
		expect(sayHello()).toEqual("hello");
	});

});