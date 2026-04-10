parse(text){

  const clean = this.normalize(text);

  // 🔥 detect limbă
  const lang = (
    clean.includes("and") ||
    clean.includes("but") ||
    clean.includes("because")
  ) ? "en" : "ro";

  // 🔥 split propoziții
  const parts = clean.split(
    lang === "ro"
      ? /(si|dar|apoi|dupa|pentru ca|ca sa)/
      : /(and|but|then|after|because)/
  );

  const sentences = [];

  for(let chunk of parts){

    chunk = chunk.trim();
    if(!chunk) continue;

    // ignorăm conectorii puri
    if(["si","dar","and","but","then"].includes(chunk)) continue;

    const words = chunk.split(/\s+/);

    const s = window.SENTENCE_BUILDER.makeEmptySentence();

    for(const word of words){

      // =====================
      // TIME
      // =====================
      if(word === "azi" || word === "astazi" || word === "today") s.time = "오늘";
      if(word === "ieri" || word === "yesterday") s.time = "어제";
      if(word === "maine" || word === "tomorrow") s.time = "내일";

      // =====================
      // SUBJECT
      // =====================
      if(["eu","i"].includes(word)) s.subject = "저";
      if(["noi","we"].includes(word)) s.subject = "우리";
      if(["tu","you"].includes(word)) s.subject = "너";

      // =====================
      // PLACE
      // =====================
      if(["acasa","home"].includes(word)) s.places = ["집"];
      if(["scoala","school"].includes(word)) s.places = ["학교"];
      if(["restaurant"].includes(word)) s.places = ["식당"];

      // =====================
      // OBJECT
      // =====================
      if(["carte","book"].includes(word)) s.objects = ["책"];
      if(["apa","water"].includes(word)) s.objects = ["물"];
      if(["mancare","food"].includes(word)) s.objects = ["음식"];
      if(["cafea","coffee"].includes(word)) s.objects = ["커피"];

      // =====================
      // ADJECTIVE
      // =====================
      if(["frumos","beautiful"].includes(word)) s.subjectAdj = "예쁜";
      if(["bun","good"].includes(word)) s.objectAdj = "좋은";

      // =====================
      // MOD
      // =====================
      if(["bine","well"].includes(word)) s.mod = "잘";
      if(["repede","fast"].includes(word)) s.mod = "빨리";

      // =====================
      // VERBS
      // =====================
      if(["merg","go"].includes(word)) s.verbs = ["가다"];
      if(["vin","come"].includes(word)) s.verbs = ["오다"];
      if(["mananc","eat"].includes(word)) s.verbs = ["먹다"];
      if(["beau","drink"].includes(word)) s.verbs = ["마시다"];
      if(["citesc","read"].includes(word)) s.verbs = ["읽다"];
    }

    // =====================
    // 🔥 GRAMMAR (IMPORTANT)
    // =====================
    if(clean.includes("dupa") || clean.includes("after")){
      s.grammar = { ko:"고 나서" };
    }

    if(clean.includes("pentru ca") || clean.includes("because")){
      s.grammar = { ko:"기 때문에" };
      s.reason = true;
    }

    if(clean.includes("ca sa") || clean.includes("to")){
      s.grammar = { ko:"려고" };
    }

    if(clean.includes("dar") || clean.includes("but")){
      s.grammar = { ko:"지만" };
    }

    sentences.push(s);
  }

  return sentences;
}
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
