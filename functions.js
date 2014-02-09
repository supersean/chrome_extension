function getItem(itemInformation, db) {
	itemIsValid = validateItem(itemInformation);
	result = {};
	if(itemIsValid.result) {
		db.getItem(itemInformation);
		result.result = true;
		return result;
	} else {
		for(var i = 0; i < itemIsValid.problems.length; i++) {
			console.log(itemIsValid.problems[i]);
		}
		result.result = false;
		result.problems = itemIsValid.problems;
		return result;
	}
}

function setItem(item, db) {
	
	saveMethod(item, saveMethod);
}

 // chrome functions

 function chromeGetItem(item, callback) {
 	chrome.runtime.sendMessage({method:"getItem", key:item.key, index:item.index}, function(item) {
 		callback(item);
 	});
 }

 function chromeSetItem(key, value) {
 	chrome.runtime.sendMessage({method:"setItem", key:key, value:value}, function(received) {
 		if(received) {
 			console.log("saved successfully");
 		}
 	});
 }

//classes

function AdObject() {

}

 //helper functions

 function validateItem(item) {
 	var returnItem = {};
 	returnItem.problems = [];
 	returnItem.result = true;
 	if(item.method == "getItem") {
 		if(item.key != "adObject") {
 			returnItem.problems.push("item.key does not equals 'adObject'");
 		}
 		itemIsNumber = ((typeof item.index !== 'number') || (item.index % 1 !== 0)) ? false : true;
 		if(!itemIsNumber) {
 			returnItem.problems.push("item.index is not a number");
 		}
 		if(typeof(item.callback) != "function") {
 			returnItem.problems.push("item.callback is not a function");
 		}
 	} else if (item.method == "setItem") {
 		if(item.item == null) {
 			returnItem.problems.push("item.item must be an adObject");
 		}
 	} else {
 		returnItem.problems.push("item.method is not set correctly");
 	}
 	if(returnItem.problems.length > 0) {
 		returnItem.result = false;
 	}
 	return returnItem;
 }