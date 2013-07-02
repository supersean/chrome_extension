function storeURL(url) {
  var count = parseInt(localStorage.getItem('count'));
	console.log(typeof(count));
	if(count === 'undefined' || isNaN(count)) {
		localStorage.setItem('count',0);
		return storeURL(url);
	}
	localStorage.setItem(count+1,url);
	localStorage.setItem("count", count+1);
}
function clickHandler(e) {
	storeURL(localStorage.getItem("last-active-url"));
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#but').addEventListener('click', clickHandler);
  refresh_urls();  
});

function checkForValue(check_value) {
	for(var i = 0; i < localStorage.length; i++) {
		var key = localStorage.key(i);
		if(key !== "last-active-url") {
			if(localStorage[key] === check_value) {
				return true;
			}
		}
	}
	return false;
}

function urlClickHandler(e) {
	if(!CheckForValue(e.toElement.innerHTML)) {
		chrome.tabs.create({ url: e.toElement.innerHTML });
	}
};

function refresh_urls() {
	var length = localStorage.length;
	var url_array = [];
	for(var i = 0; i < length; i++) {
		if(localStorage.key(i) !== null) {
			url_array.push(localStorage.getItem(localStorage.key(i)));
		}
	}
	display_urls(url_array);
}

function display_urls(url_array) {
	var html_string = "";
	for(var i in url_array) {
		html_string += make_url_html_post(url_array[i],i);
	}
	repaint_html('stored-urls',html_string);
	for(var i in url_array) {
		document.getElementById("img"+i).addEventListener('click', delete_url);
	}
	for(var i in url_array) {
		document.getElementById("url"+i).addEventListener('click', urlClickHandler);
	}
}

function delete_url(mouseEvent) {
	var id = mouseEvent.toElement.id.slice(3);
	console.log(id);
	localStorage.removeItem(id);
	localStorage.setItem('count', parseInt(localStorage.getItem('count'))-1);
	refresh_urls();
}

function repaint_html(element_id, html_string) {
	document.getElementById(element_id).innerHTML = html_string;
}

function make_url_html_post(url,id) {
	var return_str = "<div class='table-div'>" +
						"<hr />" +
						"<div class='table-row-div'>" +
							"<div class='table-cel-div'><img id='img"+id+"' src='x.png' /></div>" + 
							"<div class='table-cel-div'>" + "<div id='url"+id+"'>" + url + "</div></div>" +
					 "</div>";
	return return_str;
}

// attempt at message passing
	chrome.extension.onMessage.addListener(
		function(request, sender, sendResponse) {
		alert(request.toString());
		alert(request.name);
			for(var p in request) {
				console.log(p + " : " + request[p]);
			
			}
			
			
			sendResponse('Found!');
		}
	);
