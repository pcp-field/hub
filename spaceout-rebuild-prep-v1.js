/* Preserve the original Space Out rod-type select before the mobile UI rebuild. */
(function(){
  'use strict';
  var page=document.getElementById('page-sucker');
  var select=document.getElementById('s-rod-type');
  if(!page||!select||!select.closest)return;
  var field=select.closest('.field');
  if(!field)return;
  field.style.display='none';
  field.setAttribute('data-sxo-preserved','1');
  page.appendChild(field);
})();