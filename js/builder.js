console.log("🔥 builder.js loaded");

/* ============================================================
   builder.js CLEAN FINAL
   - o singură arhitectură
   - sentences[] + actives[]
   - parser RO/EN -> KO
   - multi-clause builder
   - panel + long press
   - custom words + localStorage
   - vocab extern din data/vocab-korean.json
============================================================ */

/* =========================
   0) SAFE DOM HELPERS
========================= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const on = (el, ev, fn) => el && el.addEventListener(ev, fn);
const text = (el, v) => { if (el) el.textContent = v; };
const show = (el) => el && el.classList.remove("hidden");
const hide = (el) => el && el.classList.add("hidden");

/* =========================
   1) BASE DATA
========================= */
const subjects = [
  "저","나","너","우리","너희","사람","학생","선생님","직원","전문가","지원자","관리자",
  "부모님","아이","어른","시민","고객","의사","간호사","연구자","관계자","대표","회장",
  "사용자","참가자","운전자","주민","환자"
];

const subjectAdjectives = [
  "예쁜","착한","똑똑한","키가 큰","젊은","늙은"
];

const times = [
  "오늘","어제","내일","지금","방금","조금 후에","곧","최근에","요즘","마침내","결국",
  "이전에","이후에","당시에","한동안","계속","가끔","항상","자주","점점","차츰","일찍","늦게"
];

const places = [
  "집","학교","회사","식당","카페","도서관","병원","시장","백화점","공항","기차역",
  "버스정류장","연구소","기관","지역사회","환경","대기업","회의실","법원","경찰서",
  "해변","산","공원","은행"
];

const mods = [
  "잘","열심히","조용히","천천히","빨리","정말","아주","너무","많이","조금","갑자기","미리",
  "벌써","아까","방금","금방","곧","항상","자주","가끔","드물게","상당히","꽤","도대체","절대로",
  "적극적으로","충분히","특히","오히려","점점","차츰","계속"
];

const objectAdjectives = [
  "예쁜","맛있는","큰","작은","새로운","오래된"
];

const objects = [
  "책","커피","물","음식","영화","가방","전화","옷","자료","데이터","계획","조건","상황","문제",
  "해결책","요약","보고서","문서","컴퓨터","노트북","편지","선물","의견","정보","관계","결과",
  "원인","방법","제품","서비스","정책","문화","채소","견과류"
];

const numerals = new Array(60).fill("");

const counters = [
  "개","명","권","장","대","병","잔","마리","번","살","송이","줄","점","건","회","가지","쪽"
];

const verbs = [
  "가다","오다","먹다","마시다","보다","읽다","쓰다","배우다","사다","주다","받다","일하다",
  "공부하다","요리하다","청소하다","준비하다","도와주다","사용하다","필요하다","좋아하다",
  "싫어하다","기다리다","쉬다","만나다","걷다","달리다","앉다","서다","결정하다","제안하다",
  "전달하다","유지하다","발생하다","증가하다","감소하다","인정하다","분석하다","관찰하다",
  "해결하다","연구하다","협력하다","요청하다","충족하다","비교하다","설명하다","예상하다"
];

const conjugations = [
  "-아요/어요","-았어요/었어요","-고 있어요","-고 싶어요","-(으)세요","-(으)ㄹ 거예요",
  "-고","-지 마세요","-아/어 주세요","-아/어야 돼요","-(으)ㄹ 수 있어요","-(으)ㄹ 수 없어요",
  "-더라고요","-네요","-군요","-고 나서","-기 전에","-(으)면서","-(으)며",
  "-(으)ㄹ지도 몰라요","-(으)ㄹ게요","-(으)ㄹ래요?","-(으)ㄹ까요?","-는 게 어때요?",
  "-는 중이에요","-아/어도 돼요","-(으)면 안 돼요","-(으)나","-(으)므로","-(으)ㄴ/는 만큼",
  "-(으)ㄹ수록","-(으)ㄴ/는데도","-(으)ㄹ지라도","-(으)ㄴ/는 반면에","-도록 하다",
  "-게 되다","-아/어지다","-기 마련이다","-기에","-길래","-고 말다","-고자 하다","-(으)ㄹ 뿐이다"
];

/* =========================
   2) TRANSLATIONS
========================= */
const translations = {
  subject: {
    "저":"eu (formal)","나":"eu (informal)","너":"tu","우리":"noi","너희":"voi",
    "사람":"persoană","학생":"student/ă","선생님":"profesor","직원":"angajat",
    "전문가":"expert","지원자":"candidat","관리자":"administrator","부모님":"părinți",
    "아이":"copil","어른":"adult","시민":"cetățean","고객":"client","의사":"medic",
    "간호사":"asistentă","연구자":"cercetător","관계자":"persoană implicată","대표":"reprezentant",
    "회장":"președinte","사용자":"utilizator","참가자":"participant","운전자":"șofer","주민":"locuitor","환자":"pacient"
  },
  time: {
    "오늘":"astăzi","어제":"ieri","내일":"mâine","지금":"acum","방금":"tocmai acum",
    "조금 후에":"puțin mai târziu","곧":"în curând","최근에":"recent","요즘":"în ultima vreme",
    "마침내":"în cele din urmă","결국":"până la urmă","이전에":"înainte","이후에":"după",
    "당시에":"atunci","한동안":"o perioadă","계속":"continuu","가끔":"din când în când",
    "항상":"întotdeauna","자주":"des","점점":"din ce în ce","차츰":"treptat","일찍":"devreme","늦게":"târziu"
  },
  place: {
    "집":"acasă","학교":"școală","회사":"companie","식당":"restaurant","카페":"cafenea",
    "도서관":"bibliotecă","병원":"spital","시장":"piață","백화점":"magazin universal",
    "공항":"aeroport","기차역":"gară","버스정류장":"stație de autobuz","연구소":"laborator",
    "기관":"instituție","지역사회":"comunitate","환경":"mediu","대기업":"mare corporație",
    "회의실":"sală de ședințe","법원":"instanță","경찰서":"secție de poliție",
    "해변":"plajă","산":"munte","공원":"parc","은행":"bancă"
  },
  mod: {
    "잘":"bine","열심히":"cu sârguință","조용히":"în liniște","천천히":"încet","빨리":"repede",
    "정말":"cu adevărat","아주":"foarte","너무":"prea / foarte","많이":"mult","조금":"puțin",
    "갑자기":"brusc","미리":"dinainte","벌써":"deja","아까":"mai devreme","방금":"chiar acum",
    "금방":"imediat","곧":"în curând","항상":"mereu","자주":"des","가끔":"din când în când",
    "드물게":"rar","상당히":"destul de","꽤":"binișor","도대체":"oare / deloc","절대로":"niciodată",
    "적극적으로":"activ","충분히":"suficient","특히":"în special","오히려":"mai degrabă","점점":"din ce în ce",
    "차츰":"treptat","계속":"continuu"
  },
  object: {
    "책":"carte","커피":"cafea","물":"apă","음식":"mâncare","영화":"film","가방":"geantă",
    "전화":"telefon","옷":"haine","자료":"materiale","데이터":"date","계획":"plan","조건":"condiție",
    "상황":"situație","문제":"problemă","해결책":"soluție","요약":"rezumat","보고서":"raport",
    "문서":"document","컴퓨터":"calculator","노트북":"laptop","편지":"scrisoare","선물":"cadou",
    "의견":"opinie","정보":"informație","관계":"relație","결과":"rezultat","원인":"cauză",
    "방법":"metodă","제품":"produs","서비스":"serviciu","정책":"politică","문화":"cultură",
    "채소":"legume","견과류":"nuci"
  },
  verb: {
    "가다":"a merge","오다":"a veni","먹다":"a mânca","마시다":"a bea","보다":"a vedea / a privi",
    "읽다":"a citi","쓰다":"a scrie","배우다":"a învăța","사다":"a cumpăra","주다":"a da",
    "받다":"a primi","일하다":"a lucra","공부하다":"a studia","요리하다":"a găti","청소하다":"a face curat",
    "준비하다":"a pregăti","도와주다":"a ajuta","사용하다":"a folosi","필요하다":"a fi necesar",
    "좋아하다":"a plăcea","싫어하다":"a nu plăcea","기다리다":"a aștepta","쉬다":"a se odihni",
    "만나다":"a se întâlni","걷다":"a merge pe jos","달리다":"a alerga","앉다":"a se așeza",
    "서다":"a sta în picioare","결정하다":"a decide","제안하다":"a propune","전달하다":"a transmite",
    "유지하다":"a menține","발생하다":"a se produce","증가하다":"a crește","감소하다":"a scădea",
    "인정하다":"a recunoaște","분석하다":"a analiza","관찰하다":"a observa","해결하다":"a rezolva",
    "연구하다":"a cerceta","협력하다":"a colabora","요청하다":"a solicita","충족하다":"a satisface",
    "비교하다":"a compara","설명하다":"a explica","예상하다":"a anticipa"
  },
  conjug: {
    "-아요/어요":"prezent politicos",
    "-았어요/었어요":"trecut politicos",
    "-고 있어요":"acțiune în desfășurare",
    "-고 싶어요":"vreau să...",
    "-(으)세요":"imperativ / onorific",
    "-(으)ㄹ 거예요":"viitor",
    "-고":"și",
    "-지 마세요":"nu faceți..., vă rog",
    "-아/어 주세요":"vă rog să...",
    "-아/어야 돼요":"trebuie să...",
    "-(으)ㄹ 수 있어요":"pot să...",
    "-(으)ㄹ 수 없어요":"nu pot să...",
    "-더라고요":"am observat că...",
    "-네요":"exclamativ",
    "-군요":"constatare",
    "-고 나서":"după ce...",
    "-기 전에":"înainte să...",
    "-(으)면서":"în timp ce...",
    "-(으)며":"și (în timp ce)",
    "-(으)ㄹ지도 몰라요":"s-ar putea să...",
    "-(으)ㄹ게요":"voi face",
    "-(으)ㄹ래요?":"vrei? / vreau să...",
    "-(으)ㄹ까요?":"să facem...?",
    "-는 게 어때요?":"ce-ar fi să...?",
    "-는 중이에요":"sunt în curs de...",
    "-아/어도 돼요":"e în regulă să...",
    "-(으)면 안 돼요":"nu ai voie să...",
    "-도록 하다":"să faci astfel încât...",
    "-게 되다":"ajungi să...",
    "-아/어지다":"a deveni...",
    "-기에":"pentru că...",
    "-길래":"pentru că (am observat)",
    "-고 말다":"ajunge până la urmă să...",
    "-고자 하다":"intenționez să...",
    "-(으)ㄹ 뿐이다":"doar..."
  },
  subjectAdj: {},
  objectAdj: {},
  numeral: {},
  counter: {
    "개":"bucată","명":"persoană","권":"volum","장":"foaie","대":"aparat / vehicul","병":"sticlă",
    "잔":"pahar","마리":"animal","번":"dată","살":"ani","송이":"buchet","줄":"șir","점":"punct",
    "건":"caz","회":"ocazie","가지":"fel","쪽":"pagină / direcție"
  }
};

