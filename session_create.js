var auth_token = $("div#auth_token").text();

// initialize profile id
chrome.extension.sendRequest({
  name       : "initialize_session",
  auth_token : auth_token
}, function(){
  var time = 4;
  
  $("div#message1").hide();
  $("div#message2").show();
  
  $.timer(1000, function(timer){
    if( time == 0 ){
      timer.stop();
      chrome.extension.sendRequest({
	name: "close_tab"
      }, function(){});
      
    } else {
      var info = "This tab will be automatically closed in " + time-- + " seconds.";
      $("div#close_info").text(info);
    }
  });
});
