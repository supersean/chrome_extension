
this.poop = "poo";


var CONST_KEY_AD_OBJECT = "adObject";
var CONST_KEY_AD_OBJECTS = "adObjects";
var CONST_KEY_SET_ITEM = "setItem";
var CONST_KEY_GET_ITEM = "getItem";

function checkForDiscordances() {
	console.log("checkForDiscordances...");
}

function setItem(item) {
	//possibly validate item.value
	if(item.key == CONST_KEY_AD_OBJECT) {
		chrome.storage.sync.get("adObjects", function(adObjects) {
			//check for adobjects is null
			if(adObjects.index == null) {
				adObjects.index = 0;
			} else {
				adObjects.index += 1;
			}
			if(adObjects.ads = null) {
				adObjects.ads = [];
			}
			saveAd(adObjects, item.value);
		}); 
	}
}

function saveAd(adObjects, value) {
	var adObj = {
		index: adObjects.index,
		value: value
	};
	adObjects.ads.push(adObj);
	chrome.storage.sync.set({
		adObjects: adObjects
	}, function() {
		if(chrome.runtime.lastError) {
			console.log("Error adding item to chrome storage, checking for discordances...");
			checkForDiscordances();
		} else {
			console.log("Item saved successfully");
		}
	});
}

// key: adObject to get an adObject
//			include index for this object
function getItem(itemInformation) {
	if(itemInformation.key == CONST_KEY_AD_OBJECT) {
		chrome.storage.sync.get("adObjects", function(adObjects) {
			for(var i = 0; i < adObjects.ads.length; i++) {
				if(adObjects.ads[i].index == itemInformation.index) {
					returnItem(adObjects.ads[i]);
				}	
			}
		});
	}
}

function returnItem(item) {
	console.log("returnItem...", item);	
	chrome.tabs.getCurrent(function(tab) {
		var message = {
				key: adObject,
				value: item
			}
		chrome.tabs.sendMessage(tab.id,message, function() {
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
//				request.key = adObject
//				request.value = an ad object consisting of:
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log("request is ", request);
		if(request.method == CONST_KEY_GET_ITEM) {
			getItem(request);
		} else if (request.method == CONST_KEY_SET_ITEM) {
			setItem(request);
		}
		return true;
	});

