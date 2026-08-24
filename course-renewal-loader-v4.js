/* PCP Hub Course Renewal loader v4 */
(function(){
"use strict";
function load(src,done){var s=document.createElement("script");s.src=src;s.onload=function(){if(done)done()};s.onerror=function(){console.error("[PCP LOADER] Failed:",src)};document.head.appendChild(s)}
function navigation(){load("./mobile-navigation-history-v1.js?v=20260824-1907")}
function runtime(){load("./pcp-runtime-v4.js?v=20260824-4")}
function hotfix(){load("./course-renewal-hotfix-v3.js?v=20260824-3",runtime)}
function start(){navigation();if(window.PCP_COURSE_MOBILE){hotfix();return}load("./course-renewal-mobile.js?v=20260824-2",hotfix)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();