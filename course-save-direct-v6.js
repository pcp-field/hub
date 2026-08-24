/* PCP Hub — direct Course Renewal save + calendar handoff v6 */
(function(){
"use strict";
if(window.__PCP_COURSE_SAVE_V6__) return;
window.__PCP_COURSE_SAVE_V6__=true;
var lastActionAt=0;
function $(id){return document.getElementById(id)}
function clean(v){return String(v==null?"":v).trim()}
function uid(){return "course_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,8)}
function readArray(key){try{var raw=localStorage.getItem(key),v=raw?JSON.parse(raw):[];return Array.isArray(v)?v:[]}catch(e){return[]}}
function writeArray(key,v){var payload=JSON.stringify(v||[]);localStorage.setItem(key,payload);if(localStorage.getItem(key)!==payload)throw new Error("Storage verification failed");try{if(window.PCPStore&&typeof PCPStore.writeJSON==="function")PCPStore.writeJSON(key,v||[])}catch(ignore){}}
function show(text,bad){var el=$("crm-msg");if(el){el.textContent=text;el.classList.toggle("bad",!!bad);try{el.scrollIntoView({block:"nearest"})}catch(e){}}else if(bad)alert(text)}
function isIOS(){return /iPad|iPhone|iPod/i.test(navigator.userAgent||"")||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1)}
function isAndroid(){return /Android/i.test(navigator.userAgent||"")}
function escICS(s){return String(s||"").replace(/\\/g,"\\\\").replace(/\r?\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;")}
function stamp(){var d=new Date();return d.getUTCFullYear()+String(d.getUTCMonth()+1).padStart(2,"0")+String(d.getUTCDate()).padStart(2,"0")+"T"+String(d.getUTCHours()).padStart(2,"0")+String(d.getUTCMinutes()).padStart(2,"0")+String(d.getUTCSeconds()).padStart(2,"0")+"Z"}
function dt(exp,h){return String(exp||"").replace(/-/g,"")+"T"+String(h||9).padStart(2,"0")+"0000"}
function makeICS(row){
 var title="Course renewal: "+clean(row.name||row.courseName||"Course")+" — "+clean(row.employeeName||"Employee");
 var lines=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//PCP Hub//Course Renewal//EN","CALSCALE:GREGORIAN","METHOD:PUBLISH","BEGIN:VEVENT","UID:"+escICS(String(row.id||uid()))+"@pcp-hub","DTSTAMP:"+stamp(),"DTSTART:"+dt(row.expiry||row.expiryDate,9),"DTEND:"+dt(row.expiry||row.expiryDate,10),"SUMMARY:"+escICS(title),"DESCRIPTION:"+escICS("Course expiry reminder. Expiry: "+(row.expiry||row.expiryDate||""))];
 [30,14,7,3,1,0].forEach(function(n){lines.push("BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:"+escICS(title),"TRIGGER:"+(n===0?"-PT1H":"-P"+n+"D"),"END:VALARM")});
 lines.push("END:VEVENT","END:VCALENDAR");
 return lines.join("\r\n")+"\r\n";
}
function openCalendar(row){
 if(!row||(!isIOS()&&!isAndroid()))return;
 try{
   var blob=new Blob([makeICS(row)],{type:"text/calendar;charset=utf-8"});
   var url=URL.createObjectURL(blob);
   show("Course saved ✓ Opening Calendar…",false);
   /* No download attribute: mobile Safari/Android can hand text/calendar to the calendar/file handler. */
   window.location.href=url;
   setTimeout(function(){try{URL.revokeObjectURL(url)}catch(e){}},120000);
 }catch(err){console.warn("[CALENDAR AUTO OPEN V6]",err);show("Course saved ✓ Tap Add reminders to phone calendar.",false)}
}
function saveNow(){
 var empSel=$("crm-employee"),nameEl=$("crm-name"),dateEl=$("crm-expiry");
 if(!empSel||!nameEl||!dateEl){show("Save form is not ready. Reload the page once.",true);return false}
 var empId=clean(empSel.value),name=clean(nameEl.value),expiry=clean(dateEl.value),employees=readArray("crEmployees");
 var emp=employees.find(function(e){return String((e&&(e.id||e.empId||e.employeeId))||"")===empId});
 if(!emp){show("Choose an employee first.",true);return false}
 if(!name){show("Enter course name.",true);try{nameEl.focus()}catch(e){}return false}
 if(!expiry){show("Choose expiry date.",true);try{dateEl.focus()}catch(e){}return false}
 var row={id:uid(),empId:empId,employeeId:empId,employeeName:clean(emp.name||emp.employeeName)||"Employee",name:name,courseName:name,expiry:expiry,expiryDate:expiry,category:"Other",createdAt:new Date().toISOString()};
 try{
   var list=readArray("crCourses");list.push(row);writeArray("crCourses",list);
   localStorage.setItem("crCurrentEmployeeId",empId);localStorage.setItem("crMobileOpenEmployeeId",empId);
   if(!readArray("crCourses").some(function(c){return String(c&&c.id||"")===row.id}))throw new Error("Verification failed");
 }catch(err){console.error("[COURSE SAVE V6]",err);show("Could not save. This browser is blocking site storage.",true);return false}
 nameEl.value="";dateEl.value="";
 try{if(window.PCP_COURSE_MOBILE&&typeof PCP_COURSE_MOBILE.render==="function")PCP_COURSE_MOBILE.render()}catch(e){}
 try{if(window.PCPCourseNotify&&typeof PCPCourseNotify.refresh==="function")PCPCourseNotify.refresh()}catch(e){}
 openCalendar(row);
 if(!isIOS()&&!isAndroid())setTimeout(function(){show("Course saved ✓",false)},20);
 return true;
}
function renewNow(button){
 var id=String(button.getAttribute("data-renew-save")||"");if(!id)return false;
 var rowEl=button.closest(".crm-renew"),input=rowEl&&rowEl.querySelector('input[type="date"]'),date=clean(input&&input.value);
 if(!date){show("Choose the new expiry date.",true);if(input)input.focus();return false}
 var changed=null,list=readArray("crCourses").map(function(c){if(String(c&&c.id||"")!==id)return c;changed=Object.assign({},c,{expiry:date,expiryDate:date,renewedAt:new Date().toISOString()});return changed});
 if(!changed){show("Course record was not found.",true);return false}
 try{writeArray("crCourses",list)}catch(err){console.error("[COURSE RENEW V6]",err);show("Could not save the new expiry date.",true);return false}
 try{if(window.PCPCourseNotify&&PCPCourseNotify.pruneLog)PCPCourseNotify.pruneLog([id])}catch(e){}
 try{if(window.PCP_COURSE_MOBILE&&typeof PCP_COURSE_MOBILE.render==="function")PCP_COURSE_MOBILE.render()}catch(e){}
 try{if(window.PCPCourseNotify&&PCPCourseNotify.refresh)PCPCourseNotify.refresh()}catch(e){}
 openCalendar(changed);
 if(!isIOS()&&!isAndroid())show("Course renewed ✓",false);
 return true;
}
function handle(e){
 var save=e.target&&e.target.closest?e.target.closest("#crm-save"):null;
 var renew=e.target&&e.target.closest?e.target.closest("button[data-renew-save]"):null;
 if(!save&&!renew)return;
 var now=Date.now();if(now-lastActionAt<650){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();return}lastActionAt=now;
 e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();
 if(save)saveNow();else renewNow(renew);
}
document.addEventListener("pointerup",handle,true);
document.addEventListener("click",handle,true);
document.addEventListener("touchend",handle,true);
function bind(){var b=$("crm-save");if(b){b.style.pointerEvents="auto";b.style.position="relative";b.style.zIndex="99";b.title="Save course and open Calendar"}}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind,{once:true});else bind();
new MutationObserver(bind).observe(document.documentElement,{childList:true,subtree:true});
setTimeout(bind,300);setTimeout(bind,1200);
})();