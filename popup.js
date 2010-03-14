$(function(){
  var tags = JSON.parse(localStorage.tag_list);

    $("div#top")
    .attach("div.search")   // div.search
      .text("Tag: ")
      .attach("input type='text'")      // input
    .end();
    
  tags.forEach(function(tag){
    var links = JSON.parse(localStorage.getItem(tag));
      
    links.forEach(function(link){
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
});

