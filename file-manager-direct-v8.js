/* PCP Hub — Files v8 compatibility loader */
(function(){
"use strict";
if(window.__PCP_FILES_COMPAT_V10__) return;
var s=document.createElement("script");
s.src="./file-manager-direct-v7.js?v=20260824-1752";
s.async=false;
(document.head||document.documentElement).appendChild(s);
})();
