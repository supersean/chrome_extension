
$.get(chrome.extension.getURL("constants/db_constants.js"), function(html) {
	//Assuming your host supports both http and https
	console.log(html);
	var script = document.createElement('script');
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", chrome.extension.getURL("constants/db_constants.js"));
	var head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;
	head.insertBefore(script, head.firstChild);
	initPage();
});	


function initPage() {

	var body = $("body");
	$.get(chrome.extension.getURL("window.html"), function(html) {
		$(html).prependTo('#pagecontainer');
		$.get(chrome.extension.getURL("navbar.html"), function(html2) {
			$(html2).prependTo('#pagecontainer');
			$.get(chrome.extension.getURL("list.html"), function(html3) {
				$(html3).prependTo('#pagecontainer');
				$('.body').prependTo('#seans_container');
				$('#pagecontainer').attr('ng-app','listApp');
				$('#pagecontainer').attr('ng-controller','ListCtrl');
				angular.bootstrap(document.body, ['listApp']);
			});
		});
	});
	console.log(CONST_KEY_AD_OBJECT);
	initAngular();

}

function getItem(key, callback) {
	chrome.runtime.sendMessage({method:"getItem", key:key}, function(item) {
		callback(item);
	});	
}

function setItem(key, value) {
	console.log("content_script : setItem...",key, value)
	chrome.runtime.sendMessage({method:"setItem",key:key, value:value}, function(received) {
		if(received) {
			console.log(" saved successfully"); 
		}
	});
}

function initAngular() {
	console.log("initAngular ...");
	var listApp = angular.module('listApp', []);
	listApp.controller("ListCtrl", ["$scope", "$q", function($scope, $q) {
		$scope.name = "hello name";
		$scope.list = [];
		$scope.showingList = false;

		$scope.setItem = function(key) {
			var object = { key : key };
			var objectValidated;
			if(key == "adObject") {
				objectValidated = setAdObjectValues(object);	
			} else {
				objectValidated = false;
			}
			console.log("object is", object);
			if(objectValidated) {
				setItem(CONST_KEY_AD_OBJECT, object);
			} else {
				console.log("object was not validated");
			}
		}

		$scope.getItem = function(key) {
			console.log("getItem item is ", key);
			var object;
			object.key = key;
			object.index = 0;
			object.callback = function(){ console.log("in object.callback")};
			getItem(object, function() {
				console.log("back from getItem");
			});
		}

		$scope.showList = function() {
			$scope.showingList = !$scope.showingList;
		}

	}]);
}
/*

		var defer = $q.defer();

		var getList = function() {
			db1.getAdvertisements(function(returnObj){
				items = [];
				for(var i = 0; i < returnObj.length; i++) {
					items.push(returnObj[i]);
				}
				defer.resolve(items);
				$scope.$apply();
			});
			return defer.promise;
		}
		var promise = getList().then(function(items) {
				$scope.list = items;
			})
			
	}]);
*/
function setAdObjectValues(object) {
	object.posting_title = $(".postingtitle").text();
	object.posting_body = $("#postingbody").text();
	object.posting_url = document.URL;
	object.type = "ad_info";
	object.image_src = $("#ci img").attr("src");

	if(object.posting_body == ""
		|| object.posting_body == undefined
		|| object.posting_title == ""
		|| object.posting_title == undefined) {
		return false;
	}

	return true;
}


chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log("onMessage ...", request);
			
	});

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
		type : "ad_info",
		image_src : $("#ci img").attr("src")
	};
	console.log("obj", obj);
	browser.sendMessage(obj);
};


/*
var body = $("body");
$.get(chrome.extension.getURL("window.html"), function(html) {
	console.log("hello html is ", html);
	$(".body").prepend(html);


var browser = new function() {
	this.name = "chrome",
	this.openNewTab = function(url) {
		chrome.tabs.create({ url: url });
	}
};





var db1 = new function() {

	this.db;

	var self = this;

	var current_view_pub_key;

	const DB_NAME = "mydb";
	const DB_VERSION = 2;
	const DB_STORE_NAME = "advertisements";
	const ADVERTISEMENT_STORE_NAME = "advertisements";

	this.openDb = function(callback) {
		console.log("openDb ...");
		var req = indexedDB.open(DB_NAME, DB_VERSION);
		req.onsuccess = function(evt) {
			db = this.result;
			console.log("openDb DONE");
			callback();
		};
		req.onerror = function(evt) {
			console.error("openDb:", evt);
		};
		req.onupgradeneeded = function(evt) {
			console.log("openDb.onupgradeneeded");
			try {
				evt.currentTarget.result.deleteObjectStore(DB_STORE_NAME);
			} catch (exception) {
				console.log("DB STORE not found.");
			}
			var store = evt.currentTarget.result.createObjectStore(
				DB_STORE_NAME, { keyPath: "id", autoIncrement: true});

		};
	};

	this.getObjectStore = function(store_name, mode) {
		console.log("getObjectStore ...");
		var tx = db.transaction(store_name, mode);
		console.log("tx is",tx);
		return tx.objectStore(store_name);
	}

	this.getAdvertisements = function(callback) {
		console.log("getAdvertisements ...");
		var store = this.getObjectStore(ADVERTISEMENT_STORE_NAME, 'readwrite');
		var req = store.openCursor();
		var returnObj = [];
		req.onerror = function(evt) {
			console.error("getAdvertisements error", this.error);
		};
		req.onsuccess = function(evt) {
			var cursor = evt.target.result;
			console.log("cursor is", cursor);
			if(cursor) {
				returnObj.push(cursor.value);
				cursor.continue();
			} else {
				callback(returnObj);
			}
		};
	}

	this.clearObjectStore = function(store_name) {
		var store = getObjectStore(DB_STORE_NAME, 'readwrite');
		var req = store.clear();
		req.onsuccess = function(evt) {
			displayActionSuccess("Store cleared");
			displayPubList(store);
		};
		req.onerror = function(evt) {
			console.error("clearObjectStore: ", evt.target.errorCode);
			displayActionFailure(this.error);
		}
	}

	///======= 

	this.test = function(callback) {
		callback();
	}


};


*/
