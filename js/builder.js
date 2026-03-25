    /* ============================================================
   builder.js (REWRITE 100%, cap-coadă, robust, fără duplicări)
   - Respectă HTML-ul tău (id-uri existente) + NU crapă dacă lipsesc unele
   - Builder cu 1..N propoziții (NU hard-limit 2)
   - Păstrează: panel, long-press, chips, toggles, preview KO/RO, audio, favorites,
                custom words + localStorage, parser RO→state, particule + conjugări
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
   1) DATA: LISTE + TRADUCERI (din codul tău)
   ========================= */

/* === LISTE DE CUVINTE (de bază) === */
const subjects = [
  "저","나","너","우리","너희","사람","학생","선생님","직원","전문가","지원자","관리자",
  "부모님","아이","어른","시민","고객","의사","간호사","연구자","관계자","대표","회장",
  "사용자","참가자","운전자","주민","환자"
];
const subjectAdjectives = [
  "예쁜", "착한", "똑똑한", "키가 큰", "젊은", "늙은"
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
  "예쁜", "맛있는", "큰", "작은", "새로운", "오래된"
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

/* === TRADUCERI (coreeană → română) === */
const translations = {
  subject:{ "저":"eu (formal)","나":"eu (informal)","너":"tu","우리":"noi","너희":"voi",
    "사람":"persoană","학생":"student/ă","선생님":"profesor","직원":"angajat",
    "부모님":"părinți","아이":"copil","어른":"adult","고객":"client","의사":"medic",
    "간호사":"asistentă","연구자":"cercetător","대표":"reprezentant","환자":"pacient"
  },
  time:{ "오늘":"astăzi","어제":"ieri","내일":"mâine","지금":"acum","방금":"tocmai acum",
    "조금 후에":"puțin mai târziu","곧":"în curând","최근에":"recent","요즘":"în ultima vreme",
    "마침내":"în cele din urmă","결국":"până la urmă","이전에":"înainte","이후에":"după",
    "당시에":"atunci","한동안":"o perioadă","계속":"continuă","가끔":"din când în când",
    "항상":"întotdeauna","자주":"des","점점":"din ce în ce","차츰":"treptat",
    "일찍":"devreme","늦게":"târziu"
  },
  place:{ "집":"acasă","학교":"școală","회사":"firmă / companie","식당":"restaurant","카페":"cafenea",
    "도서관":"bibliotecă","병원":"spital","시장":"piață","백화점":"magazin universal",
    "공항":"aeroport","기차역":"gară","버스정류장":"stație de autobuz","연구소":"laborator",
    "기관":"instituție","지역사회":"comunitate","환경":"mediu","대기업":"corporație mare",
    "회의실":"sală de ședințe","법원":"instanță","경찰서":"secție de poliție",
    "해변":"plajă","산":"munte","공원":"parc","은행":"bancă"
  },
  mod:{ "잘":"bine","열심히":"cu sârguință","조용히":"în liniște","천천히":"încet",
    "빨리":"repede","정말":"cu adevărat","아주":"foarte","너무":"prea / foarte",
    "많이":"mult","조금":"puțin","갑자기":"brusc","미리":"în avans","벌써":"deja",
    "아까":"mai devreme","방금":"chiar acum","금방":"imediat","곧":"în curând",
    "항상":"mereu","자주":"des","가끔":"din când în când","드물게":"rar",
    "상당히":"destul de","꽤":"binișor","도대체":"(deloc / în întrebări)",
    "절대로":"niciodată (interdicție)","적극적으로":"activ","충분히":"suficient",
    "특히":"în special","오히려":"mai degrabă","점점":"din ce în ce","차츰":"treptat",
    "계속":"în mod continuu"
  },
  object:{
    "책":"carte","커피":"cafea","물":"apă","음식":"mâncare","영화":"film",
    "가방":"geantă","전화":"telefon","옷":"haine","자료":"materiale","데이터":"date",
    "계획":"plan","조건":"condiție","상황":"situație","문제":"problemă",
    "해결책":"soluție","요약":"rezumat","보고서":"raport","문서":"document",
    "컴퓨터":"calculator","노트북":"laptop","편지":"scrisoare","선물":"cadou",
    "의견":"opinie","정보":"informație","관계":"relație","결과":"rezultat",
    "원인":"cauză","방법":"metodă","제품":"produs","서비스":"serviciu",
    "정책":"politică","문화":"cultură","채소":"legume","견과류":"alune / nuci"
  },
  numeral:{},
  counter:{ "개":"bucată","명":"persoană","권":"volum (carte)","장":"foaie / pagină",
    "대":"aparat / vehicul","병":"sticlă","잔":"cană / pahar",
    "마리":"animal","번":"dată","살":"ani (vârstă)","송이":"buchet / ciorchine",
    "줄":"rând / șir","점":"punct","건":"caz","회":"dată (ocazie)",
    "가지":"fel / tip","쪽":"pagină / direcție"
  },
  verb:{
    "가다":"a merge","오다":"a veni","먹다":"a mânca","마시다":"a bea","보다":"a vedea / a se uita",
    "읽다":"a citi","쓰다":"a scrie","배우다":"a învăța","사다":"a cumpăra","주다":"a da",
    "받다":"a primi","일하다":"a lucra","공부하다":"a studia","요리하다":"a găti",
    "청소하다":"a face curat","준비하다":"a pregăti","도와주다":"a ajuta",
    "사용하다":"a folosi","필요하다":"a fi necesar","좋아하다":"a plăcea",
    "싫어하다":"a nu plăcea / a urî","기다리다":"a aștepta","쉬다":"a se odihni",
    "만나다":"a se întâlni","걷다":"a merge pe jos","달리다":"a alerga",
    "앉다":"a se așeza","서다":"a sta în picioare","결정하다":"a decide",
    "제안하다":"a propune","전달하다":"a transmite","유지하다":"a menține",
    "발생하다":"a se produce","증가하다":"a crește","감소하다":"a scădea",
    "인정하다":"a recunoaște","분석하다":"a analiza","관찰하다":"a observa",
    "해결하다":"a rezolva","연구하다":"a cerceta","협력하다":"a colabora",
    "요청하다":"a solicita","충족하다":"a satisface","비교하다":"a compara",
    "설명하다":"a explica","예상하다":"a anticipa"
  },
  conjug:{
    "-아요/어요":"prezent politicos",
    "-았어요/었어요":"trecut politicos",
    "-고 있어요":"acțiune în desfășurare",
    "-고 싶어요":"vreau să...",
    "-고":"și",
    "-(으)세요":"imperativ / onorific",
    "-(으)ㄹ 거예요":"viitor",
    "-지 마세요":"nu faceți..., vă rog",
    "-아/어 주세요":"vă rog să...",
    "-아/어야 돼요":"trebuie să...",
    "-(으)ㄹ 수 있어요":"pot să...",
    "-(으)ㄹ 수 없어요":"nu pot să...",
    "-더라고요":"am observat că...",
    "-네요":"exclamativ (observație surprinsă)",
    "-군요":"exclamativ (constatare)",
    "-고 나서":"după ce...",
    "-기 전에":"înainte să...",
    "-(으)면서":"în timp ce...",
    "-(으)며":"și (în timp ce)",
    "-(으)ㄹ지도 몰라요":"s-ar putea să...",
    "-(으)ㄹ게요":"voi face (pentru tine)",
    "-(으)ㄹ래요?":"ai chef să...? / vreau să...",
    "-(으)ㄹ까요?":"să facem...?",
    "-는 게 어때요?":"ce-ar fi să...?",
    "-는 중이에요":"sunt în mijlocul acțiunii",
    "-아/어도 돼요":"poți să..., e în regulă",
    "-(으)면 안 돼요":"nu ai voie să...",
    "-도록 하다":"să faci în așa fel încât să...",
    "-게 되다":"ajungi să...",
    "-아/어지다":"a deveni...",
    "-기에":"pentru că..., fiindcă",
    "-길래":"pentru că (am văzut / simțit eu)",
    "-고 말다":"în cele din urmă ajunge să...",
    "-고자 하다":"a intenționa să...",
    "-(으)ㄹ 뿐이다":"doar..., nimic altceva"
  }
};
   /* =========================
   JOIN
   ========================= */
 
function joinVerbs(verbs){

  if(!verbs.length) return "";

  if(verbs.length === 1){
    return presentPolite(verbs[0]);
  }

  let result = "";

  for(let i=0;i<verbs.length;i++){

    const v = verbs[i];

    if(i === verbs.length - 1){
      result += presentPolite(v);
    }else{
      result += getVerbStem(v) + "고 ";
    }

  }

  return result.trim();

}
    function joinPlaces(places){

  if(!places.length) return "";

  if(places.length === 1){
    return places[0] + "에서";
  }

  let result = "";

  for(let i=0;i<places.length;i++){

    const p = places[i];

    if(i === places.length - 1){
      result += p + "에서";
    }else{
      result += p + "하고 ";
    }

  }

  return result.trim();

}
    function buildEnumeration(list, single){

  // dacă există listă (mai multe elemente)
  if(Array.isArray(list) && list.length){
    return list.filter(Boolean).join(" 하고 ");
  }

  // dacă există doar unul
  if(single){
    return single;
  }

  return "";
}    
   function buildSentence(parsed){

  const place = joinPlaces(parsed.places);
  const verb  = joinVerbs(parsed.verbs);

  return place + " " + verb;

} 
  function buildDictionaryIndex(dict){

  const index = {};

  Object.keys(dict).forEach(category=>{

    index[category] = {};

    dict[category].forEach(entry=>{
      const key = entry.ro.toLowerCase();
      index[category][key] = entry.ko;
    });

  });

  return index;
}
        /* =========================
   2) STORAGE: CUSTOM WORDS
   ========================= */
const STORAGE_KEY = "ralucaKoreanCustomWords_v2";
const customData = {
  subject:[],time:[],place:[],mod:[],object:[],
  numeral:[],counter:[],verb:[],conjug:[]
};

function loadCustomData(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return;
    const saved = JSON.parse(raw);
    Object.keys(customData).forEach(k=>{
      if(Array.isArray(saved[k])) customData[k] = saved[k];
    });

    // inject în liste + translations
    Object.entries(customData).forEach(([key,arr])=>{
      arr.forEach(entry=>{
        if(!entry || !entry.word) return;
        const w = entry.word;
        const ro = entry.ro || "";

        const listMap = {
          subject: subjects, time: times, place: places, mod: mods, object: objects,
          numeral: numerals, counter: counters, verb: verbs, conjug: conjugations
        };
        const list = listMap[key];
        if(list && !list.includes(w)) list.push(w);

        if(!translations[key]) translations[key] = {};
        if(ro) translations[key][w] = ro;
      });
    });
  }catch(e){}
}