/* =========================
   3) STORAGE
========================= */
const STORAGE_KEY = "ralucaKoreanCustomWords_v2";
const customData = {
  subject:[], time:[], place:[], mod:[], object:[],
  numeral:[], counter:[], verb:[], conjug:[],
  subjectAdj:[], objectAdj:[]
};

function loadCustomData(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return;
    const saved = JSON.parse(raw);

    Object.keys(customData).forEach(k=>{
      if(Array.isArray(saved[k])) customData[k] = saved[k];
    });

    const listMap = {
      subject: subjects,
      subjectAdj: subjectAdjectives,
      time: times,
      place: places,
      mod: mods,
      object: objects,
      objectAdj: objectAdjectives,
      numeral: numerals,
      counter: counters,
      verb: verbs,
      conjug: conjugations
    };

    Object.entries(customData).forEach(([key,arr])=>{
      arr.forEach(entry=>{
        if(!entry || !entry.word) return;
        const w = entry.word;
        const ro = entry.ro || "";

        const list = listMap[key];
        if(list && !list.includes(w)) list.push(w);

        if(!translations[key]) translations[key] = {};
        if(ro) translations[key][w] = ro;
      });
    });
  }catch(err){
    console.error("loadCustomData error:", err);
  }
}

function saveCustomData(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customData));
  }catch(err){
    console.error("saveCustomData error:", err);
  }
}

loadCustomData();

/* =========================
   4) COLUMNS
========================= */
const columns = [
  {key:"subject", title:"SUBJECT", ko:"주어", data:subjects, hint:"Cine?", allowCustom:true},
  {key:"subjectAdj", title:"ADJ (SUBJECT)", ko:"형용사", data:subjectAdjectives, hint:"Cum este subiectul?", allowCustom:true},
  {key:"time", title:"TIME", ko:"시간", data:times, hint:"Când?", allowCustom:true},
  {key:"place", title:"PLACE", ko:"장소", data:places, hint:"Unde?", allowCustom:true},
  {key:"mod", title:"MOD", ko:"부사", data:mods, hint:"Cum?", allowCustom:true},
  {key:"object", title:"OBJECT", ko:"목적어", data:objects, hint:"Ce?", allowCustom:true},
  {key:"objectAdj", title:"ADJ (OBJECT)", ko:"형용사", data:objectAdjectives, hint:"Cum este obiectul?", allowCustom:true},
  {key:"numeral", title:"NUMERAL", ko:"수", data:numerals, hint:"Număr", allowCustom:true},
  {key:"counter", title:"COUNTER", ko:"수량사", data:counters, hint:"Clasificator", allowCustom:true},
  {key:"verb", title:"VERB", ko:"동사", data:verbs, hint:"Acțiune", allowCustom:true},
  {key:"conjug", title:"CONJUGĂRI", ko:"활용", data:conjugations, hint:"Formă verbală", allowCustom:true}
];

const maxLen = Math.max(...columns.map(c => c.data.length));

/* =========================
   5) DOM
========================= */
const DOM = {
  tableP1: $("#tableP1"),
  tableP2: $("#tableP2"),
  titleP2: $("#titleP2"),
  enableP2: $("#enableP2"),

  togglesP1: $("#togglesP1"),
  togglesP2: $("#togglesP2"),

  prevBtn: $("#prevBtn"),
  nextBtn: $("#nextBtn"),
  resetBtn: $("#resetBtn"),
  pageInfoEl: $("#pageInfo"),

  previewKo: $("#previewKo"),
  previewRo: $("#previewRo"),
  naturalHint: $("#naturalHint"),
  toggleRoBtn: $("#toggleRoBtn"),

  randomBtn: $("#randomBtn"),
  speakBtn: $("#speakBtn"),
  favBtn: $("#favBtn"),
  favoritesListEl: $("#favoritesList"),

  overlay: $("#overlay"),
  panelTitle: $("#panelTitle"),
  panelSub: $("#panelSub"),
  panelList: $("#panelList"),
  extraClauses: $("#extra-clauses"),
  closePanelBtn: $("#closePanelBtn"),
  panelSearchInput: $("#panelSearchInput"),
  newWordInput: $("#newWordInput"),
  newWordTransInput: $("#newWordTransInput"),
  addWordBtn: $("#addWordBtn"),

  roInput: $("#roInput"),
  roTranslateBtn: $("#roTranslateBtn"),
  roToKoResult: $("#roToKoResult"),
  roCorrected: $("#roCorrected"),

  inputLangRadio: $$('input[name="inputLang"]'),
  modeButtons: $$(".small-mode-btn"),
  refreshBtn: $("#refreshBtn"),
  homeBtn: $("#homeBtn")
};

if(!window.visibility){
  window.visibility = {};
}

/* =========================
   6) APP STATE
========================= */
let indexModelRow = 0;
let sentences = [makeEmptySentence()];
let actives = [makeAllActive()];
let VOCAB_INDEX = {};
let vocabJson = {};
let showRo = true;
let showExtraClauses = false;
let currentMode = "topik";
const simpleColumnsSet = {subject:true,time:true,object:true,verb:true,conjug:true};

function makeEmptySentence(){
  return {
    subject:"",
    subjects:[],

    subjectAdjs:[],

    time:"",
    times:[],

    place:"",
    places:[],

    mod:"",
    mods:[],

    object:"",
    objects:[],

    objectAdjs:[],

    numeral:"",
    counter:"",

    verb:"",
    verbs:[],

    conjug:"",

    hideSubject:false,
    reason:false,
    contrast:false,
    condition:false,
    sequence:false
  };
}

function makeAllActive(){
  const a = {};
  columns.forEach(col => a[col.key] = true);
  return a;
}

