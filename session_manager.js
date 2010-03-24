var auth_token = $("div#auth_token").text();

// initialize profile id
chrome.extension.sendRequest({
  name       : "init_profile_id",
  auth_token : auth_token
}, function(res){});