function storeURL(url) {
  var pot_keys = url.split('/');
	pot_keys = pot_keys.filter( function(str) { return str !== ""; } );
	var key_to_set = pot_keys[pot_keys.length-1];
	localStorage.setItem(key_to_set,url);
}
function clickHandler(e) {
	chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
		var url1 = tabs[0].url;
		storeURL(url1);
		refresh_urls();
	});
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#but').addEventListener('click', clickHandler);
  refresh_urls();
});


function urlClickHandler(e) {
	chrome.tabs.create({ url: e.toElement.href }); 
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
	localStorage.removeItem(localStorage.key(id));
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
							"<div class='table-cel-div'>" + "<a id='url"+id+"' href='"+url+"'>" + url + "</a></div>" +
					 "</div>";
	return return_str;
}

// attempt at message passing
	chrome.extension.onMessage.addListener(
		function(request, sender, sendResponse) {
			alert(request);
			
			sendResponse('Found!');
		}
	);
