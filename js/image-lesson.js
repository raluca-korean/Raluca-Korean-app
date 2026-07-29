/* ══════════════════════════════════════════════════════════════
   image-lesson.js — Lecție completă de coreeană generată dintr-o
   poză, folosind Claude (vision) cu cheia API a utilizatorului.
══════════════════════════════════════════════════════════════ */

let currentLang   = 'ro';
let ilImageB64     = null;
let ilImageMedia    = null;
let ilLesson       = null;
let ilActiveCat    = 'all';
let ilFlashCards   = [];
let ilFlashIndex   = 0;
let ilFlashFlipped = false;

const IL_CAT_LABELS = {
  object:   { ro:'Obiecte',              en:'Objects'   },
  color:    { ro:'Culori',               en:'Colors'    },
  size:     { ro:'Mărime',               en:'Size'      },
  quantity: { ro:'Cantitate',            en:'Quantity'  },
  location: { ro:'Locație',              en:'Location'  },
  material: { ro:'Material',             en:'Material'  },
  emotion:  { ro:'Emoții',               en:'Emotions'  },
  action:   { ro:'Acțiuni (verbe)',      en:'Actions'   },
};

const IL_POS_LABELS = {
  noun:      { ro:'substantiv', en:'noun'      },
  verb:      { ro:'verb',       en:'verb'      },
  adjective: { ro:'adjectiv',   en:'adjective' },
  adverb:    { ro:'adverb',     en:'adverb'    },
  other:     { ro:'altele',     en:'other'     },
};

/* ══════════════════════════════════════════════════════════════
   INIȚIALIZARE
══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  RKLang.init(lang => { currentLang = lang; applyLang(); });
  currentLang = RKLang.get();
  applyLang();
  setupDropzone();
  renderLevelHint();

  document.getElementById('ilApiModal').addEventListener('click', e => {
    if (e.target === document.getElementById('ilApiModal')) ilCloseApiModal();
  });

  document.querySelectorAll('.il-sent-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.il-sent-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSentences(btn.dataset.lvl);
    });
  });
});

/* ══════════════════════════════════════════════════════════════
   LIMBĂ
══════════════════════════════════════════════════════════════ */
function applyLang() {
  const ro = currentLang === 'ro';
  document.getElementById('ilSub').textContent = ro
    ? 'Încarcă o poză și primești o lecție completă de coreeană'
    : 'Upload a photo and get a complete Korean lesson';
  document.getElementById('ilCostNotice').textContent = ro
    ? 'Funcție opțională · necesită propria cheie API Anthropic (plătită separat, nu prin această aplicație) · aplicația rămâne gratuită dacă nu o folosești'
    : 'Optional feature · requires your own Anthropic API key (billed separately, not through this app) · the app stays free if you don’t use it';
  document.getElementById('ilDropText').textContent = ro
    ? 'Trage o poză aici sau apasă pentru a alege'
    : 'Drag a photo here or click to choose';
  document.getElementById('ilDropHint').textContent = ro
    ? 'JPG, PNG · maxim 10MB' : 'JPG, PNG · max 10MB';
  document.getElementById('ilBtnClear').textContent = ro ? 'Șterge tot' : 'Clear all';
  document.getElementById('ilBtnGenerateLbl').textContent = ro ? 'Generează lecția' : 'Generate lesson';
  document.getElementById('ilLoadingMsg').textContent = ro ? 'Analizez imaginea…' : 'Analysing image…';
  document.getElementById('ilLblLevel').textContent = ro ? 'NIVEL ESTIMAT' : 'ESTIMATED LEVEL';
  document.getElementById('ilLblVocab').textContent = ro ? 'VOCABULAR' : 'VOCABULARY';
  document.getElementById('ilLblGrammar').textContent = ro ? 'GRAMATICĂ' : 'GRAMMAR';
  document.getElementById('ilLblSentences').textContent = ro ? 'PROPOZIȚII EXEMPLU' : 'EXAMPLE SENTENCES';
  document.getElementById('ilLblFlash').textContent = 'FLASHCARDS';
  document.getElementById('ilLblQuiz').textContent = 'QUIZ';
  document.getElementById('ilLblFill').textContent = ro ? 'COMPLETEAZĂ SPAȚIILE' : 'FILL IN THE BLANK';
  document.getElementById('ilLblSpeak').textContent = ro ? 'PRACTICĂ VORBIRE' : 'SPEAKING PRACTICE';
  document.getElementById('ilLblWrite').textContent = ro ? 'PRACTICĂ SCRIERE' : 'WRITING PRACTICE';
  document.getElementById('ilLblListen').textContent = ro ? 'PRACTICĂ ASCULTARE' : 'LISTENING PRACTICE';
  document.getElementById('ilLblRelated').textContent = ro ? 'VOCABULAR RECOMANDAT' : 'RELATED VOCABULARY';
  document.getElementById('ilRelatedNote').textContent = ro
    ? 'Cuvinte utile legate de scenă, care nu apar neapărat în poză.'
    : 'Useful words related to the scene, not necessarily visible in the photo.';
  document.getElementById('ilTabAdvanced').textContent = ro ? 'Avansat' : 'Advanced';
  document.getElementById('ilApiTitle').textContent = ro ? 'Configurare cheie API' : 'API Key Setup';
  document.getElementById('ilApiDesc').innerHTML = ro
    ? 'Această funcție este opțională și separată de aplicație: necesită propria ta cheie Anthropic API, plătită direct către Anthropic (nu prin Raluca Korean).<br>Cheia rămâne salvată local pe dispozitivul tău — aplicația în sine rămâne gratuită dacă alegi să nu folosești această funcție.'
    : 'This feature is optional and separate from the app: it requires your own Anthropic API key, billed directly by Anthropic (not through Raluca Korean).<br>The key stays saved locally on your device — the app itself stays free if you choose not to use this feature.';
  document.getElementById('ilBtnApiCancel').textContent = ro ? 'Anulează' : 'Cancel';
  document.getElementById('ilBtnApiSave').textContent = ro ? 'Salvează' : 'Save';

  renderLevelHint();
  if (ilLesson) renderAll();
}

