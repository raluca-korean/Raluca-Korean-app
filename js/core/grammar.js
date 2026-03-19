function hasBatchim(word){
  const lastChar = word[word.length - 1];
  const code = lastChar.charCodeAt(0);

  if(code < 0xAC00 || code > 0xD7A3) return false;

  return (code - 0xAC00) % 28 !== 0;
}

function subjectParticle(word){
  if(word === "저") return "가"; // special case handled later

  const lastChar = word[word.length - 1];
  const code = lastChar.charCodeAt(0) - 44032;
  const jong = code % 28;

  return jong === 0 ? "가" : "이";
}

function objectParticle(word){
  return hasBatchim(word) ? "을" : "를";
}

function placeParticle(word){
  return "에서";
}
