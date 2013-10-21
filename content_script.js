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


function getAllAds( callback) {
	console.log('getAllAds ...');
	items = [];
	db1.getAdvertisements(function(returnObj) {
		for(var i = 0; i < returnObj.length; i++) {
			items.push(returnObj[i]);
		}
		callback(items);
	});
}

db1.openDb(initAngular);

//angular init
function initAngular() {
	console.log("initAngular ...");
	var listApp = angular.module('listApp', []);
	listApp.factory("listService", function(){
		return {
			getList : getAllAds
		};
	});
	listApp.controller("ListCtrl", ["$scope", "listService", function($scope, listService) {
			$scope.name = "hello name";
			listService.getList(function(items){
				console.log("anony...", items);
				$scope.list = items;
				console.log($scope);
			});
		}]);

	var body = $("body");
	$.get(chrome.extension.getURL("window.html"), function(html) {
		$(".body").prepend(html);
		angular.bootstrap(document.body, ['listApp']);
	});
}









/*
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



chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log("sup : " + request.type);
		
		if(request.type === "ad_info") {
			sendAdInfo();
		}
		sendResponse('Found!');
	});

*/
