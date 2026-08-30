# Raluca Korean App

Aplicație web de învățat coreeană pentru TOPIK, în română și engleză.  
Deploy: **GitHub Pages** — push pe `main` → live automat.  
Stack: **Vanilla JS, HTML, CSS** — fără build tools, fără npm.

---

## Structura fișierelor

Aplicația a crescut mult peste cele 5 pagini inițiale — sunt ~37 pagini `.html` la rădăcină. Nu toate importă `theme-anime.css`: cele 5 hub-uri din navigarea de jos (`index`, `learn`, `profile`, `review`) au stiluri proprii inline în `<style>`, doar `play.html` folosește `theme-anime.css`. Restul paginilor (cele mai vechi) îl importă normal.

### Navigare (bottom nav, 5 taburi)

`index.html` (Acasă) · `learn.html` (Învață) · `play.html` (Practică) · `reading.html` (Vorbește) · `profile.html` (Progres)

Nav-ul de jos e injectat de `js/core/bottom-nav.js` (`RKNav.init('home'|'learn'|'practice'|'speak'|'progress')`) într-un `<div id="rkBottomNav"></div>` — nu se copiază markup-ul de mână pe pagini noi. `review.html` e tratat ca sub-pagină a lui Practice.

### Hub-uri secundare

- `today.html` — misiunea zilnică / planificator (include fostul `planner.html`, acum doar un redirect-stub)
- `explore.html` — index complet al tuturor funcțiilor (catch-all, util când o pagină nouă nu e încă în niciun meniu)
- `onboarding.html` — flow de prim-contact (Student/Adult, focus, timp disponibil), cu buton „Sari peste"
- `review.html`, `mistakes.html` — recapitulare greșeli/SRS

### Pagini de conținut/exerciții (reprezentativ, nu exhaustiv)

`exercises.html` (7 tipuri, vezi mai jos) · `lessons.html` / `lesson-neural.html` · `glossary.html` · `flashcards.html` · `builder.html` · `hangul.html` · `hanja-book.html` · `caiet.html` · `stories.html` · `conversation.html` · `composition.html` · `exam.html` · `word-context.html` / `word-map.html` · `phrases.html` · `journal.html` · `listening.html` · `writing.html` · `sentence-formation.html` · `slot-machine.html`

### Jocuri (hub Play)

`map.html` (Seoul Map), `boss.html` (Boss Battle), `quick60.html`, `memory.html`

### Module JS comune (`js/core/`)

`storage.js`, `lang-picker.js` (injectează `.homeBtn` + selector ro/en în `#pageControls`, pe paginile mai vechi), `bottom-nav.js` (nav-ul de jos, vezi mai sus), `gamification.js` (XP, coins, streak freeze/XP boost din milestone-uri), `streak.js`, `srs.js`, `dark-mode.js`, `page-help.js`, `backup.js`, `utils.js`, `audio.js`, conjugatoare (`conjugation.js`, `verb-conjugator.js`, `ro-conjugator.js`), `sentence-generator.js`, `grammar-color.js`, `notifications.js`, `register-sw.js`.

### Date (`data/`)

`exercises.json` (7 tipuri × 30 ex.), `lessons.json`, `vocab-korean.json`, `phrases.json`, `stories.json`, `hanja.json`, `reading-texts.json`, `listening.json`, `numbers.json`, `honorifics.json`, `journal-prompts.json`, `composition-prompts.json`, `context-words.json`, `word-clusters.json`, `builder-vocab.json`, `extra-generated-sentences.json`, `culture-notes.json` (note culturale K-Drama/K-Pop — termeni + explicații scrise de noi, niciodată versuri/replici reale, ca să nu existe risc de copyright).

### Fără build tools — reguli de bază

- Nu adăuga pagini noi fără să le legi în cel puțin un hub (`index`/`learn`/`play`/`explore`) — o pagină nelegată nicăieri devine moartă (așa a rămas orfană `stats.html`, ștearsă ulterior).
- Orice pagină nouă care trebuie cache-uită offline se adaugă în `STATIC` din `sw.js`, cu bump de versiune la `CACHE`.

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
- Buton home `🏠` pe toate paginile, prin unul din cele două mecanisme — nu se scrie markup de mână:
  - pagini mai vechi: `<div id="pageControls"></div>` + `js/core/lang-picker.js` → injectează automat `.homeBtn` + selector ro/en
  - hub-urile din bottom nav (`index`/`learn`/`play`/`profile`/`review`): `<div id="rkBottomNav"></div>` + `js/core/bottom-nav.js` → `RKNav.init('home'|'learn'|'practice'|'speak'|'progress')`
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
