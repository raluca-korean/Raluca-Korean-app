

/* =========================
   STRUCT (COMPATIBIL CU UI)
========================= */

function makeEmptySentence(){
  return {
    subject: "",
    subjectAdj: "",
    places: [],
    objects: [],
    objectAdj: "",
    verbs: [],
    time: "",
    conjugation: ""
  };
}

/* =========================
   HELPERS
========================= */

function cleanJoin(arr){
  return arr.filter(Boolean).join(" ").replace(/\s+/g," ").trim();
}

function stripEnding(text){
  return (text || "").replace(/요$|니다$|습니다$/,"");
}

function hasBatchim(word){
  if(!word) return false;

  const code = word.charCodeAt(word.length - 1);
  if(code < 44032 || code > 55203) return false;

  return (code - 44032) % 28 !== 0;
}

/* =========================
   PARTICLES
========================= */

function topicParticle(word){
  return hasBatchim(word) ? "은" : "는";
}

function subjectParticle(word){
  return hasBatchim(word) ? "이" : "가";
}

function objectParticle(word){
  return hasBatchim(word) ? "을" : "를";
}

/* =========================
   ENUM (X și Y)
========================= */

function joinWithWa(list){
  if(!list || !list.length) return "";

  if(list.length === 1) return list[0];

  return list.map((w,i)=>{
    if(i === 0) return w;
    return "와 " + w;
  }).join(" ");
}

/* =========================
   VERB ENGINE (SAFE)
========================= */

function getStem(v){
  return v && v.endsWith("다") ? v.slice(0,-1) : v || "";
}

function decompose(c){
  if(!c) return null;

  const code = c.charCodeAt(0);
  if(code < 44032 || code > 55203) return null;

  const base = code - 44032;

  return {
    vowel: Math.floor((base % 588)/28),
    jong: base % 28
  };
}

function presentPolite(v){

  if(!v) return "";

  if(v === "하다") return "해요";
  if(v === "가다") return "가요";
  if(v === "오다") return "와요";
  if(v === "보다") return "봐요";

  const stem = getStem(v);
  if(!stem) return "";

  const d = decompose(stem[stem.length-1]);
  if(!d) return stem + "어요";

  const A = [0,2,8,9,10,11];

  if(d.jong === 0){
    return stem + (A.includes(d.vowel) ? "아요" : "어요");
  }

  return stem + "어요";
}

/* =========================
   VERB BUILDER
========================= */
function buildVerbPhrase(v, grammar){

  if(!v) return "";

  const stem = getStem(v);

  if(!grammar){
    return presentPolite(v);
  }

  const g = grammar.ko || "";

  // 🔥 TOPIK 6 patterns

  if(g.includes("고 나서")){
    return stem + "고 나서";
  }

  if(g.includes("기 때문에")){
    return stem + "기 때문에";
  }

  if(g.includes("려고")){
    return stem + "려고 합니다";
  }

  if(g.includes("고 있다")){
    return stem + "고 있습니다";
  }

  if(g.includes("지만")){
    return presentPolite(v) + "지만";
  }

  return presentPolite(v);
}
/* =========================
   CLAUSE BUILDER (CORE)
========================= */

function buildClause(s, hideSubject=false){

  const parts = [];

  /* TIME */
  if(s.time){
    parts.push(s.time);
  }

  /* SUBJECT */
  if(!hideSubject && s.subject){

    let subj = s.subject;

    if(s.subjectAdj){
      subj = s.subjectAdj + " " + subj;
    }

    if(subj === "저"){
      parts.push("제가");
    } else {
      parts.push(subj + topicParticle(subj));
    }
  }

  /* PLACES */
  if(s.places && s.places.length){
    const p = joinWithWa(s.places);
    parts.push(p + "에서");
  }

  /* OBJECTS */
  if(s.objects && s.objects.length){

    const objs = s.objects.map(o=>{
      if(s.objectAdj){
        return s.objectAdj + " " + o;
      }
      return o;
    });

    const joined = joinWithWa(objs);

    parts.push(joined + objectParticle(s.objects[s.objects.length-1]));
  }

  /* VERBS */
  if(s.verbs && s.verbs.length){

    s.verbs.forEach((v,i)=>{

      if(i < s.verbs.length - 1){
        parts.push(getStem(v) + "고");
      } else {
        parts.push(buildVerbPhrase(v, s.grammar));
      }

    });
  }
/* GRAMMAR FINAL */
if(s.grammar && (!s.verbs || s.verbs.length === 0)){
  parts.push(s.grammar.ko);
}
   return cleanJoin(parts);
}

/* =========================
   CONNECTOR LOGIC
========================= */
function chooseConnector(prev,next){

  if(!prev || !next) return "고";

  // dacă avem grammar explicit → NU suprascrie
  if(prev.grammar){
    return "";
  }

  if(prev.reason){
    return "기 때문에";
  }

if(prev.verbs?.[0] === next.verbs?.[0]){
  return prev.grammar ? "" : "지만";
}
   if(next.time && next.time.includes("내일")){
    return "면";
  }

  return "고";
}
/* =========================
   FINAL SENTENCE ENGINE
========================= */

function buildSentence(list){

  if(!list || !list.length) return "";

  let result = "";

  for(let i=0;i<list.length;i++){

    const clause = buildClause(list[i], i>0);

    if(!clause) continue;

    if(i === list.length - 1){
      result += clause;
      break;
    }

    const next = list[i+1];

    const connector = chooseConnector(list[i], next);
if(connector){
  result += stripEnding(clause) + connector + " ";
} else {
  result += clause + " ";
}
  }

  return cleanJoin([result]);
}

/* =========================
   RENDER (LEGAT DE UI)
========================= */

function renderAll(){

  const result = buildSentence(sentences);

  const output = document.querySelector(".result-korean");

  if(output){
    output.textContent = result || "(alege cuvinte)";
  }
}
