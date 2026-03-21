

function getVerbStem(verb){
  return verb.endsWith("다") ? verb.slice(0, -1) : verb;
}

function presentPolite(verb){

  if(verb === "하다") return "해요";

  const stem = getVerbStem(verb);
  const last = stem.charCodeAt(stem.length - 1) - 44032;

  const vowel = Math.floor((last % 588) / 28);
  const jong = last % 28;

  const A_GROUP = [0,2,8];

  if(jong === 0){
    return stem + (A_GROUP.includes(vowel) ? "아요" : "어요");
  }

  return stem + "어요";
}

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

function futureL(verb){

  const stem = getVerbStem(verb);
  const last = stem.charCodeAt(stem.length - 1) - 44032;
  const jong = last % 28;

  return jong === 0 ? stem + "ㄹ" : stem + "을";
}

function conjugateVerb(verb, tense="present", politeness="haeyo"){

  let result = "";

  if(tense === "present") result = presentPolite(verb);
  if(tense === "past") result = pastPolite(verb);
  if(tense === "future") result = futureL(verb) + " 거예요";

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

function buildVerbPhrase(dictVerb, state){

  if(!dictVerb) return "";

  const stem = getVerbStem(dictVerb);
  const cj = state?.conjug;
  const tense = state?.tense || "present";
  const politeness = state?.politeness || "haeyo";

  if(!cj){
    return conjugateVerb(dictVerb, tense, politeness);
  }

  if(cj === "-아요/어요") return presentPolite(dictVerb);
  if(cj === "-았어요/었어요") return pastPolite(dictVerb);

  if(cj === "-(으)ㄹ 거예요"){
    return futureL(dictVerb) + " 거예요";
  }

  if(cj === "-고 있어요") return stem + "고 있어요";
  if(cj === "-고 싶어요") return stem + "고 싶어요";

  if(state?.grammar?.type){
    const connector = GRAMMAR_ENGINE.pick(state.grammar.type);
    return stem + connector;
  }

  return conjugateVerb(dictVerb, tense, politeness);
}
