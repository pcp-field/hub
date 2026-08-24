/* PCP Hub — Daily Job Log mobile rebuild v1 */
(function(){
  'use strict';
  if(window.__PCP_DAILY_REBUILD_V1__) return;
  window.__PCP_DAILY_REBUILD_V1__ = true;

  function $(id){return document.getElementById(id);}
  function make(tag,cls,html){var n=document.createElement(tag);if(cls)n.className=cls;if(html!=null)n.innerHTML=html;return n;}
  function fieldFor(id){var n=$(id);return n&&n.closest?n.closest('.field'):null;}
  function entries(){
    try{
      if(window.PCPStore && typeof window.PCPStore.readArray==='function') return window.PCPStore.readArray('djlEntries');
      var v=JSON.parse(localStorage.getItem('djlEntries')||'[]'); return Array.isArray(v)?v:[];
    }catch(e){return [];}
  }
  function localISO(){
    var d=new Date(),y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');
    return y+'-'+m+'-'+day;
  }

  function addCss(){
    if($('djlx-mobile-v1-css')) return;
    var s=document.createElement('style');
    s.id='djlx-mobile-v1-css';
    s.textContent=`
#page-daily-log{padding:18px 18px calc(108px + env(safe-area-inset-bottom))!important;}
#page-daily-log>.card{display:none!important;}
#page-daily-log .djlx-shell{max-width:920px;margin:0 auto;display:grid;gap:14px;}
#page-daily-log .djlx-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:4px 2px 0;}
#page-daily-log .djlx-kicker{font-size:11px;font-weight:800;letter-spacing:.11em;text-transform:uppercase;color:var(--text3);margin-bottom:7px;}
#page-daily-log .djlx-head h1{margin:0;font-size:27px;line-height:1.14;letter-spacing:-.025em;color:var(--text);font-weight:760;}
#page-daily-log .djlx-head p{margin:7px 0 0;color:var(--text2);font-size:13.5px;line-height:1.5;max-width:590px;}
#page-daily-log .djlx-icon{width:46px;height:46px;flex:0 0 46px;border:1px solid var(--border2);background:var(--bg2);border-radius:15px;display:flex;align-items:center;justify-content:center;font-size:21px;}
#page-daily-log .djlx-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
#page-daily-log .djlx-stat{background:var(--bg2);border:1px solid var(--border);border-radius:15px;padding:11px 12px;}
#page-daily-log .djlx-stat span{display:block;font-size:10.5px;color:var(--text2);font-weight:700;}
#page-daily-log .djlx-stat b{display:block;margin-top:4px;font-size:20px;color:var(--text);font-family:'DM Mono',monospace;}
#page-daily-log .djlx-card{background:var(--bg2);border:1px solid var(--border);border-radius:20px;padding:15px;box-shadow:0 10px 30px rgba(0,0,0,.06);}
#page-daily-log .djlx-card-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:13px;}
#page-daily-log .djlx-card-head strong{font-size:15px;color:var(--text);}
#page-daily-log .djlx-card-head small{font-size:11px;color:var(--text2);}
#page-daily-log .djlx-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;}
#page-daily-log .djlx-grid .field{gap:6px!important;min-width:0;}
#page-daily-log .djlx-grid .field.full{grid-column:1/-1;}
#page-daily-log .djlx-grid .field label{font-size:10.5px!important;letter-spacing:.055em!important;color:var(--text2)!important;line-height:1.35!important;}
#page-daily-log .djlx-grid input,#page-daily-log .djlx-grid select,#page-daily-log .djlx-grid textarea{width:100%!important;font-size:16px!important;border-radius:13px!important;background:var(--bg3)!important;border:1px solid var(--border)!important;color:var(--text)!important;box-shadow:none!important;}
#page-daily-log .djlx-grid input,#page-daily-log .djlx-grid select{min-height:48px!important;padding:10px 12px!important;}
#page-daily-log .djlx-grid textarea{min-height:110px!important;padding:12px!important;line-height:1.5!important;resize:vertical!important;}
#page-daily-log .djlx-grid input:focus,#page-daily-log .djlx-grid select:focus,#page-daily-log .djlx-grid textarea:focus{border-color:var(--accent2)!important;box-shadow:0 0 0 3px rgba(88,166,255,.10)!important;}
#page-daily-log #djl-duration{color:var(--text2)!important;}
#page-daily-log .djlx-advanced{grid-column:1/-1;border:1px solid var(--border);background:var(--bg3);border-radius:14px;overflow:hidden;}
#page-daily-log .djlx-advanced summary{list-style:none;padding:12px 13px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:750;color:var(--text2);}
#page-daily-log .djlx-advanced summary::-webkit-details-marker{display:none;}
#page-daily-log .djlx-advanced summary:after{content:'+';font-size:18px;color:var(--text3);}
#page-daily-log .djlx-advanced[open] summary:after{content:'–';}
#page-daily-log .djl-job-type-manager{padding:0 12px 12px!important;margin:0!important;display:grid!important;gap:8px!important;}
#page-daily-log .djl-job-type-manager input{font-size:16px!important;min-height:46px!important;border-radius:12px!important;}
#page-daily-log .djl-job-type-manager .mini-actions{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important;}
#page-daily-log .djl-job-type-manager .djl-mini-btn{min-height:42px!important;border-radius:11px!important;}
#page-daily-log .djlx-form-actions{display:grid;grid-template-columns:1fr auto;gap:8px;margin-top:12px;}
#page-daily-log .djlx-form-actions button{min-height:48px!important;margin:0!important;border-radius:12px!important;font-size:14px!important;}
#page-daily-log #djl-add-btn{background:var(--accent2)!important;color:#fff!important;}
#page-daily-log #djl-status-msg{font-size:11.5px!important;color:var(--text2)!important;min-height:18px!important;margin-top:8px!important;}
#page-daily-log .djlx-preview{padding:0!important;overflow:hidden;}
#page-daily-log .djlx-preview summary{list-style:none;padding:14px 15px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:10px;}
#page-daily-log .djlx-preview summary::-webkit-details-marker{display:none;}
#page-daily-log .djlx-preview summary strong{font-size:14px;color:var(--text);}
#page-daily-log .djlx-preview summary small{display:block;margin-top:3px;font-size:11px;color:var(--text2);}
#page-daily-log .djlx-preview summary:after{content:'View';font-size:11px;font-weight:800;color:var(--accent);background:rgba(88,166,255,.10);border:1px solid rgba(88,166,255,.20);border-radius:999px;padding:5px 8px;}
#page-daily-log .djlx-preview[open] summary:after{content:'Hide';}
#page-daily-log .djlx-preview-body{padding:0 14px 14px;border-top:1px solid var(--border);}
#page-daily-log #djl-output{margin-top:13px!important;min-height:250px!important;font-size:13px!important;border-radius:14px!important;background:var(--bg3)!important;border:1px solid var(--border)!important;padding:13px!important;color:var(--text)!important;line-height:1.55!important;}
#page-daily-log .djlx-preview-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;}
#page-daily-log .djlx-preview-actions button{min-height:44px!important;border-radius:12px!important;margin:0!important;}
#page-daily-log .djlx-list-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;}
#page-daily-log .djlx-list-head strong{font-size:15px;color:var(--text);}
#page-daily-log .djlx-clear{border:1px solid rgba(248,81,73,.25);background:rgba(248,81,73,.08);color:var(--red);border-radius:10px;padding:8px 10px;font-size:11px;font-weight:750;cursor:pointer;}
#page-daily-log .daily-log-list{display:grid!important;gap:9px!important;}
#page-daily-log .daily-log-entry{background:var(--bg3)!important;border:1px solid var(--border)!important;border-radius:15px!important;padding:12px!important;margin:0!important;}
#page-daily-log .daily-log-entry>div{display:grid!important;grid-template-columns:1fr auto!important;gap:10px!important;align-items:start!important;}
#page-daily-log .daily-log-entry strong{font-size:14px!important;color:var(--text)!important;}
#page-daily-log .daily-log-entry .small-note{font-size:11.5px!important;line-height:1.45!important;color:var(--text2)!important;margin-top:4px!important;}
#page-daily-log .daily-log-entry>div>div:last-child{display:flex!important;gap:6px!important;flex-wrap:wrap!important;justify-content:flex-end!important;}
#page-daily-log .daily-log-entry .djl-mini-btn{min-height:38px!important;padding:7px 9px!important;border-radius:10px!important;font-size:11px!important;}
#page-daily-log .djlx-bottom{position:fixed;left:50%;bottom:calc(12px + env(safe-area-inset-bottom));transform:translateX(-50%);width:min(884px,calc(100% - 28px));z-index:88;display:grid;grid-template-columns:.72fr 1.28fr;gap:9px;padding:9px;background:rgba(22,27,34,.92);border:1px solid var(--border2);border-radius:17px;box-shadow:0 14px 38px rgba(0,0,0,.28);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);}
body.light-mode #page-daily-log .djlx-bottom{background:rgba(255,255,255,.93);}
#page-daily-log .djlx-bottom button{min-height:48px;border-radius:12px;font-family:'DM Sans',sans-serif;font-weight:800;font-size:14px;cursor:pointer;}
#page-daily-log .djlx-view{background:var(--bg3);border:1px solid var(--border2);color:var(--text);}
#page-daily-log .djlx-share{background:var(--accent2);border:1px solid var(--accent2);color:#fff;}
#page-daily-log .djlx-hidden-old{display:none!important;}
@media(max-width:680px){
  #page-daily-log{padding:16px 14px calc(106px + env(safe-area-inset-bottom))!important;}
  #page-daily-log .djlx-head h1{font-size:25px;}
  #page-daily-log .djlx-grid{grid-template-columns:1fr 1fr;}
  #page-daily-log .daily-log-entry>div{grid-template-columns:1fr!important;}
  #page-daily-log .daily-log-entry>div>div:last-child{justify-content:stretch!important;}
  #page-daily-log .daily-log-entry .djl-mini-btn{flex:1 1 30%!important;}
}
@media(max-width:430px){
  #page-daily-log .djlx-grid{grid-template-columns:1fr!important;}
  #page-daily-log .djlx-stats{grid-template-columns:1fr 1fr 1fr;}
  #page-daily-log .djlx-stat{padding:9px;}
  #page-daily-log .djlx-stat b{font-size:18px;}
}
`;
    document.head.appendChild(s);
  }

  function moveField(id,host){
    var f=fieldFor(id);
    if(f && host && f.parentNode!==host) host.appendChild(f);
    return f;
  }

  function updateStats(){
    var list=entries(),today=localISO();
    var todayCount=list.filter(function(e){return e && e.date===today;}).length;
    var completed=list.filter(function(e){return e && String(e.status||'').toLowerCase()==='completed';}).length;
    var a=$('djlx-total-v1'),b=$('djlx-today-v1'),c=$('djlx-completed-v1');
    if(a)a.textContent=String(list.length);
    if(b)b.textContent=String(todayCount);
    if(c)c.textContent=String(completed);
  }

  function openPreview(){
    try{ if(typeof window.generateLog==='function') window.generateLog(); }catch(e){}
    var d=$('djlx-preview-v1'); if(d){d.open=true;setTimeout(function(){d.scrollIntoView({behavior:'smooth',block:'nearest'});},40);}
  }

  async function clearAll(){
    var ok=true;
    if(typeof window.pcpConfirmDelete==='function'){
      ok=await window.pcpConfirmDelete('Clear Daily Job Log','All saved daily job entries on this device will be deleted. This cannot be undone.');
    }else{
      ok=window.confirm('Clear all saved daily log entries?');
    }
    if(!ok)return;
    try{
      if(window.PCPStore&&typeof window.PCPStore.writeJSON==='function') window.PCPStore.writeJSON('djlEntries',[]);
      else localStorage.setItem('djlEntries','[]');
      if(typeof window.renderDailyLog==='function') window.renderDailyLog();
      var msg=$('djl-status-msg');if(msg)msg.textContent='All saved entries cleared.';
      updateStats();
    }catch(e){
      var msg2=$('djl-status-msg');if(msg2)msg2.textContent='Could not clear saved entries.';
    }
  }

  function rebuild(){
    var page=$('page-daily-log');
    if(!page||page.getAttribute('data-djlx-rebuilt')==='1')return;
    var cards=Array.prototype.slice.call(page.querySelectorAll(':scope > .card'));
    if(cards.length<3)return;

    var add=$('djl-add-btn'),cancel=$('djl-cancel-edit-btn'),gen=$('djl-generate-btn'),share=$('djl-whatsapp-btn'),clear=$('djl-clear-btn');
    var status=$('djl-status-msg'),output=$('djl-output'),copy=$('djl-copy-btn'),list=$('djl-list');
    if(!add||!output||!list)return;

    addCss();
    page.setAttribute('data-djlx-rebuilt','1');

    var shell=make('div','djlx-shell');
    var head=make('div','djlx-head');
    head.innerHTML='<div><div class="djlx-kicker">Daily Job Log</div><h1>Field Job Log</h1><p>Record the job once, keep it saved on this device, and share the daily log when needed.</p></div><div class="djlx-icon">📒</div>';

    var stats=make('div','djlx-stats');
    stats.innerHTML='<div class="djlx-stat"><span>Saved</span><b id="djlx-total-v1">0</b></div><div class="djlx-stat"><span>Today</span><b id="djlx-today-v1">0</b></div><div class="djlx-stat"><span>Completed</span><b id="djlx-completed-v1">0</b></div>';

    var form=make('section','djlx-card');
    form.innerHTML='<div class="djlx-card-head"><strong>New field entry</strong><small>Well ID is required</small></div>';
    var grid=make('div','djlx-grid');form.appendChild(grid);
    ['djl-date','djl-well','djl-job-type','djl-rig','djl-start','djl-finish','djl-status','djl-crew','djl-duration','djl-prepared-by','djl-prepared-custom','djl-summary','djl-findings'].forEach(function(id){moveField(id,grid);});

    var manager=document.querySelector('#page-daily-log .djl-job-type-manager');
    if(manager){
      var advanced=make('details','djlx-advanced');
      advanced.innerHTML='<summary>Manage job types</summary>';
      manager.parentNode && manager.parentNode.removeChild(manager);
      advanced.appendChild(manager);
      grid.appendChild(advanced);
    }

    var formActions=make('div','djlx-form-actions');
    add.textContent='Save Entry';
    formActions.appendChild(add);
    if(cancel) formActions.appendChild(cancel);
    form.appendChild(formActions);
    if(status) form.appendChild(status);

    var preview=make('details','djlx-card djlx-preview');
    preview.id='djlx-preview-v1';
    var pSum=make('summary','');
    pSum.innerHTML='<div><strong>Daily Log Preview</strong><small>Generated from your saved entries</small></div>';
    var pBody=make('div','djlx-preview-body');
    pBody.appendChild(output);
    var pActions=make('div','djlx-preview-actions');
    if(gen){gen.textContent='Refresh Preview';pActions.appendChild(gen);}
    if(copy){copy.textContent='Copy Log';pActions.appendChild(copy);}
    pBody.appendChild(pActions);preview.appendChild(pSum);preview.appendChild(pBody);

    var saved=make('section','djlx-card');
    var listHead=make('div','djlx-list-head');
    listHead.innerHTML='<strong>Saved entries</strong>';
    var clearNew=make('button','djlx-clear','Clear all');
    clearNew.type='button';
    listHead.appendChild(clearNew);
    saved.appendChild(listHead);saved.appendChild(list);

    var bottom=make('div','djlx-bottom');
    var view=make('button','djlx-view','View Daily Log');view.type='button';
    var shareNew=make('button','djlx-share','Share Daily Log');shareNew.type='button';
    bottom.appendChild(view);bottom.appendChild(shareNew);

    shell.appendChild(head);shell.appendChild(stats);shell.appendChild(form);shell.appendChild(preview);shell.appendChild(saved);shell.appendChild(bottom);
    page.appendChild(shell);

    cards.forEach(function(c){if(c.parentNode===page)c.remove();});
    if(clear)clear.classList.add('djlx-hidden-old');
    if(share)share.classList.add('djlx-hidden-old');

    view.addEventListener('click',openPreview);
    shareNew.addEventListener('click',function(){
      try{if(typeof window.generateLog==='function')window.generateLog();}catch(e){}
      if(share)share.click();
    });
    clearNew.addEventListener('click',clearAll);

    var obs=new MutationObserver(function(){updateStats();});
    obs.observe(list,{childList:true,subtree:true});
    updateStats();
    setTimeout(updateStats,150);

    var date=$('djl-date');if(date&&!date.value)date.value=localISO();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',rebuild,{once:true});
  else rebuild();
})();