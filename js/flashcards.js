// ── Constants ────────────────────────────────────────────────
const ROLE_COLORS = {
  "Subiect":"#e74c3c","Subject":"#e74c3c",
  "Obiect":"#2980b9","Object":"#2980b9",
  "Substantiv":"#607d8b","Noun":"#607d8b",
  "Verb":"#e91e63",
  "Adjectiv":"#d4ac0d","Adjective":"#d4ac0d",
  "Adverb":"#8e44ad",
  "Modificator":"#d4ac0d","Modifier":"#d4ac0d",
  "Conector":"#e67e22","Connector":"#e67e22",
  "Gramatică":"#1abc9c","Grammar":"#1abc9c"
};
const NEW_PER_SESSION = 20;

// ── State ────────────────────────────────────────────────────
let currentLang = RKLang.get();
let sortMode    = localStorage.getItem("RK_FC_SORT") || "srs";
let FC_STATS    = JSON.parse(localStorage.getItem("RK_FC_STATS") || "{}");
let WORDS       = [];
let deck        = [];
let lapQueue    = [];
let lapSeen     = new Set();
let cardIndex   = 0;
let knowCount   = 0;
let dontCount   = 0;
let flipped     = false;
let filterFav   = false;
let _answerLocked = false;

const imgCache = (() => {
  try { return JSON.parse(sessionStorage.getItem("FC_IMG") || "{}"); } catch { return {}; }
})();

// ── UI strings ───────────────────────────────────────────────
const UI = {
  ro:{
    title:"Helioform",
    tapToFlip:"toacă pentru a rezona",
    know:"Știu", dontKnow:"Nu știu",
    summaryTitle:"Câmp complet",
    know2:"Rezonanță", dontKnow2:"Necunoscut",
    restart:"↺  Reia",
    noFav:"Nu ai favorite. Adaugă din Glosar!",
    loadError:"Nu am putut încărca vocab-korean.json",
    retry:"Încearcă din nou",
    srsNew:"NOU",
    srsEmpty:"Câmp liber azi",
    srsNext:"Următor câmp",
    srsDueCards:"nuclee",
    srsNextIn:"Mâine",
    srsNextInDays:"Peste {n} zile",
    newCards:"+ Nuclee noi"
  },
  en:{
    title:"Helioform",
    tapToFlip:"tap to resonate",
    know:"I know", dontKnow:"Don't know",
    summaryTitle:"Field complete",
    know2:"Resonance", dontKnow2:"Unknown",
    restart:"↺  Restart",
    noFav:"No favorites. Add some in the Glossary!",
    loadError:"Could not load vocab-korean.json",
    retry:"Try again",
    srsNew:"NEW",
    srsEmpty:"Field clear today",
    srsNext:"Next field",
    srsDueCards:"nuclei",
    srsNextIn:"Tomorrow",
    srsNextInDays:"In {n} days",
    newCards:"+ New nuclei"
  }
};
function t(k){ return UI[currentLang][k] || k; }

// ── SM-2 ─────────────────────────────────────────────────────
const SRS_KEY = "RK_FC_SRS";

function srsLoad() {
  try { return JSON.parse(localStorage.getItem(SRS_KEY) || "{}"); } catch { return {}; }
}
function srsSave(s) {
  try { localStorage.setItem(SRS_KEY, JSON.stringify(s)); } catch {}
}