/* ══════════════════════════════════════════════════════════════
   NIVEL CURENT (din progresul salvat local)
══════════════════════════════════════════════════════════════ */
function ilGetProgressContext() {
  let level = localStorage.getItem('RK_LEVEL') || '1';
  if (level === 'test') level = '1';
  let stats = null;
  try { stats = JSON.parse(localStorage.getItem('RK_STATS') || 'null'); } catch (e) {}
  const total    = stats && stats.total    ? stats.total    : 0;
  const correct  = stats && stats.correct  ? stats.correct  : 0;
  const accuracy = total ? Math.round((correct / total) * 100) : null;
  return { level: parseInt(level, 10) || 1, total, accuracy };
}

function renderLevelHint() {
  const ctx = ilGetProgressContext();
  const ro = currentLang === 'ro';
  let text;
  if (ctx.total > 0) {
    text = ro
      ? `Nivelul tău curent: TOPIK ${ctx.level} · ${ctx.total} exerciții rezolvate · ${ctx.accuracy}% acuratețe`
      : `Your current level: TOPIK ${ctx.level} · ${ctx.total} exercises done · ${ctx.accuracy}% accuracy`;
  } else {
    text = ro
      ? `Nivelul tău curent: TOPIK ${ctx.level}`
      : `Your current level: TOPIK ${ctx.level}`;
  }
  document.getElementById('ilLevelHint').textContent = text;
}

/* ══════════════════════════════════════════════════════════════
   ÎNCĂRCARE IMAGINE
══════════════════════════════════════════════════════════════ */
function setupDropzone() {
  const zone  = document.getElementById('ilDropzone');
  const input = document.getElementById('ilFileInput');

  zone.addEventListener('click', e => {
    if (e.target.closest('.il-remove-btn')) return;
    input.click();
  });

  input.addEventListener('change', () => {
    if (input.files && input.files[0]) ilHandleFile(input.files[0]);
  });

  ['dragover', 'dragenter'].forEach(evt => {
    zone.addEventListener(evt, e => { e.preventDefault(); zone.classList.add('dragover'); });
  });
  ['dragleave', 'drop'].forEach(evt => {
    zone.addEventListener(evt, e => { e.preventDefault(); zone.classList.remove('dragover'); });
  });
  zone.addEventListener('drop', e => {
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) ilHandleFile(file);
  });

  document.getElementById('ilRemoveBtn').addEventListener('click', e => {
    e.stopPropagation();
    ilClearImage();
  });
}

