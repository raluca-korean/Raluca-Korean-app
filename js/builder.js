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
      quizPerfect: "🎉 PERFECT!",
      quizReward: function(xp, coins){ return '⭐ +' + xp + ' XP · 🪙 +' + coins; },
      quizCombo: function(n){ return '🔥 Combo ×' + n; },
      quizWrong: "✗ Aproape! Combo-ul se resetează.",
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
      quizPerfect: "🎉 PERFECT!",
      quizReward: function(xp, coins){ return '⭐ +' + xp + ' XP · 🪙 +' + coins; },
      quizCombo: function(n){ return '🔥 Combo ×' + n; },
      quizWrong: "✗ Almost! Combo reset.",
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

  // Romanian (and simple Latin) personal names → Hangul, loanword-style.
  function hangulName(name){
    var s = String(name || '').toLowerCase()
      .replace(/[ăâ]/g, function(c){ return c === 'ă' ? 'ă' : 'î'; })
      .replace(/[șş]/g, 'ș').replace(/[țţ]/g, 'ț');
    var V = { a:0, 'ă':4, e:5, i:20, 'î':18, o:8, u:13, y:20 };           // ㅏ ㅓ ㅔ ㅣ ㅡ ㅗ ㅜ
    var ON = { b:7, c:15, d:3, f:17, g:0, h:18, j:12, k:15, l:5, m:6, n:2, p:17, q:15, r:5, s:9, t:16, v:7, w:11, z:12,
               'ș':9, 'ț':14, C:14, G:12, K:15, H:0 };                     // initial jamo indices
    // digraphs: che/chi → K, ghe/ghi → H(g), ce/ci → C(ch), ge/gi → G(j); ci/gi + vowel: the i is silent
    s = s.replace(/ch(?=[ei])/g, 'K').replace(/gh(?=[ei])/g, 'H')
         .replace(/^ci(?=[aăouî])/, 'C').replace(/^gi(?=[aăouî])/, 'G')
         .replace(/ce(?=[oau])/g, 'C').replace(/ge(?=[oau])/g, 'G')
         .replace(/c(?=[ei])/g, 'C').replace(/g(?=[ei])/g, 'G').replace(/x/g, 'ks').replace(/qu/g, 'kv');
    var isV = function(ch){ return V.hasOwnProperty(ch); };
    var out = [];                       // syllables as {on, v, coda}
    var SH = { a:'샤', e:'셰', i:'시', o:'쇼', u:'슈', 'ă':'셔', 'î':'슈' };
    for(var i = 0; i < s.length; i++){
      var ch = s[i], nx = s[i + 1];
      if(isV(ch)){ out.push({ on:11, v:V[ch], coda:0 }); continue; }          // bare vowel → ㅇ onset
      if(!ON.hasOwnProperty(ch)) continue;
      if(nx && isV(nx)){
        // intervocalic l: previous open syllable takes ㄹ batchim (엘레나, 랄루카)
        // l after a vowel or after a consonant+ㅡ (블라드, 플로린): previous syllable takes ㄹ batchim
        if(ch === 'l' && out.length && !out[out.length - 1].raw && out[out.length - 1].coda === 0 && i > 0 && (isV(s[i - 1]) || out[out.length - 1].v === 18)) out[out.length - 1].coda = 8;
        if(ch === 'ș'){ out.push({ raw: SH[nx] || '시' }); i++; continue; }
        out.push({ on: ON[ch], v: V[nx], coda: 0 }); i++; continue;
      }
      // consonant not followed by a vowel: n / m / l (and k before s, from x) close the previous syllable
      var prev = out[out.length - 1];
      var CODA = { n:4, m:16, l:8 };
      if(prev && !prev.raw && prev.coda === 0 && CODA[ch] && !(ch === 'n' && nx === 'g' && false)){ prev.coda = CODA[ch]; continue; }
      if(prev && !prev.raw && prev.coda === 0 && ch === 'k' && nx === 's'){ prev.coda = 1; continue; }   // 알렉산드루
      if(prev && !prev.raw && prev.coda === 0 && prev.v !== 18 && (ch === 'c' || ch === 'k') && nx && !isV(nx) && nx !== 'r' && nx !== 'l'){ prev.coda = 1; continue; }   // 빅토르
      if(ch === 'ș'){ out.push({ raw:'슈' }); continue; }
      if(ch === 'ț'){ out.push({ raw:'츠' }); continue; }
      if(ch === 'C'){ out.push({ raw:'치' }); continue; }
      if(ch === 'G' || ch === 'j' || ch === 'z'){ out.push({ raw:'즈' }); continue; }
      out.push({ on: ON[ch], v: 18, coda: 0 });                                  // C + ㅡ (크, 드, 브…)
    }
    return out.map(function(x){ return x.raw || String.fromCharCode(0xAC00 + (x.on * 21 + x.v) * 28 + x.coda); }).join('') || name;
  }
  // Name + topic particle chosen from the Hangul spelling (아나는 / 단은)
  function nameWithTopic(name){
    var h = hangulName(name);
    var c = h.charCodeAt(h.length - 1);
    var batchim = c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 !== 0;
    return h + (batchim ? '은' : '는');
  }

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

  /* ============================================================
     SENTENCE REVIEW (SRS) — saved sentences come back on a schedule
     (RO → KO recall). Due ones also show up in review.html.
  ============================================================ */
  var SENT_SRS_KEY = 'RK_SENT_SRS';
  var SR_TXT = {
    ro: { caiet: 'Scrie în caiet', srsOn: 'Scoate din repetare', srsOff: 'Adaugă la repetare', added: 'Adăugată la repetare 🔁',
          removed: 'Scoasă din repetare', review: function(n){ return '🔁 Repetă' + (n ? ' (' + n + ')' : ''); }, none: 'Nicio propoziție de repetat acum ✨',
          prompt: 'Spune în coreeană:', show: 'Arată răspunsul', hard: 'Greu', good: 'Bine', easy: 'Ușor', close: '✕ Închide',
          done: 'Gata! Ai repetat toate propozițiile scadente.', noTr: '(fără traducere — citește și spune sensul)' },
    en: { caiet: 'Write in notebook', srsOn: 'Remove from review', srsOff: 'Add to review', added: 'Added to review 🔁',
          removed: 'Removed from review', review: function(n){ return '🔁 Review' + (n ? ' (' + n + ')' : ''); }, none: 'Nothing to review right now ✨',
          prompt: 'Say it in Korean:', show: 'Show answer', hard: 'Hard', good: 'Good', easy: 'Easy', close: '✕ Close',
          done: 'Done! You reviewed every due sentence.', noTr: '(no translation — read it and say what it means)' }
  };
  function srT(){ return SR_TXT[state.lang === 'en' ? 'en' : 'ro']; }
  function sentSrs(){ return RKStorage.get(SENT_SRS_KEY, {}) || {}; }
  function saveSentSrs(d){ RKStorage.set(SENT_SRS_KEY, d); }
  function addToSentSrs(s){
    var d = sentSrs();
    if(!d[s.ko]) d[s.ko] = { n: 0, I: 1, EF: 2.5, due: Date.now(), tr: s.tr || '' };
    saveSentSrs(d);
  }
  function toggleSentSrs(s){
    var d = sentSrs();
    if(d[s.ko]){ delete d[s.ko]; saveSentSrs(d); showToast(srT().removed); }
    else { addToSentSrs(s); showToast(srT().added); }
    renderSavedPanel();
  }
  function dueSentences(){
    var d = sentSrs(), now = Date.now();
    return Object.keys(d).filter(function(k){ return d[k] && d[k].due <= now; })
      .map(function(k){ return { ko: k, tr: d[k].tr || '' }; });
  }
  function openInCaiet(s){
    location.href = 'writing.html?tab=caiet&text=' + encodeURIComponent(s.ko) + (s.tr ? '&tr=' + encodeURIComponent(s.tr) : '');
  }

  var srQueue = [], srIdx = 0, srShown = false;
  function startSentenceReview(){
    srQueue = dueSentences();
    if(!srQueue.length){ showToast(srT().none); return; }
    srIdx = 0; srShown = false;
    var ov = document.getElementById('sentReview');
    if(!ov){
      ov = document.createElement('div');
      ov.id = 'sentReview';
      ov.className = 'sr-overlay';
      ov.innerHTML = '<div class="sr-card" role="dialog" aria-modal="true"></div>';
      document.body.appendChild(ov);
      ov.addEventListener('click', function(e){
        var b = e.target.closest('[data-sr]');
        if(e.target === ov){ closeSentenceReview(); return; }
        if(!b) return;
        var act = b.getAttribute('data-sr');
        if(act === 'close') closeSentenceReview();
        else if(act === 'show'){ srShown = true; renderSentenceReview(); speakText(srQueue[srIdx].ko, 0.9); }
        else if(act === 'play') speakText(srQueue[srIdx].ko, 0.9);
        else rateSentence(Number(act));
      });
    }
    ov.classList.add('open');
    renderSentenceReview();
  }
  function closeSentenceReview(){
    var ov = document.getElementById('sentReview');
    if(ov) ov.classList.remove('open');
    renderSavedPanel();
  }
  function renderSentenceReview(){
    var ov = document.getElementById('sentReview');
    if(!ov) return;
    var card = ov.querySelector('.sr-card');
    var t = srT();
    if(srIdx >= srQueue.length){
      card.innerHTML = '<div class="sr-done">🎉 ' + escapeHtml(t.done) + '</div>' +
        '<div class="sr-actions"><button type="button" class="btn-primary sr-btn" data-sr="close">OK</button></div>';
      return;
    }
    var s = srQueue[srIdx];
    card.innerHTML =
      '<div class="sr-top"><span class="sr-count">' + (srIdx + 1) + ' / ' + srQueue.length + '</span>' +
        '<button type="button" class="btn-secondary sr-close" data-sr="close">' + escapeHtml(t.close) + '</button></div>' +
      '<div class="sr-label">' + escapeHtml(t.prompt) + '</div>' +
      '<div class="sr-tr">' + escapeHtml(s.tr || t.noTr) + '</div>' +
      (srShown
        ? '<div class="sr-ko">' + escapeHtml(s.ko) + ' <button type="button" class="roundIconBtn sr-play" data-sr="play" aria-label="▶">🔊</button></div>' +
          '<div class="sr-actions">' +
            '<button type="button" class="btn-secondary sr-btn" data-sr="1">' + escapeHtml(t.hard) + '</button>' +
            '<button type="button" class="btn-secondary sr-btn" data-sr="4">' + escapeHtml(t.good) + '</button>' +
            '<button type="button" class="btn-primary sr-btn" data-sr="5">' + escapeHtml(t.easy) + '</button>' +
          '</div>'
        : (!s.tr ? '<div class="sr-ko">' + escapeHtml(s.ko) + '</div>' : '') +
          '<div class="sr-actions"><button type="button" class="btn-primary sr-btn" data-sr="show">' + escapeHtml(t.show) + '</button></div>');
  }
  function rateSentence(q){
    var s = srQueue[srIdx];
    var d = sentSrs();
    var cur = d[s.ko] || { tr: s.tr };
    var next = window.RKSrs ? RKSrs.stepClassic(cur, q) : cur;
    next.tr = cur.tr || s.tr || '';
    d[s.ko] = next;
    saveSentSrs(d);
    if(q >= 4 && window.RKGamification && RKGamification.addXPBonus) RKGamification.addXPBonus(2);
    srIdx++; srShown = false;
    renderSentenceReview();
  }

  function renderSavedPanel(){
    var panel = document.getElementById('savedPanel');
    var list  = document.getElementById('savedList');
    var title = document.getElementById('savedTitle');
    if(!panel || !list) return;

    // "Repetă (N)" — next to the export button
    var revBtn = document.getElementById('srsReviewBtn');
    var exp = document.getElementById('exportBtn');
    if(!revBtn && exp){
      revBtn = document.createElement('button');
      revBtn.id = 'srsReviewBtn';
      revBtn.type = 'button';
      revBtn.className = 'btn-secondary msf-archive-review';
      revBtn.addEventListener('click', startSentenceReview);
      exp.parentNode.insertBefore(revBtn, exp);
    }
    if(revBtn){
      var deckSize = Object.keys(sentSrs()).length;
      revBtn.hidden = !deckSize;
      revBtn.textContent = srT().review(dueSentences().length);
    }

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
        '<button class="savedItemAct roundIconBtn" type="button" data-caiet-idx="' + i + '" title="' + escapeHtml(srT().caiet) + '" aria-label="' + escapeHtml(srT().caiet) + '">✍️</button>' +
        '<button class="savedItemAct roundIconBtn' + (sentSrs()[s.ko] ? ' on' : '') + '" type="button" data-srs-idx="' + i + '" title="' + escapeHtml(sentSrs()[s.ko] ? srT().srsOn : srT().srsOff) + '" aria-label="' + escapeHtml(sentSrs()[s.ko] ? srT().srsOn : srT().srsOff) + '">🔁</button>' +
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
    addToSentSrs(savedSentences[0]);          // saved sentences come back in the review
    renderSavedPanel();
    showToast(currentUI().saved + ' · 🔁');
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
  var quizCombo  = 0;

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
      bar.classList.add('show');
      if(labelEl)  labelEl.textContent  = currentUI().quizLabel;
      if(targetEl) targetEl.textContent = quizTarget.tr || quizTarget.ko;
      if(checkBtn) checkBtn.textContent = currentUI().quizCheck;
      if(exitBtn)  exitBtn.textContent  = currentUI().quizExit;
      if(resultEl){ resultEl.textContent = ''; resultEl.className = 'quizResultEl'; }
      if(quizBtn)  quizBtn.classList.add('active');
    } else {
      bar.classList.remove('show');
      if(quizBtn) quizBtn.classList.remove('active');
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
    if(correct){
      quizCombo++;
      var xpResult = { xpGained: 0, coinsGained: 0 };
      if(window.RKGamification){
        if(window.RKStreak) RKStreak.touch();
        xpResult = RKGamification.addXP(quizCombo);
      }
      if(resultEl){
        resultEl.innerHTML = currentUI().quizPerfect +
          '<div class="quizAnswerLine">' + currentUI().quizReward(xpResult.xpGained, xpResult.coinsGained) +
          (quizCombo >= 2 ? ' · ' + currentUI().quizCombo(quizCombo) : '') + '</div>';
        resultEl.className = 'quizResultEl visible correct';
      }
      showToast(currentUI().quizPerfect);
    } else {
      quizCombo = 0;
      if(resultEl){
        resultEl.innerHTML =
          currentUI().quizWrong +
          '<div class="quizAnswerLine">' + currentUI().quizAnswer +
          ' <strong>' + escapeHtml(target) + '</strong></div>';
        resultEl.className = 'quizResultEl visible wrong';
      }
    }
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
      fromDictionary: item.fromDictionary || false,
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

  // Option lists are rebuilt from DATA on every call otherwise — with the whole
  // app dictionary that is ~2000 items per lookup, dozens of lookups per keystroke.
  var OPT_CACHE = {};
  function clearOptionCache(){ OPT_CACHE = {}; }
  function getOptionsForField(fieldKey, isLast){
    var ck = fieldKey + (isLast ? '|L' : '');
    if(!OPT_CACHE[ck]) OPT_CACHE[ck] = buildOptionsForField(fieldKey, isLast);
    return OPT_CACHE[ck];
  }
  // normalised match candidates of an item, computed once
  function itemCands(item){
    if(!item.__nc){
      item.__nc = [item.ko, item.ro, item.en, item.key].concat(item.aliases || []).map(normalizeLatin);
      item.__nExplicit = item.__nc.length;            // generated forms come after this index
      if(item.bucket === 'verb') item.__nc = item.__nc.concat(englishForms(item.en));
    }
    return item.__nc;
  }
  // regular English forms of a verb gloss: "to wait" → wait, waits, waited, waiting
  function englishForms(en){
    var out = [];
    String(en || '').split(/[\/,;]/).forEach(function(g){
      if(/\(/.test(g)) return;                 // "to take (time)": a narrow sense, not the everyday word
      var m = /^\s*to ([a-z]+)\s*$/i.exec(g);
      if(!m) return;
      var v = m[1].toLowerCase();
      if(v.length < 3) return;
      var ing = /ie$/.test(v) ? v.slice(0, -2) + 'ying' : /[^aeiou]e$/.test(v) ? v.slice(0, -1) + 'ing' : v + 'ing';
      var ed  = /ee$/.test(v) ? '' : /e$/.test(v) ? v + 'd' : /[^aeiou]y$/.test(v) ? v.slice(0, -1) + 'ied' : v + 'ed';
      var s3  = /(s|x|z|ch|sh|o)$/.test(v) ? v + 'es' : /[^aeiou]y$/.test(v) ? v.slice(0, -1) + 'ies' : v + 's';
      out.push(v, s3, ing); if(ed) out.push(ed);
    });
    return out;
  }
  function buildOptionsForField(fieldKey, isLast){
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

  // Parts the free-text parser adds that have no card of their own ("datorită prietenului", "cu trenul",
  // "te aștept" → 너를, "pentru mama"). Kept as a list so the table shows them, the translation has them
  // and the learner can remove them: { type:'cause'|'obj'|'for'|'means', pos:'prefix'|'means', ko, ro, en, person?, dat?, fem? }
  function addExtra(clause, x){
    if(!clause.__extras) clause.__extras = [];
    clause.__extras.push(x);
  }
  function extrasKo(clause, pos){
    return (clause.__extras || []).filter(function(x){ return x.pos === pos; }).map(function(x){ return x.ko; }).join(' ');
  }
  // 저를 / 너한테 / 그녀를 … → person 0–5 (+ feminine)
  function markIndefinite(o, text){
    if(!o || !o.ko) return o;
    var raw = o.raw && typeof o.raw === 'object' ? o.raw : o;
    var cands = [o.srcTok, raw.ro_sg, trClean(o.ro), trClean(o.en).replace(/^(the|a|an) /, '')]
      .filter(Boolean).map(function(c){ return normalizeLatin(c); }).filter(function(c){ return c.length >= 2; });
    var t = ' ' + normalizeLatin(text) + ' ';
    var art = null;
    cands.some(function(c){
      var m = new RegExp(' (o|un|a|an) ' + c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ' ').exec(t);
      if(m){ art = m[1]; return true; }
      return false;
    });
    if(!art) return o;
    var c = {}; for(var k in o) c[k] = o[k];
    c.indef = /^(o|un)$/.test(art) ? art : true;
    return c;
  }
  // person of a clause from its perfect / future auxiliary (cd.text is folded: "m-ai" → "m ai")
  function personFromAux(text){
    var t = ' ' + normalizeLatin(text) + ' ';
    if(/ (?:ne am|am fost noi|noi am) /.test(t)) return 3;
    var m = / (ai|ati|au|vei|veti|vom|vor) (?=\S)/.exec(t) || / (?:m|l|i|s|v|te|ne) (a) (?=\S)/.exec(t);
    if(m) return { ai:1, ati:4, au:5, vei:1, veti:4, vom:3, vor:5, a:2 }[m[1]];
    // present tense: the 1st / 2nd person plural endings are unambiguous ("ne uităm", "mergem", "mâncați")
    var toks = t.trim().split(' ');
    for(var i = 0; i < toks.length; i++){
      var w = toks[i];
      if(w.length > 3 && /(am|em|im)$/.test(w) && w !== 'avem' && tokenVerb(w)) return 3;
      if(w === 'avem' || w === 'suntem') return 3;
      if(w.length > 4 && /(ati|eti|iti)$/.test(w) && tokenVerb(w)) return 4;
      if(w === 'aveti' || w === 'sunteti') return 4;
    }
    return null;
  }
  function koPronPerson(ko){
    var b = String(ko || '').replace(/(을|를|한테|에게)$/, '');
    var P = { '저':0, '나':0, '너':1, '그':2, '그녀':2, '우리':3, '여러분':4, '그들':5 };
    return P.hasOwnProperty(b) ? { person: P[b], fem: b === '그녀' } : null;
  }

  function removeTopicParticle(ko){
    return String(ko || '').replace(/(는|은|이|가)$/,'');
  }

  // ---- shared conjugation helpers for the TOPIK grammar frames ----
  function _jong(ch){ var c = String(ch || '').charCodeAt(0); return (c >= 0xAC00 && c <= 0xD7A3) ? (c - 0xAC00) % 28 : -1; }
  function _fuse(syl, jong){ return String.fromCharCode(syl.charCodeAt(0) + jong); }
  // future attributive: 갈 / 먹을 / 만들
  function futAttr(v){ return window.Conjugation.future(v).replace(/\s*거예요$/, ''); }
  // past attributive -(으)ㄴ for action verbs: 간 / 먹은 / 만든
  function pastAttr(v){
    var fa = futAttr(v), last = fa.slice(-1);
    return _jong(last) === 8 ? fa.slice(0, -1) + String.fromCharCode(last.charCodeAt(0) - 4) : fa;
  }
  // past stem: 갔 / 먹었 / 했
  function pastStem(v){ return window.Conjugation.past(v).replace(/어요$/, ''); }
  var DESCRIPTIVE_KO = {'기쁘다':1,'슬프다':1,'피곤하다':1,'크다':1,'작다':1,'좋다':1,'바쁘다':1,'춥다':1,'덥다':1,'아프다':1,'예쁘다':1,'많다':1,'적다':1,'비싸다':1,'싸다':1,'어렵다':1,'쉽다':1,'맛있다':1,'맛없다':1,'재미있다':1,'재미없다':1,'멋있다':1};
  function isDescriptive(item){
    if(!item || !item.ko) return false;
    var ko = item.ko.split(' ').pop();
    return !!DESCRIPTIVE_KO[ko] || /^a fi\b/.test(normalizeLatin(item.ro || ''));
  }
  // reported statement: 온다고 / 먹는다고 / 갔다고 / 갈 거라고 / 좋다고
  function reportedKo(item, sub){
    var v = item.ko, conj = window.Conjugation;
    if(sub === 'past')   return pastStem(v) + '다고';
    if(sub === 'future') return futAttr(v) + ' 거라고';
    var st = conj.stem(v);
    if(isDescriptive(item) || /(있|없)$/.test(st)) return st + '다고';
    var last = st.slice(-1), j = _jong(last);
    if(j === 0) return st.slice(0, -1) + _fuse(last, 4) + '다고';
    if(j === 8) return st.slice(0, -1) + String.fromCharCode(last.charCodeAt(0) - 4) + '다고';
    return st + '는다고';
  }
  // -(으)ㅂ시다: 갑시다 / 먹읍시다 / 만듭시다 / 도웁시다
  function letsKo(v){
    var s = window.Conjugation.euAttach(v, '#').slice(0, -1);
    if(/으$/.test(s)) return s.slice(0, -1) + '읍시다';
    return s.slice(0, -1) + _fuse(s.slice(-1), 17) + '시다';
  }
  // -(으)라고 했어요: 먹으라고 / 가라고 / 만들라고
  function commandQuoteKo(v){
    var st = window.Conjugation.stem(v);
    if(_jong(st.slice(-1)) === 8) return st + '라고 했어요';
    return window.Conjugation.euAttach(v, '라고 했어요');
  }
  // honorific imperative -(으)세요, with the special honorific verbs
  var HONORIFIC_IMP = {'먹다':'드세요','마시다':'드세요','자다':'주무세요','있다':'있으세요','말하다':'말씀하세요'};
  function imperativeKo(v){
    if(HONORIFIC_IMP[v]) return HONORIFIC_IMP[v];
    return window.Conjugation.euAttach(v, '세요');
  }

  var SEQ_SEO = { '가다':1, '오다':1, '돌아오다':1, '돌아가다':1, '들어가다':1, '나가다':1 };
  function renderVerbKo(clause){
    var verb = itemOf(clause, 'verb');
    if(!verb || !verb.ko) return '';

    if(verb.isPhrase) return verb.final || verb.ko;

    var cKey = connectorKey(clause);
    // negated 있다 (and 맛있다, 재미있다…) is 없다: "nu am bani" → 돈이 없어요
    if((/있다$/.test(verb.ko) || verb.ko === '알다') && (clause.negated || cKey === 'tense_neg' || cKey === 'tense_neg_past') && window.Conjugation){
      var vNo = verb.ko === '알다' ? '모르다' : verb.ko.replace(/있다$/, '없다');
      if(cKey === 'tense_neg')      return window.Conjugation.present(vNo);
      if(cKey === 'tense_neg_past') return window.Conjugation.past(vNo);
      var px = Object.create(clause);
      px.negated = false;
      px.__picked = {};
      for(var pk in (clause.__picked || {})) px.__picked[pk] = clause.__picked[pk];
      var vc = {}; for(var vk in verb) vc[vk] = verb[vk];
      vc.ko = vNo; vc.forms = null; vc.final = null;
      px.__picked.verb = vc;
      return renderVerbKo(px);
    }
    var conj = window.Conjugation;

    if(cKey === 'tense_past') return conj ? conj.past(verb.ko)   : (verb.final || verb.ko);
    if(cKey === 'tense_fut')  return conj ? conj.future(verb.ko) : (verb.final || verb.ko);
    if(cKey === 'tense_pres' || cKey === 'none') return conj ? conj.present(verb.ko) : (verb.final || verb.ko);

    // Clause connectors — return verb in connector form (stem + suffix)
    if(cKey === 'so') cKey = 'cause1';   // "plouă, așa că…" = reason first, then -아/어서
    if(conj){
      var stem = conj.stem(verb.ko);
      if(cKey === 'fear') return futAttr(verb.ko) + '까 봐';
      if(cKey === 'because_of' && !clause.negated) return (clause.tenseOverride === 'past' ? pastStem(verb.ko) : stem) + '기 때문에';

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
        if(cKey === 'because_of')     return nb2 + '기 때문에';
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
        if(cKey === 'because_of')     return nb + '기 때문에';
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
        if(cKey === 'seq')       return SEQ_SEO[verb.ko] ? conj.aeo(verb.ko) + '서' : conj.connector(verb.ko, '-고');
        if(cKey === 'cause2')    return ps + (psEu ? '으니까' : '니까');
        if(cKey === 'contrast1') return ps + '지만';
        if(cKey === 'contrast2') return ps + '는데';
        if(cKey === 'concede')   return ps + '어도';
      }

      // "merg la piață și cumpăr" — the next action happens there: 가서 / 와서, not 가고
      if(cKey === 'seq')       return SEQ_SEO[verb.ko] ? conj.aeo(verb.ko) + '서' : conj.connector(verb.ko, '-고');
      if(cKey === 'cause1')    return conj.connector(verb.ko, '-아/어서');
      if(cKey === 'cause2')    return conj.connector(verb.ko, '-(으)니까');
      if(cKey === 'contrast1') return conj.connector(verb.ko, '-지만');
      if(cKey === 'contrast2') return conj.connector(verb.ko, '-(으)ㄴ/는데');
      if(cKey === 'condition') return conj.euOrNot(stem) ? stem + '으면' : stem + '면';
      if(cKey === 'purpose')        return conj.euOrNot(stem) ? stem + '으려고' : stem + '려고';
      if(cKey === 'result')         return conj.stem(verb.ko) + '게 돼서';   // -게 되다 linking on: ajung să…, așa că…
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
    if(cKey === 'tense_wish'){
      if(!conj) return verb.final || verb.ko;
      // "fratele meu vrea să…" — someone else's wish: -고 싶어 해요
      var wTopic = itemOf(clause, 'topic');
      var thirdP = wTopic && wTopic.ko && !/^(저|나|너|우리|여러분|당신)/.test(wTopic.ko);
      return conj.stem(verb.ko) + (thirdP ? '고 싶어 해요' : '고 싶어요');
    }
    if(conj){
      var v0 = verb.ko;
      if(cKey === 'tense_neg_past')     return conj.stem(v0) + '지 않았어요';
      if(cKey === 'tense_decide')       return conj.stem(v0) + '기로 했어요';
      if(cKey === 'tense_prepare')      return futAttr(v0) + ' 준비를 해요';
      if(cKey === 'tense_make_do')      return conj.stem(v0) + '게 만들어요';
      if(cKey === 'tense_make_do_past') return conj.stem(v0) + '게 만들었어요';
      if(cKey === 'tense_gi_adj'){
        var ga = clause.__giAdj || '어렵다';
        return conj.stem(v0) + '기가 ' + (clause.__giPast ? conj.past(ga) : conj.present(ga));
      }
      if(cKey === 'tense_prepare_past') return futAttr(v0) + ' 준비를 했어요';
      if(cKey === 'tense_consider')     return futAttr(v0) + '까 해요';
      if(cKey === 'tense_exp_yes')      return conj.aeo(v0) + ' 본 적이 있어요';
      if(cKey === 'tense_exp_no')       return conj.aeo(v0) + ' 본 적이 없어요';
      if(cKey === 'tense_knowhow')      return futAttr(v0) + ' 줄 알아요';
      if(cKey === 'tense_knowhow_not')  return futAttr(v0) + ' 줄 몰라요';
      if(cKey === 'tense_noneed')       return conj.stem(v0) + '지 않아도 돼요';
      if(cKey === 'tense_may')          return conj.aeo(v0) + '도 돼요';
      if(cKey === 'tense_try')          return conj.aeo(v0) + ' 봐요';
      if(cKey === 'tense_try_past')     return conj.aeo(v0) + ' 봤어요';
      if(cKey === 'tense_seem')         return conj.dropRieul(conj.stem(v0)) + '나 봐요';
      if(cKey === 'tense_seem_past')    return pastStem(v0) + '나 봐요';
      if(cKey === 'tense_said')         return reportedKo(verb, clause.__reportSub) + ' 했어요';
      if(cKey === 'tense_said_cmd')     return commandQuoteKo(v0);
      if(cKey === 'tense_lets')         return letsKo(v0);
      if(cKey === 'tense_suggest')      return futAttr(v0) + '까요?';
      if(cKey === 'tense_offer')        return futAttr(v0) + '래요?';
      if(cKey === 'tense_please')       return conj.aeo(v0) + ' 주세요';
      if(cKey === 'tense_dont')         return conj.stem(v0) + '지 마세요';
      if(cKey === 'tense_imp')          return imperativeKo(v0);
      if(cKey === 'tense_like_doing')   return conj.dropRieul(conj.stem(v0)) + '는 것을 좋아해요';
    }
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
    if(cKey === 'tense_guess')      return conj ? conj.future(verb.ko).replace(/거예요$/, '것 같아요') : (verb.final || verb.ko);
    if(cKey === 'tense_guess_now')  return conj ? conj.dropRieul(conj.stem(verb.ko)) + '는 것 같아요' : (verb.final || verb.ko);
    if(cKey === 'tense_guess_past'){
      if(!conj) return verb.final || verb.ko;
      // -(으)ㄴ 것 같아요: take the future attributive (갈 / 먹을 / 만들) and turn its ㄹ into ㄴ (간 / 먹은 / 만든)
      var fa = conj.future(verb.ko).replace(/\s*거예요$/, '');
      var lc = fa.charCodeAt(fa.length - 1);
      if(lc >= 0xAC00 && lc <= 0xD7A3 && (lc - 0xAC00) % 28 === 8) fa = fa.slice(0, -1) + String.fromCharCode(lc - 4);
      return fa + ' 것 같아요';
    }
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
    // "datorită prietenului" / "din cauza ploii" → 친구 덕분에 / 비 때문에
    var _pre = extrasKo(clause, 'prefix');
    if(_pre) parts.push(_pre);
    // Comitative (와/과): person you do the action with — placed right after topic
    if(associate && associate.ko) parts.push(associate.ko);
    else if(clause.__companion) parts.push(hangulName(clause.__companion) + '하고 같이');
    if(time && time.ko) parts.push(time.ko);
    // Motion-to verbs (가다/오다/도착하다) take destination particle 에, not 에서
    var MOTION_TO = { '가다': 1, '오다': 1, '도착하다': 1 };
    var verbItem = itemOf(clause, 'verb');
    var isMotionTo = verbItem && MOTION_TO[verbItem.ko];
    // 있다/없다 (and "stau acasă") take 에 for the place, and 이/가 for the possessed thing
    var isExist = verbItem && /(^| )(있다|없다)$/.test(verbItem.ko);
    // When verb-gapping a motion clause, chain locations with 하고 (시장하고 식당에 가요)
    // instead of a comma (시장에, 식당에 가요) which is unnatural Korean.
    var useLocChain = skipVerb && isMotionTo && !!(departure && departure.ko) && !(transit && transit.ko);
    if(departure && departure.ko){
      var appearAt = verbItem && /(^| )(나타나다|사라지다|머무르다|들어가다|들어오다)$/.test(verbItem.ko);
      var depKo = (isMotionTo || isExist || appearAt) ? departure.ko.replace(/에서$/, '에') : departure.ko;
      // 이사하다 = move TO a place: 서울로 이사했어요
      if(verbItem && verbItem.ko === '이사하다' && /에서$/.test(departure.ko)){
        var mvB = departure.ko.replace(/에서$/, '');
        var mvJ = _jong(mvB.slice(-1));
        depKo = mvB + (mvJ > 0 && mvJ !== 8 ? '으로' : '로');
      }
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
    var _subjP = function(base){ return base + ((window.Conjugation && window.Conjugation.hasBatchim(base)) ? '이' : '가'); };
    var _objP  = function(base){ return base + ((window.Conjugation && window.Conjugation.hasBatchim(base)) ? '을' : '를'); };
    if(object1 && object1.ko && clause.__count){
      // "două pisici" → 고양이 두 마리가 / "trei cărți" → 책 세 권을
      var cBase = object1.ko.replace(/(을|를|이|가|은|는)$/, '');
      var cnt = clause.__count.num + ' ' + clause.__count.counter;
      parts.push(cBase);
      parts.push(isExist ? _subjP(cnt) : _objP(cnt));
    } else if(object1 && object1.ko){
      parts.push(isExist && /(을|를)$/.test(object1.ko) ? _subjP(object1.ko.replace(/(을|를)$/, '')) : object1.ko);
      // numeral + quantifier follow the object they quantify (커피를 한 잔 마셔요)
      if(numeral && numeral.ko) parts.push(numeral.ko);
      if(quantifier && quantifier.ko) parts.push(quantifier.ko);
    }
    if(object2 && object2.ko) parts.push(object2.ko);
    // "ne ducem puțin" = go for a bit: with a motion verb 조금 (a small amount) → 잠깐
    mannerAdvs.forEach(function(ko){ parts.push(isMotionTo && ko === '조금' ? '잠깐' : ko); });
    var _means = extrasKo(clause, 'means');
    if(_means) parts.push(_means);
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
    // copula: "sunt student" → 학생이에요 ; "nu sunt profesor" → 선생님이 아니에요
    if(!skipVerb && !verbKo && clause.__copula){
      var cp = clause.__copula, cb = cp.base;
      var hb = window.Conjugation && window.Conjugation.hasBatchim(cb);
      parts.push(cp.neg ? cb + (hb ? '이' : '가') + (cp.past ? ' 아니었어요' : ' 아니에요')
                        : cb + (cp.past ? (hb ? '이었어요' : '였어요') : (hb ? '이에요' : '예요')));
    }

    var result = cleanSentenceText(parts.join(' '));
    // gapped object list: "am un câine și o pisică" → 개하고 고양이가 있어요
    if(skipVerb && !useLocChain && object1 && object1.ko && !(departure && departure.ko) && !(time && time.ko) && /(을|를|이|가)$/.test(result)){
      return result.replace(/(을|를|이|가)$/, '하고');
    }
    if(!result) return '';          // a gapped clause left with nothing of its own
    return (skipVerb && !useLocChain) ? result + ',' : result;
  }

  // ===== Traducerea propoziției construite din tabel (RO / EN) =====
  // Textul liber rămâne traducerea cât timp tabelul e exact cel rezultat din el;
  // o propoziție construită (sau modificată) din carduri își primește traducerea de aici.
  var TR_RO_PRON = ['eu','tu','el','noi','voi','ei'];
  var TR_EN_PRON = ['I','you','he','we','you','they'];
  var TR_PERSON = { i:0, you_sg:1, third:2, we:3, you_pl:4, third_pl:5 };
  var TR_FEM_KO = /^(그녀|소녀|엄마|어머니|언니|누나|여자|할머니|여동생|이모|고모|아내|딸|여자친구)$/;
  var TR_AUX = ['am','ai','a','am','ați','au'];
  var TR_DAT = ['îmi','îți','îi','ne','vă','le'];
  var TR_DAT_E = ['mi-e','ți-e','îi e','ne e','vă e','le e'];
  var TR_DAT_PAST = ['mi-a','ți-a','i-a','ne-a','v-a','le-a'];
  var TR_RO_AUXV = {
    vrea:  ['vreau','vrei','vrea','vrem','vreți','vor'],
    putea: ['pot','poți','poate','putem','puteți','pot'],
    sti:   ['știu','știi','știe','știm','știți','știu'],
    reusi: ['reușesc','reușești','reușește','reușim','reușiți','reușesc'],
    intentiona: ['intenționez','intenționezi','intenționează','intenționăm','intenționați','intenționează'],
    incerca: ['încerc','încerci','încearcă','încercăm','încercați','încearcă'],
    ganditRefl: ['mă gândesc','te gândești','se gândește','ne gândim','vă gândiți','se gândesc'],
    pregatiRefl: ['mă pregătesc','te pregătești','se pregătește','ne pregătim','vă pregătiți','se pregătesc'],
    pregatiReflPast: ['m-am pregătit','te-ai pregătit','s-a pregătit','ne-am pregătit','v-ați pregătit','s-au pregătit'],
    voie:  ['am voie','ai voie','are voie','avem voie','aveți voie','au voie'],
    face:  ['fac','faci','face','facem','faceți','fac'],
    fi:    ['sunt','ești','este','suntem','sunteți','sunt']
  };
  var TR_FI_SUBJ = ['fiu','fii','fie','fim','fiți','fie'];
  var TR_PAST_KEYS = { tense_past:1, tense_neg_past:1, tense_mot_neg_past:1, tense_guess_past:1, tense_seem_past:1,
    tense_try_past:1, tense_prepare_past:1, tense_make_do_past:1, tense_decide:1, tense_exp_yes:1, tense_exp_no:1, tense_said:1, tense_said_cmd:1 };
  var TR_FUT_KEYS = { tense_fut:1, tense_polite:1, tense_promise:1, tense_guess:1 };

  // "prietenul/prietena" → prietenul · "la academie / școala privată" → la academie
  // "fratele (mai mare)" → fratele mai mare · "haina (palton)" → haina · "mic(ă)" → mic
  function trClean(s){
    s = String(s || '');
    s = s.replace(/\s*\((?!mai )[^)]*\)/g, '');
    s = s.replace(/\(mai ([^)]*)\)/g, 'mai $1');
    s = s.split(/\s+\/\s+|,\s+/)[0];
    s = s.replace(/(\S+)\/\S+/g, '$1');
    return s.replace(/\s+/g, ' ').trim();
  }

  function trRaw(it){ return it && it.raw && typeof it.raw === 'object' ? it.raw : (it || {}); }

  function trSubjectInfo(item){
    var last = String(item && item.ko || '').trim().split(' ').pop();
    var b = last.replace(/(께서는|께서|은|는|이|가)$/, '');
    var person = 'third';
    if(/^(저|제|나|내)$/.test(b)) person = 'i';
    else if(/^(너|네|당신)$/.test(b)) person = 'you_sg';
    else if(b === '우리') person = 'we';
    else if(b === '여러분') person = 'you_pl';
    else if(/들$/.test(b)) person = 'third_pl';
    var ro = trClean(item && item.ro || ''), raw = trRaw(item);
    if(raw.num === 'pl' && person === 'third') person = 'third_pl';
    // gender from the vocabulary (g), else from the word: Korean (그녀, 엄마…) or the Romanian article (-a)
    var head = ro.split(' ')[0];   // "cartea pe care o citesc" → cartea
    var fem = raw.g ? raw.g === 'f' : (TR_FEM_KO.test(b) || (person === 'third' && /[aă]$/.test(head) && !/^(tata|papa|nenea|Luca|Toma|Mircea|Horia)$/.test(head)));
    return { k: TR_PERSON[person], fem: fem, dat: raw.ro_dat || '', pronoun: /^(저|제|나|내|너|네|당신|우리|여러분|그|그녀|그들)$/.test(b) };
  }

  // ---- Romanian verb forms (via RoConjugator, fallback VERB_FINITE_MAP) ----
  function trRoVerb(verb, fem){
    var gloss = trClean(verb.ro || '');
    var R = window.RoConjugator;
    var p = R && R.parseRoVerbGloss ? R.parseRoVerbGloss(gloss) : null;
    var c = p ? R.conjugate(gloss) : null;
    var vf = null;
    if(p && c && c.trecut){
      var tail = p.tail ? ' ' + p.tail : '';
      var anchor = R.RO_VERB_CONJ[p.head];
      var subj3 = p.head === 'fi' ? 'fie' : (anchor ? anchor[1] : null);
      if(p.marker === 'i' || p.marker === 'ți' || p.marker === 'nu-i'){
        // dative experiencer: îmi place / mi-a plăcut / îmi va plăcea / să-mi placă
        var neg = p.marker === 'nu-i' ? 'nu ' : '';
        var p3 = c.present[2].slice(0, c.present[2].length - tail.length);
        var part = R.participle(p.head, anchor ? anchor[2] : null) || p3;
        vf = {
          pres: TR_DAT.map(function(d, k){ return neg + (p.head === 'fi' ? TR_DAT_E[k] : d + ' ' + p3) + tail; }),
          past: TR_DAT_PAST.map(function(d){ return neg + d + ' ' + part + tail; }),
          fut:  TR_DAT.map(function(d){ return neg + d + ' va ' + p.head + tail; }),
          subj: TR_DAT.map(function(d){ return neg + d + ' ' + (subj3 || p3) + tail; }),
          inf:  p.head + tail, dative: true
        };
      } else {
        var cl = p.marker === 'se' ? 'se ' : p.marker === 'și' ? 'își ' : p.marker === 'nu' ? 'nu ' : '';
        var subj = c.present.slice();
        if(p.head === 'fi'){
          subj = c.present.map(function(f, k){ return TR_FI_SUBJ[k] + f.replace(/^\S+/, ''); });
        } else if(subj3){
          subj[2] = cl + subj3 + tail;
          subj[5] = cl + subj3 + tail;
        }
        vf = { pres: c.present.slice(), past: c.trecut.slice(), fut: c.viitor.slice(), subj: subj,
               inf: (cl === 'își ' ? 'își ' : cl) + p.head + tail, dative: false };
        // "a fi obosit" with a feminine subject: obosită / obosite
        if(fem && p.head === 'fi' && p.tail && /^[a-zăâîșț]+$/i.test(p.tail) && R.feminineSingular){
          var fs = R.feminineSingular(p.tail), fp = R.femininePlural(p.tail);
          ['pres','past','fut','subj'].forEach(function(t){
            vf[t] = vf[t].map(function(f, k){ return f.replace(/\S+$/, k < 3 ? fs : fp); });
          });
        }
      }
    } else {
      var hit = VERB_FINITE_MAP[verb.ko], td = VERB_TENSE_DATA[verb.ko];
      var roles = ['i','you_sg','third','we','you_pl','third_pl'];
      if(hit && hit.ro){
        var pres = roles.map(function(r){ return hit.ro[r]; });
        var cli = ['mă','te','se','ne','vă','se'], cliP = ['m-am','te-ai','s-a','ne-am','v-ați','s-au'];
        vf = {
          pres: pres,
          past: td ? roles.map(function(r, k){ return td.refl ? cliP[k] + ' ' + td.roPart : TR_AUX[k] + ' ' + td.roPart; }) : pres,
          fut:  td ? ['voi','vei','va','vom','veți','vor'].map(function(a, k){ return (td.refl ? cli[k] + ' ' : '') + a + ' ' + td.roBase; }) : pres,
          subj: pres, inf: td ? td.roBase : gloss.replace(/^a /, ''), dative: false
        };
      }
    }
    if(!vf){
      var bare = gloss.replace(/^a /, '');
      var same = [bare, bare, bare, bare, bare, bare];
      vf = { pres: same, past: same, fut: same, subj: same, inf: bare, dative: false, raw: true };
    }
    return vf;
  }

  // ---- English verb forms ----
  var TR_EN_IRR = {
    be:['was','been'], have:['had','had'], do:['did','done'], go:['went','gone'], come:['came','come'], see:['saw','seen'],
    eat:['ate','eaten'], drink:['drank','drunk'], read:['read','read'], write:['wrote','written'], meet:['met','met'],
    make:['made','made'], buy:['bought','bought'], give:['gave','given'], sleep:['slept','slept'], sing:['sang','sung'],
    know:['knew','known'], teach:['taught','taught'], become:['became','become'], speak:['spoke','spoken'], take:['took','taken'],
    get:['got','gotten'], leave:['left','left'], understand:['understood','understood'], forget:['forgot','forgotten'],
    find:['found','found'], think:['thought','thought'], tell:['told','told'], say:['said','said'], sit:['sat','sat'],
    stand:['stood','stood'], run:['ran','run'], swim:['swam','swum'], wear:['wore','worn'], win:['won','won'], lose:['lost','lost'],
    send:['sent','sent'], spend:['spent','spent'], build:['built','built'], bring:['brought','brought'], catch:['caught','caught'],
    choose:['chose','chosen'], begin:['began','begun'], break:['broke','broken'], drive:['drove','driven'], fall:['fell','fallen'],
    feel:['felt','felt'], fly:['flew','flown'], grow:['grew','grown'], hear:['heard','heard'], hold:['held','held'], keep:['kept','kept'],
    lend:['lent','lent'], let:['let','let'], put:['put','put'], ride:['rode','ridden'], rise:['rose','risen'], sell:['sold','sold'],
    shut:['shut','shut'], steal:['stole','stolen'], throw:['threw','thrown'], wake:['woke','woken'], cut:['cut','cut'], hit:['hit','hit'],
    hang:['hung','hung'], pay:['paid','paid'], show:['showed','shown'], fight:['fought','fought'], draw:['drew','drawn'],
    forgive:['forgave','forgiven'], hide:['hid','hidden'], shake:['shook','shaken'], bite:['bit','bitten'], blow:['blew','blown'],
    dig:['dug','dug'], feed:['fed','fed'], freeze:['froze','frozen'], lead:['led','led'], mean:['meant','meant'], quit:['quit','quit'],
    set:['set','set'], shoot:['shot','shot'], stick:['stuck','stuck'], sweep:['swept','swept'], bend:['bent','bent'], lay:['laid','laid'],
    lie:['lay','lain'], light:['lit','lit'], ring:['rang','rung'], shine:['shone','shone'], sink:['sank','sunk'], spread:['spread','spread'],
    hurt:['hurt','hurt'], cost:['cost','cost'], bear:['bore','born'], fit:['fit','fit'], seek:['sought','sought'], weep:['wept','wept'],
    deal:['dealt','dealt'], overcome:['overcame','overcome'], undergo:['underwent','undergone'], forbid:['forbade','forbidden']
  };
  var TR_EN_DOUBLE = /^(stop|plan|shop|drop|chat|jog|hug|beg|sit|run|swim|get|put|begin|cut|hit|win|set|dig|forget|rob|nod|rub|ship|skip|step|tap|trap|wrap|admit|regret|prefer|refer|occur|commit|permit|control|grab|slip|clap|fit|quit|shut|spit|let)$/;
  function trEnPast(w){
    if(TR_EN_IRR[w]) return TR_EN_IRR[w][0];
    if(/e$/.test(w)) return w + 'd';
    if(/[^aeiou]y$/.test(w)) return w.slice(0, -1) + 'ied';
    if(TR_EN_DOUBLE.test(w)) return w + w.slice(-1) + 'ed';
    return w + 'ed';
  }
  function trEnPart(w){ return TR_EN_IRR[w] ? TR_EN_IRR[w][1] : trEnPast(w); }
  function trEn3(w){
    if(w === 'be') return 'is';
    if(w === 'have') return 'has';
    if(/(s|sh|ch|x|z|o)$/.test(w)) return w + 'es';
    if(/[^aeiou]y$/.test(w)) return w.slice(0, -1) + 'ies';
    return w + 's';
  }
  function trEnIng(w){
    if(w === 'be') return 'being';
    if(/ie$/.test(w)) return w.slice(0, -2) + 'ying';
    if(/[^aeioy]e$/.test(w) && w !== 'be') return w.slice(0, -1) + 'ing';
    if(TR_EN_DOUBLE.test(w)) return w + w.slice(-1) + 'ing';
    return w + 'ing';
  }
  function trEnVerb(verb){
    var en = trClean(verb.en || verb.ro || '');
    var fixed = !/^to /.test(en) && /\b(is|are)\b/.test(en);
    var phrase = /^to /.test(en) ? en.slice(3) : ('be ' + en);
    var sp = phrase.split(' '), h = sp[0], rest = sp.length > 1 ? ' ' + sp.slice(1).join(' ') : '';
    return {
      fixed: fixed ? en : '', isBe: h === 'be', base: phrase,
      pres: function(k){ return h === 'be' ? ['am','are','is','are','are','are'][k] + rest : (k === 2 ? trEn3(h) : h) + rest; },
      past: function(k){ return h === 'be' ? ['was','were','was','were','were','were'][k] + rest : trEnPast(h) + rest; },
      part: trEnPart(h) + rest, ing: trEnIng(h) + rest
    };
  }
  function enVerbHead(verb){ return verb ? trClean(verb.en || '').replace(/^to /, '') : ''; }
  function trEnDo(k){ return k === 2 ? "doesn't" : "don't"; }
  function trEnHave(k){ return k === 2 ? 'has' : 'have'; }
  function trEnBe(k){ return ['am','are','is','are','are','are'][k]; }
  function trEnS(w, k){ return k === 2 ? trEn3(w) : w; }

  // ---- the verb phrase for one clause ----
  // mode: 'finite' (key = tense/frame) · 'subj' (RO "să …", EN "to …") · 'inf' (RO "a …", EN "to …") · 'ing'
  function trVerbPhrase(lang, verb, key, k, fem, opts){
    opts = opts || {};
    var out = { text:'', prefix:'', dropSubject:false, end:'' };
    if(!verb) return out;
    if(verb.isPhrase){ out.text = lang === 'en' ? (verb.en || verb.ro) : (verb.ro || verb.en); out.dropSubject = true; return out; }

    if(lang !== 'en'){
      var v = trRoVerb(verb, fem);
      var S = function(kk){ return 'să ' + v.subj[kk]; };

      if(opts.mode === 'subj'){ out.text = S(k); return out; }
      if(opts.mode === 'inf'){ out.text = 'a ' + v.inf; return out; }
      var A = TR_RO_AUXV;
      switch(key){
        case 'tense_past': out.text = v.past[k]; break;
        case 'tense_fut': case 'tense_polite': case 'tense_promise': out.text = v.fut[k]; break;
        case 'tense_wish': out.text = A.vrea[k] + ' ' + S(k); break;
        case 'tense_notwish': out.text = 'nu ' + A.vrea[k] + ' ' + S(k); break;
        case 'tense_intention': out.text = A.intentiona[k] + ' ' + S(k); break;
        case 'tense_can': out.text = A.putea[k] + ' ' + S(k); break;
        case 'tense_cannot': out.text = 'nu ' + A.putea[k] + ' ' + S(k); break;
        case 'tense_neg': out.text = 'nu ' + v.pres[k]; break;
        case 'tense_neg_past': out.text = 'nu ' + v.past[k]; break;
        case 'tense_mot_neg': out.text = 'nu ' + A.reusi[k] + ' ' + S(k); break;
        case 'tense_mot_neg_past': out.text = 'nu ' + TR_AUX[k] + ' reușit ' + S(k); break;
        case 'tense_mustnot': out.text = 'nu trebuie ' + S(k); break;
        case 'tense_must': out.text = 'trebuie ' + S(k); break;
        case 'tense_should': out.text = 'ar trebui ' + S(k); break;
        case 'tense_guess': out.prefix = 'cred că'; out.text = v.fut[k]; break;
        case 'tense_guess_now': out.prefix = 'cred că'; out.text = v.pres[k]; break;
        case 'tense_guess_past': out.prefix = 'cred că'; out.text = v.past[k]; break;
        case 'tense_decide': out.text = TR_AUX[k] + ' hotărât ' + S(k); break;
        case 'tense_consider': out.text = A.ganditRefl[k] + ' ' + S(k); break;
        case 'tense_exp_yes': out.text = v.past[k].replace(/^((?:nu )?\S+) /, '$1 mai '); break;
        case 'tense_exp_no': out.text = 'nu ' + v.past[k] + ' niciodată'; break;
        case 'tense_knowhow': out.text = A.sti[k] + ' ' + S(k); break;
        case 'tense_knowhow_not': out.text = 'nu ' + A.sti[k] + ' ' + S(k); break;
        case 'tense_noneed':
          // "nu e nevoie să merg" / "nu e nevoie ca mama să meargă"
          if(opts.pronoun && k !== 2 && k !== 5){ out.dropSubject = true; out.text = 'nu e nevoie ' + S(k); }
          else { out.subjectAsPrefix = 'nu e nevoie ca'; out.text = S(k); }
          break;
        case 'tense_may': out.text = A.voie[k] + ' ' + S(k); break;
        case 'tense_try': out.text = A.incerca[k] + ' ' + S(k); break;
        case 'tense_try_past': out.text = TR_AUX[k] + ' încercat ' + S(k); break;
        case 'tense_seem': out.prefix = 'se pare că'; out.text = v.pres[k]; break;
        case 'tense_seem_past': out.prefix = 'se pare că'; out.text = v.past[k]; break;
        case 'tense_said':
          out.text = TR_AUX[k] + ' zis că ' + (opts.reportSub === 'past' ? v.past[k] : opts.reportSub === 'future' ? v.fut[k] : v.pres[k]);
          break;
        case 'tense_said_cmd': out.text = TR_AUX[k] + ' zis ' + S(opts.causee != null ? opts.causee : 2); break;
        case 'tense_lets': out.dropSubject = true; out.text = 'hai ' + S(3); break;
        case 'tense_suggest': out.dropSubject = true; out.text = S(3); out.end = '?'; break;
        case 'tense_offer': out.dropSubject = true; out.text = 'vrei ' + S(1); out.end = '?'; break;
        case 'tense_please': out.dropSubject = true; out.text = 'vă rog ' + S(4); break;
        case 'tense_dont': out.dropSubject = true; out.text = 'nu ' + (/^fi\b/.test(v.inf) ? v.subj[4] : v.pres[4]); out.end = '!'; break;
        case 'tense_imp': out.dropSubject = true; out.text = (/^fi\b/.test(v.inf) ? v.subj[4] : v.pres[4]); out.end = '!'; break;
        case 'tense_like_doing':
          out.dative = true;
          out.text = TR_DAT[k] + ' place ' + S(k); break;
        case 'tense_prepare': out.text = A.pregatiRefl[k] + ' ' + S(k); break;
        case 'tense_prepare_past': out.text = A.pregatiReflPast[k] + ' ' + S(k); break;
        case 'tense_gi_adj':
          var adj = opts.giAdj ? trClean(opts.giAdj.ro).replace(/^a fi /, '') : 'greu';
          if(opts.pronoun || opts.nounDat){
            // "mi-e greu să…" / "mamei îi e greu să…"
            out.dative = true;
            out.text = (opts.giPast ? TR_DAT_PAST[k] + ' fost ' : TR_DAT_E[k] + ' ') + adj + ' ' + S(k);
          } else {
            out.subjectAsPrefix = 'pentru';
            out.text = (opts.giPast ? 'a fost ' : 'e ') + adj + ' ' + S(k);
          }
          break;
        case 'tense_result': out.text = ['ajung','ajungi','ajunge','ajungem','ajungeți','ajung'][k] + ' ' + S(k); break;
        case 'tense_result_past': out.text = TR_AUX[k] + ' ajuns ' + S(k); break;
        case 'tense_make_do': out.text = A.face[k] + ' ' + S(opts.causee != null ? opts.causee : 2); break;
        case 'tense_make_do_past': out.text = TR_AUX[k] + ' făcut ' + S(opts.causee != null ? opts.causee : 2); break;
        default: out.text = v.pres[k];
      }
      // the experiencer is in the dative only when the finite verb itself is the dative one ("îmi place",
      // "mi-e greu"), not under a modal ("vreau să îmi placă")
      if((v.dative || out.dative) && /^(nu )?(îmi|îți|îi|ne|vă|le|mi-|ți-|i-|ne-|v-|le-)/.test(out.text)){
        out.dative = true;
        if(opts.pronoun) out.dropSubject = true;
      } else if(v.dative){
        out.dative = false;
      }
      return out;
    }

    var e = trEnVerb(verb);
    if(e.fixed){ out.text = e.fixed; return out; }
    var V = e.base;
    if(opts.mode === 'subj' || opts.mode === 'inf'){ out.text = 'to ' + V; return out; }
    if(opts.mode === 'ing'){ out.text = e.ing; return out; }
    var neg = function(kk){ return e.isBe ? trEnBe(kk) + ' not ' + V.replace(/^be /, '') : trEnDo(kk) + ' ' + V; };
    switch(key){
      case 'tense_past': out.text = e.past(k); break;
      case 'tense_fut': case 'tense_polite': case 'tense_promise': out.text = 'will ' + V; break;
      case 'tense_progressive': out.text = e.isBe ? e.pres(k) : trEnBe(k) + ' ' + e.ing; break;
      case 'tense_wish': out.text = trEnS('want', k) + ' to ' + V; break;
      case 'tense_notwish': out.text = trEnDo(k) + ' want to ' + V; break;
      case 'tense_intention': out.text = trEnS('intend', k) + ' to ' + V; break;
      case 'tense_can': out.text = 'can ' + V; break;
      case 'tense_cannot': out.text = "can't " + V; break;
      case 'tense_neg': out.text = neg(k); break;
      case 'tense_neg_past': out.text = e.isBe ? e.past(k).replace(/^(\S+)/, '$1 not') : "didn't " + V; break;
      case 'tense_mot_neg': out.text = "can't manage to " + V; break;
      case 'tense_mot_neg_past': out.text = "couldn't manage to " + V; break;
      case 'tense_mustnot': out.text = 'must not ' + V; break;
      case 'tense_must': out.text = trEnHave(k) + ' to ' + V; break;
      case 'tense_should': out.text = 'should ' + V; break;
      case 'tense_guess': out.prefix = 'I think'; out.text = 'will ' + V; break;
      case 'tense_guess_now': out.prefix = 'I think'; out.text = e.pres(k); break;
      case 'tense_guess_past': out.prefix = 'I think'; out.text = e.past(k); break;
      case 'tense_decide': out.text = 'decided to ' + V; break;
      case 'tense_consider': out.text = trEnBe(k) + ' thinking of ' + e.ing; break;
      case 'tense_exp_yes': out.text = trEnHave(k) + ' ' + e.part; out.after = 'before'; break;
      case 'tense_exp_no': out.text = trEnHave(k) + ' never ' + e.part; break;
      case 'tense_knowhow': out.text = trEnS('know', k) + ' how to ' + V; break;
      case 'tense_knowhow_not': out.text = trEnDo(k) + ' know how to ' + V; break;
      case 'tense_noneed': out.text = trEnDo(k) + ' have to ' + V; break;
      case 'tense_may': out.text = 'may ' + V; break;
      case 'tense_try': out.text = trEnS('try', k) + ' to ' + V; break;
      case 'tense_try_past': out.text = 'tried to ' + V; break;
      case 'tense_seem': out.prefix = 'it seems'; out.text = e.pres(k); break;
      case 'tense_seem_past': out.prefix = 'it seems'; out.text = e.past(k); break;
      case 'tense_said':
        var who = k === 2 ? (fem ? 'she' : 'he') : TR_EN_PRON[k];
        out.text = 'said that ' + who + ' ' + (opts.reportSub === 'past' ? e.past(k) : opts.reportSub === 'future' ? 'will ' + V : e.pres(k));
        break;
      case 'tense_said_cmd': out.text = 'told {causee} to ' + V; break;
      case 'tense_lets': out.dropSubject = true; out.text = "let's " + V; break;
      case 'tense_suggest': out.dropSubject = true; out.text = 'shall we ' + V; out.end = '?'; break;
      case 'tense_offer': out.dropSubject = true; out.text = 'do you want to ' + V; out.end = '?'; break;
      case 'tense_please': out.dropSubject = true; out.text = 'please ' + V; break;
      case 'tense_dont': out.dropSubject = true; out.text = "don't " + V; out.end = '!'; break;
      case 'tense_imp': out.dropSubject = true; out.text = V; out.end = '!'; break;
      case 'tense_like_doing': out.text = trEnS('like', k) + ' ' + e.ing; break;
      case 'tense_prepare': out.text = trEnBe(k) + ' getting ready to ' + V; break;
      case 'tense_prepare_past': out.text = 'got ready to ' + V; break;
      case 'tense_gi_adj':
        var adjEn = opts.giAdj ? trClean(opts.giAdj.en).replace(/^to be /, '') : 'hard';
        out.subjectAsPrefix = 'for';
        out.text = (opts.giPast ? 'it was ' : "it's ") + adjEn + ' {for} to ' + V;
        break;
      case 'tense_result': out.text = trEnS('end', k) + ' up ' + e.ing; break;
      case 'tense_result_past': out.text = 'ended up ' + e.ing; break;
      case 'tense_make_do': out.text = trEnS('make', k) + ' {causee} ' + V; break;
      case 'tense_make_do_past': out.text = 'made {causee} ' + V; break;
      default: out.text = e.pres(k);
    }
    out.text = out.text.replace(/\bone's\b/, ['my', 'your', fem ? 'her' : 'his', 'our', 'your', 'their'][k]);
    return out;
  }

  var TR_EN_OBJ_PRON = ['me','you','him','us','you','them'];
  var TR_RO_ACC = ['mă','te','îl','ne','vă','îi'], TR_RO_ACC_H = ['m-','te-','l-','ne-','v-','i-'];
  var TR_RO_DAT_H = ['mi-','ți-','i-','ne-','v-','le-'];
  var TR_RO_STRONG = { acc:['pe mine','pe tine','pe el','pe noi','pe voi','pe ei'], dat:['mie','ție','lui','nouă','vouă','lor'] };
  // a person object as a Romanian clitic: "te aștept", "te-am așteptat", "vreau să te aștept", "am văzut-o", "îți dau"
  function trRoClitic(vtext, x, atStart){
    var k = x.person, fem = x.fem && k === 2;
    var words = vtext.split(' ');
    var i = 0;
    if(!atStart){
      for(var j = words.length - 1; j >= 0; j--) if(words[j] === 'să'){ i = j + 1; break; }
    }
    if(words[i] === 'nu') i++;
    var w = words[i] || '';
    // a verb that already carries a clitic (reflexive / dative) takes the strong form after it
    if(/^(mă|te|se|ne|vă|îmi|îți|își|îi|le)$/.test(w) || /^(mi|ți|și|i|m|s|v|te|ne|le)-/.test(w)){
      var strong = TR_RO_STRONG[x.dat ? 'dat' : 'acc'][k];
      if(fem) strong = x.dat ? 'ei' : 'pe ea';
      return vtext + ' ' + strong;
    }
    var isAux = /^(am|ai|a|ați|au)$/.test(w) && words[i + 1];
    if(x.dat){
      words[i] = isAux ? TR_RO_DAT_H[k] + w : TR_DAT[k] + ' ' + w;
    } else if(fem){
      if(isAux) words[i + 1] = words[i + 1] + '-o'; else words[i] = 'o ' + w;
    } else {
      words[i] = isAux ? TR_RO_ACC_H[k] + w : TR_RO_ACC[k] + ' ' + w;
    }
    return words.join(' ');
  }

  function trSubjectText(lang, topic, topic2, attrs, fem){
    if(!topic) return '';
    var t = lang === 'en' ? trClean(topic.en || topic.ro) : trClean(topic.ro || topic.en);
    if(lang === 'en') t = t.replace(/^(at|in|on) (?=\S)/, '');   // a place used as subject: the restaurant
    if(lang === 'en' && t && /^[a-z]/.test(t) && !/^(i|you|he|she|we|they|it|the|a|an|my|your|his|her|our|their)\b/.test(t)){
      t = (/^(older|younger|mom|dad|mother|father|parents|sister|brother)\b/.test(t) ? 'my ' : 'the ') + t;
    }
    var pre = [], post = [];
    (attrs || []).forEach(function(a){
      var at = lang === 'en' ? trClean(a.en || a.ro) : trClean(a.ro || a.en);
      if(!at) return;
      if(lang !== 'en' && fem && /^[a-zăâîșț]+$/.test(at) && window.RoConjugator) at = window.RoConjugator.feminineSingular(at);
      if(lang === 'en' && !/^with\b/.test(at)) pre.push(at); else post.push(at);
    });
    if(pre.length) t = t.replace(/^(the |my )?/, function(d){ return d + pre.join(' ') + ' '; });
    if(post.length) t += ' ' + post.join(' ');
    if(topic2){
      var t2 = lang === 'en' ? trClean(topic2.en || topic2.ro) : trClean(topic2.ro || topic2.en);
      // "Ana and I", but "eu și Ana"
      t = lang === 'en' && t === 'I' ? t2 + ' and I' : t + (lang === 'en' ? ' and ' : ' și ') + t2;
    }
    return t;
  }

  var TR_QTY = {
    '개':  { ro:['bucată','bucăți'], g:'f', en:['piece','pieces'], skip:true },
    '명':  { ro:['persoană','persoane'], g:'f', en:['person','people'], skip:true },
    '병':  { ro:['sticlă','sticle'], g:'f', en:['bottle','bottles'] },
    '잔':  { ro:['pahar','pahare'], g:'n', en:['glass','glasses'] },
    '인분':{ ro:['porție','porții'], g:'f', en:['portion','portions'] },
    '권':  { ro:['volum','volume'], g:'n', en:['volume','volumes'] }
  };
  // "cafeaua" → "cafea", "ceaiul" → "ceai", "berea" → "bere", "ciocolata" → "ciocolată"
  function trRoBare(n){
    if(/\s/.test(n)) return n;
    if(/ua$/.test(n)) return n.slice(0, -2);   // cafeaua → cafea
    if(/ul$/.test(n)) return n.slice(0, -2);
    if(/[^e]ea$/.test(n)) return n.slice(0, -1);
    if(/ia$/.test(n)) return n.slice(0, -1) + 'e';
    if(/a$/.test(n)) return n.slice(0, -1) + 'ă';
    return n;
  }
  function trObjectText(lang, obj, numeral, quantifier, count){
    var o = lang === 'en' ? trClean(obj.en || obj.ro) : trClean(obj.ro || obj.en);
    var raw0 = trRaw(obj);
    if(!numeral && !(count && count.num)){
      var enB = o.replace(/^(the|a|an) /, '');
      if(obj.indef && raw0.num !== 'pl'){
        // "o carte" / "a book", as the learner wrote it
        if(lang === 'en') return (/^[aeiou]/i.test(enB) ? 'an ' : 'a ') + enB;
        if(/^(o|un) /.test(o)) return o;
        var art0 = typeof obj.indef === 'string' ? obj.indef : (raw0.g || (/[aă]$/.test(o) ? 'f' : 'n')) === 'f' ? 'o' : 'un';
        // vocabulary nouns carry their bare singular; dictionary words are already bare ("pizza", "rochie")
        var bare = raw0.ro_sg ? raw0.ro_sg + o.slice(trClean(raw0.ro || o).length)
                 : raw0.categories || obj.fromLexicon || obj.fromDictionary ? o : trRoBare(o.split(' ')[0]) + o.slice(o.split(' ')[0].length);
        return art0 + ' ' + bare;
      }
      // EN mirrors the Romanian article: "cartea" → "the book", "prietenul" → "the friend"
      if(lang === 'en' && raw0.ro_sg && raw0.num !== 'pl' && raw0.ro_pl && !/^(the|a|an|my) /.test(o) && trClean(raw0.ro) !== raw0.ro_sg &&
         !/^(coffee|tea|juice|beer|water|chocolate|food|music|bread|milk|meat|rice|fish)$/.test(o)) return 'the ' + o;
    }
    var n = 0;
    if(numeral){
      (numeral.aliases || []).some(function(a){ if(/^\d+$/.test(a)){ n = parseInt(a, 10); return true; } return false; });
    } else if(count && count.num){
      var NAT = ['', '한','두','세','네','다섯','여섯','일곱','여덟','아홉','열','열한','열두'];
      n = NAT.indexOf(count.num) > 0 ? NAT.indexOf(count.num) : (parseInt(count.num, 10) || 0);
    }
    if(!n) return o;
    var raw = trRaw(obj);
    var q = quantifier ? TR_QTY[quantifier.ko] : null;
    if(q && q.skip) q = null;
    var enBare = o.replace(/^(the|a|an|my) /, '');
    if(lang === 'en'){
      var EN_NUM = ['', 'one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
      var en = EN_NUM[n] || String(n);
      var enPl = raw.en_pl || (raw.num === 'pl' ? enBare : '');
      if(q) return en + ' ' + q.en[n === 1 ? 0 : 1] + ' of ' + enBare;
      if(n === 1){
        if(raw.num === 'pl') return enBare;
        return (/^[aeiou]/i.test(enBare) ? 'an ' : 'a ') + enBare;
      }
      if(enPl) return en + ' ' + enPl;
      if(raw.g && !raw.ro_pl) return enBare + ' (×' + n + ')';      // uncountable: "coffee ×2" stays honest
      return en + ' ' + trEn3(enBare);
    }
    var sg = raw.ro_sg || trRoBare(o);
    var pl = raw.ro_pl || (raw.num === 'pl' ? o : '');
    var g = raw.g || (/[aă]$/.test(o) ? 'f' : 'n');
    // un / o · doi / două (neuter plurals take the feminine "două") · trei, patru…
    var numWord = function(gen){
      if(n === 1) return gen === 'f' ? 'o' : 'un';
      if(n === 2) return gen === 'm' ? 'doi' : 'două';
      return numeral ? trClean(numeral.ro) : (['','unu','doi','trei','patru','cinci','șase','șapte','opt','nouă','zece','unsprezece','douăsprezece'][n] || String(n));
    };
    if(q) return numWord(q.g) + ' ' + q.ro[n === 1 ? 0 : 1] + ' de ' + (raw.num === 'pl' ? pl : sg);
    if(n === 1) return numWord(g) + ' ' + sg;
    if(pl) return numWord(g) + ' ' + pl;
    return o + ' (×' + n + ')';
  }

  // connectors that link clause i to clause i+1
  var TR_LINK = {
    ro: {
      seq:{join:' și '}, or:{join:' sau '}, contrast1:{join:', dar '}, contrast2:{join:', iar '}, so:{join:', așa că '},
      formal_result:{join:', prin urmare '}, contrast3:{join:', pe când '}, switch:{join:', apoi '}, result:{frame:'result', join:', așa că '},
      cause1:{pre:'pentru că', join:', '}, cause2:{pre:'fiindcă', join:', '}, condition:{pre:'dacă', join:', '},
      concede:{pre:'chiar dacă', join:', '}, concede2:{pre:'deși', join:', '}, after:{pre:'după ce', join:', '},
      when:{pre:'când', join:', '}, asap:{pre:'imediat ce', join:', '}, formal_cause:{pre:'deoarece', join:', '},
      informal_cause:{pre:'văzând că', join:', '}, aslong:{pre:'atât timp cât', join:', '}, because_of:{pre:'din cauză că', join:', '},
      while:{pre:'în timp ce', join:', '}, during:{pre:'în timp ce', join:', '},
      before:{pre:'înainte', mode:'subj', join:', '}, instead:{pre:'în loc', mode:'subj', join:', '},
      notonly:{pre:'nu numai că', join:', ci și '}, proportion:{pre:'cu cât', join:', cu atât '},
      extent:{post:true, word:'astfel încât', mode:'subj'}, purpose:{post:true, word:'ca', mode:'subj'},
      purpose2:{post:true, word:'pentru', mode:'inf'}, fear:{post:true, word:'de teamă', mode:'subj', neg:true}
    },
    en: {
      seq:{join:' and '}, or:{join:' or '}, contrast1:{join:', but '}, contrast2:{join:', while '}, so:{join:', so '},
      formal_result:{join:', therefore '}, contrast3:{join:', whereas '}, switch:{join:', then '}, result:{frame:'result', join:', so '},
      cause1:{pre:'because', join:', '}, cause2:{pre:'since', join:', '}, condition:{pre:'if', join:', '},
      concede:{pre:'even if', join:', '}, concede2:{pre:'even though', join:', '}, after:{pre:'after', join:', '},
      when:{pre:'when', join:', '}, asap:{pre:'as soon as', join:', '}, formal_cause:{pre:'given that', join:', '},
      informal_cause:{pre:'seeing that', join:', '}, aslong:{pre:'as long as', join:', '}, because_of:{pre:'because', join:', '},
      while:{pre:'while', join:', '}, during:{pre:'while', join:', '},
      before:{pre:'before', join:', '}, instead:{pre:'instead of', mode:'ing', join:', '},
      notonly:{pre:'not only', join:', but also '}, proportion:{pre:'the more', join:', the more '},
      extent:{post:true, word:'so that', mode:'finite'}, purpose:{post:true, word:'', mode:'subj'},
      purpose2:{post:true, word:'in order', mode:'subj'}, fear:{post:true, word:'for fear that', mode:'finite'}
    }
  };
  // 가서 / 와서… : -아/어서 after a motion verb is "and then", not "because"
  var TR_SEQ_SEO = { '가다':1,'오다':1,'들어가다':1,'나가다':1,'돌아가다':1,'돌아오다':1,'도착하다':1,'앉다':1,'서다':1,'일어나다':1,'만나다':1,'사다':1,'만들다':1 };

  function trCopulaItem(base){
    var buckets = ['object','subject','emb_subject'];
    for(var b = 0; b < buckets.length; b++){
      var list = DATA[buckets[b]] || [];
      for(var i = 0; i < list.length; i++){
        if(list[i].ko && list[i].ko.replace(/(을|를|이|가|은|는|에서)$/, '') === base) return list[i];
      }
    }
    return null;
  }
  // go / come / return + place: "to school", "home" (EN uses no "at" after a motion verb)
  var TR_MOTION_TO = { '가다':1,'오다':1,'돌아가다':1,'돌아오다':1,'들어가다':1,'이사하다':1,'여행하다':1,'도착하다':1 };

  function trRenderClause(lang, clause, ctx, mode, linkKey){
    var topic = itemOf(clause, 'topic');
    var topic2 = itemOf(clause, 'topic2');
    var verb = itemOf(clause, 'verb');
    var time = itemOf(clause, 'time');
    var dep = itemOf(clause, 'departure');
    var transit = itemOf(clause, 'transit');
    var assoc = itemOf(clause, 'associate');
    var embSub = itemOf(clause, 'embSub');
    var embPred = itemOf(clause, 'embPred');
    var ben = itemOf(clause, 'beneficiary');
    var numeral = itemOf(clause, 'numeral');
    var quantifier = itemOf(clause, 'quantifier');
    var o1 = itemOf(clause, 'object1');
    var o2 = itemOf(clause, 'object2');
    var advs = [itemOf(clause, 'adverb'), itemOf(clause, 'adverb2')].filter(function(a){ return a && a.ko; });
    var L = function(it){ return it ? (lang === 'en' ? trClean(it.en || it.ro) : trClean(it.ro || it.en)) : ''; };
    var has = function(it){ return !!(it && it.ko); };
    if(!has(topic)) topic = null;
    if(!has(topic2)) topic2 = null;
    if(!has(verb)) verb = null;

    var info = topic ? trSubjectInfo(topic)
             : clause.__person != null && !(ctx.subject && ctx.subject.k === clause.__person) ? { k: clause.__person, fem: false, pronoun: true }
             : (ctx.subject || { k: 0, fem: false, pronoun: true, implicit: true });
    if(!topic && clause.__person != null) ctx.subject = info;
    var k = info.k;
    if(topic2) k = k === 0 || k === 3 ? 3 : (k === 1 || k === 4) ? 4 : 5;
    var sameSubject = topic && ctx.subjectKo && removeTopicParticle(topic.ko) === ctx.subjectKo;
    if(topic){ ctx.subject = info; ctx.subjectKo = removeTopicParticle(topic.ko); }
    var subjAttrs = advs.filter(function(a){ return a.modifiesSubject; });
    var manner = advs.filter(function(a){ return !a.modifiesSubject; });

    // washing a body part is reflexive in Romanian and possessive in English:
    // 손을 씻어요 → "mă spăl pe mâini" / "I wash my hands"; 이를 닦아요 → "mă spăl pe dinți" / "I brush my teeth"
    var BODY = { '손':['mâini','hands'], '발':['picioare','feet'], '얼굴':['față','face'], '이':['dinți','teeth'], '치아':['dinți','teeth'], '머리':['cap','hair'], '몸':['','body'] };
    var bodyPart = null;
    if(verb && /^(씻다|감다|닦다)$/.test(verb.ko) && has(o1) && BODY[koBase(o1.ko)]) bodyPart = BODY[koBase(o1.ko)];
    else if(verb && /^(머리를 감다|이를 닦다)$/.test(verb.ko)) bodyPart = BODY[verb.ko.split('를')[0]];
    if(bodyPart){
      var brush = /닦다$/.test(verb.ko) && bodyPart[1] === 'teeth';
      verb = { ko: verb.ko, ro: 'a se spăla', en: brush ? 'to brush' : 'to wash' };
    }
    var SCREEN = { '텔레비전을':1, '영화를':1, '영상을':1, '뉴스를':1 };
    var watching = verb && verb.ko === '보다' && has(o1) && SCREEN[o1.ko];
    if(watching) verb = { ko: verb.ko, ro: 'a se uita la', en: 'to watch' };
    // 걸리다 with a duration is "a dura / to take": "Durează două ore", "It takes two hours"
    var takesTime = verb && verb.ko === '걸리다' && has(time) && /(시간|분|일)$/.test(time.ko);
    if(takesTime) verb = { ko: verb.ko, ro: 'a dura', en: 'to take' };
    // weather: "plouă" / "e frig" have no subject; "저는 추워요" = "mi-e frig"
    var gloss = verb ? trClean(verb.ro) : '';
    var impersonal = takesTime || /^a (ploua|ninge|tuna|fulgera|bura)$/.test(gloss) || (!topic && /^a fi (frig|cald|răcoare)$/.test(gloss) && /^(춥다|덥다|따뜻하다|시원하다)$/.test(verb.ko));
    if(impersonal){ k = 2; info = { k: 2, fem: false, pronoun: false }; topic = null; topic2 = null; }
    else if(topic && info.pronoun && verb && /^(춥다|덥다)$/.test(verb.ko)){
      verb = { ko: verb.ko, ro: 'a-i fi ' + gloss.replace(/^a fi /, ''), en: verb.en };
    }

    // 있다 / 없다: "am bani" / "nu am bani" with a thing, "sunt acasă" / "nu sunt acasă" with only a place
    var key = ctx.key, forceNeg = false;
    var extras = clause.__extras || [];
    var causee = extras.filter(function(x){ return x.type === 'obj' && x.causee; })[0] || null;
    // 생각하다 + "că …" is "a crede", not "a gândi"
    if(verb && verb.ko === '생각하다' && has(embSub) && has(embPred)) verb = { ko: verb.ko, ro: 'a crede', en: 'to think' };
    if(verb && /(^| )없다$/.test(verb.ko)){
      forceNeg = true;
      verb = (DATA.verb || []).filter(function(v){ return v.ko === '있다'; })[0] || verb;
    }
    if(verb && verb.ko === '있다' && !has(o1) && (has(dep) || has(transit))){
      verb = { ko:'있다', ro:'a fi', en:'to be' };
    }
    if(forceNeg) key = key === 'tense_past' || key === 'tense_neg_past' ? 'tense_neg_past' : key === 'tense_neg' ? 'tense_pres' : 'tense_neg';

    var vp;
    if(verb){
      var giAdj = null;
      if(key === 'tense_gi_adj'){
        var ga = clause.__giAdj || '어렵다';
        giAdj = (DATA.verb || []).filter(function(v){ return v.ko === ga; })[0] || null;
      }
      var addressee = /^tense_(lets|suggest|offer|please|dont|imp)$/.test(key);
      vp = trVerbPhrase(lang, verb, key, k, addressee ? false : info.fem, {
        mode: mode, pronoun: !topic || info.pronoun, nounDat: topic && !info.pronoun && !topic2 ? info.dat : '',
        causee: causee ? causee.person : null,
        reportSub: clause.__reportSub, giAdj: giAdj, giPast: clause.__giPast
      });
      // "nu … niciodată": 절대 needs a negated verb in Romanian
      if(lang !== 'en' && mode === 'finite' && advs.some(function(a){ return a.ko === '절대'; }) && !/^nu\b/.test(vp.text)) vp.text = 'nu ' + vp.text;
      // degree adverbs go before the adjective ("este foarte bună") or the verb ("chiar îmi place")
      var enGloss = trClean(verb.en || '');
      var isAdjPred = lang === 'en' ? (/^to be /.test(enGloss) || !/^to /.test(enGloss)) : /^a(-i)? fi /.test(trClean(verb.ro || ''));
      manner = manner.filter(function(a){
        if(!/^(정말|조금)$/.test(a.ko) || !vp.text) return true;
        var w = L(a);
        if(isAdjPred) vp.text = vp.text.replace(/(\S+)$/, w + ' $1');
        else if(a.ko === '정말') vp.text = (lang === 'en' ? 'really ' : 'chiar ') + vp.text;
        else return true;
        return false;
      });
    } else if(clause.__copula){
      var cp = clause.__copula, cpIt = trCopulaItem(cp.base.split(' ').pop());
      var pred = cpIt ? L(cpIt) : cp.base;
      if(lang === 'en' && cpIt) pred = /^[a-z]/.test(pred) && !/^(the|a|an|my) /.test(pred) ? (/^[aeiou]/.test(pred) ? 'an ' : 'a ') + pred : pred;
      else if(cpIt) pred = trRoBare(pred);
      if(lang === 'en' ? cp.relEn : cp.relRo) pred += ' ' + (lang === 'en' ? cp.relEn : cp.relRo);
      if(lang === 'en'){
        vp = { text: (cp.past ? ['was','were','was','were','were','were'][k] : trEnBe(k)) + (cp.neg ? ' not ' : ' ') + pred, prefix:'' };
      } else {
        vp = { text: (cp.neg ? 'nu ' : '') + (cp.past ? TR_AUX[k] + ' fost' : TR_RO_AUXV.fi[k]) + ' ' + pred, prefix:'' };
      }
    } else {
      vp = { text:'', prefix:'' };
    }

    // complements, in target-language order
    var comp = [], objs = [];
    if(has(embSub) && has(embPred)){
      var ep = L(embPred);
      // "coreeana e grea": the predicate adjective agrees with a feminine embedded subject
      if(lang !== 'en' && (trRaw(embSub).g ? trRaw(embSub).g === 'f' : /a$/.test(L(embSub))) && window.RoConjugator) ep = ep.replace(/^(e|nu e) ([a-zăâîșț]+)$/, function(m, cop, adj){ return cop + ' ' + window.RoConjugator.feminineSingular(adj); });
      objs.push((lang === 'en' ? 'that ' : 'că ') + L(embSub) + ' ' + ep);
    }
    if(bodyPart){
      var POSS = ['my', 'your', info.fem ? 'her' : 'his', 'our', 'your', 'their'];
      if(lang === 'en') objs.push(POSS[k] + ' ' + bodyPart[1]);
      else if(bodyPart[0]) objs.push('pe ' + bodyPart[0]);
    } else if(has(o1)){
      var o1tx = trObjectText(lang, o1, has(numeral) ? numeral : null, has(quantifier) ? quantifier : null, clause.__count);
      // after "mă uit la" the noun is bare: "la televizor", "la un film"
      if(watching && lang !== 'en' && !o1.indef && trRaw(o1).ro_sg) o1tx = trRaw(o1).num === 'pl' ? trRaw(o1).ro_pl : trRaw(o1).ro_sg;
      if(watching && lang === 'en' && o1.ko === '텔레비전을') o1tx = 'TV';
      // EN verbs that need a preposition before their object
      var enPrep = { graduate:'from' }[enVerbHead(verb).split(' ')[0]];
      if(lang === 'en' && enPrep) o1tx = enPrep + ' ' + o1tx;
      objs.push(o1tx);
    }
    if(has(o2)) objs.push((lang === 'en' ? 'and ' : 'și ') + L(o2));
    // "merg la piață ca să cumpăr fructe": the object belongs to the purpose verb
    if(!clause.__purposeVerbItem) comp = comp.concat(objs);
    if(has(ben)) comp.push(L(ben));
    manner.forEach(function(a){
      var at = L(a);
      // EN frequency adverbs sit before the verb ("I never drink"), after a form of "be" ("she is always tired")
      if(lang === 'en' && vp.text && /^(never|always|often|sometimes|rarely|usually)$/.test(at)){
        vp.text = /^(am|are|is|was|were)\b/.test(vp.text) ? vp.text.replace(/^(\S+)/, '$1 ' + at)
                : /^(will|can|must|should|may|don't|doesn't|didn't|can't)\b/.test(vp.text) ? vp.text.replace(/^(\S+)/, '$1 ' + at)
                : at + ' ' + vp.text;
        return;
      }
      comp.push(at);
    });
    var place = function(it){
      var t = L(it);
      if(lang === 'en' && verb && TR_MOTION_TO[verb.ko]){
        var tgt = verb.ko === '도착하다' ? 'at ' : verb.ko === '이사하다' || verb.ko === '여행하다' ? 'to ' : 'to ';
        t = t === 'at home' ? 'home' : t.replace(/^(at|in|on) /, tgt);
      }
      return t;
    };
    if(has(dep) && has(transit)) comp.push(place(dep) + (lang === 'en' ? ' and ' : ' și ') + place(transit).replace(/^(to|at) /, ''));
    else if(has(dep)) comp.push(place(dep));
    else if(has(transit)) comp.push(place(transit));
    if(has(assoc)) comp.push(L(assoc));
    else if(clause.__companion) comp.push((lang === 'en' ? 'with ' : 'cu ') + clause.__companion);
    if(clause.__purposeVerbItem){
      comp.push((lang === 'en' ? '' : 'ca ') + trVerbPhrase(lang, clause.__purposeVerbItem, 'tense_pres', k, info.fem, { mode:'subj' }).text);
      comp = comp.concat(objs);
    }
    // parser-only parts: "pentru mama", "cu trenul" go with the complements;
    // "datorită prietenului" opens the clause; a person object is a clitic (RO) / pronoun after the verb (EN)
    var causeTx = [];
    extras.forEach(function(x){
      if(x.type === 'for' || x.type === 'means') comp.push(lang === 'en' ? x.en : x.ro);
      else if(x.type === 'cause') causeTx.push(lang === 'en' ? x.en : x.ro);
      else if(x.type === 'obj' && vp.text){
        if(lang === 'en'){
          var op = x.person === 2 ? (x.fem ? 'her' : 'him') : TR_EN_OBJ_PRON[x.person];
          if(x.causee) vp.text = vp.text.replace('{causee}', op);
          else {
            // "wait for you", "listen to me"; "give me", "tell you" take the pronoun directly
            var EN_PREP = { wait:'for ', listen:'to ', look:'at ', talk:'to ', speak:'to ', call:'' };
            var vh = enVerbHead(verb).split(' ')[0];
            comp.unshift((EN_PREP.hasOwnProperty(vh) ? EN_PREP[vh] : x.dat && !/^(give|send|tell|teach|show|ask|buy)$/.test(vh) ? 'to ' : '') + op);
          }
        } else {
          vp.text = trRoClitic(vp.text, x, !!x.causee);
        }
      }
    });
    if(lang === 'en' && vp.text) vp.text = vp.text.replace('{causee}', 'someone');

    // subject: shown when chosen in the table (RO keeps the pronoun the learner picked),
    // omitted when repeated from the previous clause or when the frame has none (imperatives…)
    var subj = '';
    if(topic && !vp.dropSubject && !(sameSubject && ctx.index > 0)) subj = trSubjectText(lang, topic, topic2, subjAttrs, info.fem);
    // dative constructions name the experiencer in the dative: "Ei îi place", "Mamei i-a plăcut", "Lor le e greu"
    if(lang !== 'en' && topic && vp.dative && !topic2 && !(sameSubject && ctx.index > 0)){
      if(info.pronoun && (k === 2 || k === 5)) subj = k === 5 ? 'lor' : info.fem ? 'ei' : 'lui';
      else if(!info.pronoun && info.dat) subj = info.dat;
    }
    if(lang === 'en' && !subj && !vp.dropSubject && mode === 'finite' && !ctx.allowEnDrop && verb){
      subj = impersonal ? 'it' : info.implicit ? 'I' : (k === 2 ? (info.fem ? 'she' : 'he') : TR_EN_PRON[k]);
    }
    if(mode !== 'finite') subj = (topic && !sameSubject && ctx.index > 0) ? subj : '';

    var timeTx = has(time) ? L(time) : '';
    // "Ana a zis că vine mâine": the time belongs to the reported verb
    if(timeTx && key === 'tense_said' && lang !== 'en'){ comp.push(timeTx); timeTx = ''; }
    // clock times and durations follow the verb: "mă trezesc la ora 7", "locuiesc aici de 2 ani"
    if(timeTx && lang !== 'en' && /^(la ora|de \d|de (un|o) |\d)/.test(timeTx)){ comp.push(timeTx); timeTx = ''; }
    var words = [];
    var vtext = vp.text;
    if(lang === 'en' && /\{for\}/.test(vtext)){
      // "it's hard for me / for her / for my mom to…"
      var forWho = !topic || info.pronoun ? (k === 2 ? (info.fem ? 'her' : 'him') : TR_EN_OBJ_PRON[k]) : subj;
      vtext = vtext.replace('{for}', 'for ' + forWho);
      subj = '';
    } else if(vp.subjectAsPrefix && subj){
      // "pentru mama e greu să…" / "nu e nevoie ca mama să…"
      words.push(vp.subjectAsPrefix + ' ' + subj);
      subj = '';
    } else if(vp.subjectAsPrefix === 'nu e nevoie ca'){
      vtext = 'nu e nevoie ' + vtext;
    }
    if(lang === 'en'){
      if(causeTx.length) words.push(causeTx.join(' ') + ',');
      if(vp.prefix) words.push(vp.prefix);
      if(vp.end === '?' && /^(shall|do) /.test(vtext)){ words.push(vtext); }
      else {
        if(subj) words.push(subj);
        if(vtext) words.push(vtext);
      }
      words = words.concat(comp);
      if(vp.after) words.push(vp.after);
      if(timeTx) words.push(timeTx);
    } else {
      if(causeTx.length) words.push(causeTx.join(' ') + ',');
      if(vp.prefix) words.push(vp.prefix);
      if(timeTx) words.push(timeTx);
      if(subj) words.push(subj);
      if(vtext) words.push(vtext);
      words = words.concat(comp);
    }
    // a subordinate "să" clause with its own subject: "ca mama să gătească"
    var text = words.filter(Boolean).join(' ');
    return { text: text, end: vp.end || '', hasVerb: !!(verb || clause.__copula), empty: !verb && !clause.__copula && !comp.length && !subj && !timeTx };
  }

  // A relative clause in the other language than the one typed, from what the parser read in it:
  // "care locuiește în Seul" → "who lives in Seoul", "that you gave me" → "pe care mi-ai dat-o"
  function trRelative(lang, R, head){
    if(!R || !R.verb) return '';
    var hr = trRaw(head), headPl = hr.num === 'pl' || /들/.test(head.ko || '');
    var headFem = hr.g ? hr.g === 'f' : /a$/.test(trClean(head.ro || '').split(' ')[0]);
    var L = function(it){ return it ? (lang === 'en' ? trClean(it.en || it.ro) : trClean(it.ro || it.en)) : ''; };
    var key = R.neg ? (R.tense === 'past' ? 'tense_neg_past' : 'tense_neg')
            : R.tense === 'past' ? 'tense_past' : R.tense === 'future' ? 'tense_fut' : 'tense_pres';
    var k, fem = false, subjTx = '';
    if(R.kind === 'subj'){ k = headPl ? 5 : 2; fem = headFem; }
    else if(R.subj){ var si = trSubjectInfo(R.subj); k = si.k; fem = si.fem; subjTx = trSubjectText(lang, R.subj, null, [], si.fem); }
    else k = R.personK != null ? R.personK : 2;
    var verb = R.verb;
    if(verb.ko === '있다' && !R.obj) verb = { ko: '있다', ro: 'a fi', en: 'to be' };
    var vp = trVerbPhrase(lang, verb, key, k, fem, { pronoun: true }).text;
    if(!vp) return '';
    var rest = [];
    if(R.kind === 'subj' && R.obj) rest.push(trObjectText(lang, R.obj, null, null, null));
    var subjPron = R.subj && trSubjectInfo(R.subj).pronoun;
    if(lang !== 'en' && subjPron) subjTx = '';            // pe care ai dat-o, not … tu
    if(R.loc){
      var lt = L(R.loc);
      if(R.langa) lt = (lang === 'en' ? 'next to ' : 'lângă ') + lt.replace(/^(la|în|pe|at|in|on) /, '');
      rest.push(lt);
    }
    if(R.time) rest.push(L(R.time));
    if(lang === 'en'){
      if(R.kind === 'subj'){
        var person = /^(I|you|he|she|we|they|my |the (friend|teacher|student|girl|boy|woman|man|person|children)|mom|dad)/i.test(trClean(head.en || '')) ||
                     /^(친구|선생님|학생|소녀|소년|아이|엄마|아빠|형|동생|언니|여자|남자|사람)/.test(head.ko || '');
        return [person ? 'who' : 'that', vp].concat(rest).join(' ');
      }
      var who = subjTx || (k === 2 ? 'he' : TR_EN_PRON[k]);
      var toWhom = R.datK != null ? [R.datK === 2 ? (R.datFem ? 'her' : 'him') : TR_EN_OBJ_PRON[R.datK]] : [];
      return [R.kind === 'place' ? 'where' : 'that', who, vp].concat(toWhom).concat(rest).join(' ');
    }
    if(R.kind === 'subj') return ['care', vp].concat(rest).join(' ');
    if(R.kind === 'place') return ['unde', vp].concat(subjTx ? [subjTx] : []).concat(rest).join(' ');
    // "pe care o citesc" / "pe care l-am văzut" / "pe care le-am cumpărat": the clitic repeats the head
    var cv = trRoClitic(vp, { person: headPl ? 5 : 2, fem: headFem, dat: false }, false);
    if(headPl && headFem) cv = cv.replace(/^((?:nu )?)îi /, '$1le ').replace(/^((?:nu )?)i-/, '$1le-');
    if(R.datK != null){
      // "mi-ai dat-o" (the feminine -o sits after the participle, so both clitics fit); otherwise "… mie"
      if(headFem && !headPl && /-o\b/.test(cv)) cv = cv.replace(/^((?:nu )?)(am|ai|a|ați|au) /, function(m, n0, aux){ return n0 + TR_RO_DAT_H[R.datK] + aux + ' '; });
      else cv += ' ' + TR_RO_STRONG.dat[R.datK];
    }
    return ['pe care', cv].concat(subjTx ? [subjTx] : []).concat(rest).join(' ');
  }

  function buildTableTranslation(lang){
    lang = lang === 'en' ? 'en' : 'ro';
    var n = state.clauses.length;
    var lastKey = connectorKey(state.clauses[n - 1]);
    var pastAll = !!TR_PAST_KEYS[lastKey];
    var futAll = !!TR_FUT_KEYS[lastKey];
    var ctx = { subject: null, subjectKo: '', index: 0 };
    var out = '', join = '', pending = '', end = '', anyVerb = false;
    var links = state.clauses.map(function(cl, i){
      if(i === n - 1) return null;
      var c = connectorKey(cl);
      if(!c || c === 'none' || c.indexOf('tense_') === 0) return null;
      if(c === 'cause1'){ var vb = itemOf(cl, 'verb'); if(vb && TR_SEQ_SEO[vb.ko]) c = 'seq'; }
      return c;
    });

    for(var i = 0; i < n; i++){
      var clause = state.clauses[i];
      var link = links[i];
      // a gapped clause with nothing but the verb the next clause repeats (Korean drops it too)
      if(i < n - 1 && state.clauses[i + 1].__inheritedVerb && !(clause.__extras || []).length &&
         ALL_FIELD_KEYS.every(function(f){ var it = itemOf(clause, f); return f === 'verb' || f === 'connector' || !it || !it.ko; })) continue;
      var Lk = link ? (TR_LINK[lang][link] || { join: ', ' }) : null;
      var mode = Lk && Lk.mode ? Lk.mode : 'finite';
      // tense of a non-final clause follows the sentence's final ending (Korean marks it only at the end)
      var key;
      if(i === n - 1){
        key = lastKey;
        if(clause.negated && (key === 'none' || key === 'tense_pres')) key = 'tense_neg';
        if(clause.negated && key === 'tense_past') key = 'tense_neg_past';
      } else {
        var past = pastAll || clause.tenseOverride === 'past';
        var fut = futAll && !Lk.pre && !Lk.post;
        key = past ? 'tense_past' : fut ? 'tense_fut' : 'tense_pres';
        if(clause.wishModal) key = 'tense_wish';
        if(Lk.frame === 'result') key = past ? 'tense_result_past' : 'tense_result';   // -게 되다: ajung să studiez
        if(clause.negated) key = key === 'tense_past' ? 'tense_neg_past' : 'tense_neg';
      }
      if(Lk && Lk.neg && lang !== 'en'){ key = 'tense_neg'; }
      ctx.key = key;
      ctx.index = i;
      ctx.allowEnDrop = lang === 'en' && i > 0 && (join === ' and ' || join === ' or ' || join === ', then ');
      var r = trRenderClause(lang, clause, ctx, mode, link);
      if(r.end) end = r.end;
      if(r.hasVerb) anyVerb = true;
      var txt = r.text;
      if(Lk && Lk.neg && lang !== 'en' && mode === 'subj') txt = txt.replace(/^să /, 'să nu ');
      if(r.empty){
        if(i === n - 1 && out){ out += join.replace(/,?\s+$/, '').replace(/^\s+/, ' ') + '…'; join = ''; }
        continue;
      }
      if(Lk && Lk.pre) txt = Lk.pre + ' ' + txt;
      if(Lk && Lk.post){
        pending = (Lk.word ? Lk.word + ' ' : '') + txt + (pending ? ' ' + pending : '');
        continue;
      }
      if(pending){ txt += ' ' + pending; pending = ''; }
      out += (out ? join : '') + txt;
      join = Lk ? Lk.join : '';
      // 는데 / "iar" contrasts two subjects; with the same subject it just goes on: "și" / "and"
      if(link === 'contrast2' && state.clauses[i + 1] && !itemOf(state.clauses[i + 1], 'topic')) join = lang === 'en' ? ' and ' : ' și ';
      // "A, B și C": a seq chain joins with commas until its last link
      if(link === 'seq' && links[i + 1] === 'seq') join = ', ';
    }
    if(pending) out += (out ? join : '') + pending;
    out = cleanSentenceText(out.replace(/\s+/g, ' ').replace(/\s+([,?!])/g, '$1').trim());
    if(!out) return '';
    out = out.charAt(0).toUpperCase() + out.slice(1);
    if(/…$/.test(out)) return out;
    if(!anyVerb) return out.replace(/[.?!]+$/, '') + '…';   // still being built: no verb yet
    if(!end) end = state.__question ? '?' : '.';
    return out.replace(/[.?!]+$/, '') + end;
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

    var koOut = cleanSentenceText(ko.join(' '));
    if(state.__question && koOut && !/\?$/.test(koOut)) koOut += '?';
    // the typed sentence stays the translation only while the table still says exactly that;
    // a sentence built or changed from the cards gets one generated from them
    var typed = (state.text || '').trim();
    var useTyped = typed && state.__parsedKo === koOut;
    return {
      korean: koOut,
      translation: useTyped ? typed : (koOut ? buildTableTranslation(state.lang) : '')
    };
  }

  // Verbs that cannot take a direct object with 를/을
  var INTRANSITIVE_VERBS = {
    '가다':1,'오다':1,'도착하다':1,'떠나다':1,'돌아오다':1,
    '자다':1,'쉬다':1,'울다':1,'웃다':1,'달리다':1,'산책하다':1,'일어나다':1,
    '기쁘다':1,'슬프다':1,'화나다':1,'피곤하다':1,'매달려 있다':1,'나타나다':1,'사라지다':1
  };
  // 있다 takes 이/가 (subject marker) for the possessed item, not 를/을
  var EXISTENTIAL_VERBS = { '있다':1 };

  // Quotative verbs take -다고 (reported speech/thought); all others use -다는 걸 (nominalized)
  var QUOTATIVE_VERBS = { '말하다':1, '생각하다':1 };

  // the whole sentence again with another final ending (for an ambiguous reading)
  function buildAltOutput(tenseKey){
    var last = state.clauses[state.clauses.length - 1];
    if(!last) return '';
    var entry = null, idx = 0;
    for(var i = 0; i < DATA.connector.length; i++) if(DATA.connector[i].id === tenseKey){ entry = DATA.connector[i]; idx = i; break; }
    if(!entry) return '';
    var saved = last.__picked ? last.__picked.connector : null;
    var savedConn = last.connector ? { enabled: last.connector.enabled, index: last.connector.index } : null;
    setFieldItem(last, 'connector', normalizeItem(entry, 'connector', idx));
    var out = buildFullOutput().korean;
    last.__picked.connector = saved;
    if(savedConn){ last.connector.enabled = savedConn.enabled; last.connector.index = savedConn.index; }
    return out;
  }

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
        if(EXISTENTIAL_VERBS[vb.ko] && hasAccObj(o2)){
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

    var altEl = document.getElementById('altReading');
    if(!altEl && warnEl){
      altEl = document.createElement('div');
      altEl.id = 'altReading';
      altEl.className = 'grammar-warning alt-reading';
      warnEl.parentNode.insertBefore(altEl, warnEl.nextSibling);
    }
    if(altEl){
      var altKo = state.text && state.__altKey ? buildAltOutput(state.__altKey) : '';
      altEl.hidden = !altKo;
      if(altKo){
        var noneed = state.__altKey === 'tense_noneed';
        altEl.textContent = state.lang === 'en'
          ? '💡 “nu trebuie să” can also mean ' + (noneed ? '“no need to”: ' : '“must not”: ') + altKo
          : '💡 „nu trebuie să” poate însemna și ' + (noneed ? '„nu e nevoie să”: ' : '„n-ai voie să”: ') + altKo;
      }
    }

    var unkEl = document.getElementById('unknownWords');
    if(!unkEl && warnEl){
      unkEl = document.createElement('div');
      unkEl.id = 'unknownWords';
      unkEl.className = 'grammar-warning unknown-words';
      warnEl.parentNode.insertBefore(unkEl, warnEl.nextSibling);
    }
    if(unkEl){
      var unk = (state.text && state.__unknown) || [];
      unkEl.hidden = !unk.length;
      unkEl.textContent = unk.length ? ((state.lang === 'en' ? '❓ Words the builder doesn\'t know yet: ' : '❓ Cuvinte pe care builderul nu le cunoaște încă: ') + unk.join(', ')) : '';
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
    html += renderHiddenParts();
    els.clauseList.innerHTML = html;

    var wrap = els.clauseList.querySelector('.builderTableWrap');
    if(wrap){
      updateScrollIndicators(wrap, colCount);
      wrap.addEventListener('scroll', function(){
        updateScrollIndicators(wrap, colCount);
      }, { passive: true });
    }
  }

  // Parts of the Korean sentence that came from the typed text but have no card
  // ("cu trenul" → 기차로, "te aștept" → 너를, "datorită prietenului", "două pisici", "ca să cumpăr").
  // Shown under the cards so nothing in the sentence is invisible, each removable with ×.
  function hiddenPartsOf(clause){
    var lang = state.lang === 'en' ? 'en' : 'ro', out = [];
    (clause.__extras || []).forEach(function(x, i){
      var tr = x.type === 'obj'
        ? (lang === 'en' ? (x.person === 2 ? (x.fem ? 'her' : 'him') : TR_EN_OBJ_PRON[x.person])
                         : (x.person === 2 && x.fem ? (x.dat ? 'ei' : 'pe ea') : TR_RO_STRONG[x.dat ? 'dat' : 'acc'][x.person]))
        : (lang === 'en' ? x.en : x.ro);
      out.push({ id: 'extra:' + i, ko: x.ko, tr: tr });
    });
    if(clause.__companion) out.push({ id: 'companion', ko: hangulName(clause.__companion) + '하고 같이', tr: (lang === 'en' ? 'with ' : 'cu ') + clause.__companion });
    if(clause.__count) out.push({ id: 'count', ko: clause.__count.num + ' ' + clause.__count.counter, tr: '×' + (NATIVE_NUM.indexOf(clause.__count.num) > 0 ? NATIVE_NUM.indexOf(clause.__count.num) : clause.__count.num) });
    if(clause.__purposeVerbItem){
      var pv = clause.__purposeVerbItem;
      out.push({ id: 'purpose', ko: pv.ko, tr: (lang === 'en' ? '' : 'ca ') + trVerbPhrase(lang, pv, 'tense_pres', 0, false, { mode:'subj' }).text });
    }
    if(clause.__copula && !itemOf(clause, 'verb')){
      var cpIt = trCopulaItem(clause.__copula.base.split(' ').pop());
      out.push({ id: 'copula', ko: clause.__copula.base + (clause.__copula.neg ? ' 아니에요' : '이에요'),
                 tr: (lang === 'en' ? 'be ' : 'a fi ') + (cpIt ? trClean(lang === 'en' ? cpIt.en : cpIt.ro) : clause.__copula.base) });
    }
    return out;
  }
  function renderHiddenParts(){
    var rows = [];
    state.clauses.forEach(function(clause, r){
      hiddenPartsOf(clause).forEach(function(p){
        rows.push('<span class="hiddenPart"><span class="hpKo">' + escapeHtml(p.ko) + '</span>' +
                  (p.tr ? '<span class="hpTr">' + escapeHtml(p.tr) + '</span>' : '') +
                  '<button type="button" class="hpDel" data-hidden-remove="' + r + ':' + p.id + '" aria-label="' +
                  (state.lang === 'en' ? 'Remove' : 'Șterge') + '">×</button></span>');
      });
    });
    if(!rows.length) return '';
    return '<div class="hiddenParts"><span class="hpLabel">' + (state.lang === 'en' ? 'also in the sentence' : 'tot în propoziție') + '</span>' + rows.join('') + '</div>';
  }
  function removeHiddenPart(r, id){
    var clause = state.clauses[r];
    if(!clause) return;
    var m = /^extra:(\d+)$/.exec(id);
    if(m && clause.__extras) clause.__extras.splice(Number(m[1]), 1);
    else if(id === 'companion') clause.__companion = null;
    else if(id === 'count') clause.__count = null;
    else if(id === 'purpose') clause.__purposeVerbItem = null;
    else if(id === 'copula') clause.__copula = null;
    renderAll();
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
      // app-dictionary words: in the pickers, but matched in typed text only by the
      // context-aware dictionary fallback (so "pot" stays a modal, not 냄비)
      if(item && item.fromDictionary) continue;
      var candidates = itemCands(item);

      for(var j=0;j<candidates.length;j++){
        var candidate = candidates[j];
        if(!candidate) continue;
        // a generated English form ("appeared" from "to appear") loses a tie against a hand-written one
        var _genPenalty = (item.__nExplicit != null && j >= item.__nExplicit) ? 0.5 : 0;

        var pos = normalizedText.indexOf(' ' + candidate + ' ');
        if(pos === -1) pos = strippedText.indexOf(' ' + candidate + ' ');
        if(pos === -1) continue;

        // Modal verbs followed by "să / to" ("vreau să merg", "want to go") are
        // not the main verb: the verb after them is (the modal becomes the tense).
        if(fieldKey === 'verb'){
          var afterCand = normalizedText.substring(pos + candidate.length + 1, pos + candidate.length + 5);
          var isModalWord = /^(vreau|vrei|vrea|vrem|vreti|vor|doresc|dorim|pot|poti|poate|putem|puteti|trebuie|incerc|sper|want|wants|wanted|need|needs|try|tries|would like|like)$/.test(candidate);
          if(isModalWord && (/^(sa|to) /.test(afterCand) || /^(sa|to)$/.test(afterCand.trim()))) continue;
        }

        // For verbs: check if this match is preceded by 'sa' (Romanian subjunctive) or
        // 'to' (English infinitive). These signal a purpose verb, not the main verb.
        if(fieldKey === 'verb'){
          var before = normalizedText.substring(0, pos).trimEnd();
          var beforeWords = before.split(/\s+/);
          var prevWord = beforeWords.pop();
          // Skip the reflexive pronoun so "o să ne ducem" looks at "să".
          if(/^(ne|ma|te|se|va|il|o|le|ii|ti|mi|ni|vi|si)$/.test(prevWord) && beforeWords.length){
            var maybeSa = beforeWords[beforeWords.length - 1];
            if(maybeSa === 'sa'){ beforeWords.pop(); prevWord = 'sa'; }
          }
          // "o să / am să / vreau să / pot să / trebuie să + verb" = future or
          // modal + MAIN verb, not a purpose verb ("merg la piață să cumpăr").
          // an alias that itself starts with "to " ("to buy") in mid-sentence is an
          // English purpose infinitive ("go to the market to buy fruit")
          if(/^to /.test(candidate) && before.trim().length){
            if(candidate.length > bestSaLen){ bestSa = item; bestSaLen = candidate.length; }
            continue;
          }
          var auxBeforeSa = prevWord === 'sa' && /^(o|am|ai|are|avem|aveti|au|vreau|vrei|vrea|vrem|vreti|vor|pot|poti|poate|putem|puteti|trebuie|incerc|incerci|incearca|reusesc|sper|vom|voi|vei|va|vor)$/.test(beforeWords[beforeWords.length - 1] || '');
          if((prevWord === 'sa' || prevWord === 'to') && !auxBeforeSa){
            if(candidate.length > bestSaLen){ bestSa = item; bestSaLen = candidate.length; }
            continue;
          }
        }

        if(candidate.length - _genPenalty > bestLen){
          best = item;
          bestLen = candidate.length - _genPenalty;
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
      if(!item || !item.ko || item.fromDictionary) continue;

      var candidates = itemCands(item);
      var bestPos = -1;
      var bestLen = 0;

      for(var j=0;j<candidates.length;j++){
        var candidate = candidates[j];
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
      if(!item || !item.ko || item.fromDictionary) continue;
      var candidates = itemCands(item);
      var bestPos = -1, bestLen = 0;
      for(var j=0;j<candidates.length;j++){
        var candidate = candidates[j];
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
      {key:'during',        phrases:['cat timp','cât timp','for as long as']},
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
      {key:'fear',          phrases:['xfearx']},
      {key:'so',            phrases:['asa ca','așa că','de aceea','that s why','xcommax so','and so','deci']},
      {key:'condition',     phrases:['daca','dacă','if']},
      {key:'when',          phrases:['atunci cand','atunci când','cand','când','when']},
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
      after:true, before:true, concede:true, concede2:true, while:true, asap:true, fear:true, because_of:true, when:true, condition:true, during:true
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

  // Romanian past participles of every verb in the vocabulary, read from its forms
  // ("am apărut" → apărut). Built once; replaces a hand-kept list that kept missing verbs.
  var PAST_PARTICIPLES = null;
  function pastParticiples(){
    if(PAST_PARTICIPLES) return PAST_PARTICIPLES;
    PAST_PARTICIPLES = {};
    (DATA && DATA.verb || []).forEach(function(v){
      (v.aliases || []).forEach(function(a){
        var m = /^(?:am|ai|a|ati|au|m am|te ai|s a|ne am|v ati|s au) ([a-z]+)$/.exec(normalizeLatin(a));
        if(m && m[1].length >= 3 && !/^(fost|avut)$/.test(m[1])) PAST_PARTICIPLES[m[1]] = 1;
      });
    });
    return PAST_PARTICIPLES;
  }
  // verbs that never take a direct object: what "happens" is the subject (해가 나타나요, 고양이가 자요)
  var TRANSITIVE_EXCEPT = { '보살피다':1, '살피다':1, '만나다':1, '가지다':1, '지다':1, '찾아가다':1, '찾아오다':1, '가져가다':1, '가져오다':1, '데려가다':1, '데려오다':1 };
  function isIntransitive(ko){
    if(!ko) return false;
    if(INTRANSITIVE_VERBS[ko]) return true;
    var last = String(ko).split(' ').pop();
    if(TRANSITIVE_EXCEPT[last] || String(ko).indexOf(' ') > 0) return false;   // compounds carry their own object
    return /(지다|나다|생기다|자다|눕다|앉다|서다|울다|웃다|걷다|뛰다|쉬다|피다|죽다|붙다|늦다|살다|놀다|흐르다|자라다|되다)$/.test(last);
  }

  function detectTenseFromText(text){
    var n = normalizeLatin(text);

    // Opinion / guess: "cred că…", "probabil", "I think…" → -것 같아요
    if(/\b(cred ca|credem ca|crezi ca|probabil|i think|i guess|probably)\b/.test(n) && !/\bnu cred\b/.test(n)){
      var _rest = n.replace(/\b(cred|credem|crezi) ca\b|\bprobabil\b|\bi think\b|\bi guess\b|\bprobably\b/g, ' ');
      if(!hasVerbLike(_rest) && !/\b(will|va|vor)\b/.test(_rest)) return 'present';   // "I think" alone = 생각해요
      var _t = detectTenseFromText(_rest);
      return _t === 'past' ? 'guess_past' : _t === 'future' ? 'guess' : 'guess_now';
    }
    // Negation — checked before past/future
    if(/\b(nu pot|nu pot sa|cannot|can't|cant)\b/.test(n)) return 'cannot';
    // "vreau să X" → X-고 싶어요 ; "pot să X" → X-(으)ㄹ 수 있어요 (when not negated)
    if(!/\bnu\b/.test(n)){
      if(/\b(vreau|vrei|vrea|vrem|vreti|doresc|dorim) sa\b|\b(want|wants) to\b|\bwould like to\b/.test(n)) return 'wish';
      if(/\b(pot|poti|putem|puteti) sa\b|\bi can\b|\bwe can\b|\byou can\b/.test(n)) return 'can';
    }
    if(/\b(nu vreau|nu doresc|nu vrei|don't want|do not want|dont want)\b/.test(n)) return 'notwish';
    if(/\b(nu trebuie|nu ar trebui|must not|mustn't|mustnt)\b/.test(n)) return 'mustnot';
    // Exclude 'nu numai' (not only…) — that 'nu' is not a negation
    if((/\bnu\b/.test(n) && !/\bnu numai\b/.test(n)) || /\b(don't|doesn't|do not|does not|dont|doesnt|didn t|didnt|did not)\b/.test(n) || /(^| )n (am|ai|a|au|ati|o)\b/.test(n)) return 'neg';

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
                   'trezit','inteles','stat',
                   'mutat','intarziat','luat','fumat','locuit','terminat','hotarat','incercat',
                   'zis','spus','condus','inotat','trait','condus','pierdut','trecut','vizitat',
                   'mers','fost','cerut','auzit','uitat','sosit','castigat','mancat',
                   'aparut','disparut','aparu','disparu','sunat'];
    // Word-boundary check: prevents 'studiat' matching inside 'studiati', etc.
    var _nn = ' ' + n + ' ';
    for(var i=0;i<roParts.length;i++){
      if(_nn.indexOf(' '+roParts[i]+' ') !== -1) return 'past';
    }
    // any participle the vocabulary knows ("am apărut", "a atârnat"…), after a past auxiliary
    var _pp = pastParticiples();
    var _auxRe = /\b(?:am|ai|a|ati|au|m am|te ai|s a|ne am|v ati|s au|n am|n a|n au)\s+(\S+)/g, _am;
    while((_am = _auxRe.exec(_nn))){ if(_pp[_am[1]]) return 'past'; _auxRe.lastIndex = _am.index + 1; }
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
    var enPast = ['went','ate','came','saw','wrote','met','rested','worked','was','were','eaten','been','did','appeared','disappeared','vanished',
                  'told','said','grew','hung','ran','took','found','felt','kept','left','lost','paid','put','sent','sat','slept','spent','stood',
                  'thought','understood','won','wore','brought','caught','taught','fought','built','chose','drove','fell','forgot','got','heard',
                  'knew','sold','sang','swam','threw','began','broke','drank','flew','gave','hid','held','meant','rode','rose','shook','spoke',
                  'stole','struck','swore','woke','entered','made','became',
                  'exercised','prepared','learned','listened','made','bought',
                  'gave','studied','read ','read,','read.'];
    // regular English past in -ed ("finished", "visited") for a known, non-adjective verb
    var edWords = n.match(/\b[a-z]{2,}ed\b/g) || [];
    for(var ew = 0; ew < edWords.length; ew++){
      var edV = findBestMatch('verb', edWords[ew]);
      if(edV && !isDescriptive(edV)) return 'past';
    }
    for(var j=0;j<enPast.length;j++){
      if(_nn.indexOf(' ' + enPast[j].replace(/[ ,.]/g, '') + ' ') !== -1) return 'past';
    }

    return 'present';
  }

  // ---- TOPIK grammar frames ------------------------------------------------
  // Romanian/English constructions that map to one Korean ending
  // ("am hotărât să X" → X-기로 했어요). The frame words are cut out of the text,
  // so the rest parses as a plain sentence, and the frame picks the final ending.
  // Length-preserving fold (lowercase, no diacritics), so a match index in the
  // folded text is also valid in the original text.
  function foldKeep(str){
    return String(str || '').toLowerCase()
      .replace(/[ăâ]/g, 'a').replace(/î/g, 'i').replace(/[șş]/g, 's').replace(/[țţ]/g, 't').replace(/[’`]/g, "'");
  }
  function cutFolded(raw, re, repl){
    var m = re.exec(foldKeep(raw));
    if(!m) return null;
    return { text: raw.slice(0, m.index) + (repl == null ? ' ' : repl) + raw.slice(m.index + m[0].length), m: m };
  }
  var MOTION_NOOBJ = { '가다':1, '오다':1, '도착하다':1, '떠나다':1, '돌아오다':1, '산책하다':1, '달리다':1 };
  var NUM_RE = '\\d{1,3}|unu|una|doi|doua|trei|patru|cinci|sase|sapte|opt|noua|zece|unsprezece|doisprezece|douasprezece|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve';
  var NUM_WORDS = { un:1, o:1, a:1, an:1, unu:1, una:1, one:1, doi:2, doua:2, two:2, trei:3, three:3, patru:4, four:4, cinci:5, five:5, sase:6, six:6,
                    sapte:7, seven:7, opt:8, eight:8, noua:9, nine:9, zece:10, ten:10, unsprezece:11, eleven:11, doisprezece:12, douasprezece:12, twelve:12 };
  function numVal(w){ return /^\d+$/.test(w) ? Number(w) : (NUM_WORDS[w] || 0); }
  var NATIVE_NUM = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉', '열', '열한', '열두'];
  var COUNTERS = { '고양이':'마리', '개':'마리', '강아지':'마리', '새':'마리', '물고기':'마리', '책':'권', '공책':'권',
                   '친구':'명', '사람':'명', '학생':'명', '아이':'명', '커피':'잔', '맥주':'잔', '주스':'잔', '표':'장', '사진':'장', '티켓':'장', '종이':'장' };
  var GRAMMAR_FRAMES = [
    { re: /\bnu trebuie (?:neaparat|obligatoriu) sa\b|\bnu trebuie sa(?=.*\bdaca nu (?:vrei|vreti|vrea|poti|puteti|ai chef|ai timp)\b)|\bnu (?:e|este|i) (?:nevoie|necesar|obligatoriu) (?:ca )?sa\b|\b(?:don'?t|do not|doesn'?t|does not) (?:have|need) to\b/, t: 'tense_noneed' },
    { re: /\bnu (?:ai|aveti|am|are|avem|au) voie(?: sa)?\b|\bnu (?:e|este) voie(?: sa)?\b|\b(?:is |are )?not allowed to\b/, t: 'tense_mustnot' },
    { re: /\b(?:ai|aveti|am|are|avem|au) voie(?: sa)?\b|\b(?:e|este) voie(?: sa)?\b|\b(?:is |are )?allowed to\b|\byou may\b/, t: 'tense_may' },
    { re: /\bnu (?:stiu|stii|stie|stim|stiti) (?:cum )?sa\b|\b(?:don'?t|doesn'?t|do not|does not) know how to\b/, t: 'tense_knowhow_not' },
    { re: /\b(?:stiu|stii|stie|stim|stiti) (?:cum )?sa\b|\bknows? how to\b/, t: 'tense_knowhow' },
    { re: /\b(?:(?:am|ai|a|ati|au|m-am|ne-am|s-a|s-au) (?:hotarat|decis)|(?:hotarasc|hotaram|decid|decidem)) sa\b|\bdecided to\b/, t: 'tense_decide' },
    { re: /\b(?:ma|ne|te|se) gand(?:esc|im|esti|este|iti) (?:daca )?sa\b|\b(?:thinking|think) (?:of|about)\b/, t: 'tense_consider' },
    // "m-a făcut să plâng" / "mă face să râd" → 저를 울게 만들었어요 / 저를 웃게 만들어요
    { re: /\b(m-a|m-au|te-a|te-au|l-a|l-au|ne-a|ne-au|v-a|v-au|i-a|i-au) facut sa\b|\bmade (me|you|us|him|her|them)\b/, t: 'tense_make_do_past', cause: true },
    { re: /\b(ma|te|il|o|ne|va|ii|le) (?:face|fac|faci|faceti|facem) sa\b|\bmakes? (me|you|us|him|her|them)\b/, t: 'tense_make_do', cause: true },
    { re: /\b(?:e|este|a fost|era) (greu|dificil|usor|simplu|important|interesant|placut|distractiv|bine|obositor|periculos)(?: sa| de)\b|\bit(?: is|'s| was) (hard|difficult|easy|important|interesting|fun|good|dangerous) to\b/, t: 'tense_gi_adj', adj: true },
    { re: /\b(?:m-am|te-ai|s-a|ne-am|v-ati|s-au) pregatit (?:sa|de)\b|\bgot ready to\b|\bprepared to\b/, t: 'tense_prepare_past' },
    { re: /\b(?:ma|te|se|ne|va) pregat(?:esc|esti|este|im|iti) (?:sa|de)\b|\b(?:getting|get) ready to\b|\bpreparing to\b/, t: 'tense_prepare' },
    { re: /\b(?:am|ai|a|ati|au) incercat sa\b|\btried to\b/, t: 'tense_try_past' },
    { re: /\b(?:incerc|incerci|incearca|incercam|incercati) sa\b|\b(?:try|tries) to\b/, t: 'tense_try' },
    { re: /\bse pare ca\b|\bit seems(?: that| like)?\b|\bseems? (?:that|like)\b/, t: 'seem' },
    { re: /\b(?:cred|credem|crezi|credeti) ca\b|\bprobabil(?: ca)?\b|\bi think(?: that)?\b|\bi guess\b|\bprobably\b/, t: 'guess', unless: /\bnu cred\b|\bdon'?t think\b/ },
    { re: /\b(?:mi-a|mi-au|ne-a|ne-au|i-a|i-au|ti-a|v-a) (?:zis|spus|cerut) sa\b|\bm-a rugat sa\b|\b(?:told|asked) (?:me|us|him|her|you) to\b/, t: 'tense_said_cmd' },
    { re: /\b(?:a|am|ai|au|ati|mi-a|ne-a) (?:zis|spus) ca\b|\b(?:spune|zice|spun|zic) ca\b|\b(?:said|says|told me)(?: that)?\b/, t: 'said' },
    { re: /^\s*(?:hai(?:deti)?(?: sa)?|let'?s|let us)\b/, t: 'tense_lets' },
    { re: /\b(?:va|te) rog(?: frumos)?(?: sa)?\b|\bplease\b/, t: 'tense_please' },
    { re: /\b(?:imi|iti|ii|ne|va|le) (?:place|plac|placea) sa\b|\b(?:like|likes|love|loves) to\b/, t: 'tense_like_doing', subj: true }
  ];
  var FRAME_SUBJ = { imi: 'eu', iti: 'tu', ne: 'noi', va: 'voi', le: 'ei', i: 'eu', we: 'noi', you: 'tu' };
  var NOUN_EXTRA = { ploii: '비', ploaia: '비', ploaie: '비', rain: '비', 'the rain': '비', zapezii: '눈', zapada: '눈', snow: '눈', 'the snow': '눈',
                     traficului: '교통 체증', traffic: '교통 체증', 'the traffic': '교통 체증', vremii: '날씨', weather: '날씨', 'the weather': '날씨',
                     bolii: '병', racelii: '감기', tie: '', tine: '', voua: '', you: '', lui: '그 사람', ei: '그 사람' };
  var IMP_WORDS = /(^|, ?)\s*(vino|veniti|du-te|asteapta|asteptati|citeste|cititi|scrie|scrieti|asculta|ascultati|spune|spuneti|deschide|deschideti|inchide|inchideti|intra|intrati|mananca|mancati|bea|beti|dormi|odihneste-te|ajuta-ma|ajutati-ma|suna-ma|sun-o|suna-l|suna-o|sunati-ma|uita-te)\b/;
  var IMP_EN = /^\s*(come|go|eat|drink|sit|wait|read|write|listen|look|open|close|call|help|sleep|study)\b/;

  function nounKoBase(phrase){
    var p = normalizeLatin(phrase).replace(/^(the|a|an|my|your|our|his|her) /, '');
    var first = p.split(' ')[0];
    if(NOUN_EXTRA.hasOwnProperty(p)) return NOUN_EXTRA[p];
    if(NOUN_EXTRA.hasOwnProperty(first)) return NOUN_EXTRA[first];
    var hit = findBestMatch('object1', p) || findBestMatch('topic', p) || findBestMatch('departure', p);
    return hit && hit.ko ? hit.ko.replace(/(에서|에|을|를|이|가|은|는)$/, '') : null;
  }

  // is there still a verb (builder vocabulary, app dictionary, or a copula) in this text?
  function hasVerbLike(text){
    var n = normalizeLatin(text);
    if(!n) return false;
    if(findBestMatch('verb', n) || /\b(e|este|sunt|is|are|was|were)\b/.test(n)) return true;
    return n.split(' ').some(function(t){ var h = lexLookup(t); return h && (h.kind === 'verb' || h.kind === 'adj'); });
  }
  function applyGrammarFrames(raw){
    var out = { text: raw, frame: null, prefix: null, question: /\?\s*$/.test(raw), exclaim: /!\s*$/.test(raw) };
    var f, r;
    // "am făcut strada praf" → "am făcut praf strada" (the idiom's two words side by side)
    out.text = out.text.replace(/(\bf(?:ac|aci|ace|acem|aceți|aceti|ăcut|acut)\b)((?:\s+[^\s,.!?]+){1,3}?)\s+praf\b/i, '$1 praf$2');
    // "mă faci mereu să râd" → "mă faci să râd mereu" (an adverb between the verb and "să")
    out.text = out.text.replace(/(\bf(?:ac|aci|ace|acem|aceți|aceti|ăcut|acut)\b)\s+(mereu|des|adesea|deseori|întotdeauna|intotdeauna|uneori|always|often|sometimes)\s+(să|sa)(?=\s|$)(.*)$/i, '$1 $3$4 $2');
    // English question auxiliary: "Do you want…?" — 'do' is not the verb 하다
    if(out.question) out.text = out.text.replace(/^\s*(do|does|did)\s+(?=\w)/i, '');
    // "datorită prietenului meu" / "din cauza ploii" / "thanks to you" → N 덕분에 / N 때문에
    f = /\b(datorita|multumita|thanks to|din cauza|because of|due to)\s+(?!ca\b|that\b)((?:the |a |an |my |your |our |his |her )?[a-z-]+(?: (?:meu|mea|mei|mele|tau|ta|lui|ei|nostru|noastre))?)\s*,?/.exec(foldKeep(out.text));
    if(f){
      var nb = nounKoBase(f[2]);
      if(nb != null){
        var thanks = /^(datorita|multumita|thanks to)$/.test(f[1]);
        out.prefix = (nb ? nb + ' ' : '') + (thanks ? '덕분에' : '때문에');
        // the phrase as written, and in the other language from the noun's own label
        var srcPh = out.text.slice(f.index, f.index + f[0].length).replace(/[\s,]+$/, '').trim();
        srcPh = srcPh.charAt(0).toLowerCase() + srcPh.slice(1);
        var isEn = /^(thanks to|because of|due to)$/.test(f[1]);
        var PRON_RO_EN = { tie:'you', mie:'me', lui:'him', ei:'her', noua:'us', voua:'you', lor:'them' };
        var PRON_EN_RO = { you:'ție', me:'mie', him:'lui', her:'ei', us:'nouă', them:'lor' };
        var nWord = normalizeLatin(f[2]).replace(/^(the|a|an|my|your|our|his|her) (?=\S)/, '').replace(/ (meu|mea|mei|mele|tau|ta|lui|ei|nostru|noastre)$/, '');
        var mine = /^my | (meu|mea|mei|mele)$/.test(normalizeLatin(f[2]));
        var nHit = PRON_RO_EN[nWord] || PRON_EN_RO[nWord] ? null : (findBestMatch('topic', nWord) || findBestMatch('object1', nWord));
        var nRaw = nHit ? (nHit.raw && typeof nHit.raw === 'object' ? nHit.raw : nHit) : null;
        // the few causes outside the vocabulary (NOUN_EXTRA), in the genitive / with an article
        var EXTRA_TR = { '비':['ploii','the rain'], '눈':['zăpezii','the snow'], '교통 체증':['traficului','the traffic'],
                         '날씨':['vremii','the weather'], '병':['bolii','the illness'], '감기':['răcelii','the cold'] };
        var other;
        if(EXTRA_TR[nb]){
          other = isEn ? (thanks ? 'datorită ' : 'din cauza ') + EXTRA_TR[nb][0] : (thanks ? 'thanks to ' : 'because of ') + EXTRA_TR[nb][1];
        } else if(isEn){
          other = PRON_EN_RO[nWord] ? PRON_EN_RO[nWord]
                : nRaw && nRaw.ro_dat ? nRaw.ro_dat + (mine ? (nRaw.g === 'f' ? ' mele' : ' meu') : '') : '';
          other = other ? (thanks ? 'datorită ' : 'din cauza ') + other : srcPh;
        } else {
          var enN = PRON_RO_EN[nWord] || (nHit ? trClean(nHit.en).replace(/^(the|a|an|my) /, '') : '');
          if(enN && !PRON_RO_EN[nWord]) enN = (mine || /^(mom|dad|older|younger|parents)/.test(enN) ? 'my ' : 'the ') + enN;
          other = enN ? (thanks ? 'thanks to ' : 'because of ') + enN : srcPh;
        }
        out.prefixItem = { type:'cause', pos:'prefix', ko: out.prefix, ro: isEn ? other : srcPh, en: isEn ? srcPh : other };
        out.text = out.text.slice(0, f.index) + ' ' + out.text.slice(f.index + f[0].length);
      }
    }
    // "de teamă să nu X" → X-(으)ㄹ까 봐 (handled as a clause connector)
    r = cutFolded(out.text, /\b(?:de teama|de frica|ca nu cumva)(?: ca)? sa nu\b|\bfor fear(?: that)?\b|\bin case\b/, ' xfearx ');
    if(r) out.text = r.text;
    // "am fost în Coreea" = went there → parse as a motion verb
    r = cutFolded(out.text, /\b(am|ai|a|ati|au) fost ((?:vreodata |o data |deja )?(?:in|la))\b/, null);
    if(r) out.text = out.text.slice(0, r.m.index) + r.m[1] + ' mers ' + r.m[2] + out.text.slice(r.m.index + r.m[0].length);
    r = cutFolded(out.text, /\b(?:have|has) been to\b/, ' went to ');
    if(r) out.text = r.text;
    // experience: "n-am mâncat niciodată" / "am fost o dată"
    var fl = foldKeep(out.text);
    if(/\b(niciodata|never)\b/.test(fl)){
      var stripped = out.text;
      r = cutFolded(stripped, /\b(?:niciodata|never)\b/, ' '); if(r) stripped = r.text;
      r = cutFolded(stripped, /(^|\s)n-(?=(am|ai|a|au|ati)\b)/, ' '); if(r) stripped = r.text;
      r = cutFolded(stripped, /\bnu (?=(am|ai|a|au|ati)\b)/, ''); if(r) stripped = r.text;
      r = cutFolded(stripped, /\b(?:have|has)\s+/, ''); if(r) stripped = r.text;
      if(detectTenseFromText(stripped) === 'past'){ out.text = stripped; out.frame = 'tense_exp_no'; }
    } else if(/\b(o data|vreodata|ever|de doua ori|de multe ori)\b/.test(fl)){
      var st2 = out.text;
      r = cutFolded(st2, /\b(?:o data|vreodata|ever|de doua ori|de multe ori)\b/, ' '); if(r) st2 = r.text;
      if(detectTenseFromText(st2) === 'past'){ out.text = st2; out.frame = 'tense_exp_yes'; }
    }
    // modal / quotative frames — first match wins
    if(!out.frame){
      for(var i = 0; i < GRAMMAR_FRAMES.length; i++){
        var G = GRAMMAR_FRAMES[i];
        if(G.unless && G.unless.test(foldKeep(out.text))) continue;
        r = cutFolded(out.text, G.re, ' ');
        if(!r) continue;
        if(!hasVerbLike(r.text)) continue;   // nothing left to apply it to
        out.text = r.text;
        out.frame = G.t;
        // "mama mi-a zis să mănânc" / "told me to": who was told
        if(G.t === 'tense_said_cmd'){
          var CMD_TO = { mi:'저', 'm-a':'저', me:'저', ne:'우리', us:'우리', ti:'너', you:'너', 'v-a':'여러분', i:'그', him:'그', her:'그녀' };
          var ct = /\b(mi|ne|ti|i)-a|\b(m-a) rugat|\b(?:told|asked) (me|us|him|her|you)\b|\b(v-a)\b/.exec(r.m[0]);
          if(ct) out.cmdTo = CMD_TO[ct[1] || ct[2] || ct[3] || ct[4]] || null;
        }
        if(G.cause){
          var CAUSE_OBJ = { 'm-a':'저를', 'm-au':'저를', ma:'저를', me:'저를', 'te-a':'너를', 'te-au':'너를', te:'너를', you:'너를',
                            'ne-a':'우리를', 'ne-au':'우리를', ne:'우리를', us:'우리를', 'v-a':'여러분을', 'v-au':'여러분을', va:'여러분을',
                            'l-a':'그를', 'l-au':'그를', il:'그를', him:'그를', 'i-a':'그들을', 'i-au':'그들을', ii:'그들을', them:'그들을', o:'그녀를', her:'그녀를', le:'그들을' };
          out.causeObj = CAUSE_OBJ[r.m[1] || r.m[2] || r.m[3]] || '';
        }
        if(G.adj){
          var GI_ADJ = { greu:'어렵다', dificil:'어렵다', hard:'어렵다', difficult:'어렵다', usor:'쉽다', simplu:'쉽다', easy:'쉽다',
                         important:'중요하다', interesant:'재미있다', interesting:'재미있다', placut:'즐겁다', distractiv:'재미있다', fun:'재미있다',
                         bine:'좋다', good:'좋다', obositor:'힘들다', periculos:'위험하다', dangerous:'위험하다' };
          out.giAdj = GI_ADJ[r.m[1] || r.m[2]] || '어렵다';
          out.giPast = /\b(a fost|era|was)\b/.test(r.m[0]);
        }
        if(G.subj){
          var pron = (r.m[0].split(' ')[0] || '');
          if(FRAME_SUBJ[pron]) out.text = FRAME_SUBJ[pron] + ' ' + out.text;
        }
        break;
      }
    }
    // "Îmi place muzica" (no verb after it) → eu + place
    r = cutFolded(out.text, /\b(imi|iti|ne) (place|plac|placea)\b/, null);
    if(r && !/\b(eu|tu|noi|voi|ei)\s*$/.test(foldKeep(out.text.slice(0, r.m.index)))) out.text = out.text.slice(0, r.m.index) + FRAME_SUBJ[r.m[1]] + ' ' + out.text.slice(r.m.index);
    fl = foldKeep(out.text);
    // prohibition: "Nu mâncați aici", "Nu fuma!", "Don't eat here"
    if(!out.frame && !out.question){
      var dm = /^\s*nu\s+(?:(?:ma|te|ne|va|il|o|le|ii|mi|ti)\s+)?([a-z-]+)/.exec(fl);
      if(dm && findBestMatch('verb', dm[1] + ' ' + (fl.slice(dm.index + dm[0].length).trim().split(/\s+/).slice(0, 2).join(' '))) && (/ti$/.test(dm[1]) || out.exclaim)){
        out.text = out.text.replace(/^\s*\S+\s+/, ''); out.frame = 'tense_dont';
      } else if(/^\s*(?:don'?t|do not)\s+\w/.test(fl)){
        out.text = out.text.replace(/^\s*(?:don['’]?t|do not)\s+/i, ''); out.frame = 'tense_dont';
      }
    }
    // imperative: "Vino la mine", "Citește!", "Come here"
    if(!out.frame && !out.question && (IMP_WORDS.test(fl) || IMP_EN.test(fl) || (out.exclaim && !/\b(eu|tu|el|ea|noi|voi|ei|ele|i|we|he|she|they)\b/.test(fl)))){
      out.frame = 'tense_imp';
    }
    return out;
  }

  // ---- relative clauses ("care / pe care / unde / who / that / which") --------
  // "Prietenul care locuiește în Seul vine mâine" → 서울에 사는 친구는 내일 와요.
  // The relative clause is cut out of the sentence and turned into a Korean
  // attributive (-는 / -(으)ㄴ / -(으)ㄹ) placed before its head noun.
  var REL_CLITIC = { l:1, o:1, i:1, mi:1, ti:1, ne:1, va:1, le:1, s:1, m:1, n:1, se:1, ma:1, te:1, il:1, si:1 };
  var REL_AUX = { am:1, ai:1, a:1, au:1, ati:1, are:1, avem:1, aveti:1, este:1, e:1, sunt:1, suntem:1, sunteti:1, fost:1,
                  is:1, was:1, were:1, has:1, have:1, had:1, will:1, vor:1, va:1, voi:1, vom:1, o:1, sa:1, me:1, you:1 };
  var REL_COPULA = { este:1, e:1, sunt:1, is:1, was:1, are:1, were:1, fost:1 };
  var NOM_PRONOUN = { '저는':'제가', '나는':'내가', '너는':'네가', '우리는':'우리가', '그는':'그가', '그녀는':'그녀가', '그들은':'그들이' };
  function koBase(ko){ return String(ko || '').replace(/(에서|에|으로|로|을|를|이|가|은|는)$/, ''); }
  function koNom(ko){
    if(NOM_PRONOUN[ko]) return NOM_PRONOUN[ko];
    var b = koBase(ko);
    return b + ((window.Conjugation && window.Conjugation.hasBatchim(b)) ? '이' : '가');
  }
  function relTokens(str){
    var out = [], re = /[^\s,.;!?]+/g, m;
    while((m = re.exec(str))) out.push({ w: m[0], i: m.index });
    return out;
  }
  // the verb a single token stands for, ignoring clitics and auxiliaries ("l-am" → none, "dat-o" → 주다)
  function tokenVerb(w){
    var pieces = normalizeLatin(w).split(' ').filter(function(p){ return p && !REL_CLITIC[p] && !REL_AUX[p]; });
    return pieces.length ? findBestMatch('verb', pieces.join(' ')) : null;
  }
  function nounItem(w){
    var n = normalizeLatin(w);
    if(!n || REL_AUX[n] || REL_CLITIC[n]) return null;
    var it = findBestMatch('topic', n) || findBestMatch('object1', n) || findBestMatch('departure', n);
    if(!it){ var lh = lexLookup(n); if(lh && (lh.kind === 'noun' || lh.kind === 'place')) it = lexItem(lh, lh.kind === 'place' ? 'departure' : 'object1'); }
    return it && it.ko && !NOM_PRONOUN[it.ko] ? it : null;
  }
  function relAttr(verb, tense, neg){
    var conj = window.Conjugation, v = verb.ko;
    if(neg && (/있다$/.test(v) || v === '알다')){ v = v === '알다' ? '모르다' : v.replace(/있다$/, '없다'); neg = false; verb = { ko: v, ro: verb.ro }; }
    var desc = isDescriptive(verb) && !/(있|없)다$/.test(v);
    if(neg) return conj.stem(v) + (tense === 'past' ? '지 않은' : desc ? '지 않은' : '지 않는');
    if(tense === 'past')   return (desc || /(있|없)다$/.test(v)) ? pastStem(v) + '던' : pastAttr(v);
    if(tense === 'future') return futAttr(v);
    if(desc) return conj.adjAttributive(v);
    return conj.dropRieul(conj.stem(v)) + '는';
  }
  function speakLang(v){ var c = {}; for(var k in v) c[k] = v[k]; c.ko = '하다'; c.forms = null; return c; }
  // implied subject of a Romanian relative from the verb's person: "pe care o citesc" → 제가
  function personSubject(rn){
    var toks = rn.trim().split(' ');
    for(var i = 0; i < toks.length; i++){
      var w = toks[i];
      if(REL_CLITIC[w] && w !== 'a') continue;
      if(/^(am|ai|a|au|ati)$/.test(w) && toks[i + 1] && tokenVerb(toks[i + 1])){
        if(w === 'am') return toks[i - 1] === 'ne' ? '우리가' : '제가';
        return { ai: '네가', ati: '여러분이' }[w] || null;
      }
      if(tokenVerb(w)){
        if(w.length > 3 && /(am|em|im|um)$/.test(w)) return '우리가';
        if(/esti$/.test(w)) return '네가';
        if(/(ati|eti|iti|ati)$/.test(w)) return '여러분이';
        if(/i$/.test(w))  return '네가';
        if(/[aei]$/.test(w) || /a$/.test(w)) return null;
        return '제가';
      }
    }
    return null;
  }
  var _lastRel = null;
  function buildRelKo(relText, head, marker){
    _lastRel = null;
    // a relative inside the relative ("cartea pe care am scris-o" inside "omul care a citit …")
    var inner = extractRelatives(relText);
    relText = inner.text;
    // a nested relative we could not read: drop it rather than let its verb take over
    var _nm = /\s(pe care|care|unde|who|whom|which|that|where)\s/.exec(' ' + foldKeep(relText) + ' ');
    if(_nm) relText = relText.slice(0, Math.max(0, _nm.index - 1));
    var withMods = function(it){
      if(!it || !it.ko) return it;
      for(var mi = 0; mi < inner.mods.length; mi++){
        if(koBase(it.ko) === inner.mods[mi].base){ var c = {}; for(var k in it) c[k] = it[k]; c.ko = inner.mods[mi].ko + ' ' + it.ko; return c; }
      }
      return it;
    };
    var rn = ' ' + normalizeLatin(relText) + ' ';
    var hb = koBase(head.ko);
    var other = function(it){ return it && it.ko && koBase(it.ko) !== hb ? it : null; };
    var langa = /\b(langa|next to|near|aproape de)\b/.test(rn);
    var verb = findBestMatch('verb', rn.replace(/\b(langa|aproape de)\b/g, ' '));
    // the relative's own verb is the first one in it ("care cântă melodia…")
    var _rt = rn.trim().split(' ');
    for(var ri = 0; ri < _rt.length; ri++){
      var fv = tokenVerb(_rt[ri]);
      if(fv){ if(verb && verb.ko !== fv.ko && verb.ko.slice(-fv.ko.length) !== fv.ko && fv.ko.slice(-verb.ko.length) !== verb.ko) verb = fv; break; }
    }
    if(!verb){
      var _uv = uncoveredTokens(rn.trim());
      for(var vi = 0; vi < _uv.length && !verb; vi++){ var lv = lexLookup(_uv[vi].t); if(lv && (lv.kind === 'verb' || lv.kind === 'adj')) verb = lexItem(lv, 'verb'); }
    }
    if((!verb || verb.ko === '있다') && (/\b(este|e|is|are|sunt|se afla)\b/.test(rn) || langa)) verb = { ko: '있다', ro: 'a fi', en: 'to be' };
    if(!verb || !verb.ko || verb.isPhrase) return null;
    var tense = detectTenseFromText(rn);
    var neg = /\bnu\b|\b(don t|doesn t|didn t|not)\b|(^| )n (am|ai|a|au)\b/.test(rn);
    if(tense === 'neg' || tense === 'cannot' || tense === 'notwish' || tense === 'mustnot'){
      tense = detectTenseFromText(rn.replace(/\bnu\b|\bnot\b/g, ' '));
    }
    if(verb.ko === '말하다' && /(어|어를) /.test((findBestMatch('object1', rn) || {}).ko + ' ')) verb = speakLang(verb);
    var subj = other(findBestMatch('topic', rn));
    var time = findBestMatch('time', rn);
    var loc  = other(findBestMatch('departure', rn));
    var obj  = other(findBestMatch('object1', rn));
    if(!obj){   // dictionary fallback for the relative's object
      var _ut = uncoveredTokens(rn.trim());
      for(var ui = 0; ui < _ut.length && !obj; ui++){ var lh = lexLookup(_ut[ui].t); if(lh && lh.kind === 'noun') obj = other(lexItem(lh, 'object1')); }
    }
    if(obj && verb.ko.indexOf(' ') > 0 && verb.ko.indexOf(koBase(obj.ko)) === 0) obj = null;
    if(obj && subj && koBase(obj.ko) === koBase(subj.ko)) obj = null;
    if(loc && obj && koBase(loc.ko) === koBase(obj.ko)) obj = null;
    var parts = [];
    subj = withMods(subj); loc = withMods(loc); obj = withMods(obj);
    var ps = null;
    if(subj) parts.push(subj.ko.indexOf(' ') > 0 ? subj.ko.replace(/(\S+)$/, function(w){ return koNom(w); }) : koNom(subj.ko));
    else if(marker && marker !== 'care' && marker !== 'who'){ ps = personSubject(rn); if(ps) parts.push(ps); }
    // what the relative says, for translating it into the other language (trRelative)
    // to whom: "pe care mi-ai dat-o", "that you gave me"
    var _dm = / (mi|ti|i|ne|v|le) (?:ai|a|am|ati|au|aveti) /.exec(rn) || / (?:gave|give|gives|sent|send|told|showed|bought) (me|you|him|her|us|them) /.exec(rn);
    var datK = _dm ? { mi:0, me:0, ti:1, you:1, i:2, him:2, her:2, ne:3, us:3, v:4, le:5, them:5 }[_dm[1]] : null;
    _lastRel = { verb: verb, tense: tense, neg: neg, subj: subj, time: time, loc: loc, obj: obj, langa: langa, datK: datK, datFem: _dm && _dm[1] === 'her',
                 personK: ps ? ({ '제가':0, '내가':0, '네가':1, '우리가':3, '여러분이':4 }[ps]) : null,
                 kind: /^(unde|where)$/.test(marker) ? 'place' : /^(pe care|whom)$/.test(marker) || subj || ps ? 'obj' : 'subj' };
    if(time && time.ko) parts.push(time.ko);
    if(loc){
      var toEi = { '가다':1, '오다':1, '있다':1, '살다':1, '도착하다':1 };
      parts.push(langa ? koBase(loc.ko) + ' 옆에' : (toEi[verb.ko] ? loc.ko.replace(/에서$/, '에') : loc.ko));
    }
    if(obj) parts.push(verb.ko === '있다' ? koNom(obj.ko) : obj.ko);
    parts.push(relAttr(verb, tense, neg));
    return parts.join(' ');
  }
  function extractRelatives(raw){
    var res = { text: raw, mods: [] };
    for(var guard = 0; guard < 3; guard++){
      var F = foldKeep(res.text);
      var mk = /\s(pe care|care|unde|who|whom|which|that|where)\s/.exec(F);
      if(!mk) break;
      var preToks = relTokens(F.slice(0, mk.index));
      if(!preToks.length) break;
      // "Sora mea, care…" — skip the possessive to reach the noun
      var hIdx = preToks.length - 1;
      if(hIdx > 0 && /^(meu|mea|mei|mele|tau|ta|tai|tale|lui|ei|lor|nostru|noastra|noastre|vostru|voastra)$/.test(normalizeLatin(preToks[hIdx].w))) hIdx--;
      var head = nounItem(preToks[hIdx].w);
      if(!head) break;
      var afterStart = mk.index + mk[0].length;
      var afterF = F.slice(afterStart);
      var toks = relTokens(afterF);
      var preHasVerb = preToks.slice(0, -1).some(function(t){ return !!findBestMatch('verb', normalizeLatin(t.w)); });
      var endIdx = afterF.length;
      var comma = afterF.indexOf(',');
      if(preHasVerb){
        // main verb already said: the relative runs to the next comma / connector
        var stop = /,|\s(si|dar|iar|and|but|apoi|then)\s/.exec(' ' + afterF);
        if(stop) endIdx = Math.max(0, stop.index - 1);
      } else {
        // relative sits inside the subject: it ends where the main predicate starts
        var firstV = null, pendingInner = 0;
        for(var k = 0; k < toks.length; k++){
          var nw = normalizeLatin(toks[k].w);
          if(/^(care|who|which|that|unde|where|whom)$/.test(nw)){ pendingInner++; continue; }
          if(k > 0 && REL_COPULA[nw]){
            var st = toks[k].i;
            if(nw === 'fost' && /^(a|au|am|ai)$/.test(normalizeLatin(toks[k - 1].w))) st = toks[k - 1].i;
            endIdx = st; break;
          }
          var tv = tokenVerb(toks[k].w);
          if(tv && pendingInner > 0){ pendingInner--; continue; }   // that verb belongs to the nested relative
          if(tv){
            if(!firstV) firstV = tv;
            else if(tv.ko !== firstV.ko){ endIdx = toks[k].i; break; }
          }
        }
        if(comma !== -1 && comma < endIdx) endIdx = comma;
      }
      var relText = afterF.slice(0, endIdx);
      var relKo = relText.trim() ? buildRelKo(relText, head, mk[1]) : null;
      if(!relKo) break;
      // the relative as written, so the card and the translation keep it ("prietenul care locuiește în Seul")
      var relSrc = res.text.substr(mk.index + 1, mk[1].length) + ' ' + res.text.slice(afterStart, afterStart + endIdx).trim();
      var rest = res.text.slice(afterStart + endIdx).replace(/^\s*,\s*/, ' ');
      res.text = res.text.slice(0, mk.index) + ' ' + rest;
      var headSrc = res.text.substr(preToks[hIdx].i, preToks[hIdx].w.length);
      res.mods.push({ base: koBase(head.ko), ko: relKo, rel: _lastRel, headItem: head, src: relSrc.replace(/[\s,]+$/, ''), head: headSrc, en: /^(who|whom|which|that|where)$/.test(mk[1]) });
    }
    return res;
  }

  // ---- fallback lexicon: data/vocab-korean.json (the app's 1500-word dictionary) ----
  // Words the builder's own vocabulary doesn't know are looked up here, so
  // "Cumpăr o umbrelă" still finds 우산. Whatever is still unknown is listed
  // under the sentence instead of being silently dropped.
  var LEX = null;
  var ALIAS_SET = null;
  var FUNC_WORDS = {};
  ('eu tu el ea noi voi ei ele ma te se ne va il o ii le mi ti si sau dar iar ca sa de la in pe cu din pentru prin spre fara dupa pana langa ' +
   'un una niste acest aceasta acel aceea acesta asta ala foarte mai tot toti toate nu da cel cea cei cele al ai ale lui lor meu mea mei mele tau ta ' +
   'sau ori nici fie deja inca doar chiar cam prea cat cate care ce cine unde cum cand daca deci apoi atunci acum aici acolo am ai a au ati are avem aveti ' +
   'sunt esti e este suntem sunteti fost fi fie vom vor voi vei the an to of on at for with and or but is are was were be been being do does did ' +
   'i you he she we they it my your his her our their me him them us this that these those not very so too also just only then there here have has had ' +
   'will would can could should must may might as by from into about than what who whom which where when why how some any all no yes xfearx xcommax ' +
   'ora ore ani anul luni luna zile zi saptamani saptamana jumatate clock year years month months day days week weeks hour hours').split(' ')
    .forEach(function(w){ if(w) FUNC_WORDS[w] = 1; });

  function buildAliasSet(){
    ALIAS_SET = {};
    Object.keys(DATA || {}).forEach(function(b){
      (Array.isArray(DATA[b]) ? DATA[b] : []).forEach(function(it){
        if(!it || it.fromDictionary) return;
        [it.ko, it.ro, it.en].concat(it.aliases || []).forEach(function(a){
          var n = normalizeLatin(a); if(n) ALIAS_SET[n] = 1;
        });
      });
    });
  }
  var NOUN_ENDS = ['urilor','urile','ului','ilor','elor','lor','uri','ele','ile','ul','le','ua','ea','ii','a','i','e','s','es'];
  function buildLex(list){
    var lx = { word: {}, stems: [] };
    (list || []).forEach(function(e){
      if(!e || !e.ko) return;
      var cats = e.categories || [];
      if(cats.indexOf('grammar') !== -1 || cats.indexOf('connectors') !== -1 || /^-/.test(e.ko)) return;
      var kind = cats.indexOf('verbs') !== -1 ? 'verb' : cats.indexOf('adjectives') !== -1 ? 'adj'
               : (cats.indexOf('adverbs') !== -1 || cats.indexOf('modifiers') !== -1) ? 'adv'
               : cats.indexOf('times') !== -1 ? 'time' : cats.indexOf('places') !== -1 ? 'place' : 'noun';
      if(kind === 'adj' && /색$/.test(e.ko)) kind = 'color';
      if((kind === 'verb' || kind === 'adj') && !/다$/.test(e.ko)) kind = 'noun';
      [['ro', e.ro], ['en', e.en]].forEach(function(pair){
        String(pair[1] || '').replace(/\([^)]*\)/g, ' ').split(/[\/,;]/).forEach(function(g){
          var n = normalizeLatin(g);
          if(kind === 'verb' || kind === 'adj') n = n.replace(/^(a fi|a se|a|to be|to)\s+/, '');
          if(!n || n.length < 3) return;
          var entry = { e: e, kind: kind };
          if(!lx.word[n]) lx.word[n] = entry;
          if(pair[0] === 'ro' && n.indexOf(' ') === -1 && (kind === 'adj' || kind === 'color')){
            roAdjForms(n).forEach(function(f){ if(f.length >= 3 && !lx.word[f]) lx.word[f] = entry; });
          }
          if(pair[0] === 'ro' && n.indexOf(' ') === -1){
            if(kind === 'verb'){
              var st = n.replace(/(ea|a|i|e|u)$/, '');
              if(st.length >= 3) roStemVariants(st).forEach(function(v){ lx.stems.push({ stem: v, entry: entry }); });
            } else if((kind === 'adj' || kind === 'color') && n.length >= 4){
              lx.stems.push({ stem: n.replace(/(os|oasa|a|e|i|u)$/, ''), entry: entry });
            }
          }
        });
      });
    });
    lx.stems.sort(function(a, b){ return b.stem.length - a.stem.length; });
    return lx;
  }
  // Romanian adjective forms from the masculine singular: negru → neagră, negri, negre;
  // frumos → frumoasă…; roșu → roșie, roșii; nou → nouă, noi; verde → verzi
  function roAdjForms(b){
    var out = [];
    var alt = function(st){   // e→ea / o→oa in the last syllable (negr → neagr, mort → moart)
      var m = /^(.*)([eo])([^aeiou]*)$/.exec(st);
      return m ? m[1] + (m[2] === 'e' ? 'ea' : 'oa') + m[3] : null;
    };
    var add = function(){ for(var i = 0; i < arguments.length; i++) if(arguments[i]) out.push(arguments[i]); };
    if(/os$/.test(b)){ var r = b.slice(0, -2); add(r + 'oasa', r + 'oase', r + 'osi'); }
    else if(/or$/.test(b)){ var r2 = b.slice(0, -2); add(r2 + 'oara', r2 + 'oare', r2 + 'ori'); }
    else if(/(s|i)u$/.test(b)){ var r3 = b.slice(0, -1); add(r3 + 'ie', r3 + 'ii'); }
    else if(/ou$/.test(b)){ var r4 = b.slice(0, -1); add(r4 + 'ua', r4 + 'i'); }
    else if(/u$/.test(b)){ var r5 = b.slice(0, -1); var a5 = alt(r5); add(r5 + 'a', a5 && a5 + 'a', r5 + 'i', r5 + 'e'); }
    else if(/e$/.test(b)){ var r6 = b.slice(0, -1); add(r6 + 'i', r6.replace(/d$/, 'z') + 'i', r6.replace(/t$/, 't') + 'i'); }
    else if(/[^aeiou]$/.test(b)){ var a7 = alt(b); add(b + 'a', a7 && a7 + 'a', b + 'i', b + 'e', b.replace(/t$/, 't') + 'i'); }
    return out;
  }
  // verb stem with the usual vowel alternations: purt → port/poart, juc → joc/joac, ved → vad
  function roStemVariants(st){
    var out = [st];
    var m = /^(.*)([aeiou])([^aeiou]*)$/.exec(st);
    if(m){
      if(m[2] === 'u') out.push(m[1] + 'o' + m[3], m[1] + 'oa' + m[3]);
      if(m[2] === 'o') out.push(m[1] + 'oa' + m[3]);
      if(m[2] === 'e') out.push(m[1] + 'ea' + m[3], m[1] + 'a' + m[3]);
    }
    return out.filter(function(v){ return v.length >= 3; });
  }
  function lexLookup(tok){
    if(!LEX || !tok || tok.length < 3 || FUNC_WORDS[tok]) return null;
    if(LEX.word[tok]) return LEX.word[tok];
    // feminine job nouns: doctoriță → doctor, profesoară → profesor
    var fem = tok.replace(/(ita|ite|itei)$/, '').replace(/oara$|oare$|oarei$/, 'or');
    if(fem !== tok && fem.length >= 3 && LEX.word[fem] && LEX.word[fem].kind !== 'verb') return LEX.word[fem];
    for(var i = 0; i < NOUN_ENDS.length; i++){
      var en = NOUN_ENDS[i];
      if(tok.length - en.length < 3 || tok.slice(-en.length) !== en) continue;
      var b = tok.slice(0, -en.length);
      var tries = [b, b + 'a', b + 'e', b + 'u', b + 'i'];
      for(var j = 0; j < tries.length; j++){
        var hit = LEX.word[tries[j]];
        if(hit && (hit.kind === 'noun' || hit.kind === 'place')) return hit;
      }
    }
    for(var k = 0; k < LEX.stems.length; k++){
      var s = LEX.stems[k];
      if(tok.indexOf(s.stem) === 0 && tok.length - s.stem.length <= 4) return s.entry;
    }
    return null;
  }
  // adjective / colour reading of a word ("roșie" after a noun = red, not tomato)
  // a folded token back as the learner wrote it ("portocalie" → "portocalie", "rosie" → "roșie")
  function origWord(tok){
    var words = String(state.text || '').split(/\s+/);
    for(var i = 0; i < words.length; i++){
      var w = words[i].replace(/^[^\wăâîșşțţ]+|[^\wăâîșşțţ-]+$/gi, '');
      if(normalizeLatin(w) === tok) return w.toLowerCase();
    }
    return tok;
  }
  function lexAdj(tok){
    if(!LEX || !tok || FUNC_WORDS[tok]) return null;
    var w = LEX.word[tok];
    if(w && (w.kind === 'adj' || w.kind === 'color')) return w;
    for(var k = 0; k < LEX.stems.length; k++){
      var s = LEX.stems[k];
      if((s.entry.kind === 'adj' || s.entry.kind === 'color') && tok.indexOf(s.stem) === 0 && tok.length - s.stem.length <= 4) return s.entry;
    }
    return null;
  }
  function adjModifierKo(hit){
    var ko = hit.e.ko;
    if(hit.kind === 'color') return /^(빨간|노란|파란|하얀|까만|검은)색$/.test(ko) ? ko.slice(0, -1) : ko;
    return window.Conjugation ? window.Conjugation.adjAttributive(ko) : ko;
  }
  // tokens of a clause that no builder vocabulary entry covers
  function uncoveredTokens(text){
    if(!ALIAS_SET) buildAliasSet();
    var toks = String(text || '').split(' ').filter(Boolean);
    var cov = toks.map(function(){ return false; });
    for(var i = 0; i < toks.length; i++){
      for(var len = Math.min(6, toks.length - i); len >= 1; len--){
        if(ALIAS_SET[toks.slice(i, i + len).join(' ')]){ for(var c = i; c < i + len; c++) cov[c] = true; break; }
      }
    }
    var out = [];
    toks.forEach(function(t, idx){
      if(!cov[idx] && !FUNC_WORDS[t] && t.length >= 3 && !/^\d+$/.test(t) && !NUM_WORDS[t]) out.push({ t: t, prev: toks[idx - 1] || '', prevCovered: idx > 0 && cov[idx - 1] });
    });
    return out;
  }
  function lexItem(hit, field){
    var e = hit.e, ko = e.ko;
    var hb = window.Conjugation && window.Conjugation.hasBatchim(ko);
    if(field === 'object1')   ko = ko + (hb ? '을' : '를');
    if(field === 'departure') ko = ko + '에서';
    if(field === 'time')      ko = /(에|에는)$/.test(ko) ? ko : ko + '에';
    return { key: field, kind: field, ko: ko, ro: e.ro, en: e.en, fromLexicon: true, aliases: [] };
  }

  function mergeAppDictionary(list){
    if(!Array.isArray(list) || !DATA) return;
    var known = {};
    ['subject','object','location','time','description','verb'].forEach(function(b){
      (DATA[b] || []).forEach(function(it){ if(it && it.ko){ known[it.ko] = 1; known[koBase(it.ko)] = 1; } });
    });
    var glossAliases = function(e, isVerb){
      var out = [];
      [e.ro, e.en].forEach(function(g){
        String(g || '').replace(/\([^)]*\)/g, ' ').split(/[\/,;]/).forEach(function(p){
          var n = normalizeLatin(p);
          if(isVerb) n = n.replace(/^(a fi|a se|a|to be|to)\s+/, '');
          if(n && n.length >= 3 && !FUNC_WORDS[n] && out.indexOf(n) === -1) out.push(n);
        });
      });
      return out;
    };
    var NO_EI = /^(오늘|내일|어제|지금|매일|매주|매달|매년|요즘|항상|가끔|자주)$/;
    list.forEach(function(e){
      if(!e || !e.ko || /^-/.test(e.ko) || known[e.ko]) return;
      var c = e.categories || [];
      if(c.indexOf('grammar') !== -1 || c.indexOf('connectors') !== -1) return;
      var hb = window.Conjugation && window.Conjugation.hasBatchim(e.ko);
      var isV = /다$/.test(e.ko) && (c.indexOf('verbs') !== -1 || c.indexOf('adjectives') !== -1);
      var item = { ko: e.ko, ro: e.ro, en: e.en, aliases: glossAliases(e, isV), fromDictionary: true };
      if(isV){ item.ro = /^a /.test(e.ro) ? e.ro : (c.indexOf('adjectives') !== -1 ? 'a fi ' : 'a ') + e.ro; DATA.verb.push(item); }
      else if(c.indexOf('adverbs') !== -1 || c.indexOf('modifiers') !== -1) DATA.description.push(item);
      else if(c.indexOf('times') !== -1){ item.ko = NO_EI.test(e.ko) ? e.ko : e.ko + '에'; DATA.time.push(item); }
      else if(c.indexOf('places') !== -1){ item.ko = e.ko + '에서'; DATA.location.push(item); }
      else if(c.indexOf('subjects') !== -1 && c.indexOf('objects') === -1){ item.ko = e.ko + (hb ? '은' : '는'); DATA.subject.push(item); }
      else { item.ko = e.ko + (hb ? '을' : '를'); DATA.object.push(item); }
      known[e.ko] = 1;
    });
    ALIAS_SET = null;
    clearOptionCache();
  }

  function parseTextIntoClauses(){
    var raw = state.text || '';

    if(!String(raw).trim()){
      state.clauses = [makeEmptyLayoutClause()];
      state.detectedFields = [];
      renderAll();
      return;
    }

    var FR = applyGrammarFrames(raw);
    raw = FR.text;
    var REL = extractRelatives(raw);
    raw = REL.text;
    var _unknown = [];
    state.__question = FR.question;

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
                         : detectedTense === 'wish'       ? 'tense_wish'
                         : detectedTense === 'can'        ? 'tense_can'
                         : detectedTense === 'guess'      ? 'tense_guess'
                         : detectedTense === 'guess_now'  ? 'tense_guess_now'
                         : detectedTense === 'guess_past' ? 'tense_guess_past'
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
      // "mama e la muncă" — "a fi" + a place is a predicate too (→ 있다)
      if(!segVerb && /\b(e|este|sunt|esti|suntem|sunteti|era|erau)\b/.test(segText) && findBestMatch('departure', segText)) segVerb = { ko: '있다' };
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

    // "Merg la școală, dar mai întâi beau cafea" — the 'first' action goes first in Korean
    for(var fi = 1; fi < clauseData.length; fi++){
      if(/\b(mai intai|intai|in primul rand|first of all|first)\b/.test(clauseData[fi].text)){
        clauseData = clauseData.splice(fi).concat(clauseData);
        clauseData.forEach(function(c, i){ c.connKey = i < clauseData.length - 1 ? 'seq' : 'none'; c.inheritVerb = false; });
        break;
      }
    }

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
      // "Am o rochie albă" / "Cumpăr o mașină scumpă": an adjective right after a noun
      // is that noun's modifier (하얀 원피스) when the sentence has another verb
      var _adjMod = null;
      (function(){
        var tk = cd.text.split(' ');
        for(var a = 1; a < tk.length; a++){
          var av = findBestMatch('verb', tk[a]);
          if(!av || !isDescriptive(av) || av.ko.indexOf(' ') !== -1) continue;
          var nn = findBestMatch('object1', tk[a - 1]) || findBestMatch('topic', tk[a - 1]);
          if(!nn){ var lnn = lexLookup(tk[a - 1]); if(lnn && lnn.kind === 'noun') nn = lexItem(lnn, 'object1'); }
          if(!nn) continue;
          var rest = tk.slice(0, a).concat(tk.slice(a + 1)).join(' ');
          var other = findBestMatch('verb', rest);
          if(!other || other.ko === av.ko) continue;
          var dsc = findBestMatch('adverb', tk[a]);
          _adjMod = { noun: nn, ko: (dsc && dsc.modifiesSubject) ? null : window.Conjugation.adjAttributive(av.ko),
                      ro: origWord(tk[a]), en: trClean(av.en || '').replace(/^to be /, '') };
          verb = other;
          break;
        }
      })();

      // "mă uit după copii / după bunica / după câine" = look after → 돌보다, not 찾다 (search)
      if(verb && verb.ko === '찾다' && /\buit\w* dupa\b/.test(normalizeLatin(cd.text))){
        var _after = normalizeLatin(cd.text).split(/\bdupa\b/)[1] || '';
        var _who = findBestMatch('topic', _after);
        var _pet = /\b(caine|cainele|catel|pisica|pisicile|copii|copiii|copil|copilul|bebe|bebelus|bebelusul|animale)\b/.test(_after);
        if((_who && !/^(저는|나는|우리는)$/.test(_who.ko)) || _pet){
          var _care = null;
          (DATA.verb || []).forEach(function(v){ if(v.ko === '돌보다') _care = v; });
          if(_care) verb = _care;
          // the cared-for person is the object here, not the subject
          if(_who){
            subjects = subjects.filter(function(x){ return x.ko !== _who.ko; });
            var _wb = koBase(_who.ko);
            objects = [{ key:'object1', kind:'object1', ko: _wb + ((window.Conjugation && window.Conjugation.hasBatchim(_wb)) ? '을' : '를'), ro: _who.ro, en: _who.en }].concat(objects.filter(function(o){ return koBase(o.ko) !== _wb; }));
          }
        }
      }

      // "copilul / pisica / floarea a crescut" → 자라다 ; 늘다 stays for numbers, prices…
      if(verb && /^(늘다|늘어나다)$/.test(verb.ko) && /\b(cresc|cresti|creste|crestem|cresteti|cresc|crescut|grow|grows|grew|grown|growing)\b/.test(normalizeLatin(cd.text))){
        var _ct0 = normalizeLatin(cd.text);
        var _pick = /\b(pret|preturile|pretul|preturi|temperatura|chiria|costul|costurile|salariul|salariile)\b/.test(_ct0) ? '오르다'   // prices / temperature rise
                  : /\b(numar|numarul|populatia|vanzarile|vanzari|cifra)\b/.test(_ct0) ? null                                 // numbers increase: 늘다
                  : '자라다';                                                                                                      // children, plants, animals grow
        if(_pick){ (DATA.verb || []).forEach(function(v){ if(v.ko === _pick) verb = v; }); }
      }

      // English is S-V-O: a pronoun / person / name AFTER the verb is its object
      // ("I love you" → 너를 사랑해요, "I call my mom" → 엄마한테 전화해요, "I told Mihai" → 미하이한테 말했어요)
      if(verb && !isIntransitive(verb.ko) && !isDescriptive(verb) && !MOTION_NOOBJ[verb.ko]){
        var _etk = relTokens(cd.text), _evp = -1;
        for(var _ei = 0; _ei < _etk.length; _ei++){
          var _ew = normalizeLatin(_etk[_ei].w);
          var _ew2 = _ei + 1 < _etk.length ? _ew + ' ' + normalizeLatin(_etk[_ei + 1].w) : '';
          if(!/^(i|you|he|she|we|they|it|my|the|a|an|i m|im)$/.test(_ew) && (findBestMatch('verb', _ew) || (_ew2 && findBestMatch('verb', _ew2)))){
            _evp = (_ew2 && findBestMatch('verb', _ew2) && !findBestMatch('verb', _ew)) ? _ei + 1 : _ei; break;
          }
        }
        if(_evp >= 0){
          var _toW = /(^| )(전화하다|말하다|이야기하다|묻다|물어보다|주다|보내다|가르치다|선물하다)$/.test(verb.ko);
          var _part = function(base){ return base + (_toW ? '한테' : ((window.Conjugation && window.Conjugation.hasBatchim(base)) ? '을' : '를')); };
          var EN_OBJ = { me:'저', you:'너', him:'그', her:'그녀', us:'우리', them:'그들' };
          for(var _ej = _evp + 1; _ej < _etk.length; _ej++){
            var _ow = normalizeLatin(_etk[_ej].w);
            if(EN_OBJ[_ow] && !clause.__enObj){
              clause.__enObj = true;
              subjects = subjects.filter(function(x){ return !(_ow === 'you' && x.ko === '너는') && !(_ow === 'her' && x.ko === '그녀는'); });
              var _eko = _part(EN_OBJ[_ow]), _ep = koPronPerson(_eko);
              addExtra(clause, { type:'obj', pos:'prefix', ko:_eko, person:_ep.person, fem:_ep.fem, dat:_toW, src:_ow });
              break;
            }
            var _sp = findBestMatch('topic', _ow);
            if(_sp && subjects.some(function(x){ return x.ko === _sp.ko; }) && subjects[0].ko !== _sp.ko){
              var _sb = koBase(_sp.ko);
              subjects = subjects.filter(function(x){ return x.ko !== _sp.ko; });
              objects = [{ key:'object1', kind:'object1', ko: _part(_sb), ro: _sp.ro, en: _sp.en }].concat(objects.filter(function(o){ return koBase(o.ko) !== _sb; }));
              break;
            }
            var _capName = (String(raw).match(new RegExp('(?:^|\\s)(' + _ow.charAt(0).toUpperCase() + _ow.slice(1) + ')(?=[\\s.,!?]|$)')) || [])[1];
            if(_toW && _capName && !findBestMatch('topic', _ow) && !findBestMatch('object1', _ow)){
              objects = [{ key:'object1', kind:'object1', ko: hangulName(_capName) + '한테', ro: _capName, en: _capName }].concat(objects);
              break;
            }
          }
        }
      }

      // "te aștept / te iubesc / o ajut": a clitic right before a transitive verb is its object (너를 기다려요)
      if(verb && verb.ko !== '웃음거리로 만들다' && !objects.length && !/\bpe \S+/.test(normalizeLatin(cd.text)) && !isIntransitive(verb.ko) && !isDescriptive(verb) && !MOTION_NOOBJ[verb.ko]){
        var _ctx = ' ' + normalizeLatin(cd.text) + ' ';
        // only clitics that clearly mean a person: te / mă / ne, and „vă” only when written with ă
        // („va” is also the future auxiliary; „o / îl / le” are just as often „it / them” — Korean drops those)
        var _cm = /\s(te|ma|ne|va)\s+(\S+)/.exec(_ctx);
        if(_cm && _cm[1] === 'va' && !/(^|\s)vă\s/i.test(String(raw))) _cm = null;
        if(_cm && findBestMatch('verb', _cm[2]) && findBestMatch('verb', _cm[2]).ko === verb.ko &&
           !itemCands(verb).some(function(a){ return a.indexOf(_cm[1] + ' ') === 0; })){          // reflexive verbs keep their clitic
          var CLO = { te:'너', ma:'저', ne:'우리', va:'여러분', il:'그', o:'그녀', ii:'그들', le:'그들' };
          var _who2 = CLO[_cm[1]], _hb2 = window.Conjugation && window.Conjugation.hasBatchim(_who2);
          var _dat = /(^| )(전화하다|말하다|이야기하다|묻다|물어보다|주다|보내다|가르치다|선물하다)$/.test(verb.ko);
          var _cko = _who2 + (_dat ? '한테' : (_hb2 ? '을' : '를')), _cp = koPronPerson(_cko);
          addExtra(clause, { type:'obj', pos:'prefix', ko:_cko, person:_cp.person, fem:_cp.fem, dat:_dat });
        }
      }

      // "mă faci de râs" / "m-ai făcut de râs": the clitic says who → 저를 웃음거리로 만들어요
      if(verb && verb.ko === '웃음거리로 만들다'){
        var _cl = /(?:^|\s)(m-ai|m-a|m-ati|m-au|ma|te-am|te-a|te-au|te|ne-ai|ne-a|ne-au|ne|v-am|v-a|va|l-am|l-ai|l-a|il|o|i-am|i-a|ii)\s+(?:f|a f|am f|ai f|au f)/i.exec(' ' + foldKeep(raw));
        var CL_OBJ = { 'm-ai':'저를','m-a':'저를','m-ati':'저를','m-au':'저를','ma':'저를','te-am':'너를','te-a':'너를','te-au':'너를','te':'너를',
                       'ne-ai':'우리를','ne-a':'우리를','ne-au':'우리를','ne':'우리를','v-am':'여러분을','v-a':'여러분을','va':'여러분을',
                       'l-am':'그를','l-ai':'그를','l-a':'그를','il':'그를','o':'그녀를','i-am':'그들을','i-a':'그들을','ii':'그들을' };
        if(_cl && CL_OBJ[_cl[1]]){
          var _clp = koPronPerson(CL_OBJ[_cl[1]]);
          addExtra(clause, { type:'obj', pos:'prefix', ko:CL_OBJ[_cl[1]], person:_clp.person, fem:_clp.fem, dat:false });
        }
      }

      // "vorbesc coreeana" → 한국어를 해요 (with a language, 하다 is the natural verb)
      if(verb && verb.ko === '말하다' && objects[0] && /어를$/.test(objects[0].ko)) verb = speakLang(verb);
      // Inherit verb from previous clause when this segment had none explicitly
      // (e.g. "și seara la restaurant" after "dimineața merg la piață")
      if(!verb && cd.inheritVerb && ci > 0){
        verb = findBestMatch('verb', clauseData[ci - 1].text);
      }

      // words the builder vocabulary doesn't know → the app dictionary, else report them
      var _rawCaps = {};
      String(raw).split(/\s+/).forEach(function(w, wi){ if(wi > 0 && /^[A-ZĂÂÎȘŞȚŢ]/.test(w)) _rawCaps[normalizeLatin(w)] = 1; });
      var _nounMods = [], _colorPred = null;
      uncoveredTokens(cd.text).forEach(function(ut){
        var tok = ut.t;
        if(_rawCaps[tok]) return;                       // a name in mid-sentence
        // adjective right after a noun → modifier ("rochie roșie" → 빨간 원피스)
        var adj = lexAdj(tok);
        var prevNoun = ut.prev && !FUNC_WORDS[ut.prev] && (findBestMatch('object1', ut.prev) || findBestMatch('topic', ut.prev) || (lexLookup(ut.prev) && lexLookup(ut.prev).kind === 'noun'));
        if(adj && prevNoun){ _nounMods.push({ noun: ut.prev, ko: adjModifierKo(adj), ro: origWord(tok), en: trClean(adj.e.en || '') }); return; }
        // "un zmeu galben": the adjective belongs to a noun we don't know (reported below) — not a thing of its own
        if(adj && ut.prev && !ut.prevCovered && !FUNC_WORDS[ut.prev] && !lexLookup(ut.prev) && !/^(e|este|sunt|esti|suntem|sunteti|foarte|is|are|was|very|nu|fost)$/.test(ut.prev)) return;
        if(adj && !verb && /^(e|este|sunt|esti|suntem|sunteti|foarte|is|are|was|very|nu|fost)$/.test(ut.prev)){
          if(adj.kind === 'adj'){ verb = lexItem(adj, 'verb'); return; }
          _colorPred = adj.e.ko; return;                  // "mașina e roșie" → 빨간색이에요
        }
        var hit = lexLookup(tok);
        if(hit && (hit.kind === 'verb' || hit.kind === 'adj')){ if(!verb){ verb = lexItem(hit, 'verb'); return; } }
        else if(hit && hit.kind === 'adv'){ if(descs.length < 2){ descs.push(lexItem(hit, 'adverb')); return; } }
        else if(hit && hit.kind === 'time'){ if(!times.length){ times.push(lexItem(hit, 'time')); return; } }
        else if(hit && hit.kind === 'place'){ if(!places.length){ places.push(lexItem(hit, 'departure')); return; } }
        else if(hit){ if(objects.length < 2){ var lo = lexItem(hit, 'object1'); lo.srcTok = tok; objects.push(lo); return; } }
        // a capitalised first word that is not in any dictionary is a name — the fallback below handles it
        if(!hit && ci === 0 && normalizeLatin(String(raw).trim().split(/\s+/)[0]) === tok) return;
        if(!hit && _unknown.indexOf(tok) === -1) _unknown.push(tok);
      });
      if(_adjMod && _adjMod.ko) _nounMods.push({ noun: null, nounKo: _adjMod.noun.ko, ko: _adjMod.ko, ro: _adjMod.ro, en: _adjMod.en });
      if(_nounMods.length){
        var _modify = function(list){
          return list.map(function(it){
            for(var m = 0; m < _nounMods.length; m++){
              var nm0 = _nounMods[m];
              var same = (nm0.noun && it.srcTok === nm0.noun) || (nm0.nounKo && koBase(nm0.nounKo) === koBase(it.ko));
              if(!same && nm0.noun){ var f = findBestMatch('object1', nm0.noun) || findBestMatch('topic', nm0.noun); same = !!(f && f.ko === it.ko); }
              if(same){
                var c = {}; for(var k in it) c[k] = it[k];
                c.ko = nm0.ko + ' ' + it.ko;
                // the card label and the translation keep the adjective: "pisica portocalie", "the orange cat"
                if(nm0.ro) c.ro = (it.ro || '') + ' ' + nm0.ro;
                if(nm0.en) c.en = String(it.en || '').replace(/^((?:the|a|an|my) )?/, function(d){
                  if(/^an? $/.test(d)) d = /^[aeiou]/i.test(nm0.en) ? 'an ' : 'a ';
                  return d + nm0.en + ' ';
                });
                return c;
              }
            }
            return it;
          });
        };
        objects = _modify(objects);
        subjects = _modify(subjects);
        // compound verb that contains the (now modified) object: 음악을 듣다 + 조용한 음악을 → 듣다
        if(verb && verb.ko && verb.ko.indexOf(' ') > 0){
          var _vo = verb.ko.split(' ')[0];
          if(objects.some(function(o){ return o.ko !== _vo && o.ko.slice(-_vo.length) === _vo; })){
            var _vc = {}; for(var vk2 in verb) _vc[vk2] = verb[vk2];
            _vc.ko = verb.ko.split(' ').slice(1).join(' '); _vc.forms = null; _vc.final = null;
            // its gloss loses the object too: "a asculta muzică" → "a asculta", "to listen to music" → "to listen to"
            _vc.ro = trClean(verb.ro).replace(/\s+\S+$/, ''); _vc.en = trClean(verb.en).replace(/\s+\S+$/, '');
            verb = _vc;
          }
        }
      }

      // "parola de la telefon" → 전화 비밀번호를 (Y's X)
      var _dl = /(\S+) de la (\S+)/.exec(cd.text);
      if(_dl && objects.length >= 2){
        var _objOf = function(w){
          for(var q = 0; q < objects.length; q++){
            var o = objects[q];
            if(o.srcTok === w) return q;
            var f = findBestMatch('object1', w); if(f && f.ko === o.ko) return q;
          }
          return -1;
        };
        var _hI = _objOf(_dl[1]), _gI = _objOf(_dl[2]);
        if(_hI >= 0 && _gI >= 0 && _hI !== _gI){
          var _mg = {}; for(var mk2 in objects[_hI]) _mg[mk2] = objects[_hI][mk2];
          _mg.ko = koBase(objects[_gI].ko) + ' ' + objects[_hI].ko;
          objects = [_mg].concat(objects.filter(function(o, q){ return q !== _hI && q !== _gI; }));
        }
      }

      // "academia de scrimă" → 펜싱 학원, "școala de muzică" → 음악 학교 (place + "de" + noun)
      if(places[0]){
        var _pdRe = /(\S+) de (\S+)/g, _pd = null, _pm;
        while((_pm = _pdRe.exec(cd.text))){
          if(_pm[2] !== 'la' && !NUM_WORDS[_pm[2]] && !/^\d/.test(_pm[2]) && findBestMatch('departure', _pm[1]) && findBestMatch('departure', _pm[1]).ko === places[0].ko){ _pd = _pm; break; }
          _pdRe.lastIndex = _pm.index + _pm[1].length + 1;
        }
        if(_pd){
          var _pn = findBestMatch('object1', _pd[2]);
          if(!_pn){ var _pl2 = lexLookup(_pd[2]); if(_pl2 && _pl2.kind === 'noun') _pn = lexItem(_pl2, 'object1'); }
          if(_pn){
            var _pc = {}; for(var pk2 in places[0]) _pc[pk2] = places[0][pk2];
            _pc.ko = koBase(_pn.ko) + ' ' + places[0].ko;
            places = [_pc].concat(places.slice(1));
            objects = objects.filter(function(o){ return koBase(o.ko) !== koBase(_pn.ko); });
          }
        }
      }

      // "o sun pe mama" / "o ajut pe Ana": "pe + persoană" is the object (엄마한테 전화해요, 엄마를 도와요)
      var _pe = /\bpe (\S+)/.exec(cd.text);
      if(_pe && verb){
        var _pp = findBestMatch('topic', _pe[1]);
        if(_pp && !/^(저는|나는|너는|우리는)$/.test(_pp.ko)){
          var _ppb = koBase(_pp.ko);
          var _toWhom = /(^| )(전화하다|말하다|이야기하다|묻다|물어보다|주다|보내다|가르치다)$/.test(verb.ko);
          subjects = subjects.filter(function(x){ return x.ko !== _pp.ko; });
          objects = [{ key:'object1', kind:'object1', ko: _ppb + (_toWhom ? '한테' : ((window.Conjugation && window.Conjugation.hasBatchim(_ppb)) ? '을' : '를')), ro: _pp.ro, en: _pp.en }]
            .concat(objects.filter(function(o){ return koBase(o.ko) !== _ppb; }));
        }
      }

      // "i-am spus lui Mihai" / "îi dau Anei": a name in the dative → 미하이한테
      var _lui = String(raw).match(/(?:^|\s)lui\s+([A-ZĂÂÎȘŞȚŢ][a-zăâîșşțţ\-]+)/);
      if(_lui && verb && /(^| )(전화하다|말하다|이야기하다|묻다|물어보다|주다|보내다|가르치다|선물하다)$/.test(verb.ko)){
        var _ln = normalizeLatin(_lui[1]);
        subjects = subjects.filter(function(x){ return normalizeLatin(x.ro || '') !== _ln; });
        objects = [{ key:'object1', kind:'object1', ko: hangulName(_lui[1]) + '한테', ro: _lui[1], en: _lui[1] }].concat(objects);
        _rawCaps[_ln] = 1;
      }

      // "un cadou pentru mama" → 엄마를 위한 선물 ; "gătesc pentru prieteni" → 친구들을 위해
      var _pf = /\bpentru (\S+)/.exec(cd.text);
      if(_pf && !/^(a|ca|ce|cine|asta|aceasta)$/.test(_pf[1])){
        var _ben = findBestMatch('topic', _pf[1]);
        if(_ben && !/^(저는|나는|너는|우리는)$/.test(_ben.ko)){
          var _bb = koBase(_ben.ko);
          var _bp = _bb + ((window.Conjugation && window.Conjugation.hasBatchim(_bb)) ? '을' : '를');
          subjects = subjects.filter(function(x){ return x.ko !== _ben.ko; });
          objects = objects.filter(function(o){ return koBase(o.ko) !== _bb; });
          if(objects[0]){
            var _oc = {}; for(var ok3 in objects[0]) _oc[ok3] = objects[0][ok3];
            _oc.ko = _bp + ' 위한 ' + objects[0].ko;
            _oc.ro = (objects[0].ro || '') + ' pentru ' + trClean(_ben.ro);
            _oc.en = (objects[0].en || '') + ' for ' + trClean(_ben.en);
            objects = [_oc].concat(objects.slice(1));
          } else {
            // after "pentru" a plural subject loses its article: prietenii → prieteni, copiii → copii
            var _bro = trClean(_ben.ro), _braw = _ben.raw && typeof _ben.raw === 'object' ? _ben.raw : _ben;
            if(_braw.num === 'pl' && /ii$/.test(_bro)) _bro = _bro.slice(0, -1);
            addExtra(clause, { type:'for', pos:'prefix', ko:_bp + ' 위해', ro:'pentru ' + _bro, en:'for ' + trClean(_ben.en) });
          }
        }
      }

      // "a intrat în casă" → 집에 들어갔어요 (the noun after în/la/into is the destination, not an object)
      if(verb && /(^| )(들어가다|들어오다|가다|오다|도착하다|돌아가다|돌아오다|올라가다|내려가다)$/.test(verb.ko) && (!places.length || /^(the|a|my)$/.test(normalizeLatin(places[0].ro || '')))){
        var _into = /\b(?:in|la|into|to)\s+(?:the\s+|a\s+|my\s+)?(\S+)/.exec(cd.text);
        if(_into){
          var _in = findBestMatch('object1', _into[1]);
          if(_in && objects.some(function(o){ return o.ko === _in.ko; }) && !/\bsa\b/.test(cd.text)){
            objects = objects.filter(function(o){ return o.ko !== _in.ko; });
            places = [{ key:'departure', kind:'departure', ko: koBase(_in.ko) + '에서', ro: _in.ro, en: _in.en }];
          }
        }
      }

      // "în fața școlii / casei" → 학교 앞에서 ("fața" = front, not "fata" = girl 소녀)
      var _front = /\bin fata (\S+)/.exec(cd.text) || /\bin front of\s+(?:the\s+|my\s+)?(\S+)/.exec(cd.text);
      if(_front){
        subjects = subjects.filter(function(x){ return koBase(x.ko) !== '소녀'; });
        objects = objects.filter(function(x){ return koBase(x.ko) !== '소녀'; });
        // the place was already found from the genitive ("școlii" → 학교에서): put it in front → 학교 앞에서
        if(places.length && places[0].ko !== '모두 앞에서' && !/ 앞에서$/.test(places[0].ko)){
          var _pf2 = findBestMatch('departure', _front[1]);
          if(_pf2 && _pf2.ko === places[0].ko){
            var _pc2 = {}; for(var _k2 in places[0]) _pc2[_k2] = places[0][_k2];
            _pc2.ko = koBase(places[0].ko) + ' 앞에서';
            places = [_pc2].concat(places.slice(1));
          }
        }
        if(!places.length || places[0].ko === '모두 앞에서'){
          if(!places.length){
            var _fn = findBestMatch('object1', _front[1]) || findBestMatch('departure', _front[1]);
            if(!_fn){ var _fl = lexLookup(_front[1]); if(_fl && (_fl.kind === 'noun' || _fl.kind === 'place')) _fn = lexItem(_fl, 'object1'); }
            if(_fn){
              objects = objects.filter(function(o){ return koBase(o.ko) !== koBase(_fn.ko); });
              places = [{ key:'departure', kind:'departure', ko: koBase(_fn.ko) + ' 앞에서', ro: 'în fața ' + _front[1], en: 'in front of' }];
            }
          }
        }
      }

      // "I entered the house" / "intru în casă": what you enter is a place (집에 들어갔어요)
      if(verb && /(^| )(들어가다|들어오다|도착하다)$/.test(verb.ko) && !places.length && objects[0] && !/\b(sa|to)\b/.test(cd.text)){
        places = [{ key:'departure', kind:'departure', ko: koBase(objects[0].ko) + '에서', ro: objects[0].ro, en: objects[0].en }];
        objects = objects.slice(1);
      }

      // "ies din casă" → 집에서 나와요 (leaving FROM a place)
      if(verb && /(^| )(나오다|나가다|떠나다|출발하다|내리다)$/.test(verb.ko)){
        var _din = /\b(?:din|de la|from|out of)\s+(?:the\s+|a\s+|my\s+)?(\S+)/.exec(cd.text);
        if(_din){
          var _dn = findBestMatch('object1', _din[1]) || findBestMatch('departure', _din[1]);
          if(_dn){
            objects = objects.filter(function(o){ return koBase(o.ko) !== koBase(_dn.ko); });
            if(!places.length || koBase(places[0].ko) === koBase(_dn.ko)) places = [{ key:'departure', kind:'departure', ko: koBase(_dn.ko) + '에서', ro: _dn.ro, en: _dn.en }].concat(places.slice(1));
          }
        }
      }

      // means of transport: "cu trenul" → 기차로
      var _tr = /\b(?:cu|by|with the|with)\s+(trenul|tren|train|autobuzul|autobuz|bus|avionul|avion|plane|masina|masinii|car|metroul|metrou|subway|taxiul|taxi|bicicleta|bicicleta|bike|bicycle|vaporul|vapor|ship)\b/.exec(' ' + cd.text + ' ');
      if(_tr){
        var _tk = /^tren|^train/.test(_tr[1]) ? '기차' : /^autobuz|^bus/.test(_tr[1]) ? '버스' : /^avion|^plane/.test(_tr[1]) ? '비행기'
                : /^masin|^car/.test(_tr[1]) ? '차' : /^metro|^subway/.test(_tr[1]) ? '지하철' : /^taxi/.test(_tr[1]) ? '택시'
                : /^bicicl|^bike|^bicycle/.test(_tr[1]) ? '자전거' : '배';
        var _tj = _jong(_tk.slice(-1));
        var MEANS_TR = { '기차':['cu trenul','by train'], '버스':['cu autobuzul','by bus'], '비행기':['cu avionul','by plane'], '차':['cu mașina','by car'],
                         '지하철':['cu metroul','by subway'], '택시':['cu taxiul','by taxi'], '자전거':['cu bicicleta','by bike'], '배':['cu vaporul','by ship'] };
        addExtra(clause, { type:'means', pos:'means', ko:_tk + (_tj > 0 && _tj !== 8 ? '으로' : '로'), ro:MEANS_TR[_tk][0], en:MEANS_TR[_tk][1] });
        objects = objects.filter(function(o){ return koBase(o.ko) !== _tk; });
      } else if(/\b(pe jos|on foot)\b/.test(cd.text)){
        addExtra(clause, { type:'means', pos:'means', ko:'걸어서', ro:'pe jos', en:'on foot' });
      }
      // a city / country the vocabulary doesn't know: "la Busan" → 부산에
      if(!places.length){
        var _pl = String(raw).match(/(?:^|\s)(?:la|în|in|to|din|from|spre)\s+([A-ZĂÂÎȘŞȚŢ][a-zăâîșşțţ\-]+)/);
        if(_pl && (' ' + cd.text + ' ').indexOf(' ' + normalizeLatin(_pl[1]) + ' ') !== -1 && !findBestMatch('departure', normalizeLatin(_pl[1]))){
          places = [{ key:'departure', kind:'departure', ko: hangulName(_pl[1]) + '에서', ro: _pl[1], en: _pl[1], isProperName: true }];
          _rawCaps[normalizeLatin(_pl[1])] = 1;
        }
      }

      // ---- hour ("la ora șapte" → 일곱 시에), duration ("de doi ani" → 2년 동안), counted nouns ("două pisici" → 고양이 두 마리) ----
      var _ct = ' ' + cd.text + ' ';
      var _timeExtra = [], _timeRo = [], _timeEn = [];
      var hm = new RegExp('\\b(?:la ora|ora|at)\\s+(' + NUM_RE + ')(\\s+(?:si\\s+)?jumatate|\\s+thirty|\\s+30)?(?:\\s+o\\s*clock)?\\b').exec(_ct);
      if(hm){
        var hn = numVal(hm[1]);
        if(hn >= 1 && hn <= 12){
          _timeExtra.push(NATIVE_NUM[hn] + ' 시' + (hm[2] ? ' 반' : '') + '에'); _ct = _ct.replace(hm[0], ' ');
          _timeRo.push('la ora ' + hn + (hm[2] ? ' și jumătate' : '')); _timeEn.push('at ' + hn + (hm[2] ? ':30' : " o'clock"));
        }
      }
      var dm2 = new RegExp('\\b(?:de|for|timp de)\\s+(' + NUM_RE + '|un|o|a|an)\\s+(ani|an|anul|years?|luni|luna|months?|zile|zi|days?|saptamani|saptamana|weeks?|ore|hours?)\\b').exec(_ct);
      if(dm2){
        var dn = numVal(dm2[1]) || 1;
        var du = /^(ani|an|anul|year)/.test(dm2[2]) ? '년' : /^(luni|luna|month)/.test(dm2[2]) ? '개월' : /^(zile|zi|day)/.test(dm2[2]) ? '일' : /^(saptaman|week)/.test(dm2[2]) ? '주' : '시간';
        _timeExtra.push(dn + du + ' 동안'); _ct = _ct.replace(dm2[0], ' ');
        var _duU = { '년':['an','ani','year'], '개월':['lună','luni','month'], '일':['zi','zile','day'], '주':['săptămână','săptămâni','week'], '시간':['oră','ore','hour'] }[du];
        _timeRo.push('de ' + (dn === 1 ? (/^(an)$/.test(_duU[0]) ? 'un ' : 'o ') + _duU[0] : dn + ' ' + _duU[1]));
        _timeEn.push('for ' + (dn === 1 ? 'a ' + _duU[2] : dn + ' ' + _duU[2] + 's'));
        if(/^(de|for)\s/.test(dm2[0].trim())) clause.__ongoing = true;
      }
      // how long something takes: "it takes two hours" → 두 시간 (no "for")
      if(!_timeExtra.length && verb && /^(걸리다)$/.test(verb.ko)){
        var _tk3 = new RegExp('\\b(' + NUM_RE + '|an|a|o|un|one)\\s+(hours?|ore|ora|minutes?|minute|minut|days?|zile|zi)\\b').exec(_ct);
        if(_tk3){
          var _tn3 = numVal(_tk3[1]) || 1;
          _timeExtra.push(/^(hour|ore|ora)/.test(_tk3[2]) ? (_tn3 <= 12 ? NATIVE_NUM[_tn3] : _tn3) + ' 시간' : /^(minut)/.test(_tk3[2]) ? _tn3 + '분' : _tn3 + '일');
          var _tkU = /^(hour|ore|ora)/.test(_tk3[2]) ? ['oră','ore','hour'] : /^(minut)/.test(_tk3[2]) ? ['minut','minute','minute'] : ['zi','zile','day'];
          _timeRo.push(_tn3 === 1 ? (_tkU[0] === 'minut' ? 'un ' : 'o ') + _tkU[0] : _tn3 + ' ' + _tkU[1]);
          _timeEn.push(_tn3 === 1 ? (_tkU[2] === 'hour' ? 'an ' : 'a ') + _tkU[2] : _tn3 + ' ' + _tkU[2] + 's');
        }
      }
      if(_timeExtra.length){
        times = findAllMatches('time', _ct, 1);           // "de trei luni" is a duration, not Monday
        var tBase = times[0] ? times[0].ko + ' ' : '';
        times = [{ key:'time', kind:'time', ko: tBase + _timeExtra.join(' '),
                   ro: (times[0] ? times[0].ro + ' ' : '') + _timeRo.join(' '), en: _timeEn.join(' ') + (times[0] ? ' ' + times[0].en : '') }];
      }
      var cm2 = new RegExp('\\b(' + NUM_RE + ')\\s+([a-z]+)').exec(_ct);
      if(cm2 && numVal(cm2[1]) >= 2){
        var cObj = findBestMatch('object1', cm2[2]);
        if(cObj && cObj.ko){
          objects = [cObj].concat(objects.filter(function(o){ return o.ko !== cObj.ko; }));
          var cBase0 = cObj.ko.replace(/(을|를|이|가|은|는)$/, '');
          var cn = numVal(cm2[1]);
          clause.__count = { num: cn <= 12 ? NATIVE_NUM[cn] : String(cn), counter: COUNTERS[cBase0] || '개' };
        }
      }
      // copula: "sunt student" → 학생이에요, "Ana nu e profesoară" → 아나는 선생님이 아니에요
      var _copulaFirstPerson = false;
      if(!verb){
        var cpm = /\b(nu\s+)?(sunt|esti|e|este|suntem|sunteti|i m|i am|you are|he is|she is|it is|is|are|am fost|ai fost|a fost|au fost|ati fost|was|were)\b(\s+not)?/.exec(_ct);
        if(cpm){
          var after = _ct.slice(cpm.index + cpm[0].length);
          var pn = findBestMatch('topic', after) || findBestMatch('object1', after);
          if(!pn) pn = objects.filter(function(o){ return o.fromLexicon && (' ' + after + ' ').indexOf(' ' + o.srcTok + ' ') !== -1; })[0] || null;
          if(!pn && _colorPred) pn = { ko: _colorPred };
          // "mama e la muncă" — "a fi" + a place = to be somewhere → 있다
          if(!pn && places.length){
            (DATA.verb || []).forEach(function(v){ if(v.ko === '있다' && !verb) verb = v; });
            if(verb && !subjects.length && objects.length){
              subjects = [{ key:'topic', kind:'topic', ko: koNom(objects[0].ko), ro: objects[0].ro, en: objects[0].en }];
              objects = objects.slice(1);
            }
            if(/^nu\s/.test(cpm[0])) clause.negated = true;
          }
          if(pn && pn.ko && !/^(저는|나는|너는|우리는|그는|그녀는|그들은)$/.test(pn.ko)){
            clause.__copula = { base: pn.ko.replace(/(을|를|이|가|은|는)$/, ''), neg: !!(cpm[1] || cpm[3]), past: /fost|was|were/.test(cpm[2]) };
            subjects = subjects.filter(function(x){ return x.ko !== pn.ko; });
            objects  = objects.filter(function(x){ return x.ko !== pn.ko; });
            _copulaFirstPerson = /^(sunt|i m|i am)$/.test(cpm[2]);
            // "Mașina mea e roșie": the noun before the copula is its subject
            if(!subjects.length && objects.length){
              subjects = [{ key:'topic', kind:'topic', ko: koNom(objects[0].ko), ro: objects[0].ro, en: objects[0].en }];
              objects = objects.slice(1);
            }
          }
        }
      }

      // "cu Mihai" / "with Mihai" → companion (Mihai하고 같이), never the subject
      var cmp = String(raw).match(/(?:^|\s)(?:cu|with)\s+([A-ZĂÂÎȘŞȚŢ][a-zăâîșşțţ\-]+)/);
      if(cmp && !/^(cred|sper|azi|maine|ieri)$/.test(normalizeLatin(cmp[1])) &&
         /(^| )(cu|with) /.test(' ' + cd.text) && (' ' + cd.text + ' ').indexOf(' ' + normalizeLatin(cmp[1]) + ' ') !== -1) clause.__companion = cmp[1];

      // Proper noun fallback: if no vocab subject found, look for a capitalized word
      // in the original text that isn't already matched by another category
      if(!subjects.length){
        var rawWords = raw.split(/\s+/);
        for(var pw = 0; pw < rawWords.length && pw < 5; pw++){
          var ow = rawWords[pw];
          if(ow && /^[A-ZĂÎȘȚ]/.test(ow)){
            var owNorm = normalizeLatin(ow);
            if(/^(mi|ti|ii|ne|va|le) e$/.test(owNorm) || /^(mi|ti|ii|ne|va|le)-e$/i.test(ow)) continue;   // "Mi-e rușine"
            if(owNorm.length < 2 || /^(cred|sper|stiu|poate|azi|maine|ieri|acum|apoi|dar|deci|in|la|pe|cu|si|pot|poti|putem|vreau|vrei|vrem|nu|da|am|ai|ne|ma|te|eu|tu|el|ea|noi|voi|ei|ele|trebuie|vom|vor|va|to|the|a|an|my|we|he|she|it|they|you|this|that|sunt|esti|e|este|suntem|sunteti|imi|iti|ii|mi|ti|se|si|probabil|datorita|multumita|din|hai|haideti|asa|niciodata|vreodata|please|let|lets|im|dont|do|does|did|is|are|was|n|de|ca|o|un|una|daca|cand|fiindca|pentru|dupa|inainte|imediat|chiar|desi|mai|foarte|tot|toti|fiecare|ce|cine|unde|cum|de ce|care|aici|acolo|sa)$/.test(owNorm)) continue;
            if(clause.__companion && owNorm === normalizeLatin(clause.__companion)) continue;
            if(places.some(function(p){ return p.isProperName && normalizeLatin(p.ro) === owNorm; })) continue;
            if(cd.text.indexOf(owNorm) !== -1 && !lexLookup(owNorm) &&
               !findBestMatch('departure', owNorm) &&
               !findBestMatch('time', owNorm) &&
               !findBestMatch('verb', owNorm) &&
               !findBestMatch('object1', owNorm)){
              subjects = [{ key:'topic', kind:'topic', ko: nameWithTopic(ow.replace(/[.,!?;:]+$/, '')), ro: ow, en: ow, isProperName: true }];
              break;
            }
          }
        }
      }

      // "Eu și Ana…", "cu Ana", "Mihai and I": a capitalised name joined to the
      // subject becomes the second subject, even when a vocab subject was found.
      if(subjects.length < 2){
        var NAME_STOP = {cred:1,sper:1,stiu:1,poate:1,azi:1,maine:1,ieri:1,acum:1,apoi:1,dar:1,deci:1,eu:1,tu:1,el:1,ea:1,noi:1,voi:1,ei:1,ele:1,i:1,we:1,you:1};
        var nm = String(raw).match(/(?:^|\s)(și|şi|si|cu|and|with)\s+([A-ZĂÂÎȘŞȚŢ][a-zăâîșşțţ\-]+)/);
        if(nm && (' ' + cd.text + ' ').indexOf(' ' + normalizeLatin(nm[2]) + ' ') === -1) nm = null;
        if(nm && !NAME_STOP[normalizeLatin(nm[2])] && !subjects.some(function(sj){ return normalizeLatin(sj.ro || '') === normalizeLatin(nm[2]); })){
          if(/^(cu|with)$/.test(nm[1])){
            // companion already handled above
          } else {
            subjects.push({ key:'topic', kind:'topic', ko: nameWithTopic(nm[2]), ro: nm[2], en: nm[2], isProperName: true });
          }
        }
      }

      // the same noun matched as subject AND object ("prieten"): before the verb → subject, after → object
      if(subjects[0] && objects.length && verb){
        var _sb = koBase(subjects[0].ko);
        var _di = -1;
        for(var _oi = 0; _oi < objects.length; _oi++) if(koBase(objects[_oi].ko) === _sb) _di = _oi;
        if(_di >= 0){
          var _tk = relTokens(cd.text), _vPos = -1, _nPos = -1;
          for(var _t = 0; _t < _tk.length; _t++){
            if(_vPos < 0 && findBestMatch('verb', normalizeLatin(_tk[_t].w))) _vPos = _t;
            if(_nPos < 0){ var _ni = nounItem(_tk[_t].w); if(_ni && koBase(_ni.ko) === _sb) _nPos = _t; }
          }
          if(_nPos >= 0 && _vPos >= 0 && _nPos > _vPos) subjects = subjects.slice(1);
          else objects.splice(_di, 1);
        }
      }
      if(!verb && subjects[0]){
        var _sb2 = koBase(subjects[0].ko);
        objects = objects.filter(function(o){ return koBase(o.ko) !== _sb2; });
      }
      if(_copulaFirstPerson && !subjects.length) subjects = [{ key:'topic', kind:'topic', ko:'저는', ro:'eu', en:'I' }];
      // adjective predicate: "Mâncarea e gustoasă" → 음식이 맛있어요 (the noun is the subject, not an object)
      // "Restaurantul unde mâncăm este mare" — a place can be the adjective's subject too
      if(verb && isDescriptive(verb) && !subjects.length && !objects.length && places[0]){
        objects = [{ key:'object1', kind:'object1', ko: koBase(places[0].ko), ro: places[0].ro, en: places[0].en }];
        places = places.slice(1);
      }
      // an adverb that is part of the verb's own expression ("mă simt bine" = 기분이 좋다): don't add 잘 again
      if(verb && descs.length){
        var _vin = itemCands(verb).filter(function(a){ return a && a.indexOf(' ') > 0 && (' ' + normalizeLatin(cd.text) + ' ').indexOf(' ' + a + ' ') !== -1; });
        if(_vin.length) descs = descs.filter(function(d){ return !itemCands(d).some(function(w){ return w && _vin.some(function(a){ return (' ' + a + ' ').indexOf(' ' + w + ' ') !== -1; }); }); });
      }
      // "frumoasă" read both as adverb (예쁘게) and predicate (예쁘다): keep the predicate
      if(verb && verb.ko && window.Conjugation){
        var _vs = window.Conjugation.stem(verb.ko);
        if(_vs.length >= 3) _vs = _vs.slice(0, -1);      // 깨끗하 → 깨끗 (깨끗이)
        descs = descs.filter(function(d){ return !(d && d.ko && d.ko.indexOf(_vs) === 0 && d.ko !== verb.ko); });
      }
      // Romanian / English are subject–verb–object: with no subject found, a noun BEFORE the verb
      // is the subject ("Pisica a plecat" → 고양이가 떠났어요), one after it stays the object.
      if(verb && !subjects.length && objects[0] && !clause.__count && !clause.__copula){
        var _tks = relTokens(cd.text), _vp = -1, _op = -1;
        var _o0 = objects[0], _firstPos = 1e9;
        // whichever object noun comes first in the sentence is the candidate subject
        // a noun may be one word ("pisica") or two ("the cat", "micul dejun")
        var _objAt = function(z, o){
          var one = normalizeLatin(_tks[z].w), two = z + 1 < _tks.length ? one + ' ' + normalizeLatin(_tks[z + 1].w) : '';
          var a = findBestMatch('object1', one), b2 = two ? findBestMatch('object1', two) : null;
          return (a && a.ko === o.ko) || (b2 && b2.ko === o.ko) || (o.srcTok && o.srcTok === one);
        };
        objects.forEach(function(o){
          for(var _z = 0; _z < _tks.length; _z++){
            if(_objAt(_z, o) && _z < _firstPos){ _firstPos = _z; _o0 = o; }
          }
        });
        for(var _q = 0; _q < _tks.length; _q++){
          var _tn = normalizeLatin(_tks[_q].w);
          if(_vp < 0){
            var _pair = _q + 1 < _tks.length ? _tn + ' ' + normalizeLatin(_tks[_q + 1].w) : '';
            // an English article is never the verb — but Romanian "a" is also the past auxiliary ("a plecat")
            var _det = /^(the|an|my|your|his|her|our|their)$/.test(_tn) || (_tn === 'a' && !(_pair && findBestMatch('verb', _pair)));
            if(!_det && ((!REL_AUX[_tn] && findBestMatch('verb', _tn)) || (REL_AUX[_tn] && _pair && findBestMatch('verb', _pair)))) _vp = _q;
          }
          if(_op < 0 && _objAt(_q, _o0)) _op = _q;
        }
        if(_op >= 0 && _vp > _op && !(times[0] && koBase(times[0].ko) === koBase(_o0.ko))){
          subjects = [{ key:'topic', kind:'topic', ko: koNom(_o0.ko), ro: _o0.ro, en: _o0.en }];
          objects = objects.filter(function(o){ return o !== _o0; });
        }
      }
      if(verb && subjects.length === 1 && !subjects[0].isProperName && !isIntransitive(verb.ko) && !MOTION_NOOBJ[verb.ko] && !isDescriptive(verb) &&
         !/^(저는|나는|너는|우리는|그는|그녀는|그들은|여러분은)$/.test(subjects[0].ko)){
        var _tk2 = relTokens(cd.text), _vp2 = -1, _sp2 = -1, _sb2 = koBase(subjects[0].ko);
        for(var _q2 = 0; _q2 < _tk2.length; _q2++){
          var _tn2 = normalizeLatin(_tk2[_q2].w);
          if(_vp2 < 0 && !REL_AUX[_tn2] && findBestMatch('verb', _tn2)) _vp2 = _q2;
          var _st2 = findBestMatch('topic', _tn2);
          if(_sp2 < 0 && _st2 && koBase(_st2.ko) === _sb2) _sp2 = _q2;
        }
        if(_vp2 >= 0 && _sp2 > _vp2){
          var _toWhom2 = /(^| )(전화하다|말하다|이야기하다|묻다|물어보다|주다|보내다|가르치다|선물하다)$/.test(verb.ko);
          objects = [{ key:'object1', kind:'object1', ko: _sb2 + (_toWhom2 ? '한테' : ((window.Conjugation && window.Conjugation.hasBatchim(_sb2)) ? '을' : '를')), ro: subjects[0].ro, en: subjects[0].en }].concat(objects);
          subjects = [];
        }
      }
      if(verb && isIntransitive(verb.ko) && !MOTION_NOOBJ[verb.ko] && !subjects.length && objects[0] && !clause.__count){
        subjects = [{ key:'topic', kind:'topic', ko: koNom(objects[0].ko), ro: objects[0].ro, en: objects[0].en }];
        objects = objects.slice(1);
      }
      if(verb && isDescriptive(verb) && !subjects.length && objects[0] && !clause.__count){
        var dBase = objects[0].ko.replace(/(을|를|이|가|은|는)$/, '');
        var dHb = window.Conjugation && window.Conjugation.hasBatchim(dBase);
        subjects = [{ key:'topic', kind:'topic', ko: dBase + (dHb ? '이' : '가'), ro: objects[0].ro, en: objects[0].en }];
        objects = objects.slice(1);
      }
      if(ci === 0 && FR.prefixItem) addExtra(clause, FR.prefixItem);

      // Topic drop: only set subject if different from previous clause's subject
      if(subjects[0] && subjects[0].ko !== lastSubjectKo){
        setFieldItem(clause, 'topic', subjects[0]);
        lastSubjectKo = subjects[0].ko;
      }
      if(subjects[1]) setFieldItem(clause, 'topic2', subjects[1]);
      // no subject word: the Romanian auxiliary still says who ("m-ai făcut" = tu, "ați mers" = voi) —
      // Korean drops it, the translation needs it
      if(!subjects[0]) clause.__person = personFromAux(cd.text);
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
          var saAll = (' ' + normalizeLatin(cd.text) + ' ').match(/\bsa\s+(\S+)/g) || [];
          for(var sai = 0; sai < saAll.length && !purposeVerbItem; sai++){
            var wordAfterSa = saAll[sai].replace(/^sa\s+/, '').replace(/[!?.,;]/g,'');
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
            var saAll2 = (' ' + normalizeLatin(cd.text) + ' ').match(/\bsa\s+(\S+)/g) || [];
            for(var sai2 = 0; sai2 < saAll2.length && !purposeVerbItem; sai2++){
              var pvW2 = saAll2[sai2].replace(/^sa\s+/, '').replace(/[!?.,;]/g,'');
              var pvC2 = findBestMatch('verb', pvW2);
              // "vrei să bei cafea" — 'bei' is the main compound verb (커피를 마시다), not a purpose
              if(pvC2 && pvC2.ko !== verb.ko && verb.ko.slice(-pvC2.ko.length) !== pvC2.ko) purposeVerbItem = pvC2;
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
        // a compound main verb already contains it ("bei cafea" = 커피를 마시다 + "să bei")
        if(purposeVerbItem && verb && verb.ko.slice(-purposeVerbItem.ko.length) === purposeVerbItem.ko) purposeVerbItem = null;
        if(purposeVerbItem) clause.__purposeVerbItem = purposeVerbItem;

        // "go home": the same noun as place and object (집에 + 집을) → keep only the place
        var _base = function(k){ return String(k || '').replace(/(에서|에|을|를|이|가|은|는)$/, ''); };
        if(objects[0] && places[0] && _base(objects[0].ko) === _base(places[0].ko)) objects = objects.slice(1);
        if(places[0]) objects = objects.filter(function(o){ return _base(places[0].ko).indexOf(_base(o.ko) + ' ') !== 0; });   // 문 앞 + 문
        if(times[0]) objects = objects.filter(function(o){ return _base(o.ko) !== _base(times[0].ko); });   // "la prânz" = 점심에, not also 점심을
        if(verb && /하다$/.test(verb.ko)) objects = objects.filter(function(o){ var bb = _base(o.ko); return !(bb.length >= 2 && verb.ko.indexOf(bb + '하다') === 0); });   // "call" = 전화 + 전화하다
        // "merg pe stradă": a noun right after pe/în/la/prin is the place found above, not also an object
        if(places[0]){
          var _ctn = ' ' + normalizeLatin(cd.text) + ' ';
          objects = objects.filter(function(o){
            return !(itemCands(o).some(function(a){ return a && new RegExp(' (pe|in|la|prin|on|in the|at the) ' + a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ' ').test(_ctn); }));
          });
        }
        if(objects[1] && objects[0] && objects[1].ko === objects[0].ko) objects = [objects[0]];   // same word matched twice
        // compound verbs that already contain their object ("커피를 마시다") — don't repeat it
        if(verb && verb.ko) objects = objects.filter(function(o){ return !(o && o.ko && verb.ko.indexOf(' ') > 0 && verb.ko.indexOf(_base(o.ko)) === 0); });
        // "o carte" / "a book": the learner used the indefinite article — the translation keeps it
        objects = objects.map(function(o){ return markIndefinite(o, cd.text); });
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

    // relative clauses: put the attributive before its head noun (서울에 사는 친구는)
    REL.mods.forEach(function(md){
      var done = false;
      newClauses.forEach(function(cl){
        ['topic','topic2','object1','object2','departure','transit'].forEach(function(f){
          if(done) return;
          var it = itemOf(cl, f);
          if(it && it.ko && koBase(it.ko) === md.base){
            var cp = {}; for(var key in it) cp[key] = it[key];
            cp.ko = md.ko + ' ' + it.ko;
            // a place word used as subject / object ("restaurantul unde mâncăm") keeps the noun as written, not "la restaurant"
            var headLbl = (md.en ? it.en : it.ro) || '';
            if(f !== 'departure' && f !== 'transit' && /^(la|în|in|pe|at|in|on) /i.test(headLbl)) headLbl = md.head.toLowerCase();
            if(md.en) cp.en = headLbl + ' ' + md.src; else cp.ro = headLbl + ' ' + md.src;
            // the other language: the relative rebuilt from what the parser understood of it
            var otherLang = md.en ? 'ro' : 'en';
            var genRel = md.rel ? trRelative(otherLang, md.rel, it) : '';
            if(genRel){
              var otherLbl = (otherLang === 'en' ? it.en : it.ro) || '';
              if(f !== 'departure' && f !== 'transit') otherLbl = otherLbl.replace(/^(la|în|in|pe|at|on) (the )?/i, otherLang === 'en' ? 'the ' : '');
              cp[otherLang] = otherLbl + ' ' + genRel;
            }
            setFieldItem(cl, f, cp); done = true;
          }
        });
        if(!done && cl.__copula && cl.__copula.base === md.base){
          cl.__copula.base = md.ko + ' ' + cl.__copula.base;
          cl.__copula[md.en ? 'relEn' : 'relRo'] = md.src;
          var genC = md.rel ? trRelative(md.en ? 'ro' : 'en', md.rel, md.headItem) : '';
          if(genC) cl.__copula[md.en ? 'relRo' : 'relEn'] = genC;
          done = true;
        }
      });
    });

    state.__unknown = _unknown.filter(function(u){
      return !newClauses.some(function(cl){ var t = itemOf(cl, 'topic'); return t && t.isProperName && normalizeLatin(t.ro) === u; });
    });
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
        // "dacă nu vrei" — plain negated 'want' (no "să + verb" after it)
        if((clTns === 'notwish' || clTns === 'cannot') && !/\b(sa|to)\b/.test(normalizeLatin(clauseData[ni].text))) clTns = 'neg';
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

    // Grammar frames / questions decide the final ending
    var lastParsed = state.clauses[state.clauses.length - 1];
    state.__altKey = null;
    var lastTxt = clauseData[clauseData.length - 1].text;
    if(detectedTenseKey === 'tense_neg'){
      var _ns = normalizeLatin(lastTxt).replace(/\bnu\b/g, ' ').replace(/(^| )n (?=(am|ai|a|au|ati)\b)/g, ' ');
      if(detectTenseFromText(_ns) === 'past') detectedTenseKey = 'tense_neg_past';
    }
    if(FR.frame){
      var _sub = detectTenseFromText(lastTxt);
      if(FR.frame === 'guess')      detectedTenseKey = _sub === 'past' ? 'tense_guess_past' : _sub === 'future' ? 'tense_guess' : 'tense_guess_now';
      else if(FR.frame === 'seem')  detectedTenseKey = _sub === 'past' ? 'tense_seem_past' : 'tense_seem';
      else if(FR.frame === 'said'){ detectedTenseKey = 'tense_said'; lastParsed.__reportSub = _sub; }
      else detectedTenseKey = FR.frame;
      if(FR.giAdj){ lastParsed.__giAdj = FR.giAdj; lastParsed.__giPast = FR.giPast; }
      if(FR.cmdTo){
        var _ctp = koPronPerson(FR.cmdTo);
        addExtra(lastParsed, { type:'obj', pos:'prefix', ko:FR.cmdTo + '한테', person:_ctp.person, fem:_ctp.fem, dat:true, causee:true });
      }
      if(FR.causeObj){
        var _cop = koPronPerson(FR.causeObj);
        addExtra(lastParsed, { type:'obj', pos:'prefix', ko:FR.causeObj, person:_cop ? _cop.person : 2, fem:_cop ? _cop.fem : false, dat:false, causee:true });
      }
    } else if(FR.question){
      var _fq = foldKeep(raw);
      if(detectedTenseKey === 'tense_wish' && /\b(vrei|vreti|want|would you like)\b/.test(_fq)) detectedTenseKey = 'tense_offer';
      else if(detectedTenseKey === 'tense_pres' && (/\b(noi|shall we|should we)\b/.test(_fq) ||
              _fq.split(/[^a-z]+/).some(function(w){ return /^[a-z]{2,}(em|am|im)$/.test(w) && !!findBestMatch('verb', w); }))){
        detectedTenseKey = 'tense_suggest';
      }
    }

    // "Nu trebuie să vii" is ambiguous in Romanian: "you must not" (default) or
    // "you don't have to" — show the other reading too.
    var _fAll = foldKeep(state.text || '');
    if(detectedTenseKey === 'tense_mustnot' && /\bnu (?:mai )?trebuie\b/.test(_fAll) && !/\bvoie\b/.test(_fAll)) state.__altKey = 'tense_noneed';
    else if(detectedTenseKey === 'tense_noneed' && /\bnu trebuie sa\b/.test(_fAll) && !/\b(neaparat|obligatoriu|daca nu)\b/.test(_fAll)) state.__altKey = 'tense_mustnot';

    // "Locuiesc în Seul de doi ani" — present + "de <durată>" is still going on: -고 있어요
    if(detectedTenseKey === 'tense_pres' && newClauses.some(function(c){ return c.__ongoing; })) detectedTenseKey = 'tense_progressive';

    // subject particle: subjects of subordinate clauses and of reported speech take 이/가
    // (제가 피곤해서…, 엄마가 먹으라고 했어요); main-clause topics keep 은/는
    var SUBORD = { condition:1, when:1, cause1:1, cause2:1, so:1, because_of:1, while:1, after:1, before:1, asap:1, fear:1,
                   concede:1, concede2:1, formal_cause:1, informal_cause:1, during:1, aslong:1, extent:1, proportion:1, purpose:1, purpose2:1 };
    var _toNom = function(cl){
      var tp = itemOf(cl, 'topic');
      if(!tp || !tp.ko || !/(은|는)$/.test(tp.ko)) return;
      var cp = {}; for(var k in tp) cp[k] = tp[k];
      cp.ko = tp.ko.indexOf(' ') > 0 ? tp.ko.replace(/(\S+)$/, function(w){ return koNom(w); }) : koNom(tp.ko);
      setFieldItem(cl, 'topic', cp);
    };
    newClauses.forEach(function(cl, i){
      if(i === newClauses.length - 1) return;
      var cn = itemOf(cl, 'connector');
      if(cn && SUBORD[cn.key || cn.id]) _toNom(cl);
    });
    if(detectedTenseKey === 'tense_said' || detectedTenseKey === 'tense_said_cmd') _toNom(lastParsed);

    // Set detected tense on the last clause
    var tenseEntry = null;
    for(var tt = 0; tt < DATA.connector.length; tt++){
      if(DATA.connector[tt].id === detectedTenseKey){ tenseEntry = DATA.connector[tt]; break; }
    }
    if(tenseEntry){
      setFieldItem(lastParsed, 'connector',
        normalizeItem(tenseEntry, 'connector', DATA.connector.indexOf(tenseEntry)));
    }

    ensureChainLength();
    state.__parsedKo = buildFullOutput().korean;
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
      // parse once the user pauses typing (on a phone every keystroke would re-parse)
      var _parseTimer = null;
      els.freeText.addEventListener('input', function(){
        state.text = els.freeText.value || '';
        clearTimeout(_parseTimer);
        _parseTimer = setTimeout(parseTextIntoClauses, 160);
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
        var hpBtn = event.target.closest('[data-hidden-remove]');
        if(hpBtn){
          event.preventDefault();
          event.stopPropagation();
          var hp = hpBtn.getAttribute('data-hidden-remove'), cut = hp.indexOf(':');
          removeHiddenPart(Number(hp.slice(0, cut)), hp.slice(cut + 1));
          return;
        }
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

      var cBtn = event.target.closest('[data-caiet-idx]');
      if(cBtn){ var cs = savedSentences[Number(cBtn.getAttribute('data-caiet-idx'))]; if(cs) openInCaiet(cs); return; }
      var rBtn = event.target.closest('[data-srs-idx]');
      if(rBtn){ var rs = savedSentences[Number(rBtn.getAttribute('data-srs-idx'))]; if(rs) toggleSentSrs(rs); return; }
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
    if(/[?&]review=1\b/.test(location.search)) setTimeout(startSentenceReview, 300);
    window.ralucaBuilderRender = renderAll;
    // hooks for tools/builder-tests: build the table from cards, read the generated translation
    window.ralucaBuilderTest = {
      translate: function(lang){ return buildTableTranslation(lang); },
      setTable: function(spec){
        state.text = '';
        state.__parsedKo = null;
        state.__question = false;
        if(els.freeText) els.freeText.value = '';
        var used = [];
        state.clauses = spec.map(function(cs){
          var clause = makeEmptyLayoutClause();
          Object.keys(cs).forEach(function(field){
            var bucket = { topic:'subject', topic2:'subject', departure:'location', transit:'location', object1:'object', object2:'object',
                           adverb:'description', adverb2:'description', embSub:'emb_subject', embPred:'emb_pred' }[field] || field;
            var list = DATA[bucket] || [], idx = -1;
            for(var i = 0; i < list.length; i++){
              if(field === 'connector' ? list[i].id === cs[field] : list[i].ko === cs[field]){ idx = i; break; }
            }
            if(idx < 0) throw new Error('no ' + bucket + ' "' + cs[field] + '"');
            setFieldItem(clause, field, normalizeItem(list[idx], bucket, idx));
            if(used.indexOf(field) < 0) used.push(field);
          });
          return clause;
        });
        state.detectedFields = used;
        ensureChainLength();
        renderAll();
      }
    };
  }

  // DATA used to be a ~850-line vocabulary literal baked into this file; it
  // now lives in data/builder-vocab.json like every other feature's data,
  // fetched once here before init() (and everything it calls) runs.
  // ONE dictionary for the whole app: every word of data/vocab-korean.json is
  // also a builder word. builder-vocab.json only adds the grammar layer
  // (particles, conjugated aliases, connectors) — see tools/sync_builder_vocab.py.
  Promise.all([
    fetch('./data/builder-vocab.json').then(function(r){ return r.json(); }),
    fetch('./data/vocab-korean.json').then(function(r){ return r.json(); }).catch(function(){ return []; })
  ])
    .then(function(res){
      DATA = res[0];
      mergeAppDictionary(res[1]);
      LEX = buildLex(res[1]);
      init();
    })
    .catch(function(err){
      console.error('Failed to load builder vocabulary', err);
    });
})();
