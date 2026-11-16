#!/usr/bin/env python3
"""Adds lesson T2-28 „반말 — vorbirea familiară” to data/lessons.json and its
exercises to data/exercises.json. Re-runnable: replaces its own entries."""
import json, os, random
random.seed(28)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LP = os.path.join(ROOT, 'data', 'lessons.json')
XP = os.path.join(ROOT, 'data', 'exercises.json')

EX = [
 ("나는 학생이야.", "Sunt student. (familiar)", "I'm a student. (casual)"),
 ("너 지금 뭐 해?", "Ce faci acum?", "What are you doing now?"),
 ("어제 영화 봤어.", "Ieri am văzut un film.", "I watched a movie yesterday."),
 ("같이 가자!", "Hai să mergem împreună!", "Let's go together!"),
 ("빨리 와!", "Vino repede!", "Come quickly!"),
 ("내가 할게.", "O fac eu.", "I'll do it."),
 ("민수야, 밥 먹었어?", "Minsu, ai mâncat?", "Minsu, have you eaten?"),
 ("응, 알았어.", "Da, am înțeles.", "Yeah, got it."),
 ("내일 뭐 할 거야?", "Ce faci mâine?", "What are you going to do tomorrow?"),
 ("이거 네 거야?", "Asta e a ta?", "Is this yours?"),
]

LESSON = {
 "id": "T2-28", "topik": 2,
 "title": {"ro": "반말 — vorbirea familiară", "en": "반말 — casual speech"},
 "explanation": {
  "ro": "Coreeana are mai multe registre. 존댓말 (vorbirea politicoasă, cu -요 sau -ㅂ니다) e pentru necunoscuți, colegi și cei mai în vârstă. 반말 (vorbirea familiară) e pentru prieteni apropiați, frați și cei mai mici. În 반말 se scoate -요 din forma politicoasă (먹어요 → 먹어, 갔어요 → 갔어), iar pronumele și câteva cuvinte se schimbă: 저 → 나, 제가 → 내가, 네 → 응.",
  "en": "Korean has several speech levels. 존댓말 (polite speech, with -요 or -ㅂ니다) is for strangers, colleagues and older people. 반말 (casual speech) is for close friends, siblings and younger people. In 반말 you drop -요 from the polite form (먹어요 → 먹어, 갔어요 → 갔어), and pronouns and a few words change: 저 → 나, 제가 → 내가, 네 → 응."},
 "simple": {
  "ro": "Politicos fără -요 = familiar. 저/제가 → 나/내가, 이에요/예요 → 이야/야, -아요 → -아, „hai să” = -자, ordin = -아/어(라).",
  "en": "Polite minus -요 = casual. 저/제가 → 나/내가, 이에요/예요 → 이야/야, -아요 → -아, \"let's\" = -자, command = -아/어(라)."},
 "structure": "Rădăcină + 아/어 (prezent) · 았/었어 (trecut) · (으)ㄹ 거야 (viitor) · 자 (hai să) · 아/어(라) (ordin) · Substantiv + 이야/야",
 "examples": [{"ko": k, "ro": r, "en": e} for k, r, e in EX],
 "notes": {
  "ro": ["Tabel rapid politicos → familiar: 해요 → 해 · 했어요 → 했어 · 할 거예요 → 할 거야 · 학생이에요 → 학생이야 · 친구예요 → 친구야 · 갑시다 → 가자 · 가세요 → 가 / 가라 · 네 → 응 · 아니요 → 아니.",
         "Pronume: 저 → 나 (eu), 제가 → 내가, 제 → 내 (al meu); pentru „tu”: 너, 네가, 네 (al tău) — în vorbire 네가 se pronunță adesea 니가.",
         "Când strigi pe cineva pe nume: nume terminat în consoană + 아 (민정아), în vocală + 야 (민수야).",
         "Nu folosi 반말 cu necunoscuți, profesori, șefi sau oameni mai în vârstă — sună nepoliticos. Prietenii trec la 반말 când unul propune: 우리 말 놓을까? / 반말해도 돼? („Putem să ne vorbim familiar?”).",
         "La TOPIK, 반말 apare mai ales în dialogurile de la ascultare și citire, între prieteni sau frați."],
  "en": ["Quick table polite → casual: 해요 → 해 · 했어요 → 했어 · 할 거예요 → 할 거야 · 학생이에요 → 학생이야 · 친구예요 → 친구야 · 갑시다 → 가자 · 가세요 → 가 / 가라 · 네 → 응 · 아니요 → 아니.",
         "Pronouns: 저 → 나 (I), 제가 → 내가, 제 → 내 (my); for \"you\": 너, 네가, 네 (your) — in speech 네가 is often said 니가.",
         "Calling someone by name: consonant-final name + 아 (민정아), vowel-final + 야 (민수야).",
         "Don't use 반말 with strangers, teachers, bosses or older people — it sounds rude. Friends switch to 반말 when one suggests it: 우리 말 놓을까? / 반말해도 돼? (\"Can we talk casually?\").",
         "On the TOPIK, 반말 shows up mostly in listening and reading dialogues between friends or siblings."]}
}


