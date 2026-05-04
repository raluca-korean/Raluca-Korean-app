// Colorizes Korean text by grammatical role (space-separated tokens).
// Exposes window.GrammarColor = { colorize, detectRole, COLORS }
(function (global) {
  'use strict';

  // Returns true if the Hangul syllable has a final consonant (받침).
  function hasBatchim(ch) {
    var c = ch.charCodeAt(0);
    return c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 !== 0;
  }

  // Verb-final endings – sentence-ending forms (longest first).
  var VERB = [
    '았었어요', '었었어요',
    '았어요', '었어요', '였어요',
    '았습니다', '었습니다', '였습니다',
    '겠어요', '겠습니다',
    '이에요', '예요', '입니다', '이야',
    '아요', '어요', '여요',
    '해요', '하세요', '세요', '으세요',
    '습니다', '십니다',
  ].sort(function (a, b) { return b.length - a.length; });

  // Connector / conjunction endings (verb + linking form).
  var CONN = [
    '으면서', '면서',
    '으면',               // conditional: 먹으면, 읽으면
    '아서', '어서', '여서',
    '지만',
    '으니까', '니까',
    '는데', '은데', '인데',
    '으려고', '려고',
    '아도', '어도',
    '고도', '고서',
  ].sort(function (a, b) { return b.length - a.length; });

  // Multi-syllable location / time / direction particles.
  var LOC = [
    '에게서', '한테서',
    '에서', '에게', '한테',
    '까지', '부터', '으로',
  ].sort(function (a, b) { return b.length - a.length; });

  var COLORS = {
    subject:   '#e74c3c', // roșu   – subiect  (은/는/이/가)
    object:    '#2980b9', // albastru – complement direct (을/를)
    verb:      '#27ae60', // verde   – verb / predicat
    connector: '#8e44ad', // mov     – conector / timp verbal
    location:  '#e67e22', // portocaliu – loc / timp / direcție
  };

  // Returns the grammatical role key for a single space-separated token,
  // or null if no role can be determined.
  function detectRole(token) {
    if (!token || !/[가-힣]/.test(token)) return null;

    var clean = token.replace(/[.,!?。、…~※「」]+$/, '');
    if (clean.length < 2) return null;

    var last   = clean[clean.length - 1];
    var prev   = clean[clean.length - 2];
    var prevKo = /[가-힣]/.test(prev);

    // 1. Verb-final endings
    for (var i = 0; i < VERB.length; i++) {
      if (clean.endsWith(VERB[i])) return 'verb';
    }

    // 2. Connector endings
    for (var j = 0; j < CONN.length; j++) {
      if (clean.endsWith(CONN[j])) return 'connector';
    }
    // bare ~고 connecting form
    if (last === '고' && prevKo) return 'connector';

    // 3. Multi-char location particles
    for (var k = 0; k < LOC.length; k++) {
      if (clean.endsWith(LOC[k]) && clean.length > LOC[k].length) return 'location';
    }

    // 3b. Coordinating / comitative particles (și / cu)
    // 이랑 – after consonant-final noun (informal): 책이랑, 음식이랑
    if (clean.endsWith('이랑') && clean.length > 2) return 'connector';

    // 3c. Comparison / manner particles (decât / la fel ca / precum)
    if (clean.endsWith('보다') && clean.length > 2) return 'connector'; // than:  생각보다, 나보다
    if (clean.endsWith('만큼') && clean.length > 2) return 'connector'; // as much as: 너만큼, 기대만큼
    if (clean.endsWith('처럼') && clean.length > 2) return 'connector'; // like/as: 어른처럼, 나처럼

    if (!prevKo) return null;

    // 4. Contracted-form fallbacks
    // Verb/adj stems without 받침 contract 아/어 into the preceding syllable,
    // leaving only 요 visible. E.g.: 봐요(보+아요), 예뻐요(예쁘+어요), 봤어요(보+았+어요)
    if (last === '요') return 'verb';

    // 아서/어서 connectors also contract → 봐서(보+아서), 예뻐서(예쁘+어서).
    // Note: 에서 tokens are already caught above as location, so lone 서 here
    // means the preceding syllable absorbed the 아/어.
    if (last === '서') return 'connector';

    // 5. Single-char particles (batchim-sensitive)

    // Location / direction
    if (last === '에') return 'location';
    if (last === '로' && !hasBatchim(prev)) return 'location';

    // Coordinating / comitative particle 와 (and / with) – after vowel-final noun:
    // 사과와, 친구와, 나라와  (형식: 와 after no-받침)
    if (last === '와' && !hasBatchim(prev)) return 'connector';

    // Subject / topic markers
    if (last === '가' && !hasBatchim(prev)) return 'subject';
    if (last === '이' && hasBatchim(prev))  return 'subject';
    if (last === '는' && !hasBatchim(prev)) return 'subject';
    if (last === '은' && hasBatchim(prev))  return 'subject';

    // Object markers
    if (last === '를' && !hasBatchim(prev)) return 'object';
    if (last === '을' && hasBatchim(prev))  return 'object';

    return null;
  }

  function esc(s) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Returns an HTML string with <span> wrappers per grammatical role.
  function colorize(text) {
    if (!text) return '';
    return text.split(/(\s+)/).map(function (part) {
      if (/^\s+$/.test(part)) return part;
      var role = detectRole(part);
      if (role) {
        var c = COLORS[role];
        return '<span class="gk gk-' + role + '" style="color:' + c +
               ';-webkit-text-fill-color:' + c + '">' + esc(part) + '</span>';
      }
      return '<span class="gk gk-n">' + esc(part) + '</span>';
    }).join('');
  }

  global.GrammarColor = { colorize: colorize, detectRole: detectRole, COLORS: COLORS };
})(window);
