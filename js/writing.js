// ── DATE ──────────────────────────────────────────────────────
const LETTERS = [
  // consoane de bază
  {char:"ㄱ",rom:"g/k"}, {char:"ㄴ",rom:"n"},   {char:"ㄷ",rom:"d/t"},
  {char:"ㄹ",rom:"r/l"}, {char:"ㅁ",rom:"m"},   {char:"ㅂ",rom:"b/p"},
  {char:"ㅅ",rom:"s"},   {char:"ㅇ",rom:"–/ng"},{char:"ㅈ",rom:"j"},
  {char:"ㅊ",rom:"ch"},  {char:"ㅋ",rom:"k"},   {char:"ㅌ",rom:"t"},
  {char:"ㅍ",rom:"p"},   {char:"ㅎ",rom:"h"},
  // consoane tensionate
  {char:"ㄲ",rom:"kk"},  {char:"ㄸ",rom:"tt"},  {char:"ㅃ",rom:"pp"},
  {char:"ㅆ",rom:"ss"},  {char:"ㅉ",rom:"jj"},
  // vocale simple
  {char:"ㅏ",rom:"a"},   {char:"ㅓ",rom:"eo"},  {char:"ㅗ",rom:"o"},
  {char:"ㅜ",rom:"u"},   {char:"ㅡ",rom:"eu"},  {char:"ㅣ",rom:"i"},
  {char:"ㅐ",rom:"ae"},  {char:"ㅔ",rom:"e"},   {char:"ㅑ",rom:"ya"},
  {char:"ㅕ",rom:"yeo"}, {char:"ㅛ",rom:"yo"},  {char:"ㅠ",rom:"yu"},
  // vocale compuse
  {char:"ㅒ",rom:"yae"}, {char:"ㅖ",rom:"ye"},  {char:"ㅘ",rom:"wa"},
  {char:"ㅙ",rom:"wae"}, {char:"ㅚ",rom:"oe"},  {char:"ㅝ",rom:"wo"},
  {char:"ㅞ",rom:"we"},  {char:"ㅟ",rom:"wi"},  {char:"ㅢ",rom:"ui"},
];

const SYLLABLES = [
  // grupa ㅏ
  {char:"가",rom:"ga"}, {char:"나",rom:"na"}, {char:"다",rom:"da"},
  {char:"라",rom:"ra"}, {char:"마",rom:"ma"}, {char:"바",rom:"ba"},
  {char:"사",rom:"sa"}, {char:"아",rom:"a"},  {char:"자",rom:"ja"},
  {char:"차",rom:"cha"},{char:"카",rom:"ka"}, {char:"타",rom:"ta"},
  {char:"파",rom:"pa"}, {char:"하",rom:"ha"},
  // grupa ㅓ
  {char:"거",rom:"geo"},{char:"너",rom:"neo"},{char:"더",rom:"deo"},
  {char:"러",rom:"reo"},{char:"서",rom:"seo"},{char:"어",rom:"eo"},
  {char:"저",rom:"jeo"},{char:"처",rom:"cheo"},
  // grupa ㅗ
  {char:"고",rom:"go"}, {char:"도",rom:"do"}, {char:"로",rom:"ro"},
  {char:"보",rom:"bo"}, {char:"소",rom:"so"}, {char:"오",rom:"o"},
  {char:"조",rom:"jo"},
  // grupa ㅜ
  {char:"구",rom:"gu"}, {char:"두",rom:"du"}, {char:"루",rom:"ru"},
  {char:"부",rom:"bu"}, {char:"수",rom:"su"}, {char:"우",rom:"u"},
  // grupa ㅡ / ㅣ
  {char:"그",rom:"geu"},{char:"느",rom:"neu"},{char:"드",rom:"deu"},
  {char:"스",rom:"seu"},{char:"으",rom:"eu"},
  {char:"기",rom:"gi"}, {char:"니",rom:"ni"}, {char:"미",rom:"mi"},
  {char:"시",rom:"si"}, {char:"이",rom:"i"},
  // cu batchim
  {char:"한",rom:"han"},{char:"인",rom:"in"}, {char:"안",rom:"an"},
  {char:"영",rom:"yeong"},{char:"봐",rom:"bwa"},
];

