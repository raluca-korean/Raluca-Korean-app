/* Faint fixed Seoul skyline drawing (sun, birds, cloud, kite, pagoda,
   ridges, Namsan/N Seoul Tower, hanok gate, city skyline) behind the
   whole page. Injected via JS so the ~30 theme-anime.css pages don't
   each carry a copy of the markup — see index.html for the original,
   hand-tuned version this was lifted from. */
(function(){
  if(window.__rkSeoulBg) return;
  window.__rkSeoulBg = true;

  var STYLE =
    '.rk-seoul-bg{position:fixed;inset:0;width:100vw;height:100vh;z-index:-1;pointer-events:none;opacity:.32;transition:opacity .25s ease}' +
    '.rk-seoul-bg path,.rk-seoul-bg polygon,.rk-seoul-bg rect{fill:none;stroke:var(--rk-violet,#6C5CE7);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}' +
    '.rk-seoul-bg .seoul-fill{fill:var(--rk-violet,#6C5CE7);stroke:none}' +
    'body.dark-mode .rk-seoul-bg{opacity:.42}';

  var SVG =
    '<svg id="rkSeoulBg" class="rk-seoul-bg" viewBox="0 0 400 860" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">' +
      '<circle class="seoul-fill" cx="325" cy="90" r="12"/>' +
      '<path d="M341,90 L346,90 M336,101 L340,105 M325,106 L325,111 M314,101 L310,105 M309,90 L304,90 M314,79 L310,75 M325,74 L325,69 M336,79 L340,75" stroke-width="2"/>' +
      '<path d="M44,150 q6,-12 12,0 q6,-12 12,0" stroke-width="2"/>' +
      '<path d="M94,200 q6,-10 11,0 q6,-10 11,0" stroke-width="2"/>' +
      '<circle class="seoul-fill" cx="44" cy="260" r="10"/>' +
      '<circle class="seoul-fill" cx="59" cy="248" r="13"/>' +
      '<circle class="seoul-fill" cx="78" cy="252" r="11"/>' +
      '<circle class="seoul-fill" cx="94" cy="262" r="9"/>' +
      '<polygon points="250,170 263,200 250,230 238,200"/>' +
      '<path d="M250,230 q4,10 -3,16 q4,10 -3,16 q4,10 -3,16" stroke-width="2"/>' +
      '<rect x="144" y="440" width="38" height="24"/>' +
      '<rect x="149" y="416" width="28" height="24"/>' +
      '<rect x="154" y="394" width="18" height="22"/>' +
      '<rect x="158" y="376" width="10" height="18"/>' +
      '<path d="M163,376 L163,358"/>' +
      '<circle class="seoul-fill" cx="163" cy="356" r="2"/>' +
      '<path d="M0,540 Q38,520 75,535 T163,528 T250,538 T325,525 T400,536" stroke-width="2"/>' +
      '<path d="M0,790 Q25,765 50,782 T100,775 T150,786 T200,768 T250,782 T300,772 T350,786 T400,776" stroke-width="2"/>' +
      '<path d="M0,810 Q31,795 63,806 T138,802 T213,812 T288,800 T350,810 T400,802" stroke-width="2"/>' +
      '<path d="M22,840 Q38,810 53,818 Q69,810 84,840"/>' +
      '<path d="M28,850 L28,838 M78,850 L78,838"/>' +
      '<path d="M161,850 L188,795 L214,850 Z"/>' +
      '<path d="M188,795 L188,766"/>' +
      '<path d="M183,774 L193,774"/>' +
      '<circle class="seoul-fill" cx="188" cy="764" r="4"/>' +
      '<rect x="245" y="812" width="11" height="38"/>' +
      '<rect x="260" y="790" width="10" height="60"/>' +
      '<polygon points="275,850 275,780 279,760 284,780 284,850"/>' +
      '<rect x="289" y="800" width="10" height="50"/>' +
      '<rect x="304" y="816" width="11" height="34"/>' +
      '<rect x="323" y="796" width="9" height="54"/>' +
      '<rect x="338" y="820" width="10" height="30"/>' +
    '</svg>';

  function inject(){
    var styleEl = document.createElement('style');
    styleEl.textContent = STYLE;
    document.head.appendChild(styleEl);

    var wrap = document.createElement('div');
    wrap.innerHTML = SVG;
    document.body.insertBefore(wrap.firstChild, document.body.firstChild);
  }

  /* ── keep the drawing BEHIND the content ─────────────────────────────
     Cards, panels and buttons on these pages are translucent (glass look),
     so the drawing showed through them as if it were on top. Instead of
     restyling every page, the drawing masks itself out wherever such a box
     is: an SVG mask with a hole per box, rebuilt on scroll, resize, theme
     change and DOM changes. Boxes are only measured, never restyled, so
     their colours and states (selected / correct / wrong…) stay untouched. */
  var boxes = [];
  var SKIP_TAGS = { HTML:1, BODY:1, SCRIPT:1, STYLE:1, SVG:1, svg:1, CANVAS:1, PATH:1, SPAN:1, B:1, I:1, SMALL:1, STRONG:1, EM:1, BR:1, IMG:1 };

  function alphaOf(c){
    if(!c || c === 'transparent') return 0;
    var m = /rgba?\(([^)]+)\)/.exec(c);
    if(!m) return 1;
    var parts = m[1].split(/[\s,\/]+/).filter(Boolean);
    return parts.length > 3 ? parseFloat(parts[3]) : 1;
  }
  function isBox(el, cs, vw, vh){
    if(SKIP_TAGS[el.tagName] || el.id === 'rkSeoulBg') return false;
    if(cs.display === 'none' || cs.visibility === 'hidden') return false;
    var hasBg = alphaOf(cs.backgroundColor) > 0.01 || cs.backgroundImage !== 'none' ||
                (cs.backdropFilter && cs.backdropFilter !== 'none') || (cs.webkitBackdropFilter && cs.webkitBackdropFilter !== 'none');
    var hasFrame = parseFloat(cs.borderTopWidth) > 0 && alphaOf(cs.borderTopColor) > 0.05;
    if(!hasBg && !hasFrame && el.tagName !== 'IFRAME') return false;
    var w = el.offsetWidth, h = el.offsetHeight;
    if(w < 24 || h < 18) return false;
    // full-screen overlays / page wrappers are meant to show what is behind them
    if(w * h > vw * vh * 0.7) return false;
    return true;
  }
  function collect(){
    var vw = window.innerWidth, vh = window.innerHeight;
    var all = document.body ? document.body.getElementsByTagName('*') : [];
    var out = [];
    for(var i = 0; i < all.length && out.length < 600; i++){
      var el = all[i];
      if(SKIP_TAGS[el.tagName]) continue;
      var cs = getComputedStyle(el);
      if(isBox(el, cs, vw, vh)) out.push({ el: el, r: parseFloat(cs.borderTopLeftRadius) || 0 });
    }
    boxes = out;
    schedule();
  }

  var svgEl = null, rafId = 0, lastMask = '';
  function draw(){
    rafId = 0;
    if(!svgEl) return;
    var vw = window.innerWidth, vh = window.innerHeight;
    var holes = '';
    for(var i = 0; i < boxes.length; i++){
      var el = boxes[i].el;
      if(!el.isConnected) continue;
      var b = el.getBoundingClientRect();
      if(b.width < 2 || b.height < 2 || b.bottom < 0 || b.top > vh || b.right < 0 || b.left > vw) continue;
      var r = Math.min(boxes[i].r, b.width / 2, b.height / 2);
      holes += '<rect x="' + b.left.toFixed(1) + '" y="' + b.top.toFixed(1) + '" width="' + b.width.toFixed(1) +
               '" height="' + b.height.toFixed(1) + '" rx="' + r.toFixed(1) + '" fill="black"/>';
    }
    var mask = holes
      ? 'url("data:image/svg+xml;utf8,' + encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="' + vw + '" height="' + vh + '">' +
          '<mask id="m"><rect width="100%" height="100%" fill="white"/>' + holes + '</mask>' +
          '<rect width="100%" height="100%" fill="white" mask="url(#m)"/></svg>') + '")'
      : 'none';
    if(mask === lastMask) return;
    lastMask = mask;
    svgEl.style.webkitMaskImage = mask;
    svgEl.style.maskImage = mask;
    svgEl.style.webkitMaskSize = '100% 100%';
    svgEl.style.maskSize = '100% 100%';
    svgEl.style.webkitMaskRepeat = 'no-repeat';
    svgEl.style.maskRepeat = 'no-repeat';
  }
  function schedule(){ if(!rafId) rafId = requestAnimationFrame(draw); }

  // throttled (not debounced): pages that change all the time still get re-measured
  var collectTimer = 0;
  function scheduleCollect(){
    if(collectTimer) return;
    collectTimer = setTimeout(function(){ collectTimer = 0; collect(); }, 250);
  }
  function onlyText(m){
    if(m.type !== 'childList') return false;
    var lists = [m.addedNodes, m.removedNodes];
    for(var a = 0; a < 2; a++) for(var i = 0; i < lists[a].length; i++) if(lists[a][i].nodeType !== 3) return false;
    return true;   // a timer / counter changing its text does not move any box
  }

  function startMasking(){
    svgEl = document.getElementById('rkSeoulBg');
    if(!svgEl) return;
    collect();
    window.addEventListener('scroll', schedule, { passive: true, capture: true });
    window.addEventListener('resize', scheduleCollect);
    window.addEventListener('load', scheduleCollect);
    // content rendered later, tabs switched, theme toggled, cards selected…
    new MutationObserver(function(muts){
      for(var i = 0; i < muts.length; i++){
        if(muts[i].target === svgEl || (svgEl.contains && svgEl.contains(muts[i].target)) || onlyText(muts[i])) continue;
        scheduleCollect(); return;
      }
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden'] });
    // horizontally scrolling rows (builder table, chips…) move boxes without a window scroll
    document.addEventListener('scroll', schedule, { passive: true, capture: true });
    // CSS transitions / animations end in new positions
    document.addEventListener('transitionend', schedule, true);
    document.addEventListener('animationend', schedule, true);
  }

  // index.html carries its own hand-tuned copy (id="rkSeoulBg"): only mask it
  function boot(){ if(!document.getElementById('rkSeoulBg')) inject(); startMasking(); }
  if(document.body) boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
