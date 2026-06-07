const CACHE = 'rk-v46';

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
  './data/stories.json',
  './data/vocab-korean.json',
  './stories.html',
  './stories.css',
  './js/stories.js'
];

/* ── Install: cache each file individually so one slow/missing file
   can't abort the whole installation (addAll is atomic and would
   leave the user with zero cache on a flaky mobile connection). ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(
        STATIC.map(url =>
          cache.add(url).catch(() => {}) // non-fatal per-file
        )
      )
    ).then(() => self.skipWaiting())
  );
});

/* ── Activate: clean up old caches, but keep the study-meta cache
   so push-notification data survives SW updates. ── */
self.addEventListener('activate', event => {
  const KEEP = new Set([CACHE, 'rk-study-meta']);
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => !KEEP.has(k)).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window' }).then(clients =>
        clients.forEach(c => c.postMessage({ type: 'SW_UPDATED' }))
      ))
  );
});

/* ── Study metadata (Cache API — localStorage is SW-inaccessible) ── */
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
  if (!meta || meta.date === today) return;

  const lang   = meta.lang || 'ro';
  const streak = meta.streak || 0;
  const body   = streak > 0
    ? (lang === 'ro'
        ? `Streakul tău de ${streak} ${streak === 1 ? 'zi' : 'zile'} e în pericol! 🔥`
        : `Your ${streak}-day streak is at risk! 🔥`)
    : (lang === 'ro' ? 'Nu ai studiat azi. Continuă! 💪' : "You haven't studied today. Keep going! 💪");

  await self.registration.showNotification('Raluca Korean', {
    body,
    icon:     './icons/icon.svg',
    badge:    './icons/icon.svg',
    tag:      'rk-daily',
    renotify: false,
    data:     { url: './exercises.html' }
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

/* ── Fetch strategy ─────────────────────────────────────────────────
   Cross-origin (fonts, CDN): let browser handle it — no SW interception.
   data/ JSON files: network-first — always fetch fresh data; fall back
     to cache only when offline so new stories/exercises appear instantly.
   Everything else: stale-while-revalidate — serve cached copy
     instantly, update cache in background from network.
   ────────────────────────────────────────────────────────────────── */
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (Google Fonts, etc.)
  if (!request.url.startsWith(self.location.origin)) return;

  const path = new URL(request.url).pathname;

  // Network-first for data JSON — always get fresh data, cache as fallback
  if (path.includes('/data/')) {
    event.respondWith(
      fetch(request).then(resp => {
        if (resp.ok) caches.open(CACHE).then(c => c.put(request, resp.clone()));
        return resp;
      }).catch(() => caches.match(request))
    );
    return;
  }

  // Stale-while-revalidate for HTML, CSS, JS
  event.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(request).then(cached => {
        const networkFetch = fetch(request).then(resp => {
          if (resp.ok) cache.put(request, resp.clone());
          return resp;
        }).catch(() => undefined);

        // Return cached copy immediately; update cache in background
        if (cached) { networkFetch.catch(() => {}); return cached; }
        // Nothing cached yet — wait for network, 503 if that also fails
        return networkFetch.then(r =>
          r || new Response('Offline', { status: 503, statusText: 'Offline' })
        );
      })
    )
  );
});