function ilHandleFile(file) {
  if (!file.type.startsWith('image/')) {
    alert(currentLang === 'ro' ? 'Te rog alege o imagine.' : 'Please choose an image.');
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    alert(currentLang === 'ro' ? 'Imaginea e prea mare (max 10MB).' : 'Image too large (max 10MB).');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1024;
      let w = img.width, h = img.height;
      if (w > MAX || h > MAX) {
        const scale = MAX / Math.max(w, h);
        w = Math.round(w * scale);
        h = Math.round(h * scale);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      ilImageB64  = dataUrl.split(',')[1];
      ilImageMedia = 'image/jpeg';

      document.getElementById('ilPreviewImg').src = dataUrl;
      document.getElementById('ilDropzone').classList.add('has-image');
      document.getElementById('ilBtnGenerate').disabled = false;
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function ilClearImage() {
  ilImageB64 = null;
  ilImageMedia = null;
  document.getElementById('ilFileInput').value = '';
  document.getElementById('ilPreviewImg').src = '';
  document.getElementById('ilDropzone').classList.remove('has-image');
  document.getElementById('ilBtnGenerate').disabled = true;
}

function ilClearAll() {
  ilClearImage();
  ilLesson = null;
  document.getElementById('ilResults').classList.remove('visible');
  document.getElementById('ilLoading').classList.remove('visible');
}

/* ══════════════════════════════════════════════════════════════
   GENERARE LECȚIE
══════════════════════════════════════════════════════════════ */
async function ilGenerate() {
  if (!ilImageB64) return;
  const apiKey = localStorage.getItem('RK_CLAUDE_KEY');
  if (!apiKey) { ilShowApiModal(); return; }

  document.getElementById('ilResults').classList.remove('visible');
  document.getElementById('ilLoading').classList.add('visible');
  document.getElementById('ilBtnGenerate').disabled = true;

  try {
    ilLesson = await ilCallClaudeVision(apiKey);
    renderAll();
    document.getElementById('ilResults').classList.add('visible');
    document.getElementById('ilResults').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    if (err.status === 401) {
      localStorage.removeItem('RK_CLAUDE_KEY');
      alert(currentLang === 'ro'
        ? 'Cheie API invalidă. Te rog introdu din nou.'
        : 'Invalid API key. Please re-enter.');
      ilShowApiModal();
    } else {
      alert((currentLang === 'ro' ? 'Eroare: ' : 'Error: ') + (err.message || 'Unknown'));
    }
  } finally {
    document.getElementById('ilLoading').classList.remove('visible');
    document.getElementById('ilBtnGenerate').disabled = false;
  }
}

function ilBuildSystemPrompt() {
  const ctx = ilGetProgressContext();
  return `You are an expert Korean language tutor and vision AI for a TOPIK-prep app. Analyze the uploaded photo and turn it into a complete, accurate Korean lesson.

Rules:
- Detect only objects/elements you are more than 85% confident about. Never invent objects that are not visible.
- For every detected item provide Korean (Hangul), a romanization, Romanian translation, English translation, part of speech, and a simple pronunciation guide.
- Also detect and include as vocabulary items (with category set accordingly): colors, size, quantity, location, materials, emotions (only if people are visible), and actions/verbs.
- Group vocabulary by category using one of: "object","color","size","quantity","location","material","emotion","action".
- Student context: manually selected TOPIK level ${ctx.level}${ctx.total ? `, ${ctx.total} exercises completed with ${ctx.accuracy}% accuracy` : ', no exercise history yet'}. Estimate the student's real level from this context and adapt the lesson's difficulty (vocabulary complexity, grammar, sentence length) accordingly.
- Create Korean example sentences for beginner (TOPIK I), intermediate (TOPIK II), and advanced levels, all based on the detected scene.
- Explain the grammar patterns used in those sentences.
- Create a 5-item multiple-choice quiz, a 5-item fill-in-the-blank exercise, 3 speaking-practice sentences, 2 writing-practice prompts (with a model example sentence), and 3 listening-practice items (a Korean sentence plus a comprehension question and answer), all derived from the generated vocabulary/sentences.
- Suggest 5-8 additional useful vocabulary items related to the scene that are NOT necessarily visible in the photo — put these only in "relatedVocabulary", clearly separate from detected "vocabulary".
- Every text field that is shown to the student must be provided in BOTH Romanian ("ro") and English ("en").
- Respond ONLY with valid JSON (no markdown, no code fences, no extra text) matching exactly this shape:

{
  "levelEstimate": { "topik": <integer 1-6>, "note": {"ro":"...", "en":"..."} },
  "vocabulary": [
    { "ko":"...", "romanization":"...", "ro":"...", "en":"...", "pos":"noun|verb|adjective|adverb|other", "pronunciation":"...", "category":"object|color|size|quantity|location|material|emotion|action", "confidence": <integer 0-100> }
  ],
  "grammar": [ { "pattern":"...", "explanation": {"ro":"...", "en":"..."} } ],
  "sentences": {
    "beginner":     [ {"ko":"...","ro":"...","en":"..."} ],
    "intermediate": [ {"ko":"...","ro":"...","en":"..."} ],
    "advanced":     [ {"ko":"...","ro":"...","en":"..."} ]
  },
  "quiz": [ { "question": {"ro":"...","en":"..."}, "options":["...","...","...","..."], "correctIndex": <0-3> } ],
  "fillInBlank": [ { "sentence":"... ___ ...", "answer":"...", "hint": {"ro":"...","en":"..."} } ],
  "speaking": [ {"ko":"...","ro":"...","en":"..."} ],
  "writing": [ { "prompt": {"ro":"...","en":"..."}, "example":"..." } ],
  "listening": [ { "ko":"...", "question": {"ro":"...","en":"..."}, "answer":"..." } ],
  "relatedVocabulary": [ { "ko":"...", "romanization":"...", "ro":"...", "en":"...", "pos":"noun|verb|adjective|adverb|other" } ],
  "educational": true,
  "accurate": true
}

Use 8-14 items in "vocabulary", 2-3 in "grammar", 2 per level in "sentences", exactly 5 in "quiz" and "fillInBlank", 3 in "speaking", 2 in "writing", 3 in "listening", 5-8 in "relatedVocabulary".`;
}

async function ilCallClaudeVision(apiKey) {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 6000,
      system: ilBuildSystemPrompt(),
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: ilImageMedia, data: ilImageB64 } },
          { type: 'text', text: 'Analyze this photo and generate the full Korean lesson as specified.' },
        ],
      }],
    }),
  });

  if (!resp.ok) {
    const e = new Error(`HTTP ${resp.status}`);
    e.status = resp.status;
    throw e;
  }

  const data = await resp.json();
  const raw  = data.content[0].text;
  const m    = raw.match(/\{[\s\S]*\}/);
  if (!m) throw new Error(currentLang === 'ro' ? 'Format răspuns invalid' : 'Invalid response format');
  return JSON.parse(m[0]);
}

