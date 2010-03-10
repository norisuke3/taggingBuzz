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