const WORDS = [
  {char:"한국",  rom:"han-guk",    meta:{ro:"Coreea",         en:"Korea"}},
  {char:"안녕",  rom:"an-nyeong",  meta:{ro:"salut",           en:"hello"}},
  {char:"사람",  rom:"sa-ram",     meta:{ro:"persoană",        en:"person"}},
  {char:"물",    rom:"mul",        meta:{ro:"apă",             en:"water"}},
  {char:"밥",    rom:"bap",        meta:{ro:"orez / masă",     en:"rice / meal"}},
  {char:"학교",  rom:"hak-gyo",    meta:{ro:"școală",          en:"school"}},
  {char:"선생",  rom:"seon-saeng", meta:{ro:"profesor",        en:"teacher"}},
  {char:"친구",  rom:"chin-gu",    meta:{ro:"prieten",         en:"friend"}},
  {char:"가족",  rom:"ga-jok",     meta:{ro:"familie",         en:"family"}},
  {char:"집",    rom:"jip",        meta:{ro:"casă",            en:"house"}},
  {char:"책",    rom:"chaek",      meta:{ro:"carte",           en:"book"}},
  {char:"나라",  rom:"na-ra",      meta:{ro:"țară",            en:"country"}},
  {char:"음악",  rom:"eu-mak",     meta:{ro:"muzică",          en:"music"}},
  {char:"시간",  rom:"si-gan",     meta:{ro:"timp",            en:"time"}},
  {char:"사랑",  rom:"sa-rang",    meta:{ro:"iubire",          en:"love"}},
  {char:"이름",  rom:"i-reum",     meta:{ro:"nume",            en:"name"}},
  {char:"눈",    rom:"nun",        meta:{ro:"ochi / zăpadă",   en:"eye / snow"}},
  {char:"마음",  rom:"ma-eum",     meta:{ro:"inimă / minte",   en:"heart / mind"}},
  {char:"고양이",rom:"go-yang-i",  meta:{ro:"pisică",          en:"cat"}},
  {char:"강아지",rom:"gang-a-ji",  meta:{ro:"cățel",           en:"puppy"}},
  {char:"사과",  rom:"sa-gwa",     meta:{ro:"măr",             en:"apple"}},
  {char:"커피",  rom:"keo-pi",     meta:{ro:"cafea",           en:"coffee"}},
  {char:"학생",  rom:"hak-saeng",  meta:{ro:"student",         en:"student"}},
  {char:"병원",  rom:"byeong-won", meta:{ro:"spital",          en:"hospital"}},
  {char:"식당",  rom:"sik-dang",   meta:{ro:"restaurant",      en:"restaurant"}},
  {char:"서울",  rom:"seo-ul",     meta:{ro:"Seul",            en:"Seoul"}},
  {char:"바다",  rom:"ba-da",      meta:{ro:"mare",            en:"sea"}},
  {char:"산",    rom:"san",        meta:{ro:"munte",           en:"mountain"}},
  {char:"꽃",    rom:"kkot",       meta:{ro:"floare",          en:"flower"}},
  {char:"바람",  rom:"ba-ram",     meta:{ro:"vânt",            en:"wind"}},
  {char:"하늘",  rom:"ha-neul",    meta:{ro:"cer",             en:"sky"}},
  {char:"문",    rom:"mun",        meta:{ro:"ușă",             en:"door"}},
  {char:"창문",  rom:"chang-mun",  meta:{ro:"fereastră",       en:"window"}},
  {char:"음식",  rom:"eum-sik",    meta:{ro:"mâncare",         en:"food"}},
  {char:"과일",  rom:"gwa-il",     meta:{ro:"fruct",           en:"fruit"}},
  {char:"빵",    rom:"ppang",      meta:{ro:"pâine",           en:"bread"}},
  {char:"우유",  rom:"u-yu",       meta:{ro:"lapte",           en:"milk"}},
  {char:"버스",  rom:"beo-seu",    meta:{ro:"autobuz",         en:"bus"}},
  {char:"지하철",rom:"ji-ha-cheol",meta:{ro:"metrou",          en:"subway"}},
  {char:"기차",  rom:"gi-cha",     meta:{ro:"tren",            en:"train"}},
  {char:"핸드폰",rom:"haen-deu-pon",meta:{ro:"telefon",        en:"phone"}},
  {char:"옷",    rom:"ot",         meta:{ro:"haine",           en:"clothes"}},
  {char:"신발",  rom:"sin-bal",    meta:{ro:"pantofi",         en:"shoes"}},
  {char:"가방",  rom:"ga-bang",    meta:{ro:"geantă",          en:"bag"}},
  {char:"돈",    rom:"don",        meta:{ro:"bani",            en:"money"}},
  {char:"날씨",  rom:"nal-ssi",    meta:{ro:"vreme",           en:"weather"}},
  {char:"오늘",  rom:"o-neul",     meta:{ro:"azi",             en:"today"}},
  {char:"내일",  rom:"nae-il",     meta:{ro:"mâine",           en:"tomorrow"}},
  {char:"어제",  rom:"eo-je",      meta:{ro:"ieri",            en:"yesterday"}},
  {char:"사랑해",rom:"sa-rang-hae",meta:{ro:"te iubesc",       en:"I love you"}},
];