/* ══════════════════════════════════════════════════════════════
   RANDARE REZULTATE
══════════════════════════════════════════════════════════════ */
function renderAll() {
  if (!ilLesson) return;
  renderLevel();
  renderVocab();
  renderGrammar();
  renderSentences(document.querySelector('.il-sent-tab.active')?.dataset.lvl || 'beginner');
  buildFlashcards();
  renderFlashcard();
  renderQuiz();
  renderFillBlank();
  renderSpeaking();
  renderWriting();
  renderListening();
  renderRelated();
}

function renderLevel() {
  const lvl = ilLesson.levelEstimate || {};
  const note = (lvl.note && lvl.note[currentLang]) || '';
  const topik = lvl.topik ? `TOPIK ${lvl.topik}` : '';
  document.getElementById('ilLevelNote').textContent = [topik, note].filter(Boolean).join(' — ');
}

function renderVocab() {
  const items = (ilLesson.vocabulary || []).filter(v => v.confidence === undefined || v.confidence >= 85);
  const cats  = ['all', ...Array.from(new Set(items.map(v => v.category).filter(Boolean)))];

  const filtersEl = document.getElementById('ilCatFilters');
  filtersEl.innerHTML = cats.map(c => {
    const label = c === 'all'
      ? (currentLang === 'ro' ? 'Toate' : 'All')
      : ((IL_CAT_LABELS[c] && IL_CAT_LABELS[c][currentLang]) || c);
    return `<button type="button" class="il-cat-chip${c === ilActiveCat ? ' active' : ''}" data-cat="${esc(c)}">${esc(label)}</button>`;
  }).join('');
  if (!cats.includes(ilActiveCat)) ilActiveCat = 'all';

  filtersEl.querySelectorAll('.il-cat-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      ilActiveCat = btn.dataset.cat;
      renderVocab();
    });
  });

  const shown = ilActiveCat === 'all' ? items : items.filter(v => v.category === ilActiveCat);
  document.getElementById('ilVocabGrid').innerHTML = shown.map(vocabCardHtml).join('')
    || `<p class="il-related-note">${currentLang === 'ro' ? 'Niciun element.' : 'No items.'}</p>`;
}

