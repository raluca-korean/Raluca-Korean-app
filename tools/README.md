# tools/

Scripturi Python unice folosite pentru a genera/corecta `data/exercises.json`.
Nu fac parte din aplicație. Rulează-le din rădăcina repo-ului (folosesc căi relative `data/...`):

```bash
python3 tools/add_t1_exercises.py
```

## Builder

- `sync_builder_vocab.py` — copiază în dicționarul aplicației (`data/vocab-korean.json`) cuvintele adăugate în `data/builder-vocab.json`.
- `builder-tests/` — teste de regresie pentru builder: `cases.tsv` = propoziție ⇥ coreeana așteptată.

```bash
node tools/builder-tests/run.js            # verifică toate propozițiile (are nevoie de Playwright)
node tools/builder-tests/run.js --update   # acceptă rezultatul curent ca „așteptat”
```

Rulează testele după orice modificare în `js/builder.js` sau `data/builder-vocab.json`. O propoziție nouă se adaugă în `cases.tsv` (doar textul, fără coloana a doua), apoi `--update`; verifică în diff că rezultatul e corect.
