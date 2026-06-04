/* PRISM — Glosar Korean
   Paradigm: Chromatic Typography.
   Clean, fast, no canvas. Words as colored language. */

// ── DOM ──
const searchInput  = document.getElementById("search");
const countEl      = document.getElementById("count");
const listEl       = document.getElementById("list");
const catFilterEl  = document.getElementById("catFilter");
const favFilterBtn = document.getElementById("favFilterBtn");
const glsCatDots   = document.getElementById("glsCatDots");
const dailyCard    = document.getElementById("dailyCard");
const glsPanel     = document.getElementById("glsPanel");
const glsPanelBody = document.getElementById("glsPanelBody");
const glsVeil      = document.getElementById("glsVeil");

// ── State ──
let WORDS       = [];
let daily       = [];
let currentLang = RKLang.get();
let filterCat   = "";
let filterFavs  = false;
let focusedKo   = null;
let currentPage = 1;
const PAGE_SIZE = 25;

// ── Category data ──
const CAT_COLORS = {
  subjects:   "#e74c3c",
  objects:    "#2980b9",
  nouns:      "#607d8b",
  verbs:      "#e91e63",
  adjectives: "#c0962a",
  adverbs:    "#8e44ad",
  modifiers:  "#c0962a",
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

// ── UI strings ──
const UI = {
  ro: {
    search:  "Caută",
    words:   "cuvinte",
    noWords: "Niciun cuvânt",
    daily:   "CUVINTELE ZILEI",
    refresh: "↺ Cuvinte noi",
    loadErr: "Eroare vocabular",
    retry:   "Reîncearcă",
    favLbl:  "Favorit",
    learnLbl:"Memorat",
    youglish:"YouGlish ↗",
    related: "DIN ACEEAȘI CATEGORIE",
    back:    "Înapoi",
    allCats: "Toate",
    close:   "×",
    init:    "INIȚIALIZARE"
  },
  en: {
    search:  "Search",
    words:   "words",
    noWords: "No words",
    daily:   "TODAY'S WORDS",
    refresh: "↺ New words",
    loadErr: "Vocabulary error",
    retry:   "Retry",
    favLbl:  "Favorite",
    learnLbl:"Learned",
    youglish:"YouGlish ↗",
    related: "SAME CATEGORY",
    back:    "Back",
    allCats: "All",
    close:   "×",
    init:    "INITIALIZING"
  }
};

function t(k) { return UI[currentLang][k]; }

// ── Storage ──
let _fSet = null, _lSet = null;
function _f() { if (!_fSet) _fSet = new Set(JSON.parse(localStorage.getItem("RK_FAV_WORDS") || "[]")); return _fSet; }
function _l() { if (!_lSet) _lSet = new Set(JSON.parse(localStorage.getItem("RK_LEARNED")   || "[]")); return _lSet; }
function isFav(ko)     { return _f().has(ko); }
function isLearned(ko) { return _l().has(ko); }

function toggleFav(ko) {
  const s = _f(); s.has(ko) ? s.delete(ko) : s.add(ko);
  localStorage.setItem("RK_FAV_WORDS", JSON.stringify([...s]));
  _refreshRowIcons(ko);
  if (focusedKo === ko) _renderPanel(WORDS.find(w => w.ko === ko));
  _refreshDailyChip(ko);
}

function toggleLearned(ko) {
  const s = _l(); s.has(ko) ? s.delete(ko) : s.add(ko);
  localStorage.setItem("RK_LEARNED", JSON.stringify([...s]));
  _refreshRowIcons(ko);
  if (focusedKo === ko) _renderPanel(WORDS.find(w => w.ko === ko));
}

function _refreshRowIcons(ko) {
  const row = listEl.querySelector(`[data-ko="${CSS.escape(ko)}"]`);
  if (!row) return;
  const ic = row.querySelector(".gls-row-icons");
  if (ic) ic.innerHTML = _iconsHTML(ko);
}

function _refreshDailyChip(ko) {
  renderDailyView();
}

// ── Speech ──
let _speakTimer = null;
function speakKO(text) {
  if (!text || !window.speechSynthesis) return;
  clearTimeout(_speakTimer);
  speechSynthesis.cancel();
  _speakTimer = setTimeout(() => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ko-KR"; u.rate = 0.9;
    speechSynthesis.speak(u);
  }, 80);
}

