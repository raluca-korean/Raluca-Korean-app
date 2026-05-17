const pageTitleEl = document.getElementById("pageTitle");
const pageSubtitleEl = document.getElementById("pageSubtitle");
const langBtn = document.getElementById("langBtn");

const typeSelect = document.getElementById("type");
const levelBtnsEl = document.getElementById("levelBtns");
const questionEl = document.getElementById("question");
const helperEl = document.getElementById("helper");
const badgeEl = document.getElementById("badge");
const answersEl = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");
const checkBtn = document.getElementById("check");
const nextBtn = document.getElementById("next");

const bCorrect = document.getElementById("bCorrect");
const bTotal = document.getElementById("bTotal");
const bStreak = document.getElementById("bStreak");
const meterFill = document.getElementById("meterFill");
const wrongBtn = document.getElementById("wrongBtn");

const lessonParam = new URLSearchParams(window.location.search).get("lesson");

let currentLang = RKLang.get();
let currentLevel = localStorage.getItem("RK_LEVEL") || "1";
if(currentLevel === "0") currentLevel = "test";
let allExercises = { "ko-ro": [], "ro-ko": [], "particle": [], "particlePlus": [], "conjug": [], "puzzle": [], "chain": [] };
let currentList = [];
let currentIndex = 0;
let selectedAnswer = null;
let answered = false;

let puzzleLine = [];
let puzzleBank = [];

let total = 0;
let correct = 0;
let streak = 0;

let wrongsByType = {};
let wrongModeItems = [];
let isWrongMode = false;

// ── DRILL DATA ──────────────────────────────────────────────────────────
const DRILL_VERBS = [
  {ko:'가다',     ro:'a merge',       en:'to go'},
  {ko:'오다',     ro:'a veni',        en:'to come'},
  {ko:'먹다',     ro:'a mânca',       en:'to eat'},
  {ko:'마시다',   ro:'a bea',         en:'to drink'},
  {ko:'공부하다', ro:'a studia',      en:'to study'},
  {ko:'자다',     ro:'a dormi',       en:'to sleep'},
  {ko:'읽다',     ro:'a citi',        en:'to read'},
  {ko:'쓰다',     ro:'a scrie',       en:'to write'},
  {ko:'보다',     ro:'a vedea',       en:'to see'},
  {ko:'듣다',     ro:'a asculta',     en:'to listen'},
  {ko:'말하다',   ro:'a vorbi',       en:'to speak'},
  {ko:'만나다',   ro:'a întâlni',     en:'to meet'},
  {ko:'쉬다',     ro:'a se odihni',   en:'to rest'},
  {ko:'운동하다', ro:'a face sport',  en:'to exercise'},
  {ko:'사다',     ro:'a cumpăra',     en:'to buy'},
  {ko:'주다',     ro:'a da',          en:'to give'},
];

