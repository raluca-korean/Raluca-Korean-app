/* ══════════════════════════════════════════════════════════════
   MORPHIC RESONANCE SPACE — Hangul Living Alphabet
   Paradigm: characters breathe, knowledge self-organises,
             attention creates gravitational vortices.
══════════════════════════════════════════════════════════════ */

// ── CHARACTER DATA ────────────────────────────────────────────
const CONS_BASIC = [
  { char:"ㄱ", rom:"g/k",  speak:"가", type:"cons" },
  { char:"ㄴ", rom:"n",    speak:"나", type:"cons" },
  { char:"ㄷ", rom:"d/t",  speak:"다", type:"cons" },
  { char:"ㄹ", rom:"r/l",  speak:"라", type:"cons" },
  { char:"ㅁ", rom:"m",    speak:"마", type:"cons" },
  { char:"ㅂ", rom:"b/p",  speak:"바", type:"cons" },
  { char:"ㅅ", rom:"s",    speak:"사", type:"cons" },
  { char:"ㅇ", rom:"–/ng", speak:"아", type:"cons" },
  { char:"ㅈ", rom:"j",    speak:"자", type:"cons" },
  { char:"ㅊ", rom:"ch",   speak:"차", type:"cons" },
  { char:"ㅋ", rom:"k",    speak:"카", type:"cons" },
  { char:"ㅌ", rom:"t",    speak:"타", type:"cons" },
  { char:"ㅍ", rom:"p",    speak:"파", type:"cons" },
  { char:"ㅎ", rom:"h",    speak:"하", type:"cons" },
];
const CONS_TENSED = [
  { char:"ㄲ", rom:"kk", speak:"까", type:"tensed" },
  { char:"ㄸ", rom:"tt", speak:"따", type:"tensed" },
  { char:"ㅃ", rom:"pp", speak:"빠", type:"tensed" },
  { char:"ㅆ", rom:"ss", speak:"싸", type:"tensed" },
  { char:"ㅉ", rom:"jj", speak:"짜", type:"tensed" },
];
const VOWELS_BASIC = [
  { char:"ㅏ", rom:"a",   speak:"아",  type:"vowel" },
  { char:"ㅐ", rom:"ae",  speak:"애",  type:"vowel" },
  { char:"ㅑ", rom:"ya",  speak:"야",  type:"vowel" },
  { char:"ㅒ", rom:"yae", speak:"얘",  type:"vowel" },
  { char:"ㅓ", rom:"eo",  speak:"어",  type:"vowel" },
  { char:"ㅔ", rom:"e",   speak:"에",  type:"vowel" },
  { char:"ㅕ", rom:"yeo", speak:"여",  type:"vowel" },
  { char:"ㅖ", rom:"ye",  speak:"예",  type:"vowel" },
  { char:"ㅗ", rom:"o",   speak:"오",  type:"vowel" },
  { char:"ㅛ", rom:"yo",  speak:"요",  type:"vowel" },
  { char:"ㅜ", rom:"u",   speak:"우",  type:"vowel" },
  { char:"ㅠ", rom:"yu",  speak:"유",  type:"vowel" },
  { char:"ㅡ", rom:"eu",  speak:"으",  type:"vowel" },
  { char:"ㅣ", rom:"i",   speak:"이",  type:"vowel" },
];
const VOWELS_COMP = [
  { char:"ㅘ", rom:"wa",  speak:"봐",  type:"vowel" },
  { char:"ㅙ", rom:"wae", speak:"왜",  type:"vowel" },
  { char:"ㅚ", rom:"oe",  speak:"외",  type:"vowel" },
  { char:"ㅝ", rom:"wo",  speak:"워",  type:"vowel" },
  { char:"ㅞ", rom:"we",  speak:"웨",  type:"vowel" },
  { char:"ㅟ", rom:"wi",  speak:"위",  type:"vowel" },
  { char:"ㅢ", rom:"ui",  speak:"의",  type:"vowel" },
];
const ALL_CHARS = [...CONS_BASIC, ...CONS_TENSED, ...VOWELS_BASIC, ...VOWELS_COMP];

// ── BATCHIM DATA ──────────────────────────────────────────────
const BATCHIM_ROWS = {
  ro: [
    { chars:"ㄱ ㄲ ㅋ", sound:"k", ex:"먹 (meok) — mânâncă" },
    { chars:"ㄴ",       sound:"n", ex:"산 (san) — munte" },
    { chars:"ㄷ ㅅ ㅆ ㅈ ㅊ ㅌ ㅎ", sound:"t", ex:"옷 (ot) — haine" },
    { chars:"ㄹ",       sound:"l", ex:"말 (mal) — cal / cuvânt" },
    { chars:"ㅁ",       sound:"m", ex:"봄 (bom) — primăvarǎ" },
    { chars:"ㅂ ㅍ",   sound:"p", ex:"밥 (bap) — orez" },
    { chars:"ㅇ",       sound:"ng",ex:"강 (gang) — râu" },
  ],
  en: [
    { chars:"ㄱ ㄲ ㅋ", sound:"k", ex:"먹 (meok) — eat" },
    { chars:"ㄴ",       sound:"n", ex:"산 (san) — mountain" },
    { chars:"ㄷ ㅅ ㅆ ㅈ ㅊ ㅌ ㅎ", sound:"t", ex:"옷 (ot) — clothes" },
    { chars:"ㄹ",       sound:"l", ex:"말 (mal) — horse / word" },
    { chars:"ㅁ",       sound:"m", ex:"봄 (bom) — spring" },
    { chars:"ㅂ ㅍ",   sound:"p", ex:"밥 (bap) — rice" },
    { chars:"ㅇ",       sound:"ng",ex:"강 (gang) — river" },
  ],
};

// ── PHONOLOGICAL FAMILIES (echo resonance) ───────────────────
const ECHO_FAMILY = {
  'ㄱ':['ㄲ','ㅋ'], 'ㄲ':['ㄱ','ㅋ'], 'ㅋ':['ㄱ','ㄲ'],
  'ㄷ':['ㄸ','ㅌ'], 'ㄸ':['ㄷ','ㅌ'], 'ㅌ':['ㄷ','ㄸ'],
  'ㅂ':['ㅃ','ㅍ'], 'ㅃ':['ㅂ','ㅍ'], 'ㅍ':['ㅂ','ㅃ'],
  'ㅅ':['ㅆ'],      'ㅆ':['ㅅ'],
  'ㅈ':['ㅉ','ㅊ'], 'ㅉ':['ㅈ','ㅊ'], 'ㅊ':['ㅈ','ㅉ'],
  'ㅏ':['ㅗ','ㅑ'], 'ㅗ':['ㅏ','ㅛ'], 'ㅛ':['ㅗ'],  'ㅑ':['ㅏ'],
  'ㅓ':['ㅕ','ㅡ'], 'ㅡ':['ㅓ','ㅢ'], 'ㅕ':['ㅓ'],
  'ㅜ':['ㅠ','ㅡ'], 'ㅠ':['ㅜ'],
  'ㅣ':['ㅐ','ㅔ'], 'ㅐ':['ㅣ','ㅔ'], 'ㅔ':['ㅣ','ㅐ'],
};

// ── SYLLABLE COMBINATION (Unicode algebra) ────────────────────
const CONS_INIT_IDX = {
  'ㄱ':0,'ㄲ':1,'ㄴ':2,'ㄷ':3,'ㄸ':4,'ㄹ':5,'ㅁ':6,'ㅂ':7,
  'ㅃ':8,'ㅅ':9,'ㅆ':10,'ㅇ':11,'ㅈ':12,'ㅉ':13,'ㅊ':14,
  'ㅋ':15,'ㅌ':16,'ㅍ':17,'ㅎ':18,
};
const VOWEL_MED_IDX = {
  'ㅏ':0,'ㅐ':1,'ㅑ':2,'ㅒ':3,'ㅓ':4,'ㅔ':5,'ㅕ':6,'ㅖ':7,
  'ㅗ':8,'ㅘ':9,'ㅙ':10,'ㅚ':11,'ㅛ':12,'ㅜ':13,'ㅝ':14,
  'ㅞ':15,'ㅟ':16,'ㅠ':17,'ㅡ':18,'ㅢ':19,'ㅣ':20,
};
const VOWEL_ROM = {
  'ㅏ':'a','ㅐ':'ae','ㅑ':'ya','ㅒ':'yae','ㅓ':'eo','ㅔ':'e',
  'ㅕ':'yeo','ㅖ':'ye','ㅗ':'o','ㅘ':'wa','ㅙ':'wae','ㅚ':'oe',
  'ㅛ':'yo','ㅜ':'u','ㅝ':'wo','ㅞ':'we','ㅟ':'wi','ㅠ':'yu',
  'ㅡ':'eu','ㅢ':'ui','ㅣ':'i',
};
// Display vowels for consonant examples (ㅏ, ㅣ, ㅗ)
const EX_VOWELS  = ['ㅏ','ㅣ','ㅗ'];
// Display consonants for vowel examples (ㄱ, ㄴ, ㅁ)
const EX_CONS    = ['ㄱ','ㄴ','ㅁ'];
const EX_CONS_R  = ['g', 'n', 'm'];

