"""Pronunciation-based romanization, syllables joined with '-', like the phrasebook
(an-nyeong-ha-se-yo, gam-sa-ham-ni-da). Applies liaison, nasalization, liquidization,
ㅎ aspiration and common tensing inside a word; words stay separate."""
import re

INI = ['g','gg','n','d','dd','r','m','b','bb','s','ss','','j','jj','ch','k','t','p','h']
MED = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i']
# final consonant index -> (rep sound for coda, full jamo key)
FIN = ['', 'ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']
INIJ = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']
# coda neutralization
NEUT = {'ㄱ':'ㄱ','ㄲ':'ㄱ','ㅋ':'ㄱ','ㄳ':'ㄱ','ㄺ':'ㄱ','ㄴ':'ㄴ','ㄵ':'ㄴ','ㄶ':'ㄴ','ㄷ':'ㄷ','ㅅ':'ㄷ','ㅆ':'ㄷ','ㅈ':'ㄷ','ㅊ':'ㄷ','ㅌ':'ㄷ','ㅎ':'ㄷ',
        'ㄹ':'ㄹ','ㄼ':'ㄹ','ㄽ':'ㄹ','ㄾ':'ㄹ','ㅀ':'ㄹ','ㄻ':'ㅁ','ㅁ':'ㅁ','ㅂ':'ㅂ','ㅍ':'ㅂ','ㅄ':'ㅂ','ㄿ':'ㅂ','ㅇ':'ㅇ'}
CODA_ROM = {'ㄱ':'k','ㄴ':'n','ㄷ':'t','ㄹ':'l','ㅁ':'m','ㅂ':'p','ㅇ':'ng','':''}
# when followed by a vowel (ㅇ initial): (remaining coda, consonant that moves)
LIAISON = {'ㄱ':('','ㄱ'),'ㄲ':('','ㄲ'),'ㅋ':('','ㅋ'),'ㄳ':('ㄱ','ㅆ'),'ㄴ':('','ㄴ'),'ㄵ':('ㄴ','ㅈ'),'ㄶ':('','ㄴ'),
           'ㄷ':('','ㄷ'),'ㅅ':('','ㅅ'),'ㅆ':('','ㅆ'),'ㅈ':('','ㅈ'),'ㅊ':('','ㅊ'),'ㅌ':('','ㅌ'),'ㅎ':('',''),
           'ㄹ':('','ㄹ'),'ㄺ':('ㄹ','ㄱ'),'ㄻ':('ㄹ','ㅁ'),'ㄼ':('ㄹ','ㅂ'),'ㄽ':('ㄹ','ㅅ'),'ㄾ':('ㄹ','ㅌ'),'ㅀ':('','ㄹ'),
           'ㅁ':('','ㅁ'),'ㅂ':('','ㅂ'),'ㅍ':('','ㅍ'),'ㅄ':('ㅂ','ㅆ'),'ㄿ':('ㄹ','ㅍ'),'ㅇ':('ㅇ','')}
ASP = {'ㄱ':'ㅋ','ㄷ':'ㅌ','ㅂ':'ㅍ','ㅈ':'ㅊ'}
TENSE = {'ㄱ':'ㄲ','ㄷ':'ㄸ','ㅂ':'ㅃ','ㅅ':'ㅆ','ㅈ':'ㅉ'}
IROM = dict(zip(INIJ, INI)); IROM[''] = ''

