/* ============================================================
   BUILDER PAGE (FINAL CLEAN VERSION)
============================================================ */

/* =========================
   GLOBAL STATE
========================= */

let sentences = [];
let actives = [];
let CURRENT_LANG = "ro";

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", async () => {

  await loadVocabulary();   // 🔥 din vocabulary.js

  initBuilderPage();

});

/* =========================
   TRANSLATION HELPER
========================= */

function tr(type, word){

  if(!word) return "";

  const entry = window.KOREAN_TRANSLATIONS?.[type]?.[word];

  if(!entry) return word;

  return entry[CURRENT_LANG] || word;
}

/* =========================
   INIT BUILDER
========================= */

function initBuilderPage(){

  sentences = [ makeEmptySentence() ];
  actives   = [ makeAllActive() ];

  setupUI();
  buildTableFromVocab();

  renderAll();
}

/* =========================
   STRUCT
========================= */

function makeEmptySentence(){
  return {
    subject:"",
    time:"",
    place:"",
    object:"",
    verb:"",
    conjug:""
  };
}

function makeAllActive(){
  return {
    subject:true,
    time:true,
    place:true,
    object:true,
    verb:true,
    conjug:true
  };
}

/* =========================
   VOCAB (DIN GLOBAL)
========================= */

const subjects = window.KOREAN_VOCAB.subjects;
const times    = window.KOREAN_VOCAB.times;
const places   = window.KOREAN_VOCAB.places;
const objects  = window.KOREAN_VOCAB.objects;
const verbs    = window.KOREAN_VOCAB.verbs;

/* =========================
   TABLE BUILDER (FIXED)
========================= */

function buildTableFromVocab(){

  const table = document.getElementById("tableP1");

  if(!table) return;

  table.innerHTML = "";

  const map = {
    subject: subjects,
    time: times,
    place: places,
    object: objects,
    verb: verbs
  };

  Object.entries(map).forEach(([type, list]) => {

    if(!list || !list.length) return;

    const col = document.createElement("div");
    col.className = "col";

    let index = 0;

    function updateUI(){
      const word = list[index];

      col.innerHTML = `
        <div>${word}</div>
        <small>${tr(type, word)}</small>
      `;
    }

    col.addEventListener("click", () => {

      index = (index + 1) % list.length;

      updateUI();

      updateSentence(type, list[index]);

    });

    updateUI();
    table.appendChild(col);

  });

}

/* =========================
   UPDATE SENTENCE
========================= */

function updateSentence(key, value){

  const s = sentences[0];

  s[key] = value;

  renderAll();
}

/* =========================
   KOREAN BUILD
========================= */

function buildKoreanSentence(s){

  if(!s) return "";

  const parts = [];

  if(s.time)   parts.push(s.time);
  if(s.subject) parts.push(s.subject + "는");
  if(s.place)  parts.push(s.place + "에서");
  if(s.object) parts.push(s.object + "을");

  if(s.verb){
    parts.push(s.verb.replace("다","아요"));
  }

  return parts.join(" ");
}

/* =========================
   TRANSLATION BUILD
========================= */

function buildNaturalSentence(s){

  if(!s) return "";

  const parts = [];

  if(s.time)   parts.push(tr("time", s.time));
  if(s.subject) parts.push(tr("subject", s.subject));
  if(s.place)  parts.push(tr("place", s.place));
  if(s.object) parts.push(tr("object", s.object));
  if(s.verb)   parts.push(tr("verb", s.verb));

  return parts.join(" ");
}

/* =========================
   FULL TRANSLATION
========================= */

function buildFullTranslation(){

  const parts = [];

  for(let i=0;i<sentences.length;i++){

    const s = sentences[i];
    if(!s) continue;

    const txt = buildNaturalSentence(s);

    if(txt) parts.push(txt);
  }

  return parts.join(" ");
}

/* =========================
   RENDER
========================= */

function renderAll(){

  const s = sentences[0];

  const ko = buildKoreanSentence(s);
  const trText = buildFullTranslation();

  const koEl = document.getElementById("previewKo");
  const roEl = document.getElementById("previewRo");

  if(koEl){
    koEl.textContent = ko || "(alege cuvinte)";
  }

  if(roEl){
    roEl.textContent = trText;
  }
}

/* =========================
   UI
========================= */

function setupUI(){

  const langRoBtn = document.getElementById("langRo");
  const langEnBtn = document.getElementById("langEn");

  if(langRoBtn && langEnBtn){

    langRoBtn.addEventListener("click", ()=>{
      CURRENT_LANG = "ro";
      langRoBtn.classList.add("active");
      langEnBtn.classList.remove("active");
      renderAll();
    });

    langEnBtn.addEventListener("click", ()=>{
      CURRENT_LANG = "en";
      langEnBtn.classList.add("active");
      langRoBtn.classList.remove("active");
      renderAll();
    });
  }
}
