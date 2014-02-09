describe("Server backend", function() {



	describe("when an item is requested", function() {
		describe("when the item request is valid", function() {

			it("should have the index requested", function() {

				var request = {};
				request.key = "adObject";
				request.index = 0;
				request.method = "getItem";
				request.callback = function(item) {
					console.log("im in jasmine test func callback");
					expect(request.index == item.index);
				};
				getItem(request, mockChromeGetItem);

			});
		});		
		describe("when an item request is invalid", function() {
			describe("when all fields are null", function() {

				it("should return false and print problems to the console", function() {
					var request = {};
					result = getItem(request, mockChromeGetItem);
					console.log("problems", result.problems.length);
					console.log("compare",result.problems.length === 3);
					expect((result.problems.length > 3) === true);
				});
			});



		});
	});

	describe("when an item is saved", function() {
		describe("when the request is valid", function() {
			it("should be retrievable", function() {
				var request = {};
				request.method = "setItem";
				request.item = {};
				request.item.key = "adObject";
				request.item.url = "hello";
				setItem(request, mockChromeSetItem);
				items = mockGetAllItems();
				expect(items[items.length -1].url === "hello");
			});
		});
	})
	
});