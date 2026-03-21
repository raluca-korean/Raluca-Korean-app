// =====================
// STEM
// =====================
function getVerbStem(verb){
  if(!verb) return "";
  return verb.endsWith("다") ? verb.slice(0, -1) : verb;
}

// =====================
// INTERNAL SAFE CHECK
// =====================
function decomposeHangul(char){
  const code = char.charCodeAt(0);

  if(code < 44032 || code > 55203){
    return null;
  }

  const base = code - 44032;

  return {
    vowel: Math.floor((base % 588) / 28),
    jong: base % 28
  };
}

// =====================
// PRESENT
// =====================
function presentPolite(verb){

  if(!verb) return "";

  // 🔥 irregular
  if(verb === "하다") return "해요";
  if(verb === "가다") return "가요";
  if(verb === "오다") return "와요";
  if(verb === "보다") return "봐요";

  const stem = getVerbStem(verb);
  if(!stem) return "";

  const lastChar = stem[stem.length - 1];
  const d = decomposeHangul(lastChar);

  if(!d){
    return stem + "어요";
  }

  const A_GROUP = [0,2,8,9,10,11];

  if(d.jong === 0){
    return stem + (A_GROUP.includes(d.vowel) ? "아요" : "어요");
  }

  return stem + "어요";
}

// =====================
// PAST
// =====================
function pastPolite(verb){

  if(!verb) return "";

  if(verb === "하다") return "했어요";
  if(verb === "가다") return "갔어요";
  if(verb === "오다") return "왔어요";
  if(verb === "보다") return "봤어요";

  const stem = getVerbStem(verb);
  if(!stem) return "";

  const lastChar = stem[stem.length - 1];
  const d = decomposeHangul(lastChar);

  if(!d){
    return stem + "었어요";
  }

  const A_GROUP = [0,2,8,9,10,11];

  if(d.jong === 0){
    return stem + (A_GROUP.includes(d.vowel) ? "았어요" : "었어요");
  }

  return stem + "었어요";
}

// =====================
// FUTURE STEM
// =====================
function futureL(verb){

  if(!verb) return "";

  const stem = getVerbStem(verb);
  if(!stem) return "";

  const lastChar = stem[stem.length - 1];
  const d = decomposeHangul(lastChar);

  if(!d){
    return stem + "ㄹ";
  }

  return d.jong === 0 ? stem + "ㄹ" : stem + "을";
}

// =====================
// A/EO HELPER
// =====================
function stemPlusAeo(verb){

  if(verb === "하다") return "해";

  const stem = getVerbStem(verb);
  if(!stem) return "";

  const lastChar = stem[stem.length - 1];
  const d = decomposeHangul(lastChar);

  if(!d){
    return stem + "어";
  }

  const A_GROUP = [0,2,8,9,10,11];

  if(d.jong === 0){
    return stem + (A_GROUP.includes(d.vowel) ? "아" : "어");
  }

  return stem + "어";
}

// =====================
// CORE CONJUGATION
// =====================
function conjugateVerb(verb, tense="present", politeness="haeyo"){

  if(!verb) return "";

  let result = "";

  if(tense === "present") result = presentPolite(verb);
  if(tense === "past") result = pastPolite(verb);
  if(tense === "future") result = futureL(verb) + " 거예요";

  // informal
  if(politeness === "informal"){
    result = result.replace("요","");
  }

  // formal
  if(politeness === "formal"){
    const stem = getVerbStem(verb);
    if(!stem) return "";

    const d = decomposeHangul(stem[stem.length - 1]);

    if(!d){
      return stem + "습니다";
    }

    return d.jong === 0 ? stem + "ㅂ니다" : stem + "습니다";
  }

  return result;
}

// =====================
// FINAL VERB BUILDER
// =====================
function buildVerbPhrase(dictVerb, state){

  if(!dictVerb) return "";

  const stem = getVerbStem(dictVerb);

  const cj = state?.conjug;
  const tense = state?.tense || "present";
  const politeness = state?.politeness || "haeyo";

  // =====================
  // NO CJ
  // =====================
  if(!cj){
    return conjugateVerb(dictVerb, tense, politeness);
  }

  // =====================
  // BASIC
  // =====================
  if(cj === "-아요/어요") return presentPolite(dictVerb);
  if(cj === "-았어요/었어요") return pastPolite(dictVerb);

  // =====================
  // FUTURE
  // =====================
  if(cj === "-(으)ㄹ 거예요"){
    return futureL(dictVerb) + " 거예요";
  }

  if(cj === "-(으)ㄹ게요") return futureL(dictVerb) + "게요";
  if(cj === "-(으)ㄹ래요?") return futureL(dictVerb) + "래요?";
  if(cj === "-(으)ㄹ까요?") return futureL(dictVerb) + "까요?";

  // =====================
  // ABILITY
  // =====================
  if(cj === "-(으)ㄹ 수 있어요") return futureL(dictVerb) + " 수 있어요";
  if(cj === "-(으)ㄹ 수 없어요") return futureL(dictVerb) + " 수 없어요";

  // =====================
  // PROGRESSIVE
  // =====================
  if(cj === "-고 있어요") return stem + "고 있어요";

  // =====================
  // DESIRE
  // =====================
  if(cj === "-고 싶어요") return stem + "고 싶어요";

  // =====================
  // PROHIBITION
  // =====================
  if(cj === "-지 마세요") return stem + "지 마세요";

  // =====================
  // REQUEST
  // =====================
  if(cj === "-아/어 주세요") return stemPlusAeo(dictVerb) + " 주세요";

  // =====================
  // OBLIGATION
  // =====================
  if(cj === "-아/어야 돼요") return stemPlusAeo(dictVerb) + "야 돼요";

  // =====================
  // PERMISSION
  // =====================
  if(cj === "-아/어도 돼요") return stemPlusAeo(dictVerb) + "도 돼요";

  // =====================
  // GRAMMAR ENGINE
  // =====================
  if(state?.grammar?.type && window.GRAMMAR_ENGINE){
    const connector = window.GRAMMAR_ENGINE.pick(state.grammar.type);
    return stem + connector;
  }

  // =====================
  // FALLBACK
  // =====================
  return conjugateVerb(dictVerb, tense, politeness);
}
