let currentLang = RKLang.current;
let WORDS = [];
let deck = [];
let cardIndex = 0;
let knowCount = 0;
let dontCount = 0;
let flipped = false;
let filterFav = false;

const UI = {
  ro:{
    title:"🃏 Flashcards", subtitle:"Apasă pe card ca să-l întorci",
    tapToFlip:"Atinge ca să vezi răspunsul",
    know:"✓ Știu", dontKnow:"✗ Nu știu",
    filterAll:"Toate", filterFav:"⭐ Favorite",
    progress:"Progres",
    summaryTitle:"Sesiune completă!",
    know2:"Știu", dontKnow2:"Nu știu",
    restart:"🔁 Reia",
    noFav:"Nu ai favorite. Adaugă din Glosar!",
    loadError:"Nu am putut încărca vocab-korean.json"
  },
  en:{
    title:"🃏 Flashcards", subtitle:"Tap the card to flip it",
    tapToFlip:"Tap to see the answer",
    know:"✓ I know", dontKnow:"✗ Don't know",
    filterAll:"All", filterFav:"⭐ Favorites",
    progress:"Progress",
    summaryTitle:"Session complete!",
    know2:"Know", dontKnow2:"Don't know",
    restart:"🔁 Restart",
    noFav:"No favorites. Add some in the Glossary!",
    loadError:"Could not load vocab-korean.json"
  }
};

function t(k){ return UI[currentLang][k]; }

