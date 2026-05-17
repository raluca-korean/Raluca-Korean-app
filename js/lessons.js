const listEl      = document.getElementById("lessonList");
const contentEl   = document.getElementById("lessonContent");
const pageTitleEl = document.getElementById("pageTitle");
const pageSubtitleEl = document.getElementById("pageSubtitle");
const langBtn     = document.getElementById("langBtn");
const tabsEl      = document.getElementById("topikTabs");

let lessons        = [];
let currentLessonId = null;
let currentTopik   = 1;
let currentLang    = RKLang.get();

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
    loadError:    "Nu am putut încărca lessons.json",
    retry:        "Încearcă din nou"
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
    loadError:    "Could not load lessons.json",
    retry:        "Try again"
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
    const count = lessons.filter(l => l.topik === level).length;
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

function getDoneLessons(){
  try { return JSON.parse(localStorage.getItem("RK_LESSON_DONE") || "[]"); } catch(e){ return []; }
}

function renderLessonList(){
  listEl.innerHTML = "";
  const filtered = lessons.filter(l => l.topik === currentTopik);
  const done = getDoneLessons();

  filtered.forEach((lesson, idx) => {
    const el = document.createElement("div");
    const isDone = done.includes(lesson.id);
    el.className = "lesson-item" + (lesson.id === currentLessonId ? " active" : "") + (isDone ? " lesson-done" : "");
    el.dataset.id = lesson.id;
    el.innerHTML = `<span class="lesson-title">${idx + 1}. ${lesson.title[currentLang]}</span>${isDone ? '<span class="lesson-check">✓</span>' : ''}`;
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
    el.classList.add("colorized");
    el.innerHTML = GrammarColor.colorize(el.textContent);
    el.addEventListener("click", () => speakKorean(examples[idx].ko));
  });
}

function setLanguage(lang){
  currentLang = lang;
  updateHeaderTexts();
  renderTabs();
  renderLessonList();
  if(currentLessonId) selectLesson(currentLessonId);
  else contentEl.innerHTML = `<div class="sub">${t("selectLesson")}</div>`;
}

async function loadLessons(){
  listEl.innerHTML = `<div class="rk-spinner"></div>`;
  contentEl.innerHTML = `<div class="rk-spinner">${currentLang==="ro"?"Se încarcă lecțiile…":"Loading lessons…"}</div>`;

  try {
    const res  = await fetch("./data/lessons.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    lessons = Array.isArray(data) ? data : [];
    lessons.sort((a,b) => a.topik !== b.topik ? a.topik - b.topik : a.id.localeCompare(b.id));
    renderTabs();
    renderLessonList();
    const first = lessons.find(l => l.topik === currentTopik);
    if(first) selectLesson(first.id);
  } catch(e){
    listEl.innerHTML = "";
    contentEl.innerHTML =
      '<div class="rk-load-error">' +
      '<p>' + t("loadError") + '</p>' +
      '<button type="button" id="_retryLoad">' + t("retry") + '</button>' +
      '</div>';
    var rb = document.getElementById("_retryLoad");
    if (rb) rb.addEventListener("click", loadLessons);
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
