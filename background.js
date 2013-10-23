
this.poop = "poo";

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log("request is ", request);
		if(request.method == "getItem") {
			if(request.key == "url") {
				chrome.storage.sync.get("url", function(items) {
					console.log("items is ", items);
					sendResponse(items);
				});
			}
		} else if (request.method == "setItem") {
			if(request.key == "url") {
				chrome.storage.sync.set({"url": request.value}, function() {
					console.log("item saved");
					sendResponse(true);
				});
			}
		}
		return true;
	});
