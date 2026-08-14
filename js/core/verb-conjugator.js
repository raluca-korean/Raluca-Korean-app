// General-purpose present/past conjugator for arbitrary 다-form verbs and
// adjectives, covering rule-based ㅂ/르/ㄷ/ㅎ irregulars via Hangul jamo
// decomposition (not a per-verb lookup table) — moved out of
// word-context.html so it can be reused by other pages (e.g. the Glossary's
// generated-example fallback) without duplicating the engine.
//
// NOTE: this is a separate object from window.Conjugation (js/core/
// conjugation.js), which is a smaller hand-curated lookup table built for
// Builder's own vocabulary set and does not generalize to arbitrary verbs.
window.VerbConjugator = {

  // Shared irregular-conjugation word lists — single source of truth, also
  // used by callers building a reverse lookup (surface form -> headword).
  B_IRREGULAR: ['고맙다','춥다','덥다','쉽다','어렵다','가깝다','아름답다','반갑다','귀엽다','무겁다','가볍다',
    '그립다','놀랍다','두껍다','뜨겁다','맵다','무섭다','미끄럽다','부끄럽다','부드럽다','부럽다','새롭다',
    '시끄럽다','싱겁다','아쉽다','어둡다','외롭다','자연스럽다','즐겁다','차갑다','굽다','눕다'],
  BO_WA_EXCEPTIONS: ['돕다', '곱다'], // ㅂ-irregular but use 와 (not 워) since the vowel is ㅗ
  I_VERB_EXCEPTIONS: ['끓이다','덮이다','모이다','보이다','쌓이다','줄이다'], // real verbs, not the 이다 copula
  REUL_REGULAR: ['따르다', '들르다', '치르다'],
  D_IRREGULAR: ['걷다', '듣다'],
  H_IRREGULAR: ['하얗다','빨갛다','파랗다','까맣다','노랗다','그렇다','이렇다','저렇다','어떻다'],

  hasBatchim(word) {
    const last = word[word.length - 1];
    const code = last ? last.charCodeAt(0) : 0;
    if (code < 0xAC00 || code > 0xD7A3) return true;
    return ((code - 0xAC00) % 28) !== 0;
  },

  conjugate(word) {
    if (!word.endsWith('다')) return null;
    const stem = word.slice(0,-1);
    const last = stem[stem.length-1];
    if (!last) return null;
    const code = last.charCodeAt(0);
    if (code < 0xAC00 || code > 0xD7A3) return null;
    const s = code - 0xAC00, jong = s % 28, jung = Math.floor(s/28) % 21, cho = Math.floor(s/588);

    if (last === '이' && !this.I_VERB_EXCEPTIONS.some(b => word === b || word.endsWith(b))) {
      const base = stem.slice(0,-1);
      const bat = this.hasBatchim(base);
      return [{ro:'prezent',en:'present', form: base+(bat?'이에요':'예요')}, {ro:'trecut',en:'past', form: base+'이었어요'}];
    }
    if (last === '하') {
      const base = stem.slice(0,-1);
      return [{ro:'prezent',en:'present', form: base+'해요'}, {ro:'trecut',en:'past', form: base+'했어요'}];
    }
    if (jong === 17 && this.BO_WA_EXCEPTIONS.includes(word)) {
      const openSyllable = String.fromCharCode(code - jong);
      const base = stem.slice(0,-1) + openSyllable;
      return [{ro:'prezent',en:'present', form: base+'와요'}, {ro:'trecut',en:'past', form: base+'왔어요'}];
    }
    if (jong === 17 && this.B_IRREGULAR.includes(word)) {
      const openSyllable = String.fromCharCode(code - jong);
      const base = stem.slice(0,-1) + openSyllable;
      return [{ro:'prezent',en:'present', form: base+'워요'}, {ro:'trecut',en:'past', form: base+'웠어요'}];
    }
    if (last === '르' && jong === 0 && stem.length >= 2 && !this.REUL_REGULAR.includes(word)) {
      const preStem = stem.slice(0, -1);
      const preLast = preStem[preStem.length - 1];
      const pCode = preLast.charCodeAt(0);
      const pJung = Math.floor((pCode - 0xAC00) / 28) % 21;
      const preBright = pJung === 0 || pJung === 8;
      const doubled = String.fromCharCode(pCode + 8);
      const newSyl = preBright ? '라' : '러';
      const base = preStem.slice(0, -1) + doubled + newSyl;
      return [{ro:'prezent',en:'present', form: base+'요'}, {ro:'trecut',en:'past', form: base.slice(0,-1)+(preBright?'랐':'렀')+'어요'}];
    }
    if (jong === 7 && this.D_IRREGULAR.some(b => word === b || word.endsWith(b))) {
      const base = stem.slice(0,-1) + String.fromCharCode(code + 1);
      const bright = jung === 0 || jung === 8;
      return [{ro:'prezent',en:'present', form: base+(bright?'아요':'어요')}, {ro:'trecut',en:'past', form: base+(bright?'았어요':'었어요')}];
    }

    const aVowel = jung===0||jung===8;
    const suf = aVowel ? '아':'어';
    let pres, past;
    if (jong===0) {
      if (jung===0) { pres = stem+'요'; past = stem.slice(0,-1) + String.fromCharCode(code+20) + '어요'; }
      else if (jung===8) { pres = stem.slice(0,-1) + String.fromCharCode(0xAC00+cho*588+9*28) + '요'; past = stem.slice(0,-1) + String.fromCharCode(0xAC00+cho*588+9*28+20) + '어요'; }
      else if (jung===13) { pres = stem.slice(0,-1) + String.fromCharCode(0xAC00+cho*588+14*28) + '요'; past = stem.slice(0,-1) + String.fromCharCode(0xAC00+cho*588+14*28+20) + '어요'; }
      else if (jung===18) {
        const pre = stem.slice(0, -1);
        const preLast = pre[pre.length-1];
        let preBright = false;
        if (preLast) {
          const pc = preLast.charCodeAt(0);
          if (pc >= 0xAC00 && pc <= 0xD7A3) { const pj = Math.floor((pc-0xAC00)/28)%21; preBright = pj===0||pj===8; }
        }
        const newJung = preBright ? 0 : 4;
        pres = pre + String.fromCharCode(0xAC00 + cho*588 + newJung*28) + '요';
        past = pre + String.fromCharCode(0xAC00 + cho*588 + newJung*28 + 20) + '어요';
      } else if (jung===20) {
        // ㅣ + 어 → 여 contraction (마시다→마셔요, 다니다→다녀요, 보이다→보여요…)
        pres = stem.slice(0,-1) + String.fromCharCode(0xAC00+cho*588+6*28) + '요';
        past = stem.slice(0,-1) + String.fromCharCode(0xAC00+cho*588+6*28+20) + '어요';
      } else if (jung===11) {
        // ㅚ + 어 → 왜 contraction (되다→돼요)
        pres = stem.slice(0,-1) + String.fromCharCode(0xAC00+cho*588+10*28) + '요';
        past = stem.slice(0,-1) + String.fromCharCode(0xAC00+cho*588+10*28+20) + '어요';
      } else { pres = stem+'어요'; past = stem+'었어요'; }
    } else { pres = stem+suf+'요'; past = stem+(aVowel?'았':'었')+'어요'; }
    return [{ro:'prezent',en:'present', form: pres}, {ro:'trecut',en:'past', form: past}];
  }

};
