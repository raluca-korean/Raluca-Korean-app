#!/usr/bin/env python3
import json

data = json.load(open('data/exercises.json'))

# New T1 exercises - 2 per lesson (sentences 3 and 4 from lessons.json)
# Each lesson gets 2 new exercises per type

# ============================================================
# KO-RO exercises
# ============================================================
new_koro = [
    # T1-01 (은/는)
    {"lessonId":"T1-01","topik":1,"q":"음식은 맛있어요.","answers":{"ro":["Mâncarea este delicioasă.","Mâncarea nu este delicioasă.","Mâncarea este scumpă.","Mâncarea este ieftină."],"en":["The food is delicious.","The food is not delicious.","The food is expensive.","The food is cheap."]},"correct":{"ro":"Mâncarea este delicioasă.","en":"The food is delicious."}},
    {"lessonId":"T1-01","topik":1,"q":"날씨는 좋아요.","answers":{"ro":["Vremea este bună.","Vremea este rea.","Vremea este caldă.","Vremea este rece."],"en":["The weather is nice.","The weather is bad.","The weather is warm.","The weather is cold."]},"correct":{"ro":"Vremea este bună.","en":"The weather is nice."}},
    # T1-02 (이/가)
    {"lessonId":"T1-02","topik":1,"q":"꽃이 예뻐요.","answers":{"ro":["Floarea este frumoasă.","Floarea este urâtă.","Floarea este mare.","Floarea este mică."],"en":["The flower is pretty.","The flower is ugly.","The flower is big.","The flower is small."]},"correct":{"ro":"Floarea este frumoasă.","en":"The flower is pretty."}},
    {"lessonId":"T1-02","topik":1,"q":"고양이가 자요.","answers":{"ro":["Pisica doarme.","Pisica mănâncă.","Pisica aleargă.","Pisica se joacă."],"en":["The cat is sleeping.","The cat is eating.","The cat is running.","The cat is playing."]},"correct":{"ro":"Pisica doarme.","en":"The cat is sleeping."}},
    # T1-03 (을/를)
    {"lessonId":"T1-03","topik":1,"q":"음악을 들어요.","answers":{"ro":["Ascult muzică.","Cânt muzică.","Scriu muzică.","Nu îmi place muzica."],"en":["I listen to music.","I play music.","I write music.","I don't like music."]},"correct":{"ro":"Ascult muzică.","en":"I listen to music."}},
    {"lessonId":"T1-03","topik":1,"q":"영화를 봐요.","answers":{"ro":["Mă uit la film.","Filmez un film.","Cumpăr un film.","Nu îmi plac filmele."],"en":["I watch a movie.","I film a movie.","I buy a movie.","I don't like movies."]},"correct":{"ro":"Mă uit la film.","en":"I watch a movie."}},
    # T1-04 (에/에서)
    {"lessonId":"T1-04","topik":1,"q":"집에 있어요.","answers":{"ro":["Sunt acasă.","Vin acasă.","Merg spre casă.","Îmi place casa."],"en":["I am at home.","I am coming home.","I am going to the house.","I like the house."]},"correct":{"ro":"Sunt acasă.","en":"I am at home."}},
    {"lessonId":"T1-04","topik":1,"q":"카페에서 일해요.","answers":{"ro":["Lucrez la cafenea.","Merg la cafenea.","Beau cafea la cafenea.","Am o cafenea."],"en":["I work at a café.","I go to a café.","I drink coffee at a café.","I own a café."]},"correct":{"ro":"Lucrez la cafenea.","en":"I work at a café."}},
    # T1-05 (도)
    {"lessonId":"T1-05","topik":1,"q":"한국어도 배워요.","answers":{"ro":["Și coreeana o învăț.","Nu vreau să învăț coreeana.","Coreeana este grea.","Am terminat de studiat coreeana."],"en":["I also learn Korean.","I don't want to learn Korean.","Korean is difficult.","I finished studying Korean."]},"correct":{"ro":"Și coreeana o învăț.","en":"I also learn Korean."}},
    {"lessonId":"T1-05","topik":1,"q":"오늘도 행복해요.","answers":{"ro":["Și azi sunt fericit/ă.","Astăzi nu sunt fericit/ă.","Astăzi mă simt trist/ă.","Astăzi sunt obosit/ă."],"en":["I am happy today too.","I am not happy today.","I feel sad today.","I am tired today."]},"correct":{"ro":"Și azi sunt fericit/ă.","en":"I am happy today too."}},
    # T1-06 (의)
    {"lessonId":"T1-06","topik":1,"q":"선생님의 책이에요.","answers":{"ro":["Este cartea profesorului.","Este cartea mea.","Profesorul cumpără o carte.","Cartea este ieftină."],"en":["It is the teacher's book.","It is my book.","The teacher buys a book.","The book is cheap."]},"correct":{"ro":"Este cartea profesorului.","en":"It is the teacher's book."}},
    {"lessonId":"T1-06","topik":1,"q":"제 동생의 이름은 민준이에요.","answers":{"ro":["Numele fratelui meu este Minjun.","Fratele meu se numește Minji.","Eu mă numesc Minjun.","Fratele meu nu are nume."],"en":["My younger sibling's name is Minjun.","My sibling's name is Minji.","My name is Minjun.","My sibling has no name."]},"correct":{"ro":"Numele fratelui meu este Minjun.","en":"My younger sibling's name is Minjun."}},
    # T1-07 (안/못)
    {"lessonId":"T1-07","topik":1,"q":"한국어를 안 해요.","answers":{"ro":["Nu vorbesc coreeana.","Vorbesc coreeana.","Îmi place coreeana.","Studiez coreeana."],"en":["I don't speak Korean.","I speak Korean.","I like Korean.","I study Korean."]},"correct":{"ro":"Nu vorbesc coreeana.","en":"I don't speak Korean."}},
    {"lessonId":"T1-07","topik":1,"q":"노래를 못 해요.","answers":{"ro":["Nu știu să cânt.","Cânt bine.","Îmi place să cânt.","Nu am timp să cânt."],"en":["I can't sing.","I sing well.","I like to sing.","I have no time to sing."]},"correct":{"ro":"Nu știu să cânt.","en":"I can't sing."}},
    # T1-08 (와/과/하고)
    {"lessonId":"T1-08","topik":1,"q":"엄마와 아빠가 있어요.","answers":{"ro":["Există mama și tata.","Mama și tata nu sunt acasă.","Vine mama sau tata.","Mama și tata sunt plecați."],"en":["There is mom and dad.","Mom and dad are not home.","Mom or dad is coming.","Mom and dad are away."]},"correct":{"ro":"Există mama și tata.","en":"There is mom and dad."}},
    {"lessonId":"T1-08","topik":1,"q":"빵과 우유를 사요.","answers":{"ro":["Cumpăr pâine și lapte.","Mănânc pâine și beau lapte.","Am pâine sau lapte.","Nu cumpăr pâine."],"en":["I buy bread and milk.","I eat bread and drink milk.","I have bread or milk.","I don't buy bread."]},"correct":{"ro":"Cumpăr pâine și lapte.","en":"I buy bread and milk."}},
    # T1-09 (이에요/예요)
    {"lessonId":"T1-09","topik":1,"q":"제 친구는 의사예요.","answers":{"ro":["Prietenul meu este doctor.","Prietenul meu vrea să fie doctor.","Prietenul meu nu este doctor.","Eu sunt doctor."],"en":["My friend is a doctor.","My friend wants to be a doctor.","My friend is not a doctor.","I am a doctor."]},"correct":{"ro":"Prietenul meu este doctor.","en":"My friend is a doctor."}},
    {"lessonId":"T1-09","topik":1,"q":"오늘은 월요일이에요.","answers":{"ro":["Astăzi este luni.","Astăzi este marți.","Ieri a fost luni.","Astăzi este weekend."],"en":["Today is Monday.","Today is Tuesday.","Yesterday was Monday.","Today is the weekend."]},"correct":{"ro":"Astăzi este luni.","en":"Today is Monday."}},
    # T1-10 ((으)로)
    {"lessonId":"T1-10","topik":1,"q":"오른쪽으로 가세요.","answers":{"ro":["Mergeți la dreapta.","Mergeți la stânga.","Mergeți înainte.","Mergeți înapoi."],"en":["Go to the right.","Go to the left.","Go straight ahead.","Go back."]},"correct":{"ro":"Mergeți la dreapta.","en":"Go to the right."}},
    {"lessonId":"T1-10","topik":1,"q":"젓가락으로 먹어요.","answers":{"ro":["Mănânc cu bețișoare.","Mănânc cu lingura.","Mănânc cu furculița.","Mănânc cu mâinile."],"en":["I eat with chopsticks.","I eat with a spoon.","I eat with a fork.","I eat with my hands."]},"correct":{"ro":"Mănânc cu bețișoare.","en":"I eat with chopsticks."}},
    # T1-11 ((이)나)
    {"lessonId":"T1-11","topik":1,"q":"사과나 배를 드세요.","answers":{"ro":["Luați un măr sau o pară.","Luați un măr și o pară.","Mâncați mere.","Nu luați fructe."],"en":["Please have an apple or a pear.","Please have an apple and a pear.","Eat apples.","Don't take any fruit."]},"correct":{"ro":"Luați un măr sau o pară.","en":"Please have an apple or a pear."}},
    {"lessonId":"T1-11","topik":1,"q":"내일이나 모레 만나요.","answers":{"ro":["Ne vedem mâine sau poimâine.","Ne vedem mâine și poimâine.","Nu ne vedem mâine.","Ne-am văzut ieri sau alaltăieri."],"en":["Let's meet tomorrow or the day after.","Let's meet tomorrow and the day after.","We won't meet tomorrow.","We met yesterday or the day before."]},"correct":{"ro":"Ne vedem mâine sau poimâine.","en":"Let's meet tomorrow or the day after."}},
    # T1-12 (-(으)세요)
    {"lessonId":"T1-12","topik":1,"q":"이쪽으로 오세요.","answers":{"ro":["Veniți pe aici.","Mergeți pe acolo.","Plecați pe aici.","Stați pe loc."],"en":["Come this way.","Go that way.","Leave this way.","Stay in place."]},"correct":{"ro":"Veniți pe aici.","en":"Come this way."}},
    {"lessonId":"T1-12","topik":1,"q":"문을 닫으세요.","answers":{"ro":["Închideți ușa.","Deschideți ușa.","Bateți la ușă.","Nu atingeți ușa."],"en":["Please close the door.","Please open the door.","Please knock on the door.","Do not touch the door."]},"correct":{"ro":"Închideți ușa.","en":"Please close the door."}},
    # T1-13 (-(으)ㄹ까요?)
    {"lessonId":"T1-13","topik":1,"q":"커피를 마실까요?","answers":{"ro":["Vrem să bem cafea?","Vrei să bei cafea?","Cumpărăm cafea?","Îți place cafeaua?"],"en":["Shall we drink coffee?","Do you want to drink coffee?","Shall we buy coffee?","Do you like coffee?"]},"correct":{"ro":"Vrem să bem cafea?","en":"Shall we drink coffee?"}},
    {"lessonId":"T1-13","topik":1,"q":"내일 만날까요?","answers":{"ro":["Să ne vedem mâine?","Ne vedem mâine.","Putem să ne vedem mâine?","Vrei să ne vedem mâine?"],"en":["Shall we meet tomorrow?","We will meet tomorrow.","Can we meet tomorrow?","Do you want to meet tomorrow?"]},"correct":{"ro":"Să ne vedem mâine?","en":"Shall we meet tomorrow?"}},
]

