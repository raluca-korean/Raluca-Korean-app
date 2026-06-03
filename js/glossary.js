/* ═══════════════════════════════════════════════════════════════════
   NeuraLux Field — Living Knowledge Topology  js/glossary.js
   New interaction paradigm: words as luminous semantic organisms.
   Information reorganizes itself around the user's attention.
   ═══════════════════════════════════════════════════════════════════ */

// ── DOM ──
const pageTitleEl    = document.getElementById("pageTitle");
const pageSubtitleEl = document.getElementById("pageSubtitle");
const dailyCard      = document.getElementById("dailyCard");
const searchInput    = document.getElementById("search");
const countEl        = document.getElementById("count");
const listEl         = document.getElementById("list");
const catFilterEl    = document.getElementById("catFilter");
const favFilterBtn   = document.getElementById("favFilterBtn");
const nlLens         = document.getElementById("nlLens");
const nlLensInner    = document.getElementById("nlLensInner");
const nlCatDots      = document.getElementById("nlCatDots");

// ── State ──
let WORDS       = [];
let daily       = [];
let currentLang = RKLang.get();
let filterCat   = "";
let filterFavs  = false;
let focusedKo   = null;

// Maximum DOM nodes in the field at any time
const MAX_NODES = 120;

// ── Category System ──
const CAT_COLORS = {
  subjects:   "#e74c3c",
  objects:    "#2980b9",
  nouns:      "#607d8b",
  verbs:      "#e91e63",
  adjectives: "#d4ac0d",
  adverbs:    "#8e44ad",
  modifiers:  "#d4ac0d",
  connectors: "#e67e22",
  grammar:    "#1abc9c"
};

const CAT_LABELS = {
  subjects:   { ro: "Subiect",     en: "Subject"    },
  nouns:      { ro: "Substantiv",  en: "Noun"        },
  objects:    { ro: "Obiect",      en: "Object"      },
  verbs:      { ro: "Verb",        en: "Verb"        },
  adjectives: { ro: "Adjectiv",    en: "Adjective"   },
  adverbs:    { ro: "Adverb",      en: "Adverb"      },
  modifiers:  { ro: "Modificator", en: "Modifier"    },
  connectors: { ro: "Conector",    en: "Connector"   },
  grammar:    { ro: "Gramatică",   en: "Grammar"     }
};

const LABEL_KEY = {};
Object.keys(CAT_LABELS).forEach(k => {
  LABEL_KEY[CAT_LABELS[k].ro] = k;
  LABEL_KEY[CAT_LABELS[k].en] = k;
});

// ── UI Text (bilingual) ──
const UI = {
  ro: {
    title:    "Glosar Korean",
    subtitle: "NeuraLux — Câmp Cognitiv",
    search:   "CAUTĂ",
    nodes:    "noduri",
    noWords:  "Niciun cuvânt",
    daily:    "REVELAȚIE ZILNICĂ",
    speak:    "◎ PRONUNȚĂ",
    refresh:  "↺ NOI CUVINTE",
    loadErr:  "Eroare vocabular",
    retry:    "Reîncearcă",
    favOnly:  "◆",
    allCats:  "TOATE",
    favLbl:   "Favorit",
    learnLbl: "Memorat",
    youglish: "YouGlish",
    related:  "ÎN RELAȚIE",
    close:    "×"
  },
  en: {
    title:    "Korean Glossary",
    subtitle: "NeuraLux — Cognitive Field",
    search:   "SEARCH",
    nodes:    "nodes",
    noWords:  "No words",
    daily:    "DAILY REVELATION",
    speak:    "◎ PRONOUNCE",
    refresh:  "↺ NEW WORDS",
    loadErr:  "Vocabulary error",
    retry:    "Retry",
    favOnly:  "◆",
    allCats:  "ALL",
    favLbl:   "Favorite",
    learnLbl: "Learned",
    youglish: "YouGlish",
    related:  "RELATED",
    close:    "×"
  }
};

function t(k) { return UI[currentLang][k]; }

// ── Storage helpers ──
let _fSet = null, _lSet = null;
function _f()        { if (!_fSet) _fSet = new Set(JSON.parse(localStorage.getItem("RK_FAV_WORDS") || "[]")); return _fSet; }
function _l()        { if (!_lSet) _lSet = new Set(JSON.parse(localStorage.getItem("RK_LEARNED")   || "[]")); return _lSet; }
function isFav(ko)     { return _f().has(ko); }
function isLearned(ko) { return _l().has(ko); }

