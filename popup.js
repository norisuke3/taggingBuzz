$(function(){
  var tags = JSON.parse(localStorage.tag_list || "[]");
  var background = chrome.extension.getBackgroundPage();
  var login_status = background.server.loggedIn;

  $("div#top")
  .attach("div#links")
    .append("<a id='login'>").find("a:last")
      .attr("href", "")
      .text("Login")
      .toggle(!login_status)
      .click(open_login_page)
    .end()
    .attach("div#online")
      .append("<a id='setting'>").find("a:last")
	.attr("href", "")
	.text("Setting")
	.click(account_setting)
      .end()
      .attach("span").text(" | ").end()
      .append("<a id='logout'>").find("a:last")
	.attr("href", "")
	.text("Logout")
	.click(logout)
      .end()
      .toggle(login_status)
    .end()
  .end()
  .attach("div#header")
    .attach("div.search")   // div.search
      .text("Tag: ")
      .attach("input", [{ name: "type", value: "text" }])      // input
      .autocompleteArray(tags ,{
        autoFill: true,
        delay: 40
      })
      .focus()
      .keydown(function(evn){
        if(evn.keyCode == 13){ 
  	populate_items([$("div.search input")[0].value]);
        }
      })
    .end()
    .toggle(login_status)
  .end();
});

function open_login_page(){
  var background = chrome.extension.getBackgroundPage();
  var login = background.server_url + "session/new";

  chrome.tabs.create({ url: login });
}

function account_setting(){
  var background = chrome.extension.getBackgroundPage();
  var setting = background.server_url + "account/update";

  chrome.tabs.create({ url: setting });
}

function logout(){
  var background = chrome.extension.getBackgroundPage();
  
  $("div#online").fadeOut(300, function(){
    $("a#login").fadeIn(300);
  });
  
  $("div.search").fadeOut(300);
  
  background.logout();
}

function populate_items(tags){
  $("div.entry").remove();
  
  tags.forEach(function(tag){
    var links = localStorage.items("_" + tag, { type : "Array" });
      
    links.map(function(link){
      return "http://www.google.com/buzz/" + link;	     
    }).forEach(function(link){

      $.get(link, function(data){
	var gSection = $(data).find("div.g-section");
	      
	var icon_url = gSection
			 .find("span.CSS_UPDATES_UCW_SENDER_IMG_SPAN img")
			 .complementURL({ domain: "www.google.com" })
			 .attr("src");
	      
	var date = gSection
		     .find("div.CSS_UPDATES_UCW_DATE")
		     .text();
	      
	var content = gSection
		     .find("div.CSS_UPDATES_UCW_UPDATE_BODY")
		     .text();
	      
	var author_link = gSection
			     .find("a.CSS_UPDATES_UCW_AUTHOR:first")
			     .complementURL({ domain: "www.google.com" })
			     .attr("target", "_blank");

		
        $("div#top")
	.attach("div.entry")    // div.entry
	  .attach("div.sender") // div.sender
	    .attach("img.icon") // img.icon
	      .attr("src", icon_url)
	    .end()
	  .end()
	  .attach("div")
	    .attach("div.content_header")  // div.content_header
	      .attach("div.author")        // div.author
		.append(author_link)
	      .end()
	      .attach("div.tag")     // div.tag
		.text("[ " + tag + " ]")
	      .end()
	    .end()
	    .attach("div.content") // div.content
	      .text(content)
	    .end()
	    .attach("div.link_to_original") // div.link_to_original
	      .append("<a>").find("a")
		.attr("href", link)
		.attr("target", "_blank")
		.text("original buzz")
	      .end()
	    .end()
	  .end()
	.end();
      });
    });
  });
}