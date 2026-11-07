# Raluca Korean App

Aplicație web de învățat coreeană pentru TOPIK, în română și engleză.  
Deploy: **GitHub Pages** — push pe `main` → live automat.  
Stack: **Vanilla JS, HTML, CSS** — fără build tools, fără npm.

---

## Structura fișierelor

Aplicația a crescut mult peste cele 5 pagini inițiale — sunt ~37 pagini `.html` la rădăcină. Nu toate importă `theme-anime.css`: hub-urile din navigarea de jos (`index`, `learn`, `play`, `profile`, `review`) au stiluri proprii inline în `<style>` (aceleași token-uri: violet `#6C5CE7`, roz `#E96A9A`, auriu `#F4C95D`, fundal întunecat `#101426`). Restul paginilor (cele mai vechi) importă `theme-anime.css`. Paleta veche verde/auriu (`#1c4a3a`/`#c9922e`) și tonurile maro/crem au fost retrase — nu le reintroduce.

### Navigare (bottom nav, 5 taburi)

`index.html` (Acasă) · `learn.html` (Învață) · `play.html` (Practică) · `reading.html` (Vorbește) · `profile.html` (Progres)

Nav-ul de jos e injectat de `js/core/bottom-nav.js` (`RKNav.init('home'|'learn'|'practice'|'speak'|'progress')`) într-un `<div id="rkBottomNav"></div>` — nu se copiază markup-ul de mână pe pagini noi. `review.html` e tratat ca sub-pagină a lui Practice.

### Hub-uri secundare

- `today.html` — **Planul TOPIK** (nivel, data examenului, ritm zilnic, card de streak; a înglobat fostul `planner.html`, șters). Legat din Progres. **Misiunea zilnică există doar pe `index.html`** (un singur bonus/zi: `RK_DAILY_MISSION_AWARDED`).
- `explore.html` — index complet al tuturor funcțiilor (catch-all, util când o pagină nouă nu e încă în niciun meniu)
- `onboarding.html` — flow de prim-contact (Student/Adult, focus, timp disponibil), cu buton „Sari peste"
- `review.html`, `mistakes.html` — recapitulare greșeli/SRS; `review.html` include și propozițiile salvate din builder (SRS în `RK_SENT_SRS`, repetate în `builder.html?review=1`)

### Pagini de conținut/exerciții (reprezentativ, nu exhaustiv)

`exercises.html` (7 tipuri, vezi mai jos) · `lessons.html` / `lesson-neural.html` · `glossary.html` · `flashcards.html` · `builder.html` · `hangul.html` · `hanja-book.html` · `caiet.html` (caiet de scris de mână; `caiet.html?text=…&tr=…` adaugă o pagină cu propoziția estompată de urmărit — o folosește builderul) · `stories.html` (după ordonarea replicilor urmează un mini-test de înțelegere din 3 întrebări, generat din episod — sens / ce ai auzit / cine spune; +5 XP pe răspuns corect) · `conversation.html` · `composition.html` · `topik-test.html` (singurul examen — vechiul `exam.html` a fost șters; Test TOPIK simulat: TOPIK I = 듣기+읽기 /200, TOPIK II = 듣기+쓰기+읽기 /300, Mini sau Complet, cronometru pe secțiune, nivel după pragurile oficiale; întrebări din `listening.json`, `reading-texts.json` (câmpul `questions`), `exercises.json`, sarcina de scris din `composition-prompts.json`; istoric în `RK_TOPIK_MOCK`) · `word-context.html` · `basics.html` (Propoziții de bază — ghid de conversație în 14 capitole: 12 proprii (titluri și ordine diferite de manualul folosit ca sursă) + 13 „Situații de zi cu zi” și 14 „Cuvinte pe teme” (fostul `phrases.html` / `phrases.json`, unit aici cu `tools/merge_phrases_into_basics.py`; „Expresia zilei” de pe `index.html` vine tot de aici), grupele de unități = `group`, secțiunile = `units`; date în `data/basic-sentences.json`, bife în `RK_BASICS_KNOWN` după textul `ko`; romanizarea propozițiilor noi se generează cu `tools/romanize_ko.py`) · `journal.html` · `listening.html` (runde fixe de câte 15 întrebări pe nivel, scor în `RK_LISTEN_BEST` cheie `nivel-rundă`) · `writing.html` · `sentence-formation.html` · `slot-machine.html` (6 role: subiect, timp, loc, obiect, verb, **terminație** — lista `ENDINGS` din pagină, grupată ca fișele de gramatică; înlocuiește vechiul selector de timp)

### Jocuri (hub Play)

`map.html` (Aventura în Seul), `boss.html` (Boss Battle), `quick60.html`, `memory.html`

### Module JS comune (`js/core/`)

`storage.js`, `lang-picker.js` (injectează `.homeBtn` + selector ro/en în `#pageControls`, pe paginile mai vechi), `bottom-nav.js` (nav-ul de jos, vezi mai sus), `gamification.js` (XP, coins, streak freeze/XP boost din milestone-uri), `streak.js`, `srs.js`, `dark-mode.js`, `page-help.js`, `backup.js`, `utils.js`, `audio.js`, conjugatoare (`conjugation.js`, `verb-conjugator.js`, `ro-conjugator.js`), `sentence-generator.js`, `grammar-color.js`, `notifications.js`, `register-sw.js`.

### Date (`data/`)

