const listEl      = document.getElementById("lessonList");
const contentEl   = document.getElementById("lessonContent");
const pageTitleEl = document.getElementById("pageTitle");
const pageSubtitleEl = document.getElementById("pageSubtitle");
const langRoBtn   = document.getElementById("langRo");
const langEnBtn   = document.getElementById("langEn");
const tabsEl      = document.getElementById("topikTabs");

let lessons        = [];
let currentLessonId = null;
let currentTopik   = 1;
let currentLang    = RKLang.current;

const UI_TEXT = {
  ro: {
    pageTitle:    "Lecții TOPIK",
    pageSubtitle: "Structurate • Clare • Conectate cu exercițiile",
    selectLesson: "Selectează o lecție din stânga",
    lessonMissing:"Lecția nu există.",
    structure:    "Structură",
    notes:        "Note",
    practice:     "Exersează această lecție →",
    topik:        "TOPIK",
    loadError:    "Nu am putut încărca lessons.json"
  },
  en: {
    pageTitle:    "TOPIK Lessons",
    pageSubtitle: "Structured • Clear • Connected to exercises",
    selectLesson: "Select a lesson from the left",
    lessonMissing:"Lesson not found.",
    structure:    "Structure",
    notes:        "Notes",
    practice:     "Practice this lesson →",
    topik:        "TOPIK",
    loadError:    "Could not load lessons.json"
  }
};

function t(key){ return UI_TEXT[currentLang][key]; }

function updateHeaderTexts(){
  pageTitleEl.textContent    = t("pageTitle");
  pageSubtitleEl.textContent = t("pageSubtitle");
}


function renderTabs(){
  tabsEl.innerHTML = "";
  [1,2,3,4,5,6].forEach(level => {
    const btn   = document.createElement("button");
    btn.type    = "button";
    btn.className = "topik-tab" + (level === currentTopik ? " active" : "");
    btn.textContent = `T${level}`;
    btn.addEventListener("click", () => setTopik(level));
    tabsEl.appendChild(btn);
  });
}

function setTopik(level){
  currentTopik = level;
  renderTabs();
  renderLessonList();

  const first = lessons.find(l => l.topik === level);
  if(first){
    selectLesson(first.id);
  } else {
    contentEl.innerHTML = `<div class="sub">${t("selectLesson")}</div>`;
  }
}

function renderLessonList(){
  listEl.innerHTML = "";
  const filtered = lessons.filter(l => l.topik === currentTopik);

  filtered.forEach((lesson, idx) => {
    const el = document.createElement("div");
    el.className = "lesson-item" + (lesson.id === currentLessonId ? " active" : "");
    el.dataset.id = lesson.id;
    el.textContent = `${idx + 1}. ${lesson.title[currentLang]}`;
    el.addEventListener("click", () => selectLesson(lesson.id));
    listEl.appendChild(el);
  });
}

function selectLesson(id){
  currentLessonId = id;
  document.querySelectorAll(".lesson-item").forEach(item => {
    item.classList.toggle("active", item.dataset.id === id);
  });

  const lesson = lessons.find(l => l.id === id);
  if(!lesson){
    contentEl.innerHTML = `<div class="sub">${t("lessonMissing")}</div>`;
    return;
  }

  const notes    = Array.isArray(lesson.notes[currentLang]) ? lesson.notes[currentLang] : [];
  const examples = Array.isArray(lesson.examples) ? lesson.examples : [];

  contentEl.innerHTML = `
    <span class="badge">${t("topik")} ${lesson.topik}</span>
    <h2>${lesson.title[currentLang]}</h2>
    <p style="margin-top:8px">${lesson.explanation[currentLang]}</p>
    <div class="sub" style="margin-top:8px"><b>${t("structure")}:</b> ${lesson.structure}</div>

    ${examples.map((ex, i) => `
      <div class="example">
        <div class="ko ko-speak" data-idx="${i}">${ex.ko}</div>
        <div class="ro">${ex[currentLang]}</div>
      </div>
    `).join("")}

    ${notes.length ? `
      <div class="notes">
        <b>${t("notes")}:</b>
        <ul>${notes.map(n => `<li>${n}</li>`).join("")}</ul>
      </div>
    ` : ""}

    <button type="button" id="practiceLessonBtn" style="margin-top:14px">${t("practice")}</button>
  `;

  document.getElementById("practiceLessonBtn")
    .addEventListener("click", () => {
      window.location.href = `exercises.html?lesson=${lesson.id}`;
    });

  contentEl.querySelectorAll(".ko-speak").forEach(el => {
    const idx = parseInt(el.dataset.idx, 10);
    el.addEventListener("click", () => speakKorean(examples[idx].ko));
  });
}

function setLanguage(lang){
  currentLang = lang;
  RKLang.set(lang);
  updateHeaderTexts();
  renderTabs();
  renderLessonList();
  if(currentLessonId) selectLesson(currentLessonId);
  else contentEl.innerHTML = `<div class="sub">${t("selectLesson")}</div>`;
}

async function loadLessons(){
  try {
    const res  = await fetch("./data/lessons.json");
    if(!res.ok) throw new Error(res.status);
    const data = await res.json();
    lessons = Array.isArray(data) ? data : [];
    lessons.sort((a,b) => a.topik !== b.topik ? a.topik - b.topik : a.id.localeCompare(b.id));
    renderTabs();
    renderLessonList();
    const first = lessons.find(l => l.topik === currentTopik);
    if(first) selectLesson(first.id);
  } catch(e){
    contentEl.innerHTML = `<div class="sub">${t("loadError")}</div>`;
  }
}

function speakKorean(text){
  if(!text || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "ko-KR";
  utt.rate = 0.9;
  window.speechSynthesis.speak(utt);
}

RKLang.init(setLanguage);

updateHeaderTexts();
contentEl.innerHTML = `<div class="sub">${t("selectLesson")}</div>`;
loadLessons();
