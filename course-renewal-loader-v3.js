/* PCP Hub — Course Renewal loader v3 compatibility bridge */
(function(){
"use strict";
function load(src,id,done){
  if(document.getElementById(id)){if(done)done();return;}
  var s=document.createElement("script");
  s.id=id;
  s.src=src;
  s.onload=function(){if(done)done();};
  s.onerror=function(){console.error("[PCP LOADER] Failed:",src);};
  document.head.appendChild(s);
}
function runtime(){
  load("./pcp-runtime-v4.js?v=20260824-6","pcp-runtime-v4");
}
function hotfix(){
  load("./course-renewal-hotfix-v3.js?v=20260824-6","crm-hotfix-v31",runtime);
}
if(window.PCP_COURSE_MOBILE) hotfix();
else load("./course-renewal-mobile.js?v=20260824-2","crm-mobile-v2",hotfix);
})();
