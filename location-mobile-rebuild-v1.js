/* PCP Hub — Well Location mobile rebuild v1 */
(function(){
  'use strict';
  if(window.__PCP_LOCATION_REBUILD_V1__) return;
  window.__PCP_LOCATION_REBUILD_V1__ = true;

  function $(id){ return document.getElementById(id); }
  function el(tag, cls, html){
    var node=document.createElement(tag);
    if(cls) node.className=cls;
    if(html!=null) node.innerHTML=html;
    return node;
  }
  function text(elm, value){ if(elm) elm.textContent=value; }

  function addCss(){
    if($('locx-mobile-v1-css')) return;
    var s=document.createElement('style');
    s.id='locx-mobile-v1-css';
    s.textContent=`
#page-location{padding:18px 18px calc(34px + env(safe-area-inset-bottom))!important;}
#page-location .location-inline-app{background:transparent!important;min-height:0!important;}
#page-location .location-main{max-width:860px!important;margin:0 auto!important;padding:0!important;}
#page-location .locx-shell{display:grid;gap:14px;}
#page-location .locx-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:4px 2px 2px;}
#page-location .locx-kicker{font-size:11px;font-weight:800;letter-spacing:.11em;text-transform:uppercase;color:var(--text3);margin-bottom:7px;}
#page-location .locx-head h1{font-size:27px;line-height:1.15;letter-spacing:-.02em;margin:0;color:var(--text);font-weight:750;}
#page-location .locx-head p{font-size:13.5px;line-height:1.5;color:var(--text2);margin:7px 0 0;max-width:560px;}
#page-location .locx-pin{width:46px;height:46px;flex:0 0 46px;border-radius:15px;background:var(--bg2);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:21px;box-shadow:0 8px 24px rgba(0,0,0,.10);}
#page-location .locx-sync{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;background:var(--bg2);border:1px solid var(--border);border-radius:15px;padding:11px 12px;}
#page-location .locx-sync-main{display:flex;align-items:center;gap:9px;min-width:0;}
#page-location .locx-sync-dot{width:9px;height:9px;border-radius:50%;background:var(--green);box-shadow:0 0 0 4px rgba(63,185,80,.10);flex:0 0 auto;}
#page-location .locx-sync.offline .locx-sync-dot{background:var(--orange);box-shadow:0 0 0 4px rgba(210,153,34,.10);}
#page-location .locx-sync-copy{min-width:0;}
#page-location .locx-sync-copy strong{display:block;font-size:12.5px;color:var(--text);font-weight:750;}
#page-location .locx-sync-copy span,#page-location .locx-sync-copy #offline-sync-sub{display:block;font-size:11.5px;color:var(--text2);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}#page-location #offline-sync-count{display:none!important;}
#page-location .locx-sync .offline-sync-btn{width:auto!important;min-height:38px!important;margin:0!important;padding:8px 12px!important;border-radius:10px!important;background:var(--bg3)!important;color:var(--text)!important;border:1px solid var(--border2)!important;font-size:12px!important;font-weight:750!important;box-shadow:none!important;}
#page-location .locx-card{background:var(--bg2);border:1px solid var(--border);border-radius:20px;padding:15px;box-shadow:0 10px 30px rgba(0,0,0,.06);}
#page-location .locx-card-title{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:13px;}
#page-location .locx-card-title strong{font-size:15px;color:var(--text);}
#page-location .locx-card-title span{font-size:11.5px;color:var(--text3);}
#page-location .locx-fields{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
#page-location .locx-field{display:grid;gap:6px;}
#page-location .locx-field label{font-size:10.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--text2);}
#page-location .locx-field select,#page-location .locx-field input,#page-location .locx-import textarea{width:100%!important;background:var(--bg3)!important;border:1px solid var(--border2)!important;border-radius:13px!important;color:var(--text)!important;font-family:'DM Sans',sans-serif!important;font-size:16px!important;outline:none!important;box-shadow:none!important;-webkit-appearance:none;}
#page-location .locx-field select,#page-location .locx-field input{height:51px!important;padding:0 13px!important;}
#page-location .locx-field select:focus,#page-location .locx-field input:focus,#page-location .locx-import textarea:focus{border-color:var(--accent2)!important;box-shadow:0 0 0 3px rgba(88,166,255,.11)!important;}
#page-location .locx-id{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:12px;padding:12px 13px;background:var(--bg3);border:1px solid var(--border);border-radius:13px;}
#page-location .locx-id span{font-size:10.5px;text-transform:uppercase;letter-spacing:.08em;font-weight:800;color:var(--text3);}
#page-location .locx-id strong{font-family:'DM Mono',monospace;font-size:18px;color:var(--text);letter-spacing:.02em;}
#page-location .locx-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:12px;}
#page-location .locx-actions .btn{display:flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;width:100%!important;min-height:49px!important;margin:0!important;border-radius:13px!important;font-size:14px!important;font-weight:800!important;box-shadow:none!important;}
#page-location .locx-actions .btn.search{background:var(--accent2)!important;color:#fff!important;border:1px solid transparent!important;}
#page-location .locx-actions .btn.save{background:rgba(63,185,80,.10)!important;color:var(--green)!important;border:1px solid rgba(63,185,80,.28)!important;}
#page-location .locx-actions .btn.settings{grid-column:1/-1;background:rgba(210,153,34,.09)!important;color:var(--orange)!important;border:1px solid rgba(210,153,34,.25)!important;display:none!important;}
#page-location .locx-actions .btn.settings.show{display:flex!important;}
#page-location .locx-status,#page-location #statusBox{margin-top:10px!important;padding:10px 11px!important;border-radius:11px!important;font-size:11.8px!important;line-height:1.45!important;text-align:left!important;border:1px solid var(--border)!important;background:var(--bg3)!important;color:var(--text2)!important;}
#page-location .locx-status.ok,#page-location #statusBox.ok{border-color:rgba(63,185,80,.25)!important;background:rgba(63,185,80,.07)!important;color:var(--green)!important;}
#page-location .locx-status.bad,#page-location #statusBox.bad{border-color:rgba(248,81,73,.25)!important;background:rgba(248,81,73,.07)!important;color:var(--red)!important;}
#page-location .locx-status.info,#page-location #statusBox.info{border-color:var(--border)!important;background:var(--bg3)!important;color:var(--text2)!important;}
#page-location .locx-import{background:var(--bg2);border:1px solid var(--border);border-radius:18px;overflow:hidden;}
#page-location .locx-import summary{list-style:none;cursor:pointer;padding:14px 15px;display:flex;align-items:center;justify-content:space-between;gap:12px;-webkit-tap-highlight-color:transparent;}
#page-location .locx-import summary::-webkit-details-marker{display:none;}
#page-location .locx-import-title{display:flex;align-items:center;gap:10px;min-width:0;}
#page-location .locx-import-icon{width:35px;height:35px;border-radius:11px;background:rgba(63,185,80,.10);border:1px solid rgba(63,185,80,.18);display:flex;align-items:center;justify-content:center;font-size:16px;flex:0 0 auto;}
#page-location .locx-import-title strong{display:block;color:var(--text);font-size:13.5px;}
#page-location .locx-import-title small{display:block;color:var(--text2);font-size:11.5px;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
#page-location .locx-chevron{color:var(--text3);font-size:18px;transition:transform .2s ease;}
#page-location .locx-import[open] .locx-chevron{transform:rotate(180deg);}
#page-location .locx-import-body{padding:0 15px 15px;border-top:1px solid var(--border);}
#page-location .locx-import textarea{min-height:112px!important;resize:vertical!important;padding:12px 13px!important;line-height:1.5!important;margin-top:13px!important;}
#page-location .locx-import-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:10px;}
#page-location .locx-import-actions .btn{width:100%!important;min-height:45px!important;margin:0!important;border-radius:12px!important;font-size:13px!important;font-weight:800!important;box-shadow:none!important;}
#page-location .locx-import-actions .paste{background:var(--bg3)!important;color:var(--text)!important;border:1px solid var(--border2)!important;}
#page-location .locx-import-actions .import-save{background:var(--accent2)!important;color:#fff!important;border:1px solid transparent!important;}
#page-location .locx-import-foot{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:9px;}
#page-location .locx-import-foot .whatsapp{width:auto!important;min-height:36px!important;margin:0!important;padding:7px 10px!important;border-radius:10px!important;background:transparent!important;color:var(--text2)!important;border:1px solid var(--border)!important;font-size:11.5px!important;font-weight:700!important;box-shadow:none!important;}
#page-location .locx-import-foot .ai{display:none!important;}
#page-location .locx-hint{font-size:10.8px;color:var(--text3);line-height:1.35;}
#page-location .locx-result{display:none;background:var(--bg2);border:1px solid rgba(88,166,255,.30);border-radius:18px;padding:15px;box-shadow:0 10px 30px rgba(0,0,0,.06);}
#page-location .locx-result[style*="display: block"],#page-location .locx-result.show{display:block!important;}
#page-location .locx-result-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px;}
#page-location .locx-result-head:before{content:'Saved location';font-size:10.5px;text-transform:uppercase;letter-spacing:.08em;font-weight:800;color:var(--text3);}
#page-location .locx-result .result-name{font-size:21px!important;line-height:1.2!important;font-family:'DM Mono',monospace!important;font-weight:800!important;color:var(--accent)!important;margin:0!important;}
#page-location .locx-result .meta{background:var(--bg3)!important;border:1px solid var(--border)!important;border-radius:12px!important;padding:11px 12px!important;font-size:11.8px!important;line-height:1.55!important;color:var(--text2)!important;word-break:break-word!important;margin:0 0 10px!important;}
#page-location .locx-result .result-actions{display:grid!important;grid-template-columns:1.2fr 1fr 1fr!important;gap:8px!important;}
#page-location .locx-result .mini{width:100%!important;min-height:43px!important;margin:0!important;border-radius:11px!important;font-size:12px!important;font-weight:800!important;box-shadow:none!important;}
#page-location .locx-result .mini.map{background:var(--accent2)!important;color:#fff!important;border:0!important;}
#page-location .locx-result .mini.share,#page-location .locx-result .mini.copy{background:var(--bg3)!important;color:var(--text)!important;border:1px solid var(--border2)!important;}
#page-location .locx-result .mini.delete{grid-column:1/-1;background:transparent!important;color:var(--red)!important;border:1px solid rgba(248,81,73,.22)!important;min-height:37px!important;}
#page-location .locx-hidden-old{display:none!important;}
#page-location .toast{bottom:calc(20px + env(safe-area-inset-bottom))!important;}
@media(max-width:560px){
  #page-location{padding:15px 14px calc(32px + env(safe-area-inset-bottom))!important;}
  #page-location .locx-shell{gap:12px;}
  #page-location .locx-head{padding-top:1px;}
  #page-location .locx-head h1{font-size:25px;}
  #page-location .locx-head p{font-size:12.8px;}
  #page-location .locx-pin{width:42px;height:42px;flex-basis:42px;border-radius:13px;}
  #page-location .locx-card{padding:13px;border-radius:17px;}
  #page-location .locx-fields{grid-template-columns:42% 1fr;gap:8px;}
  #page-location .locx-field select,#page-location .locx-field input{height:50px!important;}
  #page-location .locx-actions{gap:8px;}
  #page-location .locx-sync{padding:10px 11px;}
  #page-location .locx-sync-copy span{max-width:220px;}
  #page-location .locx-result .result-actions{grid-template-columns:1.25fr 1fr 1fr!important;}
}
@media(max-width:390px){
  #page-location .locx-sync-copy span{max-width:170px;}
  #page-location .locx-actions{grid-template-columns:1fr;}
  #page-location .locx-actions .btn.settings{grid-column:auto;}
  #page-location .locx-import-actions{grid-template-columns:1fr;}
}
`;
    document.head.appendChild(s);
  }

  function rebuild(){
    var page=$('page-location');
    if(!page || page.getAttribute('data-locx-v1')==='1') return;
    var main=page.querySelector('.location-inline-app .location-main');
    if(!main) return;

    var wellName=$('wellName'), wellNo=$('wellNo'), wellPreview=$('wellPreview');
    var searchBtn=$('searchBtn'), saveBtn=$('saveBtn'), settingsBtn=$('settingsBtn'), statusBox=$('statusBox');
    var syncBtn=page.querySelector('#location-offline-sync-card .offline-sync-btn');
    var syncSub=$('offline-sync-sub'), syncCount=$('offline-sync-count');
    var waText=$('waText'), openWaBtn=$('openWaBtn'), pasteWaBtn=$('pasteWaBtn'), extractWaBtn=$('extractWaBtn'), saveWaBtn=$('saveWaBtn');
    var resultBox=$('resultBox'), resultName=$('resultName'), resultMeta=$('resultMeta');
    var mapBtn=$('mapBtn'), copyBtn=$('copyBtn'), shareBtn=$('shareBtn'), deleteBtn=$('deleteBtn');

    if(!wellName||!wellNo||!wellPreview||!searchBtn||!saveBtn||!statusBox||!waText||!resultBox) return;

    addCss();
    page.setAttribute('data-locx-v1','1');

    var shell=el('div','locx-shell');

    var head=el('div','locx-head');
    head.innerHTML='<div><div class="locx-kicker">Field Location</div><h1>Well Location</h1><p>Find a saved well or capture the current GPS in seconds.</p></div><div class="locx-pin" aria-hidden="true">📍</div>';
    shell.appendChild(head);

    var sync=el('div','locx-sync');
    var syncMain=el('div','locx-sync-main');
    syncMain.appendChild(el('span','locx-sync-dot'));
    var syncCopy=el('div','locx-sync-copy');
    syncCopy.appendChild(el('strong','', 'Cloud sync'));
    if(syncSub){ syncSub.removeAttribute('class'); syncSub.className='locx-sync-sub'; syncCopy.appendChild(syncSub); }
    else syncCopy.appendChild(el('span','', 'Ready'));
    syncMain.appendChild(syncCopy);
    sync.appendChild(syncMain);
    if(syncCount) sync.appendChild(syncCount);
    if(syncBtn){ syncBtn.textContent='Sync'; sync.appendChild(syncBtn); }
    shell.appendChild(sync);

    var card=el('section','locx-card');
    card.innerHTML='<div class="locx-card-title"><strong>Find or save a well</strong><span>Shared location database</span></div>';
    var fields=el('div','locx-fields');
    var f1=el('div','locx-field');
    var l1=el('label',''); l1.htmlFor='wellName'; l1.textContent='Well name';
    f1.appendChild(l1); f1.appendChild(wellName);
    var f2=el('div','locx-field');
    var l2=el('label',''); l2.htmlFor='wellNo'; l2.textContent='Well number';
    f2.appendChild(l2); f2.appendChild(wellNo);
    fields.appendChild(f1); fields.appendChild(f2); card.appendChild(fields);

    var idBox=el('div','locx-id');
    idBox.appendChild(el('span','', 'Well ID'));
    idBox.appendChild(wellPreview);
    card.appendChild(idBox);

    var actions=el('div','locx-actions');
    searchBtn.textContent='Search';
    saveBtn.textContent='Save GPS';
    actions.appendChild(searchBtn); actions.appendChild(saveBtn);
    if(settingsBtn){ settingsBtn.textContent='Fix GPS Permission'; actions.appendChild(settingsBtn); }
    card.appendChild(actions);
    statusBox.classList.add('locx-status');
    card.appendChild(statusBox);
    shell.appendChild(card);

    var importBox=document.createElement('details');
    importBox.className='locx-import';
    var summary=document.createElement('summary');
    summary.innerHTML='<div class="locx-import-title"><div class="locx-import-icon">↗</div><div><strong>Import from WhatsApp</strong><small>Paste a message with well ID + coordinates</small></div></div><span class="locx-chevron">⌄</span>';
    importBox.appendChild(summary);
    var importBody=el('div','locx-import-body');
    waText.placeholder='Example: MM-930  Location: 18.123456, 55.123456';
    importBody.appendChild(waText);
    var importActions=el('div','locx-import-actions');
    if(pasteWaBtn){ pasteWaBtn.textContent='Paste Clipboard'; importActions.appendChild(pasteWaBtn); }
    if(saveWaBtn){ saveWaBtn.textContent='Extract & Save'; importActions.appendChild(saveWaBtn); }
    importBody.appendChild(importActions);
    var importFoot=el('div','locx-import-foot');
    if(openWaBtn){ openWaBtn.textContent='Open WhatsApp Group'; importFoot.appendChild(openWaBtn); }
    if(extractWaBtn){ extractWaBtn.textContent='Extract only'; importFoot.appendChild(extractWaBtn); }
    importFoot.appendChild(el('span','locx-hint','Coordinates are detected automatically.'));
    importBody.appendChild(importFoot);
    importBox.appendChild(importBody);
    shell.appendChild(importBox);

    resultBox.classList.add('locx-result');
    var rh=el('div','locx-result-head');
    rh.appendChild(resultName);
    resultBox.insertBefore(rh,resultBox.firstChild);
    if(resultMeta) resultBox.appendChild(resultMeta);
    var ra=resultBox.querySelector('.result-actions') || el('div','result-actions');
    if(mapBtn) ra.appendChild(mapBtn);
    if(shareBtn) ra.appendChild(shareBtn);
    if(copyBtn) ra.appendChild(copyBtn);
    if(deleteBtn) ra.appendChild(deleteBtn);
    resultBox.appendChild(ra);
    shell.appendChild(resultBox);

    main.replaceChildren(shell);

    function updateSync(){
      var copy=syncSub || syncCopy.querySelector('span:last-child');
      var pending=0;
      try{
        var q=JSON.parse(localStorage.getItem('wellOfflineQueue')||'[]');
        pending=Array.isArray(q)?q.length:0;
      }catch(e){}
      if(!navigator.onLine){
        sync.classList.add('offline');
        text(copy,pending?pending+' pending — will sync when online':'Offline — saves will queue automatically');
      }else{
        sync.classList.remove('offline');
        text(copy,pending?pending+' pending item'+(pending===1?'':'s'):'Online · everything synced');
      }
    }

    function syncLegacyStatus(){
      if(syncSub && syncSub.textContent){
        var copy=syncSub || syncCopy.querySelector('span:last-child');
        var t=syncSub.textContent.trim();
        if(t && t.toLowerCase().indexOf('no pending')===-1) text(copy,t);
      }
      if(syncCount && /active/i.test(syncCount.textContent||'')) sync.classList.remove('offline');
    }

    updateSync(); syncLegacyStatus();
    window.addEventListener('online',function(){setTimeout(updateSync,80)});
    window.addEventListener('offline',function(){setTimeout(updateSync,80)});
    if(syncSub) new MutationObserver(function(){updateSync();syncLegacyStatus()}).observe(syncSub,{childList:true,subtree:true,characterData:true});
    if(resultBox) new MutationObserver(function(){
      if(resultBox.style.display==='block') resultBox.classList.add('show');
      else if(resultBox.style.display==='none') resultBox.classList.remove('show');
    }).observe(resultBox,{attributes:true,attributeFilter:['style']});
  }

  function init(){
    rebuild();
    var page=$('page-location');
    if(page && !page.getAttribute('data-locx-v1')) setTimeout(rebuild,250);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