function saveCustomData(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(customData)); }catch(e){}
}

loadCustomData();

/* =========================
   3) COLUMNS CONFIG
   ========================= */

  const columns = [
  {key:"subject", title:"SUBJECT", ko:"주어", data:subjects, hint:"Cine?", allowCustom:true},

  // ✅ NOU
  {key:"subjectAdj", title:"ADJ (SUBJECT)", ko:"형용사", data:subjectAdjectives, hint:"Cum este subiectul?", allowCustom:true},

  {key:"time", title:"TIME", ko:"시간", data:times, hint:"Când?", allowCustom:true},
  {key:"place", title:"PLACE", ko:"장소", data:places, hint:"Unde?", allowCustom:true},
  {key:"mod", title:"MOD", ko:"방법", data:mods, hint:"Cum?", allowCustom:true},
  {key:"object", title:"OBJECT", ko:"목적어", data:objects, hint:"Ce?", allowCustom:true},

  // ✅ NOU
  {key:"objectAdj", title:"ADJ (OBJECT)", ko:"형용사", data:objectAdjectives, hint:"Cum este obiectul?", allowCustom:true},

  {key:"numeral", title:"NUMERAL", ko:"", data:numerals, hint:"Număr", allowCustom:true},
  {key:"counter", title:"COUNTER", ko:"수량사", data:counters, hint:"Clasificator", allowCustom:true},
  {key:"verb", title:"VERB", ko:"동사", data:verbs, hint:"Acțiune", allowCustom:true},
  {key:"conjug", title:"CONJUGĂRI", ko:"", data:conjugations, hint:"Formă verbală", allowCustom:true}
];
    const MULTI_VALUE_SLOTS = new Set(["subject"]);
    const maxLen = Math.max(...columns.map(c => c.data.length));
    // ===== CLAUSE ENGINE (GENERALIZARE P1 / P2) =====
const clauses = [
  { id: 1, state: {}, active: {} },
  { id: 2, state: {}, active: {} }
];

// aliasuri TEMPORARE (NU schimbă nimic în restul codului)
const stateP1  = clauses[0].state;
const activeP1 = clauses[0].active;

const stateP2  = clauses[1].state;
const activeP2 = clauses[1].active;
    function fillBuilderColumns(){

  const dict = window.KOREAN_DICT;

  addWords("subject", dict.subjects);
  addWords("object", dict.objects);
  addWords("verb", dict.verbs);
  addWords("time", dict.times);
  addWords("place", dict.places);
  addWords("mod", dict.modifiers);
  addWords("conjug", dict.conjugations);

}
    /* =========================
   4) DOM (nu presupunem nimic: doar id-uri dacă există)
   ========================= */
const DOM = {
  // builder tables (din HTML-ul tău)
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

  // Ro→Ko block
  roInput: $("#roInput"),
  roTranslateBtn: $("#roTranslateBtn"),
  roToKoResult: $("#roToKoResult"),
  roCorrected: $("#roCorrected"),

  // input language switch (ro/en)
  inputLangRadio: $$('input[name="inputLang"]'),

  // mode buttons
  modeButtons: $$(".small-mode-btn"),
  refreshBtn: $("#refreshBtn"),
homeBtn: $("#homeBtn")
  };

       function normalizeSubjects(){

  let last=null

  sentences.forEach((s,i)=>{

    if(!s) return

    if(i===0){
      last=s.subject
      return
    }

    if(s.subject===last){
      s.hideSubject=true
    }

    last=s.subject
  })
}
    /* =========================
   5) APP STATE (IMPORTANT)
   - Propoziții dinamice (1..N)
   ========================= */
