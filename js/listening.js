var LANG = RKLang.get();
// Level shown first: ?level=N, else the learner's TOPIK level (RK_TOPIK_PROGRESS,
// set by js/core/level-progress.js), else 1. 0 = general evaluation (all levels).
var MY_LEVEL = (function () {
  var v = parseInt(localStorage.getItem('RK_TOPIK_PROGRESS') || localStorage.getItem('RK_LEVEL'), 10);
  return (v >= 1 && v <= 6) ? v : 1;
})();
var FILTER = (function () {
  var p = new URLSearchParams(location.search).get('level');
  if (p === 'all') return 0;
  var lvl = parseInt(p, 10);
  return (lvl >= 1 && lvl <= 6) ? lvl : MY_LEVEL;
})();
var EVAL_COUNT = 12;   // questions in the general evaluation
var ROUND_SIZE = 15;   // questions per round; each level is split into fixed rounds (by id order)
var PASS = 0.8;        // a round is passed at 80%
var ROUND = 0;         // current round (1-based); 0 = pick the first round not yet passed
var BEST_KEY = 'RK_LISTEN_BEST';
var session = null;    // { items, index, correct, byLevel }
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
    dailyBadge: '🎯 Azi',
    evalAll: '🎯 Evaluare generală',
    yourLevel: 'nivelul tău',
    question: function (i, n) { return 'Întrebarea ' + i + ' din ' + n; },
    next: 'Următoarea →', finish: 'Vezi rezultatul →',
    doneTitle: function (lvl, r) { return lvl ? 'TOPIK ' + lvl + ' · Runda ' + r + ' terminată!' : 'Evaluare încheiată!'; },
    round: function (r) { return 'Runda ' + r; },
    roundsDone: function (p, n) { return 'Runde trecute: ' + p + ' din ' + n + ' (fiecare cu ' + ROUND_SIZE + ' întrebări, treci cu 80%)'; },
    nextRound: function (r) { return '➡️ Runda ' + r; },
    levelMastered: function (l) { return '🏅 Ai trecut toate rundele de la TOPIK ' + l + '!'; },
    doneScore: function (c, n) { return 'Ai răspuns corect la ' + c + ' din ' + n + ' întrebări.'; },
    best: function (b, n) { return 'Cel mai bun rezultat: ' + b + '/' + n; },
    msgGreat: 'Excelent! Ai trecut runda — urechea ta se descurcă foarte bine. 🌟',
    msgGood: 'Foarte bine! Mai exersează puțin și treci mai departe. 💪',
    msgTry: 'Nu-i nimic — ascultă din nou, cu 🐢 Lent, și încearcă iar. 🎧',
    again: '🔁 Încă o dată', nextLevel: function (n) { return '⬆️ Încearcă TOPIK ' + n; },
    toEval: '🎯 Evaluare generală', home: '🏠 Acasă',
    byLevel: 'Rezultat pe niveluri',
    suggest: function (n) { return 'Nivelul potrivit pentru tine la ascultare: TOPIK ' + n; }
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
    dailyBadge: '🎯 Today',
    evalAll: '🎯 General evaluation',
    yourLevel: 'your level',
    question: function (i, n) { return 'Question ' + i + ' of ' + n; },
    next: 'Next →', finish: 'See your result →',
    doneTitle: function (lvl, r) { return lvl ? 'TOPIK ' + lvl + ' · Round ' + r + ' complete!' : 'Evaluation complete!'; },
    round: function (r) { return 'Round ' + r; },
    roundsDone: function (p, n) { return 'Rounds passed: ' + p + ' of ' + n + ' (' + ROUND_SIZE + ' questions each, pass at 80%)'; },
    nextRound: function (r) { return '➡️ Round ' + r; },
    levelMastered: function (l) { return '🏅 You passed every TOPIK ' + l + ' round!'; },
    doneScore: function (c, n) { return 'You got ' + c + ' out of ' + n + ' right.'; },
    best: function (b, n) { return 'Best result: ' + b + '/' + n; },
    msgGreat: 'Excellent! Round passed — your ear is doing great. 🌟',
    msgGood: 'Very good! A little more practice and move on. 💪',
    msgTry: "No worries — listen again with 🐢 Slow and try once more. 🎧",
    again: '🔁 Try again', nextLevel: function (n) { return '⬆️ Try TOPIK ' + n; },
    toEval: '🎯 General evaluation', home: '🏠 Home',
    byLevel: 'Result by level',
    suggest: function (n) { return 'Your listening level: TOPIK ' + n; }
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
  return RKStorage.get('RK_DAILY_LISTEN', null);
}
function saveDaily(data) {
  RKStorage.set('RK_DAILY_LISTEN', data);
}
function pickDailyItem() {
  var epochDay = Math.floor(Date.now() / 86400000);
  var pool = DATA.filter(function (x) { return x.topik === MY_LEVEL; });
  if (!pool.length) pool = DATA;
  return pool[epochDay % pool.length];
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
  var s = RKStorage.get('RK_STATS', null);
  if (!s) s = { total: 0, correct: 0, bestStreak: 0, today: today, todayTotal: 0, todayCorrect: 0, byType: {} };
  if (s.today !== today) { s.today = today; s.todayTotal = 0; s.todayCorrect = 0; }
  s.total++;
  s.todayTotal++;
  if (isCorrect) { s.correct++; s.todayCorrect++; streak++; } else { streak = 0; }
  if (streak > s.bestStreak) s.bestStreak = streak;
  if (!s.byType.listening) s.byType.listening = { total: 0, correct: 0 };
  s.byType.listening.total++;
  if (isCorrect) s.byType.listening.correct++;
  RKStorage.set('RK_STATS', s);
  if (isCorrect && window.RKGamification) RKGamification.addXP(streak);
}

