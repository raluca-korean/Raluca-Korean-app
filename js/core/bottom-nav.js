(function () {
  const page = location.pathname.split('/').pop().replace('.html', '') || 'index';
  const map = {
    'index': 'home',     'stats': 'home',
    'exercises': 'exercises', 'drill': 'exercises', 'flashcards': 'exercises', 'writing': 'exercises',
    'lessons': 'lessons', 'hangul': 'lessons', 'hanja-book': 'lessons',
    'glossary': 'glossary',
    'builder': 'builder'
  };
  const active = map[page];
  if (active) {
    const el = document.querySelector('.bnav-tab[data-tab="' + active + '"]');
    if (el) el.classList.add('active');
  }
})();
