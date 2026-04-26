#!/usr/bin/env node
/**
 * gen-icons.js — generează toate icoanele PNG din sursa SVG
 *
 * Rulează cu: npm run gen-icons
 *
 * Produce:
 *   assets/icon-only.png   1024×1024  (sursă pentru @capacitor/assets)
 *   assets/splash.png      2732×2732  (sursă splash light)
 *   assets/splash-dark.png 2732×2732  (sursă splash dark)
 *   icons/icon-*.png       toate dimensiunile PWA + iOS
 */

const sharp = require('sharp');
const fs    = require('fs');
const path  = require('path');

const ROOT   = path.join(__dirname, '..');
const ASSETS = path.join(ROOT, 'assets');
const ICONS  = path.join(ROOT, 'icons');

if (!fs.existsSync(ICONS)) fs.mkdirSync(ICONS, { recursive: true });

// ── iOS icon sizes per Apple HIG ──────────────────────────────────────────
// { pt, scales[] } → fișiere icon-<pt>@<scale>x.png
const IOS_SIZES = [
  { pt: 20,   scales: [1, 2, 3] },   // Notification
  { pt: 29,   scales: [1, 2, 3] },   // Settings
  { pt: 40,   scales: [1, 2, 3] },   // Spotlight
  { pt: 60,   scales: [2, 3]    },   // App iPhone
  { pt: 76,   scales: [1, 2]    },   // App iPad
  { pt: 83.5, scales: [2]       },   // App iPad Pro
  { pt: 1024, scales: [1]       },   // App Store (no scale suffix)
];

// ── PWA / web ──────────────────────────────────────────────────────────────
const PWA_SIZES = [
  { px: 180,  name: 'icon-180.png'  },  // apple-touch-icon (toate paginile HTML)
  { px: 192,  name: 'icon-192.png'  },  // manifest.json
  { px: 512,  name: 'icon-512.png'  },  // manifest.json + Chrome install
];

function px(pt, scale) { return Math.round(pt * scale); }

function filename(pt, scale) {
  if (pt === 1024) return 'icon-1024.png';
  return scale === 1 ? `icon-${pt}.png` : `icon-${pt}@${scale}x.png`;
}

async function make(svgBuf, destPath, size, { flatten = '#db2777' } = {}) {
  let pipeline = sharp(svgBuf, { density: Math.ceil((size / 512) * 72) })
    .resize(size, size, { fit: 'contain', background: flatten })
    .flatten({ background: flatten })   // iOS nu acceptă alpha
    .png({ compressionLevel: 9 });
  await pipeline.toFile(destPath);
}

async function main() {
  const iconSvg = fs.readFileSync(path.join(ASSETS, 'icon-only.svg'));

  console.log('\n📦  Generare icoane Raluca Korean\n');

  // ── 1. Sursă 1024×1024 pentru @capacitor/assets ───────────────────────
  console.log('  [1/4] assets/icon-only.png  (1024×1024) …');
  await make(iconSvg, path.join(ASSETS, 'icon-only.png'), 1024);

  // ── 2. Splash screens ─────────────────────────────────────────────────
  const splashFiles = [
    { svg: 'splash.svg',      out: 'splash.png'      },
    { svg: 'splash-dark.svg', out: 'splash-dark.png' },
  ];
  let splashIdx = 2;
  for (const { svg, out } of splashFiles) {
    const p = path.join(ASSETS, svg);
    if (fs.existsSync(p)) {
      console.log(`  [${splashIdx}/4] assets/${out}  (2732×2732) …`);
      const buf = fs.readFileSync(p);
      await sharp(buf, { density: 72 })
        .resize(2732, 2732, { fit: 'contain', background: '#fdf4ff' })
        .flatten({ background: svg.includes('dark') ? '#0e0020' : '#fdf4ff' })
        .png({ compressionLevel: 9 })
        .toFile(path.join(ASSETS, out));
    }
    splashIdx++;
  }

  // ── 3. iOS icon sizes ─────────────────────────────────────────────────
  console.log('\n  [4/4] icons/ — dimensiuni iOS + PWA …\n');

  const tasks = [];

  for (const { pt, scales } of IOS_SIZES) {
    for (const scale of scales) {
      const size = px(pt, scale);
      const name = filename(pt, scale);
      tasks.push({ size, name });
    }
  }

  for (const { px: size, name } of PWA_SIZES) {
    if (!tasks.find(t => t.name === name)) tasks.push({ size, name });
  }

  for (const { size, name } of tasks) {
    process.stdout.write(`       ${name.padEnd(22)} ${size}×${size}px\n`);
    await make(iconSvg, path.join(ICONS, name), size);
  }

  console.log(`
✅  Gata! ${tasks.length + 3} fișiere generate.

Pași următori pe Mac:
  npm install              ← instalează Capacitor
  npx @capacitor/assets generate  ← generează AppIcon.appiconset pentru Xcode
  npx cap add ios          ← adaugă platforma iOS
  npx cap sync ios         ← copiază web files în proiectul Xcode
  npx cap open ios         ← deschide Xcode → Archive → App Store Connect
`);
}

main().catch(err => { console.error('\n❌ Eroare:', err.message); process.exit(1); });