const DRILL_EXT = [
  {s1_ko:'밥을 먹어요', s1_ro:'Mănânc.',       s1_en:'I eat.',
   s2_ko:'물을 마셔요', s2_ro:'Beau apă.',      s2_en:'I drink water.',
   conn:'-고', conn_ro:'și (secvențial)', conn_en:'and (then)',
   correct:'밥을 먹고 물을 마셔요',
   wrongs:['밥을 먹어서 물을 마셔요','물을 마시고 밥을 먹어요','밥을 먹지만 물을 마셔요']},
  {s1_ko:'공부해요',    s1_ro:'Studiez.',        s1_en:'I study.',
   s2_ko:'쉬어요',      s2_ro:'Mă odihnesc.',   s2_en:'I rest.',
   conn:'-고', conn_ro:'și (secvențial)', conn_en:'and (then)',
   correct:'공부하고 쉬어요',
   wrongs:['공부해서 쉬어요','쉬고 공부해요','공부하지만 쉬어요']},
  {s1_ko:'책을 읽어요', s1_ro:'Citesc o carte.', s1_en:'I read a book.',
   s2_ko:'자요',        s2_ro:'Dorm.',           s2_en:'I sleep.',
   conn:'-고', conn_ro:'și (secvențial)', conn_en:'and (then)',
   correct:'책을 읽고 자요',
   wrongs:['책을 읽어서 자요','자고 책을 읽어요','책을 읽지만 자요']},
  {s1_ko:'운동해요',    s1_ro:'Fac sport.',      s1_en:'I exercise.',
   s2_ko:'물을 마셔요', s2_ro:'Beau apă.',      s2_en:'I drink water.',
   conn:'-고', conn_ro:'și (secvențial)', conn_en:'and (then)',
   correct:'운동하고 물을 마셔요',
   wrongs:['운동해서 물을 마셔요','물을 마시고 운동해요','운동하지만 물을 마셔요']},
  {s1_ko:'음악을 들어요', s1_ro:'Ascult muzică.',  s1_en:'I listen to music.',
   s2_ko:'공부해요',      s2_ro:'Studiez.',        s2_en:'I study.',
   conn:'-고', conn_ro:'și (secvențial)', conn_en:'and (then)',
   correct:'음악을 듣고 공부해요',
   wrongs:['음악을 들어서 공부해요','공부하고 음악을 들어요','음악을 듣지만 공부해요']},
  {s1_ko:'학교에 가요', s1_ro:'Merg la școală.',  s1_en:'I go to school.',
   s2_ko:'공부해요',    s2_ro:'Studiez.',          s2_en:'I study.',
   conn:'-아/어서', conn_ro:'deci (cauzal)', conn_en:'so (causal)',
   correct:'학교에 가서 공부해요',
   wrongs:['학교에 가고 공부해요','공부해서 학교에 가요','학교에 가지만 공부해요']},
  {s1_ko:'카페에 가요',   s1_ro:'Merg la cafenea.', s1_en:'I go to the café.',
   s2_ko:'커피를 마셔요', s2_ro:'Beau cafea.',       s2_en:'I drink coffee.',
   conn:'-아/어서', conn_ro:'deci (cauzal)', conn_en:'so (causal)',
   correct:'카페에 가서 커피를 마셔요',
   wrongs:['카페에 가고 커피를 마셔요','커피를 마셔서 카페에 가요','카페에 가지만 커피를 마셔요']},
  {s1_ko:'책을 사요',  s1_ro:'Cumpăr cartea.',   s1_en:'I buy the book.',
   s2_ko:'읽어요',     s2_ro:'Citesc.',           s2_en:'I read it.',
   conn:'-아/어서', conn_ro:'deci (cauzal)', conn_en:'so (causal)',
   correct:'책을 사서 읽어요',
   wrongs:['책을 사고 읽어요','읽어서 책을 사요','책을 사지만 읽어요']},
  {s1_ko:'음악을 들어요', s1_ro:'Ascult muzică.',  s1_en:'I listen to music.',
   s2_ko:'공부해요',      s2_ro:'Studiez.',        s2_en:'I study.',
   conn:'-지만', conn_ro:'dar (contrast)', conn_en:'but (contrast)',
   correct:'음악을 듣지만 공부해요',
   wrongs:['음악을 들어서 공부해요','음악을 듣고 공부해요','공부하지만 음악을 들어요']},
  {s1_ko:'말해요',     s1_ro:'Vorbesc.',           s1_en:'I speak.',
   s2_ko:'잘 들어요', s2_ro:'Ascult atent.',       s2_en:'I listen carefully.',
   conn:'-지만', conn_ro:'dar (contrast)', conn_en:'but (contrast)',
   correct:'말하지만 잘 들어요',
   wrongs:['말해서 잘 들어요','말하고 잘 들어요','잘 들어서 말해요']},
];

let drillConjQueue = [];
let drillExtQueue  = [];

const DRILL_TENSE_LABELS = {
  pres: {ro:'PREZENT', en:'PRESENT'},
  past: {ro:'TRECUT',  en:'PAST'},
  fut:  {ro:'VIITOR',  en:'FUTURE'},
};

function buildDrillConjQueue(){
  const q = [];
  DRILL_VERBS.forEach(v => ['pres','past','fut'].forEach(t => q.push({verb:v, tense:t})));
  return shuffle(q);
}

function drillGetForm(verbKo, tense){
  const c = window.Conjugation;
  if(!c) return verbKo;
  if(tense === 'pres') return c.present(verbKo);
  if(tense === 'past') return c.past(verbKo);
  return c.future(verbKo);
}

function buildDrillConjOptions(verbKo, tense){
  const correct = drillGetForm(verbKo, tense);
  const other1  = drillGetForm(verbKo, tense==='pres'?'past':tense==='past'?'fut':'pres');
  const other2  = drillGetForm(verbKo, tense==='pres'?'fut':tense==='past'?'pres':'past');
  const pool = [correct, other1, other2];
  const others = shuffle(DRILL_VERBS.filter(v => v.ko !== verbKo));
  for(let i = 0; i < others.length && pool.length < 4; i++){
    const f = drillGetForm(others[i].ko, tense);
    if(!pool.includes(f)) pool.push(f);
  }
  return {correct, options: shuffle(pool.slice(0, 4))};
}

