var LANG = RKLang.get();
var FILTER = 0;
var DATA = [];
var streak = 0;

var I18N = {
  ro: {
    title: 'Ascultare',
    sub: 'Ascultă și alege răspunsul corect',
    all: 'Toate',
    slow: '🐢 Lent',
    playHint: 'Apasă pentru a asculta',
    loading: 'Se încarcă...',
    dailyTitle: 'Provocarea zilnică',
    dailySub: 'Răspunde corect pentru un bonus de XP',
    dailyBadge: '🎯 Azi'
  },
  en: {
    title: 'Listening',
    sub: 'Listen and choose the right answer',
    all: 'All',
    slow: '🐢 Slow',
    playHint: 'Tap to listen',
    loading: 'Loading...',
    dailyTitle: 'Daily Challenge',
    dailySub: 'Answer correctly for a bonus XP',
    dailyBadge: '🎯 Today'
  }
};

var DAILY_XP = 15;

function t(k) { return I18N[LANG][k]; }

/* ── TTS ────────────────────────────────────────────── */
function playTTS(text, rate) {
  AudioEngine.speak(text, {rate: rate || 1});
}

/* ── DAILY CHALLENGE ────────────────────────────────── */
function todayISO() { return RKUtils.todayISO(); }

function loadDaily() {
  try { return JSON.parse(localStorage.getItem('RK_DAILY_LISTEN') || 'null'); }
  catch (e) { return null; }
}
function saveDaily(data) {
  try { localStorage.setItem('RK_DAILY_LISTEN', JSON.stringify(data)); } catch (e) {}
}
function pickDailyItem() {
  var epochDay = Math.floor(Date.now() / 86400000);
  return DATA[epochDay % DATA.length];
}
function isDailyDoneToday() {
  var rec = loadDaily();
  return !!(rec && rec.date === todayISO() && rec.done);
}
function onDailyChecked(isCorrect) {
  if (isCorrect && !isDailyDoneToday()) {
    saveDaily({ date: todayISO(), done: true });
    if (window.RKGamification) RKGamification.addXPBonus(DAILY_XP);
    if (window.RKStreak) RKStreak.touch();
    updateDailyBadge();
  }
}
function updateDailyBadge() {
  var badge = document.getElementById('dailyBadge');
  if (!badge) return;
  if (isDailyDoneToday()) {
    badge.textContent = '✅ +' + DAILY_XP + ' XP';
    badge.className = 'daily-badge done';
  } else {
    badge.textContent = t('dailyBadge');
    badge.className = 'daily-badge';
  }
}
function renderDailyChallenge() {
  var wrap = document.getElementById('dailyChallenge');
  if (!wrap || !DATA.length) return;
  wrap.innerHTML =
    '<div class="card daily-card">' +
      '<div class="daily-head">' +
        '<span class="daily-icon">🎧</span>' +
        '<div>' +
          '<div class="daily-title">' + t('dailyTitle') + '</div>' +
          '<div class="daily-sub">' + t('dailySub') + '</div>' +
        '</div>' +
        '<span class="daily-badge" id="dailyBadge"></span>' +
      '</div>' +
      '<div id="dailyCardBody"></div>' +
    '</div>';
  document.getElementById('dailyCardBody').appendChild(buildCard(pickDailyItem(), onDailyChecked));
  updateDailyBadge();
}

/* ── STATS ──────────────────────────────────────────── */
function saveStats(isCorrect) {
  if (window.RKStreak) RKStreak.touch();
  var today = todayISO();
  var s;
  try { s = JSON.parse(localStorage.getItem('RK_STATS') || 'null'); } catch (e) { s = null; }
  if (!s) s = { total: 0, correct: 0, bestStreak: 0, today: today, todayTotal: 0, todayCorrect: 0, byType: {} };
  if (s.today !== today) { s.today = today; s.todayTotal = 0; s.todayCorrect = 0; }
  s.total++;
  s.todayTotal++;
  if (isCorrect) { s.correct++; s.todayCorrect++; streak++; } else { streak = 0; }
  if (streak > s.bestStreak) s.bestStreak = streak;
  if (!s.byType.listening) s.byType.listening = { total: 0, correct: 0 };
  s.byType.listening.total++;
  if (isCorrect) s.byType.listening.correct++;
  localStorage.setItem('RK_STATS', JSON.stringify(s));
  if (isCorrect && window.RKGamification) RKGamification.addXP(streak);
}

