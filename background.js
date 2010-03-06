chrome.browserAction.onClicked.addListener(function(tab){
  chrome.tabs.executeScript(
    tab.id, 
    {file: "Jquery1.4.1/jquery.min.js" }
  );

  chrome.tabs.executeScript(
    tab.id, 
    {file: "jquery.initTagData.js" }
  );

  chrome.tabs.executeScript(
    tab.id, 
    {file: "jquery.initTagUI.js" },
    function(){
      chrome.tabs.sendRequest(tab.id, { name: "test" });
    }
  );
});

//
// onRequest handler
//
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse){
    if(sender.tab){
      server[request.name](request, sender, sendResponse);
  }
});

//
// server object
//
var server = {
  register: function(request, sender, sendResponse){
    console.log(request.tagInfo);
    localStorage.tagInfo = request.tagInfo;
    sendResponse({});
  }
}