const UI_TEXT = {
  ro: {
    title: "Exerciții TOPIK",
    subtitle: "Quiz bilingv • Lecții TOPIK • Română / English",
    correct: "Corecte",
    total: "Total",
    streak: "Streak",
    chooseAnswer: "Alege un răspuns.",
    chooseCorrectTranslation: "Alege traducerea corectă.",
    chooseCorrectKorean: "Alege propoziția coreeană corectă.",
    chooseParticle: "Alege particula corectă.",
    chooseParticlePlus: "Alege perechea corectă de particule.",
    chooseConjug: "Alege forma corectă de conjugare.",
    arrangeTiles: "Aranjează cuvintele în ordinea corectă.",
    placeTiles: "Plasează cel puțin un cuvânt în linie.",
    hint: "Indiciu",
    modeParticle: "Particulă (1)",
    modeParticlePlus: "Particule multiple",
    modeConjug: "Conjugare",
    modePuzzle: "Puzzle",
    modeChain: "Chain",
    arrangeChain: "Aranjează replicile în ordinea corectă.",
    placeChain: "Plasează cel puțin o replică în linie.",
    correctAnswer: "✅ Corect",
    wrongAnswer: "❌ Greșit",
    answerFirst: "Alege mai întâi un răspuns.",
    noExercises: "Nu există exerciții pentru acest mod.",
    noLessonExercises: "Nu există exerciții pentru această lecție.",
    noVocabType: "Modul VOCAB e disponibil doar pentru KO→RO și RO→KO.",
    next: "Următorul",
    check: "Verifică",
    wrongModeBtn: "Greșeli",
    wrongModeLabel: "Mod Greșeli",
    topik: "TOPIK",
    lesson: "Lecția",
    modeKoRo: "KO → RO / EN",
    modeRoKo: "RO / EN → KO",
    loadError: "Nu am putut încărca exercises.json",
    labelType: "Tip exercițiu",
    labelLevel: "Nivel TOPIK",
    allLevels: "Toate nivelele",
    modeDrillConjug: "🔤 Drill Conjugare",
    modeDrillExt: "🔗 Drill Extindere",
    chooseDrillConjug: "Alege forma conjugată:",
    chooseDrillExt: "Combină propozițiile cu conectorul:",
  },
  en: {
    title: "TOPIK Exercises",
    subtitle: "Bilingual quiz • TOPIK lessons • Romanian / English",
    correct: "Correct",
    total: "Total",
    streak: "Streak",
    chooseAnswer: "Choose an answer.",
    chooseCorrectTranslation: "Choose the correct translation.",
    chooseCorrectKorean: "Choose the correct Korean sentence.",
    chooseParticle: "Choose the correct particle.",
    chooseParticlePlus: "Choose the correct pair of particles.",
    chooseConjug: "Choose the correct conjugated form.",
    arrangeTiles: "Arrange the words in the correct order.",
    placeTiles: "Place at least one word in the line.",
    hint: "Hint",
    modeParticle: "Particle (1)",
    modeParticlePlus: "Multiple particles",
    modeConjug: "Conjugation",
    modePuzzle: "Puzzle",
    modeChain: "Chain",
    arrangeChain: "Arrange the lines in the correct order.",
    placeChain: "Place at least one line in the dialogue.",
    correctAnswer: "✅ Correct",
    wrongAnswer: "❌ Wrong",
    answerFirst: "Choose an answer first.",
    noExercises: "No exercises available for this mode.",
    noLessonExercises: "No exercises available for this lesson.",
    noVocabType: "VOCAB mode is only available for KO→RO and RO→KO.",
    next: "Next",
    check: "Check",
    topik: "TOPIK",
    lesson: "Lesson",
    modeKoRo: "KO → RO / EN",
    modeRoKo: "RO / EN → KO",
    loadError: "Could not load exercises.json",
    labelType: "Exercise type",
    labelLevel: "TOPIK Level",
    allLevels: "All levels",
    wrongModeBtn: "Mistakes",
    wrongModeLabel: "Mistakes Mode",
    modeDrillConjug: "🔤 Drill Conjugation",
    modeDrillExt: "🔗 Drill Extension",
    chooseDrillConjug: "Choose the conjugated form:",
    chooseDrillExt: "Combine the sentences using the connector:",
  }
};

function t(key){
  return UI_TEXT[currentLang][key];
}

function updateLevelButtons(){
  const activeStyle = "linear-gradient(135deg,#db2777,#7c3aed)";
  const inactiveStyle = "linear-gradient(160deg,#fff,#fdf4ff)";
  const activeShadow = "0 8px 20px rgba(219,39,119,.28)";
  const inactiveShadow = "0 4px 12px rgba(219,39,119,.10)";

  levelBtnsEl.querySelectorAll("button[data-level]").forEach(btn => {
    const isActive = btn.dataset.level === currentLevel;
    btn.style.background = isActive ? activeStyle : inactiveStyle;
    btn.style.color = isActive ? "#fff" : "var(--text)";
    btn.style.boxShadow = isActive ? activeShadow : inactiveShadow;
  });
}


