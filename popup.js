
var popoutURL = chrome.extension.getURL("window.html");
var createWindow = true;
chrome.windows.getAll( { "populate" : true }, function(windows) {
	var windowID;
	for(var i = 0; i < windows.length; i++)  {
		for(var j = 0; j < windows[i].tabs.length; j++) {
			console.log(popoutURL + " === " + windows[i].tabs[j].url);
			if(windows[i].tabs[j].url === popoutURL) {
				createWindow = false;
				windowID = windows[i].id;

			}
		}
	}
	if(createWindow) {
		chrome.windows.create( {
								"url" : chrome.extension.getURL("window.html"),
								"height" : 654,
								"width" : 484,
								"type" : "popup",
								"focused" : true
								});
	} else { 
		chrome.windows.update( windowID , { "focused" : true } );
	}
});
