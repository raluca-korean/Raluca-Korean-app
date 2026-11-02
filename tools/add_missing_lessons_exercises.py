"""Adaugă exerciții (3 × 7 tipuri) pentru lecțiile din lessons.json care nu aveau niciunul:
T1-16, T2-15, T2-16, T3-15, T3-16, T4-14, T4-15, T5-14, T5-15, T6-19, T6-20.
Idempotent: nu adaugă un exercițiu dacă există deja (aceeași cheie) pentru lecție.
Rulare din rădăcina repo-ului: python3 tools/add_missing_lessons_exercises.py
"""
import json

PATH = 'data/exercises.json'

def KR(q, ro, en):  # ko-ro: ro/en = liste, primul element = corect
    return {"q": q, "answers": {"ro": ro, "en": en}, "correct": {"ro": ro[0], "en": en[0]}}

def RK(ro, en, opts):  # ro-ko: primul = corect
    return {"prompt": {"ro": ro, "en": en}, "options": opts, "correct": opts[0]}

def P(tpl, opts, hro, hen):
    return {"template": tpl, "options": opts, "correct": opts[0], "hint": {"ro": hro, "en": hen}}

def PP(tpl, opts, hro, hen):
    return {"template": tpl, "options": opts, "correct": opts[0], "hint": {"ro": hro, "en": hen}}

def C(ro, en, opts):
    return {"prompt": {"ro": ro, "en": en}, "options": opts, "correct": opts[0]}

def Z(tiles, hro, hen):  # puzzle: tiles în ordinea corectă
    return {"tiles": tiles, "correct": tiles, "hint": {"ro": hro, "en": hen}}

def CH(lines, cro, cen):  # chain: replici în ordinea corectă
    return {"tiles": lines, "correct": lines, "context": {"ro": cro, "en": cen}}

L = {}

L["T1-16"] = {
 "ko-ro": [
  KR("여기에서 담배를 피우지 마세요.",
     ["Nu fumați aici.", "Fumați aici.", "Nu fumez aici.", "Puteți fuma aici."],
     ["Please don't smoke here.", "Please smoke here.", "I don't smoke here.", "You may smoke here."]),
  KR("걱정하지 마세요.",
     ["Nu vă faceți griji.", "Faceți-vă griji.", "Nu sunt îngrijorat.", "De ce vă faceți griji?"],
     ["Don't worry.", "Please worry.", "I'm not worried.", "Why are you worried?"]),
  KR("수업 시간에 전화하지 마세요.",
     ["Nu dați telefoane în timpul orei.", "Sunați în timpul orei.", "Nu am sunat în timpul orei.", "Ora s-a terminat, puteți suna."],
     ["Don't make phone calls during class.", "Make phone calls during class.", "I didn't call during class.", "Class is over, you can call."]),
 ],
 "ro-ko": [
  RK("Nu mâncați în bibliotecă.", "Please don't eat in the library.",
     ["도서관에서 먹지 마세요.", "도서관에서 먹으세요.", "도서관에서 안 먹어요.", "도서관에서 먹지 않았어요."]),
  RK("Nu întârziați.", "Please don't be late.",
     ["늦게 오지 마세요.", "늦게 오세요.", "늦게 왔어요.", "늦게 오지 않아요."]),
  RK("Nu plângeți.", "Please don't cry.",
     ["울지 마세요.", "우세요.", "울지 않아요.", "울 거예요."]),
 ],
 "particle": [
  P("사진을 찍___ 마세요.", ["지", "고", "게", "면"], "-지 마세요 = nu faceți", "-지 마세요 = please don't"),
  P("창문을 열지 ___.", ["마세요", "하세요", "되세요", "있어요"], "-지 + 마세요", "-지 + 마세요"),
  P("여기에 차를 세우___ 마세요.", ["지", "고", "면", "서"], "세우다 = a parca", "세우다 = to park"),
 ],
 "particlePlus": [
  PP("박물관___ 사진___ 찍지 마세요.", [["에서", "을"], ["에", "을"], ["에서", "이"], ["을", "에서"]],
     "loc al acțiunii + obiect", "place of action + object"),
  PP("밤___ 큰 소리___ 노래하지 마세요.", [["에", "로"], ["에서", "로"], ["에", "를"], ["을", "로"]],
     "timp + mod (cu voce tare)", "time + manner (loudly)"),
  PP("친구___ 거짓말___ 하지 마세요.", [["에게", "을"], ["를", "을"], ["에게", "이"], ["에서", "을"]],
     "cui + ce", "to whom + what"),
 ],
 "conjug": [
  C("가다 → nu mergeți (-지 마세요)", "가다 → please don't go (-지 마세요)",
    ["가지 마세요", "가지 말세요", "가 마세요", "가지 마어요"]),
  C("만지다 → nu atingeți (-지 마세요)", "만지다 → please don't touch (-지 마세요)",
    ["만지지 마세요", "만지지 말세요", "만져 마세요", "만지 마세요"]),
  C("잊다 → nu uitați (-지 마세요)", "잊다 → please don't forget (-지 마세요)",
    ["잊지 마세요", "잊으지 마세요", "잊지 말으세요", "잊어 마세요"]),
 ],
 "puzzle": [
  Z(["수업", "중에", "휴대폰을", "보지", "마세요."], "Nu vă uitați pe telefon în timpul orei.", "Don't look at your phone during class."),
  Z(["너무", "많이", "걱정하지", "마세요."], "Nu vă faceți prea multe griji.", "Don't worry too much."),
  Z(["여기에", "쓰레기를", "버리지", "마세요."], "Nu aruncați gunoi aici.", "Don't throw trash here."),
 ],
 "chain": [
  CH(["저기요, 여기에서는 사진을 찍지 마세요.", "아, 죄송합니다. 몰랐어요.", "괜찮아요. 저쪽에 안내문이 있어요.", "네, 이제 조심할게요."],
     "La muzeu: un paznic atenționează un vizitator", "At the museum: a guard warns a visitor"),
  CH(["내일 시험이 있어요. 너무 떨려요.", "너무 걱정하지 마세요.", "열심히 공부했으니까 잘할 거예요.", "고마워요. 힘이 나요."],
     "Încurajare înainte de examen", "Encouragement before an exam"),
  CH(["의사 선생님, 뭘 조심해야 돼요?", "오늘은 술을 마시지 마세요.", "운동도 하지 말까요?", "네, 며칠 동안 푹 쉬세요."],
     "Sfaturile medicului", "The doctor's advice"),
 ],
}