function modeLabel(type){
  if(type === "ko-ro")        return t("modeKoRo");
  if(type === "particle")     return t("modeParticle");
  if(type === "particlePlus") return t("modeParticlePlus");
  if(type === "conjug")       return t("modeConjug");
  if(type === "puzzle")       return t("modePuzzle");
  if(type === "chain")        return t("modeChain");
  if(type === "drill-conjug") return t("modeDrillConjug");
  if(type === "drill-ext")    return t("modeDrillExt");
  return t("modeRoKo");
}

function updateStaticTexts(){
  pageTitleEl.textContent = t("title");
  pageSubtitleEl.textContent = t("subtitle");
  checkBtn.textContent = t("check");
  nextBtn.textContent = t("next");

  const labelType = document.getElementById("labelType");
  if(labelType) labelType.textContent = t("labelType");

  const labelLevel = document.getElementById("labelLevel");
  if(labelLevel) labelLevel.textContent = t("labelLevel");

  const optionKoRo       = typeSelect.querySelector('option[value="ko-ro"]');
  const optionRoKo       = typeSelect.querySelector('option[value="ro-ko"]');
  const optionParticle   = typeSelect.querySelector('option[value="particle"]');
  const optionParticlePl = typeSelect.querySelector('option[value="particlePlus"]');
  const optionConjug     = typeSelect.querySelector('option[value="conjug"]');
  const optionPuzzle     = typeSelect.querySelector('option[value="puzzle"]');
  const optionChain      = typeSelect.querySelector('option[value="chain"]');

  if(optionKoRo)       optionKoRo.textContent       = t("modeKoRo");
  if(optionRoKo)       optionRoKo.textContent       = t("modeRoKo");
  if(optionParticle)   optionParticle.textContent   = t("modeParticle");
  if(optionParticlePl) optionParticlePl.textContent = t("modeParticlePlus");
  if(optionConjug)     optionConjug.textContent     = t("modeConjug");
  if(optionPuzzle)     optionPuzzle.textContent     = t("modePuzzle");
  if(optionChain)      optionChain.textContent      = t("modeChain");
  const optDrillConjug = typeSelect.querySelector('option[value="drill-conjug"]');
  const optDrillExt    = typeSelect.querySelector('option[value="drill-ext"]');
  if(optDrillConjug) optDrillConjug.textContent = t("modeDrillConjug");
  if(optDrillExt)    optDrillExt.textContent    = t("modeDrillExt");
}

function updateBadges(){
  if(bCorrect) bCorrect.querySelector("span:last-child").textContent = `${t("correct")}: ${correct}`;
  if(bTotal) bTotal.querySelector("span:last-child").textContent = `${t("total")}: ${total}`;
  if(bStreak) bStreak.querySelector("span:last-child").textContent = `${t("streak")}: ${streak}`;

  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);
  if(meterFill) meterFill.style.width = percent + "%";
}

function saveStats(isCorrect, type){
  const today = new Date().toISOString().slice(0, 10);
  let s;
  try { s = JSON.parse(localStorage.getItem("RK_STATS") || "null"); } catch(e){ s = null; }
  if(!s) s = { total:0, correct:0, bestStreak:0, today, todayTotal:0, todayCorrect:0, byType:{} };
  if(s.today !== today){ s.today = today; s.todayTotal = 0; s.todayCorrect = 0; }
  s.total++;
  s.todayTotal++;
  if(isCorrect){ s.correct++; s.todayCorrect++; }
  if(streak > s.bestStreak) s.bestStreak = streak;
  if(!s.byType[type]) s.byType[type] = { total:0, correct:0 };
  s.byType[type].total++;
  if(isCorrect) s.byType[type].correct++;
  localStorage.setItem("RK_STATS", JSON.stringify(s));
}

function trackWrong(item){
  const type = typeSelect.value;
  if(!wrongsByType[type]) wrongsByType[type] = [];
  if(!wrongsByType[type].includes(item)) wrongsByType[type].push(item);
}

function updateWrongBtn(){
  const isDrill = typeSelect.value.startsWith('drill-');
  if(isDrill){ wrongBtn.style.display = 'none'; return; }
  const count = (wrongsByType[typeSelect.value] || []).length;
  wrongBtn.style.display = (count > 0 && !isWrongMode) ? "" : "none";
  wrongBtn.textContent = `❌ ${t("wrongModeBtn")} (${count})`;
}

function enterWrongMode(){
  const wrongs = wrongsByType[typeSelect.value] || [];
  if(wrongs.length === 0) return;
  wrongModeItems = [...wrongs];
  wrongsByType[typeSelect.value] = [];
  isWrongMode = true;
  currentIndex = 0;
  total = 0; correct = 0; streak = 0;
  render();
  updateWrongBtn();
}

function exitWrongMode(){
  isWrongMode = false;
  wrongModeItems = [];
  currentIndex = 0;
}

function setLanguage(lang){
  currentLang = lang;
  updateStaticTexts();
  updateBadges();
  render();
}


function shuffle(array){
  return [...array].sort(() => Math.random() - 0.5);
}

