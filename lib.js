Array.prototype.uniq=function(){
  return this.sort().reduceRight(
    function(a,b){
      a[0]===b || a.unshift(b);
      return a;
    }
    ,[]);
};

jQuery.fn.findAll = function(func){
  var result = null;
  
  this.each(function(){
    if (func($(this))){
      result = result ? result.add($(this)) : $(this);
    }
  });
  
  return result || $([]);
};


jQuery.fn.attrCopy = function(attr1, attr2){
  this.each(function(){
    $(this).attr(attr2, $(this).attr(attr1));
  });
  
  return this;
}

jQuery.fn.dbg = function(){
  debugger;
  
  return this;
}

jQuery.fn.complementURL = function(options){
  var setting = $.extend({
    protocol: "http",
    domain: "",
    path: null
  }, options);

  var url_base = setting.protocol + "://" + 
		 ( setting.domain.slice(-1) == "/" ? setting.domain : setting.domain + "/" ) + 
		 ( setting.path || "" );
  
  var link_tag = {
    a  : "href",
    img: "src"
  };
  
  this.each(function(){
    var attr = link_tag[this.tagName.toLowerCase()];
	      
    if(attr && $(this).attr(attr).slice(0, 1) == "/"){
      $(this).attr(attr, url_base + $(this).attr(attr).substr(1));
    }
  });

  return this;
}


jQuery.fn.attach = function(elmExp){
  var tagInfo;
  var tag;
  
  if( elmExp.indexOf("#") != -1 ){
    tag = elmExp.split("#");
    tagInfo = { tag: tag[0], id: tag[1] };
  } else  if( elmExp.indexOf(".") != -1 ){
    tag = elmExp.split(".");
    tagInfo = { tag: tag[0], classes: tag[1] };
  } else {
    tagInfo = { tag: elmExp };
  }

  return this.append(
    "<" + tagInfo.tag + ( tagInfo.id ? " id='" + tagInfo.id + "'" : "") + 
                        ( tagInfo.classes ? " class='" + tagInfo.classes + "'" : "") + 
    ">"
  ).find(tagInfo.tag + ":last");
}