`exercises.json` (7 tipuri; fiecare exercițiu are `lessonId` = lecția din `lessons.json` pe care o exersează — nu folosi ID-uri fără lecție, răspunsul marchează lecția ca făcută; dialogurile generale `chain` n-au `lessonId`), `lessons.json`, `vocab-korean.json`, `stories.json`, `hanja.json`, `reading-texts.json`, `listening.json`, `numbers.json`, `honorifics.json`, `journal-prompts.json`, `composition-prompts.json`, `context-words.json`, `word-clusters.json`, `builder-vocab.json`, `extra-generated-sentences.json`, `basic-sentences.json`.

**Un singur dicționar:** `vocab-korean.json` e dicționarul întregii aplicații (glosar, flashcards, memory, slot, harta cuvintelor **și builder** — builderul îl încarcă integral). `builder-vocab.json` adaugă doar stratul gramatical al builderului (particule, forme conjugate ca alias-uri, conectori). După ce adaugi cuvinte în `builder-vocab.json`, rulează `python3 tools/sync_builder_vocab.py`, ca să ajungă și în dicționar. După orice modificare a builderului rulează `node tools/builder-tests/run.js` (162 de propoziții de regresie).

### Hub-uri: structură

- `index.html`: card „Azi” (inel de progres + un singur buton), „Drumul de azi” (pași), quiz rapid inline (contează la sarcina zilnică `vocab`), expresia zilei.
- **Nivel TOPIK progresiv** (`js/core/level-progress.js`, cheia `RK_TOPIK_PROGRESS`, separată de selectorul `RK_LEVEL` din exerciții): lecția zilnică și exercițiile din „Drumul de azi” sunt de nivelul curent; se trece la nivelul următor doar când ≥80% din lecțiile nivelului sunt gata și ≥70% din exercițiile lui au fost rezolvate corect (`RK_EX_SRS` reps ≥ 1 sau `RK_LEARNED_EX`). Nivelul nu scade singur, dar se poate alege manual din butonul „Schimbă nivelul” (pe `index.html` și `today.html`, foaia comună `js/core/level-picker.js`) (`RKLevelProgress.chooseLevel`; un nivel deja stăpânit rămâne fixat prin `RK_TOPIK_PINNED` până la „Automat”, `resumeAuto`). Cardul de nivel e pe `index.html`, detaliile în `today.html`. `RK_TOPIK_GOAL` rămâne doar ținta examenului.
- `play.html` / `learn.html`: câteva carduri mari + restul ca chip-uri „Mai multe”. Nu adăuga carduri mari noi — pune paginile noi ca chip.
- `tools/`: scripturi Python de generare a exercițiilor (nu fac parte din aplicație).
- **Lecțiile** se deschid în `lesson-neural.html` (stilul interactiv), în două moduri:
  - `?lesson=T1-03` / `?topik=<nivel>` / `?topik` — **Gramatică TOPIK**: citește `data/lessons.json`, o convertește prin `fromLessonsJson()` (romanizare automată, plăcuțe gramaticale din `structure`), iar „Gata” scrie în `RK_LESSON_DONE` + `RK_LESSON_TODAY` (progresul principal). Butonul „Exersează” → `exercises.html?lesson=ID`.
  - fără parametri — **Fraze utile**: cele 100 de lecții-tipar scrise în `LESSONS` din pagină, progres separat în `RK_DONE_NEURAL`.
  - `lessons.html` rămâne ca „Toate lecțiile” (vedere de ansamblu + quiz), cu buton spre modul interactiv.
- `word-context.html` = **Harta Cuvintelor**, cu 2 taburi: căutare cuvânt + Constelații (`?view=stars`). (fostul `word-map.html` a fost șters).

### Pagini unite prin taburi (`js/core/page-tabs.js`)

Perechi de pagini înrudite apar ca **o singură pagină cu 2 taburi**: pagina-gazdă își păstrează conținutul în primul tab, a doua pagină se încarcă în al doilea tab (iframe `?embed=1`, fără antet/🏠/limbă/fundal proprii). În meniuri apare doar gazda; linkurile directe folosesc `gazdă.html?tab=<id>` (parametrii în plus se transmit tabului).

| Gazdă (tab 1) | Tab 2 |
|---|---|
| `writing.html` — Exersează după model | `caiet.html` — Caietul meu (`?tab=caiet`; builderul trimite `writing.html?tab=caiet&text=…&tr=…`) |
| `composition.html` — Compunere ghidată | `journal.html` — Jurnal (`?tab=journal`) |
| `review.html` — De repetat | `mistakes.html` — Greșelile mele (`?tab=mistakes`) |

Paginile din tab 2 nu se leagă direct din hub-uri. Pentru o pereche nouă: include `page-tabs.js` în `<head>` pe ambele pagini și apelează `RKTabs.init({ tabs: [...] })` la finalul gazdei.

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
- **Butoane — un aspect pe ROL**, din `rk-buttons.css` (inclus la finalul `<head>` pe toate paginile): 1) principal (gradient violet→roz: Start, Verifică, Salvează), 2) secundar (contur violet: Din nou, Indiciu, Anterioara), 3) ieșire (pastilă cu contur: ← Înapoi, ← Alte jocuri), 4) variantă de răspuns (card cu contur; stări sel/correct/wrong), 5) selector (pastilă; activ = umplut cu gradient), 6) iconiță (🔊, limbă, temă, 🏠). Un buton nou: dă-i o clasă existentă din rolul potrivit sau adaug-o în lista rolului din `rk-buttons.css` — nu-i scrie culori proprii. Selectorii din fișier se scriu pe un singur rând per regulă compusă (un rând nou între `:is(...)` și `:not(...)` devine combinator descendent).
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
