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
    '거나',                     // alternation: 먹거나, 가거나 (eat or, go or)
    '이나',                     // alternation after batchim: 빵이나, 음식이나
    '든지',   '든가',            // whether…or: 먹든지, 가든가
    '느라고', '느라',            // because of -ing: 공부하느라고, 자느라
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
  var STANDALONE_CONN_TOKENS = ['때문에', '위해서', '위해', '위한', '아니라'];

  // When the current token ends in 기 AND the next non-whitespace token is
  // one of these, the 기 suffix is a compound-connector nominalizer (기 때문에,
  // 기 위해서, 기 전에 …) → color it as connector.
  var COMPOUND_CONN_FOLLOWERS = ['때문에', '위해서', '위해', '위한', '전에', '후에'];

  // Negation adverbs — single syllable, checked before the length guard.
  var NEGATION_LIST = ['안', '못'];

  // Demonstrative determiners (관형사) — 이/그/저 and their extended forms.
  // Entire token coloured as modifier (golden); checked before particle rules.
  var DETERMINER_LIST = [
    '이런', '그런', '저런', '어떤', '무슨', '어느', '아무', '모든',
    '이', '그', '저', '각',
  ].sort(function (a, b) { return b.length - a.length; });

  // Bound nouns (의존 명사) — 것, 수, 때 etc.
  // Entire token coloured as neutral (green); checked before the length guard
  // so that single-syllable forms (것, 수, 때, 적, 뿐) are not discarded.
  var BOUND_NOUN_LIST = [
    '만큼', '정도',                   // 2-syllable bound nouns
    '것', '수', '때', '적', '하나',   // 1-syllable + common numerals caught before 나-particle rule
  ];

  // Location pronouns (장소 대명사) — 여기, 거기, 저기, 어디 etc.
  // Entire token coloured as location (teal); same colour family as 에/에서/까지.
  var LOCATION_PRONOUNS = ['여기', '거기', '저기', '어디', '이쪽', '그쪽', '저쪽'];

  // Common single-syllable standalone nouns — checked before the length guard.
  // Only unambiguous nouns that never serve as particles or verb endings.
  var NOUN_1CHAR = ['밥', '집', '책', '물', '옷', '산', '뭐', '형', '나', '너'];

  // Adjective/verb attributive (관형사형) forms — checked before particle rules
  // to prevent -은/-는-ending modifiers being coloured as subject particles.
  var MODIFIER_LIST = [
    // -한 : descriptive adjectives ending in 하다
    '가능한', '급격한', '긴장한', '다양한', '단순한', '따뜻한', '안전한',
    '유명한', '중요한', '진지한', '편리한', '필요한', '특별한', '깨끗한',
    '복잡한', '조용한', '위험한', '신기한', '행복한', '건강한', '피곤한',
    '심각한', '솔직한',
    // -한 : past-tense attributive forms of action verbs
    '결정한', '공부한', '구매한', '노력한', '도착한', '배운', '변한',
    '비롯한', '시작한', '약속한', '연습한', '참석한', '초월한', '활용한',
    '맡은', '먹은',
    // -운 : irregular (ㅂ-stem) adjective modifiers
    '매운', '새로운', '쉬운', '어려운', '귀여운', '아름다운',
    '무거운', '가벼운', '더운', '추운', '가까운',
    // -은 / ㄴ : pure adjective modifiers (prevent false subject coloring)
    '많은', '작은', '좋은', '예쁜', '나쁜', '밝은', '넓은', '좁은',
    '높은', '낮은', '빠른', '느린', '비싼', '큰',
    // -는 : present-tense action-verb modifiers (prevent false subject coloring)
    '가르치는', '공부하는', '기다리는', '나오는', '노력하는', '도착하는',
    '드리는', '마시는', '만나는', '만드는', '맛있는', '맛없는',
    '재미있는', '재미없는', '모르는', '배우는', '생기는', '시행하는',
    '예상되는', '요리하는', '위임하는', '이동하는', '잃어버리는',
    '정의하는', '좋아하는', '준비하는', '지키는', '추구하는',
    '읽는', '쓰는', '하는', '오는', '가는',
  ].sort(function (a, b) { return b.length - a.length; });

  // Pure standalone adverbs used without a trailing particle.
  // Checked before particle detection to prevent false positives like
  // 같이 → subject (이 after batchim) or 바로 → location (로 after open syllable).
  var ADVERBS_LIST = [
    // degree / intensity
    '아무리', '특히', '반드시', '물론', '아마',
    '많이',   '조금', '아주',   '너무', '정말', '진짜', '꽤',
    '전혀',   '거의', '겨우',   '별로', '꼭',   '더',   '덜',
    '얼마나', '얼마',                      // interrogative degree adverbs
    // frequency
    '매일', '매주', '항상', '언제나', '자주', '가끔', '때때로', '보통', '주로',
    // time point / manner of time
    '오늘', '어제', '내일', '모레', '올해', '작년', '내년',
    '일찍', '늦게', '지금', '결국',
    // manner — simple
    '빨리', '천천히', '열심히', '조용히', '갑자기', '소홀히',
    '잘',   '왜',    '또',     '직접',
    // manner — -게 adverbial forms
    '이렇게', '그렇게', '저렇게', '어떻게',
    '빠르게', '느리게', '쉽게',   '어렵게', '크게',   '작게',
    '자연스럽게', '빈번하게',
    // manner — -히 adverbial forms
    '꾸준히', '다행히', '완전히', '우연히', '충분히', '조심히',
    // together / mutual / alone
    '같이', '함께', '혼자', '서로',
    // sequence / discourse connectives
    '먼저', '드디어', '계속', '다시', '바로', '따라서',
    '그러나', '그런데', '그러면',
    // brief time
    '잠깐', '잠시', '금방', '방금', '이미', '아직',
  ];

  // ─── Color palette (matches rainbow grammar diagram) ─────────────────────
  //  subject   → RED    (강한 주격 마커)
  //  object    → BLUE   (목적격 마커)
  //  verb      → PINK   (서술어 어미)
  //  connector → ORANGE (연결어미 / 접속사)
  //  location  → TEAL   (장소·방향 조사)
  //  neutral   → GREEN  (관형격 의 / 보조사 도·만·마다)
  //  adverb    → PURPLE (부사)
  //  negation  → BROWN  (부정 부사 안·못)
  //  modifier  → GOLD   (관형사형 / 관형사)
  //  noun      → SLATE  (일반 명사 — bare noun without particle)
  // ─────────────────────────────────────────────────────────────────────────
  var COLORS = {
    subject:   '#e74c3c',  // red
    object:    '#2980b9',  // blue
    verb:      '#e91e63',  // pink / magenta
    connector: '#e67e22',  // orange
    location:  '#1abc9c',  // teal
    neutral:   '#27ae60',  // green
    adverb:    '#8e44ad',  // purple
    negation:  '#795548',  // brown
    modifier:  '#d4ac0d',  // golden yellow (adjective/verb attributive form)
    noun:      '#607d8b',  // slate blue-gray (bare noun / pronoun without particle)
  };

  // Light tint for the stem (noun / verb base).
  var STEM_COLORS = {
    subject:   '#f1948a',  // light red
    object:    '#7fb3d3',  // light blue
    verb:      '#f48fb1',  // light pink
    connector: '#f0b27a',  // light orange
    location:  '#76d7c4',  // light teal
    neutral:   '#a9dfbf',  // light green
    adverb:    '#c39bd3',  // light purple
    negation:  '#d7ccc8',  // light brown
    modifier:  '#f9e79f',  // light yellow (adjective/verb attributive stem)
    noun:      '#b0bec5',  // light slate (bare noun — whole token is vivid color so stem unused)
  };

  // Returns { role: String, endLen: Number } or null.
  // endLen = how many chars from the END of the clean token are the particle/ending.
  // The remainder is the stem (noun / verb / adj base).
  function detectRole(token) {
    if (!token || !/[가-힣]/.test(token)) return null;

    var clean  = token.replace(/[.,!?。、…~※「」]+$/, '');

    // 0a. Negation adverbs — single syllable, must come before length guard.
    if (NEGATION_LIST.indexOf(clean) !== -1) {
      return { role: 'negation', endLen: clean.length };
    }

    // 0b. Standalone compound-connector words (whole token = connector).
    if (STANDALONE_CONN_TOKENS.indexOf(clean) !== -1) {
      return { role: 'connector', endLen: clean.length };
    }

    // 0c. Known standalone adverbs — checked before particle rules to prevent
    //     false positives (e.g. 같이 → subject, 많이 → subject, 바로 → location).
    if (ADVERBS_LIST.indexOf(clean) !== -1) {
      return { role: 'adverb', endLen: clean.length };
    }

    // 0d. Known adjective/verb modifier forms — checked before particle rules
    //     to prevent e.g. 좋은/많은 → subject, 공부하는 → subject.
    //     endLen=1 splits the attributive ending (은/한/운/는) from the stem.
    if (MODIFIER_LIST.indexOf(clean) !== -1) {
      return { role: 'modifier', endLen: 1 };
    }

    // 0e. Demonstrative determiners (관형사) — whole token golden (modifier role).
    if (DETERMINER_LIST.indexOf(clean) !== -1) {
      return { role: 'modifier', endLen: clean.length };
    }

    // 0f. Bound nouns (의존 명사) — whole token neutral (green).
    if (BOUND_NOUN_LIST.indexOf(clean) !== -1) {
      return { role: 'neutral', endLen: clean.length };
    }

    // 0g. Location pronouns (장소 대명사) — whole token location (teal).
    if (LOCATION_PRONOUNS.indexOf(clean) !== -1) {
      return { role: 'location', endLen: clean.length };
    }

    // 0h. Common single-syllable nouns — whole token noun (slate).
    if (NOUN_1CHAR.indexOf(clean) !== -1) {
      return { role: 'noun', endLen: clean.length };
    }

    if (clean.length < 2) return null;

    // 0d. Negation verb forms starting with 않 (e.g. 않아요, 않았어요, 않고, 않으면).
    if (clean.startsWith('않')) {
      return { role: 'negation', endLen: clean.length };
    }
    // 0e. Compound negation forms starting with 못 and ≥ 2 chars (e.g. 못해요, 못했어요, 못한).
    if (clean.startsWith('못') && clean.length >= 2) {
      return { role: 'negation', endLen: clean.length };
    }

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

    // 3b. 뿐만 connector pattern (뿐만 아니라) — must come before NEUTRAL so
    //     that the trailing 만 is not caught by the neutral-particle rule.
    if (clean.endsWith('뿐만') && clean.length >= 2) return { role: 'connector', endLen: 2 };

    // 4. Invariant (neutral) particles
    for (var n = 0; n < NEUTRAL.length; n++) {
      if (clean.endsWith(NEUTRAL[n]) && clean.length > NEUTRAL[n].length && prevKo)
        return { role: 'neutral', endLen: NEUTRAL[n].length };
    }

    // 5. Comitative / alternation particles
    if (clean.endsWith('이랑') && clean.length > 2) return { role: 'connector', endLen: 2 };
    if (last === '와' && !hasBatchim(prev))          return { role: 'connector', endLen: 1 };
    if (last === '과' &&  hasBatchim(prev))          return { role: 'connector', endLen: 1 };
    if (last === '랑' && !hasBatchim(prev))          return { role: 'connector', endLen: 1 };
    // 나 / 이나 — alternation particle (영화나, 과자나; 이나 covered by CONN above)
    if (last === '나' && !hasBatchim(prev))          return { role: 'connector', endLen: 1 };

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
    // 7b. Prospective attributive -할 (하다 + prospective ㄹ → 할)
    //     Covers: 친절할, 공부할, 해결할, 이해할, 피곤할 etc.
    if (last === '할') return { role: 'modifier',  endLen: 1 };
    // 7c. V-해 (하여 contracted): informal / V-아어 connector form of 하다 verbs
    //     Covers: 말씀해, 말해, 공부해, 생각해, 이야기해, 설명해, 추천해 etc.
    //     올해 (this year) guarded by ADVERBS_LIST above; 위해/의해 by earlier rules.
    if (last === '해') return { role: 'verb',      endLen: 1 };

    // 8. Single-char particles (batchim-sensitive)
    if (last === '에')                         return { role: 'location', endLen: 1 };
    if (last === '로' && !hasBatchim(prev))    return { role: 'location', endLen: 1 };

    if (last === '가' && !hasBatchim(prev))    return { role: 'subject',  endLen: 1 };
    if (last === '이' &&  hasBatchim(prev))    return { role: 'subject',  endLen: 1 };
    if (last === '는' && !hasBatchim(prev))    return { role: 'subject',  endLen: 1 };
    if (last === '은' &&  hasBatchim(prev))    return { role: 'subject',  endLen: 1 };

    if (last === '를' && !hasBatchim(prev))    return { role: 'object',   endLen: 1 };
    if (last === '을' &&  hasBatchim(prev))    return { role: 'object',   endLen: 1 };

    // Fallback: unrecognised 2+ char Korean token → bare noun (slate blue-gray).
    // Covers 가족, 건강, 경제, 음식, 사람, 방법, 문화, 사회 etc. that appear
    // without a trailing particle (topic-dropped, vocative, or headlinese style).
    return { role: 'noun', endLen: clean.length };
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
      // Verb stem → verb color (light pink); 기 nominalizer → connector color (orange).
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

      // V지 before 않.../못... negation → color 지 as connector ending.
      if (cleanPart.endsWith('지') &&
          (nextClean.startsWith('않') || nextClean.startsWith('못'))) {
        result = { role: 'connector', endLen: 1 };
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