function makeSyllable(ci, vi) {
  if (ci === undefined || vi === undefined) return null;
  return String.fromCharCode(0xAC00 + (ci * 21 + vi) * 28);
}
function buildExamples(item) {
  const exs = [];
  if (item.type === 'cons' || item.type === 'tensed') {
    const ci = CONS_INIT_IDX[item.char];
    if (ci !== undefined) {
      EX_VOWELS.forEach(v => {
        const syl = makeSyllable(ci, VOWEL_MED_IDX[v]);
        if (syl) exs.push({ syl, rom: item.rom.split('/')[0] + VOWEL_ROM[v] });
      });
    }
  } else {
    const vi = VOWEL_MED_IDX[item.char];
    if (vi !== undefined) {
      EX_CONS.forEach((c, i) => {
        const syl = makeSyllable(CONS_INIT_IDX[c], vi);
        if (syl) exs.push({ syl, rom: EX_CONS_R[i] + item.rom });
      });
    }
  }
  return exs.slice(0, 3);
}

// ── RULES (75 rules, both languages) ─────────────────────────
const RULES = {
  ro: [
    { ko:"연음 — Legătura", label:"Regula 1", text:"Batchim-ul se leagǎ de vocala urmǎtoare: <strong>한국어 → han-gu-geo</strong> (ㄱ trece la 어)." },
    { ko:"ㅇ mut la început", label:"Regula 2", text:"ㅇ la <strong>începutul silabei</strong> este mut: <strong>아버지 → a-beo-ji</strong>." },
    { ko:"ㅇ = ng la final", label:"Regula 3", text:"ㅇ ca <strong>batchim</strong> se pronunțǎ <em>ng</em>: <strong>강 → gang</strong>." },
    { ko:"Aspirație ㅋ ㅌ ㅍ ㅊ", label:"Regula 4", text:"Sunt variante <strong>aspirate</strong> (cu suflare de aer) ale lui ㄱ ㄷ ㅂ ㅈ." },
    { ko:"Nazalizare", label:"Regula 5", text:"ㄱ/ㄷ/ㅂ devin <em>ng/n/m</em> înainte de ㄴ sau ㅁ: <strong>국민 → gungmin</strong>." },
    { ko:"구개음화 — Palatalizare", label:"Regula 6", text:"ㄷ/ㅌ + 이 devin <em>지/치</em>: <strong>같이 → 가치</strong> (ga-chi)." },
    { ko:"유음화 — Lichidizare", label:"Regula 7", text:"ㄴ lângǎ ㄹ devine ㄹ: <strong>신라 → 실라</strong> (sil-la)." },
    { ko:"경음화 — Tensionare", label:"Regula 8", text:"Dupǎ batchim ㄱ/ㄷ/ㅂ, consoanele plain devin tensionate: <strong>학교 → 학꾜</strong>." },
    { ko:"ㅎ + consoană → aspiratǎ", label:"Regula 9", text:"Batchim ㅎ + ㄱ/ㄷ/ㅈ fuzionează: <strong>좋다 → 조타</strong> (jo-ta)." },
    { ko:"ㅎ dispare între vocale", label:"Regula 10", text:"ㅎ între douǎ vocale se reduce: <strong>좋아요 → 조아요</strong>." },
    { ko:"겹받침 — Batchim dublu", label:"Regula 11", text:"Douǎ consoane batchim: de regulǎ se pronunțǎ una: <strong>읽다 → 익다</strong> (ik-da)." },
    { ko:"ㄹ → ㄴ dupǎ nazale", label:"Regula 12", text:"ㄹ dupǎ batchim ㅁ/ㅇ devine ㄴ: <strong>강릉 → 강능</strong>." },
    { ko:"ㄴ 첨가 — Inserție ㄴ", label:"Regula 13", text:"La granița cuvintelor compuse, înainte de 이/야/여/요/유 se inserează ㄴ: <strong>꽃잎 → 꼰닙</strong>." },
    { ko:"두음법칙 — ㄹ inițial", label:"Regula 14", text:"ㄹ la <strong>începutul cuvântului</strong> devine ㄴ sau dispare: <strong>여자</strong> (din 녀자)." },
    { ko:"경음화 în compuse", label:"Regula 15", text:"În cuvinte compuse, consoana inițialǎ a celui de-al doilea element poate deveni tensionatǎ." },
    { ko:"활음화 — Alunecare vocalicǎ", label:"Regula 16", text:"오/우 sau 이 înainte de altǎ vocalǎ: <strong>보+아 → 봐</strong>." },
    { ko:"모음 조화 — Armonie vocalicǎ", label:"Regula 17", text:"ㅏ dupǎ vocale pozitive (ㅏ, ㅗ) și ㅓ dupǎ negative: <strong>가+아요 → 가요</strong>." },
    { ko:"ㅎ mut înainte de ㄴ/ㄹ", label:"Regula 18", text:"Batchim ㅎ înainte de ㄴ sau ㄹ dispare: <strong>놓는 → 논는</strong>." },
    { ko:"ㄹ탈락 — Cǎderea lui ㄹ", label:"Regula 19", text:"Tulpini cu ㄹ pierd ㄹ înainte de ㄴ/ㅂ/ㅅ: <strong>알다→아는</strong>." },
    { ko:"사이시옷 — ㅅ intercalat", label:"Regula 20", text:"ㅅ între douǎ substantive: <strong>나뭇잎 → 나문닙</strong>." },
    { ko:"장단음 — Lungimea vocalei", label:"Regula 21", text:"눈[nu:n] (zǎpadǎ) vs 눈[nun] (ochi): vocale lungi în prima silabǎ." },
    { ko:"ㄷ 불규칙 — Neregulat ㄷ→ㄹ", label:"Regula 22", text:"<strong>듣다→들어요</strong> (a asculta), <strong>걷다→걸어요</strong> (a merge)." },
    { ko:"ㅂ 불규칙 — Neregulat ㅂ→우", label:"Regula 23", text:"<strong>춥다→추워요</strong> (frig), <strong>돕다→도와요</strong> (a ajuta)." },
    { ko:"ㅅ 불규칙 — Neregulat ㅅ dispare", label:"Regula 24", text:"<strong>낫다→나아요</strong> (a se vindeca), <strong>붓다→부어요</strong>." },
    { ko:"-ㄹ + tensionare", label:"Regula 25", text:"Sufixul -ㄹ tensionează consoana urmǎtoare: <strong>갈 수 → 갈 쑤</strong>." },
    { ko:"ㅡ탈락 — ㅡ cade", label:"Regula 26", text:"Tulpini cu ㅡ pierd ㅡ înainte de vocale: <strong>쓰다→써요</strong>, <strong>크다→커요</strong>." },
    { ko:"르 불규칙 — ㄹ se dubleazǎ", label:"Regula 27", text:"<strong>모르다→몰라요</strong> (nu știu), <strong>부르다→불러요</strong>." },
    { ko:"ㅎ 불규칙 — adjective culoare", label:"Regula 28", text:"<strong>빨갛다→빨개요</strong> (roșu), <strong>노랗다→노래요</strong> (galben)." },
    { ko:"하다 + 아/여 → 해", label:"Regula 29", text:"하다 contractǎ terminația: <strong>공부해요</strong>, <strong>사랑해요</strong>." },
    { ko:"중화 — 7 sunete finale", label:"Regula 30", text:"Orice consoana finalǎ se neutralizeazǎ: ㅋ/ㄲ→ㄱ, ㅌ/ㅅ→ㄷ, ㅍ→ㅂ." },
    { ko:"ㅐ = ㅔ modern", label:"Regula 31", text:"Majoritarea vorbitorilor pronunțǎ ㅐ și ㅔ identic [e] în vorbirea curentǎ." },
    { ko:"ㄹ: vibrantǎ/lateralǎ", label:"Regula 32", text:"ㄹ între vocale = <em>r</em> vibrant; la finalul silabei = <em>l</em> lateral." },
    { ko:"ㅢ — trei pronunții", label:"Regula 33", text:"La început = [ui], dupǎ consoana = [i], ca particulǎ posesivǎ = [e]." },
    { ko:"Sonorizare între vocale", label:"Regula 34", text:"ㄱ/ㄷ/ㅂ/ㅈ între sunete sonore devin sonore: <strong>바다</strong> [ba-<em>d</em>a]." },
    { ko:"이/가, 은/는, 을/를", label:"Regula 35", text:"Dupǎ consoana → 이/은/을; dupǎ vocalǎ → 가/는/를." },
    { ko:"Oclusivǎ neeliberatǎ", label:"Regula 36", text:"ㄱ/ㄷ/ㅂ la finalul enunțului sunt ținute mut: <strong>먹[meok̚]</strong>." },
    { ko:"것 → 거/걸/건", label:"Regula 37", text:"것 se contractǎ: 것이→거, 것을→걸, 것은→건." },
    { ko:"이에요/예요 — copula", label:"Regula 38", text:"Dupǎ consoana→이에요; dupǎ vocalǎ→예요: <strong>학생이에요</strong>." },
    { ko:"Adaptarea împrumuturilor", label:"Regula 39", text:"Grupuri consonantice engl. primesc ㅡ: <strong>스트레스</strong> (stress)." },
    { ko:"야/아 — vocativ", label:"Regula 40", text:"Dupǎ vocalǎ→야 (<strong>지수야!</strong>); dupǎ consoana→아 (<strong>민준아!</strong>)." },
    { ko:"음절 박자 — Ritm silabic", label:"Regula 41", text:"Coreeana e <strong>silabicǎ</strong>: fiecare silabǎ are duratǎ egalǎ." },
    { ko:"Sistemul dublu de numere", label:"Regula 42", text:"Sino-coreean (일이삼) pentru date/bani; nativ (하나둘셋) pentru obiecte." },
    { ko:"-아/어서 — conector cauzal", label:"Regula 43", text:"Urmează armonia vocalicǎ: <strong>가서</strong>, <strong>먹어서</strong>, <strong>해서</strong>." },
    { ko:"-겠- — cascadǎ foneticǎ", label:"Regula 44", text:"-겠- provoacǎ cascadǎ: <strong>하겠습니다→하겓씀니다</strong>." },
    { ko:"ㄴ 첨가 sino-coreean", label:"Regula 45", text:"ㄴ se insereazǎ și în compuse sino-coreene: <strong>허용량→허용냥</strong>." },
    { ko:"닫히다→다치다", label:"Regula 46", text:"Batchim ㄷ/ㅌ + sufixul pasiv -히- → 치: <strong>닫히다→다치다</strong>." },
    { ko:"없다/있다 cascade", label:"Regula 47", text:"없다: ㄼ→ㅂ + ㄷ tensionat → <strong>[업따]</strong>; 있다 → <strong>[읻따]</strong>." },
    { ko:"-(으)면 — condiție", label:"Regula 48", text:"Dupǎ consoana→으면; dupǎ vocalǎ/ㄹ→면: <strong>먹으면</strong>, <strong>가면</strong>." },
    { ko:"Contracții vorbire rapidǎ", label:"Regula 49", text:"그런데→근데, 저는→전, 나는→난, -지 않다→-잖다." },
    { ko:"억양 — Intonație", label:"Regula 50", text:"Afirmații ↘; întrebǎri da/nu ↗; întrebǎri cu pronume ↘ dar mai sus." },
    { ko:"못/안 + tensionare", label:"Regula 51", text:"못/안 + verb: <strong>못 가다→[몯까다]</strong> (nu poate merge)." },
    { ko:"-(으)로 — direcție", label:"Regula 52", text:"Dupǎ consoana (excl. ㄹ)→으로; dupǎ vocalǎ/ㄹ→로: <strong>집으로</strong>." },
    { ko:"-ㅂ니다/-습니다 formal", label:"Regula 53", text:"Dupǎ vocalǎ→ㅂ니다 (<strong>갑니다</strong>); dupǎ consoana→습니다 (<strong>먹습니다</strong>)." },
    { ko:"Tensionare sino-coreeanǎ", label:"Regula 54", text:"<strong>일기→[일끼]</strong> (jurnal), <strong>발달→[발딸]</strong> (dezvoltare)." },
    { ko:"-(으)ㄴ/는/ㄹ adnominal", label:"Regula 55", text:"먹은/간 (trecut), 먹을/갈 (viitor). ㅡ dispare dupǎ vocalǎ." },
    { ko:"와/과 alternanțǎ", label:"Regula 56", text:"Dupǎ vocalǎ→와/랑/나; dupǎ consoana→과/이랑/이나." },
    { ko:"ㅅ + vocale iotizate → [ɕ]", label:"Regula 57", text:"ㅅ înainte de 이/야/여/요/유 sunǎ ca <em>sh</em>: <strong>시</strong>[ɕi]." },
    { ko:"ㅈ/ㅊ/ㅉ — alveopalatale", label:"Regula 58", text:"Produse mai în spate decât engl. j/ch: ㅈ=neaspirat, ㅊ=aspirat, ㅉ=tensionat." },
    { ko:"Vocale lungi numai în prima silabǎ", label:"Regula 59", text:"<strong>말[ma:l]</strong> dar în compus <strong>말하다→[말하다]</strong> (scurt)." },
    { ko:"러 불규칙 — 이르다/푸르다", label:"Regula 60", text:"<strong>이르다→이르러요</strong> (a ajunge). Diferit de 르 irregular." },
    { ko:"우 불규칙 — 푸다→퍼요", label:"Regula 61", text:"Singurul verb: <strong>푸다→퍼요</strong>. ㅜ dispare, 어 rǎmâne." },
    { ko:"이게/그게/뭐 contracții", label:"Regula 62", text:"이것이→이게, 그것이→그게, 무엇→뭐. Uzuale în orice registru." },
    { ko:"-(이)었다 — trecut copula", label:"Regula 63", text:"Dupǎ consoana→이었어요; dupǎ vocalǎ→였어요." },
    { ko:"Sunete engl. absente", label:"Regula 64", text:"f→ㅍ, v→ㅂ, z→ㅈ, th→ㄷ/ㅅ: <strong>바이올린</strong>, <strong>지퍼</strong>." },
    { ko:"ㄹ batchim în compuse", label:"Regula 65", text:"ㄹ batchim tensionează: <strong>길+가→길까</strong> [길까]." },
    { ko:"Cascadǎ dublǎ", label:"Regula 66", text:"<strong>격려→[경녀]</strong>: Reg.5 nazalizare + Reg.12 ㄹ→ㄴ în succesiune." },
    { ko:"ㅂ irregular + alunecare", label:"Regula 67", text:"<strong>돕+아→도와</strong>: ㅂ→우, apoi 우+아 → alunecare (douǎ reguli)." },
    { ko:"Valori fonetice IPA", label:"Regula 68", text:"ㅏ[a], ㅓ[ʌ], ㅡ[ɯ](rom. î), ㅗ[o], ㅜ[u], ㅣ[i], ㅐ≈ㅔ[e]." },
    { ko:"ㅓ vs ㅗ — confuzie", label:"Regula 69", text:"ㅓ[ʌ]=fǎrǎ rotunjire; ㅗ[o]=cu rotunjire. Cheie: 어머니 vs 오빠." },
    { ko:"Sistemul de 3 consoane", label:"Regula 70", text:"Lenis ㄱ[k̬] / Aspirat ㅋ[kʰ] / Tensionat ㄲ[k']. Unic în lume." },
    { ko:"Ordinea alfabetului", label:"Regula 71", text:"ㄱ ㄲ ㄴ ㄷ ㄸ ㄹ ㅁ ㅂ ㅃ ㅅ ㅆ ㅇ ㅈ ㅉ ㅊ ㅋ ㅌ ㅍ ㅎ." },
    { ko:"방언 — Dialecte", label:"Regula 72", text:"Seoul=standard. Gyeongsang=tonal. Jeolla=terminații proprii. Jeju≈altǎ limbǎ." },
    { ko:"ㅋㅋ / ㅎㅎ — Limbaj digital", label:"Regula 73", text:"ㅋㅋ=râs, ㅎㅎ=haha, ㄷㄷ=fioruri, ㄱㅅ=mulțumesc, ㅠㅠ=plâns." },
    { ko:"줄임말 — Cuvinte trunchiate", label:"Regula 74", text:"셀카(selfie), 치맥(pui+bere), 남친/여친(iubit/iubitǎ), 앱(app)." },
    { ko:"형태소 — Scriere morfologicǎ", label:"Regula 75", text:"Scrierea pǎstreazǎ rǎdǎcina: <strong>먹이다</strong> (nu 머기다), <strong>같이</strong>." },
  ],
  en: [
    { ko:"연음 — Liaison", label:"Rule 1", text:"Batchim links to the next vowel: <strong>한국어 → han-gu-geo</strong>." },
    { ko:"Silent ㅇ at start", label:"Rule 2", text:"ㅇ at the start of a syllable is silent: <strong>아버지 → a-beo-ji</strong>." },
    { ko:"ㅇ = ng at end", label:"Rule 3", text:"ㅇ as batchim sounds like <em>ng</em>: <strong>강 → gang</strong>." },
    { ko:"Aspiration ㅋ ㅌ ㅍ ㅊ", label:"Rule 4", text:"Aspirated (puff of air) versions of ㄱ ㄷ ㅂ ㅈ." },
    { ko:"Nasalization", label:"Rule 5", text:"ㄱ/ㄷ/ㅂ become <em>ng/n/m</em> before ㄴ or ㅁ: <strong>국민 → gungmin</strong>." },
    { ko:"구개음화 — Palatalization", label:"Rule 6", text:"ㄷ/ㅌ before 이 become <em>지/치</em>: <strong>같이 → 가치</strong> (ga-chi)." },
    { ko:"유음화 — Liquidization", label:"Rule 7", text:"ㄴ next to ㄹ becomes ㄹ: <strong>신라 → 실라</strong> (sil-la)." },
    { ko:"경음화 — Tensification", label:"Rule 8", text:"After batchim ㄱ/ㄷ/ㅂ, plain consonants become tense: <strong>학교 → 학꾜</strong>." },
    { ko:"ㅎ + consonant → aspirated", label:"Rule 9", text:"Batchim ㅎ + ㄱ/ㄷ/ㅈ merge: <strong>좋다 → 조타</strong> (jo-ta)." },
    { ko:"ㅎ weakens between vowels", label:"Rule 10", text:"ㅎ between vowels weakens: <strong>좋아요 → 조아요</strong>." },
    { ko:"겹받침 — Double batchim", label:"Rule 11", text:"Two-consonant batchim: usually one pronounced: <strong>읽다 → 익다</strong>." },
    { ko:"ㄹ → ㄴ after nasals", label:"Rule 12", text:"ㄹ after batchim ㅁ/ㅇ becomes ㄴ: <strong>강릉 → 강능</strong>." },
    { ko:"ㄴ 첨가 — ㄴ insertion", label:"Rule 13", text:"At compound boundaries, ㄴ inserted before 이/야/여/요/유: <strong>꽃잎 → 꼰닙</strong>." },
    { ko:"두음법칙 — Initial ㄹ", label:"Rule 14", text:"ㄹ at word start becomes ㄴ or disappears: <strong>여자</strong> (from 녀자)." },
    { ko:"경음화 in compounds", label:"Rule 15", text:"In compounds, the second element's initial consonant can tensify." },
    { ko:"활음화 — Glide formation", label:"Rule 16", text:"오/우 or 이 before another vowel: <strong>보+아 → 봐</strong>." },
    { ko:"모음 조화 — Vowel harmony", label:"Rule 17", text:"ㅏ after bright vowels (ㅏ,ㅗ); ㅓ after dark vowels: <strong>가요, 먹어요</strong>." },
    { ko:"ㅎ silent before ㄴ/ㄹ", label:"Rule 18", text:"Batchim ㅎ before ㄴ/ㄹ disappears: <strong>놓는 → 논는</strong>." },
    { ko:"ㄹ탈락 — ㄹ deletion", label:"Rule 19", text:"ㄹ-stems drop ㄹ before ㄴ/ㅂ/ㅅ: <strong>알다→아는</strong>." },
    { ko:"사이시옷 — Inserted ㅅ", label:"Rule 20", text:"ㅅ between two nouns causes tensification: <strong>나뭇잎 → 나문닙</strong>." },
    { ko:"장단음 — Vowel length", label:"Rule 21", text:"눈[nu:n] (snow) vs 눈[nun] (eye): long vowels in first syllable only." },
    { ko:"ㄷ 불규칙 — Irregular ㄷ→ㄹ", label:"Rule 22", text:"<strong>듣다→들어요</strong> (listen), <strong>걷다→걸어요</strong> (walk)." },
    { ko:"ㅂ 불규칙 — Irregular ㅂ→우", label:"Rule 23", text:"<strong>춥다→추워요</strong> (cold), <strong>돕다→도와요</strong> (help)." },
    { ko:"ㅅ 불규칙 — Irregular ㅅ drops", label:"Rule 24", text:"<strong>낫다→나아요</strong> (get better), <strong>붓다→부어요</strong>." },
    { ko:"-ㄹ + tensification", label:"Rule 25", text:"Prospective suffix -ㄹ tensifies next consonant: <strong>갈 수 → 갈 쑤</strong>." },
    { ko:"ㅡ탈락 — ㅡ drops", label:"Rule 26", text:"ㅡ-stems drop ㅡ before vowels: <strong>쓰다→써요</strong>, <strong>크다→커요</strong>." },
    { ko:"르 불규칙 — ㄹ doubling", label:"Rule 27", text:"<strong>모르다→몰라요</strong> (don't know), <strong>부르다→불러요</strong>." },
    { ko:"ㅎ 불규칙 — color adjectives", label:"Rule 28", text:"<strong>빨갛다→빨개요</strong> (red), <strong>노랗다→노래요</strong> (yellow)." },
    { ko:"하다 + 아/여 → 해", label:"Rule 29", text:"하다 verbs contract: <strong>공부해요</strong>, <strong>사랑해요</strong>." },
    { ko:"중화 — 7 final sounds", label:"Rule 30", text:"All final consonants neutralize: ㅋ/ㄲ→ㄱ, ㅌ/ㅅ→ㄷ, ㅍ→ㅂ." },
    { ko:"ㅐ = ㅔ in modern Korean", label:"Rule 31", text:"Most speakers pronounce ㅐ and ㅔ identically as [e]." },
    { ko:"ㄹ: flap/lateral", label:"Rule 32", text:"ㄹ between vowels = light <em>r</em>; at syllable end = <em>l</em>." },
    { ko:"ㅢ — three pronunciations", label:"Rule 33", text:"Word-initial [ui], after consonant [i], as possessive [e]." },
    { ko:"Voicing between voiced sounds", label:"Rule 34", text:"ㄱ/ㄷ/ㅂ/ㅈ between voiced sounds become voiced: <strong>바다</strong> [ba-<em>d</em>a]." },
    { ko:"이/가, 은/는, 을/를", label:"Rule 35", text:"After consonant → 이/은/을; after vowel → 가/는/를." },
    { ko:"Unreleased stops", label:"Rule 36", text:"ㄱ/ㄷ/ㅂ at utterance end are held silent: <strong>먹[meok̚]</strong>." },
    { ko:"것 → 거/걸/건", label:"Rule 37", text:"것 contracts: 것이→거, 것을→걸, 것은→건." },
    { ko:"이에요/예요 — copula", label:"Rule 38", text:"After consonant→이에요; after vowel→예요: <strong>학생이에요</strong>." },
    { ko:"Loanword adaptation", label:"Rule 39", text:"Consonant clusters get ㅡ: <strong>스트레스</strong> (stress), <strong>크림</strong>." },
    { ko:"야/아 — vocative suffix", label:"Rule 40", text:"After vowel→야 (<strong>지수야!</strong>); after consonant→아 (<strong>민준아!</strong>)." },
    { ko:"음절 박자 — Syllable timing", label:"Rule 41", text:"Korean is syllable-timed: every syllable gets equal duration." },
    { ko:"Dual number systems", label:"Rule 42", text:"Sino-Korean (일이삼) for dates/money; Native (하나둘셋) for counting." },
    { ko:"-아/어서 — causal connector", label:"Rule 43", text:"Follows vowel harmony: <strong>가서</strong>, <strong>먹어서</strong>, <strong>해서</strong>." },
    { ko:"-겠- — phonetic cascade", label:"Rule 44", text:"-겠- triggers chain: <strong>하겠습니다→하겓씀니다</strong>." },
    { ko:"ㄴ insertion in Sino-Korean", label:"Rule 45", text:"ㄴ also inserted in Sino-Korean compounds: <strong>허용량→허용냥</strong>." },
    { ko:"닫히다→다치다", label:"Rule 46", text:"Batchim ㄷ/ㅌ + passive -히- → 치: <strong>닫히다→다치다</strong>." },
    { ko:"없다/있다 cascades", label:"Rule 47", text:"없다: ㄼ→ㅂ + tensification → <strong>[업따]</strong>; 있다 → <strong>[읻따]</strong>." },
    { ko:"-(으)면 — conditional", label:"Rule 48", text:"After consonant→으면; after vowel/ㄹ→면: <strong>먹으면</strong>, <strong>가면</strong>." },
    { ko:"Fast speech contractions", label:"Rule 49", text:"그런데→근데, 저는→전, 나는→난, -지 않다→-잖다." },
    { ko:"억양 — Intonation", label:"Rule 50", text:"Statements fall ↘; yes/no questions rise ↗; wh-questions fall ↘." },
    { ko:"못/안 + tensification", label:"Rule 51", text:"못/안 before verb: <strong>못 가다→[몯까다]</strong> (can't go)." },
    { ko:"-(으)로 — directional", label:"Rule 52", text:"After consonant (not ㄹ)→으로; after vowel/ㄹ→로: <strong>집으로</strong>." },
    { ko:"-ㅂ니다/-습니다 formal", label:"Rule 53", text:"After vowel→ㅂ니다 (<strong>갑니다</strong>); after consonant→습니다." },
    { ko:"Sino-Korean tensification", label:"Rule 54", text:"<strong>일기→[일끼]</strong> (diary), <strong>발달→[발딸]</strong> (development)." },
    { ko:"-(으)ㄴ/는/ㄹ adnominal", label:"Rule 55", text:"먹은/간 (past), 먹을/갈 (future). ㅡ disappears after vowel." },
    { ko:"와/과 alternation", label:"Rule 56", text:"After vowel→와/랑/나; after consonant→과/이랑/이나." },
    { ko:"ㅅ before iotized vowels", label:"Rule 57", text:"ㅅ before 이/야/여/요/유 sounds like <em>sh</em>: <strong>시</strong>[ɕi]." },
    { ko:"ㅈ/ㅊ/ㅉ — alveopalatals", label:"Rule 58", text:"Produced further back than English j/ch. ㅈ=plain, ㅊ=aspirated, ㅉ=tensed." },
    { ko:"Vowel length in first syllable", label:"Rule 59", text:"<strong>말[ma:l]</strong> alone; in compound <strong>말하다→[말하다]</strong> (short)." },
    { ko:"러 불규칙 — 이르다/푸르다", label:"Rule 60", text:"<strong>이르다→이르러요</strong> (to reach). Different from 르 irregular." },
    { ko:"우 불규칙 — 푸다→퍼요", label:"Rule 61", text:"Only verb: <strong>푸다→퍼요</strong>. ㅜ disappears, 어 remains." },
    { ko:"이게/그게/뭐 contractions", label:"Rule 62", text:"이것이→이게, 그것이→그게, 무엇→뭐. All registers." },
    { ko:"-(이)었다 — past copula", label:"Rule 63", text:"After consonant→이었어요; after vowel→였어요." },
    { ko:"English sounds absent", label:"Rule 64", text:"f→ㅍ, v→ㅂ, z→ㅈ, th→ㄷ/ㅅ: <strong>바이올린</strong>, <strong>지퍼</strong>." },
    { ko:"ㄹ batchim in compounds", label:"Rule 65", text:"ㄹ batchim tensifies: <strong>길+가→길까</strong> [길까]." },
    { ko:"Double cascade", label:"Rule 66", text:"<strong>격려→[경녀]</strong>: Rule 5 nasalization + Rule 12 ㄹ→ㄴ." },
    { ko:"ㅂ irregular + glide", label:"Rule 67", text:"<strong>돕+아→도와</strong>: ㅂ→우, then 우+아 forms glide (two rules chained)." },
    { ko:"Vowel phonetic values (IPA)", label:"Rule 68", text:"ㅏ[a], ㅓ[ʌ], ㅡ[ɯ], ㅗ[o], ㅜ[u], ㅣ[i], ㅐ≈ㅔ[e]." },
    { ko:"ㅓ vs ㅗ confusion", label:"Rule 69", text:"ㅓ[ʌ]=no lip rounding; ㅗ[o]=rounded lips. 어머니 vs 오빠." },
    { ko:"Three-way consonant system", label:"Rule 70", text:"Lenis ㄱ[k̬] / Aspirated ㅋ[kʰ] / Tensed ㄲ[k']. Unique worldwide." },
    { ko:"자모 순서 — Alphabet order", label:"Rule 71", text:"ㄱ ㄲ ㄴ ㄷ ㄸ ㄹ ㅁ ㅂ ㅃ ㅅ ㅆ ㅇ ㅈ ㅉ ㅊ ㅋ ㅌ ㅍ ㅎ." },
    { ko:"방언 — Dialects", label:"Rule 72", text:"Seoul=standard. Gyeongsang=pitch accent. Jeolla=distinctive endings." },
    { ko:"ㅋㅋ / ㅎㅎ — Digital language", label:"Rule 73", text:"ㅋㅋ=laughter, ㅎㅎ=haha, ㄷㄷ=shiver, ㄱㅅ=thanks, ㅠㅠ=crying." },
    { ko:"줄임말 — Truncated words", label:"Rule 74", text:"셀카(selfie), 치맥(chicken+beer), 남친/여친(bf/gf), 앱(app)." },
    { ko:"Morphophonemic spelling", label:"Rule 75", text:"Korean spells by morpheme: <strong>먹이다</strong> (not 머기다), <strong>같이</strong>." },
  ],
};

