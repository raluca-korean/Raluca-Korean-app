const pageTitleEl = document.getElementById("pageTitle");
const pageSubtitleEl = document.getElementById("pageSubtitle");
const langBtn = document.getElementById("langBtn");
const dailyCard = document.getElementById("dailyCard");
const searchInput = document.getElementById("search");
const countEl = document.getElementById("count");
const listEl = document.getElementById("list");
const catFilterEl = document.getElementById("catFilter");
const favFilterBtn = document.getElementById("favFilterBtn");

const PAGE_SIZE = 20;
let currentPage = 1;
let WORDS = [];
let daily = [];
let currentLang = RKLang.get();
let filterCategory = "";
let filterFavsOnly = false;

const CATEGORY_COLORS = {
  subjects:   "#e74c3c",  // red    — subject
  objects:    "#2980b9",  // blue   — object
  nouns:      "#607d8b",  // slate  — noun
  verbs:      "#e91e63",  // pink   — verb
  adjectives: "#d4ac0d",  // gold   — modifier/adjective
  adverbs:    "#8e44ad",  // purple — adverb
  modifiers:  "#d4ac0d",  // gold   — modifier
  connectors: "#e67e22",  // orange — connector
  grammar:    "#1abc9c"   // teal   — grammar/particle
};

const CATEGORY_LABELS = {
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

const LABEL_TO_KEY = {};
Object.keys(CATEGORY_LABELS).forEach(key => {
  LABEL_TO_KEY[CATEGORY_LABELS[key].ro] = key;
  LABEL_TO_KEY[CATEGORY_LABELS[key].en] = key;
});

const UI_TEXT = {
  ro: {
    title: "Glosar Korean",
    subtitle: "Pronunție • Favorite • Context real",
    searchPlaceholder: "Caută (KO / RO / EN)",
    countWords: "cuvinte",
    noWords: "Nu există cuvinte.",
    dailyTitle: "📅 3 cuvinte pe zi",
    speak: "🔊 Pronunție",
    refresh: "🔁 Alte cuvinte",
    loadError: "Nu am putut încărca vocab-korean.json",
    category: "Categorie",
    allCategories: "Toate categoriile",
    favOnly: "⭐ Favorite"
  },
  en: {
    title: "Korean Glossary",
    subtitle: "Pronunciation • Favorites • Real context",
    searchPlaceholder: "Search (KO / RO / EN)",
    countWords: "words",
    noWords: "No words found.",
    dailyTitle: "📅 3 words a day",
    speak: "🔊 Pronunciation",
    refresh: "🔁 More words",
    loadError: "Could not load vocab-korean.json",
    category: "Category",
    allCategories: "All categories",
    favOnly: "⭐ Favorites"
  }
};

function getCategoryColor(word){
  const cats = currentLang === "ro" ? word.categoriesRo : word.categoriesEn;
  for(const cat of cats){
    const key = LABEL_TO_KEY[cat];
    if(key && CATEGORY_COLORS[key]) return CATEGORY_COLORS[key];
  }
  return null;
}

function getCatColor(label){
  const key = LABEL_TO_KEY[label];
  return (key && CATEGORY_COLORS[key]) || "#afafaf";
}

function categoryPills(word){
  return getCategories(word).map(cat => {
    const c = getCatColor(cat);
    return `<span class="cat-pill" style="color:${c};border-color:${c};background:${c}1a">${cat}</span>`;
  }).join(" ");
}

function t(key){
  return UI_TEXT[currentLang][key];
}


function updateStaticTexts(){
  pageTitleEl.textContent = t("title");
  pageSubtitleEl.textContent = t("subtitle");
  searchInput.placeholder = t("searchPlaceholder");
  favFilterBtn.textContent = t("favOnly") + (filterFavsOnly ? " ✓" : "");
  buildCatOptions();
}

function buildCatOptions(){
  const labels = Object.values(CATEGORY_LABELS).map(l => l[currentLang]);
  const opts = [`<option value="">${t("allCategories")}</option>`]
    .concat(labels.map(l => `<option value="${l}" ${filterCategory === l ? "selected" : ""}>${l}</option>`));
  catFilterEl.innerHTML = opts.join("");
}

function setLanguage(lang){
  currentLang = lang;
  filterCategory = "";
  updateStaticTexts();
  renderDailyView();
  render();
}

function getMeaning(word){
  return currentLang === "ro" ? word.ro : word.en;
}

function getCategories(word){
  return currentLang === "ro" ? word.categoriesRo : word.categoriesEn;
}

function shuffle(array){
  return [...array].sort(() => Math.random() - 0.5);
}

function getFavs(){
  return JSON.parse(localStorage.getItem("RK_FAV_WORDS") || "[]");
}

function getLearned(){
  return JSON.parse(localStorage.getItem("RK_LEARNED") || "[]");
}

function isLearned(ko){
  return getLearned().includes(ko);
}

function toggleLearned(ko){
  const learned = getLearned();
  const next = learned.includes(ko)
    ? learned.filter(k => k !== ko)
    : [...learned, ko];
  localStorage.setItem("RK_LEARNED", JSON.stringify(next));
  render();
  renderDailyView();
}

function isFav(ko){
  return getFavs().includes(ko);
}

function toggleFav(ko){
  const favs = getFavs();
  const nextFavs = favs.includes(ko)
    ? favs.filter(item => item !== ko)
    : [...favs, ko];

  localStorage.setItem("RK_FAV_WORDS", JSON.stringify(nextFavs));
  render();
  renderDailyView();
}

function speakKO(text){
  if(!text || !window.speechSynthesis) return;
  speechSynthesis.cancel();
  setTimeout(function(){
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  }, 50);
}

function openYouGlish(word){
  window.open(
    `https://youglish.com/pronounce/${encodeURIComponent(word)}/korean`,
    "_blank"
  );
}

function normalizeWordEntry(entry){
  return {
    ko: entry.ko || "",
    ro: entry.ro || "",
    en: entry.en || ""
  };
}

function buildWordsFromVocabulary(vocab){
  const map = new Map();

  Object.keys(CATEGORY_LABELS).forEach(categoryKey => {
    const items = Array.isArray(vocab[categoryKey]) ? vocab[categoryKey] : [];

    items.forEach(rawEntry => {
      const entry = normalizeWordEntry(rawEntry);
      const ko = entry.ko.trim();

      if(!ko) return;

      if(!map.has(ko)){
        map.set(ko, {
          ko,
          ro: entry.ro || "",
          en: entry.en || "",
          categoriesRo: new Set(),
          categoriesEn: new Set()
        });
      }

      const current = map.get(ko);

      if(!current.ro && entry.ro) current.ro = entry.ro;
      if(!current.en && entry.en) current.en = entry.en;

      current.categoriesRo.add(CATEGORY_LABELS[categoryKey].ro);
      current.categoriesEn.add(CATEGORY_LABELS[categoryKey].en);
    });
  });

  return Array.from(map.values())
    .map(word => ({
      ko: word.ko,
      ro: word.ro,
      en: word.en,
      categoriesRo: [...word.categoriesRo],
      categoriesEn: [...word.categoriesEn]
    }))
    .sort((a, b) => a.ko.localeCompare(b.ko, "ko"));
}

function skeletonWords(n){
  return Array.from({length:n}, () =>
    `<div class="word" style="pointer-events:none;cursor:default;gap:8px">
      <div class="rk-skeleton" style="height:17px;width:55%;margin-bottom:7px"></div>
      <div class="rk-skeleton" style="height:12px;width:38%"></div>
    </div>`
  ).join('');
}

async function loadVocabulary(){
  dailyCard.innerHTML = `<div class="rk-spinner">${currentLang==="ro"?"Se încarcă…":"Loading…"}</div>`;
  listEl.innerHTML = skeletonWords(8);
  countEl.textContent = "";

  try {
    const response = await fetch("./data/vocab-korean.json");
    const vocab = await response.json();

    WORDS = buildWordsFromVocabulary(vocab);

    pickDaily();
    renderDailyView();
    render();
  } catch (error) {
    console.error("Vocabulary load error:", error);
    dailyCard.innerHTML = `<div class="sub">${t("loadError")}</div>`;
    countEl.textContent = t("loadError");
    listEl.innerHTML = "";
  }
}

function pickDaily(){
  if(WORDS.length === 0){
    daily = [];
    return;
  }

  daily = shuffle(WORDS).slice(0, Math.min(3, WORDS.length));
}

function renderDailyView(){
  if(daily.length === 0){
    dailyCard.innerHTML = `<div class="sub">${t("noWords")}</div>`;
    return;
  }

  dailyCard.innerHTML = `
    <h3>${t("dailyTitle")}</h3>
    ${daily.map(word => {
      const koColor = getCategoryColor(word);
      const koStyle = koColor ? `cursor:pointer;color:${koColor};-webkit-text-fill-color:${koColor}` : `cursor:pointer`;
      return `
      <div class="word">
        <div>
          <div class="ko" style="${koStyle}" onclick="speakKO('${word.ko.replace(/'/g, "\\'")}')">${word.ko}</div>
          <div class="ro">${getMeaning(word)}</div>
          <div style="margin-top:3px">${categoryPills(word)}</div>
        </div>
        <div class="actions">
          <span class="icon" onclick="openYouGlish('${word.ko.replace(/'/g, "\\'")}')">🎥</span>
          <span class="icon star ${isFav(word.ko) ? 'active' : ''}" onclick="toggleFav('${word.ko.replace(/'/g, "\\'")}')">⭐</span>
          <span class="icon" style="color:${isLearned(word.ko) ? '#22c55e' : 'inherit'}" onclick="toggleLearned('${word.ko.replace(/'/g, "\\'")}')">✓</span>
        </div>
      </div>
      `;
    }).join("")}

    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button type="button" onclick="playDaily()">${t("speak")}</button>
      <button type="button" onclick="refreshDaily()">${t("refresh")}</button>
    </div>
  `;
}

