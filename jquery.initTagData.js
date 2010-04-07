(function($){
   var name = "TB_initTagData";

   var TagInfo = function(permalink){
     var self = this;
     var buzzUrl = new BuzzURL(permalink);
     this.linked_elements = [];
     
     this.data = {
       gId      : buzzUrl.gId,
       buzzId   : buzzUrl.buzzId,
       tags     : null          // comma separated string value
     };

     chrome.extension.sendRequest({
       name     : "query_tags",
       gId      : buzzUrl.gId,
       buzzId   : buzzUrl.buzzId
     }, function(response){ 
       self.data.tags = response.tags; 
       self.updateLinkedElements(); 
     });
       
     // setter for tags
     this.__defineSetter__("value", 
       function(val){
	 var self = this;
     
	 self.data.tags = val.split(',')
            .map(function(tag){ return tag.trim(); })
	    .filter(function(tag){ return tag != ""; })
	    .uniq()
	    .join(", ");
     
	 this.updateLinkedElements();
	 this.register();
       }
     );
     
     // getter for tags
     this.__defineGetter__("value", 
       function(){ return this.data.tags; }
     );
   };
   
   $.extend(TagInfo.prototype, {
     register: function(){
       chrome.extension.sendRequest({
	 name   : "register_tags",
	 tagInfo: JSON.stringify(this.data)
       }, function(){});
     },

     // calling a function in the "modules" object, defined below, depending on the tag name
     // to set a value to those DOM element.
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