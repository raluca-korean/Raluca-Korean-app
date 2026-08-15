var LANG = RKLang.get();
var FILTER = 0;
var DATA = [];
var streak = 0;

var I18N = {
  ro: {
    title: 'Onorifice & Cultură',
    sub: '존댓말 vs 반말 · vârsta coreeană · titluri',
    levelsTitle: '📊 3 niveluri de politețe',
    ageTitle: '🎂 Vârsta coreeană',
    ageBody: '<p>Din 2023, vârsta oficială în Coreea este <b>vârsta internațională</b> (ca în România) — se folosește la acte, contracte și majoritatea legilor.</p><p>Totuși, informal, mulți coreeni încă gândesc în <b>vârsta coreeană</b> (세는나이): te naști deja cu 1 an, iar toată lumea „mai câștigă” un an de Anul Nou, nu de ziua de naștere. De-asta un coreean întreabă des vârsta — determină cine e mai mare și cum se vorbește.</p>',
    titlesTitle: '👪 Titluri de adresare',
    etiquetteTitle: '🙏 Reguli de bază',
    quizTitle: '✏️ Exersează: din 반말 în forma politicoasă',
    all: 'Toate',
    banmal: '반말',
    haeyo: '해요체',
    hapsyo: '합쇼체'
  },
  en: {
    title: 'Honorifics & Culture',
    sub: 'Formal vs casual speech · Korean age · titles',
    levelsTitle: '📊 3 politeness levels',
    ageTitle: '🎂 Korean age',
    ageBody: "<p>Since 2023, the official age in Korea is the <b>international age</b> (same as in most Western countries) — used for legal documents, contracts, and most laws.</p><p>Informally though, many Koreans still think in terms of <b>Korean age</b> (세는나이): you're born already at 1, and everyone gains a year on New Year's Day, not on their birthday. That's why Koreans often ask your age — it determines who's older and how to speak to each other.</p>",
    titlesTitle: '👪 Address titles',
    etiquetteTitle: '🙏 Basic etiquette',
    quizTitle: '✏️ Practice: casual → polite',
    all: 'All',
    banmal: 'CASUAL',
    haeyo: '해요체',
    hapsyo: '합쇼체'
  }
};

var LEVELS = [
  { cls: 'banmal', ex: '밥 먹었어?', desc: { ro: '반말 — prieteni apropiați, cei mai mici', en: '반말 — close friends, younger people' } },
  { cls: 'haeyo',  ex: '밥 먹었어요?', desc: { ro: '해요체 — politicos standard, folosit zilnic', en: '해요체 — standard polite, everyday use' } },
  { cls: 'hapsyo', ex: '식사하셨습니까?', desc: { ro: '합쇼체 — formal, anunțuri/prezentări', en: '합쇼체 — formal, announcements/presentations' } }
];

var TITLES = [
  { ko: '오빠', desc: { ro: 'fată → un băiat/bărbat mai mare (frate/prieten)', en: 'female → an older male (brother/friend)' } },
  { ko: '언니', desc: { ro: 'fată → o fată/femeie mai mare (soră/prietenă)', en: 'female → an older female (sister/friend)' } },
  { ko: '형',   desc: { ro: 'băiat → un băiat/bărbat mai mare (frate/prieten)', en: 'male → an older male (brother/friend)' } },
  { ko: '누나', desc: { ro: 'băiat → o fată/femeie mai mare (soră/prietenă)', en: 'male → an older female (sister/friend)' } },
  { ko: '선생님', desc: { ro: 'profesor, sau termen respectuos general', en: 'teacher, or a general respectful term' } },
  { ko: '사장님', desc: { ro: 'șef, patron', en: 'boss, business owner' } }
];

var ETIQUETTE = {
  ro: [
    'Te apleci ușor (bow) la salut, mai adânc pentru persoane mai în vârstă.',
    'Dai și primești obiecte cu ambele mâini de la cineva mai în vârstă.',
    'Când bei alcool în fața unei persoane mai în vârstă, întorci capul într-o parte.',
    'Îți scoți încălțămintea când intri într-o casă.',
    'Nu începi să mănânci înaintea celei mai în vârstă persoane de la masă.'
  ],
  en: [
    'You bow slightly when greeting, deeper for older people.',
    'You give and receive items with both hands from someone older.',
    'When drinking alcohol in front of an older person, you turn your head away.',
    'You take off your shoes when entering a home.',
    "You don't start eating before the oldest person at the table does."
  ]
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
  if (!s.byType.honorifics) s.byType.honorifics = { total: 0, correct: 0 };
  s.byType.honorifics.total++;
  if (isCorrect) s.byType.honorifics.correct++;
  localStorage.setItem('RK_STATS', JSON.stringify(s));
  if (isCorrect && window.RKGamification) RKGamification.addXP(streak);
}

function renderReference() {
  document.getElementById('levelsTitle').textContent = t('levelsTitle');
  var levelsWrap = document.getElementById('levelRow');
  levelsWrap.innerHTML = LEVELS.map(function(l) {
    return '<div class="level-item"><span class="level-name ' + l.cls + '">' + t(l.cls) + '</span><span class="level-ex">' + l.ex + '</span><span class="level-desc">' + l.desc[LANG] + '</span></div>';
  }).join('');

  document.getElementById('ageTitle').textContent = t('ageTitle');
  document.getElementById('ageBody').innerHTML = t('ageBody');

  document.getElementById('titlesTitle').textContent = t('titlesTitle');
  document.getElementById('titleTable').innerHTML = TITLES.map(function(x) {
    return '<div class="title-row"><span class="title-ko">' + x.ko + '</span><span class="title-desc">' + x.desc[LANG] + '</span></div>';
  }).join('');

  document.getElementById('etiquetteTitle').textContent = t('etiquetteTitle');
  document.getElementById('etiquetteList').innerHTML = ETIQUETTE[LANG].map(function(x) {
    return '<li>' + x + '</li>';
  }).join('');
}

function buildCard(item) {
  var div = document.createElement('div');
  div.className = 'h-card';

  var opts = item.options.map(function(o, i) {
    return '<button class="h-opt" data-i="' + i + '">' + o + '</button>';
  }).join('');

  div.innerHTML = [
    '<div class="h-badge">TOPIK ' + item.topik + '</div>',
    '<div class="h-context">' + item.context[LANG] + '</div>',
    '<div class="h-casual"><span class="tag">' + t('banmal') + '</span>' + item.casual + '</div>',
    '<div class="h-options">' + opts + '</div>',
    '<div class="h-note">' + item.note[LANG] + '</div>'
  ].join('');

  var optBtns = div.querySelectorAll('.h-opt');
  var noteBox = div.querySelector('.h-note');
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
      noteBox.classList.add('on');
      saveStats(isCorrect);
      if (isCorrect) setTimeout(function() { playTTS(item.options[item.correct], 1); }, 300);
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
  document.getElementById('pageTitle').textContent = t('title');
  document.getElementById('pageSub').textContent = t('sub');
  document.getElementById('quizTitle').textContent = t('quizTitle');
  renderReference();
  if (!DATA.length) return;
  renderFilter();
  renderCards();
}

fetch('./data/honorifics.json')
  .then(function(r) { return r.json(); })
  .then(function(data) {
    DATA = data;
    RKLang.init(applyLang);
    applyLang(LANG);
  })
  .catch(function() {
    document.getElementById('cardList').textContent = 'Error loading data.';
  });