L["T2-15"] = {
 "ko-ro": [
  KR("와, 한국어를 정말 잘하시네요!",
     ["Uau, vorbiți foarte bine coreeana!", "Vreau să vorbesc bine coreeana.", "Nu vorbiți coreeana.", "Ați învățat coreeana anul trecut?"],
     ["Wow, you speak Korean really well!", "I want to speak Korean well.", "You don't speak Korean.", "Did you learn Korean last year?"]),
  KR("오늘 날씨가 춥네요.",
     ["Ce frig e azi!", "Mâine va fi frig.", "Ieri a fost cald.", "Nu e frig azi."],
     ["Oh, it's cold today!", "It will be cold tomorrow.", "It was warm yesterday.", "It isn't cold today."]),
  KR("이 음식 정말 맛있네요.",
     ["Mâncarea asta e chiar delicioasă!", "Mâncarea asta nu e bună.", "Vreau să gătesc mâncarea asta.", "Unde ai cumpărat mâncarea asta?"],
     ["This food is really delicious!", "This food isn't good.", "I want to cook this food.", "Where did you buy this food?"]),
 ],
 "ro-ko": [
  RK("Ce frumoasă e camera! (constatare)", "What a nice room! (realization)",
     ["방이 정말 예쁘네요.", "방이 정말 예뻐요?", "방이 예쁘지 않아요.", "방이 예쁠 거예요."]),
  RK("Oh, a venit deja autobuzul!", "Oh, the bus is already here!",
     ["벌써 버스가 왔네요.", "버스가 올 거예요.", "버스가 안 왔어요.", "버스를 탈까요?"]),
  RK("Văd că sunteți foarte ocupat azi.", "I see you're very busy today.",
     ["오늘 많이 바쁘시네요.", "오늘 바쁘세요?", "오늘 안 바빠요.", "내일 바쁠 거예요."]),
 ],
 "particle": [
  P("이 꽃 정말 예쁘___.", ["네요", "세요", "고", "지만"], "constatare / exclamație", "realization / exclamation"),
  P("벌써 겨울___.", ["이네요", "네요", "이에요네", "이고"], "substantiv cu consoană finală + 이네요", "noun ending in consonant + 이네요"),
  P("비가 많이 오___.", ["네요", "세요", "으네요", "는네요"], "verb + 네요", "verb + 네요"),
 ],
 "particlePlus": [
  PP("밖___ 눈___ 오네요.", [["에", "이"], ["에서", "을"], ["에", "을"], ["을", "이"]], "loc + subiect", "place + subject"),
  PP("한국 음식___ 생각보다 맵지 않___.", [["이", "네요"], ["을", "네요"], ["이", "세요"], ["을", "어요"]],
     "subiect + constatare", "subject + realization"),
  PP("동생___ 키___ 많이 컸네요.", [["이", "가"], ["을", "를"], ["이", "를"], ["에", "을"]], "subiect dublu", "double subject"),
 ],
 "conjug": [
  C("크다 → e mare! (-네요)", "크다 → it's big! (-네요)", ["크네요", "커네요", "큰네요", "크었네요"]),
  C("살다 → locuiește aici! (-네요, ㄹ cade)", "살다 → lives here! (-네요, ㄹ drops)", ["사네요", "살네요", "살으네요", "살아네요"]),
  C("덥다 → ce cald e! (-네요)", "덥다 → it's hot! (-네요)", ["덥네요", "더워네요", "더운네요", "덥으네요"]),
 ],
 "puzzle": [
  Z(["시간이", "정말", "빨리", "가네요."], "Ce repede trece timpul!", "Time really flies!"),
  Z(["여기", "경치가", "정말", "아름답네요."], "Ce frumoasă e priveliștea aici!", "The view here is really beautiful!"),
  Z(["벌써", "다", "끝났네요."], "S-a terminat deja totul!", "It's all over already!"),
 ],
 "chain": [
  CH(["와, 사람이 정말 많네요.", "네, 주말이라서 그래요.", "그럼 다른 곳으로 갈까요?", "좋아요. 근처에 조용한 카페가 있어요."],
     "Într-un loc aglomerat, în weekend", "At a crowded place on the weekend"),
  CH(["이 사진 좀 보세요. 제가 찍었어요.", "와, 정말 잘 찍었네요! 어디예요?", "한강이에요. 어제 갔어요.", "하늘 색깔이 정말 예쁘네요."],
     "Comentarii la o fotografie", "Commenting on a photo"),
  CH(["민수 씨, 오랜만이에요!", "어, 지나 씨! 머리를 잘랐네요.", "네, 지난주에 잘랐어요.", "잘 어울리네요."],
     "Doi prieteni se revăd", "Two friends meet again"),
 ],
}

L["T2-16"] = {
 "ko-ro": [
  KR("주말에 영화를 볼까 해요.",
     ["Mă gândesc să mă uit la un film în weekend.", "M-am uitat la un film weekendul trecut.", "Vedem un film în weekend?", "Nu vreau să văd filme."],
     ["I'm thinking of watching a movie this weekend.", "I watched a movie last weekend.", "Shall we watch a movie this weekend?", "I don't want to watch movies."]),
  KR("머리를 짧게 자를까 해요.",
     ["Mă gândesc să mă tund scurt.", "M-am tuns scurt.", "Trebuie să mă tund.", "Nu-mi place părul scurt."],
     ["I'm thinking of cutting my hair short.", "I cut my hair short.", "I have to get a haircut.", "I don't like short hair."]),
  KR("내년에 한국에 갈까 해요.",
     ["Mă gândesc să merg în Coreea anul viitor.", "Am fost în Coreea anul trecut.", "Mergem în Coreea anul viitor?", "Trebuie să plec în Coreea."],
     ["I'm thinking of going to Korea next year.", "I went to Korea last year.", "Shall we go to Korea next year?", "I have to leave for Korea."]),
 ],
 "ro-ko": [
  RK("Mă gândesc să învăț să înot.", "I'm thinking of learning to swim.",
     ["수영을 배울까 해요.", "수영을 배웠어요.", "수영을 배울까요?", "수영을 배워야 해요."]),
  RK("Azi mă gândesc să mănânc acasă.", "Today I'm thinking of eating at home.",
     ["오늘은 집에서 먹을까 해요.", "오늘은 집에서 먹었어요.", "오늘은 집에서 먹을까요?", "오늘은 집에서 먹으세요."]),
  RK("Mă gândeam să mă mut.", "I was thinking of moving.",
     ["이사할까 했어요.", "이사했어요.", "이사할까요?", "이사하고 있어요."]),
 ],
 "particle": [
  P("오늘은 일찍 잘___ 해요.", ["까", "게", "고", "지"], "-(으)ㄹ까 하다 = mă gândesc să", "-(으)ㄹ까 하다 = thinking of"),
  P("점심에 비빔밥을 먹을까 ___.", ["해요", "돼요", "있어요", "주세요"], "-(으)ㄹ까 + 하다", "-(으)ㄹ까 + 하다"),
  P("친구한테 전화를 걸___ 해요.", ["까", "을까", "게", "고"], "걸다: rădăcină în ㄹ", "걸다: ㄹ-stem"),
 ],
 "particlePlus": [
  PP("방학___ 제주도___ 갈까 해요.", [["에", "에"], ["을", "에"], ["에", "에서"], ["이", "을"]], "timp + destinație", "time + destination"),
  PP("저녁___ 친구___ 만날까 해요.", [["에", "를"], ["에", "에게"], ["을", "를"], ["에서", "가"]], "timp + obiect", "time + object"),
  PP("생일 선물___ 시계___ 살까 해요.", [["로", "를"], ["을", "를"], ["로", "가"], ["에", "로"]], "în calitate de + obiect", "as + object"),
 ],
 "conjug": [
  C("읽다 → mă gândesc să citesc (-(으)ㄹ까 하다)", "읽다 → thinking of reading (-(으)ㄹ까 하다)",
    ["읽을까 해요", "읽까 해요", "읽을까 하요", "읽으까 해요"]),
  C("만들다 → mă gândesc să fac (rădăcină în ㄹ)", "만들다 → thinking of making (ㄹ-stem)",
    ["만들까 해요", "만들을까 해요", "만드를까 해요", "만들까 하어요"]),
  C("듣다 → mă gândesc să ascult (ㄷ → ㄹ)", "듣다 → thinking of listening (ㄷ → ㄹ)",
    ["들을까 해요", "듣을까 해요", "듣까 해요", "들까 해요"]),
 ],
 "puzzle": [
  Z(["이번", "주말에는", "집에서", "쉴까", "해요."], "Weekendul ăsta mă gândesc să mă odihnesc acasă.", "This weekend I'm thinking of resting at home."),
  Z(["한국어", "학원에", "다닐까", "해요."], "Mă gândesc să merg la o școală de coreeană.", "I'm thinking of attending a Korean academy."),
  Z(["오늘", "저녁에", "김치찌개를", "만들까", "해요."], "Diseară mă gândesc să fac kimchi-jjigae.", "Tonight I'm thinking of making kimchi stew."),
 ],
 "chain": [
  CH(["이번 방학에 뭐 할 거예요?", "아직 모르겠어요. 여행을 갈까 해요.", "어디로요?", "부산에 갈까 해요. 바다를 보고 싶어서요."],
     "Planuri de vacanță", "Vacation plans"),
  CH(["요즘 너무 피곤해요.", "그럼 운동을 시작해 보세요.", "네, 그래서 요가를 배울까 해요.", "좋은 생각이에요."],
     "Oboseală și un plan nou", "Tiredness and a new plan"),
  CH(["머리가 너무 길어졌어요.", "자를 거예요?", "네, 이번에는 짧게 자를까 해요.", "짧은 머리도 잘 어울릴 거예요."],
     "Despre o tunsoare", "About a haircut"),
 ],
}