function toggleFav(ko) {
  const s = _f(); s.has(ko) ? s.delete(ko) : s.add(ko);
  localStorage.setItem("RK_FAV_WORDS", JSON.stringify([...s]));
  _syncNodeClasses(ko);
  if (focusedKo === ko) _renderLens(WORDS.find(w => w.ko === ko));
  renderDailyView();
}

function toggleLearned(ko) {
  const s = _l(); s.has(ko) ? s.delete(ko) : s.add(ko);
  localStorage.setItem("RK_LEARNED", JSON.stringify([...s]));
  _syncNodeClasses(ko);
  if (focusedKo === ko) _renderLens(WORDS.find(w => w.ko === ko));
  // Memory ripple effect
  const nd = nodeMap.get(ko);
  if (nd) {
    nd.classList.add("nl-rippling");
    setTimeout(() => nd.classList.remove("nl-rippling"), 700);
  }
}

function _syncNodeClasses(ko) {
  const nd = nodeMap.get(ko);
  if (!nd) return;
  nd.classList.toggle("nl-fav",     isFav(ko));
  nd.classList.toggle("nl-learned", isLearned(ko) && !isFav(ko));
}

// ── Speech ──
function speakKO(text) {
  if (!text || !window.speechSynthesis) return;
  speechSynthesis.cancel();
  setTimeout(() => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ko-KR"; u.rate = 0.9;
    speechSynthesis.speak(u);
  }, 50);
}

function openYouGlish(w) {
  window.open("https://youglish.com/pronounce/" + encodeURIComponent(w) + "/korean", "_blank");
}

