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
  // Seoul Violet bar regardless of page/theme (brand element, like the
  // hero cards) — var(--forest) lets a page override it, #6C5CE7 is the
  // fallback for pages (e.g. play.html) that don't define that token.
  function _ensureStyle() {
    if (document.getElementById('rkNavStyle')) return;
    var style = document.createElement('style');
    style.id = 'rkNavStyle';
    style.textContent =
      '.rk-nav{position:fixed;left:0;right:0;bottom:0;z-index:50;display:flex;justify-content:space-around;' +
      'background:var(--forest,#6C5CE7);border-top:none;' +
      'padding:8px 4px calc(8px + env(safe-area-inset-bottom))}' +
      '.rk-nav-item{display:flex;flex-direction:column;align-items:center;gap:2px;text-decoration:none;' +
      'color:rgba(255,255,255,.65);font-size:10px;font-weight:700;padding:4px 10px;border-radius:10px}' +
      '.rk-nav-item.active{color:var(--gold,#F4C95D)}' +
      '.rk-nav-icon{font-size:18px;transition:transform .3s ease}' +
      /* Student mode: playful pop on the active icon. Adult mode stays calm/static —
         same brand colors either way, only the animation intensity differs. */
      'body.audience-student .rk-nav-item.active .rk-nav-icon{animation:rk-nav-pop .4s ease}' +
      '@keyframes rk-nav-pop{0%{transform:scale(1)}45%{transform:scale(1.22)}100%{transform:scale(1)}}' +
      /* Adult mode: same Seoul Bloom palette, pink dialed back to a quiet accent
         instead of a loud highlight (student keeps the full-saturation default). */
      'body.audience-adult{--pink:#D98BAA;--rk-pink:#D98BAA}' +
      'body.audience-adult.dark-mode{--pink:#D9A0B7;--rk-pink:#D9A0B7}';
    document.head.appendChild(style);
  }

  // RK_AUDIENCE ('student'|'adult', set in onboarding.html / toggled in
  // profile.html) already drives content elsewhere (gamification goals,
  // stories, conversation). Here it only flips a body class so CSS can
  // dial the same brand palette's intensity up/down — no new content.
  function _applyAudience() {
    var aud = localStorage.getItem('RK_AUDIENCE') === 'student' ? 'student' : 'adult';
    document.body.classList.remove('audience-student', 'audience-adult');
    document.body.classList.add('audience-' + aud);
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
    _applyAudience();
  }

  function setLang(lang) {
    render(lang);
  }

  return { init: init, setLang: setLang };
})();
