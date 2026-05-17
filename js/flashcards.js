// ── Constants ──────────────────────────────────────────
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

// ── State ───────────────────────────────────────────────
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

const imgCache = (() => {
  try { return JSON.parse(sessionStorage.getItem("FC_IMG") || "{}"); } catch { return {}; }
})();

// ── UI strings ──────────────────────────────────────────
const UI = {
  ro:{
    title:"🃏 Flashcards",
    tapToFlip:"Atinge ca să vezi răspunsul",
    know:"✓ Știu", dontKnow:"✗ Nu știu",
    summaryTitle:"Sesiune completă!",
    know2:"Știu", dontKnow2:"Nu știu",
    restart:"🔁 Reia",
    noFav:"Nu ai favorite. Adaugă din Glosar!",
    loadError:"Nu am putut încărca vocab-korean.json",
    retry:"Încearcă din nou",
    srsNew:"NOU",
    srsEmpty:"Nicio recapitulare pentru azi 🎉",
    srsNext:"Urm. recapitulare",
    srsDueCards:"carduri",
    srsNextIn:"Mâine",
    srsNextInDays:"Peste {n} zile"
  },
  en:{
    title:"🃏 Flashcards",
    tapToFlip:"Tap to see the answer",
    know:"✓ I know", dontKnow:"✗ Don't know",
    summaryTitle:"Session complete!",
    know2:"Know", dontKnow2:"Don't know",
    restart:"🔁 Restart",
    noFav:"No favorites. Add some in the Glossary!",
    loadError:"Could not load vocab-korean.json",
    retry:"Try again",
    srsNew:"NEW",
    srsEmpty:"Nothing to review today 🎉",
    srsNext:"Next review",
    srsDueCards:"cards",
    srsNextIn:"Tomorrow",
    srsNextInDays:"In {n} days"
  }
};
function t(k){ return UI[currentLang][k] || k; }

// ── SM-2 ────────────────────────────────────────────────
const SRS_KEY = "RK_FC_SRS";

function srsLoad() {
  try { return JSON.parse(localStorage.getItem(SRS_KEY) || "{}"); } catch { return {}; }
}
function srsSave(s) {
  try { localStorage.setItem(SRS_KEY, JSON.stringify(s)); } catch {}
}