// ── TRANSLATIONS ──────────────────────────────────────────────
const T = {
  ro: {
    title: "Alfabet Hangul", paradigmSub: "Hangul · Alfabet Viu",
    zoneCons: "consoane", zoneTensed: "duble", zoneVowels: "vocale",
    rulesTitle: "Fluxul Cunoașterii",
    typeCons: "Consoană de bază", typeTensed: "Consoană dublǎ", typeVowel: "Vocalǎ",
    typeVowelComp: "Vocalǎ compusǎ",
    nodeExamples: "Silabe", nodeFamily: "Familie fonetică",
    nodeBatchim: "Batchim", nodeHarmony: "Armonie vocalicǎ",
    echoLabel: "Rezonanțǎ",
    vHear: "Ascultǎ", vWrite: "Scrie",
    qMode: "Ce sunet face?",
    qCorrect: "✦ Corect!", qWrong: ans => `✕ Rǎspuns corect: ${ans}`,
    qNext: "Următor →", qRestart: "Reîncepe ◎",
    qDone: (c, t) => `Armonicǎ completǎ — ${c} din ${t}`,
    writeHint: "Urmărește săgețile, apoi scrie",
    sylTitle: "Structura silabei",
    sylInfo: "Fiecare silabǎ coreeanǎ e un <strong>bloc pǎtrat</strong> format din 2–3 litere. Formula: <strong>C + V</strong> sau <strong>C + V + C</strong>",
    sylLabels: { cons: "consoană", vowel: "vocalǎ", batchim: "batchim" },
  },
  en: {
    title: "Hangul Alphabet", paradigmSub: "Hangul · Living Alphabet",
    zoneCons: "consonants", zoneTensed: "tensed", zoneVowels: "vowels",
    rulesTitle: "Knowledge Stream",
    typeCons: "Basic Consonant", typeTensed: "Tensed Consonant", typeVowel: "Vowel",
    typeVowelComp: "Compound Vowel",
    nodeExamples: "Syllables", nodeFamily: "Phonological family",
    nodeBatchim: "Batchim", nodeHarmony: "Vowel harmony",
    echoLabel: "Resonating",
    vHear: "Hear", vWrite: "Write",
    qMode: "What sound?",
    qCorrect: "✦ Correct!", qWrong: ans => `✕ Answer: ${ans}`,
    qNext: "Next →", qRestart: "Restart ◎",
    qDone: (c, t) => `Attunement complete — ${c} of ${t}`,
    writeHint: "Follow the arrows, then draw",
    sylTitle: "Syllable Structure",
    sylInfo: "Every Korean syllable is a <strong>square block</strong> of 2–3 letters. Formula: <strong>C + V</strong> or <strong>C + V + C</strong>",
    sylLabels: { cons: "consonant", vowel: "vowel", batchim: "batchim" },
  },
};

