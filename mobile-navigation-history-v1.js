/* PCP Hub — mobile browser navigation history v1 */
(function(){
  'use strict';
  if (window.__PCP_MOBILE_HISTORY_V1__) return;
  window.__PCP_MOBILE_HISTORY_V1__ = true;

  var suppressPush = false;
  var hasInternalNavigation = false;
  var knownPages = [
    'page-home',
    'page-sucker',
    'page-report',
    'page-files',
    'page-location',
    'page-daily-log',
    'page-courses'
  ];

  function pageExists(id){
    return !!(id && document.getElementById(id));
  }

  function visiblePage(){
    var pages = Array.prototype.slice.call(document.querySelectorAll('.page'));
    var active = pages.find(function(p){
      if (!p.id) return false;
      var style = window.getComputedStyle ? getComputedStyle(p) : null;
      return p.classList.contains('active') && (!style || style.display !== 'none');
    });
    if (active) return active.id;

    var visible = pages.find(function(p){
      if (!p.id) return false;
      var style = window.getComputedStyle ? getComputedStyle(p) : null;
      return !style || (style.display !== 'none' && style.visibility !== 'hidden');
    });
    return visible ? visible.id : 'page-home';
  }

  function stateFor(page){
    var current = history.state && typeof history.state === 'object' ? history.state : {};
    var next = {};
    Object.keys(current).forEach(function(k){ next[k] = current[k]; });
    next.pcpHub = true;
    next.pcpPage = page;
    return next;
  }

  function replaceCurrent(page){
    if (!pageExists(page)) page = 'page-home';
    try { history.replaceState(stateFor(page), document.title, location.href); }
    catch(e){ console.warn('[PCP HISTORY] replaceState failed', e); }
  }

  function pushPage(page){
    if (suppressPush || !pageExists(page)) return;
    var current = history.state && history.state.pcpPage;
    if (current === page) return;
    try {
      history.pushState({ pcpHub:true, pcpPage:page }, document.title, location.href);
      hasInternalNavigation = true;
    } catch(e){ console.warn('[PCP HISTORY] pushState failed', e); }
  }

  function targetFromCall(name, args){
    if (name === 'openMainPage') return String(args[0] || '');
    if (name === 'openDailyLogPage') return 'page-daily-log';
    if (name === 'openCoursesRenewalPage') return 'page-courses';
    return '';
  }

  function wrap(name){
    var fn = window[name];
    if (typeof fn !== 'function' || fn.__pcpHistoryWrapped) return;

    var original = fn;
    var wrapped = function(){
      var page = targetFromCall(name, arguments);
      if (page) pushPage(page);
      return original.apply(this, arguments);
    };
    wrapped.__pcpHistoryWrapped = true;
    wrapped.__pcpOriginal = original;
    window[name] = wrapped;
  }

  function wrapNavigation(){
    wrap('openMainPage');
    wrap('openDailyLogPage');
    wrap('openCoursesRenewalPage');
  }

  function openState(page){
    if (!pageExists(page)) page = 'page-home';
    suppressPush = true;
    try {
      if (page === 'page-daily-log' && typeof window.openDailyLogPage === 'function') {
        window.openDailyLogPage();
      } else if (page === 'page-courses' && typeof window.openCoursesRenewalPage === 'function') {
        window.openCoursesRenewalPage();
      } else if (typeof window.openMainPage === 'function') {
        window.openMainPage(page);
      } else {
        knownPages.forEach(function(id){
          var el = document.getElementById(id);
          if (!el) return;
          el.classList.toggle('active', id === page);
        });
      }
    } finally {
      suppressPush = false;
    }
  }

  function initHistory(){
    wrapNavigation();

    var initial = visiblePage();
    replaceCurrent(initial);

    /* Home uses a normal event listener in some versions, so record it here as
       well. If openMainPage also runs, duplicate states are avoided above. */
    var homeBtn = document.getElementById('home-return-btn');
    if (homeBtn && !homeBtn.getAttribute('data-pcp-history-bound')) {
      homeBtn.setAttribute('data-pcp-history-bound', '1');
      homeBtn.addEventListener('click', function(){ pushPage('page-home'); }, true);
    }

    window.addEventListener('popstate', function(event){
      var state = event.state || {};
      if (!state.pcpHub || !state.pcpPage) return;
      openState(state.pcpPage);
    });

    /* Safari can restore a page from its back-forward cache. Re-apply the
       stored page so the visible screen always matches the history entry. */
    window.addEventListener('pageshow', function(event){
      if (!event.persisted) return;
      var state = history.state || {};
      if (state.pcpHub && state.pcpPage) openState(state.pcpPage);
    });

    /* Course/mobile runtime files can replace navigation functions after this
       script runs. Re-wrap briefly after startup so Android/iOS Back keeps
       working regardless of load order. */
    [250, 700, 1500, 3000, 5000].forEach(function(ms){
      setTimeout(wrapNavigation, ms);
    });

    /* Deep-link startup (for example a course notification) may switch the
       visible page shortly after load. If the user has not navigated yet,
       align the initial history entry with that final startup page. */
    setTimeout(function(){
      if (!hasInternalNavigation) replaceCurrent(visiblePage());
    }, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ setTimeout(initHistory, 50); }, {once:true});
  } else {
    setTimeout(initHistory, 50);
  }
})();
