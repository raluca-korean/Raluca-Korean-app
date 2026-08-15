var LANG = RKLang.get();
var FILTER = 0;
var DATA = [];
var streak = 0;

var I18N = {
  ro: {
    title: 'Numere & Clasificatoare',
    sub: 'Numere native vs. sino-coreene',
    all: 'Toate',
    nativeName: 'Nativ coreean',
    nativeDesc: '하나, 둘, 셋... — obiecte, vârstă, ore',
    sinoName: 'Sino-coreean',
    sinoDesc: '일, 이, 삼... — bani, minute, date, etaje'
  },
  en: {
    title: 'Numbers & Counters',
    sub: 'Native Korean vs. Sino-Korean numbers',
    all: 'All',
    nativeName: 'Native Korean',
    nativeDesc: '하나, 둘, 셋... — objects, age, hours',
    sinoName: 'Sino-Korean',
    sinoDesc: '일, 이, 삼... — money, minutes, dates, floors'
  }
};

function t(k) { return I18N[LANG][k]; }

function playTTS(text, rate) {
  speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(text);
  u.lang = 'ko-KR';
  u.rate = rate || 1;
  speechSynthesis.speak(u);
}

function todayISO() { return new Date().toISOString().slice(0, 10); }

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
  if (!s.byType.numbers) s.byType.numbers = { total: 0, correct: 0 };
  s.byType.numbers.total++;
  if (isCorrect) s.byType.numbers.correct++;
  localStorage.setItem('RK_STATS', JSON.stringify(s));
  if (isCorrect && window.RKGamification) RKGamification.addXP(streak);
}

function renderSystemCards() {
  var wrap = document.getElementById('sysRow');
  if (!wrap) return;
  wrap.innerHTML =
    '<div class="sys-card native"><div class="sys-name">' + t('nativeName') + '</div><div class="sys-desc">' + t('nativeDesc') + '</div></div>' +
    '<div class="sys-card sino"><div class="sys-name">' + t('sinoName') + '</div><div class="sys-desc">' + t('sinoDesc') + '</div></div>';
}

function buildCard(item) {
  var div = document.createElement('div');
  div.className = 'n-card';

  var templateHTML = item.template.replace('___', '<span class="n-blank">___</span>');

  var opts = item.options.map(function(o, i) {
    return '<button class="n-opt" data-i="' + i + '">' + o + '</button>';
  }).join('');

  div.innerHTML = [
    '<div class="n-badge">TOPIK ' + item.topik + '</div>',
    '<div class="n-template">' + templateHTML + '</div>',
    '<div class="n-context">' + item.context[LANG] + '</div>',
    '<div class="n-options">' + opts + '</div>',
    '<div class="n-reveal">',
      '<div class="n-reveal-row">',
        '<button class="n-play-btn b-play">🔊</button>',
        '<div class="n-reveal-ko">' + item.full + '</div>',
      '</div>',
      '<div class="n-reveal-rom">' + item.rom + '</div>',
      '<div class="n-reveal-note">' + item.note[LANG] + '</div>',
    '</div>'
  ].join('');

  div.querySelector('.b-play').onclick = function() { playTTS(item.full, 1); };

  var optBtns = div.querySelectorAll('.n-opt');
  var revealBox = div.querySelector('.n-reveal');
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
      if (isCorrect) setTimeout(function() { playTTS(item.full, 1); }, 300);
    };
  });

  return div;
}

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
  renderSystemCards();
  if (!DATA.length) return;
  renderFilter();
  renderCards();
}

fetch('./data/numbers.json')
  .then(function(r) { return r.json(); })
  .then(function(data) {
    DATA = data;
    RKLang.init(applyLang);
    applyLang(LANG);
  })
  .catch(function() {
    document.getElementById('cardList').textContent = 'Error loading data.';
  });