# ============================================================
# RO-KO exercises
# ============================================================
new_roko = [
    # T1-01
    {"lessonId":"T1-01","topik":1,"prompt":{"ro":"Mâncarea este delicioasă.","en":"The food is delicious."},"options":["음식은 맛있어요.","음식이 맛있어요.","음식도 맛있어요.","음식의 맛있어요."],"correct":"음식은 맛있어요."},
    {"lessonId":"T1-01","topik":1,"prompt":{"ro":"Vremea este bună.","en":"The weather is nice."},"options":["날씨는 좋아요.","날씨가 좋아요.","날씨도 좋아요.","날씨의 좋아요."],"correct":"날씨는 좋아요."},
    # T1-02
    {"lessonId":"T1-02","topik":1,"prompt":{"ro":"Floarea este frumoasă.","en":"The flower is pretty."},"options":["꽃이 예뻐요.","꽃은 예뻐요.","꽃도 예뻐요.","꽃을 예뻐요."],"correct":"꽃이 예뻐요."},
    {"lessonId":"T1-02","topik":1,"prompt":{"ro":"Pisica doarme.","en":"The cat is sleeping."},"options":["고양이가 자요.","고양이는 자요.","고양이도 자요.","고양이를 자요."],"correct":"고양이가 자요."},
    # T1-03
    {"lessonId":"T1-03","topik":1,"prompt":{"ro":"Ascult muzică.","en":"I listen to music."},"options":["음악을 들어요.","음악이 들어요.","음악은 들어요.","음악도 들어요."],"correct":"음악을 들어요."},
    {"lessonId":"T1-03","topik":1,"prompt":{"ro":"Mă uit la film.","en":"I watch a movie."},"options":["영화를 봐요.","영화가 봐요.","영화도 봐요.","영화는 봐요."],"correct":"영화를 봐요."},
    # T1-04
    {"lessonId":"T1-04","topik":1,"prompt":{"ro":"Sunt acasă.","en":"I am at home."},"options":["집에 있어요.","집에서 있어요.","집이 있어요.","집을 있어요."],"correct":"집에 있어요."},
    {"lessonId":"T1-04","topik":1,"prompt":{"ro":"Lucrez la cafenea.","en":"I work at a café."},"options":["카페에서 일해요.","카페에 일해요.","카페가 일해요.","카페를 일해요."],"correct":"카페에서 일해요."},
    # T1-05
    {"lessonId":"T1-05","topik":1,"prompt":{"ro":"Și coreeana o învăț.","en":"I also learn Korean."},"options":["한국어도 배워요.","한국어를 배워요.","한국어가 배워요.","한국어는 배워요."],"correct":"한국어도 배워요."},
    {"lessonId":"T1-05","topik":1,"prompt":{"ro":"Și azi sunt fericit/ă.","en":"I am happy today too."},"options":["오늘도 행복해요.","오늘은 행복해요.","오늘이 행복해요.","오늘을 행복해요."],"correct":"오늘도 행복해요."},
    # T1-06
    {"lessonId":"T1-06","topik":1,"prompt":{"ro":"Este cartea profesorului.","en":"It is the teacher's book."},"options":["선생님의 책이에요.","선생님은 책이에요.","선생님이 책이에요.","선생님에 책이에요."],"correct":"선생님의 책이에요."},
    {"lessonId":"T1-06","topik":1,"prompt":{"ro":"Numele fratelui meu este Minjun.","en":"My younger sibling's name is Minjun."},"options":["제 동생의 이름은 민준이에요.","제 동생이 이름은 민준이에요.","제 동생을 이름은 민준이에요.","제 동생에 이름은 민준이에요."],"correct":"제 동생의 이름은 민준이에요."},
    # T1-07
    {"lessonId":"T1-07","topik":1,"prompt":{"ro":"Nu vorbesc coreeana.","en":"I don't speak Korean."},"options":["한국어를 안 해요.","한국어를 못 해요.","한국어는 안 해요.","한국어가 안 해요."],"correct":"한국어를 안 해요."},
    {"lessonId":"T1-07","topik":1,"prompt":{"ro":"Nu știu să cânt.","en":"I can't sing."},"options":["노래를 못 해요.","노래를 안 해요.","노래는 못 해요.","노래가 못 해요."],"correct":"노래를 못 해요."},
    # T1-08
    {"lessonId":"T1-08","topik":1,"prompt":{"ro":"Există mama și tata.","en":"There is mom and dad."},"options":["엄마와 아빠가 있어요.","엄마하고 아빠가 있어요.","엄마과 아빠가 있어요.","엄마도 아빠가 있어요."],"correct":"엄마와 아빠가 있어요."},
    {"lessonId":"T1-08","topik":1,"prompt":{"ro":"Cumpăr pâine și lapte.","en":"I buy bread and milk."},"options":["빵과 우유를 사요.","빵하고 우유를 사요.","빵이 우유를 사요.","빵와 우유를 사요."],"correct":"빵과 우유를 사요."},
    # T1-09
    {"lessonId":"T1-09","topik":1,"prompt":{"ro":"Prietenul meu este doctor.","en":"My friend is a doctor."},"options":["제 친구는 의사예요.","제 친구가 의사예요.","제 친구이 의사예요.","제 친구의 의사예요."],"correct":"제 친구는 의사예요."},
    {"lessonId":"T1-09","topik":1,"prompt":{"ro":"Astăzi este luni.","en":"Today is Monday."},"options":["오늘은 월요일이에요.","오늘이 월요일이에요.","오늘도 월요일이에요.","오늘을 월요일이에요."],"correct":"오늘은 월요일이에요."},
    # T1-10
    {"lessonId":"T1-10","topik":1,"prompt":{"ro":"Mergeți la dreapta.","en":"Go to the right."},"options":["오른쪽으로 가세요.","오른쪽에 가세요.","오른쪽에서 가세요.","오른쪽을 가세요."],"correct":"오른쪽으로 가세요."},
    {"lessonId":"T1-10","topik":1,"prompt":{"ro":"Mănânc cu bețișoare.","en":"I eat with chopsticks."},"options":["젓가락으로 먹어요.","젓가락에 먹어요.","젓가락을 먹어요.","젓가락이 먹어요."],"correct":"젓가락으로 먹어요."},
    # T1-11
    {"lessonId":"T1-11","topik":1,"prompt":{"ro":"Luați un măr sau o pară.","en":"Please have an apple or a pear."},"options":["사과나 배를 드세요.","사과이나 배를 드세요.","사과와 배를 드세요.","사과도 배를 드세요."],"correct":"사과나 배를 드세요."},
    {"lessonId":"T1-11","topik":1,"prompt":{"ro":"Ne vedem mâine sau poimâine.","en":"Let's meet tomorrow or the day after."},"options":["내일이나 모레 만나요.","내일나 모레 만나요.","내일과 모레 만나요.","내일도 모레 만나요."],"correct":"내일이나 모레 만나요."},
    # T1-12
    {"lessonId":"T1-12","topik":1,"prompt":{"ro":"Veniți pe aici.","en":"Come this way."},"options":["이쪽으로 오세요.","이쪽에 오세요.","이쪽에서 오세요.","이쪽을 오세요."],"correct":"이쪽으로 오세요."},
    {"lessonId":"T1-12","topik":1,"prompt":{"ro":"Închideți ușa.","en":"Please close the door."},"options":["문을 닫으세요.","문을 닫아요.","문이 닫으세요.","문은 닫으세요."],"correct":"문을 닫으세요."},
    # T1-13
    {"lessonId":"T1-13","topik":1,"prompt":{"ro":"Vrem să bem cafea?","en":"Shall we drink coffee?"},"options":["커피를 마실까요?","커피를 마셔요?","커피를 마십니까?","커피를 마시겠어요?"],"correct":"커피를 마실까요?"},
    {"lessonId":"T1-13","topik":1,"prompt":{"ro":"Să ne vedem mâine?","en":"Shall we meet tomorrow?"},"options":["내일 만날까요?","내일 만나요?","내일 만납니까?","내일 만나겠어요?"],"correct":"내일 만날까요?"},
]