async function loadExercises(){
  questionEl.innerHTML = `<div class="rk-spinner">${currentLang==="ro"?"Se încarcă exercițiile…":"Loading exercises…"}</div>`;
  answersEl.innerHTML = "";
  feedbackEl.textContent = "";

  try {
    const response = await fetch("./data/exercises.json");
    const data = await response.json();

    allExercises = {
      "ko-ro": Array.isArray(data["ko-ro"]) ? data["ko-ro"] : [],
      "ro-ko": Array.isArray(data["ro-ko"]) ? data["ro-ko"] : [],
      "particle": Array.isArray(data["particle"]) ? data["particle"] : [],
      "particlePlus": Array.isArray(data["particlePlus"]) ? data["particlePlus"] : [],
      "conjug": Array.isArray(data["conjug"]) ? data["conjug"] : [],
      "puzzle": Array.isArray(data["puzzle"]) ? data["puzzle"] : [],
      "chain": Array.isArray(data["chain"]) ? data["chain"] : []
    };

    render();
  } catch (error) {
    console.error("Exercises load error:", error);
    questionEl.textContent = t("loadError");
    helperEl.textContent = "";
    answersEl.innerHTML = "";
    feedbackEl.textContent = "";
  }
}

function getFilteredList(){
  if(isWrongMode) return wrongModeItems;
  const type = typeSelect.value;
  if(type === 'drill-conjug'){
    if(!drillConjQueue.length) drillConjQueue = buildDrillConjQueue();
    return drillConjQueue;
  }
  if(type === 'drill-ext'){
    if(!drillExtQueue.length) drillExtQueue = shuffle([...DRILL_EXT]);
    return drillExtQueue;
  }
  let list = allExercises[type] || [];
  if(lessonParam){
    list = list.filter(item => item.lessonId === lessonParam);
  } else if(currentLevel !== "test"){
    list = list.filter(item => String(item.topik) === currentLevel);
  }
  const unlearned = shuffle(list.filter(item => !isLearnedEx(type, item)));
  const learned   = shuffle(list.filter(item =>  isLearnedEx(type, item)));
  return [...unlearned, ...learned];
}

function renderInfoBadge(item){
  const parts = [];

  if(item.lessonId){
    parts.push(`
      <span style="padding:6px 10px;border-radius:999px;background:rgba(59,130,246,.10);border:1px solid rgba(59,130,246,.20);font-weight:900">
        ${t("lesson")}: ${item.lessonId}
      </span>
    `);
  }

  parts.push(`
    <span style="padding:6px 10px;border-radius:999px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.20);font-weight:900">
      #${currentIndex + 1}/${currentList.length}
    </span>
  `);

  badgeEl.innerHTML = parts.join("");
}

function cleanConjugPrompt(prompt){
  const arrow = prompt.indexOf('→');
  if(arrow === -1) return prompt;
  const verb = prompt.slice(0, arrow + 1).trim();
  const desc = prompt.slice(arrow + 1).trim();
  // dacă descrierea conține caractere coreene, extrage doar sensul din paranteze
  if(/[가-힣ㄱ-ㆎ]/.test(desc)){
    const matches = [...desc.matchAll(/\(([^)]+)\)/g)];
    if(matches.length) return verb + ' ' + matches[matches.length - 1][1];
  }
  return prompt;
}