/* ── BUILD CARD ─────────────────────────────────────── */
function buildCard(item, onChecked, autoplay) {
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

  // Auto-play only the card in focus (the quiz question), not every card on the page.
  if (autoplay) setTimeout(function() { playTTS(item.ko, 1); }, 350);

  return div;
}

/* ── RENDER: filter chips + one question at a time + final screen ── */
function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
function loadBest() { return RKStorage.get(BEST_KEY, {}); }
function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

// Fixed rounds per level: the level's questions in id order, cut into chunks of ROUND_SIZE.
// A last chunk shorter than half a round is merged into the previous one.
function levelRounds(lvl) {
  var pool = DATA.filter(function (x) { return x.topik === lvl; }).sort(function (a, b) { return a.id - b.id; });
  var rounds = [];
  for (var i = 0; i < pool.length; i += ROUND_SIZE) rounds.push(pool.slice(i, i + ROUND_SIZE));
  if (rounds.length > 1 && rounds[rounds.length - 1].length < ROUND_SIZE / 2) {
    var last = rounds.pop(); rounds[rounds.length - 1] = rounds[rounds.length - 1].concat(last);
  }
  return rounds;
}
// Best scores live in RK_LISTEN_BEST as { "<level>-<round>": bestCorrect }.
function roundBest(lvl, r) { var b = loadBest()[lvl + '-' + r]; return typeof b === 'number' ? b : null; }
function roundPassed(lvl, r, size) { var b = roundBest(lvl, r); return b != null && b >= Math.ceil(size * PASS); }
function passedCount(lvl) {
  return levelRounds(lvl).filter(function (items, i) { return roundPassed(lvl, i + 1, items.length); }).length;
}
function levelMastered(lvl) { var n = levelRounds(lvl).length; return n > 0 && passedCount(lvl) === n; }
function firstOpenRound(lvl) {
  var rounds = levelRounds(lvl);
  for (var i = 0; i < rounds.length; i++) if (!roundPassed(lvl, i + 1, rounds[i].length)) return i + 1;
  return 1;
}
function selectLevel(lvl) { FILTER = lvl; ROUND = lvl ? firstOpenRound(lvl) : 0; renderFilter(); startSession(); }
function selectRound(r) { ROUND = r; renderFilter(); startSession(); }