// ── STROKE ORDER DATA ─────────────────────────────────────────
const SD = {
  'ㄱ':[{p:[[30,48],[168,48]],n:1},{p:[[168,48],[168,168]],n:2}],
  'ㄴ':[{p:[[38,42],[38,165]],n:1},{p:[[38,165],[165,165]],n:2}],
  'ㄷ':[{p:[[30,42],[165,42]],n:1},{p:[[30,42],[30,162]],n:2},{p:[[30,162],[165,162]],n:3}],
  'ㄹ':[{p:[[30,48],[165,48]],n:1},{p:[[165,48],[165,103]],n:2},{p:[[165,103],[30,103]],n:3},{p:[[30,103],[30,158]],n:4},{p:[[30,158],[165,158]],n:5}],
  'ㅁ':[{p:[[32,42],[165,42]],n:1},{p:[[32,42],[32,163]],n:2},{p:[[165,42],[165,163]],n:3},{p:[[32,163],[165,163]],n:4}],
  'ㅂ':[{p:[[40,42],[40,165]],n:1},{p:[[158,42],[158,165]],n:2},{p:[[40,42],[158,42]],n:3},{p:[[40,103],[158,103]],n:4},{p:[[40,165],[158,165]],n:5}],
  'ㅅ':[{p:[[100,38],[40,168]],n:1},{p:[[100,38],[160,168]],n:2}],
  'ㅇ':[{circle:true,cx:100,cy:108,r:56,n:1}],
  'ㅈ':[{p:[[30,68],[168,68]],n:1},{p:[[100,68],[40,168]],n:2},{p:[[100,68],[160,168]],n:3}],
  'ㅊ':[{p:[[82,30],[118,30]],n:1},{p:[[30,70],[168,70]],n:2},{p:[[100,70],[40,168]],n:3},{p:[[100,70],[160,168]],n:4}],
  'ㅋ':[{p:[[30,48],[165,48]],n:1},{p:[[30,48],[30,165]],n:2},{p:[[30,106],[130,106]],n:3}],
  'ㅌ':[{p:[[30,43],[165,43]],n:1},{p:[[30,43],[30,163]],n:2},{p:[[30,103],[165,103]],n:3},{p:[[30,163],[165,163]],n:4}],
  'ㅍ':[{p:[[42,42],[42,163]],n:1},{p:[[158,42],[158,163]],n:2},{p:[[42,42],[158,42]],n:3},{p:[[42,102],[158,102]],n:4}],
  'ㅎ':[{p:[[82,28],[118,28]],n:1},{p:[[30,68],[168,68]],n:2},{p:[[100,68],[100,108]],n:3},{circle:true,cx:100,cy:148,r:40,n:4}],
  'ㄲ':[{p:[[30,48],[168,48]],n:1},{p:[[168,48],[168,168]],n:2}],
  'ㄸ':[{p:[[30,42],[165,42]],n:1},{p:[[30,42],[30,162]],n:2},{p:[[30,162],[165,162]],n:3}],
  'ㅃ':[{p:[[40,42],[40,165]],n:1},{p:[[158,42],[158,165]],n:2},{p:[[40,42],[158,42]],n:3},{p:[[40,103],[158,103]],n:4},{p:[[40,165],[158,165]],n:5}],
  'ㅆ':[{p:[[100,38],[40,168]],n:1},{p:[[100,38],[160,168]],n:2}],
  'ㅉ':[{p:[[30,68],[168,68]],n:1},{p:[[100,68],[40,168]],n:2},{p:[[100,68],[160,168]],n:3}],
  'ㅏ':[{p:[[100,30],[100,170]],n:1},{p:[[100,100],[165,100]],n:2}],
  'ㅐ':[{p:[[80,30],[80,170]],n:1},{p:[[80,100],[140,100]],n:2},{p:[[140,30],[140,170]],n:3}],
  'ㅑ':[{p:[[100,30],[100,170]],n:1},{p:[[100,77],[165,77]],n:2},{p:[[100,120],[165,120]],n:3}],
  'ㅒ':[{p:[[70,30],[70,170]],n:1},{p:[[70,77],[125,77]],n:2},{p:[[70,120],[125,120]],n:3},{p:[[125,30],[125,170]],n:4}],
  'ㅓ':[{p:[[100,30],[100,170]],n:1},{p:[[35,100],[100,100]],n:2}],
  'ㅔ':[{p:[[120,30],[120,170]],n:1},{p:[[55,100],[120,100]],n:2},{p:[[55,30],[55,170]],n:3}],
  'ㅕ':[{p:[[100,30],[100,170]],n:1},{p:[[35,77],[100,77]],n:2},{p:[[35,120],[100,120]],n:3}],
  'ㅖ':[{p:[[120,30],[120,170]],n:1},{p:[[55,77],[120,77]],n:2},{p:[[55,120],[120,120]],n:3},{p:[[55,30],[55,170]],n:4}],
  'ㅗ':[{p:[[100,100],[100,168]],n:1},{p:[[30,100],[170,100]],n:2}],
  'ㅛ':[{p:[[73,100],[73,168]],n:1},{p:[[127,100],[127,168]],n:2},{p:[[30,100],[170,100]],n:3}],
  'ㅜ':[{p:[[100,32],[100,100]],n:1},{p:[[30,100],[170,100]],n:2}],
  'ㅠ':[{p:[[73,32],[73,100]],n:1},{p:[[127,32],[127,100]],n:2},{p:[[30,100],[170,100]],n:3}],
  'ㅡ':[{p:[[25,100],[175,100]],n:1}],
  'ㅣ':[{p:[[100,25],[100,175]],n:1}],
  'ㅘ':[{p:[[62,100],[62,168]],n:1},{p:[[28,100],[148,100]],n:2},{p:[[135,30],[135,170]],n:3},{p:[[135,100],[170,100]],n:4}],
  'ㅙ':[{p:[[55,100],[55,168]],n:1},{p:[[25,100],[138,100]],n:2},{p:[[110,30],[110,170]],n:3},{p:[[110,100],[148,100]],n:4},{p:[[148,30],[148,170]],n:5}],
  'ㅚ':[{p:[[62,100],[62,168]],n:1},{p:[[28,100],[165,100]],n:2},{p:[[155,25],[155,175]],n:3}],
  'ㅝ':[{p:[[62,32],[62,100]],n:1},{p:[[28,100],[150,100]],n:2},{p:[[137,30],[137,170]],n:3},{p:[[75,100],[137,100]],n:4}],
  'ㅞ':[{p:[[55,32],[55,100]],n:1},{p:[[25,100],[148,100]],n:2},{p:[[110,30],[110,170]],n:3},{p:[[75,100],[110,100]],n:4},{p:[[148,30],[148,170]],n:5}],
  'ㅟ':[{p:[[62,32],[62,100]],n:1},{p:[[25,100],[165,100]],n:2},{p:[[150,25],[150,175]],n:3}],
  'ㅢ':[{p:[[25,100],[175,100]],n:1},{p:[[130,25],[130,175]],n:2}],
};

