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
let WORDS        = [];
let CLUSTERS     = [];
let SENTENCES    = [];   // [{ko, ro, en}] din exercises.json
let daily        = [];
let currentLang  = RKLang.get();
let filterCat    = "";
let filterFavs   = false;
let focusedKo    = null;
let panelHistory = [];   // navigation stack for associated words
let currentPage  = 1;
const PAGE_SIZE = 25;
// sort: "alpha" | "unknown" | "favs" | "cat"
let currentSort = "alpha";

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
  grammar:    "#1abc9c",
  times:      "#0097a7",
  places:     "#388e3c"
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
  grammar:    { ro: "Gramatică",   en: "Grammar"     },
  times:      { ro: "Timp",        en: "Time"        },
  places:     { ro: "Loc",         en: "Place"       }
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
    speak:   "Pronunță",
    associated: "CUVINTE ASOCIATE",
    back:    "Înapoi",
    allCats: "Toate",
    close:   "×",
    init:    "INIȚIALIZARE",
    sortAlpha:   "Alfabetic",
    sortUnknown: "Necunoscute primul",
    sortFavs:    "Favorite primul",
    sortCat:     "După categorie",
    example:     "EXEMPLU"
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
    speak:   "Speak",
    associated: "ASSOCIATED WORDS",
    back:    "Back",
    allCats: "All",
    close:   "×",
    init:    "INITIALIZING",
    sortAlpha:   "Alphabetical",
    sortUnknown: "Unknown first",
    sortFavs:    "Favorites first",
    sortCat:     "By category",
    example:     "EXAMPLE"
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
// Handles both new flat array [{ko,ro,en,categories:[]}] and old nested {cat:[{ko,ro,en}]} format
function buildWords(vocab) {
  const flat = Array.isArray(vocab) ? vocab : _nestedToFlat(vocab);
  const map  = new Map();

  flat.forEach(raw => {
    const ko = (raw.ko || "").trim();
    if (!ko) return;
    if (!map.has(ko)) map.set(ko, { ko, ro: raw.ro || "", en: raw.en || "", categoriesRo: new Set(), categoriesEn: new Set() });
    const c = map.get(ko);
    if (!c.ro && raw.ro) c.ro = raw.ro;
    if (!c.en && raw.en) c.en = raw.en;
    (raw.categories || []).forEach(catKey => {
      if (CAT_LABELS[catKey]) {
        c.categoriesRo.add(CAT_LABELS[catKey].ro);
        c.categoriesEn.add(CAT_LABELS[catKey].en);
      }
    });
  });

  return Array.from(map.values())
    .map(w => ({ ko: w.ko, ro: w.ro, en: w.en, categoriesRo: [...w.categoriesRo], categoriesEn: [...w.categoriesEn] }))
    .sort((a, b) => a.ko.localeCompare(b.ko, "ko"));
}

function _nestedToFlat(data) {
  const map = new Map();
  for (const cat of Object.keys(data)) {
    for (const w of (Array.isArray(data[cat]) ? data[cat] : [])) {
      if (!w?.ko) continue;
      if (!map.has(w.ko)) map.set(w.ko, { ko: w.ko, ro: w.ro || "", en: w.en || "", categories: [] });
      if (!map.get(w.ko).categories.includes(cat)) map.get(w.ko).categories.push(cat);
    }
  }
  return [...map.values()];
}

// ── Sort ──
function applySortMenu() {
  const sortBtn = document.getElementById("sortBtn");
  if (!sortBtn) return;

  // Remove existing menu
  const old = document.getElementById("gls-sort-menu");
  if (old) { old.remove(); return; }

  const menu = document.createElement("div");
  menu.id = "gls-sort-menu";
  menu.className = "gls-sort-menu";

  const options = [
    { key: "alpha",   label: t("sortAlpha") },
    { key: "unknown", label: t("sortUnknown") },
    { key: "favs",    label: t("sortFavs") },
    { key: "cat",     label: t("sortCat") }
  ];

  options.forEach(({ key, label }) => {
    const btn = document.createElement("button");
    btn.className = "gls-sort-opt" + (currentSort === key ? " on" : "");
    btn.textContent = label;
    btn.onclick = () => {
      currentSort = key;
      currentPage = 1;
      menu.remove();
      render(false);
    };
    menu.appendChild(btn);
  });

  // Position below sortBtn
  const rect = sortBtn.getBoundingClientRect();
  menu.style.top  = (rect.bottom + 6) + "px";
  menu.style.right = (window.innerWidth - rect.right) + "px";
  document.body.appendChild(menu);

  // Close on outside click
  setTimeout(() => {
    document.addEventListener("click", function close(e) {
      if (!menu.contains(e.target) && e.target !== sortBtn) {
        menu.remove();
        document.removeEventListener("click", close);
      }
    });
  }, 0);
}

