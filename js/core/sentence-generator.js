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

// 'times' words (내일, 매일, 당장...) are deictic/adverbial — "Aici avem:
// mâine." ("Here we have: tomorrow.") is nonsense no matter how the article
// is fixed, because "tomorrow" isn't an object that can be "here". Checked
// before isNounLike so these get their own templates.
function isTimeLike(v) { const cats = v.categories || []; return !isConjugable(v) && !isColorLike(v) && cats.includes('times'); }

// Relative/positional words (위/아래/앞/뒤/안/밖/옆/오른쪽/왼쪽/사이/이쪽/사방/
// 전국/이곳/그곳) are tagged 'places' but aren't countable nouns — "Am nevoie
// de: dreapta." ("I need: right [side].") is meaningless. Identified by ko
// value (not category) since 'places' also holds ordinary nouns like 학교.
const POSITION_WORDS = new Set(['위','아래','앞','뒤','안','밖','옆','오른쪽','왼쪽','사이','이쪽','사방','전국','이곳','그곳']);
function isPositionLike(v) { return POSITION_WORDS.has(v.ko); }

// ── Regular countable nouns (isNounLike branch) ─────────────────────────
// RO glosses are stored as bare dictionary forms with no gender marker, but
// "Asta e: pix." ("This is: pen.") is broken Romanian without "un/o" — and
// picking the wrong one ("o pix" for masculine "pix") would just trade one
// error for another. Romanian neuter behaves as masculine in the singular,
// so this list only needs to name the FEMININE nouns — everything else
// defaults to "un" correctly. Hand-classified (not derived from a suffix
// rule: multi-word glosses like "deget de la mână" take their gender from
// the first/head word, not whichever word ends the phrase, so a blind
// last-letter heuristic silently produces wrong output on phrases).
const RO_NOUN_FEM = new Set(['가능성','가방','가설','가을','가정','가족','가치','간호사','감기','감사','감정','강의','개발','거리','거울','걱정','건강','겨울','경쟁력','경제','경찰서','경험','계층','고기','고모','고양이','고추장','공동체','과학','관계','관찰','광고','광장','교실','교육','교육 기관','교차로','교회','구조','국','국제 사회','귀','규칙','귤','기대','기분','기쁨','기술','기술 발전','기억','기업','기업 조직','기차역','기회','꽃','나라','나이','날씨','냄비','넥타이','노동','노인','놀람','누나','눈','눈썹','능력','다양성','단계','닭','닭고기','대학교','대화','도서관','돌','동기','동물원','돼지고기','된장','된장찌개','두려움','두통','등산','딸','마당','맥주','며느리','모양','모자','목소리','몸무게','무게','문','문제','문화','물','미역국','바나나','바다','반찬','발목','발전','발톱','발표','밤','밥맛','방','방법','방향','배','배터리','버섯','법','베개','벨트','변화','별','병','보험','복숭아','봄','부동산','부엌','분석','분위기','불평등','불행','비','비밀번호','비자','빗자루','빵','사거리','사람','사랑','사진','사탕','사회','사회 구조','산업','산업 사회','삼겹살','삼계탕','상처','상태','상황','새','색깔','샐러드','생수','생활','서점','선택','설명','섬','성격','성과','성장','성적','세계','세상','세탁기','셔츠','소','소고기','소금','소식','소파','속도','속옷','손','손녀','손톱','수술','수영장','숙소','숙제','순서','숟가락','숲','슬픔','승진','시장','신뢰','실력','실수','심장','아내','아르바이트','아버지','아이디어','아이스크림','아침','안개','알람','앱','약국','양파','어려움','어머니','언니','얼굴','얼음','여동생','여름','여자','여행','역','연구','연구팀','열쇠','열정','영수증','영향','오렌지','오리','오염','오전','오토바이','오후','온도','외국어','우산','우정','원숭이','원피스','월세','위기','유치원','은행','음식','음악','응급실','이론','이마','이모','이불','이슬','이야기','이자','인구','일','입','입학','잎','자동차','자세','자신감','자전거','잠옷','잡지','재킷','저녁','전략','전세','절반','접시','정류장','정보','정보 사회','정부 기관','정책','조건','조사','졸업','종이','주사','주소','주유소','주차장','지도','지도부','지식','지역','지역 사회','지우개','지출','지하철역','직업','질문','집','쪽','찌개','차이','창문','채식','채용','책','책임','체육관','초등학교','초콜릿','추세','출장','측정','치마','치약','치즈','칠판','칫솔','카메라','카페','커튼','커피','크기','키','탄산수','태도','태블릿','택배','테이블','토마토','특징','편지','평가','평균','폭풍','프라이팬','프린터','피부','피자','필요','학교','할머니','할인','해변','허리','헬스장','혀','혁신','현대 사회','화','화장실','회사','회의','횡단보도','희망','힘']);

