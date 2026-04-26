(function () {
  var banner = document.createElement('div');
  banner.className = 'offline-banner';
  banner.id = 'offlineBanner';
  banner.textContent = '⚡ Ești offline — conținut disponibil din cache';
  document.body.insertBefore(banner, document.body.firstChild);

  function update() {
    if (navigator.onLine) {
      banner.classList.remove('show');
    } else {
      banner.classList.add('show');
    }
  }

  window.addEventListener('online', update);
  window.addEventListener('offline', update);
  update();
})();
