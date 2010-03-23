chrome.extension.sendRequest({
  name: "get_session_key"
}, function(res){
  var session_key = res.session_key;
  var cookies = document.cookie.split("; ");
  var session = cookies.reduce(function(p, c){
    var pair = c.split("=");
    p[pair[0]] = pair[1];
    return p;
  }, {})[session_key];

  var obj = {};
  obj[session_key] = session;

  chrome.extension.sendRequest({
    name   : "register_session" ,
    session: JSON.stringify(obj)
  }, function(){});
});



