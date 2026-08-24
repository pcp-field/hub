/* PCP Hub — direct Course Renewal save handler v5 */
(function(){
"use strict";
if(window.__PCP_COURSE_SAVE_V5__) return;
window.__PCP_COURSE_SAVE_V5__=true;
var lastSaveAt=0;
function $(id){return document.getElementById(id)}
function clean(v){return String(v==null?"":v).trim()}
function uid(){return "course_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,8)}
function readArray(key){
  try{var raw=localStorage.getItem(key);var v=raw?JSON.parse(raw):[];return Array.isArray(v)?v:[]}catch(e){return[]}
}
function show(text,bad){
  var el=$("crm-msg");
  if(el){el.textContent=text;el.classList.toggle("bad",!!bad);el.scrollIntoView({block:"nearest"});}
  else if(bad) alert(text);
}
function saveNow(){
  var now=Date.now(); if(now-lastSaveAt<700) return false; lastSaveAt=now;
  var empSel=$("crm-employee"),nameEl=$("crm-name"),dateEl=$("crm-expiry");
  if(!empSel||!nameEl||!dateEl){show("Save form is not ready. Reload the page once.",true);return false;}
  var empId=clean(empSel.value),name=clean(nameEl.value),expiry=clean(dateEl.value);
  var employees=readArray("crEmployees");
  var emp=employees.find(function(e){return String((e&& (e.id||e.empId||e.employeeId))||"")===empId});
  if(!emp){show("Choose an employee first.",true);return false;}
  if(!name){show("Enter course name.",true);nameEl.focus();return false;}
  if(!expiry){show("Choose expiry date.",true);dateEl.focus();return false;}
  var id=uid();
  var row={id:id,empId:empId,employeeId:empId,employeeName:clean(emp.name||emp.employeeName)||"Employee",name:name,courseName:name,expiry:expiry,expiryDate:expiry,category:"Other",createdAt:new Date().toISOString()};
  try{
    var list=readArray("crCourses");
    list.push(row);
    var payload=JSON.stringify(list);
    localStorage.setItem("crCourses",payload);
    localStorage.setItem("crCurrentEmployeeId",empId);
    localStorage.setItem("crMobileOpenEmployeeId",empId);
    var verify=readArray("crCourses");
    if(!verify.some(function(c){return String(c&&c.id||"")===id;})) throw new Error("Verification failed");
    try{if(window.PCPStore&&typeof PCPStore.writeJSON==="function")PCPStore.writeJSON("crCourses",verify)}catch(ignore){}
  }catch(err){
    console.error("[COURSE SAVE V5]",err);
    show("Could not save. iPhone/Safari is blocking site storage. Open PCP Hub in normal Safari (not Private Browsing) and try again.",true);
    return false;
  }
  nameEl.value=""; dateEl.value="";
  try{if(window.PCP_COURSE_MOBILE&&typeof PCP_COURSE_MOBILE.render==="function")PCP_COURSE_MOBILE.render();}catch(e){}
  try{if(window.PCPCourseNotify&&typeof PCPCourseNotify.refresh==="function")PCPCourseNotify.refresh();}catch(e){}
  setTimeout(function(){show("Course saved ✓",false)},30);
  return true;
}
function stopAndSave(e){
  var b=e.target&&e.target.closest?e.target.closest("#crm-save"):null;
  if(!b) return;
  e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation)e.stopImmediatePropagation();
  saveNow();
}
document.addEventListener("pointerup",stopAndSave,true);
document.addEventListener("click",stopAndSave,true);
document.addEventListener("touchend",stopAndSave,true);
function bindButton(){
  var b=$("crm-save"); if(!b||b.dataset.saveV5) return;
  b.dataset.saveV5="1";
  b.style.pointerEvents="auto"; b.style.position="relative"; b.style.zIndex="99";
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bindButton,{once:true}); else bindButton();
new MutationObserver(bindButton).observe(document.documentElement,{childList:true,subtree:true});
setTimeout(bindButton,300); setTimeout(bindButton,1200);
})();
