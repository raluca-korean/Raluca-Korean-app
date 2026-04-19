# Raluca Korean App

Aplicație web de învățat coreeană pentru TOPIK, în română și engleză.  
Deploy: **GitHub Pages** — push pe `main` → live automat.  
Stack: **Vanilla JS, HTML, CSS** — fără build tools, fără npm.

---

## Structura fișierelor

```
index.html          — pagina principală (meniu navigare)
exercises.html      — exerciții interactive (7 tipuri)
lessons.html        — lecții TOPIK structurate
glossary.html       — glosar cu căutare și favorite
builder.html        — constructor de propoziții
theme-anime.css     — stiluri globale (toate paginile îl importă)
data/
  exercises.json    — toate exercițiile (7 tipuri × 30 ex.)
  lessons.json      — conținut lecții
  vocab-korean.json — vocabular glosar
js/
  builder.js        — logica builder-ului
  core/             — module JS comune
```

---

## Exerciții (`data/exercises.json`)

7 tipuri, fiecare cu **30 exerciții** (5 per nivel TOPIK 1–6):

| Cheie | Tip | Descriere |
|-------|-----|-----------|
| `ko-ro` | KO → RO | Traducere coreeană → română/engleză |
| `ro-ko` | RO → KO | Traducere română/engleză → coreeană |
| `particle` | Particulă (1) | Alege o particulă pentru blank |
| `particlePlus` | Particule multiple | Alege perechea corectă de particule |
| `conjug` | Conjugare | Alege forma conjugată corectă |
| `puzzle` | Puzzle | Aranjează **cuvinte** în ordinea corectă |
| `chain` | Chain | Aranjează **propoziții** (dialog/paragraf) în ordine |

### Structuri de date per tip

```json
// ko-ro
{ "lessonId": "T1-01", "topik": 1, "q": "...", "answers": {"ro": [], "en": []}, "correct": {"ro": "...", "en": "..."} }

// ro-ko
{ "lessonId": "T1-01", "topik": 1, "prompt": {"ro": "...", "en": "..."}, "options": [], "correct": "..." }

// particle
{ "lessonId": "T1-01", "topik": 1, "template": "___포함", "options": [], "correct": "...", "hint": {"ro": "...", "en": "..."} }

// particlePlus
{ "lessonId": "T1-01", "topik": 1, "template": "___ ___", "options": [[], []], "correct": [], "hint": {"ro": "...", "en": "..."} }

// conjug
{ "lessonId": "T1-01", "topik": 1, "prompt": {"ro": "...", "en": "..."}, "options": [], "correct": "..." }

// puzzle
{ "lessonId": "T1-01", "topik": 1, "tiles": [], "correct": [], "hint": {"ro": "...", "en": "..."} }

// chain
{ "lessonId": "T1-01", "topik": 1, "tiles": [], "correct": [], "context": {"ro": "...", "en": "..."} }
```

---

## exercises.html — logică cheie

- **Limbă**: `currentLang` = `"ro"` | `"en"`, salvat în `localStorage("RK_LANG")`
- **Stare puzzle/chain**: `puzzleLine[]`, `puzzleBank[]` (refolosite pentru ambele tipuri)
- **Sunet**: `speakKorean(text)` — Web Speech API, `lang="ko-KR"` — se declanșează automat la `ko-ro`, `particle`, `particlePlus`
- **Validare JSON**: întotdeauna `python3 -c "import json; json.load(open('data/exercises.json'))"` înainte de commit

---

## Convenții UI

- Butoane limbă: `ro` / `en` (scurt, ca în builder)
- Buton home `🏠` pe toate paginile (link spre `index.html`), lângă butoanele de limbă
- Stilul `.homeBtn` definit în `theme-anime.css`
- Hints **nu** se afișează la particle/particlePlus (dau răspunsul)
- Badge-uri header: Mod, Corecte, Total, Streak + progress bar

---

## Deploy

```bash
git add <fișiere>
git commit -m "descriere"
git push -u origin main
```

**Regula de deploy:** Aplicația se deployează automat din `main`. Orice modificare vizibilă live trebuie commitată și pushată direct pe `main`. Branch-urile de feature (`claude/...`) sunt create automat de sistem — la finalul oricărei sarcini, confirmă că push-ul a ajuns pe `main`, nu pe un branch separat.