const SENTENCES = [
  {char:"감사합니다", rom:"gam-sa-ham-ni-da",   meta:{ro:"Mulțumesc",          en:"Thank you"}},
  {char:"안녕하세요", rom:"an-nyeong-ha-se-yo", meta:{ro:"Bună ziua",           en:"Hello (formal)"}},
  {char:"괜찮아요",   rom:"gwaen-chan-a-yo",     meta:{ro:"E bine",             en:"It's okay"}},
  {char:"맛있어요",   rom:"mas-iss-eo-yo",       meta:{ro:"E delicios",         en:"It's delicious"}},
  {char:"미안해요",   rom:"mi-an-hae-yo",        meta:{ro:"Îmi pare rău",       en:"I'm sorry"}},
  {char:"좋아해요",   rom:"jo-a-hae-yo",         meta:{ro:"Îmi place",          en:"I like it"}},
  {char:"알겠어요",   rom:"al-gess-eo-yo",       meta:{ro:"Am înțeles",         en:"I understand"}},
  {char:"배고파요",   rom:"bae-go-pa-yo",        meta:{ro:"Mi-e foame",         en:"I'm hungry"}},
  {char:"피곤해요",   rom:"pi-gon-hae-yo",       meta:{ro:"Sunt obosit(ă)",     en:"I'm tired"}},
  {char:"어디예요",   rom:"eo-di-ye-yo",         meta:{ro:"Unde este?",         en:"Where is it?"}},
  {char:"얼마예요",   rom:"eol-ma-ye-yo",        meta:{ro:"Cât costă?",         en:"How much?"}},
  {char:"맞아요",     rom:"maj-a-yo",            meta:{ro:"Corect",             en:"That's right"}},
  {char:"아니에요",   rom:"a-ni-e-yo",           meta:{ro:"Nu este",            en:"It isn't"}},
  {char:"몰라요",     rom:"mol-la-yo",           meta:{ro:"Nu știu",            en:"I don't know"}},
  {char:"싫어요",     rom:"sil-eo-yo",           meta:{ro:"Nu îmi place",       en:"I don't like it"}},
  {char:"행복해요",   rom:"haeng-bok-hae-yo",    meta:{ro:"Sunt fericit(ă)",    en:"I'm happy"}},
  {char:"어려워요",   rom:"eo-ryeo-wo-yo",       meta:{ro:"E dificil",          en:"It's difficult"}},
  {char:"쉬워요",     rom:"swi-wo-yo",           meta:{ro:"E ușor",             en:"It's easy"}},
  {char:"재미있어요", rom:"jae-mi-iss-eo-yo",    meta:{ro:"E interesant",       en:"It's interesting"}},
  {char:"보고싶어요", rom:"bo-go-sip-eo-yo",     meta:{ro:"Îmi ești dor/dori",  en:"I miss you"}},
  {char:"사랑해요",   rom:"sa-rang-hae-yo",      meta:{ro:"Te iubesc",          en:"I love you"}},
  {char:"잘자요",     rom:"jal-ja-yo",           meta:{ro:"Noapte bună",        en:"Good night"}},
  {char:"잘있어요",   rom:"jal-iss-eo-yo",       meta:{ro:"Rămâi bine",         en:"Take care"}},
  {char:"반가워요",   rom:"ban-ga-wo-yo",        meta:{ro:"Îmi pare bine",      en:"Nice to meet you"}},
  {char:"모르겠어요", rom:"mo-reu-gess-eo-yo",   meta:{ro:"Nu știu sigur",      en:"I'm not sure"}},
];

// ── STATE ─────────────────────────────────────────────────────
let mode    = "letters";
let pool    = LETTERS;
let idx     = 0;
let checked = false;
let lang    = RKLang.get();

// ── TRADUCERI ─────────────────────────────────────────────────
const T = {
  ro:{
    title:"Practică Scrisul", sub:"Litere · Silabe · Cuvinte · Propoziții · Compunere",
    tabL:"Litere", tabS:"Silabe", tabW:"Cuvinte", tabP:"Propoziții",
    trace:"Afișează litera fantomă",
    check:"Verifică",
    yourLbl:"Ce ai scris", refLbl:"Referință",
    empty:"Desenează mai întâi!",
    excellent:"Excelent! ✨", good:"Bine! 👍",
    tryAgain:"Mai încearcă 🔄", wrong:"Greșit ❌",
    wordHint:"Scrie cuvântul în spațiul alb de mai sus",
    sentHint:"Scrie propoziția în spațiul alb de mai sus",
    selfCheck:"Compară cu referința de mai jos",
    // compunere
    compSub:"Scrie în coreeană și primești corecturi",
    compBadge:"Subiect", compChars:"caractere", compLoading:"Analizez…",
    compLblCorrected:"TEXT CORECTAT", compLblErrors:"GREȘELI",
    compBtnClear:"Șterge", compBtnCorrect:"Corectează", compBtnNew:"Subiect nou",
    compApiTitle:"Configurare cheie API",
    compApiDesc:"Pentru corecturi AI introdu cheia ta Anthropic API.<br>Cheia rămâne salvată local pe dispozitivul tău.",
    compApiCancel:"Anulează", compApiSave:"Salvează",
    compNoErrors:"🎉 Nicio greșeală!", compWriteFirst:"Scrie ceva mai întâi!",
    compInvalidKey:"Cheie invalidă — trebuie să înceapă cu sk-ant-…",
    compBadKey:"Cheie API invalidă. Te rog introdu din nou.",
    compError:"Eroare: ",
  },
  en:{
    title:"Practice Writing", sub:"Letters · Syllables · Words · Sentences · Composition",
    tabL:"Letters", tabS:"Syllables", tabW:"Words", tabP:"Sentences",
    trace:"Show ghost letter",
    check:"Check",
    yourLbl:"Your writing", refLbl:"Reference",
    empty:"Draw something first!",
    excellent:"Excellent! ✨", good:"Good! 👍",
    tryAgain:"Try again 🔄", wrong:"Wrong ❌",
    wordHint:"Write the word in the white space above",
    sentHint:"Write the sentence in the white space above",
    selfCheck:"Compare with the reference below",
    // composition
    compSub:"Write in Korean and get corrections",
    compBadge:"Topic", compChars:"characters", compLoading:"Analysing…",
    compLblCorrected:"CORRECTED TEXT", compLblErrors:"ERRORS",
    compBtnClear:"Clear", compBtnCorrect:"Correct", compBtnNew:"New topic",
    compApiTitle:"API Key Setup",
    compApiDesc:"For AI corrections, enter your Anthropic API key.<br>The key stays saved locally on your device.",
    compApiCancel:"Cancel", compApiSave:"Save",
    compNoErrors:"🎉 No errors!", compWriteFirst:"Write something first!",
    compInvalidKey:"Invalid key — must start with sk-ant-…",
    compBadKey:"Invalid API key. Please re-enter.",
    compError:"Error: ",
  },
};