function openYouGlish(w) {
  window.open("https://youglish.com/pronounce/" + encodeURIComponent(w) + "/korean", "_blank");
}

// ── Helpers ──
function getMeaning(w)   { return currentLang === "ro" ? w.ro : w.en; }
function getCats(w)      { return currentLang === "ro" ? w.categoriesRo : w.categoriesEn; }
function shuffle(a)      { return [...a].sort(() => Math.random() - 0.5); }
function esc(s)          { return s.replace(/'/g, "\\'"); }
function sanitizeHTML(s) { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

function getCatColor(w) {
  for (const c of getCats(w)) {
    const k = LABEL_KEY[c];
    if (k && CAT_COLORS[k]) return CAT_COLORS[k];
  }
  return "#7c3aed";
}

function _iconsHTML(ko) {
  return (isFav(ko)     ? '<span class="gls-icon-fav">◆</span>'  : "") +
         (isLearned(ko) ? '<span class="gls-icon-learned">✓</span>' : "");
}

// ── Data ──
function normalizeEntry(e) { return { ko: e.ko || "", ro: e.ro || "", en: e.en || "" }; }

function buildWords(vocab) {
  const map = new Map();
  Object.keys(CAT_LABELS).forEach(catKey => {
    (Array.isArray(vocab[catKey]) ? vocab[catKey] : []).forEach(raw => {
      const e  = normalizeEntry(raw);
      const ko = e.ko.trim();
      if (!ko) return;
      if (!map.has(ko)) map.set(ko, { ko, ro: e.ro, en: e.en, categoriesRo: new Set(), categoriesEn: new Set() });
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

// ── Filter ──
function getFiltered() {
  const q = searchInput.value.trim().toLowerCase();
  return WORDS.filter(w => {
    const ok = !q || w.ko.toLowerCase().includes(q) ||
      (w.ro||"").toLowerCase().includes(q) || (w.en||"").toLowerCase().includes(q);
    return ok && (!filterCat || getCats(w).includes(filterCat)) && (!filterFavs || isFav(w.ko));
  });
}

// ── Render ──
function render(animate) {
  const filtered  = getFiltered();
  const total     = filtered.length;
  const totalPg   = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (currentPage > totalPg) currentPage = totalPg;

  const start     = (currentPage - 1) * PAGE_SIZE;
  const pageWords = filtered.slice(start, start + PAGE_SIZE);

  countEl.textContent = totalPg > 1
    ? `${start + 1}–${start + pageWords.length} / ${total} ${t("words")}`
    : `${total} ${t("words")}`;

  if (!total) {
    listEl.innerHTML = `<div class="gls-none">${t("noWords")}</div>`;
    return;
  }

  const frag = document.createDocumentFragment();
  pageWords.forEach((word, i) => {
    const row = _makeRow(word);
    row.classList.toggle("hot", focusedKo === word.ko);
    if (animate && i < 30) {
      row.classList.add("entering");
      row.style.animationDelay = (i * 12) + "ms";
    }
    frag.appendChild(row);
  });

  if (totalPg > 1) {
    const pg = document.createElement("div");
    pg.className = "gls-pagination";
    pg.innerHTML = _pgHTML(currentPage, totalPg);
    frag.appendChild(pg);
  }

  listEl.innerHTML = "";
  listEl.appendChild(frag);
}

function goPage(p) {
  currentPage = p;
  render(true);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function _pgHTML(page, total) {
  const nums = new Set([1, total]);
  if (page > 1) nums.add(page - 1);
  nums.add(page);
  if (page < total) nums.add(page + 1);
  const sorted = [...nums].sort((a, b) => a - b);

  let btns = "", prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) btns += `<span class="gls-pg-gap">…</span>`;
    btns += `<button class="gls-pg-num${p === page ? " on" : ""}" onclick="goPage(${p})">${p}</button>`;
    prev = p;
  }

  return `<div class="gls-pg-row">` +
    `<button class="gls-pg-arr" ${page <= 1 ? "disabled" : ""} onclick="goPage(${page - 1})">←</button>` +
    btns +
    `<button class="gls-pg-arr" ${page >= total ? "disabled" : ""} onclick="goPage(${page + 1})">→</button>` +
  `</div>`;
}

function _makeRow(word) {
  const color = getCatColor(word);
  const el = document.createElement("div");
  el.className = "gls-row";
  el.dataset.ko = word.ko;
  el.style.setProperty("--cat-color", color);
  el.innerHTML =
    `<div class="gls-row-text">` +
      `<span class="gls-row-ko" style="color:${color}">${sanitizeHTML(word.ko)}</span>` +
      `<span class="gls-row-tr">${sanitizeHTML(getMeaning(word))}</span>` +
    `</div>` +
    `<div class="gls-row-end">` +
      `<span class="gls-row-dot" style="background:${color}"></span>` +
      `<div class="gls-row-icons">${_iconsHTML(word.ko)}</div>` +
    `</div>`;
  el.addEventListener("click", () => focusWord(word.ko));
  return el;
}

// ── Focus word ──
function focusWord(ko, speak = true) {
  if (focusedKo === ko) { closePanel(); return; }

  if (focusedKo) {
    const prev = listEl.querySelector(`[data-ko="${CSS.escape(focusedKo)}"]`);
    if (prev) prev.classList.remove("hot");
  }

  focusedKo = ko;
  const row = listEl.querySelector(`[data-ko="${CSS.escape(ko)}"]`);
  if (row) row.classList.add("hot");

  const word = WORDS.find(w => w.ko === ko);
  if (!word) return;

  if (speak) speakKO(ko);
  _renderPanel(word);
  glsPanel.classList.add("open");
  glsPanel.setAttribute("aria-hidden", "false");
  glsVeil.classList.add("on");
}

function closePanel() {
  if (focusedKo) {
    const row = listEl.querySelector(`[data-ko="${CSS.escape(focusedKo)}"]`);
    if (row) row.classList.remove("hot");
  }
  focusedKo = null;
  glsPanel.classList.remove("open");
  glsPanel.setAttribute("aria-hidden", "true");
  glsVeil.classList.remove("on");
}

// ── Panel content ──
function _renderPanel(word) {
  if (!word) return;
  const color = getCatColor(word);
  const cats  = getCats(word);

  const related = WORDS.filter(w => w.ko !== word.ko && getCats(w).some(c => cats.includes(c))).slice(0, 14);

  glsPanelBody.innerHTML =
    `<button class="gls-panel-back" onclick="closePanel()">` +
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">` +
        `<path d="M19 12H5M12 5l-7 7 7 7"/>` +
      `</svg>${t("back")}` +
    `</button>` +

    `<div class="gls-panel-ko" style="color:${color}">${sanitizeHTML(word.ko)}</div>` +
    `<div class="gls-panel-tr">${sanitizeHTML(getMeaning(word))}</div>` +

    `<div class="gls-panel-cats">${cats.map(c => {
      const k = LABEL_KEY[c]; const cc = (k && CAT_COLORS[k]) || "#7c3aed";
      return `<span class="gls-panel-cat" style="background:${cc}1a;color:${cc}">${sanitizeHTML(c)}</span>`;
    }).join("")}</div>` +

    `<div class="gls-panel-acts">` +
      `<button class="gls-panel-btn${isFav(word.ko) ? " fav-on" : ""}" onclick="toggleFav('${esc(word.ko)}')">` +
        `<span class="gls-panel-btn-ico">${isFav(word.ko) ? "◆" : "◇"}</span>${t("favLbl")}` +
      `</button>` +
      `<button class="gls-panel-btn${isLearned(word.ko) ? " learn-on" : ""}" onclick="toggleLearned('${esc(word.ko)}')">` +
        `<span class="gls-panel-btn-ico">${isLearned(word.ko) ? "✓" : "○"}</span>${t("learnLbl")}` +
      `</button>` +
      `<button class="gls-panel-btn" onclick="openYouGlish('${esc(word.ko)}')">` +
        `<span class="gls-panel-btn-ico">▶</span>${t("youglish")}` +
      `</button>` +
    `</div>` +

    (related.length
      ? `<div class="gls-panel-hdg">${t("related")}</div>` +
        `<div class="gls-panel-related">${related.map(rw =>
          `<span class="gls-panel-rel" style="color:${getCatColor(rw)}" onclick="focusWord('${esc(rw.ko)}')">${sanitizeHTML(rw.ko)}</span>`
        ).join("")}</div>`
      : "");
}

// ── Category dots ──
function buildCatDots() {
  catFilterEl.innerHTML = `<option value="">${t("allCats")}</option>` +
    Object.keys(CAT_LABELS).map(k =>
      `<option value="${CAT_LABELS[k][currentLang]}">${CAT_LABELS[k][currentLang]}</option>`
    ).join("");

  const allClass = "gls-dot" + (!filterCat ? " on" : "");
  glsCatDots.innerHTML =
    `<button class="${allClass}" title="${t("allCats")}" onclick="setCatFilter('')"` +
      ` style="background:linear-gradient(135deg,#7c3aed,#db2877)"></button>` +
    Object.keys(CAT_LABELS).map(k => {
      const lbl   = CAT_LABELS[k][currentLang];
      const color = CAT_COLORS[k];
      const on    = filterCat === lbl;
      return `<button class="gls-dot${on ? " on" : ""}" title="${lbl}"` +
        ` onclick="setCatFilter('${esc(lbl)}')" style="background:${color}"></button>`;
    }).join("");
}

function setCatFilter(lbl) {
  filterCat = lbl;
  currentPage = 1;
  buildCatDots();
  render(false);
}

// ── Daily words ──
function pickDaily() {
  daily = WORDS.length ? shuffle(WORDS).slice(0, 3) : [];
}

function renderDailyView() {
  if (!daily.length) { dailyCard.innerHTML = ""; return; }

  dailyCard.innerHTML =
    `<div class="gls-daily-top">` +
      `<span class="gls-daily-label">${t("daily")}</span>` +
      `<button class="gls-daily-dismiss" onclick="dailyCard.innerHTML=''" aria-label="${t("close")}">${t("close")}</button>` +
    `</div>` +
    `<div class="gls-daily-chips">` +
      daily.map(w =>
        `<div class="gls-daily-chip" onclick="focusWord('${esc(w.ko)}')">` +
          `<div class="gls-daily-ko" style="color:${getCatColor(w)}">${sanitizeHTML(w.ko)}</div>` +
          `<div class="gls-daily-tr">${sanitizeHTML(getMeaning(w))}</div>` +
        `</div>`
      ).join("") +
    `</div>` +
    `<div class="gls-daily-foot">` +
      `<button class="gls-daily-refresh" onclick="refreshDaily()">${t("refresh")}</button>` +
    `</div>`;
}

function refreshDaily() { pickDaily(); renderDailyView(); }

// ── Language switch ──
function setLanguage(lang) {
  closePanel();
  currentLang = lang;
  filterCat   = "";
  currentPage = 1;
  searchInput.placeholder = t("search");
  buildCatDots();
  renderDailyView();
  render(false);
}

// ── Events ──
let _searchTimer = null;
searchInput.addEventListener("input", () => {
  clearTimeout(_searchTimer);
  _searchTimer = setTimeout(() => { currentPage = 1; render(false); }, 150);
});

favFilterBtn.addEventListener("click", () => {
  filterFavs = !filterFavs;
  currentPage = 1;
  favFilterBtn.classList.toggle("on", filterFavs);
  render(false);
});

glsVeil.addEventListener("click", closePanel);

// ── Load ──
async function loadVocabulary() {
  listEl.innerHTML =
    `<div class="gls-loading">` +
      `<div class="gls-spinner"></div>` +
      `<span>${currentLang === "ro" ? "INIȚIALIZARE" : "INITIALIZING"}</span>` +
    `</div>`;

  try {
    const res = await fetch("./data/vocab-korean.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const vocab = await res.json();
    WORDS = buildWords(vocab);
    listEl.innerHTML = "";
    pickDaily();
    buildCatDots();
    renderDailyView();
    render(true);
  } catch (err) {
    console.error(err);
    listEl.innerHTML =
      `<div class="gls-err">` +
        `<div class="gls-err-msg">${t("loadErr")}</div>` +
        `<button class="gls-err-btn" onclick="loadVocabulary()">${t("retry")}</button>` +
      `</div>`;
  }
}

// ── Init ──
searchInput.placeholder = t("search");
buildCatDots();
RKLang.init(setLanguage);
loadVocabulary();