L["T3-15"] = {
 "ko-ro": [
  KR("비가 오는데 우산이 없어요.",
     ["Plouă, dar n-am umbrelă.", "Nu plouă, deci n-am nevoie de umbrelă.", "Am umbrelă pentru că plouă.", "Mâine va ploua."],
     ["It's raining, but I don't have an umbrella.", "It's not raining, so I don't need an umbrella.", "I have an umbrella because it's raining.", "It will rain tomorrow."]),
  KR("배가 고픈데 뭐 먹을까요?",
     ["Mi-e foame — ce-ar fi să mâncăm ceva?", "Nu mi-e foame.", "Am mâncat deja.", "Unde ai mâncat?"],
     ["I'm hungry — what shall we eat?", "I'm not hungry.", "I've already eaten.", "Where did you eat?"]),
  KR("어제 그 식당에 갔는데 문을 닫았어요.",
     ["Ieri am fost la restaurantul acela, dar era închis.", "Ieri restaurantul acela era deschis.", "Mâine merg la restaurantul acela.", "Restaurantul s-a închis definitiv."],
     ["I went to that restaurant yesterday, but it was closed.", "That restaurant was open yesterday.", "I'm going to that restaurant tomorrow.", "The restaurant closed for good."]),
 ],
 "ro-ko": [
  RK("Vreau să merg, dar n-am timp.", "I want to go, but I don't have time.",
     ["가고 싶은데 시간이 없어요.", "가고 싶어서 시간이 없어요.", "가고 싶으면 시간이 없어요.", "가고 싶고 시간이 없어요."]),
  RK("E frig afară — închid fereastra?", "It's cold outside — shall I close the window?",
     ["밖이 추운데 창문을 닫을까요?", "밖이 추워서 창문을 닫았어요.", "밖이 춥고 창문을 닫아요.", "밖이 추우면 창문을 열어요."]),
  RK("Fratele meu e înalt, dar eu sunt scund.", "My brother is tall, but I'm short.",
     ["형은 키가 큰데 저는 키가 작아요.", "형은 키가 커서 저는 키가 작아요.", "형은 키가 크면 저는 작아요.", "형은 키가 크고 저도 커요."]),
 ],
 "particle": [
  P("날씨가 좋___데 산책할까요?", ["은", "는", "ㄴ", "던"], "adjectiv cu consoană + 은데", "adjective with consonant + 은데"),
  P("지금 공부하___데 조용히 해 주세요.", ["는", "은", "ㄴ", "을"], "verb (prezent) + 는데", "verb (present) + 는데"),
  P("어제 영화를 봤___데 정말 재미있었어요.", ["는", "은", "ㄴ", "던"], "trecut + 는데", "past + 는데"),
 ],
 "particlePlus": [
  PP("친구___ 전화했___데 안 받았어요.", [["에게", "는"], ["를", "는"], ["에게", "은"], ["가", "는"]], "cui + trecut 는데", "to whom + past 는데"),
  PP("이 가방___ 예쁜데 가격___ 너무 비싸요.", [["은", "이"], ["을", "을"], ["은", "을"], ["에", "이"]], "temă + subiect", "topic + subject"),
  PP("저___ 학생___데 할인돼요?", [["는", "인"], ["를", "인"], ["는", "이는"], ["가", "은"]], "temă + 이다 → 인데", "topic + 이다 → 인데"),
 ],
 "conjug": [
  C("바쁘다 → sunt ocupat, dar... (-(으)ㄴ데)", "바쁘다 → I'm busy, but... (-(으)ㄴ데)", ["바쁜데", "바쁘는데", "바빠는데", "바쁜는데"]),
  C("먹다 → mănânc, iar... (-는데)", "먹다 → I'm eating, and... (-는데)", ["먹는데", "먹은데", "먹을데", "먹던는데"]),
  C("춥다 → e frig, dar... (ㅂ neregulat)", "춥다 → it's cold, but... (ㅂ-irregular)", ["추운데", "춥은데", "춥는데", "추워는데"]),
 ],
 "puzzle": [
  Z(["저는", "커피를", "좋아하는데", "동생은", "차를", "좋아해요."], "Mie îmi place cafeaua, dar fratelui meu îi place ceaiul.", "I like coffee, but my sibling likes tea."),
  Z(["내일", "시간이", "있는데", "같이", "영화", "볼래요?"], "Mâine am timp — vrei să vedem un film împreună?", "I'm free tomorrow — want to watch a movie together?"),
  Z(["문을", "두드렸는데", "아무도", "없었어요."], "Am bătut la ușă, dar nu era nimeni.", "I knocked on the door, but nobody was there."),
 ],
 "chain": [
  CH(["저기요, 길 좀 물어볼게요.", "네, 말씀하세요.", "시청에 가고 싶은데 어떻게 가요?", "저 사거리에서 오른쪽으로 가세요."],
     "Cerând indicații pe stradă", "Asking for directions"),
  CH(["어제 백화점에 갔어요.", "뭐 샀어요?", "마음에 드는 옷이 있었는데 너무 비쌌어요.", "그래서 아무것도 안 샀어요."],
     "Cumpărături nereușite", "An unsuccessful shopping trip"),
  CH(["이번 주 토요일에 시간 있어요?", "네, 있는데 왜요?", "친구 생일 파티가 있는데 같이 갈래요?", "좋아요. 같이 가요."],
     "O invitație la petrecere", "A party invitation"),
 ],
}