/* ── BUILD CARD ─────────────────────────────────────── */
function buildCard(item, onChecked) {
  var div = document.createElement('div');
  div.className = 'l-card';

  var opts = item.options.map(function(o, i) {
    return '<button class="l-opt" data-i="' + i + '">' + o[LANG] + '</button>';
  }).join('');

  div.innerHTML = [
    '<div class="l-badge">TOPIK ' + item.topik + '</div>',
    '<div class="l-play-row">',
      '<button class="l-play-btn b-play" aria-label="' + t('playHint') + '">🔊</button>',
      '<button class="l-slow-btn b-slow">' + t('slow') + '</button>',
      '<span class="l-play-hint">' + t('playHint') + '</span>',
    '</div>',
    '<div class="l-question">' + item.question[LANG] + '</div>',
    '<div class="l-options">' + opts + '</div>',
    '<div class="l-reveal">',
      '<div class="l-reveal-ko">' + item.ko + '</div>',
      '<div class="l-reveal-rom">' + item.rom + '</div>',
      '<div class="l-reveal-tr">' + item.translation[LANG] + '</div>',
    '</div>'
  ].join('');

  div.querySelector('.b-play').onclick = function() { playTTS(item.ko, 1); };
  div.querySelector('.b-slow').onclick = function() { playTTS(item.ko, 0.6); };

  var optBtns = div.querySelectorAll('.l-opt');
  var revealBox = div.querySelector('.l-reveal');
  var answered = false;

  optBtns.forEach(function(btn) {
    btn.onclick = function() {
      if (answered) return;
      answered = true;
      var chosen = parseInt(btn.getAttribute('data-i'), 10);
      var isCorrect = chosen === item.correct;
      optBtns.forEach(function(b) {
        b.disabled = true;
        var i = parseInt(b.getAttribute('data-i'), 10);
        if (i === item.correct) b.classList.add(i === chosen ? 'correct' : 'reveal');
        else if (i === chosen) b.classList.add('wrong');
      });
      revealBox.classList.add('on');
      saveStats(isCorrect);
      if (typeof onChecked === 'function') onChecked(isCorrect);
    };
  });

  // Auto-play once on render
  setTimeout(function() { playTTS(item.ko, 1); }, 350);

  return div;
}

/* ── RENDER ─────────────────────────────────────────── */
function renderFilter() {
  var row = document.getElementById('filterRow');
  row.innerHTML = '';
  var levels = [0, 1, 2, 3, 4, 5, 6];
  levels.forEach(function(lvl) {
    var btn = document.createElement('button');
    btn.className = 'filter-btn' + (lvl === FILTER ? ' active' : '');
    btn.textContent = lvl === 0 ? t('all') : 'TOPIK ' + lvl;
    btn.onclick = function() {
      FILTER = lvl;
      row.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      renderCards();
    };
    row.appendChild(btn);
  });
}

function renderCards() {
  var list = document.getElementById('cardList');
  var data = FILTER === 0 ? DATA : DATA.filter(function(x) { return x.topik === FILTER; });
  list.innerHTML = '';
  data.forEach(function(item) { list.appendChild(buildCard(item)); });
}

function applyLang(lang) {
  LANG = lang;
  document.documentElement.lang = lang;
  var titleEl = document.getElementById('pageTitle');
  var subEl = document.getElementById('pageSub');
  if (titleEl) titleEl.textContent = t('title');
  if (subEl) subEl.textContent = t('sub');
  if (!DATA.length) return;
  renderDailyChallenge();
  renderFilter();
  renderCards();
}

fetch('./data/listening.json')
  .then(function(r) { return r.json(); })
  .then(function(data) {
    DATA = data;
    RKLang.init(applyLang);
    applyLang(LANG);
  })
  .catch(function() {
    document.getElementById('cardList').textContent = 'Error loading data.';
  });