function sortWords(words) {
  switch (currentSort) {
    case "unknown":
      return [...words].sort((a, b) => {
        const aL = isLearned(a.ko) ? 1 : 0;
        const bL = isLearned(b.ko) ? 1 : 0;
        if (aL !== bL) return aL - bL;
        return a.ko.localeCompare(b.ko, "ko");
      });
    case "favs":
      return [...words].sort((a, b) => {
        const aF = isFav(a.ko) ? 0 : 1;
        const bF = isFav(b.ko) ? 0 : 1;
        if (aF !== bF) return aF - bF;
        return a.ko.localeCompare(b.ko, "ko");
      });
    case "cat":
      return [...words].sort((a, b) => {
        const ac = getCats(a)[0] || "";
        const bc = getCats(b)[0] || "";
        if (ac !== bc) return ac.localeCompare(bc);
        return a.ko.localeCompare(b.ko, "ko");
      });
    default: // alpha
      return words;
  }
}

// ── Filter ──
function getFiltered() {
  const q = searchInput.value.trim().toLowerCase();
  const base = WORDS.filter(w => {
    const ok = !q || w.ko.toLowerCase().includes(q) ||
      (w.ro||"").toLowerCase().includes(q) || (w.en||"").toLowerCase().includes(q);
    return ok && (!filterCat || getCats(w).includes(filterCat)) && (!filterFavs || isFav(w.ko));
  });
  return sortWords(base);
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
      `<button class="gls-row-speak" type="button" aria-label="${t('speak')}" title="${t('speak')}">🔊</button>` +
      `<span class="gls-row-dot" style="background:${color}"></span>` +
      `<div class="gls-row-icons">${_iconsHTML(word.ko)}</div>` +
    `</div>`;
  el.addEventListener("click", () => focusWord(word.ko));
  el.querySelector(".gls-row-speak").addEventListener("click", e => {
    e.stopPropagation();
    speakKO(word.ko);
  });
  return el;
}

