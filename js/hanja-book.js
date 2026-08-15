var DATA = []; // populated from data/hanja.json — see the fetch + boot() call at the end of this file

/* ═══════════════════════════════════════════════════════════
   COGNITIVE MORPHOGENESIS INTERFACE  —  CMI v1.0
   Adaptive Biomorphic Knowledge Field
   ═══════════════════════════════════════════════════════════ */

var lang        = localStorage.getItem('RK_LANG') || 'ro';
var learned     = JSON.parse(localStorage.getItem('RK_HJ_LEARNED') || '[]');
var bloomActive = -1;

/* Daily goal (today's review count — the app-wide streak itself now lives
   in js/core/streak.js / RK_STREAK, shared with every other page). */
var DAILY_GOAL  = 10;
var streakData  = JSON.parse(localStorage.getItem('RK_HJ_STREAK') || '{"today":0,"lastDate":""}');

function _todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function _checkAndUpdateStreak() {
  var today = _todayStr();
  if (streakData.lastDate === today) return;
  /* New day */
  streakData.today  = 0;
  streakData.lastDate = today;
  localStorage.setItem('RK_HJ_STREAK', JSON.stringify(streakData));
}

function _bumpStreak() {
  _checkAndUpdateStreak();
  streakData.today++;
  if (streakData.today === DAILY_GOAL) {
    var row = document.getElementById('streakRow');
    if (row) { row.classList.add('goal-reached'); setTimeout(function() { row.classList.remove('goal-reached'); }, 500); }
  }
  localStorage.setItem('RK_HJ_STREAK', JSON.stringify(streakData));
  _renderStreak();
}

function _renderStreak() {
  var sv = document.getElementById('streakVal');
  var gv = document.getElementById('goalVal');
  var gm = document.getElementById('goalMark');
  if (!sv) return;
  sv.textContent = window.RKStreak ? RKStreak.get().days : 0;
  gv.textContent = streakData.today + '/' + DAILY_GOAL;
  gm.textContent = streakData.today >= DAILY_GOAL ? ' ✓' : '';
}

/* SRS data: {reps, ease, interval(days), due(ms timestamp)} */
var srsData = JSON.parse(localStorage.getItem('RK_HJ_SRS') || '{}');

/* Silabe frecvente din vocabular care nu apar în cei 100 hanja principali */
var HANJA_SUPPLEMENT = {
  '교': {hanja:'校', meaning:{ro:'școală',en:'school'}},
  '분': {hanja:'分', meaning:{ro:'parte / a împărți',en:'part / divide'}},
  '습': {hanja:'習', meaning:{ro:'practică / obicei',en:'practice / habit'}},
  '영': {hanja:'英', meaning:{ro:'Anglia / erou',en:'England / hero'}},
  '한': {hanja:'韓', meaning:{ro:'Coreea',en:'Korea'}},
  '관': {hanja:'觀', meaning:{ro:'a observa',en:'to observe'}},
  '리': {hanja:'理', meaning:{ro:'principiu / rațiune',en:'principle / reason'}},
  '안': {hanja:'安', meaning:{ro:'siguranță / pace',en:'safety / peace'}},
  '급': {hanja:'給', meaning:{ro:'salariu / a furniza',en:'salary / to give'}},
  '작': {hanja:'作', meaning:{ro:'a crea',en:'to create'}},
  '당': {hanja:'當', meaning:{ro:'potrivit',en:'suitable / party'}},
  '본': {hanja:'本', meaning:{ro:'origine / bază',en:'origin / basis'}},
  '매': {hanja:'每', meaning:{ro:'fiecare',en:'every'}},
  '요': {hanja:'曜', meaning:{ro:'zi a săptămânii',en:'day of the week'}},
  '탄': {hanja:'誕', meaning:{ro:'naștere',en:'birth'}},
  '친': {hanja:'親', meaning:{ro:'aproape / rudă',en:'close / relative'}},
  '조': {hanja:'祖', meaning:{ro:'strămoș',en:'ancestor'}},
  '청': {hanja:'靑', meaning:{ro:'albastru / tânăr',en:'blue / young'}},
  '형': {hanja:'形', meaning:{ro:'formă',en:'form / shape'}},
  '위': {hanja:'偉', meaning:{ro:'măreț',en:'great'}},
  '단': {hanja:'單', meaning:{ro:'simplu / individual',en:'single / simple'}},
  '언': {hanja:'言', meaning:{ro:'vorbire / cuvânt',en:'speech / word'}},
  '하': {hanja:'下', meaning:{ro:'jos / sub',en:'below / under'}},
  '발': {hanja:'發', meaning:{ro:'a emite / pornire',en:'to emit / departure'}},
  '상': {hanja:'上', meaning:{ro:'sus / deasupra',en:'above / top'}},
  '족': {hanja:'族', meaning:{ro:'trib / neam',en:'tribe / clan'}},
  '재': {hanja:'才', meaning:{ro:'talent',en:'talent'}},
  '등': {hanja:'登', meaning:{ro:'a urca',en:'to climb'}},
  '악': {hanja:'樂', meaning:{ro:'muzică',en:'music'}},
  '흑': {hanja:'黑', meaning:{ro:'negru',en:'black'}},
  '유': {hanja:'有', meaning:{ro:'a exista / a avea',en:'to have / exist'}},
  '결': {hanja:'結', meaning:{ro:'a lega / rezultat',en:'to tie / result'}},
  '채': {hanja:'彩', meaning:{ro:'culoare / nuanță',en:'color / hue'}},
  '락': {hanja:'樂', meaning:{ro:'plăcere',en:'pleasure'}},
  '족': {hanja:'族', meaning:{ro:'clan / familie',en:'clan / family'}},
};

