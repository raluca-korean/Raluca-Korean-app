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

  // Standalone connector words: always mark the entire token as connector.
  var STANDALONE_CONN_TOKENS = ['때문에', '위해서', '위해', '위한'];

  // When the current token ends in 기 AND the next non-whitespace token is
  // one of these, the 기 suffix is a compound-connector nominalizer (기 때문에,
  // 기 위해서, 기 전에 …) → color it as connector.
  var COMPOUND_CONN_FOLLOWERS = ['때문에', '위해서', '위해', '위한', '전에', '후에'];

  // Pure standalone adverbs used without a trailing particle.
  // Checked before particle detection to prevent false positives like
  // 같이 → subject (이 after batchim) or 바로 → location (로 after open syllable).
  var ADVERBS_LIST = [
    // frequency
    '매일', '매주', '항상', '언제나', '자주', '가끔', '때때로',
    // time point
    '오늘', '어제', '내일', '모레',
    // manner
    '빨리', '천천히', '열심히', '조용히', '갑자기',
    // together / alone
    '같이', '함께', '혼자',
    // sequence / discourse
    '먼저', '드디어', '계속', '다시', '바로',
    // brief time
    '잠깐', '잠시', '금방', '방금', '이미', '아직',
    // degree
    '많이', '조금', '아주', '너무', '정말', '진짜',
  ];

  // Bright color for the grammatical marker (particle / ending).
  var COLORS = {
    subject:   '#e74c3c',
    object:    '#2980b9',
    verb:      '#27ae60',
    connector: '#8e44ad',
    location:  '#e67e22',
    neutral:   '#1abc9c',
    adverb:    '#f39c12',  // amber — time / manner adverbs
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
    adverb:    '#fad7a0', // light amber
  };

  // Returns { role: String, endLen: Number } or null.
  // endLen = how many chars from the END of the clean token are the particle/ending.
  // The remainder is the stem (noun / verb / adj base).
  function detectRole(token) {
    if (!token || !/[가-힣]/.test(token)) return null;

    var clean  = token.replace(/[.,!?。、…~※「」]+$/, '');

    // 0a. Standalone compound-connector words (whole token = connector ending).
    if (STANDALONE_CONN_TOKENS.indexOf(clean) !== -1) {
      return { role: 'connector', endLen: clean.length };
    }

    // 0b. Known standalone adverbs — checked before particle rules to prevent
    //     false positives (e.g. 같이 → subject, 많이 → subject, 바로 → location).
    if (ADVERBS_LIST.indexOf(clean) !== -1) {
      return { role: 'adverb', endLen: clean.length };
    }

    if (clean.length < 2) return null;

    // Fixed passive/agent marker — color entire token as location so that
    // "작가에 의해서" reads as one consistent color unit.
    if (clean === '의해서' || clean === '의해') return { role: 'location', endLen: clean.length };

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
    var parts = text.split(/(\s+)/);

    // Build a flat list of non-whitespace tokens for lookahead and lookbehind.
    // Compound connectors like 기 때문에 / 기 전에 span two space-separated tokens.
    var nonWs = parts.filter(function (p) { return !/^\s+$/.test(p); });
    var nonWsIdx = 0;

    return parts.map(function (part) {
      if (/^\s+$/.test(part)) return part;

      var myIdx     = nonWsIdx++;
      var prevTok   = nonWs[myIdx - 1] || '';
      var nextTok   = nonWs[myIdx + 1] || '';
      var cleanPart = part.replace(/[.,!?。、…~※「」]+$/, '');
      var prevClean = prevTok.replace(/[.,!?。、…~※「」]+$/, '');
      var nextClean = nextTok.replace(/[.,!?。、…~※「」]+$/, '');

      var result = detectRole(part);

      // Forward: V기 때문에 / V기 위해서 / V기 전에 …
      // Verb stem → verb color (light green); 기 nominalizer → connector color (purple).
      if (cleanPart.endsWith('기') && COMPOUND_CONN_FOLLOWERS.indexOf(nextClean) !== -1) {
        var vStem = cleanPart.slice(0, cleanPart.length - 1); // everything except 기
        var kgi   = part.slice(vStem.length);                 // 기 + any trailing punctuation
        return (vStem ? mkSpan(vStem, STEM_COLORS.verb, 'gk-stem') : '') +
               mkSpan(kgi, COLORS.connector, 'gk-connector');
      }

      // Backward: 전에 / 후에 following a 기-ending token → connector, not location.
      if ((cleanPart === '전에' || cleanPart === '후에') && prevClean.endsWith('기')) {
        result = { role: 'connector', endLen: cleanPart.length };
      }

      if (!result) return '<span class="gk gk-n">' + esc(part) + '</span>';

      var clean  = cleanPart;
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
