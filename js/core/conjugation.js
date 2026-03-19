function getVerbStem(verb){
  return verb.replace("다", "");
}
function presentPolite(verb){
  const stem = verb.replace("다", "");

  if(stem.endsWith("하")){
    return stem.slice(0, -1) + "해요";
  }

  const lastChar = stem[stem.length - 1];
  const code = lastChar.charCodeAt(0) - 44032;

  const vowel = Math.floor((code % 588) / 28);
  const jong = code % 28;

  if(jong === 0){
    if(vowel === 0 || vowel === 8){
      return stem + "요";
    }
    return stem + "어요";
  }

  return stem + "어요";
}
function conjugateVerb(verb, tense){
  if(tense === "present"){
    return presentPolite(verb);
  }
  return verb;
}
