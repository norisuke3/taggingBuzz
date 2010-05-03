var self = this;
var profile_url = "http://www.google.com/profiles/me";
var server_url = "http://taggingbuzz.com/";
var sync_url     = server_url + "tags/snapshot";
var activate_url = server_url + "session/activate";
var logout_url   = server_url + "session/logout";
var register_url = server_url + "tags/register";

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
  loggedIn  : false,

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

    // register tags to either the server or the local sync buffer
    // depending on if it's logged in or not.
    if(self.server.loggedIn){
      $.post(register_url,
        $.extend(
	  { tagInfos : [data] }, 
	  { authenticity_token : self.server.auth_token }
	), 
	function(){}
      );
    } else {
      localStorage.push('sync_buffer', data);
    }

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
    activate_url, {
      profile_id        : server.profileId,
      authenticity_token: server.auth_token 
    }, function(data){
      server.loggedIn = true;
      synchronize();
    }
  );
};

//
// helper function to loging out from taggingBuzz server
//
var logout = function(){
  $.post(
    logout_url, {
      authenticity_token: server.auth_token 
    }, function(){
      server.loggedIn = false;
    }
  );
};


//
// Synchronize the localStorage with the server database
//
var synchronize = function(callback){
  var sync_buffer = { tagInfos: localStorage.items("sync_buffer", {type: "Array"}) };

  $.post(
    register_url,
    $.extend(sync_buffer, { authenticity_token : self.server.auth_token }),
    function(){  // call back function of $.post()
      localStorage.clear();
      
      $.get(sync_url, function(data){
        var result = ( data != "failed" );
    	  
        if (result) {
          var snapshot = JSON.parse(data);
          var buffer = new Object();
          
          snapshot.forEach(function(record){
            localStorage.push("tag_list", record.tag);
            record.paths.forEach(function(path){
      	      localStorage.push("_" + record.tag, path);
      	      buffer[path] = buffer[path] ? buffer[path].concat(record.tag)
      				          : [record.tag];
            });
          });
          
          for(var path in buffer){
            localStorage.setItem(path, buffer[path].join(", "));
          }
        }
        
        if(callback) callback(result);
      });
    }
  );
};