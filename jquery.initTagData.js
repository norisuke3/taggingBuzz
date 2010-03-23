(function($){
   var name = "TB_initTagData";

   var TagInfo = function(permalink){
     var self = this;
     
     this.data = {
       permalink: permalink, 
       tags     : null
     };

     chrome.extension.sendRequest({
       name     : "query_tags",
       permalink: permalink
     }, function(response){ 
       self.data.tags = response.tags; 
       self.updateLinkedElements(); 
     });

     this.linked_elements = [];
     
     this.__defineSetter__("value", 
       function(val){
	 var self = this;
	 self.data.tags = [];
     
	 val.split(',')
            .map(function(tag){ return tag.trim(); })
	    .filter(function(tag){ return tag != ""; })
	    .uniq()
	    .forEach(function(tag){ self.data.tags.push(tag); });
     
	 this.updateLinkedElements();
	 this.register();
       }
     );
     
     this.__defineGetter__("value", 
       function(){
	 return this.data.tags.reduce(function(a, b){ return a == "" ? b : a + ", "+ b; }, "");
       }
     );
   };
   
   $.extend(TagInfo.prototype, {
     register: function(){
       chrome.extension.sendRequest({
	 name   : "register_tags",
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
     },
	      
     /**
      * link(jQuery elm)
      *   link the elm to tagInfo to update a value of elm according to updating of tagInfo
      */
     link: function(elm){
       this.linked_elements.push(elm);
     }
   });
   
   
   //
   // definition of TB_initTagData
   //
   $.fn[name] = function(){
     this.each(function(){
       var permalink = $(this)
			 .closest("div.G2")
			 .find("span.UPfPzb>div>a")
			 .attr("href");
		 
       var tagInfo = new TagInfo(permalink);
       var input = $(this).next().find("input")[0];
		 
       tagInfo.link($(this));
       tagInfo.link($(input));
		 
       $(this)
	 .data('tags',tagInfo)
	 .next()
	   .find("input")
	   .blur(function(){ tagInfo.value = input.value; })
	 .end();
     });
     
     return this;
   };
 })(jQuery);