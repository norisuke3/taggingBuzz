(function($){
   var name = "TB_initTagUI";

   //
   // definition of TB_initTagUI
   //
   $.fn[name] = function(){
     this.each(function(){
       var self = this;
       var inputDiv = null;
       var divTag = null;
		   
       var focusToTag = function(evn){
	 divTag.show();
	 inputDiv.hide();
       };

       $(this)
       .after("<td>")
       .next()
		 
       .append("<div>")
	 .find("div")
	 .addClass("mD TB_tag")
	 .click(function(evn){divTag.hide();inputDiv.show().find("input").focus();})
       .end()
		 
       .append("<div>")
	 .find("div:last")
	 .addClass("mD")
	 .append("<input type='text'></input>")
	 .bind("keydown", onKeyDown)
	 .bind("keyEnter", focusToTag)
	   .find("input")
	   .blur(focusToTag)
	 .end()
	 .hide()
       .end()
		 
       .find("div.TB_tag")
	 .TB_initTagData();
		 
       divTag = $(this).next().find("div:first");
       inputDiv = $(this).next().find("div:last");
     });
     
     return this;
   };

   //
   // Event handler
   //
   var onKeyDown = function(evn){
     if(evn.keyCode == 13){ 
       evn.stopPropagation(); 
       $(this).trigger('keyEnter'); 
     }
   };
   
 })(jQuery);