# ============================================================
# PARTICLE exercises
# ============================================================
new_particle = [
    # T1-01
    {"lessonId":"T1-01","topik":1,"template":"음식___ 맛있어요.","options":["은","이","을","도"],"correct":"은","hint":{"ro":"음식 받침ㄱ → 은 (marcator topic)","en":"음식 batchim ㄱ → 은 (topic marker)"}},
    {"lessonId":"T1-01","topik":1,"template":"날씨___ 좋아요.","options":["는","이","를","도"],"correct":"는","hint":{"ro":"날씨 fără받침 → 는 (marcator topic)","en":"날씨 no batchim → 는 (topic marker)"}},
    # T1-02
    {"lessonId":"T1-02","topik":1,"template":"꽃___ 예뻐요.","options":["이","은","을","도"],"correct":"이","hint":{"ro":"꽃 받침ㅊ → 이 (marcator subiect)","en":"꽃 batchim ㅊ → 이 (subject marker)"}},
    {"lessonId":"T1-02","topik":1,"template":"고양이___ 자요.","options":["가","는","를","도"],"correct":"가","hint":{"ro":"고양이 fără받침 → 가 (marcator subiect)","en":"고양이 no batchim → 가 (subject marker)"}},
    # T1-03
    {"lessonId":"T1-03","topik":1,"template":"음악___ 들어요.","options":["을","이","은","도"],"correct":"을","hint":{"ro":"음악 받침ㄱ → 을 (obiect direct)","en":"음악 batchim ㄱ → 을 (direct object)"}},
    {"lessonId":"T1-03","topik":1,"template":"영화___ 봐요.","options":["를","가","는","도"],"correct":"를","hint":{"ro":"영화 fără받침 → 를 (obiect direct)","en":"영화 no batchim → 를 (direct object)"}},
    # T1-04
    {"lessonId":"T1-04","topik":1,"template":"집___ 있어요.","options":["에","에서","이","을"],"correct":"에","hint":{"ro":"집 → 에 (locație statică: a fi)","en":"집 → 에 (static location: to be)"}},
    {"lessonId":"T1-04","topik":1,"template":"카페___ 일해요.","options":["에서","에","가","를"],"correct":"에서","hint":{"ro":"카페 → 에서 (locul unde are loc acțiunea)","en":"카페 → 에서 (location where action takes place)"}},
    # T1-05
    {"lessonId":"T1-05","topik":1,"template":"한국어___ 배워요.","options":["도","를","는","가"],"correct":"도","hint":{"ro":"한국어 → 도 (de asemenea, și)","en":"한국어 → 도 (also, too)"}},
    {"lessonId":"T1-05","topik":1,"template":"오늘___ 행복해요.","options":["도","은","이","를"],"correct":"도","hint":{"ro":"오늘 → 도 (și azi, de asemenea)","en":"오늘 → 도 (today too, also)"}},
    # T1-06
    {"lessonId":"T1-06","topik":1,"template":"선생님___ 책이에요.","options":["의","은","이","에"],"correct":"의","hint":{"ro":"선생님 → 의 (posesie)","en":"선생님 → 의 (possession)"}},
    {"lessonId":"T1-06","topik":1,"template":"제 동생___ 이름은 민준이에요.","options":["의","이","은","를"],"correct":"의","hint":{"ro":"동생 → 의 (posesie)","en":"동생 → 의 (possession)"}},
    # T1-07
    {"lessonId":"T1-07","topik":1,"template":"한국어___ 안 해요.","options":["를","이","은","에"],"correct":"를","hint":{"ro":"한국어 fără받침 → 를 (obiect direct)","en":"한국어 no batchim → 를 (direct object)"}},
    {"lessonId":"T1-07","topik":1,"template":"노래___ 못 해요.","options":["를","이","은","에"],"correct":"를","hint":{"ro":"노래 fără받침 → 를 (obiect direct)","en":"노래 no batchim → 를 (direct object)"}},
    # T1-08
    {"lessonId":"T1-08","topik":1,"template":"엄마___ 아빠가 있어요.","options":["와","과","하고","도"],"correct":"와","hint":{"ro":"엄마 fără받침 → 와 (și, cu)","en":"엄마 no batchim → 와 (and, with)"}},
    {"lessonId":"T1-08","topik":1,"template":"빵___ 우유를 사요.","options":["과","와","하고","도"],"correct":"과","hint":{"ro":"빵 받침ㅇ → 과 (și, cu)","en":"빵 batchim ㅇ → 과 (and, with)"}},
    # T1-09
    {"lessonId":"T1-09","topik":1,"template":"제 친구___ 의사예요.","options":["는","이","가","도"],"correct":"는","hint":{"ro":"친구 fără받침 → 는 (marcator topic)","en":"친구 no batchim → 는 (topic marker)"}},
    {"lessonId":"T1-09","topik":1,"template":"오늘___ 월요일이에요.","options":["은","이","도","를"],"correct":"은","hint":{"ro":"오늘 받침ㄹ → 은 (marcator topic)","en":"오늘 batchim ㄹ → 은 (topic marker)"}},
    # T1-10
    {"lessonId":"T1-10","topik":1,"template":"오른쪽___ 가세요.","options":["으로","에","에서","를"],"correct":"으로","hint":{"ro":"오른쪽 받침ㄱ → 으로 (direcție)","en":"오른쪽 batchim ㄱ → 으로 (direction)"}},
    {"lessonId":"T1-10","topik":1,"template":"젓가락___ 먹어요.","options":["으로","로","을","이"],"correct":"으로","hint":{"ro":"젓가락 받침ㄱ → 으로 (instrument)","en":"젓가락 batchim ㄱ → 으로 (instrument/means)"}},
    # T1-11
    {"lessonId":"T1-11","topik":1,"template":"사과___ 배를 드세요.","options":["나","이나","와","도"],"correct":"나","hint":{"ro":"사과 fără받침 → 나 (sau, oricare)","en":"사과 no batchim → 나 (or, either)"}},
    {"lessonId":"T1-11","topik":1,"template":"내일___ 모레 만나요.","options":["이나","나","과","도"],"correct":"이나","hint":{"ro":"내일 받침ㄹ → 이나 (sau, oricare)","en":"내일 batchim ㄹ → 이나 (or, either)"}},
    # T1-12
    {"lessonId":"T1-12","topik":1,"template":"이쪽___ 오세요.","options":["으로","에","에서","를"],"correct":"으로","hint":{"ro":"이쪽 받침ㄱ → 으로 (direcție)","en":"이쪽 batchim ㄱ → 으로 (direction)"}},
    {"lessonId":"T1-12","topik":1,"template":"문___ 닫으세요.","options":["을","이","은","도"],"correct":"을","hint":{"ro":"문 받침ㄴ → 을 (obiect direct)","en":"문 batchim ㄴ → 을 (direct object)"}},
    # T1-13
    {"lessonId":"T1-13","topik":1,"template":"커피___ 마실까요?","options":["를","이","은","도"],"correct":"를","hint":{"ro":"커피 fără받침 → 를 (obiect direct)","en":"커피 no batchim → 를 (direct object)"}},
    {"lessonId":"T1-13","topik":1,"template":"내일 어디___ 갈까요?","options":["에","에서","를","이"],"correct":"에","hint":{"ro":"어디 → 에 (destinație)","en":"어디 → 에 (destination)"}},
]

