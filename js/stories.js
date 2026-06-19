/* ═══════════════════════════════════════════════════════════
   RESONANCE FIELD INTERFACE — Particle Field System
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var canvas, ctx, W, H, particles = [];

  function init() {
    canvas = document.getElementById('rfCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    particles = Array.from({length: 55}, makeParticle);
    window.addEventListener('resize', resize);
    requestAnimationFrame(tick);
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeParticle() {
    return {
      x:     Math.random() * (W || 800),
      y:     Math.random() * (H || 600),
      vx:    (Math.random() - 0.5) * 0.18,
      vy:    (Math.random() - 0.5) * 0.18,
      r:     Math.random() * 1.6 + 0.3,
      baseA: Math.random() * 0.45 + 0.08,
      phase: Math.random() * Math.PI * 2,
      freq:  0.004 + Math.random() * 0.008,
    };
  }

  function isLight() {
    return document.body.classList.contains('rfi-light') || localStorage.getItem('RK_THEME') === 'light';
  }

  function tick(t) {
    ctx.clearRect(0, 0, W, H);
    var light = isLight();
    var R = light ? 91 : 123, G = light ? 63 : 92, B = light ? 212 : 250;

    particles.forEach(function (p) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -10 || p.x > W + 10) p.vx *= -1;
      if (p.y < -10 || p.y > H + 10) p.vy *= -1;
      p.a = p.baseA * (0.5 + 0.5 * Math.sin(p.phase + t * p.freq));
    });

    /* Connecting lines */
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          var la = (light ? 0.09 : 0.13) * (1 - d / 110);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(' + R + ',' + G + ',' + B + ',' + la + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    /* Dots */
    particles.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + R + ',' + G + ',' + B + ',' + p.a + ')';
      ctx.fill();
    });

    requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());

