
var popoutURL = chrome.extension.getURL("window.html");
var createWindow = true;
chrome.windows.create( {
			"url" : chrome.extension.getURL("test.html"),
			"height" : 654,
			"width" : 484,
			"type" : "popup",
			"focused" : true
});