let indexModelRow = 0;
    let sentences = [ makeEmptySentence() ];
let actives   = [ makeAllActive() ];
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
    conjug:""

  };
}
    function makeAllActive(){
  const a = {};
  columns.forEach(col => a[col.key] = true);
  return a;
}

let showRo = true;
    let showExtraClauses = false;    
let currentMode = "topik"; // topik vs simple
const simpleColumnsSet = {subject:true,time:true,object:true,verb:true,conjug:true};

    /* =========================
   6) MODE: ce coloane se văd
   ========================= */
function isColumnVisible(key){
  if(currentMode === "topik") return true;
  return !!simpleColumnsSet[key];
}

/* =========================
   7) LINKING CONJUGATIONS
   ========================= */
const linkingConjugations = new Set([
  "-고","-고 나서","-기 전에","-(으)면서","-(으)며",
  "-(으)나","-(으)므로","-(으)ㄴ/는 만큼",
  "-(으)ㄹ수록","-(으)ㄴ/는데도","-(으)ㄹ지라도",
  "-(으)ㄴ/는 반면에","-도록 하다","-기에","-길래","-고 말다","-고자 하다"
]);
const isLinkingConj = (v) => linkingConjugations.has(v);
function fixFinalLinking(text){
  if(!text) return text;

  const linkingForms = ["-고", "-면서", "-며", "-고 나서"];

  for(const form of linkingForms){
    if(text.trim().endsWith(form)){
      return text.replace(form, "-아요/어요");
    }
  }

  return text;
}
  
function conjugateVerb(verb, tense="present", politeness="yo"){

if(!verb) return "";

const stem = verb.replace("다","");
const last = stem[stem.length-1];

const code = last.charCodeAt(0) - 44032;
const batchim = code % 28;

let result="";

if(tense==="present"){

if(batchim===0){
result = stem + "아요";
}else{
result = stem + "어요";
}

}

if(tense==="past"){

if(batchim===0){
result = stem + "았어요";
}else{
result = stem + "었어요";
}

}

if(tense==="future"){

if(batchim===0){
result = stem + "ㄹ 거예요";
}else{
result = stem + "을 거예요";
}

}

if(politeness==="formal"){
result = stem + "습니다";
}

return result;

}
    /* =========================
   8) HANGUL HELPERS (batchim, conjugare)
   ========================= */
const H_BASE = 0xAC00;
const JONG = ["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ",
              "ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const JUNG = ["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ",
              "ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"];

function decomposeLastSyl(word){
  if(!word) return null;
  const ch = word.charCodeAt(word.length-1);
  const code = ch - H_BASE;
  if(code < 0 || code > 11171) return null;
  const jong = code % 28;
  const jung = ((code - jong)/28) % 21;
  const cho = Math.floor((code - jong)/28/21);
  return { cho, jung, jong, prefix: word.slice(0,-1) };
}
    
function getVerbStem(dict){
  if(!dict) return "";
  return dict.endsWith("다") ? dict.slice(0,-1) : dict;
}

const specialVerbMap = {
  "가다":{present:"가요",past:"갔어요"},
  "오다":{present:"와요",past:"왔어요"},
  "보다":{present:"봐요",past:"봤어요"},
  "하다":{present:"해요",past:"했어요"},
  "먹다":{past:"먹었어요"},
  "읽다":{past:"읽었어요"},
  "마시다":{past:"마셨어요"},
  "살다":{past:"살았어요"}
};




    /* =========================
   9) PARTICLE HELPERS
   ========================= */
const pronouns = new Set(["저","나","너","우리","너희"]);
const timeAdverbsNoParticle = new Set(["오늘","어제","내일","지금","방금","요즘","항상","자주","가끔","계속","점점","차츰"]);
    function planKoreanSentence(state, active){

  const use = (k)=>
    active?.[k] !== false &&
    typeof isColumnVisible === "function" ?
    isColumnVisible(k) : true;

  const slots={
    time:[],
    topic:[],
    subject:[],
    place:[],
    manner:[],
    object:[],
    verb:[]
  }

  const v = state.verb || "";
  const cj = state.conjug || "";

  /* TIME */

  if(use("time")){
let t = buildEnumeration(state.times, state.time);
    if(t){
      slots.time.push(addTimeWithParticle(t));
    }
  }

  /* SUBJECT / TOPIC */

  if(!state.hideSubject && use("subject")){

   let s = buildEnumeration(state.subjects, state.subject);
    if(state.subjectAdjs?.length){
      s = state.subjectAdjs.join(" ") + " " + s;
    }

    if(s){

      if(slots.time.length){
        slots.topic.push(addSubjectWithParticle(s));
      }else{
        slots.subject.push(addSubjectWithSubjectParticle(s));
      }

    }
  }

  /* PLACE */

if(use("place")){
let p = buildEnumeration(state.places, state.place);

if(p){
  slots.place.push(p + "에서");
}

}
      /* MANNER */

  if(use("mod")){

  let m = buildEnumeration(state.mods, state.mod);
    if(m){
      slots.manner.push(m);
    }
  }

  /* OBJECT */

  if(use("object")){

   let o = buildEnumeration(state.objects, state.object);
    
    if(state.objectAdjs?.length){
      o = state.objectAdjs.join(" ") + " " + o;
    }

    if(o){

      if(use("numeral") && state.numeral){
        slots.object.push(state.numeral);
      }

      if(use("counter") && state.counter){
        slots.object.push(state.counter);
      }

      slots.object.push(addObjectWithParticle(o));
    }
  }

  /* VERB */

  if(use("verb") || use("conjug")){
    let vp="";

if(state.verbs?.length){
  vp = joinVerbs(state.verbs);
}else{
  vp = buildVerbPhrase(v,cj);
}

if(vp) slots.verb.push(vp);
    
  }

  return [
    ...slots.time,
    ...slots.topic,
    ...slots.subject,
    ...slots.place,
    ...slots.object,
    ...slots.manner,
    ...slots.verb
  ]
  .join(" ")
  .replace(/\s+/g," ")
  .trim()
}
    const particleCache = new Map();

function cachedParticle(word,type){

  const key = word + "_" + type;

  if(particleCache.has(key)){
    return particleCache.get(key);
  }

  let result="";

  if(type==="subject"){
    result = hasBatchim(word) ? "이" : "가";
  }

  if(type==="object"){
    result = hasBatchim(word) ? "을" : "를";
  }

  particleCache.set(key,result);

  return result;
}
    /* =========================
   10) BUILD ONE CLAUSE (KO + RO)
   ========================= */
const labelsRo = {
  subject:"SUBJECT", time:"TIME", place:"PLACE", mod:"MOD",
  object:"OBJECT", numeral:"NUMĂR", counter:"COUNTER", verb:"VERB"
};

    /* =========================
   KOREAN PARTICLE ENGINE
   ========================= */





function particleAnd(word){
  if(!word) return "";
  return hasBatchim(word) ? "과" : "와";
}

function particlePlace(word){
  if(!word) return "";
  return word + "에서";
}

function particleTo(word){
  if(!word) return "";
  return word + "에";
}

