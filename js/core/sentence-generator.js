// Template-based fallback sentence generator for vocab words with no
// hand-curated content in data/context-words.json — originally built for
// Harta Cuvântului (word-context.html), extracted here so other pages
// (e.g. the Glossary) can reuse the exact same, already-corrected
// generation logic instead of duplicating or re-deriving it.
// Depends on window.VerbConjugator (js/core/verb-conjugator.js) for
// present/past conjugation — load that script first.
window.SentenceGenerator = (function() {

function isConjugable(v) { const cats = v.categories || []; return v.ko.endsWith('다') && (cats.includes('verbs') || cats.includes('adjectives')); }
// Color words (갈색, 빨간색...) are tagged both 'adjectives' and 'nouns' —
// grammatically Korean nouns (색 + copula), but their RO/EN glosses are bare
// adjectives ("maro", "brown"), not countable objects. Routing them through
// isNounLike produced nonsense like "Aici avem: maro." / "Am nevoie de: maro."
// (lit. "Here we have: brown." / "I need: brown.") — a category mismatch, not
// a translation error. Must be checked before isNounLike so these 11 words
// get their own templates instead.
function isColorLike(v) { const cats = v.categories || []; return !isConjugable(v) && cats.includes('adjectives') && cats.includes('nouns'); }
function isNounLike(v) { const cats = v.categories || []; return !isConjugable(v) && !isColorLike(v) && cats.some(c => ['nouns','objects','subjects','places','times'].includes(c)); }
function isAdverbLike(v) { const cats = v.categories || []; return cats.includes('adverbs') || cats.includes('modifiers'); }

// -고 ("and/then") / -아서/-어서 ("because/glad that") / -아야/-어야 ("must") —
// derived the same way as extraSurfaceForms(), which is already relied on
// by click-to-explore. Copula-pattern stems (…적이다, 다행이다, stem ending
// in 이) don't produce a valid -아서/-아야 by that slice-based method, so
// they get the equivalent copula forms (-이라서/-이어야) instead.
function verbAdjExtraForms(word) {
  const stem = word.slice(0, -1);
  const last = stem[stem.length - 1];
  const andForm = stem + '고';
  const conj = VerbConjugator.conjugate(word);
  if (!conj || !conj[0]) return { andForm, causeForm: null, mustForm: null };
  if (last === '이' && !VerbConjugator.I_VERB_EXCEPTIONS.some(b => word === b || word.endsWith(b))) {
    const base = stem.slice(0, -1);
    const bat = VerbConjugator.hasBatchim(base);
    return { andForm, causeForm: base + (bat ? '이라서' : '라서'), mustForm: base + (bat ? '이어야' : '여야') };
  }
  if (conj[0].form.endsWith('요')) {
    const pres = conj[0].form;
    return { andForm, causeForm: pres.slice(0, -1) + '서', mustForm: pres.slice(0, -1) + '야' };
  }
  return { andForm, causeForm: null, mustForm: null };
}

const ADVERB_FRAMES = [
  { ko: adv => `사람들이 <b>${adv}</b> 그렇게 해요.`, roTail: 'oamenii fac asta.', enTail: 'people do it that way.', level: 'easy' },
  { ko: adv => `저는 <b>${adv}</b> 바빠요.`, roTail: 'sunt ocupat.', enTail: "I'm busy.", level: 'easy' },
  { ko: adv => `그는 <b>${adv}</b> 늦게 왔어요.`, roTail: 'a venit târziu.', enTail: 'he came late.', level: 'medium' },
  { ko: adv => `우리는 <b>${adv}</b> 이야기했어요.`, roTail: 'am vorbit.', enTail: 'we talked.', level: 'easy' },
  { ko: adv => `이 일은 <b>${adv}</b> 중요해요.`, roTail: 'acest lucru e important.', enTail: 'this matter is important.', level: 'medium' },
];

// ── Romanian subjunctive/indicative conjugation for "Vrea să:"/"Trebuie
// să:"/"E bine că:" sentences ──────────────────────────────────────────
// v.ro is stored as an infinitive gloss ("a se spăla", "a analiza"), which
// can't just be pasted after "să"/"trebuie" (that needs a conjugated verb,
// not another infinitive — "trebuie să: a se spăla" reads "must to: to
// wash"). RO_VERB_CONJ (indicative 3sg / subjunctive 3sg / participle for
// every distinct head verb behind the app's ~328 verb/adjective glosses)
// now lives in js/core/ro-conjugator.js (window.RoConjugator), so Builder's
// full 6-person conjugator can share the exact same table instead of a
// second hand-typed copy — load that script before this one.
const RO_VERB_CONJ = RoConjugator.RO_VERB_CONJ;

// First "a X, a Y" / "a X / a Y" alternate, WITHOUT splitting on a comma or
// slash that's inside parentheses — "a se opri (ploaia/ninsoarea)" has only
// one alternate; the "/" there separates two nouns inside a usage note, not
// two different meanings, so a naive split(',|/') would truncate mid-
// parenthesis ("a se opri (ploaia").
function firstAlt(ro) {
  let depth = 0;
  for (let i = 0; i < ro.length; i++) {
    const c = ro[i];
    if (c === '(') depth++;
    else if (c === ')') depth--;
    else if ((c === ',' || c === '/') && depth === 0) return ro.slice(0, i).trim();
  }
  return ro.trim();
}

// Splits a RO verb gloss into its grammatical marker (reflexive/dative/
// negation), head verb (the word to conjugate) and any trailing object
// phrase ("a aduce cuiva" -> head "aduce", tail "cuiva"). Only the first
// alternate before a comma/slash is used — a single sentence can't
// represent two different meanings at once.
function parseRoVerbGloss(ro) {
  const first = firstAlt(ro);
  const markers = [[/^a nu-i /, 'nu-i'], [/^a nu /, 'nu'], [/^a-ți /, 'ți'], [/^a-și /, 'și'], [/^a-i /, 'i'], [/^a se /, 'se'], [/^a /, null]];
  let marker = undefined, rest = first;
  for (const [re, m] of markers) {
    if (re.test(first)) { rest = first.replace(re, ''); marker = m; break; }
  }
  if (marker === undefined) return null; // doesn't start with "a " at all
  const parts = rest.split(' ');
  const head = parts[0];
  let tail = parts.slice(1).join(' ').trim();
  // A trailing standalone parenthetical ("(onorific)", "(online)") is a
  // usage note, not an object — drop it rather than gluing it into a
  // sentence ("...să mănânce (onorific)." would look broken).
  if (/^\(.*\)$/.test(tail)) tail = '';
  return { marker, head, tail };
}

// mood: 'subj' for "Vrea"/"Trebuie" (needs "să ..."), 'indic' for "Acum
// .../E bine că ..." (no "să"), 'past' for "Ieri ..." (compound past: aux
// "a" + participle — invariant for 3rd singular regardless of the verb, so
// the reflexive/dative pronoun elides onto it: se+a -> "s-a", își+a ->
// "și-a"). Returns null if the head verb isn't in RO_VERB_CONJ, so callers
// can fall back to the safe label style instead of guessing.
function roClause(ro, mood) {
  const parsed = parseRoVerbGloss(ro);
  if (!parsed) return null;
  const { marker, head, tail } = parsed;
  const entry = RO_VERB_CONJ[head];
  if (!entry) return null;
  const suffix = tail ? ' ' + tail : '';
  if (mood === 'past') {
    const prefix = { 'se':'s-a ', 'și':'și-a ', 'i':'i-a ', 'ți':'ți-a ', 'nu':'nu a ', 'nu-i':'nu i-a ' }[marker] || 'a ';
    return prefix + entry[2] + suffix;
  }
  const form = mood === 'subj' ? entry[1] : entry[0];
  const prefix = mood === 'subj'
    ? { 'se':'să se ', 'și':'să-și ', 'i':'să-i ', 'ți':'să-ți ', 'nu':'să nu ', 'nu-i':'să nu-i ' }[marker] || 'să '
    : { 'se':'se ', 'și':'își ', 'i':'îi ', 'ți':'îți ', 'nu':'nu ', 'nu-i':'nu-i ' }[marker] || '';
  return prefix + form + suffix;
}

// Same idea for the ~99 "a fi X"/"a se simți X"/"a-i fi X" adjective
// glosses — "fi" only ever conjugates to "e"/"fie"/"a fost" regardless of
// which adjective follows, so this needs no per-word lookup table at all.
function roAdjClause(ro, mood) {
  // Drop a trailing usage note ("(la întâlnire)", "(politicos)") — it reads
  // fine as an aside on a label, but glued onto a full sentence it looks
  // like a stray fragment: "E bine că e bucuros (la întâlnire)."
  const first = firstAlt(ro).replace(/\s*\([^)]*\)\s*$/, '');
  let m;
  if ((m = first.match(/^a se simți (.+)$/))) {
    return { subj:'să se simtă ', indic:'se simte ', past:'s-a simțit ' }[mood] + m[1];
  }
  if ((m = first.match(/^a-i fi (.+)$/))) {
    return { subj:'să-i fie ', indic:'îi e ', past:'i-a fost ' }[mood] + m[1];
  }
  if ((m = first.match(/^a-i părea (.+)$/))) {
    return { subj:'să-i pară ', indic:'îi pare ', past:'i-a părut ' }[mood] + m[1];
  }
  if ((m = first.match(/^a fi (.+)$/))) {
    return { subj:'să fie ', indic:'e ', past:'a fost ' }[mood] + m[1];
  }
  return { subj:'să fie ', indic:'e ', past:'a fost ' }[mood] + first; // bare adjective, e.g. "obosit"
}

// "Must"/"to be" (used by the Vrea/Trebuie/E bine că/andForm sentences
// above) only care about the bare form, and v.en is always stored with its
// own "to " marker already, so plain string surgery is enough there —
// unlike Romanian's person-and-verb-specific subjunctive, no lookup table
// needed.
// firstAlt (defined above) keeps this to one alternate — 146 of the 493
// verb/adjective glosses have a comma/slash second meaning ("to sing, to
// call"), which without this leaked straight through into "Wants to sing,
// to call." instead of "Wants to sing."
function enBareForm(en) { const f = firstAlt(en).replace(/\s*\([^)]*\)\s*$/, ''); return f.startsWith('to ') ? f.slice(3) : 'be ' + f; }
function enToForm(en) { const f = firstAlt(en).replace(/\s*\([^)]*\)\s*$/, ''); return f.startsWith('to ') ? f : 'to be ' + f; }

