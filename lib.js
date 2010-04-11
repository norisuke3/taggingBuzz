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


jQuery.fn.attach = function(elmExp, attrs){
  var tagInfo;
  var tag;
  var strAttr = "";
  attrs = attrs || [];
  
  if( elmExp.indexOf("#") != -1 ){
    tag = elmExp.split("#");
    tagInfo = { tag: tag[0], id: tag[1] };
  } else  if( elmExp.indexOf(".") != -1 ){
    tag = elmExp.split(".");
    tagInfo = { tag: tag[0], classes: tag[1] };
  } else {
    tagInfo = { tag: elmExp };
  }
  
  attrs.forEach(function(attr){
    strAttr += " " + attr.name + "='" + attr.value + "'";
  });

  return this.append(
    "<" + tagInfo.tag + ( tagInfo.id ? " id='" + tagInfo.id + "'" : "") + 
                        ( tagInfo.classes ? " class='" + tagInfo.classes + "'" : "") + 
			strAttr +
    ">"
  ).find(tagInfo.tag + ":last");
}

//
// helper function 
//
// localStorage.push(String key, String value, Object option)
//  function to push 'value' to an array assuming that an object keied with 'key' is 
//  a JSON string of an array. 
// 
// default value:
//   option : { uniq => false }
//
localStorage.__proto__.push = function(key, value, option){
  var array = null;
  var setting = $.extend({
    uniq : false
  }, option);
    
  var obj = localStorage.getItem(key);
    
  if (obj) {
    array = JSON.parse(obj).concat(value);
    if(setting.uniq){ array = array.uniq(); }
      
  } else {
    array = [value];
  }
    
  localStorage.setItem(key, JSON.stringify(array));
}

//
// helper function
// 
// localStorage.items(String key, Object option)
//   returns a value associated with the 'key' in the localStorage
//
// option : { type => ("String" as default | "Array") }
//
localStorage.__proto__.items = function(key, option){
  var setting = $.extend({
    type: "String"
  }, option);
  
  var result = localStorage.getItem(key);

  if(setting.type == "Array"){
    result = JSON.parse(result || "[]");
  }
  
  return result;
}

//
// Class BuzzId
//   for a permalink of buzz article.
//   holding the permalink as google user ID and buzz ID
//   recognizing the permalink as:
// 
//   http://www.google.com/buzz/{gId}/{buzzId}/
//
var BuzzURL = function(permalink){
  this.gId = null;
  this.buzzId = null;
  
  this.setURL(permalink);
  
  this.__defineSetter__("url", function(value){ this.setURL(value); });
  this.__defineGetter__("url",
    function(){ return "http://www.google.com/buzz/" + this.gId + "/" + this.buzzId + "/"; }
  );
};

BuzzURL.prototype.setURL = function(value){
  var match = value.match(/buzz\/(\d+)\/(\w+)/i);
  this.gId = match[1];
  this.buzzId = match[2];
}
