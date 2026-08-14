// Romanian verb conjugator — present/trecut(perfect compus)/viitor, all 6
// persons (eu/tu/el-ea/noi/voi/ei-ele). Built for Builder's free-text
// alias generation, so learners can be recognized in any person, not just
// the 3rd-person-only forms the app used before.
//
// RO_VERB_CONJ (moved here from sentence-generator.js, which now reads it
// from window.RoConjugator instead of keeping its own copy) is a hand-built
// table of [indicative 3sg, subjunctive 3sg, past participle] for every
// distinct head verb behind the app's ~328 Korean-vocab verb/adjective RO
// glosses — the anchor this module's present-tense rules derive the other
// 5 persons from.
//
// Design principle for the present tense: NEVER derive one person's stem
// from another person's stem when Romanian metaphony can give them
// different root vowels (agăța -> agăț/agăți/agățăm/agățați but agață for
// 3sg/3pl; căuta -> caut/cauți but căutăm/căutați). Forms that pattern with
// the infinitive's own root use the infinitive stem; 3sg/3pl (often a
// different, stressed root) use the already-correct RO_VERB_CONJ anchor
// verbatim, never re-derived. Verbs where this still isn't safe (root
// alternates even in 1sg/2sg, e.g. căuta, or a closed irregular class, e.g.
// fi/avea/vrea) get an explicit, individually-verified entry in IRREGULAR
// instead of a guessed general rule.
window.RoConjugator = (function() {

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


const IRREGULAR = {
  'fi':     { pres: ['sunt','ești','este','suntem','sunteți','sunt'], part: 'fost' },
  'avea':   { pres: ['am','ai','are','avem','aveți','au'], part: 'avut' },
  'vrea':   { pres: ['vreau','vrei','vrea','vrem','vreți','vor'], part: 'vrut' },
  'putea':  { pres: ['pot','poți','poate','putem','puteți','pot'], part: 'putut' },
  'ști':    { pres: ['știu','știi','știe','știm','știți','știu'], part: 'știut' },
  'bea':    { pres: ['beau','bei','bea','bem','beți','beau'], part: 'băut' },
  'da':     { pres: ['dau','dai','dă','dăm','dați','dau'], part: 'dat' },
  'lua':    { pres: ['iau','iei','ia','luăm','luați','iau'], part: 'luat' },
  'sta':    { pres: ['stau','stai','stă','stăm','stați','stau'], part: 'stat' },
  'mânca':  { pres: ['mănânc','mănânci','mănâncă','mâncăm','mâncați','mănâncă'], part: 'mâncat' },
  'spune':  { pres: ['spun','spui','spune','spunem','spuneți','spun'], part: 'spus' },
  'pune':   { pres: ['pun','pui','pune','punem','puneți','pun'], part: 'pus' },
  'ține':   { pres: ['țin','ții','ține','ținem','țineți','țin'], part: 'ținut' },
  'veni':   { pres: ['vin','vii','vine','venim','veniți','vin'], part: 'venit' },
  'dormi':  { pres: ['dorm','dormi','doarme','dormim','dormiți','dorm'], part: 'dormit' },
  'muri':   { pres: ['mor','mori','moare','murim','muriți','mor'], part: 'murit' },
  'simți':  { pres: ['simt','simți','simte','simțim','simțiți','simt'], part: 'simțit' },
  'ieși':   { pres: ['ies','ieși','iese','ieșim','ieșiți','ies'], part: 'ieșit' },
  'crește': { pres: ['cresc','crești','crește','creștem','creșteți','cresc'], part: 'crescut' },

  // Conjugarea a II-a (-ea) — small closed class, verified individually.
  'absolvi':   { pres: ['absolv','absolvi','absolvă','absolvim','absolviți','absolvă'], part: 'absolvit' },
  'acoperi':   { pres: ['acopăr','acoperi','acoperă','acoperim','acoperiți','acoperă'], part: 'acoperit' },
  'adormi':    { pres: ['adorm','adormi','adoarme','adormim','adormiți','adorm'], part: 'adormit' },
  'apărea':    { pres: ['apar','apari','apare','apărem','apăreți','apar'], part: 'apărut' },
  'auzi':      { pres: ['aud','auzi','aude','auzim','auziți','aud'], part: 'auzit' },
  'coborî':    { pres: ['cobor','cobori','coboară','coborâm','coborâți','coboară'], part: 'coborât' },
  'cădea':     { pres: ['cad','cazi','cade','cădem','cădeți','cad'], part: 'căzut' },
  'descoperi': { pres: ['descopăr','descoperi','descoperă','descoperim','descoperiți','descoperă'], part: 'descoperit' },
  'despărți':  { pres: ['despart','desparți','desparte','despărțim','despărțiți','despart'], part: 'despărțit' },
  'deveni':    { pres: ['devin','devii','devine','devenim','deveniți','devin'], part: 'devenit' },
  'dispărea':  { pres: ['dispar','dispari','dispare','dispărem','dispăreți','dispar'], part: 'dispărut' },
  'prevedea':  { pres: ['prevăd','prevezi','prevede','prevedem','prevedeți','prevăd'], part: 'prevăzut' },
  'scădea':    { pres: ['scad','scazi','scade','scădem','scădeți','scad'], part: 'scăzut' },
  'vedea':     { pres: ['văd','vezi','vede','vedem','vedeți','văd'], part: 'văzut' },
  'împărți':   { pres: ['împart','împarți','împarte','împărțim','împărțiți','împart'], part: 'împărțit' },
  'plăcea':    { pres: ['plac','placi','place','plăcem','plăceți','plac'], part: 'plăcut' },

  // "-ia" verbs whose 3sg ends in "-ie"/"-aie" (not "-(i)ază").
  'apropia':   { pres: ['apropii','apropii','apropie','apropiem','apropiați','apropie'], part: 'apropiat' },
  'speria':    { pres: ['sperii','sperii','sperie','speriem','speriați','sperie'], part: 'speriat' },
  'tăia':      { pres: ['tai','tai','taie','tăiem','tăiați','taie'], part: 'tăiat' },

  // ă/a and u/oa root-alternating Class I verbs — lexically idiosyncratic
  // (compare căuta: caut not căut, vs. spăla: spăl not spal), each verified
  // individually rather than derived by a general rule.
  'lăsa':      { pres: ['las','lași','lasă','lăsăm','lăsați','lasă'], part: 'lăsat' },
  'căuta':     { pres: ['caut','cauți','caută','căutăm','căutați','caută'], part: 'căutat' },
  'juca':      { pres: ['joc','joci','joacă','jucăm','jucați','joacă'], part: 'jucat' },
  'ruga':      { pres: ['rog','rogi','roagă','rugăm','rugați','roagă'], part: 'rugat' },
  'scăpa':     { pres: ['scap','scapi','scapă','scăpăm','scăpați','scapă'], part: 'scăpat' },
  'purta':     { pres: ['port','porți','poartă','purtăm','purtați','poartă'], part: 'purtat' },
  'prezenta':  { pres: ['prezint','prezinți','prezintă','prezentăm','prezentați','prezintă'], part: 'prezentat' },
  'apăsa':     { pres: ['apăs','apeși','apasă','apăsăm','apăsați','apasă'], part: 'apăsat' },
  'descărca':  { pres: ['descarc','descarci','descarcă','descărcăm','descărcați','descarcă'], part: 'descărcat' },
  'dezbrăca':  { pres: ['dezbrac','dezbraci','dezbracă','dezbrăcăm','dezbrăcați','dezbracă'], part: 'dezbrăcat' },
  'îmbrăca':   { pres: ['îmbrac','îmbraci','îmbracă','îmbrăcăm','îmbrăcați','îmbracă'], part: 'îmbrăcat' },
  'împăca':    { pres: ['împac','împaci','împacă','împăcăm','împăcați','împacă'], part: 'împăcat' },
  'încărca':   { pres: ['încarc','încarci','încarcă','încărcăm','încărcați','încarcă'], part: 'încărcat' },
  'agăța':     { pres: ['agăț','agăți','agață','agățăm','agățați','agață'], part: 'agățat' },
  'așeza':     { pres: ['așez','așezi','așază','așezăm','așezați','așază'], part: 'așezat' },
  'învăța':    { pres: ['învăț','înveți','învață','învățăm','învățați','învață'], part: 'învățat' },
  'spăla':     { pres: ['spăl','speli','spală','spălăm','spălați','spală'], part: 'spălat' },
  'încălța':   { pres: ['încalț','încalți','încalță','încălțăm','încălțați','încalță'], part: 'încălțat' },
  'prelua':    { pres: ['preiau','preiei','preia','preluăm','preluați','preiau'], part: 'preluat' }, // compound of the irregular "lua"
};

// Safe, fully regular diphthongization (e->ea, o->oa, or the ie->ia glide
// variant) affecting ONLY the 3rd-person stem — 1sg/2sg/1pl/2pl keep the
// infinitive's plain vowel, so no lexical lookup is needed for those.
// (Root swaps that also change 1sg, like căuta->caut, are NOT this pattern
// and stay in the IRREGULAR table above.)
function isDiphthongOnly(infStem, anchorStem){
  if (anchorStem.length === infStem.length + 1) {
    let i = 0;
    while (i < infStem.length && infStem[i] === anchorStem[i]) i++;
    if (i === 0) return false;
    const precedingVowel = infStem[i-1];
    const insertedChar = anchorStem[i];
    if ((precedingVowel==='e'||precedingVowel==='o') && insertedChar==='a' && infStem.slice(i) === anchorStem.slice(i+1)) return true;
  }
  if (anchorStem.length === infStem.length) {
    let i = 0;
    while (i < infStem.length && infStem[i] === anchorStem[i]) i++;
    if (i > 0 && infStem[i]==='e' && anchorStem[i]==='a' && infStem.slice(i+1) === anchorStem.slice(i+1)) return true;
  }
  return false;
}

function class1_2sg(stem){
  if (stem.endsWith('t')) return stem.slice(0,-1) + 'ți';
  return stem + 'i';
}
function palatalize2sg(stem){
  if (stem.endsWith('d')) return stem.slice(0,-1) + 'zi';
  if (stem.endsWith('t')) return stem.slice(0,-1) + 'ți';
  return stem + 'i';
}

function conjugatePresent(inf, anchor3sg){
  const irr = IRREGULAR[inf];
  if (irr) return irr.pres;

  if (inf.endsWith('ea')) return null;

  if (inf.endsWith('ia') && anchor3sg && (anchor3sg.endsWith('iază'))) {
    // "-ia" verbs taking the -ez infix (studia, machia, fotografia): the
    // infix fuses with the stem's trailing "i" (studiez, not studi-ez),
    // and 1pl/2pl use -em/-ați rather than Class I's usual -ăm/-ați.
    const stem = inf.slice(0, -1); // e.g. "studia" -> "studi"
    return [stem+'ez', stem+'ezi', anchor3sg, stem+'em', stem+'ați', anchor3sg];
  }

  if (inf.endsWith('a')) {
    const stem = inf.slice(0, -1);
    if (anchor3sg && anchor3sg.endsWith('ează')) {
      return [stem+'ez', stem+'ezi', anchor3sg, stem+'ăm', stem+'ați', anchor3sg];
    }
    if (!anchor3sg) return null;
    const anchorStem = anchor3sg.endsWith('ă') ? anchor3sg.slice(0, -1) : anchor3sg;
    if (anchorStem !== stem && !isDiphthongOnly(stem, anchorStem)) return null;
    return [stem, class1_2sg(stem), anchor3sg, stem+'ăm', stem+'ați', anchor3sg];
  }

  if (inf.endsWith('i') || inf.endsWith('î')) {
    const stem = inf.slice(0, -1);
    if (anchor3sg && anchor3sg.endsWith('ește')) {
      const s = anchor3sg.slice(0, -4);
      return [s+'esc', s+'ești', anchor3sg, stem+'im', stem+'iți', s+'esc'];
    }
    return null;
  }

  if (inf.endsWith('e')) {
    const stem = inf.slice(0, -1);
    const vowelFinal = /[aeiouăâî]$/.test(stem);
    const p1sg = vowelFinal ? stem + 'u' : stem;
    const p2sg = palatalize2sg(stem);
    const p3sg = anchor3sg || inf;
    if (p3sg !== inf) return null;
    return [p1sg, p2sg, p3sg, stem+'em', stem+'eți', p1sg];
  }

  return null;
}

function participle(inf, givenPart){
  const irr = IRREGULAR[inf];
  if (irr) return irr.part;
  return givenPart || null;
}

// ── Gloss parsing (marker + head verb) ──────────────────────────────────
// Mirrors sentence-generator.js's own parseRoVerbGloss (kept separate,
// small, unlikely to diverge) — needed here to turn a full RO gloss like
// "a se odihni" into its head verb ("odihni") + pronoun marker ("se")
// before conjugating, and to reattach the right clitic pronoun per person.
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
function parseRoVerbGloss(ro) {
  const first = firstAlt(ro);
  const markers = [[/^a nu-i /, 'nu-i'], [/^a nu /, 'nu'], [/^a-ți /, 'ți'], [/^a-și /, 'și'], [/^a-i /, 'i'], [/^a se /, 'se'], [/^a /, null]];
  let marker = undefined, rest = first;
  for (const [re, m] of markers) {
    if (re.test(first)) { rest = first.replace(re, ''); marker = m; break; }
  }
  if (marker === undefined) return null;
  const parts = rest.split(' ');
  const head = parts[0];
  let tail = parts.slice(1).join(' ').trim();
  if (/^\(.*\)$/.test(tail)) tail = '';
  return { marker, head, tail };
}

// ── Clitic pronouns per marker, per person [eu,tu,el/ea,noi,voi,ei/ele] ──
// Only 'se' (reflexive) and 'și' (dative-reflexive short form) have a
// natural 6-person subject paradigm. 'i'/'ți' ("a-i place cuiva" — dative-
// experiencer constructions like "to like") and 'nu-i' don't vary by
// grammatical subject the same way, so they're left to the caller's
// existing 3rd-person-only handling rather than forced into an unnatural
// 6-person form.
const CLITIC = {
  se: { pres: ['mă','te','se','ne','vă','se'], past: ['m-am','te-ai','s-a','ne-am','v-ați','s-au'] },
  și: { pres: ['îmi','îți','își','ne','vă','își'], past: ['mi-am','ți-ai','și-a','ne-am','v-ați','și-au'] },
  nu: { pres: ['nu','nu','nu','nu','nu','nu'], past: ['nu am','nu ai','nu a','nu am','nu ați','nu au'] },
};

const AUX_AVEA = ['am','ai','a','am','ați','au']; // perfect compus auxiliary (distinct from "avea" as a full verb)
const VIITOR_AUX = ['voi','vei','va','vom','veți','vor'];

// Public API: given a full RO gloss ("a mânca", "a se odihni", "a aduce
// cuiva"), return {present:[6], trecut:[6], viitor:[6]}, each already
// including the clitic pronoun where the marker has a natural 6-person
// form, or null if the gloss can't be parsed/conjugated.
function conjugate(ro) {
  const parsed = parseRoVerbGloss(ro);
  if (!parsed) return null;
  const { marker, head, tail } = parsed;
  const anchor = RO_VERB_CONJ[head];
  const pres = conjugatePresent(head, anchor ? anchor[0] : null);
  if (!pres) return null;
  const part = participle(head, anchor ? anchor[2] : null);
  const suffix = tail ? ' ' + tail : '';

  if (marker === 'se' || marker === 'și') {
    const clitic = CLITIC[marker];
    const present = pres.map((f, i) => clitic.pres[i] + ' ' + f + suffix);
    // Clitic pronoun precedes the aux in viitor too: "mă voi odihni", not
    // "voi mă odihni".
    const viitor = VIITOR_AUX.map((v, i) => clitic.pres[i] + ' ' + v + ' ' + head + suffix);
    const trecut = part ? clitic.past.map(p => p + ' ' + part + suffix) : null;
    return { present, trecut, viitor };
  }
  if (marker === 'nu') {
    const present = pres.map(f => 'nu ' + f + suffix);
    const viitor = VIITOR_AUX.map(v => 'nu ' + v + ' ' + head + suffix);
    const trecut = part ? AUX_AVEA.map(a => 'nu ' + a + ' ' + part + suffix) : null;
    return { present, trecut, viitor };
  }
  // no marker (plain verb), or 'i'/'ți'/'nu-i' (dative-experiencer —
  // no natural 6-person subject form; return the bare head-verb paradigm
  // and let the caller decide whether/how to use it).
  const present = pres.map(f => f + suffix);
  const viitor = VIITOR_AUX.map(v => v + ' ' + head + suffix);
  const trecut = part ? AUX_AVEA.map(a => a + ' ' + part + suffix) : null;
  return { present, trecut, viitor };
}

return { RO_VERB_CONJ, IRREGULAR, conjugatePresent, participle, parseRoVerbGloss, firstAlt, conjugate };

})();
