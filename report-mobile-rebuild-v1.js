/* PCP Hub — Reports mobile rebuild v1 */
(function(){
  'use strict';
  if(window.__PCP_REPORT_REBUILD_V1__) return;
  window.__PCP_REPORT_REBUILD_V1__ = true;

  function $(id){ return document.getElementById(id); }
  function make(tag, cls, html){
    var node=document.createElement(tag);
    if(cls) node.className=cls;
    if(html!=null) node.innerHTML=html;
    return node;
  }

  var FINDING_IDS=[
    'r-po-rotor','r-po-stator','r-po-tubing','r-po-polish','r-po-prclamp',
    'r-po-suckerrods','r-po-ta','r-po-sensor','r-po-cable','r-po-dhgclamp',
    'r-po-drivehead','r-po-bop','r-po-vfd','r-po-panel'
  ];

  function addCss(){
    if($('rpx-mobile-v1-css')) return;
    var s=document.createElement('style');
    s.id='rpx-mobile-v1-css';
    s.textContent=`
#page-report{padding:18px 18px calc(110px + env(safe-area-inset-bottom))!important;}
#page-report>.card{max-width:940px!important;margin:0 auto!important;background:transparent!important;border:0!important;padding:0!important;box-shadow:none!important;}
#page-report .rpx-shell{display:grid;gap:14px;}
#page-report .rpx-head{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;padding:4px 2px 0;}
#page-report .rpx-kicker{font-size:11px;font-weight:800;letter-spacing:.11em;text-transform:uppercase;color:var(--text3);margin-bottom:7px;}
#page-report .rpx-head h1{margin:0;color:var(--text);font-size:27px;line-height:1.14;letter-spacing:-.025em;font-weight:760;}
#page-report .rpx-head p{margin:7px 0 0;color:var(--text2);font-size:13.5px;line-height:1.5;max-width:590px;}
#page-report .rpx-icon{width:46px;height:46px;flex:0 0 46px;border:1px solid var(--border2);background:var(--bg2);border-radius:15px;display:flex;align-items:center;justify-content:center;font-size:21px;}
#page-report .rpx-types{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
#page-report .rpx-type{min-height:78px;text-align:left;border:1px solid var(--border);background:var(--bg2);border-radius:16px;padding:12px;color:var(--text);font-family:'DM Sans',sans-serif;cursor:pointer;transition:border-color .18s,background .18s,transform .12s;}
#page-report .rpx-type:active{transform:scale(.985);}
#page-report .rpx-type.active{border-color:rgba(88,166,255,.58);background:rgba(88,166,255,.09);box-shadow:0 0 0 1px rgba(88,166,255,.08) inset;}
#page-report .rpx-type span{display:block;font-size:19px;line-height:1;margin-bottom:8px;}
#page-report .rpx-type strong{display:block;font-size:13px;font-weight:800;line-height:1.25;}
#page-report .rpx-type small{display:block;margin-top:3px;color:var(--text2);font-size:10.5px;line-height:1.3;}
#page-report .rpx-card{background:var(--bg2);border:1px solid var(--border);border-radius:20px;padding:15px;box-shadow:0 10px 30px rgba(0,0,0,.06);}
#page-report .rpx-card-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:13px;}
#page-report .rpx-card-head strong{font-size:15px;color:var(--text);}
#page-report .rpx-progress{font-size:11px;color:var(--text2);background:var(--bg3);border:1px solid var(--border);border-radius:999px;padding:5px 9px;white-space:nowrap;}
#page-report .report-form{margin:0!important;}
#page-report .report-form>.section-label{font-size:11px!important;margin:1px 0 12px!important;color:var(--text3)!important;letter-spacing:.07em!important;}
#page-report .report-form .field-row{gap:10px!important;margin-bottom:10px!important;}
#page-report .report-form .field{gap:6px!important;}
#page-report .report-form .field label{font-size:10.5px!important;line-height:1.35!important;color:var(--text2)!important;letter-spacing:.055em!important;}
#page-report .report-form input,#page-report .report-form select,#page-report .report-form textarea{font-size:16px!important;border-radius:13px!important;border:1px solid var(--border)!important;background:var(--bg3)!important;color:var(--text)!important;box-shadow:none!important;}
#page-report .report-form input,#page-report .report-form select{min-height:48px!important;padding:10px 12px!important;}
#page-report .report-form textarea{padding:12px!important;line-height:1.5!important;min-height:110px!important;}
#page-report .report-form input:focus,#page-report .report-form select:focus,#page-report .report-form textarea:focus{border-color:var(--accent2)!important;box-shadow:0 0 0 3px rgba(88,166,255,.10)!important;}
#page-report .report-icon{display:none!important;}
#page-report .report-subtitle{margin:18px 0 10px!important;padding-top:14px!important;border-top:1px solid var(--border)!important;color:var(--text)!important;font-size:12px!important;letter-spacing:.06em!important;}
#page-report .findings-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important;margin-top:8px!important;}
#page-report .findings-grid .field{background:var(--bg3);border:1px solid var(--border);border-radius:14px;padding:10px;}
#page-report .findings-grid .field select,#page-report .findings-grid .field input,#page-report .findings-grid .field textarea{background:var(--bg2)!important;}
#page-report .rpx-advanced{margin:12px 0;border:1px solid var(--border);border-radius:14px;background:var(--bg3);overflow:hidden;}
#page-report .rpx-advanced>summary{list-style:none;cursor:pointer;padding:12px 13px;font-size:12px;font-weight:750;color:var(--text2);display:flex;justify-content:space-between;align-items:center;}
#page-report .rpx-advanced>summary::-webkit-details-marker{display:none;}
#page-report .rpx-advanced>summary:after{content:'+';font-size:18px;color:var(--text3);}
#page-report .rpx-advanced[open]>summary:after{content:'–';}
#page-report .rpx-advanced .custom-option-box{margin:0!important;border:0!important;border-top:1px solid var(--border)!important;border-radius:0!important;background:transparent!important;padding:13px!important;}
#page-report .rpx-preview{padding:0!important;overflow:hidden;}
#page-report .rpx-preview summary{list-style:none;cursor:pointer;padding:14px 15px;display:flex;align-items:center;justify-content:space-between;gap:12px;}
#page-report .rpx-preview summary::-webkit-details-marker{display:none;}
#page-report .rpx-preview-title strong{display:block;font-size:14px;color:var(--text);}
#page-report .rpx-preview-title small{display:block;margin-top:3px;font-size:11.5px;color:var(--text2);}
#page-report .rpx-live{font-size:10.5px;color:var(--green);background:rgba(63,185,80,.10);border:1px solid rgba(63,185,80,.22);padding:5px 8px;border-radius:999px;font-weight:800;}
#page-report .rpx-preview-body{padding:0 14px 14px;border-top:1px solid var(--border);}
#page-report #report-output{margin-top:13px!important;min-height:280px!important;font-size:13px!important;border-radius:14px!important;background:var(--bg3)!important;border:1px solid var(--border)!important;padding:13px!important;color:var(--text)!important;line-height:1.55!important;resize:vertical!important;}
#page-report .rpx-preview-actions{display:grid;grid-template-columns:1fr 1fr auto;gap:8px;margin-top:10px;}
#page-report .rpx-preview-actions button{min-height:44px!important;margin:0!important;border-radius:12px!important;font-size:12.5px!important;}
#page-report #whatsapp-report-btn{background:#1f9d58!important;color:#fff!important;}
#page-report #report-status{min-height:0!important;margin-top:8px!important;font-size:11.5px!important;color:var(--text2)!important;}
#page-report .rpx-bottom{position:fixed;left:50%;bottom:calc(12px + env(safe-area-inset-bottom));transform:translateX(-50%);width:min(904px,calc(100% - 28px));z-index:88;display:grid;grid-template-columns:.72fr 1.28fr;gap:9px;padding:9px;background:rgba(22,27,34,.92);border:1px solid var(--border2);border-radius:17px;box-shadow:0 14px 38px rgba(0,0,0,.28);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);}
body.light-mode #page-report .rpx-bottom{background:rgba(255,255,255,.93);}
#page-report .rpx-bottom button{min-height:48px;border-radius:12px;font-family:'DM Sans',sans-serif;font-weight:800;font-size:14px;cursor:pointer;}
#page-report .rpx-preview-btn{background:var(--bg3);border:1px solid var(--border2);color:var(--text);}
#page-report .rpx-share-btn{background:var(--accent2);border:1px solid var(--accent2);color:#fff;}
#page-report .rpx-source-row,#page-report .rpx-old-preview-label{display:none!important;}
@media(max-width:680px){
  #page-report{padding:16px 14px calc(108px + env(safe-area-inset-bottom))!important;}
  #page-report .rpx-head h1{font-size:25px;}
  #page-report .rpx-types{grid-template-columns:1fr 1fr 1fr;gap:7px;}
  #page-report .rpx-type{min-height:72px;padding:10px 8px;}
  #page-report .rpx-type span{font-size:17px;margin-bottom:6px;}
  #page-report .rpx-type strong{font-size:11.5px;}
  #page-report .rpx-type small{display:none;}
  #page-report .report-form .field-row,#page-report .report-form .field-row.triple,#page-report .report-form .field-row.full{grid-template-columns:1fr!important;}
  #page-report .findings-grid{grid-template-columns:1fr!important;}
  #page-report .rpx-preview-actions{grid-template-columns:1fr 1fr!important;}
  #page-report #clear-report-btn{grid-column:1/-1!important;}
}
`;
    document.head.appendChild(s);
  }

  function clearIf(id, exactValues, placeholder){
    var node=$(id);
    if(!node) return;
    var current=String(node.value||'').trim();
    if(exactValues.indexOf(current)!==-1) node.value='';
    if(placeholder && !node.getAttribute('placeholder')) node.setAttribute('placeholder',placeholder);
  }

  function removeDemoValues(){
    clearIf('r-so-well',['MM-1784'],'e.g. MM-1784');
    clearIf('r-so-second',['Hfbu-4'],'Hoist / second line');
    clearIf('r-so-start',['07:30']);
    clearIf('r-so-end',['15:40']);
    clearIf('r-so-spaceout',['20'],'Space out');
    clearIf('r-so-string',['23'],'String weight');
    clearIf('r-so-stickup',['9'],'Stick up');
    clearIf('r-so-engineer',['Ahmed AL Bakri','Ahmed Al Bakri'],'Engineer name');

    clearIf('r-po-well',['MM-930'],'e.g. MM-930');
    clearIf('r-po-hoist',['H-83'],'Hoist / rig');
    clearIf('r-po-arrival',['09:30']);
    clearIf('r-po-start',['13:30']);
    clearIf('r-po-finish',['23:44']);
    clearIf('r-po-runlife',['3246'],'Run life in days');
    clearIf('r-po-fse1',['Ahmed AlBakri','Ahmed Al Bakri'],'Engineer name');
    clearIf('r-po-fse2',['Saif AlSubhi'],'Second engineer (optional)');

    clearIf('r-in-well',['MM-930'],'e.g. MM-930');
    clearIf('r-in-hoist',['H-83'],'Hoist / rig');
    clearIf('r-in-start-time',['23:20']);
    clearIf('r-in-finish-time',['12:20']);
    clearIf('r-in-pa',['64'],'Pa');
    clearIf('r-in-ta',['41.3'],'Ta');
    clearIf('r-in-ra',['285'],'Ra');
    clearIf('r-in-psd',['670'],'Pump setting depth');
    clearIf('r-in-note',['Convert from SLB sensor to zenith.'],'Optional note');
    clearIf('r-in-eng1',['Ahmed AL-bakri','Ahmed AL Bakri'],'Engineer name');
    clearIf('r-in-eng2',['Sameh said'],'Second engineer (optional)');
  }

  function neutralizeFindings(){
    FINDING_IDS.forEach(function(id){
      var sel=$(id);
      if(!sel) return;
      var empty=Array.prototype.slice.call(sel.options).find(function(o){return o.value==='';});
      if(!empty){
        empty=document.createElement('option');
        empty.value='';
        empty.textContent='Select finding…';
        sel.insertBefore(empty,sel.firstChild);
      }
      sel.value='';
    });
  }

  function reportGenerator(){
    if(typeof window.finalGenerateReport==='function') return window.finalGenerateReport;
    if(typeof window.generateReport==='function') return window.generateReport;
    return null;
  }

  function generate(){
    var fn=reportGenerator();
    if(fn) try{ fn(); }catch(e){ console.error('[REPORT REBUILD GENERATE]',e); }
  }

  function activeType(){
    var sel=$('report-type');
    return sel ? (sel.value||'spaceout') : 'spaceout';
  }

  function visibleForm(){
    return $(activeType()==='pullout'?'pullout-report-fields':activeType()==='installation'?'installation-report-fields':'spaceout-report-fields');
  }

  function updateProgress(){
    var badge=$('rpx-progress-v1');
    var form=visibleForm();
    if(!badge||!form) return;
    var fields=Array.prototype.slice.call(form.querySelectorAll('input,select,textarea')).filter(function(n){
      if(n.id==='po-custom-option'||n.id==='po-custom-field') return false;
      return !n.closest('.custom-option-box');
    });
    var relevant=fields.filter(function(n){ return !n.disabled && n.type!=='hidden'; });
    var filled=relevant.filter(function(n){ return String(n.value||'').trim()!==''; }).length;
    badge.textContent=filled+' / '+relevant.length+' filled';
  }

  function syncButtons(){
    var type=activeType();
    document.querySelectorAll('#page-report [data-rpx-type]').forEach(function(btn){
      btn.classList.toggle('active',btn.getAttribute('data-rpx-type')===type);
      btn.setAttribute('aria-pressed',btn.getAttribute('data-rpx-type')===type?'true':'false');
    });
    var title=$('rpx-form-title-v1');
    if(title) title.textContent=type==='pullout'?'Pull Out details':type==='installation'?'Installation details':'Space Out details';
    updateProgress();
  }

  function chooseType(type){
    var sel=$('report-type');
    if(!sel) return;
    sel.value=type;
    sel.dispatchEvent(new Event('change',{bubbles:true}));
    if(typeof window.toggleReportFields==='function') window.toggleReportFields();
    generate();
    syncButtons();
  }

  function openPreview(){
    generate();
    var d=$('rpx-preview-v1');
    if(d){ d.open=true; setTimeout(function(){ d.scrollIntoView({behavior:'smooth',block:'start'}); },40); }
  }

  async function nativeShare(){
    generate();
    var out=$('report-output');
    var txt=out?String(out.value||'').trim():'';
    if(!txt) return;
    if(navigator.share){
      try{
        await navigator.share({title:'PCP Field Report',text:txt});
        var st=$('report-status'); if(st) st.textContent='Shared.';
        return;
      }catch(e){
        if(e && e.name==='AbortError') return;
      }
    }
    if(typeof window.sendWhatsAppReport==='function') window.sendWhatsAppReport();
  }

  function manageAdvanced(){
    var box=document.querySelector('#pullout-report-fields .custom-option-box');
    if(!box||box.closest('.rpx-advanced')) return;
    var details=make('details','rpx-advanced');
    var summary=make('summary','', 'Manage finding options');
    box.parentNode.insertBefore(details,box);
    details.appendChild(summary);
    details.appendChild(box);
  }

  function rebuild(){
    var page=$('page-report');
    var card=page&&page.querySelector(':scope > .card');
    var typeSel=$('report-type');
    var so=$('spaceout-report-fields'), po=$('pullout-report-fields'), ins=$('installation-report-fields');
    var output=$('report-output'), copy=$('copy-report-btn'), wa=$('whatsapp-report-btn'), clear=$('clear-report-btn'), status=$('report-status');
    if(!page||!card||!typeSel||!so||!po||!ins||!output) return;
    if(page.getAttribute('data-rpx-rebuilt')==='1') return;
    page.setAttribute('data-rpx-rebuilt','1');

    addCss();
    removeDemoValues();
    neutralizeFindings();
    manageAdvanced();

    var sourceRow=typeSel.closest('.field-row');
    if(sourceRow) sourceRow.classList.add('rpx-source-row');
    var oldPreview=output.previousElementSibling;
    if(oldPreview && oldPreview.classList.contains('section-label')) oldPreview.classList.add('rpx-old-preview-label');

    var shell=make('div','rpx-shell');
    var head=make('div','rpx-head');
    head.innerHTML='<div><div class="rpx-kicker">Reports</div><h1>Field Reports</h1><p>Choose the job type, enter the field details, then preview or share the finished report.</p></div><div class="rpx-icon">📝</div>';

    var types=make('div','rpx-types');
    types.innerHTML=
      '<button type="button" class="rpx-type" data-rpx-type="spaceout"><span>📏</span><strong>Space Out</strong><small>Spacing & tail</small></button>'+ 
      '<button type="button" class="rpx-type" data-rpx-type="pullout"><span>⬆️</span><strong>Pull Out</strong><small>Findings & run life</small></button>'+ 
      '<button type="button" class="rpx-type" data-rpx-type="installation"><span>🔧</span><strong>Installation</strong><small>Run & final readings</small></button>';

    var formCard=make('section','rpx-card');
    var formHead=make('div','rpx-card-head');
    formHead.innerHTML='<strong id="rpx-form-title-v1">Report details</strong><span class="rpx-progress" id="rpx-progress-v1">0 filled</span>';
    var formHost=make('div','rpx-form-host');
    formCard.appendChild(formHead);
    formCard.appendChild(formHost);
    formHost.appendChild(so); formHost.appendChild(po); formHost.appendChild(ins);

    var preview=make('details','rpx-card rpx-preview');
    preview.id='rpx-preview-v1';
    var sum=make('summary','');
    sum.innerHTML='<div class="rpx-preview-title"><strong>Report Preview</strong><small>Updates automatically as you type</small></div><span class="rpx-live">LIVE</span>';
    var previewBody=make('div','rpx-preview-body');
    output.setAttribute('readonly','readonly');
    previewBody.appendChild(output);
    var acts=make('div','rpx-preview-actions');
    if(copy){ copy.textContent='Copy'; acts.appendChild(copy); }
    if(wa){ wa.textContent='WhatsApp'; acts.appendChild(wa); }
    if(clear){ clear.textContent='Clear Preview'; acts.appendChild(clear); }
    if(status) previewBody.appendChild(status);
    previewBody.insertBefore(acts,status||null);
    preview.appendChild(sum); preview.appendChild(previewBody);

    var bottom=make('div','rpx-bottom');
    var prevBtn=make('button','rpx-preview-btn','Preview');
    prevBtn.type='button'; prevBtn.id='rpx-preview-btn-v1';
    var shareBtn=make('button','rpx-share-btn','Share Report');
    shareBtn.type='button'; shareBtn.id='rpx-share-btn-v1';
    bottom.appendChild(prevBtn); bottom.appendChild(shareBtn);

    shell.appendChild(head); shell.appendChild(types); shell.appendChild(formCard); shell.appendChild(preview); shell.appendChild(bottom);
    card.appendChild(shell);
    if(sourceRow) card.appendChild(sourceRow);
    card.appendChild(typeSel.closest('.field')||typeSel);

    types.addEventListener('click',function(e){
      var btn=e.target.closest('[data-rpx-type]');
      if(btn) chooseType(btn.getAttribute('data-rpx-type'));
    });
    prevBtn.addEventListener('click',openPreview);
    shareBtn.addEventListener('click',nativeShare);
    page.addEventListener('input',function(){ setTimeout(updateProgress,0); });
    page.addEventListener('change',function(e){
      if(e.target===typeSel) syncButtons();
      setTimeout(updateProgress,0);
    });

    chooseType(typeSel.value||'spaceout');
    setTimeout(function(){ generate(); updateProgress(); },60);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',rebuild,{once:true});
  else rebuild();
})();