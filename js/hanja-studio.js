/* ═══════════════════════════════════════════════════════════
   HANJA STUDIO — Deconstruct, Build & Play
   Extension of hanja-book.html. Loaded AFTER js/hanja-book.js, so it
   reads that file's own globals directly (DATA, idx, lang, learned,
   resolveHanja, hanjaIndex, _speak, _bumpStreak) instead of
   duplicating any of them — per the brief's own instruction to reuse
   existing data/components wherever possible.

   Data discipline: STUDIO_DATA (data/hanja-studio.json) holds ONLY
   manually-verified graphical decompositions (real Unicode IDS
   structure, e.g. 明 = ⿰日月 — left/right, not a guessed radical
   split). A hanja with no entry there gets every Studio feature
   disabled, with an explicit "no data" message — this file never
   fabricates a decomposition, a stroke order, or a meaning.
   ═══════════════════════════════════════════════════════════ */

window.HanjaStudio = (function () {
  var STUDIO_DATA = {};
  var dataReady = false;

  var state = {
    item: null,        // DATA[idx] at the moment the panel was opened
    decomp: null,      // STUDIO_DATA[item.hanja], or null
    parts: null,       // [resolveHanja(part0), resolveHanja(part1)]
    tab: 'deconstruct',
    buildDiff: 'easy',
    hwWriter: null,
    hwSlow: false,
    deTimer: null
  };

  var progress = RKStorage.get('RK_HJ_STUDIO', { memBest: { score: 0, combo: 0 }, buildDone: {} });
  function saveProgress() { RKStorage.set('RK_HJ_STUDIO', progress); }

  fetch('./data/hanja-studio.json')
    .then(function (r) { return r.json(); })
    .then(function (d) {
      STUDIO_DATA = {};
      for (var k in d) { if (k !== '_comment') STUDIO_DATA[k] = d[k]; }
      dataReady = true;
      if (state.item) onRender(state.item); // re-gate if the button rendered before data arrived
    })
    .catch(function () { dataReady = true; /* STUDIO_DATA stays empty -> every button gated off, same as "no data" */ });

  function $(id) { return document.getElementById(id); }
  function hasDecomp(hanja) { return dataReady && !!STUDIO_DATA[hanja]; }

  /* ── gating (called by hanja-book.js's render(), see the hook
     added there) ─────────────────────────────────────────────── */
  function onRender(item) {
    var btn = $('studioBtn');
    if (!btn) return;
    var avail = hasDecomp(item.hanja);
    btn.disabled = !avail;
    btn.title = avail ? '' : (lang === 'en' ? 'No verified breakdown data for this character yet' : 'Nu există încă date verificate de descompunere pentru acest caracter');
  }

  /* ── open / close / tabs ─────────────────────────────────── */
  function open() {
    state.item = DATA[idx];
    state.decomp = STUDIO_DATA[state.item.hanja] || null;
    $('studioHanja').textContent = state.item.hanja;
    $('studioSub').textContent = primaryReading(state.item) + ' · ' + (state.item.meaning[lang] || state.item.meaning.ro);

    var noData = $('studioNoData');
    if (!state.decomp) {
      noData.classList.remove('hidden');
      $('studioTabs').classList.add('hidden');
      document.querySelectorAll('.studioSection').forEach(function (s) { s.classList.remove('active'); });
      $('studioNoDataMsg').textContent = lang === 'en'
        ? 'Hanja Studio needs a verified graphical breakdown for this character — not available yet. Try 明 (명) for the working prototype.'
        : 'Hanja Studio are nevoie de o descompunere grafică verificată pentru acest caracter — nu există încă. Încearcă 明 (명) pentru prototipul funcțional.';
      $('studioPanel').classList.remove('hidden');
      return;
    }

    noData.classList.add('hidden');
    $('studioTabs').classList.remove('hidden');

    state.parts = state.decomp.parts.map(function (ch) { return resolveHanja(ch); });

    _prepareDeconstruct();
    _prepareBuild();
    _prepareStroke();
    _prepareMemory();

    $('studioPanel').classList.remove('hidden');
    switchTab(state.tab);
  }

  function close() {
    $('studioPanel').classList.add('hidden');
    _deStop();
    if (state.hwWriter) { state.hwWriter = null; }
    $('stWriter').innerHTML = '';
  }

  function switchTab(tab) {
    state.tab = tab;
    document.querySelectorAll('.studioTab').forEach(function (b) {
      b.classList.toggle('active', b.dataset.tab === tab);
    });
    document.querySelectorAll('.studioSection').forEach(function (s) {
      s.classList.toggle('active', s.dataset.section === tab);
    });
    if (tab === 'stroke' && !state.hwWriter) _initStrokeWriter();
  }

  /* ══════════════════ DECONSTRUCT ══════════════════ */
  function _prepareDeconstruct() {
    _deStop();
    var whole = $('deWhole'), p0 = $('dePart0'), p1 = $('dePart1');
    whole.textContent = state.item.hanja;
    whole.classList.remove('deHidden');
    p0.classList.remove('deShow'); p1.classList.remove('deShow');
    p0.style.transform = 'translate(-50%,-50%)';
    p1.style.transform = 'translate(-50%,-50%)';
    p0.querySelector('.dePartGlyph').textContent = state.parts[0].hanja;
    p1.querySelector('.dePartGlyph').textContent = state.parts[1].hanja;

    var lbl0 = $('deLabel0'), lbl1 = $('deLabel1');
    [[lbl0, state.parts[0]], [lbl1, state.parts[1]]].forEach(function (pair) {
      var el = pair[0], part = pair[1];
      el.querySelector('.deLGlyph').textContent = part.hanja;
      el.querySelector('.deLReading').textContent = part.reading;
      el.querySelector('.deLMeaning').textContent = part.meaning[lang] || part.meaning.ro;
    });
    $('deLabels').classList.remove('deShow');
  }

  function _deOffsets() {
    if (state.decomp.layout === 'tb') return [{ x: 0, y: -40 }, { x: 0, y: 40 }];
    return [{ x: -56, y: 0 }, { x: 56, y: 0 }]; // 'lr', the default/original layout
  }

  function _deStop() {
    if (state.deTimer) { clearTimeout(state.deTimer); state.deTimer = null; }
  }

  function _deSchedule(fn, ms) {
    state.deTimer = setTimeout(fn, ms);
  }

  function _dePlay() {
    _deStop();
    var speed = state.hwSlow ? 2.2 : 1;
    var whole = $('deWhole'), p0 = $('dePart0'), p1 = $('dePart1'), labels = $('deLabels');
    var off = _deOffsets();

    whole.classList.remove('deHidden');
    p0.classList.remove('deShow'); p1.classList.remove('deShow');
    labels.classList.remove('deShow');
    p0.style.transform = 'translate(-50%,-50%)';
    p1.style.transform = 'translate(-50%,-50%)';

    _deSchedule(function () {
      whole.classList.add('deHidden');
      p0.classList.add('deShow'); p1.classList.add('deShow');
    }, 500 * speed);

    _deSchedule(function () {
      p0.style.transform = 'translate(calc(-50% + ' + off[0].x + 'px), calc(-50% + ' + off[0].y + 'px))';
      p1.style.transform = 'translate(calc(-50% + ' + off[1].x + 'px), calc(-50% + ' + off[1].y + 'px))';
    }, 900 * speed);

    _deSchedule(function () {
      labels.classList.add('deShow');
      _speak(state.parts[0].hanja);
    }, 1700 * speed);

    _deSchedule(function () {
      _speak(state.parts[1].hanja);
    }, 2500 * speed);

    _deSchedule(function () {
      p0.style.transform = 'translate(-50%,-50%)';
      p1.style.transform = 'translate(-50%,-50%)';
      labels.classList.remove('deShow');
    }, 3800 * speed);

    _deSchedule(function () {
      p0.classList.remove('deShow'); p1.classList.remove('deShow');
      whole.classList.remove('deHidden');
      _speak(state.item.hanja);
    }, 4600 * speed);
  }

  /* ══════════════════ BUILD ══════════════════ */
  var buildDrag = null; // {tile, startX, startY, moved}

  function _prepareBuild() {
    var guide = $('buildGuide');
    guide.textContent = state.item.hanja;

    document.querySelectorAll('.buildDiffBtn').forEach(function (b) {
      b.classList.toggle('active', b.dataset.diff === state.buildDiff);
    });

    _buildReset();
  }

  function _buildSetDiff(d) {
    state.buildDiff = d;
    document.querySelectorAll('.buildDiffBtn').forEach(function (b) {
      b.classList.toggle('active', b.dataset.diff === d);
    });
    $('buildGuide').classList.toggle('hidden', d !== 'easy');
    _buildReset();
  }

  function _buildReset() {
    $('buildFeedback').textContent = '';
    $('buildFeedback').className = '';
    var slotsEl = $('buildSlots');
    slotsEl.innerHTML = '';
    for (var i = 0; i < 2; i++) {
      var slot = document.createElement('div');
      slot.className = 'buildSlot';
      slot.dataset.slot = i;
      slotsEl.appendChild(slot);
    }

    var order = Math.random() < 0.5 ? [0, 1] : [1, 0];
    var trayEl = $('buildTray');
    trayEl.innerHTML = '';
    order.forEach(function (partIdx) {
      var tile = document.createElement('div');
      tile.className = 'buildTile';
      tile.dataset.part = partIdx;
      tile.textContent = state.parts[partIdx].hanja;
      trayEl.appendChild(tile);
    });

    $('buildGuide').classList.toggle('hidden', state.buildDiff !== 'easy');
  }

  function _buildSlotAt(x, y) {
    var el = document.elementFromPoint(x, y);
    while (el && !el.classList.contains('buildSlot')) el = el.parentElement;
    return el;
  }

  function _buildPlace(tile, slot) {
    if (slot.classList.contains('filled')) return;
    var partIdx = tile.dataset.part;
    slot.textContent = state.parts[partIdx].hanja;
    slot.dataset.part = partIdx;
    slot.classList.add('filled');
    tile.classList.add('placed');
    document.querySelectorAll('.buildTile.selected').forEach(function (t) { t.classList.remove('selected'); });

    var slots = document.querySelectorAll('.buildSlot');
    var allFilled = Array.prototype.every.call(slots, function (s) { return s.classList.contains('filled'); });
    if (allFilled) _buildCheck();
  }

  function _buildCheck() {
    var slots = document.querySelectorAll('.buildSlot');
    var correct = true;
    slots.forEach(function (s) {
      var isRight = String(s.dataset.part) === String(s.dataset.slot);
      s.classList.add(isRight ? 'correct' : 'wrong');
      if (!isRight) correct = false;
    });
    var fb = $('buildFeedback');
    if (correct) {
      fb.textContent = lang === 'en' ? '✓ Correct! Rebuilding the character…' : '✓ Corect! Reunim caracterul…';
      fb.className = 'ok';
      if (!progress.buildDone[state.item.hanja]) progress.buildDone[state.item.hanja] = {};
      progress.buildDone[state.item.hanja][state.buildDiff] = true;
      saveProgress();
      if (window.RKGamification) RKGamification.addXPBonus(5);
      _bumpStreak();
      _speak(state.item.hanja);
      setTimeout(function () {
        document.querySelectorAll('.buildSlot').forEach(function (s) { s.classList.add('reunite'); });
        setTimeout(function () { _buildReset(); }, 1200);
      }, 500);
    } else {
      fb.textContent = lang === 'en' ? '✕ Not quite — try again' : '✕ Nu chiar — mai încearcă';
      fb.className = 'bad';
      setTimeout(function () {
        slots.forEach(function (s) {
          s.classList.remove('filled', 'correct', 'wrong');
          s.textContent = '';
          delete s.dataset.part;
        });
        document.querySelectorAll('.buildTile.placed').forEach(function (t) { t.classList.remove('placed'); });
      }, 900);
    }
  }

  function _buildPointerDown(e) {
    var tile = e.target.closest('.buildTile');
    if (!tile || tile.classList.contains('placed')) return;
    e.preventDefault();
    buildDrag = { tile: tile, startX: e.clientX, startY: e.clientY, moved: false, origParent: tile.parentElement, origNext: tile.nextSibling };
    tile.setPointerCapture(e.pointerId);
  }

  function _buildPointerMove(e) {
    if (!buildDrag) return;
    var dx = e.clientX - buildDrag.startX, dy = e.clientY - buildDrag.startY;
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
      buildDrag.moved = true;
      buildDrag.tile.classList.add('dragging');
      buildDrag.tile.style.position = 'fixed';
      buildDrag.tile.style.left = e.clientX - 32 + 'px';
      buildDrag.tile.style.top = e.clientY - 32 + 'px';
      buildDrag.tile.style.zIndex = 500;
      buildDrag.tile.style.pointerEvents = 'none';
    }
    if (buildDrag.moved) {
      document.querySelectorAll('.buildSlot').forEach(function (s) { s.classList.remove('dragOver'); });
      var slot = _buildSlotAt(e.clientX, e.clientY);
      if (slot && !slot.classList.contains('filled')) slot.classList.add('dragOver');
    }
  }

  function _buildPointerUp(e) {
    if (!buildDrag) return;
    var tile = buildDrag.tile;
    document.querySelectorAll('.buildSlot').forEach(function (s) { s.classList.remove('dragOver'); });

    if (buildDrag.moved) {
      tile.style.position = '';
      tile.style.left = '';
      tile.style.top = '';
      tile.style.zIndex = '';
      tile.style.pointerEvents = '';
      tile.classList.remove('dragging');
      var slot = _buildSlotAt(e.clientX, e.clientY);
      if (slot) _buildPlace(tile, slot);
    } else {
      // Tap (no real drag): tap-to-select / tap-to-place alternative.
      var already = tile.classList.contains('selected');
      document.querySelectorAll('.buildTile.selected').forEach(function (t) { t.classList.remove('selected'); });
      if (!already) tile.classList.add('selected');
    }
    buildDrag = null;
  }

  function _buildSlotClick(e) {
    var slot = e.target.closest('.buildSlot');
    if (!slot || slot.classList.contains('filled')) return;
    var selected = document.querySelector('.buildTile.selected');
    if (selected) _buildPlace(selected, slot);
  }

  /* ══════════════════ STROKE ORDER ══════════════════ */
  function _prepareStroke() {
    if (state.hwWriter) { state.hwWriter = null; }
    $('stWriter').innerHTML = '';
    $('stStrokeCount').textContent = '';
    $('stFeedback').textContent = '';
  }

  function _initStrokeWriter() {
    if (typeof HanziWriter === 'undefined') {
      $('stWriter').innerHTML = '';
      $('stWriter').style.cssText = 'font-size:120px;line-height:200px;font-family:"Noto Sans KR",sans-serif;color:var(--tx)';
      $('stWriter').textContent = state.item.hanja;
      return;
    }
    var isLight = document.body.classList.contains('light-mode');
    var delay = state.hwSlow ? 450 : 180;
    state.hwStrokeDelay = delay;
    state.hwTotalStrokes = 0;
    state.hwWriter = HanziWriter.create('stWriter', state.item.hanja, {
      width: 200, height: 200, padding: 14,
      showOutline: true,
      strokeColor: isLight ? '#20264A' : '#F7F4FA',
      outlineColor: isLight ? 'rgba(0,0,0,.12)' : 'rgba(255,255,255,.1)',
      drawingColor: '#9B6DFF',
      highlightColor: '#FFB347',
      strokeAnimationSpeed: state.hwSlow ? 0.4 : 1,
      delayBetweenStrokes: delay,
      onLoadCharDataSuccess: function (data) {
        state.hwTotalStrokes = data.strokes.length;
        $('stStrokeCount').textContent = lang === 'en' ? data.strokes.length + ' strokes' : data.strokes.length + ' trăsături';
      }
    });
  }

  /* HanziWriter's animateCharacter() callback only fires once, on full
     completion (no per-stroke hook to depend on) — so the "N / total"
     counter is self-timed against the SAME delayBetweenStrokes value
     passed into HanziWriter.create() above, rather than guessing at an
     unverified per-stroke API. The real stroke SHAPES/order always come
     from HanziWriter's own data either way; this only paces a label. */
  function _strokeAnimate() {
    if (!state.hwWriter || !state.hwTotalStrokes) return;
    var base = $('stStrokeCount').textContent;
    var total = state.hwTotalStrokes, delay = state.hwStrokeDelay || 180;
    var timers = [];
    for (var i = 1; i <= total; i++) {
      (function (n) {
        timers.push(setTimeout(function () {
          $('stStrokeCount').textContent = (lang === 'en' ? 'Stroke ' : 'Trăsătura ') + n + ' / ' + total;
        }, n * delay));
      })(i);
    }
    state.hwWriter.animateCharacter({
      onComplete: function () {
        timers.forEach(clearTimeout);
        setTimeout(function () { $('stStrokeCount').textContent = base; }, 700);
      }
    });
  }

  function _strokeQuiz() {
    if (!state.hwWriter) return;
    $('stFeedback').textContent = lang === 'en' ? 'Draw each stroke with your finger, in order.' : 'Desenează fiecare trăsătură cu degetul, în ordine.';
    state.hwWriter.quiz({
      onCorrectStroke: function (data) {
        $('stFeedback').textContent = (lang === 'en' ? 'Stroke ' : 'Trăsătura ') + data.strokeNum + (lang === 'en' ? ' correct ✓' : ' corectă ✓');
      },
      onMistake: function () {
        $('stFeedback').textContent = lang === 'en' ? 'Not quite that shape/order — try again' : 'Nu e chiar forma/ordinea asta — mai încearcă';
      },
      onComplete: function () {
        $('stFeedback').textContent = lang === 'en' ? '✓ Character complete!' : '✓ Caracter complet!';
        if (window.RKGamification) RKGamification.addXPBonus(5);
        _bumpStreak();
      }
    });
  }

  function _strokeToggleSlow() {
    state.hwSlow = !state.hwSlow;
    $('stSlow').classList.toggle('active', state.hwSlow);
    state.hwWriter = null;
    $('stWriter').innerHTML = '';
    _initStrokeWriter();
  }

  /* ══════════════════ MEMORY CHALLENGE ══════════════════ */
  var mem = { score: 0, combo: 0, stage: 0 }; // stage: 0=char, 1=reading, 2=meaning

  function _prepareMemory() {
    mem.score = 0; mem.combo = 0;
    _memRenderScore();
    _memStartRound();
  }

  function _memRenderScore() {
    $('memScore').textContent = mem.score;
    $('memCombo').textContent = mem.combo > 1 ? '🔥 x' + mem.combo : '';
  }

  function _memStartRound() {
    mem.stage = 0;
    $('memParts').innerHTML = '';
    state.parts.forEach(function (p) {
      var el = document.createElement('div');
      el.className = 'memPartGlyph';
      el.textContent = p.hanja;
      $('memParts').appendChild(el);
    });
    $('memPrompt').textContent = lang === 'en'
      ? 'These components combine into which character?'
      : 'Aceste componente formează care caracter?';
    _memShowOptions('char');
  }

  function _memDistractGlyphs(correctHanja, n) {
    var pool = DATA.map(function (d) { return d.hanja; }).filter(function (h) { return h !== correctHanja; });
    pool = RKUtils.shuffle(pool);
    return pool.slice(0, n);
  }
  function _memDistractReadings(correctReading, n) {
    var pool = DATA.map(function (d) { return primaryReading(d); }).filter(function (r) { return r !== correctReading; });
    pool = RKUtils.shuffle(pool);
    var seen = {}; var out = [];
    for (var i = 0; i < pool.length && out.length < n; i++) {
      if (!seen[pool[i]]) { seen[pool[i]] = true; out.push(pool[i]); }
    }
    return out;
  }
  function _memDistractMeanings(correctMeaning, n) {
    var pool = DATA.map(function (d) { return d.meaning[lang] || d.meaning.ro; }).filter(function (m) { return m !== correctMeaning; });
    pool = RKUtils.shuffle(pool);
    var seen = {}; var out = [];
    for (var i = 0; i < pool.length && out.length < n; i++) {
      if (!seen[pool[i]]) { seen[pool[i]] = true; out.push(pool[i]); }
    }
    return out;
  }

  function _memShowOptions(kind) {
    var correct, options;
    if (kind === 'char') {
      correct = state.item.hanja;
      options = _memDistractGlyphs(correct, 3).concat([correct]);
    } else if (kind === 'reading') {
      correct = primaryReading(state.item);
      options = _memDistractReadings(correct, 3).concat([correct]);
    } else {
      correct = state.item.meaning[lang] || state.item.meaning.ro;
      options = _memDistractMeanings(correct, 3).concat([correct]);
    }
    options = RKUtils.shuffle(options);

    var wrap = $('memOptions');
    wrap.innerHTML = '';
    options.forEach(function (opt) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'memOptBtn';
      btn.textContent = opt;
      btn.addEventListener('click', function () { _memAnswer(opt, correct, kind, btn); });
      wrap.appendChild(btn);
    });
    $('memFeedback').textContent = '';
  }

  function _memAnswer(chosen, correct, kind, btn) {
    var isRight = chosen === correct;
    document.querySelectorAll('.memOptBtn').forEach(function (b) {
      b.disabled = true;
      if (b.textContent === correct) b.classList.add('correct');
      else if (b === btn) b.classList.add('wrong');
    });

    if (isRight) {
      mem.combo++;
      mem.score += 10 * mem.combo;
      _memRenderScore();
      if (progress.memBest.score < mem.score) { progress.memBest.score = mem.score; saveProgress(); }
      if (progress.memBest.combo < mem.combo) { progress.memBest.combo = mem.combo; saveProgress(); }
      setTimeout(function () {
        if (kind === 'char') {
          $('memPrompt').textContent = lang === 'en' ? 'What is the reading (음)?' : 'Care e citirea (음)?';
          _memShowOptions('reading');
        } else if (kind === 'reading') {
          $('memPrompt').textContent = lang === 'en' ? 'What does it mean?' : 'Ce înseamnă?';
          _memShowOptions('meaning');
        } else {
          $('memFeedback').textContent = lang === 'en' ? '🏆 Round complete!' : '🏆 Rundă completă!';
          if (window.RKGamification) RKGamification.addXPBonus(8);
          _bumpStreak();
          setTimeout(_memStartRound, 1100);
        }
      }, 700);
    } else {
      mem.combo = 0;
      _memRenderScore();
      $('memFeedback').textContent = lang === 'en' ? 'Correct answer highlighted — retry this stage.' : 'Răspunsul corect e evidențiat — reîncearcă etapa asta.';
      setTimeout(function () { _memShowOptions(kind); }, 1100);
    }
  }

  /* ── boot ──────────────────────────────────────────────── */
  function _boot() {
    var btn = $('studioBtn');
    if (!btn) return; // this page doesn't have the Studio markup (defensive, shouldn't happen on hanja-book.html)

    btn.addEventListener('click', open);
    $('studioClose').addEventListener('click', close);
    $('studioPanel').addEventListener('click', function (e) { if (e.target === this) close(); });

    document.querySelectorAll('.studioTab').forEach(function (b) {
      b.addEventListener('click', function () { switchTab(b.dataset.tab); });
    });

    $('dePlay').addEventListener('click', _dePlay);
    $('deReplay').addEventListener('click', _dePlay);
    $('deSlow').addEventListener('click', function () {
      state.hwSlow = !state.hwSlow;
      $('deSlow').classList.toggle('active', state.hwSlow);
    });

    document.querySelectorAll('.buildDiffBtn').forEach(function (b) {
      b.addEventListener('click', function () { _buildSetDiff(b.dataset.diff); });
    });
    var buildStage = $('studioPanel');
    buildStage.addEventListener('pointerdown', _buildPointerDown);
    buildStage.addEventListener('pointermove', _buildPointerMove);
    buildStage.addEventListener('pointerup', _buildPointerUp);
    buildStage.addEventListener('pointercancel', _buildPointerUp);
    $('buildSlots').addEventListener('click', _buildSlotClick);

    $('stPlay').addEventListener('click', _strokeAnimate);
    $('stQuiz').addEventListener('click', _strokeQuiz);
    $('stSlow').addEventListener('click', _strokeToggleSlow);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !$('studioPanel').classList.contains('hidden')) close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _boot);
  } else {
    _boot();
  }

  return { onRender: onRender, open: open, close: close };
})();