function srsUpdate(ko, quality) {
  const s = srsLoad();
  const c = s[ko] || { n: 0, I: 1, EF: 2.5, due: 0 };
  if (quality >= 3) {
    if      (c.n === 0) c.I = 1;
    else if (c.n === 1) c.I = 6;
    else                c.I = Math.round(c.I * c.EF);
    c.n++;
  } else {
    c.n = 0;
    c.I = 1;
  }
  c.EF  = Math.max(1.3, c.EF + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  c.due = Date.now() + c.I * 86400000;
  s[ko] = c;
  srsSave(s);
  return c;
}

function srsBuildDeck(pool) {
  const s   = srsLoad();
  const now = Date.now();
  const due = pool
    .filter(w => s[w.ko] && s[w.ko].due <= now)
    .sort((a, b) => s[a.ko].due - s[b.ko].due);
  const fresh = pool
    .filter(w => !s[w.ko])
    .sort(() => Math.random() - 0.5)
    .slice(0, NEW_PER_SESSION);
  return [...due, ...fresh];
}

function srsCounts(pool) {
  const s   = srsLoad();
  const now = Date.now();
  return {
    due:   pool.filter(w => s[w.ko] && s[w.ko].due <= now).length,
    fresh: Math.min(pool.filter(w => !s[w.ko]).length, NEW_PER_SESSION)
  };
}

function srsNextDate() {
  const s     = srsLoad();
  const now   = Date.now();
  const dates = Object.values(s).map(c => c.due).filter(d => d > now);
  return dates.length ? new Date(Math.min(...dates)) : null;
}

function srsNextLabel(date) {
  if (!date) return "";
  const days = Math.ceil((date - Date.now()) / 86400000);
  return days <= 1
    ? t("srsNextIn")
    : t("srsNextInDays").replace("{n}", days);
}

// ── Helpers ──────────────────────────────────────────────────
function getMeaning(w){ return currentLang === "ro" ? w.ro : w.en; }
function getCat(w){ return currentLang === "ro" ? (w.categoriesRo||[])[0] : (w.categoriesEn||[])[0]; }
function getWordColor(w){ const c = getCat(w); return c ? (ROLE_COLORS[c] || null) : null; }
function getFavs(){ return JSON.parse(localStorage.getItem("RK_FAV_WORDS") || "[]"); }

function diffScore(ko){
  const s = FC_STATS[ko];
  if(!s || (s.c + s.w) < 2) return 0.5;
  return s.w / (s.c + s.w);
}
function getDiffDot(ko){
  const s = FC_STATS[ko];
  if(!s || (s.c + s.w) < 3) return "";
  const r = s.w / (s.c + s.w);
  if(r > 0.5) return `<span class="diff-dot diff-hard">●</span>`;
  if(r > 0.2) return `<span class="diff-dot diff-med">●</span>`;
  return `<span class="diff-dot diff-easy">●</span>`;
}

function imgKey(word){
  return word.en.split(/[,;/(]/)[0].trim().replace(/^to\s+/i,"").toLowerCase();
}

// ── Image loading (prefetch only, not displayed in Helioform) ─
async function getWordImage(key){
  if(key in imgCache) return imgCache[key];
  if(!key || key.startsWith("-") || key.length < 2 || /^(a|an|the|to|in|on|at|by|of)$/.test(key)){
    imgCache[key] = null; return null;
  }
  try{
    const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(key)}`);
    const d = await r.json();
    const src = d.thumbnail?.source || null;
    imgCache[key] = src;
    try{ sessionStorage.setItem("FC_IMG", JSON.stringify(imgCache)); }catch{}
    return src;
  } catch { imgCache[key] = null; return null; }
}
function loadCardImage(word){ getWordImage(imgKey(word)); }
function preloadNext(idx){ if(idx < deck.length) getWordImage(imgKey(deck[idx])); }

// ── Memory glow: nucleus light reflects SRS strength ─────────
// Returns 0 (unknown/new) → 1 (mastered)
function memoryStrength(ko) {
  const s = srsLoad();
  const d = s[ko];
  if (!d || d.n === 0) return null; // no data yet
  // EF range: 1.3 (struggling) … 2.5 (neutral) … 3.5+ (easy)
  return Math.max(0, Math.min(1, (d.EF - 1.3) / 2.2));
}

// Apply corona color based on memory strength to the nucleus
function applyMemoryGlow(ko) {
  const glowEl = document.getElementById("crfNucleusGlow");
  const core   = document.getElementById("crfCore");
  if (!glowEl || !core) return;

  const strength = memoryStrength(ko);
  const dark = document.body.classList.contains("dark-mode");

  let glowColor, borderColor, shadowColor;

  if (strength === null) {
    // New word — default neutral glow (CSS variable handles it)
    glowEl.style.background = "";
    core.style.borderColor  = "";
    core.style.boxShadow    = "";
    return;
  }

  if (strength > 0.62) {
    // Well-known: warm amber/gold — like a mature star
    glowColor   = dark ? "rgba(251,191,36,0.42)"  : "rgba(245,158,11,0.28)";
    borderColor = dark ? "rgba(251,191,36,0.35)"  : "rgba(245,158,11,0.30)";
    shadowColor = dark ? "rgba(251,191,36,0.22)"  : "rgba(245,158,11,0.16)";
  } else if (strength > 0.32) {
    // Medium — rose/violet (current default, clear)
    glowEl.style.background = "";
    core.style.borderColor  = "";
    core.style.boxShadow    = "";
    return;
  } else {
    // Struggling: cool indigo — dimmer, colder
    glowColor   = dark ? "rgba(99,102,241,0.38)"  : "rgba(99,102,241,0.22)";
    borderColor = dark ? "rgba(99,102,241,0.32)"  : "rgba(99,102,241,0.28)";
    shadowColor = dark ? "rgba(99,102,241,0.20)"  : "rgba(99,102,241,0.12)";
  }

  glowEl.style.background = `radial-gradient(circle, ${glowColor} 0%, transparent 68%)`;
  core.style.borderColor  = borderColor;
  core.style.boxShadow    =
    `0 0 60px ${shadowColor}, 0 0 120px ${shadowColor}, 0 20px 60px rgba(0,0,0,.06)`;
}

// ── Fit Korean text inside circular nucleus ───────────────────
function fitNucleusText() {
  const core = document.getElementById("crfCore");
  const koEl = document.getElementById("crfKorean");
  if (!core || !koEl) return;

  // Usable width: ~70% of nucleus diameter (accounts for circle geometry + padding)
  const maxWidth = core.offsetWidth * 0.70;

  // Reset to CSS default so clamp() recalculates
  koEl.style.fontSize = "";

  // If it already fits, nothing to do
  if (koEl.scrollWidth <= maxWidth) return;

  // Binary-search the right font size (px) between 20 and current computed size
  let lo = 20;
  let hi = Math.round(parseFloat(getComputedStyle(koEl).fontSize));
  while (hi - lo > 1) {
    const mid = Math.round((lo + hi) / 2);
    koEl.style.fontSize = mid + "px";
    if (koEl.scrollWidth <= maxWidth) lo = mid; else hi = mid;
  }
  koEl.style.fontSize = lo + "px";
}

// ── Deck building ────────────────────────────────────────────
function getPool(){
  if(!filterFav) return WORDS;
  const favs = getFavs();
  return WORDS.filter(w => favs.includes(w.ko));
}

function buildDeck(){
  lapQueue = []; lapSeen = new Set();
  const pool = getPool();
  if(sortMode === "srs"){
    deck = srsBuildDeck(pool);
  } else if(sortMode === "hard"){
    deck = [...pool].sort((a,b) => diffScore(b.ko) - diffScore(a.ko));
  } else if(sortMode === "easy"){
    deck = [...pool].sort((a,b) => diffScore(a.ko) - diffScore(b.ko));
  } else {
    deck = [...pool].sort(() => Math.random() - 0.5);
  }
  cardIndex = 0; knowCount = 0; dontCount = 0; flipped = false;
}

// ── Speech ───────────────────────────────────────────────────
function speakKO(text){
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "ko-KR"; utt.rate = 0.9;
  speechSynthesis.cancel();
  speechSynthesis.speak(utt);
}

// ── CRF: Set interface state ─────────────────────────────────
function crfSetState(state) {
  const field    = document.getElementById("crfField");
  const response = document.getElementById("crfResponse");
  const progress = document.getElementById("crfProgress");
  const fcArea   = document.getElementById("fcArea");
  const nav      = document.getElementById("crfNav");
  const orbits   = document.getElementById("crfOrbits");

  if (state === "learning") {
    if (field)    field.style.display    = "";
    if (response) response.style.display = "";
    if (progress) progress.style.display = "";
    if (fcArea)   { fcArea.style.display = "none"; fcArea.innerHTML = ""; }
    if (orbits)   orbits.style.display   = "";
  } else {
    if (field)    field.style.display    = "none";
    if (response) response.style.display = "none";
    if (progress) progress.style.display = "none";
    if (fcArea)   fcArea.style.display   = "flex";
    if (orbits)   orbits.style.display   = "none";
  }
}

// ── CRF: Particle burst on answer ────────────────────────────
function crfEmitParticles(type) {
  const container = document.getElementById("crfParticles");
  const field     = document.getElementById("crfField");
  if (!container) return;

  // Nucleus pulse class
  if (field) {
    field.classList.remove("pulse-know", "pulse-dont");
    void field.offsetWidth; // reflow
    field.classList.add(type === "know" ? "pulse-know" : "pulse-dont");
    setTimeout(() => field.classList.remove("pulse-know", "pulse-dont"), 500);
  }

  // Radial particle burst
  const count = 14;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "crf-particle crf-particle--" + type;
    const angle = (i / count) * 360 + (Math.random() * 10 - 5);
    const dist  = 70 + Math.random() * 110;
    const delay = Math.random() * 0.12;
    p.style.setProperty("--pa", angle + "deg");
    p.style.setProperty("--pr", dist  + "px");
    p.style.setProperty("--pd", delay + "s");
    container.appendChild(p);
    setTimeout(() => p.remove(), 750);
  }
}

// ── CRF: Update circular progress arc ───────────────────────
function crfUpdateArc(done, total) {
  const progText = document.getElementById("crfProgText");
  const arcFill  = document.getElementById("crfArcFill");
  if (progText) progText.textContent = done + "/" + total;
  if (arcFill) {
    const circ = 326.73;
    const pct  = total === 0 ? 0 : done / total;
    arcFill.style.strokeDashoffset = circ * (1 - pct);
  }
}

// ── Render card ──────────────────────────────────────────────
function renderFC() {
  if (WORDS.length === 0) {
    crfSetState("overlay");
    document.getElementById("fcArea").innerHTML =
      `<div class="crf-state-card">
         <div class="crf-state-title">⚠</div>
         <div class="crf-state-sub">${t("loadError")}</div>
         <button class="crf-state-btn" onclick="loadVocab()">${t("retry")}</button>
       </div>`;
    return;
  }

  if (filterFav && deck.length === 0 && getFavs().length === 0) {
    crfSetState("overlay");
    document.getElementById("fcArea").innerHTML =
      `<div class="crf-state-card">
         <div class="crf-state-title">⭐</div>
         <div class="crf-state-sub">${t("noFav")}</div>
       </div>`;
    return;
  }

  if (sortMode === "srs" && deck.length === 0) {
    renderSRSEmpty(); return;
  }

  if (cardIndex >= deck.length) {
    if (sortMode === "srs" && lapQueue.length > 0) {
      deck.push(...lapQueue.splice(0));
    } else {
      renderSummary(); return;
    }
  }

  crfSetState("learning");

  const word    = deck[cardIndex];
  const done    = knowCount + dontCount;
  const total   = deck.length + (sortMode === "srs" ? lapQueue.length : 0);
  const wColor  = getWordColor(word);
  const cat     = getCat(word);
  const srsData = sortMode === "srs" ? srsLoad() : null;
  const isNew   = srsData && !srsData[word.ko];

  // Korean text
  const koEl = document.getElementById("crfKorean");
  if (koEl) {
    koEl.textContent = word.ko;
    koEl.style.color      = wColor || "";
    koEl.style.textShadow = "";
  }

  // Nucleus glow tint (word-color override when available)
  const glowEl = document.getElementById("crfNucleusGlow");
  if (glowEl && wColor) {
    glowEl.style.background =
      `radial-gradient(circle, ${wColor}44 0%, transparent 68%)`;
  } else if (glowEl) {
    glowEl.style.background = "";
  }

  // SRS tag
  const srsTagEl = document.getElementById("crfSrsTag");
  if (srsTagEl) {
    srsTagEl.innerHTML = isNew
      ? `<span class="crf-srs-new">${t("srsNew")}</span>` : "";
  }

  // Difficulty dot
  const diffEl = document.getElementById("crfDiffDot");
  if (diffEl) diffEl.innerHTML = getDiffDot(word.ko);

  // Hint hidden
  const hintEl = document.getElementById("crfCoreHint");
  if (hintEl) hintEl.textContent = "";

  // Meaning
  const meaningEl = document.getElementById("crfMeaning");
  if (meaningEl) {
    meaningEl.textContent = getMeaning(word) || "—";
    meaningEl.style.color = wColor || "";
  }

  // Category badge
  const catEl = document.getElementById("crfCat");
  if (catEl) {
    if (cat) {
      catEl.textContent       = cat;
      catEl.style.display     = "";
      catEl.style.background  = wColor ? wColor + "18" : "";
      catEl.style.color       = wColor || "";
      catEl.style.borderColor = wColor ? wColor + "44" : "";
    } else {
      catEl.style.display = "none";
    }
  }

  // Emoji display (front face)
  const emojiEl = document.getElementById("crfEmojiDisplay");
  if (emojiEl) emojiEl.textContent = getWordEmoji(word);

  // Back face Korean reference
  const backKoEl = document.getElementById("crfBackKorean");
  if (backKoEl) backKoEl.textContent = word.ko;

  // Speak button
  const speakEl = document.getElementById("crfSpeak");
  if (speakEl) {
    speakEl.innerHTML = `◉ ${word.ko}`;
    speakEl.onclick = (e) => { e.stopPropagation(); speakKO(word.ko); };
  }

  // Response labels
  const lKnow = document.getElementById("respKnow");
  const lDont = document.getElementById("respDontKnow");
  if (lKnow) lKnow.textContent = t("know");
  if (lDont) lDont.textContent = t("dontKnow");

  // Progress arc
  crfUpdateArc(done, total);

  // Reset nucleus state + trigger appear animation
  const core = document.getElementById("crfCore");
  if (core) {
    core.classList.remove("revealed", "crf-appear", "crf-collapse");
    void core.offsetWidth;
    core.classList.add("crf-appear");
  }
  flipped = false;
  _answerLocked = false;

  // Fit text after layout is ready
  requestAnimationFrame(fitNucleusText);

  // Apply memory-strength glow to nucleus
  applyMemoryGlow(word.ko);

  loadCardImage(word);
  preloadNext(cardIndex + 1);
}

// ── Flip: meaning erupts from the nucleus ────────────────────
function flipCard() {
  flipped = !flipped;
  const core = document.getElementById("crfCore");
  if (core) core.classList.toggle("revealed", flipped);
  if (flipped && deck[cardIndex]) speakKO(deck[cardIndex].ko);
}

// ── Answer ───────────────────────────────────────────────────
function answer(knows) {
  if (_answerLocked) return;
  _answerLocked = true;

  const word = deck[cardIndex];
  if (word) {
    if (!FC_STATS[word.ko]) FC_STATS[word.ko] = {c: 0, w: 0};
    if (knows) FC_STATS[word.ko].c++; else FC_STATS[word.ko].w++;
    localStorage.setItem("RK_FC_STATS", JSON.stringify(FC_STATS));

    if (sortMode === "srs") {
      srsUpdate(word.ko, knows ? 4 : 1);
      if (!knows && !lapSeen.has(word.ko)) {
        lapSeen.add(word.ko);
        lapQueue.push(word);
      }
    }
  }

  crfEmitParticles(knows ? "know" : "dont");
  gainXP(knows);

  if (knows) knowCount++; else dontCount++;

  // Stellar collapse: nucleus implodes into a point of light
  const core = document.getElementById("crfCore");
  if (core) {
    core.classList.remove("crf-appear");
    core.classList.add("crf-collapse");
  }

  setTimeout(() => {
    cardIndex++;
    flipped = false;
    renderFC(); // renderFC adds crf-appear which expands from nothing
  }, 380);
}

// ── SRS empty state ──────────────────────────────────────────
function renderSRSEmpty() {
  crfSetState("overlay");
  const el    = document.getElementById("fcArea");
  const next  = srsNextDate();
  const label = next ? srsNextLabel(next) : "";
  const pool  = getPool();
  const { fresh } = srsCounts(pool);

  const nextLine = next
    ? `<div class="crf-state-sub">${t("srsNext")}: <b>${label}</b></div>` : "";
  const freshLine = fresh > 0
    ? `<div class="crf-state-sub" style="margin-top:4px">
         ${fresh} ${currentLang==="ro"?"nuclee noi disponibile":"new nuclei available"}
       </div>` : "";

  el.innerHTML = `
    <div class="crf-state-card">
      <div style="font-size:52px;margin-bottom:16px;line-height:1">✦</div>
      <div class="crf-state-title">${t("srsEmpty")}</div>
      ${nextLine}
      ${freshLine}
      <button class="crf-state-btn" onclick="forceNewCards()">${t("newCards")}</button>
    </div>`;
}

function forceNewCards(){
  const pool = getPool();
  const s    = srsLoad();
  deck = pool
    .filter(w => !s[w.ko])
    .sort(() => Math.random() - 0.5)
    .slice(0, NEW_PER_SESSION);
  lapQueue = []; lapSeen = new Set();
  cardIndex = 0; knowCount = 0; dontCount = 0;
  renderFC();
}

// ── Summary ──────────────────────────────────────────────────
function renderSummary() {
  crfSetState("overlay");
  const el   = document.getElementById("fcArea");
  const next = sortMode === "srs" ? srsNextDate() : null;

  let nextInfo = "";
  if (next) {
    const pool    = getPool();
    const s       = srsLoad();
    const nextTs  = next.getTime();
    const nCount  = pool.filter(w => s[w.ko] && s[w.ko].due <= nextTs).length;
    nextInfo = `<div class="crf-state-sub" style="margin-top:8px">
      ${t("srsNext")}: <b>${srsNextLabel(next)}</b> · ${nCount} ${t("srsDueCards")}
    </div>`;
  }

  const pct = (knowCount + dontCount) === 0
    ? 0 : Math.round(knowCount / (knowCount + dontCount) * 100);

  el.innerHTML = `
    <div class="crf-state-card">
      <div class="crf-state-title">${t("summaryTitle")}</div>
      <div class="crf-stat-pair">
        <div class="crf-stat-box crf-stat-box--know">
          <div class="crf-stat-num">${knowCount}</div>
          <div class="crf-stat-label">${t("know2")}</div>
        </div>
        <div class="crf-stat-box crf-stat-box--dont">
          <div class="crf-stat-num">${dontCount}</div>
          <div class="crf-stat-label">${t("dontKnow2")}</div>
        </div>
      </div>
      <div class="crf-state-sub">${pct}% ${currentLang==="ro"?"rezonanță":"resonance"}</div>
      ${nextInfo}
      <button class="crf-state-btn" onclick="buildDeck();renderFC()">${t("restart")}</button>
    </div>`;
}

// ── UI sync ──────────────────────────────────────────────────
function updateSortBtns(){
  const pool = getPool();
  const { due, fresh } = srsCounts(pool);
  const total  = due + fresh;
  const srsBtn = document.getElementById("sortSRS");
  if (srsBtn) {
    const badge = total > 0 ? ` <span class="srs-count">${total}</span>` : "";
    srsBtn.innerHTML = `SRS${badge}`;
    srsBtn.classList.toggle("active", sortMode === "srs");
  }
  const r = document.getElementById("sortRandom");
  const h = document.getElementById("sortHard");
  const e = document.getElementById("sortEasy");
  if (r) r.classList.toggle("active", sortMode === "random");
  if (h) h.classList.toggle("active", sortMode === "hard");
  if (e) e.classList.toggle("active", sortMode === "easy");
}

function updateFilterBtns(){
  const fb = document.getElementById("filterFav");
  if (fb) fb.classList.toggle("active", filterFav);
}

function setLang(lang){
  currentLang = lang;
  updateFilterBtns();
  updateSortBtns();
  buildDeck();
  renderFC();
}

function setSortMode(mode){
  sortMode = mode;
  localStorage.setItem("RK_FC_SORT", mode);
  updateSortBtns();
  buildDeck();
  renderFC();
}

// ── Canvas: drifting stellar particle field ──────────────────
function initCRFCanvas() {
  const canvas = document.getElementById("crfCanvas");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");
  let stars   = [];
  let raf     = null;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function makeStars() {
    const COLORS = ["80,40,120", "200,80,220", "56,189,248", "52,211,153", "253,186,116"];
    stars = Array.from({ length: 75 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.3,
      o: Math.random() * 0.50 + 0.10,
      s: Math.random() * 0.30 + 0.05,
      d: (Math.random() - 0.5) * 0.18,
      p: Math.random() * Math.PI * 2,
      c: COLORS[Math.floor(Math.random() * COLORS.length)]
    }));
  }

  function draw(ts) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = document.body.classList.contains("dark-mode");
    const t_     = ts * 0.001;

    stars.forEach(s => {
      const opacity = s.o * (0.60 + 0.40 * Math.sin(t_ * 0.8 + s.p));
      const rgb = isDark ? (s.c || "200,180,255") : (s.c || "80,40,120");
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb},${opacity.toFixed(2)})`;
      ctx.fill();

      s.y -= s.s;
      s.x += s.d;
      if (s.y < -2)              { s.y = canvas.height + 2; s.x = Math.random() * canvas.width; }
      if (s.x < -2)              s.x = canvas.width  + 2;
      if (s.x > canvas.width + 2) s.x = -2;
    });

    raf = requestAnimationFrame(draw);
  }

  resize();
  makeStars();
  raf = requestAnimationFrame(draw);
  window.addEventListener("resize", () => { resize(); makeStars(); });
}