function playDaily(){
  daily.forEach((word, index) => {
    setTimeout(() => speakKO(word.ko), index * 1200);
  });
}

function refreshDaily(){
  pickDaily();
  renderDailyView();
}

function getFiltered(){
  const query = searchInput.value.trim().toLowerCase();
  return WORDS.filter(word => {
    const textMatch = word.ko.toLowerCase().includes(query) ||
      (word.ro || "").toLowerCase().includes(query) ||
      (word.en || "").toLowerCase().includes(query);
    const cats = currentLang === "ro" ? word.categoriesRo : word.categoriesEn;
    const catMatch = !filterCategory || cats.includes(filterCategory);
    const favMatch = !filterFavsOnly || isFav(word.ko);
    return textMatch && catMatch && favMatch;
  });
}

function render(){
  const filtered = getFiltered();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  if(currentPage > totalPages) currentPage = totalPages;

  countEl.textContent = `${filtered.length} ${t("countWords")}`;

  if(filtered.length === 0){
    listEl.innerHTML = `<div class="sub">${t("noWords")}</div>`;
    return;
  }

  const start = (currentPage - 1) * PAGE_SIZE;
  const pageWords = filtered.slice(start, start + PAGE_SIZE);

  const wordsHTML = pageWords.map(word => {
    const koColor = getCategoryColor(word);
    const koStyle = koColor ? `cursor:pointer;color:${koColor};-webkit-text-fill-color:${koColor}` : `cursor:pointer`;
    return `
    <div class="word">
      <div>
        <div class="ko" style="${koStyle}" onclick="speakKO('${word.ko.replace(/'/g, "\\'")}')">${word.ko}</div>
        <div class="ro">${getMeaning(word)}</div>
        <div style="margin-top:3px">${categoryPills(word)}</div>
      </div>
      <div class="actions">
        <span class="icon" onclick="openYouGlish('${word.ko.replace(/'/g, "\\'")}')">🎥</span>
        <span class="icon star ${isFav(word.ko) ? 'active' : ''}" onclick="toggleFav('${word.ko.replace(/'/g, "\\'")}')">⭐</span>
        <span class="icon" style="color:${isLearned(word.ko) ? '#22c55e' : 'inherit'}" onclick="toggleLearned('${word.ko.replace(/'/g, "\\'")}')">✓</span>
      </div>
    </div>
    `;
  }).join("");

  const paginationHTML = totalPages > 1 ? `
    <div class="pagination">
      <button class="pgBtn" onclick="changePage(-1)" ${currentPage === 1 ? "disabled" : ""}>←</button>
      <span class="pgInfo">${currentPage} / ${totalPages}</span>
      <button class="pgBtn" onclick="changePage(1)" ${currentPage === totalPages ? "disabled" : ""}>→</button>
    </div>
  ` : "";

  listEl.innerHTML = wordsHTML + paginationHTML;
}

function changePage(delta){
  const totalPages = Math.max(1, Math.ceil(getFiltered().length / PAGE_SIZE));
  currentPage = Math.max(1, Math.min(totalPages, currentPage + delta));
  render();
  listEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

searchInput.addEventListener("input", () => { currentPage = 1; render(); });
RKLang.init(setLanguage);
catFilterEl.addEventListener("change", () => {
  filterCategory = catFilterEl.value;
  currentPage = 1;
  render();
});
favFilterBtn.addEventListener("click", () => {
  filterFavsOnly = !filterFavsOnly;
  favFilterBtn.classList.toggle("active", filterFavsOnly);
  favFilterBtn.textContent = t("favOnly") + (filterFavsOnly ? " ✓" : "");
  currentPage = 1;
  render();
});

updateStaticTexts();
loadVocabulary();