def decompose(ch):
    c = ord(ch) - 0xAC00
    return INIJ[c // 588], (c % 588) // 28, FIN[c % 28]

def word(w):
    sy = [list(decompose(c)) for c in w]   # [ini, med, fin]
    if len(sy) > 1 and sy[-1] == ['ㅇ', 19, '']:
        sy[-1][1] = 5                                  # possessive 의 -> e
    for i in range(len(sy) - 1):
        a, b = sy[i], sy[i + 1]
        f, n = a[2], b[0]
        if not f:
            continue
        if n == 'ㅇ' and b[1] == 20 and f in ('ㄷ','ㅌ','ㄾ'):   # palatalization 같이, 굳이
            a[2] = 'ㄹ' if f == 'ㄾ' else ''
            b[0] = 'ㅊ' if f in ('ㅌ','ㄾ') else 'ㅈ'
            continue
        if n == 'ㅇ' and f == 'ㄹ' and b[1] == 12 and i + 1 == len(sy) - 1 and w[i] in '말뭘을':  # 정말요, 뭘요 -> mal-lyo
            b[0] = 'ㄹ'
            continue
        if n == 'ㅇ':                                   # liaison
            if f == 'ㅇ':
                continue
            keep, move = LIAISON[f]
            a[2] = keep
            b[0] = move or 'ㅇ'
            continue
        if n == 'ㅎ':                                   # coda + ㅎ -> aspirate
            nf = NEUT.get(f, f)
            if f in ('ㄶ', 'ㅀ'):
                pass
            elif nf in ASP:
                a[2] = '' if f in ('ㄱ','ㄷ','ㅂ','ㅈ','ㅅ','ㅊ','ㅌ','ㅋ','ㅍ','ㄲ') else {'ㄺ':'ㄹ','ㄼ':'ㄹ'}.get(f, '')
                b[0] = ASP[nf]
                continue
            elif nf in ('ㄴ','ㅁ','ㅇ','ㄹ'):
                a[2] = f if f in ('ㄴ','ㅁ','ㅇ','ㄹ') else nf
                b[0] = 'ㅇ' if nf in ('ㄴ','ㅁ','ㄹ') else 'ㅎ'
                if nf in ('ㄴ','ㅁ','ㄹ'):
                    # 전화 -> jeon-hwa is kept readable: move nothing, keep h
                    b[0] = 'ㅎ'
                continue
        if f in ('ㅎ','ㄶ','ㅀ') and n in ASP:          # ㅎ coda + plain -> aspirate
            a[2] = {'ㅎ':'','ㄶ':'ㄴ','ㅀ':'ㄹ'}[f]
            b[0] = ASP[n]
            continue
        if f in ('ㅎ',) and n == 'ㄴ':
            a[2] = 'ㄴ'
            continue
        if f in ('ㅎ',) and n == 'ㅅ':
            a[2] = ''; b[0] = 'ㅆ'; continue
        nf = NEUT.get(f, f)
        if f == 'ㄹ' and n in ('ㄱ','ㅈ') and b[1] in (5, 20) and i + 1 >= len(sy) - 2 and len(sy) >= 2:
            b[0] = TENSE[n]                                # -ㄹ게요, -ㄹ지
            continue
        if n in ('ㄴ', 'ㅁ'):                           # nasalization
            if nf == 'ㄱ': a[2] = 'ㅇ'
            elif nf == 'ㄷ': a[2] = 'ㄴ'
            elif nf == 'ㅂ': a[2] = 'ㅁ'
            elif f == 'ㄹ' and n == 'ㄴ': b[0] = 'ㄹ'
            else: a[2] = nf
            continue
        if n == 'ㄹ':
            if nf in ('ㄴ', 'ㄹ'): a[2] = 'ㄹ'; b[0] = 'ㄹ'
            elif nf == 'ㄱ': a[2] = 'ㅇ'; b[0] = 'ㄴ'
            elif nf == 'ㅂ': a[2] = 'ㅁ'; b[0] = 'ㄴ'
            elif nf in ('ㅁ', 'ㅇ'): a[2] = nf; b[0] = 'ㄴ'
            else: a[2] = nf
            continue
        if nf in ('ㄱ', 'ㄷ', 'ㅂ') and n in TENSE:     # obstruent tensing
            a[2] = nf; b[0] = TENSE[n]
            continue
        a[2] = nf
    out = []
    for k, (ini, med, fin) in enumerate(sy):
        if med == 19 and ini != 'ㅇ':
            med = 20                                   # 희 -> hi
        if med == 19 and ini == 'ㅇ' and k > 0 and k == len(sy) - 1:
            med = 5                                    # possessive 의 -> e
        fin = NEUT.get(fin, fin)
        s = IROM[ini if ini != 'ㅇ' else ''] + MED[med] + CODA_ROM[fin]
        out.append(s)
    # ㄹ before vowel romanized r, coda/doubled l
    res = '-'.join(out)
    res = res.replace('l-r', 'l-l')
    return res

def romanize(text):
    parts = re.split(r'([가-힣]+)', text)
    out = ''
    prev = ''
    for idx, p in enumerate(parts):
        if p and '가' <= p[0] <= '힣':
            r = word(p)
            # -ㄹ 거예요 / -ㄹ 것 : tense across the space
            if prev and decompose(prev[-1])[2] == 'ㄹ' and p[0] in '거것' and parts[idx-1] == ' ':
                r = 'gg' + r[1:]
            out += r
            prev = p
        else:
            if p.strip(): prev = ''
            out += p.replace('.', '').replace('!', '!').replace('…', '')
    out = re.sub(r'\s+', ' ', out).strip()
    return out

if __name__ == '__main__':
    import json, sys
    d = json.load(open(sys.argv[1]))
    bad = 0; n = 0
    for c in d['chapters']:
        for u in c['units']:
            for it in u['items']:
                n += 1
                r = romanize(it['ko'])
                norm = lambda s: re.sub(r'[^a-z ]', '', s.lower().replace('-', '').replace('dd','t').replace('gg','k').replace('bb','p').replace('jj','ch').replace('ss','s').replace('tt','t').replace('kk','k').replace('pp','p'))
                if norm(r) != norm(it['rom']):
                    bad += 1
                    if bad <= 60: print(it['ko'], '|', it['rom'], '|', r)
    print(bad, '/', n)