// EN_VERB_CONJ + enClauses() are only for the "Right now/Yesterday" pair,
// which (unlike Glad/Must/Nice above) needs an actual tense, not just a
// bare form. Past tense is a genuinely per-verb fact in English (go/went,
// buy/bought…), same reason Romanian needed RO_VERB_CONJ — hand-built,
// not guessed. Present tense sidesteps conjugation entirely by using
// singular "they" as the subject, which takes the bare verb form (no
// he/she "-s"), so only the past column actually gets used.

const EN_VERB_CONJ = {
  "accomplish": ["accomplishes", "accomplished"],
  "allow": ["allows", "allowed"],
  "analyze": ["analyzes", "analyzed"],
  "answer": ["answers", "answered"],
  "apologize": ["apologizes", "apologized"],
  "appear": ["appears", "appeared"],
  "apply": ["applies", "applied"],
  "approach": ["approaches", "approached"],
  "arise": ["arises", "arose"],
  "arrive": ["arrives", "arrived"],
  "ask": ["asks", "asked"],
  "attempt": ["attempts", "attempted"],
  "attend": ["attends", "attended"],
  "be": ["is", "was"],
  "become": ["becomes", "became"],
  "believe": ["believes", "believed"],
  "board": ["boards", "boarded"],
  "boil": ["boils", "boiled"],
  "book": ["books", "booked"],
  "borrow": ["borrows", "borrowed"],
  "break": ["breaks", "broke"],
  "bring": ["brings", "brought"],
  "browse": ["browses", "browsed"],
  "brush": ["brushes", "brushed"],
  "burn": ["burns", "burned"],
  "buy": ["buys", "bought"],
  "calculate": ["calculates", "calculated"],
  "call": ["calls", "called"],
  "cancel": ["cancels", "canceled"],
  "catch": ["catches", "caught"],
  "change": ["changes", "changed"],
  "charge": ["charges", "charged"],
  "check": ["checks", "checked"],
  "choose": ["chooses", "chose"],
  "clean": ["cleans", "cleaned"],
  "close": ["closes", "closed"],
  "collapse": ["collapses", "collapsed"],
  "collect": ["collects", "collected"],
  "collide": ["collides", "collided"],
  "come": ["comes", "came"],
  "compare": ["compares", "compared"],
  "complete": ["completes", "completed"],
  "concentrate": ["concentrates", "concentrated"],
  "confirm": ["confirms", "confirmed"],
  "congratulate": ["congratulates", "congratulated"],
  "contact": ["contacts", "contacted"],
  "cook": ["cooks", "cooked"],
  "cover": ["covers", "covered"],
  "cross": ["crosses", "crossed"],
  "cry": ["cries", "cried"],
  "cut": ["cuts", "cut"],
  "dance": ["dances", "danced"],
  "date": ["dates", "dated"],
  "decide": ["decides", "decided"],
  "decrease": ["decreases", "decreased"],
  "deliver": ["delivers", "delivered"],
  "depart": ["departs", "departed"],
  "develop": ["develops", "developed"],
  "die": ["dies", "died"],
  "disappear": ["disappears", "disappeared"],
  "discover": ["discovers", "discovered"],
  "dislike": ["dislikes", "disliked"],
  "do": ["does", "did"],
  "download": ["downloads", "downloaded"],
  "draw": ["draws", "drew"],
  "drink": ["drinks", "drank"],
  "drive": ["drives", "drove"],
  "eat": ["eats", "ate"],
  "encounter": ["encounters", "encountered"],
  "endure": ["endures", "endured"],
  "enjoy": ["enjoys", "enjoyed"],
  "enter": ["enters", "entered"],
  "escape": ["escapes", "escaped"],
  "exceed": ["exceeds", "exceeded"],
  "exchange": ["exchanges", "exchanged"],
  "exercise": ["exercises", "exercised"],
  "exist": ["exists", "existed"],
  "expect": ["expects", "expected"],
  "explain": ["explains", "explained"],
  "fail": ["fails", "failed"],
  "fall": ["falls", "fell"],
  "feel": ["feels", "felt"],
  "fight": ["fights", "fought"],
  "find": ["finds", "found"],
  "finish": ["finishes", "finished"],
  "fix": ["fixes", "fixed"],
  "fold": ["folds", "folded"],
  "follow": ["follows", "followed"],
  "forget": ["forgets", "forgot"],
  "forgive": ["forgives", "forgave"],
  "gather": ["gathers", "gathered"],
  "get": ["gets", "got"],
  "give": ["gives", "gave"],
  "go": ["goes", "went"],
  "grab": ["grabs", "grabbed"],
  "graduate": ["graduates", "graduated"],
  "greet": ["greets", "greeted"],
  "grill": ["grills", "grilled"],
  "grow": ["grows", "grew"],
  "hang": ["hangs", "hung"],
  "have": ["has", "had"],
  "hear": ["hears", "heard"],
  "help": ["helps", "helped"],
  "hide": ["hides", "hid"],
  "hit": ["hits", "hit"],
  "imagine": ["imagines", "imagined"],
  "improve": ["improves", "improved"],
  "include": ["includes", "included"],
  "increase": ["increases", "increased"],
  "install": ["installs", "installed"],
  "introduce": ["introduces", "introduced"],
  "invest": ["invests", "invested"],
  "invite": ["invites", "invited"],
  "keep": ["keeps", "kept"],
  "know": ["knows", "knew"],
  "laugh": ["laughs", "laughed"],
  "learn": ["learns", "learned"],
  "leave": ["leaves", "left"],
  "lend": ["lends", "lent"],
  "lie": ["lies", "lay"],
  "lift": ["lifts", "lifted"],
  "like": ["likes", "liked"],
  "listen": ["listens", "listened"],
  "live": ["lives", "lived"],
  "log": ["logs", "logged"],
  "look": ["looks", "looked"],
  "lose": ["loses", "lost"],
  "love": ["loves", "loved"],
  "lower": ["lowers", "lowered"],
  "make": ["makes", "made"],
  "meet": ["meets", "met"],
  "mix": ["mixes", "mixed"],
  "move": ["moves", "moved"],
  "obtain": ["obtains", "obtained"],
  "open": ["opens", "opened"],
  "order": ["orders", "ordered"],
  "oversleep": ["oversleeps", "overslept"],
  "pack": ["packs", "packed"],
  "pass": ["passes", "passed"],
  "pay": ["pays", "paid"],
  "pile": ["piles", "piled"],
  "play": ["plays", "played"],
  "practice": ["practices", "practiced"],
  "prepare": ["prepares", "prepared"],
  "press": ["presses", "pressed"],
  "pretend": ["pretends", "pretended"],
  "produce": ["produces", "produced"],
  "promise": ["promises", "promised"],
  "protect": ["protects", "protected"],
  "pull": ["pulls", "pulled"],
  "push": ["pushes", "pushed"],
  "put": ["puts", "put"],
  "quit": ["quits", "quit"],
  "rain": ["rains", "rained"],
  "raise": ["raises", "raised"],
  "read": ["reads", "read"],
  "receive": ["receives", "received"],
  "recommend": ["recommends", "recommended"],
  "recover": ["recovers", "recovered"],
  "reduce": ["reduces", "reduced"],
  "refuse": ["refuses", "refused"],
  "register": ["registers", "registered"],
  "regret": ["regrets", "regretted"],
  "remember": ["remembers", "remembered"],
  "remove": ["removes", "removed"],
  "repeat": ["repeats", "repeated"],
  "research": ["researches", "researched"],
  "reserve": ["reserves", "reserved"],
  "rest": ["rests", "rested"],
  "retire": ["retires", "retired"],
  "ride": ["rides", "rode"],
  "ring": ["rings", "rang"],
  "rub": ["rubs", "rubbed"],
  "run": ["runs", "ran"],
  "save": ["saves", "saved"],
  "search": ["searches", "searched"],
  "see": ["sees", "saw"],
  "sell": ["sells", "sold"],
  "send": ["sends", "sent"],
  "set": ["sets", "set"],
  "shake": ["shakes", "shook"],
  "share": ["shares", "shared"],
  "shave": ["shaves", "shaved"],
  "sing": ["sings", "sang"],
  "sit": ["sits", "sat"],
  "sleep": ["sleeps", "slept"],
  "speak": ["speaks", "spoke"],
  "stand": ["stands", "stood"],
  "stare": ["stares", "stared"],
  "start": ["starts", "started"],
  "stop": ["stops", "stopped"],
  "study": ["studies", "studied"],
  "succeed": ["succeeds", "succeeded"],
  "suit": ["suits", "suited"],
  "sweat": ["sweats", "sweated"],
  "swim": ["swims", "swam"],
  "take": ["takes", "took"],
  "talk": ["talks", "talked"],
  "teach": ["teaches", "taught"],
  "thank": ["thanks", "thanked"],
  "think": ["thinks", "thought"],
  "throw": ["throws", "threw"],
  "tie": ["ties", "tied"],
  "transfer": ["transfers", "transferred"],
  "travel": ["travels", "traveled"],
  "turn": ["turns", "turned"],
  "understand": ["understands", "understood"],
  "unfold": ["unfolds", "unfolded"],
  "untie": ["unties", "untied"],
  "upload": ["uploads", "uploaded"],
  "use": ["uses", "used"],
  "utilize": ["utilizes", "utilized"],
  "visit": ["visits", "visited"],
  "wait": ["waits", "waited"],
  "wake": ["wakes", "woke"],
  "walk": ["walks", "walked"],
  "want": ["wants", "wanted"],
  "wash": ["washes", "washed"],
  "watch": ["watches", "watched"],
  "wear": ["wears", "wore"],
  "win": ["wins", "won"],
  "wipe": ["wipes", "wiped"],
  "work": ["works", "worked"],
  "worry": ["worries", "worried"],
  "wrap": ["wraps", "wrapped"],
  "write": ["writes", "wrote"],
};

