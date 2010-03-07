(function($){
   var name = "TB_initTagUI";

   //
   // definition of TB_initTagUI
   //
   $.fn[name] = function(){
     this.each(function(){
       var self = this;
       var toggle = function(evn){ 
	 $(self).next().trigger("TB_toggle"); 
       };
       var focusToInput = function(evn){ 
	 $(self).next().find("div:last").find("input").focus(); 
       };
		 
       var focusToTag = function(evn){
	 $(self).next().find("div:last").find("input").triggerHandler("blur"); 
       };

       $(this)
       .after("<td>")
       .next()
       .bind("TB_toggle", function(){ $(this).find("div").toggle(); })
		 
       .append("<div>")
	 .find("div")
	 .addClass("mD TB_tag")
	 .click(toggle)
	 .click(focusToInput)
       .end()
		 
       .append("<div>")
	 .find("div:last")
	 .addClass("mD")
	 .append("<input type='text'></input>")
	 .bind("keydown", onKeyDown)
	 .bind("keyEnter", focusToTag)
	   .find("input")
	   .blur(toggle)
	 .end()
	 .hide()
       .end()
		 
       .find("div.TB_tag")
	 .TB_initTagData();
     });
     
     return this;
   };

   //
   // Event handler
   //
   var onKeyDown = function(evn){
     if(evn.keyCode == 13){ $(this).trigger('keyEnter'); }
   };
   
 })(jQuery);