function applyLang(newLang) {
  if (newLang) lang = newLang;
  const t = T[lang];
  document.getElementById("pageTitle").textContent       = t.title;
  document.getElementById("pageSub").textContent         = t.sub;
  document.getElementById("tab-letters").textContent     = t.tabL;
  document.getElementById("tab-syllables").textContent   = t.tabS;
  document.getElementById("tab-words").textContent       = t.tabW;
  document.getElementById("tab-sentences").textContent   = t.tabP;
  document.getElementById("traceLbl").textContent        = t.trace;
  document.getElementById("checkLbl").textContent        = t.check;
  document.getElementById("fbYourLbl").textContent       = t.yourLbl;
  document.getElementById("fbRefLbl").textContent        = t.refLbl;
  // compunere
  document.getElementById("compSub").textContent         = t.compSub;
  document.getElementById("compPromptBadge").textContent = t.compBadge;
  document.getElementById("compCharLbl").textContent     = t.compChars;
  document.getElementById("compLoadingMsg").textContent  = t.compLoading;
  document.getElementById("compLblCorrected").textContent= t.compLblCorrected;
  document.getElementById("compLblErrors").textContent   = t.compLblErrors;
  document.getElementById("btnCompClear").textContent    = t.compBtnClear;
  document.getElementById("btnCompLbl").textContent      = t.compBtnCorrect;
  document.getElementById("btnCompNew").textContent      = t.compBtnNew;
  document.getElementById("compApiTitle").textContent    = t.compApiTitle;
  document.getElementById("compApiDesc").innerHTML       = t.compApiDesc;
  document.getElementById("btnCompApiCancel").textContent= t.compApiCancel;
  document.getElementById("btnCompApiSave").textContent  = t.compApiSave;
  compUpdateLimitHint();
  if (compCurrentPrompt) compRenderPrompt();
  if (mode !== "compunere") updateTarget();
}

RKLang.init(applyLang);

// ── MODE TABS ─────────────────────────────────────────────────
document.querySelectorAll(".mode-tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mode-tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    mode = btn.dataset.mode;
    if (mode === "compunere") {
      showComposeMode();
    } else {
      showDrawMode();
      pool = mode==="letters" ? LETTERS : mode==="syllables" ? SYLLABLES : mode==="words" ? WORDS : SENTENCES;
      idx  = 0;
      clearBoard();
      hideFb();
      updateTarget();
    }
  });
});

function showComposeMode() {
  document.querySelector(".rfi-knowledge").style.display    = "none";
  document.querySelector(".rfi-manifestation").style.display= "none";
  document.getElementById("fbCard").style.display           = "none";
  document.getElementById("progLbl").style.visibility       = "hidden";
  document.getElementById("compSection").style.display      = "";
  if (!compCurrentPrompt) newCompPrompt();
}

function showDrawMode() {
  document.querySelector(".rfi-knowledge").style.display    = "";
  document.querySelector(".rfi-manifestation").style.display= "";
  document.getElementById("progLbl").style.visibility       = "";
  document.getElementById("compSection").style.display      = "none";
}

// ── TARGET ────────────────────────────────────────────────────
function updateTarget() {
  const item  = pool[idx];
  const chars = [...item.char]; // split corect unicode

  // Redimensionează canvas pentru modul propoziții (lat) vs. rest (pătrat)
  const boardWrap = document.querySelector(".board-wrap");
  if (mode === "sentences") {
    boardWrap.classList.add("wide-mode");
    cvs.width  = Math.round(window.innerWidth * 0.8);
    cvs.height = 272;
  } else {
    boardWrap.classList.remove("wide-mode");
    cvs.width  = 320;
    cvs.height = 320;
  }

  document.getElementById("targetRom").textContent  = item.rom;
  document.getElementById("targetMeta").textContent = item.meta ? item.meta[lang] : "";
  document.getElementById("progFill").style.width   = `${((idx+1)/pool.length)*100}%`;
  document.getElementById("progLbl").textContent    = `${idx+1} / ${pool.length}`;

  const tc      = document.getElementById("targetChar");
  const sylBoxes= document.getElementById("sylBoxes");
  const trace   = document.getElementById("boardTrace");
  const dividers= document.getElementById("boardDividers");

  dividers.innerHTML = "";

  if ((mode === "words" || mode === "sentences") && chars.length > 1) {
    // Target: silabe individuale stânga→dreapta
    tc.style.display    = "none";
    sylBoxes.style.display = "flex";
    const fs = mode === "sentences"
      ? (chars.length > 4 ? 34 : chars.length > 3 ? 38 : 44)
      : (chars.length > 2 ? 44 : 56);
    sylBoxes.innerHTML  = chars.map(c =>
      `<div class="syl-box" style="font-size:${fs}px" onclick="speakKo('${c}')">${c}</div>`
    ).join('');

    // Trace: câte un span per silabă, font proporțional cu înălțimea tablei
    const traceFontSize = mode === "sentences"
      ? 145
      : Math.min(170, Math.floor(195 / chars.length));
    trace.classList.add("multi");
    trace.style.fontSize = `${traceFontSize}px`;
    trace.innerHTML = chars.map(c => `<span class="trace-span">${c}</span>`).join('');

    // Linii de separare pe canvas (stânga→dreapta)
    for (let i = 1; i < chars.length; i++) {
      const line = document.createElement("div");
      line.className  = "div-line";
      line.style.left = `${(i / chars.length) * 100}%`;
      dividers.appendChild(line);
    }
  } else {
    tc.style.display       = "";
    tc.textContent         = item.char;
    sylBoxes.style.display = "none";
    trace.classList.remove("multi");
    trace.style.fontSize   = "";
    trace.textContent      = item.char;
  }

  const showHint = mode === "words" || mode === "sentences";
  document.getElementById("wordHint").style.display = showHint ? "" : "none";
  document.getElementById("wordHint").textContent   =
    mode === "sentences" ? T[lang].sentHint :
    mode === "words"     ? T[lang].wordHint : "";

  // Animație: referința se „scrie" de la stânga la dreapta
  trace.classList.remove("animate-write");
  void trace.offsetWidth;
  trace.classList.add("animate-write");

  checked = false;
  document.getElementById("btnCheck").disabled = false;
  document.getElementById("btnNext").disabled  = true;
}