// ── Data helpers ──
function getMeaning(w) { return currentLang === "ro" ? w.ro : w.en; }
function getCats(w)    { return currentLang === "ro" ? w.categoriesRo : w.categoriesEn; }
function shuffle(a)    { return [...a].sort(() => Math.random() - 0.5); }
function esc(s)        { return s.replace(/'/g, "\\'"); }

function getCatColor(w) {
  const cats = getCats(w);
  for (const c of cats) {
    const k = LABEL_KEY[c];
    if (k && CAT_COLORS[k]) return CAT_COLORS[k];
  }
  return "#7c3aed";
}

// ── Data loading ──
function normalizeEntry(e) { return { ko: e.ko || "", ro: e.ro || "", en: e.en || "" }; }

function buildWords(vocab) {
  const map = new Map();
  Object.keys(CAT_LABELS).forEach(catKey => {
    const items = Array.isArray(vocab[catKey]) ? vocab[catKey] : [];
    items.forEach(raw => {
      const e = normalizeEntry(raw);
      const ko = e.ko.trim();
      if (!ko) return;
      if (!map.has(ko)) {
        map.set(ko, { ko, ro: e.ro, en: e.en, categoriesRo: new Set(), categoriesEn: new Set() });
      }
      const c = map.get(ko);
      if (!c.ro && e.ro) c.ro = e.ro;
      if (!c.en && e.en) c.en = e.en;
      c.categoriesRo.add(CAT_LABELS[catKey].ro);
      c.categoriesEn.add(CAT_LABELS[catKey].en);
    });
  });
  return Array.from(map.values())
    .map(w => ({ ko: w.ko, ro: w.ro, en: w.en, categoriesRo: [...w.categoriesRo], categoriesEn: [...w.categoriesEn] }))
    .sort((a, b) => a.ko.localeCompare(b.ko, "ko"));
}

// ── Phyllotaxis layout (golden angle spiral) ──
// Creates the most natural, non-repeating distribution of organisms.
const GOLDEN = 137.508 * Math.PI / 180;

function getPos(i, total) {
  const r = Math.sqrt((i + 0.5) / Math.max(total, 1));
  const θ = i * GOLDEN;
  // Field center shifted left slightly when lens opens; base at 47%/50%
  const cx = 0.47, cy = 0.50;
  // Radius scales to fill field without clipping edges
  const rx = Math.min(0.42, 0.38 + total * 0.0002);
  const ry = Math.min(0.38, 0.34 + total * 0.0002);
  return {
    x: cx + r * Math.cos(θ) * rx,
    y: cy + r * Math.sin(θ) * ry
  };
}

// Periphery position for dimmed (non-matching) nodes
function getPeripheryPos(i, total) {
  const φ = (i / Math.max(total, 1)) * Math.PI * 2;
  const r = 0.50 + ((i * 7) % 11) * 0.004;
  return {
    x: 0.5 + r * Math.cos(φ) * 0.95,
    y: 0.5 + r * Math.sin(φ) * 0.88
  };
}

// ── Node pool ──
const nodeMap = new Map(); // ko → DOM element
const exiting = new Set(); // ko's currently dissolving

function createNode(word) {
  const el = document.createElement("div");
  el.className = "nl-node nl-spawning";
  el.setAttribute("data-ko", word.ko);

  const color = getCatColor(word);
  // Unique breathing rhythm per organism
  el.style.setProperty("--bd",  (3.0 + Math.random() * 3.0) + "s");
  el.style.setProperty("--bph", (Math.random() * 3.5) + "s");
  el.style.setProperty("--_glow", color + "55");

  el.innerHTML =
    `<span class="nl-node-dot" style="background:${color}"></span>` +
    `<span class="nl-node-ko"  style="color:${color}">${word.ko}</span>` +
    `<span class="nl-node-tr">${getMeaning(word)}</span>`;

  el.classList.toggle("nl-fav",     isFav(word.ko));
  el.classList.toggle("nl-learned", isLearned(word.ko) && !isFav(word.ko));

  el.addEventListener("click", () => focusWord(word.ko));

  setTimeout(() => el.classList.remove("nl-spawning"), 600);
  return el;
}

function placeNode(el, x, y) {
  el.style.left = (x * 100) + "%";
  el.style.top  = (y * 100) + "%";
}

function removeNode(ko) {
  const el = nodeMap.get(ko);
  if (!el) return;
  exiting.add(ko);
  el.classList.add("nl-dissolving");
  setTimeout(() => {
    el.remove();
    nodeMap.delete(ko);
    exiting.delete(ko);
  }, 400);
}

// ── Filter ──
function getFiltered() {
  const q = searchInput.value.trim().toLowerCase();
  return WORDS.filter(w => {
    const textOk = !q ||
      w.ko.toLowerCase().includes(q) ||
      (w.ro || "").toLowerCase().includes(q) ||
      (w.en || "").toLowerCase().includes(q);
    const catOk = !filterCat  || getCats(w).includes(filterCat);
    const favOk = !filterFavs || isFav(w.ko);
    return textOk && catOk && favOk;
  });
}

// ── Render — the living field update ──
function render() {
  const filtered = getFiltered();
  // Show up to MAX_NODES; if more filtered results exist, show first MAX_NODES
  const toShow   = filtered.slice(0, MAX_NODES);
  const showSet  = new Set(toShow.map(w => w.ko));

  countEl.textContent = filtered.length + " " + t("nodes");

  // Remove nodes no longer in active set (not exiting yet)
  nodeMap.forEach((el, ko) => {
    if (!showSet.has(ko) && !exiting.has(ko)) removeNode(ko);
  });

  // Add / position nodes for active words
  toShow.forEach((word, i) => {
    const pos = getPos(i, toShow.length);

    if (exiting.has(word.ko)) {
      // Re-entering before dissolve finishes: cancel exit
      exiting.delete(word.ko);
      const el = nodeMap.get(word.ko);
      if (el) {
        el.classList.remove("nl-dissolving");
        placeNode(el, pos.x, pos.y);
      }
      return;
    }

    if (!nodeMap.has(word.ko)) {
      const el = createNode(word);
      placeNode(el, pos.x, pos.y);
      listEl.appendChild(el);
      nodeMap.set(word.ko, el);
    } else {
      placeNode(nodeMap.get(word.ko), pos.x, pos.y);
    }

    const el = nodeMap.get(word.ko);
    if (el) {
      el.classList.remove("nl-dim");
      el.classList.toggle("nl-focused", word.ko === focusedKo);
    }
  });
}

// ── Focus — semantic gravity activation ──
function focusWord(ko) {
  if (focusedKo === ko) { closeLens(); return; }

  // Deactivate previous
  if (focusedKo) {
    const prev = nodeMap.get(focusedKo);
    if (prev) prev.classList.remove("nl-focused");
  }

  focusedKo = ko;
  const nd = nodeMap.get(ko);
  if (nd) nd.classList.add("nl-focused");

  const word = WORDS.find(w => w.ko === ko);
  if (!word) return;

  speakKO(ko);
  _renderLens(word);
  nlLens.classList.add("nl-open");
  nlLens.setAttribute("aria-hidden", "false");
  listEl.classList.add("nl-shifted");

  // Semantic gravity: pull related organisms into orbit
  _attractRelated(word);
}

function closeLens() {
  if (focusedKo) {
    const nd = nodeMap.get(focusedKo);
    if (nd) nd.classList.remove("nl-focused");
  }
  focusedKo = null;
  nlLens.classList.remove("nl-open");
  nlLens.setAttribute("aria-hidden", "true");
  listEl.classList.remove("nl-shifted");
  // Restore positions
  render();
}

// Pull semantically related words into orbital positions around the focused word
function _attractRelated(word) {
  const wCats = getCats(word);
  const focusEl = nodeMap.get(word.ko);
  if (!focusEl) return;

  const fx = parseFloat(focusEl.style.left) / 100;
  const fy = parseFloat(focusEl.style.top)  / 100;

  // Only attract visible (non-dim) related words
  const related = WORDS.filter(w => {
    if (w.ko === word.ko) return false;
    if (!nodeMap.has(w.ko)) return false;
    const nd = nodeMap.get(w.ko);
    if (nd.classList.contains("nl-dim")) return false;
    return getCats(w).some(c => wCats.includes(c));
  }).slice(0, 16);

  related.forEach((rw, i) => {
    const rEl = nodeMap.get(rw.ko);
    if (!rEl) return;
    const angle   = (i / related.length) * Math.PI * 2;
    const orbit   = 0.13 + (i % 3) * 0.045;
    const tx = Math.max(0.04, Math.min(0.90, fx + Math.cos(angle) * orbit * 0.88));
    const ty = Math.max(0.06, Math.min(0.90, fy + Math.sin(angle) * orbit * 0.72));
    placeNode(rEl, tx, ty);
  });
}

// Render the detail lens for a focused word
function _renderLens(word) {
  if (!word) return;
  const color = getCatColor(word);
  const cats  = getCats(word);

  const related = WORDS.filter(w => {
    if (w.ko === word.ko) return false;
    return getCats(w).some(c => cats.includes(c));
  }).slice(0, 12);

  nlLensInner.innerHTML =
    `<button class="nl-lens-x" onclick="closeLens()" aria-label="${t("close")}">${t("close")}</button>` +

    `<div class="nl-lens-ko" style="color:${color}">${word.ko}</div>` +
    `<div class="nl-lens-meaning">${getMeaning(word)}</div>` +

    `<div class="nl-lens-cats">${cats.map(c => {
      const k = LABEL_KEY[c]; const cc = (k && CAT_COLORS[k]) || "#7c3aed";
      return `<span class="nl-lens-cat" style="color:${cc};border-color:${cc};background:${cc}18">${c}</span>`;
    }).join("")}</div>` +

    `<div class="nl-lens-acts">` +
      `<button class="nl-act${isFav(word.ko) ? " nl-act-fav" : ""}" onclick="toggleFav('${esc(word.ko)}')">${isFav(word.ko) ? "◆" : "◇"} ${t("favLbl")}</button>` +
      `<button class="nl-act${isLearned(word.ko) ? " nl-act-learn" : ""}" onclick="toggleLearned('${esc(word.ko)}')">${isLearned(word.ko) ? "✓" : "○"} ${t("learnLbl")}</button>` +
      `<button class="nl-act" onclick="speakKO('${esc(word.ko)}')">${t("speak")}</button>` +
      `<button class="nl-act" onclick="openYouGlish('${esc(word.ko)}')">${t("youglish")}</button>` +
    `</div>` +

    (related.length ?
      `<div class="nl-lens-hdg">${t("related")}</div>` +
      `<div class="nl-related">${related.map(rw =>
        `<span class="nl-rel" style="color:${getCatColor(rw)}" onclick="focusWord('${esc(rw.ko)}')">${rw.ko}</span>`
      ).join("")}</div>`
    : "");
}

// ── Category Dots ──
function buildCatDots() {
  const keys = Object.keys(CAT_LABELS);

  // Rebuild hidden select for internal tracking
  catFilterEl.innerHTML = `<option value="">${t("allCats")}</option>` +
    keys.map(k => `<option value="${CAT_LABELS[k][currentLang]}">${CAT_LABELS[k][currentLang]}</option>`).join("");

  // Build visible dot row
  nlCatDots.innerHTML =
    `<span class="nl-dot nl-dot-all${!filterCat ? " nl-dot-on" : ""}" title="${t("allCats")}" onclick="setCatFilter('')" style="--_dc:linear-gradient(#7c3aed,#db2877)"></span>` +
    keys.map(k => {
      const lbl   = CAT_LABELS[k][currentLang];
      const color = CAT_COLORS[k];
      const on    = filterCat === lbl;
      return `<span class="nl-dot${on ? " nl-dot-on" : ""}" title="${lbl}" onclick="setCatFilter('${esc(lbl)}')" style="background:${color};--_dc:${color}"></span>`;
    }).join("");
}

function setCatFilter(lbl) {
  filterCat = lbl;
  catFilterEl.value = lbl;
  buildCatDots();
  render();
}

// ── Daily Revelation ──
function pickDaily() {
  daily = WORDS.length ? shuffle(WORDS).slice(0, 3) : [];
}

function renderDailyView() {
  if (!daily.length) { dailyCard.innerHTML = ""; return; }

  dailyCard.innerHTML =
    `<div class="nl-rev-hdr">` +
      `<span class="nl-rev-label">${t("daily")}</span>` +
      `<button class="nl-rev-x" onclick="document.getElementById('dailyCard').classList.add('nl-rev-gone')" aria-label="${t("close")}">${t("close")}</button>` +
    `</div>` +
    `<div class="nl-rev-words">${daily.map(w =>
      `<div class="nl-rev-word" onclick="focusWord('${esc(w.ko)}')">` +
        `<div>` +
          `<div class="nl-rev-ko" style="color:${getCatColor(w)}">${w.ko}</div>` +
          `<div class="nl-rev-tr">${getMeaning(w)}</div>` +
        `</div>` +
        `<span style="margin-left:auto;font-size:13px;cursor:pointer;opacity:${isFav(w.ko) ? 1 : 0.3};flex-shrink:0" onclick="event.stopPropagation();toggleFav('${esc(w.ko)}')">${isFav(w.ko) ? "◆" : "◇"}</span>` +
      `</div>`
    ).join("")}</div>` +
    `<div class="nl-rev-acts">` +
      `<button class="nl-rev-btn" onclick="playDaily()">${t("speak")}</button>` +
      `<button class="nl-rev-btn" onclick="refreshDaily()">${t("refresh")}</button>` +
    `</div>`;
}

function playDaily()    { daily.forEach((w, i) => setTimeout(() => speakKO(w.ko), i * 1200)); }
function refreshDaily() { pickDaily(); renderDailyView(); }

// ── Canvas — breathing nebula background ──
function initCanvas() {
  const cvs = document.getElementById("nlCanvas");
  if (!cvs) return;
  const ctx = cvs.getContext("2d");
  let pts = [];

  function resize() {
    cvs.width  = window.innerWidth;
    cvs.height = window.innerHeight;
    const n = Math.min(Math.floor(cvs.width * cvs.height / 13000), 110);
    pts = Array.from({ length: n }, () => ({
      x:  Math.random() * cvs.width,
      y:  Math.random() * cvs.height,
      vx: (Math.random() - 0.5) * 0.24,
      vy: (Math.random() - 0.5) * 0.20,
      r:  Math.random() * 1.1 + 0.28,
      a:  Math.random() * 0.44 + 0.10,
      ph: Math.random() * Math.PI * 2
    }));
  }

  let tick = 0;

  function frame() {
    tick += 0.004;
    const dark = document.body.classList.contains("dark-mode");

    ctx.clearRect(0, 0, cvs.width, cvs.height);

    // Breathing nebula zones — different configurations for light/dark
    const nbs = dark ? [
      [0.12, 0.18, 0.40, "rgba(88,0,66,0.14)"],
      [0.88, 0.10, 0.34, "rgba(38,0,108,0.12)"],
      [0.50, 0.88, 0.44, "rgba(48,0,88,0.10)"],
      [0.70, 0.44, 0.28, "rgba(0,28,90,0.08)"]
    ] : [
      [0.10, 0.14, 0.44, "rgba(219,39,119,0.072)"],
      [0.90, 0.08, 0.36, "rgba(14,165,233,0.060)"],
      [0.50, 0.94, 0.48, "rgba(124,58,237,0.058)"],
      [0.66, 0.50, 0.30, "rgba(219,39,119,0.042)"]
    ];

    nbs.forEach(([nx, ny, nr, nc]) => {
      const breathe = 1 + Math.sin(tick * 0.36 + nx * 5.8) * 0.13;
      const g = ctx.createRadialGradient(
        nx * cvs.width, ny * cvs.height, 0,
        nx * cvs.width, ny * cvs.height,
        nr * Math.min(cvs.width, cvs.height) * breathe
      );
      g.addColorStop(0, nc);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, cvs.width, cvs.height);
    });

    // Dust particles
    const pc = dark ? "rgba(167,139,250," : "rgba(124,58,237,";
    pts.forEach(p => {
      p.x = (p.x + p.vx + cvs.width)  % cvs.width;
      p.y = (p.y + p.vy + cvs.height) % cvs.height;
      const alpha = p.a * (0.62 + 0.38 * Math.sin(tick * 1.15 + p.ph));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 6.283);
      ctx.fillStyle = pc + alpha + ")";
      ctx.fill();
    });

    // Constellation lines between nearby particles
    const lc = dark ? "rgba(167,139,250," : "rgba(124,58,237,";
    for (let i = 0; i < pts.length - 1; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 88) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = lc + (1 - d / 88) * 0.09 + ")";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(frame);
  }

  resize();
  frame();
  window.addEventListener("resize", resize);
}