L["T3-16"] = {
 "ko-ro": [
  KR("집에 오자마자 잤어요.",
     ["Cum am ajuns acasă, am adormit.", "Am dormit înainte să vin acasă.", "N-am dormit deloc acasă.", "Voi dormi când ajung acasă."],
     ["I fell asleep as soon as I got home.", "I slept before coming home.", "I didn't sleep at home at all.", "I'll sleep when I get home."]),
  KR("수업이 끝나자마자 친구를 만났어요.",
     ["Imediat ce s-a terminat ora, m-am întâlnit cu un prieten.", "Înainte de oră, m-am întâlnit cu un prieten.", "Ora nu s-a terminat încă.", "Prietenul meu a venit la oră."],
     ["As soon as class ended, I met a friend.", "I met a friend before class.", "Class hasn't ended yet.", "My friend came to class."]),
  KR("그 소식을 듣자마자 울기 시작했어요.",
     ["De îndată ce a auzit vestea, a început să plângă.", "A plâns înainte să audă vestea.", "N-a auzit niciodată vestea.", "A râs când a auzit vestea."],
     ["As soon as they heard the news, they started crying.", "They cried before hearing the news.", "They never heard the news.", "They laughed when they heard the news."]),
 ],
 "ro-ko": [
  RK("Imediat ce m-am trezit, am băut apă.", "As soon as I woke up, I drank water.",
     ["일어나자마자 물을 마셨어요.", "일어나기 전에 물을 마셨어요.", "일어나면서 물을 마셨어요.", "일어나서 물을 안 마셨어요."]),
  RK("Cum ajung la aeroport, te sun.", "As soon as I arrive at the airport, I'll call you.",
     ["공항에 도착하자마자 전화할게요.", "공항에 도착하기 전에 전화할게요.", "공항에 도착하면서 전화했어요.", "공항에 도착한 적이 있어요."]),
  RK("De îndată ce a început filmul, a adormit.", "As soon as the movie started, they fell asleep.",
     ["영화가 시작되자마자 잠이 들었어요.", "영화가 끝나자마자 잠이 들었어요.", "영화가 시작되기 전에 잠이 들었어요.", "영화를 보면서 잠을 안 잤어요."]),
 ],
 "particle": [
  P("집에 도착하___마자 샤워했어요.", ["자", "고", "면", "서"], "-자마자 = imediat ce", "-자마자 = as soon as"),
  P("문을 열자___ 고양이가 나갔어요.", ["마자", "면서", "서", "고"], "-자 + 마자", "-자 + 마자"),
  P("월급을 받___마자 다 썼어요.", ["자", "은", "고", "아"], "rădăcina verbului + 자마자", "verb stem + 자마자"),
 ],
 "particlePlus": [
  PP("회사___ 도착하자마자 커피___ 마셨어요.", [["에", "를"], ["를", "를"], ["에", "가"], ["에서", "에"]], "destinație + obiect", "destination + object"),
  PP("아이___ 엄마___ 보자마자 웃었어요.", [["가", "를"], ["를", "가"], ["가", "에게"], ["는", "가"]], "subiect + obiect", "subject + object"),
  PP("버스___ 내리자마자 비___ 오기 시작했어요.", [["에서", "가"], ["으로", "가"], ["에", "를"], ["에서", "를"]], "de unde + subiect", "from where + subject"),
 ],
 "conjug": [
  C("끝나다 → imediat ce se termină (-자마자)", "끝나다 → as soon as it ends (-자마자)", ["끝나자마자", "끝나마자", "끝나자마다", "끝난자마자"]),
  C("듣다 → imediat ce aude (-자마자)", "듣다 → as soon as one hears (-자마자)", ["듣자마자", "들자마자", "들으자마자", "듣으마자"]),
  C("먹다 → imediat ce mănâncă (-자마자)", "먹다 → as soon as one eats (-자마자)", ["먹자마자", "먹으자마자", "먹어자마자", "먹자마다"]),
 ],
 "puzzle": [
  Z(["저는", "아침에", "일어나자마자", "휴대폰을", "봐요."], "Imediat ce mă trezesc dimineața, mă uit pe telefon.", "As soon as I wake up in the morning, I check my phone."),
  Z(["비행기가", "도착하자마자", "가족에게", "전화했어요."], "Imediat ce a aterizat avionul, mi-am sunat familia.", "As soon as the plane landed, I called my family."),
  Z(["그", "사람을", "보자마자", "사랑에", "빠졌어요."], "Cum l-am văzut, m-am îndrăgostit.", "I fell in love the moment I saw them."),
 ],
 "chain": [
  CH(["오늘 아침에 늦잠을 잤어요.", "일어나자마자 옷을 입고 나갔어요.", "그래도 버스를 놓쳤어요.", "결국 회사에 늦게 도착했어요."],
     "O dimineață grăbită", "A rushed morning"),
  CH(["새 휴대폰을 샀어요?", "네, 어제 샀는데 벌써 고장 났어요.", "정말요? 사자마자요?", "네, 그래서 오늘 바꾸러 가요."],
     "Un telefon nou, deja stricat", "A new phone, already broken"),
  CH(["한국에 도착하면 연락해요.", "네, 공항에 도착하자마자 전화할게요.", "조심해서 가요.", "고마워요. 다녀올게요."],
     "Rămas-bun înainte de călătorie", "Saying goodbye before a trip"),
 ],
}

L["T4-14"] = {
 "ko-ro": [
  KR("어제 말했잖아요.",
     ["Doar ți-am spus ieri.", "Nu ți-am spus nimic ieri.", "Îți spun mâine.", "Ce mi-ai spus ieri?"],
     ["I told you yesterday, remember?", "I didn't tell you anything yesterday.", "I'll tell you tomorrow.", "What did you tell me yesterday?"]),
  KR("주말이잖아요. 좀 쉬세요.",
     ["Păi e weekend. Odihnește-te puțin.", "E zi lucrătoare, muncește.", "Weekendul s-a terminat.", "Nu mă pot odihni în weekend."],
     ["It's the weekend, you know. Get some rest.", "It's a workday, get to work.", "The weekend is over.", "I can't rest on weekends."]),
  KR("그 식당은 항상 사람이 많잖아요.",
     ["Știi că la restaurantul acela e mereu lume multă.", "Restaurantul acela e mereu gol.", "Mergem la restaurantul acela?", "Restaurantul acela s-a închis."],
     ["You know that restaurant is always crowded.", "That restaurant is always empty.", "Shall we go to that restaurant?", "That restaurant has closed."]),
 ],
 "ro-ko": [
  RK("Doar știi că nu beau cafea.", "You know I don't drink coffee.",
     ["제가 커피를 안 마시잖아요.", "제가 커피를 안 마실까요?", "제가 커피를 마시고 싶어요.", "제가 커피를 안 마셨네요."]),
  RK("Păi azi e ziua ta!", "Today's your birthday, you know!",
     ["오늘 생일이잖아요!", "오늘 생일이에요?", "오늘 생일일 거예요.", "오늘 생일이 아니에요."]),
  RK("Doar am mai fost acolo împreună.", "We've been there together before, remember?",
     ["거기 같이 가 봤잖아요.", "거기 같이 가 볼까요?", "거기 같이 가고 싶어요.", "거기 같이 안 갔어요."]),
 ],
 "particle": [
  P("밖에 비가 오___. 우산 가져가세요.", ["잖아요", "을까요", "으세요", "으면"], "-잖아요 = păi știi că", "-잖아요 = you know"),
  P("제가 학생이___. 돈이 없어요.", ["잖아요", "에요?", "세요", "고"], "이다 + 잖아요", "이다 + 잖아요"),
  P("이미 다 끝났___.", ["잖아요", "을까요", "으세요", "으려고요"], "trecut + 잖아요", "past + 잖아요"),
 ],
 "particlePlus": [
  PP("민수 씨___ 원래 매운 음식___ 못 먹잖아요.", [["는", "을"], ["를", "을"], ["는", "이"], ["에", "를"]], "temă + obiect", "topic + object"),
  PP("지난번___ 제가 그 얘기___ 했잖아요.", [["에", "를"], ["을", "를"], ["에", "가"], ["에서", "에"]], "timp + obiect", "time + object"),
  PP("여기___ 서울___ 제일 큰 시장이잖아요.", [["는", "에서"], ["를", "에서"], ["는", "을"], ["에", "의"]], "temă + în ce loc", "topic + within where"),
 ],
 "conjug": [
  C("알다 → doar știi (-잖아요)", "알다 → you know (-잖아요)", ["알잖아요", "아잖아요", "알으잖아요", "안잖아요"]),
  C("바쁘다 → păi am fost ocupat (trecut + -잖아요)", "바쁘다 → I was busy, you know (past + -잖아요)", ["바빴잖아요", "바쁘었잖아요", "바빠잖아요", "바빴자나요"]),
  C("학생이다 → păi e student (-잖아요)", "학생이다 → they're a student, you know (-잖아요)", ["학생이잖아요", "학생잖아요", "학생이자나요", "학생이아잖아요"]),
 ],
 "puzzle": [
  Z(["내일", "시험이", "있잖아요.", "일찍", "자요."], "Doar ai examen mâine. Culcă-te devreme.", "You have an exam tomorrow, you know. Go to bed early."),
  Z(["제가", "아까", "말했잖아요."], "Doar ți-am spus mai devreme.", "I told you earlier, remember?"),
  Z(["한국", "겨울은", "원래", "춥잖아요."], "Știi că iarna în Coreea e mereu friguroasă.", "You know Korean winters are always cold."),
 ],
 "chain": [
  CH(["왜 이렇게 늦게 왔어요?", "미안해요. 길이 너무 막혔어요.", "그러니까 일찍 출발하라고 했잖아요.", "다음에는 꼭 일찍 출발할게요."],
     "Reproș pentru întârziere", "A reproach for being late"),
  CH(["이 케이크 먹어도 돼요?", "안 돼요. 다이어트 중이잖아요.", "한 조각만 먹을게요.", "그래요. 딱 한 조각만이에요."],
     "Tentația de la dietă", "Diet temptation"),
  CH(["우산 가져가세요.", "왜요? 지금 날씨 좋잖아요.", "오후에 비가 온대요.", "아, 그럼 가져갈게요."],
     "Despre umbrelă", "About an umbrella"),
 ],
}