# ============================================================
# PARTICLEPLUS exercises
# ============================================================
new_particleplus = [
    # T1-01
    {"lessonId":"T1-01","topik":1,"template":"음식___ 맛있고 음료수___ 시원해요.","options":[["은","는"],["는","도"],["이","가"],["은","가"]],"correct":["은","는"],"hint":{"ro":"음식 받침ㄱ→은 (topic) + 음료수 fără받침→는 (topic)","en":"음식 batchim ㄱ→은 (topic) + 음료수 no batchim→는 (topic)"}},
    {"lessonId":"T1-01","topik":1,"template":"날씨___ 좋고 기분___ 상쾌해요.","options":[["는","도"],["은","가"],["도","도"],["가","이"]],"correct":["는","도"],"hint":{"ro":"날씨 fără받침→는 (topic) + 기분 받침ㄴ→도 (de asemenea)","en":"날씨 no batchim→는 (topic) + 기분 batchim ㄴ→도 (also)"}},
    # T1-02
    {"lessonId":"T1-02","topik":1,"template":"꽃___ 예쁘고 향기___ 좋아요.","options":[["이","도"],["가","는"],["이","가"],["은","도"]],"correct":["이","도"],"hint":{"ro":"꽃 받침ㅊ→이 (subiect) + 향기 fără받침→도 (de asemenea)","en":"꽃 batchim ㅊ→이 (subject) + 향기 no batchim→도 (also)"}},
    {"lessonId":"T1-02","topik":1,"template":"고양이___ 자고 강아지___ 놀아요.","options":[["가","도"],["는","도"],["이","도"],["가","가"]],"correct":["가","도"],"hint":{"ro":"고양이 fără받침→가 (subiect) + 강아지 fără받침→도 (de asemenea)","en":"고양이 no batchim→가 (subject) + 강아지 no batchim→도 (also)"}},
    # T1-03
    {"lessonId":"T1-03","topik":1,"template":"음악___ 듣고 책___ 읽어요.","options":[["을","도"],["를","도"],["을","을"],["이","을"]],"correct":["을","도"],"hint":{"ro":"음악 받침ㄱ→을 (obiect) + 책 받침ㄱ→도 (de asemenea)","en":"음악 batchim ㄱ→을 (object) + 책 batchim ㄱ→도 (also)"}},
    {"lessonId":"T1-03","topik":1,"template":"영화___ 보고 팝콘___ 먹어요.","options":[["를","도"],["이","을"],["를","을"],["가","도"]],"correct":["를","도"],"hint":{"ro":"영화 fără받침→를 (obiect) + 팝콘 받침ㄴ→도 (de asemenea)","en":"영화 no batchim→를 (object) + 팝콘 batchim ㄴ→도 (also)"}},
    # T1-04
    {"lessonId":"T1-04","topik":1,"template":"집___ 있고 공원___ 가요.","options":[["에","에"],["에서","에"],["이","에"],["에","에서"]],"correct":["에","에"],"hint":{"ro":"집 → 에 (existență statică) + 공원 → 에 (destinație)","en":"집 → 에 (static existence) + 공원 → 에 (destination)"}},
    {"lessonId":"T1-04","topik":1,"template":"학교___ 공부하고 카페___ 일해요.","options":[["에서","에서"],["에","에"],["에서","에"],["에","에서"]],"correct":["에서","에서"],"hint":{"ro":"학교 → 에서 (loc de acțiune) + 카페 → 에서 (loc de acțiune)","en":"학교 → 에서 (action location) + 카페 → 에서 (action location)"}},
    # T1-05
    {"lessonId":"T1-05","topik":1,"template":"한국어___ 배우고 일본어___ 배워요.","options":[["를","도"],["이","도"],["를","가"],["은","도"]],"correct":["를","도"],"hint":{"ro":"한국어 fără받침→를 (obiect) + 일본어 fără받침→도 (de asemenea)","en":"한국어 no batchim→를 (object) + 일본어 no batchim→도 (also)"}},
    {"lessonId":"T1-05","topik":1,"template":"어제___ 행복하고 오늘___ 행복해요.","options":[["도","도"],["은","는"],["이","가"],["를","도"]],"correct":["도","도"],"hint":{"ro":"어제 → 도 (de asemenea) + 오늘 → 도 (de asemenea)","en":"어제 → 도 (also) + 오늘 → 도 (also)"}},
    # T1-06
    {"lessonId":"T1-06","topik":1,"template":"선생님___ 책___ 재미있어요.","options":[["의","이"],["은","이"],["의","가"],["이","이"]],"correct":["의","이"],"hint":{"ro":"선생님 fără받침→의 (posesie) + 책 받침ㄱ→이 (subiect)","en":"선생님 no batchim→의 (possession) + 책 batchim ㄱ→이 (subject)"}},
    {"lessonId":"T1-06","topik":1,"template":"제 동생___ 이름___ 민준이에요.","options":[["의","은"],["이","은"],["의","이"],["은","은"]],"correct":["의","은"],"hint":{"ro":"동생 받침ㅇ→의 (posesie) + 이름 받침ㅁ→은 (topic)","en":"동생 batchim ㅇ→의 (possession) + 이름 batchim ㅁ→은 (topic)"}},
    # T1-07
    {"lessonId":"T1-07","topik":1,"template":"한국어___ 안 하고 영어___ 안 해요.","options":[["를","도"],["이","도"],["은","도"],["를","를"]],"correct":["를","도"],"hint":{"ro":"한국어 fără받침→를 (obiect) + 영어 fără받침→도 (de asemenea)","en":"한국어 no batchim→를 (object) + 영어 no batchim→도 (also)"}},
    {"lessonId":"T1-07","topik":1,"template":"노래___ 못 하고 춤___ 못 춰요.","options":[["를","도"],["이","도"],["은","도"],["를","를"]],"correct":["를","도"],"hint":{"ro":"노래 fără받침→를 (obiect) + 춤 받침ㅁ→도 (de asemenea)","en":"노래 no batchim→를 (object) + 춤 batchim ㅁ→도 (also)"}},
    # T1-08
    {"lessonId":"T1-08","topik":1,"template":"엄마___ 아빠___ 좋아해요.","options":[["와","를"],["과","를"],["하고","를"],["와","이"]],"correct":["와","를"],"hint":{"ro":"엄마 fără받침→와 (și) + 아빠 fără받침→를 (obiect)","en":"엄마 no batchim→와 (and) + 아빠 no batchim→를 (object)"}},
    {"lessonId":"T1-08","topik":1,"template":"빵___ 우유___ 사요.","options":[["과","를"],["와","를"],["하고","를"],["과","이"]],"correct":["과","를"],"hint":{"ro":"빵 받침ㅇ→과 (și) + 우유 fără받침→를 (obiect)","en":"빵 batchim ㅇ→과 (and) + 우유 no batchim→를 (object)"}},
    # T1-09
    {"lessonId":"T1-09","topik":1,"template":"친구___ 의사고 저___ 학생이에요.","options":[["는","는"],["가","가"],["이","이"],["의","의"]],"correct":["는","는"],"hint":{"ro":"친구 fără받침→는 (topic) + 저 fără받침→는 (topic)","en":"친구 no batchim→는 (topic) + 저 no batchim→는 (topic)"}},
    {"lessonId":"T1-09","topik":1,"template":"오늘___ 월요일이고 내일___ 화요일이에요.","options":[["은","은"],["이","이"],["도","도"],["가","가"]],"correct":["은","은"],"hint":{"ro":"오늘 받침ㄹ→은 (topic) + 내일 받침ㄹ→은 (topic)","en":"오늘 batchim ㄹ→은 (topic) + 내일 batchim ㄹ→은 (topic)"}},
    # T1-10
    {"lessonId":"T1-10","topik":1,"template":"왼쪽___ 가지 말고 오른쪽___ 가세요.","options":[["으로","으로"],["에","에"],["에서","에서"],["로","로"]],"correct":["으로","으로"],"hint":{"ro":"왼쪽 받침ㄱ→으로 (direcție) + 오른쪽 받침ㄱ→으로 (direcție)","en":"왼쪽 batchim ㄱ→으로 (direction) + 오른쪽 batchim ㄱ→으로 (direction)"}},
    {"lessonId":"T1-10","topik":1,"template":"손___ 먹지 말고 젓가락___ 먹어요.","options":[["으로","으로"],["이","이"],["에","에"],["로","으로"]],"correct":["으로","으로"],"hint":{"ro":"손 받침ㄴ→으로 (instrument) + 젓가락 받침ㄱ→으로 (instrument)","en":"손 batchim ㄴ→으로 (instrument) + 젓가락 batchim ㄱ→으로 (instrument)"}},
    # T1-11
    {"lessonId":"T1-11","topik":1,"template":"사과___ 배___ 드세요.","options":[["나","를"],["이나","를"],["와","를"],["나","이"]],"correct":["나","를"],"hint":{"ro":"사과 fără받침→나 (sau) + 배 fără받침→를 (obiect)","en":"사과 no batchim→나 (or) + 배 no batchim→를 (object)"}},
    {"lessonId":"T1-11","topik":1,"template":"사탕___ 초콜릿___ 먹어요.","options":[["이나","를"],["나","를"],["와","를"],["이나","이"]],"correct":["이나","를"],"hint":{"ro":"사탕 받침ㅇ→이나 (sau) + 초콜릿 받침ㅅ→를 (obiect)","en":"사탕 batchim ㅇ→이나 (or) + 초콜릿 batchim ㅅ→를 (object)"}},
    # T1-12
    {"lessonId":"T1-12","topik":1,"template":"이쪽___ 오시고 저쪽___ 가세요.","options":[["으로","으로"],["에","에"],["에서","에서"],["로","로"]],"correct":["으로","으로"],"hint":{"ro":"이쪽 받침ㄱ→으로 (direcție) + 저쪽 받침ㄱ→으로 (direcție)","en":"이쪽 batchim ㄱ→으로 (direction) + 저쪽 batchim ㄱ→으로 (direction)"}},
    {"lessonId":"T1-12","topik":1,"template":"문___ 닫고 창문___ 여세요.","options":[["을","도"],["이","도"],["은","도"],["를","도"]],"correct":["을","도"],"hint":{"ro":"문 받침ㄴ→을 (obiect) + 창문 받침ㄴ→도 (de asemenea)","en":"문 batchim ㄴ→을 (object) + 창문 batchim ㄴ→도 (also)"}},
    # T1-13
    {"lessonId":"T1-13","topik":1,"template":"커피___ 마실까요, 차___ 마실까요?","options":[["를","를"],["이","이"],["은","은"],["가","가"]],"correct":["를","를"],"hint":{"ro":"커피 fără받침→를 (obiect) + 차 fără받침→를 (obiect)","en":"커피 no batchim→를 (object) + 차 no batchim→를 (object)"}},
    {"lessonId":"T1-13","topik":1,"template":"내일 친구___ 만날까요, 집___ 있을까요?","options":[["를","에"],["이","에"],["은","에"],["가","에서"]],"correct":["를","에"],"hint":{"ro":"친구 fără받침→를 (obiect) + 집 받침ㅂ→에 (locație)","en":"친구 no batchim→를 (object) + 집 batchim ㅂ→에 (location)"}},
]