function render(){
  selectedAnswer = null;
  answered = false;
  document.getElementById("answers").classList.remove("done");
  feedbackEl.textContent = "";
  answersEl.innerHTML = "";
  answersEl.style.display = "";
  document.getElementById("puzzleUI").style.display = "none";
  const lb = document.getElementById("learnBtn");
  if(lb) lb.style.display = "none";

  currentList = getFilteredList();

  if(currentList.length === 0){
    questionEl.textContent = lessonParam ? t("noLessonExercises") : t("noExercises");
    helperEl.textContent = "";
    badgeEl.innerHTML = "";
    answersEl.innerHTML = "";
    return;
  }

  if(currentIndex >= currentList.length){
    currentIndex = 0;
  }

  const item = currentList[currentIndex];
  renderInfoBadge(item);

  let questionText = "";
  let helperText = "";
  let options = [];

  if(typeSelect.value === "drill-conjug"){
    const q = item;
    const data = buildDrillConjOptions(q.verb.ko, q.tense);
    const tLabel = DRILL_TENSE_LABELS[q.tense][currentLang];
    questionEl.innerHTML =
      `<span style="font-size:1.05em;font-weight:900">${q.verb.ko}</span>` +
      `<br><span style="font-size:.62em;color:var(--muted);font-weight:600">${q.verb[currentLang]}</span>` +
      `<br><span class="tenseTag ${q.tense}">${tLabel}</span>`;
    helperEl.textContent = t("chooseDrillConjug");
    document.getElementById("drillContext").style.display = "none";
    data.options.forEach(opt => {
      const el = document.createElement("div");
      el.className = "answer";
      el.textContent = opt;
      el.addEventListener("click", () => {
        if(answered) return;
        document.querySelectorAll("#answers .answer").forEach(n => n.classList.remove("selected"));
        el.classList.add("selected");
        selectedAnswer = opt;
      });
      answersEl.appendChild(el);
    });
    updateBadges();
    return;
  }

  if(typeSelect.value === "drill-ext"){
    const ex = item;
    const extOpts = shuffle([ex.correct, ...ex.wrongs]);
    questionEl.textContent = t("chooseDrillExt");
    helperEl.textContent = "";
    document.getElementById("drillContext").style.display = "";
    document.getElementById("drillContext").innerHTML =
      `<div class="drill-sent-pair">` +
        `<div class="drill-sent-box"><div class="drill-sent-ko">${ex.s1_ko}</div><div class="drill-sent-tr">${ex['s1_'+currentLang]}</div></div>` +
        `<div class="drill-sent-box"><div class="drill-sent-ko">${ex.s2_ko}</div><div class="drill-sent-tr">${ex['s2_'+currentLang]}</div></div>` +
      `</div>` +
      `<span class="drill-conn-tag">${ex.conn} — ${ex['conn_'+currentLang]}</span>`;
    extOpts.forEach(opt => {
      const el = document.createElement("div");
      el.className = "answer";
      el.textContent = opt;
      el.addEventListener("click", () => {
        if(answered) return;
        document.querySelectorAll("#answers .answer").forEach(n => n.classList.remove("selected"));
        el.classList.add("selected");
        selectedAnswer = opt;
      });
      answersEl.appendChild(el);
    });
    updateBadges();
    return;
  }

  document.getElementById("drillContext").style.display = "none";

  if(typeSelect.value === "ko-ro"){
    questionText = item.q;
    helperText = t("chooseCorrectTranslation");
    options = shuffle(item.answers[currentLang] || []);
  } else if(typeSelect.value === "particle"){
    questionText = item.template.replace("___", "【 ___ 】");
    helperText = t("chooseParticle");
    options = shuffle(item.options || []);
  } else if(typeSelect.value === "particlePlus"){
    let n = 0;
    questionText = item.template.replace(/___/g, () => `【${++n}】`);
    helperText = t("chooseParticlePlus");
    options = shuffle((item.options || []).map(opt => Array.isArray(opt) ? opt.join(" · ") : opt));
  } else if(typeSelect.value === "conjug"){
    questionText = cleanConjugPrompt(item.prompt[currentLang]);
    helperText = t("chooseConjug");
    options = shuffle(item.options || []);
  } else if(typeSelect.value === "puzzle"){
    answersEl.style.display = "none";
    document.getElementById("puzzleUI").style.display = "";
    questionEl.textContent = item.hint ? item.hint[currentLang] : "";
    helperEl.textContent = t("arrangeTiles");
    puzzleLine = [];
    puzzleBank = shuffle([...item.tiles]);
    renderPuzzleUI();
    updateBadges();
    return;
  } else if(typeSelect.value === "chain"){
    answersEl.style.display = "none";
    document.getElementById("puzzleUI").style.display = "";
    questionEl.textContent = item.context ? item.context[currentLang] : "";
    helperEl.textContent = t("arrangeChain");
    puzzleLine = [];
    puzzleBank = shuffle([...item.tiles]);
    renderPuzzleUI();
    updateBadges();
    return;
  } else {
    questionText = item.prompt[currentLang];
    helperText = t("chooseCorrectKorean");
    options = shuffle(item.options || []);
  }

  if(/[가-힣]/.test(questionText)){
    questionEl.innerHTML = GrammarColor.colorize(questionText);
  } else {
    questionEl.textContent = questionText;
  }
  helperEl.textContent = helperText;

  if(typeSelect.value === "ko-ro" || typeSelect.value === "particle" || typeSelect.value === "particlePlus"){
    speakKorean(questionText);
  }

  options.forEach(option => {
    const el = document.createElement("div");
    el.className = "answer";
    if(/[가-힣]/.test(option)){
      el.innerHTML = GrammarColor.colorize(option);
    } else {
      el.textContent = option;
    }

    el.addEventListener("click", () => {
      if(answered) return;

      document.querySelectorAll("#answers .answer").forEach(node => {
        node.classList.remove("selected");
      });

      el.classList.add("selected");
      selectedAnswer = option;
    });

    answersEl.appendChild(el);
  });

  updateBadges();
}