L["T4-15"] = {
 "ko-ro": [
  KR("시장에 가는 김에 과일도 사 올게요.",
     ["Dacă tot merg la piață, cumpăr și fructe.", "Merg la piață doar pentru fructe.", "Azi nu merg la piață.", "Ai cumpărat fructe de la piață?"],
     ["Since I'm going to the market, I'll buy some fruit too.", "I'm going to the market only for fruit.", "I'm not going to the market today.", "Did you buy fruit at the market?"]),
  KR("말 나온 김에 다음 주 계획도 정해요.",
     ["Dacă tot a venit vorba, hai să stabilim și planul de săptămâna viitoare.", "Nu vorbim despre săptămâna viitoare.", "Am stabilit deja planul.", "De ce n-ai spus nimic?"],
     ["Speaking of which, let's also settle next week's plan.", "We're not talking about next week.", "We've already settled the plan.", "Why didn't you say anything?"]),
  KR("부산에 출장 간 김에 바다도 봤어요.",
     ["Dacă tot am fost în delegație la Busan, am văzut și marea.", "Am mers la Busan doar ca să văd marea.", "N-am fost niciodată la Busan.", "Voi merge la Busan în vacanță."],
     ["Since I was in Busan on business, I also saw the sea.", "I went to Busan just to see the sea.", "I've never been to Busan.", "I'll go to Busan on vacation."]),
 ],
 "ro-ko": [
  RK("Dacă tot te-ai ridicat, adu-mi și mie apă.", "Since you're up, bring me some water.",
     ["일어난 김에 물 좀 갖다 주세요.", "일어나기 전에 물 좀 갖다 주세요.", "일어나자마자 물을 마셨어요.", "일어나서 물을 안 마셔요."]),
  RK("Dacă tot fac curat, spăl și rufele.", "While I'm cleaning, I'll do the laundry too.",
     ["청소하는 김에 빨래도 할게요.", "청소한 후에 빨래를 했어요.", "청소하면서 빨래를 안 해요.", "청소하기 때문에 빨래를 해요."]),
  RK("Apropo, dacă tot a venit vorba, când e nunta ta?", "Speaking of which, when is your wedding?",
     ["말 나온 김에, 결혼식이 언제예요?", "말하기 전에, 결혼식이 언제예요?", "말 나오면, 결혼식이 언제였어요?", "말하자마자 결혼식이 끝났어요."]),
 ],
 "particle": [
  P("편의점에 가___ 김에 라면도 사 왔어요.", ["는", "은", "을", "던"], "verb (prezent) + 는 김에", "verb (present) + 는 김에"),
  P("서울에 온 ___에 친구도 만났어요.", ["김", "체", "때", "척"], "-(으)ㄴ 김에 = dacă tot", "-(으)ㄴ 김에 = while at it"),
  P("말 나___ 김에 솔직하게 말할게요.", ["온", "는", "올", "을"], "말 나온 김에 = apropo", "말 나온 김에 = speaking of which"),
 ],
 "particlePlus": [
  PP("은행___ 가는 김에 우체국___ 들를게요.", [["에", "에도"], ["을", "을"], ["에", "에서"], ["에서", "에도"]], "destinație + și (încă un loc)", "destination + also (another place)"),
  PP("얘기___ 나온 김에 여행 계획___ 세워요.", [["가", "도"], ["를", "도"], ["가", "에"], ["에", "가"]], "subiect + și", "subject + also"),
  PP("커피___ 만드는 김에 제 것___ 만들어 주세요.", [["를", "도"], ["가", "도"], ["를", "에"], ["에", "를"]], "obiect + și", "object + also"),
 ],
 "conjug": [
  C("가다 → dacă tot merg (prezent, -는 김에)", "가다 → while I'm going (present, -는 김에)", ["가는 김에", "간 김에", "갈 김에", "가던 김에"]),
  C("오다 → dacă tot am venit (trecut, -(으)ㄴ 김에)", "오다 → since I came (past, -(으)ㄴ 김에)", ["온 김에", "오는 김에", "올 김에", "왔는 김에"]),
  C("만들다 → dacă tot fac (prezent, ㄹ cade)", "만들다 → while I'm making (present, ㄹ drops)", ["만드는 김에", "만들는 김에", "만들 김에", "만들은 김에"]),
 ],
 "puzzle": [
  Z(["우체국에", "가는", "김에", "편지도", "부쳤어요."], "Dacă tot mergeam la poștă, am trimis și o scrisoare.", "Since I was going to the post office, I also mailed a letter."),
  Z(["말", "나온", "김에", "하나", "물어볼게요."], "Dacă tot a venit vorba, te întreb ceva.", "Since it came up, let me ask you something."),
  Z(["한국에", "온", "김에", "한복도", "입어", "봤어요."], "Dacă tot am venit în Coreea, am încercat și un hanbok.", "Since I came to Korea, I also tried on a hanbok."),
 ],
 "chain": [
  CH(["나 지금 편의점에 가.", "그래? 가는 김에 우유 좀 사다 줄래?", "알았어. 다른 건 필요 없어?", "음, 말 나온 김에 과자도 하나 사 줘."],
     "Rugăminte între prieteni (banmal)", "A favor between friends (banmal)"),
  CH(["다음 주에 제주도로 출장 가요.", "좋겠네요! 간 김에 여행도 하세요.", "네, 이틀 더 있을까 해요.", "그럼 한라산도 꼭 올라가 보세요."],
     "O delegație la Jeju", "A business trip to Jeju"),
  CH(["요즘 운동 안 했죠?", "네, 바빠서 못 했어요.", "말 나온 김에 내일부터 같이 운동해요.", "좋아요. 아침 일곱 시에 만나요."],
     "O hotărâre luată din vorbă în vorbă", "A decision made on the spot"),
 ],
}

