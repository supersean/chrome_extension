
function getActiveURL() {
	return chrome.tabs.getCurrent(function callback() {
		
	});
}

this.poop = "poo";

chrome.tabs.onActivated.addListener(function(activeInfo) {	
	chrome.tabs.get(activeInfo.tabId, function(tab) {
		localStorage.setItem("last-active-id",tab.id);
	});
});

chrome.windows.create( {
			"url" : chrome.extension.getURL("test.html"),
			"height" : 654,
			"width" : 484,
			"type" : "popup",
			"focused" : true
});


