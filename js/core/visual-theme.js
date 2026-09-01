/**
 * RK visual theme (Seoul Bloom / Cyber Seoul) — independent of light/dark.
 *
 * Reads RK_VISUAL_THEME ('cyber'|'default') and toggles body.theme-cyber,
 * which theme-cyber-seoul.css hooks into. Wires any #cyberToggle button
 * already present in the DOM (static markup — no MutationObserver needed,
 * same assumption js/core/dark-mode.js makes for its static darkToggle).
 *
 * Usage: <script src="./js/core/visual-theme.js"></script> after the page's
 * own markup; add a <button id="cyberToggle">⚡</button> wherever the page
 * wants a visible switch (optional — the theme still applies without one).
 */
(function(){
  function isCyber(){ return localStorage.getItem('RK_VISUAL_THEME') === 'cyber'; }

  function apply(on){
    document.body.classList.toggle('theme-cyber', on);
    var btn = document.getElementById('cyberToggle');
    if(btn) btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  apply(isCyber());

  var btn = document.getElementById('cyberToggle');
  if(btn){
    btn.addEventListener('click', function(){
      var on = !document.body.classList.contains('theme-cyber');
      localStorage.setItem('RK_VISUAL_THEME', on ? 'cyber' : 'default');
      apply(on);
    });
  }
})();