L["T5-14"] = {
 "ko-ro": [
  KR("비가 오는 데다가 바람도 불어요.",
     ["Pe lângă că plouă, mai bate și vântul.", "Plouă, dar nu bate vântul.", "Nu plouă și nu bate vântul.", "Bate vântul pentru că plouă."],
     ["On top of the rain, it's windy too.", "It's raining, but it isn't windy.", "It's neither raining nor windy.", "It's windy because it's raining."]),
  KR("그 식당은 맛있는 데다가 가격도 싸요.",
     ["Restaurantul acela, pe lângă că e gustos, e și ieftin.", "Restaurantul acela e gustos, dar scump.", "Restaurantul acela nu e nici gustos, nici ieftin.", "Restaurantul acela e ieftin pentru că nu e gustos."],
     ["That restaurant is tasty and cheap on top of that.", "That restaurant is tasty but expensive.", "That restaurant is neither tasty nor cheap.", "That restaurant is cheap because it isn't tasty."]),
  KR("늦게 일어난 데다가 길도 막혀서 지각했어요.",
     ["Pe lângă că m-am trezit târziu, a mai fost și trafic, așa că am întârziat.", "M-am trezit devreme și am ajuns la timp.", "Am întârziat doar din cauza traficului.", "N-a fost trafic, dar am întârziat."],
     ["I woke up late and on top of that there was traffic, so I was late.", "I woke up early and arrived on time.", "I was late only because of traffic.", "There was no traffic, but I was late."]),
 ],
 "ro-ko": [
  RK("Pe lângă că e ocupat, e și obosit.", "On top of being busy, he's tired too.",
     ["바쁜 데다가 피곤하기도 해요.", "바쁘지만 피곤하지 않아요.", "바빠서 피곤하지 않아요.", "바쁘면 피곤해요."]),
  RK("Apartamentul e mic și, pe deasupra, scump.", "The apartment is small and expensive on top of that.",
     ["집이 작은 데다가 비싸요.", "집이 작지만 싸요.", "집이 작아서 싸요.", "집이 작으면 비싸요."]),
  RK("Pe lângă că a muncit toată ziua, n-a apucat nici să mănânce.", "On top of working all day, they couldn't even eat.",
     ["하루 종일 일한 데다가 밥도 못 먹었어요.", "하루 종일 일하고 밥을 많이 먹었어요.", "하루 종일 일하기 전에 밥을 먹었어요.", "하루 종일 일해서 밥을 먹었어요."]),
 ],
 "particle": [
  P("그 사람은 친절한 데다___ 똑똑해요.", ["가", "서", "는", "도"], "-(으)ㄴ/는 데다가 = pe lângă asta", "-(으)ㄴ/는 데다가 = on top of"),
  P("날씨가 추운 ___다가 눈까지 와요.", ["데", "때", "김", "척"], "데 + 다가", "데 + 다가"),
  P("이 노트북은 가벼___ 데다가 배터리도 오래가요.", ["운", "은", "는", "워"], "가볍다: ㅂ neregulat", "가볍다: ㅂ-irregular"),
 ],
 "particlePlus": [
  PP("숙제___ 많은 데다가 시험___ 있어요.", [["가", "도"], ["를", "도"], ["가", "을"], ["는", "를"]], "subiect + și", "subject + also"),
  PP("이 옷은 색깔___ 예쁜 데다가 값___ 싸요.", [["이", "도"], ["을", "도"], ["이", "을"], ["에", "이"]], "subiect + și", "subject + also"),
  PP("길___ 막힌 데다가 비___ 와서 늦었어요.", [["이", "까지"], ["을", "까지"], ["이", "를"], ["에", "가"]], "subiect + chiar și", "subject + even"),
 ],
 "conjug": [
  C("싸다 → pe lângă că e ieftin (-(으)ㄴ 데다가)", "싸다 → on top of being cheap (-(으)ㄴ 데다가)", ["싼 데다가", "싸는 데다가", "쌀 데다가", "싸은 데다가"]),
  C("공부하다 → pe lângă că învață (prezent, -는 데다가)", "공부하다 → on top of studying (present, -는 데다가)", ["공부하는 데다가", "공부하은 데다가", "공부할 데다가", "공부하던 데다가"]),
  C("덥다 → pe lângă că e cald (ㅂ neregulat)", "덥다 → on top of being hot (ㅂ-irregular)", ["더운 데다가", "덥은 데다가", "덥는 데다가", "더워 데다가"]),
 ],
 "puzzle": [
  Z(["이", "카페는", "조용한", "데다가", "커피도", "맛있어요."], "Cafeneaua asta, pe lângă că e liniștită, are și cafea bună.", "This café is quiet, and the coffee is good too."),
  Z(["감기에", "걸린", "데다가", "일도", "많아요."], "Pe lângă că am răcit, am și mult de lucru.", "On top of having a cold, I have lots of work."),
  Z(["그", "배우는", "연기를", "잘하는", "데다가", "노래도", "잘해요."], "Actorul acela, pe lângă că joacă bine, mai și cântă bine.", "That actor acts well and sings well too."),
 ],
 "chain": [
  CH(["새 아파트 어때요?", "아주 좋아요. 넓은 데다가 깨끗해요.", "교통은 어때요?", "역에서 가까운 데다가 버스도 많아요."],
     "Despre apartamentul nou", "About the new apartment"),
  CH(["오늘 왜 이렇게 기분이 안 좋아요?", "늦잠을 잔 데다가 지갑까지 잃어버렸어요.", "정말 힘든 하루였네요.", "네, 빨리 집에 가고 싶어요."],
     "O zi cu ghinion", "An unlucky day"),
  CH(["이 노트북 살 거예요?", "네, 가벼운 데다가 배터리도 오래가요.", "가격은 어때요?", "좀 비싸지만 할인을 받을 수 있어요."],
     "Alegerea unui laptop", "Choosing a laptop"),
 ],
}

