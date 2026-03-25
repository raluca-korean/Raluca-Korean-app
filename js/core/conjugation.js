window.Conjugation = {

  // =====================
  // STEM
  // =====================
  stem(verb){
    if(!verb) return "";
    return verb.endsWith("다") ? verb.slice(0,-1) : verb;
  },

  // =====================
  // HANGUL
  // =====================
  decompose(char){

    const code = char.charCodeAt(0);

    if(code < 44032 || code > 55203){
      return null;
    }

    const base = code - 44032;

    return {
      vowel: Math.floor((base % 588) / 28),
      jong: base % 28
    };
  },

  hasBatchim(word){
    if(!word) return false;

    const code = word.charCodeAt(word.length - 1);

    if(code < 44032 || code > 55203) return false;

    return (code - 44032) % 28 !== 0;
  },

  // =====================
  // PRESENT
  // =====================
  present(verb){

    if(!verb) return "";

    if(verb === "하다") return "해요";
    if(verb === "가다") return "가요";
    if(verb === "오다") return "와요";
    if(verb === "보다") return "봐요";

    const stem = this.stem(verb);
    const d = this.decompose(stem.at(-1));

   
