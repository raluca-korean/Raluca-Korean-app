var LANG = RKLang.get();
var FILTER_TOPIK = 0;
var FILTER_TYPE = 'all';
var DATA = [];

var I18N = {
  ro: {
    title: 'Versuri & Replici',
    sub: 'Învață coreeana din versuri și replici de dramă',
    disclaimer: 'Conținut original, creat pentru exersare — nu sunt versuri sau replici reale din piese sau seriale existente.',
    all: 'Toate',
    typeAll: 'Toate',
    typeSong: '🎵 Versuri',
    typeDrama: '🎬 Replici',
    playAll: '▶️ Ascultă tot',
    showTr: '👁️ Arată traducerea',
    hideTr: '🙈 Ascunde traducerea',
    song: 'Versuri',
    drama: 'Replici'
  },
  en: {
    title: 'Lyrics & Drama Lines',
    sub: 'Learn Korean through song verses and drama scenes',
    disclaimer: 'Original practice content, written for this app — not real lyrics or lines from existing songs or shows.',
    all: 'All',
    typeAll: 'All',
    typeSong: '🎵 Lyrics',
    typeDrama: '🎬 Drama',
    playAll: '▶️ Play all',
    showTr: '👁️ Show translation',
    hideTr: '🙈 Hide translation',
    song: 'Lyrics',
    drama: 'Drama'
  }
};

function t(k) { return I18N[LANG][k]; }

function playTTS(text, rate) {
  var u = new SpeechSynthesisUtterance(text);
  u.lang = 'ko-KR';
  u.rate = rate || 1;
  speechSynthesis.speak(u);
}

function playAll(item) {
  speechSynthesis.cancel();
  item.lines.forEach(function(line) { playTTS(line.ko, 1); });
}

function buildCard(item) {
  var div = document.createElement('div');
  div.className = 'ly-card';

  var linesHTML = item.lines.map(function(line) {
    var speakerHTML = line.speaker ? '<span class="ly-speaker">' + line.speaker + '</span>' : '';
    return (
      '<div class="ly-line">' +
        speakerHTML +
        '<div class="ly-line-text b-line" data-ko="' + line.ko.replace(/"/g, '&quot;') + '">' +
          '<div class="ly-ko">' + line.ko + '</div>' +
          '<div class="ly-rom">' + line.rom + '</div>' +
          '<div class="ly-tr">' + line[LANG] + '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');

  var vocabHTML = item.vocab.map(function(v) {
    return '<span class="ly-vchip">' + v.ko + ' — ' + v[LANG] + '</span>';
  }).join('');

  div.innerHTML = [
    '<div class="ly-head">',
      '<span class="ly-mood">' + item.mood + '</span>',
      '<div>',
        '<div class="ly-title">' + item.title[LANG] + '</div>',
        '<div class="ly-badges">',
          '<span class="ly-badge topik">TOPIK ' + item.topik + '</span>',
          '<span class="ly-badge ' + item.type + '">' + t(item.type) + '</span>',
        '</div>',
      '</div>',
    '</div>',
    '<div class="ly-actions">',
      '<button class="ly-btn playall b-playall">' + t('playAll') + '</button>',
      '<button class="ly-btn b-toggletr">' + t('showTr') + '</button>',
    '</div>',
    '<div class="ly-lines">' + linesHTML + '</div>',
    '<div class="ly-vocab">' + vocabHTML + '</div>'
  ].join('');

  div.querySelector('.b-playall').onclick = function() { playAll(item); };

  var toggleBtn = div.querySelector('.b-toggletr');
  toggleBtn.onclick = function() {
    var showing = div.classList.toggle('showtr');
    toggleBtn.textContent = showing ? t('hideTr') : t('showTr');
  };

  div.querySelectorAll('.b-line').forEach(function(el) {
    el.onclick = function() { speechSynthesis.cancel(); playTTS(el.getAttribute('data-ko'), 1); };
  });

  return div;
}

function renderTypeFilter() {
  var row = document.getElementById('typeFilterRow');
  row.innerHTML = '';
  var types = [
    { key: 'all',   label: t('typeAll') },
    { key: 'song',  label: t('typeSong') },
    { key: 'drama', label: t('typeDrama') }
  ];
  types.forEach(function(tp) {
    var btn = document.createElement('button');
    btn.className = 'filter-btn' + (tp.key === FILTER_TYPE ? ' active' : '');
    btn.textContent = tp.label;
    btn.onclick = function() {
      FILTER_TYPE = tp.key;
      row.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      renderCards();
    };
    row.appendChild(btn);
  });
}

function renderLevelFilter() {
  var row = document.getElementById('levelFilterRow');
  row.innerHTML = '';
  var levels = [0, 1, 2, 3, 4, 5, 6];
  levels.forEach(function(lvl) {
    var btn = document.createElement('button');
    btn.className = 'filter-btn' + (lvl === FILTER_TOPIK ? ' active' : '');
    btn.textContent = lvl === 0 ? t('all') : 'TOPIK ' + lvl;
    btn.onclick = function() {
      FILTER_TOPIK = lvl;
      row.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      renderCards();
    };
    row.appendChild(btn);
  });
}

function renderCards() {
  var list = document.getElementById('cardList');
  var data = DATA.filter(function(x) {
    return (FILTER_TOPIK === 0 || x.topik === FILTER_TOPIK) && (FILTER_TYPE === 'all' || x.type === FILTER_TYPE);
  });
  list.innerHTML = '';
  data.forEach(function(item) { list.appendChild(buildCard(item)); });
}

function applyLang(lang) {
  LANG = lang;
  document.documentElement.lang = lang;
  var titleEl = document.getElementById('pageTitle');
  var subEl = document.getElementById('pageSub');
  var discEl = document.getElementById('disclaimer');
  if (titleEl) titleEl.textContent = t('title');
  if (subEl) subEl.textContent = t('sub');
  if (discEl) discEl.textContent = t('disclaimer');
  if (!DATA.length) return;
  renderTypeFilter();
  renderLevelFilter();
  renderCards();
}

fetch('./data/lyrics.json')
  .then(function(r) { return r.json(); })
  .then(function(data) {
    DATA = data;
    RKLang.init(applyLang);
    applyLang(LANG);
  })
  .catch(function() {
    document.getElementById('cardList').textContent = 'Error loading data.';
  });
