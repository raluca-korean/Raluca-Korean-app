var LANG = RKLang.get();
var FILTER = 0;

/* ── WHISPER fallback (Safari / Firefox) ────────────────── */
var _whisperPipe = null;
var _whisperLoad = null;

function getWhisper() {
  if (_whisperPipe) return Promise.resolve(_whisperPipe);
  if (_whisperLoad)  return _whisperLoad;
  _whisperLoad = import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2')
    .then(function(m) {
      return m.pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny', {quantized: true});
    })
    .then(function(pipe) { _whisperPipe = pipe; _whisperLoad = null; return pipe; })
    .catch(function(e)   { _whisperLoad = null; throw e; });
  return _whisperLoad;
}

function runWhisper(blob, onDone, onFail) {
  getWhisper()
    .then(function(pipe) {
      return blob.arrayBuffer()
        .then(function(ab) {
          var ctx = new (window.AudioContext || window.webkitAudioContext)();
          return ctx.decodeAudioData(ab);
        })
        .then(function(buf) {
          if (buf.sampleRate === 16000) return buf.getChannelData(0);
          var len = Math.round(buf.duration * 16000);
          var off = new OfflineAudioContext(1, len, 16000);
          var src = off.createBufferSource();
          src.buffer = buf; src.connect(off.destination); src.start();
          return off.startRendering().then(function(r) { return r.getChannelData(0); });
        })
        .then(function(data) { return pipe(data, {language: 'korean', task: 'transcribe'}); });
    })
    .then(function(r)  { onDone((r.text || '').trim()); })
    .catch(function(e) { onFail(e); });
}

var SENTENCES = [
  // TOPIK 1
  {id:1,  topik:1, text:'안녕하세요',                       rom:'annyeonghaseyo',                          ro:'Bună ziua',                          en:'Hello'},
  {id:2,  topik:1, text:'감사합니다',                       rom:'gamsahamnida',                            ro:'Mulțumesc',                          en:'Thank you'},
  {id:3,  topik:1, text:'죄송합니다',                       rom:'joesonghamnida',                          ro:'Îmi pare rău',                       en:"I'm sorry"},
  {id:4,  topik:1, text:'저는 학생이에요',                  rom:'jeoneun haengseonieoyo',                  ro:'Sunt student(ă)',                     en:'I am a student'},
  {id:5,  topik:1, text:'오늘 날씨가 좋아요',               rom:'oneul nalssiga joayo',                    ro:'Vremea de azi e frumoasă',            en:'The weather is nice today'},
  {id:6,  topik:1, text:'저는 한국어를 공부해요',           rom:'jeoneun hangugeoreul gongbuhaeyo',        ro:'Studiez coreeana',                    en:'I study Korean'},
  // TOPIK 2
  {id:7,  topik:2, text:'내일 회의가 있어요',               rom:'naeil hoeiga isseoyo',                    ro:'Mâine am ședință',                    en:'There is a meeting tomorrow'},
  {id:8,  topik:2, text:'한국 음식이 맛있어요',             rom:'hanguk eumsigi massseoyo',                ro:'Mâncarea coreeană e delicioasă',      en:'Korean food is delicious'},
  {id:9,  topik:2, text:'지금 어디에 가요?',               rom:'jigeum eodie gayo',                       ro:'Unde mergi acum?',                    en:'Where are you going now?'},
  {id:10, topik:2, text:'저는 서울에 살아요',               rom:'jeoneun seoure sarayo',                   ro:'Locuiesc în Seul',                    en:'I live in Seoul'},
  // TOPIK 3
  {id:11, topik:3, text:'한국어를 배우는 것이 재미있어요',  rom:'hangugeoreul baeuneun geosi jaemiisseoyo',ro:'A învăța coreeana e interesant',      en:'Learning Korean is fun'},
  {id:12, topik:3, text:'서울에서 태어났어요',              rom:'seoureseo taeeonansseoyo',                ro:'M-am născut în Seul',                 en:'I was born in Seoul'}
];

var I18N = {
  ro: {
    title:     'Speaking',
    sub:       'Pronunție · Ascultă · Înregistrează',
    all:       'Toate',
    listen:    'Ascultă',
    slow:      'Lent',
    record:    'Înregistrează',
    stop:      'Oprește',
    recording: 'Înregistrare...',
    playback:  'Redă',
    check:     'Verifică',
    shadow:    'Shadow',
    yousaid:   'Ai spus: ',
    unavail:   'Recunoaștere vocală indisponibilă în browser'
  },
  en: {
    title:     'Speaking',
    sub:       'Pronunciation · Listen · Record',
    all:       'All',
    listen:    'Listen',
    slow:      'Slow',
    record:    'Record',
    stop:      'Stop',
    recording: 'Recording...',
    playback:  'Play back',
    check:     'Check',
    shadow:    'Shadow',
    yousaid:   'You said: ',
    unavail:   'Speech recognition not supported in this browser'
  }
};

