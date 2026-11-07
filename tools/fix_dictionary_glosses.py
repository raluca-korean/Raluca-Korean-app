#!/usr/bin/env python3
"""Make every dictionary gloss unambiguous (data/vocab-korean.json).

Two different Korean words with the same Romanian/English meaning give two
"correct" answers in flashcards / memory / quizzes. Each pair gets a short
nuance in parentheses (the builder ignores parentheses when matching).
Re-runnable: entries already fixed are left alone.
"""
import json, os, collections
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(ROOT, 'data', 'vocab-korean.json')

FIX = {
  # ko: (ro, en)
  '가정': ('familie (cămin, gospodărie)', 'household, home'),
  '가족': ('familie (membrii familiei)', 'family'),
  '갑자기': ('brusc, deodată', 'suddenly'),
  '급격히': ('brusc (schimbare rapidă)', 'rapidly, sharply'),
  '같이': ('împreună (colocvial)', 'together'),
  '함께': ('împreună (mai formal)', 'together (formal)'),
  '개발': ('dezvoltare (a unui produs, proiect)', 'development (of a product)'),
  '발전': ('dezvoltare, progres', 'development, progress'),
  '게다가': ('în plus, pe deasupra', 'moreover, on top of that'),
  '또한': ('de asemenea (formal)', 'also, as well'),
  '또': ('din nou, iar; și', 'again, also'),
  '결과적으로': ('în consecință, ca rezultat', 'consequently'),
  '그에 따라': ('în consecință (conform acestuia)', 'accordingly (according to that)'),
  '이에 따라': ('în consecință (conform acestui lucru)', 'accordingly (according to this)'),
  '그 결과': ('drept rezultat', 'as a result'),
  '이로 인해': ('din această cauză', 'because of this'),
  '계속': ('continuu, mereu', 'continuously, on and on'),
  '지속적으로': ('în mod constant, susținut', 'consistently, steadily'),
  '고프다': ('a-i fi foame (doar cu 배가)', 'to be hungry (with 배가)'),
  '배가 고프다': ('a fi flămând', 'to be hungry'),
  '교사': ('profesor (meserie)', 'teacher (profession)'),
  '선생님': ('profesor, domnul profesor (adresare)', 'teacher, sir/madam (address)'),
  '국제': ('internațional (substantiv: 국제 회의)', 'international (noun)'),
  '국제적이다': ('a fi internațional', 'to be international'),
  '기업': ('companie, întreprindere', 'company, enterprise'),
  '회사': ('firmă, companie (locul de muncă)', 'company (workplace)'),
  '궁극적으로': ('în cele din urmă (fundamental)', 'ultimately'),
  '마침내': ('în sfârșit, în cele din urmă', 'finally, at last'),
  '기차역': ('gară (de tren)', 'train station'),
  '역': ('stație, gară', 'station'),
  '깨끗하다': ('a fi curat', 'to be clean'),
  '깨끗이': ('curat (adverb: a spăla curat)', 'cleanly'),
  '나가다': ('a ieși afară (din încăpere)', 'to go out (of a place)'),
  '외출하다': ('a ieși în oraș', 'to go out (on an outing)'),
  '높다': ('a fi înalt (lucruri: clădire, munte)', 'to be high'),
  '키가 큰': ('înalt (persoană)', 'tall (person)'),
  '다른 한편으로는': ('pe de altă parte', 'on the other hand'),
  '반면에': ('pe de altă parte, în schimb', 'whereas, in contrast'),
  '대체로': ('în general, în mare', 'by and large'),
  '일반적으로': ('în general (de obicei)', 'generally, usually'),
  '대표': ('reprezentant, șef (titlu)', 'representative, head'),
  '대표자': ('reprezentant (persoana delegată)', 'representative (delegate)'),
  '대학생': ('student (la facultate)', 'university student'),
  '학생': ('elev, student', 'student, pupil'),
  '던지다': ('a arunca (a lansa)', 'to throw'),
  '버리다': ('a arunca (la gunoi)', 'to throw away'),
  '만들다': ('a face, a crea', 'to make'),
  '하다': ('a face (o activitate)', 'to do'),
  '많다': ('a fi mult, a fi mulți', 'to be many/much'),
  '많이': ('mult (adverb)', 'a lot'),
  '매우': ('foarte (formal)', 'very (formal)'),
  '아주': ('foarte', 'very'),
  '물고기': ('pește (viu)', 'fish (animal)'),
  '생선': ('pește (ca mâncare)', 'fish (food)'),
  '물어보다': ('a întreba (pe cineva)', 'to ask (someone)'),
  '묻다': ('a întreba (formal)', 'to ask (formal)'),
  '바로': ('imediat, chiar', 'right away, right'),
  '즉시': ('imediat (formal)', 'immediately (formal)'),
  '반대로': ('dimpotrivă, invers', 'conversely'),
  '오히려': ('dimpotrivă, mai degrabă', 'rather, on the contrary'),
  '빠르게': ('rapid (adverb)', 'rapidly'),
  '빠르다': ('a fi rapid', 'to be fast'),
  '빨리': ('repede', 'quickly'),
  '사거리': ('intersecție (în patru)', 'crossroads'),
  '교차로': ('intersecție (formal)', 'intersection'),
  '사무실': ('birou (încăpere)', 'office'),
  '책상': ('birou (masă de scris)', 'desk'),
  '사용자': ('utilizator', 'user'),
  '이용자': ('utilizator (al unui serviciu)', 'user (of a service)'),
  '세계': ('lume (globul, țările)', 'world (globe)'),
  '세상': ('lume (societatea, viața)', 'world (society)'),
  '시스템': ('sistem (tehnic)', 'system (technical)'),
  '체계': ('sistem (organizare)', 'system, structure'),
  '얕다': ('a fi puțin adânc', 'to be shallow'),
  '피상적인': ('superficial', 'superficial'),
  '예쁘다': ('a fi frumos', 'to be pretty'),
  '예쁘게': ('frumos (adverb)', 'beautifully'),
  '재미없다': ('a nu fi interesant', 'to be no fun'),
  '지루하다': ('a fi plictisitor', 'to be boring'),
  '적다': ('a fi puțin (cantitate)', 'to be few/little'),
  '조금': ('puțin, un pic', 'a little'),
  '점진적으로': ('treptat (formal)', 'progressively'),
  '점차': ('treptat', 'gradually'),
  '참가자': ('participant (la un concurs)', 'participant, entrant'),
  '참여자': ('participant (implicat)', 'participant (involved)'),
  '최근': ('recent, ultima vreme (substantiv)', 'recently (noun)'),
  '최근에': ('recent, în ultima vreme', 'recently'),
  '또는': ('sau, ori', 'or (written)'),
  '아니면': ('sau (altfel)', 'or else'),
  '물결': ('val, unduire', 'ripple, wave'),
  '파도': ('val (pe mare)', 'wave (sea)'),
  '버릇': ('obicei (prost), tic', 'bad habit'),
  '습관': ('obicei', 'habit'),
  '부분적으로': ('parțial', 'partially'),
  '일부': ('o parte', 'a part, some'),
  '삶': ('viața (existența)', 'life (existence)'),
  '생활': ('viață (de zi cu zi)', 'daily life'),
  '아이': ('copil', 'child'),
  '어린이': ('copil mic', 'young child'),
  '이렇게': ('așa, în felul acesta', 'like this'),
  '이처럼': ('astfel (scris)', 'in this way'),
  '전반적으로': ('per ansamblu', 'overall'),
  '전체적으로': ('în total, în întregime', 'as a whole'),
  '짧다': ('a fi scurt', 'to be short'),
  '키가 작은': ('scund (persoană)', 'short (person)'),
  '하얀색': ('alb (culoarea)', 'white (color)'),
  '하얗다': ('a fi alb', 'to be white'),
  '남다': ('a rămâne (a fi rest)', 'to remain, be left'),
  '머무르다': ('a sta, a rămâne (undeva)', 'to stay (somewhere)'),
  '토마토': ('roșie (legumă)', 'tomato'),
  '경찰관': ('polițist (persoana)', 'police officer'),
  '경찰': ('poliție, polițist', 'police'),
  '그림': ('desen, pictură (tabloul)', 'drawing, painting'),
  '그림 그리기': ('a desena, pictatul (hobby)', 'drawing (hobby)'),
  '노트': ('caiet, notițe', 'notes, notebook'),
  '공책': ('caiet (de școală)', 'exercise book'),
  '바다': ('mare, ocean', 'sea, ocean'),
}
CATS = {'무료': ['nouns'], '어느': ['modifiers']}

def main():
    v = json.load(open(P, encoding='utf-8'))
    n = 0
    for x in v:
        if x['ko'] in FIX:
            ro, en = FIX[x['ko']]
            if x['ro'] != ro or x['en'] != en:
                x['ro'], x['en'] = ro, en; n += 1
        if x['ko'] in CATS and x['categories'] != CATS[x['ko']]:
            x['categories'] = CATS[x['ko']]; n += 1
    json.dump(v, open(P, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    open(P, 'a', encoding='utf-8').write('\n')
    # report what is still ambiguous
    for lang in ('ro', 'en'):
        g = collections.defaultdict(list)
        for x in v:
            if 'grammar' in x['categories']: continue
            g[x[lang].strip().lower()].append(x['ko'])
        left = {k: w for k, w in g.items() if len(w) > 1}
        print(lang, 'still shared:', left)
    print('changed', n)

if __name__ == '__main__':
    main()
