/* PCP Hub — Space Out Pro Rod mobile hotfix v1 */
(function(){
  'use strict';
  if(window.__PCP_SPACEOUT_PRO_HOTFIX_V1__) return;
  window.__PCP_SPACEOUT_PRO_HOTFIX_V1__=true;

  function $(id){return document.getElementById(id);}

  function syncVisual(value){
    document.querySelectorAll('#page-sucker [data-sxo-mode]').forEach(function(btn){
      var active=btn.getAttribute('data-sxo-mode')===value;
      btn.classList.toggle('active',active);
      btn.setAttribute('aria-pressed',active?'true':'false');
      btn.style.pointerEvents='auto';
      btn.style.touchAction='manipulation';
      btn.style.position='relative';
      btn.style.zIndex='3';
    });
  }

  function fallbackFields(value){
    var isPro=value==='Pro Rod';
    var remainField=$('s-remain-field');
    var remainLabel=$('s-remain-label');
    var srField=$('s-sr-field');
    var below=$('s-below-pr-field');
    if(remainField) remainField.style.display='';
    if(remainLabel) remainLabel.textContent=isPro?'Pin (ft)':'Remain (ft)';
    if(srField) srField.style.display=isPro?'none':'';
    if(below) below.style.display=isPro?'':'none';
  }

  function activate(value){
    var sel=$('s-rod-type');
    if(!sel) return false;
    sel.value=value;
    try{sel.dispatchEvent(new Event('input',{bubbles:true}));}catch(e){}
    try{sel.dispatchEvent(new Event('change',{bubbles:true}));}catch(e){}
    try{if(typeof window.updateRodTypeFields==='function') window.updateRodTypeFields();}catch(e){}
    try{if(typeof window.updateSRodWeight==='function') window.updateSRodWeight();}catch(e){}
    try{if(typeof window.updateSDH==='function') window.updateSDH();}catch(e){}
    fallbackFields(value);
    syncVisual(value);
    var result=$('sxo-result-v1'); if(result) result.classList.remove('show');
    var native=$('s-results'); if(native) native.style.display='none';
    return true;
  }

  function bind(){
    var buttons=document.querySelectorAll('#page-sucker [data-sxo-mode]');
    if(!buttons.length) return false;
    buttons.forEach(function(btn){
      if(btn.getAttribute('data-pro-hotfix')==='1') return;
      btn.setAttribute('data-pro-hotfix','1');
      btn.addEventListener('click',function(ev){
        ev.preventDefault();
        ev.stopPropagation();
        activate(btn.getAttribute('data-sxo-mode'));
      },true);
      btn.addEventListener('touchend',function(ev){
        ev.preventDefault();
        ev.stopPropagation();
        activate(btn.getAttribute('data-sxo-mode'));
      },{capture:true,passive:false});
    });
    var sel=$('s-rod-type');
    var value=sel&&sel.value==='Pro Rod'?'Pro Rod':'Sucker Rod';
    fallbackFields(value);
    syncVisual(value);
    return true;
  }

  function start(){
    if(bind()) return;
    var tries=0;
    var timer=setInterval(function(){
      tries++;
      if(bind()||tries>30) clearInterval(timer);
    },100);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
