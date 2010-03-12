$(function(){
  var tags = JSON.parse(localStorage.tag_list);

  tags.forEach(function(tag){
    var links = JSON.parse(localStorage.getItem(tag));
      
    links.forEach(function(link){
      $("div#top")
	.append("<div>")
	  .find("div:last")
	  .addClass("link")
	  .text(tag + ": ")
	  .append("<a>")
	    .find("a")
	    .attr("href", link)
	    .attr("target", "_blank")
	    .text("link")
	  .end()
	.end()
	.append("<div>")
	.find("div:last")
	.addClass("entry")
	.load(link + " div[class=g-section]", function(){
	  $(this)
	    .find("a")
	    .attr("target", "_blank");
	});
    });
  });
});

