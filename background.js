
function getActiveURL() {
	return chrome.tabs.getCurrent(function callback() {
		
	});
}

this.poop = "poo";

chrome.tabs.onActivated.addListener(function(activeInfo) {	
	chrome.tabs.get(activeInfo.tabId, function(tab) {
		localStorage.setItem("last-active-url",tab.url);
	});
});
