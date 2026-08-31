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
  // One-weight, rounded-line icon set (no emoji, no mixed styles) — active
  // state colors via currentColor, same as the label, so there's no per-tab
  // rainbow: only the shared gold accent marks the active item.
  function _icon(paths) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + paths + '</svg>';
  }
  var ITEMS = [
    { key: 'home',     href: './index.html',   icon: _icon('<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10.5V20h12v-9.5"/>'), ro: 'Acasă',    en: 'Home' },
    { key: 'learn',    href: './learn.html',   icon: _icon('<path d="M4 5.5c2-1 5-1 7 0v14c-2-1-5-1-7 0z"/><path d="M20 5.5c-2-1-5-1-7 0v14c2-1 5-1 7 0z"/>'), ro: 'Învață',   en: 'Learn' },
    { key: 'practice', href: './play.html',    icon: _icon('<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="3.2"/>'), ro: 'Practică', en: 'Practice' },
    { key: 'speak',    href: './reading.html', icon: _icon('<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M6 11.5a6 6 0 0 0 12 0M12 17.5V21M9 21h6"/>'), ro: 'Vorbește', en: 'Speak' },
    { key: 'progress', href: './profile.html', icon: _icon('<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5"/>'), ro: 'Progres',  en: 'Progress' }
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
      '.rk-nav-icon{width:22px;height:22px;transition:transform .3s ease}' +
      '.rk-nav-icon svg{width:100%;height:100%;display:block}' +
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
