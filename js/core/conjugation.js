function getVerbStem(verb){
  return verb.replace("다", "");
}

function presentPolite(verb){
  const stem = getVerbStem(verb);

  const lastChar = stem[stem.length - 1];
  const code = lastChar.charCodeAt(0) - 44032;
  const jong = code % 28;

  // fără batchim
  if(jong === 0){
    if(stem.endsWith("하")){
      return stem.slice(0, -1) + "해요";
    }

    if("ㅏㅗ".includes(lastChar)){
      return stem + "아요";
    }

    return stem + "어요";
  }

  // cu batchim
  return stem + "어요";
}

function conjugateVerb(verb, tense){
  if(tense === "present"){
    return presentPolite(verb);
  }
  return verb;
}
