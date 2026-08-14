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

  var DATA = {
    subject: [
      {ko:'저는', ro:'eu', en:'I', aliases:['eu','i']},
      {ko:'나는', ro:'eu', en:'I', aliases:[]},
      {ko:'너는', ro:'tu', en:'you', aliases:['tu','you']},
      {ko:'여러분은', ro:'voi toți', en:'you (all)', aliases:['voi toti','voi toți','you all','you guys','toata lumea','toată lumea','everyone']},
      {ko:'우리는', ro:'noi', en:'we', aliases:['noi','we']},
      {ko:'그는', ro:'el', en:'he', aliases:['el','he']},
      {ko:'그녀는', ro:'ea', en:'she', aliases:['ea','she']},
      {ko:'그들은', ro:'ei/ele', en:'they', aliases:['ei','ele','they','ei/ele']},
      {ko:'친구는', ro:'prietenul', en:'friend', aliases:['prietenul','prieten','friend']},
      {ko:'선생님은', ro:'profesorul', en:'teacher', aliases:['profesorul','profesor','teacher']},
      {ko:'학생은', ro:'studentul', en:'student', aliases:['studentul','student']},
      {ko:'소녀는', ro:'fată', en:'girl', aliases:['fata','fată','girl','the girl']},
      {ko:'소년은', ro:'băiat', en:'boy', aliases:['baiat','băiat','boy','the boy']},
      {ko:'민수는', ro:'Minsu', en:'Minsu', aliases:['minsu']},
      {ko:'지수는', ro:'Jisu', en:'Jisu', aliases:['jisu']}
    ],
    time: [
      {ko:'', ro:'', en:'', aliases:[]},
      {ko:'오늘', ro:'astăzi', en:'today', aliases:['astăzi','astazi','azi','today','ziua curenta','ziua curentă','ziua de azi','in ziua de azi','în ziua de azi']},
      {ko:'어제', ro:'ieri', en:'yesterday', aliases:['ieri','yesterday']},
      {ko:'내일', ro:'mâine', en:'tomorrow', aliases:['maine','mâine','tomorrow']},
      {ko:'지금', ro:'acum', en:'now', aliases:['acum','now']},
      {ko:'매일', ro:'în fiecare zi', en:'every day', aliases:['zilnic','in fiecare zi','în fiecare zi','every day']},
      {ko:'아침에', ro:'dimineața', en:'in the morning', aliases:['dimineata','dimineața','morning']},
      {ko:'오후에', ro:'după-amiază', en:'in the afternoon', aliases:['dupa-amiaza','după-amiază','dupa amiaza','după amiază','afternoon']},
      {ko:'저녁에', ro:'seara', en:'in the evening', aliases:['seara','evening']},
      {ko:'주말에', ro:'în weekend', en:'on the weekend', aliases:['weekend']},
      {ko:'오늘 아침에', ro:'azi dimineața', en:'this morning', aliases:['azi dimineata','azi dimineața','today morning','this morning']},
      {ko:'오늘 오후에', ro:'azi după-amiază', en:'this afternoon', aliases:['azi dupa-amiaza','azi după-amiază','azi dupa amiaza','azi după amiază','today afternoon','this afternoon']},
      {ko:'오늘 저녁에', ro:'azi seara', en:'this evening', aliases:['azi seara','today evening','this evening']},
      {ko:'내일 아침에', ro:'mâine dimineața', en:'tomorrow morning', aliases:['maine dimineata','mâine dimineața','tomorrow morning']},
      {ko:'내일 오후에', ro:'mâine după-amiază', en:'tomorrow afternoon', aliases:['maine dupa-amiaza','mâine după-amiază','maine dupa amiaza','mâine după amiază','tomorrow afternoon']},
      {ko:'내일 저녁에', ro:'mâine seara', en:'tomorrow evening', aliases:['maine seara','mâine seara','tomorrow evening']},
      {ko:'어제 아침에', ro:'ieri dimineața', en:'yesterday morning', aliases:['ieri dimineata','ieri dimineața','yesterday morning']},
      {ko:'어제 오후에', ro:'ieri după-amiază', en:'yesterday afternoon', aliases:['ieri dupa-amiaza','ieri după-amiază','ieri dupa amiaza','ieri după amiază','yesterday afternoon']},
      {ko:'어제 저녁에', ro:'ieri seara', en:'yesterday evening', aliases:['ieri seara','yesterday evening']},
      {ko:'밤에', ro:'noaptea', en:'at night', aliases:['noaptea','la noapte','noaptea tarziu','noaptea târziu','at night','night']},
      {ko:'낮에', ro:'ziua', en:'during the day', aliases:['ziua','in timpul zilei','în timpul zilei','during the day','daytime']},
      {ko:'în fiecare săptămână', ro:'în fiecare săptămână', en:'every week', aliases:['in fiecare saptamana','în fiecare săptămână','saptamanal','săptămânal','every week','weekly']},
      {ko:'최근에', ro:'recent', en:'recently', aliases:['recent','in ultima vreme','în ultima vreme','recently','lately']},
      {ko:'앞으로', ro:'pe viitor', en:'in the future', aliases:['pe viitor','in viitor','în viitor','de acum inainte','de acum înainte','in the future','from now on']},
      {ko:'시험 중에', ro:'în timpul examenului', en:'during the exam', aliases:['examen','examenului','pe durata examenului','in timpul examenului','în timpul examenului','during the exam','during exam']},
      {ko:'월요일에', ro:'luni', en:'on Monday', aliases:['luni','monday','on monday']},
      {ko:'화요일에', ro:'marți', en:'on Tuesday', aliases:['marti','marți','tuesday','on tuesday']},
      {ko:'수요일에', ro:'miercuri', en:'on Wednesday', aliases:['miercuri','wednesday','on wednesday']},
      {ko:'목요일에', ro:'joi', en:'on Thursday', aliases:['joi','thursday','on thursday']},
      {ko:'금요일에', ro:'vineri', en:'on Friday', aliases:['vineri','friday','on friday']},
      {ko:'토요일에', ro:'sâmbătă', en:'on Saturday', aliases:['sambata','sâmbătă','saturday','on saturday']},
      {ko:'일요일에', ro:'duminică', en:'on Sunday', aliases:['duminica','duminică','sunday','on sunday']},
      {ko:'지난주에', ro:'săptămâna trecută', en:'last week', aliases:['saptamana trecuta','săptămâna trecută','last week']},
      {ko:'다음 주에', ro:'săptămâna viitoare', en:'next week', aliases:['saptamana viitoare','săptămâna viitoare','next week']},
      {ko:'지난달에', ro:'luna trecută', en:'last month', aliases:['luna trecuta','luna trecută','last month']},
      {ko:'다음 달에', ro:'luna viitoare', en:'next month', aliases:['luna viitoare','next month']},
      {ko:'여름에', ro:'vara', en:'in summer', aliases:['vara','in vara','în vară','summer','in summer']},
      {ko:'겨울에', ro:'iarna', en:'in winter', aliases:['iarna','in iarna','în iarnă','winter','in winter']},
      {ko:'봄에', ro:'primăvara', en:'in spring', aliases:['primavara','primăvara','spring','in spring']},
      {ko:'가을에', ro:'toamna', en:'in autumn', aliases:['toamna','in toamna','în toamnă','fall','autumn','in fall']},
      {ko:'올해', ro:'anul acesta', en:'this year', aliases:['anul acesta','in acest an','în acest an','anul asta','this year']},
      {ko:'작년에', ro:'anul trecut', en:'last year', aliases:['anul trecut','last year']},
      {ko:'내년에', ro:'anul viitor', en:'next year', aliases:['anul viitor','next year']},
      {ko:'이번 세기에', ro:'secolul acesta', en:'this century', aliases:['secolul acesta','secolul curent','in acest secol','în acest secol','this century','current century']},
      {ko:'지난 세기에', ro:'secolul trecut', en:'last century', aliases:['secolul trecut','last century']},
      {ko:'다음 세기에', ro:'secolul viitor', en:'next century', aliases:['secolul viitor','next century']},
      {ko:'이번 밀레니엄에', ro:'mileniul acesta', en:'this millennium', aliases:['mileniul acesta','mileniul curent','in acest mileniu','în acest mileniu','this millennium','current millennium']},
      {ko:'지난 밀레니엄에', ro:'mileniul trecut', en:'last millennium', aliases:['mileniul trecut','last millennium']},
      {ko:'다음 밀레니엄에', ro:'mileniul viitor', en:'next millennium', aliases:['mileniul viitor','next millennium']},
      {ko:'이번 십 년에', ro:'deceniul acesta', en:'this decade', aliases:['deceniul acesta','deceniul curent','in acest deceniu','în acest deceniu','this decade','current decade']},
      {ko:'지난 십 년에', ro:'deceniul trecut', en:'last decade', aliases:['deceniul trecut','last decade']},
      {ko:'다음 십 년에', ro:'deceniul viitor', en:'next decade', aliases:['deceniul viitor','next decade']}
    ],
    location: [
      {ko:'', ro:'', en:'', aliases:[]},
      {ko:'학교에서', ro:'la școală', en:'at school', aliases:['la scoala','la școală','scoala','școală','school']},
      {ko:'집에서', ro:'acasă', en:'at home', aliases:['acasă','acasa','home']},
      {ko:'도서관에서', ro:'la bibliotecă', en:'at the library', aliases:['la biblioteca','la bibliotecă','biblioteca','bibliotecă','library']},
      {ko:'카페에서', ro:'la cafenea', en:'at the cafe', aliases:['la cafenea','cafenea','cafe']},
      {ko:'회사에서', ro:'la serviciu', en:'at work', aliases:['la serviciu','serviciu','la munca','la muncă','work']},
      {ko:'공원에서', ro:'în parc', en:'in the park', aliases:['in parc','în parc','parc','park']},
      {ko:'식당에서', ro:'la restaurant', en:'at the restaurant', aliases:['restaurant']},
      {ko:'교실에서', ro:'în clasă', en:'in the classroom', aliases:['in clasa','în clasă','clasa','clasă','classroom']},
      {ko:'길에서', ro:'pe stradă', en:'on the street', aliases:['pe strada','pe stradă','strada','stradă','street']},
      {ko:'시장에서', ro:'la piață', en:'at the market', aliases:['la piata','la piață','piata','piață','market']},
      {ko:'가게에서', ro:'la magazin', en:'at the store', aliases:['la magazin','magazin','store','shop']},
      {ko:'온라인으로', ro:'online', en:'online', aliases:['online']},
      {ko:'병원에서', ro:'la spital', en:'at the hospital', aliases:['la spital','spital','hospital']},
      {ko:'바다에서', ro:'la mare', en:'at the sea', aliases:['la mare','mare','sea','beach']},
      {ko:'산에서', ro:'la munte', en:'in the mountains', aliases:['la munte','munte','mountain','mountains']},
      {ko:'기차역에서', ro:'la gară', en:'at the train station', aliases:['la gara','la gară','gara','gară','train station','railway station']},
      {ko:'공항에서', ro:'la aeroport', en:'at the airport', aliases:['la aeroport','aeroport','airport']},
      {ko:'박물관에서', ro:'la muzeu', en:'at the museum', aliases:['la muzeu','muzeu','museum']},
      {ko:'영화관에서', ro:'la cinema', en:'at the cinema', aliases:['la cinema','cinema','cinematograf','movie theater','film theater']},
      {ko:'극장에서', ro:'la teatru', en:'at the theater', aliases:['la teatru','teatru','theater','theatre']},
      {ko:'수영장에서', ro:'la piscină', en:'at the pool', aliases:['la piscina','la piscină','piscina','piscină','pool','swimming pool']},
      {ko:'헬스장에서', ro:'la sală', en:'at the gym', aliases:['la sala','la sală','la sala de sport','sala de sport','sală de sport','sala','sală','gym','fitness']},
      {ko:'정류장에서', ro:'la stație', en:'at the bus stop', aliases:['la statie','la stație','statie','stație','bus stop','station','autobuz']},
      {ko:'호텔에서', ro:'la hotel', en:'at the hotel', aliases:['la hotel','hotel']},
      {ko:'해변에서', ro:'la plajă', en:'at the beach', aliases:['la plaja','la plajă','plaja','plajă','beach']},
      {ko:'은행에서', ro:'la bancă', en:'at the bank', aliases:['la banca','la bancă','banca','bancă','bank']},
      {ko:'약국에서', ro:'la farmacie', en:'at the pharmacy', aliases:['la farmacie','farmacie','pharmacy','drugstore']},
      {ko:'우체국에서', ro:'la poștă', en:'at the post office', aliases:['la posta','la poștă','posta','poșta','post office']},
      {ko:'대학교에서', ro:'la universitate', en:'at the university', aliases:['la universitate','universitate','la facultate','facultate','university','college']},
      {ko:'슈퍼마켓에서', ro:'la supermarket', en:'at the supermarket', aliases:['la supermarket','supermarket']},
      {ko:'미용실에서', ro:'la salon', en:'at the salon', aliases:['la salon','salon','la frizerie','frizerie','hairdresser','hair salon']}
    ],
    object: [
      {ko:'', ro:'', en:'', aliases:[]},
      {ko:'한국어를', ro:'limba coreeană', en:'Korean', aliases:['coreeana','coreeană','limba coreeana','limba coreeană','korean']},
      {ko:'점심을', ro:'prânzul', en:'lunch', aliases:['pranzul','prânzul','pranz','prânz','lunch']},
      {ko:'숙제를', ro:'tema', en:'homework', aliases:['tema','homework']},
      {ko:'책을', ro:'cartea', en:'the book', aliases:['cartea','carte','book']},
      {ko:'커피를', ro:'cafeaua', en:'coffee', aliases:['cafeaua','cafea','coffee']},
      {ko:'음악을', ro:'muzica', en:'music', aliases:['muzica','muzică','music']},
      {ko:'영화를', ro:'filmul', en:'the movie', aliases:['filmul','film','movie']},
      {ko:'친구를', ro:'prietenul', en:'friend', aliases:['prietenul','prieten','friend']},
      {ko:'프로젝트를', ro:'proiectul', en:'the project', aliases:['proiectul','proiect','project']},
      {ko:'편지를', ro:'scrisoarea', en:'the letter', aliases:['scrisoarea','scrisoare','letter']},
      {ko:'초콜릿을', ro:'ciocolata', en:'chocolate', aliases:['ciocolata','ciocolată','chocolate']},
      {ko:'음식을', ro:'mâncarea', en:'food', aliases:['mancarea','mâncarea','mancare','mâncare','food']},
      {ko:'테이블을', ro:'masa', en:'the table', aliases:['masa','table','the table','mesele','mesele']},
      {ko:'손님들을 위해', ro:'pentru clienți', en:'for the customers', aliases:['pentru clienti','pentru clienți','pentru clientii','pentru clienții','pentru clientilor','pentru clienților','for customers','for clients','for guests']},
      {ko:'시간이', ro:'timp', en:'time', aliases:['timp','time','timul','un timp']},
      {ko:'차를', ro:'ceaiul', en:'tea', aliases:['ceaiul','ceai','tea']},
      {ko:'주스를', ro:'sucul', en:'juice', aliases:['sucul','suc','juice']},
      {ko:'맥주를', ro:'berea', en:'beer', aliases:['berea','bere','beer']},
      {ko:'돈이', ro:'bani', en:'money', aliases:['bani','money','banul','banii','ban']},
      {ko:'물을', ro:'apă', en:'water', aliases:['apa','apă','water']},
      {ko:'이름을', ro:'numele', en:'name', aliases:['numele','nume','name','my name','my name is']},
      {ko:'전화를', ro:'telefonul', en:'phone', aliases:['telefonul','telefon','phone','call']},
      {ko:'일본어를', ro:'japoneza', en:'Japanese', aliases:['japoneza','japoneză','limba japoneza','limba japoneză','Japanese']},
      {ko:'중국어를', ro:'chineza', en:'Chinese', aliases:['chineza','chineză','limba chineza','limba chineză','Chinese']},
      {ko:'영어를', ro:'engleza', en:'English', aliases:['engleza','engleză','limba engleza','limba engleză','English']},
      {ko:'목표를', ro:'obiectivul', en:'the goal', aliases:['obiectivul','obiectiv','scopul','scop','tinta','ținta','goal','target','objective']},
      {ko:'결과를', ro:'rezultatul', en:'the result', aliases:['rezultatul','rezultat','result']},
      {ko:'경험을', ro:'experiența', en:'experience', aliases:['experienta','experiența','experienta mea','experience']},
      {ko:'기회를', ro:'șansa', en:'the chance', aliases:['sansa','șansa','sanse','șanse','oportunitate','chance','opportunity']},
      {ko:'노력을', ro:'efortul', en:'the effort', aliases:['efortul','efort','effort','stradania','strădania','silinta','silința']},
      {ko:'문제를', ro:'problema', en:'the problem', aliases:['problema','problemă','issue','problem']},
      {ko:'결정을', ro:'decizia', en:'the decision', aliases:['decizia','decizie','hotararea','hotărârea','decision']},
      {ko:'배를', ro:'pere', en:'pears', aliases:['pere','para','pear','pears']},
      {ko:'사과를', ro:'mere', en:'apples', aliases:['mere','mar','măr','apple','apples']},
      {ko:'바나나를', ro:'banane', en:'bananas', aliases:['banane','banana','bananas']},
      {ko:'오렌지를', ro:'portocale', en:'oranges', aliases:['portocale','portocala','portocală','orange','oranges']},
      {ko:'포도를', ro:'struguri', en:'grapes', aliases:['struguri','strugure','grape','grapes']},
      {ko:'딸기를', ro:'căpșuni', en:'strawberries', aliases:['capsuni','căpșuni','capsuna','căpșună','strawberry','strawberries']},
      {ko:'채소를', ro:'legume', en:'vegetables', aliases:['legume','leguma','legumă','vegetable','vegetables','verdete','verdeturi','verdeturi']},
      {ko:'과일을', ro:'fructe', en:'fruit', aliases:['fructe','fruct','fruit','fruits']},
      {ko:'집을', ro:'o casă', en:'a house', aliases:['casa','casă','o casa','o casă','locuinta','locuință','o locuinta','o locuință','house','a house','home']},
      {ko:'돈을', ro:'banii', en:'the money', aliases:['banii','bani','banu','money','the money','cash']},
      {ko:'차를', ro:'o mașină', en:'a car', aliases:['masina','mașina','mașină','o masina','o mașina','o mașină','masini','mașini','car','a car','vehicle']},
      {ko:'직장을', ro:'un job', en:'a job', aliases:['un job','job','slujba','slujbă','o slujba','o slujbă','serviciu','un serviciu','locul de munca','locul de muncă','work','a job']},
      {ko:'비자를', ro:'o viză', en:'a visa', aliases:['viza','viză','o viza','o viză','visa','a visa']},
      {ko:'표를', ro:'un bilet', en:'a ticket', aliases:['bilet','un bilet','bilete','ticket','a ticket']},
      {ko:'수업을', ro:'cursul', en:'the class', aliases:['cursul','curs','lectia','lecția','lectie','lecție','lesson','class','the class']},
      {ko:'시험을', ro:'examenul', en:'the exam', aliases:['examenul','examen','testul','test','exam','the exam']},
      {ko:'컴퓨터를', ro:'computerul', en:'the computer', aliases:['computerul','computer','laptopul','laptop','calculatorul','calculator','pc']},
      {ko:'선물을', ro:'cadoul', en:'the gift', aliases:['cadoul','cadou','gift','present','a gift']},
      {ko:'뉴스를', ro:'știrile', en:'the news', aliases:['stirile','știrile','stiri','știri','news','the news']},
      {ko:'사진을', ro:'fotografia', en:'the photo', aliases:['fotografia','fotografie','foto','poza','poze','picture','photo','photos']},
      {ko:'영상을', ro:'videoclipul', en:'the video', aliases:['videoclip','videoclipul','video','the video']},
      {ko:'메시지를', ro:'mesajul', en:'the message', aliases:['mesajul','mesaj','message','the message','msg']},
      {ko:'약을', ro:'medicamentul', en:'the medicine', aliases:['medicamentul','medicament','medicamente','medicine','medication','pastila','pastilă','pill']}
    ],
    description: [
      {ko:'', ro:'', en:'', aliases:[]},
      {ko:'빨리', ro:'repede', en:'quickly', aliases:['repede','quickly','fast']},
      {ko:'천천히', ro:'încet', en:'slowly', aliases:['incet','încet','slowly']},
      {ko:'열심히', ro:'cu sârguință', en:'diligently', aliases:['cu sarguinta','cu sârguință','serios','din greu','diligently','hard']},
      {ko:'조용히', ro:'în liniște', en:'quietly', aliases:['in liniste','în liniște','quietly']},
      {ko:'같이', ro:'împreună', en:'together', aliases:['împreună','impreuna','together']},
      {ko:'혼자', ro:'singur', en:'alone', aliases:['singur','singura','alone']},
      {ko:'다시', ro:'din nou', en:'again', aliases:['din nou','again']},
      {ko:'미리', ro:'dinainte', en:'in advance', aliases:['dinainte','in advance']},
      {ko:'정말', ro:'foarte', en:'really', aliases:['foarte','really']},
      {ko:'조금', ro:'puțin', en:'a little', aliases:['putin','puțin','little']},
      {ko:'자주', ro:'des', en:'often', aliases:['des','often']},
      {ko:'깨끗이', ro:'curat', en:'cleanly', aliases:['curat','curata','curată','clean','cleanly','neat','ingrijit','îngrijit']},
      {ko:'예쁘게', ro:'frumos', en:'beautifully', aliases:['frumos','frumoasa','frumoasă','beautiful','beautifully','pretty','prettily','dragut','drăguț']},
      {ko:'많이', ro:'mult', en:'a lot', aliases:['mult','multa','multă','a lot','very much','much','lots']},
      {ko:'잘', ro:'bine', en:'well', aliases:['bine','mai bine','well','do well','correctly']},
      {ko:'행복하게', ro:'cu bucurie', en:'happily', aliases:['happily','cu bucurie','cu fericire','in mod fericit']},
      {ko:'슬프게', ro:'cu tristețe', en:'sadly', aliases:['sadly','cu tristete','cu tristețe','in mod trist']},
      {ko:'화나게', ro:'cu furie', en:'angrily', aliases:['angrily','cu furie','cu manie','in mod furios']},
      {ko:'피곤하게', ro:'cu oboseală', en:'tiredly', aliases:['tiredly','cu oboseala','cu oboseală','exhaustedly']},
      {ko:'눈이 큰', ro:'cu ochii mari', en:'with big eyes', modifiesSubject:true, aliases:['cu ochii mari','cu ochi mari','ochii mari','ochi mari','with big eyes','big eyes','big-eyed']},
      {ko:'머리가 긴', ro:'cu părul lung', en:'with long hair', modifiesSubject:true, aliases:['cu parul lung','cu părul lung','parul lung','părul lung','with long hair','long hair']},
      {ko:'키가 큰', ro:'înalt', en:'tall', modifiesSubject:true, aliases:['inalt','înalt','inalta','înaltă','tall']},
      {ko:'키가 작은', ro:'scund', en:'short', modifiesSubject:true, aliases:['scund','scunda','scundă','short','mic','mica','mică']},
      {ko:'큰 목소리로', ro:'cu voce tare', en:'with a loud voice', aliases:['cu voce tare','voce tare','with loud voice','with a loud voice','loudly']},
      {ko:'항상', ro:'întotdeauna', en:'always', aliases:['intotdeauna','întotdeauna','mereu','always','tot timpul']},
      {ko:'절대', ro:'niciodată', en:'never', aliases:['niciodata','niciodată','deloc','never','in niciun caz','în niciun caz']},
      {ko:'가끔', ro:'uneori', en:'sometimes', aliases:['uneori','cateodata','câteodată','cateodată','sometimes','din cand in cand','din când în când']},
      {ko:'드물게', ro:'rar', en:'rarely', aliases:['rar','rareori','rarely','seldom','arareori']},
      {ko:'즉시', ro:'imediat', en:'immediately', aliases:['imediat','imediat dupa','imediat după','immediately','right away','instant']},
      {ko:'실수로', ro:'din greșeală', en:'by mistake', aliases:['din greseala','din greșeală','accidental','accidentally','by mistake','by accident','gresit','greșit']},
      {ko:'의도적으로', ro:'intenționat', en:'intentionally', aliases:['intentionat','intenționat','deliberately','on purpose','intentionally','dinadins']},
      {ko:'점점', ro:'treptat', en:'gradually', aliases:['treptat','gradual','din ce in ce','din ce in ce mai','gradually','increasingly']},
      {ko:'결국', ro:'în cele din urmă', en:'in the end', aliases:['in cele din urma','în cele din urmă','pana la urma','până la urmă','finally','in the end','ultimately']},
      {ko:'갑자기', ro:'brusc', en:'suddenly', aliases:['brusc','deodata','deodată','pe neasteptate','pe neașteptate','suddenly','all of a sudden']},
      {ko:'더욱', ro:'și mai mult', en:'even more', aliases:['si mai mult','și mai mult','tot mai mult','even more','more and more']},
      {ko:'특히', ro:'în special', en:'especially', aliases:['in special','în special','mai ales','cu precadere','cu precădere','especially','in particular']},
      {ko:'물론', ro:'desigur', en:'of course', aliases:['desigur','bineinteles','bineînțeles','fireste','firește','of course','certainly']},
      {ko:'오히려', ro:'dimpotrivă', en:'on the contrary', aliases:['dimpotriva','dimpotrivă','ba dimpotriva','on the contrary','rather','instead']},
      {ko:'대신에', ro:'în locul lui', en:'in his place', aliases:['in locul lui','în locul lui','in locul meu','în locul meu','in locul tau','în locul tău','in locul ei','în locul ei','in locul lor','în locul lor','in locul nostru','în locul nostru','in his place','in her place','in their place','in my place']}

    ],
    verb: [
      {ko:'공부하다', ro:'a studia', en:'to study', aliases:['studiez','studiezi','studiem','studiati','studiați','studiaza','studiază','studia','invat','învăț','study','studies','learn','studiat','am studiat','a studiat','voi studia','studied','will study'], final:'공부해요', forms:{none:'공부해요',seq:'공부하고',cause1:'공부해서',cause2:'공부하니까',condition:'공부하면',contrast1:'공부하지만',contrast2:'공부하는데',purpose:'공부하려고',result:'공부하게 되다'}},
      {ko:'먹다', ro:'a mânca', en:'to eat', aliases:['mananc','mănânc','mananci','mănânci','mancam','mâncăm','mancati','mâncați','mananca','mănâncă','eat','manca','mânca','mancat','mâncat','am mancat','am mâncat','a mancat','a mâncat','voi manca','voi mânca','ate','will eat'], final:'먹어요', forms:{none:'먹어요',seq:'먹고',cause1:'먹어서',cause2:'먹으니까',condition:'먹으면',contrast1:'먹지만',contrast2:'먹는데',purpose:'먹으려고',result:'먹게 되다'}},
      {ko:'가다', ro:'a merge', en:'to go', aliases:['merg','mergi','mergem','mergeti','mergeți','plec','merge','go','leave','mers','am mers','a mers','voi merge','went','will go','ma duc','mă duc','te duci','se duce','ne ducem','va duceti','vă duceți','se duc','am mers','dus','am dus'], final:'가요', forms:{none:'가요',seq:'가고',cause1:'가서',cause2:'가니까',condition:'가면',contrast1:'가지만',contrast2:'가는데',purpose:'가려고',result:'가게 되다'}},
      {ko:'오다', ro:'a veni', en:'to come', aliases:['vin','vii','venim','veniti','veniți','vine','veni','come','venit','am venit','a venit','voi veni','came','will come'], final:'와요', forms:{none:'와요',seq:'오고',cause1:'와서',cause2:'오니까',condition:'오면',contrast1:'오지만',contrast2:'오는데',purpose:'오려고',result:'오게 되다'}},
      {ko:'보다', ro:'a vedea', en:'to see', aliases:['vad','văd','vezi','vede','vedea','vada','vadă','vazi','văzi','see','watch','vazut','văzut','am vazut','am văzut','a vazut','a văzut','voi vedea','saw','will see'], final:'봐요', forms:{none:'봐요',seq:'보고',cause1:'봐서',cause2:'보니까',condition:'보면',contrast1:'보지만',contrast2:'보는데',purpose:'보려고',result:'보게 되다'}},
      {ko:'읽다', ro:'a citi', en:'to read', aliases:['citesc','citesti','citești','citeste','citește','citim','cititi','citiți','citi','read','citit','am citit','a citit','voi citi','will read'], final:'읽어요', forms:{none:'읽어요',seq:'읽고',cause1:'읽어서',cause2:'읽으니까',condition:'읽으면',contrast1:'읽지만',contrast2:'읽는데',purpose:'읽으려고',result:'읽게 되다'}},
      {ko:'쓰다', ro:'a scrie', en:'to write', aliases:['scriu','scrii','scriem','scrieti','scrieți','scrie','write','scris','am scris','a scris','voi scrie','wrote','will write'], final:'써요', forms:{none:'써요',seq:'쓰고',cause1:'써서',cause2:'쓰니까',condition:'쓰면',contrast1:'쓰지만',contrast2:'쓰는데',purpose:'쓰려고',result:'쓰게 되다'}},
      {ko:'만나다', ro:'a întâlni', en:'to meet', aliases:['intalnesc','întâlnesc','meet','intalni','întâlni','intalnit','întâlnit','am intalnit','am întâlnit','a intalnit','a întâlnit','voi intalni','voi întâlni','met','will meet'], final:'만나요', forms:{none:'만나요',seq:'만나고',cause1:'만나서',cause2:'만나니까',condition:'만나면',contrast1:'만나지만',contrast2:'만나는데',purpose:'만나려고',result:'만나게 되다'}},
      {ko:'쉬다', ro:'a se odihni', en:'to rest', aliases:['odihnesc','rest','odihni','odihnit','m-am odihnit','s-a odihnit','ne-am odihnit','ma voi odihni','rested','will rest'], final:'쉬어요', forms:{none:'쉬어요',seq:'쉬고',cause1:'쉬어서',cause2:'쉬니까',condition:'쉬면',contrast1:'쉬지만',contrast2:'쉬는데',purpose:'쉬려고',result:'쉬게 되다'}},
      {ko:'일하다', ro:'a lucra', en:'to work', aliases:['lucrez','lucrezi','lucram','lucrati','lucrați','lucrează','lucreaza','lucra','work','lucrat','am lucrat','a lucrat','voi lucra','worked','will work'], final:'일해요', forms:{none:'일해요',seq:'일하고',cause1:'일해서',cause2:'일하니까',condition:'일하면',contrast1:'일하지만',contrast2:'일하는데',purpose:'일하려고',result:'일하게 되다'}},
      {ko:'운동하다', ro:'a face sport', en:'to exercise', aliases:['fac sport','sport','exercise','facut sport','am facut sport','a facut sport','voi face sport','exercised','will exercise'], final:'운동해요', forms:{none:'운동해요',seq:'운동하고',cause1:'운동해서',cause2:'운동하니까',condition:'운동하면',contrast1:'운동하지만',contrast2:'운동하는데',purpose:'운동하려고',result:'운동하게 되다'}},
      {ko:'준비하다', ro:'a pregăti', en:'to prepare', aliases:['pregatesc','pregătesc','prepare','pregati','pregăti','pregatit','pregătit','am pregatit','am pregătit','a pregatit','a pregătit','voi pregati','voi pregăti','prepared','will prepare'], final:'준비해요', forms:{none:'준비해요',seq:'준비하고',cause1:'준비해서',cause2:'준비하니까',condition:'준비하면',contrast1:'준비하지만',contrast2:'준비하는데',purpose:'준비하려고',result:'준비하게 되다'}},
      {ko:'배우다', ro:'a învăța', en:'to learn', aliases:['invat','inveti','înveți','invatam','învatam','invatati','învățați','învăț','learn','invatat','învățat','am invatat','am învățat','a invatat','a învățat','voi invata','voi învăța','learned','will learn'], final:'배워요', forms:{none:'배워요',seq:'배우고',cause1:'배워서',cause2:'배우니까',condition:'배우면',contrast1:'배우지만',contrast2:'배우는데',purpose:'배우려고',result:'배우게 되다'}},
      {ko:'듣다', ro:'a asculta', en:'to listen', aliases:['ascult','asculta','listen','ascultat','am ascultat','a ascultat','voi asculta','listened','will listen'], final:'들어요', forms:{none:'들어요',seq:'듣고',cause1:'들어서',cause2:'들으니까',condition:'들으면',contrast1:'듣지만',contrast2:'듣는데',purpose:'들으려고',result:'듣게 되다'}},
      {ko:'만들다', ro:'a face', en:'to make', aliases:['fac','creeaza','creează','make','create','facut','am facut','a facut','voi face','made','will make'], final:'만들어요', forms:{none:'만들어요',seq:'만들고',cause1:'만들어서',cause2:'만드니까',condition:'만들면',contrast1:'만들지만',contrast2:'만드는데',purpose:'만들려고',result:'만들게 되다'}},
      {ko:'사다', ro:'a cumpăra', en:'to buy', aliases:['cumpar','cumpăr','cumpăra','cumpere','cumperi','cumpara','cumpără','cumparam','cumpărăm','cumparati','cumpărați','buy','cumparat','cumpărat','am cumparat','a cumparat','voi cumpara','bought','will buy'], final:'사요', forms:{none:'사요',seq:'사고',cause1:'사서',cause2:'사니까',condition:'사면',contrast1:'사지만',contrast2:'사는데',purpose:'사려고',result:'사게 되다'}},
      {ko:'주다', ro:'a da', en:'to give', aliases:['dau','da','give','dat','am dat','a dat','voi da','gave','will give'], final:'줘요', forms:{none:'줘요',seq:'주고',cause1:'줘서',cause2:'주니까',condition:'주면',contrast1:'주지만',contrast2:'주는데',purpose:'주려고',result:'주게 되다'}},
      {ko:'기다리다', ro:'a aștepta', en:'to wait', aliases:['astept','aștept','asteapta','așteaptă','asteptam','așteptăm','wait','asteptat','așteptat','am asteptat','am așteptat','a asteptat','a așteptat','voi astepta','voi aștepta','waited','will wait'], final:'기다려요', forms:{none:'기다려요',seq:'기다리고',cause1:'기다려서',cause2:'기다리니까',condition:'기다리면',contrast1:'기다리지만',contrast2:'기다리는데',purpose:'기다리려고',result:'기다리게 되다'}},
      {ko:'감사하다', ro:'a mulțumi', en:'to thank', aliases:['multumesc','mulțumesc','multumim','mulțumim','multumesti','mulțumești','thank','multumit','mulțumit','am multumit','am mulțumit','a multumit','a mulțumit','voi multumi','voi mulțumi','thanked','will thank'], final:'감사해요', forms:{none:'감사해요',seq:'감사하고',cause1:'감사해서',cause2:'감사하니까',condition:'감사하면',contrast1:'감사하지만',contrast2:'감사하는데',purpose:'감사하려고',result:'감사하게 되다'}},
      {ko:'웃다', ro:'a zâmbi', en:'to smile', aliases:['zambesc','zâmbesc','zambesti','zâmbești','zambeste','zâmbește','zambi','zâmbi','smile','smiles','zambit','zâmbit','am zambit','am zâmbit','a zambit','a zâmbit','voi zambi','voi zâmbi','smiled','will smile'], final:'웃어요', forms:{none:'웃어요',seq:'웃고',cause1:'웃어서',cause2:'웃으니까',condition:'웃으면',contrast1:'웃지만',contrast2:'웃는데',purpose:'웃으려고',result:'웃게 되다'}},
      {ko:'남기다', ro:'a lăsa', en:'to leave', aliases:['las','lași','lasati','lăsați','lasa','lăsa','leave','lasat','lăsat','am lasat','am lăsat','a lasat','a lăsat','voi lasa','voi lăsa','left','will leave'], final:'남겨요', forms:{none:'남겨요',seq:'남기고',cause1:'남겨서',cause2:'남기니까',condition:'남기면',contrast1:'남기지만',contrast2:'남기는데',purpose:'남기려고',result:'남기게 되다'}},
      {ko:'마시다', ro:'a bea', en:'to drink', aliases:['beau','bei','bea','bem','beti','beți','baut','băut','am baut','am băut','a baut','a băut','voi bea','drink','drinks','drank','drinking','will drink'], final:'마셔요', forms:{none:'마셔요',seq:'마시고',cause1:'마셔서',cause2:'마시니까',condition:'마시면',contrast1:'마시지만',contrast2:'마시는데',purpose:'마시려고',result:'마시게 되다'}},
      {ko:'자다', ro:'a dormi', en:'to sleep', aliases:['dorm','dormi','doarme','dormim','dormiti','dormiți','dormit','am dormit','a dormit','voi dormi','sleep','sleeps','slept','sleeping','will sleep'], final:'자요', forms:{none:'자요',seq:'자고',cause1:'자서',cause2:'자니까',condition:'자면',contrast1:'자지만',contrast2:'자는데',purpose:'자려고',result:'자게 되다'}},
      {ko:'노래하다', ro:'a cânta', en:'to sing', aliases:['cant','cânt','canti','cânți','canta','cântă','cantam','cântăm','cantat','cântat','am cantat','am cântat','a cantat','a cântat','voi canta','voi cânta','sing','sings','sang','singing','will sing'], final:'노래해요', forms:{none:'노래해요',seq:'노래하고',cause1:'노래해서',cause2:'노래하니까',condition:'노래하면',contrast1:'노래하지만',contrast2:'노래하는데',purpose:'노래하려고',result:'노래하게 되다'}},
      {ko:'울다', ro:'a plânge', en:'to cry', aliases:['plang','plâng','plangi','plângi','plange','plânge','plangem','plângem','plans','plâns','am plans','am plâns','a plans','a plâns','voi plange','voi plânge','cry','cries','cried','crying','will cry'], final:'울어요', forms:{none:'울어요',seq:'울고',cause1:'울어서',cause2:'우니까',condition:'울면',contrast1:'울지만',contrast2:'우는데',purpose:'울려고',result:'울게 되다'}},
      {ko:'있다', ro:'a avea', en:'to have', aliases:['am','ai','are','avem','aveti','aveți','au','am avut','ai avut','a avut','voi aves','vom aveo','a-vea','have','has','had','i have','you have','we have','he has','she has','they have'], final:'있어요', forms:{none:'있어요',seq:'있고',cause1:'있어서',cause2:'있으니까',condition:'있으면',contrast1:'있지만',contrast2:'있는데',purpose:'있으려고',result:'있게 되다'}},
      {ko:'사랑하다', ro:'a iubi', en:'to love', aliases:['iubesc','iubesti','iubești','iubeste','iubește','iubim','iubiti','iubiți','iubit','am iubit','a iubit','voi iubi','love','loves','loved','will love'], final:'사랑해요', forms:{none:'사랑해요',seq:'사랑하고',cause1:'사랑해서',cause2:'사랑하니까',condition:'사랑하면',contrast1:'사랑하지만',contrast2:'사랑하는데',purpose:'사랑하려고',result:'사랑하게 되다'}},
      {ko:'말하다', ro:'a vorbi', en:'to speak', aliases:['vorbesc','vorbesti','vorbești','vorbeste','vorbește','vorbim','vorbiti','vorbiți','vorbit','am vorbit','a vorbit','voi vorbi','speak','talk','speaks','talks','spoke','talked','will speak'], final:'말해요', forms:{none:'말해요',seq:'말하고',cause1:'말해서',cause2:'말하니까',condition:'말하면',contrast1:'말하지만',contrast2:'말하는데',purpose:'말하려고',result:'말하게 되다'}},
      {ko:'원하다', ro:'a vrea', en:'to want', aliases:['vreau','vrei','vrea','vrem','vreti','vreți','vor','voi vrea','am vrut','a vrut','want','wants','wanted','will want','wish','wishes'], final:'원해요', forms:{none:'원해요',seq:'원하고',cause1:'원해서',cause2:'원하니까',condition:'원하면',contrast1:'원하지만',contrast2:'원하는데',purpose:'원하려고',result:'원하게 되다'}},
      {ko:'알다', ro:'a ști', en:'to know', aliases:['stiu','știu','stie','știe','stim','știm','stiti','știți','stiut','știut','am stiut','am știut','a stiut','a știut','voi sti','voi ști','know','knows','knew','will know'], final:'알아요', forms:{none:'알아요',seq:'알고',cause1:'알아서',cause2:'아니까',condition:'알면',contrast1:'알지만',contrast2:'아는데',purpose:'알려고',result:'알게 되다'}},
      {ko:'돕다', ro:'a ajuta', en:'to help', aliases:['ajut','ajuti','ajuți','ajuta','ajută','ajutam','ajutăm','ajutat','am ajutat','a ajutat','voi ajuta','help','helps','helped','will help'], final:'도와요', forms:{none:'도와요',seq:'돕고',cause1:'도와서',cause2:'도우니까',condition:'도우면',contrast1:'돕지만',contrast2:'돕는데',purpose:'도우려고',result:'돕게 되다'}},
      {ko:'남다', ro:'a rămâne', en:'to stay', aliases:['raman','rămân','ramai','rămâi','ramane','rămâne','ramanem','rămânem','ramas','rămas','am ramas','am rămas','a ramas','a rămas','voi ramane','voi rămâne','stay','stays','stayed','remain','remained','will stay'], final:'남아요', forms:{none:'남아요',seq:'남고',cause1:'남아서',cause2:'남으니까',condition:'남으면',contrast1:'남지만',contrast2:'남는데',purpose:'남으려고',result:'남게 되다'}},
      {ko:'도착하다', ro:'a ajunge', en:'to arrive', aliases:['ajung','ajungi','ajunge','ajungem','ajuns','am ajuns','a ajuns','voi ajunge','arrive','arrives','arrived','get there','will arrive'], final:'도착해요', forms:{none:'도착해요',seq:'도착하고',cause1:'도착해서',cause2:'도착하니까',condition:'도착하면',contrast1:'도착하지만',contrast2:'도착하는데',purpose:'도착하려고',result:'도착하게 되다'}},
      {ko:'돌아오다', ro:'a se întoarce', en:'to return', aliases:['ma intorc','mă întorc','te intorci','te întorci','se intoarce','se întoarce','intors','întors','m-am intors','m-am întors','s-a intors','s-a întors','ma voi intoarce','mă voi întoarce','return','returns','returned','come back','came back','will return'], final:'돌아와요', forms:{none:'돌아와요',seq:'돌아오고',cause1:'돌아와서',cause2:'돌아오니까',condition:'돌아오면',contrast1:'돌아오지만',contrast2:'돌아오는데',purpose:'돌아오려고',result:'돌아오게 되다'}},
      {ko:'요리하다', ro:'a găti', en:'to cook', aliases:['gatesc','gătesc','gatesti','gătești','gateste','gătește','gatim','gătim','gatit','gătit','am gatit','am gătit','a gatit','a gătit','voi gati','voi găti','cook','cooks','cooked','cooking','will cook'], final:'요리해요', forms:{none:'요리해요',seq:'요리하고',cause1:'요리해서',cause2:'요리하니까',condition:'요리하면',contrast1:'요리하지만',contrast2:'요리하는데',purpose:'요리하려고',result:'요리하게 되다'}},
      {ko:'씻다', ro:'a (se) spăla', en:'to wash', aliases:['ma spal','mă spăl','spala','spală','spalat','spălat','am spalat','am spălat','a spalat','a spălat','voi spala','voi spăla','wash','washes','washed','washing','will wash'], final:'씻어요', forms:{none:'씻어요',seq:'씻고',cause1:'씻어서',cause2:'씻으니까',condition:'씻으면',contrast1:'씻지만',contrast2:'씻는데',purpose:'씻으려고',result:'씻게 되다'}},
      {ko:'찾다', ro:'a căuta', en:'to search', aliases:['caut','cauti','cauți','cauta','caută','cautat','căutat','am cautat','am căutat','a cautat','a căutat','voi cauta','voi căuta','gasesc','găsesc','gasit','găsit','am gasit','am găsit','search','searches','searched','find','finds','found','look for','will search','will find'], final:'찾아요', forms:{none:'찾아요',seq:'찾고',cause1:'찾아서',cause2:'찾으니까',condition:'찾으면',contrast1:'찾지만',contrast2:'찾는데',purpose:'찾으려고',result:'찾게 되다'}},
      {ko:'열다', ro:'a deschide', en:'to open', aliases:['deschid','deschizi','deschide','deschidem','deschis','am deschis','a deschis','voi deschide','open','opens','opened','opening','will open'], final:'열어요', forms:{none:'열어요',seq:'열고',cause1:'열어서',cause2:'여니까',condition:'열면',contrast1:'열지만',contrast2:'여는데',purpose:'열려고',result:'열게 되다'}},
      {ko:'닫다', ro:'a închide', en:'to close', aliases:['inchid','închid','inchizi','închidem','inchis','închis','am inchis','am închis','a inchis','a închis','voi inchide','voi închide','close','closes','closed','closing','will close'], final:'닫아요', forms:{none:'닫아요',seq:'닫고',cause1:'닫아서',cause2:'닫으니까',condition:'닫으면',contrast1:'닫지만',contrast2:'닫는데',purpose:'닫으려고',result:'닫게 되다'}},
      {ko:'받다', ro:'a primi', en:'to receive', aliases:['primesc','primesti','primești','primeste','primește','primim','primit','am primit','a primit','voi primi','receive','receives','received','get','gets','got','will receive','will get'], final:'받아요', forms:{none:'받아요',seq:'받고',cause1:'받아서',cause2:'받으니까',condition:'받으면',contrast1:'받지만',contrast2:'받는데',purpose:'받으려고',result:'받게 되다'}},
      {ko:'놓다', ro:'a pune', en:'to put', aliases:['pun','pui','pune','punem','puneti','puneți','pus','am pus','a pus','voi pune','put','puts','placing','place','will put'], final:'놓아요', forms:{none:'놓아요',seq:'놓고',cause1:'놓아서',cause2:'놓으니까',condition:'놓으면',contrast1:'놓지만',contrast2:'놓는데',purpose:'놓으려고',result:'놓게 되다'}},
      {ko:'생각하다', ro:'a (se) gândi', en:'to think', aliases:['ma gandesc','mă gândesc','gandesc','gândesc','te gandesti','te gândești','se gandeste','se gândește','gandit','gândit','m-am gandit','m-am gândit','s-a gandit','s-a gândit','ma voi gandi','mă voi gândi','think','thinks','thought','thinking','will think'], final:'생각해요', forms:{none:'생각해요',seq:'생각하고',cause1:'생각해서',cause2:'생각하니까',condition:'생각하면',contrast1:'생각하지만',contrast2:'생각하는데',purpose:'생각하려고',result:'생각하게 되다'}},
      {ko:'멈추다', ro:'a opri', en:'to stop', aliases:['opresc','opresti','oprești','opreste','oprește','oprim','oprit','am oprit','a oprit','voi opri','stop','stops','stopped','stopping','halt','will stop'], final:'멈춰요', forms:{none:'멈춰요',seq:'멈추고',cause1:'멈춰서',cause2:'멈추니까',condition:'멈추면',contrast1:'멈추지만',contrast2:'멈추는데',purpose:'멈추려고',result:'멈추게 되다'}},
      {ko:'계속하다', ro:'a continua', en:'to continue', aliases:['continui','continua','continuă','continuam','continuați','continuat','am continuat','a continuat','voi continua','continue','continues','continued','continuing','will continue','keep going'], final:'계속해요', forms:{none:'계속해요',seq:'계속하고',cause1:'계속해서',cause2:'계속하니까',condition:'계속하면',contrast1:'계속하지만',contrast2:'계속하는데',purpose:'계속하려고',result:'계속하게 되다'}},
      {ko:'선택하다', ro:'a alege', en:'to choose', aliases:['aleg','alegi','alege','alegem','ales','am ales','a ales','voi alege','choose','chooses','chose','chosen','pick','picks','picked','will choose','select'], final:'선택해요', forms:{none:'선택해요',seq:'선택하고',cause1:'선택해서',cause2:'선택하니까',condition:'선택하면',contrast1:'선택하지만',contrast2:'선택하는데',purpose:'선택하려고',result:'선택하게 되다'}},
      {ko:'잃다', ro:'a pierde', en:'to lose', aliases:['pierd','pierzi','pierde','pierdem','pierdut','am pierdut','a pierdut','voi pierde','lose','loses','lost','losing','will lose'], final:'잃어요', forms:{none:'잃어요',seq:'잃고',cause1:'잃어서',cause2:'잃으니까',condition:'잃으면',contrast1:'잃지만',contrast2:'잃는데',purpose:'잃으려고',result:'잃게 되다'}},
      {ko:'보내다', ro:'a trimite', en:'to send', aliases:['trimit','trimiti','trimiți','trimite','trimitem','trimis','am trimis','a trimis','voi trimite','send','sends','sent','sending','will send'], final:'보내요', forms:{none:'보내요',seq:'보내고',cause1:'보내서',cause2:'보내니까',condition:'보내면',contrast1:'보내지만',contrast2:'보내는데',purpose:'보내려고',result:'보내게 되다'}},
      {ko:'사용하다', ro:'a folosi', en:'to use', aliases:['folosesc','folosesti','folosești','foloseste','folosește','folosim','folosit','am folosit','a folosit','voi folosi','use','uses','used','using','will use'], final:'사용해요', forms:{none:'사용해요',seq:'사용하고',cause1:'사용해서',cause2:'사용하니까',condition:'사용하면',contrast1:'사용하지만',contrast2:'사용하는데',purpose:'사용하려고',result:'사용하게 되다'}},
      {ko:'여행하다', ro:'a călători', en:'to travel', aliases:['calatoresc','călătoresc','calatoresti','călătorești','calatorit','călătorit','am calatorit','am călătorit','a calatorit','a călătorit','voi calatori','voi călători','travel','travels','traveled','travelling','will travel'], final:'여행해요', forms:{none:'여행해요',seq:'여행하고',cause1:'여행해서',cause2:'여행하니까',condition:'여행하면',contrast1:'여행하지만',contrast2:'여행하는데',purpose:'여행하려고',result:'여행하게 되다'}},
      {ko:'설명하다', ro:'a explica', en:'to explain', aliases:['explic','explici','explica','explicam','explicat','am explicat','a explicat','voi explica','explain','explains','explained','explaining','will explain'], final:'설명해요', forms:{none:'설명해요',seq:'설명하고',cause1:'설명해서',cause2:'설명하니까',condition:'설명하면',contrast1:'설명하지만',contrast2:'설명하는데',purpose:'설명하려고',result:'설명하게 되다'}},
      {ko:'묻다', ro:'a întreba', en:'to ask', aliases:['intreb','întreb','intrebi','întrebi','intreaba','întreabă','intrebam','întrebăm','intrebat','întrebat','am intrebat','am întrebat','a intrebat','a întrebat','voi intreba','voi întreba','ask','asks','asked','asking','will ask'], final:'물어요', forms:{none:'물어요',seq:'묻고',cause1:'물어서',cause2:'물으니까',condition:'물으면',contrast1:'묻지만',contrast2:'묻는데',purpose:'물으려고',result:'묻게 되다'}},
      {ko:'달리다', ro:'a alerga', en:'to run', aliases:['alerg','alergi','alearga','aleargă','alergam','alergăm','alergat','am alergat','a alergat','voi alerga','run','runs','ran','running','will run'], final:'달려요', forms:{none:'달려요',seq:'달리고',cause1:'달려서',cause2:'달리니까',condition:'달리면',contrast1:'달리지만',contrast2:'달리는데',purpose:'달리려고',result:'달리게 되다'}},
      {ko:'가져오다', ro:'a aduce', en:'to bring', aliases:['aduc','aduci','aduce','aducem','adus','am adus','a adus','voi aduce','bring','brings','brought','bringing','will bring'], final:'가져와요', forms:{none:'가져와요',seq:'가져오고',cause1:'가져와서',cause2:'가져오니까',condition:'가져오면',contrast1:'가져오지만',contrast2:'가져오는데',purpose:'가져오려고',result:'가져오게 되다'}},
      {ko:'산책하다', ro:'a se plimba', en:'to walk', aliases:['ma plimb','mă plimb','te plimbi','se plimba','se plimbă','plimbam','plimbăm','plimbat','m-am plimbat','s-a plimbat','ne-am plimbat','ma voi plimba','mă voi plimba','walk','walks','walked','stroll','strolling','will walk'], final:'산책해요', forms:{none:'산책해요',seq:'산책하고',cause1:'산책해서',cause2:'산책하니까',condition:'산책하면',contrast1:'산책하지만',contrast2:'산책하는데',purpose:'산책하려고',result:'산책하게 되다'}},
      {ko:'떠나다', ro:'a pleca', en:'to leave', aliases:['pleci','pleaca','pleacă','plecam','plecăm','plecat','am plecat','a plecat','voi pleca','leave','leaves','left','leaving','depart','departed','will leave'], final:'떠나요', forms:{none:'떠나요',seq:'떠나고',cause1:'떠나서',cause2:'떠나니까',condition:'떠나면',contrast1:'떠나지만',contrast2:'떠나는데',purpose:'떠나려고',result:'떠나게 되다'}},
      {ko:'되다', ro:'a deveni', en:'to become', aliases:['devin','devii','devine','devenim','deveniti','deveniți','devenit','am devenit','a devenit','voi deveni','become','becomes','became','turn into','will become'], final:'돼요', forms:{none:'돼요',seq:'되고',cause1:'돼서',cause2:'되니까',condition:'되면',contrast1:'되지만',contrast2:'되는데',purpose:'되려고',result:'되게 되다'}},
      {ko:'성공하다', ro:'a reuși', en:'to succeed', aliases:['reusesc','reusesti','reuseste','reusim','reusati','reusit','am reusit','a reusit','voi reusi','vei reusi','reusi','reușesc','reușești','reușește','reușim','reușiți','reușit','am reușit','a reușit','voi reuși','vei reuși','reuși','succeed','succeeds','succeeded','pass','passes','passed','will succeed'], final:'성공해요', forms:{none:'성공해요',seq:'성공하고',cause1:'성공해서',cause2:'성공하니까',condition:'성공하면',contrast1:'성공하지만',contrast2:'성공하는데',purpose:'성공하려고',result:'성공하게 되다'}},
      {ko:'실패하다', ro:'a eșua', en:'to fail', aliases:['esuez','esuezi','esueaza','esuam','esuati','esuat','am esuat','a esuat','voi esua','eșuez','eșuezi','eșuează','eșuăm','eșuați','eșuat','am eșuat','picat','am picat','a picat','fail','fails','failed','failing','will fail'], final:'실패해요', forms:{none:'실패해요',seq:'실패하고',cause1:'실패해서',cause2:'실패하니까',condition:'실패하면',contrast1:'실패하지만',contrast2:'실패하는데',purpose:'실패하려고',result:'실패하게 되다'}},
      {ko:'가르치다', ro:'a preda', en:'to teach', aliases:['predau','predai','preda','predam','predăm','predat','am predat','a predat','voi preda','predă','predati','predați','teach','teaches','taught','teaching','will teach'], final:'가르쳐요', forms:{none:'가르쳐요',seq:'가르치고',cause1:'가르쳐서',cause2:'가르치니까',condition:'가르치면',contrast1:'가르치지만',contrast2:'가르치는데',purpose:'가르치려고',result:'가르치게 되다'}},
      {ko:'포기하다', ro:'a renunța', en:'to give up', aliases:['renunt','renunti','renunta','renuntam','renuntat','am renuntat','a renuntat','voi renunta','renunț','renunți','renunță','renunțăm','renunțat','am renunțat','give up','gives up','gave up','quit','quits','quitting','abandon','will give up'], final:'포기해요', forms:{none:'포기해요',seq:'포기하고',cause1:'포기해서',cause2:'포기하니까',condition:'포기하면',contrast1:'포기하지만',contrast2:'포기하는데',purpose:'포기하려고',result:'포기하게 되다'}},
      {ko:'발전하다', ro:'a progresa', en:'to progress', aliases:['progresez','progresezi','progreseaza','progresam','progresati','progresează','progresăm','progresați','progresat','am progresat','a progresat','voi progresa','avansez','avansat','progress','progresses','progressed','improve','improved','advance','will progress'], final:'발전해요', forms:{none:'발전해요',seq:'발전하고',cause1:'발전해서',cause2:'발전하니까',condition:'발전하면',contrast1:'발전하지만',contrast2:'발전하는데',purpose:'발전하려고',result:'발전하게 되다'}},
      {ko:'바꾸다', ro:'a schimba', en:'to change', aliases:['schimb','schimbi','schimba','schimbam','schimbat','am schimbat','s-a schimbat','voi schimba','schimbă','schimbăm','change','changes','changed','alter','modify','will change'], final:'바꿔요', forms:{none:'바꿔요',seq:'바꾸고',cause1:'바꿔서',cause2:'바꾸니까',condition:'바꾸면',contrast1:'바꾸지만',contrast2:'바꾸는데',purpose:'바꾸려고',result:'바꾸게 되다'}},
      {ko:'결정하다', ro:'a decide', en:'to decide', aliases:['decid','decizi','decide','decidem','decideti','decideți','decis','am decis','a decis','voi decide','hotarasc','hotărăsc','hotarat','hotărât','am hotarat','am hotărât','decide','decides','decided','choosing','will decide'], final:'결정해요', forms:{none:'결정해요',seq:'결정하고',cause1:'결정해서',cause2:'결정하니까',condition:'결정하면',contrast1:'결정하지만',contrast2:'결정하는데',purpose:'결정하려고',result:'결정하게 되다'}},
      {ko:'일어나다', ro:'a se trezi', en:'to wake up', aliases:['ma trezesc','mă trezesc','te trezesti','te trezești','se trezeste','se trezește','ne trezim','va treziti','vă treziți','se trezesc','trezit','m-am trezit','te-ai trezit','s-a trezit','ne-am trezit','ma voi trezi','mă voi trezi','vei trezi','trezi','wake up','woke up','wake','wakes','waking'], final:'일어나요', forms:{none:'일어나요',seq:'일어나고',cause1:'일어나서',cause2:'일어나니까',condition:'일어나면',contrast1:'일어나지만',contrast2:'일어나는데',purpose:'일어나려고',result:'일어나게 되다'}},
      {ko:'이해하다', ro:'a înțelege', en:'to understand', aliases:['inteleg','înțeleg','intelegi','înțelegi','intelege','înțelege','intelegem','înțelegem','intelegeti','înțelegeți','inteles','înțeles','am inteles','am înțeles','a inteles','a înțeles','voi intelege','voi înțelege','understand','understands','understood','understanding'], final:'이해해요', forms:{none:'이해해요',seq:'이해하고',cause1:'이해해서',cause2:'이해하니까',condition:'이해하면',contrast1:'이해하지만',contrast2:'이해하는데',purpose:'이해하려고',result:'이해하게 되다'}},
      {ko:'좋아하다', ro:'a-i plăcea', en:'to like', aliases:['imi place','îmi place','iti place','îți place','ii place','îi place','ne place','va place','vă place','le place','place','placut','plăcut','mi-a placut','mi-a plăcut','imi placea','îmi plăcea','like','likes','liked','enjoy','fond of','will like'], final:'좋아해요', forms:{none:'좋아해요',seq:'좋아하고',cause1:'좋아해서',cause2:'좋아하니까',condition:'좋아하면',contrast1:'좋아하지만',contrast2:'좋아하는데',purpose:'좋아하려고',result:'좋아하게 되다'}},
      {ko:'싫어하다', ro:'a nu-i plăcea', en:'to dislike', aliases:['nu imi place','nu îmi place','detest','detesti','detestă','detestam','detestat','am detestat','urasc','urăsc','urasti','urăști','uraste','urăște','hate','dislike','dislikes','disliked','hated','will dislike'], final:'싫어해요', forms:{none:'싫어해요',seq:'싫어하고',cause1:'싫어해서',cause2:'싫어하니까',condition:'싫어하면',contrast1:'싫어하지만',contrast2:'싫어하는데',purpose:'싫어하려고',result:'싫어하게 되다'}},
      {ko:'기억하다', ro:'a-și aminti', en:'to remember', aliases:['imi amintesc','îmi amintesc','iti amintesti','îți amintești','isi aminteste','își amintește','ne amintim','tine minte','ține minte','amintesc','amintit','mi-am amintit','s-a amintit','remember','remembers','remembered','recall','will remember'], final:'기억해요', forms:{none:'기억해요',seq:'기억하고',cause1:'기억해서',cause2:'기억하니까',condition:'기억하면',contrast1:'기억하지만',contrast2:'기억하는데',purpose:'기억하려고',result:'기억하게 되다'}},
      {ko:'잊다', ro:'a uita', en:'to forget', aliases:['uit','uiti','uiți','uita','uită','uitam','uităm','uitati','uitați','uitat','am uitat','a uitat','voi uita','forget','forgets','forgot','forgetting','will forget'], final:'잊어요', forms:{none:'잊어요',seq:'잊고',cause1:'잊어서',cause2:'잊으니까',condition:'잊으면',contrast1:'잊지만',contrast2:'잊는데',purpose:'잊으려고',result:'잊게 되다'}},
      {ko:'느끼다', ro:'a simți', en:'to feel', aliases:['simt','simti','simți','simte','simtim','simțim','simtit','simțit','am simtit','am simțit','a simtit','a simțit','voi simti','voi simți','feel','feels','felt','feeling','will feel'], final:'느껴요', forms:{none:'느껴요',seq:'느끼고',cause1:'느껴서',cause2:'느끼니까',condition:'느끼면',contrast1:'느끼지만',contrast2:'느끼는데',purpose:'느끼려고',result:'느끼게 되다'}},
      {ko:'청소하다', ro:'a face curățenie', en:'to clean', aliases:['fac curatenie','fac curățenie','curatesc','curățesc','curatesti','curățești','curateste','curățește','curatat','curățat','am curatat','am curățat','a curatat','a curățat','voi curata','voi curăța','clean','cleans','cleaned','cleaning','tidy','tidying','will clean'], final:'청소해요', forms:{none:'청소해요',seq:'청소하고',cause1:'청소해서',cause2:'청소하니까',condition:'청소하면',contrast1:'청소하지만',contrast2:'청소하는데',purpose:'청소하려고',result:'청소하게 되다'}},
      {ko:'입다', ro:'a purta', en:'to wear', aliases:['port','porti','porți','poarta','poartă','purtam','purtăm','purtati','purtați','purtat','am purtat','a purtat','voi purta','imbrac','îmbrac','imbraci','îmbraci','imbraca','îmbracă','imbracat','îmbrăcat','am imbracat','am îmbrăcat','wear','wears','wore','wearing','will wear'], final:'입어요', forms:{none:'입어요',seq:'입고',cause1:'입어서',cause2:'입으니까',condition:'입으면',contrast1:'입지만',contrast2:'입는데',purpose:'입으려고',result:'입게 되다'}},
      {ko:'타다', ro:'a lua (transport)', en:'to take/ride', aliases:['iau autobuzul','iau metroul','iau trenul','iau taxiul','urc','urci','urca','urcă','urcam','urcăm','urcat','am urcat','a urcat','voi urca','conduc','conduci','conduce','conducem','condus','am condus','ride','rides','rode','take transport','board','will ride'], final:'타요', forms:{none:'타요',seq:'타고',cause1:'타서',cause2:'타니까',condition:'타면',contrast1:'타지만',contrast2:'타는데',purpose:'타려고',result:'타게 되다'}},
      {ko:'빌리다', ro:'a împrumuta', en:'to borrow', aliases:['imprumut','împrumut','imprumuti','împrumuți','imprumuta','împrumuta','imprumutat','împrumutat','am imprumutat','am împrumutat','a imprumutat','a împrumutat','voi imprumuta','voi împrumuta','borrow','borrows','borrowed','borrowing','lend','will borrow'], final:'빌려요', forms:{none:'빌려요',seq:'빌리고',cause1:'빌려서',cause2:'빌리니까',condition:'빌리면',contrast1:'빌리지만',contrast2:'빌리는데',purpose:'빌리려고',result:'빌리게 되다'}},
      {ko:'확인하다', ro:'a verifica', en:'to check', aliases:['verific','verifici','verifica','verifică','verificam','verificăm','verificati','verificați','verificat','am verificat','a verificat','voi verifica','check','checks','checked','checking','verify','verifies','verified','confirm','will check'], final:'확인해요', forms:{none:'확인해요',seq:'확인하고',cause1:'확인해서',cause2:'확인하니까',condition:'확인하면',contrast1:'확인하지만',contrast2:'확인하는데',purpose:'확인하려고',result:'확인하게 되다'}},
      {ko:'결혼하다', ro:'a se căsători', en:'to get married', aliases:['ma casatoresc','mă căsătoresc','te casatoresti','te căsătorești','se casatoreste','se căsătorește','ne casatorim','ne căsătorim','casatorit','căsătorit','m-am casatorit','m-am căsătorit','s-a casatorit','s-a căsătorit','ma insor','mă însor','ma marit','mă mărit','get married','marry','marries','married','will marry'], final:'결혼해요', forms:{none:'결혼해요',seq:'결혼하고',cause1:'결혼해서',cause2:'결혼하니까',condition:'결혼하면',contrast1:'결혼하지만',contrast2:'결혼하는데',purpose:'결혼하려고',result:'결혼하게 되다'}},
      {ko:'졸업하다', ro:'a absolvi', en:'to graduate', aliases:['absolv','absolvi','absolva','absolvă','absolvim','absolvit','am absolvit','a absolvit','voi absolvi','terminate','termini','termina','terminat','am terminat','a terminat','voi termina','graduate','graduates','graduated','graduating','finish school','will graduate'], final:'졸업해요', forms:{none:'졸업해요',seq:'졸업하고',cause1:'졸업해서',cause2:'졸업하니까',condition:'졸업하면',contrast1:'졸업하지만',contrast2:'졸업하는데',purpose:'졸업하려고',result:'졸업하게 되다'}},
      {ko:'신청하다', ro:'a aplica', en:'to apply', aliases:['aplic','aplici','aplica','aplică','aplicam','aplicăm','aplicati','aplicați','aplicat','am aplicat','a aplicat','voi aplica','ma inscriu','mă înscriu','te inscrii','te înscrii','se inscrie','se înscrie','inscris','înscris','m-am inscris','m-am înscris','apply','applies','applied','applying','register','enroll','sign up','will apply'], final:'신청해요', forms:{none:'신청해요',seq:'신청하고',cause1:'신청해서',cause2:'신청하니까',condition:'신청하면',contrast1:'신청하지만',contrast2:'신청하는데',purpose:'신청하려고',result:'신청하게 되다'}},
      {ko:'벌다', ro:'a câștiga (bani)', en:'to earn', aliases:['castig','câștig','castigi','câștigă','castigam','câștigăm','castigati','câștigați','castigat','câștigat','am castigat','am câștigat','a castigat','a câștigat','voi castiga','voi câștiga','earn','earns','earned','earning','make money','will earn'], final:'벌어요', forms:{none:'벌어요',seq:'벌고',cause1:'벌어서',cause2:'버니까',condition:'벌면',contrast1:'벌지만',contrast2:'버는데',purpose:'벌려고',result:'벌게 되다'}},
      {ko:'저축하다', ro:'a economisi', en:'to save money', aliases:['economisesc','economisesti','economisești','economiseste','economisește','economisim','economisiti','economisiți','economisit','am economisit','a economisit','voi economisi','save money','saves money','saved money','saving money','will save'], final:'저축해요', forms:{none:'저축해요',seq:'저축하고',cause1:'저축해서',cause2:'저축하니까',condition:'저축하면',contrast1:'저축하지만',contrast2:'저축하는데',purpose:'저축하려고',result:'저축하게 되다'}},
      {ko:'즐기다', ro:'a se bucura de', en:'to enjoy', aliases:['ma bucur','mă bucur','bucuri','bucura','bucură','bucuram','bucurăm','bucurat','m-am bucurat','s-a bucurat','ne-am bucurat','ma voi bucura','mă voi bucura','ma distrez','mă distrez','distrez','savurez','enjoy','enjoys','enjoyed','enjoying','will enjoy','have fun'], final:'즐겨요', forms:{none:'즐겨요',seq:'즐기고',cause1:'즐겨서',cause2:'즐기니까',condition:'즐기면',contrast1:'즐기지만',contrast2:'즐기는데',purpose:'즐기려고',result:'즐기게 되다'}},
      {ko:'이기다', ro:'a câștiga (meci)', en:'to win', aliases:['inving','înving','invingi','învingi','invinge','învinge','invingem','învingem','invins','învins','am invins','am învins','a invins','a învins','voi invinge','voi învinge','bat','bate','batem','bateti','bateți','batut','bătut','am batut','am bătut','a batut','a bătut','win','wins','won','winning','beat','beats','defeat','defeated','will win'], final:'이겨요', forms:{none:'이겨요',seq:'이기고',cause1:'이겨서',cause2:'이기니까',condition:'이기면',contrast1:'이기지만',contrast2:'이기는데',purpose:'이기려고',result:'이기게 되다'}},
      {ko:'팔다', ro:'a vinde', en:'to sell', aliases:['vand','vând','vinzi','vinde','vindem','vindeti','vindeți','vandut','vândut','am vandut','am vândut','a vandut','a vândut','voi vinde','sell','sells','sold','selling','will sell'], final:'팔아요', forms:{none:'팔아요',seq:'팔고',cause1:'팔아서',cause2:'파니까',condition:'팔면',contrast1:'팔지만',contrast2:'파는데',purpose:'팔려고',result:'팔게 되다'}},
      {ko:'연습하다', ro:'a exersa', en:'to practice', aliases:['exersez','exersezi','exerseaza','exersează','exersam','exersăm','exersati','exersați','exersat','am exersat','a exersat','voi exersa','practic','practici','practica','practică','practicam','practicăm','practicati','practicați','practicat','am practicat','a practicat','voi practica','practice','practices','practiced','practicing','rehearse','will practice'], final:'연습해요', forms:{none:'연습해요',seq:'연습하고',cause1:'연습해서',cause2:'연습하니까',condition:'연습하면',contrast1:'연습하지만',contrast2:'연습하는데',purpose:'연습하려고',result:'연습하게 되다'}},
      {ko:'노력하다', ro:'a se strădui', en:'to make effort', aliases:['ma straduiesc','mă străduiesc','te straduiesti','te străduiești','se straduieste','se străduiește','ne straduim','ne străduim','straduit','străduit','m-am straduit','m-am străduit','ma voi stradui','mă voi strădui','incerc','încerc','incerci','înce','incercam','înce','incercat','încercat','am incercat','am încercat','a incercat','a încercat','voi incerca','voi încerca','depun efort','fac efort','try','tries','tried','try hard','make effort','strive','strives','strived','effort','will try'], final:'노력해요', forms:{none:'노력해요',seq:'노력하고',cause1:'노력해서',cause2:'노력하니까',condition:'노력하면',contrast1:'노력하지만',contrast2:'노력하는데',purpose:'노력하려고',result:'노력하게 되다'}},
      {ko:'피하다', ro:'a evita', en:'to avoid', aliases:['evit','eviti','eviți','evita','evită','evitam','evităm','evitati','evitați','evitat','am evitat','a evitat','voi evita','avoid','avoids','avoided','avoiding','escape','escapes','escaped','will avoid'], final:'피해요', forms:{none:'피해요',seq:'피하고',cause1:'피해서',cause2:'피하니까',condition:'피하면',contrast1:'피하지만',contrast2:'피하는데',purpose:'피하려고',result:'피하게 되다'}},
      {ko:'지키다', ro:'a păstra', en:'to keep', aliases:['pastrez','păstrez','pastrezi','păstrezi','pastreaza','păstrează','pastram','păstrăm','pastrati','păstrați','pastrat','păstrat','am pastrat','am păstrat','a pastrat','a păstrat','voi pastra','voi păstra','protejez','protejezi','protejeaza','protejează','protejam','protejăm','protejati','protejați','protejat','am protejat','a protejat','voi proteja','keep','keeps','kept','protect','protects','protected','guard','guards','maintain','will keep'], final:'지켜요', forms:{none:'지켜요',seq:'지키고',cause1:'지켜서',cause2:'지키니까',condition:'지키면',contrast1:'지키지만',contrast2:'지키는데',purpose:'지키려고',result:'지키게 되다'}},
      {ko:'모으다', ro:'a strânge', en:'to collect', aliases:['strang','strâng','strangi','strângi','strange','strânge','strangem','strângem','strans','strâns','am strans','am strâns','a strans','a strâns','voi strange','voi strânge','adun','aduni','aduna','adună','adunam','adunăm','adunati','adunați','adunat','am adunat','a adunat','voi aduna','collect','collects','collected','gather','gathers','gathered','save up','accumulate','will collect'], final:'모아요', forms:{none:'모아요',seq:'모으고',cause1:'모아서',cause2:'모으니까',condition:'모으면',contrast1:'모으지만',contrast2:'모으는데',purpose:'모으려고',result:'모으게 되다'}},
      {ko:'기쁘다', ro:'a fi fericit', en:'to be happy', aliases:['bucuros','bucuroasa','bucuroasă','fericita','fericită','fericit','fericiti','fericiți','bucurosi','bucuroși','sunt fericit','sunt fericita','sunt fericită','sunt bucuros','sunt bucuroasa','sunt bucuroasă','suntem fericiti','suntem fericiți','suntem bucurosi','suntem bucuroși','sunteti fericiti','sunteți fericiți','esti fericit','ești fericit','esti bucuros','ești bucuroasă','happy','glad','joyful','am happy','are happy','is happy','we are happy','are happy'], final:'기뻐요', forms:{none:'기뻐요',seq:'기쁘고',cause1:'기뻐서',cause2:'기쁘니까',condition:'기쁘면',contrast1:'기쁘지만',contrast2:'기쁜데',purpose:'기쁘게',result:'기쁘게 되다'}},
      {ko:'화나다', ro:'a fi supărat', en:'to be angry', aliases:['suparat','suparata','supărată','supărat','suparati','supărați','iritat','iritata','iritată','nervos','nervoasa','nervoasă','nervosi','nervoși','sunt suparat','sunt suparata','sunt supărată','suntem suparati','suntem supărați','sunteti suparati','sunteți supărați','esti suparat','ești supărată','angry','mad','upset','annoyed','furious','am angry','am upset','is angry','are angry','we are angry'], final:'화나요', forms:{none:'화나요',seq:'화나고',cause1:'화나서',cause2:'화나니까',condition:'화나면',contrast1:'화나지만',contrast2:'화나는데',purpose:'화나려고',result:'화나게 되다'}},
      {ko:'슬프다', ro:'a fi trist', en:'to be sad', aliases:['trist','trista','tristă','tristi','triști','sunt trist','sunt trista','sunt tristă','suntem tristi','suntem triști','sunteti tristi','sunteți triști','esti trist','ești tristă','sad','unhappy','am sad','is sad','are sad','we are sad'], final:'슬퍼요', forms:{none:'슬퍼요',seq:'슬프고',cause1:'슬퍼서',cause2:'슬프니까',condition:'슬프면',contrast1:'슬프지만',contrast2:'슬픈데',purpose:'슬프게',result:'슬프게 되다'}},
      {ko:'피곤하다', ro:'a fi obosit', en:'to be tired', aliases:['obosit','obosita','obosită','obositi','obosiți','sunt obosit','sunt obosita','sunt obosită','suntem obositi','suntem obosiți','sunteti obositi','sunteți obosiți','esti obosit','ești obosită','tired','exhausted','am tired','is tired','are tired','we are tired'], final:'피곤해요', forms:{none:'피곤해요',seq:'피곤하고',cause1:'피곤해서',cause2:'피곤하니까',condition:'피곤하면',contrast1:'피곤하지만',contrast2:'피곤한데',purpose:'피곤하게',result:'피곤하게 되다'}},
      {ko:'안녕하세요', ro:'Bună ziua', en:'Hello', isPhrase:true, aliases:['buna ziua','salut','hello','buna','good afternoon','good day'], final:'안녕하세요', forms:{none:'안녕하세요',seq:'안녕하세요',cause1:'안녕하세요',cause2:'안녕하세요',condition:'안녕하세요',contrast1:'안녕하세요',contrast2:'안녕하세요',purpose:'안녕하세요',result:'안녕하세요'}},
      {ko:'좋은 아침이에요', ro:'Bună dimineața', en:'Good morning', isPhrase:true, aliases:['buna dimineata','buna dimineața','good morning'], final:'좋은 아침이에요', forms:{none:'좋은 아침이에요',seq:'좋은 아침이에요',cause1:'좋은 아침이에요',cause2:'좋은 아침이에요',condition:'좋은 아침이에요',contrast1:'좋은 아침이에요',contrast2:'좋은 아침이에요',purpose:'좋은 아침이에요',result:'좋은 아침이에요'}},
      {ko:'좋은 저녁이에요', ro:'Bună seara', en:'Good evening', isPhrase:true, aliases:['buna seara','good evening'], final:'좋은 저녁이에요', forms:{none:'좋은 저녁이에요',seq:'좋은 저녁이에요',cause1:'좋은 저녁이에요',cause2:'좋은 저녁이에요',condition:'좋은 저녁이에요',contrast1:'좋은 저녁이에요',contrast2:'좋은 저녁이에요',purpose:'좋은 저녁이에요',result:'좋은 저녁이에요'}},
      {ko:'안녕히 가세요', ro:'La revedere', en:'Goodbye', isPhrase:true, aliases:['la revedere','bye','goodbye','pa','pa pa'], final:'안녕히 가세요', forms:{none:'안녕히 가세요',seq:'안녕히 가세요',cause1:'안녕히 가세요',cause2:'안녕히 가세요',condition:'안녕히 가세요',contrast1:'안녕히 가세요',contrast2:'안녕히 가세요',purpose:'안녕히 가세요',result:'안녕히 가세요'}},
      {ko:'가져다 주다', ro:'a aduce cuiva', en:'to bring to someone', aliases:['aduc cuiva','aduci cuiva','aduce cuiva','aducem cuiva','aduceți cuiva','am adus cuiva','ai adus cuiva','a adus cuiva','ați adus cuiva','au adus cuiva','bring to someone','brings to someone'], final:'가져다 줘요', forms:{none:'가져다 줘요',seq:'가져다 주고',cause1:'가져다 줘서',cause2:'가져다 주니까',condition:'가져다 주면',contrast1:'가져다 주지만',contrast2:'가져다 주는데',purpose:'가져다 주려고',result:'가져다 줘서 그렇게 되다'}},
      {ko:'가지다', ro:'a avea / a deține', en:'to have / to hold', aliases:['am','ai','are','avem','aveți','au','am avut','ai avut','a avut','ați avut','au avut','avea','deține','have','has','hold','holds'], final:'가져요', forms:{none:'가져요',seq:'가지고',cause1:'가져서',cause2:'가지니까',condition:'가지면',contrast1:'가지지만',contrast2:'가지는데',purpose:'가지려고',result:'가져서 그렇게 되다'}},
      {ko:'갈아타다', ro:'a face transbordare', en:'to transfer (transport)', aliases:['fac transbordare','faci transbordare','face transbordare','facem transbordare','faceți transbordare','am făcut transbordare','ai făcut transbordare','a făcut transbordare','ați făcut transbordare','au făcut transbordare','transfer','transfers'], final:'갈아타요', forms:{none:'갈아타요',seq:'갈아타고',cause1:'갈아타서',cause2:'갈아타니까',condition:'갈아타면',contrast1:'갈아타지만',contrast2:'갈아타는데',purpose:'갈아타려고',result:'갈아타서 그렇게 되다'}},
      {ko:'감다', ro:'a spăla (părul) / a închide (ochii)', en:'to wash (hair) / to close (eyes)', aliases:['spăl','speli','spală','spălăm','spălați','am spălat','ai spălat','a spălat','ați spălat','au spălat','spăla','închide','wash','washes','close','closes'], final:'감아요', forms:{none:'감아요',seq:'감고',cause1:'감아서',cause2:'감으니까',condition:'감으면',contrast1:'감지만',contrast2:'감는데',purpose:'감으려고',result:'감아서 그렇게 되다'}},
      {ko:'감동하다', ro:'a fi emoționat / mișcat', en:'to be moved (emotionally)', aliases:['sunt emoționat','ești emoționat','este emoționat','suntem emoționați','sunteți emoționați','sunt emoționați','am fost emoționat','ai fost emoționat','a fost emoționat','am fost emoționați','ați fost emoționați','au fost emoționați','fi emoționat','mișcat','be moved','is moved'], final:'감동해요', forms:{none:'감동해요',seq:'감동하고',cause1:'감동해서',cause2:'감동하니까',condition:'감동하면',contrast1:'감동하지만',contrast2:'감동하는데',purpose:'감동하려고',result:'감동해서 그렇게 되다'}},
      {ko:'개발하다', ro:'a dezvolta', en:'to develop', aliases:['dezvolt','dezvolți','dezvoltă','dezvoltăm','dezvoltați','am dezvoltat','ai dezvoltat','a dezvoltat','ați dezvoltat','au dezvoltat','dezvolta','develop','develops'], final:'개발해요', forms:{none:'개발해요',seq:'개발하고',cause1:'개발해서',cause2:'개발하니까',condition:'개발하면',contrast1:'개발하지만',contrast2:'개발하는데',purpose:'개발하려고',result:'개발해서 그렇게 되다'}},
      {ko:'거절하다', ro:'a refuza', en:'to refuse, to decline', aliases:['refuz','refuzi','refuză','refuzăm','refuzați','am refuzat','ai refuzat','a refuzat','ați refuzat','au refuzat','refuza','refuse','refuses','decline','declines'], final:'거절해요', forms:{none:'거절해요',seq:'거절하고',cause1:'거절해서',cause2:'거절하니까',condition:'거절하면',contrast1:'거절하지만',contrast2:'거절하는데',purpose:'거절하려고',result:'거절해서 그렇게 되다'}},
      {ko:'걱정하다', ro:'a-și face griji', en:'to worry', aliases:['îmi fac griji','îți faci griji','își face griji','ne facem griji','vă faceți griji','își fac griji','mi-am făcut griji','ți-ai făcut griji','și-a făcut griji','ne-am făcut griji','v-ați făcut griji','și-au făcut griji','face griji','worry','worries'], final:'걱정해요', forms:{none:'걱정해요',seq:'걱정하고',cause1:'걱정해서',cause2:'걱정하니까',condition:'걱정하면',contrast1:'걱정하지만',contrast2:'걱정하는데',purpose:'걱정하려고',result:'걱정해서 그렇게 되다'}},
      {ko:'건강해지다', ro:'a deveni sănătos', en:'to become healthy', aliases:['devin sănătos','devii sănătos','devine sănătos','devenim sănătos','deveniți sănătos','am devenit sănătos','ai devenit sănătos','a devenit sănătos','ați devenit sănătos','au devenit sănătos','deveni sănătos','become healthy','becomes healthy'], final:'건강해져요', forms:{none:'건강해져요',seq:'건강해지고',cause1:'건강해져서',cause2:'건강해지니까',condition:'건강해지면',contrast1:'건강해지지만',contrast2:'건강해지는데',purpose:'건강해지려고',result:'건강해져서 그렇게 되다'}},
      {ko:'건너다', ro:'a traversa', en:'to cross', aliases:['traversez','traversezi','traversează','traversăm','traversați','am traversat','ai traversat','a traversat','ați traversat','au traversat','traversa','cross','crosses'], final:'건너어요', forms:{none:'건너어요',seq:'건너고',cause1:'건너어서',cause2:'건너니까',condition:'건너면',contrast1:'건너지만',contrast2:'건너는데',purpose:'건너려고',result:'건너어서 그렇게 되다'}},
      {ko:'걷다', ro:'a merge pe jos', en:'to walk', aliases:['merg pe jos','mergi pe jos','merge pe jos','mergem pe jos','mergeți pe jos','am mers pe jos','ai mers pe jos','a mers pe jos','ați mers pe jos','au mers pe jos','walk','walks'], final:'걸어요', forms:{none:'걸어요',seq:'걷고',cause1:'걸어서',cause2:'걷으니까',condition:'걷으면',contrast1:'걷지만',contrast2:'걷는데',purpose:'걷으려고',result:'걸어서 그렇게 되다'}},
      {ko:'걸다', ro:'a agăța / a suna (telefon)', en:'to hang / to make a call', aliases:['agăț','agăți','agață','agățăm','agățați','am agățat','ai agățat','a agățat','ați agățat','au agățat','agăța','suna','hang','hangs','make a call','makes a call'], final:'걸어요', forms:{none:'걸어요',seq:'걸고',cause1:'걸어서',cause2:'걸니까',condition:'걸면',contrast1:'걸지만',contrast2:'걸는데',purpose:'걸려고',result:'걸어서 그렇게 되다'}},
      {ko:'걸리다', ro:'a se îmbolnăvi, a dura', en:'to catch (illness), to take (time)', aliases:['mă îmbolnăvesc','te îmbolnăvești','se îmbolnăvește','ne îmbolnăvim','vă îmbolnăviți','se îmbolnăvesc','m-am îmbolnăvit','te-ai îmbolnăvit','s-a îmbolnăvit','ne-am îmbolnăvit','v-ați îmbolnăvit','s-au îmbolnăvit','îmbolnăvi','dura','catch','catches','take','takes'], final:'걸려요', forms:{none:'걸려요',seq:'걸리고',cause1:'걸려서',cause2:'걸리니까',condition:'걸리면',contrast1:'걸리지만',contrast2:'걸리는데',purpose:'걸리려고',result:'걸려서 그렇게 되다'}},
      {ko:'검색하다', ro:'a căuta (online)', en:'to search', aliases:['caut','cauți','caută','căutăm','căutați','am căutat','ai căutat','a căutat','ați căutat','au căutat','căuta','search','searches'], final:'검색해요', forms:{none:'검색해요',seq:'검색하고',cause1:'검색해서',cause2:'검색하니까',condition:'검색하면',contrast1:'검색하지만',contrast2:'검색하는데',purpose:'검색하려고',result:'검색해서 그렇게 되다'}},
      {ko:'계산하다', ro:'a calcula, a plăti nota', en:'to calculate, to pay the bill', aliases:['calculez','calculezi','calculează','calculăm','calculați','am calculat','ai calculat','a calculat','ați calculat','au calculat','calcula','plăti nota','calculate','calculates','pay the bill','pays the bill'], final:'계산해요', forms:{none:'계산해요',seq:'계산하고',cause1:'계산해서',cause2:'계산하니까',condition:'계산하면',contrast1:'계산하지만',contrast2:'계산하는데',purpose:'계산하려고',result:'계산해서 그렇게 되다'}},
      {ko:'고민하다', ro:'a se frământa / a chibzui', en:'to worry / to agonize over', aliases:['mă frământ','te frămânți','se frământă','ne frământăm','vă frământați','m-am frământat','te-ai frământat','s-a frământat','ne-am frământat','v-ați frământat','s-au frământat','frământa','chibzui','worry','worries','agonize over','agonizes over'], final:'고민해요', forms:{none:'고민해요',seq:'고민하고',cause1:'고민해서',cause2:'고민하니까',condition:'고민하면',contrast1:'고민하지만',contrast2:'고민하는데',purpose:'고민하려고',result:'고민해서 그렇게 되다'}},
      {ko:'고치다', ro:'a repara, a corecta', en:'to fix, to repair', aliases:['repar','repari','repară','reparăm','reparați','am reparat','ai reparat','a reparat','ați reparat','au reparat','repara','corecta','fix','fixes','repair','repairs'], final:'고쳐요', forms:{none:'고쳐요',seq:'고치고',cause1:'고쳐서',cause2:'고치니까',condition:'고치면',contrast1:'고치지만',contrast2:'고치는데',purpose:'고치려고',result:'고쳐서 그렇게 되다'}},
      {ko:'구경하다', ro:'a răsfoi, a se uita', en:'to browse, to look around', aliases:['răsfoiesc','răsfoiești','răsfoiește','răsfoim','răsfoiți','am răsfoit','ai răsfoit','a răsfoit','ați răsfoit','au răsfoit','răsfoi','uita','browse','browses','look around','looks around'], final:'구경해요', forms:{none:'구경해요',seq:'구경하고',cause1:'구경해서',cause2:'구경하니까',condition:'구경하면',contrast1:'구경하지만',contrast2:'구경하는데',purpose:'구경하려고',result:'구경해서 그렇게 되다'}},
      {ko:'굽다', ro:'a prăji, a coace', en:'to grill, to bake', aliases:['prăjesc','prăjești','prăjește','prăjim','prăjiți','am prăjit','ai prăjit','a prăjit','ați prăjit','au prăjit','prăji','coace','grill','grills','bake','bakes'], final:'구워요', forms:{none:'구워요',seq:'굽고',cause1:'구워서',cause2:'굽으니까',condition:'굽으면',contrast1:'굽지만',contrast2:'굽는데',purpose:'굽으려고',result:'구워서 그렇게 되다'}},
      {ko:'그리다', ro:'a desena, a picta', en:'to draw, to paint', aliases:['desenez','desenezi','desenează','desenăm','desenați','am desenat','ai desenat','a desenat','ați desenat','au desenat','desena','picta','draw','draws','paint','paints'], final:'그려요', forms:{none:'그려요',seq:'그리고',cause1:'그려서',cause2:'그리니까',condition:'그리면',contrast1:'그리지만',contrast2:'그리는데',purpose:'그리려고',result:'그려서 그렇게 되다'}},
      {ko:'그만두다', ro:'a renunța / a demisiona', en:'to quit', aliases:['renunț','renunți','renunță','renunțăm','renunțați','am renunțat','ai renunțat','a renunțat','ați renunțat','au renunțat','renunța','demisiona','quit','quits'], final:'그만둬요', forms:{none:'그만둬요',seq:'그만두고',cause1:'그만둬서',cause2:'그만두니까',condition:'그만두면',contrast1:'그만두지만',contrast2:'그만두는데',purpose:'그만두려고',result:'그만둬서 그렇게 되다'}},
      {ko:'그치다', ro:'a se opri (ploaia/ninsoarea)', en:'to stop (rain/snow)', aliases:['mă opresc','te oprești','se oprește','ne oprim','vă opriți','se opresc','m-am oprit','te-ai oprit','s-a oprit','ne-am oprit','v-ați oprit','s-au oprit','opri','stop','stops'], final:'그쳐요', forms:{none:'그쳐요',seq:'그치고',cause1:'그쳐서',cause2:'그치니까',condition:'그치면',contrast1:'그치지만',contrast2:'그치는데',purpose:'그치려고',result:'그쳐서 그렇게 되다'}},
      {ko:'긴장하다', ro:'a fi tensionat / emoționat', en:'to be nervous', aliases:['sunt tensionat','ești tensionat','este tensionat','suntem tensionați','sunteți tensionați','sunt tensionați','am fost tensionat','ai fost tensionat','a fost tensionat','am fost tensionați','ați fost tensionați','au fost tensionați','fi tensionat','emoționat','be nervous','is nervous'], final:'긴장해요', forms:{none:'긴장해요',seq:'긴장하고',cause1:'긴장해서',cause2:'긴장하니까',condition:'긴장하면',contrast1:'긴장하지만',contrast2:'긴장하는데',purpose:'긴장하려고',result:'긴장해서 그렇게 되다'}},
      {ko:'김치찌개를 끓이다', ro:'a face supă kimchi', en:'to make kimchi jjigae', aliases:['fac supă kimchi','faci supă kimchi','face supă kimchi','facem supă kimchi','faceți supă kimchi','am făcut supă kimchi','ai făcut supă kimchi','a făcut supă kimchi','ați făcut supă kimchi','au făcut supă kimchi','make kimchi jjigae','makes kimchi jjigae'], final:'김치찌개를 끓여요', forms:{none:'김치찌개를 끓여요',seq:'김치찌개를 끓이고',cause1:'김치찌개를 끓여서',cause2:'김치찌개를 끓이니까',condition:'김치찌개를 끓이면',contrast1:'김치찌개를 끓이지만',contrast2:'김치찌개를 끓이는데',purpose:'김치찌개를 끓이려고',result:'김치찌개를 끓여서 그렇게 되다'}},
      {ko:'깨다', ro:'a se trezi / a sparge', en:'to wake up / to break', aliases:['mă trezesc','te trezești','se trezește','ne trezim','vă treziți','se trezesc','m-am trezit','te-ai trezit','s-a trezit','ne-am trezit','v-ați trezit','s-au trezit','trezi','sparge','wake up','wakes up','break','breaks'], final:'깨어요', forms:{none:'깨어요',seq:'깨고',cause1:'깨어서',cause2:'깨니까',condition:'깨면',contrast1:'깨지만',contrast2:'깨는데',purpose:'깨려고',result:'깨어서 그렇게 되다'}},
      {ko:'꺼내다', ro:'a scoate afară', en:'to take out', aliases:['scoat afară','scoați afară','scoate afară','scoatem afară','scoateți afară','am scos afară','ai scos afară','a scos afară','ați scos afară','au scos afară','take out','takes out'], final:'꺼내어요', forms:{none:'꺼내어요',seq:'꺼내고',cause1:'꺼내어서',cause2:'꺼내니까',condition:'꺼내면',contrast1:'꺼내지만',contrast2:'꺼내는데',purpose:'꺼내려고',result:'꺼내어서 그렇게 되다'}},
      {ko:'끄다', ro:'a stinge, a opri', en:'to turn off', aliases:['sting','stingi','stinge','stingem','stingeți','am stins','ai stins','a stins','ați stins','au stins','opri','turn off','turns off'], final:'꺼요', forms:{none:'꺼요',seq:'끄고',cause1:'꺼서',cause2:'끄니까',condition:'끄면',contrast1:'끄지만',contrast2:'끄는데',purpose:'끄려고',result:'꺼서 그렇게 되다'}},
      {ko:'끓이다', ro:'a fierbe', en:'to boil', aliases:['fierb','fierbi','fierbe','fierbem','fierbeți','am fiert','ai fiert','a fiert','ați fiert','au fiert','boil','boils'], final:'끓여요', forms:{none:'끓여요',seq:'끓이고',cause1:'끓여서',cause2:'끓이니까',condition:'끓이면',contrast1:'끓이지만',contrast2:'끓이는데',purpose:'끓이려고',result:'끓여서 그렇게 되다'}},
      {ko:'끝나다', ro:'a se termina', en:'to finish', aliases:['mă termin','te termini','se termină','ne terminăm','vă terminați','m-am terminat','te-ai terminat','s-a terminat','ne-am terminat','v-ați terminat','s-au terminat','termina','finish','finishes'], final:'끝나요', forms:{none:'끝나요',seq:'끝나고',cause1:'끝나서',cause2:'끝나니까',condition:'끝나면',contrast1:'끝나지만',contrast2:'끝나는데',purpose:'끝나려고',result:'끝나서 그렇게 되다'}},
      {ko:'끝내다', ro:'a termina', en:'to finish, to complete', aliases:['termin','termini','termină','terminăm','terminați','am terminat','ai terminat','a terminat','ați terminat','au terminat','termina','finish','finishes','complete','completes'], final:'끝내어요', forms:{none:'끝내어요',seq:'끝내고',cause1:'끝내어서',cause2:'끝내니까',condition:'끝내면',contrast1:'끝내지만',contrast2:'끝내는데',purpose:'끝내려고',result:'끝내어서 그렇게 되다'}},
      {ko:'끼다', ro:'a purta (inel, mănuși)', en:'to wear (ring, gloves)', aliases:['port','porți','poartă','purtăm','purtați','am purtat','ai purtat','a purtat','ați purtat','au purtat','purta','wear','wears'], final:'껴요', forms:{none:'껴요',seq:'끼고',cause1:'껴서',cause2:'끼니까',condition:'끼면',contrast1:'끼지만',contrast2:'끼는데',purpose:'끼려고',result:'껴서 그렇게 되다'}},
      {ko:'나가다', ro:'a ieși afară', en:'to go out', aliases:['ies afară','ieși afară','iese afară','ieșim afară','ieșiți afară','am ieșit afară','ai ieșit afară','a ieșit afară','ați ieșit afară','au ieșit afară','go out','goes out'], final:'나가요', forms:{none:'나가요',seq:'나가고',cause1:'나가서',cause2:'나가니까',condition:'나가면',contrast1:'나가지만',contrast2:'나가는데',purpose:'나가려고',result:'나가서 그렇게 되다'}},
      {ko:'나누다', ro:'a împărți, a diviza', en:'to share, to divide', aliases:['împart','împarți','împarte','împărțim','împărțiți','am împărțit','ai împărțit','a împărțit','ați împărțit','au împărțit','împărți','diviza','share','shares','divide','divides'], final:'나눠요', forms:{none:'나눠요',seq:'나누고',cause1:'나눠서',cause2:'나누니까',condition:'나누면',contrast1:'나누지만',contrast2:'나누는데',purpose:'나누려고',result:'나눠서 그렇게 되다'}},
      {ko:'나빠지다', ro:'a se înrăutăți', en:'to get worse, to deteriorate', aliases:['mă înrăutățesc','te înrăutățești','se înrăutățește','ne înrăutățim','vă înrăutățiți','se înrăutățesc','m-am înrăutățit','te-ai înrăutățit','s-a înrăutățit','ne-am înrăutățit','v-ați înrăutățit','s-au înrăutățit','înrăutăți','get worse','gets worse','deteriorate','deteriorates'], final:'나빠져요', forms:{none:'나빠져요',seq:'나빠지고',cause1:'나빠져서',cause2:'나빠지니까',condition:'나빠지면',contrast1:'나빠지지만',contrast2:'나빠지는데',purpose:'나빠지려고',result:'나빠져서 그렇게 되다'}},
      {ko:'나아가다', ro:'a avansa, a înainta', en:'to move forward, to advance', aliases:['avansez','avansezi','avansează','avansăm','avansați','am avansat','ai avansat','a avansat','ați avansat','au avansat','avansa','înainta','move forward','moves forward','advance','advances'], final:'나아가요', forms:{none:'나아가요',seq:'나아가고',cause1:'나아가서',cause2:'나아가니까',condition:'나아가면',contrast1:'나아가지만',contrast2:'나아가는데',purpose:'나아가려고',result:'나아가서 그렇게 되다'}},
      {ko:'나오다', ro:'a ieși, a apărea', en:'to come out, to appear', aliases:['ies','ieși','iese','ieșim','ieșiți','am ieșit','ai ieșit','a ieșit','ați ieșit','au ieșit','apărea','come out','comes out','appear','appears'], final:'나와요', forms:{none:'나와요',seq:'나오고',cause1:'나와서',cause2:'나오니까',condition:'나오면',contrast1:'나오지만',contrast2:'나오는데',purpose:'나오려고',result:'나와서 그렇게 되다'}},
      {ko:'나타나다', ro:'a apărea', en:'to appear, to show up', aliases:['apar','apari','apare','apărem','apăreți','am apărut','ai apărut','a apărut','ați apărut','au apărut','apărea','appear','appears','show up','shows up'], final:'나타나요', forms:{none:'나타나요',seq:'나타나고',cause1:'나타나서',cause2:'나타나니까',condition:'나타나면',contrast1:'나타나지만',contrast2:'나타나는데',purpose:'나타나려고',result:'나타나서 그렇게 되다'}},
      {ko:'날씨가 좋다', ro:'a fi vreme frumoasă', en:'weather is nice', aliases:['sunt vreme frumoasă','ești vreme frumoasă','este vreme frumoasă','suntem vreme frumoasă','sunteți vreme frumoasă','am fost vreme frumoasă','ai fost vreme frumoasă','a fost vreme frumoasă','ați fost vreme frumoasă','au fost vreme frumoasă','fi vreme frumoasă','weather is nice','weathers is nice'], final:'날씨가 좋아요', forms:{none:'날씨가 좋아요',seq:'날씨가 좋고',cause1:'날씨가 좋아서',cause2:'날씨가 좋으니까',condition:'날씨가 좋으면',contrast1:'날씨가 좋지만',contrast2:'날씨가 좋는데',purpose:'날씨가 좋으려고',result:'날씨가 좋아서 그렇게 되다'}},
      {ko:'낫다', ro:'a se recupera, a se face bine', en:'to recover, to get better', aliases:['mă recuperez','te recuperezi','se recuperează','ne recuperăm','vă recuperați','m-am recuperat','te-ai recuperat','s-a recuperat','ne-am recuperat','v-ați recuperat','s-au recuperat','recupera','face bine','recover','recovers','get better','gets better'], final:'낫아요', forms:{none:'낫아요',seq:'낫고',cause1:'낫아서',cause2:'낫으니까',condition:'낫으면',contrast1:'낫지만',contrast2:'낫는데',purpose:'낫으려고',result:'낫아서 그렇게 되다'}},
      {ko:'낮추다', ro:'a coborî, a reduce', en:'to lower', aliases:['cobor','cobori','coboară','coborâm','coborâți','am coborât','ai coborât','a coborât','ați coborât','au coborât','coborî','reduce','lower','lowers'], final:'낮춰요', forms:{none:'낮춰요',seq:'낮추고',cause1:'낮춰서',cause2:'낮추니까',condition:'낮추면',contrast1:'낮추지만',contrast2:'낮추는데',purpose:'낮추려고',result:'낮춰서 그렇게 되다'}},
      {ko:'내다', ro:'a produce, a scoate', en:'to produce, to put out', aliases:['produc','produci','produce','producem','produceți','am produs','ai produs','a produs','ați produs','au produs','scoate','produces','put out','puts out'], final:'내어요', forms:{none:'내어요',seq:'내고',cause1:'내어서',cause2:'내니까',condition:'내면',contrast1:'내지만',contrast2:'내는데',purpose:'내려고',result:'내어서 그렇게 되다'}},
      {ko:'내려가다', ro:'a coborî', en:'to go down', aliases:['cobor','cobori','coboară','coborâm','coborâți','am coborât','ai coborât','a coborât','ați coborât','au coborât','coborî','go down','goes down'], final:'내려가요', forms:{none:'내려가요',seq:'내려가고',cause1:'내려가서',cause2:'내려가니까',condition:'내려가면',contrast1:'내려가지만',contrast2:'내려가는데',purpose:'내려가려고',result:'내려가서 그렇게 되다'}},
      {ko:'내리다', ro:'a coborî din mijloc de transport', en:'to get off, to get out', aliases:['cobor din mijloc de transport','cobori din mijloc de transport','coboară din mijloc de transport','coborâm din mijloc de transport','coborâți din mijloc de transport','am coborât din mijloc de transport','ai coborât din mijloc de transport','a coborât din mijloc de transport','ați coborât din mijloc de transport','au coborât din mijloc de transport','coborî din mijloc de transport','get off','gets off','get out','gets out'], final:'내려요', forms:{none:'내려요',seq:'내리고',cause1:'내려서',cause2:'내리니까',condition:'내리면',contrast1:'내리지만',contrast2:'내리는데',purpose:'내리려고',result:'내려서 그렇게 되다'}},
      {ko:'넘다', ro:'a depăși / a trece peste', en:'to exceed / go over', aliases:['depășesc','depășești','depășește','depășim','depășiți','am depășit','ai depășit','a depășit','ați depășit','au depășit','depăși','trece peste','exceed','exceeds','go over','goes over'], final:'넘어요', forms:{none:'넘어요',seq:'넘고',cause1:'넘어서',cause2:'넘으니까',condition:'넘으면',contrast1:'넘지만',contrast2:'넘는데',purpose:'넘으려고',result:'넘어서 그렇게 되다'}},
      {ko:'넘어지다', ro:'a cădea', en:'to fall over', aliases:['cad','cazi','cade','cădem','cădeți','am căzut','ai căzut','a căzut','ați căzut','au căzut','cădea','fall over','falls over'], final:'넘어져요', forms:{none:'넘어져요',seq:'넘어지고',cause1:'넘어져서',cause2:'넘어지니까',condition:'넘어지면',contrast1:'넘어지지만',contrast2:'넘어지는데',purpose:'넘어지려고',result:'넘어져서 그렇게 되다'}},
      {ko:'넣다', ro:'a pune înăuntru', en:'to put in, insert', aliases:['pun înăuntru','pui înăuntru','pune înăuntru','punem înăuntru','puneți înăuntru','am pus înăuntru','ai pus înăuntru','a pus înăuntru','ați pus înăuntru','au pus înăuntru','put in','puts in','insert','inserts'], final:'넣어요', forms:{none:'넣어요',seq:'넣고',cause1:'넣어서',cause2:'넣으니까',condition:'넣으면',contrast1:'넣지만',contrast2:'넣는데',purpose:'넣으려고',result:'넣어서 그렇게 되다'}},
      {ko:'놀다', ro:'a se juca', en:'to play', aliases:['mă joc','te joci','se joacă','ne jucăm','vă jucați','m-am jucat','te-ai jucat','s-a jucat','ne-am jucat','v-ați jucat','s-au jucat','juca','play','plays'], final:'놀아요', forms:{none:'놀아요',seq:'놀고',cause1:'놀아서',cause2:'놀니까',condition:'놀면',contrast1:'놀지만',contrast2:'놀는데',purpose:'놀려고',result:'놀아서 그렇게 되다'}},
      {ko:'놀라다', ro:'a se speria / a fi surprins', en:'to be surprised', aliases:['mă sperii','te sperii','se sperie','ne speriem','vă speriați','m-am speriat','te-ai speriat','s-a speriat','ne-am speriat','v-ați speriat','s-au speriat','speria','fi surprins','be surprised','is surprised'], final:'놀라요', forms:{none:'놀라요',seq:'놀라고',cause1:'놀라서',cause2:'놀라니까',condition:'놀라면',contrast1:'놀라지만',contrast2:'놀라는데',purpose:'놀라려고',result:'놀라서 그렇게 되다'}},
      {ko:'누르다', ro:'a apăsa, a strânge', en:'to press, to push', aliases:['apăs','apeși','apasă','apăsăm','apăsați','am apăsat','ai apăsat','a apăsat','ați apăsat','au apăsat','apăsa','strânge','press','presses','push','pushes'], final:'눌러요', forms:{none:'눌러요',seq:'누르고',cause1:'눌러서',cause2:'누르니까',condition:'누르면',contrast1:'누르지만',contrast2:'누르는데',purpose:'누르려고',result:'눌러서 그렇게 되다'}},
      {ko:'눕다', ro:'a se culca, a se întinde', en:'to lie down', aliases:['mă culc','te culci','se culcă','ne culcăm','vă culcați','m-am culcat','te-ai culcat','s-a culcat','ne-am culcat','v-ați culcat','s-au culcat','culca','întinde','lie down','lies down'], final:'누워요', forms:{none:'누워요',seq:'눕고',cause1:'누워서',cause2:'눕으니까',condition:'눕으면',contrast1:'눕지만',contrast2:'눕는데',purpose:'눕으려고',result:'누워서 그렇게 되다'}},
      {ko:'늘다', ro:'a crește, a se îmbunătăți', en:'to increase, to improve', aliases:['cresc','crești','crește','creștem','creșteți','am crescut','ai crescut','a crescut','ați crescut','au crescut','îmbunătăți','increase','increases','improve','improves'], final:'늘어요', forms:{none:'늘어요',seq:'늘고',cause1:'늘어서',cause2:'늘니까',condition:'늘면',contrast1:'늘지만',contrast2:'늘는데',purpose:'늘려고',result:'늘어서 그렇게 되다'}},
      {ko:'늘리다', ro:'a mări, a extinde', en:'to increase, to extend', aliases:['măresc','mărești','mărește','mărim','măriți','am mărit','ai mărit','a mărit','ați mărit','au mărit','mări','extinde','increase','increases','extend','extends'], final:'늘려요', forms:{none:'늘려요',seq:'늘리고',cause1:'늘려서',cause2:'늘리니까',condition:'늘리면',contrast1:'늘리지만',contrast2:'늘리는데',purpose:'늘리려고',result:'늘려서 그렇게 되다'}},
      {ko:'늘어나다', ro:'a crește (în număr)', en:'to increase', aliases:['cresc','crești','crește','creștem','creșteți','am crescut','ai crescut','a crescut','ați crescut','au crescut','increase','increases'], final:'늘어나요', forms:{none:'늘어나요',seq:'늘어나고',cause1:'늘어나서',cause2:'늘어나니까',condition:'늘어나면',contrast1:'늘어나지만',contrast2:'늘어나는데',purpose:'늘어나려고',result:'늘어나서 그렇게 되다'}},
      {ko:'늦다', ro:'a fi târziu', en:'to be late', aliases:['sunt târziu','ești târziu','este târziu','suntem târziu','sunteți târziu','am fost târziu','ai fost târziu','a fost târziu','ați fost târziu','au fost târziu','fi târziu','be late','is late'], final:'늦어요', forms:{none:'늦어요',seq:'늦고',cause1:'늦어서',cause2:'늦으니까',condition:'늦으면',contrast1:'늦지만',contrast2:'늦는데',purpose:'늦으려고',result:'늦어서 그렇게 되다'}},
      {ko:'늦잠을 자다', ro:'a dormi prea mult', en:'to oversleep', aliases:['dorm prea mult','dormi prea mult','doarme prea mult','dormim prea mult','dormiți prea mult','am dormit prea mult','ai dormit prea mult','a dormit prea mult','ați dormit prea mult','au dormit prea mult','oversleep','oversleeps'], final:'늦잠을 자요', forms:{none:'늦잠을 자요',seq:'늦잠을 자고',cause1:'늦잠을 자서',cause2:'늦잠을 자니까',condition:'늦잠을 자면',contrast1:'늦잠을 자지만',contrast2:'늦잠을 자는데',purpose:'늦잠을 자려고',result:'늦잠을 자서 그렇게 되다'}},
      {ko:'다가오다', ro:'a se apropia', en:'to approach, to come closer', aliases:['mă apropii','te apropii','se apropie','ne apropiem','vă apropiați','m-am apropiat','te-ai apropiat','s-a apropiat','ne-am apropiat','v-ați apropiat','s-au apropiat','apropia','approach','approaches','come closer','comes closer'], final:'다가와요', forms:{none:'다가와요',seq:'다가오고',cause1:'다가와서',cause2:'다가오니까',condition:'다가오면',contrast1:'다가오지만',contrast2:'다가오는데',purpose:'다가오려고',result:'다가와서 그렇게 되다'}},
      {ko:'다니다', ro:'a frecventa, a merge regulat (la)', en:'to attend, to commute to', aliases:['frecventez','frecventezi','frecventează','frecventăm','frecventați','am frecventat','ai frecventat','a frecventat','ați frecventat','au frecventat','frecventa','merge regulat','attend','attends','commute to','commutes to'], final:'다녀요', forms:{none:'다녀요',seq:'다니고',cause1:'다녀서',cause2:'다니니까',condition:'다니면',contrast1:'다니지만',contrast2:'다니는데',purpose:'다니려고',result:'다녀서 그렇게 되다'}},
      {ko:'다운로드하다', ro:'a descărca', en:'to download', aliases:['descarc','descarci','descarcă','descărcăm','descărcați','am descărcat','ai descărcat','a descărcat','ați descărcat','au descărcat','descărca','download','downloads'], final:'다운로드해요', forms:{none:'다운로드해요',seq:'다운로드하고',cause1:'다운로드해서',cause2:'다운로드하니까',condition:'다운로드하면',contrast1:'다운로드하지만',contrast2:'다운로드하는데',purpose:'다운로드하려고',result:'다운로드해서 그렇게 되다'}},
      {ko:'다치다', ro:'a se răni', en:'to get hurt, to be injured', aliases:['mă rănesc','te rănești','se rănește','ne rănim','vă răniți','se rănesc','m-am rănit','te-ai rănit','s-a rănit','ne-am rănit','v-ați rănit','s-au rănit','răni','get hurt','gets hurt','be injured','is injured'], final:'다쳐요', forms:{none:'다쳐요',seq:'다치고',cause1:'다쳐서',cause2:'다치니까',condition:'다치면',contrast1:'다치지만',contrast2:'다치는데',purpose:'다치려고',result:'다쳐서 그렇게 되다'}},
      {ko:'닦다', ro:'a șterge / a curăța', en:'to wipe / to clean', aliases:['șterg','ștergi','șterge','ștergem','ștergeți','am șters','ai șters','a șters','ați șters','au șters','curăța','wipe','wipes','clean','cleans'], final:'닦아요', forms:{none:'닦아요',seq:'닦고',cause1:'닦아서',cause2:'닦으니까',condition:'닦으면',contrast1:'닦지만',contrast2:'닦는데',purpose:'닦으려고',result:'닦아서 그렇게 되다'}},
      {ko:'닫히다', ro:'a se închide', en:'to close (intransitive)', aliases:['mă închid','te închizi','se închide','ne închidem','vă închideți','se închid','m-am închis','te-ai închis','s-a închis','ne-am închis','v-ați închis','s-au închis','închide','close','closes'], final:'닫혀요', forms:{none:'닫혀요',seq:'닫히고',cause1:'닫혀서',cause2:'닫히니까',condition:'닫히면',contrast1:'닫히지만',contrast2:'닫히는데',purpose:'닫히려고',result:'닫혀서 그렇게 되다'}},
      {ko:'당기다', ro:'a trage', en:'to pull', aliases:['trag','tragi','trage','tragem','trageți','am tras','ai tras','a tras','ați tras','au tras','pull','pulls'], final:'당겨요', forms:{none:'당겨요',seq:'당기고',cause1:'당겨서',cause2:'당기니까',condition:'당기면',contrast1:'당기지만',contrast2:'당기는데',purpose:'당기려고',result:'당겨서 그렇게 되다'}},
      {ko:'대답하다', ro:'a răspunde', en:'to answer, to reply', aliases:['răspund','răspunzi','răspunde','răspundem','răspundeți','am răspuns','ai răspuns','a răspuns','ați răspuns','au răspuns','answer','answers','reply','replies'], final:'대답해요', forms:{none:'대답해요',seq:'대답하고',cause1:'대답해서',cause2:'대답하니까',condition:'대답하면',contrast1:'대답하지만',contrast2:'대답하는데',purpose:'대답하려고',result:'대답해서 그렇게 되다'}},
      {ko:'더워지다', ro:'a deveni cald', en:'to become hot', aliases:['devin cald','devii cald','devine cald','devenim cald','deveniți cald','am devenit cald','ai devenit cald','a devenit cald','ați devenit cald','au devenit cald','deveni cald','become hot','becomes hot'], final:'더워져요', forms:{none:'더워져요',seq:'더워지고',cause1:'더워져서',cause2:'더워지니까',condition:'더워지면',contrast1:'더워지지만',contrast2:'더워지는데',purpose:'더워지려고',result:'더워져서 그렇게 되다'}},
      {ko:'던지다', ro:'a arunca', en:'to throw', aliases:['arunc','arunci','aruncă','aruncăm','aruncați','am aruncat','ai aruncat','a aruncat','ați aruncat','au aruncat','arunca','throw','throws'], final:'던져요', forms:{none:'던져요',seq:'던지고',cause1:'던져서',cause2:'던지니까',condition:'던지면',contrast1:'던지지만',contrast2:'던지는데',purpose:'던지려고',result:'던져서 그렇게 되다'}},
      {ko:'덮다', ro:'a acoperi', en:'to cover', aliases:['acopăr','acoperi','acoperă','acoperim','acoperiți','am acoperit','ai acoperit','a acoperit','ați acoperit','au acoperit','cover','covers'], final:'덮어요', forms:{none:'덮어요',seq:'덮고',cause1:'덮어서',cause2:'덮으니까',condition:'덮으면',contrast1:'덮지만',contrast2:'덮는데',purpose:'덮으려고',result:'덮어서 그렇게 되다'}},
      {ko:'덮이다', ro:'a fi acoperit', en:'to be covered', aliases:['sunt acoperit','ești acoperit','este acoperit','suntem acoperiți','sunteți acoperiți','sunt acoperiți','am fost acoperit','ai fost acoperit','a fost acoperit','am fost acoperiți','ați fost acoperiți','au fost acoperiți','fi acoperit','be covered','is covered'], final:'덮여요', forms:{none:'덮여요',seq:'덮이고',cause1:'덮여서',cause2:'덮이니까',condition:'덮이면',contrast1:'덮이지만',contrast2:'덮이는데',purpose:'덮이려고',result:'덮여서 그렇게 되다'}},
      {ko:'도서관에 가다', ro:'a merge la bibliotecă', en:'to go to the library', aliases:['merg la bibliotecă','mergi la bibliotecă','merge la bibliotecă','mergem la bibliotecă','mergeți la bibliotecă','am mers la bibliotecă','ai mers la bibliotecă','a mers la bibliotecă','ați mers la bibliotecă','au mers la bibliotecă','go to the library','goes to the library'], final:'도서관에 가요', forms:{none:'도서관에 가요',seq:'도서관에 가고',cause1:'도서관에 가서',cause2:'도서관에 가니까',condition:'도서관에 가면',contrast1:'도서관에 가지만',contrast2:'도서관에 가는데',purpose:'도서관에 가려고',result:'도서관에 가서 그렇게 되다'}},
      {ko:'돌아가다', ro:'a merge înapoi', en:'to go back, to return', aliases:['merg înapoi','mergi înapoi','merge înapoi','mergem înapoi','mergeți înapoi','am mers înapoi','ai mers înapoi','a mers înapoi','ați mers înapoi','au mers înapoi','go back','goes back','return','returns'], final:'돌아가요', forms:{none:'돌아가요',seq:'돌아가고',cause1:'돌아가서',cause2:'돌아가니까',condition:'돌아가면',contrast1:'돌아가지만',contrast2:'돌아가는데',purpose:'돌아가려고',result:'돌아가서 그렇게 되다'}},
      {ko:'두다', ro:'a lăsa / a pune', en:'to leave / to put', aliases:['las','lași','lasă','lăsăm','lăsați','am lăsat','ai lăsat','a lăsat','ați lăsat','au lăsat','lăsa','pune','leave','leaves','put','puts'], final:'둬요', forms:{none:'둬요',seq:'두고',cause1:'둬서',cause2:'두니까',condition:'두면',contrast1:'두지만',contrast2:'두는데',purpose:'두려고',result:'둬서 그렇게 되다'}},
      {ko:'드시다', ro:'a mânca (onorific)', en:'to eat (honorific)', aliases:['mănânc','mănânci','mănâncă','mâncăm','mâncați','am mâncat','ai mâncat','a mâncat','ați mâncat','au mâncat','mânca','eat','eats'], final:'드셔요', forms:{none:'드셔요',seq:'드시고',cause1:'드셔서',cause2:'드시니까',condition:'드시면',contrast1:'드시지만',contrast2:'드시는데',purpose:'드시려고',result:'드셔서 그렇게 되다'}},
      {ko:'들다', ro:'a ridica, a ține', en:'to lift, to hold', aliases:['ridic','ridici','ridică','ridicăm','ridicați','am ridicat','ai ridicat','a ridicat','ați ridicat','au ridicat','ridica','ține','lift','lifts','hold','holds'], final:'들어요', forms:{none:'들어요',seq:'들고',cause1:'들어서',cause2:'들니까',condition:'들면',contrast1:'들지만',contrast2:'들는데',purpose:'들려고',result:'들어서 그렇게 되다'}},
      {ko:'들르다', ro:'a trece pe la, a face o oprire', en:'to stop by', aliases:['trec pe la','treci pe la','trece pe la','trecem pe la','treceți pe la','am trecut pe la','ai trecut pe la','a trecut pe la','ați trecut pe la','au trecut pe la','face o oprire','stop by','stops by'], final:'들러요', forms:{none:'들러요',seq:'들르고',cause1:'들러서',cause2:'들르니까',condition:'들르면',contrast1:'들르지만',contrast2:'들르는데',purpose:'들르려고',result:'들러서 그렇게 되다'}},
      {ko:'들리다', ro:'a se auzi', en:'to be heard, to sound', aliases:['mă aud','te auzi','se aude','ne auzim','vă auziți','se aud','m-am auzit','te-ai auzit','s-a auzit','ne-am auzit','v-ați auzit','s-au auzit','auzi','be heard','is heard','sound','sounds'], final:'들려요', forms:{none:'들려요',seq:'들리고',cause1:'들려서',cause2:'들리니까',condition:'들리면',contrast1:'들리지만',contrast2:'들리는데',purpose:'들리려고',result:'들려서 그렇게 되다'}},
      {ko:'들어가다', ro:'a intra', en:'to go in, to enter', aliases:['intr','intri','intră','intrăm','intrați','am intrat','ai intrat','a intrat','ați intrat','au intrat','intra','go in','goes in','enter','enters'], final:'들어가요', forms:{none:'들어가요',seq:'들어가고',cause1:'들어가서',cause2:'들어가니까',condition:'들어가면',contrast1:'들어가지만',contrast2:'들어가는데',purpose:'들어가려고',result:'들어가서 그렇게 되다'}},
      {ko:'등록하다', ro:'a înregistra, a se înscrie', en:'to register', aliases:['înregistrez','înregistrezi','înregistrează','înregistrăm','înregistrați','am înregistrat','ai înregistrat','a înregistrat','ați înregistrat','au înregistrat','înregistra','înscrie','register','registers'], final:'등록해요', forms:{none:'등록해요',seq:'등록하고',cause1:'등록해서',cause2:'등록하니까',condition:'등록하면',contrast1:'등록하지만',contrast2:'등록하는데',purpose:'등록하려고',result:'등록해서 그렇게 되다'}},
      {ko:'따르다', ro:'a urma, a turna', en:'to follow, to pour', aliases:['urmez','urmezi','urmează','urmăm','urmați','am urmat','ai urmat','a urmat','ați urmat','au urmat','urma','turna','follow','follows','pour','pours'], final:'따라요', forms:{none:'따라요',seq:'따르고',cause1:'따라서',cause2:'따르니까',condition:'따르면',contrast1:'따르지만',contrast2:'따르는데',purpose:'따르려고',result:'따라서 그렇게 되다'}},
      {ko:'땀이 나다', ro:'a transpira', en:'to sweat', aliases:['transpir','transpiri','transpiră','transpirăm','transpirați','am transpirat','ai transpirat','a transpirat','ați transpirat','au transpirat','transpira','sweat','sweats'], final:'땀이 나요', forms:{none:'땀이 나요',seq:'땀이 나고',cause1:'땀이 나서',cause2:'땀이 나니까',condition:'땀이 나면',contrast1:'땀이 나지만',contrast2:'땀이 나는데',purpose:'땀이 나려고',result:'땀이 나서 그렇게 되다'}},
      {ko:'떨어지다', ro:'a cădea, a se termina', en:'to fall, to run out', aliases:['cad','cazi','cade','cădem','cădeți','am căzut','ai căzut','a căzut','ați căzut','au căzut','cădea','termina','fall','falls','run out','runs out'], final:'떨어져요', forms:{none:'떨어져요',seq:'떨어지고',cause1:'떨어져서',cause2:'떨어지니까',condition:'떨어지면',contrast1:'떨어지지만',contrast2:'떨어지는데',purpose:'떨어지려고',result:'떨어져서 그렇게 되다'}},
      {ko:'뛰다', ro:'a alerga / a sări', en:'to run / to jump', aliases:['alerg','alergi','aleargă','alergăm','alergați','am alergat','ai alergat','a alergat','ați alergat','au alergat','alerga','sări','run','runs','jump','jumps'], final:'뛰어요', forms:{none:'뛰어요',seq:'뛰고',cause1:'뛰어서',cause2:'뛰니까',condition:'뛰면',contrast1:'뛰지만',contrast2:'뛰는데',purpose:'뛰려고',result:'뛰어서 그렇게 되다'}},
      {ko:'뜨다', ro:'a deschide (ochii), a pluti', en:'to open (eyes), to float', aliases:['deschid','deschizi','deschide','deschidem','deschideți','am deschis','ai deschis','a deschis','ați deschis','au deschis','pluti','open','opens','float','floats'], final:'떠요', forms:{none:'떠요',seq:'뜨고',cause1:'떠서',cause2:'뜨니까',condition:'뜨면',contrast1:'뜨지만',contrast2:'뜨는데',purpose:'뜨려고',result:'떠서 그렇게 되다'}},
      {ko:'로그아웃하다', ro:'a se deconecta', en:'to log out', aliases:['mă deconectez','te deconectezi','se deconectează','ne deconectăm','vă deconectați','m-am deconectat','te-ai deconectat','s-a deconectat','ne-am deconectat','v-ați deconectat','s-au deconectat','deconecta','log out','logs out'], final:'로그아웃해요', forms:{none:'로그아웃해요',seq:'로그아웃하고',cause1:'로그아웃해서',cause2:'로그아웃하니까',condition:'로그아웃하면',contrast1:'로그아웃하지만',contrast2:'로그아웃하는데',purpose:'로그아웃하려고',result:'로그아웃해서 그렇게 되다'}},
      {ko:'로그인하다', ro:'a se autentifica', en:'to log in', aliases:['mă autentific','te autentifici','se autentifică','ne autentificăm','vă autentificați','m-am autentificat','te-ai autentificat','s-a autentificat','ne-am autentificat','v-ați autentificat','s-au autentificat','autentifica','log in','logs in'], final:'로그인해요', forms:{none:'로그인해요',seq:'로그인하고',cause1:'로그인해서',cause2:'로그인하니까',condition:'로그인하면',contrast1:'로그인하지만',contrast2:'로그인하는데',purpose:'로그인하려고',result:'로그인해서 그렇게 되다'}},
      {ko:'마음에 들다', ro:'a-ți plăcea', en:'to like, to appeal to you', aliases:['plac','placi','place','plăcem','plăceți','am plăcut','ai plăcut','a plăcut','ați plăcut','au plăcut','plăcea','like','likes','appeal to you','appeals to you'], final:'마음에 들어요', forms:{none:'마음에 들어요',seq:'마음에 들고',cause1:'마음에 들어서',cause2:'마음에 들니까',condition:'마음에 들면',contrast1:'마음에 들지만',contrast2:'마음에 들는데',purpose:'마음에 들려고',result:'마음에 들어서 그렇게 되다'}},
      {ko:'마주치다', ro:'a se întâlni (privirile), a da nas în nas', en:'to encounter, to meet (eyes)', aliases:['mă întâlnesc','te întâlnești','se întâlnește','ne întâlnim','vă întâlniți','se întâlnesc','m-am întâlnit','te-ai întâlnit','s-a întâlnit','ne-am întâlnit','v-ați întâlnit','s-au întâlnit','întâlni','da nas în nas','encounter','encounters','meet','meets'], final:'마주쳐요', forms:{none:'마주쳐요',seq:'마주치고',cause1:'마주쳐서',cause2:'마주치니까',condition:'마주치면',contrast1:'마주치지만',contrast2:'마주치는데',purpose:'마주치려고',result:'마주쳐서 그렇게 되다'}},
      {ko:'막히다', ro:'a fi blocat', en:'to be blocked, to be stuck', aliases:['sunt blocat','ești blocat','este blocat','suntem blocați','sunteți blocați','sunt blocați','am fost blocat','ai fost blocat','a fost blocat','am fost blocați','ați fost blocați','au fost blocați','fi blocat','be blocked','is blocked','be stuck','is stuck'], final:'막혀요', forms:{none:'막혀요',seq:'막히고',cause1:'막혀서',cause2:'막히니까',condition:'막히면',contrast1:'막히지만',contrast2:'막히는데',purpose:'막히려고',result:'막혀서 그렇게 되다'}},
      {ko:'만족하다', ro:'a fi mulțumit', en:'to be satisfied', aliases:['sunt mulțumit','ești mulțumit','este mulțumit','suntem mulțumiți','sunteți mulțumiți','sunt mulțumiți','am fost mulțumit','ai fost mulțumit','a fost mulțumit','am fost mulțumiți','ați fost mulțumiți','au fost mulțumiți','fi mulțumit','be satisfied','is satisfied'], final:'만족해요', forms:{none:'만족해요',seq:'만족하고',cause1:'만족해서',cause2:'만족하니까',condition:'만족하면',contrast1:'만족하지만',contrast2:'만족하는데',purpose:'만족하려고',result:'만족해서 그렇게 되다'}},
      {ko:'망가지다', ro:'a se strica, a se rupe', en:'to break down, to get damaged', aliases:['mă stric','te strici','se strică','ne stricăm','vă stricați','m-am stricat','te-ai stricat','s-a stricat','ne-am stricat','v-ați stricat','s-au stricat','strica','rupe','break down','breaks down','get damaged','gets damaged'], final:'망가져요', forms:{none:'망가져요',seq:'망가지고',cause1:'망가져서',cause2:'망가지니까',condition:'망가지면',contrast1:'망가지지만',contrast2:'망가지는데',purpose:'망가지려고',result:'망가져서 그렇게 되다'}},
      {ko:'맡다', ro:'a prelua, a fi responsabil', en:'to take charge of, to be in charge', aliases:['preiau','preiei','preia','preluăm','preluați','am preluat','ai preluat','a preluat','ați preluat','au preluat','prelua','fi responsabil','take charge of','takes charge of','be in charge','is in charge'], final:'맡아요', forms:{none:'맡아요',seq:'맡고',cause1:'맡아서',cause2:'맡으니까',condition:'맡으면',contrast1:'맡지만',contrast2:'맡는데',purpose:'맡으려고',result:'맡아서 그렇게 되다'}},
      {ko:'매다', ro:'a lega / a purta (curea)', en:'to tie / to wear (belt)', aliases:['leg','legi','leagă','legăm','legați','am legat','ai legat','a legat','ați legat','au legat','lega','purta','tie','ties','wear','wears'], final:'매어요', forms:{none:'매어요',seq:'매고',cause1:'매어서',cause2:'매니까',condition:'매면',contrast1:'매지만',contrast2:'매는데',purpose:'매려고',result:'매어서 그렇게 되다'}},
      {ko:'면도하다', ro:'a se bărbieri', en:'to shave', aliases:['mă bărbieresc','te bărbierești','se bărbierește','ne bărbierim','vă bărbieriți','se bărbieresc','m-am bărbierit','te-ai bărbierit','s-a bărbierit','ne-am bărbierit','v-ați bărbierit','s-au bărbierit','bărbieri','shave','shaves'], final:'면도해요', forms:{none:'면도해요',seq:'면도하고',cause1:'면도해서',cause2:'면도하니까',condition:'면도하면',contrast1:'면도하지만',contrast2:'면도하는데',purpose:'면도하려고',result:'면도해서 그렇게 되다'}},
      {ko:'모르다', ro:'a nu ști', en:'to not know', aliases:['nu știu','nu știi','nu știe','nu știm','nu știți','nu am știut','nu ai știut','nu a știut','nu ați știut','nu au știut','ști','not know','nots know'], final:'몰라요', forms:{none:'몰라요',seq:'모르고',cause1:'몰라서',cause2:'모르니까',condition:'모르면',contrast1:'모르지만',contrast2:'모르는데',purpose:'모르려고',result:'몰라서 그렇게 되다'}},
      {ko:'모이다', ro:'a se aduna', en:'to gather, to assemble', aliases:['mă adun','te aduni','se adună','ne adunăm','vă adunați','m-am adunat','te-ai adunat','s-a adunat','ne-am adunat','v-ați adunat','s-au adunat','aduna','gather','gathers','assemble','assembles'], final:'모여요', forms:{none:'모여요',seq:'모이고',cause1:'모여서',cause2:'모이니까',condition:'모이면',contrast1:'모이지만',contrast2:'모이는데',purpose:'모이려고',result:'모여서 그렇게 되다'}},
      {ko:'문지르다', ro:'a freca, a masa', en:'to rub', aliases:['frec','freci','freacă','frecăm','frecați','am frecat','ai frecat','a frecat','ați frecat','au frecat','freca','masa','rub','rubs'], final:'문질러요', forms:{none:'문질러요',seq:'문지르고',cause1:'문질러서',cause2:'문지르니까',condition:'문지르면',contrast1:'문지르지만',contrast2:'문지르는데',purpose:'문지르려고',result:'문질러서 그렇게 되다'}},
      {ko:'물놀이하다', ro:'a se juca în apă', en:'to play in the water', aliases:['mă joc în apă','te joci în apă','se joacă în apă','ne jucăm în apă','vă jucați în apă','m-am jucat în apă','te-ai jucat în apă','s-a jucat în apă','ne-am jucat în apă','v-ați jucat în apă','s-au jucat în apă','juca în apă','play in the water','plays in the water'], final:'물놀이해요', forms:{none:'물놀이해요',seq:'물놀이하고',cause1:'물놀이해서',cause2:'물놀이하니까',condition:'물놀이하면',contrast1:'물놀이하지만',contrast2:'물놀이하는데',purpose:'물놀이하려고',result:'물놀이해서 그렇게 되다'}},
      {ko:'물어보다', ro:'a întreba', en:'to ask a question', aliases:['întreb','întrebi','întreabă','întrebăm','întrebați','am întrebat','ai întrebat','a întrebat','ați întrebat','au întrebat','întreba','ask a question','asks a question'], final:'물어봐요', forms:{none:'물어봐요',seq:'물어보고',cause1:'물어봐서',cause2:'물어보니까',condition:'물어보면',contrast1:'물어보지만',contrast2:'물어보는데',purpose:'물어보려고',result:'물어봐서 그렇게 되다'}},
      {ko:'믿다', ro:'a crede, a avea încredere', en:'to believe, to trust', aliases:['cred','crezi','crede','credem','credeți','am crezut','ai crezut','a crezut','ați crezut','au crezut','avea încredere','believe','believes','trust','trusts'], final:'믿어요', forms:{none:'믿어요',seq:'믿고',cause1:'믿어서',cause2:'믿으니까',condition:'믿으면',contrast1:'믿지만',contrast2:'믿는데',purpose:'믿으려고',result:'믿어서 그렇게 되다'}},
      {ko:'밀다', ro:'a împinge', en:'to push', aliases:['împing','împingi','împinge','împingem','împingeți','am împins','ai împins','a împins','ați împins','au împins','push','pushes'], final:'밀어요', forms:{none:'밀어요',seq:'밀고',cause1:'밀어서',cause2:'밀니까',condition:'밀면',contrast1:'밀지만',contrast2:'밀는데',purpose:'밀려고',result:'밀어서 그렇게 되다'}},
      {ko:'반복하다', ro:'a repeta', en:'to repeat', aliases:['repet','repeți','repetă','repetăm','repetați','am repetat','ai repetat','a repetat','ați repetat','au repetat','repeta','repeat','repeats'], final:'반복해요', forms:{none:'반복해요',seq:'반복하고',cause1:'반복해서',cause2:'반복하니까',condition:'반복하면',contrast1:'반복하지만',contrast2:'반복하는데',purpose:'반복하려고',result:'반복해서 그렇게 되다'}},
      {ko:'발견하다', ro:'a descoperi', en:'to discover', aliases:['descopăr','descoperi','descoperă','descoperim','descoperiți','am descoperit','ai descoperit','a descoperit','ați descoperit','au descoperit','discover','discovers'], final:'발견해요', forms:{none:'발견해요',seq:'발견하고',cause1:'발견해서',cause2:'발견하니까',condition:'발견하면',contrast1:'발견하지만',contrast2:'발견하는데',purpose:'발견하려고',result:'발견해서 그렇게 되다'}},
      {ko:'방문하다', ro:'a vizita', en:'to visit', aliases:['vizitez','vizitezi','vizitează','vizităm','vizitați','am vizitat','ai vizitat','a vizitat','ați vizitat','au vizitat','vizita','visit','visits'], final:'방문해요', forms:{none:'방문해요',seq:'방문하고',cause1:'방문해서',cause2:'방문하니까',condition:'방문하면',contrast1:'방문하지만',contrast2:'방문하는데',purpose:'방문하려고',result:'방문해서 그렇게 되다'}},
      {ko:'배가 고프다', ro:'a fi flămând', en:'to be hungry', aliases:['sunt flămând','ești flămând','este flămând','suntem flămânzi','sunteți flămânzi','sunt flămânzi','am fost flămând','ai fost flămând','a fost flămând','am fost flămânzi','ați fost flămânzi','au fost flămânzi','fi flămând','be hungry','is hungry','mi-e foame','ți-e foame','i-e foame','ne e foame','vă e foame','le e foame','imi este foame','iti este foame','ii este foame','ne este foame','va este foame','le este foame','mi-a fost foame','ti-a fost foame','i-a fost foame','ne-a fost foame','v-a fost foame','le-a fost foame','foame','hungry'], final:'배가 고파요', forms:{none:'배가 고파요',seq:'배가 고프고',cause1:'배가 고파서',cause2:'배가 고프니까',condition:'배가 고프면',contrast1:'배가 고프지만',contrast2:'배가 고프는데',purpose:'배가 고프려고',result:'배가 고파서 그렇게 되다'}},
      {ko:'배달하다', ro:'a livra', en:'to deliver', aliases:['livrez','livrezi','livrează','livrăm','livrați','am livrat','ai livrat','a livrat','ați livrat','au livrat','livra','deliver','delivers'], final:'배달해요', forms:{none:'배달해요',seq:'배달하고',cause1:'배달해서',cause2:'배달하니까',condition:'배달하면',contrast1:'배달하지만',contrast2:'배달하는데',purpose:'배달하려고',result:'배달해서 그렇게 되다'}},
      {ko:'버리다', ro:'a arunca', en:'to throw away, to discard', aliases:['arunc','arunci','aruncă','aruncăm','aruncați','am aruncat','ai aruncat','a aruncat','ați aruncat','au aruncat','arunca','throw away','throws away','discard','discards'], final:'버려요', forms:{none:'버려요',seq:'버리고',cause1:'버려서',cause2:'버리니까',condition:'버리면',contrast1:'버리지만',contrast2:'버리는데',purpose:'버리려고',result:'버려서 그렇게 되다'}},
      {ko:'벗다', ro:'a se dezbrăca', en:'to take off (clothes)', aliases:['mă dezbrac','te dezbraci','se dezbracă','ne dezbrăcăm','vă dezbrăcați','m-am dezbrăcat','te-ai dezbrăcat','s-a dezbrăcat','ne-am dezbrăcat','v-ați dezbrăcat','s-au dezbrăcat','dezbrăca','take off','takes off'], final:'벗어요', forms:{none:'벗어요',seq:'벗고',cause1:'벗어서',cause2:'벗으니까',condition:'벗으면',contrast1:'벗지만',contrast2:'벗는데',purpose:'벗으려고',result:'벗어서 그렇게 되다'}},
      {ko:'벗어나다', ro:'a scăpa / a ieși din', en:'to escape / get out of', aliases:['scap','scapi','scapă','scăpăm','scăpați','am scăpat','ai scăpat','a scăpat','ați scăpat','au scăpat','scăpa','ieși din','escape','escapes','get out of','gets out of'], final:'벗어나요', forms:{none:'벗어나요',seq:'벗어나고',cause1:'벗어나서',cause2:'벗어나니까',condition:'벗어나면',contrast1:'벗어나지만',contrast2:'벗어나는데',purpose:'벗어나려고',result:'벗어나서 그렇게 되다'}},
      {ko:'변하다', ro:'a deveni', en:'to become', aliases:['devin','devii','devine','devenim','deveniți','am devenit','ai devenit','a devenit','ați devenit','au devenit','deveni','become','becomes'], final:'변해요', forms:{none:'변해요',seq:'변하고',cause1:'변해서',cause2:'변하니까',condition:'변하면',contrast1:'변하지만',contrast2:'변하는데',purpose:'변하려고',result:'변해서 그렇게 되다'}},
      {ko:'보살피다', ro:'a îngriji, a veghea', en:'to take care of, to look after', aliases:['îngrijesc','îngrijești','îngrijește','îngrijim','îngrijiți','am îngrijit','ai îngrijit','a îngrijit','ați îngrijit','au îngrijit','îngriji','veghea','take care of','takes care of','look after','looks after'], final:'보살펴요', forms:{none:'보살펴요',seq:'보살피고',cause1:'보살펴서',cause2:'보살피니까',condition:'보살피면',contrast1:'보살피지만',contrast2:'보살피는데',purpose:'보살피려고',result:'보살펴서 그렇게 되다'}},
      {ko:'보이다', ro:'a se vedea, a părea', en:'to be seen, to seem', aliases:['mă văd','te vezi','se vede','ne vedem','vă vedeți','se văd','m-am văzut','te-ai văzut','s-a văzut','ne-am văzut','v-ați văzut','s-au văzut','vedea','părea','be seen','is seen','seem','seems'], final:'보여요', forms:{none:'보여요',seq:'보이고',cause1:'보여서',cause2:'보이니까',condition:'보이면',contrast1:'보이지만',contrast2:'보이는데',purpose:'보이려고',result:'보여서 그렇게 되다'}},
      {ko:'보호하다', ro:'a proteja', en:'to protect', aliases:['protejez','protejezi','protejează','protejăm','protejați','am protejat','ai protejat','a protejat','ați protejat','au protejat','proteja','protect','protects'], final:'보호해요', forms:{none:'보호해요',seq:'보호하고',cause1:'보호해서',cause2:'보호하니까',condition:'보호하면',contrast1:'보호하지만',contrast2:'보호하는데',purpose:'보호하려고',result:'보호해서 그렇게 되다'}},
      {ko:'부딪히다', ro:'a se ciocni', en:'to collide / bump into', aliases:['mă ciocnesc','te ciocnești','se ciocnește','ne ciocnim','vă ciocniți','se ciocnesc','m-am ciocnit','te-ai ciocnit','s-a ciocnit','ne-am ciocnit','v-ați ciocnit','s-au ciocnit','ciocni','collide','collides','bump into','bumps into'], final:'부딪혀요', forms:{none:'부딪혀요',seq:'부딪히고',cause1:'부딪혀서',cause2:'부딪히니까',condition:'부딪히면',contrast1:'부딪히지만',contrast2:'부딪히는데',purpose:'부딪히려고',result:'부딪혀서 그렇게 되다'}},
      {ko:'부르다', ro:'a cânta, a striga', en:'to sing, to call', aliases:['cânt','cânți','cântă','cântăm','cântați','am cântat','ai cântat','a cântat','ați cântat','au cântat','cânta','striga','sing','sings','call','calls'], final:'불러요', forms:{none:'불러요',seq:'부르고',cause1:'불러서',cause2:'부르니까',condition:'부르면',contrast1:'부르지만',contrast2:'부르는데',purpose:'부르려고',result:'불러서 그렇게 되다'}},
      {ko:'부탁하다', ro:'a ruga, a cere un favor', en:'to ask a favor', aliases:['rog','rogi','roagă','rugăm','rugați','am rugat','ai rugat','a rugat','ați rugat','au rugat','ruga','cere un favor','ask a favor','asks a favor'], final:'부탁해요', forms:{none:'부탁해요',seq:'부탁하고',cause1:'부탁해서',cause2:'부탁하니까',condition:'부탁하면',contrast1:'부탁하지만',contrast2:'부탁하는데',purpose:'부탁하려고',result:'부탁해서 그렇게 되다'}},
      {ko:'분석하다', ro:'a analiza', en:'to analyze', aliases:['analizez','analizezi','analizează','analizăm','analizați','am analizat','ai analizat','a analizat','ați analizat','au analizat','analiza','analyze','analyzes'], final:'분석해요', forms:{none:'분석해요',seq:'분석하고',cause1:'분석해서',cause2:'분석하니까',condition:'분석하면',contrast1:'분석하지만',contrast2:'분석하는데',purpose:'분석하려고',result:'분석해서 그렇게 되다'}},
      {ko:'비가 오다', ro:'a ploua', en:'to rain', aliases:['plou','ploui','plouă','plouăm','plouați','am plouat','ai plouat','a plouat','ați plouat','au plouat','ploua','rain','rains'], final:'비가 와요', forms:{none:'비가 와요',seq:'비가 오고',cause1:'비가 와서',cause2:'비가 오니까',condition:'비가 오면',contrast1:'비가 오지만',contrast2:'비가 오는데',purpose:'비가 오려고',result:'비가 와서 그렇게 되다'}},
      {ko:'비교하다', ro:'a compara', en:'to compare', aliases:['compar','compari','compară','comparăm','comparați','am comparat','ai comparat','a comparat','ați comparat','au comparat','compara','compare','compares'], final:'비교해요', forms:{none:'비교해요',seq:'비교하고',cause1:'비교해서',cause2:'비교하니까',condition:'비교하면',contrast1:'비교하지만',contrast2:'비교하는데',purpose:'비교하려고',result:'비교해서 그렇게 되다'}},
      {ko:'비행기를 타다', ro:'a lua avionul', en:'to board the plane', aliases:['iau avionul','iei avionul','ia avionul','luăm avionul','luați avionul','am luat avionul','ai luat avionul','a luat avionul','ați luat avionul','au luat avionul','lua avionul','board the plane','boards the plane'], final:'비행기를 타요', forms:{none:'비행기를 타요',seq:'비행기를 타고',cause1:'비행기를 타서',cause2:'비행기를 타니까',condition:'비행기를 타면',contrast1:'비행기를 타지만',contrast2:'비행기를 타는데',purpose:'비행기를 타려고',result:'비행기를 타서 그렇게 되다'}},
      {ko:'빌려주다', ro:'a împrumuta (cuiva)', en:'to lend', aliases:['împrumut','împrumuți','împrumută','împrumutăm','împrumutați','am împrumutat','ai împrumutat','a împrumutat','ați împrumutat','au împrumutat','împrumuta','lend','lends'], final:'빌려줘요', forms:{none:'빌려줘요',seq:'빌려주고',cause1:'빌려줘서',cause2:'빌려주니까',condition:'빌려주면',contrast1:'빌려주지만',contrast2:'빌려주는데',purpose:'빌려주려고',result:'빌려줘서 그렇게 되다'}},
      {ko:'빨래하다', ro:'a spăla rufe', en:'to do laundry', aliases:['spăl rufe','speli rufe','spală rufe','spălăm rufe','spălați rufe','am spălat rufe','ai spălat rufe','a spălat rufe','ați spălat rufe','au spălat rufe','spăla rufe','do laundry','does laundry'], final:'빨래해요', forms:{none:'빨래해요',seq:'빨래하고',cause1:'빨래해서',cause2:'빨래하니까',condition:'빨래하면',contrast1:'빨래하지만',contrast2:'빨래하는데',purpose:'빨래하려고',result:'빨래해서 그렇게 되다'}},
      {ko:'빼다', ro:'a scoate / a scădea', en:'to remove / to subtract', aliases:['scoat','scoați','scoate','scoatem','scoateți','am scos','ai scos','a scos','ați scos','au scos','scădea','remove','removes','subtract','subtracts'], final:'빼어요', forms:{none:'빼어요',seq:'빼고',cause1:'빼어서',cause2:'빼니까',condition:'빼면',contrast1:'빼지만',contrast2:'빼는데',purpose:'빼려고',result:'빼어서 그렇게 되다'}},
      {ko:'사과하다', ro:'a-și cere scuze', en:'to apologize', aliases:['îmi cer scuze','îți ceri scuze','își cere scuze','ne cerem scuze','vă cereți scuze','își cer scuze','mi-am cerut scuze','ți-ai cerut scuze','și-a cerut scuze','ne-am cerut scuze','v-ați cerut scuze','și-au cerut scuze','cere scuze','apologize','apologizes'], final:'사과해요', forms:{none:'사과해요',seq:'사과하고',cause1:'사과해서',cause2:'사과하니까',condition:'사과하면',contrast1:'사과하지만',contrast2:'사과하는데',purpose:'사과하려고',result:'사과해서 그렇게 되다'}},
      {ko:'사귀다', ro:'a se împrieteni, a fi într-o relație', en:'to date, to make friends', aliases:['mă împrietenesc','te împrietenești','se împrietenește','ne împrietenim','vă împrieteniți','se împrietenesc','m-am împrietenit','te-ai împrietenit','s-a împrietenit','ne-am împrietenit','v-ați împrietenit','s-au împrietenit','împrieteni','fi într-o relație','date','dates','make friends','makes friends'], final:'사귀어요', forms:{none:'사귀어요',seq:'사귀고',cause1:'사귀어서',cause2:'사귀니까',condition:'사귀면',contrast1:'사귀지만',contrast2:'사귀는데',purpose:'사귀려고',result:'사귀어서 그렇게 되다'}},
      {ko:'사라지다', ro:'a dispărea', en:'to disappear', aliases:['dispar','dispari','dispare','dispărem','dispăreți','am dispărut','ai dispărut','a dispărut','ați dispărut','au dispărut','dispărea','disappear','disappears'], final:'사라져요', forms:{none:'사라져요',seq:'사라지고',cause1:'사라져서',cause2:'사라지니까',condition:'사라지면',contrast1:'사라지지만',contrast2:'사라지는데',purpose:'사라지려고',result:'사라져서 그렇게 되다'}},
      {ko:'살다', ro:'a trăi', en:'to live', aliases:['trăiesc','trăiești','trăiește','trăim','trăiți','am trăit','ai trăit','a trăit','ați trăit','au trăit','trăi','live','lives'], final:'살아요', forms:{none:'살아요',seq:'살고',cause1:'살아서',cause2:'사니까',condition:'살면',contrast1:'살지만',contrast2:'사는데',purpose:'살려고',result:'살아서 그렇게 되다'}},
      {ko:'상상하다', ro:'a-și imagina', en:'to imagine', aliases:['îmi imaginez','îți imaginezi','își imaginează','ne imaginăm','vă imaginați','mi-am imaginat','ți-ai imaginat','și-a imaginat','ne-am imaginat','v-ați imaginat','și-au imaginat','imagina','imagine','imagines'], final:'상상해요', forms:{none:'상상해요',seq:'상상하고',cause1:'상상해서',cause2:'상상하니까',condition:'상상하면',contrast1:'상상하지만',contrast2:'상상하는데',purpose:'상상하려고',result:'상상해서 그렇게 되다'}},
      {ko:'생기다', ro:'a apărea, a lua ființă', en:'to arise, to come into existence', aliases:['apar','apari','apare','apărem','apăreți','am apărut','ai apărut','a apărut','ați apărut','au apărut','apărea','lua ființă','arise','arises','come into existence','comes into existence'], final:'생겨요', forms:{none:'생겨요',seq:'생기고',cause1:'생겨서',cause2:'생기니까',condition:'생기면',contrast1:'생기지만',contrast2:'생기는데',purpose:'생기려고',result:'생겨서 그렇게 되다'}},
      {ko:'샤워하다', ro:'a face duș', en:'to take a shower', aliases:['fac duș','faci duș','face duș','facem duș','faceți duș','am făcut duș','ai făcut duș','a făcut duș','ați făcut duș','au făcut duș','take a shower','takes a shower'], final:'샤워해요', forms:{none:'샤워해요',seq:'샤워하고',cause1:'샤워해서',cause2:'샤워하니까',condition:'샤워하면',contrast1:'샤워하지만',contrast2:'샤워하는데',purpose:'샤워하려고',result:'샤워해서 그렇게 되다'}},
      {ko:'서다', ro:'a sta în picioare', en:'to stand', aliases:['stau în picioare','stai în picioare','stă în picioare','stăm în picioare','stați în picioare','am stat în picioare','ai stat în picioare','a stat în picioare','ați stat în picioare','au stat în picioare','sta în picioare','stand','stands'], final:'서어요', forms:{none:'서어요',seq:'서고',cause1:'서어서',cause2:'서니까',condition:'서면',contrast1:'서지만',contrast2:'서는데',purpose:'서려고',result:'서어서 그렇게 되다'}},
      {ko:'섞다', ro:'a amesteca', en:'to mix', aliases:['amestec','amesteci','amestecă','amestecăm','amestecați','am amestecat','ai amestecat','a amestecat','ați amestecat','au amestecat','amesteca','mix','mixes'], final:'섞어요', forms:{none:'섞어요',seq:'섞고',cause1:'섞어서',cause2:'섞으니까',condition:'섞으면',contrast1:'섞지만',contrast2:'섞는데',purpose:'섞으려고',result:'섞어서 그렇게 되다'}},
      {ko:'설치하다', ro:'a instala', en:'to install', aliases:['instalez','instalezi','instalează','instalăm','instalați','am instalat','ai instalat','a instalat','ați instalat','au instalat','instala','install','installs'], final:'설치해요', forms:{none:'설치해요',seq:'설치하고',cause1:'설치해서',cause2:'설치하니까',condition:'설치하면',contrast1:'설치하지만',contrast2:'설치하는데',purpose:'설치하려고',result:'설치해서 그렇게 되다'}},
      {ko:'소개하다', ro:'a prezenta, a introduce', en:'to introduce', aliases:['prezint','prezinți','prezintă','prezentăm','prezentați','am prezentat','ai prezentat','a prezentat','ați prezentat','au prezentat','prezenta','introduce','introduces'], final:'소개해요', forms:{none:'소개해요',seq:'소개하고',cause1:'소개해서',cause2:'소개하니까',condition:'소개하면',contrast1:'소개하지만',contrast2:'소개하는데',purpose:'소개하려고',result:'소개해서 그렇게 되다'}},
      {ko:'쇼핑하다', ro:'a face cumpărături', en:'to go shopping', aliases:['fac cumpărături','faci cumpărături','face cumpărături','facem cumpărături','faceți cumpărături','am făcut cumpărături','ai făcut cumpărături','a făcut cumpărături','ați făcut cumpărături','au făcut cumpărături','go shopping','goes shopping'], final:'쇼핑해요', forms:{none:'쇼핑해요',seq:'쇼핑하고',cause1:'쇼핑해서',cause2:'쇼핑하니까',condition:'쇼핑하면',contrast1:'쇼핑하지만',contrast2:'쇼핑하는데',purpose:'쇼핑하려고',result:'쇼핑해서 그렇게 되다'}},
      {ko:'수속하다', ro:'a face check-in', en:'to check in', aliases:['fac check-in','faci check-in','face check-in','facem check-in','faceți check-in','am făcut check-in','ai făcut check-in','a făcut check-in','ați făcut check-in','au făcut check-in','check in','checks in'], final:'수속해요', forms:{none:'수속해요',seq:'수속하고',cause1:'수속해서',cause2:'수속하니까',condition:'수속하면',contrast1:'수속하지만',contrast2:'수속하는데',purpose:'수속하려고',result:'수속해서 그렇게 되다'}},
      {ko:'수영하다', ro:'a înota', en:'to swim', aliases:['înot','înoți','înoată','înotăm','înotați','am înotat','ai înotat','a înotat','ați înotat','au înotat','înota','swim','swims'], final:'수영해요', forms:{none:'수영해요',seq:'수영하고',cause1:'수영해서',cause2:'수영하니까',condition:'수영하면',contrast1:'수영하지만',contrast2:'수영하는데',purpose:'수영하려고',result:'수영해서 그렇게 되다'}},
      {ko:'숨다', ro:'a se ascunde', en:'to hide', aliases:['mă ascund','te ascunzi','se ascunde','ne ascundem','vă ascundeți','se ascund','m-am ascuns','te-ai ascuns','s-a ascuns','ne-am ascuns','v-ați ascuns','s-au ascuns','ascunde','hide','hides'], final:'숨어요', forms:{none:'숨어요',seq:'숨고',cause1:'숨어서',cause2:'숨으니까',condition:'숨으면',contrast1:'숨지만',contrast2:'숨는데',purpose:'숨으려고',result:'숨어서 그렇게 되다'}},
      {ko:'시도하다', ro:'a încerca', en:'to attempt', aliases:['încerc','încerci','încearcă','încercăm','încercați','am încercat','ai încercat','a încercat','ați încercat','au încercat','încerca','attempt','attempts'], final:'시도해요', forms:{none:'시도해요',seq:'시도하고',cause1:'시도해서',cause2:'시도하니까',condition:'시도하면',contrast1:'시도하지만',contrast2:'시도하는데',purpose:'시도하려고',result:'시도해서 그렇게 되다'}},
      {ko:'시작하다', ro:'a începe', en:'to start', aliases:['încep','începi','începe','începem','începeți','am început','ai început','a început','ați început','au început','start','starts'], final:'시작해요', forms:{none:'시작해요',seq:'시작하고',cause1:'시작해서',cause2:'시작하니까',condition:'시작하면',contrast1:'시작하지만',contrast2:'시작하는데',purpose:'시작하려고',result:'시작해서 그렇게 되다'}},
      {ko:'시키다', ro:'a comanda / a pune pe cineva să facă', en:'to order / to make someone do', aliases:['comand','comandi','comandă','comandăm','comandați','am comandat','ai comandat','a comandat','ați comandat','au comandat','comanda','pune pe cineva să facă','order','orders','make someone do','makes someone do'], final:'시켜요', forms:{none:'시켜요',seq:'시키고',cause1:'시켜서',cause2:'시키니까',condition:'시키면',contrast1:'시키지만',contrast2:'시키는데',purpose:'시키려고',result:'시켜서 그렇게 되다'}},
      {ko:'시험이 있다', ro:'a fi examen', en:'to have an exam', aliases:['sunt examen','ești examen','este examen','suntem examen','sunteți examen','am fost examen','ai fost examen','a fost examen','ați fost examen','au fost examen','fi examen','have an exam','has an exam'], final:'시험이 있어요', forms:{none:'시험이 있어요',seq:'시험이 있고',cause1:'시험이 있어서',cause2:'시험이 있으니까',condition:'시험이 있으면',contrast1:'시험이 있지만',contrast2:'시험이 있는데',purpose:'시험이 있으려고',result:'시험이 있어서 그렇게 되다'}},
      {ko:'신다', ro:'a încălța', en:'to put on footwear', aliases:['încalț','încalți','încalță','încălțăm','încălțați','am încălțat','ai încălțat','a încălțat','ați încălțat','au încălțat','încălța','put on footwear','puts on footwear'], final:'신어요', forms:{none:'신어요',seq:'신고',cause1:'신어서',cause2:'신으니까',condition:'신으면',contrast1:'신지만',contrast2:'신는데',purpose:'신으려고',result:'신어서 그렇게 되다'}},
      {ko:'실망하다', ro:'a fi dezamăgit', en:'to be disappointed', aliases:['sunt dezamăgit','ești dezamăgit','este dezamăgit','suntem dezamăgiți','sunteți dezamăgiți','sunt dezamăgiți','am fost dezamăgit','ai fost dezamăgit','a fost dezamăgit','am fost dezamăgiți','ați fost dezamăgiți','au fost dezamăgiți','fi dezamăgit','be disappointed','is disappointed'], final:'실망해요', forms:{none:'실망해요',seq:'실망하고',cause1:'실망해서',cause2:'실망하니까',condition:'실망하면',contrast1:'실망하지만',contrast2:'실망하는데',purpose:'실망하려고',result:'실망해서 그렇게 되다'}},
      {ko:'싸우다', ro:'a se certa, a se lupta', en:'to fight, to argue', aliases:['mă cert','te cerți','se ceartă','ne certăm','vă certați','m-am certat','te-ai certat','s-a certat','ne-am certat','v-ați certat','s-au certat','certa','lupta','fight','fights','argue','argues'], final:'싸워요', forms:{none:'싸워요',seq:'싸우고',cause1:'싸워서',cause2:'싸우니까',condition:'싸우면',contrast1:'싸우지만',contrast2:'싸우는데',purpose:'싸우려고',result:'싸워서 그렇게 되다'}},
      {ko:'쌓이다', ro:'a se aduna, a se depune', en:'to pile up, accumulate', aliases:['mă adun','te aduni','se adună','ne adunăm','vă adunați','m-am adunat','te-ai adunat','s-a adunat','ne-am adunat','v-ați adunat','s-au adunat','aduna','depune','pile up','piles up','accumulate','accumulates'], final:'쌓여요', forms:{none:'쌓여요',seq:'쌓이고',cause1:'쌓여서',cause2:'쌓이니까',condition:'쌓이면',contrast1:'쌓이지만',contrast2:'쌓이는데',purpose:'쌓이려고',result:'쌓여서 그렇게 되다'}},
      {ko:'쓰러지다', ro:'a cădea, a leșina', en:'to collapse, to faint', aliases:['cad','cazi','cade','cădem','cădeți','am căzut','ai căzut','a căzut','ați căzut','au căzut','cădea','leșina','collapse','collapses','faint','faints'], final:'쓰러져요', forms:{none:'쓰러져요',seq:'쓰러지고',cause1:'쓰러져서',cause2:'쓰러지니까',condition:'쓰러지면',contrast1:'쓰러지지만',contrast2:'쓰러지는데',purpose:'쓰러지려고',result:'쓰러져서 그렇게 되다'}},
      {ko:'안심하다', ro:'a se liniști', en:'to feel relieved', aliases:['mă liniștesc','te liniștești','se liniștește','ne liniștim','vă liniștiți','se liniștesc','m-am liniștit','te-ai liniștit','s-a liniștit','ne-am liniștit','v-ați liniștit','s-au liniștit','liniști','feel relieved','feels relieved'], final:'안심해요', forms:{none:'안심해요',seq:'안심하고',cause1:'안심해서',cause2:'안심하니까',condition:'안심하면',contrast1:'안심하지만',contrast2:'안심하는데',purpose:'안심하려고',result:'안심해서 그렇게 되다'}},
      {ko:'앉다', ro:'a se așeza', en:'to sit', aliases:['mă așez','te așezi','se așază','ne așezăm','vă așezați','m-am așezat','te-ai așezat','s-a așezat','ne-am așezat','v-ați așezat','s-au așezat','așeza','sit','sits'], final:'앉아요', forms:{none:'앉아요',seq:'앉고',cause1:'앉아서',cause2:'앉으니까',condition:'앉으면',contrast1:'앉지만',contrast2:'앉는데',purpose:'앉으려고',result:'앉아서 그렇게 되다'}},
      {ko:'알람을 맞추다', ro:'a seta alarma', en:'to set an alarm', aliases:['setez alarma','setezi alarma','setează alarma','setăm alarma','setați alarma','am setat alarma','ai setat alarma','a setat alarma','ați setat alarma','au setat alarma','seta alarma','set an alarm','sets an alarm'], final:'알람을 맞춰요', forms:{none:'알람을 맞춰요',seq:'알람을 맞추고',cause1:'알람을 맞춰서',cause2:'알람을 맞추니까',condition:'알람을 맞추면',contrast1:'알람을 맞추지만',contrast2:'알람을 맞추는데',purpose:'알람을 맞추려고',result:'알람을 맞춰서 그렇게 되다'}},
      {ko:'알아듣다', ro:'a înțelege (ascultând)', en:'to understand (by listening)', aliases:['înțeleg','înțelegi','înțelege','înțelegem','înțelegeți','am înțeles','ai înțeles','a înțeles','ați înțeles','au înțeles','understand','understands'], final:'알아들어요', forms:{none:'알아들어요',seq:'알아듣고',cause1:'알아들어서',cause2:'알아듣으니까',condition:'알아듣으면',contrast1:'알아듣지만',contrast2:'알아듣는데',purpose:'알아듣으려고',result:'알아들어서 그렇게 되다'}},
      {ko:'알아보다', ro:'a cerceta, a afla', en:'to find out, to look into', aliases:['cercetez','cercetezi','cercetează','cercetăm','cercetați','am cercetat','ai cercetat','a cercetat','ați cercetat','au cercetat','cerceta','afla','find out','finds out','look into','looks into'], final:'알아봐요', forms:{none:'알아봐요',seq:'알아보고',cause1:'알아봐서',cause2:'알아보니까',condition:'알아보면',contrast1:'알아보지만',contrast2:'알아보는데',purpose:'알아보려고',result:'알아봐서 그렇게 되다'}},
      {ko:'약속하다', ro:'a promite, a se întâlni', en:'to promise, to make an appointment', aliases:['promit','promiți','promite','promitem','promiteți','am promis','ai promis','a promis','ați promis','au promis','întâlni','promise','promises','make an appointment','makes an appointment'], final:'약속해요', forms:{none:'약속해요',seq:'약속하고',cause1:'약속해서',cause2:'약속하니까',condition:'약속하면',contrast1:'약속하지만',contrast2:'약속하는데',purpose:'약속하려고',result:'약속해서 그렇게 되다'}},
      {ko:'약을 먹다', ro:'a lua medicament', en:'to take medicine', aliases:['iau medicament','iei medicament','ia medicament','luăm medicament','luați medicament','am luat medicament','ai luat medicament','a luat medicament','ați luat medicament','au luat medicament','lua medicament','take medicine','takes medicine'], final:'약을 먹어요', forms:{none:'약을 먹어요',seq:'약을 먹고',cause1:'약을 먹어서',cause2:'약을 먹으니까',condition:'약을 먹으면',contrast1:'약을 먹지만',contrast2:'약을 먹는데',purpose:'약을 먹으려고',result:'약을 먹어서 그렇게 되다'}},
      {ko:'약을 사다', ro:'a cumpăra medicament', en:'to buy medicine', aliases:['cumpăr medicament','cumpări medicament','cumpără medicament','cumpărăm medicament','cumpărați medicament','am cumpărat medicament','ai cumpărat medicament','a cumpărat medicament','ați cumpărat medicament','au cumpărat medicament','cumpăra medicament','buy medicine','buys medicine'], final:'약을 사요', forms:{none:'약을 사요',seq:'약을 사고',cause1:'약을 사서',cause2:'약을 사니까',condition:'약을 사면',contrast1:'약을 사지만',contrast2:'약을 사는데',purpose:'약을 사려고',result:'약을 사서 그렇게 되다'}},
      {ko:'어울리다', ro:'a se potrivi', en:'to suit, to match, to fit', aliases:['mă potrivesc','te potrivești','se potrivește','ne potrivim','vă potriviți','se potrivesc','m-am potrivit','te-ai potrivit','s-a potrivit','ne-am potrivit','v-ați potrivit','s-au potrivit','potrivi','suit','suits','match','matches','fit','fits'], final:'어울려요', forms:{none:'어울려요',seq:'어울리고',cause1:'어울려서',cause2:'어울리니까',condition:'어울리면',contrast1:'어울리지만',contrast2:'어울리는데',purpose:'어울리려고',result:'어울려서 그렇게 되다'}},
      {ko:'얻다', ro:'a obține, a câștiga', en:'to obtain, to gain', aliases:['obțin','obțini','obține','obținem','obțineți','am obținut','ai obținut','a obținut','ați obținut','au obținut','câștiga','obtain','obtains','gain','gains'], final:'얻어요', forms:{none:'얻어요',seq:'얻고',cause1:'얻어서',cause2:'얻으니까',condition:'얻으면',contrast1:'얻지만',contrast2:'얻는데',purpose:'얻으려고',result:'얻어서 그렇게 되다'}},
      {ko:'업로드하다', ro:'a încărca (online)', en:'to upload', aliases:['încarc','încarci','încarcă','încărcăm','încărcați','am încărcat','ai încărcat','a încărcat','ați încărcat','au încărcat','încărca','upload','uploads'], final:'업로드해요', forms:{none:'업로드해요',seq:'업로드하고',cause1:'업로드해서',cause2:'업로드하니까',condition:'업로드하면',contrast1:'업로드하지만',contrast2:'업로드하는데',purpose:'업로드하려고',result:'업로드해서 그렇게 되다'}},
      {ko:'없다', ro:'a nu exista, a nu fi', en:'to not exist, to not have', aliases:['nu exist','nu exisți','nu există','nu existăm','nu existați','nu am existat','nu ai existat','nu a existat','nu ați existat','nu au existat','exista','fi','not exist','nots exist','not have','nots have'], final:'없어요', forms:{none:'없어요',seq:'없고',cause1:'없어서',cause2:'없으니까',condition:'없으면',contrast1:'없지만',contrast2:'없는데',purpose:'없으려고',result:'없어서 그렇게 되다'}},
      {ko:'여권을 챙기다', ro:'a lua pașaportul', en:'to bring the passport', aliases:['iau pașaportul','iei pașaportul','ia pașaportul','luăm pașaportul','luați pașaportul','am luat pașaportul','ai luat pașaportul','a luat pașaportul','ați luat pașaportul','au luat pașaportul','lua pașaportul','bring the passport','brings the passport'], final:'여권을 챙겨요', forms:{none:'여권을 챙겨요',seq:'여권을 챙기고',cause1:'여권을 챙겨서',cause2:'여권을 챙기니까',condition:'여권을 챙기면',contrast1:'여권을 챙기지만',contrast2:'여권을 챙기는데',purpose:'여권을 챙기려고',result:'여권을 챙겨서 그렇게 되다'}},
      {ko:'연구하다', ro:'a cerceta', en:'to research', aliases:['cercetez','cercetezi','cercetează','cercetăm','cercetați','am cercetat','ai cercetat','a cercetat','ați cercetat','au cercetat','cerceta','research','researches'], final:'연구해요', forms:{none:'연구해요',seq:'연구하고',cause1:'연구해서',cause2:'연구하니까',condition:'연구하면',contrast1:'연구하지만',contrast2:'연구하는데',purpose:'연구하려고',result:'연구해서 그렇게 되다'}},
      {ko:'연락하다', ro:'a contacta', en:'to contact, to get in touch', aliases:['contactez','contactezi','contactează','contactăm','contactați','am contactat','ai contactat','a contactat','ați contactat','au contactat','contacta','contact','contacts','get in touch','gets in touch'], final:'연락해요', forms:{none:'연락해요',seq:'연락하고',cause1:'연락해서',cause2:'연락하니까',condition:'연락하면',contrast1:'연락하지만',contrast2:'연락하는데',purpose:'연락하려고',result:'연락해서 그렇게 되다'}},
      {ko:'열리다', ro:'a se deschide', en:'to open (intransitive)', aliases:['mă deschid','te deschizi','se deschide','ne deschidem','vă deschideți','se deschid','m-am deschis','te-ai deschis','s-a deschis','ne-am deschis','v-ați deschis','s-au deschis','deschide','open','opens'], final:'열려요', forms:{none:'열려요',seq:'열리고',cause1:'열려서',cause2:'열리니까',condition:'열리면',contrast1:'열리지만',contrast2:'열리는데',purpose:'열리려고',result:'열려서 그렇게 되다'}},
      {ko:'열이 나다', ro:'a avea febră', en:'to have a fever', aliases:['am febră','ai febră','are febră','avem febră','aveți febră','au febră','am avut febră','ai avut febră','a avut febră','ați avut febră','au avut febră','avea febră','have a fever','has a fever'], final:'열이 나요', forms:{none:'열이 나요',seq:'열이 나고',cause1:'열이 나서',cause2:'열이 나니까',condition:'열이 나면',contrast1:'열이 나지만',contrast2:'열이 나는데',purpose:'열이 나려고',result:'열이 나서 그렇게 되다'}},
      {ko:'영수증을 받다', ro:'a primi chitanța', en:'to get a receipt', aliases:['primesc chitanța','primești chitanța','primește chitanța','primim chitanța','primiți chitanța','am primit chitanța','ai primit chitanța','a primit chitanța','ați primit chitanța','au primit chitanța','primi chitanța','get a receipt','gets a receipt'], final:'영수증을 받아요', forms:{none:'영수증을 받아요',seq:'영수증을 받고',cause1:'영수증을 받아서',cause2:'영수증을 받으니까',condition:'영수증을 받으면',contrast1:'영수증을 받지만',contrast2:'영수증을 받는데',purpose:'영수증을 받으려고',result:'영수증을 받아서 그렇게 되다'}},
      {ko:'영화를 보다', ro:'a viziona un film', en:'to watch a movie', aliases:['vizionez un film','vizionezi un film','vizionează un film','vizionăm un film','vizionați un film','am vizionat un film','ai vizionat un film','a vizionat un film','ați vizionat un film','au vizionat un film','viziona un film','watch a movie','watches a movie'], final:'영화를 봐요', forms:{none:'영화를 봐요',seq:'영화를 보고',cause1:'영화를 봐서',cause2:'영화를 보니까',condition:'영화를 보면',contrast1:'영화를 보지만',contrast2:'영화를 보는데',purpose:'영화를 보려고',result:'영화를 봐서 그렇게 되다'}},
      {ko:'예매하다', ro:'a rezerva (bilet)', en:'to book (a ticket)', aliases:['rezerv','rezervi','rezervă','rezervăm','rezervați','am rezervat','ai rezervat','a rezervat','ați rezervat','au rezervat','rezerva','book','books'], final:'예매해요', forms:{none:'예매해요',seq:'예매하고',cause1:'예매해서',cause2:'예매하니까',condition:'예매하면',contrast1:'예매하지만',contrast2:'예매하는데',purpose:'예매하려고',result:'예매해서 그렇게 되다'}},
      {ko:'예상하다', ro:'a prevedea, a anticipa', en:'to expect, to predict', aliases:['prevăd','prevezi','prevede','prevedem','prevedeți','am prevăzut','ai prevăzut','a prevăzut','ați prevăzut','au prevăzut','prevedea','anticipa','expect','expects','predict','predicts'], final:'예상해요', forms:{none:'예상해요',seq:'예상하고',cause1:'예상해서',cause2:'예상하니까',condition:'예상하면',contrast1:'예상하지만',contrast2:'예상하는데',purpose:'예상하려고',result:'예상해서 그렇게 되다'}},
      {ko:'예약하다', ro:'a rezerva', en:'to reserve, to book', aliases:['rezerv','rezervi','rezervă','rezervăm','rezervați','am rezervat','ai rezervat','a rezervat','ați rezervat','au rezervat','rezerva','reserve','reserves','book','books'], final:'예약해요', forms:{none:'예약해요',seq:'예약하고',cause1:'예약해서',cause2:'예약하니까',condition:'예약하면',contrast1:'예약하지만',contrast2:'예약하는데',purpose:'예약하려고',result:'예약해서 그렇게 되다'}},
      {ko:'올라가다', ro:'a urca, a se ridica', en:'to go up, to climb', aliases:['urc','urci','urcă','urcăm','urcați','am urcat','ai urcat','a urcat','ați urcat','au urcat','urca','ridica','go up','goes up','climb','climbs'], final:'올라가요', forms:{none:'올라가요',seq:'올라가고',cause1:'올라가서',cause2:'올라가니까',condition:'올라가면',contrast1:'올라가지만',contrast2:'올라가는데',purpose:'올라가려고',result:'올라가서 그렇게 되다'}},
      {ko:'올라오다', ro:'a veni sus, a urca', en:'to come up', aliases:['vin sus','vii sus','vine sus','venim sus','veniți sus','am venit sus','ai venit sus','a venit sus','ați venit sus','au venit sus','veni sus','urca','come up','comes up'], final:'올라와요', forms:{none:'올라와요',seq:'올라오고',cause1:'올라와서',cause2:'올라오니까',condition:'올라오면',contrast1:'올라오지만',contrast2:'올라오는데',purpose:'올라오려고',result:'올라와서 그렇게 되다'}},
      {ko:'올리다', ro:'a ridica, a urca', en:'to raise, to upload', aliases:['ridic','ridici','ridică','ridicăm','ridicați','am ridicat','ai ridicat','a ridicat','ați ridicat','au ridicat','ridica','urca','raise','raises','upload','uploads'], final:'올려요', forms:{none:'올려요',seq:'올리고',cause1:'올려서',cause2:'올리니까',condition:'올리면',contrast1:'올리지만',contrast2:'올리는데',purpose:'올리려고',result:'올려서 그렇게 되다'}},
      {ko:'완성하다', ro:'a finaliza / a completa', en:'to complete', aliases:['finalizez','finalizezi','finalizează','finalizăm','finalizați','am finalizat','ai finalizat','a finalizat','ați finalizat','au finalizat','finaliza','completa','complete','completes'], final:'완성해요', forms:{none:'완성해요',seq:'완성하고',cause1:'완성해서',cause2:'완성하니까',condition:'완성하면',contrast1:'완성하지만',contrast2:'완성하는데',purpose:'완성하려고',result:'완성해서 그렇게 되다'}},
      {ko:'외출하다', ro:'a ieși afară', en:'to go out', aliases:['ies afară','ieși afară','iese afară','ieșim afară','ieșiți afară','am ieșit afară','ai ieșit afară','a ieșit afară','ați ieșit afară','au ieșit afară','go out','goes out'], final:'외출해요', forms:{none:'외출해요',seq:'외출하고',cause1:'외출해서',cause2:'외출하니까',condition:'외출하면',contrast1:'외출하지만',contrast2:'외출하는데',purpose:'외출하려고',result:'외출해서 그렇게 되다'}},
      {ko:'용서하다', ro:'a ierta', en:'to forgive', aliases:['iert','ierți','iartă','iertăm','iertați','am iertat','ai iertat','a iertat','ați iertat','au iertat','ierta','forgive','forgives'], final:'용서해요', forms:{none:'용서해요',seq:'용서하고',cause1:'용서해서',cause2:'용서하니까',condition:'용서하면',contrast1:'용서하지만',contrast2:'용서하는데',purpose:'용서하려고',result:'용서해서 그렇게 되다'}},
      {ko:'우산을 챙기다', ro:'a lua umbrela cu tine', en:'to bring an umbrella', aliases:['iau umbrela cu tine','iei umbrela cu tine','ia umbrela cu tine','luăm umbrela cu tine','luați umbrela cu tine','am luat umbrela cu tine','ai luat umbrela cu tine','a luat umbrela cu tine','ați luat umbrela cu tine','au luat umbrela cu tine','lua umbrela cu tine','bring an umbrella','brings an umbrella'], final:'우산을 챙겨요', forms:{none:'우산을 챙겨요',seq:'우산을 챙기고',cause1:'우산을 챙겨서',cause2:'우산을 챙기니까',condition:'우산을 챙기면',contrast1:'우산을 챙기지만',contrast2:'우산을 챙기는데',purpose:'우산을 챙기려고',result:'우산을 챙겨서 그렇게 되다'}},
      {ko:'운전하다', ro:'a conduce mașina', en:'to drive', aliases:['conduc mașina','conduci mașina','conduce mașina','conducem mașina','conduceți mașina','am condus mașina','ai condus mașina','a condus mașina','ați condus mașina','au condus mașina','drive','drives'], final:'운전해요', forms:{none:'운전해요',seq:'운전하고',cause1:'운전해서',cause2:'운전하니까',condition:'운전하면',contrast1:'운전하지만',contrast2:'운전하는데',purpose:'운전하려고',result:'운전해서 그렇게 되다'}},
      {ko:'울리다', ro:'a suna, a face să sune', en:'to ring, to make ring', aliases:['sun','suni','sună','sunăm','sunați','am sunat','ai sunat','a sunat','ați sunat','au sunat','suna','face să sune','ring','rings','make ring','makes ring'], final:'울려요', forms:{none:'울려요',seq:'울리고',cause1:'울려서',cause2:'울리니까',condition:'울리면',contrast1:'울리지만',contrast2:'울리는데',purpose:'울리려고',result:'울려서 그렇게 되다'}},
      {ko:'음악을 듣다', ro:'a asculta muzică', en:'to listen to music', aliases:['ascult muzică','asculți muzică','ascultă muzică','ascultăm muzică','ascultați muzică','am ascultat muzică','ai ascultat muzică','a ascultat muzică','ați ascultat muzică','au ascultat muzică','asculta muzică','listen to music','listens to music'], final:'음악을 들어요', forms:{none:'음악을 들어요',seq:'음악을 듣고',cause1:'음악을 들어서',cause2:'음악을 듣으니까',condition:'음악을 듣으면',contrast1:'음악을 듣지만',contrast2:'음악을 듣는데',purpose:'음악을 듣으려고',result:'음악을 들어서 그렇게 되다'}},
      {ko:'이를 닦다', ro:'a se spăla pe dinți', en:'to brush teeth', aliases:['mă spăl pe dinți','te speli pe dinți','se spală pe dinți','ne spălăm pe dinți','vă spălați pe dinți','m-am spălat pe dinți','te-ai spălat pe dinți','s-a spălat pe dinți','ne-am spălat pe dinți','v-ați spălat pe dinți','s-au spălat pe dinți','spăla pe dinți','brush teeth','brushes teeth'], final:'이를 닦아요', forms:{none:'이를 닦아요',seq:'이를 닦고',cause1:'이를 닦아서',cause2:'이를 닦으니까',condition:'이를 닦으면',contrast1:'이를 닦지만',contrast2:'이를 닦는데',purpose:'이를 닦으려고',result:'이를 닦아서 그렇게 되다'}},
      {ko:'이사하다', ro:'a se muta (locuință)', en:'to move (house)', aliases:['mă mut','te muți','se mută','ne mutăm','vă mutați','m-am mutat','te-ai mutat','s-a mutat','ne-am mutat','v-ați mutat','s-au mutat','muta','move','moves'], final:'이사해요', forms:{none:'이사해요',seq:'이사하고',cause1:'이사해서',cause2:'이사하니까',condition:'이사하면',contrast1:'이사하지만',contrast2:'이사하는데',purpose:'이사하려고',result:'이사해서 그렇게 되다'}},
      {ko:'이야기하다', ro:'a vorbi, a conversa', en:'to talk, to chat', aliases:['vorbesc','vorbești','vorbește','vorbim','vorbiți','am vorbit','ai vorbit','a vorbit','ați vorbit','au vorbit','vorbi','conversa','talk','talks','chat','chats'], final:'이야기해요', forms:{none:'이야기해요',seq:'이야기하고',cause1:'이야기해서',cause2:'이야기하니까',condition:'이야기하면',contrast1:'이야기하지만',contrast2:'이야기하는데',purpose:'이야기하려고',result:'이야기해서 그렇게 되다'}},
      {ko:'이어지다', ro:'a continua / a se lega de', en:'to be connected / continue', aliases:['continu','continui','continuă','continuăm','continuați','am continuat','ai continuat','a continuat','ați continuat','au continuat','continua','lega de','be connected','is connected','continue','continues'], final:'이어져요', forms:{none:'이어져요',seq:'이어지고',cause1:'이어져서',cause2:'이어지니까',condition:'이어지면',contrast1:'이어지지만',contrast2:'이어지는데',purpose:'이어지려고',result:'이어져서 그렇게 되다'}},
      {ko:'이혼하다', ro:'a divorța', en:'to get divorced', aliases:['divorțez','divorțezi','divorțează','divorțăm','divorțați','am divorțat','ai divorțat','a divorțat','ați divorțat','au divorțat','divorța','get divorced','gets divorced'], final:'이혼해요', forms:{none:'이혼해요',seq:'이혼하고',cause1:'이혼해서',cause2:'이혼하니까',condition:'이혼하면',contrast1:'이혼하지만',contrast2:'이혼하는데',purpose:'이혼하려고',result:'이혼해서 그렇게 되다'}},
      {ko:'인사하다', ro:'a saluta', en:'to greet', aliases:['salut','saluți','salută','salutăm','salutați','am salutat','ai salutat','a salutat','ați salutat','au salutat','saluta','greet','greets'], final:'인사해요', forms:{none:'인사해요',seq:'인사하고',cause1:'인사해서',cause2:'인사하니까',condition:'인사하면',contrast1:'인사하지만',contrast2:'인사하는데',purpose:'인사하려고',result:'인사해서 그렇게 되다'}},
      {ko:'입학하다', ro:'a fi admis, a intra la', en:'to enter school, to enroll', aliases:['sunt admis','ești admis','este admis','suntem admis','sunteți admis','am fost admis','ai fost admis','a fost admis','ați fost admis','au fost admis','fi admis','intra la','enter school','enters school','enroll','enrolls'], final:'입학해요', forms:{none:'입학해요',seq:'입학하고',cause1:'입학해서',cause2:'입학하니까',condition:'입학하면',contrast1:'입학하지만',contrast2:'입학하는데',purpose:'입학하려고',result:'입학해서 그렇게 되다'}},
      {ko:'잊어버리다', ro:'a uita (de tot)', en:'to forget (completely)', aliases:['uit','uiți','uită','uităm','uitați','am uitat','ai uitat','a uitat','ați uitat','au uitat','uita','forget','forgets'], final:'잊어버려요', forms:{none:'잊어버려요',seq:'잊어버리고',cause1:'잊어버려서',cause2:'잊어버리니까',condition:'잊어버리면',contrast1:'잊어버리지만',contrast2:'잊어버리는데',purpose:'잊어버리려고',result:'잊어버려서 그렇게 되다'}},
      {ko:'자라다', ro:'a crește, a se matura', en:'to grow up', aliases:['cresc','crești','crește','creștem','creșteți','am crescut','ai crescut','a crescut','ați crescut','au crescut','matura','grow up','grows up'], final:'자라요', forms:{none:'자라요',seq:'자라고',cause1:'자라서',cause2:'자라니까',condition:'자라면',contrast1:'자라지만',contrast2:'자라는데',purpose:'자라려고',result:'자라서 그렇게 되다'}},
      {ko:'자르다', ro:'a tăia', en:'to cut', aliases:['tai','taie','tăiem','tăiați','am tăiat','ai tăiat','a tăiat','ați tăiat','au tăiat','tăia','cut','cuts'], final:'잘라요', forms:{none:'잘라요',seq:'자르고',cause1:'잘라서',cause2:'자르니까',condition:'자르면',contrast1:'자르지만',contrast2:'자르는데',purpose:'자르려고',result:'잘라서 그렇게 되다'}},
      {ko:'잠이 들다', ro:'a adormi', en:'to fall asleep', aliases:['adorm','adormi','adoarme','adormim','adormiți','am adormit','ai adormit','a adormit','ați adormit','au adormit','fall asleep','falls asleep'], final:'잠이 들어요', forms:{none:'잠이 들어요',seq:'잠이 들고',cause1:'잠이 들어서',cause2:'잠이 드니까',condition:'잠이 들면',contrast1:'잠이 들지만',contrast2:'잠이 드는데',purpose:'잠이 들려고',result:'잠이 들어서 그렇게 되다'}},
      {ko:'잡다', ro:'a apuca, a prinde', en:'to grab, to catch', aliases:['apuc','apuci','apucă','apucăm','apucați','am apucat','ai apucat','a apucat','ați apucat','au apucat','apuca','prinde','grab','grabs','catch','catches'], final:'잡아요', forms:{none:'잡아요',seq:'잡고',cause1:'잡아서',cause2:'잡으니까',condition:'잡으면',contrast1:'잡지만',contrast2:'잡는데',purpose:'잡으려고',result:'잡아서 그렇게 되다'}},
      {ko:'재료를 준비하다', ro:'a pregăti ingredientele', en:'to prepare ingredients', aliases:['pregătesc ingredientele','pregătești ingredientele','pregătește ingredientele','pregătim ingredientele','pregătiți ingredientele','am pregătit ingredientele','ai pregătit ingredientele','a pregătit ingredientele','ați pregătit ingredientele','au pregătit ingredientele','pregăti ingredientele','prepare ingredients','prepares ingredients'], final:'재료를 준비해요', forms:{none:'재료를 준비해요',seq:'재료를 준비하고',cause1:'재료를 준비해서',cause2:'재료를 준비하니까',condition:'재료를 준비하면',contrast1:'재료를 준비하지만',contrast2:'재료를 준비하는데',purpose:'재료를 준비하려고',result:'재료를 준비해서 그렇게 되다'}},
      {ko:'저장하다', ro:'a salva', en:'to save', aliases:['salvez','salvezi','salvează','salvăm','salvați','am salvat','ai salvat','a salvat','ați salvat','au salvat','salva','save','saves'], final:'저장해요', forms:{none:'저장해요',seq:'저장하고',cause1:'저장해서',cause2:'저장하니까',condition:'저장하면',contrast1:'저장하지만',contrast2:'저장하는데',purpose:'저장하려고',result:'저장해서 그렇게 되다'}},
      {ko:'전화기를 끄다', ro:'a opri telefonul', en:'to turn off the phone', aliases:['opresc telefonul','oprești telefonul','oprește telefonul','oprim telefonul','opriți telefonul','am oprit telefonul','ai oprit telefonul','a oprit telefonul','ați oprit telefonul','au oprit telefonul','opri telefonul','turn off the phone','turns off the phone'], final:'전화기를 꺼요', forms:{none:'전화기를 꺼요',seq:'전화기를 끄고',cause1:'전화기를 꺼서',cause2:'전화기를 끄니까',condition:'전화기를 끄면',contrast1:'전화기를 끄지만',contrast2:'전화기를 끄는데',purpose:'전화기를 끄려고',result:'전화기를 꺼서 그렇게 되다'}},
      {ko:'전화하다', ro:'a telefona', en:'to call (phone)', aliases:['telefonez','telefonezi','telefonează','telefonăm','telefonați','am telefonat','ai telefonat','a telefonat','ați telefonat','au telefonat','telefona','call','calls'], final:'전화해요', forms:{none:'전화해요',seq:'전화하고',cause1:'전화해서',cause2:'전화하니까',condition:'전화하면',contrast1:'전화하지만',contrast2:'전화하는데',purpose:'전화하려고',result:'전화해서 그렇게 되다'}},
      {ko:'접다', ro:'a împături', en:'to fold', aliases:['împăturesc','împăturești','împăturește','împăturim','împăturiți','am împăturit','ai împăturit','a împăturit','ați împăturit','au împăturit','împături','fold','folds'], final:'접어요', forms:{none:'접어요',seq:'접고',cause1:'접어서',cause2:'접으니까',condition:'접으면',contrast1:'접지만',contrast2:'접는데',purpose:'접으려고',result:'접어서 그렇게 되다'}},
      {ko:'조심하다', ro:'a fi atent, a fi precaut', en:'to be careful', aliases:['sunt atent','ești atent','este atent','suntem atenți','sunteți atenți','sunt atenți','am fost atent','ai fost atent','a fost atent','am fost atenți','ați fost atenți','au fost atenți','fi atent','fi precaut','be careful','is careful'], final:'조심해요', forms:{none:'조심해요',seq:'조심하고',cause1:'조심해서',cause2:'조심하니까',condition:'조심하면',contrast1:'조심하지만',contrast2:'조심하는데',purpose:'조심하려고',result:'조심해서 그렇게 되다'}},
      {ko:'조용히 하다', ro:'a fi liniștit', en:'to be quiet', aliases:['sunt liniștit','ești liniștit','este liniștit','suntem liniștiți','sunteți liniștiți','sunt liniștiți','am fost liniștit','ai fost liniștit','a fost liniștit','am fost liniștiți','ați fost liniștiți','au fost liniștiți','fi liniștit','be quiet','is quiet'], final:'조용히 해요', forms:{none:'조용히 해요',seq:'조용히 하고',cause1:'조용히 해서',cause2:'조용히 하니까',condition:'조용히 하면',contrast1:'조용히 하지만',contrast2:'조용히 하는데',purpose:'조용히 하려고',result:'조용히 해서 그렇게 되다'}},
      {ko:'주문하다', ro:'a comanda', en:'to order (food, etc.)', aliases:['comand','comandi','comandă','comandăm','comandați','am comandat','ai comandat','a comandat','ați comandat','au comandat','comanda','order','orders'], final:'주문해요', forms:{none:'주문해요',seq:'주문하고',cause1:'주문해서',cause2:'주문하니까',condition:'주문하면',contrast1:'주문하지만',contrast2:'주문하는데',purpose:'주문하려고',result:'주문해서 그렇게 되다'}},
      {ko:'죽다', ro:'a muri', en:'to die', aliases:['mor','mori','moare','murim','muriți','am murit','ai murit','a murit','ați murit','au murit','muri','die','dies'], final:'죽어요', forms:{none:'죽어요',seq:'죽고',cause1:'죽어서',cause2:'죽으니까',condition:'죽으면',contrast1:'죽지만',contrast2:'죽는데',purpose:'죽으려고',result:'죽어서 그렇게 되다'}},
      {ko:'줄어들다', ro:'a scădea / a se micșora', en:'to decrease', aliases:['scad','scazi','scade','scădem','scădeți','am scăzut','ai scăzut','a scăzut','ați scăzut','au scăzut','scădea','micșora','decrease','decreases'], final:'줄어들어요', forms:{none:'줄어들어요',seq:'줄어들고',cause1:'줄어들어서',cause2:'줄어드니까',condition:'줄어들면',contrast1:'줄어들지만',contrast2:'줄어드는데',purpose:'줄어들려고',result:'줄어들어서 그렇게 되다'}},
      {ko:'줄이다', ro:'a reduce, a micșora', en:'to reduce, to decrease', aliases:['reduc','reduci','reduce','reducem','reduceți','am redus','ai redus','a redus','ați redus','au redus','micșora','reduces','decrease','decreases'], final:'줄여요', forms:{none:'줄여요',seq:'줄이고',cause1:'줄여서',cause2:'줄이니까',condition:'줄이면',contrast1:'줄이지만',contrast2:'줄이는데',purpose:'줄이려고',result:'줄여서 그렇게 되다'}},
      {ko:'지나가다', ro:'a trece pe lângă', en:'to pass by', aliases:['trec pe lângă','treci pe lângă','trece pe lângă','trecem pe lângă','treceți pe lângă','am trecut pe lângă','ai trecut pe lângă','a trecut pe lângă','ați trecut pe lângă','au trecut pe lângă','pass by','passes by'], final:'지나가요', forms:{none:'지나가요',seq:'지나가고',cause1:'지나가서',cause2:'지나가니까',condition:'지나가면',contrast1:'지나가지만',contrast2:'지나가는데',purpose:'지나가려고',result:'지나가서 그렇게 되다'}},
      {ko:'지다', ro:'a pierde (un joc)', en:'to lose (a game)', aliases:['pierd','pierzi','pierde','pierdem','pierdeți','am pierdut','ai pierdut','a pierdut','ați pierdut','au pierdut','lose','loses'], final:'져요', forms:{none:'져요',seq:'지고',cause1:'져서',cause2:'지니까',condition:'지면',contrast1:'지지만',contrast2:'지는데',purpose:'지려고',result:'져서 그렇게 되다'}},
      {ko:'지불하다', ro:'a plăti', en:'to pay', aliases:['plătesc','plătești','plătește','plătim','plătiți','am plătit','ai plătit','a plătit','ați plătit','au plătit','plăti','pay','pays'], final:'지불해요', forms:{none:'지불해요',seq:'지불하고',cause1:'지불해서',cause2:'지불하니까',condition:'지불하면',contrast1:'지불하지만',contrast2:'지불하는데',purpose:'지불하려고',result:'지불해서 그렇게 되다'}},
      {ko:'지워지다', ro:'a se șterge (machiaj)', en:'to come off (makeup)', aliases:['mă șterg','te ștergi','se șterge','ne ștergem','vă ștergeți','se șterg','m-am șters','te-ai șters','s-a șters','ne-am șters','v-ați șters','s-au șters','șterge','come off','comes off'], final:'지워져요', forms:{none:'지워져요',seq:'지워지고',cause1:'지워져서',cause2:'지워지니까',condition:'지워지면',contrast1:'지워지지만',contrast2:'지워지는데',purpose:'지워지려고',result:'지워져서 그렇게 되다'}},
      {ko:'집중하다', ro:'a se concentra', en:'to concentrate, to focus', aliases:['mă concentrez','te concentrezi','se concentrează','ne concentrăm','vă concentrați','m-am concentrat','te-ai concentrat','s-a concentrat','ne-am concentrat','v-ați concentrat','s-au concentrat','concentra','concentrate','concentrates','focus','focuses'], final:'집중해요', forms:{none:'집중해요',seq:'집중하고',cause1:'집중해서',cause2:'집중하니까',condition:'집중하면',contrast1:'집중하지만',contrast2:'집중하는데',purpose:'집중하려고',result:'집중해서 그렇게 되다'}},
      {ko:'찍다', ro:'a fotografia, a ștampila', en:'to take a photo, to stamp', aliases:['fotografiez','fotografiezi','fotografiază','fotografiem','fotografiați','am fotografiat','ai fotografiat','a fotografiat','ați fotografiat','au fotografiat','fotografia','ștampila','take a photo','takes a photo','stamp','stamps'], final:'찍어요', forms:{none:'찍어요',seq:'찍고',cause1:'찍어서',cause2:'찍으니까',condition:'찍으면',contrast1:'찍지만',contrast2:'찍는데',purpose:'찍으려고',result:'찍어서 그렇게 되다'}},
      {ko:'참다', ro:'a îndura, a se abține', en:'to endure, to hold back', aliases:['îndur','înduri','îndură','îndurăm','îndurați','am îndurat','ai îndurat','a îndurat','ați îndurat','au îndurat','îndura','abține','endure','endures','hold back','holds back'], final:'참아요', forms:{none:'참아요',seq:'참고',cause1:'참아서',cause2:'참으니까',condition:'참으면',contrast1:'참지만',contrast2:'참는데',purpose:'참으려고',result:'참아서 그렇게 되다'}},
      {ko:'참석하다', ro:'a participa (la un eveniment)', en:'to attend', aliases:['particip','participi','participă','participăm','participați','am participat','ai participat','a participat','ați participat','au participat','participa','attend','attends'], final:'참석해요', forms:{none:'참석해요',seq:'참석하고',cause1:'참석해서',cause2:'참석하니까',condition:'참석하면',contrast1:'참석하지만',contrast2:'참석하는데',purpose:'참석하려고',result:'참석해서 그렇게 되다'}},
      {ko:'챙기다', ro:'a pregăti, a lua cu sine', en:'to pack, to bring', aliases:['pregătesc','pregătești','pregătește','pregătim','pregătiți','am pregătit','ai pregătit','a pregătit','ați pregătit','au pregătit','pregăti','lua cu sine','pack','packs','bring','brings'], final:'챙겨요', forms:{none:'챙겨요',seq:'챙기고',cause1:'챙겨서',cause2:'챙기니까',condition:'챙기면',contrast1:'챙기지만',contrast2:'챙기는데',purpose:'챙기려고',result:'챙겨서 그렇게 되다'}},
      {ko:'척하다', ro:'a se preface', en:'to pretend', aliases:['mă prefac','te prefaci','se preface','ne prefacem','vă prefaceți','se prefac','m-am prefăcut','te-ai prefăcut','s-a prefăcut','ne-am prefăcut','v-ați prefăcut','s-au prefăcut','preface','pretend','pretends'], final:'척해요', forms:{none:'척해요',seq:'척하고',cause1:'척해서',cause2:'척하니까',condition:'척하면',contrast1:'척하지만',contrast2:'척하는데',purpose:'척하려고',result:'척해서 그렇게 되다'}},
      {ko:'쳐다보다', ro:'a se uita fix, a privi insistent', en:'to stare at', aliases:['mă uit fix','te uiți fix','se uită fix','ne uităm fix','vă uitați fix','m-am uitat fix','te-ai uitat fix','s-a uitat fix','ne-am uitat fix','v-ați uitat fix','s-au uitat fix','uita fix','privi insistent','stare at','stares at'], final:'쳐다봐요', forms:{none:'쳐다봐요',seq:'쳐다보고',cause1:'쳐다봐서',cause2:'쳐다보니까',condition:'쳐다보면',contrast1:'쳐다보지만',contrast2:'쳐다보는데',purpose:'쳐다보려고',result:'쳐다봐서 그렇게 되다'}},
      {ko:'초대하다', ro:'a invita', en:'to invite', aliases:['invit','inviți','invită','invităm','invitați','am invitat','ai invitat','a invitat','ați invitat','au invitat','invita','invite','invites'], final:'초대해요', forms:{none:'초대해요',seq:'초대하고',cause1:'초대해서',cause2:'초대하니까',condition:'초대하면',contrast1:'초대하지만',contrast2:'초대하는데',purpose:'초대하려고',result:'초대해서 그렇게 되다'}},
      {ko:'추천하다', ro:'a recomanda', en:'to recommend', aliases:['recomand','recomandi','recomandă','recomandăm','recomandați','am recomandat','ai recomandat','a recomandat','ați recomandat','au recomandat','recomanda','recommend','recommends'], final:'추천해요', forms:{none:'추천해요',seq:'추천하고',cause1:'추천해서',cause2:'추천하니까',condition:'추천하면',contrast1:'추천하지만',contrast2:'추천하는데',purpose:'추천하려고',result:'추천해서 그렇게 되다'}},
      {ko:'축하하다', ro:'a felicita', en:'to congratulate', aliases:['felicit','feliciți','felicită','felicităm','felicitați','am felicitat','ai felicitat','a felicitat','ați felicitat','au felicitat','felicita','congratulate','congratulates'], final:'축하해요', forms:{none:'축하해요',seq:'축하하고',cause1:'축하해서',cause2:'축하하니까',condition:'축하하면',contrast1:'축하하지만',contrast2:'축하하는데',purpose:'축하하려고',result:'축하해서 그렇게 되다'}},
      {ko:'출근하다', ro:'a merge la muncă', en:'to go to work', aliases:['merg la muncă','mergi la muncă','merge la muncă','mergem la muncă','mergeți la muncă','am mers la muncă','ai mers la muncă','a mers la muncă','ați mers la muncă','au mers la muncă','go to work','goes to work'], final:'출근해요', forms:{none:'출근해요',seq:'출근하고',cause1:'출근해서',cause2:'출근하니까',condition:'출근하면',contrast1:'출근하지만',contrast2:'출근하는데',purpose:'출근하려고',result:'출근해서 그렇게 되다'}},
      {ko:'출발하다', ro:'a pleca, a porni', en:'to depart, to set off', aliases:['plec','pleci','pleacă','plecăm','plecați','am plecat','ai plecat','a plecat','ați plecat','au plecat','pleca','porni','depart','departs','set off','sets off'], final:'출발해요', forms:{none:'출발해요',seq:'출발하고',cause1:'출발해서',cause2:'출발하니까',condition:'출발하면',contrast1:'출발하지만',contrast2:'출발하는데',purpose:'출발하려고',result:'출발해서 그렇게 되다'}},
      {ko:'춤추다', ro:'a dansa', en:'to dance', aliases:['dansez','dansezi','dansează','dansăm','dansați','am dansat','ai dansat','a dansat','ați dansat','au dansat','dansa','dance','dances'], final:'춤춰요', forms:{none:'춤춰요',seq:'춤추고',cause1:'춤춰서',cause2:'춤추니까',condition:'춤추면',contrast1:'춤추지만',contrast2:'춤추는데',purpose:'춤추려고',result:'춤춰서 그렇게 되다'}},
      {ko:'취소하다', ro:'a anula', en:'to cancel', aliases:['anulez','anulezi','anulează','anulăm','anulați','am anulat','ai anulat','a anulat','ați anulat','au anulat','anula','cancel','cancels'], final:'취소해요', forms:{none:'취소해요',seq:'취소하고',cause1:'취소해서',cause2:'취소하니까',condition:'취소하면',contrast1:'취소하지만',contrast2:'취소하는데',purpose:'취소하려고',result:'취소해서 그렇게 되다'}},
      {ko:'취직하다', ro:'a-și găsi un loc de muncă', en:'to get a job', aliases:['îmi găsesc un loc de muncă','îți găsești un loc de muncă','își găsește un loc de muncă','ne găsim un loc de muncă','vă găsiți un loc de muncă','își găsesc un loc de muncă','mi-am găsit un loc de muncă','ți-ai găsit un loc de muncă','și-a găsit un loc de muncă','ne-am găsit un loc de muncă','v-ați găsit un loc de muncă','și-au găsit un loc de muncă','găsi un loc de muncă','get a job','gets a job'], final:'취직해요', forms:{none:'취직해요',seq:'취직하고',cause1:'취직해서',cause2:'취직하니까',condition:'취직하면',contrast1:'취직하지만',contrast2:'취직하는데',purpose:'취직하려고',result:'취직해서 그렇게 되다'}},
      {ko:'치다', ro:'a lovi, a juca sport', en:'to hit, to play (sport)', aliases:['lovesc','lovești','lovește','lovim','loviți','am lovit','ai lovit','a lovit','ați lovit','au lovit','lovi','juca sport','hit','hits','play','plays'], final:'쳐요', forms:{none:'쳐요',seq:'치고',cause1:'쳐서',cause2:'치니까',condition:'치면',contrast1:'치지만',contrast2:'치는데',purpose:'치려고',result:'쳐서 그렇게 되다'}},
      {ko:'커피를 마시다', ro:'a bea cafea', en:'to drink coffee', aliases:['beau cafea','bei cafea','bea cafea','bem cafea','beți cafea','am băut cafea','ai băut cafea','a băut cafea','ați băut cafea','au băut cafea','drink coffee','drinks coffee'], final:'커피를 마셔요', forms:{none:'커피를 마셔요',seq:'커피를 마시고',cause1:'커피를 마셔서',cause2:'커피를 마시니까',condition:'커피를 마시면',contrast1:'커피를 마시지만',contrast2:'커피를 마시는데',purpose:'커피를 마시려고',result:'커피를 마셔서 그렇게 되다'}},
      {ko:'켜다', ro:'a aprinde, a porni', en:'to turn on', aliases:['aprind','aprinzi','aprinde','aprindem','aprindeți','am aprins','ai aprins','a aprins','ați aprins','au aprins','porni','turn on','turns on'], final:'켜어요', forms:{none:'켜어요',seq:'켜고',cause1:'켜어서',cause2:'켜니까',condition:'켜면',contrast1:'켜지만',contrast2:'켜는데',purpose:'켜려고',result:'켜어서 그렇게 되다'}},
      {ko:'태어나다', ro:'a se naște', en:'to be born', aliases:['mă nașt','te nașți','se naște','ne naștem','vă nașteți','se nașt','m-am născut','te-ai născut','s-a născut','ne-am născut','v-ați născut','s-au născut','naște','be born','is born'], final:'태어나요', forms:{none:'태어나요',seq:'태어나고',cause1:'태어나서',cause2:'태어나니까',condition:'태어나면',contrast1:'태어나지만',contrast2:'태어나는데',purpose:'태어나려고',result:'태어나서 그렇게 되다'}},
      {ko:'태우다', ro:'a arde ceva / a duce cu mașina', en:'to burn something / to give a ride', aliases:['ard ceva','arzi ceva','arde ceva','ardem ceva','ardeți ceva','am ars ceva','ai ars ceva','a ars ceva','ați ars ceva','au ars ceva','duce cu mașina','burn something','burns something','give a ride','gives a ride'], final:'태워요', forms:{none:'태워요',seq:'태우고',cause1:'태워서',cause2:'태우니까',condition:'태우면',contrast1:'태우지만',contrast2:'태우는데',purpose:'태우려고',result:'태워서 그렇게 되다'}},
      {ko:'퇴근하다', ro:'a pleca de la muncă', en:'to leave work', aliases:['plec de la muncă','pleci de la muncă','pleacă de la muncă','plecăm de la muncă','plecați de la muncă','am plecat de la muncă','ai plecat de la muncă','a plecat de la muncă','ați plecat de la muncă','au plecat de la muncă','pleca de la muncă','leave work','leaves work'], final:'퇴근해요', forms:{none:'퇴근해요',seq:'퇴근하고',cause1:'퇴근해서',cause2:'퇴근하니까',condition:'퇴근하면',contrast1:'퇴근하지만',contrast2:'퇴근하는데',purpose:'퇴근하려고',result:'퇴근해서 그렇게 되다'}},
      {ko:'퇴직하다', ro:'a se pensiona, a demisiona', en:'to retire, to resign', aliases:['mă pensionez','te pensionezi','se pensionează','ne pensionăm','vă pensionați','m-am pensionat','te-ai pensionat','s-a pensionat','ne-am pensionat','v-ați pensionat','s-au pensionat','pensiona','demisiona','retire','retires','resign','resigns'], final:'퇴직해요', forms:{none:'퇴직해요',seq:'퇴직하고',cause1:'퇴직해서',cause2:'퇴직하니까',condition:'퇴직하면',contrast1:'퇴직하지만',contrast2:'퇴직하는데',purpose:'퇴직하려고',result:'퇴직해서 그렇게 되다'}},
      {ko:'투자하다', ro:'a investi', en:'to invest', aliases:['investesc','investești','investește','investim','investiți','am investit','ai investit','a investit','ați investit','au investit','investi','invest','invests'], final:'투자해요', forms:{none:'투자해요',seq:'투자하고',cause1:'투자해서',cause2:'투자하니까',condition:'투자하면',contrast1:'투자하지만',contrast2:'투자하는데',purpose:'투자하려고',result:'투자해서 그렇게 되다'}},
      {ko:'펴다', ro:'a desface / a întinde', en:'to unfold / to spread out', aliases:['desfac','desfaci','desface','desfacem','desfaceți','am desfăcut','ai desfăcut','a desfăcut','ați desfăcut','au desfăcut','întinde','unfold','unfolds','spread out','spreads out'], final:'펴어요', forms:{none:'펴어요',seq:'펴고',cause1:'펴어서',cause2:'펴니까',condition:'펴면',contrast1:'펴지만',contrast2:'펴는데',purpose:'펴려고',result:'펴어서 그렇게 되다'}},
      {ko:'포장하다', ro:'a împacheta', en:'to wrap / to pack', aliases:['împachetez','împachetezi','împachetează','împachetăm','împachetați','am împachetat','ai împachetat','a împachetat','ați împachetat','au împachetat','împacheta','wrap','wraps','pack','packs'], final:'포장해요', forms:{none:'포장해요',seq:'포장하고',cause1:'포장해서',cause2:'포장하니까',condition:'포장하면',contrast1:'포장하지만',contrast2:'포장하는데',purpose:'포장하려고',result:'포장해서 그렇게 되다'}},
      {ko:'포함하다', ro:'a include', en:'to include', aliases:['includ','incluzi','include','includem','includeți','am inclus','ai inclus','a inclus','ați inclus','au inclus','includes'], final:'포함해요', forms:{none:'포함해요',seq:'포함하고',cause1:'포함해서',cause2:'포함하니까',condition:'포함하면',contrast1:'포함하지만',contrast2:'포함하는데',purpose:'포함하려고',result:'포함해서 그렇게 되다'}},
      {ko:'풀다', ro:'a dezlega / a rezolva', en:'to untie / to solve', aliases:['dezleg','dezlegi','dezleagă','dezlegăm','dezlegați','am dezlegat','ai dezlegat','a dezlegat','ați dezlegat','au dezlegat','dezlega','rezolva','untie','unties','solve','solves'], final:'풀어요', forms:{none:'풀어요',seq:'풀고',cause1:'풀어서',cause2:'푸니까',condition:'풀면',contrast1:'풀지만',contrast2:'푸는데',purpose:'풀려고',result:'풀어서 그렇게 되다'}},
      {ko:'하다', ro:'a face', en:'to do', aliases:['fac','faci','face','facem','faceți','am făcut','ai făcut','a făcut','ați făcut','au făcut','do','does'], final:'해요', forms:{none:'해요',seq:'하고',cause1:'해서',cause2:'하니까',condition:'하면',contrast1:'하지만',contrast2:'하는데',purpose:'하려고',result:'해서 그렇게 되다'}},
      {ko:'합격하다', ro:'a trece un examen', en:'to pass an exam', aliases:['trec un examen','treci un examen','trece un examen','trecem un examen','treceți un examen','am trecut un examen','ai trecut un examen','a trecut un examen','ați trecut un examen','au trecut un examen','pass an exam','passes an exam'], final:'합격해요', forms:{none:'합격해요',seq:'합격하고',cause1:'합격해서',cause2:'합격하니까',condition:'합격하면',contrast1:'합격하지만',contrast2:'합격하는데',purpose:'합격하려고',result:'합격해서 그렇게 되다'}},
      {ko:'해내다', ro:'a reuși, a duce la bun sfârșit', en:'to accomplish, to succeed', aliases:['reușesc','reușești','reușește','reușim','reușiți','am reușit','ai reușit','a reușit','ați reușit','au reușit','reuși','duce la bun sfârșit','accomplish','accomplishes','succeed','succeeds'], final:'해내어요', forms:{none:'해내어요',seq:'해내고',cause1:'해내어서',cause2:'해내니까',condition:'해내면',contrast1:'해내지만',contrast2:'해내는데',purpose:'해내려고',result:'해내어서 그렇게 되다'}},
      {ko:'향상시키다', ro:'a îmbunătăți, a ridica nivelul', en:'to improve, to enhance', aliases:['îmbunătățesc','îmbunătățești','îmbunătățește','îmbunătățim','îmbunătățiți','am îmbunătățit','ai îmbunătățit','a îmbunătățit','ați îmbunătățit','au îmbunătățit','îmbunătăți','ridica nivelul','improve','improves','enhance','enhances'], final:'향상시켜요', forms:{none:'향상시켜요',seq:'향상시키고',cause1:'향상시켜서',cause2:'향상시키니까',condition:'향상시키면',contrast1:'향상시키지만',contrast2:'향상시키는데',purpose:'향상시키려고',result:'향상시켜서 그렇게 되다'}},
      {ko:'허락하다', ro:'a permite', en:'to allow', aliases:['permit','permiți','permite','permitem','permiteți','am permis','ai permis','a permis','ați permis','au permis','allow','allows'], final:'허락해요', forms:{none:'허락해요',seq:'허락하고',cause1:'허락해서',cause2:'허락하니까',condition:'허락하면',contrast1:'허락하지만',contrast2:'허락하는데',purpose:'허락하려고',result:'허락해서 그렇게 되다'}},
      {ko:'헤어지다', ro:'a se despărți', en:'to break up / to part', aliases:['mă despart','te desparți','se desparte','ne despărțim','vă despărțiți','se despart','m-am despărțit','te-ai despărțit','s-a despărțit','ne-am despărțit','v-ați despărțit','s-au despărțit','despărți','break up','breaks up','part','parts'], final:'헤어져요', forms:{none:'헤어져요',seq:'헤어지고',cause1:'헤어져서',cause2:'헤어지니까',condition:'헤어지면',contrast1:'헤어지지만',contrast2:'헤어지는데',purpose:'헤어지려고',result:'헤어져서 그렇게 되다'}},
      {ko:'헬스장에 다니다', ro:'a merge la sală', en:'to go to the gym regularly', aliases:['merg la sală','mergi la sală','merge la sală','mergem la sală','mergeți la sală','am mers la sală','ai mers la sală','a mers la sală','ați mers la sală','au mers la sală','go to the gym regularly','goes to the gym regularly'], final:'헬스장에 다녀요', forms:{none:'헬스장에 다녀요',seq:'헬스장에 다니고',cause1:'헬스장에 다녀서',cause2:'헬스장에 다니니까',condition:'헬스장에 다니면',contrast1:'헬스장에 다니지만',contrast2:'헬스장에 다니는데',purpose:'헬스장에 다니려고',result:'헬스장에 다녀서 그렇게 되다'}},
      {ko:'화장하다', ro:'a se machia', en:'to put on makeup', aliases:['mă machiez','te machiezi','se machiază','ne machiem','vă machiați','m-am machiat','te-ai machiat','s-a machiat','ne-am machiat','v-ați machiat','s-au machiat','machia','put on makeup','puts on makeup'], final:'화장해요', forms:{none:'화장해요',seq:'화장하고',cause1:'화장해서',cause2:'화장하니까',condition:'화장하면',contrast1:'화장하지만',contrast2:'화장하는데',purpose:'화장하려고',result:'화장해서 그렇게 되다'}},
      {ko:'화해하다', ro:'a se împăca', en:'to make up, to reconcile', aliases:['mă împac','te împaci','se împacă','ne împăcăm','vă împăcați','m-am împăcat','te-ai împăcat','s-a împăcat','ne-am împăcat','v-ați împăcat','s-au împăcat','împăca','make up','makes up','reconcile','reconciles'], final:'화해해요', forms:{none:'화해해요',seq:'화해하고',cause1:'화해해서',cause2:'화해하니까',condition:'화해하면',contrast1:'화해하지만',contrast2:'화해하는데',purpose:'화해하려고',result:'화해해서 그렇게 되다'}},
      {ko:'환불을 받다', ro:'a primi ramburs', en:'to get a refund', aliases:['primesc ramburs','primești ramburs','primește ramburs','primim ramburs','primiți ramburs','am primit ramburs','ai primit ramburs','a primit ramburs','ați primit ramburs','au primit ramburs','primi ramburs','get a refund','gets a refund'], final:'환불을 받아요', forms:{none:'환불을 받아요',seq:'환불을 받고',cause1:'환불을 받아서',cause2:'환불을 받으니까',condition:'환불을 받으면',contrast1:'환불을 받지만',contrast2:'환불을 받는데',purpose:'환불을 받으려고',result:'환불을 받아서 그렇게 되다'}},
      {ko:'환전하다', ro:'a schimba valută', en:'to exchange currency', aliases:['schimb valută','schimbi valută','schimbă valută','schimbăm valută','schimbați valută','am schimbat valută','ai schimbat valută','a schimbat valută','ați schimbat valută','au schimbat valută','schimba valută','exchange currency','exchanges currency'], final:'환전해요', forms:{none:'환전해요',seq:'환전하고',cause1:'환전해서',cause2:'환전하니까',condition:'환전하면',contrast1:'환전하지만',contrast2:'환전하는데',purpose:'환전하려고',result:'환전해서 그렇게 되다'}},
      {ko:'활용하다', ro:'a utiliza', en:'to utilize', aliases:['utilizez','utilizezi','utilizează','utilizăm','utilizați','am utilizat','ai utilizat','a utilizat','ați utilizat','au utilizat','utiliza','utilize','utilizes'], final:'활용해요', forms:{none:'활용해요',seq:'활용하고',cause1:'활용해서',cause2:'활용하니까',condition:'활용하면',contrast1:'활용하지만',contrast2:'활용하는데',purpose:'활용하려고',result:'활용해서 그렇게 되다'}},
      {ko:'후회하다', ro:'a regreta', en:'to regret', aliases:['regret','regreți','regretă','regretăm','regretați','am regretat','ai regretat','a regretat','ați regretat','au regretat','regreta','regrets'], final:'후회해요', forms:{none:'후회해요',seq:'후회하고',cause1:'후회해서',cause2:'후회하니까',condition:'후회하면',contrast1:'후회하지만',contrast2:'후회하는데',purpose:'후회하려고',result:'후회해서 그렇게 되다'}},
      {ko:'흔들다', ro:'a scutura / a agita', en:'to shake', aliases:['scutur','scuturi','scutură','scuturăm','scuturați','am scuturat','ai scuturat','a scuturat','ați scuturat','au scuturat','scutura','agita','shake','shakes'], final:'흔들어요', forms:{none:'흔들어요',seq:'흔들고',cause1:'흔들어서',cause2:'흔드니까',condition:'흔들면',contrast1:'흔들지만',contrast2:'흔드는데',purpose:'흔들려고',result:'흔들어서 그렇게 되다'}},
      {ko:'퇴사하다', ro:'a demisiona', en:'to leave a company', aliases:['demisionez','demisionezi','demisionează','demisionăm','demisionați','am demisionat','ai demisionat','a demisionat','ați demisionat','au demisionat','demisiona','leave a company','leaves a company'], final:'퇴사해요', forms:{none:'퇴사해요',seq:'퇴사하고',cause1:'퇴사해서',cause2:'퇴사하니까',condition:'퇴사하면',contrast1:'퇴사하지만',contrast2:'퇴사하는데',purpose:'퇴사하려고',result:'퇴사해서 그렇게 되다'}},
      {ko:'지치다', ro:'a se epuiza', en:'to get exhausted', aliases:['mă epuizez','te epuizezi','se epuizează','ne epuizăm','vă epuizați','m-am epuizat','te-ai epuizat','s-a epuizat','ne-am epuizat','v-ați epuizat','s-au epuizat','epuiza','get exhausted','gets exhausted'], final:'지쳐요', forms:{none:'지쳐요',seq:'지치고',cause1:'지쳐서',cause2:'지치니까',condition:'지치면',contrast1:'지치지만',contrast2:'지치는데',purpose:'지치려고',result:'지쳐서 그렇게 되다'}},
      {ko:'충전하다', ro:'a încărca (bateria)', en:'to charge (battery)', aliases:['încarc','încarci','încarcă','încărcăm','încărcați','am încărcat','ai încărcat','a încărcat','ați încărcat','au încărcat','încărca','charge','charges'], final:'충전해요', forms:{none:'충전해요',seq:'충전하고',cause1:'충전해서',cause2:'충전하니까',condition:'충전하면',contrast1:'충전하지만',contrast2:'충전하는데',purpose:'충전하려고',result:'충전해서 그렇게 되다'}},
    ],
    connector: [
      {id:'none', key:'none', ko:'—', ro:'', en:'', aliases:['fara conector','fără conector','none']},
      {id:'seq', key:'seq', ko:'고', ro:'și apoi', en:'and then', aliases:['si apoi','și apoi','apoi','and then']},
      {id:'cause1', key:'cause1', ko:'아/어서', ro:'pentru că', en:'because', aliases:['pentru ca','pentru că','because']},
      {id:'cause2', key:'cause2', ko:'(으)니까', ro:'fiindcă', en:'since', aliases:['fiindca','fiindcă','since']},
      {id:'condition', key:'condition', ko:'(으)면', ro:'dacă', en:'if', aliases:['daca','dacă','if']},
      {id:'contrast1', key:'contrast1', ko:'지만', ro:'dar', en:'but', aliases:['dar','insa','însă','but','however']},
      {id:'contrast2', key:'contrast2', ko:'는데', ro:'iar', en:'while', aliases:['iar','while']},
      {id:'purpose', key:'purpose', ko:'(으)려고', ro:'ca să', en:'in order to', aliases:['ca sa','ca să','in order to']},
      {id:'result', key:'result', ko:'게 되다', ro:'ajunge să', en:'end up', aliases:['ajunge sa','ajunge să','end up']},
      {id:'tense_pres',        key:'tense_pres',        ko:'-아요/어요',       ro:'prezent',         en:'present',        isTense:true,  aliases:[]},
      {id:'tense_past',        key:'tense_past',        ko:'-았어요/었어요',    ro:'trecut',           en:'past',           isTense:true,  aliases:[]},
      {id:'tense_fut',         key:'tense_fut',         ko:'-(으)ㄹ 거예요',   ro:'viitor',           en:'future',         isTense:true,  aliases:[]},
      {id:'tense_progressive', key:'tense_progressive', ko:'-고 있어요',         ro:'în curs de',        en:'is doing',          isTense:true, aliases:[]},
      {id:'tense_wish',        key:'tense_wish',        ko:'-고 싶어요',         ro:'vreau să',          en:'want to',           isTense:true, aliases:[]},
      {id:'tense_intention',   key:'tense_intention',   ko:'-(으)려고 해요',     ro:'intenționez să',    en:'intend to',         isTense:true, aliases:[]},
      {id:'tense_can',         key:'tense_can',         ko:'-(으)ㄹ 수 있어요',  ro:'pot să',            en:'can',               isTense:true, aliases:[]},
      {id:'tense_cannot',      key:'tense_cannot',      ko:'-(으)ㄹ 수 없어요',  ro:'nu pot să',         en:'cannot',            isTense:true, aliases:[]},
      {id:'tense_neg',          key:'tense_neg',          ko:'-지 않아요',         ro:'nu (voinţă)',        en:'don\'t',               isTense:true, aliases:[]},
      {id:'tense_notwish',      key:'tense_notwish',      ko:'-고 싶지 않아요',    ro:'nu vreau să',       en:'don\'t want to',       isTense:true, aliases:[]},
      {id:'tense_mot_neg',      key:'tense_mot_neg',      ko:'-지 못해요',         ro:'nu reușesc',        en:'can\'t manage to',     isTense:true, aliases:[]},
      {id:'tense_mot_neg_past', key:'tense_mot_neg_past', ko:'-지 못했어요',       ro:'n-am reușit',       en:'couldn\'t manage',     isTense:true, aliases:[]},
      {id:'tense_mustnot',      key:'tense_mustnot',      ko:'-면 안 돼요',        ro:'nu trebuie să',     en:'must not',             isTense:true, aliases:[]},
      {id:'tense_must',        key:'tense_must',        ko:'-아/어야 해요',      ro:'trebuie să',        en:'must / have to',    isTense:true, aliases:[]},
      {id:'tense_should',      key:'tense_should',      ko:'-는 게 좋아요',       ro:'ar trebui să',      en:'should',            isTense:true, aliases:[]},
      {id:'tense_polite',      key:'tense_polite',      ko:'-겠어요',            ro:'voi / cred că',     en:'will / I think',    isTense:true, aliases:[]},
      {id:'tense_promise',     key:'tense_promise',     ko:'-(으)ㄹ게요',        ro:'voi (promit)',      en:'will (promise)',     isTense:true, aliases:[]},
      {id:'while',         key:'while',         ko:'-(으)면서',          ro:'în timp ce',        en:'while doing',        aliases:['in timp ce','while doing','while']},
      {id:'concede',       key:'concede',       ko:'-아/어도',           ro:'chiar dacă',        en:'even if',            aliases:['chiar daca','chiar dacă','even if']},
      {id:'after',         key:'after',         ko:'-고 나서',           ro:'după ce',           en:'after',              aliases:['dupa ce','după ce','after']},
      {id:'before',        key:'before',        ko:'-기 전에',           ro:'înainte să',        en:'before',             aliases:['inainte sa','înainte să','before']},
      {id:'or',            key:'or',            ko:'-거나',              ro:'sau',               en:'or',                 aliases:['sau','or']},
      {id:'when',          key:'when',          ko:'-(으)ㄹ 때',         ro:'când',              en:'when',               aliases:['cand','când','when']},
      {id:'purpose2',      key:'purpose2',      ko:'-기 위해서',         ro:'pentru a',          en:'in order to do',     aliases:['pentru a','in order to do']},
      {id:'asap',          key:'asap',          ko:'-자마자',            ro:'imediat ce',        en:'as soon as',         aliases:['imediat ce','as soon as']},
      {id:'switch',        key:'switch',        ko:'-다가',              ro:'și la un moment',   en:'then suddenly',      aliases:['si brusc','then suddenly']},
      {id:'during',        key:'during',        ko:'-는 동안',           ro:'pe durata',         en:'while / during',     aliases:['pe durata','pe parcurs','during']},
      {id:'instead',       key:'instead',       ko:'-는 대신에',         ro:'în locul',          en:'instead of',         aliases:['in locul','în locul','instead of']},
      {id:'concede2',      key:'concede2',      ko:'-(으)ㄴ/는데도',     ro:'cu toate că',       en:'even though',        aliases:['cu toate ca','cu toate că','even though','desi','deși']},
      {id:'proportion',    key:'proportion',    ko:'-(으)ㄹ수록',        ro:'cu cât... cu atât', en:'the more',           aliases:['cu cat','cu cât','the more']},
      {id:'formal_cause',  key:'formal_cause',  ko:'-기에',              ro:'deoarece',          en:'given that',         aliases:['deoarece','given that']},
      {id:'informal_cause',key:'informal_cause',ko:'-길래',              ro:'văzând că',         en:'seeing that',        aliases:['vazand ca','văzând că','seeing that']},
      {id:'formal_result', key:'formal_result', ko:'-(으)므로',          ro:'prin urmare',       en:'therefore',          aliases:['prin urmare','therefore','deoarece formal']},
      {id:'contrast3',     key:'contrast3',     ko:'-(으)ㄴ/는 반면에',  ro:'pe de altă parte',  en:'whereas',            aliases:['pe de alta parte','pe de altă parte','whereas']},
      {id:'extent',        key:'extent',        ko:'-도록',              ro:'astfel încât',      en:'so that / until',    aliases:['astfel incat','astfel încât','so that','until']},
      {id:'notonly',       key:'notonly',       ko:'-(으)ㄹ 뿐만 아니라',ro:'nu numai ci și',    en:'not only but also',  aliases:['nu numai','not only','nu numai ci si']},
      {id:'aslong',        key:'aslong',        ko:'-(으)ㄴ/는 한',      ro:'atât timp cât',     en:'as long as',         aliases:['atat timp cat','atât timp cât','as long as']},
      {id:'because_of',    key:'because_of',    ko:'-(으)ㄴ/는 탓에',    ro:'din cauza că',      en:'due to',             aliases:['din cauza ca','din cauza că','due to']}
    ],
    numeral: [
      {ko:'', ro:'', en:'', aliases:[]},
      {ko:'한', ro:'unu / o', en:'one', aliases:['1','un','o','unu','una','one']},
      {ko:'두', ro:'doi / două', en:'two', aliases:['2','doi','doua','două','two']},
      {ko:'세', ro:'trei', en:'three', aliases:['3','trei','three']},
      {ko:'네', ro:'patru', en:'four', aliases:['4','patru','four']},
      {ko:'다섯', ro:'cinci', en:'five', aliases:['5','cinci','five']},
      {ko:'여섯', ro:'șase', en:'six', aliases:['6','sase','șase','six']},
      {ko:'일곱', ro:'șapte', en:'seven', aliases:['7','sapte','șapte','seven']},
      {ko:'여덟', ro:'opt', en:'eight', aliases:['8','opt','eight']},
      {ko:'아홉', ro:'nouă', en:'nine', aliases:['9','noua','nouă','nine']},
      {ko:'열', ro:'zece', en:'ten', aliases:['10','zece','ten']}
    ],
    quantifier: [
      {ko:'', ro:'', en:'', aliases:[]},
      {ko:'개', ro:'bucată / bucăți', en:'piece(s)', aliases:['bucata','bucată','bucati','bucăți','piece','pieces']},
      {ko:'병', ro:'sticlă / sticle', en:'bottle(s)', aliases:['sticla','sticlă','sticle','bottle','bottles']},
      {ko:'잔', ro:'pahar / cană', en:'glass / cup', aliases:['pahar','pahare','cana','cană','cani','glass','cup']},
      {ko:'인분', ro:'porție', en:'portion', aliases:['portie','porție','portii','porții','portion']},
      {ko:'권', ro:'volum', en:'volume', aliases:['volum','volume']},
      {ko:'명', ro:'persoană', en:'person', aliases:['persoana','persoană','persoane','person']}
    ],
    associate: [
      {ko:'', ro:'', en:'', aliases:[]},
      {ko:'친구와', ro:'cu prietenul/prietena', en:'with a friend', aliases:['cu prietenul','cu prietena','cu un prieten','with a friend','with my friend','friend']},
      {ko:'선생님과', ro:'cu profesorul', en:'with the teacher', aliases:['cu profesorul','with the teacher','teacher']},
      {ko:'가족과', ro:'cu familia', en:'with (my) family', aliases:['cu familia','with family','family']},
      {ko:'부모님과', ro:'cu părinții', en:'with (my) parents', aliases:['cu parintii','cu părinții','with parents','parents']},
      {ko:'남자친구와', ro:'cu iubitul', en:'with my boyfriend', aliases:['cu iubitul','with boyfriend','boyfriend']},
      {ko:'여자친구와', ro:'cu iubita', en:'with my girlfriend', aliases:['cu iubita','with girlfriend','girlfriend']},
      {ko:'동생과', ro:'cu fratele/sora mai mică', en:'with (younger) sibling', aliases:['cu fratele','cu sora','with sibling']},
      {ko:'반 친구들과', ro:'cu colegii de clasă', en:'with classmates', aliases:['cu colegii','with classmates','classmates']},
      {ko:'동료와', ro:'cu colegul de muncă', en:'with a colleague', aliases:['cu colegul','with colleague','colleague']}
    ],
    beneficiary: [
      {ko:'', ro:'', en:'', aliases:[]},
      {ko:'저에게', ro:'mie', en:'to me', aliases:['mie','pentru mine','to me']},
      {ko:'너에게', ro:'ție', en:'to you', aliases:['tie','ție','pentru tine','to you']},
      {ko:'친구에게', ro:'prietenului/prietenei', en:'to a friend', aliases:['prietenului','prietenei','to friend','to my friend']},
      {ko:'선생님에게', ro:'profesorului', en:'to the teacher', aliases:['profesorului','to the teacher']},
      {ko:'부모님에게', ro:'părinților', en:'to (my) parents', aliases:['parintilor','părinților','to parents']},
      {ko:'학생에게', ro:'studentului', en:'to the student', aliases:['studentului','to the student']},
      {ko:'아이에게', ro:'copilului', en:'to the child', aliases:['copilului','to the child']},
      {ko:'동생에게', ro:'fratelui/surorii mai mici', en:'to (younger) sibling', aliases:['fratelui','surorii','to sibling']}
    ],
    emb_subject: [
      {ko:'', ro:'', en:'', aliases:[]},
      {ko:'모든 게', ro:'totul', en:'everything', aliases:['totul','everything','all','toate']},
      {ko:'시간이', ro:'timpul', en:'time', aliases:['timpul','time']},
      {ko:'한국어가', ro:'coreeana', en:'Korean', aliases:['coreeana','Korean','limba coreeana','limba coreeană']},
      {ko:'공부가', ro:'studiul', en:'studying', aliases:['studiul','studying','invatatul','învățatul']},
      {ko:'그게', ro:'acel lucru', en:'that (thing)', aliases:['acel lucru','that thing','asta','asta','that']},
      {ko:'삶이', ro:'viața', en:'life', aliases:['viata','viața','life']},
      {ko:'사랑이', ro:'iubirea', en:'love', aliases:['iubirea','iubire','love']},
      {ko:'결과가', ro:'rezultatul', en:'the result', aliases:['rezultatul','rezultat','result']},
      {ko:'현실이', ro:'realitatea', en:'reality', aliases:['realitatea','realitate','reality']},
      {ko:'진실이', ro:'adevărul', en:'the truth', aliases:['adevarul','adevărul','adevăr','truth']},
      {ko:'일이', ro:'munca / treaba', en:'the work / the thing', aliases:['munca','treaba','work','thing']},
      {ko:'세상이', ro:'lumea', en:'the world', aliases:['lumea','lume','world']},
      {ko:'꿈이', ro:'visul', en:'the dream', aliases:['visul','vis','dream']}
    ],
    emb_pred: [
      {ko:'', ro:'', en:'', aliases:[], clausal:''},
      {ko:'덧없다', ro:'e trecător/trecătoare', en:'is fleeting / transient', aliases:['trecator','trecatoare','trecătoare','fleeting','transient','trece'], clausal:'덧없다는 걸'},
      {ko:'어렵다', ro:'e greu / dificil', en:'is difficult', aliases:['greu','dificil','difficult','grea'], clausal:'어렵다는 걸'},
      {ko:'중요하다', ro:'e important', en:'is important', aliases:['important','importanta','importantă','important','important'], clausal:'중요하다는 걸'},
      {ko:'힘들다', ro:'e greu / obositor', en:'is hard / tiring', aliases:['greu','obositor','obositoare','hard','tiring'], clausal:'힘들다는 걸'},
      {ko:'사실이다', ro:'e adevărat', en:'is true / a fact', aliases:['adevarat','adevărat','true','a fact','real'], clausal:'사실이라는 걸'},
      {ko:'좋다', ro:'e bun / bine', en:'is good', aliases:['bun','buna','bună','bine','good'], clausal:'좋다는 걸'},
      {ko:'나쁘다', ro:'e rău', en:'is bad', aliases:['rau','rău','rea','bad'], clausal:'나쁘다는 걸'},
      {ko:'빠르다', ro:'e repede', en:'is fast', aliases:['repede','rapid','rapida','rapidă','fast'], clausal:'빠르다는 걸'},
      {ko:'많다', ro:'e mult / sunt mulți', en:'is a lot / there are many', aliases:['mult','multi','mulți','a lot','many'], clausal:'많다는 걸'},
      {ko:'없다', ro:'nu există / nu are', en:'doesn\'t exist / have', aliases:['nu exista','nu există','nu are','doesn\'t exist'], clausal:'없다는 걸'},
      {ko:'변하다', ro:'se schimbă', en:'changes', aliases:['se schimba','se schimbă','schimba','changes'], clausal:'변한다는 걸'},
      {ko:'끝나다', ro:'se termină', en:'ends', aliases:['se termina','se termină','termina','ends','terminates'], clausal:'끝난다는 걸'},
      {ko:'지나가다', ro:'trece', en:'passes by', aliases:['trece','trece','passes','goes by'], clausal:'지나간다는 걸'},
      {ko:'필요하다', ro:'e necesar', en:'is necessary', aliases:['necesar','necesara','necesară','necessary','needed'], clausal:'필요하다는 걸'},
      {ko:'가능하다', ro:'e posibil', en:'is possible', aliases:['posibil','posibila','posibilă','possible'], clausal:'가능하다는 걸'},
      {ko:'불가능하다', ro:'e imposibil', en:'is impossible', aliases:['imposibil','imposibila','imposibilă','impossible'], clausal:'불가능하다는 걸'}
    ]
  };

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
    if(!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'ko-KR';
    u.rate = rate || 0.9;
    window.speechSynthesis.speak(u);
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
    try{
      var raw = localStorage.getItem(SAVED_KEY);
      if(raw) savedSentences = JSON.parse(raw);
    }catch(e){ savedSentences = []; }
  }

  function persistSaved(){
    try{ localStorage.setItem(SAVED_KEY, JSON.stringify(savedSentences)); }catch(e){}
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
    var blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'raluca-korean.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
    try{
      var raw = localStorage.getItem(USAGE_KEY);
      if(raw) wordUsage = JSON.parse(raw);
    }catch(e){ wordUsage = {}; }
  }

  function saveWordUsage(){
    try{ localStorage.setItem(USAGE_KEY, JSON.stringify(wordUsage)); }catch(e){}
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
    return String(str || '')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#039;');
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

  function buildClauseTranslation(clause){
    var parts = [];

    var topic = itemOf(clause, 'topic');
    var topic2 = itemOf(clause, 'topic2');
    var time = itemOf(clause, 'time');
    var departure = itemOf(clause, 'departure');
    var transit = itemOf(clause, 'transit');
    var associate = itemOf(clause, 'associate');
    var embSub = itemOf(clause, 'embSub');
    var embPred = itemOf(clause, 'embPred');
    var beneficiary = itemOf(clause, 'beneficiary');
    var numeral = itemOf(clause, 'numeral');
    var quantifier = itemOf(clause, 'quantifier');
    var object1 = itemOf(clause, 'object1');
    var object2 = itemOf(clause, 'object2');
    var adverb = itemOf(clause, 'adverb');
    var adverb2 = itemOf(clause, 'adverb2');
    var verb = itemOf(clause, 'verb');

    if(topic) parts.push(translationOf(topic));
    if(topic2){
      parts.push(state.lang === 'en'
        ? ('and ' + (topic2.en || topic2.ro || topic2.ko))
        : ('și ' + (topic2.ro || topic2.en || topic2.ko)));
    }
    if(associate) parts.push(translationOf(associate));
    if(time) parts.push(translationOf(time));
    if(departure) parts.push(translationOf(departure));
    if(transit){
      var ttr = translationOf(transit);
      if(ttr) parts.push((state.lang === 'en' ? 'and ' : 'și ') + ttr);
    }
    if(embSub && embPred && embSub.ko && embPred.ko){
      var embTrSubj = state.lang === 'en' ? (embSub.en || embSub.ro) : (embSub.ro || embSub.en);
      var embTrPred = state.lang === 'en' ? (embPred.en || embPred.ro) : (embPred.ro || embPred.en);
      parts.push((state.lang === 'en' ? 'that ' : 'că ') + embTrSubj + ' ' + embTrPred);
    }
    if(beneficiary) parts.push(translationOf(beneficiary));
    if(object1){
      var o1tr = translationOf(object1);
      if(o1tr){
        // Build "N quantifier of object" style: "un pahar de cafea" / "one cup of coffee"
        var numTr = numeral ? translationOf(numeral) : '';
        var qtTr  = quantifier ? translationOf(quantifier) : '';
        if(numTr && qtTr)
          parts.push(numTr + ' ' + qtTr + (state.lang === 'en' ? ' of ' : ' de ') + o1tr);
        else if(numTr || qtTr)
          parts.push((numTr || qtTr) + ' ' + o1tr);
        else
          parts.push(o1tr);
      }
    }
    if(object2){
      var o2tr = translationOf(object2);
      if(o2tr) parts.push((state.lang === 'en' ? 'and ' : 'și ') + o2tr);
    }
    if(adverb) parts.push(translationOf(adverb));
    if(adverb2) parts.push(translationOf(adverb2));

    if(verb){
      var topicKo = topic ? topic.ko : '';
      var cKeyTr = connectorKey(clause);
      var tenseTr = cKeyTr === 'tense_past'         ? 'past'
                 : cKeyTr === 'tense_fut'          ? 'future'
                 : cKeyTr === 'tense_neg'          ? 'neg'
                 : cKeyTr === 'tense_notwish'      ? 'notwish'
                 : cKeyTr === 'tense_mot_neg'      ? 'neg'
                 : cKeyTr === 'tense_mot_neg_past' ? 'neg'
                 : cKeyTr === 'tense_mustnot'      ? 'mustnot'
                 : cKeyTr === 'tense_cannot'       ? 'cannot'
                 : cKeyTr === 'tense_wish'         ? 'wish'
                 : cKeyTr === 'tense_must'         ? 'must'
                 : cKeyTr === 'tense_should'       ? 'should'
                 : 'present';
      parts.push(finiteVerbText(verb, state.lang, topicKo, tenseTr));
      // For clause connectors, append connector translation word
      var connItem = itemOf(clause, 'connector');
      if(connItem && connItem.raw && !connItem.raw.isTense && connItem.key !== 'none'){
        var connTr = state.lang === 'en' ? (connItem.en || '') : (connItem.ro || '');
        if(connTr) parts.push(connTr);
      }
    }

    return cleanSentenceText(parts.join(' '));
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

    window.speechSynthesis.cancel();

    var utter = new SpeechSynthesisUtterance(built.korean);
    utter.lang = 'ko-KR';
    utter.rate = 0.9;

    var activeIndex = -1;
    var wordEls = els.sentenceWords ? els.sentenceWords.querySelectorAll('.word') : [];

    utter.onboundary = function(){
      activeIndex += 1;
      for(var i=0;i<wordEls.length;i++){
        wordEls[i].classList.toggle('active', i === activeIndex);
      }
    };

    utter.onend = function(){
      for(var i=0;i<wordEls.length;i++){
        wordEls[i].classList.remove('active');
      }
    };

    window.speechSynthesis.speak(utter);
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

  init();
})();