function renderFilter() {
  var row = document.getElementById('filterRow');
  row.innerHTML = '';
  [1, 2, 3, 4, 5, 6, 0].forEach(function (lvl) {
    var btn = document.createElement('button');
    btn.className = 'filter-btn' + (lvl === FILTER ? ' active' : '') + (lvl === 0 ? ' filter-eval' : '');
    btn.innerHTML = lvl === 0 ? esc(t('evalAll'))
      : 'TOPIK ' + lvl + (levelMastered(lvl) ? ' ✓' : '') + (lvl === MY_LEVEL ? '<span class="filter-mine">' + esc(t('yourLevel')) + '</span>' : '');
    btn.onclick = function () { selectLevel(lvl); };
    row.appendChild(btn);
  });
  renderRounds();
}

function renderRounds() {
  var box = document.getElementById('roundRow');
  if (!box) {
    box = document.createElement('div');
    box.id = 'roundRow'; box.className = 'round-row';
    document.getElementById('filterRow').insertAdjacentElement('afterend', box);
  }
  if (!FILTER) { box.innerHTML = ''; box.style.display = 'none'; return; }
  box.style.display = '';
  if (!ROUND) ROUND = firstOpenRound(FILTER);
  var rounds = levelRounds(FILTER);
  var html = '<div class="round-chips">' + rounds.map(function (items, i) {
    var r = i + 1, b = roundBest(FILTER, r), ok = roundPassed(FILTER, r, items.length);
    return '<button class="round-btn' + (r === ROUND ? ' active' : '') + (ok ? ' passed' : '') + '" data-r="' + r + '">' +
      esc(t('round')(r)) + (ok ? ' ✓' : '') +
      '<small>' + (b != null ? b + '/' + items.length : '– /' + items.length) + '</small></button>';
  }).join('') + '</div>' +
  '<div class="round-info">' + esc(t('roundsDone')(passedCount(FILTER), rounds.length)) + '</div>';
  box.innerHTML = html;
  Array.prototype.forEach.call(box.querySelectorAll('.round-btn'), function (b) {
    b.onclick = function () { selectRound(parseInt(b.getAttribute('data-r'), 10)); };
  });
}

function startSession() {
  // General evaluation: the same number from every level (2 each), easiest first.
  var perLevel = Math.max(1, Math.round(EVAL_COUNT / 6));
  var items;
  if (FILTER === 0) {
    items = [1, 2, 3, 4, 5, 6].reduce(function (acc, L) {
      return acc.concat(shuffle(DATA.filter(function (x) { return x.topik === L; })).slice(0, perLevel));
    }, []);
  } else {
    var rounds = levelRounds(FILTER);
    if (!ROUND || ROUND > rounds.length) ROUND = firstOpenRound(FILTER);
    items = shuffle(rounds[ROUND - 1] || []);
  }
  session = { level: FILTER, round: ROUND, items: items, index: 0, correct: 0, byLevel: {} };
  renderQuestion();
}