function renderPuzzleUI(){
  const bankEl = document.getElementById("bank");
  const lineEl = document.getElementById("line");
  bankEl.innerHTML = "";
  lineEl.innerHTML = "";

  puzzleBank.forEach((tile, idx) => {
    const el = document.createElement("div");
    el.className = "chip";
    el.innerHTML = GrammarColor.colorize(tile);
    el.addEventListener("click", () => {
      if(answered) return;
      puzzleBank.splice(idx, 1);
      puzzleLine.push(tile);
      renderPuzzleUI();
    });
    bankEl.appendChild(el);
  });

  puzzleLine.forEach((tile, idx) => {
    const el = document.createElement("div");
    el.className = "chip";
    el.innerHTML = GrammarColor.colorize(tile);
    el.addEventListener("click", () => {
      if(answered) return;
      puzzleLine.splice(idx, 1);
      puzzleBank.push(tile);
      renderPuzzleUI();
    });
    lineEl.appendChild(el);
  });
}

function getCorrectAnswer(item){
  if(typeSelect.value === "ko-ro")        return item.correct[currentLang];
  if(typeSelect.value === "particlePlus") return Array.isArray(item.correct) ? item.correct.join(" · ") : item.correct;
  if(typeSelect.value === "drill-conjug") return drillGetForm(item.verb.ko, item.tense);
  if(typeSelect.value === "drill-ext")    return item.correct;
  return item.correct;
}

function checkCurrentAnswer(){
  if(answered) return;

  if(typeSelect.value === "puzzle" || typeSelect.value === "chain"){
    const emptyMsg = typeSelect.value === "chain" ? t("placeChain") : t("placeTiles");
    if(puzzleLine.length === 0){
      feedbackEl.textContent = emptyMsg;
      return;
    }
    const item = currentList[currentIndex];
    const isRight = JSON.stringify(puzzleLine) === JSON.stringify(item.correct);
    const sep = typeSelect.value === "chain" ? " → " : " ";
    feedbackEl.textContent = isRight
      ? t("correctAnswer")
      : `${t("wrongAnswer")} — ${item.correct.join(sep)}`;
    total++;
    if(isRight){ correct++; streak++; if(streak >= 2) showHeartFx(); }
    else { if(streak > 0) launchFireworks(); streak = 0; if(!isWrongMode && !typeSelect.value.startsWith('drill-')) trackWrong(item); }
    if(!isWrongMode) saveStats(isRight, typeSelect.value);
    answered = true;
    document.getElementById("answers").classList.add("done");
    updateBadges();
    updateWrongBtn();
    const lb = document.getElementById("learnBtn");
    if(lb){ lb.style.display = ""; updateLearnBtn(); }
    return;
  }

  if(!selectedAnswer){
    feedbackEl.textContent = t("answerFirst");
    return;
  }

  const item = currentList[currentIndex];
  const correctAnswer = getCorrectAnswer(item);
  const answerNodes = [...document.querySelectorAll("#answers .answer")];

  answerNodes.forEach(node => {
    if(node.textContent === correctAnswer) node.classList.add("correct");
  });

  const selectedNode = answerNodes.find(node => node.classList.contains("selected"));
  const isCorrect = selectedAnswer === correctAnswer;

  if(selectedNode && !isCorrect) selectedNode.classList.add("wrong");

  feedbackEl.textContent = isCorrect
    ? t("correctAnswer")
    : `${t("wrongAnswer")} — ${correctAnswer}`;

  total++;

  if(isCorrect){
    correct++;
    streak++;
    if(streak >= 2) showHeartFx();
  } else {
    if(streak > 0) launchFireworks();
    streak = 0;
    if(!isWrongMode) trackWrong(item);
  }

  if(!isWrongMode) saveStats(isCorrect, typeSelect.value);
  answered = true;
  document.getElementById("answers").classList.add("done");
  updateBadges();
  updateWrongBtn();
  const lb = document.getElementById("learnBtn");
  if(lb){ lb.style.display = ""; updateLearnBtn(); }
}

function showHeartFx(){
  const el = document.getElementById("heartFx");
  el.classList.remove("active");
  void el.offsetWidth;
  el.classList.add("active");
}

function launchFireworks(){
  const canvas = document.getElementById("fxCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#db2777","#7c3aed","#0ea5e9","#f59e0b","#10b981","#f43f5e","#a855f7","#06b6d4"];
  const particles = [];

  for(let b = 0; b < 6; b++){
    const cx = canvas.width  * (0.15 + Math.random() * 0.7);
    const cy = canvas.height * (0.15 + Math.random() * 0.55);
    const color = colors[Math.floor(Math.random() * colors.length)];
    const count = 28 + Math.floor(Math.random() * 16);
    for(let i = 0; i < count; i++){
      const angle = (Math.PI * 2 / count) * i + Math.random() * 0.3;
      const speed = 4 + Math.random() * 7;
      particles.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        color,
        alpha: 1,
        size: 3 + Math.random() * 5,
        gravity: 0.18,
        drag: 0.97
      });
    }
  }

  let rafId;
  function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for(const p of particles){
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.vy += p.gravity;
      p.x  += p.vx;
      p.y  += p.vy;
      p.alpha -= 0.013;
      if(p.alpha <= 0) continue;
      alive = true;
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if(alive) rafId = requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  cancelAnimationFrame(rafId);
  draw();
}

