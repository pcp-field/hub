/* PCP Hub — direct Files manager sharing/rename v7 */
(function(){
"use strict";
if(window.__PCP_FILES_V7__) return;
window.__PCP_FILES_V7__ = true;

var DB_NAME = "PCPFieldReportsHubLocalFilesDB";
var STORE = "pdfFiles";
var dbPromise = null;
var records = new Map();
var prepared = new Map();
var selected = new Set();
var refreshTimer = null;

function $(id){ return document.getElementById(id); }
function clean(v){ return String(v == null ? "" : v).trim(); }
function status(msg){ var el=$("files-status"); if(el) el.textContent=msg||""; }
function ext(name){ var m=/\.([A-Za-z0-9]{1,12})$/.exec(clean(name)); return m?m[1].toLowerCase():""; }
function hasExt(name){ return /\.[A-Za-z0-9]{1,12}$/.test(clean(name)); }
function safeName(name){
  var n=clean(name||"attachment").replace(/[\\/:*?"<>|]/g,"_").replace(/[\u0000-\u001f]/g,"");
  return n || "attachment";
}
function mimeFromExt(name){
  var e=ext(name);
  return ({pdf:"application/pdf",png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",gif:"image/gif",webp:"image/webp",heic:"image/heic",heif:"image/heif",txt:"text/plain",csv:"text/csv",json:"application/json",zip:"application/zip",doc:"application/msword",docx:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",xls:"application/vnd.ms-excel",xlsx:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",ppt:"application/vnd.ms-powerpoint",pptx:"application/vnd.openxmlformats-officedocument.presentationml.presentation"})[e] || "";
}
function extFromMime(type){
  return ({"application/pdf":"pdf","image/png":"png","image/jpeg":"jpg","image/gif":"gif","image/webp":"webp","image/heic":"heic","image/heif":"heif","text/plain":"txt","text/csv":"csv","application/json":"json","application/zip":"zip","application/msword":"doc","application/vnd.openxmlformats-officedocument.wordprocessingml.document":"docx","application/vnd.ms-excel":"xls","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":"xlsx","application/vnd.ms-powerpoint":"ppt","application/vnd.openxmlformats-officedocument.presentationml.presentation":"pptx"})[String(type||"").toLowerCase()] || "";
}
function openDb(){
  if(dbPromise) return dbPromise;
  dbPromise = new Promise(function(resolve,reject){
    var req=indexedDB.open(DB_NAME,1);
    req.onupgradeneeded=function(e){ var db=e.target.result; if(!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE,{keyPath:"id"}); };
    req.onsuccess=function(){ resolve(req.result); };
    req.onerror=function(){ reject(req.error); };
  });
  return dbPromise;
}
function getAll(){
  return openDb().then(function(db){ return new Promise(function(resolve,reject){
    var req=db.transaction(STORE,"readonly").objectStore(STORE).getAll();
    req.onsuccess=function(){ resolve(req.result||[]); };
    req.onerror=function(){ reject(req.error); };
  });});
}
function put(rec){
  return openDb().then(function(db){ return new Promise(function(resolve,reject){
    var req=db.transaction(STORE,"readwrite").objectStore(STORE).put(rec);
    req.onsuccess=function(){ resolve(rec); };
    req.onerror=function(){ reject(req.error); };
  });});
}
function bytesEqual(a,b){ if(a.length<b.length) return false; for(var i=0;i<b.length;i++) if(a[i]!==b[i]) return false; return true; }
async function sniff(blob){
  if(!blob || typeof blob.slice!=="function") return "";
  try{
    var buf=await blob.slice(0,16).arrayBuffer(), u=new Uint8Array(buf);
    if(u.length>=4 && u[0]===0x25 && u[1]===0x50 && u[2]===0x44 && u[3]===0x46) return "application/pdf";
    if(bytesEqual(u,[0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a])) return "image/png";
    if(u.length>=3 && u[0]===0xff && u[1]===0xd8 && u[2]===0xff) return "image/jpeg";
    if(u.length>=6 && String.fromCharCode.apply(null,Array.from(u.slice(0,6))).indexOf("GIF8")===0) return "image/gif";
    if(u.length>=12 && String.fromCharCode.apply(null,Array.from(u.slice(0,4)))==="RIFF" && String.fromCharCode.apply(null,Array.from(u.slice(8,12)))==="WEBP") return "image/webp";
  }catch(e){}
  return "";
}
async function prepareRecord(rec){
  if(!rec || !rec.blob) return null;
  var sniffed=await sniff(rec.blob);
  var name=safeName(rec.name || (rec.blob && rec.blob.name) || "attachment");
  var byExt=mimeFromExt(name);
  var stored=clean(rec.type || (rec.blob && rec.blob.type)).toLowerCase();
  var type=sniffed || byExt || stored || "application/octet-stream";
  if(!hasExt(name)){ var suffix=extFromMime(type); if(suffix) name += "."+suffix; }
  try{return new File([rec.blob],name,{type:type,lastModified:(rec.blob&&rec.blob.lastModified)||Date.now()});}catch(e){return null;}
}
async function refreshCache(){
  try{
    var rows=await getAll();
    records.clear(); prepared.clear();
    rows.forEach(function(r){ records.set(String(r.id),r); });
    await Promise.all(rows.map(async function(r){ var f=await prepareRecord(r); if(f) prepared.set(String(r.id),f); }));
    Array.from(selected).forEach(function(id){ if(!records.has(String(id))) selected.delete(String(id)); });
    patchUi();
  }catch(err){ console.error("[FILES V7 CACHE]",err); status("Could not read saved files on this device."); }
}
function download(file){
  if(!file) return;
  var url=URL.createObjectURL(file), a=document.createElement("a");
  a.href=url; a.download=file.name||"attachment"; a.style.display="none";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function(){ URL.revokeObjectURL(url); },60000);
}
function nativeShare(files){
  files=(files||[]).filter(Boolean);
  if(!files.length){ status("File is still preparing. Tap Share again."); refreshCache(); return; }
  var payload={files:files};
  var can=!!(navigator.share && (!navigator.canShare || navigator.canShare(payload)));
  if(!can){ files.forEach(download); status(files.length+" file(s) downloaded. Share them from Files/Downloads."); return; }
  var p;
  try{ p=navigator.share(payload); }
  catch(err){ console.warn("[FILES V7 SHARE]",err); files.forEach(download); status("Direct sharing is not available here. File downloaded instead."); return; }
  Promise.resolve(p).then(function(){ status(files.length===1?"Share sheet opened.":files.length+" files sent to the share sheet."); })
    .catch(function(err){ if(err && err.name==="AbortError"){ status("Sharing canceled."); return; } console.warn("[FILES V7 SHARE]",err); status("That app could not accept the attachment. Try WhatsApp again, Files, Mail or AirDrop."); });
}
function shareOne(id){ nativeShare([prepared.get(String(id))]); }
function shareSelected(){
  var ids=Array.from(selected), files=ids.map(function(id){return prepared.get(String(id));}).filter(Boolean);
  if(!ids.length){ status("Select at least one file first."); return; }
  if(files.length!==ids.length){ status("Files are still preparing. Tap Share selected again."); refreshCache(); return; }
  nativeShare(files);
}
function selectAll(on){
  selected.clear();
  if(on) records.forEach(function(_,id){selected.add(String(id));});
  document.querySelectorAll("#file-list .select-icon[data-file-id]").forEach(function(cb){cb.checked=selected.has(String(cb.getAttribute("data-file-id")));});
  updateToolbar();
}
function updateToolbar(){
  var n=selected.size, share=$("files-share-selected-v7"), count=$("files-selected-v7"), all=$("files-select-all-v7");
  if(share){ share.disabled=!n; share.textContent=n?"Share selected ("+n+")":"Share selected"; }
  if(count) count.textContent=n?n+" selected":"Select files to share together";
  if(all) all.checked=records.size>0 && n===records.size;
}
function rename(id){
  var rec=records.get(String(id)); if(!rec) return;
  var current=safeName(rec.name || "attachment.pdf"), extension=ext(current), suffix=extension?"."+extension:"";
  var base=suffix?current.slice(0,-suffix.length):current;
  var next=window.prompt("File name",base); if(next===null) return;
  next=clean(next).replace(/[\\/:*?"<>|]/g,"_");
  if(!next){ status("Enter a file name."); return; }
  if(suffix && next.toLowerCase().endsWith(suffix.toLowerCase())) next=next.slice(0,-suffix.length);
  rec=Object.assign({},rec,{name:safeName(next+suffix)});
  put(rec).then(function(){ records.set(String(id),rec); return prepareRecord(rec); })
    .then(function(file){ if(file) prepared.set(String(id),file); status("Renamed to "+rec.name+"."); if(typeof window.loadFilesFromDb==="function") return window.loadFilesFromDb(); })
    .then(function(){ setTimeout(function(){patchUi();},60); })
    .catch(function(err){ console.error("[FILES V7 RENAME]",err); status("Could not rename this file."); });
}
function patchRow(item){
  var cb=item.querySelector(".select-icon[data-file-id]");
  var id=cb&&cb.getAttribute("data-file-id");
  if(!id){ var any=item.querySelector("[data-file-id]"); id=any&&any.getAttribute("data-file-id"); }
  if(!id) return;
  if(cb) cb.checked=selected.has(String(id));
  var actions=item.querySelector(".file-row-actions");
  if(actions && !actions.querySelector('[data-files-v7="rename"]')){
    var b=document.createElement("button"); b.type="button"; b.className="file-mini-btn";
    b.setAttribute("data-files-v7","rename"); b.setAttribute("data-file-id",id); b.textContent="Rename";
    var share=actions.querySelector('[data-file-action="share"], [data-action="share"]');
    actions.insertBefore(b,share||actions.firstChild);
  }
  var shareBtn=item.querySelector('[data-file-action="share"], [data-action="share"]'); if(shareBtn) shareBtn.textContent="Share";
}
function patchUi(){
  var input=$("file-input"); if(input){ input.multiple=true; input.setAttribute("multiple","multiple"); }
  var box=$("file-list"); if(!box) return;
  var parent=box.parentNode;
  if(parent && !$("files-toolbar-v7")){
    var bar=document.createElement("div"); bar.id="files-toolbar-v7";
    bar.innerHTML='<label class="files-v7-check"><input id="files-select-all-v7" type="checkbox"> <span>Select all</span></label><button id="files-share-selected-v7" type="button" disabled>Share selected</button><span id="files-selected-v7">Select files to share together</span>';
    parent.insertBefore(bar,box);
  }
  box.querySelectorAll(".file-item").forEach(patchRow);
  updateToolbar();
}
function addCss(){
  if($("files-v7-css")) return;
  var s=document.createElement("style"); s.id="files-v7-css";
  s.textContent=`#files-toolbar-v7{display:grid;grid-template-columns:auto minmax(150px,1fr);gap:9px 10px;align-items:center;margin:12px 0;padding:10px;border:1px solid var(--border);border-radius:12px;background:var(--bg2)}#files-toolbar-v7 .files-v7-check{display:flex;align-items:center;gap:7px;color:var(--text2);font-size:12px;white-space:nowrap}#files-toolbar-v7 input{width:18px;height:18px}#files-share-selected-v7{min-height:44px;border:0;border-radius:10px;padding:9px 14px;background:var(--accent2);color:#fff;font-weight:800;font-family:'DM Sans',sans-serif;cursor:pointer}#files-share-selected-v7:disabled{opacity:.4;cursor:default}#files-selected-v7{grid-column:1/-1;font-size:11.5px;color:var(--text3)}#page-files .file-item{min-width:0}#page-files .file-item>div{min-width:0}#page-files .file-name{overflow:hidden;text-overflow:ellipsis;word-break:break-word}#page-files .file-row-actions{display:flex!important;flex-wrap:wrap!important;gap:7px!important}#page-files .file-mini-btn{min-height:40px!important;padding:8px 10px!important;touch-action:manipulation}@media(max-width:560px){#files-toolbar-v7{grid-template-columns:1fr}#files-toolbar-v7 .files-v7-check{min-height:38px}#files-share-selected-v7{width:100%}#files-selected-v7{grid-column:auto}#page-files .file-row-actions .file-mini-btn{flex:1 1 calc(50% - 7px);min-width:0}}`;
  document.head.appendChild(s);
}
function handleClick(e){
  var renameBtn=e.target&&e.target.closest?e.target.closest('[data-files-v7="rename"]'):null;
  if(renameBtn){ e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation)e.stopImmediatePropagation(); rename(renameBtn.getAttribute("data-file-id")); return; }
  var bulk=e.target&&e.target.closest?e.target.closest("#files-share-selected-v7"):null;
  if(bulk){ e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation)e.stopImmediatePropagation(); shareSelected(); return; }
  var share=e.target&&e.target.closest?e.target.closest('#file-list [data-file-action="share"],#file-list [data-action="share"]'):null;
  if(share){ e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation)e.stopImmediatePropagation(); shareOne(share.getAttribute("data-file-id")); return; }
  var dl=e.target&&e.target.closest?e.target.closest('#file-list [data-file-action="download"],#file-list [data-action="download"]'):null;
  if(dl){ e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation)e.stopImmediatePropagation(); var f=prepared.get(String(dl.getAttribute("data-file-id"))); if(f) download(f); else {status("File is still preparing. Tap Download again.");refreshCache();} return; }
}
function handleChange(e){
  var t=e.target;
  if(t && t.id==="files-select-all-v7"){ selectAll(!!t.checked); return; }
  if(t && t.matches && t.matches("#file-list .select-icon[data-file-id]")){ var id=String(t.getAttribute("data-file-id")); if(t.checked) selected.add(id); else selected.delete(id); updateToolbar(); return; }
  if(t && t.id==="file-input"){ setTimeout(refreshCache,120); setTimeout(refreshCache,700); }
}
function observe(){
  var list=$("file-list"); if(!list || list.dataset.filesV7Observed) return;
  list.dataset.filesV7Observed="1";
  new MutationObserver(function(){ clearTimeout(refreshTimer); refreshTimer=setTimeout(function(){patchUi();refreshCache();},80); }).observe(list,{childList:true,subtree:true});
}
function init(){
  addCss(); patchUi(); observe(); refreshCache();
  document.addEventListener("click",handleClick,true);
  document.addEventListener("change",handleChange,true);
  document.addEventListener("visibilitychange",function(){ if(document.visibilityState==="visible") refreshCache(); });
  setTimeout(function(){patchUi();observe();refreshCache();},500);
}
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init,{once:true}); else init();
})();