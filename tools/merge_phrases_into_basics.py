#!/usr/bin/env python3
"""One-off (already applied; data/phrases.json was then deleted): fold phrases into basics.

"Expresii pe situații" and "Propoziții de bază" were the same kind of content
(Korean phrases + romanisation + translation, grouped by theme). The phrases
become chapter 13 (situations, without the 60 sentences basics already had)
and the illustrated vocabulary becomes chapter 14 (words by theme).
Situations left with very few phrases after removing duplicates are joined
with a related one. Re-running is safe: chapters 13/14 are rebuilt.
"""
import json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
B = os.path.join(ROOT, 'data', 'basic-sentences.json')
P = os.path.join(ROOT, 'data', 'phrases.json')

norm = lambda t: re.sub(r'[\s.?!~,…]', '', t)

# situation id → (group, joined into unit id)
GROUPS = {
  'social':  ({'ro': 'Socializare', 'en': 'Socialising'}, ['greetings', 'first-meeting', 'phone-call', 'thanks_sorry', 'goodbye', 'invitations', 'compliments', 'feelings', 'weather_smalltalk', 'speaking_of']),
  'city':    ({'ro': 'Prin oraș', 'en': 'Around town'}, ['shopping', 'directions', 'restaurant_order', 'cafe', 'taxi_transit', 'bank_post']),
  'travel':  ({'ro': 'Călătorii', 'en': 'Travel'}, ['hotel', 'airport']),
  'health':  ({'ro': 'Sănătate și muncă', 'en': 'Health and work'}, ['doctor', 'emergency', 'office']),
}
# tiny leftovers are joined into a neighbour
JOIN = {'greetings': 'first-meeting', 'phone-call': 'first-meeting', 'thanks_sorry': 'first-meeting', 'goodbye': 'first-meeting', 'emergency': 'doctor'}
TITLES = {'first-meeting': ({'ro': 'Salutări, cunoștințe, telefon', 'en': 'Greetings, meeting people, phone'}),
          'doctor': ({'ro': 'La doctor, farmacie și urgențe', 'en': 'Doctor, pharmacy and emergencies'})}

def main():
    b = json.load(open(B, encoding='utf-8'))
    p = json.load(open(P, encoding='utf-8'))
    b['chapters'] = [c for c in b['chapters'] if c['id'] not in ('ch13', 'ch14')]
    have = set()
    for c in b['chapters']:
        for u in c['units']:
            for it in u['items']:
                have.add(norm(it['ko']))

    sits = {s['id']: s for s in p['situations']}
    def group_of(sid):
        for g, (label, ids) in GROUPS.items():
            if sid in ids: return label
        return {'ro': 'Altele', 'en': 'Other'}

    units, by_id = [], {}
    for s_ in p['situations']:
        items = []
        for it in s_['items']:
            if norm(it['ko']) in have: continue
            have.add(norm(it['ko']))
            n = {'ko': it['ko'], 'rom': it.get('rom', ''), 'ro': it['ro'], 'en': it['en']}
            if it.get('note'): n['tip'] = it['note']
            items.append(n)
        icon = s_.get('icon', '')
        t = TITLES.get(s_['id'], {'ro': s_['ro'], 'en': s_['en']})
        u = {'id': 'sit-' + s_['id'], 'group': group_of(s_['id']), 'ro': (icon + ' ' + t['ro']).strip(), 'en': (icon + ' ' + t['en']).strip(), 'items': items}
        by_id[s_['id']] = u
        units.append(u)
    # tiny leftovers join a neighbour (greetings/phone/thanks/goodbye → meeting people, emergency → doctor)
    for src, dst in JOIN.items():
        if src in by_id and dst in by_id:
            by_id[dst]['items'] = by_id[src]['items'] + by_id[dst]['items'] if units.index(by_id[src]) < units.index(by_id[dst]) else by_id[dst]['items'] + by_id[src]['items']
            by_id[src]['items'] = []
    units = [u for u in units if u['items']]
    # order units by group
    order = ['social', 'city', 'travel', 'health']
    def gkey(u):
        for i, g in enumerate(order):
            if u['group'] == GROUPS[g][0]: return i
        return 9
    units.sort(key=gkey)

    vocab_units = []
    for v in p.get('vocab', []):
        vt = {'ro': (v.get('icon', '') + ' ' + v['ro']).strip(), 'en': (v.get('icon', '') + ' ' + v['en']).strip()}
        vocab_units.append({'id': 'voc-' + v['id'], 'group': vt,
                            'ro': (v.get('icon', '') + ' ' + v['ro']).strip(), 'en': (v.get('icon', '') + ' ' + v['en']).strip(),
                            'items': [{'ko': w['ko'], 'rom': w.get('rom', ''), 'ro': (w.get('emoji', '') + ' ' + w['ro']).strip(),
                                       'en': (w.get('emoji', '') + ' ' + w['en']).strip()} for w in v['items']]})
    n = len(b['chapters'])
    b['chapters'].append({'id': 'ch13', 'num': n + 1, 'ro': 'Situații de zi cu zi', 'en': 'Everyday situations', 'infos': [], 'units': units})
    b['chapters'].append({'id': 'ch14', 'num': n + 2, 'ro': 'Cuvinte pe teme', 'en': 'Words by theme', 'infos': [], 'units': vocab_units})
    raw = open(B, encoding='utf-8').read()
    json.dump(b, open(B, 'w', encoding='utf-8'), ensure_ascii=False, indent=2 if raw.startswith('{\n  ') else None)
    if raw.endswith('\n'): open(B, 'a', encoding='utf-8').write('\n')
    for u in units + vocab_units: print(u['ro'], len(u['items']))

if __name__ == '__main__':
    main()
