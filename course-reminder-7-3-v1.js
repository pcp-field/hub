/* PCP Hub — Course reminders: 7 days + 3 days only */
(function(){
  'use strict';
  if(window.__PCP_COURSE_REMINDER_73_V1__) return;
  window.__PCP_COURSE_REMINDER_73_V1__ = true;

  var SETTINGS_KEY='crxNotifySettings';
  var DB_NAME='PCPCourseNotify', DB_VERSION=1, DB_STORE='state';

  function readJSON(key,fallback){
    try{ var v=JSON.parse(localStorage.getItem(key)||'null'); return v==null?fallback:v; }
    catch(e){ return fallback; }
  }
  function writeJSON(key,value){
    try{ localStorage.setItem(key,JSON.stringify(value)); return true; }
    catch(e){ console.error('[COURSE REMINDER SETTINGS]',e); return false; }
  }
  function reminderSettings(){
    var old=readJSON(SETTINGS_KEY,{})||{};
    return {
      enabled: !!old.enabled,
      declined: !!old.declined,
      thresholds:{'30':false,'14':false,'7':true,'3':true,'1':false,'0':false,expired:false}
    };
  }
  function mirrorSettings(settings){
    if(!('indexedDB' in window)) return;
    try{
      var r=indexedDB.open(DB_NAME,DB_VERSION);
      r.onupgradeneeded=function(e){var db=e.target.result;if(!db.objectStoreNames.contains(DB_STORE))db.createObjectStore(DB_STORE,{keyPath:'key'});};
      r.onsuccess=function(){
        var db=r.result;
        try{var tx=db.transaction(DB_STORE,'readwrite');tx.objectStore(DB_STORE).put({key:'settings',value:settings});tx.oncomplete=function(){db.close();};tx.onerror=function(){db.close();};}
        catch(e){try{db.close();}catch(_){}}
      };
    }catch(e){}
  }
  function applySettings(){
    var s=reminderSettings();
    writeJSON(SETTINGS_KEY,s);
    mirrorSettings(s);
    try{ if(window.PCPCourseNotify && typeof window.PCPCourseNotify.refresh==='function') window.PCPCourseNotify.refresh(); }catch(e){}
  }

  function arr(key){
    try{
      if(window.PCPStore&&typeof window.PCPStore.readArray==='function') return window.PCPStore.readArray(key);
      var v=JSON.parse(localStorage.getItem(key)||'[]'); return Array.isArray(v)?v:[];
    }catch(e){return[];}
  }
  function esc(s){return String(s||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');}
  function stamp(){var d=new Date();return d.getUTCFullYear()+String(d.getUTCMonth()+1).padStart(2,'0')+String(d.getUTCDate()).padStart(2,'0')+'T'+String(d.getUTCHours()).padStart(2,'0')+String(d.getUTCMinutes()).padStart(2,'0')+String(d.getUTCSeconds()).padStart(2,'0')+'Z';}
  function dt(exp){return String(exp||'').replace(/-/g,'')+'T090000';}
  function msg(text,bad){var el=document.getElementById('crm-msg');if(el){el.textContent=text||'';el.classList.toggle('bad',!!bad);}}

  function buildCalendar(){
    var emps={}; arr('crEmployees').forEach(function(e){if(e&&e.id)emps[String(e.id)]=String(e.name||'Employee');});
    var courses=arr('crCourses').map(function(c){return Object.assign({},c,{empId:String(c.empId||c.employeeId||''),name:String(c.name||c.courseName||''),expiry:String(c.expiry||c.expiryDate||'')});}).filter(function(c){return c.id&&c.name&&/^\d{4}-\d{2}-\d{2}$/.test(c.expiry);});
    if(!courses.length){msg('Add a course first.',true);return false;}

    /* Native Android bridge, when the APK provides it: one permission grant,
       then future saves/renewals can sync without opening a calendar screen. */
    try{
      if(window.AndroidCalendar && typeof window.AndroidCalendar.syncCourseReminders==='function'){
        window.AndroidCalendar.syncCourseReminders(JSON.stringify({courses:courses,reminders:[7,3]}));
        msg('Android calendar synced: reminders 7 and 3 days before expiry.');
        return true;
      }
    }catch(e){console.warn('[ANDROID CALENDAR BRIDGE]',e);}

    var lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//PCP Hub//Course Renewal//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH'];
    var now=stamp();
    courses.forEach(function(c){
      var who=emps[c.empId]||c.employeeName||'Employee';
      lines.push('BEGIN:VEVENT','UID:'+esc(c.id)+'@pcp-hub','DTSTAMP:'+now,'DTSTART:'+dt(c.expiry),'SUMMARY:'+esc('Course renewal: '+c.name+' — '+who),'DESCRIPTION:'+esc('Course expiry reminder for '+who+'. Expiry: '+c.expiry));
      [7,3].forEach(function(n){
        lines.push('BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+esc(c.name+' renewal reminder'),'TRIGGER:-P'+n+'D','END:VALARM');
      });
      lines.push('END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    var blob=new Blob([lines.join('\r\n')],{type:'text/calendar;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='PCP-Hub-Course-Reminders.ics';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},3000);
    msg('Calendar reminders created: 7 days and 3 days before expiry.');
    return true;
  }

  function bindCalendar(){
    var btn=document.getElementById('crm-calendar');
    if(!btn||btn.getAttribute('data-reminder-73')==='1') return false;
    btn.setAttribute('data-reminder-73','1');
    btn.textContent='Add to calendar · 7 & 3 days';
    btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();buildCalendar();},true);
    return true;
  }
  function start(){
    applySettings();
    if(bindCalendar()) return;
    var tries=0,t=setInterval(function(){tries++;applySettings();if(bindCalendar()||tries>40)clearInterval(t);},100);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
})();