function t(k) { return I18N[LANG][k]; }

/* ── UTILS ──────────────────────────────────────────── */
function levenshtein(a, b) {
  var m = a.length, n = b.length, i, j;
  var d = [];
  for (i = 0; i <= m; i++) { d[i] = [i]; }
  for (j = 0; j <= n; j++) { d[0][j] = j; }
  for (i = 1; i <= m; i++) {
    for (j = 1; j <= n; j++) {
      d[i][j] = a[i-1] === b[j-1]
        ? d[i-1][j-1]
        : 1 + Math.min(d[i-1][j-1], d[i-1][j], d[i][j-1]);
    }
  }
  return d[m][n];
}

function calcScore(exp, recog) {
  var e = (exp   || '').replace(/\s+/g, '');
  var r = (recog || '').replace(/\s+/g, '');
  if (!r) return 0;
  return Math.max(0, 1 - levenshtein(e, r) / Math.max(e.length, r.length));
}

function scoreColor(s) {
  if (s >= 0.9) return '#58CC02';
  if (s >= 0.7) return '#FFC800';
  return '#FF4B4B';
}

function highlightText(exp, recog) {
  var e = exp.split('');
  var r = (recog || '').split('');
  return e.map(function(ch, i) {
    if (ch === ' ') return ' ';
    var ok = r[i] === ch;
    return '<span class="' + (ok ? 'ch-ok' : 'ch-err') + '">' + ch + '</span>';
  }).join('');
}

/* ── TTS ────────────────────────────────────────────── */
function playTTS(text, rate) {
  speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(text);
  u.lang = 'ko-KR';
  u.rate = rate || 1;
  speechSynthesis.speak(u);
}