/* =========================
   7) MODE / VISIBILITY
========================= */
function isColumnVisible(key){
  if(currentMode === "simple"){
    return !!simpleColumnsSet[key];
  }
  return window.visibility?.[key] !== false;
}

/* =========================
   8) KOREAN HELPERS
========================= */
const H_BASE = 0xAC00;

function decomposeLastSyl(word){
  if(!word) return null;
  const ch = word.charCodeAt(word.length - 1);
  const code = ch - H_BASE;
  if(code < 0 || code > 11171) return null;

  const jong = code % 28;
  const jung = ((code - jong) / 28) % 21;
  const cho = Math.floor((code - jong) / 28 / 21);

  return { cho, jung, jong, prefix: word.slice(0,-1) };
}

function hasBatchim(word){
  if(!word) return false;
  const code = word.charCodeAt(word.length - 1) - H_BASE;
  if(code < 0 || code > 11171) return false;
  return (code % 28) !== 0;
}

function getVerbStem(verb){
  if(!verb) return "";
  return verb.endsWith("다") ? verb.slice(0,-1) : verb;
}

const specialVerbMap = {
  "가다": {present:"가요", past:"갔어요"},
  "오다": {present:"와요", past:"왔어요"},
  "보다": {present:"봐요", past:"봤어요"},
  "하다": {present:"해요", past:"했어요"},
  "먹다": {present:"먹어요", past:"먹었어요"},
  "읽다": {present:"읽어요", past:"읽었어요"},
  "마시다": {present:"마셔요", past:"마셨어요"},
  "쓰다": {present:"써요", past:"썼어요"},
  "사다": {present:"사요", past:"샀어요"},
  "걷다": {present:"걸어요", past:"걸었어요"},
  "달리다": {present:"달려요", past:"달렸어요"}
};

function presentPolite(verb){
  if(!verb) return "";
  if(specialVerbMap[verb]?.present) return specialVerbMap[verb].present;

  const stem = getVerbStem(verb);
  if(!stem) return "";

  const last = stem[stem.length - 1];
  if(last === "하") return stem.slice(0,-1) + "해요";
  if(last === "오") return stem.slice(0,-1) + "와요";
  if(last === "보") return stem.slice(0,-1) + "봐요";

  return stem + "어요";
}

function pastPolite(verb){
  if(!verb) return "";
  if(specialVerbMap[verb]?.past) return specialVerbMap[verb].past;

  const pres = presentPolite(verb);
  if(!pres) return "";

  if(pres.endsWith("해요")) return pres.replace(/해요$/, "했어요");
  if(pres.endsWith("와요")) return pres.replace(/와요$/, "왔어요");
  if(pres.endsWith("봐요")) return pres.replace(/봐요$/, "봤어요");

  return pres.replace(/요$/, "었어요");
}

function buildVerbPhrase(verb, cj){
  if(!verb && !cj) return "";

  const stem = getVerbStem(verb);

  if(!cj) return presentPolite(verb);
  if(cj === "-아요/어요") return presentPolite(verb);
  if(cj === "-았어요/었어요") return pastPolite(verb);
  if(cj === "-고") return stem + "고";
  if(cj === "-고 나서") return stem + "고 나서";
  if(cj === "-기 전에") return stem + "기 전에";
  if(cj === "-고 있어요") return stem + "고 있어요";
  if(cj === "-고 싶어요") return stem + "고 싶어요";

  if(cj === "-(으)ㄹ 거예요"){
    return hasBatchim(stem) ? stem + "을 거예요" : stem + "ㄹ 거예요";
  }

  if(cj === "-(으)면서"){
    return stem + "면서";
  }

  if(cj === "-(으)며"){
    return stem + "며";
  }

  if(cj === "-기에"){
    return stem + "기에";
  }

  if(cj === "-길래"){
    return stem + "길래";
  }

  if(cj === "-고 말다"){
    return stem + "고 말아요";
  }

  if(cj === "-고자 하다"){
    return stem + "고자 해요";
  }

  if(cj === "-아/어야 돼요"){
    return stem + "아/어야 돼요";
  }

  if(cj === "-(으)ㄹ 수 있어요"){
    return hasBatchim(stem) ? stem + "을 수 있어요" : stem + "ㄹ 수 있어요";
  }

  if(cj === "-(으)ㄹ 수 없어요"){
    return hasBatchim(stem) ? stem + "을 수 없어요" : stem + "ㄹ 수 없어요";
  }

  return presentPolite(verb);
}

/* =========================
   9) PARTICLES
========================= */
function chooseSubjectParticle(word, state){
  const batchim = hasBatchim(word);
  const topicParticle = batchim ? "은" : "는";
  const subjectParticle = batchim ? "이" : "가";

  const hasTime = !!state.time;
  const hasPlace = !!state.place;
  const hasObject = !!state.object;

  if(hasTime || hasPlace) return topicParticle;
  if(!hasObject) return topicParticle;

  return subjectParticle;
}

function addSubjectWithParticle(word, state){
  if(!word) return "";
  return word + chooseSubjectParticle(word, state);
}

function chooseObjectParticle(word){
  return hasBatchim(word) ? "을" : "를";
}

function addObjectWithParticle(word){
  if(!word) return "";
  return word + chooseObjectParticle(word);
}

function addPlaceWithParticle(word, verb){
  if(!word) return "";
  const motion = new Set(["가다","오다","들어가다","나가다","돌아가다"]);
  if(verb && motion.has(verb)) return word + "에";
  return word + "에서";
}

function addTimeWithParticle(word){
  if(!word) return "";
  const noParticle = new Set([
    "오늘","어제","내일","지금","방금","요즘","항상","자주","가끔","계속","점점","차츰"
  ]);
  if(noParticle.has(word)) return word;
  return word + "에";
}

/* =========================
   10) JOIN / ENUMERATION
========================= */
function buildEnumeration(list, single){
  if(Array.isArray(list) && list.length){
    return list.filter(Boolean).join(" 하고 ");
  }
  if(single) return single;
  return "";
}

function joinVerbs(list){
  if(!Array.isArray(list) || !list.length) return "";
  if(list.length === 1) return presentPolite(list[0]);

  let out = "";
  list.forEach((v,i)=>{
    if(i === list.length - 1){
      out += presentPolite(v);
    }else{
      out += getVerbStem(v) + "고 ";
    }
  });
  return out.trim();
}

function joinPlaces(list){
  if(!Array.isArray(list) || !list.length) return "";
  if(list.length === 1) return list[0] + "에서";

  let out = "";
  list.forEach((p,i)=>{
    if(i === list.length - 1){
      out += p + "에서";
    }else{
      out += p + "하고 ";
    }
  });
  return out.trim();
}

function normalizeSubjects(){
  let last = null;
  sentences.forEach((s,i)=>{
    if(!s) return;
    if(i === 0){
      s.hideSubject = false;
      last = s.subject;
      return;
    }
    s.hideSubject = !!(s.subject && s.subject === last);
    last = s.subject;
  });
}

/* =========================
   11) KOREAN CLAUSE PLANNER
========================= */
function planKoreanSentence(state, active){
  const use = (k) =>
    active?.[k] !== false &&
    (typeof isColumnVisible === "function" ? isColumnVisible(k) : true);

  const slots = {
    time:[],
    subject:[],
    place:[],
    manner:[],
    object:[],
    verb:[]
  };

  const v = state.verb || "";
  const cj = state.conjug || "";

  if(use("time")){
    const t = buildEnumeration(state.times, state.time);
    if(t) slots.time.push(addTimeWithParticle(t));
  }

  if(!state.hideSubject && use("subject")){
    let s = buildEnumeration(state.subjects, state.subject);
    if(state.subjectAdjs?.length){
      s = state.subjectAdjs.join(" ") + " " + s;
    }
    if(s) slots.subject.push(addSubjectWithParticle(s, state));
  }

  if(use("place")){
    const p = buildEnumeration(state.places, state.place);
    if(p) slots.place.push(addPlaceWithParticle(p, v));
  }

  if(use("mod")){
    const m = buildEnumeration(state.mods, state.mod);
    if(m) slots.manner.push(m);
  }

  if(use("object")){
    let o = buildEnumeration(state.objects, state.object);

    if(state.objectAdjs?.length){
      o = state.objectAdjs.join(" ") + " " + o;
    }

    if(o){
      if(use("numeral") && state.numeral) slots.object.push(state.numeral);
      if(use("counter") && state.counter) slots.object.push(state.counter);
      slots.object.push(addObjectWithParticle(o));
    }
  }

  if(use("verb") || use("conjug")){
    let vp = "";
    if(state.verbs?.length){
      vp = joinVerbs(state.verbs);
    }else{
      vp = buildVerbPhrase(v, cj);
    }
    if(vp) slots.verb.push(vp);
  }

  return [
    ...slots.time,
    ...slots.subject,
    ...slots.place,
    ...slots.object,
    ...slots.manner,
    ...slots.verb
  ].join(" ").replace(/\s+/g," ").trim();
}