L["T5-15"] = {
 "ko-ro": [
  KR("지금 가 봤자 버스는 이미 떠났을 거예요.",
     ["Chiar dacă mergi acum, autobuzul a plecat probabil deja.", "Dacă mergi acum, prinzi autobuzul.", "Autobuzul vine acum.", "Hai să mergem cu autobuzul."],
     ["Even if you go now, the bus will have already left.", "If you go now, you'll catch the bus.", "The bus is coming now.", "Let's take the bus."]),
  KR("후회해 봤자 소용없어요.",
     ["Degeaba regreți, nu mai folosește la nimic.", "Regretul te ajută mult.", "Nu regret nimic.", "Trebuie să regreți."],
     ["There's no use regretting it.", "Regret helps a lot.", "I regret nothing.", "You should regret it."]),
  KR("그 사람한테 말해 봤자 안 들을 거예요.",
     ["Oricât i-ai spune, n-o să asculte.", "Dacă îi spui, o să asculte.", "Nu i-am spus nimic.", "El ascultă mereu."],
     ["Even if you tell them, they won't listen.", "If you tell them, they'll listen.", "I didn't tell them anything.", "They always listen."]),
 ],
 "ro-ko": [
  RK("Oricât te-ai grăbi, tot n-ajungi la timp.", "No matter how much you hurry, you won't make it on time.",
     ["서둘러 봤자 제시간에 못 가요.", "서두르면 제시간에 갈 수 있어요.", "서둘러서 제시간에 갔어요.", "서두르지 마세요."]),
  RK("Oricât de scump ar fi, e maximum 10.000 de woni.", "Even if it's expensive, it's 10,000 won at most.",
     ["비싸 봤자 만 원이에요.", "비싸서 만 원이에요.", "비싸면 만 원이 아니에요.", "비싸지만 만 원 이상이에요."]),
  RK("Degeaba plângi acum.", "There's no point crying now.",
     ["지금 울어 봤자 소용없어요.", "지금 울어야 해요.", "지금 울면 좋겠어요.", "지금 울고 있어요."]),
 ],
 "particle": [
  P("기다려 ___자 안 올 거예요.", ["봤", "보", "봐", "볼"], "-아/어 봤자 = degeaba / oricât", "-아/어 봤자 = no use / even if"),
  P("지금 공부해 봤___ 늦었어요.", ["자", "지", "서", "고"], "봤 + 자", "봤 + 자"),
  P("아무리 말해 봤자 소용___어요.", ["없", "있", "않", "했"], "소용없다 = nu folosește", "소용없다 = it's no use"),
 ],
 "particlePlus": [
  PP("지금 택시___ 타 봤자 길___ 막혀요.", [["를", "이"], ["가", "이"], ["를", "을"], ["에", "가"]], "obiect + subiect", "object + subject"),
  PP("그 사람___ 부탁해 봤자 아무것___ 안 해 줄 거예요.", [["한테", "도"], ["을", "도"], ["한테", "를"], ["가", "만"]], "cui + nimic (도)", "to whom + nothing (도)"),
  PP("돈___ 많아 봤자 건강___ 없으면 소용없어요.", [["이", "이"], ["을", "이"], ["이", "을"], ["은", "를"]], "subiect + subiect", "subject + subject"),
 ],
 "conjug": [
  C("먹다 → oricât ai mânca (-아/어 봤자)", "먹다 → even if you eat (-아/어 봤자)", ["먹어 봤자", "먹아 봤자", "먹고 봤자", "먹어 보자"]),
  C("하다 → oricât ai face (-아/어 봤자)", "하다 → even if you do (-아/어 봤자)", ["해 봤자", "하 봤자", "해 보자", "하고 봤자"]),
  C("작다 → oricât de mic ar fi (-아/어 봤자)", "작다 → however small it is (-아/어 봤자)", ["작아 봤자", "작어 봤자", "작은 봤자", "작아 보자"]),
 ],
 "puzzle": [
  Z(["지금", "후회해", "봤자", "소용없어요."], "Degeaba regreți acum.", "There's no use regretting it now."),
  Z(["아무리", "비싸", "봤자", "십만", "원이에요."], "Oricât de scump ar fi, e maximum 100.000 de woni.", "However expensive it is, it's 100,000 won at most."),
  Z(["혼자", "고민해", "봤자", "답이", "안", "나와요."], "Degeaba te frămânți singur, nu găsești răspunsul.", "Worrying alone won't get you an answer."),
 ],
 "chain": [
  CH(["벌써 아홉 시예요! 빨리 가요.", "지금 가 봤자 영화는 이미 시작했을 거예요.", "그럼 다음 영화를 볼까요?", "좋아요. 표를 다시 사요."],
     "Întârziere la film", "Late for the movie"),
  CH(["시험을 망쳤어요. 너무 속상해요.", "이제 걱정해 봤자 소용없어요.", "그래도 계속 생각나요.", "다음 시험을 열심히 준비하면 돼요."],
     "Consolare după un examen ratat", "Comfort after a failed exam"),
  CH(["그 가방 비싸지 않아요?", "비싸 봤자 얼마나 비싸겠어요?", "오십만 원이래요.", "와, 생각보다 훨씬 비싸네요."],
     "Despre o geantă scumpă", "About an expensive bag"),
 ],
}

L["T6-19"] = {
 "ko-ro": [
  KR("외국인치고 한국어를 정말 잘하네요.",
     ["Pentru un străin, vorbește coreeana foarte bine.", "Ca toți străinii, vorbește coreeana prost.", "Străinii nu vorbesc coreeana.", "Vorbește coreeana pentru că e coreean."],
     ["For a foreigner, they speak Korean really well.", "Like all foreigners, they speak Korean poorly.", "Foreigners don't speak Korean.", "They speak Korean because they're Korean."]),
  KR("겨울치고 날씨가 따뜻해요.",
     ["Pentru o zi de iarnă, e destul de cald.", "E frig, cum e normal iarna.", "Iarna e mereu caldă.", "La iarnă va fi cald."],
     ["It's warm for winter.", "It's cold, as usual in winter.", "Winter is always warm.", "It will be warm in winter."]),
  KR("한국 사람치고 김치를 안 먹는 사람은 없어요.",
     ["Nu există coreean care să nu mănânce kimchi.", "Mulți coreeni nu mănâncă kimchi.", "Doar unii coreeni mănâncă kimchi.", "Coreenii nu mai mănâncă kimchi."],
     ["There's no Korean who doesn't eat kimchi.", "Many Koreans don't eat kimchi.", "Only some Koreans eat kimchi.", "Koreans don't eat kimchi anymore."]),
 ],
 "ro-ko": [
  RK("Pentru un începător, gătește foarte bine.", "For a beginner, they cook really well.",
     ["초보자치고 요리를 아주 잘해요.", "초보자라서 요리를 못해요.", "초보자처럼 요리를 해요.", "초보자니까 요리를 잘해요."]),
  RK("Pentru un copil, e foarte matur.", "For a child, they're very mature.",
     ["아이치고 아주 어른스러워요.", "아이라서 어른스럽지 않아요.", "아이처럼 행동해요.", "아이니까 어른스러워요."]),
  RK("Nu există student căruia să-i placă examenele.", "There's no student who likes exams.",
     ["학생치고 시험을 좋아하는 사람은 없어요.", "학생이라서 시험을 좋아해요.", "학생처럼 시험을 좋아해요.", "학생만 시험을 좋아해요."]),
 ],
 "particle": [
  P("그 가격___ 품질이 좋아요.", ["치고", "까지", "마다", "부터"], "N + 치고 = pentru un/o...", "N + 치고 = for a..."),
  P("처음 하는 것___ 정말 잘했어요.", ["치고는", "마다", "부터", "까지"], "치고는 = pentru (prima dată)", "치고는 = for (a first time)"),
  P("아기___ 정말 조용하네요.", ["치고", "마다", "부터", "까지"], "excepție de la ce te-ai aștepta", "exception to what you'd expect"),
 ],
 "particlePlus": [
  PP("봄___ 날씨___ 너무 추워요.", [["치고", "가"], ["처럼", "가"], ["치고", "를"], ["마다", "를"]], "excepție + subiect", "exception + subject"),
  PP("이 식당은 학교 식당___ 음식___ 맛있어요.", [["치고", "이"], ["처럼", "을"], ["치고", "을"], ["부터", "이"]], "excepție + subiect", "exception + subject"),
  PP("그 사람은 신입 사원___ 일___ 아주 잘해요.", [["치고", "을"], ["부터", "을"], ["치고", "이"], ["마다", "가"]], "excepție + obiect", "exception + object"),
 ],
 "conjug": [
  C("외국인 + 치고 → pentru un străin", "외국인 + 치고 → for a foreigner", ["외국인치고", "외국인이치고", "외국인처럼", "외국인치고서"]),
  C("여름 + 치고는 → pentru o zi de vară", "여름 + 치고는 → for summer", ["여름치고는", "여름이치고는", "여름처럼은", "여름치는"]),
  C("부모 + 치고 → nu există părinte care...", "부모 + 치고 → there's no parent who...", ["부모치고", "부모이치고", "부모처럼", "부모마다치고"]),
 ],
 "puzzle": [
  Z(["외국인치고", "한국어", "발음이", "정말", "좋아요."], "Pentru un străin, are o pronunție coreeană foarte bună.", "For a foreigner, their Korean pronunciation is really good."),
  Z(["처음", "만든", "것치고는", "정말", "맛있어요."], "Pentru prima încercare, e chiar gustos.", "For a first try, it's really tasty."),
  Z(["부모치고", "자식", "걱정을", "안", "하는", "사람은", "없어요."], "Nu există părinte care să nu-și facă griji pentru copii.", "There's no parent who doesn't worry about their children."),
 ],
 "chain": [
  CH(["이 케이크 직접 만들었어요?", "네, 처음 만들어 봤어요.", "처음 만든 것치고는 정말 맛있네요.", "고마워요. 다음에 또 만들어 줄게요."],
     "Prima prăjitură", "A first cake"),
  CH(["제 친구는 한국에 온 지 일 년 됐어요.", "그런데 한국어를 정말 잘해요.", "외국인치고 발음도 아주 좋아요.", "정말 열심히 공부했나 봐요."],
     "Despre un prieten străin în Coreea", "About a foreign friend in Korea"),
 ],
}