function vocabCardHtml(v) {
  const pos = (IL_POS_LABELS[v.pos] && IL_POS_LABELS[v.pos][currentLang]) || v.pos || '';
  const cat = (IL_CAT_LABELS[v.category] && IL_CAT_LABELS[v.category][currentLang]) || v.category || '';
  return `<div class="il-vocab-card">
    <div class="il-vocab-ko">${esc(v.ko || '')}</div>
    <div class="il-vocab-rom">${esc(v.romanization || '')}${v.pronunciation ? ' · ' + esc(v.pronunciation) : ''}</div>
    <div class="il-vocab-tr">${esc(v[currentLang] || '')}</div>
    <div class="il-vocab-meta">
      ${pos ? `<span class="il-tag pos">${esc(pos)}</span>` : ''}
      ${cat ? `<span class="il-tag">${esc(cat)}</span>` : ''}
    </div>
  </div>`;
}

function renderGrammar() {
  const items = ilLesson.grammar || [];
  document.getElementById('ilGrammarList').innerHTML = items.map(g => `
    <div class="il-grammar-item">
      <div class="il-grammar-pattern">${esc(g.pattern || '')}</div>
      <div class="il-grammar-explain">${esc((g.explanation && g.explanation[currentLang]) || '')}</div>
    </div>`).join('') || '';
}

function renderSentences(level) {
  const sentences = (ilLesson.sentences && ilLesson.sentences[level]) || [];
  document.getElementById('ilSentList').innerHTML = sentences.map((s, i) => `
    <div class="il-sent-card show">
      <button type="button" class="il-sent-play" data-ko="${escAttr(s.ko || '')}">▶</button>
      <div class="il-sent-text">
        <div class="il-sent-ko">${esc(s.ko || '')}</div>
        <div class="il-sent-tr">${esc(s[currentLang] || '')}</div>
      </div>
    </div>`).join('');

  document.getElementById('ilSentList').querySelectorAll('.il-sent-play').forEach(btn => {
    btn.addEventListener('click', () => AudioEngine.speak(btn.dataset.ko));
  });
}

function buildFlashcards() {
  ilFlashCards = (ilLesson.vocabulary || []).filter(v => v.confidence === undefined || v.confidence >= 85);
  ilFlashIndex = 0;
  ilFlashFlipped = false;
}

