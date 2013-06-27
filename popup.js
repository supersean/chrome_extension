document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('button').addEventListener('click', clickHandler);
});

function clickHandler(e) {
  displayDate(saveURL());
  storeURL(saveURL());
}

function saveURL() {
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
    var url1 = tabs[0].url;
    displayDate(url1);
  });
}

function storeURL(url, count) {
  var count = getCount();
  console.log("count is " + count);
}

function getCount() {
  var num;
  chrome.storage.sync.get('count', function(items) {
    if(typeof items.count === 'undefined') {
      num = 0;
    } else { 
      num = items.count;
    }
    console.log("num in func is " + num);
  });
  console.log("num is " + num);
  return num;
}

function displayDate(string) {
  document.getElementById("demo").innerHTML = string;
}
