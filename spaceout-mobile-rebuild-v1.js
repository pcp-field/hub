/* PCP Hub — Space Out mobile rebuild v1 */
(function(){
  'use strict';
  if(window.__PCP_SPACEOUT_REBUILD_V1__) return;
  window.__PCP_SPACEOUT_REBUILD_V1__ = true;

  function $(id){ return document.getElementById(id); }
  function make(tag, cls, html){
    var n=document.createElement(tag);
    if(cls) n.className=cls;
    if(html!=null) n.innerHTML=html;
    return n;
  }
  function fieldFor(id){
    var n=$(id);
    return n && n.closest ? n.closest('.field') : null;
  }

  function addCss(){
    if($('sxo-mobile-v1-css')) return;
    var s=document.createElement('style');
    s.id='sxo-mobile-v1-css';
    s.textContent=`
#page-sucker{padding:18px 18px calc(108px + env(safe-area-inset-bottom))!important;}
#page-sucker>.card{display:none!important;}
#page-sucker>.calc-btn,#page-sucker>#s-results{display:none!important;}
#page-sucker .sxo-shell{max-width:900px;margin:0 auto;display:grid;gap:14px;}
#page-sucker .sxo-head{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;padding:4px 2px 0;}
#page-sucker .sxo-kicker{font-size:11px;font-weight:800;letter-spacing:.11em;text-transform:uppercase;color:var(--text3);margin-bottom:7px;}
#page-sucker .sxo-head h1{margin:0;font-size:27px;line-height:1.14;letter-spacing:-.025em;color:var(--text);font-weight:760;}
#page-sucker .sxo-head p{margin:7px 0 0;color:var(--text2);font-size:13.5px;line-height:1.5;max-width:580px;}
#page-sucker .sxo-icon{width:46px;height:46px;flex:0 0 46px;border:1px solid var(--border2);background:var(--bg2);border-radius:15px;display:flex;align-items:center;justify-content:center;font-size:21px;}
#page-sucker .sxo-mode{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:5px;background:var(--bg2);border:1px solid var(--border);border-radius:16px;}
#page-sucker .sxo-mode button{min-height:45px;border:0;border-radius:12px;background:transparent;color:var(--text2);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:800;cursor:pointer;}
#page-sucker .sxo-mode button.active{background:var(--bg3);color:var(--text);box-shadow:0 0 0 1px var(--border2) inset;}
#page-sucker #s-rod-type{position:absolute!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important;}
#page-sucker .sxo-card{background:var(--bg2);border:1px solid var(--border);border-radius:20px;padding:15px;box-shadow:0 10px 30px rgba(0,0,0,.06);}
#page-sucker .sxo-card-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:13px;}
#page-sucker .sxo-card-head strong{font-size:15px;color:var(--text);}
#page-sucker .sxo-card-head span{font-size:11px;color:var(--text2);}
#page-sucker .sxo-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;}
#page-sucker .sxo-grid .field{min-width:0;gap:6px!important;}
#page-sucker .sxo-grid .field label{font-size:10.5px!important;letter-spacing:.055em!important;color:var(--text2)!important;line-height:1.35!important;}
#page-sucker .sxo-grid input,#page-sucker .sxo-grid select{min-height:48px!important;font-size:16px!important;border-radius:13px!important;background:var(--bg3)!important;border:1px solid var(--border)!important;color:var(--text)!important;padding:10px 12px!important;box-shadow:none!important;}
#page-sucker .sxo-grid input:focus,#page-sucker .sxo-grid select:focus{border-color:var(--accent2)!important;box-shadow:0 0 0 3px rgba(88,166,255,.10)!important;}
#page-sucker .sxo-grid input[readonly]{color:var(--text2)!important;opacity:.88;}
#page-sucker .sxo-grid .auto-note{font-size:10.5px!important;margin-top:2px!important;}
#page-sucker .sxo-advanced{margin-top:10px;border:1px solid var(--border);border-radius:14px;background:var(--bg3);overflow:hidden;}
#page-sucker .sxo-advanced summary{list-style:none;padding:12px 13px;cursor:pointer;color:var(--text2);font-size:12px;font-weight:750;display:flex;justify-content:space-between;align-items:center;}
#page-sucker .sxo-advanced summary::-webkit-details-marker{display:none;}
#page-sucker .sxo-advanced summary:after{content:'+';font-size:18px;color:var(--text3);}
#page-sucker .sxo-advanced[open] summary:after{content:'–';}
#page-sucker .sxo-advanced-grid{padding:0 12px 12px;}
#page-sucker .sxo-result{display:none;background:var(--bg2);border:1px solid rgba(88,166,255,.26);border-radius:20px;padding:15px;}
#page-sucker .sxo-result.show{display:block;}
#page-sucker .sxo-result-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;}
#page-sucker .sxo-result-head strong{font-size:15px;color:var(--text);}
#page-sucker .sxo-ready{font-size:10.5px;font-weight:800;color:var(--green);background:rgba(63,185,80,.10);border:1px solid rgba(63,185,80,.22);padding:5px 8px;border-radius:999px;}
#page-sucker .sxo-result #s-results{display:block!important;margin:0!important;}
#page-sucker .sxo-result #s-results>.divider,#page-sucker .sxo-result #s-results>.section-label{display:none!important;}
#page-sucker .sxo-result .result-grid{grid-template-columns:repeat(2,1fr)!important;margin:0!important;gap:9px!important;}
#page-sucker .sxo-result .result-box{border-radius:14px!important;padding:13px!important;}
#page-sucker .sxo-result .result-box .r-value{font-size:24px!important;}
#page-sucker .sxo-result .stickup-big{border-radius:16px!important;margin-top:10px!important;padding:14px!important;}
#page-sucker .sxo-result .stickup-big .s-value{font-size:32px!important;}
#page-sucker .sxo-result #s-results>.card{display:block!important;background:var(--bg3)!important;border:1px solid var(--border)!important;border-radius:14px!important;margin-top:10px!important;padding:11px!important;}
#page-sucker .sxo-result .instruction-box{border-radius:14px!important;margin-top:10px!important;}
#page-sucker .sxo-result .brief-share-btn{min-height:46px!important;border-radius:13px!important;margin-top:10px!important;}
#page-sucker .sxo-bottom{position:fixed;left:50%;bottom:calc(12px + env(safe-area-inset-bottom));transform:translateX(-50%);width:min(864px,calc(100% - 28px));z-index:88;display:grid;grid-template-columns:.68fr 1.32fr;gap:9px;padding:9px;background:rgba(22,27,34,.92);border:1px solid var(--border2);border-radius:17px;box-shadow:0 14px 38px rgba(0,0,0,.28);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);}
body.light-mode #page-sucker .sxo-bottom{background:rgba(255,255,255,.93);}
#page-sucker .sxo-bottom button{min-height:48px;border-radius:12px;font-family:'DM Sans',sans-serif;font-weight:800;font-size:14px;cursor:pointer;}
#page-sucker .sxo-reset{background:var(--bg3);border:1px solid var(--border2);color:var(--text);}
#page-sucker .sxo-calc{background:var(--accent2);border:1px solid var(--accent2);color:#fff;}
@media(max-width:680px){
  #page-sucker{padding:16px 14px calc(106px + env(safe-area-inset-bottom))!important;}
  #page-sucker .sxo-head h1{font-size:25px;}
  #page-sucker .sxo-grid{grid-template-columns:1fr 1fr;}
  #page-sucker .sxo-grid .field{min-width:0;}
}
@media(max-width:430px){
  #page-sucker .sxo-grid{grid-template-columns:1fr!important;}
  #page-sucker .sxo-mode button{font-size:12.5px;}
}
`;
    document.head.appendChild(s);
  }

  function moveField(id, host){
    var f=fieldFor(id);
    if(f && host && f.parentNode!==host) host.appendChild(f);
    return f;
  }

  function callUpdate(){
    try{ if(typeof window.updateRodTypeFields==='function') window.updateRodTypeFields(); }catch(e){}
    try{ if(typeof window.updateSRodWeight==='function') window.updateSRodWeight(); }catch(e){}
    try{ if(typeof window.updateSDH==='function') window.updateSDH(); }catch(e){}
  }

  function syncMode(){
    var sel=$('s-rod-type');
    var value=sel ? sel.value : 'Sucker Rod';
    document.querySelectorAll('#page-sucker [data-sxo-mode]').forEach(function(b){
      b.classList.toggle('active',b.getAttribute('data-sxo-mode')===value);
      b.setAttribute('aria-pressed',b.getAttribute('data-sxo-mode')===value?'true':'false');
    });
  }

  function setMode(value){
    var sel=$('s-rod-type');
    if(!sel) return;
    sel.value=value;
    try{ sel.dispatchEvent(new Event('change',{bubbles:true})); }catch(e){}
    callUpdate();
    syncMode();
  }

  function showResult(){
    var result=$('sxo-result-v1');
    if(result) result.classList.add('show');
    var native=$('s-results');
    if(native) native.style.display='block';
    setTimeout(function(){
      if(result) result.scrollIntoView({behavior:'smooth',block:'nearest'});
    },60);
  }

  function calculate(){
    try{
      if(typeof window.calcSpaceOut==='function') window.calcSpaceOut();
      showResult();
    }catch(e){
      console.error('[SPACE OUT REBUILD CALC]',e);
    }
  }

  function reset(){
    ['s-well','s-psd','s-adapter','s-pr','s-remain','s-bop','s-sr','s-below-pr','s-so','s-sw-chg'].forEach(function(id){
      var n=$(id); if(n) n.value='';
    });
    var result=$('sxo-result-v1'); if(result) result.classList.remove('show');
    var native=$('s-results'); if(native) native.style.display='none';
    var well=$('s-well'); if(well) well.focus();
  }

  function rebuild(){
    var page=$('page-sucker');
    if(!page || page.getAttribute('data-sxo-rebuilt')==='1') return;
    var result=$('s-results');
    var calc=page.querySelector(':scope > .calc-btn');
    if(!result || !calc) return;

    addCss();
    page.setAttribute('data-sxo-rebuilt','1');

    var oldCards=Array.prototype.slice.call(page.querySelectorAll(':scope > .card'));
    var shell=make('div','sxo-shell');

    var head=make('div','sxo-head');
    head.innerHTML='<div><div class="sxo-kicker">Space Out</div><h1>PCP Space Out</h1><p>Enter the field measurements, calculate once, and get the spacing result immediately.</p></div><div class="sxo-icon">📏</div>';

    var mode=make('div','sxo-mode');
    mode.innerHTML='<button type="button" data-sxo-mode="Sucker Rod">Sucker Rod</button><button type="button" data-sxo-mode="Pro Rod">Pro Rod</button>';

    var setup=make('section','sxo-card');
    setup.innerHTML='<div class="sxo-card-head"><strong>Well setup</strong><span>Basic job details</span></div>';
    var setupGrid=make('div','sxo-grid');
    setup.appendChild(setupGrid);
    ['s-well','s-psd','s-rod-size','s-w'].forEach(function(id){moveField(id,setupGrid);});

    var dh=make('section','sxo-card');
    dh.innerHTML='<div class="sxo-card-head"><strong>Drivehead</strong><span>Type & length</span></div>';
    var dhGrid=make('div','sxo-grid');
    dh.appendChild(dhGrid);
    ['s-dh','s-dh-ft','s-dh-in'].forEach(function(id){moveField(id,dhGrid);});
    var adv=make('details','sxo-advanced');
    adv.innerHTML='<summary>Adapter / optional settings</summary>';
    var advGrid=make('div','sxo-grid sxo-advanced-grid');
    adv.appendChild(advGrid);
    moveField('s-adapter',advGrid);
    dh.appendChild(adv);

    var measurements=make('section','sxo-card');
    measurements.innerHTML='<div class="sxo-card-head"><strong>Measurements</strong><span>Field readings</span></div>';
    var mGrid=make('div','sxo-grid');
    measurements.appendChild(mGrid);
    ['s-pr','s-remain','s-bop','s-sr','s-below-pr','s-so','s-sw-chg'].forEach(function(id){moveField(id,mGrid);});

    var resultCard=make('section','sxo-result');
    resultCard.id='sxo-result-v1';
    resultCard.innerHTML='<div class="sxo-result-head"><strong>Calculation result</strong><span class="sxo-ready">READY</span></div>';
    resultCard.appendChild(result);

    var bottom=make('div','sxo-bottom');
    var resetBtn=make('button','sxo-reset','Clear');
    resetBtn.type='button';
    var calcBtn=make('button','sxo-calc','Calculate Space Out');
    calcBtn.type='button';
    bottom.appendChild(resetBtn); bottom.appendChild(calcBtn);

    shell.appendChild(head); shell.appendChild(mode); shell.appendChild(setup); shell.appendChild(dh); shell.appendChild(measurements); shell.appendChild(resultCard); shell.appendChild(bottom);
    page.appendChild(shell);

    oldCards.forEach(function(c){ if(c.parentNode===page) c.remove(); });
    if(calc.parentNode===page) calc.remove();

    var rodTypeField=fieldFor('s-rod-type');
    if(rodTypeField) rodTypeField.style.display='none';

    mode.addEventListener('click',function(e){
      var b=e.target.closest('[data-sxo-mode]');
      if(b) setMode(b.getAttribute('data-sxo-mode'));
    });
    calcBtn.addEventListener('click',calculate);
    resetBtn.addEventListener('click',reset);

    page.addEventListener('input',function(e){
      if(e.target && e.target.closest && e.target.closest('.sxo-shell')){
        var r=$('sxo-result-v1'); if(r) r.classList.remove('show');
      }
    });

    callUpdate();
    syncMode();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',rebuild,{once:true});
  else rebuild();
})();