/* ═══════════════════════════════════════════════════════════
   RFI Theme System — Night Field / Luminous Field
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var SVG_MOON = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  var SVG_SUN  = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="7.05" y2="7.05"/><line x1="16.95" y1="16.95" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="7.05" y2="16.95"/><line x1="16.95" y1="7.05" x2="19.78" y2="4.22"/></svg>';

  function isLight() {
    return localStorage.getItem('RK_THEME') === 'light';
  }

  function apply(btn) {
    var light = isLight();
    document.body.classList.toggle('rfi-dark',  !light);
    document.body.classList.toggle('rfi-light',  light);
    if (btn) btn.innerHTML = light ? SVG_MOON : SVG_SUN;
  }

  function toggle(btn) {
    var nowLight = !isLight();
    localStorage.setItem('RK_THEME', nowLight ? 'light' : 'dark');
    apply(btn);
  }

  function setup() {
    var btn = document.getElementById('rfTheme');
    apply(btn);
    if (btn) btn.addEventListener('click', function () { toggle(btn); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
}());

/* ═══════════════════════════════════════════════════════════
   Resonance Field Interface — Stories App
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── State ── */
  var STORIES      = [];
  var lang         = 'ro';
  var currentStory = null;
  var currentEp    = null;
  var lineIdx      = 0;
  var bank         = [];
  var line         = [];
  var answered     = false;
  var currentState = 'stateField';

  /* ── UI strings ── */
  var UI = {
    ro: {
      fieldTitle:    'Povești',
      fieldSub:      'Intră în rezonanță cu un univers narativ',
      bcStories:     'Povești',
      episodes:      function (n) { return n + ' episoade'; },
      progress:      function (d, t) { return d + '/' + t + ' completate'; },
      bankLabel:     'Fragmente disponibile',
      seqLabel:      'Secvența ta',
      placeholder:   'Atinge un fragment →',
      continua:      'Continuă →',
      practica:      'Practică →',
      verifica:      'Verifică',
      reset:         '↺ Resetează',
      locked:        '🔒 Blocat',
      done:          '✓ Completat',
      play:          '▶ Joacă',
      lines:         function (n) { return n + ' replici'; },
      ok:            '✓ Rezonanță perfectă!',
      err:           '✗ Secvența nu e corectă. Mai încearcă!',
      completeTitle: 'Rezonanță atinsă!',
      xp:            function (xp) { return '+' + xp + ' XP'; },
      nextEp:        'Episodul următor →',
      backStory:     '← Înapoi la poveste',
    },
    en: {
      fieldTitle:    'Stories',
      fieldSub:      'Enter resonance with a narrative universe',
      bcStories:     'Stories',
      episodes:      function (n) { return n + ' episodes'; },
      progress:      function (d, t) { return d + '/' + t + ' completed'; },
      bankLabel:     'Available fragments',
      seqLabel:      'Your sequence',
      placeholder:   'Tap a fragment →',
      continua:      'Continue →',
      practica:      'Practice →',
      verifica:      'Verify',
      reset:         '↺ Reset',
      locked:        '🔒 Locked',
      done:          '✓ Completed',
      play:          '▶ Play',
      lines:         function (n) { return n + ' lines'; },
      ok:            '✓ Perfect resonance!',
      err:           '✗ Sequence incorrect. Try again!',
      completeTitle: 'Resonance achieved!',
      xp:            function (xp) { return '+' + xp + ' XP'; },
      nextEp:        'Next episode →',
      backStory:     '← Back to story',
    },
  };

  function t(k) {
    var v    = UI[lang][k];
    var args = Array.prototype.slice.call(arguments, 1);
    return typeof v === 'function' ? v.apply(null, args) : v;
  }

  /* ── Progress ── */
  function loadProg() {
    try { return JSON.parse(localStorage.getItem('RK_STORIES') || '{}'); } catch (e) { return {}; }
  }
  function saveProg(p) { localStorage.setItem('RK_STORIES', JSON.stringify(p)); }

  function isDone(sid, eid) {
    var p = loadProg();
    return !!(p[sid] && p[sid].done && p[sid].done.indexOf(eid) !== -1);
  }
  function markDone(sid, eid) {
    var p = loadProg();
    if (!p[sid]) p[sid] = {done: []};
    if (p[sid].done.indexOf(eid) === -1) p[sid].done.push(eid);
    saveProg(p);
  }
  function isUnlocked(story, idx) {
    return idx === 0 || isDone(story.id, story.episodes[idx - 1].id);
  }
  function doneCount(story) {
    var p = loadProg()[story.id];
    return p ? p.done.length : 0;
  }

  /* ── Helpers ── */
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j   = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function speakKorean(text) {
    AudioEngine.speak(text);
  }

  /* ── Phase transition ── */
  function showState(id) {
    document.querySelectorAll('.rf-state').forEach(function (el) {
      el.classList.remove('active');
    });
    var el = document.getElementById(id);
    if (el) el.classList.add('active');
    currentState = id;
    window.scrollTo(0, 0);
  }

  function setBreadcrumb(parts) {
    var bc = document.getElementById('rfBreadcrumb');
    if (!bc) return;
    bc.innerHTML = parts.map(function (p, i) {
      return '<span class="bc-crumb">' + p + '</span>' +
        (i < parts.length - 1 ? '<span class="bc-sep">›</span>' : '');
    }).join('');
  }

  /* ── Attentional Gravity (cursor → nodes drift) ── */
  function initGravity() {
    document.addEventListener('mousemove', function (e) {
      if (currentState !== 'stateField') return;
      document.querySelectorAll('.rf-story-node').forEach(function (node) {
        var rect  = node.getBoundingClientRect();
        var cx    = rect.left + rect.width  / 2;
        var cy    = rect.top  + rect.height / 2;
        var dx    = e.clientX - cx;
        var dy    = e.clientY - cy;
        var dist  = Math.sqrt(dx * dx + dy * dy);
        var range = 230;
        if (dist < range) {
          var force = (1 - dist / range) * 12;
          var angle = Math.atan2(dy, dx);
          node.style.transform = 'translate(' +
            (Math.cos(angle) * force).toFixed(1) + 'px,' +
            (Math.sin(angle) * force).toFixed(1) + 'px)';
        } else {
          node.style.transform = '';
        }
      });
    });
  }

  /* ══════════════════════════════════════════════
     STATE 1: FIELD
  ══════════════════════════════════════════════ */
  function renderField() {
    setBreadcrumb([t('bcStories')]);
    showState('stateField');
    document.getElementById('fieldTitle').textContent = t('fieldTitle');
    document.getElementById('fieldSub').textContent   = t('fieldSub');

    var container = document.getElementById('rfNodes');
    container.innerHTML = '';

    STORIES.forEach(function (s) {
      var done  = doneCount(s);
      var total = s.episodes.length;
      var pct   = total > 0 ? Math.round(done / total * 100) : 0;
      /* SVG ring: viewBox 152×152, center 76,76, r=68 */
      var circ  = +(2 * Math.PI * 68).toFixed(1);
      var offset = +(circ * (1 - pct / 100)).toFixed(1);

      var node = document.createElement('div');
      node.className  = 'rf-story-node';
      node.dataset.id = s.id;
      node.innerHTML  = [
        '<div class="rf-node-orb">',
          '<div class="rf-node-rim"></div>',
          '<div class="rf-node-surface">',
            '<div class="rf-node-icon">', s.icon, '</div>',
            '<div class="rf-node-topik">TOPIK ', s.topik, '</div>',
          '</div>',
          '<svg class="rf-node-ring" viewBox="0 0 152 152">',
            '<circle class="rf-ring-track" cx="76" cy="76" r="68"/>',
            '<circle class="rf-ring-fill"  cx="76" cy="76" r="68"',
              ' stroke-dasharray="', circ, '"',
              ' stroke-dashoffset="', offset, '"/>',
          '</svg>',
        '</div>',
        '<div>',
          '<div class="rf-node-title">', s.title[lang], '</div>',
          done > 0
            ? '<div class="rf-node-prog">' + t('progress', done, total) + '</div>'
            : '',
        '</div>',
      ].join('');

      node.addEventListener('click', function () {
        renderConstellation(s);
      });
      container.appendChild(node);
    });
  }

  /* ══════════════════════════════════════════════
     STATE 2: CONSTELLATION
  ══════════════════════════════════════════════ */
  function renderConstellation(story) {
    currentStory = story;
    setBreadcrumb([t('bcStories'), story.title[lang]]);
    showState('stateConstellation');

    document.getElementById('btnFieldBackLabel').textContent = t('bcStories');
    document.getElementById('coreIcon').textContent  = story.icon;
    document.getElementById('coreTitle').textContent = story.title[lang];
    document.getElementById('coreChars').innerHTML   = Object.entries(story.characters).map(function (e) {
      var ko = e[0], info = e[1];
      return '<span class="rf-char-sig" style="border-color:' + info.color + '55;background:' + info.color + '12">' +
        '<span class="rf-char-ko" style="color:' + info.color + '">' + ko + '</span>' +
        '<span class="rf-char-name">' + info[lang] + '</span>' +
        '</span>';
    }).join('');

    var path = document.getElementById('episodePath');
    path.innerHTML = '';

    story.episodes.forEach(function (ep, idx) {
      var done      = isDone(story.id, ep.id);
      var unlocked  = isUnlocked(story, idx);
      var cls       = done ? 'wp-done' : (unlocked ? 'wp-current' : 'wp-locked');
      var icon      = done ? '✓' : (unlocked ? '▶' : '🔒');
      var badgeTxt  = done ? t('done') : (unlocked ? t('play') : t('locked'));

      var wp = document.createElement('div');
      wp.className   = 'rf-ep-waypoint ' + cls;
      wp.dataset.epId = ep.id;
      wp.innerHTML   = [
        '<div class="rf-wp-path">',
          '<div class="rf-wp-orb">', icon, '</div>',
          '<div class="rf-wp-line"></div>',
        '</div>',
        '<div class="rf-wp-content">',
          '<div class="rf-wp-info">',
            '<div class="rf-wp-title">', ep.title[lang], '</div>',
            '<div class="rf-wp-meta">',  t('lines', ep.lines.length), '</div>',
          '</div>',
          '<span class="rf-wp-badge ', cls, '">', badgeTxt, '</span>',
        '</div>',
      ].join('');

      if (!wp.classList.contains('wp-locked')) {
        wp.addEventListener('click', function () {
          var epObj = story.episodes.find(function (e) { return e.id === wp.dataset.epId; });
          if (epObj) startImmersion(story, epObj);
        });
      }
      path.appendChild(wp);
    });
  }

  /* ══════════════════════════════════════════════
     STATE 3: IMMERSION — dialogue reading
  ══════════════════════════════════════════════ */
  function startImmersion(story, ep) {
    currentStory = story;
    currentEp    = ep;
    lineIdx      = 0;
    answered     = false;

    setBreadcrumb([t('bcStories'), story.title[lang], ep.title[lang]]);
    showState('stateImmersion');

    document.getElementById('btnConstellationBackLabel').textContent = story.title[lang];
    document.getElementById('immEpLabel').textContent                = ep.title[lang];
    document.getElementById('immersionStream').innerHTML             = '';
    document.getElementById('immProgressFlow').style.width           = '0%';
    document.getElementById('btnNextLineLabel').textContent          = t('continua');

    showNextLine();
  }

  function showNextLine() {
    var ep       = currentEp;
    var l        = ep.lines[lineIdx];
    if (!l) return;

    var story    = currentStory;
    var charInfo = story.characters[l.speaker] || {color: '#888', ro: l.speaker, en: l.speaker};
    var speakers = Object.keys(story.characters);
    var isRight  = speakers.indexOf(l.speaker) % 2 === 1;
    var initial  = Array.from(l.speaker)[0];

    var stream = document.getElementById('immersionStream');

    /* Fade older lines when stream gets long */
    var existing = stream.querySelectorAll('.rf-dial-line');
    if (existing.length >= 3) {
      existing.forEach(function (el, i) {
        if (i < existing.length - 2) el.classList.add('dl-fading');
      });
    }

    var row = document.createElement('div');
    row.className = 'rf-dial-line' + (isRight ? ' dl-right' : '');
    row.innerHTML = [
      '<div class="rf-speaker-dot" style="background:', charInfo.color, '">', initial, '</div>',
      '<div class="rf-line-body">',
        '<div class="rf-line-speaker" style="color:', charInfo.color, '">',
          l.speaker, ' · ', charInfo[lang],
        '</div>',
        '<div class="rf-line-bubble">',
          '<div class="rf-line-ko">', l.ko, '</div>',
          '<div class="rf-line-trans">', l[lang], '</div>',
        '</div>',
        '<button class="rf-line-tts" data-ko="', l.ko.replace(/"/g, '&quot;'), '">🔊</button>',
      '</div>',
    ].join('');

    stream.appendChild(row);
    row.scrollIntoView({behavior: 'smooth', block: 'end'});
    speakKorean(l.ko);

    row.querySelector('.rf-line-tts').addEventListener('click', function () {
      speakKorean(this.dataset.ko);
    });

    lineIdx++;
    document.getElementById('immProgressFlow').style.width =
      Math.round(lineIdx / ep.lines.length * 100) + '%';
    document.getElementById('btnNextLineLabel').textContent =
      lineIdx >= ep.lines.length ? t('practica') : t('continua');
  }

  /* ══════════════════════════════════════════════
     STATE 4: PRACTICE
  ══════════════════════════════════════════════ */
  function startPractice() {
    showState('statePractice');

    document.getElementById('practiceBankLabel').textContent  = t('bankLabel');
    document.getElementById('practiceSeqLabel').textContent   = t('seqLabel');
    document.getElementById('btnCheckLabel').textContent      = t('verifica');
    document.getElementById('btnResetLabel').textContent      = t('reset');
    document.getElementById('practicePlaceholder').textContent = t('placeholder');
    document.getElementById('practiceFeedback').textContent   = '';
    document.getElementById('practiceFeedback').className     = '';
    document.getElementById('practiceSequence').classList.remove('seq-ok', 'seq-err');

    bank     = shuffle(currentEp.lines.map(function (l) { return l.ko; }));
    line     = [];
    answered = false;
    renderPractice();
  }

  function renderPractice() {
    var bankEl = document.getElementById('practiceBank');
    var seqEl  = document.getElementById('practiceSequence');
    var phEl   = document.getElementById('practicePlaceholder');
    bankEl.innerHTML = '';
    seqEl.innerHTML  = '';
    if (phEl) seqEl.appendChild(phEl);

    bank.forEach(function (ko, idx) {
      var chip = document.createElement('div');
      chip.className   = 'rf-fragment';
      chip.textContent = ko;
      chip.addEventListener('click', function () {
        if (answered) return;
        bank.splice(idx, 1);
        line.push(ko);
        renderPractice();
      });
      bankEl.appendChild(chip);
    });

    line.forEach(function (ko, idx) {
      var chip = document.createElement('div');
      chip.className   = 'rf-fragment rf-placed';
      chip.textContent = ko;
      chip.addEventListener('click', function () {
        if (answered) return;
        line.splice(idx, 1);
        bank.push(ko);
        renderPractice();
      });
      seqEl.appendChild(chip);
    });

    if (phEl) phEl.style.display = line.length === 0 ? '' : 'none';
  }

  function checkAnswer() {
    if (answered) return;
    var correct = currentEp.lines.map(function (l) { return l.ko; });
    var fb      = document.getElementById('practiceFeedback');
    var seq     = document.getElementById('practiceSequence');

    if (JSON.stringify(line) === JSON.stringify(correct)) {
      fb.textContent = t('ok');
      fb.className   = 'fb-ok';
      seq.classList.add('seq-ok');
      answered = true;
      setTimeout(showComplete, 800);
    } else {
      fb.textContent = t('err');
      fb.className   = 'fb-err';
      seq.classList.add('seq-err');
      setTimeout(function () { seq.classList.remove('seq-err'); }, 600);
    }
  }

  function resetPractice() {
    bank     = shuffle(currentEp.lines.map(function (l) { return l.ko; }));
    line     = [];
    answered = false;
    document.getElementById('practiceFeedback').textContent = '';
    document.getElementById('practiceFeedback').className   = '';
    document.getElementById('practiceSequence').classList.remove('seq-ok', 'seq-err');
    renderPractice();
  }

  /* ══════════════════════════════════════════════
     STATE 5: COMPLETE
  ══════════════════════════════════════════════ */
  function showComplete() {
    var XP = 15;
    markDone(currentStory.id, currentEp.id);
    if (window.RKGamification) RKGamification.addXPBonus(XP);

    showState('stateComplete');
    document.getElementById('completePulse').textContent = '✦';
    document.getElementById('completeTitle').textContent  = t('completeTitle');
    document.getElementById('completeXP').textContent     = t('xp', XP);

    var epIdx  = currentStory.episodes.findIndex(function (e) { return e.id === currentEp.id; });
    var nextEp = currentStory.episodes[epIdx + 1] || null;
    var btnEl  = document.getElementById('btnNextEpisode');
    document.getElementById('btnNextEpLabel').textContent = nextEp ? t('nextEp') : t('backStory');
    btnEl.onclick = nextEp
      ? function () { startImmersion(currentStory, nextEp); }
      : function () { renderConstellation(currentStory); };
  }

  /* ── Language switching ── */
  function setLang(l) {
    lang = l;
    localStorage.setItem('RK_LANG', l);
    document.documentElement.lang = l;
    document.getElementById('rfLangBtn').textContent = l;
    document.getElementById('rfPickRo').classList.toggle('lp-active', l === 'ro');
    document.getElementById('rfPickEn').classList.toggle('lp-active', l === 'en');
    if (currentState === 'stateField') {
      renderField();
    } else if (currentState === 'stateConstellation' && currentStory) {
      renderConstellation(currentStory);
    }
  }

  /* ── Init ── */
  function init() {
    lang = localStorage.getItem('RK_LANG') || 'ro';
    document.documentElement.lang = lang;
    document.getElementById('rfLangBtn').textContent = lang;
    document.getElementById('rfPickRo').classList.toggle('lp-active', lang === 'ro');
    document.getElementById('rfPickEn').classList.toggle('lp-active', lang === 'en');

    /* Single lang button — long press (>450ms) opens picker */
    var langBtn    = document.getElementById('rfLangBtn');
    var langPicker = document.getElementById('rfLangPicker');
    var langTimer  = null;

    function openPicker() { langPicker.classList.add('open'); }
    function closePicker() { langPicker.classList.remove('open'); }

    langBtn.addEventListener('pointerdown', function () {
      langTimer = setTimeout(function () { langTimer = null; openPicker(); }, 450);
    });
    langBtn.addEventListener('pointerup',    function () { clearTimeout(langTimer); langTimer = null; });
    langBtn.addEventListener('pointerleave', function () { clearTimeout(langTimer); langTimer = null; });

    document.getElementById('rfPickRo').addEventListener('click', function () { setLang('ro'); closePicker(); });
    document.getElementById('rfPickEn').addEventListener('click', function () { setLang('en'); closePicker(); });

    document.addEventListener('pointerdown', function (e) {
      if (!e.target.closest('#rfLangBtn,#rfLangPicker')) closePicker();
    });

    document.getElementById('btnFieldBack').addEventListener('click', renderField);
    document.getElementById('btnConstellationBack').addEventListener('click', function () {
      if (currentStory) renderConstellation(currentStory);
    });

    document.getElementById('btnNextLine').addEventListener('click', function () {
      if (lineIdx >= currentEp.lines.length) startPractice();
      else showNextLine();
    });

    document.getElementById('btnCheck').addEventListener('click', checkAnswer);
    document.getElementById('btnReset').addEventListener('click', resetPractice);

    initGravity();

    fetch('./data/stories.json')
      .then(function (r) { return r.json(); })
      .then(function (data) { STORIES = data; renderField(); })
      .catch(function () {
        var el = document.getElementById('rfNodes');
        if (el) el.innerHTML = '<p style="color:var(--t2);text-align:center;padding:40px">Nu s-au putut încărca poveștile.</p>';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
