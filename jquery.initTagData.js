(function($){
   var name = "TB_initTagData";

   var TagInfo = function(){
     this.data = {
       permalink: "", 
       tags: []       
     };
     
     this.linked_elements = [];
   };
   
   $.extend(TagInfo.prototype, {
     // tags setter
     setter: function(val){
       var self = this;
       self.data.tags = [];
     
       val.split(',')
          .map(function(tag){ return tag.trim(); })
	  .filter(function(tag){ return tag != ""; })
	  .forEach(function(tag){ self.data.tags.push(tag); });
     
       this.updateLinkedElements();
       this.register();
     },
     
     // tags getter
     getter: function(){
       return this.data.tags.reduce(function(a, b){ return a == "" ? b : a + ", "+ b; }, "");
     },
	      
     register: function(){
       chrome.extension.sendRequest({
	 name: "register",
	 tagInfo: JSON.stringify(this.data)
       }, function(){});
     },

     updateLinkedElements: function(){
       var self = this;
       var modules = {
	 div  : function(elm){ elm.text("Tags: " + self.value); },
	 input: function(elm){ elm.attr("value", self.value); }
       };
       
       this.linked_elements.forEach(function(elm){
	 modules[elm[0].tagName.toLowerCase()](elm);
       });
     }
   });
   
   
   //
   // inner methods
   // 
   var updateTag = function(evn){
     var tags = $("input", $(this))[0];
     var tagInfo = $(this).prev().data("tags");
     
     if(evn.keyCode == 13){
       tagInfo.value = tags.value;
     }
   };
   
   //
   // definition of TB_initTagData
   //
   $.fn[name] = function(){
     this.each(function(){
       var tagInfo = new TagInfo();
       tagInfo.__defineSetter__("value", tagInfo.setter);
       tagInfo.__defineGetter__("value", tagInfo.getter);
		 
       tagInfo.linked_elements.push($(this));
       tagInfo.linked_elements.push($(this).next().find("input"));
		 
       tagInfo.data.permalink = $(this)
				  .closest("div.G2")
				  .find("span.UPfPzb>div>a")
				  .attr("href");

       $(this)
	 .data('tags',tagInfo)
	 .next()
	 .keydown(updateTag);

       tagInfo.value = "";
		 
       });
     
     return this;
   };
 })(jQuery);