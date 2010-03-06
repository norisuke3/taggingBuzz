(function($){
   var name = "TB_initTagData";

   var TagInfo = function(){
     this.data = {
       permalink: "", 
       tags: []
     };
   };
   
   $.extend(TagInfo.prototype, {
     register: function(){
       chrome.extension.sendRequest({
	 name: "register",
	 tagInfo: JSON.stringify(this.data)
       }, function(){});
     },

     // tags setter
     setter: function(val){
       var self = this;
       self.data.tags = [];
     
       val.split(',')
          .map(function(tag){ return tag.trim();   })
	  .forEach(function(tag){ 
	    if (tag != ""){
	      self.data.tags.push(tag); 
	    }
	  });
       
       this.register();
     },
     
     // tags getter
     getter: function(){
       return this.data.tags.reduce(function(a, b){ return a == "" ? b : a + ", "+ b; }, "");
     }
   });
   
   
   //
   // inner methods
   // 
   var registerTag = function(evn){
     var value = $("input", $(this))[0].value;
     
     if(evn.keyCode == 13){
       $(this).prev().data("tags").value = value;
       $(this).prev().text("Tags: " + $(this).prev().data("tags").value);
       $("input", $(this))[0].value = $(this).prev().data("tags").value;
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
   // definition of TB_initTagData
   //
   $.fn[name] = function(){
     this.each(function(){
       var tagInfo = new TagInfo();
       tagInfo.__defineSetter__("value", tagInfo.setter);
       tagInfo.__defineGetter__("value", tagInfo.getter);
		 
       tagInfo.data.permalink = getPermalink($(this));


       $(this)
	 .data('tags',tagInfo)
	 .text("Tag")
	 .next()
	 .keydown(registerTag);
     });
     
     return this;
   };
 })(jQuery);