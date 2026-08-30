/**
 * RKNav — shared bottom navigation bar (Home / Learn / Practice / Speak / Progress).
 *
 * Utilizare:
 *   <div id="rkBottomNav"></div>
 *   <script src="./js/core/bottom-nav.js"></script>
 *   <script>RKNav.init('practice');</script>   // 'home' | 'learn' | 'practice' | 'speak' | 'progress'
 *
 * Call RKNav.setLang(lang) from the page's own language-switch handler to
 * keep the nav labels in sync (it does not listen for RK_LANG itself).
 */
window.RKNav = (function () {
  var ITEMS = [
    { key: 'home',     href: './index.html',   icon: '🏠',  ro: 'Acasă',    en: 'Home' },
    { key: 'learn',    href: './learn.html',   icon: '📚',  ro: 'Învață',   en: 'Learn' },
    { key: 'practice', href: './play.html',    icon: '🎯',  ro: 'Practică', en: 'Practice' },
    { key: 'speak',    href: './reading.html', icon: '🗣️', ro: 'Vorbește', en: 'Speak' },
    { key: 'progress', href: './profile.html', icon: '👤',  ro: 'Progres',  en: 'Progress' }
  ];

  var activeKey = null;

  // Self-contained styling: several host pages (index/learn/profile/review)
  // don't load theme-anime.css, so the rule can't live there. Constant
  // forest-green bar regardless of page/theme (brand element, like the
  // hero cards) — var(--forest) lets a page override it, #1c4a3a is the
  // fallback for pages (e.g. play.html) that don't define that token.
  function _ensureStyle() {
    if (document.getElementById('rkNavStyle')) return;
    var style = document.createElement('style');
    style.id = 'rkNavStyle';
    style.textContent =
      '.rk-nav{position:fixed;left:0;right:0;bottom:0;z-index:50;display:flex;justify-content:space-around;' +
      'background:var(--forest,#1c4a3a);border-top:none;' +
      'padding:8px 4px calc(8px + env(safe-area-inset-bottom))}' +
      '.rk-nav-item{display:flex;flex-direction:column;align-items:center;gap:2px;text-decoration:none;' +
      'color:rgba(255,255,255,.65);font-size:10px;font-weight:700;padding:4px 10px;border-radius:10px}' +
      '.rk-nav-item.active{color:var(--gold,#d9ae52)}' +
      '.rk-nav-icon{font-size:18px}';
    document.head.appendChild(style);
  }

  function render(lang) {
    _ensureStyle();
    var container = document.getElementById('rkBottomNav');
    if (!container) return;
    container.innerHTML = '<nav class="rk-nav">' + ITEMS.map(function (item) {
      var cls = 'rk-nav-item' + (item.key === activeKey ? ' active' : '');
      var label = lang === 'en' ? item.en : item.ro;
      return '<a href="' + item.href + '" class="' + cls + '">' +
        '<span class="rk-nav-icon">' + item.icon + '</span><span>' + label + '</span></a>';
    }).join('') + '</nav>';
  }

  function init(key) {
    activeKey = key;
    render(localStorage.getItem('RK_LANG') || 'ro');
  }

  function setLang(lang) {
    render(lang);
  }

  return { init: init, setLang: setLang };
})();