function renderFlashcard() {
  const wrap = document.getElementById('ilFlashWrap');
  if (!ilFlashCards.length) { wrap.innerHTML = ''; return; }
  const v = ilFlashCards[ilFlashIndex];
  wrap.innerHTML = `
    <button type="button" class="il-flash-nav" id="ilFlashPrev">‹</button>
    <div style="flex:1">
      <div class="il-flash-stage">
        <div class="il-flash-card${ilFlashFlipped ? ' flipped' : ''}" id="ilFlashCard">
          <div class="il-flash-face front">
            <div class="il-flash-ko">${esc(v.ko || '')}</div>
            <div class="il-flash-rom">${esc(v.romanization || '')}</div>
          </div>
          <div class="il-flash-face back">
            <div class="il-flash-tr">${esc(v[currentLang] || '')}</div>
            <div class="il-flash-rom">${esc((IL_POS_LABELS[v.pos] && IL_POS_LABELS[v.pos][currentLang]) || v.pos || '')}</div>
          </div>
        </div>
      </div>
      <div class="il-flash-counter">${ilFlashIndex + 1} / ${ilFlashCards.length}</div>
    </div>
    <button type="button" class="il-flash-nav" id="ilFlashNext">›</button>`;

  document.getElementById('ilFlashCard').addEventListener('click', () => {
    ilFlashFlipped = !ilFlashFlipped;
    document.getElementById('ilFlashCard').classList.toggle('flipped', ilFlashFlipped);
  });
  document.getElementById('ilFlashPrev').addEventListener('click', () => {
    ilFlashIndex = (ilFlashIndex - 1 + ilFlashCards.length) % ilFlashCards.length;
    ilFlashFlipped = false;
    renderFlashcard();
  });
  document.getElementById('ilFlashNext').addEventListener('click', () => {
    ilFlashIndex = (ilFlashIndex + 1) % ilFlashCards.length;
    ilFlashFlipped = false;
    renderFlashcard();
  });
}

function renderQuiz() {
  const items = ilLesson.quiz || [];
  document.getElementById('ilQuizList').innerHTML = items.map((q, qi) => `
    <div class="il-quiz-item">
      <div class="il-quiz-q">${esc((q.question && q.question[currentLang]) || '')}</div>
      <div class="il-quiz-opts">
        ${(q.options || []).map((opt, oi) => `<button type="button" class="il-quiz-opt" data-qi="${qi}" data-oi="${oi}">${esc(opt)}</button>`).join('')}
      </div>
    </div>`).join('');

  document.getElementById('ilQuizList').querySelectorAll('.il-quiz-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const qi = parseInt(btn.dataset.qi, 10);
      const q  = items[qi];
      const group = btn.closest('.il-quiz-opts');
      group.querySelectorAll('.il-quiz-opt').forEach((b, oi) => {
        b.disabled = true;
        if (oi === q.correctIndex) b.classList.add('correct');
        else if (b === btn) b.classList.add('wrong');
      });
    });
  });
}

function renderFillBlank() {
  const items = ilLesson.fillInBlank || [];
  document.getElementById('ilFillList').innerHTML = items.map((f, i) => `
    <div class="il-fill-item">
      <div class="il-fill-sentence">${esc(f.sentence || '')}</div>
      <div class="il-fill-row">
        <input type="text" class="il-fill-input" id="ilFillInput${i}" placeholder="${currentLang === 'ro' ? 'Răspunsul tău' : 'Your answer'}">
        <button type="button" class="il-fill-check" data-i="${i}">${currentLang === 'ro' ? 'Verifică' : 'Check'}</button>
      </div>
      <div class="il-fill-hint">${esc((f.hint && f.hint[currentLang]) || '')}</div>
    </div>`).join('');

  document.getElementById('ilFillList').querySelectorAll('.il-fill-check').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.i, 10);
      const input = document.getElementById('ilFillInput' + i);
      const ok = ilNormalizeKo(input.value) === ilNormalizeKo(items[i].answer || '');
      input.classList.remove('correct', 'wrong');
      input.classList.add(ok ? 'correct' : 'wrong');
    });
  });
}