function particlePerson(word){
  if(!word) return "";
  return word + "에게";
}
   
 function addSubjectWithParticle(word,state){

  if(!word) return ""

  const p = chooseSubjectParticle(word,state)

  return word + p
}
 function addObjectWithParticle(word){

  if(!word) return "";

  return word + chooseObjectParticle(word);
}
   function addSubjectWithParticle(word,state){

  if(!word) return ""

  const p = chooseSubjectParticle(word,state)

  return word + p
}

function chooseSubjectParticle(word,state){

  const batchim = hasBatchim(word)

  const topicParticle   = batchim ? "은" : "는"
  const subjectParticle = batchim ? "이" : "가"

  const hasTime  = !!state.time
  const hasPlace = !!state.place
  const hasObject = !!state.object

  if(hasTime || hasPlace) return topicParticle
  if(!hasObject) return topicParticle

  return subjectParticle
}

function addObjectWithParticle(word){
  if(!word) return ""
  return word + chooseObjectParticle(word)
}

function chooseObjectParticle(word){
  return hasBatchim(word) ? "을" : "를"
}
   function addPlaceWithParticle(word,verb){

  if(!word) return ""

const motion=new Set([
  "가다","오다","들어가다","나가다","돌아가다"
])
  if(verb && motion.has(verb))
    return word+"에"

  return word+"에서"
}

function addTimeWithParticle(word){

  if(!word) return ""

  const noParticle=new Set(["오늘","어제","내일","지금"])

  if(noParticle.has(word)) return word

  return word+"에"
}
function addWords(columnKey, arr){

  const col = columns.find(c => c.key === columnKey);
  if(!col) return;

  arr.forEach(entry=>{

    const word = entry.ko;

    if(!col.data.includes(word)){
      col.data.push(word);
    }

    if(!translations[columnKey]) translations[columnKey] = {};
    translations[columnKey][word] = entry.ro || "";

  });

}
    /* ===== MULTI WORD BUILDER ===== */

function addSubjectWithSubjectParticle(word){
  if(!word) return "";
  return word + particleSubject(word);
}

const CLAUSE_CONNECTORS = {
  and: "고",
  but: "지만",
  while: "면서",
  because: "기 때문에",
  if: "면",
  background: "는데"
};

// =========================
// KOREAN GRAMMAR BRAIN
// =========================

const GRAMMAR_RELATIONS = {
  cause: ["-기에","-니까","-아서","-어서"],
  contrast: ["-지만","-(으)ㄴ/는데도"],
  sequence: ["-고 나서","-기 전에"],
  simultaneous: ["-(으)면서","-(으)며"],
  condition: ["-면"],
  background: ["-는데"],
  purpose: ["-(으)려고"],
  attempt: ["-아/어 보다"]
};

