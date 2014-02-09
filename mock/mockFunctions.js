function fakeStorage() {
	this.adObjects = [];	
}

function fakeChromeGetItem(itemInformation) {
	var returnObj = {};
	if(itemInformation.key == "adObject") {
		returnObj = new AdObject();
		returnObj.url = "test.com";
		returnObj.image = "testImage.peeinjaypeg";
		returnObj.adBody = "testAdBody";
		returnObj.adTitle = "testAdTitle";
		returnObj.index = itemInformation.index;
		itemInformation.callback(returnObj);
	}
}

function fakeChromeSetItem(item) {

};