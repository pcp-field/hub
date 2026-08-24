/* PCP Hub — Course Renewal mobile hotfix v3 */
(function(){
"use strict";
function addStyle(){
  if(document.getElementById("crm-mobile-hotfix-v3")) return;
  var s=document.createElement("style");
  s.id="crm-mobile-hotfix-v3";
  s.textContent=`
#page-courses .crm-grid,#page-courses .crm-field,#page-courses .crm-main,#page-courses .crm-renew{min-width:0!important}
#page-courses .crm-grid{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important}
#page-courses .crm-grid>*{min-width:0!important;max-width:100%!important}
#page-courses .crm-input,#page-courses .crm-select{box-sizing:border-box!important;display:block!important;width:100%!important;max-width:100%!important;min-width:0!important}
#page-courses input[type="date"].crm-input{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow:hidden!important}
#page-courses .crm-renew{grid-template-columns:minmax(0,1fr) 84px!important;gap:7px!important;width:100%!important;max-width:100%!important}
#page-courses .crm-renew>*{min-width:0!important;max-width:100%!important}
#page-courses button[data-renew-save],#page-courses #crm-save,#page-courses #crm-save-person{position:relative!important;z-index:20!important;pointer-events:auto!important;touch-action:manipulation!important}
#page-courses button[data-renew-save]{width:84px!important;min-width:84px!important;padding-left:8px!important;padding-right:8px!important}
@media(max-width:560px){#page-courses .crm-grid{grid-template-columns:minmax(0,1fr)!important}}
`;
  document.head.appendChild(s);
}
function readCourses(){
  try{
    if(window.PCPStore&&PCPStore.readArray) return PCPStore.readArray("crCourses");
    var v=JSON.parse(localStorage.getItem("crCourses")||"[]");
    return Array.isArray(v)?v:[];
  }catch(e){return[]}
}
function writeCourses(v){
  if(window.PCPStore&&PCPStore.writeJSON) return PCPStore.writeJSON("crCourses",v);
  localStorage.setItem("crCourses",JSON.stringify(v));
}
function saveRenew(button){
  var id=String(button.getAttribute("data-renew-save")||"");
  if(!id) return;
  var row=button.closest(".crm-renew");
  var input=row&&row.querySelector('input[type="date"]');
  var date=input&&String(input.value||"").trim();
  var msg=document.getElementById("crm-msg");
  if(!date){ if(msg){msg.textContent="Choose the new expiry date.";msg.classList.add("bad");} if(input) input.focus(); return; }
  var changed=false;
  var list=readCourses().map(function(c){
    if(String(c&&c.id)!==id) return c;
    changed=true;
    return Object.assign({},c,{expiry:date,expiryDate:date,renewedAt:new Date().toISOString()});
  });
  if(!changed) return;
  try{writeCourses(list);}catch(err){if(msg){msg.textContent="Could not save. Try again.";msg.classList.add("bad");}return;}
  try{if(window.PCPCourseNotify&&PCPCourseNotify.pruneLog)PCPCourseNotify.pruneLog([id]);}catch(e){}
  if(msg){msg.textContent="Course renewed. New expiry saved.";msg.classList.remove("bad");}
  try{if(window.PCP_COURSE_MOBILE&&PCP_COURSE_MOBILE.render)PCP_COURSE_MOBILE.render();}catch(e){}
  try{if(window.PCPCourseNotify)PCPCourseNotify.refresh();}catch(e){}
}
function bind(){
  if(document.documentElement.dataset.crmSaveHotfixV3) return;
  document.documentElement.dataset.crmSaveHotfixV3="1";
  document.addEventListener("click",function(e){
    var b=e.target&&e.target.closest&&e.target.closest("button[data-renew-save]");
    if(!b) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    saveRenew(b);
  },true);
}
function start(){addStyle();bind();}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();
