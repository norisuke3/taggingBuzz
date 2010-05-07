if($("div#contents div.notice").length == 1){
  chrome.extension.sendRequest({
    name       : "synchronize"
  }, function(){});
}