// ── Events ───────────────────────────────────────────────────
RKLang.init(setLang);

document.getElementById("filterFav").addEventListener("click", () => {
  filterFav = !filterFav;
  updateFilterBtns();
  buildDeck();
  renderFC();
});
document.getElementById("sortSRS").addEventListener("click",    () => setSortMode("srs"));
document.getElementById("sortRandom").addEventListener("click", () => setSortMode("random"));
document.getElementById("sortHard").addEventListener("click",   () => setSortMode("hard"));
document.getElementById("sortEasy").addEventListener("click",   () => setSortMode("easy"));

// ── Boot ─────────────────────────────────────────────────────
async function loadVocab() {
  crfSetState("overlay");
  document.getElementById("fcArea").innerHTML =
    `<div class="crf-state-card">
       <div class="crf-state-title" style="font-size:36px;margin-bottom:12px">✦</div>
       <div class="crf-state-sub" style="letter-spacing:1.5px;text-transform:uppercase;font-size:11px">
         ${currentLang === "ro" ? "Câmpul se inițializează…" : "Initializing field…"}
       </div>
     </div>`;

  try {
    const resp  = await fetch("./data/vocab-korean.json");
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    const vocab = await resp.json();
    const map   = new Map();
    const cats  = ["subjects","nouns","objects","verbs","adjectives","adverbs","modifiers","connectors","grammar"];
    const catLabels = {
      subjects:   {ro:"Subiect",   en:"Subject"},
      nouns:      {ro:"Substantiv",en:"Noun"},
      objects:    {ro:"Obiect",    en:"Object"},
      verbs:      {ro:"Verb",      en:"Verb"},
      adjectives: {ro:"Adjectiv",  en:"Adjective"},
      adverbs:    {ro:"Adverb",    en:"Adverb"},
      modifiers:  {ro:"Modificator",en:"Modifier"},
      connectors: {ro:"Conector",  en:"Connector"},
      grammar:    {ro:"Gramatică", en:"Grammar"}
    };
    // Support both flat array (new) and nested object (old) format
    const flat = Array.isArray(vocab) ? vocab : cats.flatMap(cat =>
      (vocab[cat]||[]).map(e => ({...e, categories:[cat]}))
    );
    flat.forEach(e => {
      if (!e.ko) return;
      if (!map.has(e.ko)) map.set(e.ko, {ko:e.ko, ro:e.ro||"", en:e.en||"", categoriesRo:[], categoriesEn:[]});
      const w = map.get(e.ko);
      (e.categories||[]).forEach(cat => {
        const lbl = catLabels[cat];
        if (!lbl) return;
        if (!w.categoriesRo.includes(lbl.ro)) w.categoriesRo.push(lbl.ro);
        if (!w.categoriesEn.includes(lbl.en)) w.categoriesEn.push(lbl.en);
      });
    });
    WORDS = [...map.values()].sort((a, b) => a.ko.localeCompare(b.ko, "ko"));
    updateSortBtns();
    buildDeck();
    renderFC();
  } catch(e) {
    crfSetState("overlay");
    document.getElementById("fcArea").innerHTML =
      `<div class="crf-state-card">
         <div class="crf-state-title">⚠</div>
         <div class="crf-state-sub">${t("loadError")}</div>
         <button class="crf-state-btn" onclick="loadVocab()">${t("retry")}</button>
       </div>`;
  }
}

