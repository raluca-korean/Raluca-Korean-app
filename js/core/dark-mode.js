(function(){
  var SVG_SUN = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="7.05" y2="7.05"/><line x1="16.95" y1="16.95" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="7.05" y2="16.95"/><line x1="16.95" y1="7.05" x2="19.78" y2="4.22"/></svg>';
  var SVG_MOON = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function applyTheme(){
    if(localStorage.getItem('RK_THEME')==='dark'){
      document.body.classList.add('dark-mode');
    }
  }

  function setBtn(btn, isDark){
    btn.innerHTML  = isDark ? SVG_MOON : SVG_SUN;
    btn.style.background = isDark ? 'rgba(28,4,50,.95)' : 'rgba(255,255,255,.92)';
    btn.style.color      = isDark ? '#f5f5f7' : '#374151';
  }

  function addToggle(){
    var isDark = document.body.classList.contains('dark-mode');
    var btn = document.createElement('button');
    btn.id   = 'darkToggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Toggle dark mode');
    btn.style.cssText = [
      'position:fixed',
      'bottom:20px',
      'left:20px',
      'width:44px',
      'height:44px',
      'border-radius:999px',
      'padding:0',
      'z-index:9999',
      'cursor:pointer',
      'border:none',
      'box-shadow:0 2px 12px rgba(0,0,0,.22)',
      'transition:transform .10s ease,background .20s ease,color .20s ease',
      'display:grid',
      'place-items:center'
    ].join(';');
    setBtn(btn, isDark);

    btn.addEventListener('click', function(){
      document.documentElement.style.setProperty('--rk-transition-dur','0.25s');
      var nowDark = document.body.classList.toggle('dark-mode');
      localStorage.setItem('RK_THEME', nowDark ? 'dark' : 'light');
      setBtn(btn, nowDark);
      setTimeout(function(){ document.documentElement.style.removeProperty('--rk-transition-dur'); }, 300);
    });

    document.body.appendChild(btn);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      applyTheme();
      addToggle();
    });
  } else {
    applyTheme();
    addToggle();
  }
})();