function escapeAttr(str){
  return String(str).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function getMeaning(w){ return currentLang === "ro" ? w.ro : w.en; }
function getCat(w){ return currentLang === "ro" ? (w.categoriesRo||[])[0] : (w.categoriesEn||[])[0]; }

function getFavs(){ return JSON.parse(localStorage.getItem("FAV_WORDS") || "[]"); }

function buildDeck(){
  let pool = WORDS;
  if(filterFav){
    const favs = getFavs();
    pool = WORDS.filter(w => favs.includes(w.ko));
  }
  deck = [...pool].sort(() => Math.random() - 0.5);
  cardIndex = 0;
  knowCount = 0;
  dontCount = 0;
  flipped = false;
}

function speakKO(text){
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "ko-KR"; utt.rate = 0.9;
  speechSynthesis.cancel();
  speechSynthesis.speak(utt);
}

function renderFC(){
  const el = document.getElementById("fcArea");

  if(WORDS.length === 0){
    el.innerHTML = `<div class="card"><div style="text-align:center;color:var(--muted);padding:20px">${t("loadError")}</div></div>`;
    return;
  }

  if(filterFav && deck.length === 0 && getFavs().length === 0){
    el.innerHTML = `<div class="card"><div style="text-align:center;color:var(--muted);padding:20px">${t("noFav")}</div></div>`;
    return;
  }

  if(cardIndex >= deck.length){
    renderSummary();
    return;
  }

  const word = deck[cardIndex];
  const done = knowCount + dontCount;
  const progPct = deck.length === 0 ? 0 : Math.round(done / deck.length * 100);

  el.innerHTML = `
    <div class="card" style="padding-bottom:12px">
      <div class="prog-bar"><div class="prog-fill" style="width:${progPct}%"></div></div>
      <div class="prog-text">${done}/${deck.length}</div>

      <div class="fc-scene" id="fcScene" onclick="flipCard()">
        <div class="fc-card" id="fcCard">
          <div class="fc-front">
            <div class="fc-ko">${word.ko}</div>
            <div class="fc-hint">${t("tapToFlip")}</div>
          </div>
          <div class="fc-back">
            <div class="fc-meaning">${getMeaning(word) || "—"}</div>
            ${getCat(word) ? `<div class="fc-cat">${getCat(word)}</div>` : ""}
            <button class="fc-speak" data-speak="${escapeAttr(word.ko)}">🔈 ${word.ko}</button>
          </div>
        </div>
      </div>

      <div class="action-row">
        <button class="btn-dontknow" onclick="answer(false)">${t("dontKnow")}</button>
        <button class="btn-know" onclick="answer(true)">${t("know")}</button>
      </div>
    </div>`;

  if(flipped) document.getElementById("fcCard").classList.add("flipped");
}

function flipCard(){
  flipped = !flipped;
  const card = document.getElementById("fcCard");
  if(card) card.classList.toggle("flipped", flipped);
  if(flipped && deck[cardIndex]) speakKO(deck[cardIndex].ko);
}

function answer(knows){
  if(knows) knowCount++; else dontCount++;
  cardIndex++;
  flipped = false;
  renderFC();
}

function renderSummary(){
  const el = document.getElementById("fcArea");
  el.innerHTML = `
    <div class="card" style="text-align:center">
      <h2 style="margin-bottom:16px">${t("summaryTitle")}</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
        <div class="stat-box" style="background:rgba(34,197,94,.10);border:1.5px solid rgba(34,197,94,.25);border-radius:16px;padding:16px">
          <div style="font-size:36px;font-weight:900;color:#16a34a">${knowCount}</div>
          <div style="font-size:12px;color:var(--muted);font-weight:700">${t("know2")}</div>
        </div>
        <div class="stat-box" style="background:rgba(244,63,94,.10);border:1.5px solid rgba(244,63,94,.25);border-radius:16px;padding:16px">
          <div style="font-size:36px;font-weight:900;color:#e11d48">${dontCount}</div>
          <div style="font-size:12px;color:var(--muted);font-weight:700">${t("dontKnow2")}</div>
        </div>
      </div>
      <button onclick="buildDeck();renderFC()" style="padding:12px 28px;border-radius:999px;border:none;background:linear-gradient(135deg,#f472b6,#a855f7,#6366f1);color:#fff;font-weight:900;font-size:15px;cursor:pointer">${t("restart")}</button>
    </div>`;
}

function setLang(lang){
  currentLang = lang;
  RKLang.set(lang);
  updateFilterBtns();
  document.getElementById("pageTitle").textContent = t("title");
  document.getElementById("pageSubtitle").textContent = t("subtitle");
  document.getElementById("filterAll").textContent = t("filterAll");
  document.getElementById("filterFav").textContent = t("filterFav");
  buildDeck();
  renderFC();
}


function updateFilterBtns(){
  document.getElementById("filterAll").classList.toggle("active", !filterFav);
  document.getElementById("filterFav").classList.toggle("active", filterFav);
}

RKLang.init(setLang);
document.getElementById("filterAll").addEventListener("click", () => {
  filterFav = false; updateFilterBtns(); buildDeck(); renderFC();
});
document.getElementById("filterFav").addEventListener("click", () => {
  filterFav = true; updateFilterBtns(); buildDeck(); renderFC();
});

async function loadVocab(){
  try{
    const resp = await fetch("./data/vocab-korean.json");
    if(!resp.ok) throw new Error(resp.status);
    const vocab = await resp.json();
    const map = new Map();
    const cats = ["subjects","nouns","objects","verbs","adjectives","adverbs","modifiers","connectors","grammar"];
    const catLabels = {
      subjects:{ro:"Subiect",en:"Subject"},nouns:{ro:"Substantiv",en:"Noun"},
      objects:{ro:"Obiect",en:"Object"},verbs:{ro:"Verb",en:"Verb"},
      adjectives:{ro:"Adjectiv",en:"Adjective"},adverbs:{ro:"Adverb",en:"Adverb"},
      modifiers:{ro:"Modificator",en:"Modifier"},connectors:{ro:"Conector",en:"Connector"},
      grammar:{ro:"Gramatică",en:"Grammar"}
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
    buildDeck();
    renderFC();
  } catch(e){
    document.getElementById("fcArea").innerHTML = `<div class="card"><div style="text-align:center;color:var(--muted);padding:20px">${t("loadError")}</div></div>`;
  }
}

document.getElementById("fcArea").addEventListener("click", function(e){
  const btn = e.target.closest("[data-speak]");
  if(btn){ e.stopPropagation(); speakKO(btn.dataset.speak); }
});

document.getElementById("pageTitle").textContent = t("title");
document.getElementById("pageSubtitle").textContent = t("subtitle");
document.getElementById("filterAll").textContent = t("filterAll");
document.getElementById("filterFav").textContent = t("filterFav");
loadVocab();