// Handles both verbs and the ~50 verb-category glosses phrased as "to be
// X"/"to feel X" (놀라다 "to be surprised", 개운하다 "to feel refreshed")
// the same way, plus the 2 negated glosses ("to not know"/"to not have")
// and the one already-complete clause ("weather is nice"). Returns
// { present, past } or null if the head verb isn't in EN_VERB_CONJ.
function enClauses(en) {
  // firstAlt (defined above, for the RO side) already handles a "/" or ","
  // inside parentheses correctly ("to stop (rain/snow)" is one alternate,
  // not two) — reuse it instead of a naive split that would cut mid-note.
  const first = firstAlt(en).replace(/\s*\([^)]*\)\s*$/, '');
  let m;
  if ((m = first.match(/^to not (.+)$/))) return { present: `they don't ${m[1]}`, past: `they didn't ${m[1]}` };
  if ((m = first.match(/^to feel (.+)$/))) return { present: `they feel ${m[1]}`, past: `they felt ${m[1]}` };
  if ((m = first.match(/^to miss (.+)$/))) return { present: `they miss ${m[1]}`, past: `they missed ${m[1]}` };
  if ((m = first.match(/^to be (.+)$/))) return { present: `they're ${m[1]}`, past: `they were ${m[1]}` };
  // "to rain" has no personal subject in English ("it rains", never
  // "they rain") — the only weather verb in the current vocab, so a single
  // targeted exception beats a general impersonal-verb detector.
  if (first === 'to rain') return { present: 'it rains', past: 'it rained' };
  if ((m = first.match(/^to (.+)$/))) {
    const parts = m[1].split(' ');
    const head = parts[0];
    let tail = parts.slice(1).join(' ').trim();
    if (/^\([^)]*\)$/.test(tail)) tail = '';
    const entry = EN_VERB_CONJ[head];
    if (!entry) return null;
    return { present: `they ${head}${tail ? ' ' + tail : ''}`, past: `they ${entry[1]}${tail ? ' ' + tail : ''}` };
  }
  if (/\bis\b/.test(first)) return { present: first, past: first.replace(/\bis\b/, 'was') };
  return { present: `it's ${first}`, past: `it was ${first}` }; // bare adjective, e.g. "possible"
}

