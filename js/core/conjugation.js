window.Conjugation = {

  // =====================
  // STEM
  // =====================
  stem(verb){
    if(!verb) return "";
    return verb.endsWith("다") ? verb.slice(0,-1) : verb;
  },

/* ============================================================
   1) VERB STEM
============================================================ */
function getVerbStem(verb) {
  if (!verb) return "";
  return verb.endsWith("다") ? verb.slice(0, -1) : verb;
}
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

    if(!d) return stem + "어요";

    const A = [0,2,8,9,10,11];

    if(d.jong === 0){
      return stem + (A.includes(d.vowel) ? "아요" : "어요");
    }

    return stem + "어요";
  },

  // =====================
  // PAST
  // =====================
  past(verb){

    if(!verb) return "";

    if(verb === "하다") return "했어요";
    if(verb === "가다") return "갔어요";
    if(verb === "오다") return "왔어요";
    if(verb === "보다") return "봤어요";

    const stem = this.stem(verb);
    const d = this.decompose(stem.at(-1));

    if(!d) return stem + "었어요";

    const A = [0,2,8,9,10,11];

    if(d.jong === 0){
      return stem + (A.includes(d.vowel) ? "았어요" : "었어요");
    }

    return stem + "었어요";
  },

  // =====================
  // FUTURE
  // =====================
  future(verb){

    const stem = this.stem(verb);
    const d = this.decompose(stem.at(-1));

    if(!d) return stem + "ㄹ 거예요";

    return d.jong === 0
      ? stem + "ㄹ 거예요"
      : stem + "을 거예요";
  },

  // =====================
  // A/EO
  // =====================
  aeo(verb){

    if(verb === "하다") return "해";

    const stem = this.stem(verb);
    const d = this.decompose(stem.at(-1));

    if(!d) return stem + "어";

    const A = [0,2,8,9,10,11];

    if(d.jong === 0){
      return stem + (A.includes(d.vowel) ? "아" : "어");
    }

    return stem + "어";
  },

  // =====================
  // CORE ENGINE
  // =====================
  buildVerbPhrase(verb, cj){

    if(!verb) return "";

    const stem = this.stem(verb);

    if(!cj) return this.present(verb);

    // BASIC
    if(cj === "-아요/어요") return this.present(verb);
    if(cj === "-았어요/었어요") return this.past(verb);

    // FUTURE
    if(cj === "-(으)ㄹ 거예요") return this.future(verb);
    if(cj === "-(으)ㄹ게요") return this.future(verb).replace(" 거예요","게요");
    if(cj === "-(으)ㄹ까요?") return this.future(verb).replace(" 거예요","까요?");
    if(cj === "-(으)ㄹ래요?") return this.future(verb).replace(" 거예요","래요?");

    // ABILITY
    if(cj === "-(으)ㄹ 수 있어요") return this.future(verb).replace(" 거예요"," 수 있어요");
    if(cj === "-(으)ㄹ 수 없어요") return this.future(verb).replace(" 거예요"," 수 없어요");

    // PROGRESSIVE
    if(cj === "-고 있어요") return stem + "고 있어요";

    // DESIRE
    if(cj === "-고 싶어요") return stem + "고 싶어요";

    // REQUEST
    if(cj === "-아/어 주세요") return this.aeo(verb) + " 주세요";

    // OBLIGATION
    if(cj === "-아/어야 돼요") return this.aeo(verb) + "야 돼요";

    // PERMISSION
    if(cj === "-아/어도 돼요") return this.aeo(verb) + "도 돼요";

    // LINKING (IMPORTANT)
    if(cj === "-고") return stem + "고";
    if(cj === "-고 나서") return stem + "고 나서";
    if(cj === "-기 전에") return stem + "기 전에";
    if(cj.includes("면서")) return stem + "면서";
    if(cj.includes("며")) return stem + "며";

    // FALLBACK
    return this.present(verb);
  }

};