function nextQuestion(){
  if(currentList.length === 0) return;
  currentIndex = (currentIndex + 1) % currentList.length;
  render();
}

typeSelect.addEventListener("change", () => {
  exitWrongMode();
  currentIndex = 0;
  if(typeSelect.value === 'drill-conjug') drillConjQueue = [];
  if(typeSelect.value === 'drill-ext')    drillExtQueue  = [];
  const isDrill = typeSelect.value.startsWith('drill-');
  document.getElementById('levelRow').style.display = isDrill ? 'none' : '';
  render();
  updateWrongBtn();
});

levelBtnsEl.querySelectorAll("button[data-level]").forEach(btn => {
  btn.addEventListener("click", () => {
    exitWrongMode();
    currentLevel = btn.dataset.level;
    localStorage.setItem("RK_LEVEL", currentLevel);
    currentIndex = 0;
    updateLevelButtons();
    render();
    updateWrongBtn();
  });
});

wrongBtn.addEventListener("click", enterWrongMode);

checkBtn.addEventListener("click", checkCurrentAnswer);
nextBtn.addEventListener("click", nextQuestion);
RKLang.init(setLanguage);

const soundBtn = document.getElementById("soundBtn");
let soundOn = true;

function speakKorean(text){
  if(!soundOn || !text || !window.speechSynthesis) return;
  speechSynthesis.cancel();
  setTimeout(function(){
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "ko-KR";
    utt.rate = 0.9;
    speechSynthesis.speak(utt);
  }, 50);
}

function getLearnedEx(){
  return JSON.parse(localStorage.getItem("RK_LEARNED_EX") || "[]");
}
function getExerciseKey(type, item){
  if(type === "ko-ro")      return "ko-ro||" + (item.q || "");
  if(type === "ro-ko")      return "ro-ko||" + (item.correct || "");
  if(type === "particle")   return "particle||" + (item.template || "") + "|" + (item.correct || "");
  if(type === "particlePlus") return "pp||" + (item.template || "") + "|" + (Array.isArray(item.correct) ? item.correct.join() : item.correct || "");
  if(type === "conjug")     return "conjug||" + (item.correct || "");
  if(type === "puzzle")     return "puzzle||" + (Array.isArray(item.correct) ? item.correct[0] : "");
  if(type === "chain")      return "chain||" + (Array.isArray(item.correct) ? item.correct[0] : "");
  return type + "||" + JSON.stringify(item.correct);
}
function isLearnedEx(type, item){
  return getLearnedEx().includes(getExerciseKey(type, item));
}
function toggleLearnedEx(type, item){
  const key = getExerciseKey(type, item);
  const list = getLearnedEx();
  const next = list.includes(key) ? list.filter(k => k !== key) : [...list, key];
  localStorage.setItem("RK_LEARNED_EX", JSON.stringify(next));
  updateLearnBtn();
}
function updateLearnBtn(){
  const btn = document.getElementById("learnBtn");
  if(!btn) return;
  const type = typeSelect.value;
  const item = currentList[currentIndex];
  if(!item) return;
  const learned = isLearnedEx(type, item);
  btn.textContent = learned ? "✓ Învățat" : "○ Marchează";
  btn.style.background = learned ? "#22c55e" : "rgba(255,255,255,.1)";
  btn.style.borderColor = learned ? "#22c55e" : "rgba(255,255,255,.3)";
  btn.style.color = learned ? "#fff" : "";
}

soundBtn.addEventListener("click", () => {
  soundOn = !soundOn;
  soundBtn.classList.toggle("off", !soundOn);
  soundBtn.textContent = soundOn ? "🔊" : "🔇";
});

updateLevelButtons();
updateStaticTexts();
document.addEventListener("keydown", function(e){
  if(e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "TEXTAREA") return;
  if(e.ctrlKey || e.metaKey || e.altKey) return;
  if(document.getElementById("langPicker").classList.contains("open")) return;

  const type = typeSelect.value;
  const isPuzzleChain = type === "puzzle" || type === "chain";

  if(e.key === "Enter"){
    e.preventDefault();
    if(!answered){ checkCurrentAnswer(); } else { nextQuestion(); }
    return;
  }

  if(!isPuzzleChain && !answered){
    const n = parseInt(e.key);
    if(n >= 1 && n <= 4){
      const opts = document.querySelectorAll("#answers .answer");
      if(opts[n - 1]){ opts[n - 1].click(); e.preventDefault(); }
    }
  }
});

updateBadges();
loadExercises();