// ── Language switch ──
function setLanguage(lang) {
  currentLang = lang;
  filterCat   = "";
  // Dissolve all nodes — they'll respawn with new language text
  nodeMap.forEach((el, ko) => removeNode(ko));
  buildCatDots();
  renderDailyView();
  // Slight delay so dissolve animations play before respawn
  setTimeout(render, 420);
}

function updateTexts() {
  if (pageTitleEl)    pageTitleEl.textContent    = t("title");
  if (pageSubtitleEl) pageSubtitleEl.textContent = t("subtitle");
  searchInput.placeholder = t("search");
  favFilterBtn.textContent = t("favOnly") + (filterFavs ? " ✓" : "");
  buildCatDots();
}

// ── Load vocabulary ──
async function loadVocabulary() {
  listEl.innerHTML =
    `<div class="nl-loading">` +
      `<div class="nl-loading-ring"></div>` +
      `<div class="nl-loading-text">${currentLang === "ro" ? "INIȚIALIZARE" : "INITIALIZING"}</div>` +
    `</div>`;

  try {
    const res = await fetch("./data/vocab-korean.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const vocab = await res.json();
    WORDS = buildWords(vocab);
    listEl.innerHTML = "";
    pickDaily();
    renderDailyView();
    render();
  } catch (err) {
    console.error(err);
    listEl.innerHTML =
      `<div class="nl-err">` +
        `<div class="nl-err-msg">${t("loadErr")}</div>` +
        `<button class="nl-err-retry" onclick="loadVocabulary()">${t("retry")}</button>` +
      `</div>`;
  }
}

// ── Events ──
let _st = null;
searchInput.addEventListener("input", () => {
  clearTimeout(_st);
  _st = setTimeout(() => {
    // Collapse daily revelation when user starts typing
    if (searchInput.value.trim()) {
      dailyCard.classList.add("nl-rev-gone");
    }
    render();
  }, 150);
});

favFilterBtn.addEventListener("click", () => {
  filterFavs = !filterFavs;
  favFilterBtn.classList.toggle("active", filterFavs);
  favFilterBtn.textContent = t("favOnly") + (filterFavs ? " ✓" : "");
  render();
});

// Tap on empty field to close lens
listEl.addEventListener("click", e => {
  if (!e.target.closest(".nl-node")) closeLens();
});

// ── Initialize ──
initCanvas();
updateTexts();
RKLang.init(setLanguage);
loadVocabulary();
