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

    if(code < 44032 || code > 55203) return null;

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
  // IRREGULAR SYSTEM (COMPLET)
  // =====================
  irregularPresent: {
    "하다":"해요","가다":"가요","오다":"와요","보다":"봐요","마시다":"마셔요",
    "배우다":"배워요","되다":"돼요","주다":"줘요","두다":"둬요",
    "이다":"이에요","아니다":"아니에요",
    "모르다":"몰라요","부르다":"불러요","다르다":"달라요",
    "빠르다":"빨라요","고르다":"골라요",
    "듣다":"들어요","걷다":"걸어요","묻다":"물어요",
    "돕다":"도와요","눕다":"누워요","굽다":"구워요",
    "쉽다":"쉬워요","어렵다":"어려워요","무겁다":"무거워요",
    "덥다":"더워요","춥다":"추워요",
    "살다":"살아요","알다":"알아요",
    "만들다":"만들어요","쓰다":"써요",
    "크다":"커요","작다":"작아요",
    "나쁘다":"나빠요","바쁘다":"바빠요",
    "슬프다":"슬퍼요","기쁘다":"기뻐요",
    "예쁘다":"예뻐요","아프다":"아파요",
    "좋다":"좋아요","싫다":"싫어요"
  },

  irregularPast: {
    "하다":"했어요","가다":"갔어요","오다":"왔어요","보다":"봤어요",
    "마시다":"마셨어요","배우다":"배웠어요","되다":"됐어요",
    "주다":"줬어요","모르다":"몰랐어요","부르다":"불렀어요",
    "다르다":"달랐어요","빠르다":"빨랐어요","고르다":"골랐어요",
    "듣다":"들었어요","걷다":"걸었어요","묻다":"물었어요",
    "돕다":"도왔어요","눕다":"누웠어요",
    "쉽다":"쉬웠어요","어렵다":"어려웠어요",
    "살다":"살았어요","알다":"알았어요",
    "쓰다":"썼어요","크다":"컸어요",
    "바쁘다":"바빴어요","슬프다":"슬펐어요",
    "예쁘다":"예뻤어요","아프다":"아팠어요"
  },

  // =====================
  // A/EO ENGINE REAL
  // =====================
  aeo(verb){

    if(verb === "하다") return "해";

    const stem = this.stem(verb);
    const d = this.decompose(stem.at(-1));

    if(!d) return stem + "어";

    const bright = [0,1,2,3,8];

    if(d.jong === 0){
      return stem + (bright.includes(d.vowel) ? "아" : "어");
    }

    return stem + "어";
  },

  // =====================
  // PRESENT
  // =====================
  present(verb){

    if(!verb) return "";

    if(this.irregularPresent[verb]){
      return this.irregularPresent[verb];
    }

    return this.aeo(verb) + "요";
  },

  // =====================
  // PAST
  // =====================
  past(verb){

    if(!verb) return "";

    if(this.irregularPast[verb]){
      return this.irregularPast[verb];
    }

    const base = this.aeo(verb);

    if(base.endsWith("아")){
      return base.slice(0,-1) + "았어요";
    }

    return base.slice(0,-1) + "었어요";
  },

  // =====================
  // FUTURE
  // =====================
  future(verb){

    const stem = this.stem(verb);

    return this.hasBatchim(stem)
      ? stem + "을 거예요"
      : stem + "ㄹ 거예요";
  },

  // =====================
  // CONNECTORS (TOPIK)
  // =====================
  connector(verb, cj){

    const stem = this.stem(verb);

    switch(cj){

      case "-고": return stem + "고";
      case "-고 나서": return stem + "고 나서";
      case "-기 전에": return stem + "기 전에";

      case "-(으)면서":
        return this.hasBatchim(stem) ? stem + "으면서" : stem + "면서";

      case "-(으)니까":
        return this.hasBatchim(stem) ? stem + "으니까" : stem + "니까";

      case "-(으)ㄴ/는데":
        return this.hasBatchim(stem) ? stem + "는데" : stem + "ㄴ데";

      case "-(으)ㄹ수록":
        return this.hasBatchim(stem) ? stem + "을수록" : stem + "ㄹ수록";

      case "-지만":
        return stem + "지만";

      case "-아/어도":
        return this.aeo(verb) + "도";

      case "-아/어서":
        return this.aeo(verb) + "서";

      case "-기에":
        return stem + "기에";

      case "-길래":
        return stem + "길래";

      default:
        return null;
    }
  },

  // =====================
  // FINAL ENDINGS
  // =====================
  ending(verb, cj){

    const stem = this.stem(verb);

    switch(cj){

      case "-아요/어요": return this.present(verb);
      case "-았어요/었어요": return this.past(verb);
      case "-(으)ㄹ 거예요": return this.future(verb);

      case "-고 있어요": return stem + "고 있어요";
      case "-고 싶어요": return stem + "고 싶어요";

      case "-아/어 주세요": return this.aeo(verb) + " 주세요";
      case "-아/어야 돼요": return this.aeo(verb) + "야 돼요";
      case "-아/어도 돼요": return this.aeo(verb) + "도 돼요";

      case "-겠어요": return stem + "겠어요";

      case "-(으)ㄹ게요":
        return this.future(verb).replace(" 거예요","게요");

      case "-(으)ㄹ까요?":
        return this.future(verb).replace(" 거예요","까요?");

      case "-(으)ㄹ래요?":
        return this.future(verb).replace(" 거예요","래요?");

      default:
        return this.present(verb);
    }
  },

  // =====================
  // ENGINE FINAL
  // =====================
  buildVerbPhrase(verb, cj, isFinal = true){

    if(!verb) return "";

    if(!isFinal){
      const link = this.connector(verb, cj);
      if(link) return link;
    }

    return this.ending(verb, cj);
  }

};