// Pronouns, native-Korean numbers, a proper noun (부산), and glosses that
// are already grammatically complete/definite phrases (한국어 "limba
// coreeană", 마지막 "ultimul", 손목 "încheietura mâinii") — injecting "un/o"
// in front of any of these is wrong ("un acesta", "o ultimul"), so they get
// a bare-noun template instead. All are grammatically singular.
const NOUN_NO_ARTICLE = new Set(['그것','나','너','넷','누구','다들','다섯','달빛','당신','둘','마지막','만','무엇','백','부산','삶','셋','손목','아홉','여덟','여섯','열','오랜만','우리','우체국','이것','일곱','저','저것','천','하나','학계','한국어','한마디','햇빛']);

// Glosses that are inherently plural in RO and/or EN (바지 "pantaloni"/
// "pants", 안경 "ochelari"/"glasses") — "un/o" or "a/an" in front of a
// plural noun is ungrammatical in both languages, so these use plural-safe
// verb forms ("sunt"/"are") instead of the singular-article templates.
const NOUN_PLURAL_BOTH = new Set(['가위','갈비','계단','과자','구두','국수','귀걸이','냉면','라면','만두','바지','반바지','부모','선글라스','선생님들','신발','안경','양말','업무','예의','옷','운동화','이어폰','인간 관계','입술','자료','장갑','젓가락','지도자들','채소','책들','파스타','포도','학생들','형제']);

// RO gloss is a regular singular noun (needs un/o normally) but the EN
// gloss is a mass noun that never takes "a/an" in English (news, pajamas,
// underwear) — English-only exception, RO stays in the regular fem branch.
const EN_NOUN_BARE = new Set(['소식','잠옷','속옷']);

// "a" vs "an" by the spelling of the first letter is right almost always;
// the exceptions found in this vocabulary are consonant-sound loanwords
// starting with a vowel letter ("a university", not "an university") and
// one silent-h word ("an hourly wage", not "a hourly wage").
const EN_ARTICLE_FORCE_A = new Set(['university','university student','user']);
const EN_ARTICLE_FORCE_AN = new Set(['hourly wage']);
function enArticle(disp) {
  const key = disp.toLowerCase();
  if (EN_ARTICLE_FORCE_A.has(key)) return 'a';
  if (EN_ARTICLE_FORCE_AN.has(key)) return 'an';
  return /^[aeiou]/i.test(disp) ? 'an' : 'a';
}