function speakKo(char) {
  if (!("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(char);
  u.lang = "ko-KR"; speechSynthesis.cancel(); speechSynthesis.speak(u);
}

function speakTarget() {
  if (!("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(pool[idx].char);
  u.lang = "ko-KR";
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

// ── CANVAS ────────────────────────────────────────────────────
const cvs = document.getElementById("wCanvas");
const ctx  = cvs.getContext("2d");
let drawing=false, lx=0, ly=0, pmx=0, pmy=0, lastMs=0;

function drawColor() {
  return document.body.classList.contains("dark-mode") ? "#e879f9" : "#1a0533";
}

function cPos(e) {
  const r=cvs.getBoundingClientRect();
  return [(e.clientX-r.left)*cvs.width/r.width,
          (e.clientY-r.top)*cvs.height/r.height];
}

cvs.addEventListener("pointerdown", e => {
  cvs.setPointerCapture(e.pointerId);
  drawing=true;
  [lx,ly]=cPos(e); pmx=lx; pmy=ly; lastMs=Date.now();
  ctx.beginPath(); ctx.arc(lx,ly,5.5,0,Math.PI*2);
  ctx.fillStyle=drawColor(); ctx.fill();
});
cvs.addEventListener("pointermove", e => {
  if (!drawing) return;
  const [x,y]=cPos(e);
  const now=Date.now(), dt=Math.max(now-lastMs,1);
  const speed=Math.hypot(x-lx,y-ly)/dt;
  // Pensulă: gros când lent, subțire când rapid
  const w=Math.max(2.5, Math.min(13, 13-speed*7));
  const mx=(lx+x)/2, my=(ly+y)/2;
  ctx.strokeStyle=drawColor(); ctx.lineWidth=w;
  ctx.lineCap="round"; ctx.lineJoin="round";
  ctx.beginPath(); ctx.moveTo(pmx,pmy);
  ctx.quadraticCurveTo(lx,ly,mx,my); ctx.stroke();
  pmx=mx; pmy=my; [lx,ly]=[x,y]; lastMs=now;
});
cvs.addEventListener("pointerup",     () => { drawing=false; });
cvs.addEventListener("pointercancel", () => { drawing=false; });

document.getElementById("traceChk").addEventListener("change", e => {
  document.getElementById("boardTrace").classList.toggle("off", !e.target.checked);
});

function clearBoard() {
  ctx.clearRect(0,0,cvs.width,cvs.height);
}

// ── RECUNOAȘTERE PIXEL ────────────────────────────────────────
function normalise(src, sz=160) {
  const d=src.getContext("2d").getImageData(0,0,src.width,src.height).data;
  let x0=src.width,x1=0,y0=src.height,y1=0;
  for (let y=0;y<src.height;y++) {
    for (let x=0;x<src.width;x++) {
      if (d[(y*src.width+x)*4+3]>12) {
        x0=Math.min(x0,x); x1=Math.max(x1,x);
        y0=Math.min(y0,y); y1=Math.max(y1,y);
      }
    }
  }
  if (x0>x1||y0>y1) return null;
  const w=x1-x0+1, h=y1-y0+1;
  const scale=sz*0.82/Math.max(w,h);
  const ox=(sz-w*scale)/2, oy=(sz-h*scale)/2;
  const out=document.createElement("canvas");
  out.width=out.height=sz;
  const c=out.getContext("2d");
  c.save(); c.translate(ox,oy); c.scale(scale,scale);
  c.drawImage(src,-x0,-y0); c.restore();
  return out;
}

function makeWideRef(char, chars) {
  const H=200, W=Math.max(H, chars.length*H);
  const c=document.createElement("canvas");
  c.width=W; c.height=H;
  const cx=c.getContext("2d");
  const fs=Math.round(H*0.75);
  cx.fillStyle="#000";
  cx.font=`900 ${fs}px system-ui,sans-serif`;
  cx.textAlign="center"; cx.textBaseline="middle";
  chars.forEach((ch,i)=>{
    cx.fillText(ch, (i+0.5)*(W/chars.length), H/2+H*0.04);
  });
  return c;
}

function makeRef(char, sz=160) {
  const c=document.createElement("canvas");
  c.width=c.height=sz;
  const cx=c.getContext("2d");
  // Micșorează fontul până încape tot textul în lățimea canvas-ului
  let fs=Math.round(sz*0.78);
  cx.font=`900 ${fs}px system-ui,sans-serif`;
  while(cx.measureText(char).width > sz*0.92 && fs > 12) {
    fs -= 2;
    cx.font=`900 ${fs}px system-ui,sans-serif`;
  }
  cx.fillStyle="#000";
  cx.textAlign="center"; cx.textBaseline="middle";
  cx.fillText(char,sz/2,sz/2+sz*0.04);
  return c;
}

function compare(userCvs, targetChar) {
  const SZ=160;
  const nu=normalise(userCvs,SZ);
  if (!nu) return {score:0,empty:true};
  const ref=makeRef(targetChar,SZ);
  const nr=normalise(ref,SZ);
  if (!nr) return {score:0};
  const rp=nr.getContext("2d").getImageData(0,0,SZ,SZ).data;
  const up=nu.getContext("2d").getImageData(0,0,SZ,SZ).data;
  let rN=0,uN=0,both=0;
  for (let i=3;i<rp.length;i+=4) {
    const r=rp[i]>32, u=up[i]>32;
    if(r)rN++; if(u)uN++; if(r&&u)both++;
  }
  if (!rN||!uN) return {score:0};
  const prec=both/uN, rec=both/rN;
  const f1=prec+rec>0 ? 2*prec*rec/(prec+rec) : 0;
  return {score:f1, nu, nr};
}

function paintFbCanvas(id, src, color) {
  const dst=document.getElementById(id);
  const dc=dst.getContext("2d");
  if (!src) { dc.clearRect(0,0,dst.width,dst.height); return; }
  // Adaptează canvas-ul destinație la forma sursei
  const ratio=src.width/src.height;
  dst.height=160;
  dst.width=Math.round(160*Math.max(ratio,1));
  dc.clearRect(0,0,dst.width,dst.height);
  // Letterbox: centrează sursa proporțional
  let dw,dh,dx,dy;
  const dr=dst.width/dst.height;
  if(ratio>dr){dw=dst.width;dh=Math.round(dw/ratio);dx=0;dy=Math.round((dst.height-dh)/2);}
  else{dh=dst.height;dw=Math.round(dh*ratio);dy=0;dx=Math.round((dst.width-dw)/2);}
  const tmp=document.createElement("canvas");
  tmp.width=dst.width; tmp.height=dst.height;
  const tc=tmp.getContext("2d");
  tc.drawImage(src,dx,dy,dw,dh);
  tc.globalCompositeOperation="source-in";
  tc.fillStyle=color; tc.fillRect(0,0,dst.width,dst.height);
  dc.drawImage(tmp,0,0);
}

// ── SECTION EXTRACTION (pentru cuvinte) ───────────────────────
function extractSection(canvas, i, n) {
  const sw = Math.floor(canvas.width / n);
  const sec = document.createElement("canvas");
  sec.width  = sw;
  sec.height = canvas.height;
  sec.getContext("2d").drawImage(canvas, -(i * sw), 0);
  return sec;
}

// ── CHECK ─────────────────────────────────────────────────────
function doCheck() {
  if (checked) return;
  const t     = T[lang];
  const item  = pool[idx];
  const chars = [...item.char];

  let result;
  if ((mode === "words" || mode === "sentences") && chars.length > 1) {
    // Compară fiecare secțiune a canvas-ului cu silaba corespunzătoare
    const sectionResults = chars.map((c, i) => compare(extractSection(cvs, i, chars.length), c));
    if (sectionResults.every(r => r.empty)) { alert(t.empty); return; }
    const avgScore = sectionResults.reduce((s, r) => s + r.score, 0) / chars.length;
    // Referința se face pe cuvântul întreg (pentru comparația vizuală)
    result = { score: avgScore, ...compare(cvs, item.char) };
    if (result.empty) result.score = avgScore; // păstrează scorul corect
  } else {
    result = compare(cvs, item.char);
    if (result.empty) { alert(t.empty); return; }
  }

  const {score, nu, nr} = result;

  checked=true;
  document.getElementById("btnCheck").disabled=true;
  document.getElementById("btnNext").disabled=false;

  const pct=Math.round(score*100);
  document.getElementById("fbScore").textContent=`${pct}%`;
  document.getElementById("fbScore").style.color=
    pct>=60?"#16a34a":pct>=35?"#d97706":"#dc2626";

  const fill=document.getElementById("fbFill");
  fill.style.width=`${pct}%`;
  fill.style.background=
    pct>=60?"linear-gradient(90deg,#22c55e,#16a34a)":
    pct>=35?"linear-gradient(90deg,#f59e0b,#d97706)":
            "linear-gradient(90deg,#ef4444,#dc2626)";

  document.getElementById("fbMsg").textContent=
    pct>=65?t.excellent:pct>=42?t.good:pct>=22?t.tryAgain:t.wrong;

  // Pt cuvinte/propoziții: arată canvas-ul original lat, nu versiunea normalizată
  const multiChar = (mode==="words"||mode==="sentences") && chars.length>1;
  paintFbCanvas("fbUserCv", multiChar ? cvs : nu, drawColor());
  paintFbCanvas("fbRefCv",  multiChar ? makeWideRef(item.char,chars) : nr, "#7c3aed");

  const fb=document.getElementById("fbCard");
  fb.style.display="";
  fb.scrollIntoView({behavior:"smooth",block:"nearest"});
}

function hideFb() {
  document.getElementById("fbCard").style.display="none";
}

// ── NEXT ──────────────────────────────────────────────────────
function nextItem() {
  idx=(idx+1)%pool.length;
  clearBoard();
  hideFb();
  updateTarget();
}

// ── INIT ──────────────────────────────────────────────────────
applyLang();

// If coming from hangul.html with ?char=, jump to that letter
(function () {
  const param = new URLSearchParams(window.location.search).get('char');
  if (!param) return;
  const found = LETTERS.findIndex(l => l.char === param);
  if (found === -1) return;
  idx = found;
  pool = LETTERS;
  mode = 'letters';
  document.querySelectorAll('.mode-tab').forEach(b => b.classList.remove('active'));
  const lettersTab = document.getElementById('tab-letters');
  if (lettersTab) lettersTab.classList.add('active');
  updateTarget();
})();

/* ══════════════════════════════════════════════════════════════
   COMPUNERE — scriere liberă cu corecturi AI
══════════════════════════════════════════════════════════════ */

const COMP_PROMPTS = {
  1:[
    {ro:"Prezintă-te: cum te cheamă, câți ani ai, de unde ești.", en:"Introduce yourself: name, age, where you are from.", ko:"자기소개를 해 보세요."},
    {ro:"Descrie familia ta: câți membri are, ce face fiecare.", en:"Describe your family: how many members, what each does.", ko:"가족에 대해 써 보세요."},
    {ro:"Ce faci de obicei dimineața? Descrie rutina ta.", en:"What do you usually do in the morning? Describe your routine.", ko:"보통 아침에 무엇을 해요?"},
    {ro:"Descrie casa sau camera ta.", en:"Describe your house or room.", ko:"집이나 방을 설명해 보세요."},
    {ro:"Ce mâncare îți place cel mai mult? De ce?", en:"What food do you like the most? Why?", ko:"가장 좋아하는 음식은 무엇이에요?"},
  ],
  2:[
    {ro:"Scrie despre weekend-ul tău preferat.", en:"Write about your favorite weekend.", ko:"좋아하는 주말에 대해 써 보세요."},
    {ro:"Descrie prietenul tău cel mai bun.", en:"Describe your best friend.", ko:"가장 친한 친구를 소개해 보세요."},
    {ro:"Ce hobby-uri ai? Descrie unul în detaliu.", en:"What hobbies do you have? Describe one in detail.", ko:"취미가 있어요? 하나 자세히 설명해 보세요."},
    {ro:"Scrie despre locul tău preferat din oraș.", en:"Write about your favorite place in the city.", ko:"도시에서 가장 좋아하는 장소에 대해 써 보세요."},
  ],
  3:[
    {ro:"Compară viața de student cu viața de adult.", en:"Compare student life with adult life.", ko:"학생 생활과 직장 생활을 비교해 보세요."},
    {ro:"Descrie o experiență memorabilă de călătorie.", en:"Describe a memorable travel experience.", ko:"기억에 남는 여행 경험을 써 보세요."},
    {ro:"De ce înveți coreeana? Ce ți-a plăcut cel mai mult?", en:"Why do you study Korean? What have you liked most?", ko:"한국어를 왜 배워요? 무엇이 가장 좋았어요?"},
    {ro:"Scrie despre un obicei bun sau rău al tău.", en:"Write about a good or bad habit of yours.", ko:"자신의 좋은 습관이나 나쁜 습관에 대해 써 보세요."},
  ],
  4:[
    {ro:"Ce înseamnă prietenia adevărată pentru tine?", en:"What does true friendship mean to you?", ko:"진정한 우정이란 무엇인지 써 보세요."},
    {ro:"Compară viața la oraș cu viața la sat.", en:"Compare city life with country life.", ko:"도시 생활과 시골 생활을 비교해 보세요."},
    {ro:"Descrie planurile tale de viitor.", en:"Describe your plans for the future.", ko:"미래 계획에 대해 써 보세요."},
    {ro:"Scrie despre un film sau o carte care te-a impresionat.", en:"Write about a movie or book that impressed you.", ko:"인상 깊었던 영화나 책에 대해 써 보세요."},
  ],
  5:[
    {ro:"Discută avantajele și dezavantajele rețelelor sociale.", en:"Discuss the advantages and disadvantages of social media.", ko:"SNS의 장점과 단점에 대해 쓰세요."},
    {ro:"Ce crezi despre importanța educației în societatea modernă?", en:"What do you think about the importance of education in modern society?", ko:"현대 사회에서 교육의 중요성에 대해 쓰세요."},
    {ro:"Cum afectează tehnologia relațiile umane?", en:"How does technology affect human relationships?", ko:"기술이 인간관계에 미치는 영향에 대해 쓰세요."},
  ],
  6:[
    {ro:"Analizează impactul globalizării asupra culturii locale.", en:"Analyze the impact of globalization on local culture.", ko:"세계화가 지역 문화에 미치는 영향을 분석하세요."},
    {ro:"Discută problemele de mediu și soluțiile posibile.", en:"Discuss environmental problems and possible solutions.", ko:"환경 문제와 가능한 해결책에 대해 쓰세요."},
    {ro:"Ce rol ar trebui să joace guvernul în asigurarea bunăstării sociale?", en:"What role should government play in ensuring social welfare?", ko:"사회 복지를 위한 정부의 역할에 대해 논하세요."},
  ],
};

const COMP_LIMIT_HINTS = {
  ro:{1:"Recomandat: 100–150 caractere",2:"Recomandat: 150–200 caractere",3:"Recomandat: 200–250 caractere",4:"Recomandat: 250–300 caractere",5:"Recomandat: 400–500 caractere",6:"Recomandat: 600–700 caractere"},
  en:{1:"Recommended: 100–150 chars",2:"Recommended: 150–200 chars",3:"Recommended: 200–250 chars",4:"Recommended: 250–300 chars",5:"Recommended: 400–500 chars",6:"Recommended: 600–700 chars"},
};

let compLevel   = 1;
let compCurrentPrompt = null;

// Butoane nivel
document.querySelectorAll(".comp-lvl-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".comp-lvl-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    compLevel = parseInt(btn.dataset.level, 10);
    compUpdateLimitHint();
    newCompPrompt();
  });
});

// Contor caractere
document.getElementById("compTextarea").addEventListener("input", () => {
  document.getElementById("compCharCount").textContent =
    document.getElementById("compTextarea").value.length;
});

// Închide modal la click pe fundal
document.getElementById("compApiModal").addEventListener("click", e => {
  if (e.target === document.getElementById("compApiModal")) closeCompApiModal();
});

function compUpdateLimitHint() {
  const el = document.getElementById("compLimitHint");
  if (el) el.textContent = COMP_LIMIT_HINTS[lang][compLevel];
}

function newCompPrompt() {
  const list = COMP_PROMPTS[compLevel];
  compCurrentPrompt = list[Math.floor(Math.random() * list.length)];
  compRenderPrompt();
  compHideResults();
}

function compRenderPrompt() {
  if (!compCurrentPrompt) return;
  document.getElementById("compPromptText").textContent = compCurrentPrompt[lang];
  document.getElementById("compPromptKo").textContent   = compCurrentPrompt.ko;
}

function clearCompose() {
  document.getElementById("compTextarea").value = "";
  document.getElementById("compCharCount").textContent = "0";
  compHideResults();
}

function compHideResults() {
  document.getElementById("compResults").classList.remove("visible");
  document.getElementById("compLoading").classList.remove("visible");
}

async function doCompCorrect() {
  const text = document.getElementById("compTextarea").value.trim();
  if (!text) { alert(T[lang].compWriteFirst); return; }
  const apiKey = localStorage.getItem("RK_CLAUDE_KEY");
  if (!apiKey) { showCompApiModal(); return; }

  document.getElementById("compResults").classList.remove("visible");
  document.getElementById("compLoading").classList.add("visible");
  document.getElementById("btnCompCorrect").disabled = true;

  try {
    const result = await compCallClaude(apiKey, text);
    compShowResults(result);
  } catch (err) {
    document.getElementById("compLoading").classList.remove("visible");
    if (err.status === 401) {
      localStorage.removeItem("RK_CLAUDE_KEY");
      alert(T[lang].compBadKey);
      showCompApiModal();
    } else {
      alert(T[lang].compError + (err.message || "Unknown"));
    }
  } finally {
    document.getElementById("btnCompCorrect").disabled = false;
  }
}

async function compCallClaude(apiKey, text) {
  const langName = lang === "ro" ? "Romanian" : "English";
  const system =
    `You are a Korean language teacher. A student studying for TOPIK level ${compLevel} has written a Korean text.\n\n` +
    `Analyze their writing and respond ONLY with valid JSON (no markdown, no extra text):\n` +
    `{"score":<integer 1-10>,"feedback":"<1-2 sentence feedback in ${langName}>","corrected":"<full corrected text in Korean>","errors":[{"original":"<wrong part>","fix":"<correct version>","explanation":"<why, in ${langName}>"}]}\n\n` +
    `Rules: list at most 5 most important errors, use [] if none; "corrected" is the full text with all fixes; keep explanations to one sentence; 10=perfect, 1=major issues.`;

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system,
      messages: [{role:"user", content:text}],
    }),
  });

  if (!resp.ok) {
    const e = new Error(`HTTP ${resp.status}`);
    e.status = resp.status;
    throw e;
  }
  const data = await resp.json();
  const m = data.content[0].text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("Format răspuns invalid");
  return JSON.parse(m[0]);
}

