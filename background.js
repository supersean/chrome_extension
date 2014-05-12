
require(["constants/db_constants.js"], function(util) {
	initBackground();
});

function initBackground() {
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			console.log("request is ", request);
			console.log("method is ",request.method);
			if(request.method == CONST_KEY_GET_ITEM) {
				getItem(request.itemInformation);
			} else if (request.method == CONST_KEY_SET_ITEM) {
				setItem(request);
			} else if (request.method == CONST_KEY_CLEAR) {
				clear();
			} else {
				return false;
			}
		}
	);
}

function checkForDiscordances() {
	console.log("checkForDiscordances...");
}

function setItem(item) {
	console.log("setItem...", item);
	//possibly validate item.value
	if(item.key == CONST_KEY_AD_OBJECT) {

		chrome.storage.local.get(null, function(dbKeys) {
			//check for adobjects is null
			var adObjects = dbKeys.adObjects;
			console.log("adObjects:",adObjects);
			if(adObjects == null) {
				adObjects = {};
			}

			if(adObjects.index == null) {
				adObjects.index = 0;
			} else {
				adObjects.index += 1;
			}
			if(adObjects.ads == null) {
				adObjects.ads = [];
			}
			saveAd(adObjects, item.value);
		}); 
	} else {
		console.log("item.key not set correctly");
	}
}

function saveAd(adObjects, value) {
	console.log("saveAd...", adObjects, value);
	var adObj = {
		index: adObjects.index,
		value: value
	};
	adObjects.ads.push(adObj);
	chrome.storage.local.set({
		'adObjects': adObjects
	}, function() {
		if(chrome.runtime.lastError) {
			console.log("Error adding item to chrome storage, checking for discordances...");
			checkForDiscordances();
		} else {
			console.log("Item saved successfully");
		}
	});
}

function clear() {
	console.log("clear...");
	chrome.storage.local.set({
		'adObjects': null
	}, function() {
		if(chrome.runtime.lastError) {
			console.log('Error clearing storage...');
		} else {
			console.log("Clear successful");
		}
	});
	//need to send a refresh request
}


// key: adObject to get an adObject
//			include index for this object
function getItem(itemInformation) {
	var key = itemInformation.key;
	if(key == CONST_KEY_AD_OBJECT) {
		chrome.storage.local.get("adObjects", function(dbResult) {
		  var adObjects = dbResult.adObjects;
		  console.log("chrome.storage.local.get...", adObjects);
			for(var i = 0; i < adObjects.ads.length; i++) {
				if(adObjects.ads[i].index == itemInformation.index) {
					returnItem(adObjects[i], itemInformation.responseKey);
				}
			}
		});	
	} else if (key == CONST_KEY_AD_OBJECTS){
		chrome.storage.local.get('adObjects', function(dbResult) {
			returnItem(dbResult.adObjects.ads, itemInformation.responseKey);
		});
	}
}

function returnItem(item, responseKey) {
	console.log("returnItem...", item);	
	chrome.tabs.query({ currentWindow: true, active: true}, function(tab) {
		console.log('hello', tab);
		var message = {
				value: item,
				responseKey:responseKey
			}
		chrome.tabs.sendMessage(tab[0].id,message, function() {
			console.log("sendMessage callback ...");	
		});
	});
}

//for getting an adObject:
// 				request.method = getItem
//				request.key = adObject
//				request.index = some number
//				maybe a request.callback = some function
//for setting an adObject:
//				request.method = setItem
//				request.item.key = adObject