// ── Parallax: orbits drift with gaze / device tilt ───────────
function initParallax() {
  const orbits = document.getElementById("crfOrbits");
  if (!orbits) return;

  const MAX  = 24;   // max pixel displacement for outer layer
  let tx = 0, ty = 0;
  let cx = 0, cy = 0;

  function lerp(a, b, t) { return a + (b - a) * t; }

  (function tick() {
    cx = lerp(cx, tx, 0.055);
    cy = lerp(cy, ty, 0.055);
    const x = Math.round(cx * 10) / 10;
    const y = Math.round(cy * 10) / 10;
    orbits.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(tick);
  })();

  // Desktop: mouse position relative to viewport center
  document.addEventListener("mousemove", e => {
    const hw = window.innerWidth  / 2;
    const hh = window.innerHeight / 2;
    tx = ((e.clientX - hw) / hw) * MAX;
    ty = ((e.clientY - hh) / hh) * MAX;
  });
  // Reset gently when mouse leaves
  document.addEventListener("mouseleave", () => { tx = 0; ty = 0; });

  // Mobile: gyroscope tilt
  let gyroOn = false;
  function onTilt(e) {
    if (!gyroOn || e.gamma == null) return;
    tx = Math.max(-MAX, Math.min(MAX, e.gamma       * 0.55));
    ty = Math.max(-MAX, Math.min(MAX, (e.beta - 45) * 0.42));
  }
  window.addEventListener("deviceorientation", onTilt);

  // iOS 13+ needs explicit permission — request on first tap
  if (typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function") {
    document.addEventListener("pointerdown", function ask() {
      DeviceOrientationEvent.requestPermission()
        .then(r => { if (r === "granted") gyroOn = true; })
        .catch(() => {});
      document.removeEventListener("pointerdown", ask);
    }, { once: true });
  } else {
    gyroOn = true;
  }
}

