#!/usr/bin/env python3
"""Keep ONE dictionary for the whole app.

data/vocab-korean.json is the app dictionary (glossary, flashcards, memory,
slot machine, word map, builder). data/builder-vocab.json only adds the
builder's grammar layer on top of it: particles (학교에서, 사과를), conjugated
Romanian/English aliases (mănânc, am mâncat, ate) and the connectors.

This script copies every word the builder knows into the app dictionary, so
a word added for the builder also shows up everywhere else. Run it after
editing builder-vocab.json:

    python3 tools/sync_builder_vocab.py
"""
import json, re, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VK = os.path.join(ROOT, 'data', 'vocab-korean.json')
BV = os.path.join(ROOT, 'data', 'builder-vocab.json')

PARTICLE = re.compile(r'(에서|으로|로|을|를|이|가|은|는|에)$')
BUCKET_CAT = {'subject': 'subjects', 'object': 'objects', 'location': 'places',
              'time': 'times', 'description': 'adverbs', 'verb': 'verbs'}

def base_ko(bucket, ko):
    if bucket in ('subject', 'object', 'location', 'time'):
        return PARTICLE.sub('', ko)
    return ko

def clean_gloss(s):
    if '(' in (s or ''):
        return s.strip()
    s = re.sub(r'^(la|în|in|pe|spre)\s+', '', s or '', flags=re.I)
    s = re.sub(r'^(at|in|to|on)\s+(the\s+)?', '', s, flags=re.I)
    return s.strip()

def main():
    vk = json.load(open(VK, encoding='utf-8'))
    bv = json.load(open(BV, encoding='utf-8'))
    have = {x['ko']: x for x in vk}
    added = 0
    for bucket, cat in BUCKET_CAT.items():
        for it in bv.get(bucket, []):
            ko = (it.get('ko') or '').strip()
            if not ko or it.get('isPhrase'):
                continue
            b = base_ko(bucket, ko)
            if bucket == 'verb':
                if not b.endswith('다'):          # greetings / set phrases
                    continue
                if re.match(r'^a fi\b', it.get('ro', '')):
                    cat = 'adjectives'
                else:
                    cat = 'verbs'
            if not b or b in have or not re.search(r'[\uac00-\ud7a3]', b):
                continue
            if '위해' in b or b in ('대신에',):            # builder-only phrases, not dictionary words
                continue
            if it.get('ro') and it.get('ro') == it.get('en') and it['ro'][:1].isupper():
                continue                                  # sample names (Minsu, Jisu)
            entry = {'ko': b, 'ro': clean_gloss(it.get('ro', '')), 'en': clean_gloss(it.get('en', '')), 'categories': [cat]}
            if cat in ('objects', 'subjects', 'places'):
                entry['categories'].append('nouns')
            vk.append(entry)
            have[b] = entry
            added += 1
    with open(VK, 'w', encoding='utf-8') as f:
        json.dump(vk, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print('added', added, 'words; dictionary now has', len(vk))

if __name__ == '__main__':
    main()