function isNounLike(v) { const cats = v.categories || []; return !isConjugable(v) && !isColorLike(v) && !isTimeLike(v) && !isPositionLike(v) && cats.some(c => ['nouns','objects','subjects','places','times'].includes(c)); }
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
// wash"). RO_VERB_CONJ is a hand-built table of [indicative 3sg,
// subjunctive 3sg] for every distinct verb behind these 328 glosses, so
// "a se spăla" -> "trebuie să se spele" instead.
const RO_VERB_CONJ = {
  "absolvi": ["absolvă", "absolve", "absolvit"],
  "acoperi": ["acoperă", "acopere", "acoperit"],
  "adormi": ["adoarme", "adoarmă", "adormit"],
  "aduce": ["aduce", "aducă", "adus"],
  "aduna": ["adună", "adune", "adunat"],
  "agăța": ["agață", "agațe", "agățat"],
  "ajunge": ["ajunge", "ajungă", "ajuns"],
  "ajuta": ["ajută", "ajute", "ajutat"],
  "alege": ["alege", "aleagă", "ales"],
  "alerga": ["aleargă", "alerge", "alergat"],
  "amesteca": ["amestecă", "amestece", "amestecat"],
  "aminti": ["amintește", "amintească", "amintit"],
  "analiza": ["analizează", "analizeze", "analizat"],
  "anula": ["anulează", "anuleze", "anulat"],
  "aplica": ["aplică", "aplice", "aplicat"],
  "aprinde": ["aprinde", "aprindă", "aprins"],
  "apropia": ["apropie", "apropie", "apropiat"],
  "apuca": ["apucă", "apuce", "apucat"],
  "apărea": ["apare", "apară", "apărut"],
  "apăsa": ["apasă", "apese", "apăsat"],
  "arde": ["arde", "ardă", "ars"],
  "arunca": ["aruncă", "arunce", "aruncat"],
  "asculta": ["ascultă", "asculte", "ascultat"],
  "ascunde": ["ascunde", "ascundă", "ascuns"],
  "autentifica": ["autentifică", "autentifice", "autentificat"],
  "auzi": ["aude", "audă", "auzit"],
  "avansa": ["avansează", "avanseze", "avansat"],
  "avea": ["are", "aibă", "avut"],
  "așeza": ["așază", "așeze", "așezat"],
  "aștepta": ["așteaptă", "aștepte", "așteptat"],
  "bea": ["bea", "bea", "băut"],
  "bucura": ["bucură", "bucure", "bucurat"],
  "bărbieri": ["bărbierește", "bărbierească", "bărbierit"],
  "calcula": ["calculează", "calculeze", "calculat"],
  "cerceta": ["cercetează", "cerceteze", "cercetat"],
  "cere": ["cere", "ceară", "cerut"],
  "certa": ["ceartă", "certe", "certat"],
  "ciocni": ["ciocnește", "ciocnească", "ciocnit"],
  "citi": ["citește", "citească", "citit"],
  "coborî": ["coboară", "coboare", "coborât"],
  "comanda": ["comandă", "comande", "comandat"],
  "compara": ["compară", "compare", "comparat"],
  "concentra": ["concentrează", "concentreze", "concentrat"],
  "conduce": ["conduce", "conducă", "condus"],
  "contacta": ["contactează", "contacteze", "contactat"],
  "continua": ["continuă", "continue", "continuat"],
  "crede": ["crede", "creadă", "crezut"],
  "crește": ["crește", "crească", "crescut"],
  "culca": ["culcă", "culce", "culcat"],
  "cumpăra": ["cumpără", "cumpere", "cumpărat"],
  "cânta": ["cântă", "cânte", "cântat"],
  "câștiga": ["câștigă", "câștige", "câștigat"],
  "cădea": ["cade", "cadă", "căzut"],
  "călători": ["călătorește", "călătorească", "călătorit"],
  "căsători": ["căsătorește", "căsătorească", "căsătorit"],
  "căuta": ["caută", "caute", "căutat"],
  "da": ["dă", "dea", "dat"],
  "dansa": ["dansează", "danseze", "dansat"],
  "decide": ["decide", "decidă", "decis"],
  "deconecta": ["deconectează", "deconecteze", "deconectat"],
  "demisiona": ["demisionează", "demisioneze", "demisionat"],
  "depăși": ["depășește", "depășească", "depășit"],
  "deschide": ["deschide", "deschidă", "deschis"],
  "descoperi": ["descoperă", "descopere", "descoperit"],
  "descărca": ["descarcă", "descarce", "descărcat"],
  "desena": ["desenează", "deseneze", "desenat"],
  "desface": ["desface", "desfacă", "desfăcut"],
  "despărți": ["desparte", "despartă", "despărțit"],
  "deveni": ["devine", "devină", "devenit"],
  "dezbrăca": ["dezbracă", "dezbrace", "dezbrăcat"],
  "dezlega": ["dezleagă", "dezlege", "dezlegat"],
  "dezvolta": ["dezvoltă", "dezvolte", "dezvoltat"],
  "dispărea": ["dispare", "dispară", "dispărut"],
  "divorța": ["divorțează", "divorțeze", "divorțat"],
  "dori": ["dorește", "dorească", "dorit"],
  "dormi": ["doarme", "doarmă", "dormit"],
  "economisi": ["economisește", "economisească", "economisit"],
  "epuiza": ["epuizează", "epuizeze", "epuizat"],
  "exersa": ["exersează", "exerseze", "exersat"],
  "exista": ["există", "existe", "existat"],
  "explica": ["explică", "explice", "explicat"],
  "eșua": ["eșuează", "eșueze", "eșuat"],
  "face": ["face", "facă", "făcut"],
  "felicita": ["felicită", "felicite", "felicitat"],
  "fi": ["e", "fie", "fost"],
  "fierbe": ["fierbe", "fiarbă", "fiert"],
  "finaliza": ["finalizează", "finalizeze", "finalizat"],
  "folosi": ["folosește", "folosească", "folosit"],
  "fotografia": ["fotografiază", "fotografieze", "fotografiat"],
  "freca": ["freacă", "frece", "frecat"],
  "frecventa": ["frecventează", "frecventeze", "frecventat"],
  "frământa": ["frământă", "frământe", "frământat"],
  "gândi": ["gândește", "gândească", "gândit"],
  "găsi": ["găsește", "găsească", "găsit"],
  "găti": ["gătește", "gătească", "gătit"],
  "ierta": ["iartă", "ierte", "iertat"],
  "ieși": ["iese", "iasă", "ieșit"],
  "imagina": ["imaginează", "imagineze", "imaginat"],
  "include": ["include", "includă", "inclus"],
  "instala": ["instalează", "instaleze", "instalat"],
  "intra": ["intră", "intre", "intrat"],
  "investi": ["investește", "investească", "investit"],
  "invita": ["invită", "invite", "invitat"],
  "iubi": ["iubește", "iubească", "iubit"],
  "juca": ["joacă", "joace", "jucat"],
  "lega": ["leagă", "lege", "legat"],
  "liniști": ["liniștește", "liniștească", "liniștit"],
  "livra": ["livrează", "livreze", "livrat"],
  "lovi": ["lovește", "lovească", "lovit"],
  "lua": ["ia", "ia", "luat"],
  "lăsa": ["lasă", "lase", "lăsat"],
  "machia": ["machiază", "machieze", "machiat"],
  "merge": ["merge", "meargă", "mers"],
  "mulțumi": ["mulțumește", "mulțumească", "mulțumit"],
  "munci": ["muncește", "muncească", "muncit"],
  "muri": ["moare", "moară", "murit"],
  "muta": ["mută", "mute", "mutat"],
  "mânca": ["mănâncă", "mănânce", "mâncat"],
  "mări": ["mărește", "mărească", "mărit"],
  "naște": ["naște", "nască", "născut"],
  "obține": ["obține", "obțină", "obținut"],
  "odihni": ["odihnește", "odihnească", "odihnit"],
  "opri": ["oprește", "oprească", "oprit"],
  "participa": ["participă", "participe", "participat"],
  "pensiona": ["pensionează", "pensioneze", "pensionat"],
  "permite": ["permite", "permită", "permis"],
  "pierde": ["pierde", "piardă", "pierdut"],
  "pleca": ["pleacă", "plece", "plecat"],
  "plimba": ["plimbă", "plimbe", "plimbat"],
  "ploua": ["plouă", "plouă", "plouat"],
  "plânge": ["plânge", "plângă", "plâns"],
  "plăcea": ["place", "placă", "plăcut"],
  "plăti": ["plătește", "plătească", "plătit"],
  "potrivi": ["potrivește", "potrivească", "potrivit"],
  "preda": ["predă", "predea", "predat"],
  "preface": ["preface", "prefacă", "prefăcut"],
  "pregăti": ["pregătește", "pregătească", "pregătit"],
  "prelua": ["preia", "preia", "preluat"],
  "prevedea": ["prevede", "prevadă", "prevăzut"],
  "prezenta": ["prezintă", "prezinte", "prezentat"],
  "primi": ["primește", "primească", "primit"],
  "produce": ["produce", "producă", "produs"],
  "promite": ["promite", "promită", "promis"],
  "proteja": ["protejează", "protejeze", "protejat"],
  "prăji": ["prăjește", "prăjească", "prăjit"],
  "pune": ["pune", "pună", "pus"],
  "purta": ["poartă", "poarte", "purtat"],
  "recomanda": ["recomandă", "recomande", "recomandat"],
  "recupera": ["recuperează", "recupereze", "recuperat"],
  "reduce": ["reduce", "reducă", "redus"],
  "refuza": ["refuză", "refuze", "refuzat"],
  "regreta": ["regretă", "regrete", "regretat"],
  "renunța": ["renunță", "renunțe", "renunțat"],
  "repara": ["repară", "repare", "reparat"],
  "repeta": ["repetă", "repete", "repetat"],
  "respecta": ["respectă", "respecte", "respectat"],
  "reuși": ["reușește", "reușească", "reușit"],
  "rezerva": ["rezervă", "rezerve", "rezervat"],
  "ridica": ["ridică", "ridice", "ridicat"],
  "ruga": ["roagă", "roage", "rugat"],
  "râde": ["râde", "râdă", "râs"],
  "răni": ["rănește", "rănească", "rănit"],
  "răsfoi": ["răsfoiește", "răsfoiască", "răsfoit"],
  "răspunde": ["răspunde", "răspundă", "răspuns"],
  "saluta": ["salută", "salute", "salutat"],
  "salva": ["salvează", "salveze", "salvat"],
  "schimba": ["schimbă", "schimbe", "schimbat"],
  "scoate": ["scoate", "scoată", "scos"],
  "scrie": ["scrie", "scrie", "scris"],
  "scutura": ["scutură", "scuture", "scuturat"],
  "scădea": ["scade", "scadă", "scăzut"],
  "scăpa": ["scapă", "scape", "scăpat"],
  "seta": ["setează", "seteze", "setat"],
  "simți": ["simte", "simtă", "simțit"],
  "speria": ["sperie", "sperie", "speriat"],
  "spăla": ["spală", "spele", "spălat"],
  "sta": ["stă", "stea", "stat"],
  "stinge": ["stinge", "stingă", "stins"],
  "strica": ["strică", "strice", "stricat"],
  "studia": ["studiază", "studieze", "studiat"],
  "suna": ["sună", "sune", "sunat"],
  "supăra": ["supără", "supere", "supărat"],
  "telefona": ["telefonează", "telefoneze", "telefonat"],
  "termina": ["termină", "termine", "terminat"],
  "trage": ["trage", "tragă", "tras"],
  "transpira": ["transpiră", "transpire", "transpirat"],
  "traversa": ["traversează", "traverseze", "traversat"],
  "trece": ["trece", "treacă", "trecut"],
  "trezi": ["trezește", "trezească", "trezit"],
  "trimite": ["trimite", "trimită", "trimis"],
  "trăi": ["trăiește", "trăiască", "trăit"],
  "tăia": ["taie", "taie", "tăiat"],
  "uita": ["uită", "uite", "uitat"],
  "urca": ["urcă", "urce", "urcat"],
  "urma": ["urmează", "urmeze", "urmat"],
  "utiliza": ["utilizează", "utilizeze", "utilizat"],
  "vedea": ["vede", "vadă", "văzut"],
  "veni": ["vine", "vină", "venit"],
  "verifica": ["verifică", "verifice", "verificat"],
  "vinde": ["vinde", "vândă", "vândut"],
  "viziona": ["vizionează", "vizioneze", "vizionat"],
  "vizita": ["vizitează", "viziteze", "vizitat"],
  "vorbi": ["vorbește", "vorbească", "vorbit"],
  "îmbolnăvi": ["îmbolnăvește", "îmbolnăvească", "îmbolnăvit"],
  "îmbrăca": ["îmbracă", "îmbrace", "îmbrăcat"],
  "îmbunătăți": ["îmbunătățește", "îmbunătățească", "îmbunătățit"],
  "împacheta": ["împachetează", "împacheteze", "împachetat"],
  "împinge": ["împinge", "împingă", "împins"],
  "împrieteni": ["împrietenește", "împrietenească", "împrietenit"],
  "împrumuta": ["împrumută", "împrumute", "împrumutat"],
  "împăca": ["împacă", "împace", "împăcat"],
  "împărți": ["împarte", "împartă", "împărțit"],
  "împături": ["împăturește", "împăturească", "împăturit"],
  "începe": ["începe", "înceapă", "început"],
  "încerca": ["încearcă", "încerce", "încercat"],
  "închide": ["închide", "închidă", "închis"],
  "încălța": ["încalță", "încalțe", "încălțat"],
  "încărca": ["încarcă", "încarce", "încărcat"],
  "îndura": ["îndură", "îndure", "îndurat"],
  "îngriji": ["îngrijește", "îngrijească", "îngrijit"],
  "înota": ["înoată", "înoate", "înotat"],
  "înregistra": ["înregistrează", "înregistreze", "înregistrat"],
  "înrăutăți": ["înrăutățește", "înrăutățească", "înrăutățit"],
  "întoarce": ["întoarce", "întoarcă", "întors"],
  "întreba": ["întreabă", "întrebe", "întrebat"],
  "întâlni": ["întâlnește", "întâlnească", "întâlnit"],
  "învăța": ["învață", "învețe", "învățat"],
  "înțelege": ["înțelege", "înțeleagă", "înțeles"],
  "șterge": ["șterge", "șteargă", "șters"],
  "ști": ["știe", "știe", "știut"],
};

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
      const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
      const dispRo = firstAlt(v.ro).replace(/\s*\([^)]*\)\s*$/, '');
      const dispEn = firstAlt(v.en).replace(/\s*\([^)]*\)\s*$/, '');
      const d = isRo ? dispRo : dispEn;
      if (NOUN_NO_ARTICLE.has(v.ko)) {
        // Pronouns, numbers, a proper noun, and already-definite phrases —
        // bare, no article. "e"/"place" stay invariant regardless of the
        // referent's gender (only adjectives agree in RO, and none are used
        // here), so this stays correct even for the feminine ones in the set
        // (삶 "viața", 한국어 "limba coreeană"...).
        sentences.push({ ko:`이것은 <b>${v.ko}${copula}</b>.`, ro: isRo?`Asta e ${d}.`:`This is ${d}.`, level:'easy' });
        sentences.push({ ko:`${v.ko}<b>${subjExt}</b> 여기 있어요.`, ro: isRo?`${cap(d)} e aici.`:`${cap(d)} is here.`, level:'easy' });
        sentences.push({ ko:`저는 ${v.ko}<b>${objExt}</b> 좋아해요.`, ro: isRo?`Îmi place ${d}.`:`I like ${d}.`, level:'easy' });
        sentences.push({ ko:`이 ${v.ko}<b>${topicExt}</b> 정말 좋아요.`, ro: isRo?`Mă gândesc mult la ${d}.`:`I think about ${d} a lot.`, level:'medium' });
        sentences.push({ ko:`그 ${v.ko}<b>${subjExt}</b> 필요해요.`, ro: isRo?`Am nevoie de ${d}.`:`I need ${d}.`, level:'medium' });
      } else if (NOUN_PLURAL_BOTH.has(v.ko)) {
        // Inherently plural gloss (바지 "pantaloni"/"pants") — "sunt"/"plac"
        // are plural-invariant verb forms (no gender agreement in RO), so no
        // per-word gender is needed here either.
        sentences.push({ ko:`이것은 <b>${v.ko}${copula}</b>.`, ro: isRo?`Astea sunt ${d}.`:`These are ${d}.`, level:'easy' });
        sentences.push({ ko:`${v.ko}<b>${subjExt}</b> 여기 있어요.`, ro: isRo?`Sunt ${d} aici.`:`There are ${d} here.`, level:'easy' });
        sentences.push({ ko:`저는 ${v.ko}<b>${objExt}</b> 좋아해요.`, ro: isRo?`Îmi plac ${d}.`:`I like ${d}.`, level:'easy' });
        sentences.push({ ko:`이 ${v.ko}<b>${topicExt}</b> 정말 좋아요.`, ro: isRo?`Mă gândesc mult la ${d}.`:`I think about ${d} a lot.`, level:'medium' });
        sentences.push({ ko:`그 ${v.ko}<b>${subjExt}</b> 필요해요.`, ro: isRo?`Am nevoie de ${d}.`:`I need ${d}.`, level:'medium' });
      } else {
        const isFem = RO_NOUN_FEM.has(v.ko);
        const art = isFem ? 'o' : 'un';
        const enArt = EN_NOUN_BARE.has(v.ko) ? '' : enArticle(dispEn) + ' ';
        sentences.push({ ko:`이것은 <b>${v.ko}${copula}</b>.`, ro: isRo?`Asta e ${art} ${dispRo}.`:`This is ${enArt}${dispEn}.`, level:'easy' });
        sentences.push({ ko:`${v.ko}<b>${subjExt}</b> 여기 있어요.`, ro: isRo?`E ${art} ${dispRo} aici.`:`There's ${enArt}${dispEn} here.`, level:'easy' });
        sentences.push({ ko:`저는 ${v.ko}<b>${objExt}</b> 좋아해요.`, ro: isRo?`Îmi place ${art} ${dispRo}.`:`I like ${enArt}${dispEn}.`, level:'easy' });
        sentences.push({ ko:`이 ${v.ko}<b>${topicExt}</b> 정말 좋아요.`, ro: isRo?`${isFem?'Această':'Acest'} ${dispRo} e chiar bun${isFem?'ă':''}.`:`This ${dispEn} is really good.`, level:'medium' });
        sentences.push({ ko:`그 ${v.ko}<b>${subjExt}</b> 필요해요.`, ro: isRo?`Am nevoie de ${isFem?'acea':'acel'} ${dispRo}.`:`I need that ${dispEn}.`, level:'medium' });
      }
    } else if (isTimeLike(v)) {
      // Deictic time words (내일, 그저께...) can't be pinned to one tense —
      // "tomorrow" needs future, "the day before yesterday" needs past, and a
      // single template can't match both. "Talking/asking/writing about X" is
      // tense-safe for any of them: the ACT of discussing happens now,
      // regardless of when X itself refers to.
      const bat = VerbConjugator.hasBatchim(v.ko);
      const subjExt = bat ? '이' : '가';
      const objExt = bat ? '을' : '를';
      const d = firstAlt(isRo ? v.ro : v.en).replace(/\s*\([^)]*\)\s*$/, '');
      // A few RO glosses already carry their own preposition (매일 "în fiecare
      // zi", 요즘 "în zilele noastre") — stacking "despre"/"de" in front would
      // double up ("despre în fiecare zi"), so those drop the extra preposition.
      const prepLed = isRo && /^(în|la|pe|cu|de)\s/.test(d);
      sentences.push({ ko:`<b>${v.ko}</b>에 대해 이야기해요.`, ro: isRo?`Vorbim ${prepLed?'':'despre '}${d}.`:`We're talking about ${d}.`, level:'easy' });
      sentences.push({ ko:`${v.ko}<b>${subjExt}</b> 궁금해요.`, ro: isRo?`Sunt curios ${prepLed?'':'de '}${d}.`:`I'm curious about ${d}.`, level:'easy' });
      sentences.push({ ko:`<b>${v.ko}</b>에 대해 물어봤어요.`, ro: isRo?`Am întrebat ${prepLed?'':'despre '}${d}.`:`I asked about ${d}.`, level:'easy' });
      sentences.push({ ko:`${v.ko}<b>${objExt}</b> 적어 놨어요.`, ro: isRo?`Am notat ${d}.`:`I wrote down ${d}.`, level:'medium' });
      sentences.push({ ko:`<b>${v.ko}</b>에 대해 배우고 있어요.`, ro: isRo?`Învăț ${prepLed?'':'despre '}${d}.`:`I'm learning about ${d}.`, level:'medium' });
    } else if (isPositionLike(v)) {
      // 위/아래/앞/뒤/안/밖/옆... are grammatical location words, not
      // countable nouns — no article of any kind fits, so every template
      // here uses the stored adverbial gloss bare.
      const bat = VerbConjugator.hasBatchim(v.ko);
      const objExt = bat ? '을' : '를';
      const topicExt = bat ? '은' : '는';
      const dirExt = bat ? '으로' : '로';
      const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
      // 앞/뒤's RO gloss stores "body part / positional phrase" ("față / în
      // față", "spate / în spate") — firstAlt() picks the first slash-alt,
      // which is the body part ("față" = face, "spate" = back), not the
      // position this branch needs. Override to the positional alternate.
      const POSITION_RO_OVERRIDE = { '앞': 'în față', '뒤': 'în spate' };
      const d = POSITION_RO_OVERRIDE[v.ko] && isRo ? POSITION_RO_OVERRIDE[v.ko] : firstAlt(isRo ? v.ro : v.en).replace(/\s*\([^)]*\)\s*$/, '');
      sentences.push({ ko:`<b>${v.ko}</b>에 있어요.`, ro: isRo?`E ${d}.`:`It's ${d}.`, level:'easy' });
      sentences.push({ ko:`${v.ko}<b>${objExt}</b> 봐요.`, ro: isRo?`Mă uit ${d}.`:`I'm looking ${d}.`, level:'easy' });
      sentences.push({ ko:`${v.ko}<b>${dirExt}</b> 가요.`, ro: isRo?`Mă duc ${d}.`:`I'm heading ${d}.`, level:'medium' });
      sentences.push({ ko:`${v.ko}<b>${topicExt}</b> 조용해요.`, ro: isRo?`${cap(d)} e liniște.`:`It's quiet ${d}.`, level:'medium' });
      sentences.push({ ko:`<b>${v.ko}</b>에서 기다려요.`, ro: isRo?`Aștept ${d}.`:`I'm waiting ${d}.`, level:'medium' });
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

return { isConjugable, isColorLike, isTimeLike, isPositionLike, isNounLike, isAdverbLike, generate };

})();
