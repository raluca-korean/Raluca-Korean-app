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
      {ko:'오늘', ro:'astăzi', en:'today', aliases:['astăzi','astazi','azi','today']},
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
      {ko:'시험 중에', ro:'în timpul examenului', en:'during the exam', aliases:['examen','examenului','pe durata examenului','in timpul examenului','în timpul examenului','during the exam','during exam']}
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
      {ko:'해변에서', ro:'la plajă', en:'at the beach', aliases:['la plaja','la plajă','plaja','plajă','beach']}
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
      {ko:'과일을', ro:'fructe', en:'fruit', aliases:['fructe','fruct','fruit','fruits']}
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
      {ko:'기쁘다', ro:'a fi fericit', en:'to be happy', aliases:['bucuros','bucuroasa','bucuroasă','fericita','fericită','fericit','fericiti','fericiți','bucurosi','bucuroși','sunt fericit','sunt fericita','sunt fericită','sunt bucuros','sunt bucuroasa','sunt bucuroasă','suntem fericiti','suntem fericiți','suntem bucurosi','suntem bucuroși','sunteti fericiti','sunteți fericiți','esti fericit','ești fericit','esti bucuros','ești bucuroasă','happy','glad','joyful','am happy','are happy','is happy','we are happy','are happy'], final:'기뻐요', forms:{none:'기뻐요',seq:'기쁘고',cause1:'기뻐서',cause2:'기쁘니까',condition:'기쁘면',contrast1:'기쁘지만',contrast2:'기쁜데',purpose:'기쁘게',result:'기쁘게 되다'}},
      {ko:'화나다', ro:'a fi supărat', en:'to be angry', aliases:['suparat','suparata','supărată','supărat','suparati','supărați','iritat','iritata','iritată','nervos','nervoasa','nervoasă','nervosi','nervoși','sunt suparat','sunt suparata','sunt supărată','suntem suparati','suntem supărați','sunteti suparati','sunteți supărați','esti suparat','ești supărată','angry','mad','upset','annoyed','furious','am angry','am upset','is angry','are angry','we are angry'], final:'화나요', forms:{none:'화나요',seq:'화나고',cause1:'화나서',cause2:'화나니까',condition:'화나면',contrast1:'화나지만',contrast2:'화나는데',purpose:'화나려고',result:'화나게 되다'}},
      {ko:'슬프다', ro:'a fi trist', en:'to be sad', aliases:['trist','trista','tristă','tristi','triști','sunt trist','sunt trista','sunt tristă','suntem tristi','suntem triști','sunteti tristi','sunteți triști','esti trist','ești tristă','sad','unhappy','am sad','is sad','are sad','we are sad'], final:'슬퍼요', forms:{none:'슬퍼요',seq:'슬프고',cause1:'슬퍼서',cause2:'슬프니까',condition:'슬프면',contrast1:'슬프지만',contrast2:'슬픈데',purpose:'슬프게',result:'슬프게 되다'}},
      {ko:'피곤하다', ro:'a fi obosit', en:'to be tired', aliases:['obosit','obosita','obosită','obositi','obosiți','sunt obosit','sunt obosita','sunt obosită','suntem obositi','suntem obosiți','sunteti obositi','sunteți obosiți','esti obosit','ești obosită','tired','exhausted','am tired','is tired','are tired','we are tired'], final:'피곤해요', forms:{none:'피곤해요',seq:'피곤하고',cause1:'피곤해서',cause2:'피곤하니까',condition:'피곤하면',contrast1:'피곤하지만',contrast2:'피곤한데',purpose:'피곤하게',result:'피곤하게 되다'}},
      {ko:'안녕하세요', ro:'Bună ziua', en:'Hello', isPhrase:true, aliases:['buna ziua','salut','hello','buna','good afternoon','good day'], final:'안녕하세요', forms:{none:'안녕하세요',seq:'안녕하세요',cause1:'안녕하세요',cause2:'안녕하세요',condition:'안녕하세요',contrast1:'안녕하세요',contrast2:'안녕하세요',purpose:'안녕하세요',result:'안녕하세요'}},
      {ko:'좋은 아침이에요', ro:'Bună dimineața', en:'Good morning', isPhrase:true, aliases:['buna dimineata','buna dimineața','good morning'], final:'좋은 아침이에요', forms:{none:'좋은 아침이에요',seq:'좋은 아침이에요',cause1:'좋은 아침이에요',cause2:'좋은 아침이에요',condition:'좋은 아침이에요',contrast1:'좋은 아침이에요',contrast2:'좋은 아침이에요',purpose:'좋은 아침이에요',result:'좋은 아침이에요'}},
      {ko:'좋은 저녁이에요', ro:'Bună seara', en:'Good evening', isPhrase:true, aliases:['buna seara','good evening'], final:'좋은 저녁이에요', forms:{none:'좋은 저녁이에요',seq:'좋은 저녁이에요',cause1:'좋은 저녁이에요',cause2:'좋은 저녁이에요',condition:'좋은 저녁이에요',contrast1:'좋은 저녁이에요',contrast2:'좋은 저녁이에요',purpose:'좋은 저녁이에요',result:'좋은 저녁이에요'}},
      {ko:'안녕히 가세요', ro:'La revedere', en:'Goodbye', isPhrase:true, aliases:['la revedere','bye','goodbye','pa','pa pa'], final:'안녕히 가세요', forms:{none:'안녕히 가세요',seq:'안녕히 가세요',cause1:'안녕히 가세요',cause2:'안녕히 가세요',condition:'안녕히 가세요',contrast1:'안녕히 가세요',contrast2:'안녕히 가세요',purpose:'안녕히 가세요',result:'안녕히 가세요'}}
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
    if(cKey === 'tense_should')  return conj ? conj.stem(verb.ko) + '는 게 좋아요' : (verb.final || verb.ko);
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
    // Purpose clause -(으)러: "sa cumpere" → 사러, placed before main verb
    if(!skipVerb && clause.__purposeVerbItem){
      var pv = clause.__purposeVerbItem;
      var pvStem = pv.ko.replace(/다$/, '');
      var pvHasBatchim = window.Conjugation && window.Conjugation.hasBatchim(pvStem);
      parts.push(pvStem + (pvHasBatchim ? '으러' : '러'));
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
        '<div class="tableMainBtn ' + (item && item.ko ? '' : 'is-empty') + (conjugated ? ' is-conjugated' : '') + (isNew ? ' is-new' : '') + '" data-kind="' + escapeHtml(col.kind) + '">' +
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

        // For verbs: check if this match is preceded by 'sa' (Romanian subjunctive marker).
        // "sa cumpere" = purpose clause, NOT the main verb — prefer the non-sa verb.
        if(fieldKey === 'verb'){
          var before = normalizedText.substring(0, pos).trimEnd();
          var prevWord = before.split(/\s+/).pop();
          if(prevWord === 'sa'){
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

    // In Romanian, many connectors follow the pattern "result CONNECTOR reason",
    // but Korean needs "reason CONNECTOR result". Swap the clause texts so the
    // reason/precondition verb gets the connector suffix, and the main result follows.
    var SWAP_KEYS = {
      purpose:true, purpose2:true, cause1:true, cause2:true,
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
          // Path 2: "ca sa" connector folded a separate segment (e.g. "merge la cinema ca sa vada un film")
          if(!purposeVerbItem && cd.__purposeText){
            var ptVerb = findBestMatch('verb', cd.__purposeText);
            if(ptVerb && ptVerb.ko !== verb.ko){
              purposeVerbItem = ptVerb;
              var ptObjs = findAllMatches('object1', cd.__purposeText, 2);
              if(ptObjs.length) objects = ptObjs;
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

        var cycleBtn = event.target.closest('[data-cycle-field]');
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

        // Click anywhere on the cell body → focus its input
        var cellBody = event.target.closest('.tableMainBtn');
        if(cellBody && !event.target.closest('.tableKoInput')){
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
