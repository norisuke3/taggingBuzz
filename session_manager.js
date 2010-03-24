var auth_token = $("div#auth_token").text();

// initialize profile id
chrome.extension.sendRequest({
  name       : "init_profile_id"
}, function(res){
  $.post(
    "http://localhost:3000/session/activate_session", {
      gid: res.gid,
      authenticity_token: auth_token 
    },function(data){
      console.log(data);
    }
  );
});