// ── FIELD POSITIONS (% of viewport) ──────────────────────────
// Pre-defined organic positions for each of the 40 characters
const FIELD_POSITIONS = {
  // Basic consonants — left cluster
  'ㄱ':[8,20], 'ㄴ':[18,30], 'ㄷ':[26,18], 'ㄹ':[7,40],
  'ㅁ':[20,50], 'ㅂ':[10,62], 'ㅅ':[24,65], 'ㅇ':[14,78],
  'ㅈ':[28,80], 'ㅊ':[6,85], 'ㅋ':[22,90], 'ㅌ':[34,72],
  'ㅍ':[38,55], 'ㅎ':[34,38],
  // Tensed — top center cluster
  'ㄲ':[42,10], 'ㄸ':[50,8], 'ㅃ':[57,12], 'ㅆ':[64,9], 'ㅉ':[54,20],
  // Basic vowels — right cluster
  'ㅏ':[74,22], 'ㅐ':[84,18], 'ㅑ':[92,28], 'ㅒ':[88,40],
  'ㅓ':[72,35], 'ㅔ':[80,46], 'ㅕ':[90,55], 'ㅖ':[84,64],
  'ㅗ':[70,55], 'ㅛ':[76,68], 'ㅜ':[88,73], 'ㅠ':[80,82],
  'ㅡ':[70,78], 'ㅣ':[90,85],
  // Compound vowels — bottom right
  'ㅘ':[60,82], 'ㅙ':[68,90], 'ㅚ':[78,92], 'ㅝ':[88,92],
  'ㅞ':[62,93], 'ㅟ':[74,95], 'ㅢ':[85,87],
};

