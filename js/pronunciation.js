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
  {id:13, topik:2, text:'주말에 친구를 만나요',             rom:'jumare chinguleul mannayo',               ro:'Mă întâlnesc cu un prieten în weekend',en:'I meet a friend on the weekend'},
  // TOPIK 3
  {id:11, topik:3, text:'한국어를 배우는 것이 재미있어요',  rom:'hangugeoreul baeuneun geosi jaemiisseoyo',ro:'A învăța coreeana e interesant',      en:'Learning Korean is fun'},
  {id:12, topik:3, text:'서울에서 태어났어요',              rom:'seoureseo taeeonansseoyo',                ro:'M-am născut în Seul',                 en:'I was born in Seoul'},
  {id:14, topik:3, text:'저는 매일 아침에 운동을 해요',      rom:'jeoneun maeil achime undongeul haeyo',    ro:'Fac sport în fiecare dimineață',      en:'I exercise every morning'},
  {id:15, topik:3, text:'이 영화는 정말 재미있었어요',       rom:'i yeonghwaneun jeongmal jaemiisseosseoyo',ro:'Filmul acesta a fost chiar interesant',en:'This movie was really interesting'},
  {id:16, topik:3, text:'시간이 있으면 같이 가요',           rom:'sigani isseumyeon gachi gayo',            ro:'Dacă ai timp, hai să mergem împreună',en:"If you have time, let's go together"},
  // TOPIK 4
  {id:17, topik:4, text:'저는 한국 드라마를 보면서 한국어를 배웠어요', rom:'jeoneun hanguk deuramareul bomyeonseo hangugeoreul baewosseoyo', ro:'Am învățat coreeana în timp ce mă uitam la drame coreene', en:'I learned Korean while watching Korean dramas'},
  {id:18, topik:4, text:'비가 올 것 같아서 우산을 가져왔어요', rom:'biga ol geot gataseo usaneul gajyeowasseoyo', ro:'Am adus umbrela pentru că părea că va ploua', en:'I brought an umbrella because it looked like it would rain'},
  {id:19, topik:4, text:'그 사람은 친절할 뿐만 아니라 똑똑해요', rom:'geu sarameun chinjeolhal ppunman anira ttokttokhaeyo', ro:'Persoana aceea nu doar că e amabilă, dar e și deșteaptă', en:'That person is not only kind but also smart'},
  {id:20, topik:4, text:'아무리 바빠도 운동은 꼭 해요',       rom:'amuri bappado undongeun kkok haeyo',      ro:'Oricât de ocupat(ă) aș fi, fac mereu sport', en:'No matter how busy I am, I always exercise'},
  {id:21, topik:4, text:'저는 내년에 유학을 가기로 했어요',   rom:'jeoneun naenyeone yuhageul gagiro haesseoyo', ro:'Am decis să studiez în străinătate anul viitor', en:'I decided to study abroad next year'},
  // TOPIK 5
  {id:22, topik:5, text:'환경 보호를 위해 일회용품 사용을 줄여야 합니다', rom:'hwangyeong bohoreul wihae ilhoeyongpum sayongeul jurirya hamnida', ro:'Trebuie să reducem folosirea produselor de unică folosință pentru a proteja mediul', en:'We must reduce the use of disposable products to protect the environment'},
  {id:23, topik:5, text:'경제가 어려워질수록 소비자들은 더 신중해집니다', rom:'gyeongjega eoryeowojilsurok sobijadeureun deo sinjunghaejimnida', ro:'Cu cât economia devine mai dificilă, cu atât consumatorii devin mai prudenți', en:'The harder the economy gets, the more cautious consumers become'},
  {id:24, topik:5, text:'이 문제는 개인의 노력만으로는 해결되기 어렵습니다', rom:'i munjeneun gaeinui noryeongmaneuroneun haegyeoldwegi eoryeopseumnida', ro:'Această problemă e greu de rezolvat doar prin efortul individual', en:'This problem is hard to solve through individual effort alone'},
  {id:25, topik:5, text:'정부는 새로운 정책을 도입하기로 결정했습니다', rom:'jeongbuneun saeroun jeongchaegeul doipagiro gyeoljeonghaetseumnida', ro:'Guvernul a decis să introducă o nouă politică', en:'The government decided to introduce a new policy'},
  {id:26, topik:5, text:'노력한 만큼 결과가 따라올 것입니다', rom:'noryeokhan mankeum gyeolgwaga ttarawol geosimnida', ro:'Rezultatele vor veni pe măsura efortului depus', en:'The results will follow according to the effort put in'},
  // TOPIK 6
  {id:27, topik:6, text:'세월이 흐를수록 그 시절이 더욱 그리워집니다', rom:'seworyi heureulsurok geu sijeori deouk geuriwojimnida', ro:'Cu cât trece timpul, cu atât îmi este mai dor de acea perioadă', en:'As time passes, I miss that period even more'},
  {id:28, topik:6, text:'그의 발언은 많은 논란을 불러일으켰습니다', rom:'geuui bareoneun maneun nollaneul bulleoireukyeotseumnida', ro:'Declarația lui a stârnit multă controversă', en:'His remarks sparked a lot of controversy'},
  {id:29, topik:6, text:'위기를 기회로 삼아야 합니다',       rom:'wigireul gihoero samaya hamnida',          ro:'Trebuie să transformăm criza într-o oportunitate', en:'We must turn the crisis into an opportunity'},
  {id:30, topik:6, text:'사공이 많으면 배가 산으로 간다는 말이 있습니다', rom:'sagongi manheumyeon baega saneuro gandaneun mari itseumnida', ro:'Există o zicală: dacă sunt prea mulți cârmaci, barca ajunge pe munte', en:"There's a saying: too many cooks spoil the broth"},
  {id:31, topik:6, text:'그는 어려운 환경에도 불구하고 성공을 거두었습니다', rom:'geuneun eoryeoun hwangyeongedo bulguhago seonggongeul geodueotseumnida', ro:'El a reușit în ciuda condițiilor dificile', en:'He succeeded despite difficult circumstances'}
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
    unavail:   'Recunoaștere vocală indisponibilă în browser',
    dailyTitle: 'Provocarea zilnică',
    dailySub:   'Nimerește peste 70% pentru un bonus de XP',
    dailyBadge: '🎯 Azi'
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
    unavail:   'Speech recognition not supported in this browser',
    dailyTitle: 'Daily Challenge',
    dailySub:   'Score 70%+ for a bonus XP',
    dailyBadge: '🎯 Today'
  }
};