/* ── BUILD CARD ─────────────────────────────────────── */
function buildCard(s) {
  var div = document.createElement('div');
  div.className = 's-card';

  var state = {
    recording:  false,
    mr:         null,
    blob:       null,
    url:        null,
    audio:      null,
    recognized: null,
    stopTimer:  null
  };

  div.innerHTML = [
    '<div class="s-badge">TOPIK ' + s.topik + '</div>',
    '<div class="s-text" title="' + t('listen') + '">' + s.text + '</div>',
    '<div class="s-rom">' + s.rom + '</div>',
    '<div class="s-meaning">' + s[LANG] + '</div>',
    '<div class="btn-row">',
      '<button class="s-btn btn-blue b-slow">🐢 ' + t('slow') + '</button>',
      '<button class="s-btn btn-red b-rec">🎙 ' + t('record') + '</button>',
      '<button class="s-btn btn-gold b-shadow">⚡ ' + t('shadow') + '</button>',
    '</div>',
    '<div class="rec-ind b-recind">',
      '<div class="rec-dot"></div>',
      '<span class="rec-label">' + t('recording') + '</span>',
    '</div>',
    '<div class="btn-row btn-row-post" style="display:none;margin-top:10px;">',
      '<button class="s-btn btn-blue b-playback">▶️ ' + t('playback') + '</button>',
      '<button class="s-btn btn-green b-check">✔️ ' + t('check') + '</button>',
    '</div>',
    '<div class="s-result">',
      '<div class="score-row">',
        '<div class="score-pct">—</div>',
        '<div class="score-bar"><div class="score-fill"></div></div>',
      '</div>',
      '<div class="recog-txt"></div>',
      '<div class="s-highlight"></div>',
    '</div>'
  ].join('');

  var btnSlow    = div.querySelector('.b-slow');
  var btnRec     = div.querySelector('.b-rec');
  var btnShadow  = div.querySelector('.b-shadow');
  var recInd     = div.querySelector('.b-recind');
  var postRow    = div.querySelector('.btn-row-post');
  var btnPlayback= div.querySelector('.b-playback');
  var btnCheck   = div.querySelector('.b-check');
  var resDiv     = div.querySelector('.s-result');
  var scorePct   = div.querySelector('.score-pct');
  var scoreFill  = div.querySelector('.score-fill');
  var recogTxt   = div.querySelector('.recog-txt');
  var highlight  = div.querySelector('.s-highlight');

  /* TTS */
  div.querySelector('.s-text').onclick = function() { playTTS(s.text, 1); };
  btnSlow.onclick   = function() { playTTS(s.text, 0.6); };

  function stopRec() {
    if (state.recording && state.mr) state.mr.stop();
  }

  /* Start recording */
  function startRec() {
    if (state.recording) { stopRec(); return; }
    getWhisper(); /* preîncarcă modelul în fundal */
    navigator.mediaDevices.getUserMedia({audio: true}).then(function(stream) {
      var chunks = [];
      var mt = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus'
             : MediaRecorder.isTypeSupported('audio/mp4')              ? 'audio/mp4'
             : '';
      state.mr = new MediaRecorder(stream, mt ? {mimeType: mt} : {});
      state.mr.ondataavailable = function(e) { if (e.data.size > 0) chunks.push(e.data); };
      state.mr.onstop = function() {
        var mimeType = (chunks[0] && chunks[0].type) ? chunks[0].type : 'audio/webm';
        state.blob = new Blob(chunks, {type: mimeType});
        if (state.url) URL.revokeObjectURL(state.url);
        state.url = URL.createObjectURL(state.blob);
        stream.getTracks().forEach(function(tr) { tr.stop(); });
        state.recording = false;
        clearTimeout(state.stopTimer);
        recInd.classList.remove('on');
        btnRec.innerHTML = '🎙 ' + t('record');
        btnRec.className = 's-btn btn-red b-rec';
        postRow.style.display = 'flex';
      };
      state.mr.start();
      state.recording = true;
      recInd.classList.add('on');
      btnRec.innerHTML = '⏹ ' + t('stop');
      btnRec.className = 's-btn btn-grey b-rec';

      /* Run SpeechRecognition in parallel for scoring */
      var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SR) {
        var recog = new SR();
        recog.lang = 'ko-KR';
        recog.interimResults = false;
        recog.onresult = function(e) {
          state.recognized = e.results[0][0].transcript;
        };
        try { recog.start(); } catch(err) { /* ignore if mic already in use */ }
      }

      /* Auto-stop after 6 s */
      state.stopTimer = setTimeout(function() {
        if (state.recording && state.mr) state.mr.stop();
      }, 6000);

    }).catch(function() {
      alert(LANG === 'ro' ? 'Acces la microfon necesar' : 'Microphone access required');
    });
  }

  btnRec.onclick = function() {
    if (state.recording) { stopRec(); } else { startRec(); }
  };
  recInd.onclick = stopRec;

  /* Playback */
  btnPlayback.onclick = function() {
    if (!state.url) return;
    if (state.audio) { state.audio.pause(); state.audio.currentTime = 0; }
    state.audio = new Audio(state.url);
    state.audio.play().catch(function() {
      alert(LANG === 'ro' ? 'Redarea a eșuat. Încearcă din nou.' : 'Playback failed. Try again.');
    });
  };

  /* Check */
  function showScore() {
    var score = calcScore(s.text, state.recognized);
    var pct   = Math.round(score * 100);
    var color = scoreColor(score);
    scorePct.textContent  = pct + '%';
    scorePct.style.color  = color;
    scoreFill.style.width = pct + '%';
    scoreFill.style.background = color;
    if (state.recognized) {
      recogTxt.textContent = t('yousaid') + state.recognized;
      highlight.innerHTML  = highlightText(s.text, state.recognized);
    } else {
      recogTxt.textContent = t('unavail');
      highlight.innerHTML  = '';
    }
    resDiv.classList.add('on');
  }

  btnCheck.onclick = function() {
    if (!state.recognized && state.blob) {
      var isLoaded = !!_whisperPipe;
      scorePct.textContent = '...';
      recogTxt.textContent = isLoaded
        ? (LANG === 'ro' ? 'Se procesează...' : 'Processing...')
        : (LANG === 'ro' ? 'Se încarcă modelul (~75MB, o singură dată)...' : 'Loading model (~75MB, once)...');
      highlight.innerHTML = '';
      resDiv.classList.add('on');
      btnCheck.disabled = true;
      runWhisper(state.blob, function(text) {
        state.recognized = text;
        btnCheck.disabled = false;
        showScore();
      }, function() {
        btnCheck.disabled = false;
        recogTxt.textContent = t('unavail');
      });
      return;
    }
    showScore();
  };

  /* Shadow: TTS slow → auto-record after audio ends */
  btnShadow.onclick = function() {
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(s.text);
    u.lang = 'ko-KR';
    u.rate = 0.7;
    u.onend = function() {
      setTimeout(function() {
        if (!state.recording) startRec();
      }, 400);
    };
    speechSynthesis.speak(u);
  };

  return div;
}

/* ── RENDER ─────────────────────────────────────────── */
function renderFilter() {
  var row = document.getElementById('filterRow');
  row.innerHTML = '';
  var levels = [0, 1, 2, 3];
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
  var data = FILTER === 0
    ? SENTENCES
    : SENTENCES.filter(function(s) { return s.topik === FILTER; });
  list.innerHTML = '';
  data.forEach(function(s) { list.appendChild(buildCard(s)); });
}

function applyLang(lang) {
  LANG = lang;
  document.documentElement.lang = lang;
  document.getElementById('pageTitle').textContent = t('title');
  document.getElementById('pageSub').textContent   = t('sub');
  renderFilter();
  renderCards();
}

RKLang.init(applyLang);
applyLang(LANG);