// ── STATE ─────────────────────────────────────────────────────
let lang = 'ro';
let mode = 'explore'; // 'explore' | 'quiz'
let currentItem = null;
let glyphMap = {};  // char → DOM element
let visitedChars = new Set();

// Quiz state
let qDeck = [], qIdx = 0, qCorrect = 0, qTotal = 0, qStreak = 0, qAnswered = false;
// Write state
let wDrawing = false, wLastX = 0, wLastY = 0;

// ── AUDIO ─────────────────────────────────────────────────────
function speakKo(text) {
  if (!('speechSynthesis' in window) || !text) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ko-KR';
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

// ── BACKGROUND PARTICLE FIELD ─────────────────────────────────
function initBg() {
  const canvas = document.getElementById('mrsBg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width  = window.innerWidth;
  const H = canvas.height = window.innerHeight;
  const pts = [];
  for (let i = 0; i < 60; i++) {
    pts.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      a: Math.random() * 0.4 + 0.05,
      sp: Math.random() * 0.4 + 0.1,
      dir: Math.random() > 0.5 ? 1 : -1,
    });
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    // Determine if dark mode
    const dark = document.body.classList.contains('dark-mode');
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = dark
        ? `rgba(180,170,255,${p.a * 0.9})`
        : `rgba(120,100,80,${p.a * 0.5})`;
      ctx.fill();
      p.y -= p.sp * 0.3;
      if (p.y < -2) p.y = H + 2;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ── COSMOS: BUILD GLYPH FIELD ─────────────────────────────────
function buildCosmos() {
  const cosmos = document.getElementById('mrsCosmos');
  cosmos.innerHTML = '';
  glyphMap = {};

  ALL_CHARS.forEach((item, i) => {
    const pos = FIELD_POSITIONS[item.char] || [50, 50];
    // Add slight jitter
    const jx = (Math.random() - 0.5) * 3;
    const jy = (Math.random() - 0.5) * 3;
    const xPct = pos[0] + jx;
    const yPct = pos[1] + jy;

    // Convert percentage to pixels, offset by character half-size
    const gx = (xPct / 100) * window.innerWidth  - 18;
    const gy = (yPct / 100) * window.innerHeight - 22;

    // Unique float parameters
    const fdur   = (4 + Math.random() * 5).toFixed(1) + 's';
    const fdel   = '-' + (Math.random() * 6).toFixed(1) + 's';
    const fx     = ((Math.random() - 0.5) * 22).toFixed(1) + 'px';
    const fy     = ((Math.random() - 0.5) * 18).toFixed(1) + 'px';
    const frot   = ((Math.random() - 0.5) * 4).toFixed(1) + 'deg';
    const frot2  = ((Math.random() - 0.5) * 4).toFixed(1) + 'deg';

    const typeClass = item.type === 'cons'   ? 'mrs-g-cons'   :
                      item.type === 'tensed' ? 'mrs-g-tensed' : 'mrs-g-vowel';

    const el = document.createElement('div');
    el.className = `mrs-glyph ${typeClass}`;
    el.setAttribute('data-char', item.char);
    el.setAttribute('data-idx', i);
    el.style.cssText = [
      `--gx:${gx}`, `--gy:${gy}`,
      `--fdur:${fdur}`, `--fdel:${fdel}`,
      `--fx:${fx}`, `--fy:${fy}`,
      `--frot:${frot}`, `--frot2:${frot2}`,
    ].join(';');

    el.innerHTML = `
      <div class="mrs-glyph-char">${item.char}</div>
      <div class="mrs-glyph-rom">${item.rom}</div>`;

    // Entrance delay
    el.style.animationDelay = fdel;
    el.style.opacity = '0';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transition = 'opacity .4s';
    }, 80 + i * 30);

    el.addEventListener('click', () => openVortex(item));

    cosmos.appendChild(el);
    glyphMap[item.char] = el;
  });
}

// ── VORTEX: FOCUS A CHARACTER ─────────────────────────────────
function openVortex(item) {
  currentItem = item;
  visitedChars.add(item.char);
  if (glyphMap[item.char]) glyphMap[item.char].classList.add('mrs-visited');

  const t = T[lang];
  document.getElementById('mrsVGlyph').textContent = item.char;
  document.getElementById('mrsVRom').textContent   = item.rom;

  // Determine type label
  const isComp = VOWELS_COMP.some(v => v.char === item.char);
  const typeLabel = item.type === 'cons'   ? t.typeCons   :
                    item.type === 'tensed' ? t.typeTensed :
                    isComp                 ? t.typeVowelComp : t.typeVowel;
  document.getElementById('mrsVType').textContent = typeLabel;

  // Action button labels
  document.getElementById('mrsVAudioLbl').textContent = t.vHear;
  document.getElementById('mrsVWriteLbl').textContent = t.vWrite;

  // Apply type-specific colour class (CSS handles animation colours)
  const vortex = document.getElementById('mrsVortex');
  vortex.className = `mrs-vortex open type-${item.type}`;

  buildVortexNodes(item);
  buildEchoPanel(item);
  activateEcho(item);
}