/* Lookup: silabă coreeană → {hanja, meaning} — construit din DATA odată încărcat */
var _hanjaByReading = {};
function _buildHanjaByReading() {
  var map = {};
  for (var syl in HANJA_SUPPLEMENT) map[syl] = HANJA_SUPPLEMENT[syl];
  for (var i = 0; i < DATA.length; i++) {
    var item = DATA[i];
    var parts = item.ko_reading.split(' ');
    for (var r = 0; r < parts.length; r++) {
      var syl = parts[r].trim();
      if (syl && !map[syl]) map[syl] = {hanja: item.hanja, meaning: item.meaning};
    }
  }
  return map;
}

function _renderMorphemes(word) {
  var el = document.getElementById('bloomMorphemes');
  if (!el) return;
  var syllables = Array.from(word);
  var found = syllables.some(function(s) { return !!_hanjaByReading[s]; });
  if (!found) { el.classList.add('hidden'); return; }

  var html = '';
  for (var i = 0; i < syllables.length; i++) {
    if (i > 0) html += '<span class="morph-sep">+</span>';
    var syl   = syllables[i];
    var entry = _hanjaByReading[syl];
    if (entry) {
      html += '<div class="morph-chip known">'
            + '<span class="mc-hanja">' + entry.hanja + '</span>'
            + '<span class="mc-syl">'   + syl          + '</span>'
            + '<span class="mc-mean">'  + entry.meaning[lang] + '</span>'
            + '</div>';
    } else {
      html += '<div class="morph-chip">'
            + '<span class="mc-syl">' + syl + '</span>'
            + '</div>';
    }
  }
  el.innerHTML = html;
  el.classList.remove('hidden');
}

/* Quiz state */
var quizMode  = false;
var quizScore = {ok: 0, total: 0};
var quizQ     = null;   /* {dataIdx, correctMeaning, options:[str×4]} */
var quizDone  = false;
var quizTimer = null;
var quizDeck  = [];     /* deck de parcurs: greșelile revin la coadă */
var quizInitialSize = 0;


/* Study queue: unlearned hanja first; marking learned sends them to the back */
var queue = [];
function _buildQueue() {
  var saved = localStorage.getItem('RK_HJ_QUEUE');
  if (saved) {
    var q = JSON.parse(saved);
    if (q.length === DATA.length) return q;
  }
  var q = [];
  for (var i = 0; i < DATA.length; i++) q.push(i);
  return q;
}
var queuePos = 0;
var idx      = 0;

var ORB_COLORS_DARK  = ['#9B6DFF','#FF6B8A','#4DFFB8','#FFB347'];
var ORB_COLORS_LIGHT = ['#5B21B6','#B91C1C','#065F46','#92400E'];
var ORB_ANGLES       = [-50, 50, 130, -130];
var ORB_CSS_VARS     = ['--c0','--c1','--c2','--c3'];

var UI_TEXT = {
  ro: { learn:'Am învățat', learned:'✓ \xCEnvățat', etym:'Etimologie' },
  en: { learn:'Mark Learned',  learned:'✓ Learned',              etym:'Etymology'  }
};

/* ── CANVAS PARTICLE FIELD ─────────────────────────────── */
var _canvas, _ctx, _particles = [], _raf;

function initCanvas() {
  _canvas = document.getElementById('fieldCanvas');
  _ctx    = _canvas.getContext('2d');
  _resizeCanvas();
  window.addEventListener('resize', _resizeCanvas);
  _spawnParticles();
  _animateCanvas();
}

function _resizeCanvas() {
  _canvas.width  = window.innerWidth;
  _canvas.height = window.innerHeight;
}

function _spawnParticles() {
  _particles = [];
  for (var i = 0; i < 28; i++) {
    _particles.push({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35,
      r:  .8 + Math.random() * 1.4,
      a:  .08 + Math.random() * .28
    });
  }
}

