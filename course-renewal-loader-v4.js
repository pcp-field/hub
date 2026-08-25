/* PCP Hub Course Renewal loader v4 */
(function(){
"use strict";
function load(src,done){var s=document.createElement("script");s.src=src;s.onload=function(){if(done)done()};s.onerror=function(){console.error("[PCP LOADER] Failed:",src)};document.head.appendChild(s)}
function navigation(){load("./mobile-navigation-history-v1.js?v=20260824-1907")}
function locationUi(){load("./location-mobile-rebuild-v1.js?v=20260824-1914")}
function reportUi(){load("./report-mobile-rebuild-v1.js?v=20260824-1926",function(){var sel=document.getElementById("report-type");var field=sel&&sel.closest(".field");var card=document.querySelector("#page-report > .card");if(field&&field.parentElement===card)field.style.display="none"})}
function spaceoutUi(){load("./spaceout-rebuild-prep-v1.js?v=20260824-1941",function(){load("./spaceout-mobile-rebuild-v1.js?v=20260824-1937",function(){load("./spaceout-pro-rod-hotfix-v1.js?v=20260824-1952",function(){load("./spaceout-button-label-v1.js?v=20260825-1355")})})})}
function dailyUi(){load("./daily-job-log-mobile-rebuild-v1.js?v=20260824-1937")}
function runtime(){load("./pcp-runtime-v4.js?v=20260824-4")}
function hotfix(){load("./course-renewal-hotfix-v3.js?v=20260824-3",runtime)}
function reminders(done){load("./course-reminder-7-3-v1.js?v=20260825-1408",done)}
function courses(){if(window.PCP_COURSE_MOBILE){reminders(hotfix);return}load("./course-renewal-mobile.js?v=20260824-2",function(){reminders(hotfix)})}
function start(){navigation();locationUi();reportUi();spaceoutUi();dailyUi();courses()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();