function renderSpeaking() {
  const items = ilLesson.speaking || [];
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  document.getElementById('ilSpeakList').innerHTML = items.map((s, i) => `
    <div class="il-speak-item">
      <button type="button" class="il-sent-play" data-ko="${escAttr(s.ko || '')}">▶</button>
      <div class="il-speak-text">
        <div class="il-sent-ko">${esc(s.ko || '')}</div>
        <div class="il-sent-tr">${esc(s[currentLang] || '')}</div>
        <div class="il-speak-fb" id="ilSpeakFb${i}"></div>
      </div>
      ${SR ? `<button type="button" class="il-speak-rec" data-i="${i}" data-ko="${escAttr(s.ko || '')}">🎙</button>` : ''}
    </div>`).join('');

  document.getElementById('ilSpeakList').querySelectorAll('.il-sent-play').forEach(btn => {
    btn.addEventListener('click', () => AudioEngine.speak(btn.dataset.ko));
  });
  if (SR) {
    document.getElementById('ilSpeakList').querySelectorAll('.il-speak-rec').forEach(btn => {
      btn.addEventListener('click', () => ilStartSpeakRec(btn));
    });
  }
}

function ilStartSpeakRec(btn) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const i  = btn.dataset.i;
  const target = btn.dataset.ko;
  const fb = document.getElementById('ilSpeakFb' + i);

  const r = new SR();
  r.lang = 'ko-KR';
  r.continuous = false;
  r.interimResults = false;
  btn.classList.add('recording');
  fb.textContent = '';

  r.onresult = e => {
    const transcript = e.results[0][0].transcript;
    const ok = ilSimilar(ilNormalizeKo(transcript), ilNormalizeKo(target));
    fb.className = 'il-speak-fb ' + (ok ? 'ok' : 'no');
    fb.textContent = ok
      ? (currentLang === 'ro' ? '✓ Corect: ' : '✓ Correct: ') + transcript
      : (currentLang === 'ro' ? '✗ Încearcă din nou: ' : '✗ Try again: ') + transcript;
  };
  r.onerror = () => { fb.className = 'il-speak-fb no'; fb.textContent = currentLang === 'ro' ? 'Nu am putut recunoaște vocea.' : 'Could not recognize speech.'; };
  r.onend = () => btn.classList.remove('recording');
  r.start();
}

function ilNormalizeKo(s) {
  return (s || '').replace(/[\s.,!?~]/g, '').trim();
}

function ilSimilar(a, b) {
  if (!a || !b) return false;
  if (a === b) return true;
  const shorter = a.length < b.length ? a : b;
  const longer  = a.length < b.length ? b : a;
  let shared = 0;
  for (const ch of shorter) if (longer.includes(ch)) shared++;
  return shared / longer.length >= 0.75;
}

function renderWriting() {
  const items = ilLesson.writing || [];
  document.getElementById('ilWriteList').innerHTML = items.map((w, i) => `
    <div class="il-write-item">
      <div class="il-write-prompt">${esc((w.prompt && w.prompt[currentLang]) || '')}</div>
      <textarea class="il-write-area" id="ilWriteArea${i}" placeholder="${currentLang === 'ro' ? '여기에 한국어로 쓰세요… (scrie aici)' : '여기에 한국어로 쓰세요… (write here)'}"></textarea>
      <div class="il-write-actions">
        <button type="button" class="il-write-check" data-i="${i}">${currentLang === 'ro' ? 'Verifică cu AI' : 'Check with AI'}</button>
      </div>
      <div class="il-write-fb" id="ilWriteFb${i}"></div>
    </div>`).join('');

  document.getElementById('ilWriteList').querySelectorAll('.il-write-check').forEach(btn => {
    btn.addEventListener('click', () => ilCheckWriting(parseInt(btn.dataset.i, 10), btn));
  });
}