/* =========================
   12) ROMANIAN BUILD (PARTEA 1)
========================= */

const RO_FORMS = {
  "a merge":   { "1sg":"merg","2sg":"mergi","3sg":"merge","1pl":"mergem","2pl":"mergeți","3pl":"merg" },
  "a veni":    { "1sg":"vin","2sg":"vii","3sg":"vine","1pl":"venim","2pl":"veniți","3pl":"vin" },
  "a mânca":   { "1sg":"mănânc","2sg":"mănânci","3sg":"mănâncă","1pl":"mâncăm","2pl":"mâncați","3pl":"mănâncă" },
  "a bea":     { "1sg":"beau","2sg":"bei","3sg":"bea","1pl":"bem","2pl":"beți","3pl":"beau" },
  "a citi":    { "1sg":"citesc","2sg":"citești","3sg":"citește","1pl":"citim","2pl":"citiți","3pl":"citesc" },
  "a scrie":   { "1sg":"scriu","2sg":"scrii","3sg":"scrie","1pl":"scriem","2pl":"scrieți","3pl":"scriu" },
  "a merge pe jos": {
    "1sg":"merg pe jos","2sg":"mergi pe jos","3sg":"merge pe jos",
    "1pl":"mergem pe jos","2pl":"mergeți pe jos","3pl":"merg pe jos"
  }
};

function stripInfinitive(roVerb){
  return (roVerb || "").replace(/^\s*a\s+/i, "").trim();
}

function roPersonFromSubjectKo(subjKo){
  if(subjKo === "저" || subjKo === "나") return "1sg";
  if(subjKo === "너") return "2sg";
  if(subjKo === "우리") return "1pl";
  if(subjKo === "너희") return "2pl";
  return "3sg";
}

function roAgreeVerb(roVerbInf, subjKo){
  const inf = (roVerbInf || "").trim().toLowerCase();
  const person = roPersonFromSubjectKo(subjKo);
  const forms = RO_FORMS[inf];

  if(forms && forms[person]) return forms[person];

  return stripInfinitive(roVerbInf);
}

function buildRoVerbPhrase(roVerbInf, cj, subjKo){
  const v = roAgreeVerb(roVerbInf, subjKo);

  if(!cj) return v;

  const map = {
    "-아요/어요": vv => `${vv}`,
    "-았어요/었어요": vv => `${vv} (în trecut)`,
    "-고 있어요": vv => `${vv} acum`,
    "-고 싶어요": vv => `vreau să ${vv}`,
    "-(으)ㄹ 거예요": vv => `voi ${vv}`,
    "-지 마세요": vv => `nu ${vv}, te rog`,
    "-아/어야 돼요": vv => `trebuie să ${vv}`,
    "-(으)ㄹ 수 있어요": vv => `pot să ${vv}`,
    "-(으)ㄹ 수 없어요": vv => `nu pot să ${vv}`,
    "-기 전에": vv => `înainte să ${vv}`,
    "-고 나서": vv => `după ce ${vv}`,
    "-(으)면서": vv => `în timp ce ${vv}`,
    "-(으)ㄹ까요?": vv => `să ${vv}?`,
    "-고": vv => `${vv} și`
  };

  const fn = map[cj];
  if(fn) return fn(v || "(verbul)");

  const cjExp = translations.conjug?.[cj] || cj;
  return (v ? v + " " : "") + `(${cjExp})`;
}


function buildNaturalRomanian(state, active){
  const use = (k) =>
    active?.[k] !== false &&
    (typeof isColumnVisible === "function" ? isColumnVisible(k) : true);

  const parts = [];

  const subjectKo = state.subject || "";
  const subjectRo = translations.subject?.[subjectKo] || "";

  let subjectText = subjectRo;
  if(state.subjectAdjs?.length && subjectText){
    subjectText = state.subjectAdjs.map(x => translations.subjectAdj?.[x] || x).join(" ") + " " + subjectText;
  }

  const timeRo = state.time ? (translations.time?.[state.time] || state.time) : "";
  const placeRo = state.place ? (translations.place?.[state.place] || state.place) : "";
 const modRo = state.mod ? (translations.mod?.[state.mod] || state.mod) : "";
  const objectRoBase = state.object ? (translations.object?.[state.object] || state.object) : "";
  const verbRoInf = state.verb ? (translations.verb?.[state.verb] || state.verb) : "";

  let objectText = objectRoBase;
  if(state.objectAdjs?.length && objectText){
    objectText = state.objectAdjs.map(x => translations.objectAdj?.[x] || x).join(" ") + " " + objectText;
  }

  if(use("time") && timeRo) parts.push(timeRo);
  if(use("subject") && subjectText && !state.hideSubject) parts.push(subjectText);
  if(use("place") && placeRo) parts.push(placeRo);
  if(use("object") && objectText) parts.push(objectText);
  if(use("mod") && modRo) parts.push(modRo);

  if(use("verb") || use("conjug")){
    const verbText = buildRoVerbPhrase(verbRoInf, state.conjug, subjectKo);
    if(verbText) parts.push(verbText);
  }

  return parts.join(" ").replace(/\s+/g, " ").trim();
}

/* =========================
   13) COLUMN UI
========================= */
function getColumnDisplayValue(state, key){
  if(key === "subject") return state.subject || "";
  if(key === "time") return state.time || "";
  if(key === "place") return state.place || "";
  if(key === "mod") return state.mod || "";
  if(key === "object") return state.object || "";
  if(key === "subjectAdj") return (state.subjectAdjs || []).join(", ");
  if(key === "objectAdj") return (state.objectAdjs || []).join(", ");
  if(key === "verb") return state.verb || "";
  if(key === "conjug") return state.conjug || "";
  if(key === "numeral") return state.numeral || "";
  if(key === "counter") return state.counter || "";
  return "";
}

function renderClauseRow(container, activeMap, state, clauseIndex){
  if(!container) return;

  container.innerHTML = "";

  columns.forEach(col => {
    if(isColumnVisible(col.key) === false) return;

    const colDiv = document.createElement("div");
    colDiv.className = "col";
    colDiv.dataset.key = col.key;
    colDiv.dataset.clauseIndex = clauseIndex;

    if(activeMap[col.key] === false){
      colDiv.classList.add("dimmed");
    }

    const header = document.createElement("div");
    header.className = "col-header";

    const title = document.createElement("span");
    title.textContent = col.title + (col.ko ? " (" + col.ko + ")" : "");
    header.appendChild(title);

    const toggle = document.createElement("input");
    toggle.type = "checkbox";
    toggle.className = "col-toggle";
    toggle.checked = activeMap[col.key] !== false;
    toggle.addEventListener("change", () => {
      activeMap[col.key] = toggle.checked;
      renderAll();
    });

    header.appendChild(toggle);
    colDiv.appendChild(header);

    const label = document.createElement("div");
    label.className = "col-body-label";
    label.textContent = col.hint || "";
    colDiv.appendChild(label);

    const main = document.createElement("div");
    main.className = "col-body-main";
    main.textContent = getColumnDisplayValue(state, col.key);
    colDiv.appendChild(main);

    const extra = document.createElement("div");
    extra.className = "col-body-extra";

    if(col.key === "conjug" && state?.[col.key] && isLinkingConj(state[col.key])){
      extra.textContent = "⭐ cere propoziția următoare";
    }

    colDiv.appendChild(extra);
    container.appendChild(colDiv);
  });
}

