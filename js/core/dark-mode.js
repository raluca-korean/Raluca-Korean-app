(function(){
  function applyTheme(){
    if(localStorage.getItem('RK_THEME')==='dark'){
      document.body.classList.add('dark-mode');
    }
  }

  function addToggle(){
    const isDark = document.body.classList.contains('dark-mode');
    const btn = document.createElement('button');
    btn.id = 'darkToggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Toggle dark mode');
    btn.textContent = isDark ? '🌙' : '☀️';
    btn.style.cssText = [
      'position:fixed',
      'bottom:20px',
      'left:20px',
      'width:44px',
      'height:44px',
      'border-radius:999px',
      'font-size:20px',
      'padding:0',
      'line-height:1',
      'z-index:9999',
      'cursor:pointer',
      'border:none',
      'box-shadow:0 4px 16px rgba(0,0,0,.28)',
      'transition:transform .10s ease,background .20s ease',
      'display:grid',
      'place-items:center'
    ].join(';');
    btn.style.background = isDark ? 'rgba(28,4,50,.95)' : 'rgba(255,255,255,.92)';

    btn.addEventListener('click', function(){
      const nowDark = document.body.classList.toggle('dark-mode');
      localStorage.setItem('RK_THEME', nowDark ? 'dark' : 'light');
      btn.textContent = nowDark ? '🌙' : '☀️';
      btn.style.background = nowDark ? 'rgba(28,4,50,.95)' : 'rgba(255,255,255,.92)';
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
