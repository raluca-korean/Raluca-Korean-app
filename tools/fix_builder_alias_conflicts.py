#!/usr/bin/env python3
"""Builder: when one Romanian/English form belongs to several verbs, the first
verb in builder-vocab.json wins. These are the cases where the wrong one won;
the shared forms are removed from the wrong verb so the right one wins.
Re-runnable. List the remaining conflicts with --report.
"""
import json, re, sys, unicodedata, collections, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(ROOT, 'data', 'builder-vocab.json')

def norm(s):
    s = unicodedata.normalize('NFD', str(s).lower()); s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    s = re.sub(r'[^a-z0-9ㄱ-ㆎ가-힣\s]', ' ', s); return re.sub(r'\s+', ' ', s).strip()

# (wrong winner, should win, only these forms — None = every shared form)
FIX = [
  ('울리다', '전화하다', None),            # sun / suni / suna = a telefona
  ('부르다', '전화하다', ['call', 'calls']),
  ('만들다', '하다', ['fac', 'am facut', 'a facut', 'a face']),
  ('업로드하다', '충전하다', None),          # încarc telefonul (upload: „încarc pe net”)
  ('덥다', '뜨겁다', None),                # fierbinte / hot (object)
  ('안전하다', '확실하다', None),            # sunt sigur = sure
  ('무겁다', '힘들다', None),               # e greu = hard
  ('딱딱하다', '힘들다', ['hard', 'is hard', 'are hard']),
  ('졸업하다', '끝내다', None),             # termin / termini = finish
  ('끝나다', '끝내다', ['finish', 'finishes']),
  ('남다', '머무르다', None),               # rămân acasă
  ('조용히 하다', '조용하다', None),          # sunt liniștit
  ('시키다', '주문하다', None),              # comand
  ('예매하다', '예약하다', None),            # rezerv
  # 기쁘다 stays for „fericit”: joy about something that happened (시험에 합격해서 기뻐요)
  ('넘어지다', '떨어지다', None),            # cad = fall (generic)
  ('알아보다', '연구하다', None),            # cercetez
  ('낮추다', '내려가다', None),             # cobor
  ('낮추다', '줄이다', ['reduce']),
  ('노력하다', '시도하다', None),            # încerc
  ('차갑다', '춥다', ['cold', 'is cold', 'are cold']),
  ('닦다', '깨끗하다', ['curat']),
  ('가다', '떠나다', ['leave']),
  ('남기다', '떠나다', ['to leave', 'left', 'will leave']),
  ('놓다', '좋아하다', ['place']),
  ('늘리다', '크다', ['mari']),
  ('나오다', '나타나다', None),
  ('신청하다', '등록하다', ['register']),
  ('찍다', '사진을 찍다', None),
]

def main():
    b = json.load(open(P, encoding='utf-8'))
    V = {it['ko']: it for it in b['verb'] if it.get('ko')}
    removed = 0
    for wrong, right, forms in FIX:
        if wrong not in V or right not in V: print('skip', wrong, right); continue
        right_forms = {norm(a) for a in [V[right].get('ro'), V[right].get('en')] + V[right].get('aliases', [])}
        drop = right_forms if forms is None else {norm(f) for f in forms} & right_forms
        before = len(V[wrong]['aliases'])
        V[wrong]['aliases'] = [a for a in V[wrong]['aliases'] if norm(a) not in drop]
        removed += before - len(V[wrong]['aliases'])
        if norm(V[wrong].get('en', '')) in drop: V[wrong]['en'] = V[wrong]['en'] + ' (sth)'
    json.dump(b, open(P, 'w', encoding='utf-8'), ensure_ascii=False, indent=1); open(P, 'a').write('\n')
    print('forms removed from the wrong verb:', removed)

if __name__ == '__main__':
    main()
