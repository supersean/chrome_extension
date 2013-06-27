var ITEM_NAME = 'postingtitle';

var item_name = document.getElementsByClassName(ITEM_NAME).innerHTML;
console.log(item_name);

chrome.extension.sendMessage({"name" : "hola"}, function(res) {
  console.log(res); });
