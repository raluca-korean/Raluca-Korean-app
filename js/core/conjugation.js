function getVerbStem(verb){
  return verb.endsWith("다") ? verb.slice(0, -1) : verb;
}

// =====================
// PRESENT
// =====================
function presentPolite(verb){

  if(verb === "하다") return "해요";

  const stem = getVerbStem(verb);
  const last = stem.charCodeAt(stem.length - 1) - 44032;

  const vowel = Math.floor((last % 588) / 28);
  const jong = last % 28;

  const A_GROUP = [0,2,8]; // ㅏ,ㅑ,ㅗ

  if(jong === 0){
    return stem + (A_GROUP.includes(vowel) ? "아요" : "어요");
  }

  return stem + "어요";
}

// =====================
// PAST
// =====================
function pastPolite(verb){

  if(verb === "하다") return "했어요";

  const stem = getVerbStem(verb);
  const last = stem.charCodeAt(stem.length - 1) - 44032;

  const vowel = Math.floor((last % 588) / 28);
  const jong = last % 28;

  const A_GROUP = [0,2,8];

  if(jong === 0){
    return stem + (A_GROUP.includes(vowel) ? "았어요" : "었어요");
  }

  return stem + "었어요";
}

// =====================
// FUTURE
// =====================
function futureL(verb){

  const stem = getVerbStem(verb);
  const last = stem.charCodeAt(stem.length - 1) - 44032;
  const jong = last % 28;

  return jong === 0 ? stem + "ㄹ" : stem + "을";
}

// =====================
// CORE CONJUGATION
// =====================
function conjugateVerb(verb, tense="present", politeness="haeyo"){

  let result = "";

  if(tense === "present") result = presentPolite(verb);
  if(tense === "past") result = pastPolite(verb);
  if(tense === "future") result = futureL(verb) + " 거예요";

  // politeness
  if(politeness === "informal"){
    result = result.replace("요","");
  }

  if(politeness === "formal"){
    const stem = getVerbStem(verb);
    const last = stem.charCodeAt(stem.length - 1) - 44032;
    const jong = last % 28;

    result = jong === 0 ? stem + "ㅂ니다" : stem + "습니다";
  }

  return result;
}

// =====================
// MAIN BUILDER
// =====================
function buildVerbPhrase(dictVerb, state){

  if(!dictVerb) return "";

  const stem = getVerbStem(dictVerb);
  const cj = state?.conjug;
  const tense = state?.tense || "present";
  const politeness = state?.politeness || "haeyo";

  // fără conjugare → smart
  if(!cj){
    return conjugateVerb(dictVerb, tense, politeness);
  }

  // BASIC
  if(cj === "-아요/어요") return presentPolite(dictVerb);
  if(cj === "-았어요/었어요") return pastPolite(dictVerb);

  // FUTURE
  if(cj === "-(으)ㄹ 거예요"){
    return futureL(dictVerb) + " 거예요";
  }

  // PROGRESSIVE
  if(cj === "-고 있어요") return stem + "고 있어요";

  // DESIRE
  if(cj === "-고 싶어요") return stem + "고 싶어요";

  // GRAMMAR ENGINE
  if(state?.grammar?.type){
    const connector = GRAMMAR_ENGINE.pick(state.grammar.type);
    return stem + connector;
  }

  // fallback
  return conjugateVerb(dictVerb, tense, politeness);
}


// =====================
// CONJUGATION CORE
// =====================
function conjugateVerb(verb, tense, politeness){

  let result = "";

  if(tense === "present"){
    result = presentPolite(verb);
  }

  if(tense === "past"){
    result = pastPolite(verb);
  }

  if(tense === "future"){
    result = futureL(verb) + " 거예요";
  }

  // =====================
  // POLITENESS
  // =====================

  if(politeness === "informal"){
    result = result.replace("요","");
  }

  if(politeness === "formal"){

    const stem = getVerbStem(verb);
    const last = stem.charCodeAt(stem.length - 1) - 44032;
    const jong = last % 28;

    if(jong === 0){
      result = stem + "ㅂ니다";
    }else{
      result = stem + "습니다";
    }
  }

  return result;
}
function presentPolite(verb){
  // eliminăm "다"
  const stem = verb.replace("다", "");

  // 🔥 caz special: 하다 → 해요
  if(stem.endsWith("하")){
    return stem.slice(0, -1) + "해요";
  }

  const lastChar = stem[stem.length - 1];
  const code = lastChar.charCodeAt(0) - 44032;

  const vowel = Math.floor((code % 588) / 28); // vocală
  const jong = code % 28; // batchim

  // 🔥 fără batchim
  if(jong === 0){
    // ㅏ sau ㅗ
    if(vowel === 0 || vowel === 8){
      return stem + "요";      // 가 → 가요
    }
    return stem + "어요";     // 서 → 서요 (ex: 마셔요)
  }

  // 🔥 cu batchim
  return stem + "어요";       // 먹 → 먹어요
}
function buildVerbPhrase(dictVerb, state){

  if(!dictVerb) return "";

  const stem = getVerbStem(dictVerb);
  const cj = state?.conjug;
  const tense = state?.tense || "present";
  const politeness = state?.politeness || "haeyo";

  // 🔥 fără cj → sistem inteligent
  if(!cj){
    return conjugateVerb(dictVerb, tense, politeness);
  }

  // BASIC
  if(cj === "-아요/어요") return presentPolite(dictVerb);
  if(cj === "-았어요/었어요") return pastPolite(dictVerb);

  // FUTURE
  if(cj === "-(으)ㄹ 거예요") return futureL(dictVerb) + " 거예요";

  // PROGRESSIVE
  if(cj === "-고 있어요") return stem + "고 있어요";

  // DESIRE
  if(cj === "-고 싶어요") return stem + "고 싶어요";

  // 🔥 GRAMMAR ENGINE (TOPIK)
  if(state?.grammar?.type){
    const connector = GRAMMAR_ENGINE.pickConnector(state.grammar.type);
    return stem + connector;
  }

  return conjugateVerb(dictVerb, tense, politeness);
}

function conjugateVerb(verb, tense){
  if(tense === "present"){
    return presentPolite(verb);
  }
  return verb;
}
function applyGrammar(verb, grammar){

  const stem = verb.replace("다","");

  if(grammar === "-(으)ㄴ/는데도"){
    return stem + "는데도";
  }

  return conjugateVerb(verb, "present");
}