function renderQuestion() {
  var list = document.getElementById('cardList');
  var n = session.items.length, i = session.index;
  var item = session.items[i];
  list.innerHTML =
    '<div class="l-progress">' +
      '<div class="l-progress-txt">' + esc(t('question')(i + 1, n)) + '</div>' +
      '<div class="l-progress-bar"><i style="width:' + Math.round(i / n * 100) + '%"></i></div>' +
    '</div>';
  var card = buildCard(item, function (ok) {
    var b = session.byLevel[item.topik] || (session.byLevel[item.topik] = { c: 0, n: 0 });
    b.n++; if (ok) { b.c++; session.correct++; }
    var next = document.createElement('button');
    next.className = 'primary l-next';
    next.textContent = i + 1 < n ? t('next') : t('finish');
    next.onclick = function () {
      session.index++;
      if (session.index < n) renderQuestion(); else renderSummary();
      document.getElementById('filterRow').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    card.appendChild(next);
    next.focus({ preventScroll: true });
  }, true);
  list.appendChild(card);
}

function renderSummary() {
  var list = document.getElementById('cardList');
  var n = session.items.length, c = session.correct, lvl = session.level, rnd = session.round;
  var ratio = n ? c / n : 0;
  var wasMastered = lvl && levelMastered(lvl);
  if (lvl) {
    var best = loadBest(), key = lvl + '-' + rnd;
    if (typeof best[key] !== 'number' || c > best[key]) { best[key] = c; RKStorage.set(BEST_KEY, best); }
  }
  var nRounds = lvl ? levelRounds(lvl).length : 0;
  var passed = ratio >= PASS;
  var mastered = lvl && levelMastered(lvl);
  var emoji = ratio >= 0.8 ? '🏆' : ratio >= 0.5 ? '🎉' : '🎧';
  var msg = ratio >= 0.8 ? t('msgGreat') : ratio >= 0.5 ? t('msgGood') : t('msgTry');
  var html = '<div class="l-card l-summary">' +
    '<div class="l-sum-emoji">' + emoji + '</div>' +
    '<div class="l-sum-title">' + esc(t('doneTitle')(lvl, rnd)) + '</div>' +
    '<div class="l-sum-score"><b>' + c + '</b> / ' + n + '</div>' +
    '<div class="l-sum-bar"><i style="width:' + Math.round(ratio * 100) + '%"></i></div>' +
    '<div class="l-sum-text">' + esc(t('doneScore')(c, n)) + '</div>' +
    '<div class="l-sum-msg">' + esc(msg) + '</div>';
  if (lvl) {
    html += '<div class="l-sum-best">' + esc(t('best')(roundBest(lvl, rnd), n)) + '</div>' +
      '<div class="l-sum-best">' + esc(t('roundsDone')(passedCount(lvl), nRounds)) + '</div>' +
      (mastered && !wasMastered ? '<div class="l-sum-msg">' + esc(t('levelMastered')(lvl)) + '</div>' : '');
  } else {
    // General evaluation: score per level and a suggested level.
    var levels = Object.keys(session.byLevel).map(Number).sort();
    var suggest = 1;
    levels.forEach(function (L) { var b = session.byLevel[L]; if (b.c / b.n >= 0.6) suggest = Math.max(suggest, L); });
    html += '<div class="l-sum-levels"><div class="l-sum-levels-title">' + esc(t('byLevel')) + '</div>' +
      levels.map(function (L) { var b = session.byLevel[L];
        return '<div class="l-sum-lvl"><span>TOPIK ' + L + '</span><span class="l-sum-lvl-bar"><i style="width:' + Math.round(b.c / b.n * 100) + '%"></i></span><b>' + b.c + '/' + b.n + '</b></div>'; }).join('') +
      '</div><div class="l-sum-best">' + esc(t('suggest')(suggest)) + '</div>';
  }
  html += '<div class="l-sum-actions">' +
    '<button class="primary" id="sumAgain">' + esc(t('again')) + '</button>' +
    (lvl && passed && rnd < nRounds ? '<button class="primary" id="sumRound">' + esc(t('nextRound')(rnd + 1)) + '</button>' : '') +
    (lvl && lvl < 6 && mastered ? '<button class="primary" id="sumNext">' + esc(t('nextLevel')(lvl + 1)) + '</button>' : '') +
    (lvl ? '<button class="primary" id="sumEval">' + esc(t('toEval')) + '</button>' : '') +
    '<a class="l-sum-home" href="index.html">' + esc(t('home')) + '</a>' +
  '</div></div>';
  list.innerHTML = html;
  document.getElementById('sumAgain').onclick = startSession;
  var nx = document.getElementById('sumNext');
  if (nx) nx.onclick = function () { selectLevel(lvl + 1); };
  var nr = document.getElementById('sumRound');
  if (nr) nr.onclick = function () { selectRound(rnd + 1); };
  var ev = document.getElementById('sumEval');
  if (ev) ev.onclick = function () { selectLevel(0); };
  if (passed && typeof window.confetti === 'function') window.confetti();
  renderFilter();
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
  startSession();
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