function _animateCanvas() {
  _raf = requestAnimationFrame(_animateCanvas);
  _ctx.clearRect(0, 0, _canvas.width, _canvas.height);

  var isLight = document.body.classList.contains('light-mode');
  var rgb     = isLight ? '15,10,30' : '91,255,245';
  var maxD    = 155;

  for (var i = 0; i < _particles.length; i++) {
    var p = _particles[i];
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = _canvas.width;
    if (p.x > _canvas.width)  p.x = 0;
    if (p.y < 0) p.y = _canvas.height;
    if (p.y > _canvas.height) p.y = 0;
    _ctx.beginPath();
    _ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    _ctx.fillStyle = 'rgba(' + rgb + ',' + (p.a * .55) + ')';
    _ctx.fill();
  }

  for (var i = 0; i < _particles.length - 1; i++) {
    for (var j = i + 1; j < _particles.length; j++) {
      var dx = _particles[i].x - _particles[j].x;
      var dy = _particles[i].y - _particles[j].y;
      var d  = Math.sqrt(dx*dx + dy*dy);
      if (d < maxD) {
        var a = (1 - d / maxD) * (isLight ? .032 : .062);
        _ctx.beginPath();
        _ctx.moveTo(_particles[i].x, _particles[i].y);
        _ctx.lineTo(_particles[j].x, _particles[j].y);
        _ctx.strokeStyle = 'rgba(' + rgb + ',' + a + ')';
        _ctx.lineWidth   = .5;
        _ctx.stroke();
      }
    }
  }
}

/* ── ORBITAL POSITIONING ───────────────────────────────── */
function orbRadius() {
  return Math.min(175, Math.max(110, window.innerWidth * 0.36));
}

function positionOrbitals() {
  var r = orbRadius();
  for (var i = 0; i < ORB_ANGLES.length; i++) {
    var rad   = ORB_ANGLES[i] * Math.PI / 180;
    var x     = Math.round(Math.cos(rad) * r);
    var y     = Math.round(Math.sin(rad) * r);
    var shell = document.getElementById('osh' + i);
    if (shell) shell.style.transform = 'translate(' + x + 'px,' + y + 'px)';
  }
}

/* ── RESONANCE SVG LINES ───────────────────────────────── */
var _resSVG = null;

function _getResSVG() {
  if (!_resSVG) _resSVG = document.getElementById('resSVG');
  return _resSVG;
}

function clearResonance() {
  var svg = _getResSVG();
  while (svg && svg.firstChild) svg.removeChild(svg.firstChild);
}

function drawResonance(wi) {
  var node = document.getElementById('orb' + wi);
  var nuc  = document.getElementById('nucCore');
  if (!node || !nuc) return;

  var nr = nuc.getBoundingClientRect();
  var or = node.getBoundingClientRect();
  var x1 = nr.left + nr.width  / 2;
  var y1 = nr.top  + nr.height / 2;
  var x2 = or.left + or.width  / 2;
  var y2 = or.top  + or.height / 2;

  var isLight = document.body.classList.contains('light-mode');
  var colors  = isLight ? ORB_COLORS_LIGHT : ORB_COLORS_DARK;

  var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
  line.setAttribute('stroke', colors[wi]);
  line.setAttribute('stroke-opacity', '0.22');
  line.setAttribute('stroke-width',   '1');
  _getResSVG().appendChild(line);
}

/* ── RENDER ────────────────────────────────────────────── */
function render(animate) {
  var item      = DATA[idx];
  var isLearned = learned.indexOf(idx) >= 0;

  /* Nucleus */
  document.getElementById('hanjaGlyph').textContent   = item.hanja;
  document.getElementById('glyphReading').textContent = item.reading[lang];
  document.getElementById('glyphMeaning').textContent = item.meaning[lang];

  var nuc = document.getElementById('nucleus');
  nuc.classList.toggle('learned', isLearned);

  if (animate) {
    nuc.classList.add('entering');
    setTimeout(function() { nuc.classList.remove('entering'); }, 600);
  }

  /* Orbital nodes */
  for (var i = 0; i < ORB_CSS_VARS.length; i++) {
    (function(i) {
      var shell = document.getElementById('osh' + i);
      var node  = document.getElementById('orb' + i);
      var w     = item.words[i];

      if (!w) { if (shell) shell.style.opacity = '0'; return; }
      if (shell) shell.style.opacity = '1';

      node.querySelector('.orbKo').textContent = w.ko;
      node.querySelector('.orbTr').textContent = w[lang];
      node.style.setProperty('--node-color', 'var(' + ORB_CSS_VARS[i] + ')');
      node.classList.remove('lit');

      if (animate && shell) {
        shell.classList.add('entering');
        setTimeout(function() { shell.classList.remove('entering'); }, 600 + i * 90);
      }
    })(i);
  }

  /* Close open panels */
  _closeBloom();
  _closeEtym();

  /* Etym button */
  var eb = document.getElementById('etymBtn');
  eb.style.visibility = item.etymology ? 'visible' : 'hidden';
  document.getElementById('etymLabel').textContent = UI_TEXT[lang].etym;

  /* Learn button */
  var lb = document.getElementById('learnBtn');
  lb.classList.toggle('done', isLearned);
  document.getElementById('learnText').textContent =
    isLearned ? UI_TEXT[lang].learned : UI_TEXT[lang].learn;

  /* Nav */
  document.getElementById('navPrev').disabled = (queuePos === 0);
  document.getElementById('navNext').disabled = (queuePos === queue.length - 1);
  document.getElementById('posIdx').textContent   = queuePos + 1;
  document.getElementById('posTotal').textContent = queue.length;

  /* Progress bar */
  var pct = learned.length / DATA.length * 100;
  document.getElementById('kFill').style.width    = pct + '%';
  document.getElementById('kLearned').textContent = learned.length;
  document.getElementById('kTotal').textContent   = DATA.length;

  /* Quiz button — needs at least 1 learned hanja */
  var qb = document.getElementById('quizBtn');
  if (qb) {
    qb.disabled = (learned.length === 0);
    qb.title    = learned.length === 0 ? 'Marchează cel puțin un hanja ca învățat pentru a începe' : '';
  }
}

