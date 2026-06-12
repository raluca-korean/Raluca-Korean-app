(function(){
  var SVG_SUN = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="7.05" y2="7.05"/><line x1="16.95" y1="16.95" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="7.05" y2="16.95"/><line x1="16.95" y1="7.05" x2="19.78" y2="4.22"/></svg>';
  var SVG_MOON = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function applyTheme(){
    var theme = localStorage.getItem('RK_THEME');
    var isDark = theme === 'dark' || (theme === null);
    if(isDark){
      document.body.classList.add('dark-mode');
      document.documentElement.removeAttribute('data-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.setAttribute('data-mode','day');
    }
  }

  function setMode(isDark){
    if(isDark){
      document.body.classList.add('dark-mode');
      document.documentElement.removeAttribute('data-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.setAttribute('data-mode','day');
    }
    localStorage.setItem('RK_THEME', isDark ? 'dark' : 'light');
  }

  function wireBtn(btn){
    btn.innerHTML = document.body.classList.contains('dark-mode') ? SVG_MOON : SVG_SUN;
    btn.addEventListener('click', function(){
      document.documentElement.style.setProperty('--rk-transition-dur','0.25s');
      var nowDark = !document.body.classList.contains('dark-mode');
      setMode(nowDark);
      btn.innerHTML = nowDark ? SVG_MOON : SVG_SUN;
      setTimeout(function(){ document.documentElement.style.removeProperty('--rk-transition-dur'); }, 300);
    });
  }

  function setupToggle(){
    var btn = document.getElementById('darkToggle');
    if(btn){ wireBtn(btn); return; }
    // darkToggle e injectat de lang-picker.js; așteptăm să apară în DOM
    var obs = new MutationObserver(function(){
      var b = document.getElementById('darkToggle');
      if(b){ obs.disconnect(); wireBtn(b); }
    });
    obs.observe(document.documentElement, {childList:true, subtree:true});
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      applyTheme();
      setupToggle();
    });
  } else {
    applyTheme();
    setupToggle();
  }
})();
