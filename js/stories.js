/* ── Stories — mini-dialogue contextual learning ──────────────────
   Three phases per episode:
   1. Read  — chat-bubble display with TTS, one line at a time
   2. Practice — arrange shuffled Korean lines in correct order
   3. Complete — XP reward + unlock next episode
   ─────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  /* ── State ── */
  let STORIES      = [];
  let lang         = 'ro';
  let currentStory = null;
  let currentEp    = null;
  let lineIdx      = 0;      // next line to reveal in Read phase
  let bank         = [];     // shuffled Korean sentences (Practice)
  let line         = [];     // user-ordered sentences (Practice)
  let answered     = false;

  /* ── UI strings ── */
  const UI = {
    ro: {
      sub:         'Dialoguri cu context narativ',
      episodes:    n  => `${n} episoade`,
      progress:    (d,t) => `${d}/${t} completate`,
      readPhase:   '📖 Citește dialogul',
      practicePhase:'🏋 Aranjează în ordine corectă',
      placeholder: 'Atinge o replică din bancă →',
      continua:    'Continuă →',
      practica:    '🏋 Practică',
      verifica:    'Verifică',
      reset:       '↺ Resetează',
      locked:      '🔒 Blocat',
      done:        '✓ Completat',
      play:        '▶ Joacă',
      lines:       n  => `${n} replici`,
      ok:          '✓ Perfect! Ordinea e corectă!',
      err:         '✗ Nu e în ordine. Mai încearcă!',
      completeTitle:'Episod completat!',
      xp:          xp => `+${xp} XP`,
      nextEp:      'Episodul următor →',
      backStory:   '← Înapoi la poveste',
    },
    en: {
      sub:         'Mini-dialogues with narrative context',
      episodes:    n  => `${n} episodes`,
      progress:    (d,t) => `${d}/${t} completed`,
      readPhase:   '📖 Read the dialogue',
      practicePhase:'🏋 Arrange in correct order',
      placeholder: 'Tap a line from the bank →',
      continua:    'Continue →',
      practica:    '🏋 Practice',
      verifica:    'Check',
      reset:       '↺ Reset',
      locked:      '🔒 Locked',
      done:        '✓ Completed',
      play:        '▶ Play',
      lines:       n  => `${n} lines`,
      ok:          '✓ Perfect! The order is correct!',
      err:         '✗ Not in order. Try again!',
      completeTitle:'Episode complete!',
      xp:          xp => `+${xp} XP`,
      nextEp:      'Next episode →',
      backStory:   '← Back to story',
    }
  };
  const t = (k, ...a) => { const v = UI[lang][k]; return typeof v === 'function' ? v(...a) : v; };

  /* ── Progress ── */
  function loadProg() {
    try { return JSON.parse(localStorage.getItem('RK_STORIES') || '{}'); } catch(e) { return {}; }
  }
  function saveProg(p) { localStorage.setItem('RK_STORIES', JSON.stringify(p)); }

  function isDone(sid, eid) {
    const p = loadProg();
    return !!(p[sid] && p[sid].done && p[sid].done.includes(eid));
  }
  function markDone(sid, eid) {
    const p = loadProg();
    if (!p[sid]) p[sid] = { done: [] };
    if (!p[sid].done.includes(eid)) p[sid].done.push(eid);
    saveProg(p);
  }
  function isUnlocked(story, idx) {
    return idx === 0 || isDone(story.id, story.episodes[idx - 1].id);
  }
  function doneCount(story) {
    const p = loadProg()[story.id];
    return p ? p.done.length : 0;
  }

  /* ── Helpers ── */
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function speakKorean(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ko-KR';
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  }

  /* ── View switching ── */
  function showView(id) {
    document.querySelectorAll('.s-view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }
  function setNav(title, sub, showBack1, back1Text, showBack2, back2Text) {
    document.getElementById('navTitle').textContent = title;
    document.getElementById('navSub').textContent   = sub;
    const b1 = document.getElementById('btnToList');
    const b2 = document.getElementById('btnToEpisodes');
    b1.style.display = showBack1 ? '' : 'none';
    b2.style.display = showBack2 ? '' : 'none';
    if (showBack1) b1.textContent = back1Text;
    if (showBack2) b2.textContent = back2Text;
  }

  /* ══════════════════════════════════════════════
     VIEW 1 — Story list
  ══════════════════════════════════════════════ */
  function renderList() {
    setNav('📖 Stories', t('sub'), false, '', false, '');
    showView('viewList');

    const grid = document.getElementById('storiesGrid');
    grid.innerHTML = STORIES.map(s => {
      const done  = doneCount(s);
      const total = s.episodes.length;
      const pct   = Math.round(done / total * 100);
      return `
        <div class="story-card" data-id="${s.id}">
          <div class="story-card-icon">${s.icon}</div>
          <div class="story-topik">TOPIK ${s.topik}</div>
          <div class="story-card-title">${s.title[lang]}</div>
          <div class="story-card-desc">${s.description[lang]}</div>
          <div class="story-card-foot">
            <span>${t('episodes', total)}</span>
            ${done > 0 ? `<span class="story-done-label">${t('progress', done, total)}</span>` : ''}
          </div>
          <div class="story-prog-track">
            <div class="story-prog-fill" style="width:${pct}%"></div>
          </div>
        </div>`;
    }).join('');

    grid.querySelectorAll('.story-card').forEach(card => {
      card.addEventListener('click', () => {
        const s = STORIES.find(x => x.id === card.dataset.id);
        if (s) renderEpisodes(s);
      });
    });
  }

  /* ══════════════════════════════════════════════
     VIEW 2 — Episode list
  ══════════════════════════════════════════════ */
  function renderEpisodes(story) {
    currentStory = story;
    setNav(
      story.icon + ' ' + story.title[lang],
      story.description[lang],
      true, '‹ Stories',
      false, ''
    );
    showView('viewEpisodes');

    // Character chips
    document.getElementById('charBar').innerHTML =
      Object.entries(story.characters).map(([ko, info]) => `
        <div class="char-chip" style="border-color:${info.color}40;background:${info.color}10">
          <span class="char-ko"  style="color:${info.color}">${ko}</span>
          <span class="char-native">${info[lang]}</span>
        </div>`).join('');

    // Episode items
    document.getElementById('episodeList').innerHTML =
      story.episodes.map((ep, idx) => {
        const done      = isDone(story.id, ep.id);
        const unlocked  = isUnlocked(story, idx);
        const stateKey  = done ? 'done' : unlocked ? 'play' : 'locked';
        const stateIcon = done ? '✓' : unlocked ? '▶' : '🔒';
        return `
          <div class="episode-item ${done ? 'done' : unlocked ? 'current' : 'locked'}"
               data-ep-id="${ep.id}">
            <div class="ep-status-icon">${stateIcon}</div>
            <div class="ep-info">
              <div class="ep-title">${ep.title[lang]}</div>
              <div class="ep-meta">${t('lines', ep.lines.length)}</div>
            </div>
            <div class="ep-badge ${done ? 'done' : unlocked ? 'current' : 'locked'}">${t(stateKey)}</div>
          </div>`;
      }).join('');

    document.querySelectorAll('.episode-item:not(.locked)').forEach(el => {
      el.addEventListener('click', () => {
        const ep = story.episodes.find(e => e.id === el.dataset.epId);
        if (ep) startEpisode(story, ep);
      });
    });
  }

  /* ══════════════════════════════════════════════
     VIEW 3 — Episode player
  ══════════════════════════════════════════════ */
  function startEpisode(story, ep) {
    currentStory = story;
    currentEp    = ep;
    lineIdx      = 0;
    answered     = false;

    setNav(
      ep.title[lang],
      story.title[lang],
      false, '',
      true, '‹ ' + story.title[lang]
    );
    showView('viewPlayer');

    // Reset all phases
    document.getElementById('phaseRead').style.display     = '';
    document.getElementById('phasePractice').style.display = 'none';
    document.getElementById('phaseComplete').style.display = 'none';
    document.getElementById('dialogue').innerHTML          = '';
    document.getElementById('readLabel').textContent       = t('readPhase');
    document.getElementById('btnNextLine').textContent     = t('continua');

    showNextLine();
  }

  /* ── Read phase ── */
  function showNextLine() {
    const ep   = currentEp;
    const l    = ep.lines[lineIdx];
    if (!l) return;

    const story    = currentStory;
    const charInfo = story.characters[l.speaker] || { color: '#888', ro: l.speaker, en: l.speaker };
    const speakers = Object.keys(story.characters);
    const isRight  = speakers.indexOf(l.speaker) % 2 === 1;
    const initial  = [...l.speaker][0]; // first Unicode char (handles Korean)

    const row = document.createElement('div');
    row.className = 'bubble-row' + (isRight ? ' right' : '');
    row.innerHTML = `
      <div class="bubble-avatar" style="background:${charInfo.color}">${initial}</div>
      <div class="bubble-body">
        <div class="bubble-speaker" style="color:${charInfo.color}">
          ${l.speaker} · ${charInfo[lang]}
        </div>
        <div class="bubble">
          <div class="bubble-ko">${l.ko}</div>
          <div class="bubble-trans">${l[lang]}</div>
        </div>
        <button class="bubble-sound" data-ko="${l.ko.replace(/"/g,'&quot;')}" aria-label="🔊">🔊</button>
      </div>`;

    document.getElementById('dialogue').appendChild(row);
    row.scrollIntoView({ behavior: 'smooth', block: 'end' });
    speakKorean(l.ko);

    row.querySelector('.bubble-sound').addEventListener('click', function () {
      speakKorean(this.dataset.ko);
    });

    lineIdx++;
    const btn = document.getElementById('btnNextLine');
    if (lineIdx >= ep.lines.length) {
      btn.textContent = t('practica');
    } else {
      btn.textContent = t('continua');
    }
  }

  /* ── Practice phase ── */
  function startPractice() {
    document.getElementById('phaseRead').style.display     = 'none';
    document.getElementById('phasePractice').style.display = '';

    document.getElementById('practiceLabel').textContent = t('practicePhase');
    document.getElementById('btnCheck').textContent      = t('verifica');
    document.getElementById('btnReset').textContent      = t('reset');
    document.getElementById('practiceFeedback').textContent = '';
    document.getElementById('practiceFeedback').className   = 'practice-feedback';
    document.getElementById('practicePlaceholder').textContent = t('placeholder');

    bank     = shuffle(currentEp.lines.map(l => l.ko));
    line     = [];
    answered = false;
    renderPractice();
  }

  function renderPractice() {
    const bankEl  = document.getElementById('practiceBank');
    const lineEl  = document.getElementById('practiceLine');
    const phEl    = document.getElementById('practicePlaceholder');
    bankEl.innerHTML = '';
    lineEl.innerHTML = '';

    bank.forEach((ko, idx) => {
      const chip = document.createElement('div');
      chip.className   = 'practice-chip';
      chip.textContent = ko;
      chip.addEventListener('click', () => {
        if (answered) return;
        bank.splice(idx, 1);
        line.push(ko);
        renderPractice();
      });
      bankEl.appendChild(chip);
    });

    line.forEach((ko, idx) => {
      const chip = document.createElement('div');
      chip.className   = 'practice-chip placed';
      chip.textContent = ko;
      chip.addEventListener('click', () => {
        if (answered) return;
        line.splice(idx, 1);
        bank.push(ko);
        renderPractice();
      });
      lineEl.appendChild(chip);
    });

    // Placeholder only when answer area is empty
    if (phEl) phEl.style.display = line.length === 0 ? '' : 'none';
  }

  function checkAnswer() {
    if (answered) return;
    const correct = currentEp.lines.map(l => l.ko);
    const fb      = document.getElementById('practiceFeedback');

    if (JSON.stringify(line) === JSON.stringify(correct)) {
      fb.textContent = t('ok');
      fb.className   = 'practice-feedback ok';
      answered       = true;
      setTimeout(showComplete, 700);
    } else {
      fb.textContent = t('err');
      fb.className   = 'practice-feedback err';
    }
  }

  function resetPractice() {
    bank     = shuffle(currentEp.lines.map(l => l.ko));
    line     = [];
    answered = false;
    document.getElementById('practiceFeedback').textContent = '';
    document.getElementById('practiceFeedback').className   = 'practice-feedback';
    renderPractice();
  }

  /* ── Complete phase ── */
  function showComplete() {
    document.getElementById('phasePractice').style.display = 'none';
    document.getElementById('phaseComplete').style.display = '';

    const XP = 15;
    markDone(currentStory.id, currentEp.id);
    if (window.RKGamification) RKGamification.addXPBonus(XP);

    document.getElementById('completeBody').innerHTML = `
      <div class="complete-emoji">🎉</div>
      <div class="complete-title">${t('completeTitle')}</div>
      <div class="complete-xp">${t('xp', XP)}</div>`;

    const epIdx = currentStory.episodes.findIndex(e => e.id === currentEp.id);
    const nextEp = currentStory.episodes[epIdx + 1] || null;
    const btn    = document.getElementById('btnNextEpisode');
    if (nextEp) {
      btn.textContent = t('nextEp');
      btn.onclick = () => startEpisode(currentStory, nextEp);
    } else {
      btn.textContent = t('backStory');
      btn.onclick = () => renderEpisodes(currentStory);
    }
  }

  /* ── Init ── */
  function init() {
    // Back navigation
    document.getElementById('btnToList').addEventListener('click', renderList);
    document.getElementById('btnToEpisodes').addEventListener('click', () => {
      if (currentStory) renderEpisodes(currentStory);
    });

    // Read phase button (toggles between "Continuă" and "Practică")
    document.getElementById('btnNextLine').addEventListener('click', () => {
      if (lineIdx >= currentEp.lines.length) {
        startPractice();
      } else {
        showNextLine();
      }
    });

    // Practice buttons
    document.getElementById('btnCheck').addEventListener('click', checkAnswer);
    document.getElementById('btnReset').addEventListener('click', resetPractice);

    // Load story data
    fetch('./data/stories.json')
      .then(r => r.json())
      .then(data => { STORIES = data; renderList(); })
      .catch(() => {
        document.getElementById('storiesGrid').innerHTML =
          '<p style="color:var(--rk-muted-ui);text-align:center;padding:20px">Nu s-au putut încărca poveștile.</p>';
      });

    // Language switching
    RKLang.init(l => {
      lang = l;
      document.documentElement.lang = l;
      // Re-render whichever view is active
      const active = document.querySelector('.s-view.active');
      if (!active) return;
      if (active.id === 'viewList') renderList();
      else if (active.id === 'viewEpisodes' && currentStory) renderEpisodes(currentStory);
      // Player view: strings update only on next episode start
    });
    lang = RKLang.get();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
