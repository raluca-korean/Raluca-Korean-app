(function(){
  'use strict';

  var UI = {
    ro: {
      placeholder: "Scrie aici o propoziție sau un lanț de propoziții...",
      defaultTranslation: "Configurează propoziția din tabel.",
      noSpeech: "Nu există propoziție de redat.",
      recordStart: "Înregistrare pornită.",
      recordStop: "Înregistrare oprită. Poți asculta mai jos.",
      recordUnsupported: "Înregistrarea audio nu este disponibilă pe acest browser.",
      recordedLabel: "Înregistrarea ta",
      noSentenceToSave: "Nicio propoziție de salvat.",
      alreadySaved: "Deja salvat ✓",
      saved: "Salvat ✓",
      savedTitle: "Propoziții salvate",
      quizLabel: "🎯 Quiz — reconstruiește în coreeană:",
      quizCheck: "✓ Verifică",
      quizExit: "✕ Ieși",
      quizCorrect: "🎉 Corect!",
      quizWrong: "✗ Greșit",
      quizAnswer: "Răspuns corect:",
      quizNoBuild: "Construiește mai întâi o propoziție."
    },
    en: {
      placeholder: "Type a sentence or a chain of sentences here...",
      defaultTranslation: "Configure the sentence from the table.",
      noSpeech: "There is no sentence to play.",
      recordStart: "Recording started.",
      recordStop: "Recording stopped. You can listen below.",
      recordUnsupported: "Audio recording is not available on this browser.",
      recordedLabel: "Your recording",
      noSentenceToSave: "No sentence to save.",
      alreadySaved: "Already saved ✓",
      saved: "Saved ✓",
      savedTitle: "Saved sentences",
      quizLabel: "🎯 Quiz — reconstruct in Korean:",
      quizCheck: "✓ Check",
      quizExit: "✕ Exit",
      quizCorrect: "🎉 Correct!",
      quizWrong: "✗ Wrong",
      quizAnswer: "Correct answer:",
      quizNoBuild: "Build a sentence first."
    }
  };

  var TABLE_HEADERS_KO = {
    topic: '주어',
    topic2: '주어 2',
    associate: '관련 인물',
    time: '시간',
    departure: '장소',
    transit: '맥락',
    numeral: '수사',
    quantifier: '분류사',
    embSub: '내포절 주어',
    embPred: '내포절 술어',
    object1: '목적어 1',
    beneficiary: '수혜자',
    object2: '목적어 2',
    adverb: '부사 / 형용사',
    adverb2: '부사 / 형용사 2',
    verb: '동사',
    connector: '연결어'
  };

  var TABLE_PLACEHOLDERS_KO = {
    topic: '선택',
    topic2: '선택',
    associate: '선택',
    time: '선택',
    departure: '선택',
    transit: '선택',
    numeral: '선택',
    quantifier: '선택',
    embSub: '선택',
    embPred: '선택',
    object1: '선택',
    beneficiary: '선택',
    object2: '선택',
    adverb: '선택',
    adverb2: '선택',
    verb: '선택',
    connector: '선택'
  };

  var FIELD_LABELS = {
    ro: {
      topic: 'subiect',
      topic2: 'subiect 2',
      associate: 'participant asociat',
      time: 'timp',
      departure: 'loc',
      transit: 'context',
      numeral: 'numeral',
      quantifier: 'cuantificator',
      embSub: 'subiect subord.',
      embPred: 'predicat subord.',
      object1: 'obiect 1',
      beneficiary: 'beneficiar',
      object2: 'obiect 2',
      adverb: 'adjectiv / adverb',
      adverb2: 'adjectiv / adverb 2',
      verb: 'verb',
      connector: 'conector'
    },
    en: {
      topic: 'subject',
      topic2: 'subject 2',
      associate: 'associated participant',
      time: 'time',
      departure: 'place',
      transit: 'context',
      numeral: 'numeral',
      quantifier: 'quantifier',
      embSub: 'embedded subject',
      embPred: 'embedded predicate',
      object1: 'object 1',
      beneficiary: 'beneficiary',
      object2: 'object 2',
      adverb: 'adjective / adverb',
      adverb2: 'adjective / adverb 2',
      verb: 'verb',
      connector: 'connector'
    }
  };

  var FIELD_BINDINGS = {
    topic: 'subject',
    time: 'time',
    departure: 'location',
    object1: 'object',
    adverb: 'description',
    verb: 'verb',
    connector: 'connector'
  };

  var ALL_FIELD_KEYS = [
    'topic','topic2','associate','time','departure','transit',
    'numeral','quantifier','embSub','embPred',
    'object1','beneficiary','object2',
    'adverb','adverb2','verb','connector'
  ];

  var FIELD_META = {
    topic:      { key:'topic',      kind:'subject' },
    topic2:     { key:'topic2',     kind:'subject' },
    associate:  { key:'associate',  kind:'associate' },
    time:       { key:'time',       kind:'time' },
    departure:  { key:'departure',  kind:'location' },
    transit:    { key:'transit',    kind:'location' },
    numeral:    { key:'numeral',    kind:'object' },
    quantifier: { key:'quantifier', kind:'object' },
    embSub:     { key:'embSub',     kind:'emb_subject' },
    embPred:    { key:'embPred',    kind:'emb_pred' },
    object1:    { key:'object1',    kind:'object' },
    beneficiary:{ key:'beneficiary',kind:'beneficiary' },
    object2:    { key:'object2',    kind:'object' },
    adverb:     { key:'adverb',     kind:'description' },
    adverb2:    { key:'adverb2',    kind:'description' },
    verb:       { key:'verb',       kind:'verb' },
    connector:  { key:'connector',  kind:'connector' }
  };

  var LEVEL_FIELDS = {
    1: ['topic','object1','verb','connector'],
    2: ['topic','time','departure','object1','verb','connector'],
    3: ['topic','time','departure','object1','adverb','verb','connector'],
    4: ['topic','time','departure','embSub','embPred','object1','adverb','verb','connector'],
    5: ['topic','time','departure','embSub','embPred','object1','object2','adverb','verb','connector'],
    6: ['topic','topic2','time','departure','transit','embSub','embPred','object1','object2','adverb','adverb2','verb','connector']
  };

  var TEMPLATES = [
    {
      id:'sv',
      code:'S + V',
      ro:'Subiect + Verb',
      en:'Subject + Verb',
      fields:['topic','verb']
    },
    {
      id:'sov',
      code:'S + O + V',
      ro:'Subiect + Obiect + Verb',
      en:'Subject + Object + Verb',
      fields:['topic','object1','verb']
    },
    {
      id:'tsv',
      code:'T + S + V',
      ro:'Timp + Subiect + Verb',
      en:'Time + Subject + Verb',
      fields:['time','topic','verb']
    },
    {
      id:'slv',
      code:'S + L + V',
      ro:'Subiect + Loc + Verb',
      en:'Subject + Place + Verb',
      fields:['topic','departure','verb']
    },
    {
      id:'tsov',
      code:'T + S + O + V',
      ro:'Timp + Subiect + Obiect + Verb',
      en:'Time + Subject + Object + Verb',
      fields:['time','topic','object1','verb']
    },
    {
      id:'slov',
      code:'S + L + O + V',
      ro:'Subiect + Loc + Obiect + Verb',
      en:'Subject + Place + Object + Verb',
      fields:['topic','departure','object1','verb']
    },
    {
      id:'full',
      code:'T + S + L + O + A + V',
      ro:'Timp + Sub. + Loc + Obiect + Adverb + Verb',
      en:'Time + Sub. + Place + Object + Adverb + Verb',
      fields:['time','topic','departure','object1','adverb','verb']
    }
  ];

  var DATA = {}; // populated from data/builder-vocab.json — see the fetch + init() call at the end of this file

  var VERB_FINITE_MAP = {
    '공부하다': {ro:{i:'studiez',you_sg:'studiezi',you_pl:'studiați',we:'studiem',third:'studiază',third_pl:'studiază'}, en:{i:'study',you_sg:'study',you_pl:'study',we:'study',third:'studies',third_pl:'study'}},
    '먹다':     {ro:{i:'mănânc',you_sg:'mănânci',you_pl:'mâncați',we:'mâncăm',third:'mănâncă',third_pl:'mănâncă'}, en:{i:'eat',you_sg:'eat',you_pl:'eat',we:'eat',third:'eats',third_pl:'eat'}},
    '가다':     {ro:{i:'merg',you_sg:'mergi',you_pl:'mergeți',we:'mergem',third:'merge',third_pl:'merg'}, en:{i:'go',you_sg:'go',you_pl:'go',we:'go',third:'goes',third_pl:'go'}},
    '오다':     {ro:{i:'vin',you_sg:'vii',you_pl:'veniți',we:'venim',third:'vine',third_pl:'vin'}, en:{i:'come',you_sg:'come',you_pl:'come',we:'come',third:'comes',third_pl:'come'}},
    '보다':     {ro:{i:'văd',you_sg:'vezi',you_pl:'vedeți',we:'vedem',third:'vede',third_pl:'văd'}, en:{i:'see',you_sg:'see',you_pl:'see',we:'see',third:'sees',third_pl:'see'}},
    '읽다':     {ro:{i:'citesc',you_sg:'citești',you_pl:'citiți',we:'citim',third:'citește',third_pl:'citesc'}, en:{i:'read',you_sg:'read',you_pl:'read',we:'read',third:'reads',third_pl:'read'}},
    '쓰다':     {ro:{i:'scriu',you_sg:'scrii',you_pl:'scrieți',we:'scriem',third:'scrie',third_pl:'scriu'}, en:{i:'write',you_sg:'write',you_pl:'write',we:'write',third:'writes',third_pl:'write'}},
    '만나다':   {ro:{i:'întâlnesc',you_sg:'întâlnești',you_pl:'întâlniți',we:'întâlnim',third:'întâlnește',third_pl:'întâlnesc'}, en:{i:'meet',you_sg:'meet',you_pl:'meet',we:'meet',third:'meets',third_pl:'meet'}},
    '쉬다':     {ro:{i:'mă odihnesc',you_sg:'te odihnești',you_pl:'vă odihniți',we:'ne odihnim',third:'se odihnește',third_pl:'se odihnesc'}, en:{i:'rest',you_sg:'rest',you_pl:'rest',we:'rest',third:'rests',third_pl:'rest'}},
    '일하다':   {ro:{i:'lucrez',you_sg:'lucrezi',you_pl:'lucrați',we:'lucrăm',third:'lucrează',third_pl:'lucrează'}, en:{i:'work',you_sg:'work',you_pl:'work',we:'work',third:'works',third_pl:'work'}},
    '운동하다': {ro:{i:'fac sport',you_sg:'faci sport',you_pl:'faceți sport',we:'facem sport',third:'face sport',third_pl:'fac sport'}, en:{i:'exercise',you_sg:'exercise',you_pl:'exercise',we:'exercise',third:'exercises',third_pl:'exercise'}},
    '준비하다': {ro:{i:'pregătesc',you_sg:'pregătești',you_pl:'pregătiți',we:'pregătim',third:'pregătește',third_pl:'pregătesc'}, en:{i:'prepare',you_sg:'prepare',you_pl:'prepare',we:'prepare',third:'prepares',third_pl:'prepare'}},
    '배우다':   {ro:{i:'învăț',you_sg:'înveți',you_pl:'învățați',we:'învățăm',third:'învață',third_pl:'învață'}, en:{i:'learn',you_sg:'learn',you_pl:'learn',we:'learn',third:'learns',third_pl:'learn'}},
    '듣다':     {ro:{i:'ascult',you_sg:'asculți',you_pl:'ascultați',we:'ascultăm',third:'ascultă',third_pl:'ascultă'}, en:{i:'listen',you_sg:'listen',you_pl:'listen',we:'listen',third:'listens',third_pl:'listen'}},
    '만들다':   {ro:{i:'fac',you_sg:'faci',you_pl:'faceți',we:'facem',third:'face',third_pl:'fac'}, en:{i:'make',you_sg:'make',you_pl:'make',we:'make',third:'makes',third_pl:'make'}},
    '사다':     {ro:{i:'cumpăr',you_sg:'cumperi',you_pl:'cumpărați',we:'cumpărăm',third:'cumpără',third_pl:'cumpără'}, en:{i:'buy',you_sg:'buy',you_pl:'buy',we:'buy',third:'buys',third_pl:'buy'}},
    '주다':     {ro:{i:'dau',you_sg:'dai',you_pl:'dați',we:'dăm',third:'dă',third_pl:'dau'}, en:{i:'give',you_sg:'give',you_pl:'give',we:'give',third:'gives',third_pl:'give'}},
    '기다리다': {ro:{i:'aștept',you_sg:'aștepți',you_pl:'așteptați',we:'așteptăm',third:'așteaptă',third_pl:'așteaptă'}, en:{i:'wait',you_sg:'wait',you_pl:'wait',we:'wait',third:'waits',third_pl:'wait'}},
    '감사하다': {ro:{i:'mulțumesc',you_sg:'mulțumești',you_pl:'mulțumiți',we:'mulțumim',third:'mulțumește',third_pl:'mulțumesc'}, en:{i:'thank',you_sg:'thank',you_pl:'thank',we:'thank',third:'thanks',third_pl:'thank'}},
    '남기다':   {ro:{i:'las',you_sg:'lași',you_pl:'lăsați',we:'lăsăm',third:'lasă',third_pl:'lasă'}, en:{i:'leave',you_sg:'leave',you_pl:'leave',we:'leave',third:'leaves',third_pl:'leave'}},
    '웃다':     {ro:{i:'zâmbesc',you_sg:'zâmbești',you_pl:'zâmbiți',we:'zâmbim',third:'zâmbește',third_pl:'zâmbesc'}, en:{i:'smile',you_sg:'smile',you_pl:'smile',we:'smile',third:'smiles',third_pl:'smile'}},
    '마시다':   {ro:{i:'beau',you_sg:'bei',you_pl:'beți',we:'bem',third:'bea',third_pl:'beau'}, en:{i:'drink',you_sg:'drink',you_pl:'drink',we:'drink',third:'drinks',third_pl:'drink'}},
    '자다':     {ro:{i:'dorm',you_sg:'dormi',you_pl:'dormiți',we:'dormim',third:'doarme',third_pl:'dorm'}, en:{i:'sleep',you_sg:'sleep',you_pl:'sleep',we:'sleep',third:'sleeps',third_pl:'sleep'}},
    '노래하다': {ro:{i:'cânt',you_sg:'cânți',you_pl:'cântați',we:'cântăm',third:'cântă',third_pl:'cântă'}, en:{i:'sing',you_sg:'sing',you_pl:'sing',we:'sing',third:'sings',third_pl:'sing'}},
    '울다':     {ro:{i:'plâng',you_sg:'plângi',you_pl:'plângeți',we:'plângem',third:'plânge',third_pl:'plâng'}, en:{i:'cry',you_sg:'cry',you_pl:'cry',we:'cry',third:'cries',third_pl:'cry'}},
    '있다':     {ro:{i:'am',you_sg:'ai',you_pl:'aveți',we:'avem',third:'are',third_pl:'au'}, en:{i:'have',you_sg:'have',you_pl:'have',we:'have',third:'has',third_pl:'have'}},
    '사랑하다': {ro:{i:'iubesc',you_sg:'iubești',you_pl:'iubiți',we:'iubim',third:'iubește',third_pl:'iubesc'}, en:{i:'love',you_sg:'love',you_pl:'love',we:'love',third:'loves',third_pl:'love'}},
    '말하다':   {ro:{i:'vorbesc',you_sg:'vorbești',you_pl:'vorbiți',we:'vorbim',third:'vorbește',third_pl:'vorbesc'}, en:{i:'speak',you_sg:'speak',you_pl:'speak',we:'speak',third:'speaks',third_pl:'speak'}},
    '원하다':   {ro:{i:'vreau',you_sg:'vrei',you_pl:'vreți',we:'vrem',third:'vrea',third_pl:'vor'}, en:{i:'want',you_sg:'want',you_pl:'want',we:'want',third:'wants',third_pl:'want'}},
    '알다':     {ro:{i:'știu',you_sg:'știi',you_pl:'știți',we:'știm',third:'știe',third_pl:'știu'}, en:{i:'know',you_sg:'know',you_pl:'know',we:'know',third:'knows',third_pl:'know'}},
    '돕다':     {ro:{i:'ajut',you_sg:'ajuți',you_pl:'ajutați',we:'ajutăm',third:'ajută',third_pl:'ajută'}, en:{i:'help',you_sg:'help',you_pl:'help',we:'help',third:'helps',third_pl:'help'}},
    '되다':     {ro:{i:'devin',you_sg:'devii',you_pl:'deveniți',we:'devenim',third:'devine',third_pl:'devin'}, en:{i:'become',you_sg:'become',you_pl:'become',we:'become',third:'becomes',third_pl:'become'}},
    '성공하다': {ro:{i:'reușesc',you_sg:'reușești',you_pl:'reușiți',we:'reușim',third:'reușește',third_pl:'reușesc'}, en:{i:'succeed',you_sg:'succeed',you_pl:'succeed',we:'succeed',third:'succeeds',third_pl:'succeed'}},
    '실패하다': {ro:{i:'eșuez',you_sg:'eșuezi',you_pl:'eșuați',we:'eșuăm',third:'eșuează',third_pl:'eșuează'}, en:{i:'fail',you_sg:'fail',you_pl:'fail',we:'fail',third:'fails',third_pl:'fail'}},
    '가르치다': {ro:{i:'predau',you_sg:'predai',you_pl:'predați',we:'predăm',third:'predă',third_pl:'predau'}, en:{i:'teach',you_sg:'teach',you_pl:'teach',we:'teach',third:'teaches',third_pl:'teach'}},
    '포기하다': {ro:{i:'renunț',you_sg:'renunți',you_pl:'renunțați',we:'renunțăm',third:'renunță',third_pl:'renunță'}, en:{i:'give up',you_sg:'give up',you_pl:'give up',we:'give up',third:'gives up',third_pl:'give up'}},
    '발전하다': {ro:{i:'progresez',you_sg:'progresezi',you_pl:'progresați',we:'progresăm',third:'progresează',third_pl:'progresează'}, en:{i:'progress',you_sg:'progress',you_pl:'progress',we:'progress',third:'progresses',third_pl:'progress'}},
    '바꾸다':   {ro:{i:'schimb',you_sg:'schimbi',you_pl:'schimbați',we:'schimbăm',third:'schimbă',third_pl:'schimbă'}, en:{i:'change',you_sg:'change',you_pl:'change',we:'change',third:'changes',third_pl:'change'}},
    '결정하다': {ro:{i:'decid',you_sg:'decizi',you_pl:'decideți',we:'decidem',third:'decide',third_pl:'decid'}, en:{i:'decide',you_sg:'decide',you_pl:'decide',we:'decide',third:'decides',third_pl:'decide'}},
    '기쁘다':   {ro:{i:'sunt fericit',you_sg:'ești fericit',you_pl:'sunteți fericiți',we:'suntem fericiți',third:'este fericit',third_pl:'sunt fericiți'}, en:{i:'am happy',you_sg:'are happy',you_pl:'are happy',we:'are happy',third:'is happy',third_pl:'are happy'}},
    '화나다':   {ro:{i:'sunt supărat',you_sg:'ești supărat',you_pl:'sunteți supărați',we:'suntem supărați',third:'este supărat',third_pl:'sunt supărați'}, en:{i:'am angry',you_sg:'are angry',you_pl:'are angry',we:'are angry',third:'is angry',third_pl:'are angry'}},
    '슬프다':   {ro:{i:'sunt trist',you_sg:'ești trist',you_pl:'sunteți triști',we:'suntem triști',third:'este trist',third_pl:'sunt triști'}, en:{i:'am sad',you_sg:'are sad',you_pl:'are sad',we:'are sad',third:'is sad',third_pl:'are sad'}},
    '피곤하다': {ro:{i:'sunt obosit',you_sg:'ești obosit',you_pl:'sunteți obosiți',we:'suntem obosiți',third:'este obosit',third_pl:'sunt obosiți'}, en:{i:'am tired',you_sg:'are tired',you_pl:'are tired',we:'are tired',third:'is tired',third_pl:'are tired'}},
    '일어나다': {ro:{i:'mă trezesc',you_sg:'te trezești',you_pl:'vă treziți',we:'ne trezim',third:'se trezește',third_pl:'se trezesc'}, en:{i:'wake up',you_sg:'wake up',you_pl:'wake up',we:'wake up',third:'wakes up',third_pl:'wake up'}},
    '이해하다': {ro:{i:'înțeleg',you_sg:'înțelegi',you_pl:'înțelegeți',we:'înțelegem',third:'înțelege',third_pl:'înțeleg'}, en:{i:'understand',you_sg:'understand',you_pl:'understand',we:'understand',third:'understands',third_pl:'understand'}}
  };

  var VERB_TENSE_DATA = {
    '공부하다': {roPart:'studiat',  roBase:'studia',      enPast:'studied',   refl:false},
    '먹다':     {roPart:'mâncat',   roBase:'mânca',       enPast:'ate',       refl:false},
    '가다':     {roPart:'mers',     roBase:'merge',       enPast:'went',      refl:false},
    '오다':     {roPart:'venit',    roBase:'veni',        enPast:'came',      refl:false},
    '보다':     {roPart:'văzut',    roBase:'vedea',       enPast:'saw',       refl:false},
    '읽다':     {roPart:'citit',    roBase:'citi',        enPast:'read',      refl:false},
    '쓰다':     {roPart:'scris',    roBase:'scrie',       enPast:'wrote',     refl:false},
    '만나다':   {roPart:'întâlnit', roBase:'întâlni',     enPast:'met',       refl:false},
    '쉬다':     {roPart:'odihnit',  roBase:'odihni',      enPast:'rested',    refl:true},
    '일하다':   {roPart:'lucrat',   roBase:'lucra',       enPast:'worked',    refl:false},
    '운동하다': {roPart:'făcut sport', roBase:'face sport', enPast:'exercised', refl:false},
    '준비하다': {roPart:'pregătit', roBase:'pregăti',     enPast:'prepared',  refl:false},
    '배우다':   {roPart:'învățat',  roBase:'învăța',      enPast:'learned',   refl:false},
    '듣다':     {roPart:'ascultat', roBase:'asculta',     enPast:'listened',  refl:false},
    '만들다':   {roPart:'făcut',    roBase:'face',        enPast:'made',      refl:false},
    '사다':     {roPart:'cumpărat', roBase:'cumpăra',     enPast:'bought',    refl:false},
    '주다':     {roPart:'dat',      roBase:'da',          enPast:'gave',      refl:false},
    '기다리다': {roPart:'așteptat', roBase:'aștepta',     enPast:'waited',    refl:false},
    '감사하다': {roPart:'mulțumit', roBase:'mulțumi',     enPast:'thanked',   refl:false},
    '남기다':   {roPart:'lăsat',    roBase:'lăsa',        enPast:'left',      refl:false},
    '웃다':     {roPart:'zâmbit',   roBase:'zâmbi',       enPast:'smiled',    refl:false},
    '마시다':   {roPart:'băut',     roBase:'bea',         enPast:'drank',     refl:false},
    '자다':     {roPart:'dormit',   roBase:'dormi',       enPast:'slept',     refl:false},
    '노래하다': {roPart:'cântat',   roBase:'cânta',       enPast:'sang',      refl:false},
    '울다':     {roPart:'plâns',    roBase:'plânge',      enPast:'cried',     refl:false},
    '있다':     {roPart:'avut',     roBase:'avea',        enPast:'had',       refl:false},
    '사랑하다': {roPart:'iubit',    roBase:'iubi',        enPast:'loved',     refl:false},
    '말하다':   {roPart:'vorbit',   roBase:'vorbi',       enPast:'spoke',     refl:false},
    '원하다':   {roPart:'vrut',     roBase:'vrea',        enPast:'wanted',    refl:false},
    '알다':     {roPart:'știut',    roBase:'ști',         enPast:'knew',      refl:false},
    '돕다':     {roPart:'ajutat',   roBase:'ajuta',       enPast:'helped',    refl:false},
    '되다':     {roPart:'devenit',   roBase:'deveni',    enPast:'became',     refl:false},
    '성공하다': {roPart:'reusit',    roBase:'reusi',     enPast:'succeeded',  refl:false},
    '실패하다': {roPart:'esuat',     roBase:'esua',      enPast:'failed',     refl:false},
    '가르치다': {roPart:'predat',    roBase:'preda',     enPast:'taught',     refl:false},
    '포기하다': {roPart:'renuntat',  roBase:'renunta',   enPast:'gave up',    refl:false},
    '발전하다': {roPart:'progresat', roBase:'progresa',  enPast:'progressed', refl:false},
    '바꾸다':   {roPart:'schimbat',  roBase:'schimba',   enPast:'changed',    refl:false},
    '결정하다': {roPart:'decis',     roBase:'decide',    enPast:'decided',    refl:false},
    '기쁘다':   {roPart:'fericit',   roBase:'fi fericit', enPast:'was happy',  refl:false},
    '화나다':   {roPart:'suparat',   roBase:'fi suparat', enPast:'was angry',  refl:false},
    '슬프다':   {roPart:'trist',     roBase:'fi trist',   enPast:'was sad',    refl:false},
    '피곤하다': {roPart:'obosit',    roBase:'fi obosit',  enPast:'was tired',  refl:false},
    '일어나다': {roPart:'trezit',    roBase:'trezi',      enPast:'woke up',    refl:true},
    '이해하다': {roPart:'inteles',   roBase:'intelege',   enPast:'understood', refl:false}
  };

  var els = {
    topicSummaryText: document.getElementById('topicSummaryText'),
    topicDropdown: document.getElementById('topicDropdown'),
    freeText: document.getElementById('freeText'),
    refreshBtn: document.getElementById('refreshBtn'),
    playBtn: document.getElementById('playBtn'),
    recordBtn: document.getElementById('recordBtn'),
    sentenceBox: document.getElementById('sentenceBox'),
    sentenceWords: document.getElementById('sentenceWords'),
    translationText: document.getElementById('translationText'),
    clauseList: document.getElementById('clauseList'),
    toast: document.getElementById('toast'),
    recordBox: document.getElementById('recordBox'),
    recordedAudio: document.getElementById('recordedAudio'),
    saveBtn: document.getElementById('saveBtn'),
    templateMenu: document.getElementById('templateMenu'),
    templateDropdown: document.getElementById('templateDropdown'),
    templateSummaryText: document.getElementById('templateSummaryText')
  };

  var state = {
    lang: 'ro',
    level: 1,
    text: '',
    clauses: [],
    detectedFields: []
  };

  var _wordSpeakTimer = null;
  var _sentenceSpeakTimer = null;

  function speakText(text, rate){
    if(!text) return;
    AudioEngine.speak(text, {rate: rate || 0.9});
  }

  function autoSpeakWord(ko){
    if(!ko) return;
    clearTimeout(_wordSpeakTimer);
    clearTimeout(_sentenceSpeakTimer);
    _wordSpeakTimer = setTimeout(function(){ speakText(ko, 0.85); }, 320);
  }

  function autoSpeakSentence(ko){
    if(!ko) return;
    clearTimeout(_sentenceSpeakTimer);
    _sentenceSpeakTimer = setTimeout(function(){ speakText(ko, 0.9); }, 1500);
  }

  /* ============================================================
     SAVED SENTENCES
  ============================================================ */
  var SAVED_KEY = 'RK_SAVED_SENTENCES';
  var savedSentences = [];

  function loadSavedSentences(){
    savedSentences = RKStorage.get(SAVED_KEY, []);
  }

  function persistSaved(){
    RKStorage.set(SAVED_KEY, savedSentences);
  }

  function renderSavedPanel(){
    var panel = document.getElementById('savedPanel');
    var list  = document.getElementById('savedList');
    var title = document.getElementById('savedTitle');
    if(!panel || !list) return;

    if(!savedSentences.length){
      panel.classList.remove('has-items');
      return;
    }

    panel.classList.add('has-items');
    if(title) title.textContent = currentUI().savedTitle + ' (' + savedSentences.length + ')';

    list.innerHTML = savedSentences.map(function(s, i){
      return '<div class="savedItem">' +
        '<div class="savedItemText">' +
          '<div class="savedItemKo">' + escapeHtml(s.ko) + '</div>' +
          (s.tr ? '<div class="savedItemTr">' + escapeHtml(s.tr) + '</div>' : '') +
        '</div>' +
        '<button class="savedItemDel" type="button" data-del-idx="' + i + '" title="Șterge">×</button>' +
      '</div>';
    }).join('');
  }

  function addCurrentSentence(){
    var built = buildFullOutput();
    if(!built.korean){
      showToast(currentUI().noSentenceToSave);
      return;
    }
    for(var i=0; i<savedSentences.length; i++){
      if(savedSentences[i].ko === built.korean){
        showToast(currentUI().alreadySaved);
        return;
      }
    }
    savedSentences.unshift({ ko: built.korean, tr: built.translation || '', ts: Date.now() });
    persistSaved();
    renderSavedPanel();
    showToast(currentUI().saved);
  }

  function deleteSavedSentence(idx){
    savedSentences.splice(idx, 1);
    persistSaved();
    renderSavedPanel();
  }

  function exportSentencesAsTxt(){
    if(!savedSentences.length) return;
    var lines = savedSentences.map(function(s, i){
      return (i + 1) + '. ' + s.ko + (s.tr ? '\n   ' + s.tr : '');
    }).join('\n\n');
    RKUtils.downloadTextFile('raluca-korean.txt', lines);
  }

  /* ============================================================
     QUIZ MODE
  ============================================================ */
  var quizMode   = false;
  var quizTarget = null;

  function updateQuizBar(){
    var bar      = document.getElementById('quizBar');
    var labelEl  = document.getElementById('quizLabelEl');
    var targetEl = document.getElementById('quizTargetTr');
    var checkBtn = document.getElementById('quizCheckBtn');
    var exitBtn  = document.getElementById('quizExitBtn');
    var resultEl = document.getElementById('quizResultEl');
    var quizBtn  = document.getElementById('quizBtn');

    if(!bar) return;

    if(quizMode && quizTarget){
      bar.classList.add('active');
      if(labelEl)  labelEl.textContent  = currentUI().quizLabel;
      if(targetEl) targetEl.textContent = quizTarget.tr || quizTarget.ko;
      if(checkBtn) checkBtn.textContent = currentUI().quizCheck;
      if(exitBtn)  exitBtn.textContent  = currentUI().quizExit;
      if(resultEl){ resultEl.textContent = ''; resultEl.className = 'quizResultEl'; }
      if(quizBtn)  quizBtn.classList.add('quizActive');
    } else {
      bar.classList.remove('active');
      if(quizBtn) quizBtn.classList.remove('quizActive');
    }
  }

  function enterQuizMode(){
    var built = buildFullOutput();
    if(!built.korean){
      showToast(currentUI().quizNoBuild);
      return;
    }

    quizTarget = { ko: built.korean, tr: built.translation || built.korean };
    quizMode   = true;

    // Scramble: reset each active field to its first available option
    state.clauses.forEach(function(clause, ci){
      var isLast = ci === state.clauses.length - 1;
      ALL_FIELD_KEYS.forEach(function(fieldKey){
        if(!isFieldActive(clause, fieldKey)) return;
        var opts = getOptionsForField(fieldKey, isLast);
        if(opts.length) setFieldItem(clause, fieldKey, opts[0]);
      });
    });

    updateQuizBar();
    renderAll();
  }

  function exitQuizMode(){
    quizMode   = false;
    quizTarget = null;
    updateQuizBar();
    renderAll();
  }

  function checkQuiz(){
    if(!quizTarget) return;
    var current = (buildFullOutput().korean || '').trim();
    var target  = quizTarget.ko.trim();
    var correct = current === target;

    var resultEl = document.getElementById('quizResultEl');
    if(resultEl){
      if(correct){
        resultEl.innerHTML = currentUI().quizCorrect;
        resultEl.className = 'quizResultEl visible correct';
      } else {
        resultEl.innerHTML =
          currentUI().quizWrong +
          '<div class="quizAnswerLine">' + currentUI().quizAnswer +
          ' <strong>' + escapeHtml(target) + '</strong></div>';
        resultEl.className = 'quizResultEl visible wrong';
      }
    }

    if(correct) showToast(currentUI().quizCorrect);
  }

  var pickerState = {
    clauseIndex: 0,
    fieldKey: 'topic',
    items: [],
    filteredItems: []
  };

  var USAGE_KEY = 'RK_WORD_USAGE';
  var wordUsage = {};

  function loadWordUsage(){
    wordUsage = RKStorage.get(USAGE_KEY, {});
  }

  function saveWordUsage(){
    RKStorage.set(USAGE_KEY, wordUsage);
  }

  function markWordUsed(fieldKey, item){
    if(!item || !item.ko) return;
    var k = fieldKey + ':' + item.ko;
    wordUsage[k] = (wordUsage[k] || 0) + 1;
    saveWordUsage();
  }

  function isWordNew(fieldKey, item){
    if(!item || !item.ko) return false;
    return !wordUsage[fieldKey + ':' + item.ko];
  }

  var toastTimer = null;
  var mediaRecorder = null;
  var recordedChunks = [];
  var recordedStream = null;
  var recordedUrl = null;
  var longPressTimer = null;
  var longPressTarget = null;
  var LONG_PRESS_MS = 420;

  function currentUI(){
    return UI[state.lang] || UI.ro;
  }

  function showToast(message){
    if(!els.toast) return;
    clearTimeout(toastTimer);
    els.toast.textContent = message;
    els.toast.classList.add('show');
    toastTimer = setTimeout(function(){
      els.toast.classList.remove('show');
    }, 2200);
  }

  function escapeHtml(str){
    return RKUtils.escapeHtml(str);
  }

  function normalizeLatin(str){
    return String(str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\u3131-\u318e\uac00-\ud7a3\s]/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function cleanSentenceText(text){
    return String(text || '')
      .replace(/\s+,/g, ',')
      .replace(/\s+/g, ' ')
      .replace(/\s+([,.!?])/g, '$1')
      .trim();
  }

  function fieldLabel(fieldKey){
    var pack = FIELD_LABELS[state.lang] || FIELD_LABELS.ro;
    return pack[fieldKey] || fieldKey;
  }

  function getLevelFields(){
    return LEVEL_FIELDS[state.level] || LEVEL_FIELDS[1];
  }

  function normalizeItem(item, bucket, index){
    if(!item) return null;
    if(typeof item === 'string'){
      return {
        id: bucket + '-' + index + '-' + item,
        key: item,
        bucket: bucket,
        index: index,
        ko: item,
        ro: '',
        en: '',
        aliases: [],
        final: '',
        forms: {},
        raw: item
      };
    }
    return {
      id: item.id || item.key || item.value || item.ko || (bucket + '-' + index),
      key: item.key || item.id || item.value || '',
      bucket: bucket,
      index: typeof index === 'number' ? index : 0,
      ko: item.ko || item.kr || item.korean || item.surface || item.text || item.value || '',
      ro: item.ro || item.romanian || item.meaningRo || item.meaning || '',
      en: item.en || item.english || item.meaningEn || '',
      aliases: Array.isArray(item.aliases) ? item.aliases.slice() : [],
      final: item.final || '',
      forms: item.forms || {},
      isPhrase: item.isPhrase || false,
      modifiesSubject: item.modifiesSubject || false,
      raw: item
    };
  }

  function normalizeList(list, bucket){
    return (Array.isArray(list) ? list : []).map(function(item, index){
      return normalizeItem(item, bucket, index);
    });
  }

  function uniqueItems(items){
    var seen = {};
    return items.filter(function(item){
      if(!item) return false;
      var key = [item.bucket, item.ko, item.ro, item.en, item.key].join('|');
      if(seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  function getAppVocab(){
    return window.RALUCA_VOCAB
      || window.APP_VOCAB
      || window.VOCAB
      || window.vocabulary
      || window.__VOCAB__
      || window.KOREAN_VOCAB
      || null;
  }

  function globalBucketMap(fieldKey){
    return {
      topic: ['subjects','subject','topics','topic','people','persons'],
      associate: ['participants','participant','relatives','relative','people','persons','subjects','subject'],
      time: ['times','time'],
      departure: ['locations','location','places','place','departures','departure'],
      transit: ['locations','location','places','place','transit'],
      numeral: ['numerals','numeral','numbers','number'],
      quantifier: ['quantifiers','quantifier','classifiers','classifier','units','unit'],
      embSub: ['emb_subject','embedded_subject'],
      embPred: ['emb_pred','embedded_pred','embedded_predicate'],
      object1: ['objects','object','object1'],
      beneficiary: ['beneficiaries','beneficiary','people','persons','subjects','subject'],
      object2: ['objects','object','object2'],
      adverb: ['adverbs','adverb','descriptions','description'],
      verb: ['verbs','verb'],
      connector: ['connectors','connector']
    }[fieldKey] || [fieldKey];
  }

  function firstExistingBucket(source, keys){
    for(var i=0;i<keys.length;i++){
      var key = keys[i];
      if(source && Array.isArray(source[key])) return source[key];
      if(source && source[key] && Array.isArray(source[key].items)) return source[key].items;
      if(source && source.data && Array.isArray(source.data[key])) return source.data[key];
      if(source && source.data && source.data[key] && Array.isArray(source.data[key].items)) return source.data[key].items;
    }
    return [];
  }

  function getOptionsForField(fieldKey, isLast){
    var sourceKey = fieldKey;
    if(fieldKey === 'topic2') sourceKey = 'topic';
    if(fieldKey === 'adverb2') sourceKey = 'adverb';

    var appVocab = getAppVocab();
    var items = [];

    if(appVocab && sourceKey !== 'connector'){
      var raw = firstExistingBucket(appVocab, globalBucketMap(sourceKey));
      if(raw && raw.length){
        items = normalizeList(raw, sourceKey);
      }
    }

    if(!items.length){
      if(sourceKey === 'topic'){
        items = normalizeList(DATA.subject, 'subject');
      }else if(sourceKey === 'associate'){
        items = normalizeList(DATA.associate, 'associate');
      }else if(sourceKey === 'beneficiary'){
        items = normalizeList(DATA.beneficiary, 'beneficiary');
      }else if(sourceKey === 'embSub'){
        items = normalizeList(DATA.emb_subject, 'emb_subject');
      }else if(sourceKey === 'embPred'){
        items = normalizeList(DATA.emb_pred, 'emb_pred');
      }else if(sourceKey === 'time'){
        items = normalizeList(DATA.time, 'time');
      }else if(sourceKey === 'departure' || sourceKey === 'transit'){
        items = normalizeList(DATA.location, 'location');
      }else if(sourceKey === 'object1' || sourceKey === 'object2'){
        items = normalizeList(DATA.object, 'object');
      }else if(sourceKey === 'adverb'){
        items = normalizeList(DATA.description, 'description');
      }else if(sourceKey === 'verb'){
        items = normalizeList(DATA.verb, 'verb');
      }else if(sourceKey === 'connector'){
        var all = normalizeList(DATA.connector, 'connector');
        if(isLast){
          // Tense endings first (cycling starts here), then clause connectors; exclude 'none'
          var tenseOpts  = all.filter(function(it){ return it.raw && it.raw.isTense; });
          var clauseOpts = all.filter(function(it){ return it.key !== 'none' && (!it.raw || !it.raw.isTense); });
          items = tenseOpts.concat(clauseOpts);
        }else{
          items = all.filter(function(it){ return !it.raw || !it.raw.isTense; });
        }
      }else if(sourceKey === 'numeral'){
        items = normalizeList(DATA.numeral, 'numeral');
      }else if(sourceKey === 'quantifier'){
        items = normalizeList(DATA.quantifier, 'quantifier');
      }
    }

    return uniqueItems(items);
  }

  function makeField(enabled, index){
    return { enabled: !!enabled, index: typeof index === 'number' ? index : 0 };
  }

  function makeClause(subjectIndex, enableSubject){
    if(typeof subjectIndex !== 'number') subjectIndex = 0;
    if(typeof enableSubject !== 'boolean') enableSubject = true;

    return {
      subject: makeField(enableSubject, subjectIndex),
      time: makeField(false, 0),
      location: makeField(false, 0),
      object: makeField(false, 0),
      description: makeField(false, 0),
      verb: makeField(false, 0),
      connector: makeField(false, 0),
      sourceText: '',
      extras: {
        topic2: null,
        associate: null,
        transit: null,
        numeral: null,
        quantifier: null,
        embSub: null,
        embPred: null,
        beneficiary: null,
        object2: null,
        adverb2: null
      },
      __picked: {}
    };
  }

  function makeEmptyLayoutClause(){
    return makeClause(0, false);
  }

  function ensureClauseShape(clause){
    if(!clause.subject) clause.subject = makeField(false, 0);
    if(!clause.time) clause.time = makeField(false, 0);
    if(!clause.location) clause.location = makeField(false, 0);
    if(!clause.object) clause.object = makeField(false, 0);
    if(!clause.description) clause.description = makeField(false, 0);
    if(!clause.verb) clause.verb = makeField(false, 0);
    if(!clause.connector) clause.connector = makeField(false, 0);

    if(!clause.extras){
      clause.extras = {
        topic2: null,
        associate: null,
        transit: null,
        numeral: null,
        quantifier: null,
        embSub: null,
        embPred: null,
        beneficiary: null,
        object2: null,
        adverb2: null
      };
    }
    if(!('embSub'  in clause.extras)) clause.extras.embSub  = null;
    if(!('embPred' in clause.extras)) clause.extras.embPred = null;

    if(!clause.__picked) clause.__picked = {};
    return clause;
  }

  function clearFieldFromClause(clause, fieldKey){
    clause = ensureClauseShape(clause);

    if(fieldKey === 'topic'){
      clause.subject.enabled = false;
      clause.subject.index = 0;
      clause.__picked.topic = null;
      return;
    }

    if(fieldKey === 'time'){
      clause.time.enabled = false;
      clause.time.index = 0;
      clause.__picked.time = null;
      return;
    }

    if(fieldKey === 'departure'){
      clause.location.enabled = false;
      clause.location.index = 0;
      clause.__picked.departure = null;
      return;
    }

    if(fieldKey === 'object1'){
      clause.object.enabled = false;
      clause.object.index = 0;
      clause.__picked.object1 = null;
      return;
    }

    if(fieldKey === 'adverb'){
      clause.description.enabled = false;
      clause.description.index = 0;
      clause.__picked.adverb = null;
      return;
    }

    if(fieldKey === 'verb'){
      clause.verb.enabled = false;
      clause.verb.index = 0;
      clause.__picked.verb = null;
      return;
    }

    if(fieldKey === 'connector'){
      clause.connector.enabled = false;
      clause.connector.index = 0;
      clause.__picked.connector = null;
      return;
    }

    clause.__picked[fieldKey] = null;
    if(clause.extras && Object.prototype.hasOwnProperty.call(clause.extras, fieldKey)){
      clause.extras[fieldKey] = null;
    }
  }

  function translationOf(item){
    if(!item) return '';
    return state.lang === 'en'
      ? (item.en || item.ro || item.ko || '')
      : (item.ro || item.en || item.ko || '');
  }

  function itemOf(clause, fieldKey){
    if(!clause) return null;
    clause = ensureClauseShape(clause);

    if(clause.__picked && clause.__picked[fieldKey]){
      return clause.__picked[fieldKey];
    }

    if(fieldKey === 'topic'){
      if(!clause.subject || !clause.subject.enabled) return null;
      return normalizeItem((DATA.subject[clause.subject.index] || DATA.subject[0]), 'subject', clause.subject.index);
    }

    if(fieldKey === 'time'){
      if(!clause.time || !clause.time.enabled) return null;
      return normalizeItem((DATA.time[clause.time.index] || DATA.time[0]), 'time', clause.time.index);
    }

    if(fieldKey === 'departure'){
      if(!clause.location || !clause.location.enabled) return null;
      return normalizeItem((DATA.location[clause.location.index] || DATA.location[0]), 'location', clause.location.index);
    }

    if(fieldKey === 'object1'){
      if(!clause.object || !clause.object.enabled) return null;
      return normalizeItem((DATA.object[clause.object.index] || DATA.object[0]), 'object', clause.object.index);
    }

    if(fieldKey === 'adverb'){
      if(!clause.description || !clause.description.enabled) return null;
      return normalizeItem((DATA.description[clause.description.index] || DATA.description[0]), 'description', clause.description.index);
    }

    if(fieldKey === 'verb'){
      if(!clause.verb || !clause.verb.enabled) return null;
      return normalizeItem((DATA.verb[clause.verb.index] || DATA.verb[0]), 'verb', clause.verb.index);
    }

    if(fieldKey === 'connector'){
      if(!clause.connector || !clause.connector.enabled) return null;
      return normalizeItem((DATA.connector[clause.connector.index] || DATA.connector[0]), 'connector', clause.connector.index);
    }

    if(clause.extras && clause.extras[fieldKey]){
      return clause.extras[fieldKey];
    }

    return null;
  }

  function isFieldActive(clause, fieldKey){
    if(!clause) return false;
    clause = ensureClauseShape(clause);

    if(fieldKey === 'topic2' || fieldKey === 'associate' || fieldKey === 'transit' ||
       fieldKey === 'numeral' || fieldKey === 'quantifier' || fieldKey === 'beneficiary' ||
       fieldKey === 'object2' || fieldKey === 'adverb2'){
      return !!(clause.extras && clause.extras[fieldKey]);
    }

    if(FIELD_BINDINGS[fieldKey]){
      var nativeKey = FIELD_BINDINGS[fieldKey];
      return !!(clause[nativeKey] && clause[nativeKey].enabled);
    }

    return false;
  }

  function getFirstUsableItem(fieldKey, isLast){
    var options = getOptionsForField(fieldKey, isLast);
    if(!options.length) return null;

    if(fieldKey === 'connector'){
      for(var i=0;i<options.length;i++){
        if(options[i] && options[i].key && options[i].key !== 'none') return options[i];
      }
      return options[0] || null;
    }

    for(var j=0;j<options.length;j++){
      if(options[j] && options[j].ko) return options[j];
    }

    return options[0] || null;
  }

  function setFieldItem(clause, fieldKey, item){
    clause = ensureClauseShape(clause);

    if(!clause.__picked) clause.__picked = {};
    clause.__picked[fieldKey] = item || null;

    if(fieldKey === 'topic'){
      clause.subject.enabled = !!(item && item.ko);
      clause.subject.index = item && typeof item.index === 'number' ? item.index : 0;
      return;
    }

    if(fieldKey === 'time'){
      clause.time.enabled = !!(item && item.ko);
      clause.time.index = item && typeof item.index === 'number' ? item.index : 0;
      return;
    }

    if(fieldKey === 'departure'){
      clause.location.enabled = !!(item && item.ko);
      clause.location.index = item && typeof item.index === 'number' ? item.index : 0;
      return;
    }

    if(fieldKey === 'object1'){
      clause.object.enabled = !!(item && item.ko);
      clause.object.index = item && typeof item.index === 'number' ? item.index : 0;
      return;
    }

    if(fieldKey === 'adverb'){
      clause.description.enabled = !!(item && item.ko);
      clause.description.index = item && typeof item.index === 'number' ? item.index : 0;
      return;
    }

    if(fieldKey === 'verb'){
      clause.verb.enabled = !!(item && item.ko);
      clause.verb.index = item && typeof item.index === 'number' ? item.index : 0;
      return;
    }

    if(fieldKey === 'connector'){
      clause.connector.enabled = !!(item && item.ko);
      clause.connector.index = item && typeof item.index === 'number' ? item.index : 0;
      return;
    }

    if(!clause.extras) clause.extras = {};
    clause.extras[fieldKey] = item || null;
  }

  function connectorKey(clause){
    var item = itemOf(clause, 'connector');
    return item ? (item.key || item.id || 'none') : 'none';
  }

  function toggleFieldActive(clauseIndex, fieldKey){
    var clause = state.clauses[clauseIndex];
    if(!clause) return;

    var active = isFieldActive(clause, fieldKey);

    if(active){
      setFieldItem(clause, fieldKey, null);

      if(FIELD_BINDINGS[fieldKey]){
        var nativeKey = FIELD_BINDINGS[fieldKey];
        clause[nativeKey].enabled = false;
        clause[nativeKey].index = 0;
      }else if(clause.extras){
        clause.extras[fieldKey] = null;
      }
    }else{
      var isLastClause = clauseIndex === state.clauses.length - 1;
      var firstItem = getFirstUsableItem(fieldKey, isLastClause);
      if(firstItem){
        setFieldItem(clause, fieldKey, firstItem);
        if(FIELD_BINDINGS[fieldKey]){
          clause[FIELD_BINDINGS[fieldKey]].enabled = true;
        }
      }
    }

    ensureChainLength();
    renderAll();
  }

  function cycleFieldValue(clauseIndex, fieldKey){
    var clause = state.clauses[clauseIndex];
    if(!clause) return;

    var isLastClause = clauseIndex === state.clauses.length - 1;
    var options = getOptionsForField(fieldKey, isLastClause);
    if(!options.length) return;

    if(!isFieldActive(clause, fieldKey)){
      var firstItem = getFirstUsableItem(fieldKey, isLastClause);
      if(firstItem){
        setFieldItem(clause, fieldKey, firstItem);
        if(FIELD_BINDINGS[fieldKey]){
          clause[FIELD_BINDINGS[fieldKey]].enabled = true;
        }
        markWordUsed(fieldKey, firstItem);
        ensureChainLength();
        renderAll();
        if(firstItem.ko) autoSpeakWord(firstItem.ko);
      }
      return;
    }

    var current = itemOf(clause, fieldKey);
    var currentIndex = -1;

    for(var i=0;i<options.length;i++){
      if(current && options[i] && options[i].id === current.id && options[i].ko === current.ko){
        currentIndex = i;
        break;
      }
    }

    var nextIndex = currentIndex + 1;
    if(nextIndex >= options.length) nextIndex = 0;

    if(fieldKey !== 'connector'){
      var guard = 0;
      while(options[nextIndex] && !options[nextIndex].ko && guard < options.length){
        nextIndex += 1;
        if(nextIndex >= options.length) nextIndex = 0;
        guard += 1;
      }
    }

    var nextItem = options[nextIndex] || null;
    setFieldItem(clause, fieldKey, nextItem);
    if(nextItem) markWordUsed(fieldKey, nextItem);
    ensureChainLength();
    renderAll();
    if(nextItem && nextItem.ko) autoSpeakWord(nextItem.ko);
  }

  function subjectRoleFromKo(subjectKo){
    if(subjectKo === '저는' || subjectKo === '나는') return 'i';
    if(subjectKo === '우리는') return 'we';
    if(subjectKo === '너는') return 'you_sg';
    if(subjectKo === '여러분은') return 'you_pl';
    if(subjectKo === '그들은') return 'third_pl';
    return 'third';
  }

  function finiteVerbText(verb, lang, subjectKo, tense){
    if(!verb) return '';
    if(verb.isPhrase) return lang === 'en' ? (verb.en || verb.ro || '') : (verb.ro || verb.en || '');
    var hit = VERB_FINITE_MAP[verb.ko];
    var td  = VERB_TENSE_DATA[verb.ko];
    var role = subjectRoleFromKo(subjectKo || '');
    tense = tense || 'present';

    if(tense === 'past' && td){
      if(lang === 'en'){
        return td.enPast || (verb.en || verb.ro || verb.ko || '');
      }
      if(td.refl){
        if(role === 'i')        return 'm-am '  + td.roPart;
        if(role === 'you_sg')   return 'te-ai ' + td.roPart;
        if(role === 'you_pl')   return 'v-ați ' + td.roPart;
        if(role === 'we')       return 'ne-am ' + td.roPart;
        if(role === 'third_pl') return 's-au '  + td.roPart;
        return 's-a ' + td.roPart;
      }
      var auxP = role === 'i' || role === 'we' ? 'am'
               : role === 'you_sg'             ? 'ai'
               : role === 'you_pl'             ? 'ați'
               : role === 'third_pl'           ? 'au'
               : 'a';
      return auxP + ' ' + td.roPart;
    }

    if(tense === 'future' && td){
      if(lang === 'en'){
        var enBase = hit && hit.en ? (hit.en.i || hit.en[role] || '') : (verb.en || '');
        return 'will ' + enBase;
      }
      if(td.refl){
        if(role === 'i')        return 'mă voi '  + td.roBase;
        if(role === 'you_sg')   return 'te vei '  + td.roBase;
        if(role === 'you_pl')   return 'vă veți ' + td.roBase;
        if(role === 'we')       return 'ne vom '  + td.roBase;
        if(role === 'third_pl') return 'se vor '  + td.roBase;
        return 'se va ' + td.roBase;
      }
      var auxF = role === 'i'        ? 'voi'
               : role === 'you_sg'   ? 'vei'
               : role === 'you_pl'   ? 'veți'
               : role === 'we'       ? 'vom'
               : role === 'third_pl' ? 'vor'
               : 'va';
      return auxF + ' ' + td.roBase;
    }

    if(tense === 'neg'){
      if(lang === 'en'){
        var negAux = (role === 'third' || role === 'third_pl') ? "doesn't" : "don't";
        var negBase = hit && hit.en ? (hit.en[role] || '') : '';
        return negBase ? negAux + ' ' + negBase : (verb.en || '');
      }
      return 'nu ' + (hit && hit.ro ? (hit.ro[role] || '') : (verb.ro || ''));
    }

    if(tense === 'notwish'){
      var roWantNeg = {i:'nu vreau să', you_sg:'nu vrei să', you_pl:'nu vreți să', we:'nu vrem să', third:'nu vrea să', third_pl:'nu vor să'};
      if(lang === 'en'){
        var ntWishAux = (role === 'third' || role === 'third_pl') ? "doesn't want to" : "don't want to";
        return ntWishAux + ' ' + (verb.en ? verb.en.replace(/^to\s+/,'') : '');
      }
      return (roWantNeg[role] || 'nu vrea să') + ' ' + (td ? td.roBase : (verb.ro || ''));
    }

    if(tense === 'mustnot'){
      if(lang === 'en') return 'must not ' + (verb.en ? verb.en.replace(/^to\s+/,'') : '');
      return 'nu trebuie să ' + (td ? td.roBase : (verb.ro || ''));
    }

    if(tense === 'cannot'){
      var roCanNeg = {i:'nu pot să', you_sg:'nu poți să', you_pl:'nu puteți să', we:'nu putem să', third:'nu poate să', third_pl:'nu pot să'};
      if(lang === 'en') return "can't " + (verb.en ? verb.en.replace(/^to\s+/,'') : '');
      return (roCanNeg[role] || 'nu poate să') + ' ' + (td ? td.roBase : (verb.ro || ''));
    }

    if(tense === 'wish'){
      var roWant = {i:'vreau să', you_sg:'vrei să', you_pl:'vreți să', we:'vrem să', third:'vrea să', third_pl:'vor să'};
      if(lang === 'en') return 'want to ' + (verb.en ? verb.en.replace(/^to\s+/,'') : '');
      return (roWant[role] || 'vrea să') + ' ' + (td ? td.roBase : (verb.ro || ''));
    }

    if(tense === 'must'){
      var roMust = {i:'trebuie să', you_sg:'trebuie să', you_pl:'trebuie să', we:'trebuie să', third:'trebuie să', third_pl:'trebuie să'};
      if(lang === 'en') return 'must ' + (verb.en ? verb.en.replace(/^to\s+/,'') : '');
      return roMust[role] + ' ' + (td ? td.roBase : (verb.ro || ''));
    }

    if(tense === 'should'){
      var roShould = {i:'ar trebui să', you_sg:'ar trebui să', you_pl:'ar trebui să', we:'ar trebui să', third:'ar trebui să', third_pl:'ar trebui să'};
      if(lang === 'en') return 'should ' + (verb.en ? verb.en.replace(/^to\s+/,'') : '');
      return roShould[role] + ' ' + (td ? td.roBase : (verb.ro || ''));
    }

    if(hit && hit[lang] && hit[lang][role]) return hit[lang][role];
    return lang === 'en'
      ? (verb.en || verb.ro || verb.ko || '')
      : (verb.ro || verb.en || verb.ko || '');
  }

  function removeTopicParticle(ko){
    return String(ko || '').replace(/(는|은|이|가)$/,'');
  }

  function renderVerbKo(clause){
    var verb = itemOf(clause, 'verb');
    if(!verb || !verb.ko) return '';

    if(verb.isPhrase) return verb.final || verb.ko;

    var cKey = connectorKey(clause);
    var conj = window.Conjugation;

    if(cKey === 'tense_past') return conj ? conj.past(verb.ko)   : (verb.final || verb.ko);
    if(cKey === 'tense_fut')  return conj ? conj.future(verb.ko) : (verb.final || verb.ko);
    if(cKey === 'tense_pres' || cKey === 'none') return conj ? conj.present(verb.ko) : (verb.final || verb.ko);

    // Clause connectors — return verb in connector form (stem + suffix)
    if(conj){
      var stem = conj.stem(verb.ko);

      // Negated PAST connector: e.g. "deoarece nu am mâncat" → 먹지 않았기에
      if(clause.negated && clause.tenseOverride === 'past'){
        var nb2 = stem + '지 않았';
        if(cKey === 'formal_cause')   return nb2 + '기에';
        if(cKey === 'condition')      return nb2 + '으면';
        if(cKey === 'seq')            return stem + '지 않고'; // plain neg 고, not past
        if(cKey === 'cause1')         return nb2 + '어서';
        if(cKey === 'cause2')         return nb2 + '으니까';
        if(cKey === 'contrast1')      return nb2 + '지만';
        if(cKey === 'contrast2')      return nb2 + '는데';
        if(cKey === 'concede')        return nb2 + '어도';
        if(cKey === 'after')          return nb2 + '고 나서';
        if(cKey === 'before')         return nb2 + '기 전에';
        if(cKey === 'informal_cause') return nb2 + '길래';
        if(cKey === 'because_of')     return nb2 + '는 탓에';
        if(cKey === 'concede2')       return nb2 + '는데도';
        if(cKey === 'formal_result')  return nb2 + '므로';
      }

      // Negated connector: e.g. "dacă nu citești" → 읽지 않으면
      if(clause.negated){
        var nb = stem + '지 않';
        if(cKey === 'condition') return nb + '으면';
        if(cKey === 'seq')       return nb + '고';
        if(cKey === 'cause1')    return nb + '아서';
        if(cKey === 'cause2')    return nb + '으니까';
        if(cKey === 'contrast1') return nb + '지만';
        if(cKey === 'contrast2')      return nb + '는데';
        if(cKey === 'purpose')        return nb + '으려고';
        if(cKey === 'while')          return nb + '으면서';
        if(cKey === 'concede')        return nb + '아도';
        if(cKey === 'after')          return nb + '고 나서';
        if(cKey === 'before')         return nb + '기 전에';
        if(cKey === 'formal_cause')   return nb + '기에';
        if(cKey === 'informal_cause') return nb + '길래';
        if(cKey === 'because_of')     return nb + '는 탓에';
        if(cKey === 'concede2')       return nb + '는데도';
        if(cKey === 'formal_result')  return nb + '므로';
      }

      // Wish modal in intermediate clause: "vreau să merg, dar" → 가고 싶지만
      if(clause.wishModal){
        var ws = stem + '고 싶';
        if(cKey === 'condition')  return ws + (conj.euOrNot(ws) ? '으면' : '면');
        if(cKey === 'seq')        return ws + '고';
        if(cKey === 'cause1')     return ws + '어서';
        if(cKey === 'cause2')     return ws + '으니까';
        if(cKey === 'contrast1')  return ws + '지만';
        if(cKey === 'contrast2')  return ws + '은데';
        if(cKey === 'concede')    return ws + '어도';
        if(cKey === 'purpose')    return ws + '어서';
        if(cKey === 'after')      return ws + '고 나서';
        if(cKey === 'before')     return ws + '기 전에';
      }

      // Past connector: e.g. "dacă ai citit" → 읽었으면
      if(clause.tenseOverride === 'past'){
        var ps = conj.past(verb.ko).slice(0, -2); // e.g. 읽었어요 → 읽었
        var psEu = conj.euOrNot(ps);
        if(cKey === 'condition') return ps + (psEu ? '으면' : '면');
        // For seq (고), only the last verb takes past tense — use plain 고 form
        if(cKey === 'seq')       return conj.connector(verb.ko, '-고');
        if(cKey === 'cause2')    return ps + (psEu ? '으니까' : '니까');
        if(cKey === 'contrast1') return ps + '지만';
        if(cKey === 'contrast2') return ps + '는데';
        if(cKey === 'concede')   return ps + '어도';
      }

      if(cKey === 'seq')       return conj.connector(verb.ko, '-고');
      if(cKey === 'cause1')    return conj.connector(verb.ko, '-아/어서');
      if(cKey === 'cause2')    return conj.connector(verb.ko, '-(으)니까');
      if(cKey === 'contrast1') return conj.connector(verb.ko, '-지만');
      if(cKey === 'contrast2') return conj.connector(verb.ko, '-(으)ㄴ/는데');
      if(cKey === 'condition') return conj.euOrNot(stem) ? stem + '으면' : stem + '면';
      if(cKey === 'purpose')        return conj.euOrNot(stem) ? stem + '으려고' : stem + '려고';
      if(cKey === 'result')         return conj.aeo(verb.ko) + '서 그렇게 되다';
      // TOPIK 1
      if(cKey === 'while')          return conj.connector(verb.ko, '-(으)면서');
      if(cKey === 'concede')        return conj.connector(verb.ko, '-아/어도');
      if(cKey === 'after')          return conj.connector(verb.ko, '-고 나서');
      if(cKey === 'before')         return conj.connector(verb.ko, '-기 전에');
      // TOPIK 2
      if(cKey === 'or')             return conj.connector(verb.ko, '-거나');
      if(cKey === 'when')           return conj.connector(verb.ko, '-(으)ㄹ 때');
      if(cKey === 'purpose2')       return conj.connector(verb.ko, '-기 위해서');
      // TOPIK 3
      if(cKey === 'asap')           return conj.connector(verb.ko, '-자마자');
      if(cKey === 'switch')         return conj.connector(verb.ko, '-다가');
      if(cKey === 'during')         return conj.connector(verb.ko, '-는 동안');
      if(cKey === 'instead')        return conj.connector(verb.ko, '-는 대신에');
      if(cKey === 'concede2')       return conj.connector(verb.ko, '-(으)ㄴ/는데도');
      if(cKey === 'proportion')     return conj.connector(verb.ko, '-(으)ㄹ수록');
      if(cKey === 'formal_cause')   return conj.connector(verb.ko, '-기에');
      if(cKey === 'informal_cause') return conj.connector(verb.ko, '-길래');
      // TOPIK 4-5
      if(cKey === 'formal_result')  return conj.connector(verb.ko, '-(으)므로');
      if(cKey === 'contrast3')      return conj.connector(verb.ko, '-(으)ㄴ/는 반면에');
      if(cKey === 'extent')         return conj.connector(verb.ko, '-도록');
      // TOPIK 5-6
      if(cKey === 'notonly')        return conj.connector(verb.ko, '-(으)ㄹ 뿐만 아니라');
      if(cKey === 'aslong')         return conj.connector(verb.ko, '-(으)ㄴ/는 한');
      if(cKey === 'because_of')     return conj.connector(verb.ko, '-(으)ㄴ/는 탓에');
    }

    if(cKey === 'tense_progressive') return conj ? conj.stem(verb.ko) + '고 있어요' : (verb.final || verb.ko);
    if(cKey === 'tense_wish')        return conj ? conj.stem(verb.ko) + '고 싶어요' : (verb.final || verb.ko);
    if(cKey === 'tense_neg')          return conj ? conj.stem(verb.ko) + '지 않아요' : (verb.final || verb.ko);
    if(cKey === 'tense_notwish')      return conj ? conj.stem(verb.ko) + '고 싶지 않아요' : (verb.final || verb.ko);
    if(cKey === 'tense_mot_neg')      return conj ? conj.stem(verb.ko) + '지 못해요' : (verb.final || verb.ko);
    if(cKey === 'tense_mot_neg_past') return conj ? conj.stem(verb.ko) + '지 못했어요' : (verb.final || verb.ko);
    if(cKey === 'tense_mustnot'){
      if(!conj) return verb.final || verb.ko;
      var sm = conj.stem(verb.ko);
      return (conj.euOrNot(sm) ? sm + '으면' : sm + '면') + ' 안 돼요';
    }
    if(cKey === 'tense_intention'){
      var s2 = conj ? conj.stem(verb.ko) : '';
      return s2 ? (conj.euOrNot(s2) ? s2 + '으려고 해요' : s2 + '려고 해요') : (verb.final || verb.ko);
    }
    if(cKey === 'tense_can')     return conj ? conj.future(verb.ko).replace('거예요', '수 있어요') : (verb.final || verb.ko);
    if(cKey === 'tense_cannot')  return conj ? conj.future(verb.ko).replace('거예요', '수 없어요') : (verb.final || verb.ko);
    if(cKey === 'tense_must')    return conj ? conj.aeo(verb.ko) + '야 해요' : (verb.final || verb.ko);
    if(cKey === 'tense_should')  return conj ? conj.dropRieul(conj.stem(verb.ko)) + '는 게 좋아요' : (verb.final || verb.ko);
    if(cKey === 'tense_polite')  return conj ? conj.stem(verb.ko) + '겠어요' : (verb.final || verb.ko);
    if(cKey === 'tense_promise') return conj ? conj.future(verb.ko).replace('거예요', '게요').replace(' 게요', '게요') : (verb.final || verb.ko);

    if(verb.forms && verb.forms[cKey]) return verb.forms[cKey];
    return conj ? conj.present(verb.ko) : (verb.final || verb.ko || '');
  }

  function buildClauseKorean(clause, opts){
    var skipVerb = opts && opts.skipVerb;
    var parts = [];

    var topic = itemOf(clause, 'topic');
    var topic2 = itemOf(clause, 'topic2');
    var associate = itemOf(clause, 'associate');
    var time = itemOf(clause, 'time');
    var departure = itemOf(clause, 'departure');
    var transit = itemOf(clause, 'transit');
    var embSub = itemOf(clause, 'embSub');
    var embPred = itemOf(clause, 'embPred');
    var beneficiary = itemOf(clause, 'beneficiary');
    var numeral = itemOf(clause, 'numeral');
    var quantifier = itemOf(clause, 'quantifier');
    var object1 = itemOf(clause, 'object1');
    var object2 = itemOf(clause, 'object2');
    var adverb = itemOf(clause, 'adverb');
    var adverb2 = itemOf(clause, 'adverb2');
    var verbKo = renderVerbKo(clause);

    // Adverbs that describe a physical/permanent attribute of the subject
    // go BEFORE the subject as Korean relative clause modifiers (눈이 큰 소녀는).
    // Regular manner adverbs stay after the object, before the verb.
    var subjectAttrs = [];
    var mannerAdvs = [];
    [adverb, adverb2].forEach(function(adv){
      if(!adv || !adv.ko) return;
      if(adv.modifiesSubject) subjectAttrs.push(adv.ko);
      else mannerAdvs.push(adv.ko);
    });

    if(topic && topic.ko){
      if(subjectAttrs.length){
        var base = removeTopicParticle(topic.ko);
        var ptcl = topic.ko.slice(base.length);
        parts.push(subjectAttrs.join(' ') + ' ' + base + ptcl);
      } else {
        parts.push(topic.ko);
      }
    }
    if(topic2 && topic2.ko) parts.push(removeTopicParticle(topic2.ko) + '하고');
    // Comitative (와/과): person you do the action with — placed right after topic
    if(associate && associate.ko) parts.push(associate.ko);
    if(time && time.ko) parts.push(time.ko);
    // Motion-to verbs (가다/오다/도착하다) take destination particle 에, not 에서
    var MOTION_TO = { '가다': 1, '오다': 1, '도착하다': 1 };
    var verbItem = itemOf(clause, 'verb');
    var isMotionTo = verbItem && MOTION_TO[verbItem.ko];
    // When verb-gapping a motion clause, chain locations with 하고 (시장하고 식당에 가요)
    // instead of a comma (시장에, 식당에 가요) which is unnatural Korean.
    var useLocChain = skipVerb && isMotionTo && !!(departure && departure.ko) && !(transit && transit.ko);
    if(departure && departure.ko){
      var depKo = isMotionTo ? departure.ko.replace(/에서$/, '에') : departure.ko;
      if(useLocChain) depKo = depKo.replace(/에$/, '하고');
      if(transit && transit.ko){
        var depBase = depKo.replace(/에서$|에$/, '');
        var locConj = (window.Conjugation && window.Conjugation.hasBatchim(depBase)) ? '과' : '와';
        parts.push(depBase + locConj + ' ' + transit.ko);
      } else {
        parts.push(depKo);
      }
    } else if(transit && transit.ko){
      parts.push(transit.ko);
    }
    // Embedded (subordinate) clause — acts as complex object.
    // Quotative verbs (말하다, 생각하다) take -다고; all others take -다는 걸.
    if(embSub && embSub.ko && embPred && embPred.ko){
      var clausalForm = (embPred.raw && embPred.raw.clausal) ? embPred.raw.clausal : (embPred.ko + '다는 걸');
      var mainVerb = itemOf(clause, 'verb');
      if(mainVerb && QUOTATIVE_VERBS[mainVerb.ko]){
        clausalForm = clausalForm.replace(/는 걸$/, '고');
      }
      parts.push(embSub.ko + ' ' + clausalForm);
    }
    // Indirect object / recipient (에게): placed before the direct object
    if(beneficiary && beneficiary.ko) parts.push(beneficiary.ko);
    if(object1 && object1.ko){
      parts.push(object1.ko);
      // numeral + quantifier follow the object they quantify (커피를 한 잔 마셔요)
      if(numeral && numeral.ko) parts.push(numeral.ko);
      if(quantifier && quantifier.ko) parts.push(quantifier.ko);
    }
    if(object2 && object2.ko) parts.push(object2.ko);
    mannerAdvs.forEach(function(ko){ parts.push(ko); });
    // Purpose clause: motion verb → -(으)러 (보러 가다); other → -(으)려고 (벌려고 일하다)
    if(!skipVerb && clause.__purposeVerbItem){
      var pv = clause.__purposeVerbItem;
      var pvStem = pv.ko.replace(/다$/, '');
      var pvNeedsEu = window.Conjugation && window.Conjugation.euOrNot(pvStem);
      var purposeSuffix = isMotionTo
        ? (pvNeedsEu ? '으러' : '러')
        : (pvNeedsEu ? '으려고' : '려고');
      parts.push(pvStem + purposeSuffix);
    }
    if(!skipVerb && verbKo) parts.push(verbKo);

    var result = cleanSentenceText(parts.join(' '));
    return (skipVerb && !useLocChain) ? result + ',' : result;
  }

  function buildFullOutput(){
    var ko = [];
    var n = state.clauses.length;

    for(var i = 0; i < n; i++){
      var clause = state.clauses[i];
      var nextClause = state.clauses[i + 1];

      // Verb gapping: when this clause uses seq(고) and the next clause
      // inherited the same verb, drop the verb from this clause and use
      // a comma separator instead.
      // "아침에 시장에서 가고 저녁에 식당에서 가요"
      //   → "아침에 시장에서, 저녁에 식당에서 가요"
      var doGap = false;
      if(nextClause && nextClause.__inheritedVerb){
        var connItem = itemOf(clause, 'connector');
        var verbItem = itemOf(clause, 'verb');
        var nextVerbItem = itemOf(nextClause, 'verb');
        doGap = connItem && connItem.key === 'seq' &&
                verbItem && nextVerbItem &&
                verbItem.ko === nextVerbItem.ko;
      }

      var lineKo = buildClauseKorean(clause, doGap ? { skipVerb: true } : null);
      if(lineKo) ko.push(lineKo);
    }

    return {
      korean: cleanSentenceText(ko.join(' ')),
      translation: (state.text || '').trim()
    };
  }

  // Verbs that cannot take a direct object with 를/을
  var INTRANSITIVE_VERBS = {
    '가다':1,'오다':1,'도착하다':1,'떠나다':1,'돌아오다':1,
    '자다':1,'쉬다':1,'울다':1,'웃다':1,'달리다':1,'산책하다':1,'일어나다':1,
    '기쁘다':1,'슬프다':1,'화나다':1,'피곤하다':1
  };
  // 있다 takes 이/가 (subject marker) for the possessed item, not 를/을
  var EXISTENTIAL_VERBS = { '있다':1 };

  // Quotative verbs take -다고 (reported speech/thought); all others use -다는 걸 (nominalized)
  var QUOTATIVE_VERBS = { '말하다':1, '생각하다':1 };

  function renderPreview(){
    var built = buildFullOutput();
    var korean = built.korean || '';
    var words = korean ? korean.split(/\s+/).filter(Boolean) : [];

    // Warn when an incompatible verb+object combination is detected
    var warnEl = document.getElementById('grammarWarning');
    if(warnEl){
      var conflictVerb = null;
      var conflictType = null;
      var hasAccObj = function(o){ return o && o.ko && /[를을]$/.test(o.ko); };
      state.clauses.forEach(function(clause){
        if(conflictVerb) return;
        var vb = itemOf(clause, 'verb');
        if(!vb || !vb.ko) return;
        var o1 = itemOf(clause, 'object1');
        var o2 = itemOf(clause, 'object2');
        if(EXISTENTIAL_VERBS[vb.ko] && (hasAccObj(o1) || hasAccObj(o2))){
          conflictVerb = vb; conflictType = 'existential';
        } else if(INTRANSITIVE_VERBS[vb.ko] && (hasAccObj(o1) || hasAccObj(o2))){
          if(!clause.__purposeVerbItem){
            conflictVerb = vb; conflictType = 'intransitive';
          }
        }
      });
      if(conflictVerb){
        warnEl.hidden = false;
        var msg;
        if(conflictType === 'existential'){
          msg = state.lang === 'en'
            ? '⚠ “있다” uses 이/가 for the possessed item, not 를/을. E.g.: 책이 있어요, not 책을 있어요.'
            : '⚠ “있다” cere marcator 이/가 pentru obiectul posedat, nu 를/을. Ex: 책이 있어요, nu 책을 있어요.';
        } else {
          msg = state.lang === 'en'
            ? '⚠ “' + conflictVerb.ko + '” (' + conflictVerb.en + ') does not take a direct object with 를/을.'
            : '⚠ “' + conflictVerb.ko + '” (' + conflictVerb.ro + ') nu acceptă obiect direct cu 를/을.';
        }
        warnEl.textContent = msg;
      } else {
        warnEl.hidden = true;
      }
    }

    if(els.sentenceWords){
      els.sentenceWords.innerHTML = words.map(function(word){
        var result = (typeof GrammarColor !== 'undefined') ? GrammarColor.detectRole(word) : null;
        if(result){
          var clean  = word.replace(/[.,!?。、…~※「」]+$/, '');
          var stem   = clean.slice(0, clean.length - result.endLen);
          var ending = word.slice(stem.length);
          var sc = GrammarColor.COLORS[result.role];
          var rc = (GrammarColor.STEM_COLORS && GrammarColor.STEM_COLORS[result.role]) || '#8899aa';
          return '<span class="word gk-split">' +
            (stem ? '<span style="color:'+sc+';-webkit-text-fill-color:'+sc+'">'+escapeHtml(stem)+'</span>' : '') +
            '<span style="color:'+rc+';-webkit-text-fill-color:'+rc+'">'+escapeHtml(ending)+'</span>' +
            '</span>';
        }
        return '<span class="word">' + escapeHtml(word) + '</span>';
      }).join('');
    }

    if(els.translationText && document.activeElement !== els.translationText){
      els.translationText.textContent = built.translation || currentUI().defaultTranslation;
    }

    if(korean) autoSpeakSentence(korean);
    renderPatternSuggestions();
  }

  function renderPatternSuggestions() {
    var panel = document.getElementById('patternSuggestions');
    if (!panel) return;

    // Collect all filled field keys across clauses
    var filled = new Set();
    state.clauses.forEach(function(clause) {
      ALL_FIELD_KEYS.forEach(function(k) {
        if (clause[k] && clause[k].ko) filled.add(k);
      });
    });

    if (filled.size === 0) { panel.innerHTML = ''; return; }

    // Score each template by overlap with filled fields
    var scored = TEMPLATES.map(function(tmpl) {
      var match = tmpl.fields.filter(function(f) { return filled.has(f); }).length;
      return { tmpl: tmpl, match: match, total: tmpl.fields.length };
    }).filter(function(s) { return s.match > 0; })
      .sort(function(a, b) {
        var scoreA = a.match / a.total;
        var scoreB = b.match / b.total;
        return scoreB - scoreA || a.total - b.total;
      }).slice(0, 3);

    if (!scored.length) { panel.innerHTML = ''; return; }

    var lang = state.lang || 'ro';
    var label = lang === 'ro' ? 'Tipare posibile:' : 'Possible patterns:';
    panel.innerHTML =
      '<span class="msf-sug-label">' + label + '</span>' +
      scored.map(function(s) {
        return '<span class="msf-sug-chip" title="' + (lang === 'ro' ? s.tmpl.ro : s.tmpl.en) + '">' +
          s.tmpl.code +
        '</span>';
      }).join('');
  }

  function getVisibleColumns(){
    var levelFields = getLevelFields();
    var detected = state.detectedFields || [];
    var combined = ALL_FIELD_KEYS.filter(function(fk){
      return levelFields.indexOf(fk) !== -1 || detected.indexOf(fk) !== -1;
    });
    return combined.map(function(fk){ return FIELD_META[fk]; }).filter(Boolean);
  }

  function renderCell(clauseIndex, col){
    var clause = state.clauses[clauseIndex];
    var active = isFieldActive(clause, col.key);
    var item = active ? itemOf(clause, col.key) : null;
    var value = item && item.ko ? item.ko : '';
    var meta = item ? (translationOf(item) || '') : '';
    var conjugated = false;
    var isNew = false;

    if(col.key === 'verb' && active && item && item.ko){
      var conjForm = renderVerbKo(clause);
      if(conjForm){
        value = item.ko;
        var tr = translationOf(item) || '';
        meta = conjForm + (tr ? ' · ' + tr : '');
        conjugated = true;
      }
    }

    if(col.key === 'departure' && active && item && item.ko){
      var MOTION_TO = {'가다':1,'오다':1,'도착하다':1};
      var verbItem = itemOf(clause, 'verb');
      if(verbItem && MOTION_TO[verbItem.ko]){
        value = item.ko.replace(/에서$/, '에');
      }
    }

    if(active && item && item.ko) isNew = isWordNew(col.key, item);

    var lenTier = value.length > 14 ? 'xl' : value.length > 9 ? 'lg' : value.length > 5 ? 'md' : '';
    return '' +
      '<div class="tableField ' + (active ? '' : 'off') + '">' +
        '<button class="tableToggle ' + (active ? 'active' : '') + '" data-toggle-cell="' + clauseIndex + ':' + col.key + '" type="button">✓</button>' +
        '<div class="tableMainBtn ' + (item && item.ko ? '' : 'is-empty') + (conjugated ? ' is-conjugated' : '') + (isNew ? ' is-new' : '') + '" data-kind="' + escapeHtml(col.kind) + '" data-cycle-field="' + clauseIndex + ':' + col.key + '">' +
          '<div class="tableMeta">' + escapeHtml(fieldLabel(col.key)) + '</div>' +
          '<input class="tableKoInput" type="text"' +
            ' data-field-input="' + clauseIndex + ':' + col.key + '"' +
            ' data-len="' + lenTier + '"' +
            ' placeholder="한국어..."' +
            ' value="' + escapeHtml(value) + '"' +
            ' autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"' +
          ' />' +
          '<div class="tableMeta tableMetaTr">' + escapeHtml(meta) + '</div>' +
          '<button class="tableCycleBtn" data-cycle-field="' + clauseIndex + ':' + col.key + '" type="button" title="Următor">↻</button>' +
        '</div>' +
      '</div>';
  }

  function handleCellInput(clauseIndex, fieldKey, value){
    var clause = state.clauses[clauseIndex];
    if(!clause) return;

    var koText = value.trim();

    if(!koText){
      clearFieldFromClause(clause, fieldKey);
      ensureChainLength();
      renderPreview();
      return;
    }

    // Look for a predefined match (gets translation)
    var isLast = clauseIndex === state.clauses.length - 1;
    var options = getOptionsForField(fieldKey, isLast);
    var match = null;
    for(var i = 0; i < options.length; i++){
      if(options[i] && options[i].ko === koText){ match = options[i]; break; }
    }

    var item = match || {
      id: 'custom-' + fieldKey,
      key: 'custom',
      bucket: fieldKey,
      index: -1,
      ko: koText,
      ro: '',
      en: '',
      aliases: [],
      final: '',
      forms: {},
      raw: null
    };

    if(!clause.__picked) clause.__picked = {};
    clause.__picked[fieldKey] = item;

    if(FIELD_BINDINGS[fieldKey]){
      clause[FIELD_BINDINGS[fieldKey]].enabled = true;
    } else if(clause.extras){
      clause.extras[fieldKey] = item;
    }

    // Patch only the translation meta in the cell to avoid losing focus
    var inputEl = els.clauseList
      ? els.clauseList.querySelector('[data-field-input="' + clauseIndex + ':' + fieldKey + '"]')
      : null;
    if(inputEl){
      var cellDiv = inputEl.closest('.tableMainBtn');
      if(cellDiv){
        var metaTr = cellDiv.querySelector('.tableMetaTr');
        if(metaTr) metaTr.textContent = match ? translationOf(match) : '';
        cellDiv.classList.toggle('is-empty', !koText);
      }
    }

    renderPreview();
  }

  function renderClauses(){
    ensureChainLength();
    if(!els.clauseList) return;

    var cols = getVisibleColumns();
    var colCount = cols.length;
    var html = '<div class="builderTableWrap"><table class="builderTable builderTableCompact"><tbody>';

    for(var r=0;r<state.clauses.length;r++){
      html += '<tr>';
      for(var c=0;c<colCount;c++){
        html += '<td>' + renderCell(r, cols[c]) + '</td>';
      }
      html += '</tr>';
    }

    html += '</tbody></table></div>';
    if(colCount > 1){
      html += '<div class="tableScrollDots" id="tableScrollDots"></div>';
    }
    els.clauseList.innerHTML = html;

    var wrap = els.clauseList.querySelector('.builderTableWrap');
    if(wrap){
      updateScrollIndicators(wrap, colCount);
      wrap.addEventListener('scroll', function(){
        updateScrollIndicators(wrap, colCount);
      }, { passive: true });
    }
  }

  function updateScrollIndicators(wrap, colCount){
    var maxScroll = wrap.scrollWidth - wrap.clientWidth;
    var scrollLeft = wrap.scrollLeft;

    var fadeEl = document.getElementById('tableFadeRight');
    if(fadeEl){
      var atEnd = maxScroll <= 0 || scrollLeft >= maxScroll - 4;
      fadeEl.style.opacity = atEnd ? '0' : '';
    }

    var dotsEl = document.getElementById('tableScrollDots');
    if(dotsEl && colCount > 1 && maxScroll > 0){
      var current = Math.min(colCount - 1, Math.round((scrollLeft / maxScroll) * (colCount - 1)));
      dotsEl.innerHTML = Array.from({ length: colCount }, function(_, i){
        return '<span class="tDot' + (i === current ? ' active' : '') + '"></span>';
      }).join('');
    }
  }

  function updateChrome(){
    if(els.freeText){
      els.freeText.placeholder = currentUI().placeholder;
    }

    if(els.topicSummaryText){
      els.topicSummaryText.textContent = 'T' + state.level + ' ▾';
    }

    if(els.topicDropdown){
      var buttons = els.topicDropdown.querySelectorAll('.topicOption');
      for(var i=0;i<buttons.length;i++){
        buttons[i].classList.toggle('active', Number(buttons[i].getAttribute('data-level')) === state.level);
      }
    }

    var label = els.recordBox ? els.recordBox.querySelector('.recordedLabel') : null;
    if(label){
      label.textContent = currentUI().recordedLabel;
    }

    updateQuizBar();
  }

  function renderAll(){
    ensureChainLength();
    updateChrome();
    renderPreview();
    renderClauses();
  }

  function setLang(lang){
    state.lang = lang === 'en' ? 'en' : 'ro';
    var isRo = state.lang === 'ro';
    var el = function(id){ return document.getElementById(id); };
    var homeBtn = document.querySelector('.homeBtn');
    if(homeBtn) homeBtn.setAttribute('aria-label', isRo ? 'Acasă' : 'Home');
    var freeText = el('freeText');
    if(freeText) freeText.placeholder = isRo ? 'Scrie o propoziție în română sau engleză...' : 'Write a sentence in Romanian or English...';
    var sentenceBox = el('sentenceBox');
    if(sentenceBox) sentenceBox.setAttribute('aria-label', isRo ? 'Ascultă propoziția' : 'Listen to sentence');
    var translationText = el('translationText');
    if(translationText) translationText.setAttribute('data-placeholder', isRo ? 'traducere...' : 'translation...');
    var playBtn = el('playBtn');
    if(playBtn){ playBtn.title = isRo ? 'Ascultă' : 'Listen'; playBtn.setAttribute('aria-label', isRo ? 'Ascultă' : 'Listen'); }
    var recordBtn = el('recordBtn');
    if(recordBtn){ recordBtn.title = isRo ? 'Înregistrează' : 'Record'; recordBtn.setAttribute('aria-label', isRo ? 'Înregistrează' : 'Record'); }
    var saveBtn = el('saveBtn');
    if(saveBtn){ saveBtn.title = isRo ? 'Salvează' : 'Save'; saveBtn.setAttribute('aria-label', isRo ? 'Salvează' : 'Save'); }
    var refreshBtn = el('refreshBtn');
    if(refreshBtn){ refreshBtn.title = isRo ? 'Resetează' : 'Reset'; refreshBtn.setAttribute('aria-label', isRo ? 'Resetează' : 'Reset'); }
    var recLabel = document.querySelector('.recordedLabel');
    if(recLabel) recLabel.textContent = UI[state.lang].recordedLabel;
    var vesselHint = document.querySelector('.msf-vessel-hint');
    if(vesselHint) vesselHint.textContent = isRo ? 'construiește în câmpul de mai jos →' : 'build in the field below →';
    renderTemplateMenu();
    renderSavedPanel();
    renderAll();
  }

  function setLevel(level){
    level = Number(level);
    if(!level || level < 1 || level > 6) level = 1;
    state.level = level;
    state.detectedFields = [];
    ensureChainLength();
    renderAll();
  }

  function ensureChainLength(){
    if(!Array.isArray(state.clauses) || !state.clauses.length){
      state.clauses = [makeEmptyLayoutClause()];
    }

    var required = 1;

    for(var i=0;i<state.clauses.length;i++){
      var conn = itemOf(state.clauses[i], 'connector');
      var connKey3 = conn ? (conn.key || conn.id || '') : '';
      if(conn && connKey3 && connKey3 !== 'none' && connKey3.indexOf('tense_') !== 0){
        required = i + 2;
      }else{
        break;
      }
    }

    while(state.clauses.length < required){
      state.clauses.push(makeEmptyLayoutClause());
    }

    while(state.clauses.length > required){
      state.clauses.pop();
    }

    var visible = getLevelFields();
    var detected = state.detectedFields || [];
    for(var r=0;r<state.clauses.length;r++){
      var clause = ensureClauseShape(state.clauses[r]);
      for(var k=0;k<ALL_FIELD_KEYS.length;k++){
        var fieldKey = ALL_FIELD_KEYS[k];
        if(visible.indexOf(fieldKey) === -1 && detected.indexOf(fieldKey) === -1){
          clearFieldFromClause(clause, fieldKey);
        }
      }
    }

    // Auto-set tense_pres on the last clause only if connector is completely unset
    var lastClause = state.clauses[state.clauses.length - 1];
    if(!lastClause.connector || !lastClause.connector.enabled){
      var tensePres = null;
      for(var t=0;t<DATA.connector.length;t++){
        if(DATA.connector[t].id === 'tense_pres'){ tensePres = DATA.connector[t]; break; }
      }
      if(tensePres){
        var tpIdx = DATA.connector.indexOf(tensePres);
        setFieldItem(lastClause, 'connector', normalizeItem(tensePres, 'connector', tpIdx));
      }
    }
  }

  function findBestMatch(fieldKey, text){
    var options = getOptionsForField(fieldKey);
    var normalizedText = ' ' + normalizeLatin(text) + ' ';
    if(!normalizedText.trim()) return null;
    var strippedText = normalizedText.replace(/[.,!?;:'"()]/g,' ').replace(/ {2,}/g,' ');

    var best = null;
    var bestLen = 0;
    // Fallback for verbs: sa-preceded match (subjunctive/purpose verb)
    var bestSa = null;
    var bestSaLen = 0;

    for(var i=0;i<options.length;i++){
      var item = options[i];
      var candidates = [item.ko, item.ro, item.en, item.key].concat(item.aliases || []);

      for(var j=0;j<candidates.length;j++){
        var candidate = normalizeLatin(candidates[j]);
        if(!candidate) continue;

        var pos = normalizedText.indexOf(' ' + candidate + ' ');
        if(pos === -1) pos = strippedText.indexOf(' ' + candidate + ' ');
        if(pos === -1) continue;

        // For verbs: check if this match is preceded by 'sa' (Romanian subjunctive) or
        // 'to' (English infinitive). These signal a purpose verb, not the main verb.
        if(fieldKey === 'verb'){
          var before = normalizedText.substring(0, pos).trimEnd();
          var prevWord = before.split(/\s+/).pop();
          if(prevWord === 'sa' || prevWord === 'to'){
            if(candidate.length > bestSaLen){ bestSa = item; bestSaLen = candidate.length; }
            continue;
          }
        }

        if(candidate.length > bestLen){
          best = item;
          bestLen = candidate.length;
        }
      }
    }

    // For verbs: use sa-preceded verb only if no main verb found
    return best || (fieldKey === 'verb' ? bestSa : null);
  }

  function findAllMatches(fieldKey, text, maxCount){
    var options = getOptionsForField(fieldKey);
    var normalizedText = ' ' + normalizeLatin(text) + ' ';
    var hits = [];

    for(var i=0;i<options.length;i++){
      var item = options[i];
      if(!item || !item.ko) continue;

      var candidates = [item.ko, item.ro, item.en, item.key].concat(item.aliases || []);
      var bestPos = -1;
      var bestLen = 0;

      for(var j=0;j<candidates.length;j++){
        var candidate = normalizeLatin(candidates[j]);
        if(!candidate) continue;

        var pos = normalizedText.indexOf(' ' + candidate + ' ');
        if(pos === -1){
          // Strip punctuation and retry — handles end-of-sentence (seara.) without
          // falling back to arbitrary substring matching that causes false positives
          // (e.g. alias 'tu' found inside 'studiat').
          var stripped = normalizedText.replace(/[.,!?;:'"()]/g,' ').replace(/ {2,}/g,' ');
          pos = stripped.indexOf(' ' + candidate + ' ');
        }

        if(pos !== -1 && candidate.length > bestLen){
          bestPos = pos;
          bestLen = candidate.length;
        }
      }

      if(bestPos !== -1){
        hits.push({
          item: item,
          pos: bestPos,
          len: bestLen
        });
      }
    }

    hits.sort(function(a,b){
      if(a.pos !== b.pos) return a.pos - b.pos;
      return b.len - a.len;
    });

    var out = [];
    var seen = {};
    var usedPos = [];

    for(var h=0; h<hits.length; h++){
      var key = hits[h].item.id + '|' + hits[h].item.ko;
      if(seen[key]) continue;

      // Skip if a different item already claimed this text position
      var overlaps = false;
      for(var u=0; u<usedPos.length; u++){
        if(hits[h].pos < usedPos[u].end && hits[h].pos + hits[h].len > usedPos[u].start){
          overlaps = true; break;
        }
      }
      if(overlaps) continue;

      seen[key] = true;
      usedPos.push({ start: hits[h].pos, end: hits[h].pos + hits[h].len });
      out.push(hits[h].item);
      if(out.length >= (maxCount || 10)) break;
    }

    return out;
  }

  // Position of the second distinct verb mention in (already normalizeLatin'd)
  // text, or -1 if there's only one (or none). Mirrors findAllMatches' own
  // longest-candidate-wins matching, kept separate because that function
  // discards match positions once it dedupes to a plain item list.
  function findSecondVerbSplitPos(normalizedSegText){
    var options = getOptionsForField('verb');
    var normalizedText = ' ' + normalizedSegText + ' ';
    var hits = [];

    for(var i=0;i<options.length;i++){
      var item = options[i];
      if(!item || !item.ko) continue;
      var candidates = [item.ko, item.ro, item.en, item.key].concat(item.aliases || []);
      var bestPos = -1, bestLen = 0;
      for(var j=0;j<candidates.length;j++){
        var candidate = normalizeLatin(candidates[j]);
        if(!candidate) continue;
        var pos = normalizedText.indexOf(' ' + candidate + ' ');
        if(pos !== -1 && candidate.length > bestLen){ bestPos = pos; bestLen = candidate.length; }
      }
      if(bestPos !== -1) hits.push({ item: item, pos: bestPos, len: bestLen });
    }

    hits.sort(function(a,b){ return a.pos - b.pos; });

    // Same-position ties happen for real (e.g. 드시다, the honorific of 먹다,
    // shares 먹다's conjugated Romanian aliases since both gloss "a mânca") —
    // skip any hit whose span overlaps the first match, not just same-ko ones,
    // so a tied duplicate at position 0 doesn't masquerade as "the second verb".
    var first = null;
    for(var h=0; h<hits.length; h++){
      if(!first){ first = hits[h]; continue; }
      if(hits[h].pos < first.pos + first.len){ continue; }
      // -1 to undo the leading padding space added to normalizedText above.
      return hits[h].pos - 1;
    }
    return -1;
  }

  function splitIntoSegments(text){
    var _COMMA_PH = 'xcommax';
    var working = ' ' + normalizeLatin(text.replace(/,/g, ' ' + _COMMA_PH + ' ')) + ' ';
    // Multi-word / specific markers must come BEFORE short single-word markers
    // to avoid partial matches (e.g. 'ca' in 'cu toate că' must not be eaten first).
    var markers = [
      {key:'purpose',       phrases:['ca sa','ca să','in order to']},
      {key:'concede2',      phrases:['cu toate ca','cu toate că','desi','deși','even though']},
      {key:'concede',       phrases:['chiar daca','chiar dacă','even if']},
      {key:'purpose2',      phrases:['pentru a','in order to do']},
      {key:'while',         phrases:['in timp ce','pe cand','pe când','while doing']},
      {key:'after',         phrases:['dupa ce','după ce','after doing']},
      {key:'before',        phrases:['inainte sa','înainte să','inainte de a','înainte de a','before doing']},
      {key:'asap',          phrases:['imediat ce','as soon as']},
      {key:'aslong',        phrases:['atat timp cat','atât timp cât','as long as']},
      {key:'formal_cause',  phrases:['deoarece','given that']},
      // TOPIK 5-6: must be before 'cause1'('ca'), 'contrast1'('dar'), 'seq'('si')
      {key:'proportion',    phrases:['cu atat','cu atât']},
      {key:'notonly',       phrases:['ci si','ci și','but also','nu numai ci']},
      {key:'contrast3',     phrases:['pe de alta parte','pe de altă parte','whereas']},
      {key:'formal_result', phrases:['prin urmare','therefore']},
      {key:'extent',        phrases:['astfel incat','astfel încât','so that']},
      {key:'informal_cause',phrases:['vazand ca','văzând că','seeing that']},
      {key:'because_of',    phrases:['din cauza ca','din cauza că','due to','because of']},
      {key:'cause1',        phrases:['pentru ca','pentru că','because']},
      {key:'cause2',        phrases:['fiindca','fiindcă','since']},
      {key:'condition',     phrases:['daca','dacă','if']},
      {key:'contrast1',     phrases:['dar','insa','însă','but','however']},
      {key:'contrast2',     phrases:['iar']},
      {key:'or',            phrases:['sau','or']},
      {key:'seq',           phrases:['si apoi','și apoi','dupa aceea','după aceea','and then','si','and']}
    ];

    for(var i=0;i<markers.length;i++){
      for(var j=0;j<markers[i].phrases.length;j++){
        var phrase = normalizeLatin(markers[i].phrases[j]);
        if(phrase){
          working = working.split(' ' + phrase + ' ').join(' |||' + markers[i].key + '||| ');
        }
      }
    }

    working = working.replace(/\bxcommax\b/g, '|||none|||');

    var parts = working.split('|||');
    var segments = [];
    var currentText = '';

    for(var k=0;k<parts.length;k++){
      var part = String(parts[k] || '').trim();
      if(!part) continue;

      var isConnector = false;
      for(var c=0;c<DATA.connector.length;c++){
        if(DATA.connector[c].key === part){
          isConnector = true;
          break;
        }
      }

      if(isConnector){
        segments.push({ text: currentText.trim(), connector: part });
        currentText = '';
      }else{
        currentText = currentText ? (currentText + ' ' + part) : part;
      }
    }

    if(currentText.trim()){
      segments.push({ text: currentText.trim(), connector: 'none' });
    }

    if(!segments.length){
      segments.push({ text: normalizeLatin(text), connector: 'none' });
    }

    // Absorb empty segments: transfer their connector to the preceding segment.
    // This fixes "studiez, dar" → comma creates {text:'', connector:'contrast1'};
    // the contrast connector moves to the real segment before it.
    // Only overwrite when the absorbed segment carries a meaningful (non-none) connector,
    // so a real connector is never silently erased by a trailing comma/none segment.
    for(var ei = segments.length - 1; ei >= 1; ei--){
      if(segments[ei].text === ''){
        // Only overwrite previous connector if it is still 'none' — prevents a
        // second connector word (e.g. "ca să" after "astfel încât") from erasing
        // the first one that was already correctly assigned.
        if(segments[ei].connector !== 'none' && segments[ei - 1].connector === 'none'){
          segments[ei - 1].connector = segments[ei].connector;
        }
        segments.splice(ei, 1);
      }
    }

    // Handle connector-first sentences: when the connector word starts the sentence
    // (e.g. "Dacă X, Y", "Cu toate că X, Y", "Deoarece X, Y"), the first segment is
    // empty. Move its connector forward onto the first real clause and mark it as
    // "leading" so the SWAP below is suppressed — Romanian order already matches Korean.
    if(segments.length >= 2 && segments[0].text === '' && segments[0].connector !== 'none'){
      var _leadConn = segments[0].connector;
      segments.splice(0, 1);
      if(segments.length > 0 && (!segments[0].connector || segments[0].connector === 'none')){
        segments[0].connector = _leadConn;
        segments[0].leadingConnector = true;
      }
    }

    // A leading connector ("dacă X Y") implies two clauses, but without a comma
    // or a second connector word there was no split point above, so the whole
    // rest of the sentence landed in one segment. Only for THIS narrow, already-
    // two-clauses-implied case, look for a second, distinct verb mention and
    // split the text right before it — e.g. "dacă mananc mere sunt fericit" ->
    // "mananc mere" | "sunt fericit". Scoped to leadingConnector segments only,
    // so plain single-clause sentences are never affected by this heuristic.
    for(var li = 0; li < segments.length; li++){
      if(!segments[li].leadingConnector || !segments[li].text) continue;
      var splitAt = findSecondVerbSplitPos(segments[li].text);
      if(splitAt > 0){
        var firstPart = segments[li].text.slice(0, splitAt).trim();
        var secondPart = segments[li].text.slice(splitAt).trim();
        if(firstPart && secondPart){
          segments[li].text = firstPart;
          segments.splice(li + 1, 0, { text: secondPart, connector: 'none' });
        }
      }
    }

    // In Romanian, many connectors follow the pattern "result CONNECTOR reason",
    // but Korean needs "reason CONNECTOR result". Swap the clause texts so the
    // reason/precondition verb gets the connector suffix, and the main result follows.
    // purpose/purpose2 are excluded: __purposeText folding already handles
    // Korean word order (purpose verb before main verb); swapping would put
    // the wrong text in the main clause slot.
    var SWAP_KEYS = {
      cause1:true, cause2:true,
      after:true, before:true, concede:true, concede2:true, while:true, asap:true
    };
    for(var pi = 0; pi < segments.length - 1; pi++){
      if(!segments[pi].leadingConnector && SWAP_KEYS[segments[pi].connector]){
        var tmp = segments[pi].text;
        segments[pi].text     = segments[pi + 1].text;
        segments[pi + 1].text = tmp;
      }
    }

    return segments;
  }

  // Strip leading modal phrases from purpose text so that
  // "pot să cumpăr o casă" → "cumpăr o casă" (purpose verb detected cleanly)
  function stripModalPrefix(text){
    var n = normalizeLatin(text).trim();
    // Romanian modals: pot să, trebuie să, încerc să, reușesc să, vreau să
    n = n.replace(/^(pot|trebuie|incerc|reusesc|vreau|vrei|vrea|vrem)\s+sa\s+/, '');
    // English modals: can, must, have to, want to, try to
    n = n.replace(/^(can|must|have to|want to|try to|need to)\s+/, '');
    return n || text;
  }

  function detectTenseFromText(text){
    var n = normalizeLatin(text);

    // Negation — checked before past/future
    if(/\b(nu pot|nu pot sa|cannot|can't|cant)\b/.test(n)) return 'cannot';
    if(/\b(nu vreau|nu doresc|nu vrei|don't want|do not want|dont want)\b/.test(n)) return 'notwish';
    if(/\b(nu trebuie|nu ar trebui|must not|mustn't|mustnt)\b/.test(n)) return 'mustnot';
    // Exclude 'nu numai' (not only…) — that 'nu' is not a negation
    if((/\bnu\b/.test(n) && !/\bnu numai\b/.test(n)) || /\b(don't|doesn't|do not|does not|dont|doesnt)\b/.test(n)) return 'neg';

    // Obligations
    if(/\b(ar trebui|should|ought to)\b/.test(n)) return 'should';
    if(/\b(trebuie|must|have to|has to|need to|needs to)\b/.test(n)) return 'must';

    // Romanian conditional mood: aș/ai/ar + infinitive (normalized as/ai/ar)
    // 'as' = aș (1st sg) — always conditional in Romanian; exclude common English 'as X' phrases
    if(/\bas [a-z]/.test(n) && !/\b(such as|as well|as long|as soon|as far|as if|as much|as many|as per|as usual|as often|as though)\b/.test(n)) return 'polite';
    // 'ai/ar' + infinitive ending in a/e/i (distinguishes from past participles ending in consonants)
    if(/\b(ai|ar)\s+[a-z]+[aei]\b/.test(n)) return 'polite';

    // Past Romanian: participii cunoscute (normalizate, fără diacritice)
    var roParts = ['mers','mancat','venit','vazut','citit','scris','intalnit',
                   'odihnit','lucrat','studiat','pregatit','invatat','ascultat',
                   'facut','cumparat','dat',
                   // verbe existente — participii lipsă anterior
                   'asteptat','multumit','zambit','lasat','baut','dormit','cantat',
                   'plans','avut','iubit','vorbit','vrut','stiut','ajutat',
                   // verbe noi
                   'ramas','ajuns','intors','gatit','spalat','gasit','pierdut','ales',
                   'deschis','inchis','primit','pus','gandit','oprit','continuat',
                   'trimis','folosit','calatorit','explicat','intrebat','alergat',
                   'adus','plimbat','plecat',
                   // verbe TOPIK 5-6
                   'reusit','esuat','predat','renuntat','progresat','schimbat','decis','devenit',
                   'trebuit','muncit','obtinut','rezolvat','participat','contribuit',
                   'trezit','inteles'];
    // Word-boundary check: prevents 'studiat' matching inside 'studiati', etc.
    var _nn = ' ' + n + ' ';
    for(var i=0;i<roParts.length;i++){
      if(_nn.indexOf(' '+roParts[i]+' ') !== -1) return 'past';
    }
    // Past Romanian: auxiliare de perfect compus — forme cu cratimă și "ați"
    // "ati" (normalizat din "ați") = aux pl.2 distinctiv românesc, nu apare în engleză
    if(/\b(ati|ne-am|m-am|te-ai|s-a|s-au|v-ati)\b/.test(n)) return 'past';
    // "am/ai/a fost" = trecut de la "a fi" (am fost fericit, ai fost trist etc.)
    if(/\b(am fost|ai fost|a fost|am fi fost)\b/.test(n)) return 'past';

    // Future Romanian: voi/vei/va/vom/veți/vor
    // "am să / ai să / o să" — construcție de viitor în română vorbită
    if(/\b(am sa|ai sa|o sa|are sa|avem sa|aveti sa|au sa)\b/.test(n)) return 'future';
    // "voi" singur poate fi pronume (voi = you all); excludem "voi ați/toți"
    if(/\b(vei|va|vom|veti|vor)\b/.test(n)) return 'future';
    // "voi" as subject pronoun (you all) when followed by a 2nd-pl conjugated form
    // ending in -ați/-eți (studiați, mergeți, etc.) — NOT a future auxiliary in that case
    if(/\bvoi\b/.test(n) && !/\bvoi\s*([a-z]+[ae]ti|toti)\b/.test(n)) return 'future';
    // Future English
    if(/\bwill\b/.test(n)) return 'future';

    // Past English: forme neregulate/regulate cunoscute
    var enPast = ['went','ate','came','saw','wrote','met','rested','worked',
                  'exercised','prepared','learned','listened','made','bought',
                  'gave','studied','read ','read,','read.'];
    for(var j=0;j<enPast.length;j++){
      if(n.indexOf(enPast[j].trim()) !== -1) return 'past';
    }

    return 'present';
  }

  function parseTextIntoClauses(){
    var raw = state.text || '';

    if(!String(raw).trim()){
      state.clauses = [makeEmptyLayoutClause()];
      state.detectedFields = [];
      renderAll();
      return;
    }

    var detectedTense = detectTenseFromText(raw);
    var detectedTenseKey = detectedTense === 'past'     ? 'tense_past'
                         : detectedTense === 'future'   ? 'tense_fut'
                         : detectedTense === 'cannot'   ? 'tense_cannot'
                         : detectedTense === 'notwish'  ? 'tense_notwish'
                         : detectedTense === 'mustnot'  ? 'tense_mustnot'
                         : detectedTense === 'neg'      ? 'tense_neg'
                         : detectedTense === 'must'     ? 'tense_must'
                         : detectedTense === 'should'   ? 'tense_should'
                         : detectedTense === 'polite'   ? 'tense_polite'
                         : 'tense_pres';

    // Split on connector markers; create a clause for each segment that has a verb.
    // Verb-less segments (e.g. "la magazin" or "mâine eu" split off by "și") are merged
    // into the adjacent clause so their content (locations, time, subjects) is preserved.
    var segments = splitIntoSegments(raw);
    var clauseData = [];
    var pendingText = '';
    for(var s = 0; s < segments.length; s++){
      var seg = segments[s];
      // Strip relative sub-clauses ("care/which/who ...") — the builder can't parse
      // them and their verb would shadow the main clause verb.
      var cleanText = seg.text.replace(/\s+(?:care|which|who)\s+\S+.*/, '').trim();
      var segText = pendingText ? (pendingText + ' ' + (cleanText || seg.text)) : (cleanText || seg.text);
      pendingText = '';
      var segVerb = findBestMatch('verb', segText);
      // A verb-less segment that has its own time/place/object signals a new
      // predicate with an implied verb (e.g. "și seara la restaurant" after
      // "dimineața merg la piață"). Create a separate clause that inherits
      // the verb from the preceding clause instead of merging backward.
      var segHasCtx = !segVerb && segText && clauseData.length > 0 && (
        findBestMatch('time', segText) ||
        findBestMatch('departure', segText) ||
        findBestMatch('object1', segText)
      );
      // When previous segment ended with "ca sa / pentru a" (purpose connector),
      // fold this segment into that clause as purpose payload rather than a new clause.
      var _prevCd = clauseData.length > 0 ? clauseData[clauseData.length - 1] : null;
      var _isPurposeFollowup = _prevCd && (_prevCd.connKey === 'purpose' || _prevCd.connKey === 'purpose2');

      if(_isPurposeFollowup && segText){
        _prevCd.__purposeText = segText;
        _prevCd.connKey = 'none'; // merge into one clause, no connector needed
      } else if(segVerb){
        clauseData.push({ text: segText, connKey: seg.connector });
      } else if(segHasCtx){
        clauseData.push({ text: segText, connKey: seg.connector, inheritVerb: true });
      } else if(clauseData.length > 0 && segText){
        // Merge backward: attach verb-less text to the preceding clause so that
        // extra locations / subjects in it are picked up (e.g. "și la magazin").
        clauseData[clauseData.length - 1].text += ' ' + segText;
      } else if(segText){
        // Merge forward: no clause yet (e.g. "mâine eu" before "și el mergem").
        pendingText = segText;
      }
    }
    if(pendingText && clauseData.length > 0){
      clauseData[clauseData.length - 1].text += ' ' + pendingText;
    } else if(pendingText){
      clauseData = [{ text: pendingText, connKey: 'none' }];
    }

    // Fallback: treat whole text as one clause
    if(!clauseData.length) clauseData = [{ text: raw, connKey: 'none' }];

    // Build one clause per detected verb segment
    var newClauses = [];
    var lastSubjectKo = null;
    for(var ci = 0; ci < clauseData.length; ci++){
      var cd = clauseData[ci];
      var clause = makeEmptyLayoutClause();
      clause.sourceText = cd.text;

      var subjects = findAllMatches('topic', cd.text, 2);
      var times    = findAllMatches('time', cd.text, 1);
      var places   = findAllMatches('departure', cd.text, 2);
      var objects  = findAllMatches('object1', cd.text, 2);
      var descs    = findAllMatches('adverb', cd.text, 2);
      var verb     = findBestMatch('verb', cd.text);
      // Inherit verb from previous clause when this segment had none explicitly
      // (e.g. "și seara la restaurant" after "dimineața merg la piață")
      if(!verb && cd.inheritVerb && ci > 0){
        verb = findBestMatch('verb', clauseData[ci - 1].text);
      }

      // Proper noun fallback: if no vocab subject found, look for a capitalized word
      // in the original text that isn't already matched by another category
      if(!subjects.length){
        var rawWords = raw.split(/\s+/);
        for(var pw = 0; pw < rawWords.length && pw < 5; pw++){
          var ow = rawWords[pw];
          if(ow && /^[A-ZĂÎȘȚ]/.test(ow)){
            var owNorm = normalizeLatin(ow);
            if(cd.text.indexOf(owNorm) !== -1 &&
               !findBestMatch('departure', owNorm) &&
               !findBestMatch('time', owNorm) &&
               !findBestMatch('verb', owNorm) &&
               !findBestMatch('object1', owNorm)){
              var ptcl = 'aeiou'.indexOf(ow[ow.length-1].toLowerCase()) >= 0 ? '는' : '은';
              subjects = [{ key:'topic', kind:'topic', ko: ow+ptcl, ro: ow, en: ow, isProperName: true }];
              break;
            }
          }
        }
      }

      // Topic drop: only set subject if different from previous clause's subject
      if(subjects[0] && subjects[0].ko !== lastSubjectKo){
        setFieldItem(clause, 'topic', subjects[0]);
        lastSubjectKo = subjects[0].ko;
      }
      if(subjects[1]) setFieldItem(clause, 'topic2', subjects[1]);
      // Greeting phrases are standalone — skip time/place/object/adverb to avoid noise
      if(!verb || !verb.isPhrase){
        if(times[0])    setFieldItem(clause, 'time', times[0]);
        if(places[0])   setFieldItem(clause, 'departure', places[0]);
        if(places[1])   setFieldItem(clause, 'transit', places[1]);

        // Purpose clause detection: "sa/să + VERB" in text means the verb after "sa"
        // is a purpose verb (-(으)러 form), NOT the main verb.
        // When main verb is a motion verb (가다/오다), objects belong to the purpose verb.
        var MOTION_VERBS_SET = {'가다':1,'오다':1,'도착하다':1};
        var purposeVerbItem = null;
        if(verb && MOTION_VERBS_SET[verb.ko]){
          // Path 1: "sa + verb" in the same segment text (e.g. "merge la piata sa cumpere")
          var saMatch = (' ' + normalizeLatin(cd.text) + ' ').match(/\bsa\s+(\S+)/);
          if(saMatch){
            var wordAfterSa = saMatch[1].replace(/[!?.,;]/g,'');
            var pvCandidate = findBestMatch('verb', wordAfterSa);
            if(pvCandidate && pvCandidate.ko !== verb.ko) purposeVerbItem = pvCandidate;
          }
          // Path 1b: English "to + infinitive" (e.g. "go to the market to eat food")
          if(!purposeVerbItem){
            var toMatches = normalizeLatin(cd.text).match(/\bto\s+([a-z]+)/g) || [];
            for(var ti = 0; ti < toMatches.length; ti++){
              var wordAfterTo = toMatches[ti].replace(/^to\s+/, '');
              var pvCandTo = findBestMatch('verb', wordAfterTo);
              if(pvCandTo && pvCandTo.ko !== verb.ko){ purposeVerbItem = pvCandTo; break; }
            }
          }
          // Path 2: "ca sa" connector folded a separate segment (e.g. "merge la cinema ca sa vada un film")
          if(!purposeVerbItem && cd.__purposeText){
            var ptText = stripModalPrefix(cd.__purposeText);
            var ptVerb = findBestMatch('verb', ptText);
            if(ptVerb && ptVerb.ko !== verb.ko){
              purposeVerbItem = ptVerb;
              var ptObjs = findAllMatches('object1', ptText, 2);
              if(ptObjs.length) objects = ptObjs;
            }
          }
        } else if(verb){
          // Non-motion verb purpose: connector (__purposeText) or inline să/to → -(으)려고
          if(cd.__purposeText){
            // "ca să/pentru a" split: e.g. "Economisesc ca să cumpăr o casă" → 집을 사려고 저축해요
            var ptText2 = stripModalPrefix(cd.__purposeText);
            var ptVerb2 = findBestMatch('verb', ptText2);
            if(ptVerb2 && ptVerb2.ko !== verb.ko){
              purposeVerbItem = ptVerb2;
              var ptObjs2 = findAllMatches('object1', ptText2, 2);
              if(ptObjs2.length) objects = ptObjs2;
            }
          }
          // Inline "să + verb" without "ca" connector (e.g. "Lucrez să câștig bani")
          if(!purposeVerbItem){
            var saMat2 = (' ' + normalizeLatin(cd.text) + ' ').match(/\bsa\s+(\S+)/);
            if(saMat2){
              var pvW2 = saMat2[1].replace(/[!?.,;]/g,'');
              var pvC2 = findBestMatch('verb', pvW2);
              if(pvC2 && pvC2.ko !== verb.ko) purposeVerbItem = pvC2;
            }
          }
          // Inline "to + verb" (English, e.g. "I work to earn money")
          if(!purposeVerbItem){
            var toMat2 = normalizeLatin(cd.text).match(/\bto\s+([a-z]+)/g) || [];
            for(var ti2 = 0; ti2 < toMat2.length; ti2++){
              var pvWt2 = toMat2[ti2].replace(/^to\s+/, '');
              var pvCt2 = findBestMatch('verb', pvWt2);
              if(pvCt2 && pvCt2.ko !== verb.ko){ purposeVerbItem = pvCt2; break; }
            }
          }
        }
        if(purposeVerbItem) clause.__purposeVerbItem = purposeVerbItem;

        if(objects[0])  setFieldItem(clause, 'object1', objects[0]);
        if(objects[1])  setFieldItem(clause, 'object2', objects[1]);
        if(descs[0])    setFieldItem(clause, 'adverb', descs[0]);
        if(descs[1])    setFieldItem(clause, 'adverb2', descs[1]);
      }
      if(verb)        setFieldItem(clause, 'verb', verb);

      // Set clause connector for intermediate clauses (not the last).
      // Bare comma separation (connKey='none') defaults to seq(고) so that
      // "Mă trezesc, mănânc și merg" → 일어나고 먹고 가요 instead of 일어나요 먹고 가요.
      if(ci < clauseData.length - 1){
        var _ck = (cd.connKey && cd.connKey !== 'none') ? cd.connKey : 'seq';
        var connItem = null; var connIdx = 0;
        for(var k = 0; k < DATA.connector.length; k++){
          if(DATA.connector[k].key === _ck){ connItem = DATA.connector[k]; connIdx = k; break; }
        }
        if(connItem) setFieldItem(clause, 'connector', normalizeItem(connItem, 'connector', connIdx));
      }

      if(cd.inheritVerb) clause.__inheritedVerb = true;
      newClauses.push(clause);
    }

    // Compute detected fields from the newly built clauses (so ensureChainLength preserves them)
    var detectedSet = {};
    for(var dci = 0; dci < newClauses.length; dci++){
      for(var dk = 0; dk < ALL_FIELD_KEYS.length; dk++){
        var dfk = ALL_FIELD_KEYS[dk];
        if(!detectedSet[dfk] && isFieldActive(newClauses[dci], dfk)){
          detectedSet[dfk] = true;
        }
      }
    }
    state.detectedFields = ALL_FIELD_KEYS.filter(function(fk){ return detectedSet[fk]; });

    state.clauses = newClauses;

    // For multi-clause sentences, tense detected globally can bleed from an earlier
    // clause onto the last one. Re-detect from the last clause's own text and override:
    // — negation/modality: always override from last clause
    // — past: only keep past if the last clause itself is also past (prevents
    //   "fiindcă am citit" from making the final "sunt fericită" past)
    if(clauseData.length > 1){
      var _negKeys = {tense_neg:1, tense_notwish:1, tense_mustnot:1, tense_cannot:1};
      var lastClTense2 = detectTenseFromText(clauseData[clauseData.length - 1].text);
      if(_negKeys[detectedTenseKey]){
        var lastClKey = lastClTense2 === 'neg'     ? 'tense_neg'
                      : lastClTense2 === 'notwish' ? 'tense_notwish'
                      : lastClTense2 === 'mustnot' ? 'tense_mustnot'
                      : lastClTense2 === 'cannot'  ? 'tense_cannot'
                      : 'tense_pres';
        detectedTenseKey = lastClKey;
      } else if(detectedTenseKey === 'tense_past' && lastClTense2 !== 'past'){
        // Last clause is present/future even though an earlier clause was past.
        detectedTenseKey = lastClTense2 === 'future' ? 'tense_fut'
                         : lastClTense2 === 'must'   ? 'tense_must'
                         : lastClTense2 === 'should' ? 'tense_should'
                         : 'tense_pres';
      }
    }

    // Per-clause tense for intermediate clauses:
    // negation → clause.negated (읽지 않으면), past → clause.tenseOverride='past' (읽었으면)
    for(var ni = 0; ni < newClauses.length - 1; ni++){
      if(clauseData[ni]){
        var clTns = detectTenseFromText(clauseData[ni].text);
        if(clTns === 'neg'){
          newClauses[ni].negated = true;
          // If the negated clause also contains a past participle (e.g. "nu am mâncat"),
          // set tenseOverride so the connector form becomes 먹지 않았기에 not 먹지 않기에
          var _clStripped = normalizeLatin(clauseData[ni].text).replace(/\bnu\b/g, '');
          if(detectTenseFromText(_clStripped) === 'past') newClauses[ni].tenseOverride = 'past';
        } else if(clTns === 'past'){
          newClauses[ni].tenseOverride = 'past';
        }
        var clNorm = normalizeLatin(clauseData[ni].text);
        if(/\b(vreau sa|vrei sa|vrea sa|vrem sa|want to|would like to)\b/.test(clNorm)) newClauses[ni].wishModal = true;
      }
    }

    // Set detected tense on the last clause
    var lastParsed = state.clauses[state.clauses.length - 1];
    var tenseEntry = null;
    for(var tt = 0; tt < DATA.connector.length; tt++){
      if(DATA.connector[tt].id === detectedTenseKey){ tenseEntry = DATA.connector[tt]; break; }
    }
    if(tenseEntry){
      setFieldItem(lastParsed, 'connector',
        normalizeItem(tenseEntry, 'connector', DATA.connector.indexOf(tenseEntry)));
    }

    ensureChainLength();
    renderAll();
  }

  function ensureVocabSheet(){
    if(document.getElementById('vocabSheet')) return;

    var el = document.createElement('div');
    el.id = 'vocabSheet';
    el.className = 'vocabSheet';
    el.innerHTML = `
      <div class="vocabSheetBackdrop" data-close-vocab="1"></div>
      <div class="vocabSheetPanel">
        <div class="vocabSheetHead">
          <div class="vocabSheetTitle" id="vocabSheetTitle">선택</div>
          <button type="button" class="vocabSheetClose" id="vocabSheetClose">✕</button>
        </div>
        <div class="vocabSheetSearchWrap">
          <input id="vocabSheetSearch" class="vocabSheetSearch" type="text" placeholder="검색">
        </div>
        <div id="vocabSheetList" class="vocabSheetList"></div>
      </div>
    `;
    document.body.appendChild(el);
  }

  function renderVocabSheetList(items){
    var list = document.getElementById('vocabSheetList');
    if(!list) return;

    pickerState.filteredItems = items.slice();

    if(!items.length){
      list.innerHTML = '<div class="vocabEmpty">항목이 없습니다</div>';
      return;
    }

    list.innerHTML = items.map(function(item, index){
      var fresh = isWordNew(pickerState.fieldKey, item);
      var dot = fresh ? '<span class="vocabNewDot"></span>' : '';
      return '<button type="button" class="vocabItem' + (fresh ? ' is-new' : '') + '" data-vocab-index="' + index + '">' +
        '<div class="vocabItemKo">' + dot + escapeHtml(item.ko || '—') + '</div>' +
        '<div class="vocabItemMeta">' + escapeHtml([item.ro, item.en].filter(Boolean).join(' · ')) + '</div>' +
        '</button>';
    }).join('');
  }

  function filterVocabSheet(keyword){
    var q = normalizeLatin(keyword);
    if(!q){
      renderVocabSheetList(pickerState.items);
      return;
    }

    var filtered = pickerState.items.filter(function(item){
      var hay = [item.ko || '', item.ro || '', item.en || '', item.key || '']
        .concat(item.aliases || [])
        .join(' ');
      return normalizeLatin(hay).indexOf(q) !== -1;
    });

    renderVocabSheetList(filtered);
  }

  function openVocabSheet(clauseIndex, fieldKey){
    ensureVocabSheet();

    pickerState.clauseIndex = clauseIndex;
    pickerState.fieldKey = fieldKey;
    var isLastClause = clauseIndex === state.clauses.length - 1;
    pickerState.items = getOptionsForField(fieldKey, isLastClause);

    var root = document.getElementById('vocabSheet');
    var title = document.getElementById('vocabSheetTitle');
    var search = document.getElementById('vocabSheetSearch');

    if(title) title.textContent = TABLE_HEADERS_KO[fieldKey] || '선택';
    if(search) search.value = '';

    renderVocabSheetList(pickerState.items);

    if(root) root.classList.add('open');
    if(search){
      setTimeout(function(){ search.focus(); }, 0);
    }
  }

  function closeVocabSheet(){
    var root = document.getElementById('vocabSheet');
    if(root) root.classList.remove('open');
  }

  function pickVocabItem(index){
    var item = pickerState.filteredItems[index];
    if(!item) return;

    var clause = state.clauses[pickerState.clauseIndex];
    if(!clause) return;

    markWordUsed(pickerState.fieldKey, item);
    setFieldItem(clause, pickerState.fieldKey, item);
    ensureChainLength();
    closeVocabSheet();
    renderAll();
  }

  function playCurrent(){
    var built = buildFullOutput();

    if(!built.korean){
      showToast(currentUI().noSpeech);
      return;
    }

    if(!('speechSynthesis' in window)){
      showToast(currentUI().noSpeech);
      return;
    }

    var activeIndex = -1;
    var wordEls = els.sentenceWords ? els.sentenceWords.querySelectorAll('.word') : [];

    AudioEngine.speak(built.korean, {
      rate: 0.9,
      repeat: 1,
      onboundary: function(){
        activeIndex += 1;
        for(var i=0;i<wordEls.length;i++){
          wordEls[i].classList.toggle('active', i === activeIndex);
        }
      },
      onend: function(){
        for(var i=0;i<wordEls.length;i++){
          wordEls[i].classList.remove('active');
        }
      }
    });
  }

  function detectMimeType(){
    if(window.MediaRecorder && MediaRecorder.isTypeSupported){
      if(MediaRecorder.isTypeSupported('audio/mp4;codecs=mp4a.40.2')) return 'audio/mp4;codecs=mp4a.40.2';
      if(MediaRecorder.isTypeSupported('audio/mp4')) return 'audio/mp4';
      if(MediaRecorder.isTypeSupported('audio/x-m4a')) return 'audio/x-m4a';
      if(MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) return 'audio/webm;codecs=opus';
      if(MediaRecorder.isTypeSupported('audio/webm')) return 'audio/webm';
    }
    return '';
  }

  function toggleRecording(){
    if(!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) || typeof MediaRecorder === 'undefined'){
      showToast(currentUI().recordUnsupported);
      return;
    }

    if(mediaRecorder && mediaRecorder.state === 'recording'){
      mediaRecorder.stop();
      if(els.recordBtn) els.recordBtn.classList.remove('recording');
      showToast(currentUI().recordStop);
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream){
      recordedChunks = [];
      recordedStream = stream;
      var mime = detectMimeType();
      mediaRecorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);

      mediaRecorder.ondataavailable = function(event){
        if(event.data && event.data.size > 0) recordedChunks.push(event.data);
      };

      mediaRecorder.onstop = function(){
        var blobType = mime || (recordedChunks[0] && recordedChunks[0].type) || 'audio/mp4';
        var blob = new Blob(recordedChunks, { type: blobType });

        if(recordedUrl) URL.revokeObjectURL(recordedUrl);
        recordedUrl = URL.createObjectURL(blob);

        if(els.recordedAudio){
          els.recordedAudio.pause();
          els.recordedAudio.removeAttribute('src');
          els.recordedAudio.src = recordedUrl;
          els.recordedAudio.load();
        }

        if(els.recordBox) els.recordBox.classList.add('show');

        if(recordedStream){
          var tracks = recordedStream.getTracks();
          for(var i=0;i<tracks.length;i++) tracks[i].stop();
          recordedStream = null;
        }
      };

      mediaRecorder.start();
      if(els.recordBtn) els.recordBtn.classList.add('recording');
      showToast(currentUI().recordStart);
    }).catch(function(){
      showToast(currentUI().recordUnsupported);
    });
  }

  function resetBuilder(){
    state.text = '';
    if(els.freeText) els.freeText.value = '';

    state.clauses = [makeEmptyLayoutClause()];

    if(els.recordBox) els.recordBox.classList.remove('show');
    if(els.recordedAudio){
      els.recordedAudio.pause();
      els.recordedAudio.removeAttribute('src');
      els.recordedAudio.load();
    }

    renderAll();
  }

  function applyTemplate(tpl){
    state.clauses = [makeEmptyLayoutClause()];
    state.text = '';
    if(els.freeText) els.freeText.value = '';

    // Ensure state.level is high enough so ensureChainLength doesn't clear template fields
    for(var lv = 1; lv <= 6; lv++){
      var lf = LEVEL_FIELDS[lv] || [];
      var lvOk = true;
      for(var fi = 0; fi < tpl.fields.length; fi++){
        var tf = tpl.fields[fi];
        if(ALL_FIELD_KEYS.indexOf(tf) !== -1 && lf.indexOf(tf) === -1){ lvOk = false; break; }
      }
      if(lvOk){ if(state.level < lv) state.level = lv; break; }
    }

    var clause = state.clauses[0];

    tpl.fields.forEach(function(fieldKey){
      var firstItem = getFirstUsableItem(fieldKey, true);
      if(!firstItem) return;
      setFieldItem(clause, fieldKey, firstItem);
      if(FIELD_BINDINGS[fieldKey]){
        clause[FIELD_BINDINGS[fieldKey]].enabled = true;
      }
    });

    if(els.templateSummaryText){
      els.templateSummaryText.textContent = tpl.code + ' ▾';
    }

    if(els.recordBox) els.recordBox.classList.remove('show');
    ensureChainLength();
    renderAll();
  }

  function renderTemplateMenu(){
    if(!els.templateDropdown) return;
    var lang = state.lang || 'ro';

    els.templateDropdown.innerHTML = TEMPLATES.map(function(tpl){
      var desc = lang === 'en' ? tpl.en : tpl.ro;
      return '<button class="tplOption" type="button" data-tpl="' + tpl.id + '">' +
        '<span class="tpl-code">' + tpl.code + '</span>' +
        '<span class="tpl-desc">' + desc + '</span>' +
        '</button>';
    }).join('');
  }

  function bindEvents(){
    RKLang.init(setLang);

    if(els.topicDropdown){
      els.topicDropdown.addEventListener('click', function(event){
        var btn = event.target.closest('.topicOption');
        if(!btn) return;
        setLevel(btn.getAttribute('data-level'));
        var details = document.getElementById('topicMenu');
        if(details) details.removeAttribute('open');
      });
    }

    if(els.templateDropdown){
      els.templateDropdown.addEventListener('click', function(event){
        var btn = event.target.closest('[data-tpl]');
        if(!btn) return;
        var tplId = btn.getAttribute('data-tpl');
        var tpl = null;
        for(var i=0;i<TEMPLATES.length;i++){
          if(TEMPLATES[i].id === tplId){ tpl = TEMPLATES[i]; break; }
        }
        if(tpl) applyTemplate(tpl);
        if(els.templateMenu) els.templateMenu.removeAttribute('open');
      });
    }

    if(els.freeText){
      els.freeText.addEventListener('input', function(){
        state.text = els.freeText.value || '';
        parseTextIntoClauses();
      });
    }

    if(els.refreshBtn){
      els.refreshBtn.addEventListener('click', resetBuilder);
    }

    if(els.playBtn){
      els.playBtn.addEventListener('click', playCurrent);
    }

    if(els.recordBtn){
      els.recordBtn.addEventListener('click', toggleRecording);
    }


    var _saveBtn = document.getElementById('saveBtn');
    if(_saveBtn) _saveBtn.addEventListener('click', addCurrentSentence);

    var _exportBtn = document.getElementById('exportBtn');
    if(_exportBtn) _exportBtn.addEventListener('click', exportSentencesAsTxt);

    var _quizBtn = document.getElementById('quizBtn');
    if(_quizBtn) _quizBtn.addEventListener('click', function(){
      if(quizMode) exitQuizMode(); else enterQuizMode();
    });

    var _quizCheckBtn = document.getElementById('quizCheckBtn');
    if(_quizCheckBtn) _quizCheckBtn.addEventListener('click', checkQuiz);

    var _quizExitBtn = document.getElementById('quizExitBtn');
    if(_quizExitBtn) _quizExitBtn.addEventListener('click', exitQuizMode);

    if(els.sentenceBox){
      els.sentenceBox.addEventListener('click', playCurrent);
      els.sentenceBox.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          playCurrent();
        }
      });
    }

    if(els.clauseList){
      els.clauseList.addEventListener('click', function(event){
        var toggleBtn = event.target.closest('[data-toggle-cell]');
        if(toggleBtn){
          event.preventDefault();
          event.stopPropagation();
          var toggleParts = toggleBtn.getAttribute('data-toggle-cell').split(':');
          toggleFieldActive(Number(toggleParts[0]), toggleParts[1]);
          return;
        }

        // A click on the input itself is for typing/searching, not cycling —
        // only clicks elsewhere on the card (label, translation line, empty
        // padding) advance to the next option.
        var cycleBtn = !event.target.closest('.tableKoInput') && event.target.closest('[data-cycle-field]');
        if(cycleBtn){
          event.preventDefault();

          if(cycleBtn.getAttribute('data-long-press-opened') === '1'){
            cycleBtn.removeAttribute('data-long-press-opened');
            return;
          }

          var parts = cycleBtn.getAttribute('data-cycle-field').split(':');
          cycleFieldValue(Number(parts[0]), parts[1]);
          return;
        }

        // Click directly on the cell's input → focus it for typing/search
        var cellBody = event.target.closest('.tableMainBtn');
        if(cellBody && event.target.closest('.tableKoInput')){
          var inp = cellBody.querySelector('.tableKoInput');
          if(inp){ inp.focus(); inp.select(); }
        }
      });

      els.clauseList.addEventListener('input', function(event){
        var input = event.target.closest('[data-field-input]');
        if(!input) return;
        var len = input.value.length;
        input.dataset.len = len > 14 ? 'xl' : len > 9 ? 'lg' : len > 5 ? 'md' : '';
        var parts = input.getAttribute('data-field-input').split(':');
        handleCellInput(Number(parts[0]), parts[1], input.value);
      });

      els.clauseList.addEventListener('pointerdown', function(event){
        var btn = event.target.closest('[data-cycle-field]');
        if(!btn) return;

        longPressTarget = btn;
        clearTimeout(longPressTimer);

        longPressTimer = setTimeout(function(){
          if(!longPressTarget) return;
          longPressTarget.setAttribute('data-long-press-opened', '1');

          var parts = longPressTarget.getAttribute('data-cycle-field').split(':');
          openVocabSheet(Number(parts[0]), parts[1]);
        }, LONG_PRESS_MS);
      });

      els.clauseList.addEventListener('pointerup', function(){
        clearTimeout(longPressTimer);
        longPressTimer = null;
        longPressTarget = null;
      });

      els.clauseList.addEventListener('pointerleave', function(){
        clearTimeout(longPressTimer);
        longPressTimer = null;
        longPressTarget = null;
      });

      els.clauseList.addEventListener('pointercancel', function(){
        clearTimeout(longPressTimer);
        longPressTimer = null;
        longPressTarget = null;
      });

      els.clauseList.addEventListener('contextmenu', function(event){
        var btn = event.target.closest('[data-cycle-field]');
        if(btn){
          event.preventDefault();
        }
      });
    }

    document.addEventListener('click', function(event){
      var closeBtn = event.target.closest('#vocabSheetClose, [data-close-vocab]');
      if(closeBtn){
        closeVocabSheet();
        return;
      }

      var pickBtn = event.target.closest('[data-vocab-index]');
      if(pickBtn){
        pickVocabItem(Number(pickBtn.getAttribute('data-vocab-index')));
        return;
      }

      var delBtn = event.target.closest('[data-del-idx]');
      if(delBtn){
        deleteSavedSentence(Number(delBtn.getAttribute('data-del-idx')));
      }
    });

    document.addEventListener('input', function(event){
      if(event.target && event.target.id === 'vocabSheetSearch'){
        filterVocabSheet(event.target.value || '');
      }
    });

    document.addEventListener('keydown', function(event){
      if(event.key === 'Escape'){
        closeVocabSheet();
      }
    });
  }

  function init(){
    loadWordUsage();
    loadSavedSentences();
    ensureVocabSheet();
    bindEvents();
    resetBuilder();
    setLevel(1);
    setLang(RKLang.get());
    renderTemplateMenu();
    renderSavedPanel();

    window.ralucaBuilderState = state;
    window.ralucaBuilderRender = renderAll;
  }

  // DATA used to be a ~850-line vocabulary literal baked into this file; it
  // now lives in data/builder-vocab.json like every other feature's data,
  // fetched once here before init() (and everything it calls) runs.
  fetch('./data/builder-vocab.json')
    .then(function(r){ return r.json(); })
    .then(function(data){
      DATA = data;
      init();
    })
    .catch(function(err){
      console.error('Failed to load builder vocabulary', err);
    });
})();
