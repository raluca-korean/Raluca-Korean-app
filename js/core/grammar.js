window.Grammar = {

  // =========================
  // PARTICLES
  // =========================
  subject(word){

    if(word === "저") return "가";
    if(word === "나") return "가";
    if(word === "너") return "가";

    return window.Conjugation.hasBatchim(word) ? "이" : "가";
  },

  topic(word){
    return window.Conjugation.hasBatchim(word) ? "은" : "는";
  },

  object(word){
    return window.Conjugation.hasBatchim(word) ? "을" : "를";
  },

  place(word){
    return "에서";
  },

  // =========================
  // BUILD SENTENCE
  // =========================
  buildSentence(sentences, actives){

    const parts = [];

    for(let i = 0; i < sentences.length; i++){

      const s = sentences[i];
      if(!s) continue;

      const clause = this.buildClause(s, actives[i], i > 0);

      if(clause) parts.push(clause);
    }

    return parts.join(" ").replace(/\s+/g," ").trim();
  },

  buildClause(state, active, hideSubject){

    const parts = [];

    if(!hideSubject && state.subject){
      parts.push(state.subject + this.topic(state.subject));
    }

    if(state.time){
      parts.push(state.time);
    }

    if(state.place){
      parts.push(state.place + this.place(state.place));
    }

    if(state.object){
      parts.push(state.object + this.object(state.object));
    }

    if(state.verb){
      parts.push(
        window.Conjugation.buildVerbPhrase(
          state.verb,
          state.conjug
        )
      );
    }

    return parts.join(" ");
  }

};
