var browser = new function() {
	this.name = "chrome",
	this.openNewTab = function(url) {
		chrome.tabs.create({ url: url });
	}
};



//indexed db stuff

(function() {
	
	var db;
	
	var current_view_pub_key;
	
	const DB_NAME = "mydb";
	const DB_VERSION = 1;
	const DB_STORE_NAME = "advertisements";
	
	function openDb() {
		console.log("openDb ...");
		var req = indexedDB.open(DB_NAME,DB_VERSION);
		req.onsuccess = function(evt) {
			db = this.result;
			console.log("openDb DONE");
			setUpGui();
		};
		req.onerror = function (evt) {
			console.error("openDb:", evt.target.errorCode);
		};
		req.onupgradeneeded = function(evt) {
			console.log("openDb.onupgradeneeded");
			var store = evt.currentTarget.result.createObjectStore(
				DB_STORE_NAME, { keyPath: 'id', autoIncrement: true});
			
			store.createIndex("ad_url","ad_url", { unique: true });
			store.createIndex("date_added","date_added", { unique: false });
			store.createIndex("ad_title","ad_title", { unique: false});
			store.createIndex("ad_body","ad_body", {unique: false});
		};
	}
	
	function getObjectStore(store_name, mode) {
		var tx = db.transaction(store_name, mode);
		return tx.objectStore(store_name);
	}
	
	function clearObjectStore(store_name) {
		var store = getObjectStore(DB_STORE_NAME, 'readwrite');
		var req = store.clear();
		req.onsuccess = function(evt) {
			displayActionSuccess("Store cleared");
			displayPubList(store);
		};
		req.onerror = function(evt) {
			console.error("clearObjectStore: ", evt.target.errorCode);
			displayActionFailure(this.error);
		};
	}

	function addAdvertisement(advertisement) {
		console.log("addAdvertisement arguments: ", arguments);
		var obj = { ad_url: advertisement.posting_url, 
					date_added: new Date().getDate(),
					ad_title: advertisement.posting_title,
					ad_body: advertisement.posting_body
					};
		var store = getObjectStore(DB_STORE_NAME, 'readwrite');
		var req;
		try {
			req = store.add(obj);
		} catch (e) {
			throw e;
		}
		req.onsuccess = function(evt) {
			console.log("Insertion in DB successful");
			//displayActionSuccess();
			//displayPubList(store);
		};
		req.onerror = function() {
			console.error("addAdvertisement error", this.error);
			//displayActionFailure(this.error);
		};
	}
	function displayAllAds() {
		console.log("displayAllAds");
		
		var ad_list = $("#stored-urls");
		ad_list.empty();
		
		var store = getObjectStore(DB_STORE_NAME, 'readwrite');
		var req;
		var i = 0;
		
		req = store.openCursor();	
		req.onerror = function(evt) {
			console.error("add error", this.error);
		};
		req.onsuccess = function(evt) {
			var cursor = evt.target.result;
			
			if(cursor) {
				console.log("displayAllAds: ",cursor);
				req = store.get(cursor.key);
				req.onsuccess = function(evt) {
					var value = evt.target.result;
					var list_item = "<li><img  key='" + cursor.key + "' id='img"+ i +"' src='x.png'/>[" + cursor.key + "] " + 
									"<div id='url"+ i +"' key='" + cursor.key + "'>" + value.ad_title + "</div></li>";
					i++;
					ad_list.append(list_item);
				};
				cursor.continue();
			} else {
				console.log("No more entries");
				addEventListeners();
			}
		};
	}
	function openAdInNewTab(mouseEvent) {
		console.log("openAdInNewTab",mouseEvent);
		var div = mouseEvent.toElement;
		var id = parseInt(div.getAttribute("key"));
		var store = getObjectStore(DB_STORE_NAME, 'readwrite');
		var req;
		req = store.get(id);
		req.onsuccess = function(evt) {
			var record = evt.target.result;
			console.log("record: ", record);
			if(typeof record === 'undefined') {
				console.log("no matching record found");
				return;
			}
			var url = record.ad_url;
			console.log(browser);
			browser.openNewTab(url);
		}
		req.onerror = function(evt) {
			console.log("openAdInNewTab error:", evt);
		}
	}
	function deleteAdvertisement(mouseEvent) {
		console.log("deleteAdvertisement",mouseEvent);
		var img = mouseEvent.toElement;
		var id = parseInt(img.getAttribute("key"));
		
		var store = getObjectStore(DB_STORE_NAME, 'readwrite');
		var req;
		req = store.get(id);
		req.onsuccess = function(evt) {
			var record = evt.target.result;
			console.log("record: ", record);
			if (typeof record === 'undefined') {
				console.log("no matching record found");
				return;
			}
			req = store.delete(id);
			req.onsuccess = function(evt) {
				console.log("evt: ", evt);
				console.log("evt.target:", evt.target);
				console.log("evt.target.result:", evt.target.result);
				console.log("delete successful");
				refreshAdvertisements();
			};
			req.onerror = function(evt) {
				console.error("deleteAdvertisement:", evt.target.errorCode);
			};
		};
		req.onerror = function(evt) {
		console.log("yoyoyo");
			console.error("deleteAdvertisement1: ", evt.target.errorCode);
		};
		console.log(req);
	}
	function refreshAdvertisements() {
		displayAllAds();
	}
	
	function addClickHandler(mouse_event) {
		var tabid = parseInt(localStorage.getItem("last-active-id"));
		chrome.tabs.sendMessage(tabid, { type : "ad-info" }, function(response) {
			console.log("response is back");
		});
	}
	function setUpGui() {
		refreshAdvertisements();
	}
	function addDeleteListeners() {
		console.log("addDeleteListeners ...");
		var store = getObjectStore(DB_STORE_NAME, 'readwrite');
		var req;
		
		req = store.count();
		req.onsuccess = function(evt) {
			for(var i=0; i < evt.target.result; i++) {
				document.querySelector('#img'+i).addEventListener('click',deleteAdvertisement);
			}
		}
		req.onerror = function(evt) {
			console.log("addDeleteListeners: error" + evt);
		}
	}
	function addAdvertisementListeners() {
		console.log("addAdvertisementListeners ...");
		var store = getObjectStore(DB_STORE_NAME, 'readwrite');
		var req;
		
		req = store.count();
		req.onsuccess = function(evt) {
			for(var i = 0; i < evt.target.result; i++) {
				document.querySelector("#url"+i).addEventListener('click',openAdInNewTab);
			}
		}
		req.onerror = function(evt) {
			console.log("addAdvertisementListeners: error" + evt);
		}
	}
	function addBrowserListeners() {
		console.log("addBrowserListeners ...");
		chrome.extension.onMessage.addListener(
			function(request, sender, sendResponse) {
				console.log("sup : " + request);
				for(var p in request.obj) {
					console.log(p + " : " + request.obj[p]);		
				}		
				var message = request.obj;
				if(message.type === "ad_info") {
					addAdvertisement(message);
					refreshAdvertisements();
				}
		
				sendResponse('Found!');
		});
	}
	function addEventListeners() {
		console.log("addEventListeners ...");
		document.querySelector('#but').addEventListener('click', addClickHandler);
		addDeleteListeners();
		addAdvertisementListeners();
		addBrowserListeners();
		
		
		
	}
	
	openDb();
	
})();





// attempt at message passing
