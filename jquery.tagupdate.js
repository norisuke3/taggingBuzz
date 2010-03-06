(function($){
   var nameAddTag = "TB_addTag";
   var nameInitializeAsTag = "TB_initializeAsTag";

   var Tags = function(){
     this.data = [];
   };
   
   $.extend(Tags.prototype, {
     register: function(){
       chrome.extension.sendRequest({
	 name: "register",
	 tags: JSON.stringify(this.data)
       }, function(){});
     },
	      
     // tags setter
     setter: function(val){
       var self = this;
       self.data = [];
     
       val.split(',')
          .map(function(tag){ return tag.trim();   })
	  .forEach(function(tag){ 
	    if (tag != ""){
	      self.data.push(tag); 
	    }
	  });
       
       this.register();
     },
     
     // tags getter
     getter: function(){
       return this.data.reduce(function(a, b){ return a == "" ? b : a + ", "+ b; }, "");
     }
   });
   
   
   //
   // inner methods
   // 
   var tagClick = function(evn){
     $("input", $(this).next())[0].value = $(this).data("tags").value;
     
     $(this)
       .hide()
       .next()
       .show();
   };
   
   var enterTag = function(evn){
     var value = $("input", $(this))[0].value;
     
     if(evn.keyCode == 13){
       $(this).prev().data("tags").value = value;
       $(this).prev().text("Tags: " + $(this).prev().data("tags").value);
       
       $(this)
	 .hide()
	 .prev()
	 .show();
     }
   };
   
   /**
    * getPermalink(obj jQuery)
    *   returns a perma link of this buzz entry.
    * 
    *   jq_obj: jQuery object representing the "Tag" element.
    */
   var getPermalink = function(obj){
     return obj.closest("div.G2").find("span.UPfPzb>div>a").attr("href");
   };
   
   //
   // definition of TB_addTag
   //
   $.fn[nameAddTag] = function(){
     this.each(function(){
       var tags = new Tags();
       tags.__defineSetter__("value", tags.setter);
       tags.__defineGetter__("value", tags.getter);

       $(this)
       .after("<td>")
       .next()
		 
       .append("<div>")
	 .find("div")
	 .data('tags', tags)
	 .addClass("mD TB_tag")
	 .text("Tag")
	 .click(tagClick)
       .end()
		 
       .append("<div>")
	 .find("div:last")
	 .addClass("mD TB_tbox")
	 .append("<input type='text'></input>")
	 .keydown(enterTag)
	 .hide()
       .end();
     });
     
     return this;
   };
   
   //
   // definition of TB_initializeAsTag
   //
   $.fn[nameInitializeAsTag] = function(){
     
   };
 })(jQuery);