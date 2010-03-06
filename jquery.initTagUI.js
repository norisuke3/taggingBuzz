(function($){
   var name = "TB_initTagUI";

   //
   // inner methods
   // 
   var tagClick = function(evn){
     $(this)
       .hide()
       .next()
       .show();
   };
   
   var enterTag = function(evn){
     if(evn.keyCode == 13){
       $(this)
	 .hide()
	 .prev()
	 .show();
     }
   };
   
   //
   // definition of TB_initTagUI
   //
   $.fn[name] = function(){
     this.each(function(){

       $(this)
       .after("<td>")
       .next()
		 
       .append("<div>")
	 .find("div")
	 .addClass("mD TB_tag")
	 .click(tagClick)
       .end()
		 
       .append("<div>")
	 .find("div:last")
	 .addClass("mD")
	 .append("<input type='text'></input>")
	 .keydown(enterTag)
	 .hide()
       .end()
		 
       .find("div.TB_tag")
	 .TB_initTagData();
     });
     
     return this;
   };
 })(jQuery);