function closeVortex() {
  const vortex = document.getElementById('mrsVortex');
  vortex.classList.remove('open');
  // Remove type class so it doesn't linger
  vortex.className = 'mrs-vortex';
  deactivateEcho();
  currentItem = null;
}

// ── VORTEX: ORBITAL KNOWLEDGE NODES ──────────────────────────
function buildVortexNodes(item) {
  const container = document.getElementById('mrsVNodes');
  container.innerHTML = '';
  const t = T[lang];

  const W = window.innerWidth;
  const H = window.innerHeight;
  const cx = W / 2, cy = H / 2;

  const exs = buildExamples(item);
  const family = ECHO_FAMILY[item.char] || [];

  // Node definitions: [angle_deg, delay, content_html, label]
  const defs = [];

  // Example syllables node (top-right)
  if (exs.length) {
    const sylsHtml = exs.map(e => `<span class="mrs-v-node-syl">${e.syl}</span><span class="mrs-v-node-rom">${e.rom}</span>`).join('&nbsp;&nbsp;');
    defs.push({ angle: 55, delay: 0.05, title: t.nodeExamples, body: sylsHtml });
  }

  // Family resonance node (left)
  if (family.length) {
    const famHtml = family.join('&emsp;');
    defs.push({ angle: 200, delay: 0.10, title: t.nodeFamily, body: `<span style="font-size:20px;font-weight:900;">${famHtml}</span>` });
  }

  // Batchim node (bottom-left) — consonants only
  if (item.type === 'cons' || item.type === 'tensed') {
    const brow = BATCHIM_ROWS[lang].find(r => r.chars.includes(item.char));
    if (brow) {
      defs.push({ angle: 290, delay: 0.15, title: t.nodeBatchim, body: `${brow.chars} → <strong>${brow.sound}</strong><br><small>${brow.ex}</small>` });
    }
  }

  // Vowel harmony node (bottom-right) — vowels only
  if (item.type === 'vowel') {
    const bright = ['ㅏ','ㅗ','ㅑ','ㅛ','ㅘ','ㅙ'];
    const isB = bright.includes(item.char);
    const harmony = lang === 'ro'
      ? (isB ? 'Vocalǎ <strong>pozitivǎ</strong> — folosește terminații cu ㅏ' : 'Vocalǎ <strong>negativǎ</strong> — folosește terminații cu ㅓ')
      : (isB ? '<strong>Bright</strong> vowel — use ㅏ verb endings' : '<strong>Dark</strong> vowel — use ㅓ verb endings');
    defs.push({ angle: 310, delay: 0.15, title: t.nodeHarmony, body: harmony });
  }

  // Calculate orbital radius as fraction of screen
  const radius = Math.min(W, H) * 0.32;

  defs.forEach(d => {
    const rad = d.angle * Math.PI / 180;
    const nx  = cx + Math.cos(rad) * radius;
    const ny  = cy + Math.sin(rad) * radius;
    const ox  = (Math.cos(rad) * 40).toFixed(0) + 'px';
    const oy  = (Math.sin(rad) * 40).toFixed(0) + 'px';

    const node = document.createElement('div');
    node.className = 'mrs-v-node';
    node.style.cssText = `
      left:${nx}px; top:${ny}px;
      transform: translate(-50%,-50%);
      --ndelay:${d.delay}s; --nox:${ox}; --noy:${oy};
    `;
    node.innerHTML = `
      <div class="mrs-v-node-title">${d.title}</div>
      ${d.body}`;
    container.appendChild(node);
  });
}

// ── VORTEX: PHONOLOGICAL ECHO PANEL ──────────────────────────
function buildEchoPanel(item) {
  const panel = document.getElementById('mrsVEcho');
  const family = ECHO_FAMILY[item.char] || [];
  if (!family.length) { panel.style.display = 'none'; return; }
  panel.style.display = 'flex';
  const t = T[lang];
  panel.innerHTML = `
    <span class="mrs-v-echo-label">${t.echoLabel}</span>
    ${family.map(c => `<span class="mrs-v-echo-char" style="color:var(--mrs-v-rom)">${c}</span>`).join('')}`;
}

function activateEcho(item) {
  const family = ECHO_FAMILY[item.char] || [];
  family.forEach(c => {
    if (glyphMap[c]) glyphMap[c].classList.add('mrs-echoing');
  });
}
function deactivateEcho() {
  document.querySelectorAll('.mrs-echoing').forEach(el => el.classList.remove('mrs-echoing'));
}

// ── QUIZ (ATTUNEMENT) ─────────────────────────────────────────
const QUIZ_POOL = ALL_CHARS;
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function initQuiz() {
  qDeck     = shuffle(QUIZ_POOL);
  qIdx      = 0; qCorrect = 0; qTotal = 0; qStreak = 0;
  qAnswered = false;
  renderQ();
  updateQHud();
}

function renderQ() {
  const q = qDeck[qIdx];
  const t = T[lang];
  const qChar = document.getElementById('mrsQChar');
  qChar.textContent = q.char;

  // Color the question character
  if (q.type === 'cons')   qChar.style.color = 'var(--mrs-cons)';
  else if (q.type === 'tensed') qChar.style.color = 'var(--mrs-tensed)';
  else                     qChar.style.color = 'var(--mrs-vowel)';

  document.getElementById('mrsQPrompt').textContent   = t.qMode;
  document.getElementById('mrsQFeedback').textContent = '';
  document.getElementById('mrsQFeedback').className   = 'mrs-q-feedback';
  document.getElementById('mrsQFill').style.width = `${(qIdx / qDeck.length) * 100}%`;

  const wrongs  = shuffle(QUIZ_POOL.filter(x => x.rom !== q.rom)).slice(0, 3).map(x => x.rom);
  const options = shuffle([q.rom, ...wrongs]);

  const grid = document.getElementById('mrsQOpts');
  grid.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className   = 'mrs-q-opt';
    btn.textContent = opt;
    btn.onclick     = () => checkQ(btn, opt, q.rom, q.speak);
    grid.appendChild(btn);
  });

  qAnswered = false;
}

function checkQ(btn, chosen, correct, speak) {
  if (qAnswered) return;
  qAnswered = true;
  qTotal++;
  document.querySelectorAll('.mrs-q-opt').forEach(b => b.disabled = true);
  const fb = document.getElementById('mrsQFeedback');
  const t  = T[lang];

  if (chosen === correct) {
    btn.classList.add('q-ok');
    qCorrect++; qStreak++;
    fb.textContent = t.qCorrect;
    fb.className = 'mrs-q-feedback ok';
    speakKo(speak);
    // Ripple effect
    const center = document.querySelector('.mrs-q-center');
    center.classList.add('ripple-ok');
    setTimeout(() => center.classList.remove('ripple-ok'), 700);
  } else {
    btn.classList.add('q-err');
    qStreak = 0;
    document.querySelectorAll('.mrs-q-opt').forEach(b => {
      if (b.textContent === correct) b.classList.add('q-ok');
    });
    fb.textContent = t.qWrong(correct);
    fb.className = 'mrs-q-feedback err';
  }

  updateQHud();

  setTimeout(() => {
    qIdx++;
    if (qIdx >= qDeck.length) { showQSummary(); return; }
    renderQ();
  }, 1100);
}

function showQSummary() {
  const t = T[lang];
  const qChar = document.getElementById('mrsQChar');
  qChar.textContent = '◎';
  qChar.style.color = 'var(--mrs-q-fill)';
  document.getElementById('mrsQPrompt').textContent   = t.qDone(qCorrect, qDeck.length);
  document.getElementById('mrsQFeedback').textContent = '';
  document.getElementById('mrsQOpts').innerHTML       = '';
  document.getElementById('mrsQFill').style.width     = '100%';

  const restartBtn = document.createElement('button');
  restartBtn.className   = 'mrs-q-opt';
  restartBtn.textContent = t.qRestart;
  restartBtn.style.gridColumn = '1 / -1';
  restartBtn.style.marginTop  = '8px';
  restartBtn.onclick = initQuiz;
  document.getElementById('mrsQOpts').appendChild(restartBtn);
}

function updateQHud() {
  document.getElementById('mrsQOk').textContent     = `✦ ${qCorrect}`;
  document.getElementById('mrsQStreak').textContent = `⚡ ${qStreak}`;
}

// ── RULES STREAM ──────────────────────────────────────────────
function buildRules(filter) {
  const t     = T[lang];
  const rules = RULES[lang];
  const list  = document.getElementById('mrsRulesList');
  const q     = (filter || '').toLowerCase();
  list.innerHTML = '';
  rules.forEach(r => {
    if (q && !r.ko.toLowerCase().includes(q) && !r.label.toLowerCase().includes(q) && !r.text.toLowerCase().includes(q)) return;
    const item = document.createElement('div');
    item.className = 'mrs-rule-item';
    item.innerHTML = `
      <span class="mrs-rule-ko">${r.ko}</span>
      <span class="mrs-rule-label">${r.label}</span>
      <div class="mrs-rule-text">${r.text}</div>`;
    list.appendChild(item);
  });
  document.getElementById('mrsRulesTitle').textContent = t.rulesTitle;
}