function compShowResults(result) {
  document.getElementById("compLoading").classList.remove("visible");

  const score = Math.max(1, Math.min(10, result.score || 5));
  document.getElementById("compScoreNum").textContent = score;
  const circle = document.getElementById("compScoreCircle");
  circle.className = "comp-score-circle " + (score >= 8 ? "score-great" : score >= 5 ? "score-ok" : "score-low");

  document.getElementById("compFeedbackText").textContent = result.feedback || "";
  document.getElementById("compCorrectedText").textContent = result.corrected || "";

  const list   = document.getElementById("compErrorsList");
  const errors = result.errors || [];
  list.innerHTML = "";

  if (errors.length === 0) {
    const li = document.createElement("li");
    li.className = "comp-error-item comp-error-none";
    li.textContent = T[lang].compNoErrors;
    list.appendChild(li);
  } else {
    errors.forEach(err => {
      const li = document.createElement("li");
      li.className = "comp-error-item";
      li.innerHTML =
        '<span class="comp-err-orig">'  + compEsc(err.original || "") + '</span>' +
        '<span class="comp-err-arrow"> → </span>' +
        '<span class="comp-err-fix">'   + compEsc(err.fix || "")      + '</span>' +
        '<p class="comp-err-expl">'     + compEsc(err.explanation || "") + '</p>';
      list.appendChild(li);
    });
  }

  document.getElementById("compResults").classList.add("visible");
  document.getElementById("compResults").scrollIntoView({behavior:"smooth", block:"start"});
}

function newCompAttempt() {
  newCompPrompt();
  clearCompose();
  document.getElementById("compSection").scrollIntoView({behavior:"smooth", block:"start"});
  setTimeout(() => document.getElementById("compTextarea").focus(), 300);
}

function compEsc(s) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function showCompApiModal() {
  document.getElementById("compApiErr").textContent = "";
  document.getElementById("compApiKeyInput").value  = "";
  document.getElementById("compApiModal").classList.add("open");
  setTimeout(() => document.getElementById("compApiKeyInput").focus(), 100);
}

function closeCompApiModal() {
  document.getElementById("compApiModal").classList.remove("open");
}

function saveCompApiKey() {
  const key = document.getElementById("compApiKeyInput").value.trim();
  if (!key.startsWith("sk-ant")) {
    document.getElementById("compApiErr").textContent = T[lang].compInvalidKey;
    return;
  }
  localStorage.setItem("RK_CLAUDE_KEY", key);
  closeCompApiModal();
  doCompCorrect();
}
