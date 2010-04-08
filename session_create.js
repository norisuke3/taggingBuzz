var auth_token = $("div#auth_token").text();

// initialize profile id
chrome.extension.sendRequest({
  name       : "initialize_session",
  auth_token : auth_token
}, function(){});
