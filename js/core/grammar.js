window.GRAMMAR_ENGINE = {

  // =====================
  // CONNECTORS
  // =====================
  connectors: {

    cause: ["-아서","-기에","-니까"],
    contrast: ["-지만","-(으)ㄴ/는데도"],
    sequence: ["-고 나서","-기 전에"],
    simultaneous: ["-(으)면서","-(으)며"],
    condition: ["-면"],
    background: ["-는데"],
    result: ["-니까","-게 되다"],
    purpose: ["-(으)려고"],
    attempt: ["-아/어 보다"]

  },

  pick(type){
    const list = this.connectors[type];

    if(!list || !list.length){
      return "-고";
    }

    return list[Math.floor(Math.random() * list.length)];
  },

  // =====================
  // PHONOLOGY
  // =====================
  hasBatchim(word){
    const lastChar = word[word.length - 1];
    const code = lastChar.charCodeAt(0);

    if(code < 0xAC00 || code > 0xD7A3) return false;

    return (code - 0xAC00) % 28 !== 0;
  },

  // =====================
  // PARTICLES
  // =====================
  subject(word){

    if(word === "저") return "가"; // coreean special

    return this.hasBatchim(word) ? "이" : "가";
  },

  object(word){
    return this.hasBatchim(word) ? "을" : "를";
  },

  place(word){
    return "에서";
  }

};
hasBatchim(word){
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