/* =========================
   14) TOGGLES
========================= */
function createToggleChips(){
  if(!DOM.togglesP1 || !DOM.togglesP2) return;

  DOM.togglesP1.innerHTML = "";
  DOM.togglesP2.innerHTML = "";

  const createFor = (wrapper, clauseIndex) => {
    columns.forEach(col => {
      const chip = document.createElement("label");
      chip.className = "chip";

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = actives[clauseIndex]?.[col.key] !== false;
      cb.dataset.key = col.key;
      cb.dataset.clauseIndex = String(clauseIndex);

      chip.appendChild(cb);
      chip.append(col.title);
      wrapper.appendChild(chip);
    });

    wrapper.addEventListener("change", (e) => {
      const cb = e.target;
      if(!cb || cb.tagName !== "INPUT") return;

      const key = cb.dataset.key;
      const idx = Number(cb.dataset.clauseIndex);

      if(!actives[idx]) return;

      actives[idx][key] = cb.checked;
      cb.parentElement.classList.toggle("chip-off", !cb.checked);
      renderAll();
    });

    $$("input[type='checkbox']", wrapper).forEach(cb => {
      cb.parentElement.classList.toggle("chip-off", !cb.checked);
    });
  };

  createFor(DOM.togglesP1, 0);
  createFor(DOM.togglesP2, 1);
}

/* =========================
   15) PANEL
========================= */
let panelClauseIndex = 0;
let panelKey = "subject";

function renderPanelList(col){
  if(!DOM.panelList) return;

  DOM.panelList.innerHTML = "";

  const key = col.key;
  const map = translations[key] || {};
  const filter = (DOM.panelSearchInput?.value || "").trim().toLowerCase();

  const words = col.data.filter(w => {
    if(!w) return false;
    if(!filter) return true;
    return w.toLowerCase().startsWith(filter);
  });

  if(!words.length){
    const empty = document.createElement("div");
    empty.className = "panel-item";
    empty.textContent = "Nu există cuvinte pentru filtrul introdus.";
    DOM.panelList.appendChild(empty);
    return;
  }

  words.forEach(word => {
    const item = document.createElement("div");
    item.className = "panel-item";

    const main = document.createElement("div");
    main.className = "panel-item-main";
    main.textContent = word;
    item.appendChild(main);

    const extra = document.createElement("div");
    extra.className = "panel-item-extra";

    const ro = map[word];
    if(ro){
      const tag = document.createElement("div");
      tag.className = "panel-item-tag";
      tag.textContent = ro;
      extra.appendChild(tag);
    }

    if(key === "conjug" && isLinkingConj(word)){
      const star = document.createElement("div");
      star.className = "panel-item-tag";
      star.textContent = "⭐ P2";
      extra.appendChild(star);
    }

    item.appendChild(extra);

    if(key === "subject"){
      const addBtn = document.createElement("button");
      addBtn.textContent = "➕";
      addBtn.className = "panel-add-btn";
      addBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if(!sentences[panelClauseIndex].subjects){
          sentences[panelClauseIndex].subjects = [];
        }
        if(!sentences[panelClauseIndex].subjects.includes(word)){
          sentences[panelClauseIndex].subjects.push(word);
        }
        hide(DOM.overlay);
        renderAll();
      });
      item.appendChild(addBtn);
    }

    if(key === "subjectAdj"){
      const addBtn = document.createElement("button");
      addBtn.textContent = "➕";
      addBtn.className = "panel-add-btn";
      addBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if(!sentences[panelClauseIndex].subjectAdjs){
          sentences[panelClauseIndex].subjectAdjs = [];
        }
        if(!sentences[panelClauseIndex].subjectAdjs.includes(word)){
          sentences[panelClauseIndex].subjectAdjs.push(word);
        }
        hide(DOM.overlay);
        renderAll();
      });
      item.appendChild(addBtn);
    }

    if(key === "objectAdj"){
      const addBtn = document.createElement("button");
      addBtn.textContent = "➕";
      addBtn.className = "panel-add-btn";
      addBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if(!sentences[panelClauseIndex].objectAdjs){
          sentences[panelClauseIndex].objectAdjs = [];
        }
        if(!sentences[panelClauseIndex].objectAdjs.includes(word)){
          sentences[panelClauseIndex].objectAdjs.push(word);
        }
        hide(DOM.overlay);
        renderAll();
      });
      item.appendChild(addBtn);
    }

    item.addEventListener("click", () => {
      if(!sentences[panelClauseIndex]){
        sentences[panelClauseIndex] = makeEmptySentence();
        actives[panelClauseIndex] = makeAllActive();
      }

      sentences[panelClauseIndex][key] = word;

      if(key === "conjug" && isLinkingConj(word)){
        showExtraClauses = true;
        ensureLinkedSentences();
      }

      hide(DOM.overlay);
      renderAll();
    });

    DOM.panelList.appendChild(item);
  });
}

function openPanel(clauseIndex, key){
  panelClauseIndex = clauseIndex;
  panelKey = key;

  const col = columns.find(c => c.key === key);
  if(!col) return;

  if(DOM.panelTitle) DOM.panelTitle.textContent = `Propoziția ${clauseIndex + 1} – ${col.title}`;
  if(DOM.panelSub) DOM.panelSub.textContent = col.hint || "";
  if(DOM.panelSearchInput) DOM.panelSearchInput.value = "";
  if(DOM.newWordInput) DOM.newWordInput.value = "";
  if(DOM.newWordTransInput) DOM.newWordTransInput.value = "";

  renderPanelList(col);
  show(DOM.overlay);
  DOM.panelSearchInput?.focus();
}

/* =========================
   16) PRESS HANDLERS
========================= */
function cycleColumnValue(clauseIndex, key){
  const col = columns.find(c => c.key === key);
  if(!col) return;

  const arr = col.data;
  const state = sentences[clauseIndex];
  if(!state) return;

  const cur = state[key];
  let idx = arr.indexOf(cur);
  if(idx === -1) idx = 0;

  const nextIdx = (idx + 1) % arr.length;
  state[key] = arr[nextIdx] || "";

  if(key === "conjug" && isLinkingConj(state[key])){
    ensureLinkedSentences();
    if(DOM.enableP2){
      DOM.enableP2.checked = true;
      DOM.enableP2.dispatchEvent(new Event("change"));
    }
  }

  renderAll();
}

function attachPressHandlers(tableEl, clauseIndex){
  if(!tableEl) return;

  let longPressTimer = null;
  let pressTarget = null;

  tableEl.addEventListener("pointerdown", (e) => {
    const colDiv = e.target.closest(".col");
    if(!colDiv) return;
    if(e.target && e.target.matches("input.col-toggle")) return;

    e.preventDefault();
    pressTarget = colDiv;

    longPressTimer = setTimeout(() => {
      if(pressTarget === colDiv){
        openPanel(clauseIndex, colDiv.dataset.key);
        pressTarget = null;
      }
    }, 450);
  });

  tableEl.addEventListener("pointerup", (e) => {
    const colDiv = e.target.closest(".col");

    if(e.target && e.target.matches("input.col-toggle")){
      if(longPressTimer) clearTimeout(longPressTimer);
      longPressTimer = null;
      pressTarget = null;
      return;
    }

    if(longPressTimer) clearTimeout(longPressTimer);
    longPressTimer = null;

    if(pressTarget && colDiv === pressTarget){
      cycleColumnValue(clauseIndex, colDiv.dataset.key);
    }

    pressTarget = null;
  });

  tableEl.addEventListener("pointerleave", () => {
    if(longPressTimer) clearTimeout(longPressTimer);
    longPressTimer = null;
    pressTarget = null;
  });
}

/* =========================
   17) FAVORITES / AUDIO
========================= */
const favorites = [];

function renderFavorites(){
  if(!DOM.favoritesListEl) return;

  DOM.favoritesListEl.innerHTML = "";

  if(!favorites.length){
    const div = document.createElement("div");
    div.className = "small-label";
    div.textContent = "Nu ai salvat încă nicio propoziție.";
    DOM.favoritesListEl.appendChild(div);
    return;
  }

  favorites.forEach(f => {
    const item = document.createElement("div");
    item.className = "fav-item";

    const ko = document.createElement("div");
    ko.className = "fav-ko";
    ko.textContent = f.ko;

    const ro = document.createElement("div");
    ro.className = "fav-ro";
    ro.textContent = f.ro;

    item.appendChild(ko);
    item.appendChild(ro);
    DOM.favoritesListEl.appendChild(item);
  });
}