/* ── WORD BLOOM ────────────────────────────────────────── */
function _openBloom(wi) {
  var w = DATA[idx].words[wi];
  if (!w) return;
  bloomActive = wi;

  var isLight = document.body.classList.contains('light-mode');
  var colors  = isLight ? ORB_COLORS_LIGHT : ORB_COLORS_DARK;
  var c       = colors[wi];

  var panel = document.getElementById('wordBloom');
  panel.style.setProperty('--bloom-c', c);
  document.getElementById('bloomWord').textContent    = w.ko;
  document.getElementById('bloomMeaning').textContent = w[lang];

  var esc = function(s) { return s.replace(/[&<>"]/g, function(ch) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]; }); };
  var hilite = '<span class="bloom-hl">' + esc(w.ko) + '</span>';
  var koSent = w.sentence ? esc(w.sentence).replace(esc(w.ko), hilite) : '';
  document.getElementById('bloomKo').innerHTML = koSent;
  document.getElementById('bloomTr').textContent = w['sentence_' + lang] || '';
  _renderMorphemes(w.ko);
  panel.classList.remove('hidden');
  _speak(w.ko);

  var nodes = document.querySelectorAll('.orbNode');
  for (var n = 0; n < nodes.length; n++) nodes[n].classList.remove('lit');
  document.getElementById('orb' + wi).classList.add('lit');

  clearResonance();
  setTimeout(function() { drawResonance(wi); }, 55);
}

function _closeBloom() {
  bloomActive = -1;
  document.getElementById('wordBloom').classList.add('hidden');
  var nodes = document.querySelectorAll('.orbNode');
  for (var n = 0; n < nodes.length; n++) nodes[n].classList.remove('lit');
  clearResonance();
}

/* ── ETYMOLOGY ─────────────────────────────────────────── */
function _openEtym() {
  var item = DATA[idx];
  if (!item.etymology) return;
  document.getElementById('etymTitle').textContent = item.hanja + '  \xB7  ' + UI_TEXT[lang].etym;
  document.getElementById('etymBody').textContent  = item.etymology[lang];
  document.getElementById('etymPanel').classList.remove('hidden');
}

function _closeEtym() {
  document.getElementById('etymPanel').classList.add('hidden');
}

/* ── AUDIO ─────────────────────────────────────────────── */
function _speak(text) {
  window.speechSynthesis.cancel();
  var u  = new SpeechSynthesisUtterance(text);
  u.lang = 'ko-KR';
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

/* ── SEARCH ────────────────────────────────────────────── */
function _openSearch() {
  document.getElementById('searchOverlay').classList.remove('hidden');
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').innerHTML = '';
  setTimeout(function() { document.getElementById('searchInput').focus(); }, 60);
}

function _closeSearch() {
  document.getElementById('searchOverlay').classList.add('hidden');
}

function _doSearch(q) {
  var results = document.getElementById('searchResults');
  results.innerHTML = '';
  if (!q.trim()) return;
  var ql = q.toLowerCase();
  var hits = [];
  for (var i = 0; i < DATA.length; i++) {
    var d = DATA[i];
    var score = 0;
    if (d.hanja === q)                                        score = 100;
    else if ((d.ko_reading || '').indexOf(ql) === 0)          score = 80;
    else if (d.reading[lang].toLowerCase().indexOf(ql) === 0) score = 70;
    else if (d.meaning[lang].toLowerCase().indexOf(ql) === 0) score = 60;
    else if (d.meaning['ro'].toLowerCase().indexOf(ql) >= 0)  score = 40;
    else if (d.meaning['en'].toLowerCase().indexOf(ql) >= 0)  score = 35;
    else if (d.reading[lang].toLowerCase().indexOf(ql) >= 0)  score = 30;
    if (score > 0) hits.push({i: i, score: score});
  }
  hits.sort(function(a, b) { return b.score - a.score; });
  hits = hits.slice(0, 20);
  if (hits.length === 0) {
    results.innerHTML = '<div style="padding:16px 18px;font-size:12px;color:var(--tx3)">Niciun rezultat</div>';
    return;
  }
  hits.forEach(function(h) {
    var d   = DATA[h.i];
    var pos = queue.indexOf(h.i);
    var el  = document.createElement('div');
    el.className = 'searchItem';
    el.innerHTML =
      '<span class="si-glyph">' + d.hanja + '</span>' +
      '<span class="si-info">' +
        '<span class="si-reading">' + (d.ko_reading || '') + ' · ' + d.meaning[lang] + '</span>' +
        '<span class="si-meaning">' + d.reading[lang] + '</span>' +
      '</span>' +
      '<span class="si-pos">#' + (pos + 1) + '</span>';
    el.addEventListener('click', function() {
      _closeSearch();
      queuePos = pos >= 0 ? pos : 0;
      idx      = h.i;
      render(true);
    });
    results.appendChild(el);
  });
}

/* ── STROKE ORDER ──────────────────────────────────────── */
var _hwWriter = null;

function _openStroke() {
  var item     = DATA[idx];
  var isLight  = document.body.classList.contains('light-mode');
  var panel    = document.getElementById('strokePanel');

  document.getElementById('strokeTitle').textContent =
    item.hanja + '  ·  ' + item.reading[lang] + '  ·  ' + item.meaning[lang];

  /* Clear previous writer */
  var target = document.getElementById('strokeWriter');
  target.innerHTML = '';
  _hwWriter = null;

  if (typeof HanziWriter !== 'undefined') {
    _hwWriter = HanziWriter.create('strokeWriter', item.hanja, {
      width:                200,
      height:               200,
      padding:              16,
      showOutline:          true,
      strokeColor:          isLight ? '#1e1b2e' : '#e8e0ff',
      outlineColor:         isLight ? 'rgba(0,0,0,.12)' : 'rgba(255,255,255,.1)',
      drawingColor:         '#9B6DFF',
      highlightColor:       '#FFB347',
      strokeAnimationSpeed: 1,
      delayBetweenStrokes:  180
    });
    _hwWriter.animateCharacter();
  } else {
    /* Fallback: show large glyph */
    target.style.cssText = 'font-size:140px;line-height:200px;text-align:center;font-family:"Noto Sans KR",sans-serif;color:var(--nuke)';
    target.textContent   = item.hanja;
  }

  panel.classList.remove('hidden');
}

function _closeStroke() {
  document.getElementById('strokePanel').classList.add('hidden');
  _hwWriter = null;
}

/* ── THEME ─────────────────────────────────────────────── */
var _SVG_SUN  = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="7.05" y2="7.05"/><line x1="16.95" y1="16.95" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="7.05" y2="16.95"/><line x1="16.95" y1="7.05" x2="19.78" y2="4.22"/></svg>';
var _SVG_MOON = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

function _applyTheme() {
  var theme   = localStorage.getItem('RK_THEME') || 'dark';
  var isLight = theme === 'light';
  document.body.classList.toggle('light-mode', isLight);
  var mc = document.getElementById('themeColorMeta');
  if (mc) mc.content = isLight ? '#F0EAD6' : '#030308';
  var btn = document.getElementById('themeBtn');
  if (btn) btn.innerHTML = isLight ? _SVG_SUN : _SVG_MOON;
}

function _toggleTheme() {
  var wasLight = document.body.classList.contains('light-mode');
  var next     = wasLight ? 'dark' : 'light';
  localStorage.setItem('RK_THEME', next);
  _applyTheme();
  if (bloomActive >= 0) {
    clearResonance();
    setTimeout(function() { drawResonance(bloomActive); }, 35);
  }
}

/* ── LANGUAGE PICKER ───────────────────────────────────── */
function _syncLangBtn() {
  var lb = document.getElementById('langBtn');
  if (lb) lb.textContent = lang;
  document.getElementById('pickRo').classList.toggle('active', lang === 'ro');
  document.getElementById('pickEn').classList.toggle('active', lang === 'en');
}

function _openLangPicker() {
  document.getElementById('langPicker').classList.add('open');
}

function _closeLangPicker() {
  document.getElementById('langPicker').classList.remove('open');
}

function _setLang(l) {
  lang = l;
  localStorage.setItem('RK_LANG', l);
  _syncLangBtn();
  _closeLangPicker();
  var isRo = l === 'ro';
  var searchBtn = document.getElementById('searchBtn');
  if (searchBtn) searchBtn.title = isRo ? 'Caută (/)' : 'Search (/)';
  var searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.placeholder = isRo ? 'Caută hanja, citire, sens…' : 'Search hanja, reading, meaning…';
  render(false);
}

/* ── NAVIGATION ────────────────────────────────────────── */
function _navigate(dir) {
  window.speechSynthesis.cancel();
  var next = queuePos + dir;
  if (next < 0 || next >= queue.length) return;
  queuePos = next;
  idx = queue[queuePos];
  render(true);
}

/* ── SPACED REPETITION (SM-2 simplificat) ──────────────── */
function _getSRS(di) {
  return srsData[di] || {reps: 0, ease: 2.5, interval: 1, due: 0};
}

function _srsInsertPos(di) {
  var due = _getSRS(di).due;
  for (var i = 0; i < queue.length; i++) {
    if (_getSRS(queue[i]).due > due) return i;
  }
  return queue.length;
}

function _updateSRS(di, correct) {
  // Algorithm lives in js/core/srs.js (stepWithLearningSteps — shares the
  // module with exercises.js/flashcards.js's plain SM-2, but keeps hanja's
  // own early learning-step timing); this file just keeps its local cache
  // and localStorage write exactly as before.
  srsData[di] = RKSrs.stepWithLearningSteps(_getSRS(di), correct);
  localStorage.setItem('RK_HJ_SRS', JSON.stringify(srsData));
}

function _sortQueueByDue() {
  var now = Date.now();
  queue.sort(function(a, b) {
    var dA = srsData[a] ? srsData[a].due : now;
    var dB = srsData[b] ? srsData[b].due : now;
    return dA - dB;
  });
  var p = queue.indexOf(idx);
  queuePos = p >= 0 ? p : 0;
  idx = queue[queuePos];
  localStorage.setItem('RK_HJ_QUEUE', JSON.stringify(queue));
}

/* ── MARK LEARNED ──────────────────────────────────────── */
function _markLearned() {
  var pos = learned.indexOf(idx);

  if (pos < 0) {
    /* Validează → adaugă în learned și avansează */
    learned.push(idx);
    localStorage.setItem('RK_HJ_LEARNED', JSON.stringify(learned));
    if (window.RKGamification) RKGamification.addXPBonus(10);

    var current = queue.splice(queuePos, 1)[0];
    if (!srsData[current]) _updateSRS(current, true);
    var ins = _srsInsertPos(current);
    queue.splice(ins, 0, current);
    if (ins <= queuePos) queuePos++;
    if (queuePos >= queue.length) queuePos = queue.length - 1;
    idx = queue[queuePos];
    localStorage.setItem('RK_HJ_QUEUE', JSON.stringify(queue));

    _bumpStreak();

    var nuc = document.getElementById('nucleus');
    nuc.classList.add('nova');
    setTimeout(function() { nuc.classList.remove('nova'); }, 700);
    render(true);
  } else {
    /* De-validează → scoate din learned, rămâne pe același hanja */
    learned.splice(pos, 1);
    localStorage.setItem('RK_HJ_LEARNED', JSON.stringify(learned));
    render(false);
  }
}

/* ── QUIZ ──────────────────────────────────────────────── */
function _shuffled(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

function _startQuiz() {
  if (learned.length === 0) return;
  quizMode        = true;
  quizScore       = {ok: 0, total: 0};
  quizDeck        = _shuffled(learned);
  quizInitialSize = quizDeck.length;
  _nextQuizQ();
}

function _exitQuiz() {
  if (quizTimer) { clearTimeout(quizTimer); quizTimer = null; }
  quizMode = false;
  quizQ    = null;
  quizDone = false;
  quizDeck = [];
  _hideQuizResult();
  document.getElementById('stage').classList.remove('quiz-mode');
  document.getElementById('learnBtn').style.display    = '';
  document.getElementById('quizBtn').style.display     = '';
  document.getElementById('quizExitBtn').style.display = 'none';
  _sortQueueByDue();
  render(false);
}

var QUIZ_MSGS = {
  ro: [
    { min: 100, emoji: '🏆', msg: 'Perfect! 완벽해요!' },
    { min: 80,  emoji: '🎉', msg: 'Bravo! Ai reușit!' },
    { min: 60,  emoji: '💪', msg: 'Bine! Mai exersează puțin!' },
    { min: 0,   emoji: '📚', msg: 'Mai ai de muncă! Nu te descuraja!' }
  ],
  en: [
    { min: 100, emoji: '🏆', msg: 'Perfect! 완벽해요!' },
    { min: 80,  emoji: '🎉', msg: 'Well done!' },
    { min: 60,  emoji: '💪', msg: 'Good! Keep practicing!' },
    { min: 0,   emoji: '📚', msg: 'Keep going! Don\'t give up!' }
  ]
};

function _showQuizResult() {
  var pct  = quizInitialSize > 0 ? Math.round((quizScore.ok / quizInitialSize) * 100) : 0;
  var msgs = QUIZ_MSGS[lang] || QUIZ_MSGS.ro;
  var found = msgs[msgs.length - 1];
  for (var i = 0; i < msgs.length; i++) {
    if (pct >= msgs[i].min) { found = msgs[i]; break; }
  }
  document.getElementById('qrEmoji').textContent = found.emoji;
  document.getElementById('qrMsg').textContent   = found.msg;
  document.getElementById('qrScore').textContent = quizScore.ok + ' / ' + quizInitialSize;
  document.getElementById('qrRetry').textContent = lang === 'en' ? '↺ Again'  : '↺ Din nou';
  document.getElementById('qrExit').textContent  = lang === 'en' ? '← Back'   : '← Înapoi';
  document.getElementById('quizResult').classList.remove('hidden');
}

function _hideQuizResult() {
  document.getElementById('quizResult').classList.add('hidden');
}

function _nextQuizQ() {
  if (!quizMode) return;
  if (quizDeck.length === 0) { _showQuizResult(); return; }
  quizDone  = false;
  quizTimer = null;

  var dataIdx = quizDeck[0];
  var correct = DATA[dataIdx].meaning[lang];

  var distractors = [];
  var used = new Set([dataIdx]);
  var attempts = 0;
  while (distractors.length < 3 && attempts < 300) {
    attempts++;
    var ri = Math.floor(Math.random() * DATA.length);
    if (!used.has(ri) && DATA[ri].meaning[lang] !== correct) {
      used.add(ri);
      distractors.push(DATA[ri].meaning[lang]);
    }
  }

  var opts = [correct].concat(distractors);
  for (var i = 3; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = opts[i]; opts[i] = opts[j]; opts[j] = t;
  }

  quizQ = {dataIdx: dataIdx, correctMeaning: correct, options: opts};
  _renderQuiz();
}

function _renderQuiz() {
  var item = DATA[quizQ.dataIdx];

  document.getElementById('hanjaGlyph').textContent   = item.hanja;
  document.getElementById('glyphReading').textContent = item.reading[lang];
  document.getElementById('glyphMeaning').textContent = quizDone ? item.meaning[lang] : '?';

  var nuc = document.getElementById('nucleus');
  nuc.classList.remove('learned', 'nova');
  nuc.classList.add('entering');
  setTimeout(function() { nuc.classList.remove('entering'); }, 600);

  _closeBloom();
  _closeEtym();

  for (var i = 0; i < 4; i++) {
    var shell = document.getElementById('osh' + i);
    var node  = document.getElementById('orb' + i);
    shell.style.opacity = '1';
    node.querySelector('.orbKo').textContent = quizQ.options[i];
    node.querySelector('.orbTr').textContent = '';
    node.classList.remove('lit', 'quiz-correct', 'quiz-wrong');
    node.style.setProperty('--node-color', 'var(' + ORB_CSS_VARS[i] + ')');
    if (shell) {
      shell.classList.add('entering');
      (function(s) { setTimeout(function() { s.classList.remove('entering'); }, 500); })(shell);
    }
  }

  document.getElementById('stage').classList.add('quiz-mode');
  document.getElementById('learnBtn').style.display    = 'none';
  document.getElementById('etymBtn').style.visibility  = 'hidden';
  document.getElementById('navPrev').disabled          = true;
  document.getElementById('navNext').disabled          = true;
  document.getElementById('quizBtn').style.display     = 'none';
  document.getElementById('quizExitBtn').style.display = 'inline-flex';

  document.getElementById('kLearned').textContent = quizScore.ok;
  document.getElementById('kTotal').textContent   = quizScore.total;
  var pct = quizScore.total > 0 ? (quizScore.ok / quizScore.total) * 100 : 0;
  document.getElementById('kFill').style.width    = pct + '%';
  document.getElementById('posIdx').textContent   = quizInitialSize - quizDeck.length + 1;
  document.getElementById('posTotal').textContent = quizInitialSize;
}

function _answerQuiz(wi) {
  if (quizDone) return;
  quizDone = true;
  quizScore.total++;

  var chosen  = quizQ.options[wi];
  var correct = quizQ.correctMeaning;
  var isRight = chosen === correct;
  if (isRight) {
    quizScore.ok++;
    _bumpStreak();
    if (window.RKGamification) RKGamification.addXPBonus(3);
  }

  document.getElementById('orb' + wi).classList.add(isRight ? 'quiz-correct' : 'quiz-wrong');

  if (!isRight) {
    for (var i = 0; i < 4; i++) {
      if (quizQ.options[i] === correct) {
        document.getElementById('orb' + i).classList.add('quiz-correct');
        break;
      }
    }
  }

  document.getElementById('glyphMeaning').textContent = correct;
  _speak(DATA[quizQ.dataIdx].ko_reading || DATA[quizQ.dataIdx].reading[lang].split(' ')[0]);

  document.getElementById('kLearned').textContent = quizScore.ok;
  document.getElementById('kTotal').textContent   = quizScore.total;
  var pct = (quizScore.ok / quizScore.total) * 100;
  document.getElementById('kFill').style.width = pct + '%';

  _updateSRS(quizQ.dataIdx, isRight);
  if (isRight) {
    quizDeck.shift();
  } else {
    quizDeck.push(quizDeck.shift());
  }
  quizTimer = setTimeout(_nextQuizQ, isRight ? 900 : 1500);
}

/* ── BOOT ──────────────────────────────────────────────── */
function boot() {
  _applyTheme();
  _syncLangBtn();

  document.getElementById('langBtn').addEventListener('click', function(e) {
    e.stopPropagation();
    var picker = document.getElementById('langPicker');
    picker.classList.contains('open') ? _closeLangPicker() : _openLangPicker();
  });
  document.getElementById('pickRo').addEventListener('click', function() { _setLang('ro'); });
  document.getElementById('pickEn').addEventListener('click', function() { _setLang('en'); });
  document.addEventListener('pointerdown', function(e) {
    if (!e.target.closest('#langWrap')) _closeLangPicker();
  });

  document.getElementById('themeBtn').addEventListener('click', _toggleTheme);

  document.getElementById('navPrev').addEventListener('click', function() { _navigate(-1); });
  document.getElementById('navNext').addEventListener('click', function() { _navigate(1); });
  document.getElementById('learnBtn').addEventListener('click', _markLearned);
  document.getElementById('quizBtn').addEventListener('click', _startQuiz);
  document.getElementById('quizExitBtn').addEventListener('click', _exitQuiz);
  document.getElementById('qrRetry').addEventListener('click', function() {
    _hideQuizResult();
    _exitQuiz();
    setTimeout(_startQuiz, 50);
  });
  document.getElementById('qrExit').addEventListener('click', function() {
    _hideQuizResult();
    _exitQuiz();
  });
  document.getElementById('etymBtn').addEventListener('click', _openEtym);
  document.getElementById('searchBtn').addEventListener('click', function(e) { e.stopPropagation(); _openSearch(); });
  document.getElementById('searchClear').addEventListener('click', function() { document.getElementById('searchInput').value = ''; document.getElementById('searchResults').innerHTML = ''; });
  document.getElementById('searchInput').addEventListener('input', function() { _doSearch(this.value); });
  document.getElementById('searchOverlay').addEventListener('click', function(e) { if (e.target === this) _closeSearch(); });

  document.getElementById('strokeBtn').addEventListener('click', function(e) { e.stopPropagation(); _openStroke(); });
  document.getElementById('strokeClose').addEventListener('click', _closeStroke);
  document.getElementById('strokeAnimate').addEventListener('click', function() { if (_hwWriter) _hwWriter.animateCharacter(); });
  document.getElementById('strokeQuiz').addEventListener('click', function() { if (_hwWriter) _hwWriter.quiz(); });
  document.getElementById('etymClose').addEventListener('click', _closeEtym);
  document.getElementById('bloomClose').addEventListener('click', _closeBloom);

  /* Nucleus click → TTS */
  document.getElementById('nucleus').addEventListener('click', function(e) {
    if (e.target.closest('#wordBloom') || e.target.closest('#etymPanel')) return;
    var item    = DATA[idx];
    var reading = item.ko_reading || item.reading[lang].split(' ')[0];
    _speak(reading);
  });

  /* Bloom speak */
  document.getElementById('bloomSpeak').addEventListener('click', function() {
    if (bloomActive >= 0) {
      var w = DATA[idx].words[bloomActive];
      if (w && w.sentence) _speak(w.sentence);
    }
  });

  /* Orbital node clicks */
  var nodes = document.querySelectorAll('.orbNode');
  for (var n = 0; n < nodes.length; n++) {
    nodes[n].addEventListener('click', function(e) {
      e.stopPropagation();
      var wi = parseInt(this.dataset.wi, 10);
      if (quizMode) { _answerQuiz(wi); return; }
      if (bloomActive === wi) { _closeBloom(); return; }
      _openBloom(wi);
    });
  }

  /* Stage background tap → dismiss bloom */
  document.getElementById('stage').addEventListener('click', function(e) {
    if (!e.target.closest('.orbNode') && !e.target.closest('#nucleus')) {
      _closeBloom();
    }
  });

  /* Keyboard */
  document.addEventListener('keydown', function(e) {
    if (e.key === '/') { if (!document.getElementById('searchOverlay').classList.contains('hidden')) return; e.preventDefault(); _openSearch(); }
    if (e.key === 'ArrowRight') { if (!document.getElementById('searchOverlay').classList.contains('hidden')) return; _navigate(1); }
    if (e.key === 'ArrowLeft')  { if (!document.getElementById('searchOverlay').classList.contains('hidden')) return; _navigate(-1); }
    if (e.key === 'Escape')     { if (quizMode) { _exitQuiz(); } else { _closeBloom(); _closeEtym(); _closeStroke(); _closeSearch(); } }
  });

  /* Swipe */
  var _tx = 0;
  document.addEventListener('touchstart', function(e) {
    _tx = e.touches[0].clientX;
  }, {passive: true});
  document.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - _tx;
    if (Math.abs(dx) > 65) _navigate(dx > 0 ? -1 : 1);
  }, {passive: true});

  /* Resize */
  window.addEventListener('resize', function() {
    _resizeCanvas();
    positionOrbitals();
    if (bloomActive >= 0) {
      clearResonance();
      setTimeout(function() { drawResonance(bloomActive); }, 55);
    }
  });

  _checkAndUpdateStreak();
  if (window.RKStreak) RKStreak.touch();
  _renderStreak();
  _sortQueueByDue();
  initCanvas();
  positionOrbitals();
  render(false);
}

/* ── LOAD DATA ─────────────────────────────────────────────
   DATA used to be a ~2150-line literal baked into this file; it now lives
   in data/hanja.json like every other feature's data, fetched once here
   before anything that reads it (the reading→hanja lookup, the study
   queue, and boot() itself) runs. */
fetch('./data/hanja.json')
  .then(function(r) { return r.json(); })
  .then(function(data) {
    DATA = data;
    _hanjaByReading = _buildHanjaByReading();
    queue = _buildQueue();
    idx = queue[queuePos];
    boot();
  })
  .catch(function(err) {
    console.error('Failed to load hanja data', err);
    var stage = document.getElementById('stage');
    if (stage) stage.innerHTML = '<div style="padding:60px 20px;text-align:center;opacity:.6">⚠️ Nu s-au putut încărca datele.</div>';
  });
