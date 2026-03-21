function getVerbStem(verb){
  return verb.replace("다", "");
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
