$(function(){
  var tags = JSON.parse(localStorage.tag_list);

  tags.forEach(function(tag){
    var links = JSON.parse(localStorage.getItem(tag));
      
    var content = jQuery("<content>");
    links.forEach(function(link){
      content
      .append("<span>")
	.find("span:last")
	.text(tag + ": ")
	.append("<a>")
	  .find("a")
	  .attr("href", link)
	  .attr("target", "_blank")
	  .text(tag + ": " + link.substr(0, 10))
	.end()
	.append("<br>");
    });
		 
    $("div#top")
    .append("<div class=" + tag + ">")
      .find("div." + tag)
      .append(content.children());
  });
});

