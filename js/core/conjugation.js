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
