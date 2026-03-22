/* ============================================================
   VOCABULARY ENGINE (FINAL STABLE)
   - sursă unică: JSON (./data/vocab-korean.json)
   - fallback dacă JSON nu se încarcă
   - expune global: window.KOREAN_VOCAB
   ============================================================ */

let GLOBAL_VOCAB = null;

/* =========================
   FALLBACK (siguranță)
========================= */

const FALLBACK_VOCAB = {

  subjects: ["저","너","그","우리","사람"],
  objects: ["밥","물","책","영화","음식"],
  verbs: ["먹다","마시다","읽다","보다","가다","오다"],
  times: ["오늘","어제","내일","지금"],
  places: ["집","학교","회사","카페"],
  modifiers: ["빨리","천천히","조용히"],
  conjugations: ["-아요/어요","-았어요/었어요","-고","-기 때문에"]

};

/* =========================
   LOAD VOCABULARY (ASYNC)
========================= */

async function loadVocabulary(){

  try{

    const res = await fetch("./data/vocab-korean.json");

    if(!res.ok){
      throw new Error("Fetch failed");
    }

    const data = await res.json();

    GLOBAL_VOCAB = normalizeVocab(data);

    window.KOREAN_VOCAB = GLOBAL_VOCAB;

    console.log("✅ VOCAB LOADED:", GLOBAL_VOCAB);

    return GLOBAL_VOCAB;

  }catch(err){

    console.error("❌ VOCAB LOAD ERROR → fallback used", err);

    GLOBAL_VOCAB = FALLBACK_VOCAB;

    window.KOREAN_VOCAB = FALLBACK_VOCAB;

    return FALLBACK_VOCAB;
  }
}

/* =========================
   NORMALIZE (important)
========================= */

function normalizeVocab(data){

  return {

    subjects: data.subjects || [],
    objects: data.objects || [],
    verbs: data.verbs || [],
    times: data.times || [],
    places: data.places || [],
    modifiers: data.modifiers || [],
    conjugations: data.conjugations || []

  };
}

/* =========================
   GETTERS SAFE
========================= */

function getVocab(type){

  if(!window.KOREAN_VOCAB){
    console.warn("⚠️ vocab not loaded yet");
    return [];
  }

  return window.KOREAN_VOCAB[type] || [];
}

/* =========================
   ADD WORD (dynamic)
========================= */

function addVocabWord(type, word){

  if(!word || !type) return;

  if(!window.KOREAN_VOCAB[type]){
    window.KOREAN_VOCAB[type] = [];
  }

  if(!window.KOREAN_VOCAB[type].includes(word)){
    window.KOREAN_VOCAB[type].push(word);
  }

}

/* =========================
   EXPORT GLOBAL
========================= */

window.loadVocabulary = loadVocabulary;
window.getVocab = getVocab;
window.addVocabWord = addVocabWord;
