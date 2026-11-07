#!/usr/bin/env python3
"""One-off: chapter 14 "Cuvinte pe teme" of basic-sentences.json was single
words, i.e. vocabulary, not sentences. Move it to the app's vocabulary:
  - words missing from data/vocab-korean.json are added (glossary, flashcards, memory…)
  - every theme's words join the matching theme in data/word-clusters.json
    (Word Map constellations + "related words" in the glossary)
  - chapter 14 is removed from basic-sentences.json
"""
import json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = lambda f: os.path.join(ROOT, 'data', f)

THEME_TO_CLUSTER = {
  'voc-restaurant': None,                       # new cluster
  'voc-family': 'Familie și acasă', 'voc-home': 'Casă și mobilier', 'voc-house': 'Casă și mobilier',
  'voc-colors': 'Culori', 'voc-weather': 'Vreme și natură', 'voc-body': 'Sănătate și corp',
  'voc-transport': 'Transport și călătorie', 'voc-fruits_veg': 'Legume și fructe', 'voc-food': 'Legume și fructe',
  'voc-drinks': 'Băuturi', 'voc-animals': 'Animale și natură vie', 'voc-clothes': 'Îmbrăcăminte și modă',
  'voc-days_time': 'Timp și calendar', 'voc-days': 'Timp și calendar', 'voc-jobs': 'Profesii și meserii',
  'voc-places': 'Orașul și locuri', 'voc-city': 'Orașul și locuri', 'voc-school': 'Școală și studiu',
  'voc-emotions': 'Emoții și sentimente', 'voc-sports': 'Sport și activitate fizică', 'voc-hobbies': 'Sport și activitate fizică',
}
CAT_BY_CLUSTER = {'Profesii și meserii': ['subjects', 'nouns'], 'Orașul și locuri': ['places', 'nouns'],
                  'Timp și calendar': ['times', 'nouns'], 'Culori': ['adjectives', 'nouns']}

def strip_emoji(s):
    return re.sub(r'^[^\wăâîșțĂÂÎȘȚ(]+', '', s).strip()

def dump(path, data, raw):
    json.dump(data, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=2 if raw.startswith(('{\n  ', '[\n  ')) else None)
    if raw.endswith('\n'): open(path, 'a', encoding='utf-8').write('\n')

def main():
    rb, rv, rc = (open(D(f), encoding='utf-8').read() for f in ('basic-sentences.json', 'vocab-korean.json', 'word-clusters.json'))
    b, v, cl = json.loads(rb), json.loads(rv), json.loads(rc)
    ch = next((c for c in b['chapters'] if c['id'] == 'ch14'), None)
    if not ch: print('chapter 14 already moved'); return
    have = {x['ko'] for x in v}
    by_label = {c['label']['ro']: c for c in cl}
    added_words = added_links = 0
    for u in ch['units']:
        target = THEME_TO_CLUSTER.get(u['id'], 'MISSING')
        title_ro, title_en = strip_emoji(u['ro']), strip_emoji(u['en'])
        if target == 'MISSING':
            target = next((k for k in by_label if k.lower().startswith(title_ro.lower()[:6])), None)
        if target is None or target not in by_label:
            label = {'ro': 'Restaurant și cafenea' if 'restaurant' in u['id'] else title_ro, 'en': 'Restaurant & café' if 'restaurant' in u['id'] else title_en}
            c = {'label': label, 'words': []}; cl.append(c); by_label[label['ro']] = c; target = label['ro']
        c = by_label[target]
        for it in u['items']:
            ko = it['ko']
            if ko not in have:
                cats = CAT_BY_CLUSTER.get(target) or (['adjectives'] if ko.endswith('다') else ['nouns', 'objects'])
                v.append({'ko': ko, 'ro': strip_emoji(it['ro']), 'en': strip_emoji(it['en']), 'categories': cats})
                have.add(ko); added_words += 1
            if ko not in c['words']:
                c['words'].append(ko); added_links += 1
        print(f"{u['ro']:<28} → {target}")
    b['chapters'] = [c for c in b['chapters'] if c['id'] != 'ch14']
    dump(D('basic-sentences.json'), b, rb); dump(D('vocab-korean.json'), v, rv); dump(D('word-clusters.json'), cl, rc)
    print('words added to dictionary:', added_words, '| words added to themes:', added_links)

if __name__ == '__main__':
    main()