# ============================================================
# CONJUG exercises
# ============================================================
new_conjug = [
    # T1-01
    {"lessonId":"T1-01","topik":1,"prompt":{"ro":"맛있다 → prezent politicos","en":"맛있다 → present polite"},"options":["맛있어요","맛있아요","맛있습니다","맛이에요"],"correct":"맛있어요"},
    {"lessonId":"T1-01","topik":1,"prompt":{"ro":"좋다 → prezent politicos","en":"좋다 → present polite"},"options":["좋아요","좋어요","좋습니다","조아요"],"correct":"좋아요"},
    # T1-02
    {"lessonId":"T1-02","topik":1,"prompt":{"ro":"예쁘다 → prezent politicos (neregulat ㅡ)","en":"예쁘다 → present polite (ㅡ irregular)"},"options":["예뻐요","예쁘어요","예쁘아요","예쁩니다"],"correct":"예뻐요"},
    {"lessonId":"T1-02","topik":1,"prompt":{"ro":"자다 → prezent politicos","en":"자다 → present polite"},"options":["자요","잠자요","자아요","잡니다"],"correct":"자요"},
    # T1-03
    {"lessonId":"T1-03","topik":1,"prompt":{"ro":"듣다 → prezent politicos (neregulat ㄷ)","en":"듣다 → present polite (ㄷ irregular)"},"options":["들어요","듣어요","듣아요","듣습니다"],"correct":"들어요"},
    {"lessonId":"T1-03","topik":1,"prompt":{"ro":"보다 → prezent politicos","en":"보다 → present polite"},"options":["봐요","보아요","봅니다","보요"],"correct":"봐요"},
    # T1-04
    {"lessonId":"T1-04","topik":1,"prompt":{"ro":"있다 → prezent politicos","en":"있다 → present polite"},"options":["있어요","있아요","있습니다","이에요"],"correct":"있어요"},
    {"lessonId":"T1-04","topik":1,"prompt":{"ro":"일하다 → prezent politicos","en":"일하다 → present polite"},"options":["일해요","일하아요","일하여요","일합니다"],"correct":"일해요"},
    # T1-05
    {"lessonId":"T1-05","topik":1,"prompt":{"ro":"배우다 → prezent politicos","en":"배우다 → present polite"},"options":["배워요","배우어요","배우아요","배웁니다"],"correct":"배워요"},
    {"lessonId":"T1-05","topik":1,"prompt":{"ro":"행복하다 → prezent politicos","en":"행복하다 → present polite"},"options":["행복해요","행복하아요","행복하여요","행복합니다"],"correct":"행복해요"},
    # T1-06
    {"lessonId":"T1-06","topik":1,"prompt":{"ro":"책 + 이에요/예요 → forma corectă","en":"책 + 이에요/예요 → correct form"},"options":["책이에요","책예요","책에요","책이야"],"correct":"책이에요"},
    {"lessonId":"T1-06","topik":1,"prompt":{"ro":"이름 + 이에요/예요 → forma corectă","en":"이름 + 이에요/예요 → correct form"},"options":["이름이에요","이름예요","이름에요","이름이야"],"correct":"이름이에요"},
    # T1-07
    {"lessonId":"T1-07","topik":1,"prompt":{"ro":"하다 → negație prezent (안)","en":"하다 → present negation (안)"},"options":["안 해요","안 하아요","안 하여요","안 합니다"],"correct":"안 해요"},
    {"lessonId":"T1-07","topik":1,"prompt":{"ro":"하다 → imposibilitate prezent (못)","en":"하다 → present inability (못)"},"options":["못 해요","못 하아요","못 하여요","못 합니다"],"correct":"못 해요"},
    # T1-08
    {"lessonId":"T1-08","topik":1,"prompt":{"ro":"사다 → prezent politicos","en":"사다 → present polite"},"options":["사요","사아요","삽니다","샀어요"],"correct":"사요"},
    {"lessonId":"T1-08","topik":1,"prompt":{"ro":"먹다 → prezent politicos","en":"먹다 → present polite"},"options":["먹어요","먹아요","먹습니다","먹요"],"correct":"먹어요"},
    # T1-09
    {"lessonId":"T1-09","topik":1,"prompt":{"ro":"의사 + 이에요/예요 → forma corectă (fără받침)","en":"의사 + 이에요/예요 → correct form (no batchim)"},"options":["의사예요","의사이에요","의사에요","의사야요"],"correct":"의사예요"},
    {"lessonId":"T1-09","topik":1,"prompt":{"ro":"월요일 + 이에요/예요 → forma corectă (cu받침)","en":"월요일 + 이에요/예요 → correct form (with batchim)"},"options":["월요일이에요","월요일예요","월요일에요","월요일이야요"],"correct":"월요일이에요"},
    # T1-10
    {"lessonId":"T1-10","topik":1,"prompt":{"ro":"가다 → imperativ politicos -(으)세요","en":"가다 → polite imperative -(으)세요"},"options":["가세요","가으세요","갑세요","가시요"],"correct":"가세요"},
    {"lessonId":"T1-10","topik":1,"prompt":{"ro":"오다 → imperativ politicos -(으)세요","en":"오다 → polite imperative -(으)세요"},"options":["오세요","오으세요","옵세요","오시요"],"correct":"오세요"},
    # T1-11
    {"lessonId":"T1-11","topik":1,"prompt":{"ro":"드시다 → imperativ politicos -(으)세요","en":"드시다 → polite imperative -(으)세요"},"options":["드세요","드시세요","드시어요","드십시요"],"correct":"드세요"},
    {"lessonId":"T1-11","topik":1,"prompt":{"ro":"만나다 → prezent politicos","en":"만나다 → present polite"},"options":["만나요","만나아요","만납니다","만났어요"],"correct":"만나요"},
    # T1-12
    {"lessonId":"T1-12","topik":1,"prompt":{"ro":"닫다 → imperativ politicos -(으)세요","en":"닫다 → polite imperative -(으)세요"},"options":["닫으세요","닫세요","닫으시요","닫습시요"],"correct":"닫으세요"},
    {"lessonId":"T1-12","topik":1,"prompt":{"ro":"열다 → imperativ politicos -(으)세요 (neregulat ㄹ)","en":"열다 → polite imperative -(으)세요 (ㄹ irregular)"},"options":["여세요","열으세요","열세요","열어세요"],"correct":"여세요"},
    # T1-13
    {"lessonId":"T1-13","topik":1,"prompt":{"ro":"마시다 → -(으)ㄹ까요? (propunere)","en":"마시다 → -(으)ㄹ까요? (suggestion)"},"options":["마실까요?","마시을까요?","마시까요?","마시ㄹ까요?"],"correct":"마실까요?"},
    {"lessonId":"T1-13","topik":1,"prompt":{"ro":"만나다 → -(으)ㄹ까요? (propunere)","en":"만나다 → -(으)ㄹ까요? (suggestion)"},"options":["만날까요?","만나을까요?","만나까요?","만나ㄹ까요?"],"correct":"만날까요?"},
]

