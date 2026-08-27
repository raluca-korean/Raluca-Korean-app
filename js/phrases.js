var LANG = RKLang.get();
var MODE = 'situations';
var CAT = null;
var DATA = { situations: [], vocab: [] };

var I18N = {
  ro: {
    title: 'Expresii',
    sub: 'Fraze uzuale și vocabular ilustrat, pe situații',
    tabSituations: '💬 Expresii',
    tabVocab: '🖼️ Vocabular',
    playHint: 'Apasă pentru a asculta',
    loading: 'Se încarcă...'
  },
  en: {
    title: 'Phrases',
    sub: 'Everyday expressions and illustrated vocabulary, by situation',
    tabSituations: '💬 Phrases',
    tabVocab: '🖼️ Vocabulary',
    playHint: 'Tap to listen',
    loading: 'Loading...'
  }
};

function t(k) { return I18N[LANG][k]; }

/* ── TTS ────────────────────────────────────────────── */
function playTTS(text) {
  AudioEngine.speak(text);
}

/* ── MODE TABS ──────────────────────────────────────── */
function renderModeRow() {
  var row = document.getElementById('modeRow');
  row.innerHTML = '';
  [
    { id: 'situations', label: t('tabSituations') },
    { id: 'vocab', label: t('tabVocab') }
  ].forEach(function(m) {
    var btn = document.createElement('button');
    btn.className = 'mode-btn' + (m.id === MODE ? ' active' : '');
    btn.textContent = m.label;
    btn.onclick = function() {
      if (MODE === m.id) return;
      MODE = m.id;
      CAT = null;
      renderModeRow();
      renderCatRow();
      renderContent();
    };
    row.appendChild(btn);
  });
}

/* ── CATEGORY CHIPS ─────────────────────────────────── */
function currentCats() {
  return DATA[MODE] || [];
}

function renderCatRow() {
  var row = document.getElementById('catRow');
  row.innerHTML = '';
  var cats = currentCats();
  if (!CAT && cats.length) CAT = cats[0].id;
  cats.forEach(function(cat) {
    var btn = document.createElement('button');
    btn.className = 'cat-chip' + (cat.id === CAT ? ' active' : '');
    btn.innerHTML = '<span class="cat-ico">' + cat.icon + '</span>' + cat[LANG];
    btn.onclick = function() {
      CAT = cat.id;
      renderCatRow();
      renderContent();
    };
    row.appendChild(btn);
  });
}

/* ── CONTENT ────────────────────────────────────────── */
function buildPhraseCard(item) {
  var div = document.createElement('div');
  div.className = 'ph-card';
  div.innerHTML = [
    '<button class="ph-play" aria-label="' + t('playHint') + '">🔊</button>',
    '<div class="ph-body">',
      '<div class="ph-ko">' + item.ko + '</div>',
      '<div class="ph-rom">' + item.rom + '</div>',
      '<div class="ph-tr">' + item[LANG] + '</div>',
    '</div>'
  ].join('');
  div.querySelector('.ph-play').onclick = function() { playTTS(item.ko); };
  div.onclick = function(e) { if (!e.target.closest('.ph-play')) playTTS(item.ko); };
  return div;
}

function buildVocabTile(item) {
  var div = document.createElement('div');
  div.className = 'vc-tile';
  div.innerHTML = [
    '<div class="vc-emoji">' + item.emoji + '</div>',
    '<div class="vc-ko">' + item.ko + '</div>',
    '<div class="vc-rom">' + item.rom + '</div>',
    '<div class="vc-tr">' + item[LANG] + '</div>'
  ].join('');
  div.onclick = function() { playTTS(item.ko); };
  return div;
}

function renderContent() {
  var wrap = document.getElementById('content');
  wrap.innerHTML = '';
  var cats = currentCats();
  var cat = cats.filter(function(c) { return c.id === CAT; })[0];
  if (!cat) return;

  if (MODE === 'situations') {
    var list = document.createElement('div');
    list.className = 'ph-list';
    cat.items.forEach(function(item) { list.appendChild(buildPhraseCard(item)); });
    wrap.appendChild(list);
  } else {
    var grid = document.createElement('div');
    grid.className = 'vc-grid';
    cat.items.forEach(function(item) { grid.appendChild(buildVocabTile(item)); });
    wrap.appendChild(grid);
  }
}

/* ── LANG ───────────────────────────────────────────── */
function applyLang(lang) {
  LANG = lang;
  document.documentElement.lang = lang;
  document.getElementById('pageTitle').textContent = t('title');
  document.getElementById('pageSub').textContent = t('sub');
  renderModeRow();
  renderCatRow();
  renderContent();
}

fetch('./data/phrases.json')
  .then(function(r) { return r.json(); })
  .then(function(data) {
    DATA = data;
    RKLang.init(applyLang);
    applyLang(LANG);
  })
  .catch(function() {
    document.getElementById('content').textContent = 'Error loading data.';
  });
