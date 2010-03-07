Array.prototype.uniq=function(){
  return this.sort().reduceRight(
    function(a,b){
      a[0]===b || a.unshift(b);
      return a;
    }
    ,[]);
};