// ── Category Emoji Mapping ────────────────────────────────────
const CAT_EMOJI = {
  "Verb":"🏃", "Substantiv":"📖", "Noun":"📖",
  "Subiect":"👤", "Subject":"👤",
  "Obiect":"🎯", "Object":"🎯",
  "Adjectiv":"✨", "Adjective":"✨",
  "Adverb":"⚡",
  "Modificator":"🔧", "Modifier":"🔧",
  "Conector":"🔗", "Connector":"🔗",
  "Gramatică":"📚", "Grammar":"📚"
};
function getWordEmoji(word) {
  const cat = getCat(word);
  return cat ? (CAT_EMOJI[cat] || "💬") : "💬";
}

// ── Gamification ──────────────────────────────────────────────
let sessionCombo = 0;
let dayStreak    = 0;

function initGamification() {
  const today = new Date().toDateString();
  const last  = localStorage.getItem("RK_FC_LAST_DATE") || "";
  const saved = parseInt(localStorage.getItem("RK_FC_DAY_STREAK") || "0");
  const yest  = new Date(Date.now() - 86400000).toDateString();

  if (last === today) {
    dayStreak = saved;
  } else if (last === yest) {
    dayStreak = saved + 1;
    localStorage.setItem("RK_FC_DAY_STREAK", dayStreak);
  } else {
    dayStreak = 1;
    localStorage.setItem("RK_FC_DAY_STREAK", dayStreak);
  }
  localStorage.setItem("RK_FC_LAST_DATE", today);
  updateGamificationDisplay();
}

