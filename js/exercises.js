const pageTitleEl = document.getElementById("pageTitle");
const pageSubtitleEl = document.getElementById("pageSubtitle");
const langRoBtn = document.getElementById("langRo");
const langEnBtn = document.getElementById("langEn");

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

let currentLang = RKLang.current;
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
    allLevels: "Toate nivelele"
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
    wrongModeLabel: "Mistakes Mode"
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
  if(type === "ko-ro") return t("modeKoRo");
  if(type === "particle") return t("modeParticle");
  if(type === "particlePlus") return t("modeParticlePlus");
  if(type === "conjug") return t("modeConjug");
  if(type === "puzzle") return t("modePuzzle");
  if(type === "chain") return t("modeChain");
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
}

function updateBadges(){
  if(bCorrect) bCorrect.querySelector("span:last-child").textContent = `${t("correct")}: ${correct}`;
  if(bTotal) bTotal.querySelector("span:last-child").textContent = `${t("total")}: ${total}`;
  if(bStreak) bStreak.querySelector("span:last-child").textContent = `${t("streak")}: ${streak}`;

  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);
  if(meterFill) meterFill.style.width = percent + "%";
}

function saveStats(isCorrect, type, lessonId){
  const today = new Date().toISOString().slice(0, 10);
  let s;
  try { s = JSON.parse(localStorage.getItem("RK_STATS") || "null"); } catch(e){ s = null; }
  if(!s) s = { total:0, correct:0, bestStreak:0, today, todayTotal:0, todayCorrect:0, byType:{}, byLesson:{} };
  if(!s.byLesson) s.byLesson = {};
  if(s.today !== today){ s.today = today; s.todayTotal = 0; s.todayCorrect = 0; }
  s.total++;
  s.todayTotal++;
  if(isCorrect){ s.correct++; s.todayCorrect++; }
  if(streak > s.bestStreak) s.bestStreak = streak;
  if(!s.byType[type]) s.byType[type] = { total:0, correct:0 };
  s.byType[type].total++;
  if(isCorrect) s.byType[type].correct++;
  if(lessonId){
    if(!s.byLesson[lessonId]) s.byLesson[lessonId] = { total:0, correct:0 };
    s.byLesson[lessonId].total++;
    if(isCorrect) s.byLesson[lessonId].correct++;
  }
  localStorage.setItem("RK_STATS", JSON.stringify(s));
}

function trackWrong(item){
  const type = typeSelect.value;
  if(!wrongsByType[type]) wrongsByType[type] = [];
  if(!wrongsByType[type].includes(item)) wrongsByType[type].push(item);
}

function updateWrongBtn(){
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
  RKLang.set(lang);
  updateStaticTexts();
  updateBadges();
  render();
}

function shuffle(array){
  return [...array].sort(() => Math.random() - 0.5);
}

async function loadExercises(){
  try {
    const response = await fetch("./data/exercises.json");
    if(!response.ok) throw new Error(response.status);
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
  let list = allExercises[type] || [];
  if(lessonParam){
    list = list.filter(item => item.lessonId === lessonParam);
  } else if(currentLevel !== "test"){
    list = list.filter(item => String(item.topik) === currentLevel);
  } else {
    list = shuffle(list);
  }
  return list;
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
  if(/[가-힣ㄱ-ㆎ]/.test(desc)){
    const matches = [...desc.matchAll(/\(([^)]+)\)/g)];
    if(matches.length) return verb + ' ' + matches[matches.length - 1][1];
  }
  return prompt;
}

function render(){
  selectedAnswer = null;
  answered = false;
  feedbackEl.textContent = "";
  answersEl.innerHTML = "";
  answersEl.style.display = "";
  document.getElementById("puzzleUI").style.display = "none";

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

  questionEl.textContent = questionText;
  helperEl.textContent = helperText;

  if(typeSelect.value === "ko-ro" || typeSelect.value === "particle" || typeSelect.value === "particlePlus"){
    speakKorean(questionText);
  }

  options.forEach(option => {
    const el = document.createElement("div");
    el.className = "answer";
    el.textContent = option;

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
    el.textContent = tile;
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
    el.textContent = tile;
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
  if(typeSelect.value === "ko-ro"){
    return item.correct[currentLang];
  }
  if(typeSelect.value === "particlePlus"){
    return Array.isArray(item.correct) ? item.correct.join(" · ") : item.correct;
  }
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
    else { if(streak > 0) launchFireworks(); streak = 0; if(!isWrongMode) trackWrong(item); }
    if(!isWrongMode) saveStats(isRight, typeSelect.value, item.lessonId || null);
    answered = true;
    updateBadges();
    updateWrongBtn();
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

  if(!isWrongMode) saveStats(isCorrect, typeSelect.value, item.lessonId || null);
  answered = true;
  updateBadges();
  updateWrongBtn();
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
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "ko-KR";
  utt.rate = 0.9;
  speechSynthesis.speak(utt);
}

soundBtn.addEventListener("click", () => {
  soundOn = !soundOn;
  soundBtn.classList.toggle("off", !soundOn);
  soundBtn.textContent = soundOn ? "🔊" : "🔇";
});

updateLevelButtons();
updateStaticTexts();
updateBadges();
loadExercises();