def ex(**kw):
    d = {"lessonId": "T2-28", "topik": 2}
    d.update(kw)
    return d


def main():
    L = json.load(open(LP, encoding='utf-8'))
    L = [l for l in L if l['id'] != 'T2-28']
    i = max(i for i, l in enumerate(L) if l['id'].startswith('T2-'))
    L.insert(i + 1, LESSON)
    json.dump(L, open(LP, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

    E = json.load(open(XP, encoding='utf-8'))
    for k in E:
        E[k] = [x for x in E[k] if x.get('lessonId') != 'T2-28']
    allro = [r for _, r, _ in EX]; allen = [e for _, _, e in EX]; allko = [k for k, _, _ in EX]
    for k, r, e in EX[:5]:
        ro = [r] + random.sample([x for x in allro if x != r], 3); random.shuffle(ro)
        en = [e] + random.sample([x for x in allen if x != e], 3); random.shuffle(en)
        E['ko-ro'].append(ex(q=k, answers={"ro": ro, "en": en}, correct={"ro": r, "en": e}))
    for k, r, e in EX[5:10]:
        o = [k] + random.sample([x for x in allko if x != k], 3); random.shuffle(o)
        E['ro-ko'].append(ex(prompt={"ro": r, "en": e}, options=o, correct=k))
    E['particle'] += [
     ex(template="민수___, 밥 먹었어?", options=["야", "아", "씨", "님"], correct="야", hint={"ro": "strigi pe nume (vocală)", "en": "calling a name (vowel)"}),
     ex(template="민정___, 어디 가?", options=["아", "야", "이", "가"], correct="아", hint={"ro": "strigi pe nume (consoană)", "en": "calling a name (consonant)"}),
     ex(template="___ 할게.", options=["내가", "제가", "나가", "저가"], correct="내가", hint={"ro": "„eu” familiar, ca subiect", "en": "casual \"I\" as subject"}),
    ]
    E['conjug'] += [
     ex(prompt={"ro": "먹어요 → familiar", "en": "먹어요 → casual"}, options=["먹어", "먹자", "먹니다", "먹어라요"], correct="먹어"),
     ex(prompt={"ro": "학생이에요 → familiar", "en": "학생이에요 → casual"}, options=["학생이야", "학생야", "학생이어", "학생이다요"], correct="학생이야"),
     ex(prompt={"ro": "갔어요 → familiar", "en": "갔어요 → casual"}, options=["갔어", "가", "갔다요", "갔어야"], correct="갔어"),
     ex(prompt={"ro": "갑시다 (hai să mergem) → familiar", "en": "갑시다 (let's go) → casual"}, options=["가자", "가라", "가", "갈래요"], correct="가자"),
     ex(prompt={"ro": "할 거예요 → familiar", "en": "할 거예요 → casual"}, options=["할 거야", "할 거", "할 거예", "하자"], correct="할 거야"),
    ]
    E['puzzle'] += [
     ex(tiles=["같이", "가자!"], correct=["같이", "가자!"], hint={"ro": "Hai să mergem împreună!", "en": "Let's go together!"}),
     ex(tiles=["내일", "뭐", "할", "거야?"], correct=["내일", "뭐", "할", "거야?"], hint={"ro": "Ce faci mâine?", "en": "What are you going to do tomorrow?"}),
     ex(tiles=["어제", "영화", "봤어."], correct=["어제", "영화", "봤어."], hint={"ro": "Ieri am văzut un film.", "en": "I watched a movie yesterday."}),
    ]
    E['chain'].append(ex(tiles=["민수야, 밥 먹었어?", "아니, 아직. 너는?", "나도 아직. 같이 먹자!", "좋아, 가자!"],
                         correct=["민수야, 밥 먹었어?", "아니, 아직. 너는?", "나도 아직. 같이 먹자!", "좋아, 가자!"],
                         context={"ro": "Doi prieteni vorbesc familiar despre masă.", "en": "Two friends talk casually about eating."}))
    json.dump(E, open(XP, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    open(XP, 'a', encoding='utf-8').write('\n')
    print('T2-28 exercises:', sum(1 for k in E for x in E[k] if x.get('lessonId') == 'T2-28'))


if __name__ == '__main__':
    main()
