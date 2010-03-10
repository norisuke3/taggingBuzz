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
  initialize: function(request, sender, sendResponse){
    var tab = sender.tab;
    var files = [
      "jquery-1.4.2.min.js", 
      "lib.js", 
      "jquery.initTagData.js", 
      "jquery.initTagUI.js"
    ];
    
    files.forEach(function(file){
      chrome.tabs.executeScript( tab.id, { file: file } );
    });
    
    sendResponse({});
  },
  
  register: function(request, sender, sendResponse){
    var data = JSON.parse(request.tagInfo);
    
    // register tags with a permalink as a key
    localStorage.setItem(data.permalink, JSON.stringify(data.tags));
    
    // register a permalink with a tag as a key
    data.tags.forEach(function(tag){
      var plinks = localStorage.getItem(tag);
		     
      plinks = plinks ? JSON.stringify(JSON.parse(plinks).concat(data.permalink).uniq())
		      : JSON.stringify([data.permalink]);
			
      localStorage.setItem(tag, plinks);
    });
    
    // add the tags to a tag_list
    var tag_list = localStorage.getItem("tag_list");
    
    tag_list = tag_list || "[]";
    tag_list = JSON.parse(tag_list).concat(data.tags).uniq();
    
    localStorage.setItem("tag_list", JSON.stringify(tag_list));
    
    sendResponse({});
  },
  
  queryTags: function(request, sender, sendResponse){
    var tags = localStorage.getItem(request.permalink);
    tags = tags || "[]";
    
    sendResponse({tags: JSON.parse(tags)});
  }
}