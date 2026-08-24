/* PCP Hub — Course Renewal mobile hotfix v3.1 */
(function(){
"use strict";
function $(id){return document.getElementById(id)}
function clean(v){return String(v==null?"":v).trim()}
function uid(p){return (p||"id")+"_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,8)}
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
#page-courses button[data-renew-save],#page-courses #crm-save,#page-courses #crm-save-person{position:relative!important;z-index:40!important;pointer-events:auto!important;touch-action:manipulation!important}
#page-courses button[data-renew-save]{width:84px!important;min-width:84px!important;padding-left:8px!important;padding-right:8px!important}
@media(max-width:560px){#page-courses .crm-grid{grid-template-columns:minmax(0,1fr)!important}}
`;
  document.head.appendChild(s);
}
function readArray(key){
  try{var raw=localStorage.getItem(key),v=raw?JSON.parse(raw):[];if(Array.isArray(v))return v}catch(e){}
  try{if(window.PCPStore&&PCPStore.readArray){var a=PCPStore.readArray(key);if(Array.isArray(a))return a}}catch(e){}
  return [];
}
function writeArray(key,v){
  var payload=JSON.stringify(v||[]);
  localStorage.setItem(key,payload);
  if(localStorage.getItem(key)!==payload) throw new Error("Storage verification failed");
  try{if(window.PCPStore&&PCPStore.writeJSON)PCPStore.writeJSON(key,v||[])}catch(e){}
}
function setMsg(text,bad){
  var msg=$("crm-msg");
  if(msg){msg.textContent=text||"";msg.classList.toggle("bad",!!bad)}
}
function saveNewCourse(){
  var empSel=$("crm-employee"),nameEl=$("crm-name"),dateEl=$("crm-expiry");
  var empId=clean(empSel&&empSel.value),name=clean(nameEl&&nameEl.value),expiry=clean(dateEl&&dateEl.value);
  var employees=readArray("crEmployees");
  var emp=employees.find(function(e){return String(e&&e.id||e&&e.empId||e&&e.employeeId||"")===empId})||null;
  if(!emp){setMsg("Choose an employee first.",true);return false}
  if(!name){setMsg("Enter course name.",true);try{nameEl.focus()}catch(e){}return false}
  if(!expiry){setMsg("Choose expiry date.",true);try{dateEl.focus()}catch(e){}return false}
  var id=uid("course");
  var row={id:id,empId:String(empId),employeeId:String(empId),employeeName:clean(emp.name||emp.employeeName)||"Employee",name:name,courseName:name,expiry:expiry,expiryDate:expiry,category:"Other",createdAt:new Date().toISOString()};
  try{
    var list=readArray("crCourses");
    list.push(row);
    writeArray("crCourses",list);
    localStorage.setItem("crCurrentEmployeeId",String(empId));
    var verify=readArray("crCourses").some(function(c){return String(c&&c.id||"")===id});
    if(!verify) throw new Error("Course was not saved");
  }catch(err){
    console.error("[COURSE SAVE HOTFIX]",err);
    setMsg("Could not save this course. Browser storage is blocked.",true);
    return false;
  }
  if(nameEl)nameEl.value="";
  if(dateEl)dateEl.value="";
  setMsg("Course saved ✓",false);
  try{if(window.PCP_COURSE_MOBILE&&PCP_COURSE_MOBILE.render)PCP_COURSE_MOBILE.render()}catch(e){}
  try{if(window.PCPCourseNotify&&PCPCourseNotify.refresh)PCPCourseNotify.refresh()}catch(e){}
  return true;
}
function saveRenew(button){
  var id=String(button.getAttribute("data-renew-save")||"");
  if(!id) return;
  var row=button.closest(".crm-renew");
  var input=row&&row.querySelector('input[type="date"]');
  var date=input&&clean(input.value);
  if(!date){setMsg("Choose the new expiry date.",true);if(input)input.focus();return;}
  var changed=false;
  var list=readArray("crCourses").map(function(c){
    if(String(c&&c.id)!==id) return c;
    changed=true;
    return Object.assign({},c,{expiry:date,expiryDate:date,renewedAt:new Date().toISOString()});
  });
  if(!changed){setMsg("Course record was not found.",true);return;}
  try{writeArray("crCourses",list)}catch(err){setMsg("Could not save. Try again.",true);return;}
  try{if(window.PCPCourseNotify&&PCPCourseNotify.pruneLog)PCPCourseNotify.pruneLog([id])}catch(e){}
  setMsg("Course renewed. New expiry saved.",false);
  try{if(window.PCP_COURSE_MOBILE&&PCP_COURSE_MOBILE.render)PCP_COURSE_MOBILE.render()}catch(e){}
  try{if(window.PCPCourseNotify&&PCPCourseNotify.refresh)PCPCourseNotify.refresh()}catch(e){}
}
function bind(){
  if(document.documentElement.dataset.crmSaveHotfixV31) return;
  document.documentElement.dataset.crmSaveHotfixV31="1";
  document.addEventListener("click",function(e){
    var save=e.target&&e.target.closest&&e.target.closest("#crm-save");
    if(save){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();saveNewCourse();return;}
    var renew=e.target&&e.target.closest&&e.target.closest("button[data-renew-save]");
    if(renew){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();saveRenew(renew);}
  },true);
}
function start(){addStyle();bind()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();
