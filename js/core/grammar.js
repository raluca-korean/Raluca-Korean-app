function hasBatchim(word){
  const lastChar = word[word.length - 1];
  const code = lastChar.charCodeAt(0);

  if(code < 0xAC00 || code > 0xD7A3) return false;

  return (code - 0xAC00) % 28 !== 0;
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