# ============================================================
# PUZZLE exercises
# ============================================================
new_puzzle = [
    # T1-01
    {"lessonId":"T1-01","topik":1,"tiles":["맛있어요","음식은"],"correct":["음식은","맛있어요"],"hint":{"ro":"Mâncarea este delicioasă.","en":"The food is delicious."}},
    {"lessonId":"T1-01","topik":1,"tiles":["좋아요","날씨는"],"correct":["날씨는","좋아요"],"hint":{"ro":"Vremea este bună.","en":"The weather is nice."}},
    # T1-02
    {"lessonId":"T1-02","topik":1,"tiles":["예뻐요","꽃이"],"correct":["꽃이","예뻐요"],"hint":{"ro":"Floarea este frumoasă.","en":"The flower is pretty."}},
    {"lessonId":"T1-02","topik":1,"tiles":["자요","고양이가"],"correct":["고양이가","자요"],"hint":{"ro":"Pisica doarme.","en":"The cat is sleeping."}},
    # T1-03
    {"lessonId":"T1-03","topik":1,"tiles":["들어요","음악을"],"correct":["음악을","들어요"],"hint":{"ro":"Ascult muzică.","en":"I listen to music."}},
    {"lessonId":"T1-03","topik":1,"tiles":["봐요","영화를"],"correct":["영화를","봐요"],"hint":{"ro":"Mă uit la film.","en":"I watch a movie."}},
    # T1-04
    {"lessonId":"T1-04","topik":1,"tiles":["있어요","집에"],"correct":["집에","있어요"],"hint":{"ro":"Sunt acasă.","en":"I am at home."}},
    {"lessonId":"T1-04","topik":1,"tiles":["일해요","카페에서"],"correct":["카페에서","일해요"],"hint":{"ro":"Lucrez la cafenea.","en":"I work at a café."}},
    # T1-05
    {"lessonId":"T1-05","topik":1,"tiles":["배워요","한국어도"],"correct":["한국어도","배워요"],"hint":{"ro":"Și coreeana o învăț.","en":"I also learn Korean."}},
    {"lessonId":"T1-05","topik":1,"tiles":["행복해요","오늘도"],"correct":["오늘도","행복해요"],"hint":{"ro":"Și azi sunt fericit/ă.","en":"I am happy today too."}},
    # T1-06
    {"lessonId":"T1-06","topik":1,"tiles":["책이에요","선생님의"],"correct":["선생님의","책이에요"],"hint":{"ro":"Este cartea profesorului.","en":"It is the teacher's book."}},
    {"lessonId":"T1-06","topik":1,"tiles":["민준이에요","이름은","제 동생의"],"correct":["제 동생의","이름은","민준이에요"],"hint":{"ro":"Numele fratelui meu este Minjun.","en":"My younger sibling's name is Minjun."}},
    # T1-07
    {"lessonId":"T1-07","topik":1,"tiles":["안 해요","한국어를"],"correct":["한국어를","안 해요"],"hint":{"ro":"Nu vorbesc coreeana.","en":"I don't speak Korean."}},
    {"lessonId":"T1-07","topik":1,"tiles":["못 해요","노래를"],"correct":["노래를","못 해요"],"hint":{"ro":"Nu știu să cânt.","en":"I can't sing."}},
    # T1-08
    {"lessonId":"T1-08","topik":1,"tiles":["있어요","엄마와","아빠가"],"correct":["엄마와","아빠가","있어요"],"hint":{"ro":"Există mama și tata.","en":"There is mom and dad."}},
    {"lessonId":"T1-08","topik":1,"tiles":["사요","빵과","우유를"],"correct":["빵과","우유를","사요"],"hint":{"ro":"Cumpăr pâine și lapte.","en":"I buy bread and milk."}},
    # T1-09
    {"lessonId":"T1-09","topik":1,"tiles":["의사예요","친구는","제"],"correct":["제","친구는","의사예요"],"hint":{"ro":"Prietenul meu este doctor.","en":"My friend is a doctor."}},
    {"lessonId":"T1-09","topik":1,"tiles":["월요일이에요","오늘은"],"correct":["오늘은","월요일이에요"],"hint":{"ro":"Astăzi este luni.","en":"Today is Monday."}},
    # T1-10
    {"lessonId":"T1-10","topik":1,"tiles":["가세요","오른쪽으로"],"correct":["오른쪽으로","가세요"],"hint":{"ro":"Mergeți la dreapta.","en":"Go to the right."}},
    {"lessonId":"T1-10","topik":1,"tiles":["먹어요","젓가락으로"],"correct":["젓가락으로","먹어요"],"hint":{"ro":"Mănânc cu bețișoare.","en":"I eat with chopsticks."}},
    # T1-11
    {"lessonId":"T1-11","topik":1,"tiles":["드세요","사과나","배를"],"correct":["사과나","배를","드세요"],"hint":{"ro":"Luați un măr sau o pară.","en":"Please have an apple or a pear."}},
    {"lessonId":"T1-11","topik":1,"tiles":["만나요","내일이나","모레"],"correct":["내일이나","모레","만나요"],"hint":{"ro":"Ne vedem mâine sau poimâine.","en":"Let's meet tomorrow or the day after."}},
    # T1-12
    {"lessonId":"T1-12","topik":1,"tiles":["오세요","이쪽으로"],"correct":["이쪽으로","오세요"],"hint":{"ro":"Veniți pe aici.","en":"Come this way."}},
    {"lessonId":"T1-12","topik":1,"tiles":["닫으세요","문을"],"correct":["문을","닫으세요"],"hint":{"ro":"Închideți ușa.","en":"Please close the door."}},
    # T1-13
    {"lessonId":"T1-13","topik":1,"tiles":["마실까요?","커피를"],"correct":["커피를","마실까요?"],"hint":{"ro":"Vrem să bem cafea?","en":"Shall we drink coffee?"}},
    {"lessonId":"T1-13","topik":1,"tiles":["만날까요?","내일"],"correct":["내일","만날까요?"],"hint":{"ro":"Să ne vedem mâine?","en":"Shall we meet tomorrow?"}},
]

