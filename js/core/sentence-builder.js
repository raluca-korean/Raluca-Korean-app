/* =========================
   STATE
========================= */

let sentences = [];
let actives = [];

/* =========================
   INIT STRUCT
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

function makeAllActive(){
  return {
    subject: true,
    verb: true,
    object: true,
    time: true
  };
}

/* =========================
   PARTICLES
========================= */

function hasBatchim(word){
  const last = word[word.length - 1];
  const code = last.charCodeAt(0) - 44032;
  return code % 28 !== 0;
}

function subjectParticle(word){
  return hasBatchim(word) ? "이" : "가";
}

function objectParticle(word){
  return hasBatchim(word) ? "을" : "를";
}

function placeParticle(word){
  return "에서";
}

/* =========================
   ENUM (X și Y)
========================= */

function joinWithWa(list){
  if(list.length === 1) return list[0];

  let result = "";

  list.forEach((w, i) => {
    if(i === 0){
      result += w;
    } else if(i < list.length - 1){
      result += "와 " + w;
    } else {
      result += "와 " + w;
    }
  });

  return result;
}

/* =========================
   VERB CONJUGATION (basic safe)
========================= */

function conjugateVerb(verb){

  if(!verb.endsWith("다")){
    verb += "다";
  }

  const stem = verb.slice(0, -1);

  if(stem.endsWith("하")){
    return stem.replace("하", "해요");
  }

  return stem + "요";
}

/* =========================
   BUILD SENTENCE (CORE)
========================= */

function buildSentence(s){

  let result = "";

  /* 1. TIME */
  if(s.time){
    result += s.time + " ";
  }

  /* 2. SUBJECT */
  if(s.subject){

    let subj = s.subject;

    if(s.subjectAdj){
      subj = s.subjectAdj + " " + subj;
    }

    if(subj === "저"){
      result += "제가 ";
    } else {
      result += subj + subjectParticle(subj) + " ";
    }
  }

  /* 3. PLACES */
  if(s.places && s.places.length){

    const p = joinWithWa(s.places);
    result += p + placeParticle(s.places[s.places.length - 1]) + " ";
  }

  /* 4. OBJECTS */
  if(s.objects && s.objects.length){

    let objs = s.objects.map(o => {
      if(s.objectAdj){
        return s.objectAdj + " " + o;
      }
      return o;
    });

    const joined = joinWithWa(objs);

    result += joined + objectParticle(s.objects[s.objects.length - 1]) + " ";
  }

  /* 5. VERBS */
  if(s.verbs && s.verbs.length){

    s.verbs.forEach((v, i) => {

      let verb = v;

      if(!verb.endsWith("다")){
        verb += "다";
      }

      if(i < s.verbs.length - 1){
        result += verb.replace("다","") + "고 ";
      } else {
        result += conjugateVerb(verb);
      }

    });

  }

  return result.trim();
}

/* =========================
   RENDER
========================= */

function renderAll(){

  const s = sentences[0];

  const result = buildSentence(s);

  const output = document.querySelector(".result-korean");

  if(output){
    output.textContent = result;
  }
}
