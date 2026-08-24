/* PCP Hub — Files v7 compatibility loader */
(function(){
"use strict";
if(window.__PCP_FILES_V12__) return;
var s=document.createElement("script");
s.src="./file-manager-direct-v12.js?v=20260824-1820";
s.async=false;
(document.head||document.documentElement).appendChild(s);
})();
