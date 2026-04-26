const CACHE = 'rk-v14';

const STATIC = [
  './',
  './index.html',
  './exercises.html',
  './lessons.html',
  './glossary.html',
  './builder.html',
  './flashcards.html',
  './drill.html',
  './hangul.html',
  './hanja-book.html',
  './writing.html',
  './stats.html',
  './theme-anime.css',
  './flag.svg',
  './manifest.json',
  './icons/icon.svg',
  './js/builder.js',
  './js/core/audio.js',
  './js/core/conjugation.js',
  './js/core/dark-mode.js',
  './js/core/grammar.js',
  './js/core/parser.js',
  './js/core/register-sw.js',
  './js/core/sentence-builder.js',
  './js/core/translations.js',
  './js/core/vocab-data.js',
  './js/core/vocab-widget.js',
  './js/core/vocabulary.js',
  './js/core/bottom-nav.js',
  './js/core/offline.js',
  './data/exercises.json',
  './data/lessons.json',
  './data/vocab-korean.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(STATIC))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* Network first — încearcă rețeaua, cacheul e fallback offline */
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE).then(c => c.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