function speakKorean(textToSpeak){
  if(!("speechSynthesis" in window)) return;

  const t = (textToSpeak || "").trim();
  if(!t) return;

  const u = new SpeechSynthesisUtterance(t);
  u.lang = "ko-KR";

  const voices = window.speechSynthesis.getVoices();
  const koVoices = voices.filter(v => (v.lang || "").toLowerCase().startsWith("ko"));
  if(koVoices.length) u.voice = koVoices[0];

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

/* =========================
   18) PARSER RO / EN
========================= */
function stripDiacritics(s){
  return (s || "")
    .replace(/ă/g, "a").replace(/â/g, "a").replace(/î/g, "i")
    .replace(/ș/g, "s").replace(/ş/g, "s")
    .replace(/ț/g, "t").replace(/ţ/g, "t");
}

function normRo(s){
  return stripDiacritics(
    (s || "")
      .toLowerCase()
      .replace(/[.,!?;:()[\]"]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

const SEMANTIC_MAP = {
  "consume":"먹다","drink":"마시다","study":"공부하다","learn":"배우다","buy":"사다",
  "walk":"걷다","run":"달리다","go":"가다","come":"오다","read":"읽다","write":"쓰다",
  "eat":"먹다","merge":"가다","veni":"오다","citi":"읽다","scrie":"쓰다","bea":"마시다","manca":"먹다"
};

function normalizeVerbForms(text){
  let t = normRo(text);

  const EN_MAP = {
    "going":"go","went":"go","gone":"go",
    "comes":"come","coming":"come","came":"come",
    "eating":"eat","ate":"eat",
    "drinking":"drink","drank":"drink",
    "reading":"read","writing":"write","wrote":"write",
    "studying":"study","studied":"study",
    "learning":"learn","learned":"learn",
    "bought":"buy","buying":"buy",
    "walking":"walk","walked":"walk",
    "running":"run","ran":"run"
  };

  Object.entries(EN_MAP).forEach(([k,v])=>{
    t = t.replace(new RegExp(`\\b${k}\\b`, "g"), v);
  });

  const RO_MAP = {
    "merg":"merge","mergi":"merge","mergeam":"merge","mergeai":"merge","mergea":"merge","mergeau":"merge","mergem":"merge","mergeti":"merge","mergeți":"merge",
    "vin":"veni","vii":"veni","vine":"veni","veneam":"veni","venea":"veni","veneau":"veni","venim":"veni","veniti":"veni","veniți":"veni",
    "mananc":"manca","mănânc":"manca","mananci":"manca","mănânci":"manca","manca":"manca","mancam":"manca","mâncam":"manca","mancati":"manca","mâncați":"manca",
    "beau":"bea","bei":"bea","bea":"bea","beam":"bea","beti":"bea","beți":"bea",
    "citesc":"citi","citesti":"citi","citești":"citi","citeste":"citi","citește":"citi","citeam":"citi","citea":"citi","citim":"citi","cititi":"citi","citiți":"citi",
    "scriu":"scrie","scrii":"scrie","scrie":"scrie","scriam":"scrie","scria":"scrie","scriem":"scrie","scrieti":"scrie","scrieți":"scrie"
  };

  Object.entries(RO_MAP).forEach(([k,v])=>{
    t = t.replace(new RegExp(`\\b${k}\\b`, "g"), v);
  });

  return t;
}

function detectImplicitSubject(text){
  const t = normalizeVerbForms(text);

  if(/\bmerg\b|\bfac\b|\bmanca\b|\bbea\b|\bciti\b|\bscrie\b|\bvreau\b|\bpot\b/.test(t)) return "저";
  if(/\bmergi\b|\bfaci\b/.test(t)) return "너";
  if(/\bmergem\b|\bfacem\b/.test(t)) return "우리";

  return "";
}

function detectTense(text){
  const t = normalizeVerbForms(text);

  if(/\bieri\b|\byesterday\b|\bmergeam\b|\bveneam\b|\bciteam\b|\bscriam\b|\bmancam\b|\bbeam\b/.test(t)) return "past";
  if(/\bmaine\b|\bmâine\b|\btomorrow\b|\bvoi\b|\bwill\b/.test(t)) return "future";

  return "present";
}

function detectInputLang(text){
  const t = normRo(text);

  const enHints = [" and "," but "," because "," after "," before "," while "," i "," we "," you "," they "," he "," she "];
  const roHints = [" si "," și "," dar "," pentru ca "," pentru că "," dupa "," după "," eu "," noi "," tu "," ei "," ea "];

  let enScore = 0;
  let roScore = 0;

  enHints.forEach(x => {
    if((" " + t + " ").includes(normRo(x))) enScore++;
  });

  roHints.forEach(x => {
    if((" " + t + " ").includes(normRo(x))) roScore++;
  });

  return enScore > roScore ? "en" : "ro";
}

function buildVocabIndex(vocab){
  const index = {};

  const KEY_MAP = {
    subjects:"subject",
    objects:"object",
    verbs:"verb",
    times:"time",
    time:"time",
    places:"place",
    modifiers:"mod",
    subjectAdjectives:"subjectAdj",
    objectAdjectives:"objectAdj",
    adjectives:"objectAdj",
    adverbs:"mod",
    grammar:"conjug",
    conjugations:"conjug",
    connectors:"conjug",
    nouns:"object"
  };

  Object.entries(vocab || {}).forEach(([category, list])=>{
    if(!Array.isArray(list)) return;

    const normalized = KEY_MAP[category] || category;

    if(!index[normalized]) index[normalized] = {};

    list.forEach(entry=>{
      if(!entry || !entry.ko) return;

      const ko = entry.ko.trim();

      if(entry.ro){
        const ro = normRo(entry.ro);
        if(ro) index[normalized][ro] = ko;
      }

      if(entry.en){
        const en = normRo(entry.en);
        if(en) index[normalized][en] = ko;
      }
    });
  });

  Object.entries(SEMANTIC_MAP).forEach(([k,v])=>{
    if(!index.verb) index.verb = {};
    index.verb[normRo(k)] = v;
  });

  return index;
}

function findMatchesAdvanced(text, category){
  const results = [];
  const dict = VOCAB_INDEX[category] || {};
  const clean = normalizeVerbForms(text);

  Object.entries(dict)
    .sort((a,b) => b[0].length - a[0].length)
    .forEach(([key,ko])=>{
      const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${safeKey}\\b`, "g");

      if(regex.test(clean) && !results.includes(ko)){
        results.push(ko);
      }
    });

  return results;
}

function splitInputClauses(text){
  const clean = normRo(text);

  return clean
    .split(/\b(dupa ce|după ce|inainte|înainte|pentru ca|pentru că|ca sa|ca să|si|și|dar|apoi|and|but|then|after|before|because|while)\b/)
    .map(s => normRo(s))
    .filter(Boolean)
    .filter(s => ![
      "si","și","dar","apoi","dupa ce","după ce","inainte","înainte",
      "pentru ca","pentru că","ca sa","ca să",
      "and","but","then","after","before","because","while"
    ].includes(s));
}

function detectConjFromText(chunk){
  const t = normalizeVerbForms(chunk);

  if(/\bdupa ce\b|\bdupă ce\b|\bafter\b/.test(t)) return "-고 나서";
  if(/\binainte\b|\bînainte\b|\bbefore\b/.test(t)) return "-기 전에";
  if(/\bin timp ce\b|\bwhile\b/.test(t)) return "-(으)면서";
  if(/\bpentru ca\b|\bpentru că\b|\bbecause\b/.test(t)) return "-기 때문에";
  if(/\bca sa\b|\bca să\b|\bin order to\b/.test(t)) return "-고자 하다";
  if(/\bvreau sa\b|\bvreau să\b/.test(t)) return "-고 싶어요";
  if(/\btrebuie sa\b|\btrebuie să\b|\bmust\b/.test(t)) return "-아/어야 돼요";
  if(/\bnu pot sa\b|\bnu pot să\b|\bcannot\b|\bcan't\b/.test(t)) return "-(으)ㄹ 수 없어요";
  if(/\bpot sa\b|\bpot să\b|\bcan\b/.test(t)) return "-(으)ㄹ 수 있어요";

  const tense = detectTense(t);
  if(tense === "past") return "-았어요/었어요";
  if(tense === "future") return "-(으)ㄹ 거예요";

  return "-아요/어요";
}

function buildSentenceFromChunk(chunk){
  const s = makeEmptySentence();
  const clean = normalizeVerbForms(chunk);

  const subjectMatches = findMatchesAdvanced(clean, "subject");
  if(subjectMatches.length){
    s.subject = subjectMatches[0];
    s.subjects = [...subjectMatches];
  } else {
    const implicit = detectImplicitSubject(clean);
    if(implicit){
      s.subject = implicit;
      s.subjects = [implicit];
    }
  }

  const timeMatches = findMatchesAdvanced(clean, "time");
  if(timeMatches.length){
    s.time = timeMatches[0];
    s.times = [...timeMatches];
  }

  const placeMatches = findMatchesAdvanced(clean, "place");
  if(placeMatches.length){
    s.place = placeMatches[0];
    s.places = [...placeMatches];
  }

  const objectMatches = findMatchesAdvanced(clean, "object");
  if(objectMatches.length){
    s.object = objectMatches[0];
    s.objects = [...objectMatches];
  }

  const objectAdjMatches = findMatchesAdvanced(clean, "objectAdj");
  if(objectAdjMatches.length){
    s.objectAdjs = [...objectAdjMatches];
  }

  const subjectAdjMatches = findMatchesAdvanced(clean, "subjectAdj");
  if(subjectAdjMatches.length){
    s.subjectAdjs = [...subjectAdjMatches];
  }

  const modMatches = findMatchesAdvanced(clean, "mod");
  if(modMatches.length){
    s.mod = modMatches[0];
    s.mods = [...modMatches];
  }

  const verbMatches = findMatchesAdvanced(clean, "verb");
  if(verbMatches.length){
    s.verb = verbMatches[0];
    s.verbs = [...verbMatches];
  }

  const grammarMatches = findMatchesAdvanced(clean, "conjug");
  if(grammarMatches.length){
    s.conjug = grammarMatches[0];
  } else {
    s.conjug = detectConjFromText(clean);
  }

  if(s.conjug === "-기 때문에" || /\bpentru ca\b|\bpentru că\b|\bbecause\b/.test(clean)){
    s.reason = true;
  }

  if(s.conjug === "-면" || /\bdaca\b|\bdacă\b|\bif\b/.test(clean)){
    s.condition = true;
  }

  if(/\bdar\b|\bbut\b/.test(clean)){
    s.contrast = true;
  }

  if(/\bdupa\b|\bdupă\b|\bafter\b/.test(clean)){
    s.sequence = true;
  }

  return s;
}

function translateRoToKo(text){
  const lang = detectInputLang(text);
  const parts = splitInputClauses(text);

  sentences = [];
  actives = [];

  parts.forEach(chunk=>{
    const s = buildSentenceFromChunk(chunk);
    sentences.push(s);
    actives.push(makeAllActive());
  });

  if(!sentences.length){
    sentences = [makeEmptySentence()];
    actives = [makeAllActive()];
  }

  showExtraClauses = sentences.length > 1;

  renderAll();

  return {
    lang,
    ko: buildComplexSentence(),
    roFixed: buildFullRomanian()
  };
}

/* =========================
   19) LINKING / COMPLEX SENTENCES
========================= */
const linkingConjugations = new Set([
  "-고","-고 나서","-기 전에","-(으)면서","-(으)며",
  "-(으)나","-(으)므로","-(으)ㄴ/는 만큼","-(으)ㄹ수록",
  "-(으)ㄴ/는데도","-(으)ㄹ지라도","-(으)ㄴ/는 반면에",
  "-도록 하다","-기에","-길래","-고 말다","-고자 하다"
]);

function isLinkingConj(v){
  return linkingConjugations.has(v);
}

function ensureLinkedSentences(){
  if(!Array.isArray(sentences)) sentences = [makeEmptySentence()];
  if(!Array.isArray(actives)) actives = [makeAllActive()];

  let requiredLength = 1;

  for(let i = 0; i < sentences.length; i++){
    const conj = sentences[i]?.conjug || "";
    if(isLinkingConj(conj)){
      requiredLength = Math.max(requiredLength, i + 2);
    }
  }

  while(sentences.length < requiredLength){
    sentences.push(makeEmptySentence());
  }

  while(actives.length < requiredLength){
    actives.push(makeAllActive());
  }

  showExtraClauses = requiredLength > 1;
}

function detectRelation(a,b){
  if(a.time && b.time) return "sequence";
  if(a.object && b.object && a.verb !== b.verb) return "contrast";
  if(a.reason) return "cause";
  if(a.condition) return "condition";
  if(a.verb === b.verb) return "parallel";
  return "background";
}

function pickAdvancedConnector(a,b){
  if(a.conjug && isLinkingConj(a.conjug)) return a.conjug;

  const relation = detectRelation(a,b);

  if(relation === "sequence") return "-고 나서";
  if(relation === "contrast") return "-지만";
  if(relation === "cause") return "-기에";
  if(relation === "parallel") return "-(으)면서";
  if(relation === "condition") return "-(으)면";
  return "-고";
}

function transformVerbForConnector(verb, connector){
  if(!verb) return "";
  const stem = getVerbStem(verb);

  if(connector === "-고") return stem + "고";
  if(connector === "-고 나서") return stem + "고 나서";
  if(connector === "-기 전에") return stem + "기 전에";
  if(connector === "-(으)면서") return stem + "면서";
  if(connector === "-(으)며") return stem + "며";
  if(connector === "-지만") return stem + "지만";
  if(connector === "-기에") return stem + "기에";
  if(connector === "-길래") return stem + "길래";
  if(connector === "-고자 하다") return stem + "고자";
  if(connector === "-고 말다") return stem + "고 말고";
  if(connector === "-(으)면") return stem + "면";

  return stem + "고";
}

function applyConnector(sentence, connector){
  if(!sentence) return "";

  const match = sentence.match(/([가-힣]+(?:요|다))$/);
  if(!match) return sentence;

  const verbPart = match[0];
  const base = sentence.slice(0, -verbPart.length).trim();

  let sourceVerb = "";

  for(let i = verbs.length - 1; i >= 0; i--){
    const vb = verbs[i];
    if(
      verbPart === presentPolite(vb) ||
      verbPart === pastPolite(vb) ||
      verbPart === getVerbStem(vb) + "고 있어요" ||
      verbPart === getVerbStem(vb) + "고 싶어요"
    ){
      sourceVerb = vb;
      break;
    }
  }

  if(!sourceVerb){
    sourceVerb = verbPart.endsWith("요") ? verbPart.replace(/요$/, "다") : verbPart;
  }

  const transformed = transformVerbForConnector(sourceVerb, connector);
  return (base + " " + transformed).trim();
}

function buildComplexSentence(){
  if(!sentences.length) return "";

  let result = "";

  for(let i = 0; i < sentences.length; i++){
    const s = sentences[i];
    if(!s) continue;

    let clause = planKoreanSentence(s, actives[i]);
    if(!clause) continue;

    if(i < sentences.length - 1){
      const next = sentences[i + 1];
      const connector = pickAdvancedConnector(s, next);
      clause = applyConnector(clause, connector);
      result += clause + " ";
    } else {
      result += clause;
    }
  }

  return result.replace(/\s+/g," ").trim();
}

/* =========================
   20) PREVIEW / EXTRA
========================= */
function updateNaturalHint(textValue){
  if(!DOM.naturalHint) return;
  if(!textValue){
    DOM.naturalHint.textContent = "";
    return;
  }
  DOM.naturalHint.textContent = textValue.includes("고") ? "⭐ propoziție compusă" : "";
}

function updatePreviewCardState(){
  const card = document.querySelector(".preview-card");
  if(!card) return;

  const txt = DOM.previewKo?.textContent || "";
  if(txt && !txt.includes("alege")){
    card.classList.add("has-content");
  }else{
    card.classList.remove("has-content");
  }
}

function updatePreview(){
  if(!DOM.previewKo) return;

  normalizeSubjects();

  let ko = "";
  try{
    ko = buildComplexSentence();
  }catch(err){
    console.error("buildComplexSentence error:", err);
    ko = "";
  }

  DOM.previewKo.textContent = ko || "(alege cuvinte din tabel)";

  if(DOM.previewRo && showRo){
    DOM.previewRo.textContent = buildFullRomanian();
  }

  if(DOM.roInput){
    DOM.roInput.value = buildFullRomanian();
  }

  updateNaturalHint(ko);
  updatePreviewCardState();
}

function renderExtraClauses(){
  if(!DOM.extraClauses) return;

  DOM.extraClauses.innerHTML = "";

  for(let i = 2; i < sentences.length; i++){
    const wrapper = document.createElement("div");
    wrapper.className = "table-block";

    const title = document.createElement("div");
    title.className = "table-title";
    title.innerHTML = `<span>Propoziția ${i + 1}</span>`;
    wrapper.appendChild(title);

    const table = document.createElement("div");
    table.className = "table-horizontal";
    wrapper.appendChild(table);

    DOM.extraClauses.appendChild(wrapper);

    renderClauseRow(table, actives[i], sentences[i], i);
    attachPressHandlers(table, i);
  }
}

function buildFullRomanian(){
  const parts = [];

  let prevSubject = null;
  let prevTime = null;
  let prevPlace = null;

  for(let i = 0; i < sentences.length; i++){
    const s = sentences[i];
    if(!s) continue;

    const sameSubject = s.subject === prevSubject;
    const sameTime = s.time === prevTime;
    const samePlace = s.place === prevPlace;

    const hideSubject = i > 0 && sameSubject && sameTime && samePlace;

    let ro = buildNaturalRomanian(
      {...s, hideSubject},
      actives[i]
    );

    if(!ro) continue;

    if(isLinkingConj(s.conjug || "")){
      ro = ro.replace(/[.]$/, "");
    }

    parts.push(ro);

    prevSubject = s.subject || null;
    prevTime = s.time || null;
    prevPlace = s.place || null;
  }

  return parts.join(" ").replace(/\s+/g," ").replace(/și\s+și/g,"și").trim();
}

/* =========================
   21) MODEL NAV
========================= */
function loadModelRow(i){
  sentences.forEach(s=>{
    columns.forEach(col=>{
      if(!col.data.length) return;
      const value = col.data[i % col.data.length] || "";
      s[col.key] = value;
    });
  });
}

function updateModelNav(){
  if(DOM.pageInfoEl) DOM.pageInfoEl.textContent = `Rând model: ${indexModelRow + 1} / ${maxLen}`;
  if(DOM.prevBtn) DOM.prevBtn.disabled = indexModelRow === 0;
  if(DOM.nextBtn) DOM.nextBtn.disabled = indexModelRow === maxLen - 1;
}

/* =========================
   22) VOCAB LOADER
========================= */
async function loadVocabulary(){
  try{
    const res = await fetch("./data/vocab-korean.json");
    vocabJson = await res.json();

    VOCAB_INDEX = buildVocabIndex(vocabJson);

    const map = {
      subject:"subjects",
      object:"objects",
      verb:"verbs",
      time:"times",
      place:"places",
      mod:"modifiers",
      conjug:Array.isArray(vocabJson.conjugations) ? "conjugations" : "grammar",
      subjectAdj:"subjectAdjectives",
      objectAdj:"objectAdjectives"
    };

    Object.entries(map).forEach(([colKey, jsonKey])=>{
      const col = columns.find(c => c.key === colKey);
      const list = vocabJson[jsonKey];
      if(!col || !Array.isArray(list)) return;

      list.forEach(entry=>{
        if(!entry || !entry.ko) return;

        const word = entry.ko.trim();
        if(!word) return;

        if(!col.data.includes(word)){
          col.data.push(word);
        }

        if(!translations[colKey]) translations[colKey] = {};
        translations[colKey][word] = entry.ro || entry.en || "";
      });
    });

    console.log("VOCAB OK");
  }catch(err){
    console.error("Vocabulary load error:", err);
  }
}

/* =========================
   23) UI EVENTS
========================= */
function setupUI(){
  DOM.modeButtons.forEach(btn=>{
    on(btn, "click", ()=>{
      currentMode = btn.dataset.mode || "topik";
      DOM.modeButtons.forEach(b => b.classList.toggle("active", b === btn));
      renderAll();
    });
  });

  on(DOM.prevBtn, "click", ()=>{
    if(indexModelRow > 0){
      indexModelRow--;
      loadModelRow(indexModelRow);
      renderAll();
    }
  });

  on(DOM.nextBtn, "click", ()=>{
    if(indexModelRow < maxLen - 1){
      indexModelRow++;
      loadModelRow(indexModelRow);
      renderAll();
    }
  });

  on(DOM.resetBtn, "click", ()=>{
    actives = actives.map(() => makeAllActive());
    createToggleChips();
    renderAll();
  });

  on(DOM.toggleRoBtn, "click", ()=>{
    showRo = !showRo;
    if(DOM.toggleRoBtn){
      DOM.toggleRoBtn.textContent = showRo ? "Ascunde traducerea" : "Arată traducerea";
    }
    updatePreview();
  });

  on(DOM.randomBtn, "click", ()=>{
    const s = sentences[0];
    const a = actives[0];

    columns.forEach(col=>{
      if(!isColumnVisible(col.key)) return;
      if(a[col.key] === false) return;

      const arr = col.data.filter(Boolean);
      if(!arr.length) return;

      s[col.key] = arr[Math.floor(Math.random() * arr.length)];
    });

    renderAll();
  });

  on(DOM.speakBtn, "click", ()=>{
    const ko = (DOM.previewKo?.textContent || "").trim();
    if(!ko || ko.includes("alege")) return;
    speakKorean(ko);
  });

  on(DOM.favBtn, "click", ()=>{
    const ko = (DOM.previewKo?.textContent || "").trim();
    const ro = (DOM.previewRo?.textContent || "").trim();

    if(!ko || ko.includes("alege")) return;

    const exists = favorites.some(f => f.ko === ko);
    if(!exists) favorites.push({ko, ro});

    renderFavorites();
  });

  on(DOM.closePanelBtn, "click", ()=> hide(DOM.overlay));
  on(DOM.overlay, "click", (e)=>{
    if(e.target === DOM.overlay) hide(DOM.overlay);
  });

  on(DOM.panelSearchInput, "input", ()=>{
    const col = columns.find(c => c.key === panelKey);
    if(col) renderPanelList(col);
  });

  on(DOM.addWordBtn, "click", ()=>{
    const txt = (DOM.newWordInput?.value || "").trim();
    if(!txt) return;

    const roTxt = (DOM.newWordTransInput?.value || "").trim();
    const col = columns.find(c => c.key === panelKey);
    if(!col || !col.allowCustom) return;

    if(!col.data.includes(txt)) col.data.push(txt);
    if(!translations[panelKey]) translations[panelKey] = {};
    if(roTxt) translations[panelKey][txt] = roTxt;

    if(customData[panelKey]){
      customData[panelKey].push({word:txt, ro:roTxt});
      saveCustomData();
    }

    DOM.newWordInput.value = "";
    DOM.newWordTransInput.value = "";

    renderPanelList(col);
  });

  on(DOM.enableP2, "change", ()=>{
    const onOff = DOM.enableP2.checked;

    if(onOff && !sentences[1]){
      sentences[1] = makeEmptySentence();
      actives[1] = makeAllActive();
    }

    if(DOM.tableP2) onOff ? show(DOM.tableP2) : hide(DOM.tableP2);
    if(DOM.titleP2) onOff ? show(DOM.titleP2) : hide(DOM.titleP2);

    renderAll();
  });

  on(DOM.roTranslateBtn, "click", ()=>{
    const txt = (DOM.roInput?.value || "").trim();
    if(!txt) return;
    translateRoToKo(txt);
    updatePreview();
    if(DOM.roInput) DOM.roInput.value = buildFullRomanian();
  });

  on(DOM.refreshBtn, "click", ()=> location.reload());
  on(DOM.homeBtn, "click", ()=> { window.location.href = "index.html"; });
}

/* =========================
   24) RENDER ALL
========================= */
function renderAll(){
  ensureLinkedSentences();

  if(!sentences.length){
    sentences = [makeEmptySentence()];
    actives = [makeAllActive()];
  }

  if(DOM.tableP1){
    renderClauseRow(DOM.tableP1, actives[0], sentences[0], 0);
  }

  if(DOM.tableP2 && sentences[1]){
    if(showExtraClauses){
      show(DOM.tableP2);
      DOM.titleP2 && show(DOM.titleP2);
      renderClauseRow(DOM.tableP2, actives[1], sentences[1], 1);
    }else{
      hide(DOM.tableP2);
      DOM.titleP2 && hide(DOM.titleP2);
    }
  }

  renderExtraClauses();
  updateModelNav();
  updatePreview();
}

/* =========================
   25) BOOTSTRAP
========================= */
document.addEventListener("DOMContentLoaded", async () => {
  try{
    await loadVocabulary();

    sentences = [makeEmptySentence()];
    actives = [makeAllActive()];

    loadModelRow(indexModelRow);
    setupUI();
    createToggleChips();

    attachPressHandlers(DOM.tableP1, 0);
    attachPressHandlers(DOM.tableP2, 1);

    renderAll();
  }catch(err){
    console.error("APP BOOT ERROR", err);
  }
});
const clausesWrap = document.getElementById("clausesWrap");