L["T6-20"] = {
 "ko-ro": [
  KR("운동도 할 겸 친구도 만날 겸 공원에 갔어요.",
     ["Am mers în parc ca să fac sport și totodată să mă văd cu un prieten.", "Am mers în parc doar ca să fac sport.", "Nu m-am văzut cu prietenul.", "Am făcut sport acasă."],
     ["I went to the park both to exercise and to meet a friend.", "I went to the park only to exercise.", "I didn't meet my friend.", "I exercised at home."]),
  KR("바람도 쐴 겸 잠깐 나갔다 올게요.",
     ["Ies puțin, și ca să iau aer.", "Nu ies nicăieri.", "Am ieșit ieri.", "Ies pentru că plouă."],
     ["I'll step out for a bit, partly to get some fresh air.", "I'm not going anywhere.", "I went out yesterday.", "I'm going out because it's raining."]),
  KR("한국어 연습도 할 겸 한국 드라마를 봐요.",
     ["Mă uit la seriale coreene, și ca să exersez coreeana.", "Mă uit la seriale doar ca să mă distrez.", "Nu mă uit la seriale coreene.", "Exersez coreeana în loc să mă uit la seriale."],
     ["I watch Korean dramas, partly to practice Korean.", "I watch dramas just for fun.", "I don't watch Korean dramas.", "I practice Korean instead of watching dramas."]),
 ],
 "ro-ko": [
  RK("Am mers la cafenea și ca să lucrez, și ca să beau o cafea.", "I went to the café both to work and to have coffee.",
     ["일도 할 겸 커피도 마실 겸 카페에 갔어요.", "일을 해서 커피를 마셨어요.", "커피를 마시자마자 일을 했어요.", "일하는 동안 커피를 안 마셨어요."]),
  RK("Am mers la Busan, și ca să mă odihnesc, și ca să-mi văd părinții.", "I went to Busan both to rest and to see my parents.",
     ["쉴 겸 부모님도 뵐 겸 부산에 갔어요.", "쉬려고 부모님을 안 뵀어요.", "부산에 가서 쉬지 못했어요.", "부모님을 뵙기 전에 쉬었어요."]),
  RK("Ne plimbăm puțin, și ca să digerăm?", "Shall we take a walk, partly to help digestion?",
     ["소화도 시킬 겸 산책할까요?", "소화가 안 돼서 산책 못 해요.", "산책하자마자 소화가 됐어요.", "소화하면서 산책을 했어요."]),
 ],
 "particle": [
  P("책도 읽___ 겸 도서관에 갔어요.", ["을", "는", "은", "던"], "-(으)ㄹ 겸 = totodată pentru", "-(으)ㄹ 겸 = also in order to"),
  P("구경도 할 ___ 쇼핑도 할 겸 명동에 가요.", ["겸", "김", "때", "척"], "V-(으)ㄹ 겸 V-(으)ㄹ 겸", "V-(으)ㄹ 겸 V-(으)ㄹ 겸"),
  P("기분 전환도 할 ___ 머리를 잘랐어요.", ["겸", "뻔", "리", "수록"], "scop dublu", "double purpose"),
 ],
 "particlePlus": [
  PP("운동___ 할 겸 산책___ 할 겸 밖에 나갔어요.", [["도", "도"], ["가", "을"], ["도", "가"], ["이", "에"]], "도 … 도 = și … și", "도 … 도 = both … and"),
  PP("점심___ 먹을 겸 회의___ 할 겸 만나요.", [["도", "도"], ["가", "가"], ["도", "에"], ["에", "를"]], "도 … 도 = și … și", "도 … 도 = both … and"),
  PP("공부 겸 여행___ 일본___ 갔어요.", [["으로", "에"], ["을", "에"], ["으로", "를"], ["이", "에서"]], "N 겸 N + (으)로 + destinație", "N 겸 N + (으)로 + destination"),
 ],
 "conjug": [
  C("보다 → și ca să văd (-(으)ㄹ 겸)", "보다 → also to see (-(으)ㄹ 겸)", ["볼 겸", "보을 겸", "본 겸", "보는 겸"]),
  C("먹다 → și ca să mănânc (-(으)ㄹ 겸)", "먹다 → also to eat (-(으)ㄹ 겸)", ["먹을 겸", "먹 겸", "먹는 겸", "먹은 겸"]),
  C("듣다 → și ca să ascult (ㄷ neregulat)", "듣다 → also to listen (ㄷ-irregular)", ["들을 겸", "듣을 겸", "들 겸", "듣는 겸"]),
 ],
 "puzzle": [
  Z(["바람도", "쐴", "겸", "한강에", "갔어요."], "Am mers la râul Han, și ca să iau aer.", "I went to the Han River, partly to get some fresh air."),
  Z(["친구도", "만날", "겸", "시내에", "나갔어요."], "Am ieșit în oraș, și ca să mă văd cu un prieten.", "I went downtown, partly to meet a friend."),
  Z(["한국어", "공부도", "할", "겸", "한국", "노래를", "들어요."], "Ascult muzică coreeană, și ca să învăț coreeana.", "I listen to Korean songs, partly to study Korean."),
 ],
 "chain": [
  CH(["주말에 뭐 했어요?", "등산을 갔어요.", "혼자요?", "아니요, 운동도 할 겸 친구들도 만날 겸 같이 갔어요."],
     "Despre o drumeție de weekend", "About a weekend hike"),
  CH(["점심 먹고 좀 걸을까요?", "좋아요. 소화도 시킬 겸 걸어요.", "공원까지 갈까요?", "네, 날씨도 좋으니까 공원까지 가요."],
     "O plimbare după prânz", "A walk after lunch"),
 ],
}

TOPIK = {"1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6}

def key(t, x):
    if t == "ko-ro": return x["q"]
    if t in ("ro-ko", "conjug"): return x["prompt"]["ro"] + "|" + x["correct"]
    if t in ("particle", "particlePlus"): return x["template"]
    return "|".join(x["correct"])

def validate(t, x, lid):
    if t == "ko-ro":
        assert x["correct"]["ro"] in x["answers"]["ro"] and x["correct"]["en"] in x["answers"]["en"], lid
        assert len(set(x["answers"]["ro"])) == len(x["answers"]["ro"]) == len(x["answers"]["en"]), lid
    elif t in ("ro-ko", "conjug", "particle"):
        assert x["correct"] in x["options"] and len(set(x["options"])) == len(x["options"]), (lid, t, x)
    elif t == "particlePlus":
        assert x["template"].count("___") == 2 and x["correct"] in x["options"], (lid, x)
        assert len({tuple(o) for o in x["options"]}) == len(x["options"]), (lid, x)
    if t == "particle":
        assert x["template"].count("___") == 1, (lid, x)
    if t in ("puzzle", "chain"):
        assert sorted(x["tiles"]) == sorted(x["correct"]) and len(set(x["tiles"])) == len(x["tiles"]), (lid, x)

def main():
    with open(PATH, encoding="utf-8") as f:
        data = json.load(f)
    added = 0
    for lid, types in L.items():
        topik = int(lid[1])
        for t, items in types.items():
            existing = {key(t, x) for x in data[t] if x.get("lessonId") == lid}
            for it in items:
                validate(t, it, lid)
                if key(t, it) in existing:
                    continue
                data[t].append({"lessonId": lid, "topik": topik, **it})
                added += 1
    with open(PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print("added", added)

if __name__ == "__main__":
    main()
