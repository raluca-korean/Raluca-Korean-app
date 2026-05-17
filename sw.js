const CACHE = 'rk-v17';

const STATIC = [
  './',
  './index.html',
  './exercises.html',
  './lessons.html',
  './glossary.html',
  './builder.html',
  './flashcards.html',
  './stats.html',
  './writing.html',
  './pronunciation.html',
  './drill.html',
  './hangul.html',
  './hanja-book.html',
  './theme-anime.css',
  './builder.css',
  './exercises.css',
  './flashcards.css',
  './glossary.css',
  './hangul.css',
  './hanja-book.css',
  './lessons.css',
  './pronunciation.css',
  './stats.css',
  './writing.css',
  './drill.css',
  './flag.svg',
  './manifest.json',
  './icons/icon.svg',
  './js/builder.js',
  './js/exercises.js',
  './js/flashcards.js',
  './js/glossary.js',
  './js/hangul.js',
  './js/hanja-book.js',
  './js/lessons.js',
  './js/pronunciation.js',
  './js/stats.js',
  './js/writing.js',
  './js/drill.js',
  './js/core/audio.js',
  './js/core/conjugation.js',
  './js/core/dark-mode.js',
  './js/core/gamification.js',
  './js/core/grammar.js',
  './js/core/grammar-color.js',
  './js/core/lang-picker.js',
  './js/core/notifications.js',
  './js/core/parser.js',
  './js/core/register-sw.js',
  './js/core/sentence-builder.js',
  './js/core/storage.js',
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

/* ── Study metadata (Cache API — accessible from SW context) ── */
async function getStudyMeta() {
  const cache = await caches.open('rk-study-meta');
  const resp  = await cache.match('/rk-study-meta');
  return resp ? resp.json() : null;
}
async function saveStudyMeta(data) {
  const cache = await caches.open('rk-study-meta');
  await cache.put('/rk-study-meta', new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  }));
}

/* ── Relay study data from client ── */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'RK_STUDY_UPDATE') {
    saveStudyMeta({
      date:   event.data.date,
      streak: event.data.streak || 0,
      lang:   event.data.lang   || 'ro'
    });
  }
});

/* ── Daily reminder via Periodic Background Sync ── */
async function checkAndRemind() {
  const meta  = await getStudyMeta();
  const today = new Date().toISOString().slice(0, 10);
  if (!meta || meta.date === today) return;   // studied today — no nudge

  const lang   = meta.lang || 'ro';
  const streak = meta.streak || 0;
  const body   = streak > 0
    ? (lang === 'ro'
        ? `Streakul tău de ${streak} ${streak === 1 ? 'zi' : 'zile'} e în pericol! 🔥`
        : `Your ${streak}-day streak is at risk! 🔥`)
    : (lang === 'ro' ? 'Nu ai studiat azi. Continuă! 💪' : "You haven't studied today. Keep going! 💪");

  await self.registration.showNotification('Raluca Korean', {
    body,
    icon:  './icons/icon.svg',
    badge: './icons/icon.svg',
    tag:   'rk-daily',
    renotify: false,
    data:  { url: './exercises.html' }
  });
}

self.addEventListener('periodicsync', event => {
  if (event.tag === 'rk-daily-reminder') event.waitUntil(checkAndRemind());
});

/* ── Open exercises when notification is tapped ── */
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || './exercises.html';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      for (const c of clients) {
        if (c.url.includes('exercises') && 'focus' in c) return c.focus();
      }
      return self.clients.openWindow(url);
    })
  );
});

/* Network first — mereu încearcă rețeaua, cacheul e doar fallback offline */
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
