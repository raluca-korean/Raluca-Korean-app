window.Parser = {

  // =========================
  // NORMALIZE
  // =========================
  normalize(text){
    return (text || "")
      .toLowerCase()
      .trim()
      .replace(/[.,!?;:]/g, "")
      .replace(/ă/g, "a")
      .replace(/â/g, "a")
      .replace(/î/g, "i")
      .replace(/ș/g, "s")
      .replace(/ş/g, "s")
      .replace(/ț/g, "t")
      .replace(/ţ/g, "t");
  },

  tokenize(text){
    return this.normalize(text)
      .split(/\s+/)
      .filter(Boolean);
  },

  // =========================
  // MAIN PARSER
  // =========================
  parse(text){

    const words = this.tokenize(text);

    const state = {
      subject:"",
      time:"",
      place:"",
      object:"",
      verb:"",
      mod:"",
      subjectAdj:"",
      objectAdj:"",
      conjug:""
    };

    for(const word of words){

      // =====================
      // TIME
      // =====================
      if(word === "azi" || word === "astazi") state.time = "오늘";
      if(word === "ieri") state.time = "어제";
      if(word === "maine") state.time = "내일";

      // =====================
      // SUBJECT
      // =====================
      if(word === "eu") state.subject = "저";
      if(word === "noi") state.subject = "우리";
      if(word === "tu") state.subject = "너";

      // =====================
      // PLACE
      // =====================
      if(word === "acasa") state.place = "집";
      if(word === "scoala") state.place = "학교";
      if(word === "restaurant") state.place = "식당";
      if(word === "spital") state.place = "병원";

      // =====================
      // OBJECT
      // =====================
      if(word === "carte") state.object = "책";
      if(word === "apa") state.object = "물";
      if(word === "mancare") state.object = "음식";
      if(word === "cafea") state.object = "커피";

      // =====================
      // ADJECTIVES
      // =====================
      if(word === "frumos" || word === "frumoasa") state.subjectAdj = "예쁜";
      if(word === "bun" || word === "buna") state.objectAdj = "좋은";

      // =====================
      // MOD
      // =====================
      if(word === "bine") state.mod = "잘";
      if(word === "repede") state.mod = "빨리";

      // =====================
      // VERBS
      // =====================
      if(["merg","merge","plec"].includes(word)) state.verb = "가다";
      if(["vin","vine","venim"].includes(word)) state.verb = "오다";
      if(["mananc","mancam"].includes(word)) state.verb = "먹다";
      if(["beau","bea"].includes(word)) state.verb = "마시다";
      if(["citesc","citim"].includes(word)) state.verb = "읽다";
    }

    // =====================
    // CONJUGATION DETECTION
    // =====================
    const t = this.normalize(text);

    if(t.includes("vreau sa")) state.conjug = "-고 싶어요";
    else if(t.includes("trebuie sa")) state.conjug = "-아/어야 돼요";
    else if(t.includes("pot sa")) state.conjug = "-(으)ㄹ 수 있어요";
    else if(t.includes("nu pot")) state.conjug = "-(으)ㄹ 수 없어요";
    else if(t.includes("maine")) state.conjug = "-(으)ㄹ 거예요";
    else if(t.includes("ieri")) state.conjug = "-았어요/었어요";
    else state.conjug = "-아요/어요";

    return state;
  }

};
