/* Space Out button label */
(function(){
  'use strict';
  function apply(){
    var btn=document.querySelector('#page-sucker .sxo-calc');
    if(btn) btn.textContent='Calculate';
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
  setTimeout(apply,150);
  setTimeout(apply,700);
})();