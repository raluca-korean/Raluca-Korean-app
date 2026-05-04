// Colorizes Korean text by grammatical role (space-separated tokens).
// Each detected token is split into:  stem (noun/verb/adj) | ending (particle/suffix)
// Exposes window.GrammarColor = { colorize, detectRole, COLORS, STEM_COLOR }
(function (global) {
  'use strict';

  // True if the Hangul syllable has a final consonant (받침).
  function hasBatchim(ch) {
    var c = ch.charCodeAt(0);
    return c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 !== 0;
  }

  // Sentence-final verb / copula endings (longest first).
  var VERB = [
    '았었어요', '었었어요',
    '았어요',   '었어요',   '였어요',
    '았습니다', '었습니다', '였습니다',
    '겠어요',   '겠습니다',
    '이에요',   '예요',     '입니다',   '이야',
    '아요',     '어요',     '여요',
    '해요',     '하세요',   '세요',     '으세요',
    '습니다',   '십니다',
  ].sort(function (a, b) { return b.length - a.length; });

  // Connector / conjunction endings.
  var CONN = [
    '으면서', '면서',
    '으면',                     // conditional (받침 stems): 먹으면, 읽으면
    '아서',   '어서',   '여서',
    '지만',
    '으니까', '니까',
    '는데',   '은데',   '인데',
    '으려고', '려고',
    '아도',   '어도',
    '고도',   '고서',
  ].sort(function (a, b) { return b.length - a.length; });

  // Multi-syllable location / time / direction particles.
  var LOC = [
    '에게서', '한테서',
    '에서',   '에게',   '한테',
    '까지',   '부터',   '으로',
  ].sort(function (a, b) { return b.length - a.length; });

  // Invariant (neutral) particles — form never changes based on batchim.
  var NEUTRAL = ['마다', '도', '의', '만'].sort(function (a, b) { return b.length - a.length; });

  // Bright color for the grammatical marker (particle / ending).
  var COLORS = {
    subject:   '#e74c3c',
    object:    '#2980b9',
    verb:      '#27ae60',
    connector: '#8e44ad',
    location:  '#e67e22',
    neutral:   '#1abc9c', // invariant particle → teal
  };

  // Light tint for the stem (noun / verb base).
  // neutral stem shares the subject light-red so it reads as a noun.
  var STEM_COLORS = {
    subject:   '#f1948a',
    object:    '#7fb3d3',
    verb:      '#76d7a0',
    connector: '#c39bd3',
    location:  '#f0b27a',
    neutral:   '#e74c3c', // noun stem → subject color
  };

  // Returns { role: String, endLen: Number } or null.
  // endLen = how many chars from the END of the clean token are the particle/ending.
  // The remainder is the stem (noun / verb / adj base).
  function detectRole(token) {
    if (!token || !/[가-힣]/.test(token)) return null;

    var clean  = token.replace(/[.,!?。、…~※「」]+$/, '');
    if (clean.length < 2) return null;

    var last   = clean[clean.length - 1];
    var prev   = clean[clean.length - 2];
    var prevKo = /[가-힣]/.test(prev);

    // 1. Sentence-final verb / copula endings
    for (var i = 0; i < VERB.length; i++) {
      if (clean.endsWith(VERB[i])) return { role: 'verb', endLen: VERB[i].length };
    }

    // 2. Connector endings
    for (var j = 0; j < CONN.length; j++) {
      if (clean.endsWith(CONN[j])) return { role: 'connector', endLen: CONN[j].length };
    }
    // bare ~고 linking form
    if (last === '고' && prevKo) return { role: 'connector', endLen: 1 };

    // 3. Multi-char location particles
    for (var k = 0; k < LOC.length; k++) {
      if (clean.endsWith(LOC[k]) && clean.length > LOC[k].length)
        return { role: 'location', endLen: LOC[k].length };
    }

    // 4. Invariant (neutral) particles
    for (var n = 0; n < NEUTRAL.length; n++) {
      if (clean.endsWith(NEUTRAL[n]) && clean.length > NEUTRAL[n].length && prevKo)
        return { role: 'neutral', endLen: NEUTRAL[n].length };
    }

    // 5. Coordinating / comitative particles
    if (clean.endsWith('이랑') && clean.length > 2) return { role: 'connector', endLen: 2 };

    // 6. Comparison / manner particles
    if (clean.endsWith('보다') && clean.length > 2) return { role: 'connector', endLen: 2 };
    if (clean.endsWith('만큼') && clean.length > 2) return { role: 'connector', endLen: 2 };
    if (clean.endsWith('처럼') && clean.length > 2) return { role: 'connector', endLen: 2 };

    if (!prevKo) return null;

    // 7. Contracted-form fallbacks (vowel-final stems absorb 아/어)
    //    봐요 (보+아요), 예뻐요 (예쁘+어요) → last char 요 = verb ending
    if (last === '요') return { role: 'verb',      endLen: 1 };
    //    봐서 (보+아서), 예뻐서 (예쁘+어서) → last char 서 = connector
    if (last === '서') return { role: 'connector', endLen: 1 };

    // 8. Single-char particles (batchim-sensitive)
    if (last === '에')                         return { role: 'location', endLen: 1 };
    if (last === '로' && !hasBatchim(prev))    return { role: 'location', endLen: 1 };
    if (last === '와' && !hasBatchim(prev))    return { role: 'connector', endLen: 1 }; // and/with

    if (last === '가' && !hasBatchim(prev))    return { role: 'subject',  endLen: 1 };
    if (last === '이' &&  hasBatchim(prev))    return { role: 'subject',  endLen: 1 };
    if (last === '는' && !hasBatchim(prev))    return { role: 'subject',  endLen: 1 };
    if (last === '은' &&  hasBatchim(prev))    return { role: 'subject',  endLen: 1 };

    if (last === '를' && !hasBatchim(prev))    return { role: 'object',   endLen: 1 };
    if (last === '을' &&  hasBatchim(prev))    return { role: 'object',   endLen: 1 };

    return null;
  }

  function esc(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function mkSpan(text, color, cls) {
    return '<span class="gk ' + cls + '" style="color:' + color +
           ';-webkit-text-fill-color:' + color + '">' + esc(text) + '</span>';
  }

  // Returns HTML with each token split into [stem][ending] colored spans.
  function colorize(text) {
    if (!text) return '';
    return text.split(/(\s+)/).map(function (part) {
      if (/^\s+$/.test(part)) return part;

      var result = detectRole(part);
      if (!result) return '<span class="gk gk-n">' + esc(part) + '</span>';

      var clean  = part.replace(/[.,!?。、…~※「」]+$/, '');
      var stem   = clean.slice(0, clean.length - result.endLen);
      var ending = part.slice(stem.length); // ending syllables + any trailing punctuation

      var sc = STEM_COLORS[result.role] || '#8899aa'; // stem → light tint
      var ec = COLORS[result.role];                   // ending/particle → vivid
      return (stem ? mkSpan(stem, sc, 'gk-stem') : '') +
             mkSpan(ending, ec, 'gk-' + result.role);
    }).join('');
  }

  global.GrammarColor = {
    colorize:    colorize,
    detectRole:  detectRole,
    COLORS:      COLORS,
    STEM_COLORS: STEM_COLORS,
  };
})(window);
