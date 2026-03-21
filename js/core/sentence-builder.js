/* =========================
   GLOBAL STATE
========================= */

let sentences = [];
let MODE = "manual"; // "manual" | "auto"

/* =========================
   DATA (AUTO MODE)
========================= */

const DATA = {
  subjects: ["저","친구","학생","선생님"],
  places: ["학교","집","카페","회사"],
  objects: ["밥","커피","책","영화"],
  verbs: ["먹다","마시다","읽다","보다","공부하다","일하다"],
  times: ["오늘","어제","내일","지금"]
};

/* =========================
   GRAMMAR ENGINE
========================= */

window.GRAMMAR_ENGINE = {
  connectors: {
    cause: ["아서","니까","기 때문에"],
    sequence: ["고","고 나서"],
    contrast: ["지만"],
    condition: ["면"]
  },
  pick(type){
    const list = this.connectors[type];
    return list ? list[Math.floor(Math.random()*list.length)] : "고";
  }
};

/* =========================
   HELPERS
========================= */

function random(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

function hasBatchim(word){
  if(!word) return false;
  const code = word.charCodeAt(word.length - 1);
  if(code < 44032 || code > 55203) return false;
  return (code - 44032) % 28 !== 0;
}

/* =========================
   SENTENCE STRUCT
========================= */

function makeSentence(){
  return {
    subject: "",
    place: "",
    object: "",
    verb: "",
    time: "",
    reason: false
  };
}

/* =========================
   VERB ENGINE
========================= */

function getStem(v){
  return v.endsWith("다") ? v.slice(0,-1) : v;
}

function decompose(c){
  const code = c.charCodeAt(0);
  if(code < 44032 || code > 55203) return null;
  const base = code - 44032;
  return {
    vowel: Math.floor((base % 588)/28),
    jong: base % 28
  };
}

function present(v){

  if(!v) return "";

  // irregular basic
  if(v === "하다") return "해요";
  if(v === "가다") return "가요";
  if(v === "오다") return "와요";
  if(v === "보다") return "봐요";

  const stem = getStem(v);
  if(!stem) return "";

  const d = decompose(stem[stem.length-1]);
  if(!d) return stem + "어요";

  const A = [0,2,8,9,10,11]; // ㅏ group

  if(d.jong === 0){
    return stem + (A.includes(d.vowel) ? "아요" : "어요");
  }

  return stem + "어요";
}

function buildVerb(v){
  return present(v);
}

/* =========================
   CLAUSE BUILDER
========================= */

function buildClause(s, hideSubject=false){

  const parts = [];

  // TIME
  if(s.time){
    parts.push(s.time);
  }

  // SUBJECT
  if(!hideSubject && s.subject){
    if(s.subject === "저"){
      parts.push("제가");
    } else {
      parts.push(
        s.subject + (hasBatchim(s.subject) ? "은" : "는")
      );
    }
  }

  // PLACE
  if(s.place){
    parts.push(s.place + "에서");
  }

  // OBJECT
  if(s.object){
    parts.push(
      s.object + (hasBatchim(s.object) ? "을" : "를")
    );
  }

  // VERB
  if(s.verb){
    parts.push(buildVerb(s.verb));
  }

  return parts.join(" ");
}

/* =========================
   CONNECTOR LOGIC
========================= */

function chooseConnector(a,b){

  if(a.reason){
    return GRAMMAR_ENGINE.pick("cause");
  }

  if(a.verb === b.verb){
    return "지만";
  }

  if(b.time === "내일"){
    return "면";
  }

  return GRAMMAR_ENGINE.pick("sequence");
}

/* =========================
   SENTENCE ENGINE
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

    result += clause.replace(/요$/,"") + connector + " ";
  }

  return result.trim();
}

/* =========================
   AUTO GENERATOR
========================= */

function generateSentence(){

  const s1 = makeSentence();
  const s2 = makeSentence();

  s1.subject = random(DATA.subjects);
  s1.place = random(DATA.places);
  s1.object = random(DATA.objects);
  s1.verb = random(DATA.verbs);
  s1.time = random(DATA.times);

  s2.object = random(DATA.objects);
  s2.verb = random(DATA.verbs);
  s2.time = random(DATA.times);

  if(Math.random() > 0.5){
    s1.reason = true;
  }

  return [s1, s2];
}

/* =========================
   RENDER
========================= */

function renderAll(){

  let data;

  if(MODE === "auto"){
    data = generateSentence();
  } else {
    data = sentences;
  }

  const result = buildSentence(data);

  const output = document.querySelector(".result-korean");

  if(output){
    output.textContent = result || "(alege cuvinte)";
  }
}
