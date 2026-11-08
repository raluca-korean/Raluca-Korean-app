#!/usr/bin/env node
/*
 * Smoke test for the whole app.
 *
 *   node tools/smoke-test/run.js
 *
 * Checks, without touching any data:
 *   1. every data/*.json parses
 *   2. every file listed in sw.js STATIC exists (offline cache would break otherwise)
 *   3. every page is linked from somewhere (an unlinked page is a dead page)
 *   4. every page loads in a phone-sized browser with no JS error and no missing
 *      local file (404), and none of its links (static or rendered by JS) points
 *      to a page that does not exist
 * Needs Playwright (npm i -D playwright, or a global install). Serves the app
 * itself on a free local port. Exit code 1 on any problem.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const problems = [];
const bad = (what) => problems.push(what);

// 1. JSON
for (const f of fs.readdirSync(path.join(ROOT, 'data')).filter(f => f.endsWith('.json'))) {
  try { JSON.parse(fs.readFileSync(path.join(ROOT, 'data', f), 'utf8')); }
  catch (e) { bad(`data/${f}: invalid JSON (${e.message})`); }
}

// 2. sw.js STATIC
const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
for (const m of sw.matchAll(/'\.\/([^']+)'/g)) {
  if (m[1] && !fs.existsSync(path.join(ROOT, m[1]))) bad(`sw.js STATIC lists a missing file: ${m[1]}`);
}

// 3. orphan pages
const pages = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
const sources = pages.map(f => [f, fs.readFileSync(path.join(ROOT, f), 'utf8')])
  .concat(walkJs(path.join(ROOT, 'js')).map(f => [path.relative(ROOT, f), fs.readFileSync(f, 'utf8')]));
const ENTRY = new Set(['index.html', 'onboarding.html']);   // opened directly / by redirect
for (const p of pages) {
  if (ENTRY.has(p)) continue;
  const re = new RegExp(`['"(/.]${p.replace('.', '\\.')}`);
  if (!sources.some(([f, src]) => f !== p && re.test(src))) bad(`${p}: not linked from any page or script`);
}
function walkJs(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d =>
    d.isDirectory() ? walkJs(path.join(dir, d.name)) : d.name.endsWith('.js') ? [path.join(dir, d.name)] : []);
}

// 4. browser pass
let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) { console.error('Playwright is required for the page checks: npm i -D playwright'); report(); }

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
                '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});

(async () => {
  await new Promise(r => server.listen(0, r));
  const base = 'http://localhost:' + server.address().port;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 420, height: 860 } });
  await ctx.addInitScript(() => {
    try { speechSynthesis.speak = () => {}; } catch (e) {}
    localStorage.setItem('RK_ONBOARDED', '1');
    // the "?" help sheet opens by itself on a first visit; mark every page as seen
    const n = location.pathname.split('/').pop().replace('.html', '') || 'index';
    localStorage.setItem('RK_HELP_SEEN_' + n, '1');
  });
  await ctx.route('**/*', r => /^https?:\/\/localhost/.test(r.request().url()) ? r.continue() : r.abort());
  const page = await ctx.newPage();
  let errs = [];
  page.on('pageerror', e => errs.push('JS error: ' + e.message));
  page.on('response', r => { if (r.status() === 404) errs.push('404 ' + r.url().replace(base, '')); });
  for (const p of pages) {
    errs = [];
    try { await page.goto(base + '/' + p, { waitUntil: 'load' }); await page.waitForTimeout(800); }
    catch (e) { errs.push('did not load: ' + e.message); }
    const links = await page.evaluate(() => Array.from(document.querySelectorAll('a[href]'))
      .map(a => a.getAttribute('href')).filter(h => /^(\.\/)?[a-z0-9-]+\.html/i.test(h))
      .map(h => h.replace(/^\.\//, '').split(/[?#]/)[0])).catch(() => []);
    for (const l of new Set(links)) if (!pages.includes(l)) errs.push('link to missing page ' + l);
    for (const e of new Set(errs)) bad(`${p}: ${e}`);
    process.stdout.write('.');
  }
  await browser.close(); server.close();
  console.log('');
  report(pages.length);
})();

function report(n) {
  if (problems.length) { console.log(problems.map(p => '✗ ' + p).join('\n')); console.log(`\n${problems.length} problem(s)`); process.exit(1); }
  console.log(`✓ ${n || 0} pages, data JSON, sw.js and links all fine`);
  process.exit(0);
}
