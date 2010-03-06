//
// onRequest handler
//
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse){
    server[request.name](request, sender, sendResponse);
  }
)

//
// server object
//
var server = {
  test: function(request, sender, sendResponse){
    var ctx = $("iframe#canvas_frame")[0].contentDocument;
    
    $("div.GKS0I", ctx)
    .parent()
    .TB_addTag();
    
    sendResponse({});
  }
}