function updateGamificationDisplay() {
  let xp = 0, levelNum = 1, pct = 0;
  if (typeof RKGamification !== "undefined") {
    const xpData  = RKGamification.getXPData();
    const lvlInfo = RKGamification.getLevelInfo(xpData.total);
    xp       = xpData.total;
    levelNum = lvlInfo.current.level;
    const currMin = lvlInfo.current.min;
    const nextMin = lvlInfo.next ? lvlInfo.next.min : currMin + 500;
    pct = Math.min(100, (xp - currMin) / (nextMin - currMin) * 100);
  }

  const el = {
    streak: document.getElementById("gmStreakVal"),
    level:  document.getElementById("gmLevel"),
    xpFill: document.getElementById("gmXpFill"),
    xpText: document.getElementById("gmXpText"),
    combo:  document.getElementById("gmComboVal"),
    acc:    document.getElementById("gmAccVal"),
  };

  if (el.streak) el.streak.textContent = dayStreak;
  if (el.level)  el.level.textContent  = "Lv." + levelNum;
  if (el.xpFill) el.xpFill.style.width = pct + "%";
  if (el.xpText) el.xpText.textContent = xp + " XP";
  if (el.combo)  el.combo.textContent  = "x" + Math.max(1, sessionCombo);

  const total = knowCount + dontCount;
  if (el.acc) el.acc.textContent = total > 0
    ? Math.round(knowCount / total * 100) + "%" : "—";
}

