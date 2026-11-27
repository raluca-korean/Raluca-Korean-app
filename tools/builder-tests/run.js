#!/usr/bin/env node
/*
 * Regression tests for the sentence builder (builder.html).
 *
 *   node tools/builder-tests/run.js            # check every case
 *   node tools/builder-tests/run.js --update   # accept the current output as expected
 *
 * cases.tsv: one case per line —
 *   "Romanian/English sentence<TAB>expected Korean<TAB>RO translation<TAB>EN translation".
 * The two translations are the ones generated from the table the sentence produced
 * (what the learner sees after editing any card), not the typed text.
 * table-cases.json: sentences built card by card (no typing) —
 *   { "table": [ { "topic": "저는", "object1": "한국어를", "verb": "공부하다", "connector": "tense_pres" }, … ],
 *     "ko": …, "ro": …, "en": … }   (cells by Korean value, connectors by id)
 * Lines starting with # are comments. Needs Playwright (npm i -D playwright, or a
 * global install); the script serves the app itself on a free local port.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) { console.error('Playwright is required: npm i -D playwright'); process.exit(2); }

const ROOT = path.resolve(__dirname, '..', '..');
const CASES = path.join(__dirname, 'cases.tsv');
const TABLE_CASES = path.join(__dirname, 'table-cases.json');
const UPDATE = process.argv.includes('--update');
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png' };

const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});

(async () => {
  await new Promise(r => server.listen(0, r));
  const base = 'http://localhost:' + server.address().port;
  const lines = fs.readFileSync(CASES, 'utf8').split('\n');
  const browser = await chromium.launch();
  const page = await (await browser.newContext()).newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(() => {
    try { speechSynthesis.speak = () => {}; } catch (e) {}
    localStorage.setItem('RK_ONBOARDED', '1');
    localStorage.setItem('RK_HELP_SEEN_builder', '1');
  });
  await page.goto(base + '/builder.html');
  await page.waitForFunction(() => window.ralucaBuilderState && window.ralucaBuilderTest);

  let pass = 0, fail = 0;
  const report = (label, cols, got, exp) => {
    const bad = cols.filter((c, i) => got[i] !== (exp[i] || ''));
    if (!bad.length) { pass++; return; }
    fail++;
    if (UPDATE) return;
    console.log('✗ ' + label);
    cols.forEach((c, i) => { if (got[i] !== (exp[i] || '')) console.log('    ' + c + ' expected: ' + (exp[i] || '') + '\n    ' + c + ' got:      ' + got[i]); });
  };
  const readOut = () => page.evaluate(() => [
    document.getElementById('sentenceWords').innerText.replace(/\s+/g, ' ').trim(),
    window.ralucaBuilderTest.translate('ro'),
    window.ralucaBuilderTest.translate('en')
  ]);

  const out = [];
  for (const line of lines) {
    if (!line.trim() || line.startsWith('#')) { out.push(line); continue; }
    const [sentence, ...expected] = line.split('\t');
    await page.evaluate(async (s) => {
      const el = document.getElementById('freeText');
      el.value = s; el.dispatchEvent(new Event('input'));
      await new Promise(r => setTimeout(r, 250));
    }, sentence);
    const got = await readOut();
    out.push([sentence].concat(got).join('\t'));
    report(sentence, ['KO', 'RO', 'EN'], got, expected);
  }

  const tableCases = JSON.parse(fs.readFileSync(TABLE_CASES, 'utf8'));
  for (const tc of tableCases) {
    await page.evaluate((t) => window.ralucaBuilderTest.setTable(t), tc.table);
    const got = await readOut();
    report('[table] ' + JSON.stringify(tc.table), ['KO', 'RO', 'EN'], got, [tc.ko, tc.ro, tc.en]);
    tc.ko = got[0]; tc.ro = got[1]; tc.en = got[2];
  }
  await browser.close(); server.close();
  if (UPDATE) {
    fs.writeFileSync(CASES, out.join('\n'));
    fs.writeFileSync(TABLE_CASES, '[\n' + tableCases.map(t => '  ' + JSON.stringify(t)).join(',\n') + '\n]\n');
    console.log('updated ' + (pass + fail) + ' cases (' + fail + ' changed)');
  }
  else console.log(`\n${pass} passed, ${fail} failed` + (errors.length ? `, page errors: ${errors.join(' | ')}` : ''));
  process.exit(UPDATE ? (errors.length ? 1 : 0) : (fail || errors.length ? 1 : 0));
})();
