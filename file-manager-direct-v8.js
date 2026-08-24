/* PCP Hub — Files v8 compatibility loader */
(function(){
"use strict";
if(window.__PCP_FILES_V11__) return;
var s=document.createElement("script");
s.src="./file-manager-direct-v11.js?v=20260824-1814";
s.async=false;
(document.head||document.documentElement).appendChild(s);
})();
