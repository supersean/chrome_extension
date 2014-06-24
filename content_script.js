$(document).ready(function() {
	initPage();
});
var CONST_KEY_AD_OBJECT = "adObject";
var CONST_KEY_AD_OBJECTS = "adObjects";
var CONST_KEY_SET_ITEM = "setItem";
var CONST_KEY_GET_ITEM = "getItem";
var CONST_KEY_CLEAR = "clear";

var listApp;

function initPage() {

	var body = $("body");
	var pageSource = $('#pagecontainer').html();
	//$('#pagecontainer').empty();
	
	$.get(chrome.extension.getURL("navbar.html"), function(navbar_html) {
		$(navbar_html).prependTo("#pagecontainer");
		$.get(chrome.extension.getURL("craigs.html"), function(craigs_html) {
			$(craigs_html).prependTo(".body");
			$.get(chrome.extension.getURL("list_container.html"), function(list_container_html) {
				$(list_container_html).prependTo(".body");
				$.get(chrome.extension.getURL("list.html"), function(list_html) {
					$(list_html).prependTo("#list_container");
					$(".body").attr("class", $(".body").attr("class") + " row");
					$(".body .userbody").prependTo("#craigs_container");
					$(".body .postingtitle").prependTo("#craigs_container");
					$(".body .dateReplyBar").prependTo("#craigs_container");
					$("#container").prependTo("#craigs_container");
					$(".blurbs").prependTo("#craigs_container");
					$("#floater").prependTo("#craigs_container");
					$("#toc_rows").prependTo("#craigs_container");
					$(".favlistinfo").prependTo("#craigs_container");
					$("#pagecontainer").attr('ng-app','listApp');
					$("#pagecontainer").attr('ng-controller','ListCtrl');
					angular.bootstrap(document.body, ['listApp']);
				});
			});
		});
	});
	
/*
	$.get(chrome.extension.getURL("seans.html"), function(html5) {
		$(html5).prependTo('#pagecontainer');
		$.get(chrome.extension.getURL("craigs.html"), function(html) {
			$(html).prependTo('#seans_container');
			$.get(chrome.extension.getURL("list_container.html"), function(html2) {
				$(html2).prependTo('#seans_container');
				$.get(chrome.extension.getURL("navbar.html"), function(html4) {
					$(html4).prependTo('#pagecontainer');
					$.get(chrome.extension.getURL("list.html"), function(html3) {
						$(html3).prependTo('#list_container');
						$('.body').prependTo('#craigs_container');
						$('#pagecontainer').attr('ng-app','listApp');
						$('#pagecontainer').attr('ng-controller','ListCtrl');
						angular.bootstrap(document.body, ['listApp']);
					});
				});
			});
		});
	});
	*/
	initAngular();
}

function getItem(object) {
	
	chrome.runtime.sendMessage({method:"getItem", itemInformation:object}, function(received){
		if(received) {
			console.log("getItem message received");
		}
	});	
}

function setItem(key, value, callback) {
	chrome.runtime.sendMessage({method:"setItem",key:key, value:value}, function(received) {
		if(received) {
			console.log(" saved successfully"); 
		} else {
			console.log("error saving item");
		}
	});
}

function initAngular() {
	console.log("initAngular ...");
	listApp = angular.module('listApp', []);
	listApp.controller("ListCtrl", ["$scope", "$location", "$window", "$q", function($scope, $location, $window, $q) {
		$scope.name = "hello name";
		$scope.list = [];
		$scope.showingList = false;

		$scope.listener = chrome.extension.onMessage.addListener(
			function(request, sender, sendResponse) {
				console.log("onMessage ...", request);
				if(request.responseKey == "refreshItems") { 
					$scope.list = [];
					
					for(var i = 0; i < request.value.length; i++) { // need to clear items first
						$scope.list.push(request.value[i]);
					}
					console.log('list:',$scope.list);
					$scope.$apply();
				}
		});
		
		$scope.refreshItems = function() {
		/*	var object = {
				key: CONST_KEY_AD_OBJECTS,
				responseKey: "itemsToRefresh"
			}
			getItem(object);*/
		}
		
		$scope.setItem = function(key) {
			var object = { key : key };
			var objectValidated;
			if(key == "adObject") {
				objectValidated = setAdObjectValues(object);	
			} else {
				objectValidated = false;
			}
			console.log("object is", object);
			object.responseKey = 'refreshItems';
			if(objectValidated) {
				setItem(CONST_KEY_AD_OBJECT, object, $scope.refreshItems);
			} else {
				console.log("object was not validated");
			}
		}

		$scope.getItem = function(key) {
			console.log("getItem item is ", key);
			var object = {};
			object.key = "adObjects";
			object.responseKey = "refreshItems";
			getItem(object);
		}

		$scope.clearAds = function() {
			console.log("Clearing ads...");
			chrome.runtime.sendMessage({method:CONST_KEY_CLEAR}, function(received) {
				if(received) {
					console.log("clear request received");
				}
			});
		}
		
		$scope.seans_row_clicked = function(url) {
			console.log("url:",url);
			$window.location.href = url;
			$window.location.reload();
		}
		
		$scope.toggleList = function() {
			sendRefreshRequest();
			$scope.showingList = !$scope.showingList;
		}

	}]);
}

function sendRefreshRequest() {
	var request = {};
	request.key = CONST_KEY_AD_OBJECTS;
	request.responseKey = "refreshItems";
	getItem(request);
}

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

