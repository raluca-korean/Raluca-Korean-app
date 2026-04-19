const CACHE = 'rk-v3';

const STATIC = [
  './',
  './index.html',
  './exercises.html',
  './lessons.html',
  './glossary.html',
  './builder.html',
  './flashcards.html',
  './stats.html',
  './theme-anime.css',
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

self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, clone));
          return response;
        })
      )
  );
});
