const pageTitleEl = document.getElementById("pageTitle");
const pageSubtitleEl = document.getElementById("pageSubtitle");
const langRoBtn = document.getElementById("langRo");
const langEnBtn = document.getElementById("langEn");
const dailyCard = document.getElementById("dailyCard");
const searchInput = document.getElementById("search");
const countEl = document.getElementById("count");
const listEl = document.getElementById("list");
const catFilterEl = document.getElementById("catFilter");
const favFilterBtn = document.getElementById("favFilterBtn");

const PAGE_SIZE = 20;

function handleAction(el){
  const ko = el.dataset.ko;
  switch(el.dataset.action){
    case "speak":      speakKO(ko); break;
    case "youglish":   openYouGlish(ko); break;
    case "fav":        toggleFav(ko); break;
    case "quiz-check": checkQuizAnswer(el.dataset.answer, el.dataset.correct); break;
  }
}

function actionListener(e){
  const el = e.target.closest("[data-action]");
  if(!el) return;
  if(e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return;
  if(e.type === "keydown") e.preventDefault();
  handleAction(el);
}

dailyCard.addEventListener("click", actionListener);
dailyCard.addEventListener("keydown", actionListener);
listEl.addEventListener("click", actionListener);
listEl.addEventListener("keydown", actionListener);
let currentPage = 1;
let WORDS = [];
let daily = [];
let dailyIndex = 0;
let dailyHTML = "";
let currentLang = RKLang.current;
let filterCategory = "";
let filterFavsOnly = false;

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

const UI_TEXT = {
  ro: {
    title: "Glosar Korean",
    subtitle: "Pronunție • Favorite • Context real",
    searchPlaceholder: "Caută (KO / RO / EN)",
    countWords: "cuvinte",
    noWords: "Nu există cuvinte.",
    dailyTitle: "📅 3 cuvinte pe zi",
    speak: "🔊 Pronunție",
    practice: "🧠 Exersează",
    refresh: "🔁 Alte cuvinte",
    quizQuestion: "🧠 Ce înseamnă:",
    done: "🎉 Gata!",
    back: "⬅ Înapoi",
    tryAgain: "❌ Mai încearcă",
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
    practice: "🧠 Practice",
    refresh: "🔁 More words",
    quizQuestion: "🧠 What does it mean:",
    done: "🎉 Done!",
    back: "⬅ Back",
    tryAgain: "❌ Try again",
    loadError: "Could not load vocab-korean.json",
    category: "Category",
    allCategories: "All categories",
    favOnly: "⭐ Favorites"
  }
};

function t(key){
  return UI_TEXT[currentLang][key];
}

function escapeAttr(str){
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
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
  RKLang.set(lang);
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
  return JSON.parse(localStorage.getItem("FAV_WORDS") || "[]");
}

function isFav(ko){
  return getFavs().includes(ko);
}

function toggleFav(ko){
  const favs = getFavs();
  const nextFavs = favs.includes(ko)
    ? favs.filter(item => item !== ko)
    : [...favs, ko];

  localStorage.setItem("FAV_WORDS", JSON.stringify(nextFavs));
  render();
  renderDailyView();
}

function speakKO(text){
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.rate = 0.9;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
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

async function loadVocabulary(){
  try {
    const response = await fetch("./data/vocab-korean.json");
    if(!response.ok) throw new Error(response.status);
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
    ${daily.map(word => `
      <div class="word">
        <div>
          <div class="ko">${word.ko}</div>
          <div class="ro">${getMeaning(word)}</div>
          <div class="ro">${getCategories(word).join(" • ")}</div>
        </div>
        <div class="actions">
          <span class="icon" role="button" tabindex="0" data-action="speak" data-ko="${escapeAttr(word.ko)}" aria-label="Pronunță ${escapeAttr(word.ko)}">🔈</span>
          <span class="icon" role="button" tabindex="0" data-action="youglish" data-ko="${escapeAttr(word.ko)}" aria-label="YouGlish ${escapeAttr(word.ko)}">🎥</span>
          <span class="icon star ${isFav(word.ko) ? 'active' : ''}" role="button" tabindex="0" data-action="fav" data-ko="${escapeAttr(word.ko)}" aria-label="${isFav(word.ko) ? 'Elimină din favorite' : 'Adaugă la favorite'} ${escapeAttr(word.ko)}">⭐</span>
        </div>
      </div>
    `).join("")}

    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button type="button" onclick="playDaily()">${t("speak")}</button>
      <button type="button" onclick="startQuiz()">${t("practice")}</button>
      <button type="button" onclick="refreshDaily()">${t("refresh")}</button>
    </div>
  `;

  dailyHTML = dailyCard.innerHTML;
}

function playDaily(){
  daily.forEach((word, index) => {
    setTimeout(() => speakKO(word.ko), index * 1200);
  });
}

function startQuiz(){
  dailyIndex = 0;
  showQuizQuestion();
}

function showQuizQuestion(){
  if(dailyIndex >= daily.length){
    dailyCard.innerHTML = `
      <h3>${t("done")}</h3>
      <button type="button" onclick="exitQuiz()">${t("back")}</button>
    `;
    return;
  }

  const currentWord = daily[dailyIndex];
  speakKO(currentWord.ko);
  const correctMeaning = getMeaning(currentWord);

  const wrongPool = WORDS
    .map(word => getMeaning(word))
    .filter(meaning => meaning && meaning !== correctMeaning);

  const wrongOptions = shuffle([...new Set(wrongPool)]).slice(0, 2);
  const options = shuffle([correctMeaning, ...wrongOptions]);

  dailyCard.innerHTML = `
    <h3>${t("quizQuestion")}</h3>
    <div class="ko">${currentWord.ko}</div>
    ${options.map(option => `
      <button type="button" data-action="quiz-check" data-answer="${escapeAttr(option)}" data-correct="${escapeAttr(correctMeaning)}">${escapeAttr(option)}</button>
    `).join("")}
    <br>
    <button type="button" onclick="exitQuiz()">${t("back")}</button>
  `;
}

function checkQuizAnswer(selectedAnswer, correctAnswer){
  if(selectedAnswer === correctAnswer){
    dailyIndex++;
    showQuizQuestion();
  } else {
    alert(t("tryAgain"));
  }
}

function exitQuiz(){
  dailyCard.innerHTML = dailyHTML;
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

  const wordsHTML = pageWords.map(word => `
    <div class="word">
      <div>
        <div class="ko">${word.ko}</div>
        <div class="ro">${getMeaning(word)}</div>
        <div class="ro">${getCategories(word).join(" • ")}</div>
      </div>
      <div class="actions">
        <span class="icon" role="button" tabindex="0" data-action="speak" data-ko="${escapeAttr(word.ko)}" aria-label="Pronunță ${escapeAttr(word.ko)}">🔈</span>
        <span class="icon" role="button" tabindex="0" data-action="youglish" data-ko="${escapeAttr(word.ko)}" aria-label="YouGlish ${escapeAttr(word.ko)}">🎥</span>
        <span class="icon star ${isFav(word.ko) ? 'active' : ''}" role="button" tabindex="0" data-action="fav" data-ko="${escapeAttr(word.ko)}" aria-label="${isFav(word.ko) ? 'Elimină din favorite' : 'Adaugă la favorite'} ${escapeAttr(word.ko)}">⭐</span>
      </div>
    </div>
  `).join("");

  const paginationHTML = totalPages > 1 ? `
    <div class="pagination">
      <button class="pgBtn" onclick="changePage(-1)" ${currentPage === 1 ? "disabled" : ""}>&#8592;</button>
      <span class="pgInfo">${currentPage} / ${totalPages}</span>
      <button class="pgBtn" onclick="changePage(1)" ${currentPage === totalPages ? "disabled" : ""}>&#8594;</button>
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
