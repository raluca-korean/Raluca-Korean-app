#!/usr/bin/env node
/*
 * Builder vocabulary audit — checks EVERY verb, not a fixed list of sentences:
 *   1. past tense: for each verb with an "am X" form, "Ieri am X" must come out in the past
 *   2. subject vs object: for each verb with an "a X" form, "Pisica a X" must make the cat
 *      the subject (고양이가/는), never the object (고양이를)
 *   + the same two checks in English: "Yesterday I waited" (past), "The cat waits" (subject)
 *   3. form conflicts: Romanian/English forms shared by several verbs (the first verb in
 *      data/builder-vocab.json wins) — printed with --conflicts, to review by eye
 *
 *   node tools/builder-tests/audit.js [--conflicts]
 * Needs Playwright. Exit code 1 if check 1 or 2 finds a problem.
 */
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..', '..');
const vocab = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'builder-vocab.json'), 'utf8'));
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
});
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

if (process.argv.includes('--conflicts')) {
  const m = {};
  vocab.verb.forEach(v => [v.ro, v.en].concat(v.aliases || []).forEach(a => { const n = norm(a); if (n) (m[n] = m[n] || []).includes(v.ko) || m[n].push(v.ko); }));
  Object.entries(m).filter(([, v]) => v.length > 1).forEach(([k, v]) => console.log(`${k.padEnd(22)} → ${v[0]}   (also: ${v.slice(1).join(', ')})`));
  process.exit(0);
}

(async () => {
  await new Promise(r => server.listen(0, r));
  const browser = await chromium.launch(); const page = await (await browser.newContext()).newPage();
  await page.addInitScript(() => { try { speechSynthesis.speak = () => {}; } catch (e) {} localStorage.setItem('RK_ONBOARDED', '1'); localStorage.setItem('RK_HELP_SEEN_builder', '1'); });
  await page.goto('http://localhost:' + server.address().port + '/builder.html');
  await page.waitForFunction(() => window.ralucaBuilderState); await page.waitForTimeout(800);
  const run = cases => page.evaluate(async cases => {
    const out = [], el = document.getElementById('freeText');
    for (const c of cases) { el.value = c.s; el.dispatchEvent(new Event('input')); await new Promise(r => setTimeout(r, 220));
      out.push(Object.assign({ got: document.getElementById('sentenceWords').innerText.replace(/\s+/g, ' ').trim() }, c)); }
    return out;
  }, cases);
  let problems = 0;
  // 1. past
  const past = vocab.verb.map(v => { const a = (v.aliases || []).find(x => /^am [a-zăâîșț]+$/i.test(x) && !/^am (fost|avut)$/.test(x)); return a && { ko: v.ko, s: 'Ieri ' + a }; }).filter(Boolean);
  const isPast = t => { const w = t.split(' ').pop() || ''; const c = w.charCodeAt(w.length - 3); return w.endsWith('어요') && c >= 0xAC00 && (c - 0xAC00) % 28 === 20; };
  for (const r of await run(past)) if (!isPast(r.got)) { problems++; console.log('✗ past   ', r.s.padEnd(28), '→', r.got, `  [${r.ko}]`); }
  // 2. subject before the verb
  const svo = vocab.verb.filter(v => v.ko && !v.ko.includes(' ')).map(v => { const a = (v.aliases || []).find(x => /^a [a-zăâîșț]+$/i.test(x)); return a && { ko: v.ko, s: 'Pisica ' + a }; }).filter(Boolean);
  for (const r of await run(svo)) if (/고양이를/.test(r.got)) { problems++; console.log('✗ subject', r.s.padEnd(28), '→', r.got, `  [${r.ko}]`); }
  // 3. the same two checks in English ("Yesterday I waited", "The cat waits")
  const enCases = vocab.verb.map(v => {
    const g = String(v.en || '').split(/[\/,;]/)[0];
    const m = /^\s*to ([a-z]+)\s*$/i.exec(g);
    if (!m || m[1].length < 3 || /\(/.test(g)) return null;
    const b0 = m[1].toLowerCase();
    if (/ee$/.test(b0)) return null;
    const ed = /e$/.test(b0) ? b0 + 'd' : /[^aeiou]y$/.test(b0) ? b0.slice(0, -1) + 'ied' : b0 + 'ed';
    const s3 = /(s|x|z|ch|sh|o)$/.test(b0) ? b0 + 'es' : /[^aeiou]y$/.test(b0) ? b0.slice(0, -1) + 'ies' : b0 + 's';
    return { ko: v.ko, past: 'Yesterday I ' + ed, subj: 'The cat ' + s3 };
  }).filter(Boolean);
  const enPast = await run(enCases.map(c => ({ ko: c.ko, s: c.past })));
  // irregular verbs (go → *goed) are not English, so only count it when the builder found that very verb
  for (const r of enPast) if (!isPast(r.got) && !/(gived|goed|eated|seed|teached|buyed|bringed|thinked|catched|runned|sitted|writed|readed|speaked|taked|maked|comed|knowed|drinked|singed|swimmed|meeted|leaved|feeled|keeped|sleeped|selled|telled|winned|losed|payed|sayed|standed|understanded|throwed|growed|drived|choosed|forgetted|getted|hided|holded|meaned|rided|rised|shaked|stealed|striked|weared|waked|hanged|bited|blowed|breaked|builded|spended|flied|falled|fighted|finded|feeded|hurted|letted|lended|putted|quitted|setted|shutted|spreaded)$/.test(r.s.split(' ').pop())) { problems++; console.log('✗ EN past', r.s.padEnd(28), '→', r.got, `  [${r.ko}]`); }
  for (const r of await run(enCases.map(c => ({ ko: c.ko, s: c.subj })))) if (/고양이를/.test(r.got)) { problems++; console.log('✗ EN subj', r.s.padEnd(28), '→', r.got, `  [${r.ko}]`); }
  await browser.close(); server.close();
  console.log(`\nRO: ${past.length} verbs checked for the past, ${svo.length} for subject/object; EN: ${enCases.length} for each — ${problems ? problems + ' problem(s)' : 'all fine'}`);
  process.exit(problems ? 1 : 0);
})();
