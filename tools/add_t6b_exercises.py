import json

with open('data/exercises.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

new_ko_ro = [
    # T6-09 ex3: 배운 만큼 더 잘할 수 있어요.
    {
        "lessonId": "T6-09", "topik": 6,
        "q": "배운 만큼 더 잘할 수 있어요.",
        "answers": {
            "ro": ["Cu cât înveți mai mult, cu atât poți face mai bine.", "Ai învățat tot ce trebuie.", "Nu merită să mai înveți.", "Oricum nu poți face mai bine."],
            "en": ["The more you learn, the better you can do.", "You have learned everything.", "It's not worth learning more.", "You can't do better anyway."]
        },
        "correct": {"ro": "Cu cât înveți mai mult, cu atât poți face mai bine.", "en": "The more you learn, the better you can do."}
    },
    # T6-09 ex4: 준비한 만큼 자신감이 생겨요.
    {
        "lessonId": "T6-09", "topik": 6,
        "q": "준비한 만큼 자신감이 생겨요.",
        "answers": {
            "ro": ["Pe măsură ce te pregătești, capătă încredere.", "Nu contează cât te pregătești.", "Pregătirea nu aduce încredere.", "Orice ai face, nu ai succes."],
            "en": ["The more you prepare, the more confidence you gain.", "Preparation doesn't matter.", "No matter how much you prepare, it's useless.", "You can't gain confidence."]
        },
        "correct": {"ro": "Pe măsură ce te pregătești, capătă încredere.", "en": "The more you prepare, the more confidence you gain."}
    },
    # T6-10 ex3: 참으려 했지만 결국 화를 내고 말았어요.
    {
        "lessonId": "T6-10", "topik": 6,
        "q": "참으려 했지만 결국 화를 내고 말았어요.",
        "answers": {
            "ro": ["Am încercat să mă abțin, dar până la urmă m-am supărat.", "M-am abținut cu succes și nu m-am supărat.", "Nu am vrut deloc să mă abțin.", "Nimeni nu s-a supărat."],
            "en": ["I tried to hold back, but ended up getting angry.", "I successfully held back and didn't get angry.", "I didn't want to hold back at all.", "Nobody got angry."]
        },
        "correct": {"ro": "Am încercat să mă abțin, dar până la urmă m-am supărat.", "en": "I tried to hold back, but ended up getting angry."}
    },
    # T6-10 ex4: 다이어트 중인데 케이크를 먹고 말았어요.
    {
        "lessonId": "T6-10", "topik": 6,
        "q": "다이어트 중인데 케이크를 먹고 말았어요.",
        "answers": {
            "ro": ["Sunt la dietă, dar am mâncat tort până la urmă.", "Dieta mea merge perfect.", "Nu mănânc niciodată tort.", "Am rezistat tentației tortului."],
            "en": ["I'm on a diet, but I ended up eating cake.", "My diet is going perfectly.", "I never eat cake.", "I resisted the temptation of cake."]
        },
        "correct": {"ro": "Sunt la dietă, dar am mâncat tort până la urmă.", "en": "I'm on a diet, but I ended up eating cake."}
    },
    # T6-11 ex3: 약속한 이상 반드시 지켜야 해요.
    {
        "lessonId": "T6-11", "topik": 6,
        "q": "약속한 이상 반드시 지켜야 해요.",
        "answers": {
            "ro": ["De vreme ce ai promis, trebuie neapărat să respecți.", "Nu e nevoie să respecți promisiunile.", "Promisiunile pot fi uitate.", "Este opțional să respecți promisiunile."],
            "en": ["Since you've promised, you must keep it.", "You don't need to keep promises.", "Promises can be forgotten.", "It's optional to keep promises."]
        },
        "correct": {"ro": "De vreme ce ai promis, trebuie neapărat să respecți.", "en": "Since you've promised, you must keep it."}
    },
    # T6-11 ex4: 선택한 이상 후회하지 마세요.
    {
        "lessonId": "T6-11", "topik": 6,
        "q": "선택한 이상 후회하지 마세요.",
        "answers": {
            "ro": ["De vreme ce ai ales, nu mai regreta.", "Regretul este întotdeauna util.", "Trebuie să regreți orice alegere.", "Nu ai ales nimic."],
            "en": ["Since you've chosen, don't regret it.", "Regret is always useful.", "You should regret every choice.", "You haven't chosen anything."]
        },
        "correct": {"ro": "De vreme ce ai ales, nu mai regreta.", "en": "Since you've chosen, don't regret it."}
    },
    # T6-12 ex3: 교통이 막히는 탓에 회사에 늦게 도착했어요.
    {
        "lessonId": "T6-12", "topik": 6,
        "q": "교통이 막히는 탓에 회사에 늦게 도착했어요.",
        "answers": {
            "ro": ["Din cauza traficului aglomerat, am ajuns târziu la birou.", "Am ajuns la timp la birou.", "Traficul a fost liber.", "Nu am mers la birou."],
            "en": ["Due to heavy traffic, I arrived late at the office.", "I arrived at the office on time.", "The traffic was clear.", "I didn't go to the office."]
        },
        "correct": {"ro": "Din cauza traficului aglomerat, am ajuns târziu la birou.", "en": "Due to heavy traffic, I arrived late at the office."}
    },
    # T6-12 ex4: 스트레스가 많은 탓에 건강이 나빠졌어요.
    {
        "lessonId": "T6-12", "topik": 6,
        "q": "스트레스가 많은 탓에 건강이 나빠졌어요.",
        "answers": {
            "ro": ["Din cauza stresului mare, sănătatea mi s-a deteriorat.", "Stresul m-a ajutat să fiu mai sănătos.", "Nu am avut deloc stres.", "Sănătatea mea este perfectă."],
            "en": ["Due to a lot of stress, my health deteriorated.", "Stress helped me become healthier.", "I had no stress at all.", "My health is perfect."]
        },
        "correct": {"ro": "Din cauza stresului mare, sănătatea mi s-a deteriorat.", "en": "Due to a lot of stress, my health deteriorated."}
    },
    # T6-13 ex3: 이 문제는 매우 복잡하므로 신중하게 생각해야 해요.
    {
        "lessonId": "T6-13", "topik": 6,
        "q": "이 문제는 매우 복잡하므로 신중하게 생각해야 해요.",
        "answers": {
            "ro": ["Deoarece această problemă este foarte complexă, trebuie gândită cu atenție.", "Această problemă este simplă și ușor de rezolvat.", "Nu trebuie să te gândești la această problemă.", "Oricine poate rezolva această problemă instant."],
            "en": ["Since this problem is very complex, you need to think carefully.", "This problem is simple and easy to solve.", "You don't need to think about this problem.", "Anyone can solve this problem instantly."]
        },
        "correct": {"ro": "Deoarece această problemă este foarte complexă, trebuie gândită cu atenție.", "en": "Since this problem is very complex, you need to think carefully."}
    },
    # T6-13 ex4: 안전이 최우선이므로 규칙을 반드시 지켜야 합니다.
    {
        "lessonId": "T6-13", "topik": 6,
        "q": "안전이 최우선이므로 규칙을 반드시 지켜야 합니다.",
        "answers": {
            "ro": ["Deoarece siguranța este prioritatea maximă, regulile trebuie respectate.", "Regulile sunt opționale.", "Siguranța nu este importantă.", "Nimeni nu trebuie să respecte regulile."],
            "en": ["Since safety is the top priority, the rules must be followed.", "Rules are optional.", "Safety is not important.", "Nobody needs to follow the rules."]
        },
        "correct": {"ro": "Deoarece siguranța este prioritatea maximă, regulile trebuie respectate.", "en": "Since safety is the top priority, the rules must be followed."}
    },
    # T6-14 ex3: 비가 오는데도 친구는 공원에서 운동해요.
    {
        "lessonId": "T6-14", "topik": 6,
        "q": "비가 오는데도 친구는 공원에서 운동해요.",
        "answers": {
            "ro": ["Chiar dacă plouă, prietenul meu face sport în parc.", "Prietenul meu nu face sport niciodată.", "Prietenul meu face sport doar pe vreme frumoasă.", "Plouă și nimeni nu iese afară."],
            "en": ["Even though it's raining, my friend exercises in the park.", "My friend never exercises.", "My friend only exercises in good weather.", "It's raining and nobody goes outside."]
        },
        "correct": {"ro": "Chiar dacă plouă, prietenul meu face sport în parc.", "en": "Even though it's raining, my friend exercises in the park."}
    },
    # T6-14 ex4: 추운데도 반팔을 입고 나왔어요.
    {
        "lessonId": "T6-14", "topik": 6,
        "q": "추운데도 반팔을 입고 나왔어요.",
        "answers": {
            "ro": ["Chiar dacă e frig, a ieșit cu tricou cu mânecă scurtă.", "A îmbrăcat o haină groasă de frig.", "Nu a ieșit afară.", "Vremea era caldă afară."],
            "en": ["Even though it's cold, I went out wearing a short-sleeved shirt.", "I wore a thick coat because of the cold.", "I didn't go outside.", "The weather was warm outside."]
        },
        "correct": {"ro": "Chiar dacă e frig, a ieșit cu tricou cu mânecă scurtă.", "en": "Even though it's cold, I went out wearing a short-sleeved shirt."}
    },
    # T6-15 ex3: 날씨가 더워지기에 에어컨을 켰어요.
    {
        "lessonId": "T6-15", "topik": 6,
        "q": "날씨가 더워지기에 에어컨을 켰어요.",
        "answers": {
            "ro": ["Deoarece vremea se încălzea, am pornit aerul condiționat.", "Am oprit aerul condiționat.", "Vremea era rece.", "Nu am pornit niciun aparat."],
            "en": ["Since the weather was getting hot, I turned on the air conditioner.", "I turned off the air conditioner.", "The weather was cold.", "I didn't turn on any appliance."]
        },
        "correct": {"ro": "Deoarece vremea se încălzea, am pornit aerul condiționat.", "en": "Since the weather was getting hot, I turned on the air conditioner."}
    },
    # T6-15 ex4: 이 소식이 중요하기에 빨리 알려드리고 싶었어요.
    {
        "lessonId": "T6-15", "topik": 6,
        "q": "이 소식이 중요하기에 빨리 알려드리고 싶었어요.",
        "answers": {
            "ro": ["Deoarece această știre este importantă, am vrut să vă anunț rapid.", "Știrea nu era importantă.", "Nu am vrut să spun nimănui.", "Am uitat să anunț pe cineva."],
            "en": ["Since this news is important, I wanted to inform you quickly.", "The news was not important.", "I didn't want to tell anyone.", "I forgot to inform someone."]
        },
        "correct": {"ro": "Deoarece această știre este importantă, am vrut să vă anunț rapid.", "en": "Since this news is important, I wanted to inform you quickly."}
    },
    # T6-16 ex3: 시간이 있길래 도서관에서 책을 읽었어요.
    {
        "lessonId": "T6-16", "topik": 6,
        "q": "시간이 있길래 도서관에서 책을 읽었어요.",
        "answers": {
            "ro": ["Deoarece aveam timp, am citit o carte la bibliotecă.", "Nu am avut timp să citesc.", "Am mers la bibliotecă dar nu am citit nimic.", "Nu am mers la bibliotecă."],
            "en": ["Since I had time, I read a book at the library.", "I didn't have time to read.", "I went to the library but didn't read anything.", "I didn't go to the library."]
        },
        "correct": {"ro": "Deoarece aveam timp, am citit o carte la bibliotecă.", "en": "Since I had time, I read a book at the library."}
    },
    # T6-16 ex4: 꽃이 예쁘길래 사진을 찍었어요.
    {
        "lessonId": "T6-16", "topik": 6,
        "q": "꽃이 예쁘길래 사진을 찍었어요.",
        "answers": {
            "ro": ["Deoarece florile erau frumoase, am făcut o fotografie.", "Nu mi-au plăcut florile.", "Am uitat să fac o fotografie.", "Florile nu erau frumoase."],
            "en": ["Since the flowers were pretty, I took a photo.", "I didn't like the flowers.", "I forgot to take a photo.", "The flowers were not pretty."]
        },
        "correct": {"ro": "Deoarece florile erau frumoase, am făcut o fotografie.", "en": "Since the flowers were pretty, I took a photo."}
    },
]

new_ro_ko = [
    # T6-09 ex3
    {
        "lessonId": "T6-09", "topik": 6,
        "prompt": {"ro": "Cu cât înveți mai mult, cu atât poți face mai bine.", "en": "The more you learn, the better you can do."},
        "options": ["배운 만큼 더 잘할 수 있어요.", "공부한 것처럼 잘할 수 있어요.", "배운 덕분에 잘할 수 있어요.", "배울수록 못하게 돼요."],
        "correct": "배운 만큼 더 잘할 수 있어요."
    },
    # T6-09 ex4
    {
        "lessonId": "T6-09", "topik": 6,
        "prompt": {"ro": "Pe măsură ce te pregătești, capătă încredere.", "en": "The more you prepare, the more confidence you gain."},
        "options": ["준비한 만큼 자신감이 생겨요.", "준비해서 자신감이 있어요.", "준비하면 자신감이 없어요.", "준비할수록 불안해요."],
        "correct": "준비한 만큼 자신감이 생겨요."
    },
    # T6-10 ex3
    {
        "lessonId": "T6-10", "topik": 6,
        "prompt": {"ro": "Am încercat să mă abțin, dar până la urmă m-am supărat.", "en": "I tried to hold back, but ended up getting angry."},
        "options": ["참으려 했지만 결국 화를 내고 말았어요.", "참아서 화를 안 냈어요.", "화를 내려고 했어요.", "참으면 화가 안 나요."],
        "correct": "참으려 했지만 결국 화를 내고 말았어요."
    },
    # T6-10 ex4
    {
        "lessonId": "T6-10", "topik": 6,
        "prompt": {"ro": "Sunt la dietă, dar am mâncat tort până la urmă.", "en": "I'm on a diet, but I ended up eating cake."},
        "options": ["다이어트 중인데 케이크를 먹고 말았어요.", "다이어트를 해서 케이크를 안 먹었어요.", "케이크를 먹으려고 다이어트를 했어요.", "다이어트를 포기하고 싶었어요."],
        "correct": "다이어트 중인데 케이크를 먹고 말았어요."
    },
    # T6-11 ex3
    {
        "lessonId": "T6-11", "topik": 6,
        "prompt": {"ro": "De vreme ce ai promis, trebuie neapărat să respecți.", "en": "Since you've promised, you must keep it."},
        "options": ["약속한 이상 반드시 지켜야 해요.", "약속했으니까 안 지켜도 돼요.", "약속을 해도 지킬 필요가 없어요.", "약속을 했지만 어쩔 수 없어요."],
        "correct": "약속한 이상 반드시 지켜야 해요."
    },
    # T6-11 ex4
    {
        "lessonId": "T6-11", "topik": 6,
        "prompt": {"ro": "De vreme ce ai ales, nu mai regreta.", "en": "Since you've chosen, don't regret it."},
        "options": ["선택한 이상 후회하지 마세요.", "선택했으니까 후회해도 돼요.", "선택을 안 했으면 좋았겠어요.", "선택한 것은 바꿀 수 있어요."],
        "correct": "선택한 이상 후회하지 마세요."
    },
    # T6-12 ex3
    {
        "lessonId": "T6-12", "topik": 6,
        "prompt": {"ro": "Din cauza traficului aglomerat, am ajuns târziu la birou.", "en": "Due to heavy traffic, I arrived late at the office."},
        "options": ["교통이 막히는 탓에 회사에 늦게 도착했어요.", "교통이 막혀서 회사에 일찍 갔어요.", "교통이 좋아서 빨리 도착했어요.", "회사에 안 갔어요."],
        "correct": "교통이 막히는 탓에 회사에 늦게 도착했어요."
    },
    # T6-12 ex4
    {
        "lessonId": "T6-12", "topik": 6,
        "prompt": {"ro": "Din cauza stresului mare, sănătatea mi s-a deteriorat.", "en": "Due to a lot of stress, my health deteriorated."},
        "options": ["스트레스가 많은 탓에 건강이 나빠졌어요.", "스트레스가 없어서 건강이 나빠졌어요.", "건강 때문에 스트레스를 받았어요.", "스트레스로 건강이 좋아졌어요."],
        "correct": "스트레스가 많은 탓에 건강이 나빠졌어요."
    },
    # T6-13 ex3
    {
        "lessonId": "T6-13", "topik": 6,
        "prompt": {"ro": "Deoarece această problemă este foarte complexă, trebuie gândită cu atenție.", "en": "Since this problem is very complex, you need to think carefully."},
        "options": ["이 문제는 매우 복잡하므로 신중하게 생각해야 해요.", "이 문제는 쉬우므로 빨리 풀 수 있어요.", "이 문제는 복잡해서 생각할 필요가 없어요.", "이 문제는 복잡하지 않으므로 쉽게 풀어요."],
        "correct": "이 문제는 매우 복잡하므로 신중하게 생각해야 해요."
    },
    # T6-13 ex4
    {
        "lessonId": "T6-13", "topik": 6,
        "prompt": {"ro": "Deoarece siguranța este prioritatea maximă, regulile trebuie respectate.", "en": "Since safety is the top priority, the rules must be followed."},
        "options": ["안전이 최우선이므로 규칙을 반드시 지켜야 합니다.", "규칙이 중요하므로 안전을 무시해요.", "안전이 중요하지 않으므로 규칙을 무시해요.", "규칙이 최우선이라서 안전은 필요 없어요."],
        "correct": "안전이 최우선이므로 규칙을 반드시 지켜야 합니다."
    },
    # T6-14 ex3
    {
        "lessonId": "T6-14", "topik": 6,
        "prompt": {"ro": "Chiar dacă plouă, prietenul meu face sport în parc.", "en": "Even though it's raining, my friend exercises in the park."},
        "options": ["비가 오는데도 친구는 공원에서 운동해요.", "비가 와서 친구는 운동을 안 해요.", "친구는 비가 올 때만 운동해요.", "비가 와서 공원이 비어 있어요."],
        "correct": "비가 오는데도 친구는 공원에서 운동해요."
    },
    # T6-14 ex4
    {
        "lessonId": "T6-14", "topik": 6,
        "prompt": {"ro": "Chiar dacă e frig, a ieșit cu tricou cu mânecă scurtă.", "en": "Even though it's cold, I went out wearing a short-sleeved shirt."},
        "options": ["추운데도 반팔을 입고 나왔어요.", "추워서 두꺼운 옷을 입었어요.", "반팔을 입고 싶어서 집에 있었어요.", "날씨가 따뜻해서 반팔을 입었어요."],
        "correct": "추운데도 반팔을 입고 나왔어요."
    },
    # T6-15 ex3
    {
        "lessonId": "T6-15", "topik": 6,
        "prompt": {"ro": "Deoarece vremea se încălzea, am pornit aerul condiționat.", "en": "Since the weather was getting hot, I turned on the air conditioner."},
        "options": ["날씨가 더워지기에 에어컨을 켰어요.", "날씨가 추워서 에어컨을 껐어요.", "에어컨이 있기에 날씨가 더워요.", "날씨와 관계없이 에어컨을 켰어요."],
        "correct": "날씨가 더워지기에 에어컨을 켰어요."
    },
    # T6-15 ex4
    {
        "lessonId": "T6-15", "topik": 6,
        "prompt": {"ro": "Deoarece această știre este importantă, am vrut să vă anunț rapid.", "en": "Since this news is important, I wanted to inform you quickly."},
        "options": ["이 소식이 중요하기에 빨리 알려드리고 싶었어요.", "소식이 중요하지 않아서 알리지 않았어요.", "빨리 알리기에 소식이 중요해졌어요.", "소식을 알고 싶었기에 중요하게 됐어요."],
        "correct": "이 소식이 중요하기에 빨리 알려드리고 싶었어요."
    },
    # T6-16 ex3
    {
        "lessonId": "T6-16", "topik": 6,
        "prompt": {"ro": "Deoarece aveam timp, am citit o carte la bibliotecă.", "en": "Since I had time, I read a book at the library."},
        "options": ["시간이 있길래 도서관에서 책을 읽었어요.", "시간이 없어서 책을 못 읽었어요.", "책을 읽고 싶어서 시간을 만들었어요.", "도서관에 가서 시간이 생겼어요."],
        "correct": "시간이 있길래 도서관에서 책을 읽었어요."
    },
    # T6-16 ex4
    {
        "lessonId": "T6-16", "topik": 6,
        "prompt": {"ro": "Deoarece florile erau frumoase, am făcut o fotografie.", "en": "Since the flowers were pretty, I took a photo."},
        "options": ["꽃이 예쁘길래 사진을 찍었어요.", "사진이 예뻐서 꽃을 샀어요.", "꽃이 예쁘지 않아서 사진을 안 찍었어요.", "사진을 찍기에 꽃이 예뻐졌어요."],
        "correct": "꽃이 예쁘길래 사진을 찍었어요."
    },
]

new_particle = [
    # T6-09 ex3: 배운 만큼 더 잘할 수 있어요. — focus: 만큼
    {
        "lessonId": "T6-09", "topik": 6,
        "template": "배운 ___ 더 잘할 수 있어요.",
        "options": ["만큼", "때문에", "덕분에", "처럼"],
        "correct": "만큼",
        "hint": {"ro": "만큼 = proporțional cu, atât cât", "en": "만큼 = as much as, proportional to"}
    },
    # T6-09 ex4: 준비한 만큼 자신감이 생겨요. — focus: 만큼
    {
        "lessonId": "T6-09", "topik": 6,
        "template": "준비한 ___ 자신감이 생겨요.",
        "options": ["만큼", "대로", "처럼", "보다"],
        "correct": "만큼",
        "hint": {"ro": "만큼 = în măsura în care, cât", "en": "만큼 = as much as, to the extent that"}
    },
    # T6-10 ex3: 참으려 했지만 결국 화를 내고 말았어요. — focus: 화를 (object particle)
    {
        "lessonId": "T6-10", "topik": 6,
        "template": "참으려 했지만 결국 화___내고 말았어요.",
        "options": ["를", "가", "은", "도"],
        "correct": "를",
        "hint": {"ro": "화 se termină în vocală → particulă de obiect 를", "en": "화 ends in a vowel → object particle 를"}
    },
    # T6-10 ex4: 다이어트 중인데 케이크를 먹고 말았어요. — focus: 케이크를
    {
        "lessonId": "T6-10", "topik": 6,
        "template": "다이어트 중인데 케이크___먹고 말았어요.",
        "options": ["를", "가", "은", "도"],
        "correct": "를",
        "hint": {"ro": "케이크 se termină în vocală → particulă de obiect 를", "en": "케이크 ends in a vowel → object particle 를"}
    },
    # T6-11 ex3: 약속한 이상 반드시 지켜야 해요. — focus: 이상
    {
        "lessonId": "T6-11", "topik": 6,
        "template": "약속한 ___ 반드시 지켜야 해요.",
        "options": ["이상", "만큼", "대로", "덕분에"],
        "correct": "이상",
        "hint": {"ro": "이상 = de vreme ce, odată ce (condiție îndeplinită)", "en": "이상 = since, now that (condition fulfilled)"}
    },
    # T6-11 ex4: 선택한 이상 후회하지 마세요. — focus: 이상
    {
        "lessonId": "T6-11", "topik": 6,
        "template": "선택한 ___ 후회하지 마세요.",
        "options": ["이상", "만큼", "처럼", "보다"],
        "correct": "이상",
        "hint": {"ro": "이상 = de vreme ce, odată ce ai ales", "en": "이상 = since, now that you've chosen"}
    },
    # T6-12 ex3: 교통이 막히는 탓에 회사에 늦게 도착했어요. — focus: 탓에
    {
        "lessonId": "T6-12", "topik": 6,
        "template": "교통이 막히는 ___ 회사에 늦게 도착했어요.",
        "options": ["탓에", "덕분에", "때문에", "바람에"],
        "correct": "탓에",
        "hint": {"ro": "탓에 = din cauza (negativă, cu implicație de vină)", "en": "탓에 = because of (negative cause, implies blame)"}
    },
    # T6-12 ex4: 스트레스가 많은 탓에 건강이 나빠졌어요. — focus: 탓에
    {
        "lessonId": "T6-12", "topik": 6,
        "template": "스트레스가 많은 ___ 건강이 나빠졌어요.",
        "options": ["탓에", "덕분에", "만큼", "이상"],
        "correct": "탓에",
        "hint": {"ro": "탓에 = din cauza (context negativ)", "en": "탓에 = because of (negative context)"}
    },
    # T6-13 ex3: 이 문제는 매우 복잡하므로 신중하게 생각해야 해요. — focus: 으로
    {
        "lessonId": "T6-13", "topik": 6,
        "template": "이 문제는 매우 복잡하___로 신중하게 생각해야 해요.",
        "options": ["므", "서", "니까", "면"],
        "correct": "므",
        "hint": {"ro": "므로 = deoarece, prin urmare (formal)", "en": "므로 = since, therefore (formal)"}
    },
    # T6-13 ex4: 안전이 최우선이므로 규칙을 반드시 지켜야 합니다. — focus: 이므로
    {
        "lessonId": "T6-13", "topik": 6,
        "template": "안전이 최우선___므로 규칙을 반드시 지켜야 합니다.",
        "options": ["이", "가", "은", "도"],
        "correct": "이",
        "hint": {"ro": "최우선 se termină în consoană → 이므로 (formal cauzal)", "en": "최우선 ends in consonant → 이므로 (formal causal)"}
    },
    # T6-14 ex3: 비가 오는데도 친구는 공원에서 운동해요. — focus: 에서 (location)
    {
        "lessonId": "T6-14", "topik": 6,
        "template": "비가 오는데도 친구는 공원___서 운동해요.",
        "options": ["에", "에게", "으로", "와"],
        "correct": "에",
        "hint": {"ro": "공원에서 = în parc (locație unde se desfășoară acțiunea)", "en": "공원에서 = in the park (location of action)"}
    },
    # T6-14 ex4: 추운데도 반팔을 입고 나왔어요. — focus: 을 (object)
    {
        "lessonId": "T6-14", "topik": 6,
        "template": "추운데도 반팔___입고 나왔어요.",
        "options": ["을", "이", "는", "도"],
        "correct": "을",
        "hint": {"ro": "반팔 se termină în consoană → particulă de obiect 을", "en": "반팔 ends in consonant → object particle 을"}
    },
    # T6-15 ex3: 날씨가 더워지기에 에어컨을 켰어요. — focus: 기에
    {
        "lessonId": "T6-15", "topik": 6,
        "template": "날씨가 더워지___에 에어컨을 켰어요.",
        "options": ["기", "서", "니까", "면"],
        "correct": "기",
        "hint": {"ro": "기에 = deoarece (forma scurtă formală a lui 기 때문에)", "en": "기에 = since/because (short formal form of 기 때문에)"}
    },
    # T6-15 ex4: 이 소식이 중요하기에 빨리 알려드리고 싶었어요. — focus: 기에
    {
        "lessonId": "T6-15", "topik": 6,
        "template": "이 소식이 중요하___에 빨리 알려드리고 싶었어요.",
        "options": ["기", "서", "므로", "면"],
        "correct": "기",
        "hint": {"ro": "기에 = deoarece este important", "en": "기에 = because it is important"}
    },
    # T6-16 ex3: 시간이 있길래 도서관에서 책을 읽었어요. — focus: 길래
    {
        "lessonId": "T6-16", "topik": 6,
        "template": "시간이 있___래 도서관에서 책을 읽었어요.",
        "options": ["길", "기에", "어서", "니까"],
        "correct": "길",
        "hint": {"ro": "길래 = deoarece (observând situația = am acționat spontan)", "en": "길래 = since/because (noticing a situation = acted spontaneously)"}
    },
    # T6-16 ex4: 꽃이 예쁘길래 사진을 찍었어요. — focus: 길래
    {
        "lessonId": "T6-16", "topik": 6,
        "template": "꽃이 예쁘___래 사진을 찍었어요.",
        "options": ["길", "어서", "기에", "므로"],
        "correct": "길",
        "hint": {"ro": "길래 = deoarece erau frumoase (reacție spontană)", "en": "길래 = since they were pretty (spontaneous reaction)"}
    },
]

new_particle_plus = [
    # T6-09 ex3: 배운 만큼 더 잘할 수 있어요. — 만큼 / 수
    {
        "lessonId": "T6-09", "topik": 6,
        "template": "배운 ___ 더 잘할 ___ 있어요.",
        "options": [["만큼", "수"], ["처럼", "수"], ["만큼", "것"], ["대로", "수"]],
        "correct": ["만큼", "수"],
        "hint": {"ro": "만큼 = cât, 수 있어요 = se poate", "en": "만큼 = as much as, 수 있어요 = can do"}
    },
    # T6-09 ex4: 준비한 만큼 자신감이 생겨요. — 만큼 / 이
    {
        "lessonId": "T6-09", "topik": 6,
        "template": "준비한 ___ 자신감___ 생겨요.",
        "options": [["만큼", "이"], ["처럼", "이"], ["만큼", "가"], ["대로", "가"]],
        "correct": ["만큼", "이"],
        "hint": {"ro": "만큼 = în măsura, 자신감이 (subiect, terminat în consoană → 이)", "en": "만큼 = as much as, 자신감이 (subject, ends in consonant → 이)"}
    },
    # T6-10 ex3: 참으려 했지만 결국 화를 내고 말았어요. — 지만 / 를
    {
        "lessonId": "T6-10", "topik": 6,
        "template": "참으려 했___만 결국 화___내고 말았어요.",
        "options": [["지", "를"], ["지", "가"], ["는데", "를"], ["는데", "가"]],
        "correct": ["지", "를"],
        "hint": {"ro": "지만 = dar (contrastiv), 화를 (obiect, vocală → 를)", "en": "지만 = but (contrast), 화를 (object, vowel → 를)"}
    },
    # T6-10 ex4: 다이어트 중인데 케이크를 먹고 말았어요. — 인데 / 를
    {
        "lessonId": "T6-10", "topik": 6,
        "template": "다이어트 중___데 케이크___먹고 말았어요.",
        "options": [["인", "를"], ["인", "을"], ["은", "를"], ["는", "를"]],
        "correct": ["인", "를"],
        "hint": {"ro": "중인데 = deși sunt în mijlocul (dietei), 케이크를 (obiect, vocală → 를)", "en": "중인데 = while in the middle of (diet), 케이크를 (object, vowel → 를)"}
    },
    # T6-11 ex3: 약속한 이상 반드시 지켜야 해요. — 이상 / 야
    {
        "lessonId": "T6-11", "topik": 6,
        "template": "약속한 ___ 반드시 지켜___해요.",
        "options": [["이상", "야"], ["만큼", "야"], ["이상", "서"], ["대로", "야"]],
        "correct": ["이상", "야"],
        "hint": {"ro": "이상 = de vreme ce, 야 해요 = trebuie să", "en": "이상 = since, 야 해요 = must"}
    },
    # T6-11 ex4: 선택한 이상 후회하지 마세요. — 이상 / 지
    {
        "lessonId": "T6-11", "topik": 6,
        "template": "선택한 ___ 후회하___마세요.",
        "options": [["이상", "지"], ["만큼", "지"], ["이상", "서"], ["대로", "고"]],
        "correct": ["이상", "지"],
        "hint": {"ro": "이상 = de vreme ce, 지 마세요 = nu faceți (negație politicoasă)", "en": "이상 = since, 지 마세요 = don't (polite negative)"}
    },
    # T6-12 ex3: 교통이 막히는 탓에 회사에 늦게 도착했어요. — 이 / 에
    {
        "lessonId": "T6-12", "topik": 6,
        "template": "교통___ 막히는 탓에 회사___늦게 도착했어요.",
        "options": [["이", "에"], ["가", "에"], ["이", "으로"], ["는", "에"]],
        "correct": ["이", "에"],
        "hint": {"ro": "교통이 (subiect, consoană → 이), 회사에 (destinație/loc → 에)", "en": "교통이 (subject, consonant → 이), 회사에 (location → 에)"}
    },
    # T6-12 ex4: 스트레스가 많은 탓에 건강이 나빠졌어요. — 가 / 이
    {
        "lessonId": "T6-12", "topik": 6,
        "template": "스트레스___ 많은 탓에 건강___ 나빠졌어요.",
        "options": [["가", "이"], ["이", "이"], ["가", "가"], ["는", "이"]],
        "correct": ["가", "이"],
        "hint": {"ro": "스트레스가 (subiect, vocală → 가), 건강이 (subiect, consoană → 이)", "en": "스트레스가 (subject, vowel → 가), 건강이 (subject, consonant → 이)"}
    },
    # T6-13 ex3: 이 문제는 매우 복잡하므로 신중하게 생각해야 해요. — 는 / 게
    {
        "lessonId": "T6-13", "topik": 6,
        "template": "이 문제___ 매우 복잡하므로 신중하___생각해야 해요.",
        "options": [["는", "게"], ["이", "게"], ["는", "서"], ["가", "게"]],
        "correct": ["는", "게"],
        "hint": {"ro": "문제는 (topic marker), 신중하게 = cu atenție (adverb)", "en": "문제는 (topic marker), 신중하게 = carefully (adverb)"}
    },
    # T6-13 ex4: 안전이 최우선이므로 규칙을 반드시 지켜야 합니다. — 이 / 을
    {
        "lessonId": "T6-13", "topik": 6,
        "template": "안전___ 최우선이므로 규칙___ 반드시 지켜야 합니다.",
        "options": [["이", "을"], ["가", "을"], ["이", "를"], ["은", "을"]],
        "correct": ["이", "을"],
        "hint": {"ro": "안전이 (subiect, consoană → 이), 규칙을 (obiect, consoană → 을)", "en": "안전이 (subject, consonant → 이), 규칙을 (object, consonant → 을)"}
    },
    # T6-14 ex3: 비가 오는데도 친구는 공원에서 운동해요. — 가 / 는
    {
        "lessonId": "T6-14", "topik": 6,
        "template": "비___ 오는데도 친구___ 공원에서 운동해요.",
        "options": [["가", "는"], ["이", "는"], ["가", "이"], ["를", "는"]],
        "correct": ["가", "는"],
        "hint": {"ro": "비가 (subiect, vocală → 가), 친구는 (topic marker → 는)", "en": "비가 (subject, vowel → 가), 친구는 (topic marker → 는)"}
    },
    # T6-14 ex4: 추운데도 반팔을 입고 나왔어요. — 데도 / 을
    {
        "lessonId": "T6-14", "topik": 6,
        "template": "추운___도 반팔___입고 나왔어요.",
        "options": [["데", "을"], ["데", "를"], ["지만", "을"], ["는데", "을"]],
        "correct": ["데", "을"],
        "hint": {"ro": "데도 = chiar dacă, 반팔을 (obiect, consoană → 을)", "en": "데도 = even though, 반팔을 (object, consonant → 을)"}
    },
    # T6-15 ex3: 날씨가 더워지기에 에어컨을 켰어요. — 가 / 을
    {
        "lessonId": "T6-15", "topik": 6,
        "template": "날씨___ 더워지기에 에어컨___켰어요.",
        "options": [["가", "을"], ["이", "을"], ["가", "를"], ["는", "을"]],
        "correct": ["가", "을"],
        "hint": {"ro": "날씨가 (subiect, vocală → 가), 에어컨을 (obiect, consoană → 을)", "en": "날씨가 (subject, vowel → 가), 에어컨을 (object, consonant → 을)"}
    },
    # T6-15 ex4: 이 소식이 중요하기에 빨리 알려드리고 싶었어요. — 이 / 고
    {
        "lessonId": "T6-15", "topik": 6,
        "template": "이 소식___ 중요하기에 빨리 알려드리___싶었어요.",
        "options": [["이", "고"], ["가", "고"], ["이", "서"], ["는", "고"]],
        "correct": ["이", "고"],
        "hint": {"ro": "소식이 (subiect, consoană → 이), 알려드리고 싶었어요 = am vrut să informez", "en": "소식이 (subject, consonant → 이), 알려드리고 싶었어요 = wanted to inform"}
    },
    # T6-16 ex3: 시간이 있길래 도서관에서 책을 읽었어요. — 이 / 을
    {
        "lessonId": "T6-16", "topik": 6,
        "template": "시간___ 있길래 도서관에서 책___읽었어요.",
        "options": [["이", "을"], ["가", "을"], ["이", "를"], ["은", "을"]],
        "correct": ["이", "을"],
        "hint": {"ro": "시간이 (subiect, consoană → 이), 책을 (obiect, consoană → 을)", "en": "시간이 (subject, consonant → 이), 책을 (object, consonant → 을)"}
    },
    # T6-16 ex4: 꽃이 예쁘길래 사진을 찍었어요. — 이 / 을
    {
        "lessonId": "T6-16", "topik": 6,
        "template": "꽃___ 예쁘길래 사진___찍었어요.",
        "options": [["이", "을"], ["가", "을"], ["이", "를"], ["은", "을"]],
        "correct": ["이", "을"],
        "hint": {"ro": "꽃이 (subiect, consoană → 이), 사진을 (obiect, consoană → 을)", "en": "꽃이 (subject, consonant → 이), 사진을 (object, consonant → 을)"}
    },
]

new_conjug = [
    # T6-09 ex3: 배우다 → 배운 만큼
    {
        "lessonId": "T6-09", "topik": 6,
        "prompt": {"ro": "배우다 → proporțional cu cât ai învățat (-ㄴ 만큼)", "en": "배우다 → as much as you have learned (-ㄴ 만큼)"},
        "options": ["배운 만큼", "배우는 만큼", "배울 만큼", "배웠 만큼"],
        "correct": "배운 만큼"
    },
    # T6-09 ex4: 준비하다 → 준비한 만큼
    {
        "lessonId": "T6-09", "topik": 6,
        "prompt": {"ro": "준비하다 → proporțional cu cât ai pregătit (-ㄴ 만큼)", "en": "준비하다 → as much as you have prepared (-ㄴ 만큼)"},
        "options": ["준비한 만큼", "준비하는 만큼", "준비할 만큼", "준비했 만큼"],
        "correct": "준비한 만큼"
    },
    # T6-10 ex3: 내다 → 화를 내고 말았어요
    {
        "lessonId": "T6-10", "topik": 6,
        "prompt": {"ro": "내다 → am ajuns să-mi exprim furia (-고 말았어요)", "en": "내다 → ended up expressing anger (-고 말았어요)"},
        "options": ["내고 말았어요", "내서 말았어요", "냈고 말았어요", "낼고 말았어요"],
        "correct": "내고 말았어요"
    },
    # T6-10 ex4: 먹다 → 먹고 말았어요
    {
        "lessonId": "T6-10", "topik": 6,
        "prompt": {"ro": "먹다 → am ajuns să mănânc (-고 말았어요)", "en": "먹다 → ended up eating (-고 말았어요)"},
        "options": ["먹고 말았어요", "먹어서 말았어요", "먹었고 말았어요", "먹을고 말았어요"],
        "correct": "먹고 말았어요"
    },
    # T6-11 ex3: 약속하다 → 약속한 이상
    {
        "lessonId": "T6-11", "topik": 6,
        "prompt": {"ro": "약속하다 → de vreme ce ai promis (-ㄴ 이상)", "en": "약속하다 → since you have promised (-ㄴ 이상)"},
        "options": ["약속한 이상", "약속하는 이상", "약속할 이상", "약속했 이상"],
        "correct": "약속한 이상"
    },
    # T6-11 ex4: 선택하다 → 선택한 이상
    {
        "lessonId": "T6-11", "topik": 6,
        "prompt": {"ro": "선택하다 → de vreme ce ai ales (-ㄴ 이상)", "en": "선택하다 → since you have chosen (-ㄴ 이상)"},
        "options": ["선택한 이상", "선택하는 이상", "선택할 이상", "선택하여 이상"],
        "correct": "선택한 이상"
    },
    # T6-12 ex3: 막히다 → 막히는 탓에
    {
        "lessonId": "T6-12", "topik": 6,
        "prompt": {"ro": "막히다 → din cauza că este blocat (-는 탓에)", "en": "막히다 → because of being blocked (-는 탓에)"},
        "options": ["막히는 탓에", "막힌 탓에", "막힐 탓에", "막혔 탓에"],
        "correct": "막히는 탓에"
    },
    # T6-12 ex4: 많다 → 많은 탓에
    {
        "lessonId": "T6-12", "topik": 6,
        "prompt": {"ro": "많다 → din cauza că este mult (-은 탓에)", "en": "많다 → because there is a lot (-은 탓에)"},
        "options": ["많은 탓에", "많는 탓에", "많을 탓에", "많았 탓에"],
        "correct": "많은 탓에"
    },
    # T6-13 ex3: 복잡하다 → 복잡하므로
    {
        "lessonId": "T6-13", "topik": 6,
        "prompt": {"ro": "복잡하다 → deoarece este complex (-므로)", "en": "복잡하다 → since it is complex (-므로)"},
        "options": ["복잡하므로", "복잡해서", "복잡하니까", "복잡하면"],
        "correct": "복잡하므로"
    },
    # T6-13 ex4: 최우선이다 → 최우선이므로
    {
        "lessonId": "T6-13", "topik": 6,
        "prompt": {"ro": "최우선이다 → deoarece este prioritatea maximă (-이므로)", "en": "최우선이다 → since it is the top priority (-이므로)"},
        "options": ["최우선이므로", "최우선이어서", "최우선이니까", "최우선이면"],
        "correct": "최우선이므로"
    },
    # T6-14 ex3: 오다 → 오는데도
    {
        "lessonId": "T6-14", "topik": 6,
        "prompt": {"ro": "오다 → chiar dacă vine (ploaia) (-는데도)", "en": "오다 → even though it comes (rain) (-는데도)"},
        "options": ["오는데도", "온데도", "올데도", "왔는데도"],
        "correct": "오는데도"
    },
    # T6-14 ex4: 춥다 → 추운데도 (ㅂ irregular)
    {
        "lessonId": "T6-14", "topik": 6,
        "prompt": {"ro": "춥다 → chiar dacă e frig, -ㄴ데도 (neregulat ㅂ)", "en": "춥다 → even though it's cold, -ㄴ데도 (ㅂ irregular)"},
        "options": ["추운데도", "춥는데도", "춥은데도", "춥데도"],
        "correct": "추운데도"
    },
    # T6-15 ex3: 더워지다 → 더워지기에
    {
        "lessonId": "T6-15", "topik": 6,
        "prompt": {"ro": "더워지다 → deoarece se încălzește (-기에)", "en": "더워지다 → since it is getting hot (-기에)"},
        "options": ["더워지기에", "더워져서", "더워지니까", "더워지므로"],
        "correct": "더워지기에"
    },
    # T6-15 ex4: 중요하다 → 중요하기에
    {
        "lessonId": "T6-15", "topik": 6,
        "prompt": {"ro": "중요하다 → deoarece este important (-기에)", "en": "중요하다 → since it is important (-기에)"},
        "options": ["중요하기에", "중요해서", "중요하니까", "중요하므로"],
        "correct": "중요하기에"
    },
    # T6-16 ex3: 있다 → 있길래
    {
        "lessonId": "T6-16", "topik": 6,
        "prompt": {"ro": "있다 → deoarece aveam (timp) (-길래)", "en": "있다 → since I had (time) (-길래)"},
        "options": ["있길래", "있기에", "있어서", "있으니까"],
        "correct": "있길래"
    },
    # T6-16 ex4: 예쁘다 → 예쁘길래
    {
        "lessonId": "T6-16", "topik": 6,
        "prompt": {"ro": "예쁘다 → deoarece era frumos (-길래)", "en": "예쁘다 → since it was pretty (-길래)"},
        "options": ["예쁘길래", "예뻐서", "예쁘기에", "예쁘니까"],
        "correct": "예쁘길래"
    },
]

new_puzzle = [
    # T6-09 ex3: 배운 만큼 더 잘할 수 있어요.
    {
        "lessonId": "T6-09", "topik": 6,
        "tiles": ["더", "만큼", "잘할", "배운", "있어요", "수"],
        "correct": ["배운", "만큼", "더", "잘할", "수", "있어요"],
        "hint": {"ro": "배운 만큼 = proporțional cu cât ai învățat", "en": "배운 만큼 = as much as you learned"}
    },
    # T6-09 ex4: 준비한 만큼 자신감이 생겨요.
    {
        "lessonId": "T6-09", "topik": 6,
        "tiles": ["자신감이", "만큼", "생겨요", "준비한"],
        "correct": ["준비한", "만큼", "자신감이", "생겨요"],
        "hint": {"ro": "준비한 만큼 = în măsura în care te-ai pregătit", "en": "준비한 만큼 = to the extent you prepared"}
    },
    # T6-10 ex3: 참으려 했지만 결국 화를 내고 말았어요.
    {
        "lessonId": "T6-10", "topik": 6,
        "tiles": ["결국", "했지만", "화를", "참으려", "말았어요", "내고"],
        "correct": ["참으려", "했지만", "결국", "화를", "내고", "말았어요"],
        "hint": {"ro": "결국 = în cele din urmă, 내고 말았어요 = am ajuns să exprim", "en": "결국 = in the end, 내고 말았어요 = ended up expressing"}
    },
    # T6-10 ex4: 다이어트 중인데 케이크를 먹고 말았어요.
    {
        "lessonId": "T6-10", "topik": 6,
        "tiles": ["케이크를", "말았어요", "중인데", "다이어트", "먹고"],
        "correct": ["다이어트", "중인데", "케이크를", "먹고", "말았어요"],
        "hint": {"ro": "중인데 = deși sunt în mijlocul, 먹고 말았어요 = am ajuns să mănânc", "en": "중인데 = while in the middle of, 먹고 말았어요 = ended up eating"}
    },
    # T6-11 ex3: 약속한 이상 반드시 지켜야 해요.
    {
        "lessonId": "T6-11", "topik": 6,
        "tiles": ["이상", "해요", "약속한", "지켜야", "반드시"],
        "correct": ["약속한", "이상", "반드시", "지켜야", "해요"],
        "hint": {"ro": "이상 = de vreme ce, 반드시 = neapărat", "en": "이상 = since/now that, 반드시 = definitely"}
    },
    # T6-11 ex4: 선택한 이상 후회하지 마세요.
    {
        "lessonId": "T6-11", "topik": 6,
        "tiles": ["마세요", "이상", "선택한", "후회하지"],
        "correct": ["선택한", "이상", "후회하지", "마세요"],
        "hint": {"ro": "이상 = de vreme ce, 후회하지 마세요 = nu regreta", "en": "이상 = since, 후회하지 마세요 = don't regret"}
    },
    # T6-12 ex3: 교통이 막히는 탓에 회사에 늦게 도착했어요.
    {
        "lessonId": "T6-12", "topik": 6,
        "tiles": ["막히는", "도착했어요", "교통이", "탓에", "늦게", "회사에"],
        "correct": ["교통이", "막히는", "탓에", "회사에", "늦게", "도착했어요"],
        "hint": {"ro": "탓에 = din cauza, 늦게 도착했어요 = am ajuns târziu", "en": "탓에 = because of, 늦게 도착했어요 = arrived late"}
    },
    # T6-12 ex4: 스트레스가 많은 탓에 건강이 나빠졌어요.
    {
        "lessonId": "T6-12", "topik": 6,
        "tiles": ["나빠졌어요", "많은", "탓에", "스트레스가", "건강이"],
        "correct": ["스트레스가", "많은", "탓에", "건강이", "나빠졌어요"],
        "hint": {"ro": "탓에 = din cauza, 건강이 나빠졌어요 = sănătatea s-a deteriorat", "en": "탓에 = because of, 건강이 나빠졌어요 = health deteriorated"}
    },
    # T6-13 ex3: 이 문제는 매우 복잡하므로 신중하게 생각해야 해요.
    {
        "lessonId": "T6-13", "topik": 6,
        "tiles": ["매우", "해요", "복잡하므로", "신중하게", "이", "생각해야", "문제는"],
        "correct": ["이", "문제는", "매우", "복잡하므로", "신중하게", "생각해야", "해요"],
        "hint": {"ro": "복잡하므로 = deoarece este complex, 신중하게 = cu atenție", "en": "복잡하므로 = since it is complex, 신중하게 = carefully"}
    },
    # T6-13 ex4: 안전이 최우선이므로 규칙을 반드시 지켜야 합니다.
    {
        "lessonId": "T6-13", "topik": 6,
        "tiles": ["규칙을", "합니다", "최우선이므로", "안전이", "지켜야", "반드시"],
        "correct": ["안전이", "최우선이므로", "규칙을", "반드시", "지켜야", "합니다"],
        "hint": {"ro": "최우선이므로 = deoarece este prioritatea maximă", "en": "최우선이므로 = since it is the top priority"}
    },
    # T6-14 ex3: 비가 오는데도 친구는 공원에서 운동해요.
    {
        "lessonId": "T6-14", "topik": 6,
        "tiles": ["운동해요", "오는데도", "친구는", "비가", "공원에서"],
        "correct": ["비가", "오는데도", "친구는", "공원에서", "운동해요"],
        "hint": {"ro": "오는데도 = chiar dacă vine (ploaia), 공원에서 = în parc", "en": "오는데도 = even though it rains, 공원에서 = in the park"}
    },
    # T6-14 ex4: 추운데도 반팔을 입고 나왔어요.
    {
        "lessonId": "T6-14", "topik": 6,
        "tiles": ["나왔어요", "추운데도", "입고", "반팔을"],
        "correct": ["추운데도", "반팔을", "입고", "나왔어요"],
        "hint": {"ro": "추운데도 = chiar dacă e frig, 반팔을 = tricou cu mânecă scurtă", "en": "추운데도 = even though it's cold, 반팔을 = short-sleeved shirt"}
    },
    # T6-15 ex3: 날씨가 더워지기에 에어컨을 켰어요.
    {
        "lessonId": "T6-15", "topik": 6,
        "tiles": ["에어컨을", "날씨가", "켰어요", "더워지기에"],
        "correct": ["날씨가", "더워지기에", "에어컨을", "켰어요"],
        "hint": {"ro": "더워지기에 = deoarece se încălzea", "en": "더워지기에 = since it was getting hot"}
    },
    # T6-15 ex4: 이 소식이 중요하기에 빨리 알려드리고 싶었어요.
    {
        "lessonId": "T6-15", "topik": 6,
        "tiles": ["알려드리고", "이", "싶었어요", "소식이", "빨리", "중요하기에"],
        "correct": ["이", "소식이", "중요하기에", "빨리", "알려드리고", "싶었어요"],
        "hint": {"ro": "중요하기에 = deoarece este important, 알려드리고 싶었어요 = am vrut să informez", "en": "중요하기에 = since it is important, 알려드리고 싶었어요 = wanted to inform"}
    },
    # T6-16 ex3: 시간이 있길래 도서관에서 책을 읽었어요.
    {
        "lessonId": "T6-16", "topik": 6,
        "tiles": ["읽었어요", "도서관에서", "있길래", "시간이", "책을"],
        "correct": ["시간이", "있길래", "도서관에서", "책을", "읽었어요"],
        "hint": {"ro": "있길래 = deoarece aveam (timp), 도서관에서 = la bibliotecă", "en": "있길래 = since I had (time), 도서관에서 = at the library"}
    },
    # T6-16 ex4: 꽃이 예쁘길래 사진을 찍었어요.
    {
        "lessonId": "T6-16", "topik": 6,
        "tiles": ["예쁘길래", "찍었어요", "꽃이", "사진을"],
        "correct": ["꽃이", "예쁘길래", "사진을", "찍었어요"],
        "hint": {"ro": "예쁘길래 = deoarece era frumos", "en": "예쁘길래 = since it was pretty"}
    },
]

new_chain = [
    # T6-09: Topic 만큼 — learning proportionally
    {
        "lessonId": "T6-09", "topik": 6,
        "tiles": [
            "한국어를 공부하는 건 쉽지 않아요.",
            "배운 만큼 더 잘할 수 있어요.",
            "그러니까 매일 조금씩 공부해요.",
            "준비한 만큼 자신감이 생겨요."
        ],
        "correct": [
            "한국어를 공부하는 건 쉽지 않아요.",
            "그러니까 매일 조금씩 공부해요.",
            "배운 만큼 더 잘할 수 있어요.",
            "준비한 만큼 자신감이 생겨요."
        ],
        "context": {"ro": "Progresul în studiu este proporțional cu efortul depus.", "en": "Progress in study is proportional to the effort made."}
    },
    # T6-10: Topic 고 말다 — ending up doing something
    {
        "lessonId": "T6-10", "topik": 6,
        "tiles": [
            "다이어트 중인데 케이크를 먹고 말았어요.",
            "오늘은 건강하게 먹으려고 했어요.",
            "내일부터는 정말 참을 거예요.",
            "참으려 했지만 결국 화를 내고 말았어요."
        ],
        "correct": [
            "오늘은 건강하게 먹으려고 했어요.",
            "다이어트 중인데 케이크를 먹고 말았어요.",
            "참으려 했지만 결국 화를 내고 말았어요.",
            "내일부터는 정말 참을 거예요."
        ],
        "context": {"ro": "Situații în care până la urmă cazi în tentație sau cedezi emoțiilor.", "en": "Situations where you end up giving in to temptation or emotions."}
    },
    # T6-11: Topic 이상 — obligations after committing
    {
        "lessonId": "T6-11", "topik": 6,
        "tiles": [
            "선택한 이상 후회하지 마세요.",
            "어떤 일이든 결정하기 전에 잘 생각해야 해요.",
            "약속한 이상 반드시 지켜야 해요.",
            "그래야 신뢰를 쌓을 수 있어요."
        ],
        "correct": [
            "어떤 일이든 결정하기 전에 잘 생각해야 해요.",
            "약속한 이상 반드시 지켜야 해요.",
            "선택한 이상 후회하지 마세요.",
            "그래야 신뢰를 쌓을 수 있어요."
        ],
        "context": {"ro": "Odată ce iei o decizie sau faci o promisiune, trebuie să o respecți.", "en": "Once you make a decision or promise, you must follow through."}
    },
    # T6-12: Topic 탓에 — blaming negative causes
    {
        "lessonId": "T6-12", "topik": 6,
        "tiles": [
            "스트레스가 많은 탓에 건강이 나빠졌어요.",
            "요즘 회사에서 일이 너무 많아요.",
            "교통이 막히는 탓에 회사에 늦게 도착했어요.",
            "상사한테 많이 혼났어요."
        ],
        "correct": [
            "요즘 회사에서 일이 너무 많아요.",
            "스트레스가 많은 탓에 건강이 나빠졌어요.",
            "교통이 막히는 탓에 회사에 늦게 도착했어요.",
            "상사한테 많이 혼났어요."
        ],
        "context": {"ro": "O zi proastă la birou din cauza stresului și traficului.", "en": "A bad day at the office due to stress and traffic."}
    },
    # T6-13: Topic 므로 — formal reasoning
    {
        "lessonId": "T6-13", "topik": 6,
        "tiles": [
            "안전이 최우선이므로 규칙을 반드시 지켜야 합니다.",
            "이 문제는 매우 복잡하므로 신중하게 생각해야 해요.",
            "여러 전문가에게 의견을 물어보는 게 좋겠어요.",
            "결정하기 전에 충분히 검토하겠습니다."
        ],
        "correct": [
            "이 문제는 매우 복잡하므로 신중하게 생각해야 해요.",
            "여러 전문가에게 의견을 물어보는 게 좋겠어요.",
            "안전이 최우선이므로 규칙을 반드시 지켜야 합니다.",
            "결정하기 전에 충분히 검토하겠습니다."
        ],
        "context": {"ro": "Raționament formal pentru decizii importante și sigure.", "en": "Formal reasoning for important and safe decisions."}
    },
    # T6-14: Topic 는데도/ㄴ데도 — even though, concession
    {
        "lessonId": "T6-14", "topik": 6,
        "tiles": [
            "추운데도 반팔을 입고 나왔어요.",
            "오늘 날씨가 많이 춥고 비도 와요.",
            "비가 오는데도 친구는 공원에서 운동해요.",
            "친구는 정말 의지가 강한 것 같아요."
        ],
        "correct": [
            "오늘 날씨가 많이 춥고 비도 와요.",
            "비가 오는데도 친구는 공원에서 운동해요.",
            "추운데도 반팔을 입고 나왔어요.",
            "친구는 정말 의지가 강한 것 같아요."
        ],
        "context": {"ro": "Un prieten cu voință puternică care face sport indiferent de vreme.", "en": "A strong-willed friend who exercises regardless of the weather."}
    },
    # T6-15: Topic 기에 — formal causal
    {
        "lessonId": "T6-15", "topik": 6,
        "tiles": [
            "날씨가 더워지기에 에어컨을 켰어요.",
            "이 소식이 중요하기에 빨리 알려드리고 싶었어요.",
            "여름이 성큼 다가온 것 같아요.",
            "더위 조심하시고 건강하게 지내세요."
        ],
        "correct": [
            "이 소식이 중요하기에 빨리 알려드리고 싶었어요.",
            "여름이 성큼 다가온 것 같아요.",
            "날씨가 더워지기에 에어컨을 켰어요.",
            "더위 조심하시고 건강하게 지내세요."
        ],
        "context": {"ro": "Anunțarea venirii verii și sfaturi pentru sănătate.", "en": "Announcing the arrival of summer with health tips."}
    },
    # T6-16: Topic 길래 — spontaneous reaction
    {
        "lessonId": "T6-16", "topik": 6,
        "tiles": [
            "시간이 있길래 도서관에서 책을 읽었어요.",
            "오후에 갑자기 약속이 취소됐어요.",
            "꽃이 예쁘길래 사진을 찍었어요.",
            "오늘 산책하면서 좋은 시간을 보냈어요."
        ],
        "correct": [
            "오후에 갑자기 약속이 취소됐어요.",
            "시간이 있길래 도서관에서 책을 읽었어요.",
            "꽃이 예쁘길래 사진을 찍었어요.",
            "오늘 산책하면서 좋은 시간을 보냈어요."
        ],
        "context": {"ro": "O după-amiază spontană și plăcută după o anulare neașteptată.", "en": "A spontaneous pleasant afternoon after an unexpected cancellation."}
    },
]

data['ko-ro'].extend(new_ko_ro)
data['ro-ko'].extend(new_ro_ko)
data['particle'].extend(new_particle)
data['particlePlus'].extend(new_particle_plus)
data['conjug'].extend(new_conjug)
data['puzzle'].extend(new_puzzle)
data['chain'].extend(new_chain)

with open('data/exercises.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Done! New counts:")
print({k: len(v) for k, v in data.items()})
