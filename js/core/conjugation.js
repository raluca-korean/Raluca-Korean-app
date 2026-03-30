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
  /* ============================================================
   2) PRESENT POLITE (아요/어요)
============================================================ */
function presentPolite(verb) {
  if (!verb) return "";

  // Irregulare frecvente
  const irreg = {
    "하다": "해요",
    "가다": "가요",
    "오다": "와요",
    "보다": "봐요",
    "마시다": "마셔요",
    "배우다": "배워요",
    "되다": "돼요",
    "주다": "줘요",
    "두다": "둬요",
    "이다": "이에요",
    "아니다": "아니에요",
    "모르다": "몰라요",
    "부르다": "불러요",
    "다르다": "달라요",
    "빠르다": "빨라요",
    "고르다": "골라요",
    "듣다": "들어요",
    "걷다": "걸어요",
    "돕다": "도와요",
    "눕다": "누워요",
    "쉽다": "쉬워요",
    "어렵다": "어려워요",
    "무겁다": "무거워요",
    "살다": "살아요",
    "알다": "알아요",
    "만들다": "만들어요",
    "쓰다": "써요",
    "크다": "커요",
    "나쁘다": "나빠요",
    "바쁘다": "바빠요",
    "슬프다": "슬퍼요",
    "예쁘다": "예뻐요",
    "아프다": "아파요",
  };
if (irreg[verb]) return irreg[verb];

  const stem = getVerbStem(verb);
  if (!stem) return verb;

  const lastChar = stem[stem.length - 1];
  const code = lastChar.charCodeAt(0);

  if (code < 0xAC00 || code > 0xD7A3) {
    return stem + "어요";
  }

  const base = code - 0xAC00;
  const jong = base % 28;
  const vowelIdx = Math.floor((base % 588) / 28);

  // vocale "bright" (아 계열): ㅏ(0), ㅐ(1), ㅑ(2), ㅒ(3), ㅗ(8)
  const brightVowels = new Set([0, 1, 2, 3, 8]);

  if (jong === 0) {
    // stem se termină cu vocală
    if (brightVowels.has(vowelIdx)) {
      // ㅏ → 아요, ㅗ + 하 → 봐요 etc
      if (vowelIdx === 0) return stem + "요"; // deja are ㅏ
      if (vowelIdx === 8) {
        // ㅗ + 아 = 봐
        // construim: stem fara ultima silabă + silabă contrasă
        return stem + "요"; // simplificat: aoa -> wa deja tratat mai sus
      }
      return stem + "아요";
    }
    return stem + "어요";
  }

  // stem se termină cu consoană finală (batchim)
  if (brightVowels.has(vowelIdx)) {
    return stem + "아요";
  }
  return stem + "어요";
}
/* ============================================================
   3) PAST POLITE (았어요/었어요)
============================================================ */
function pastPolite(verb) {
  if (!verb) return "";

  const irreg = {
    "하다": "했어요",
    "가다": "갔어요",
    "오다": "왔어요",
    "보다": "봤어요",
    "마시다": "마셨어요",
    "배우다": "배웠어요",
    "되다": "됐어요",
    "주다": "줬어요",
    "모르다": "몰랐어요",
    "부르다": "불렀어요",
    "다르다": "달랐어요",
    "빠르다": "빨랐어요",
    "고르다": "골랐어요",
    "듣다": "들었어요",
    "걷다": "걸었어요",
    "돕다": "도왔어요",
    "쉽다": "쉬웠어요",
    "어렵다": "어려웠어요",
    "살다": "살았어요",
    "알다": "알았어요",
    "만들다": "만들었어요",
    "쓰다": "썼어요",
    "크다": "컸어요",
    "바쁘다": "바빴어요",
    "슬프다": "슬펐어요",
    "예쁘다": "예뻤어요",
    "아프다": "아팠어요",
  };
  if (irreg[verb]) return irreg[verb];

  const stem = getVerbStem(verb);
  if (!stem) return verb;

  const lastChar = stem[stem.length - 1];
  const code = lastChar.charCodeAt(0);

  if (code < 0xAC00 || code > 0xD7A3) {
    return stem + "었어요";
  }

  const base = code - 0xAC00;
  const jong = base % 28;
  const vowelIdx = Math.floor((base % 588) / 28);

  const brightVowels = new Set([0, 1, 2, 3, 8]);

  if (brightVowels.has(vowelIdx)) {
    return stem + (jong === 0 ? "았어요" : "았어요");
  }
  return stem + "었어요";
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