async function ilCheckWriting(i, btn) {
  const apiKey = localStorage.getItem('RK_CLAUDE_KEY');
  if (!apiKey) { ilShowApiModal(); return; }

  const text = document.getElementById('ilWriteArea' + i).value.trim();
  const fb   = document.getElementById('ilWriteFb' + i);
  if (!text) {
    alert(currentLang === 'ro' ? 'Scrie ceva mai întâi!' : 'Write something first!');
    return;
  }
  const w = ilLesson.writing[i];
  btn.disabled = true;
  fb.classList.remove('show');
  fb.textContent = currentLang === 'ro' ? 'Analizez…' : 'Analysing…';
  fb.classList.add('show');

  try {
    const lang = currentLang === 'ro' ? 'Romanian' : 'English';
    const system = `You are a Korean teacher. A student was given this writing prompt: "${(w.prompt && w.prompt.en) || ''}" (model example: "${w.example || ''}"). The student wrote: "${text}".
Respond ONLY with JSON: {"ok": true|false, "feedback": "<1-2 sentence feedback in ${lang}>", "corrected": "<corrected Korean sentence, empty string if already correct>"}`;

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system,
        messages: [{ role: 'user', content: text }],
      }),
    });
    if (!resp.ok) { const e = new Error(`HTTP ${resp.status}`); e.status = resp.status; throw e; }
    const data = await resp.json();
    const m = data.content[0].text.match(/\{[\s\S]*\}/);
    const result = m ? JSON.parse(m[0]) : { ok: false, feedback: '', corrected: '' };

    fb.textContent = (result.ok ? '✓ ' : '') + (result.feedback || '') + (result.corrected ? ' → ' + result.corrected : '');
  } catch (err) {
    if (err.status === 401) {
      localStorage.removeItem('RK_CLAUDE_KEY');
      ilShowApiModal();
    }
    fb.textContent = currentLang === 'ro' ? 'Eroare la verificare.' : 'Error checking answer.';
  } finally {
    btn.disabled = false;
  }
}

function renderListening() {
  const items = ilLesson.listening || [];
  document.getElementById('ilListenList').innerHTML = items.map((l, i) => `
    <div class="il-listen-item">
      <button type="button" class="il-sent-play" data-ko="${escAttr(l.ko || '')}">▶</button>
      <div class="il-listen-q">${esc((l.question && l.question[currentLang]) || '')}</div>
      <button type="button" class="il-listen-reveal-btn" data-i="${i}">${currentLang === 'ro' ? 'Arată răspunsul' : 'Show answer'}</button>
      <div class="il-listen-answer" id="ilListenAns${i}">${esc(l.answer || '')}</div>
    </div>`).join('');

  document.getElementById('ilListenList').querySelectorAll('.il-sent-play').forEach(btn => {
    btn.addEventListener('click', () => AudioEngine.speak(btn.dataset.ko));
  });
  document.getElementById('ilListenList').querySelectorAll('.il-listen-reveal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('ilListenAns' + btn.dataset.i).classList.toggle('show');
    });
  });
}

function renderRelated() {
  const items = ilLesson.relatedVocabulary || [];
  document.getElementById('ilRelatedGrid').innerHTML = items.map(vocabCardHtml).join('');
}

/* ══════════════════════════════════════════════════════════════
   MODAL CHEIE API
══════════════════════════════════════════════════════════════ */
function ilShowApiModal() {
  document.getElementById('ilApiErr').textContent = '';
  document.getElementById('ilApiKeyInput').value  = '';
  document.getElementById('ilApiModal').classList.add('open');
  setTimeout(() => document.getElementById('ilApiKeyInput').focus(), 100);
}

function ilCloseApiModal() {
  document.getElementById('ilApiModal').classList.remove('open');
}

function ilSaveApiKey() {
  const key = document.getElementById('ilApiKeyInput').value.trim();
  if (!key.startsWith('sk-ant')) {
    document.getElementById('ilApiErr').textContent = currentLang === 'ro'
      ? 'Cheie invalidă — trebuie să înceapă cu sk-ant-…'
      : 'Invalid key — must start with sk-ant-…';
    return;
  }
  localStorage.setItem('RK_CLAUDE_KEY', key);
  ilCloseApiModal();
  if (ilImageB64) ilGenerate();
}

/* ══════════════════════════════════════════════════════════════
   UTILITARE
══════════════════════════════════════════════════════════════ */
function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escAttr(s) {
  return esc(s).replace(/"/g, '&quot;');
}