var DAILY_THRESHOLD = 0.7;
var DAILY_XP = 15;

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

/* ── DAILY CHALLENGE ────────────────────────────────── */
function todayISO() { return new Date().toISOString().slice(0, 10); }

function loadDailyPron() {
  try { return JSON.parse(localStorage.getItem('RK_DAILY_PRON') || 'null'); }
  catch (e) { return null; }
}
function saveDailyPron(data) {
  try { localStorage.setItem('RK_DAILY_PRON', JSON.stringify(data)); } catch (e) {}
}

function pickDailySentence() {
  var epochDay = Math.floor(Date.now() / 86400000);
  return SENTENCES[epochDay % SENTENCES.length];
}

function isDailyDoneToday() {
  var rec = loadDailyPron();
  return !!(rec && rec.date === todayISO() && rec.done);
}

function onDailyChecked(score) {
  var pct = Math.round(score * 100);
  if (score >= DAILY_THRESHOLD && !isDailyDoneToday()) {
    saveDailyPron({ date: todayISO(), done: true, score: pct });
    if (window.RKGamification) RKGamification.addXPBonus(DAILY_XP);
    if (window.RKStreak) RKStreak.touch();
    updateDailyBadge();
  }
}

function updateDailyBadge() {
  var badge = document.getElementById('dailyBadge');
  if (!badge) return;
  if (isDailyDoneToday()) {
    badge.textContent = '✅ +' + DAILY_XP + ' XP';
    badge.className = 'daily-badge done';
  } else {
    badge.textContent = t('dailyBadge');
    badge.className = 'daily-badge';
  }
}

function renderDailyChallenge() {
  var wrap = document.getElementById('dailyChallenge');
  if (!wrap) return;
  wrap.innerHTML =
    '<div class="card daily-card">' +
      '<div class="daily-head">' +
        '<span class="daily-icon">🎯</span>' +
        '<div>' +
          '<div class="daily-title">' + t('dailyTitle') + '</div>' +
          '<div class="daily-sub">' + t('dailySub') + '</div>' +
        '</div>' +
        '<span class="daily-badge" id="dailyBadge"></span>' +
      '</div>' +
      '<div id="dailyCardBody"></div>' +
    '</div>';
  document.getElementById('dailyCardBody').appendChild(buildCard(pickDailySentence(), onDailyChecked));
  updateDailyBadge();
}

/* ── BUILD CARD ─────────────────────────────────────── */
function buildCard(s, onChecked) {
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
    // Only preload the Whisper fallback (~75MB from a CDN) when the browser
    // has no native SpeechRecognition — most users (Chrome/Edge/Android)
    // never need it, and fetching it unconditionally here made every
    // recording attempt pull that model over the network for them too,
    // breaking offline use for no benefit.
    if (!(window.SpeechRecognition || window.webkitSpeechRecognition)) getWhisper();
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
    if (typeof onChecked === 'function') onChecked(score);
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
  renderDailyChallenge();
  renderFilter();
  renderCards();
}

RKLang.init(applyLang);
applyLang(LANG);
