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

function populate_items(tags, offset){
  offset = offset || 0;
  var number_of_showing_items = 10;
  var number_of_items;
  
  if(offset == 0){ $("div.entry").remove(); }
  $("div#more").remove();
  
  tags.forEach(function(tag){
    var links = localStorage.items("_" + tag, { type : "Array" });
    number_of_items = links.length;
      
    links.slice(offset, offset + number_of_showing_items).map(function(link){
      return {
	gid     : link.split(',')[0].split('/').join(""),
	url      : "http://www.google.com/buzz/" + link.split(',')[0],
	timestamp: link.split(',')[1]
      };
    }).forEach(function(link){
      $("div#top")
	.attach("div#" + link.gid, [{ name: "class", value: "entry"}])
	.end()
      .end();

      $.get(link.url, function(data){
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


        $("div#" + link.gid)
	.css("border", "1px solid #000000")
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
	    .attach("div.time")     // div.timestamp
	      .text(link.timestamp)
	    .end()
	  .end()
	  .attach("div.content") // div.content
	    .text(content)
	  .end()
	  .attach("div.link_to_original") // div.link_to_original
	    .append("<a>").find("a")
	      .attr("href", link.url)
	      .attr("target", "_blank")
	      .text("original buzz")
	    .end()
	  .end()
	.end();
      });
    });
  });
  
  if(number_of_items > offset + number_of_showing_items){
    $("div#top")
      .attach("div#more")
	.append("<a>").find("a:last")
	.attr("href", "")
	.text("More items...")
	.click(show_more)
      .end()
    .end();
  }
  
  function show_more(){
    populate_items(tags, offset + number_of_showing_items);
  }
}