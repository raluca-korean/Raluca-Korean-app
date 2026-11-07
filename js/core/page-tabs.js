/**
 * RKTabs — two related pages shown as ONE page with tabs.
 *
 * The host page keeps its own content as the first tab; the second page is
 * loaded in the same place (iframe, ?embed=1) without its own header, home
 * button, language picker or background, so it reads as a tab of the host.
 * Both pages keep their own code and data (same localStorage).
 *
 *   RKTabs.init({
 *     tabs: [
 *       { id: 'practice', ro: 'Exersează', en: 'Practice' },                  // host content
 *       { id: 'caiet',    ro: 'Caietul meu', en: 'My notebook', src: 'caiet.html' }
 *     ]
 *   });
 *
 * host.html?tab=caiet&text=… opens the second tab and passes the other
 * query parameters on to it.
 *
 * Embedded pages only need this script too: with ?embed=1 it marks <html>
 * with .rk-embed (CSS below hides the chrome) and makes links open in the
 * top window.
 */
(function (window, document) {
  'use strict';

  var params = new URLSearchParams(location.search);
  var EMBED = params.get('embed') === '1' || window.self !== window.top;

  var CSS =
    '.rk-tabs{position:sticky;top:0;z-index:900;display:flex;gap:6px;justify-content:center;padding:10px 12px 8px;' +
      'background:linear-gradient(to bottom,var(--rk-tabs-bg,rgba(16,20,38,.92)) 70%,transparent)}' +
    'body:not(.dark-mode) .rk-tabs{--rk-tabs-bg:rgba(250,249,247,.94)}' +
    '.rk-tabs.rk-tabs-fixed{position:fixed;left:0;right:0}' +
    '.rk-tab{font:inherit;font-weight:800;font-size:14px;padding:9px 16px;border-radius:999px;cursor:pointer;' +
      'border:1.5px solid rgba(108,92,231,.38);background:rgba(108,92,231,.08);color:inherit}' +
    '.rk-tab.active{background:linear-gradient(135deg,#6C5CE7,#E96A9A);color:#fff;border-color:transparent}' +
    '.rk-tab-frame{position:fixed;left:0;right:0;bottom:0;width:100%;border:0;z-index:850;background:transparent}' +
    'html.rk-tab-other body > *:not(.rk-tabs):not(.rk-tab-frame):not(#rkBottomNav){display:none !important}' +
    /* embedded page: no chrome of its own */
    'html.rk-embed #pageControls,html.rk-embed .homeBtn,html.rk-embed .rk-seoul-bg,html.rk-embed #rkBottomNav,' +
    'html.rk-embed .rk-ph-fab,html.rk-embed .hdr,html.rk-embed .brand,html.rk-embed .pg-head{display:none !important}' +
    'html.rk-embed body{padding-top:0 !important}';

  function addStyle() {
    if (document.getElementById('rkTabsCss')) return;
    var st = document.createElement('style');
    st.id = 'rkTabsCss';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  if (EMBED) {
    document.documentElement.classList.add('rk-embed');
    addStyle();
    var base = document.createElement('base');
    base.target = '_top';
    document.head.appendChild(base);
  }

  function lang() {
    try { return (window.RKLang && RKLang.get()) || localStorage.getItem('RK_LANG') || 'ro'; } catch (e) { return 'ro'; }
  }

  function init(opts) {
    if (EMBED) return;          // a tab inside another page never draws its own tab bar
    addStyle();
    var tabs = opts.tabs || [];
    var bar = document.createElement('div');
    bar.className = 'rk-tabs' + (opts.fixedBar ? ' rk-tabs-fixed' : '');
    bar.setAttribute('role', 'tablist');
    tabs.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'rk-tab';
      b.setAttribute('role', 'tab');
      b.dataset.tab = t.id;
      b.textContent = t[lang()] || t.ro;
      b.addEventListener('click', function () { show(t.id); });
      bar.appendChild(b);
    });
    document.body.insertBefore(bar, document.body.firstChild);

    var frame = null;
    function frameFor(t) {
      if (frame && frame.dataset.tab === t.id) return frame;
      if (frame) frame.remove();
      frame = document.createElement('iframe');
      frame.className = 'rk-tab-frame';
      frame.dataset.tab = t.id;
      frame.title = t[lang()] || t.ro;
      var q = new URLSearchParams(location.search);
      q.delete('tab');
      q.set('embed', '1');
      frame.src = t.src + '?' + q.toString();
      document.body.appendChild(frame);
      place();
      return frame;
    }
    function place() {
      if (!frame) return;
      var top = bar.getBoundingClientRect().bottom;
      var nav = document.getElementById('rkBottomNav');
      var navH = nav && nav.firstElementChild ? nav.firstElementChild.getBoundingClientRect().height : 0;
      frame.style.top = Math.max(0, top) + 'px';
      frame.style.height = (window.innerHeight - Math.max(0, top) - navH) + 'px';
    }
    window.addEventListener('resize', place);

    function show(id) {
      var t = tabs.filter(function (x) { return x.id === id; })[0] || tabs[0];
      bar.querySelectorAll('.rk-tab').forEach(function (b) {
        var on = b.dataset.tab === t.id;
        b.classList.toggle('active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      if (t.src) {
        document.documentElement.classList.add('rk-tab-other');
        frameFor(t).style.display = 'block';
        window.scrollTo(0, 0);
        setTimeout(place, 0);
      } else {
        document.documentElement.classList.remove('rk-tab-other');
        if (frame) frame.style.display = 'none';
      }
      // keep only ?tab= in the address: one-shot parameters (e.g. a sentence sent to the
      // notebook) were handed to the tab already and must not run again on reload
      var u = new URL(location.href);
      u.search = t === tabs[0] ? '' : '?tab=' + encodeURIComponent(t.id);
      history.replaceState(null, '', u.pathname + u.search);
    }
    show(params.get('tab') || tabs[0].id);
    return { show: show };
  }

  window.RKTabs = { init: init, embedded: EMBED };
})(window, document);
