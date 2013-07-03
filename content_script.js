var browser = new function() {
  this.name = "chrome",
	this.sendMessage = function(message) {
		console.log("TESTING");
		chrome.runtime.sendMessage( { obj : message }, function(response) {
			console.log(response);
		});
	}
};

function sendAdInfo() {
	var obj = { 
		posting_title : $(".postingtitle").text(),
		posting_body : $("#postingbody").text(),
		posting_url : document.URL,
		type : "ad_info"
	};
	
	browser.sendMessage(obj);
};


chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log("sup : " + request.type);
		
		if(request.type === "ad_info") {
			sendAdInfo();
		}
		sendResponse('Found!');
	});
