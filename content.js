chrome.extension.sendRequest({
  name   : "initialize" 
}, function(){
  setInterval(function(){
    var ctx = $("iframe#canvas_frame")[0].contentDocument;
    
    $("div.GKS0I", ctx)
      .parent()
      .TB_initTagUI();
  }, 500);
});