function generate(v, lang) {
  const isRo = lang === 'ro';
  let sentences = [];
  if (isConjugable(v)) {
      const conj = VerbConjugator.conjugate(v.ko);
      const isVerb = (v.categories || []).includes('verbs');
      if (conj) {
        // "Acum: a spăla."/"Ieri: a spăla." read as flashcard labels, not
        // sentences translating "지금 씻어요" ("(he/she) is washing right
        // now") — real present/past conjugation instead, same fix as the
        // Vrea/Trebuie/E bine că frames below.
        const nowClause = isVerb ? roClause(v.ro, 'indic') : roAdjClause(v.ro, 'indic');
        const pastClause = isVerb ? roClause(v.ro, 'past') : roAdjClause(v.ro, 'past');
        const enTense = enClauses(v.en);
        sentences.push({ ko:`지금 <b>${conj[0].form}</b>.`, ro: isRo?(nowClause?`Acum ${nowClause}.`:`Acum: ${v.ro}.`):(enTense?`Right now, ${enTense.present}.`:`Right now: ${v.en}.`), level:'easy' });
        sentences.push({ ko:`어제 <b>${conj[1].form}</b>.`, ro: isRo?(pastClause?`Ieri ${pastClause}.`:`Ieri: ${v.ro}.`):(enTense?`Yesterday, ${enTense.past}.`:`Yesterday: ${v.en}.`), level:'easy' });
        const { andForm, causeForm, mustForm } = verbAdjExtraForms(v.ko);
        if (isVerb) {
          // Real conjugation now, not a label workaround: "trebuie să: a se
          // spăla" -> "trebuie să se spele", using RO_VERB_CONJ + roClause()
          // above. Falls back to the old neutral-label style only if the head
          // verb isn't in the table (shouldn't happen for the current 328
          // verbs — this is just a safety net against a future vocab add).
          const wantSubj = roClause(v.ro, 'subj'), wantIndic = roClause(v.ro, 'indic');
          sentences.push({ ko:`<b>${andForm}</b> 싶어요.`, ro: isRo?(wantSubj?`Vrea ${wantSubj}.`:`Vrea: ${v.ro}.`):`Wants ${enToForm(v.en)}.`, level:'medium' });
          if (causeForm) sentences.push({ ko:`<b>${causeForm}</b> 좋았어요.`, ro: isRo?(wantIndic?`E bine că ${wantIndic}.`:`Bucuros: ${v.ro}.`):`Glad ${enToForm(v.en)}.`, level:'medium' });
          if (mustForm) sentences.push({ ko:`<b>${mustForm}</b> 해요.`, ro: isRo?(wantSubj?`Trebuie ${wantSubj}.`:`Necesar: ${v.ro}.`):`Must ${enBareForm(v.en)}.`, level:'medium' });
        } else {
          // Same real-conjugation upgrade for adjectives — "fi" always
          // conjugates to "e"/"fie" regardless of which adjective follows, so
          // this needs no per-word table, just roAdjClause() above.
          //
          // andForm/causeForm used to end in "좋아요" ("...and it's good" /
          // "glad that...") — nonsensical for any negative-valence adjective
          // ("억울하고 좋아요" = "wronged, and that's good"; same for sad,
          // scared, embarrassed, annoyed, tired, bored... 23+ words). "그래요"
          // ("...and that's how it is" / "...that's why") is a genuinely
          // idiomatic Korean filler that works after ANY adjective regardless
          // of valence, so the sentence stops asserting something false.
          const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
          const enPresent = enClauses(v.en)?.present ?? enBareForm(v.en);
          sentences.push({ ko:`<b>${andForm}</b> 그래요.`, ro: isRo?`Da, ${roAdjClause(v.ro,'indic')}.`:`Yeah, ${enPresent}.`, level:'medium' });
          if (causeForm) sentences.push({ ko:`<b>${causeForm}</b> 그래요.`, ro: isRo?`${cap(roAdjClause(v.ro,'indic'))}, de-aia.`:`${cap(enPresent)}, that's why.`, level:'medium' });
          if (mustForm) sentences.push({ ko:`<b>${mustForm}</b> 해요.`, ro: isRo?`Trebuie ${roAdjClause(v.ro,'subj')}.`:`Must ${enBareForm(v.en)}.`, level:'medium' });
        }
        // Copula-pattern stems (or any edge case with no cause/must form) still
        // need to reach 5 — fill the gap with two more tense-based sentences
        // rather than ever inventing an unverified grammar construction.
        while (sentences.length < 5) {
          const useLast = sentences.length % 2 === 0;
          sentences.push(useLast
            ? { ko:`네, <b>${conj[1].form}</b>.`, ro: isRo?`Da: ${v.ro}.`:`Yes: ${v.en}.`, level:'easy' }
            : { ko:`정말 <b>${conj[0].form}</b>.`, ro: isRo?`Chiar: ${v.ro}.`:`Really: ${v.en}.`, level:'easy' });
        }
      }
    } else if (isColorLike(v)) {
      // RO color glosses are stored as bare masculine-singular forms only
      // ("negru", not "neagră"/"negri"/"negre"), so every subject here is
      // deliberately masculine/neuter singular (cer, perete) or the color
      // word itself used as an abstract noun ("Roșu e stilul meu" — colors
      // default to masculine when used as nouns in Romanian) to avoid
      // gender/number agreement mismatches EN never has this problem with.
      const bat = VerbConjugator.hasBatchim(v.ko);
      const copula = bat ? '이에요' : '예요';
      const subjExt = bat ? '이' : '가';
      const objExt = bat ? '을' : '를';
      const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
      // firstAlt() drops comma alternates ("violet, mov" -> "violet") and the
      // trailing strip drops disambiguator notes ("orange (color)" -> "orange")
      // — both read fine in a word list but awkward mid-sentence.
      const disp = firstAlt(isRo ? v.ro : v.en).replace(/\s*\([^)]*\)\s*$/, '');
      sentences.push({ ko:`이것은 <b>${v.ko}${copula}</b>.`, ro: isRo?`Asta e ${disp}.`:`This is ${disp}.`, level:'easy' });
      sentences.push({ ko:`제 방 벽은 <b>${v.ko}${copula}</b>.`, ro: isRo?`Peretele din camera mea e ${disp}.`:`My room's wall is ${disp}.`, level:'easy' });
      sentences.push({ ko:`저는 ${v.ko}<b>${objExt}</b> 좋아해요.`, ro: isRo?`Îmi place ${disp}.`:`I like ${disp}.`, level:'easy' });
      sentences.push({ ko:`오늘 하늘은 <b>${v.ko}${copula}</b>.`, ro: isRo?`Azi cerul e ${disp}.`:`Today the sky is ${disp}.`, level:'medium' });
      sentences.push({ ko:`${v.ko}<b>${subjExt}</b> 제 취향이에요.`, ro: isRo?`${cap(disp)} e stilul meu.`:`${cap(disp)} is my style.`, level:'medium' });
    } else if (isNounLike(v)) {
      const bat = VerbConjugator.hasBatchim(v.ko);
      const copula = bat ? '이에요' : '예요';
      const subjExt = bat ? '이' : '가';
      const objExt = bat ? '을' : '를';
      const topicExt = bat ? '은' : '는';
      sentences.push({ ko:`이것은 <b>${v.ko}${copula}</b>.`, ro: isRo?`Asta e: ${v.ro}.`:`This is: ${v.en}.`, level:'easy' });
      sentences.push({ ko:`${v.ko}<b>${subjExt}</b> 여기 있어요.`, ro: isRo?`Aici avem: ${v.ro}.`:`Here we have: ${v.en}.`, level:'easy' });
      sentences.push({ ko:`저는 ${v.ko}<b>${objExt}</b> 좋아해요.`, ro: isRo?`Îmi place: ${v.ro}.`:`I like: ${v.en}.`, level:'easy' });
      sentences.push({ ko:`이 ${v.ko}<b>${topicExt}</b> 정말 좋아요.`, ro: isRo?`Recomand: ${v.ro}.`:`Recommend: ${v.en}.`, level:'medium' });
      sentences.push({ ko:`그 ${v.ko}<b>${subjExt}</b> 필요해요.`, ro: isRo?`Am nevoie de: ${v.ro}.`:`I need: ${v.en}.`, level:'medium' });
    } else if (isAdverbLike(v)) {
      // Always lead with the adverb/connector as its own clause, never splice it
      // mid-sentence — multi-word RO/EN glosses (e.g. "din perspectivă generală")
      // broke natural word order when inserted between subject and predicate.
      const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
      ADVERB_FRAMES.forEach(f => {
        const ro = `${cap(v.ro)}, ${f.roTail}`;
        const en = `${cap(v.en)}, ${f.enTail}`;
        sentences.push({ ko: f.ko(v.ko), ro, en, level: f.level });
      });
    }
  return sentences;
}

return { isConjugable, isColorLike, isNounLike, isAdverbLike, generate };

})();