function gainXP(knows) {
  if (!knows) {
    sessionCombo = 0;
  } else {
    sessionCombo++;
    if (typeof RKGamification !== "undefined") {
      const result = RKGamification.addXP(sessionCombo);
      showFloatingXP("+" + result.xpGained + " XP");
      if (result.levelUp) {
        showAchievementToast("⭐ Level Up! Lv." + result.newLevel);
      }
    }
    if (sessionCombo === 3)  showAchievementToast("⚡ Combo ×3!");
    if (sessionCombo === 5)  showAchievementToast("🔥 Combo ×5!");
    if (sessionCombo === 10) showAchievementToast("🌟 Combo ×10!");
  }
  updateGamificationDisplay();
}

function showFloatingXP(text) {
  const container = document.getElementById("crfXpFloat");
  if (!container) return;
  const el = document.createElement("div");
  el.className = "xp-float";
  el.textContent = text;
  container.appendChild(el);
  setTimeout(() => el.remove(), 1800);
}

function showAchievementToast(text) {
  const area = document.getElementById("crfToastArea");
  if (!area) return;
  const el = document.createElement("div");
  el.className = "gm-toast";
  el.textContent = text;
  area.appendChild(el);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => el.classList.add("gm-toast--in"));
  });
  setTimeout(() => {
    el.classList.remove("gm-toast--in");
    el.classList.add("gm-toast--out");
    setTimeout(() => el.remove(), 400);
  }, 2200);
}

// ── Card tilt on hover ────────────────────────────────────────
function initCardTilt() {
  const core = document.getElementById("crfCore");
  if (!core || window.matchMedia("(hover: none)").matches) return;

  core.addEventListener("mousemove", e => {
    if (core.classList.contains("crf-collapse")) return;
    const rect = core.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    core.style.transform =
      `perspective(1200px) rotateX(${y * -6}deg) rotateY(${x * 9}deg) translateZ(14px)`;
  });

  core.addEventListener("mouseleave", () => {
    core.style.transform = "";
  });
}

// Init canvas + vocab
initCRFCanvas();
initParallax();
initGamification();
initCardTilt();
updateSortBtns();
loadVocab();