// ── Focus word ──
function focusWord(ko, speak = true, pushHistory = false) {
  if (focusedKo === ko && !pushHistory) { closePanel(); return; }

  if (focusedKo) {
    const prev = listEl.querySelector(`[data-ko="${CSS.escape(focusedKo)}"]`);
    if (prev) prev.classList.remove("hot");
    if (pushHistory) panelHistory.push(focusedKo);
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

function goBackPanel() {
  if (!panelHistory.length) { closePanel(); return; }
  const prev = panelHistory.pop();
  focusWord(prev, false, false);
}

function closePanel() {
  if (focusedKo) {
    const row = listEl.querySelector(`[data-ko="${CSS.escape(focusedKo)}"]`);
    if (row) row.classList.remove("hot");
  }
  focusedKo = null;
  panelHistory = [];
  glsPanel.classList.remove("open");
  glsPanel.setAttribute("aria-hidden", "true");
  glsVeil.classList.remove("on");
}

// ── Panel content ──
// Returns all semantically associated words for `ko` using CLUSTERS (stable order, no shuffle)
function getAssociated(ko) {
  const koSet = new Set();
  for (const cl of CLUSTERS) {
    if (cl.words.includes(ko)) {
      cl.words.forEach(w => { if (w !== ko) koSet.add(w); });
    }
  }
  const pool = [];
  koSet.forEach(k => { const w = WORDS.find(x => x.ko === k); if (w) pool.push(w); });
  return pool;
}

function findExample(ko, max) {
  if (!SENTENCES.length) return [];
  const needle = (ko.endsWith("다") && ko.length > 2) ? ko.slice(0, -1) : ko;
  if (needle.length < 2) return [];
  const hits = SENTENCES.filter(s => s.ko.includes(needle));
  for (let i = hits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [hits[i], hits[j]] = [hits[j], hits[i]];
  }
  return hits.slice(0, max || 2);
}

function _renderPanel(word) {
  if (!word) return;
  const color = getCatColor(word);
  const cats  = getCats(word);

  // All semantically associated words (stable order)
  const associated = getAssociated(word.ko);

  // Example sentences
  const examples = findExample(word.ko);

  const hasHistory = panelHistory.length > 0;

  glsPanelBody.innerHTML =
    `<button class="gls-panel-back" onclick="${hasHistory ? "goBackPanel()" : "closePanel()"}">` +
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
      `<button class="gls-panel-btn gls-panel-speak" onclick="speakKO('${esc(word.ko)}')">` +
        `<span class="gls-panel-btn-ico">🔊</span>${t("speak")}` +
      `</button>` +
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

    (examples.length
      ? `<div class="gls-panel-hdg gls-panel-hdg-ex">${t("example")}</div>` +
        examples.map(ex =>
          `<div class="gls-panel-example">` +
            `<div class="gls-ex-ko-row">` +
              `<span class="gls-ex-ko">${sanitizeHTML(ex.ko)}</span>` +
              `<button class="gls-ex-speak" onclick="speakKO('${esc(ex.ko)}')" title="${t('speak')}" aria-label="${t('speak')}">🔊</button>` +
            `</div>` +
            `<div class="gls-ex-tr">${sanitizeHTML(currentLang === "ro" ? ex.ro : ex.en)}</div>` +
          `</div>`
        ).join("")
      : "") +

    (associated.length
      ? `<div class="gls-panel-hdg gls-panel-hdg-assoc">${t("associated")}</div>` +
        `<div class="gls-panel-related gls-panel-assoc">${associated.map(rw =>
          `<span class="gls-panel-rel gls-rel-assoc" onclick="focusWord('${esc(rw.ko)}',true,true)">${sanitizeHTML(rw.ko)}<span class="gls-rel-tr">${sanitizeHTML(getMeaning(rw))}</span></span>`
        ).join("")}</div>`
      : "");
}

// ── Daily popup ──
function showDailyPopup() {
  if (!daily.length) return;
  const today = new Date().toDateString();
  if (localStorage.getItem("RK_DAILY_POPUP") === today) return;
  localStorage.setItem("RK_DAILY_POPUP", today);

  const ov = document.createElement("div");
  ov.className = "gls-daily-overlay";
  ov.id = "dailyOverlay";
  ov.innerHTML =
    `<div class="gls-daily-popup">` +
      `<div class="gls-daily-popup-lbl">${t("daily")}</div>` +
      `<div class="gls-daily-popup-chips">` +
        daily.map(w =>
          `<div class="gls-daily-popup-chip" onclick="dismissDailyPopup('${esc(w.ko)}')">` +
            `<div class="gls-daily-popup-ko" style="color:${getCatColor(w)}">${sanitizeHTML(w.ko)}</div>` +
            `<div class="gls-daily-popup-tr">${sanitizeHTML(getMeaning(w))}</div>` +
          `</div>`
        ).join("") +
      `</div>` +
      `<button class="gls-daily-popup-cont" onclick="dismissDailyPopup()">` +
        (currentLang === "ro" ? "Continuă →" : "Continue →") +
      `</button>` +
    `</div>`;

  document.body.appendChild(ov);
}

function dismissDailyPopup(koToOpen) {
  const ov = document.getElementById("dailyOverlay");
  if (!ov) return;
  ov.classList.add("gls-ov-out");
  ov.addEventListener("animationend", () => {
    ov.remove();
    dailyCard.classList.add("gls-daily-settling");
    dailyCard.addEventListener("animationend", () => dailyCard.classList.remove("gls-daily-settling"), { once: true });
    if (koToOpen) focusWord(koToOpen);
  }, { once: true });
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

document.getElementById("sortBtn").addEventListener("click", applySortMenu);

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
    const [vocabRes, clustersRes, exRes] = await Promise.all([
      fetch("./data/vocab-korean.json"),
      fetch("./data/word-clusters.json"),
      fetch("./data/exercises.json")
    ]);
    if (!vocabRes.ok) throw new Error("HTTP " + vocabRes.status);
    const vocab = await vocabRes.json();
    WORDS = buildWords(vocab);
    if (clustersRes.ok) CLUSTERS = await clustersRes.json();
    if (exRes.ok) {
      const ex = await exRes.json();
      SENTENCES = [];
      (ex["ko-ro"] || []).forEach(e => {
        if (e.q && e.correct) SENTENCES.push({ ko: e.q, ro: e.correct.ro || "", en: e.correct.en || "" });
      });
      (ex["ro-ko"] || []).forEach(e => {
        if (e.correct && e.prompt) SENTENCES.push({ ko: e.correct, ro: e.prompt.ro || "", en: e.prompt.en || "" });
      });
    }
    listEl.innerHTML = "";
    pickDaily();
    buildCatDots();
    renderDailyView();
    render(true);
    setTimeout(showDailyPopup, 300);
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