function pickRandom(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

function chooseClauseRelation(prev,next){

  if(!prev || !next) return "sequence";

  if(prev.time && next.time) return "sequence";

  if(prev.verb === next.verb) return "contrast";

  if(prev.object && next.object) return "background";

  return "cause";
}

function chooseConnector(prev,next){

  const relation = chooseClauseRelation(prev,next);

  const options = GRAMMAR_RELATIONS[relation];

  return pickRandom(options);
}
   function joinClauses(clauses){

  if(!clauses || !clauses.length) return "";

  let result = "";

  clauses.forEach((c,i)=>{

    if(!c) return;

    const text = c.text || "";

    if(i === clauses.length-1){
      result += text;
    }
    else{

      const type = c.connector || "and";
      const connector = CLAUSE_CONNECTORS[type] || "고";

      const base = text.replace(/요$|다$/, "");

      result += base + connector + " ";
    }

  });

  return result.replace(/\s+/g," ").trim();
}

    // =========================
// KOREAN GRAMMAR TREE ENGINE
// =========================

function createClauseNode(state){

  return {
    state,
    children:[],
    connector:null
  };

}

function buildGrammarTree(){

  const nodes=[];

  sentences.forEach(s=>{
    if(!s) return;
    nodes.push(createClauseNode(s));
  });

  for(let i=0;i<nodes.length-1;i++){

    const current=nodes[i];
    const next=nodes[i+1];

    current.connector=chooseConnector(
      current.state,
      next.state
    );

    current.children.push(next);
  }

  return nodes[0];
}
  function buildFromTree(node){

  if(!node) return "";

  const built=buildClauseSentence(
    {...node.state},
    actives[0]
  );

  let result=built.ko.replace(/요$/,"");

  if(node.children.length){

    const child=node.children[0];

    result+=node.connector+" ";

    result+=buildFromTree(child);

  }else{

    result+=built.ko.endsWith("요")?"":"요";
  }

  return result;
}
  
   // =========================
// KOREAN GRAMMAR ENGINE
// =========================

const SENTENCE_PATTERNS = [

  ["time","subject","place","object","verb"],
  ["subject","time","place","object","verb"],
  ["place","subject","object","verb"],
  ["subject","object","place","verb"],
  ["time","place","subject","object","verb"]

];

function extractElements(state){

  return {

    subject: buildSubjectPhrase(state),

    time: buildTimePhrase(state),

    place: buildPlacePhrase(state),

    object: buildObjectPhrase(state),

    verb: buildVerbPhrase(state.verb,state.conjug)

  };

}


  function generateVariations(state,count=5){

  const results=new Set();

  while(results.size<count){

    const s=generateSentenceVariation(state);

    if(s) results.add(s);

  }

  return [...results];

}
   /* =========================
   KOREAN NATURAL WORD ORDER
   ========================= */
    function buildNaturalKoreanOrder(parts){

  if(!parts || !parts.length) return "";

  const subject = [];
  const time = [];
  const place = [];
  const manner = [];
  const object = [];
  const verb = [];
  const other = [];

  parts.forEach(p=>{

    if(!p) return;

    if(p.endsWith("은")||p.endsWith("는")||p.endsWith("이")||p.endsWith("가")){
      subject.push(p);
      return;
    }

    if(p.endsWith("을")||p.endsWith("를")){
      object.push(p);
      return;
    }

    if(p.endsWith("에서")||p.endsWith("에")){
      place.push(p);
      return;
    }

    if(
      p.includes("오늘")||
      p.includes("어제")||
      p.includes("내일")||
      p.includes("지금")
    ){
      time.push(p);
      return;
    }

    if(
      p.endsWith("요")||
      p.endsWith("다")||
      p.endsWith("어요")||
      p.endsWith("아요")
    ){
      verb.push(p);
      return;
    }

    if(p.endsWith("히")||p.endsWith("게")){
      manner.push(p);
      return;
    }

    other.push(p);

  });

  return [
    ...time,
    ...subject,
    ...place,
    ...object,
    ...manner,
    ...verb,
    ...other
  ].join(" ").replace(/\s+/g," ").trim();
}
    /* =========================
   11) NATURAL ROMANIAN (keep-ul tău, simplificat dar corect)
   ========================= */

// Conjugare RO minimală (din codul tău)
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
function stripInfinitive(roVerb){ return (roVerb || "").replace(/^\s*a\s+/i, "").trim(); }
function roPersonFromSubjectKo(subjKo){
  if(subjKo==="저"||subjKo==="나") return "1sg";
  if(subjKo==="너") return "2sg";
  if(subjKo==="우리") return "1pl";
  if(subjKo==="너희") return "2pl";
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
    "-아요/어요":         vv => `${vv}`,
    "-았어요/었어요":     vv => `${vv} (în trecut)`,
    "-고 있어요":         vv => `${vv} acum`,
    "-고 싶어요":         vv => `vreau să ${vv}`,
    "-(으)ㄹ 거예요":      vv => `voi ${vv}`,
    "-지 마세요":         vv => `nu ${vv}, te rog`,
    "-아/어야 돼요":       vv => `trebuie să ${vv}`,
    "-(으)ㄹ 수 있어요":   vv => `pot să ${vv}`,
    "-(으)ㄹ 수 없어요":   vv => `nu pot să ${vv}`,
    "-기 전에":           vv => `înainte să ${vv}`,
    "-고 나서":           vv => `după ce ${vv}`,
    "-(으)면서":           vv => `în timp ce ${vv}`,
    "-(으)ㄹ까요?":        vv => `să ${vv}?`,
    "-고":                vv => `${vv} și`
  };
  const fn = map[cj];
  if(fn) return fn(v || "(verbul)");
  const cjExp = translations.conjug?.[cj] || cj;
  return (v ? v + " " : "") + `(${cjExp})`;
}
    
    
function parseRomanianSentence(text){

 const state = makeEmptySentence();
  const words = text
    .toLowerCase()
    .replace(/[.,!?]/g,"")
    .split(/\s+/);

  state.places = [];
  state.verbs = [];
  state.objects = [];

  words.forEach(w=>{

    /* TIME */

    if(w==="ieri") state.time="어제";
    if(w==="astăzi" || w==="azi") state.time="오늘";
    if(w==="mâine" || w==="maine") state.time="내일";

    /* SUBJECT */

    if(w==="eu") state.subject="저";
    if(w==="noi") state.subject="우리";

    if(w==="maria"){
      state.subjects = state.subjects || [];
      state.subjects.push("마리아");
    }

    /* PLACES */

    if(w==="acasă" || w==="acasa"){
      state.places.push("집");
    }

    if(w==="școală" || w==="scoala"){
      state.places.push("학교");
    }

    if(w==="bibliotecă" || w==="biblioteca"){
      state.places.push("도서관");
    }

    if(w==="laborator"){
      state.places.push("연구실");
    }

    /* VERBS */

    if(w==="citim" || w==="citesc"){
      state.verbs.push("읽다");
    }

    if(w==="venim" || w==="vin"){
      state.verbs.push("오다");
    }

    if(w==="mâncăm" || w==="mancam"){
      state.verbs.push("먹다");
    }

    if(w==="studiem"){
      state.verbs.push("공부하다");
    }

    if(w==="scriem"){
      state.verbs.push("쓰다");
    }

    if(w==="mergem"){
      state.verbs.push("가다");
    }

    if(w==="cumpărăm" || w==="cumparam"){
      state.verbs.push("사다");
    }

    /* OBJECT */

    if(w==="mâncare" || w==="mancare"){
      state.objects.push("음식");
    }

  });

  if(!state.place && state.places.length===1){
    state.place = state.places[0];
  }

  if(!state.verb && state.verbs.length===1){
    state.verb = state.verbs[0];
  }

  return state;
}
    /* =========================
   12) RENDER: TABLE (1 propoziție)
   - IMPORTANT: nu mai facem coduri care se bat cap în cap
   ========================= */
  function renderClauseRow(container, activeMap, state, clauseIndex){

  if(!container) return;

  container.innerHTML = "";

  columns.forEach(col => {

    if(!isColumnVisible(col.key)) return;

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

    if(col.key === "conjug" && state && state[col.key] && isLinkingConj(state[col.key])){
      extra.textContent = "⭐ cere propoziția următoare";
    }

    colDiv.appendChild(extra);

    container.appendChild(colDiv);

  });

}   
  function getColumnDisplayValue(state, key){

  if(key === "subject") return state.subject || "";
  if(key === "time") return state.time || "";
  if(key === "place") return state.place || "";
  if(key === "mod") return state.mod || "";
  if(key === "object") return state.object || "";
  if(key === "subjectAdj") return state.subjectAdj || "";
  if(key === "objectAdj") return state.objectAdj || "";
  if(key === "verb") return state.verb || "";
  if(key === "conjug") return state.conjug || "";

  return "";
}
    function createClauseTable(clauseIndex){
  const wrap = document.createElement("div");
  wrap.className = "table-block clause-extra";
  wrap.dataset.clauseIndex = clauseIndex;

  const title = document.createElement("div");
  title.className = "table-title";
  title.innerHTML = `<span>Propoziția ${clauseIndex + 1}</span>`;

  const table = document.createElement("div");
  table.className = "table-horizontal";

  wrap.appendChild(title);

  wrap.appendChild(table);

  return { wrap, table };
}  
    /* =========================
   13) PREVIEW: KO + RO pentru N propoziții
   ========================= */
    function ensureLinkedSentences(){

  if(!Array.isArray(sentences)){
    sentences = [makeEmptySentence()];
  }

  if(!Array.isArray(actives)){
    actives = [makeAllActive()];
  }

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
    function updateNaturalHint(text){

  const hint = document.getElementById("naturalHint");
  if(!hint) return;

  if(!text){
    hint.textContent = "";
    return;
  }

  if(text.includes("고")){
    hint.textContent = "⭐ propoziție compusă";
  }else{
    hint.textContent = "";
  }

}
   function updatePreviewCardState(){

  const card = document.querySelector(".preview-card");
  if(!card) return;

  const text = document.getElementById("previewKo")?.textContent || "";

  if(text && !text.includes("alege")){
    card.classList.add("has-content");
  }else{
    card.classList.remove("has-content");
  }

} 
    function updatePreview(){

  if(!DOM.previewKo) return;

  normalizeSubjects?.();

  let ko = "";

  try{
    ko =
      generateGrammarTreeSentence() ||
      buildComplexSentence();
  }catch(e){
    ko = buildComplexSentence();
  }

  DOM.previewKo.textContent =
    ko || "(alege cuvinte din tabel)";

  if(DOM.previewRo && showRo){
    DOM.previewRo.textContent =
      buildFullRomanian();
  }

  if(DOM.roInput){
    DOM.roInput.value =
      buildFullRomanian();
  }

  updateNaturalHint?.(ko);
  updatePreviewCardState?.();
}
    /* =========================
   14) MODEL ROW (prev/next): ca înainte (tabel model)
   ========================= */
function loadModelRow(i){

  sentences.forEach((s, idx)=>{

    columns.forEach(col => {

      if(!col.data.length) return;

      const value = col.data[i % col.data.length] || "";

      // NU suprascriem arrays (multi-select)
      if(Array.isArray(s[col.key])) return;

      s[col.key] = value;

    });

  });

}
function updateModelNav(){
  if(DOM.pageInfoEl) DOM.pageInfoEl.textContent = `Rând model: ${indexModelRow+1} / ${maxLen}`;
  if(DOM.prevBtn) DOM.prevBtn.disabled = (indexModelRow === 0);
  if(DOM.nextBtn) DOM.nextBtn.disabled = (indexModelRow === maxLen-1);
}

/* =========================
   15) CHIPS (togglesP1/togglesP2) – compat cu HTML tău
   - IMPORTANT: nu dublăm toggles în col+chip; ambele rămân funcționale
   ========================= */
function createToggleChips(){
  if(!DOM.togglesP1 || !DOM.togglesP2) return;

  DOM.togglesP1.innerHTML = "";
  DOM.togglesP2.innerHTML = "";

  const createFor = (wrapper, clauseIndex) => {
    columns.forEach(col=>{
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

    wrapper.addEventListener("change", (e)=>{
      const cb = e.target;
      if(!cb || cb.tagName !== "INPUT") return;
      const key = cb.dataset.key;
      const idx = Number(cb.dataset.clauseIndex);
      if(!actives[idx]) return;
      actives[idx][key] = cb.checked;
      cb.parentElement.classList.toggle("chip-off", !cb.checked);
      renderAll();
    });

    // set initial class
    $$("input[type='checkbox']", wrapper).forEach(cb=>{
      cb.parentElement.classList.toggle("chip-off", !cb.checked);
    });
  };

  createFor(DOM.togglesP1, 0);
  createFor(DOM.togglesP2, 1);
}

/* =========================
   16) PANEL (long press) – complet, safe
   ========================= */
let panelClauseIndex = 0;
let panelKey = "subject";
function renderPanelList(col){
  if(!DOM.panelList) return;

  DOM.panelList.innerHTML = "";

  const key = col.key;
  const map = translations[key] || {};
  const filter = (DOM.panelSearchInput?.value || "").trim().toLowerCase();

  const words = col.data.filter(w=>{
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

  words.forEach(word=>{
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

    if(key==="conjug" && isLinkingConj(word)){
      const star = document.createElement("div");
      star.className = "panel-item-tag";
      star.textContent = "⭐ P2";
      extra.appendChild(star);
    }

    item.appendChild(extra);

    /* =============================
       MULTI SUPPORT
    ==============================*/

    // SUBJECT MULTIPLE (Ana + Vasile)
  if(key === "subject"){

  const addBtn = document.createElement("button");
  addBtn.textContent = "➕";
  addBtn.className = "panel-add-btn";

  addBtn.addEventListener("click",(e)=>{
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

    // SUBJECT ADJECTIVES MULTIPLE
    if(key === "subjectAdj"){
      const addBtn = document.createElement("button");
      addBtn.textContent = "➕";
      addBtn.className = "panel-add-btn";

      addBtn.addEventListener("click", (e)=>{
        e.stopPropagation();

        if(!sentences[panelClauseIndex]){
          sentences[panelClauseIndex] = makeEmptySentence();
          actives[panelClauseIndex] = makeAllActive();
        }

        let current = sentences[panelClauseIndex].subjectAdjs;

        if(!current){
          sentences[panelClauseIndex].subjectAdjs = [word];
        } 
        else if(!current.includes(word)){
          current.push(word);
        }

        hide(DOM.overlay);
        renderAll();
      });

      item.appendChild(addBtn);
    }

    // OBJECT ADJECTIVES MULTIPLE
    if(key === "objectAdj"){
      const addBtn = document.createElement("button");
      addBtn.textContent = "➕";
      addBtn.className = "panel-add-btn";

      addBtn.addEventListener("click", (e)=>{
        e.stopPropagation();

        if(!sentences[panelClauseIndex]){
          sentences[panelClauseIndex] = makeEmptySentence();
          actives[panelClauseIndex] = makeAllActive();
        }

        let current = sentences[panelClauseIndex].objectAdjs;

        if(!current){
          sentences[panelClauseIndex].objectAdjs = [word];
        } 
        else if(!current.includes(word)){
          current.push(word);
        }

        hide(DOM.overlay);
        renderAll();
      });

      item.appendChild(addBtn);
    }
  
    /* =============================
       NORMAL CLICK (single select)
    ==============================*/

    item.addEventListener("click", ()=>{
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
  const col = columns.find(c=>c.key===key);
  if(!col) return;

  if(DOM.panelTitle) DOM.panelTitle.textContent = `Propoziția ${clauseIndex+1} – ${col.title}`;
  if(DOM.panelSub) DOM.panelSub.textContent = col.hint || "";

  if(DOM.panelSearchInput) DOM.panelSearchInput.value = "";
  if(DOM.newWordInput) DOM.newWordInput.value = "";
  if(DOM.newWordTransInput) DOM.newWordTransInput.value = "";

  renderPanelList(col);
  show(DOM.overlay);

  DOM.panelSearchInput && DOM.panelSearchInput.focus();
}

/* =========================
   17) CLICK / LONG-PRESS pe coloană
   ========================= */
function cycleColumnValue(clauseIndex, key){
  const col = columns.find(c=>c.key===key);
  if(!col) return;
  const arr = col.data;
  const state = sentences[clauseIndex];

  if(!state) return;

  const cur = state[key];
  let idx = arr.indexOf(cur);
  if(idx === -1) idx = 0;
  const nextIdx = (idx + 1) % arr.length;
  state[key] = arr[nextIdx] || "";

  // dacă schimb conj în linking -> asigur propoziție următoare
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

  tableEl.addEventListener("pointerdown", (e)=>{
    const colDiv = e.target.closest(".col");
    if(!colDiv) return;

    // dacă e checkbox, nu intervenim
    if(e.target && e.target.matches("input.col-toggle")) return;

    e.preventDefault();
    pressTarget = colDiv;

    longPressTimer = setTimeout(()=>{
      if(pressTarget === colDiv){
        openPanel(clauseIndex, colDiv.dataset.key);
        pressTarget = null;
      }
    }, 450);
  });

  tableEl.addEventListener("pointerup", (e)=>{
    const colDiv = e.target.closest(".col");

    if(e.target && e.target.matches("input.col-toggle")){
      if(longPressTimer){ clearTimeout(longPressTimer); longPressTimer=null; }
      pressTarget = null;
      return;
    }

    if(longPressTimer){ clearTimeout(longPressTimer); longPressTimer=null; }
    if(pressTarget && colDiv === pressTarget){
      cycleColumnValue(clauseIndex, colDiv.dataset.key);
    }
    pressTarget = null;
  });

  tableEl.addEventListener("pointerleave", ()=>{
    if(longPressTimer){ clearTimeout(longPressTimer); longPressTimer=null; }
    pressTarget = null;
  });
}

/* =========================
   18) FAVORITES
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
  favorites.forEach(f=>{
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

/* =========================
   19) AUDIO (WebSpeech)
   ========================= */
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
   20) RO PARSER (din codul tău, minimal stabil)
   ========================= */
function stripDiacritics(s){
  return (s||"")
    .replace(/ă/g,"a").replace(/â/g,"a").replace(/î/g,"i")
    .replace(/ș/g,"s").replace(/ş/g,"s")
    .replace(/ț/g,"t").replace(/ţ/g,"t");
}
function normRo(s){
  return stripDiacritics((s||"").toLowerCase().replace(/[.,!?;]/g," "))
    .replace(/\s+/g," ").trim();
}

// reverse map RO -> KO (din translations)
function buildReverseMap(){
  const rev = { subject:{}, time:{}, place:{}, mod:{}, object:{}, counter:{}, verb:{}, conjug:{} };
  Object.entries(translations).forEach(([cat, map])=>{
    if(!rev[cat]) return;
    Object.entries(map).forEach(([ko, ro])=>{
      if(!ro) return;
      const n = normRo(ro);
      if(!rev[cat][n]) rev[cat][n] = ko;

      // suport "a ___" -> stem
      if(n.startsWith("a ")){
        const base = n.replace(/^a\s+/, "");
        if(base){
          const stem = base.replace(/[aei]$/, "");
          if(stem){
            if(!rev[cat][stem]) rev[cat][stem] = ko;
            const saKey = "sa " + stem;
            if(!rev[cat][saKey]) rev[cat][saKey] = ko;
          }
        }
      }
    });
  });
  return rev;
}
let REV = buildReverseMap();

// detect conj din română (păstrat din codul tău, dar curățat)
function detectConjFromRo(ro){
  const t = normRo(ro);

  // linking / conectori
  if(/\bdupa ce\b/.test(t)) return "-고 나서";
  if(/\binainte sa\b/.test(t)) return "-기 전에";
  if(/\bin timp ce\b/.test(t)) return "-(으)면서";
  if(/\bpentru ca\b|\bdeoarece\b|\bfiindca\b/.test(t)) return "-기에";
  if(/\bdesi\b|\bchiar daca\b/.test(t)) return "-(으)ㄴ/는데도";
  if(/\bpe masura ce\b|\bcu cat\b/.test(t)) return "-(으)ㄹ수록";

  // intenție/obligație/abilitate
  if(/\bvreau sa\b/.test(t)) return "-고 싶어요";
  if(/\btrebuie sa\b/.test(t)) return "-아/어야 돼요";
  if(/\bnu pot sa\b/.test(t)) return "-(으)ㄹ 수 없어요";
  if(/\bpot sa\b/.test(t)) return "-(으)ㄹ 수 있어요";

  // viitor
  if(/\bmaine\b|\bvoi\b|\bo sa\b/.test(t)) return "-(으)ㄹ 거예요";

  // trecut
  if(/\bieri\b|\bdeja\b|\btocmai\b|\bam\b/.test(t)) return "-았어요/었어요";

  // "și" -> -고 (doar dacă e între acțiuni; noi o tratăm în split)
  // fallback prezent
  return "-아요/어요";
}
const CONNECTORS = {
  and: ["-고"],
  cause: ["-아서", "-어서"],
  contrast: ["-지만"],
  sequence: ["-고 나서"],
  background: ["-는데"],
  choice: ["-거나"],
  simultaneous: ["-면서"],
  result: ["-니까"],
  condition: ["-면"],
  intention: ["-(으)려고"],
  attempt: ["-아/어 보다"],
  obligation: ["-아/어야 하다"]
};
function findKoByRo(type, text){

  const listMap = {
    subject: subjects,
    time: times,
    place: places,
    mod: mods,
    object: objects,
    verb: verbs
  };

  const list = listMap[type] || [];

  for(const item of list){
    const ro = (translations[type]?.[item] || "").toLowerCase();
    if(text.includes(ro)){
      return item;
    }
  }

  return "";
}
    
// forme conjugate -> infinitiv
const RO_FORM_TO_INF = {
  "plec":"a merge","pleci":"a merge","pleaca":"a merge","pleacă":"a merge","plecam":"a merge","plecati":"a merge","plecați":"a merge",
  "merg":"a merge","mergi":"a merge","merge":"a merge","mergem":"a merge","mergeti":"a merge","mergeți":"a merge",
  "vin":"a veni","vii":"a veni","vine":"a veni","venim":"a veni","veniti":"a veni","veniți":"a veni",
  "mananc":"a mânca","mănânc":"a mânca","mananci":"a mânca","mănânci":"a mânca","mananca":"a mânca","mănâncă":"a mânca",
  "beau":"a bea","bei":"a bea","bea":"a bea","bem":"a bea","beti":"a bea","beți":"a bea",
  "citesc":"a citi","citesti":"a citi","citești":"a citi","citeste":"a citi","citește":"a citi","citim":"a citi","cititi":"a citi","citiți":"a citi",
  "scriu":"a scrie","scrii":"a scrie","scrie":"a scrie","scriem":"a scrie","scrieti":"a scrie","scrieți":"a scrie"
};
   /* =========================
   21) RO -> KO (butonul "Tradu în coreeană")
   - IMPORTANT: aici doar umple builder-ul, nu e „motor separat”
   ========================= */
    function translateRoToKo(roText){

const parts = splitRomanianClauses(roText)

sentences=[]
actives=[]

parts.forEach((p,i)=>{

const st = parseRoToState(p)

if(i>0) st.subject=""

if(i < parts.length-1){
st.conjug="-고"
}else{
st.conjug=""
}

sentences.push(st)
actives.push(makeAllActive())

})

showExtraClauses = parts.length>1

renderAll()

return{
ko: buildComplexSentence(),
roFixed: buildFullRomanian()
}

}
    /* =========================
   22) UI EVENTS
   ========================= */
function setupUI(){

  /* ===== MODE SWITCH ===== */
  DOM.modeButtons.forEach(btn=>{
    on(btn, "click", ()=>{
      currentMode = btn.dataset.mode || "topik";
      DOM.modeButtons.forEach(b => 
        b.classList.toggle("active", b === btn)
      );
      renderAll();
    });
  });

  /* ===== MODEL NAV ===== */
  on(DOM.prevBtn, "click", ()=>{
    if(indexModelRow > 0){
      indexModelRow--;
      loadModelRow(indexModelRow);
      renderAll();
    }
  });

  on(DOM.nextBtn, "click", ()=>{
    if(indexModelRow < maxLen-1){
      indexModelRow++;
      loadModelRow(indexModelRow);
      renderAll();
    }
  });

  /* ===== RESET ===== */
  on(DOM.resetBtn, "click", ()=>{
    actives = actives.map(()=>makeAllActive());
    createToggleChips();
    renderAll();
  });

  /* ===== TOGGLE RO ===== */
  on(DOM.toggleRoBtn, "click", ()=>{
    showRo = !showRo;
    if(DOM.toggleRoBtn){
      DOM.toggleRoBtn.textContent = 
        showRo ? "Ascunde traducerea" : "Arată traducerea";
    }
    updatePreview();
  });

  /* ===== RANDOM ===== */
  on(DOM.randomBtn, "click", ()=>{
    const s = sentences[0];
    const a = actives[0];

    columns.forEach(col=>{
      if(!isColumnVisible(col.key)) return;
      if(a[col.key] === false) return;

      const arr = col.data.filter(x => x);
      if(!arr.length) return;

      s[col.key] = arr[Math.floor(Math.random()*arr.length)];
    });

    renderAll();
  });

  /* ===== SPEAK ===== */
  on(DOM.speakBtn, "click", ()=>{
    const ko = (DOM.previewKo?.textContent || "").trim();
    if(!ko || ko.includes("alege")) return;
    speakKorean(ko);
  });

  /* ===== FAVORITE ===== */
  on(DOM.favBtn, "click", ()=>{
    const ko = (DOM.previewKo?.textContent || "").trim();
    const ro = (DOM.previewRo?.textContent || "").trim();

    if(!ko || ko.includes("alege")) return;

    const exists = favorites.some(f => f.ko === ko);
    if(!exists) favorites.push({ko, ro});

    renderFavorites();
  });

  /* ===== PANEL CLOSE ===== */
  on(DOM.closePanelBtn, "click", ()=> hide(DOM.overlay));
  on(DOM.overlay, "click", (e)=>{
    if(e.target === DOM.overlay) hide(DOM.overlay);
  });

  /* ===== PANEL SEARCH ===== */
  on(DOM.panelSearchInput, "input", ()=>{
    const col = columns.find(c=>c.key===panelKey);
    if(col) renderPanelList(col);
  });

  /* ===== ADD WORD ===== */
  on(DOM.addWordBtn, "click", ()=>{
    const txt = (DOM.newWordInput?.value || "").trim();
    if(!txt) return;

    const roTxt = (DOM.newWordTransInput?.value || "").trim();
    const col = columns.find(c=>c.key===panelKey);
    if(!col || !col.allowCustom) return;

    if(!col.data.includes(txt)) col.data.push(txt);
    if(!translations[panelKey]) translations[panelKey] = {};
    if(roTxt) translations[panelKey][txt] = roTxt;

    saveCustomData();
    REV = buildReverseMap();

    DOM.newWordInput.value = "";
    DOM.newWordTransInput.value = "";

    renderPanelList(col);
  });

  /* ===== ENABLE P2 ===== */
  on(DOM.enableP2, "change", ()=>{
    const onOff = DOM.enableP2.checked;

    if(onOff && !sentences[1]){
      sentences[1] = makeEmptySentence();
      actives[1]   = makeAllActive();
    }

    if(DOM.tableP2){
      onOff ? show(DOM.tableP2) : hide(DOM.tableP2);
    }
    if(DOM.titleP2){
      onOff ? show(DOM.titleP2) : hide(DOM.titleP2);
    }

    renderAll();
  });

  /* ===== RO TRANSLATE ===== */
  on(DOM.roTranslateBtn, "click", ()=>{
    const txt = (DOM.roInput?.value || "").trim();
    if(!txt) return;

    translateRoToKo(txt);
    updatePreview();

    DOM.roInput.value = buildFullRomanian();
  });

  /* ===== HEADER BUTTONS ===== */
  on(DOM.refreshBtn, "click", ()=>{
    location.reload();
  });

  on(DOM.homeBtn, "click", ()=>{
    window.location.href = "index.html";
  });
}

// ✅ dacă nu ai aceste funcții definite în altă parte, pune no-op ca să nu crape:
function updateNaturalHint(){ }
function updatePreviewCardState(){ }


/* =========================
   23) RENDER ALL
   ========================= */
    function renderAll(){

  ensureLinkedSentences();

  if(!sentences[0] || !actives[0]) return;

  // P1
  if(DOM.tableP1){
    renderClauseRow(
      DOM.tableP1,
      actives[0],
      sentences[0],
      0
    );
  }

  // P2
  if(DOM.tableP2 && sentences[1]){

    if(showExtraClauses){

      show(DOM.tableP2);
      DOM.titleP2 && show(DOM.titleP2);

      renderClauseRow(
        DOM.tableP2,
        actives[1],
        sentences[1],
        1
      );

    }else{

      hide(DOM.tableP2);
      DOM.titleP2 && hide(DOM.titleP2);

    }
  }

  // EXTRA
  renderExtraClauses();

  // NAV
  updateModelNav();

  // 🔥 IMPORTANT
  updatePreview();
}
    
      
    /* =========================
   24) BOOTSTRAP (UN SINGUR)
   ========================= */

    function renderExtraClauses() {
  if (!DOM.extraClauses) return;

  DOM.extraClauses.innerHTML = "";

  // începem de la propoziția 3 (index 2)
  for (let i = 2; i < sentences.length; i++) {
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

    // render tabelul EXACT ca P1 / P2
    renderClauseRow(table, actives[i], sentences[i], i);

    // long-press + click
    attachPressHandlers(table, i);
  }
}
function buildFullRomanian(){

  const parts = [];

  let prevSubject = null;
  let prevTime    = null;
  let prevPlace   = null;

  for(let i = 0; i < sentences.length; i++){

    const s = sentences[i];
    if(!s) continue;

    const sameSubject = s.subject === prevSubject;
    const sameTime    = s.time === prevTime;
    const samePlace   = s.place === prevPlace;

    const hideSubject =
      i > 0 &&
      sameSubject &&
      sameTime &&
      samePlace;

    let ro = buildNaturalRomanian(
      {...s, hideSubject},
      actives[i]
    );

    if(!ro) continue;

    /* ✅ eliminăm punct intermediar dacă urmează linking */
    const cj = s.conjug || "";

    if(isLinkingConj(cj)){
      ro = ro.replace(/[.]$/, "");  // scoate punctul
    }

    parts.push(ro);

    prevSubject = s.subject || null;
    prevTime    = s.time || null;
    prevPlace   = s.place || null;
  }

  let full = parts.join(" ").trim();

  /* ✅ corecții finale */
  full = full.replace(/\s+/g," ");

  /* ✅ evităm dubluri de tip: "și și" */
  full = full.replace(/și\s+și/g,"și");

  return full;
}
    function buildFullKorean(){

  const parts = [];

  for(let i = 0; i < sentences.length; i++){
    const s = sentences[i];
    if(!s) continue;

    const built = buildClauseSentence(
      { ...s, hideSubject: i > 0 },
      actives[i]
    );

    if(built?.ko){
      parts.push(built.ko);
    }
  }

  return parts.join(" ").replace(/\s+/g," ").trim();
}
  async function loadVocabulary(){
  try{

    const res = await fetch("./vocab-korean.json");
    vocab = await res.json();   // ✅ FIX

    dictionaryIndex = buildDictionaryIndex(vocab); // ✅ mutat aici

    const map = {
      subject: "subjects",
      object: "objects",
      verb: "verbs",
      time: "times",
      place: "places",
      mod: "modifiers",
      conjug: "conjugations"
    };

    Object.entries(map).forEach(([colKey, jsonKey]) => {

      const col = columns.find(c => c.key === colKey);
      const list = vocab[jsonKey];

      if(!col || !Array.isArray(list)) return;

      list.forEach(entry => {

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

    console.log("VOCAB OK:", vocab); // 🔥 verificare

  }catch(err){
    console.error("Vocabulary load error:", err);
  }
}
    document.addEventListener("DOMContentLoaded", async () => {

  try {

    // 1. încărcăm vocabularul
    await loadVocabulary();

    // 2. inițializăm propoziția de bază
    sentences = [ makeEmptySentence() ];
    actives   = [ makeAllActive() ];

    // 3. rând model
    loadModelRow(indexModelRow);

    // 4. UI
    setupUI();

    // 5. toggle chips
    createToggleChips();

    // 6. handlers pentru coloane
    attachPressHandlers(DOM.tableP1,0);
    attachPressHandlers(DOM.tableP2,1);

    // 7. randare inițială
    renderAll();

  } catch(err){

    console.error("APP BOOT ERROR",err);

  }

});