# ============================================================
# CHAIN exercises
# ============================================================
new_chain = [
    # T1-01 (은/는)
    {"lessonId":"T1-01","topik":1,
     "tiles":["음식은 다 맛있어요.","오늘 점심 뭐예요?","네, 정말 맛있어요!","한번 드세요."],
     "correct":["오늘 점심 뭐예요?","한번 드세요.","음식은 다 맛있어요.","네, 정말 맛있어요!"],
     "context":{"ro":"Conversație despre prânz și mâncare delicioasă","en":"Conversation about lunch and delicious food"}},
    {"lessonId":"T1-01","topik":1,
     "tiles":["날씨는 좋아요.","그럼 산책할까요?","오늘 날씨 어때요?","좋아요! 같이 가요."],
     "correct":["오늘 날씨 어때요?","날씨는 좋아요.","그럼 산책할까요?","좋아요! 같이 가요."],
     "context":{"ro":"Conversație despre vreme și o plimbare","en":"Conversation about the weather and a walk"}},
    # T1-02 (이/가)
    {"lessonId":"T1-02","topik":1,
     "tiles":["꽃이 예뻐요!","어머, 예쁘네요!","저 꽃 좀 보세요.","맞아요, 장미예요."],
     "correct":["저 꽃 좀 보세요.","꽃이 예뻐요!","어머, 예쁘네요!","맞아요, 장미예요."],
     "context":{"ro":"Conversație despre flori frumoase","en":"Conversation about pretty flowers"}},
    {"lessonId":"T1-02","topik":1,
     "tiles":["고양이가 자요.","어, 귀여워요!","조용히 하세요.","왜요?"],
     "correct":["왜요?","조용히 하세요.","고양이가 자요.","어, 귀여워요!"],
     "context":{"ro":"Dialog despre o pisică adormită","en":"Dialog about a sleeping cat"}},
    # T1-03 (을/를)
    {"lessonId":"T1-03","topik":1,
     "tiles":["음악을 들어요.","저도 음악을 좋아해요.","지금 뭐 해요?","같이 들을까요?"],
     "correct":["지금 뭐 해요?","음악을 들어요.","저도 음악을 좋아해요.","같이 들을까요?"],
     "context":{"ro":"Conversație despre ascultatul muzicii","en":"Conversation about listening to music"}},
    {"lessonId":"T1-03","topik":1,
     "tiles":["영화를 봐요.","무슨 영화예요?","재미있어요?","네, 정말 재미있어요!"],
     "correct":["영화를 봐요.","무슨 영화예요?","재미있어요?","네, 정말 재미있어요!"],
     "context":{"ro":"Conversație despre un film","en":"Conversation about a movie"}},
    # T1-04 (에/에서)
    {"lessonId":"T1-04","topik":1,
     "tiles":["집에 있어요.","오늘 어디 있어요?","왜요? 무슨 일이에요?","몸이 아파요."],
     "correct":["오늘 어디 있어요?","집에 있어요.","왜요? 무슨 일이에요?","몸이 아파요."],
     "context":{"ro":"Conversație despre starea de sănătate acasă","en":"Conversation about being home sick"}},
    {"lessonId":"T1-04","topik":1,
     "tiles":["카페에서 일해요.","거기 좋아요?","어디에서 일해요?","네, 분위기가 좋아요."],
     "correct":["어디에서 일해요?","카페에서 일해요.","거기 좋아요?","네, 분위기가 좋아요."],
     "context":{"ro":"Conversație despre locul de muncă la cafenea","en":"Conversation about working at a café"}},
    # T1-05 (도)
    {"lessonId":"T1-05","topik":1,
     "tiles":["한국어도 배워요.","와, 대단해요!","저는 영어와 일본어를 배워요.","나중에 같이 공부해요."],
     "correct":["저는 영어와 일본어를 배워요.","한국어도 배워요.","와, 대단해요!","나중에 같이 공부해요."],
     "context":{"ro":"Conversație despre studiul limbilor","en":"Conversation about studying languages"}},
    {"lessonId":"T1-05","topik":1,
     "tiles":["오늘도 행복해요.","왜 그렇게 기분이 좋아요?","매일 행복한 일이 있어요?","네, 감사한 게 많아요."],
     "correct":["왜 그렇게 기분이 좋아요?","오늘도 행복해요.","매일 행복한 일이 있어요?","네, 감사한 게 많아요."],
     "context":{"ro":"Conversație despre fericirea zilnică","en":"Conversation about daily happiness"}},
    # T1-06 (의)
    {"lessonId":"T1-06","topik":1,
     "tiles":["선생님의 책이에요.","어디서 났어요?","이 책 누구 거예요?","선생님이 빌려주셨어요."],
     "correct":["이 책 누구 거예요?","선생님의 책이에요.","어디서 났어요?","선생님이 빌려주셨어요."],
     "context":{"ro":"Conversație despre cartea profesorului","en":"Conversation about the teacher's book"}},
    {"lessonId":"T1-06","topik":1,
     "tiles":["제 동생의 이름은 민준이에요.","몇 살이에요?","동생 이름이 뭐예요?","열다섯 살이에요."],
     "correct":["동생 이름이 뭐예요?","제 동생의 이름은 민준이에요.","몇 살이에요?","열다섯 살이에요."],
     "context":{"ro":"Conversație despre fratele mai mic","en":"Conversation about the younger sibling"}},
    # T1-07 (안/못)
    {"lessonId":"T1-07","topik":1,
     "tiles":["한국어를 안 해요.","왜 안 해요?","한국어 할 수 있어요?","배우는 중이에요."],
     "correct":["한국어 할 수 있어요?","한국어를 안 해요.","왜 안 해요?","배우는 중이에요."],
     "context":{"ro":"Conversație despre vorbitul coreeanei","en":"Conversation about speaking Korean"}},
    {"lessonId":"T1-07","topik":1,
     "tiles":["노래를 못 해요.","연습하면 잘할 수 있어요.","정말요? 잘 못해요?","네, 음치예요."],
     "correct":["노래를 못 해요.","정말요? 잘 못해요?","네, 음치예요.","연습하면 잘할 수 있어요."],
     "context":{"ro":"Conversație despre incapacitatea de a cânta","en":"Conversation about not being able to sing"}},
    # T1-08 (와/과/하고)
    {"lessonId":"T1-08","topik":1,
     "tiles":["엄마와 아빠가 있어요.","가족이 있어요?","부모님이 계세요?","네, 두 분 다 건강해요."],
     "correct":["가족이 있어요?","부모님이 계세요?","엄마와 아빠가 있어요.","네, 두 분 다 건강해요."],
     "context":{"ro":"Conversație despre familie","en":"Conversation about family"}},
    {"lessonId":"T1-08","topik":1,
     "tiles":["빵과 우유를 사요.","어디서 사요?","아침에 뭐 먹어요?","편의점에서 사요."],
     "correct":["아침에 뭐 먹어요?","빵과 우유를 사요.","어디서 사요?","편의점에서 사요."],
     "context":{"ro":"Conversație despre micul dejun","en":"Conversation about breakfast"}},
    # T1-09 (이에요/예요)
    {"lessonId":"T1-09","topik":1,
     "tiles":["제 친구는 의사예요.","와, 대단하네요!","친구 직업이 뭐예요?","병원에서 일해요."],
     "correct":["친구 직업이 뭐예요?","제 친구는 의사예요.","병원에서 일해요.","와, 대단하네요!"],
     "context":{"ro":"Conversație despre profesia prietenului","en":"Conversation about a friend's profession"}},
    {"lessonId":"T1-09","topik":1,
     "tiles":["오늘은 월요일이에요.","그래서 힘들어요?","오늘 무슨 요일이에요?","네, 월요일은 싫어요."],
     "correct":["오늘 무슨 요일이에요?","오늘은 월요일이에요.","그래서 힘들어요?","네, 월요일은 싫어요."],
     "context":{"ro":"Conversație despre ziua de luni","en":"Conversation about Monday"}},
    # T1-10 ((으)로)
    {"lessonId":"T1-10","topik":1,
     "tiles":["오른쪽으로 가세요.","아, 감사합니다!","화장실이 어디예요?","저기 복도에서 오른쪽이에요."],
     "correct":["화장실이 어디예요?","오른쪽으로 가세요.","저기 복도에서 오른쪽이에요.","아, 감사합니다!"],
     "context":{"ro":"Conversație despre indicații de direcție","en":"Conversation about giving directions"}},
    {"lessonId":"T1-10","topik":1,
     "tiles":["젓가락으로 먹어요.","힘들지 않아요?","한국 음식은 어떻게 먹어요?","처음엔 힘들었어요."],
     "correct":["한국 음식은 어떻게 먹어요?","젓가락으로 먹어요.","힘들지 않아요?","처음엔 힘들었어요."],
     "context":{"ro":"Conversație despre mâncatul cu bețișoare","en":"Conversation about eating with chopsticks"}},
    # T1-11 ((이)나)
    {"lessonId":"T1-11","topik":1,
     "tiles":["사과나 배를 드세요.","감사합니다. 사과 먹을게요.","과일 드실래요?","어느 게 더 맛있어요?"],
     "correct":["과일 드실래요?","사과나 배를 드세요.","어느 게 더 맛있어요?","감사합니다. 사과 먹을게요."],
     "context":{"ro":"Conversație despre alegerea unui fruct","en":"Conversation about choosing a fruit"}},
    {"lessonId":"T1-11","topik":1,
     "tiles":["내일이나 모레 만나요.","좋아요, 그럼 모레 어때요?","언제 만날까요?","저는 두 날 다 괜찮아요."],
     "correct":["언제 만날까요?","내일이나 모레 만나요.","저는 두 날 다 괜찮아요.","좋아요, 그럼 모레 어때요?"],
     "context":{"ro":"Conversație despre stabilirea unei întâlniri","en":"Conversation about scheduling a meeting"}},
    # T1-12 (-(으)세요)
    {"lessonId":"T1-12","topik":1,
     "tiles":["이쪽으로 오세요.","네, 알겠습니다.","어디로 가면 돼요?","여기 접수 창구예요."],
     "correct":["어디로 가면 돼요?","이쪽으로 오세요.","여기 접수 창구예요.","네, 알겠습니다."],
     "context":{"ro":"Conversație la ghișeu de înregistrare","en":"Conversation at a reception desk"}},
    {"lessonId":"T1-12","topik":1,
     "tiles":["문을 닫으세요.","네, 죄송해요.","추워요. 문이 열려 있어요.","지금 닫을게요."],
     "correct":["추워요. 문이 열려 있어요.","문을 닫으세요.","지금 닫을게요.","네, 죄송해요."],
     "context":{"ro":"Conversație despre închiderea ușii","en":"Conversation about closing the door"}},
    # T1-13 (-(으)ㄹ까요?)
    {"lessonId":"T1-13","topik":1,
     "tiles":["커피를 마실까요?","좋아요! 저는 아메리카노요.","뭐 마실래요?","저도 커피 마시고 싶어요."],
     "correct":["뭐 마실래요?","저도 커피 마시고 싶어요.","커피를 마실까요?","좋아요! 저는 아메리카노요."],
     "context":{"ro":"Conversație despre comanda cafelei","en":"Conversation about ordering coffee"}},
    {"lessonId":"T1-13","topik":1,
     "tiles":["내일 만날까요?","좋아요, 몇 시예요?","주말에 시간 있어요?","오후 두 시 어때요?"],
     "correct":["주말에 시간 있어요?","내일 만날까요?","좋아요, 몇 시예요?","오후 두 시 어때요?"],
     "context":{"ro":"Conversație despre stabilirea unei întâlniri mâine","en":"Conversation about meeting up tomorrow"}},
]

# Add all new exercises to the data
data['ko-ro'].extend(new_koro)
data['ro-ko'].extend(new_roko)
data['particle'].extend(new_particle)
data['particlePlus'].extend(new_particleplus)
data['conjug'].extend(new_conjug)
data['puzzle'].extend(new_puzzle)
data['chain'].extend(new_chain)

# Write back
with open('data/exercises.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Done! New counts:")
print({k: len(v) for k, v in data.items()})