function srsUpdate(ko, quality) {
  // quality: 1=fail, 4=good (simplified SM-2)
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

// ── Helpers ─────────────────────────────────────────────
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

// ── Image loading ────────────────────────────────────────
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
async function loadCardImage(word){
  const key = imgKey(word);
  const src = await getWordImage(key);
  const wrap = document.getElementById("fcImgWrap");
  const ph   = document.getElementById("fcImgPh");
  const img  = document.getElementById("fcImgEl");
  if(!wrap) return;
  if(src){
    img.onload  = () => { ph.style.display="none"; img.style.display="block"; };
    img.onerror = () => { wrap.style.display="none"; };
    img.src = src;
  } else { wrap.style.display="none"; }
}
function preloadNext(idx){
  if(idx < deck.length) getWordImage(imgKey(deck[idx]));
}

// ── Deck building ────────────────────────────────────────
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

// ── Speech ───────────────────────────────────────────────
function speakKO(text){
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "ko-KR"; utt.rate = 0.9;
  speechSynthesis.cancel();
  speechSynthesis.speak(utt);
}

// ── Render card ──────────────────────────────────────────
function renderFC(){
  const el = document.getElementById("fcArea");

  if(WORDS.length === 0){
    el.innerHTML = `<div class="card"><p class="sub" style="text-align:center;padding:20px">${t("loadError")}</p></div>`;
    return;
  }
  if(filterFav && deck.length === 0 && getFavs().length === 0){
    el.innerHTML = `<div class="card"><p class="sub" style="text-align:center;padding:20px">${t("noFav")}</p></div>`;
    return;
  }
  if(sortMode === "srs" && deck.length === 0){
    renderSRSEmpty(); return;
  }
  if(cardIndex >= deck.length){
    if(sortMode === "srs" && lapQueue.length > 0){
      deck.push(...lapQueue.splice(0));
    } else {
      renderSummary(); return;
    }
  }

  const word    = deck[cardIndex];
  const done    = knowCount + dontCount;
  const total   = deck.length + (sortMode === "srs" ? lapQueue.length : 0);
  const progPct = total === 0 ? 0 : Math.round(done / total * 100);
  const wColor  = getWordColor(word);
  const cat     = getCat(word);

  const roleBadge = cat && wColor
    ? `<div class="fc-role-badge" style="background:${wColor}22;color:${wColor};border:1.5px solid ${wColor}55">${cat}</div>`
    : "";
  const koStyle = wColor ? `color:${wColor}` : "";

  const srsData = sortMode === "srs" ? srsLoad() : null;
  const isNew   = srsData && !srsData[word.ko];
  const srsTag  = isNew
    ? `<span class="fc-srs-tag fc-srs-new">${t("srsNew")}</span>` : "";

  el.innerHTML = `
    <div class="card" style="padding-bottom:12px">
      <div class="prog-bar"><div class="prog-fill" style="width:${progPct}%"></div></div>
      <div class="prog-text">${done}/${total}</div>

      <div class="fc-scene" id="fcScene" onclick="flipCard()">
        <div class="fc-card" id="fcCard">
          <div class="fc-front">
            ${srsTag}
            ${getDiffDot(word.ko)}
            ${roleBadge}
            <div class="fc-img-wrap" id="fcImgWrap">
              <div class="fc-img-ph" id="fcImgPh"></div>
              <img id="fcImgEl" class="fc-img" alt="">
            </div>
            <div class="fc-ko" style="${koStyle}">${word.ko}</div>
            <div class="fc-hint">${t("tapToFlip")}</div>
          </div>
          <div class="fc-back">
            <div class="fc-meaning">${getMeaning(word) || "—"}</div>
            ${cat ? `<div class="fc-cat" style="${wColor ? `background:${wColor}22;color:${wColor}` : ""}">${cat}</div>` : ""}
            <button class="fc-speak" onclick="event.stopPropagation();speakKO('${word.ko.replace(/'/g,"\\'")}')">🔈 ${word.ko}</button>
          </div>
        </div>
      </div>

      <div class="action-row">
        <button class="btn-dontknow" onclick="answer(false)">${t("dontKnow")}</button>
        <button class="btn-know"     onclick="answer(true)">${t("know")}</button>
      </div>
    </div>`;

  if(flipped) document.getElementById("fcCard").classList.add("flipped");
  loadCardImage(word);
  preloadNext(cardIndex + 1);
}

function flipCard(){
  flipped = !flipped;
  const card = document.getElementById("fcCard");
  if(card) card.classList.toggle("flipped", flipped);
  if(flipped && deck[cardIndex]) speakKO(deck[cardIndex].ko);
}

function answer(knows){
  const word = deck[cardIndex];
  if(word){
    if(!FC_STATS[word.ko]) FC_STATS[word.ko] = {c:0, w:0};
    if(knows) FC_STATS[word.ko].c++; else FC_STATS[word.ko].w++;
    localStorage.setItem("RK_FC_STATS", JSON.stringify(FC_STATS));

    if(sortMode === "srs"){
      srsUpdate(word.ko, knows ? 4 : 1);
      if(!knows && !lapSeen.has(word.ko)){
        lapSeen.add(word.ko);
        lapQueue.push(word);
      }
    }
  }
  if(knows) knowCount++; else dontCount++;
  cardIndex++;
  flipped = false;
  renderFC();
}

// ── SRS empty state ──────────────────────────────────────
function renderSRSEmpty(){
  const el   = document.getElementById("fcArea");
  const next = srsNextDate();
  const label = next ? srsNextLabel(next) : "";
  const pool  = getPool();
  const { fresh } = srsCounts(pool);
  const freshInfo = fresh > 0
    ? `<div class="sub" style="margin-top:6px">${fresh} ${currentLang==="ro"?"cuvinte noi disponibile":"new words available"}</div>`
    : "";
  el.innerHTML = `
    <div class="card" style="text-align:center;padding:40px 24px">
      <div style="font-size:52px;margin-bottom:14px">🎉</div>
      <h2>${t("srsEmpty")}</h2>
      ${next ? `<div class="sub" style="margin-top:8px">${t("srsNext")}: <b>${label}</b></div>` : ""}
      ${freshInfo}
      <button onclick="forceNewCards()" style="margin-top:20px;padding:10px 24px;border-radius:999px;border:none;background:var(--rk-violet);color:#fff;font-weight:900;font-size:14px;cursor:pointer">
        ${currentLang==="ro"?"+ Carduri noi":"+ New cards"}
      </button>
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

// ── Summary ──────────────────────────────────────────────
function renderSummary(){
  const el   = document.getElementById("fcArea");
  const next = sortMode === "srs" ? srsNextDate() : null;

  let nextInfo = "";
  if(next){
    const pool = getPool();
    const s    = srsLoad();
    const nextTs = next.getTime();
    const nextCount = pool.filter(w => s[w.ko] && s[w.ko].due <= nextTs).length;
    nextInfo = `<div class="sub" style="margin-top:10px">
      ${t("srsNext")}: <b>${srsNextLabel(next)}</b> · ${nextCount} ${t("srsDueCards")}
    </div>`;
  }

  el.innerHTML = `
    <div class="card" style="text-align:center">
      <h2 style="margin-bottom:16px">${t("summaryTitle")}</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
        <div style="background:rgba(88,204,2,.12);border:1.5px solid rgba(88,204,2,.30);border-radius:16px;padding:16px">
          <div style="font-size:36px;font-weight:900;color:var(--rk-green)">${knowCount}</div>
          <div style="font-size:12px;color:var(--rk-muted-ui);font-weight:700">${t("know2")}</div>
        </div>
        <div style="background:rgba(255,75,75,.10);border:1.5px solid rgba(255,75,75,.25);border-radius:16px;padding:16px">
          <div style="font-size:36px;font-weight:900;color:var(--rk-red)">${dontCount}</div>
          <div style="font-size:12px;color:var(--rk-muted-ui);font-weight:700">${t("dontKnow2")}</div>
        </div>
      </div>
      ${nextInfo}
      <button onclick="buildDeck();renderFC()" style="margin-top:16px;padding:12px 28px;border-radius:999px;border:none;background:linear-gradient(135deg,#f472b6,#a855f7,#6366f1);color:#fff;font-weight:900;font-size:15px;cursor:pointer">${t("restart")}</button>
    </div>`;
}

// ── UI sync ──────────────────────────────────────────────
function updateSortBtns(){
  const pool = getPool();
  const { due, fresh } = srsCounts(pool);
  const total = due + fresh;
  const srsBtn = document.getElementById("sortSRS");
  if(srsBtn){
    const badge = total > 0 ? ` <span class="srs-count">${total}</span>` : "";
    srsBtn.innerHTML = `📅${badge}`;
    srsBtn.classList.toggle("active", sortMode === "srs");
  }
  document.getElementById("sortRandom").classList.toggle("active", sortMode === "random");
  document.getElementById("sortHard").classList.toggle("active", sortMode === "hard");
  document.getElementById("sortEasy").classList.toggle("active", sortMode === "easy");
}
function updateFilterBtns(){
  document.getElementById("filterFav").classList.toggle("active", filterFav);
}

function setLang(lang){
  currentLang = lang;
  document.getElementById("pageTitle").textContent = t("title");
  updateFilterBtns(); updateSortBtns();
  buildDeck(); renderFC();
}
function setSortMode(mode){
  sortMode = mode;
  localStorage.setItem("RK_FC_SORT", mode);
  updateSortBtns(); buildDeck(); renderFC();
}

// ── Events ───────────────────────────────────────────────
RKLang.init(setLang);
document.getElementById("filterFav").addEventListener("click", () => {
  filterFav = !filterFav; updateFilterBtns(); buildDeck(); renderFC();
});
document.getElementById("sortSRS").addEventListener("click",    () => setSortMode("srs"));
document.getElementById("sortRandom").addEventListener("click", () => setSortMode("random"));
document.getElementById("sortHard").addEventListener("click",   () => setSortMode("hard"));
document.getElementById("sortEasy").addEventListener("click",   () => setSortMode("easy"));

// ── Boot ─────────────────────────────────────────────────
async function loadVocab(){
  document.getElementById("fcArea").innerHTML =
    `<div class="card"><div class="rk-spinner">${currentLang==="ro"?"Se încarcă flashcard-urile…":"Loading flashcards…"}</div></div>`;

  try{
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
    cats.forEach(cat => {
      (vocab[cat]||[]).forEach(e => {
        if(!e.ko) return;
        if(!map.has(e.ko)) map.set(e.ko,{ko:e.ko,ro:e.ro||"",en:e.en||"",categoriesRo:[],categoriesEn:[]});
        const w = map.get(e.ko);
        if(!w.categoriesRo.includes(catLabels[cat].ro)) w.categoriesRo.push(catLabels[cat].ro);
        if(!w.categoriesEn.includes(catLabels[cat].en)) w.categoriesEn.push(catLabels[cat].en);
      });
    });
    WORDS = [...map.values()].sort((a,b)=>a.ko.localeCompare(b.ko,"ko"));
    document.getElementById("pageTitle").textContent = t("title");
    updateSortBtns();
    buildDeck();
    renderFC();
  } catch(e){
    const area = document.getElementById("fcArea");
    area.innerHTML =
      '<div class="card"><div class="rk-load-error">' +
      '<p>' + t("loadError") + '</p>' +
      '<button type="button" id="_retryLoad">' + t("retry") + '</button>' +
      '</div></div>';
    var rb = document.getElementById("_retryLoad");
    if (rb) rb.addEventListener("click", loadVocab);
  }
}

updateSortBtns();
loadVocab();
