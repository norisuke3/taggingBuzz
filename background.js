var self = this;
var profile_url = "http://www.google.com/profiles/me";
var server_url = "http://localhost:3000/";

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
  profileId : null,
  auth_token: null,

  initialize: function(request, sender, sendResponse){
    var tab = sender.tab;
    var files = [
      "jquery.min.js", 
      "lib.js", 
      "jquery.initTagData.js", 
      "jquery.initTagUI.js"
    ];
    
    files.forEach(function(file){
      chrome.tabs.executeScript( tab.id, { file: file } );
    });
    
    sendResponse({});
  },
  
  initialize_session: function(request, sender, sendResponse){
    set_auth_token(request.auth_token);
    init_profile_id();
    
    sendResponse({});
  },
  
  register_tags: function(request, sender, sendResponse){
    var data = JSON.parse(request.tagInfo);

    localStorage.setItem(data.gId + "/" + data.buzzId, data.tags);                // key => permalink,  value => tag

    data.tags.split(', ').forEach(function(tag){
      // put a prefix '_' for every tag for not conflicting with localStorage prototype functions
      localStorage.push('_' + tag, data.gId + "/" + data.buzzId, { uniq: true }); // key => tag,        value => permalink
      localStorage.push('tag_list', tag, { uniq: true });                         // key => 'tag_list', value => tag
    });
    
    // add the tags to the server
    $.post(server_url + "tags/register", {
      gId                : data.gId,
      buzzId             : data.buzzId,
      tag_list           : data.tags,
      authenticity_token : self.server.auth_token
    }, function(res){
      console.log(res);
    });
    
    sendResponse({});
  },
  
  query_tags: function(request, sender, sendResponse){
    var tags = localStorage.getItem(request.gId + "/" + request.buzzId);
    sendResponse({tags: tags || ""});
  }
};


//
// helper functions for session management.
//
var set_auth_token = function(token){
  server.auth_token = token;
};

var init_profile_id = function(){
  $.get(profile_url, function(data){
    server.profileId = $(data).find(".proflink:first").attr("oid");

    activate_session();
  });
};

var activate_session = function(){
  $.post(
    "http://localhost:3000/session/activate", {
      profile_id        : server.profileId,
      authenticity_token: server.auth_token 
    }, function(data){}
  );
};