// ── SYLLABLE STRUCTURE PANEL ──────────────────────────────────
function buildSylPanel() {
  const t       = T[lang];
  const content = document.getElementById('mrsSylContent');
  const labs    = t.sylLabels;

  const rows = [
    { parts: ['ㄱ', 'ㅗ'], labels: [labs.cons, labs.vowel], result: '고', rom:'go' },
    { parts: ['ㅎ', 'ㅏ', 'ㄴ'], labels: [labs.cons, labs.vowel, labs.batchim], result: '한', rom:'han' },
    { parts: ['ㄱ', 'ㅜ', 'ㄱ'], labels: [labs.cons, labs.vowel, labs.batchim], result: '국', rom:'guk' },
  ];

  content.innerHTML = `<div class="mrs-syl-title">${t.sylTitle}</div>
    <div class="mrs-syl-info">${t.sylInfo}</div>`;

  rows.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'mrs-syl-row';
    row.parts.forEach((p, i) => {
      if (i > 0) { const op = document.createElement('div'); op.className = 'mrs-syl-op'; op.textContent = '+'; rowEl.appendChild(op); }
      const block = document.createElement('div');
      block.innerHTML = `<div class="mrs-syl-block">${p}</div><div class="mrs-syl-block-label">${row.labels[i]}</div>`;
      rowEl.appendChild(block);
    });
    const arrow = document.createElement('div');
    arrow.className = 'mrs-syl-op'; arrow.textContent = '→';
    rowEl.appendChild(arrow);
    const res = document.createElement('div');
    res.innerHTML = `<div class="mrs-syl-block mrs-syl-result">${row.result}</div><div class="mrs-syl-block-label">${row.rom}</div>`;
    rowEl.appendChild(res);
    content.appendChild(rowEl);
  });
}

// ── WRITING RITUAL ────────────────────────────────────────────
function renderStrokes(char) {
  const svg    = document.getElementById('mWriteArrows');
  const data   = SD[char];
  if (!data || !data.length) { svg.innerHTML = ''; return; }
  // Resolve colors without CSS variables (SVG attributes don't reliably support them)
  const isDark = document.body.classList.contains('dark-mode');
  const stroke = isDark ? '#F472B6' : '#DB2777';
  const badge  = isDark ? '#818CF8' : '#3730A3';
  const AID    = 'wArrow2';
  let h = `<defs><marker id="${AID}" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
    <polygon points="0 0,8 3,0 6" fill="${stroke}" opacity=".9"/>
  </marker></defs>`;
  data.forEach(s => {
    if (s.circle) {
      h += `<circle cx="${s.cx}" cy="${s.cy}" r="${s.r}"
        fill="none" stroke="${stroke}" stroke-width="2.5"
        stroke-dasharray="6 3" opacity=".70"/>`;
      h += `<line x1="${s.cx}" y1="${s.cy-s.r}" x2="${s.cx+1}" y2="${s.cy-s.r}"
        stroke="${stroke}" stroke-width="2" marker-end="url(#${AID})" opacity=".9"/>`;
      h += numCircle(s.cx, s.cy - s.r - 14, s.n, badge);
    } else {
      const [x1,y1] = s.p[0], [x2,y2] = s.p[s.p.length-1];
      if (s.p.length === 2) {
        h += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
          stroke="${stroke}" stroke-width="2.5" stroke-linecap="round"
          marker-end="url(#${AID})" opacity=".72"/>`;
      } else {
        const d = s.p.map((p,i) => `${i?'L':'M'}${p[0]},${p[1]}`).join(' ');
        h += `<path d="${d}" fill="none" stroke="${stroke}"
          stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
          marker-end="url(#${AID})" opacity=".72"/>`;
      }
      h += numCircle(x1, y1, s.n, badge);
    }
  });
  svg.innerHTML = h;
}
function numCircle(cx, cy, n, badge) {
  const col = badge || '#3730A3';
  return `<circle cx="${cx}" cy="${cy}" r="10" fill="${col}" opacity=".88"/>
  <text x="${cx}" y="${cy+4}" text-anchor="middle" fill="white" font-size="11"
    font-weight="bold" font-family="sans-serif">${n}</text>`;
}
function clearBoard() {
  const c = document.getElementById('wCanvas');
  if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height);
}
function initBoard() {
  const canvas    = document.getElementById('wCanvas');
  const ctx       = canvas.getContext('2d');
  // Canvas cannot resolve CSS custom properties — use computed fallback
  const drawColor = document.body.classList.contains('dark-mode') ? '#F472B6' : '#DB2777';
  ctx.strokeStyle = drawColor;
  ctx.lineWidth   = 9;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';
  function pos(e) {
    const r  = canvas.getBoundingClientRect();
    const sx = canvas.width / r.width, sy = canvas.height / r.height;
    return [(e.clientX - r.left)*sx, (e.clientY - r.top)*sy];
  }
  canvas.onpointerdown = e => {
    canvas.setPointerCapture(e.pointerId);
    wDrawing = true;
    [wLastX, wLastY] = pos(e);
    ctx.beginPath(); ctx.arc(wLastX, wLastY, 4.5, 0, Math.PI*2);
    ctx.fillStyle = drawColor; ctx.fill();
  };
  canvas.onpointermove = e => {
    if (!wDrawing) return;
    const [x,y] = pos(e);
    ctx.beginPath(); ctx.moveTo(wLastX, wLastY); ctx.lineTo(x,y); ctx.stroke();
    [wLastX, wLastY] = [x, y];
  };
  canvas.onpointerup = canvas.onpointercancel = () => { wDrawing = false; };
}
function openWriting(item) {
  currentItem = item;
  document.getElementById('mrsWriteChar').textContent = item.char;
  document.getElementById('mrsWriteRom').textContent  = item.rom;
  document.getElementById('mrsWriteGuide').textContent= item.char;
  document.getElementById('mrsWriteHint').textContent = T[lang].writeHint;
  renderStrokes(item.char);
  clearBoard();
  initBoard();
  document.getElementById('mrsWriteOverlay').classList.add('open');
}

// ── LANGUAGE ──────────────────────────────────────────────────
function applyLang() {
  const t = T[lang];
  const el = id => document.getElementById(id);
  if (el('mrsZoneCons'))   el('mrsZoneCons').textContent   = t.zoneCons;
  if (el('mrsZoneTensed')) el('mrsZoneTensed').textContent = t.zoneTensed;
  if (el('mrsZoneVowels')) el('mrsZoneVowels').textContent = t.zoneVowels;
  if (el('mrsRules') && el('mrsRules').classList.contains('open')) buildRules();
  if (el('mrsSylPanel') && el('mrsSylPanel').classList.contains('open')) buildSylPanel();
  if (el('mrsQuiz') && el('mrsQuiz').classList.contains('open') && el('mrsQPrompt')) {
    el('mrsQPrompt').textContent = t.qMode;
  }
  if (currentItem) {
    buildVortexNodes(currentItem);
    buildEchoPanel(currentItem);
    if (el('mrsVAudioLbl')) el('mrsVAudioLbl').textContent = t.vHear;
    if (el('mrsVWriteLbl')) el('mrsVWriteLbl').textContent = t.vWrite;
  }
}

// ── MODE CONTROLS ─────────────────────────────────────────────
function setMode(m) {
  mode = m;
}

// ── INIT ──────────────────────────────────────────────────────
function init() {
  initBg();
  buildCosmos();
  buildRules();
  buildSylPanel();

  const el = id => document.getElementById(id);

  // Vortex events
  el('mrsVClose').onclick = closeVortex;
  el('mrsVAudio').onclick = () => currentItem && speakKo(currentItem.speak);
  el('mrsVWrite').onclick = () => {
    if (!currentItem) return;
    closeVortex();
    openWriting(currentItem);
  };
  el('mrsVortex').addEventListener('click', e => {
    if (e.target === el('mrsVortex')) closeVortex();
  });

  // Quiz exit
  el('mrsQExit').onclick = () => {
    el('mrsQuiz').classList.remove('open');
    setMode('explore');
  };

  // Rules close & search
  el('mrsRulesClose').onclick = () => el('mrsRules').classList.remove('open');
  el('mrsRulesSearch').oninput = e => buildRules(e.target.value);

  // Syllable close
  el('mrsSylClose').onclick = () => el('mrsSylPanel').classList.remove('open');

  // Writing close
  el('mrsWriteClose').onclick = () => el('mrsWriteOverlay').classList.remove('open');
  el('mrsWriteOverlay').addEventListener('click', e => {
    if (e.target === el('mrsWriteOverlay')) el('mrsWriteOverlay').classList.remove('open');
  });

  // Night mode toggle (only persistent button)
  el('mrsThemeBtn').onclick = () => {
    document.body.classList.toggle('dark-mode');
    try {
      const isDark = document.body.classList.contains('dark-mode');
      RKStorage && typeof RKStorage.set === 'function' && RKStorage.set('RK_DARK', isDark ? '1' : '0');
    } catch(e) {}
  };

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeVortex();
      el('mrsWriteOverlay').classList.remove('open');
      el('mrsSylPanel').classList.remove('open');
      el('mrsRules').classList.remove('open');
      el('mrsQuiz').classList.remove('open');
    }
  });

  // Initialize language from existing lang-picker if available
  try {
    if (typeof RKLang !== 'undefined') {
      lang = RKLang.get() || 'ro';
      RKLang.init(newLang => { lang = newLang; applyLang(); });
    }
  } catch(e) {}

  applyLang();

  window.addEventListener('resize', () => { buildCosmos(); initBg(); });
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
