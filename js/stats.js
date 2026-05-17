let currentLang = RKLang.get();

const UI = {
  ro:{
    title:"📊 Statistici", subtitle:"Progresul tău de învățare",
    today:"Azi", allTime:"Total",
    exercises:"Exerciții", correct:"Corecte", accuracy:"Acuratețe",
    bestStreak:"Cel mai lung streak", favorites:"Favorite",
    byType:"Per tip de exercițiu",
    noData:"Nu există date încă. Fă câteva exerciții mai întâi!",
    goExercise:"Mergi la exerciții →",
    types:{ "ko-ro":"KO→RO","ro-ko":"RO→KO","particle":"Particulă (1)","particlePlus":"Particule multiple","conjug":"Conjugare","puzzle":"Puzzle","chain":"Chain" }
  },
  en:{
    title:"📊 Statistics", subtitle:"Your learning progress",
    today:"Today", allTime:"All Time",
    exercises:"Exercises", correct:"Correct", accuracy:"Accuracy",
    bestStreak:"Best Streak", favorites:"Favorites",
    byType:"Per exercise type",
    noData:"No data yet. Do some exercises first!",
    goExercise:"Go to exercises →",
    types:{ "ko-ro":"KO→RO","ro-ko":"RO→KO","particle":"Particle (1)","particlePlus":"Multiple particles","conjug":"Conjugation","puzzle":"Puzzle","chain":"Chain" }
  }
};

function t(k){ return UI[currentLang][k]; }

function pct(c, tot){ return tot === 0 ? 0 : Math.round(c/tot*100); }

function render(){
  document.getElementById("pageTitle").textContent = t("title");
  document.getElementById("pageSubtitle").textContent = t("subtitle");

  let s;
  try { s = JSON.parse(localStorage.getItem("RK_STATS") || "null"); } catch(e){ s = null; }
  const favCount = (JSON.parse(localStorage.getItem("FAV_WORDS") || "[]")).length;
  const el = document.getElementById("mainStats");

  if(!s || s.total === 0){
    el.innerHTML = `
      <div class="card">
        <div class="empty">${t("noData")}</div>
        <div style="text-align:center;margin-top:12px">
          <a href="./exercises.html" style="color:#db2777;font-weight:900">${t("goExercise")}</a>
        </div>
      </div>`;
    return;
  }

  const todayDate = new Date().toISOString().slice(0,10);
  const todayTotal = s.today === todayDate ? s.todayTotal : 0;
  const todayCorrect = s.today === todayDate ? s.todayCorrect : 0;

  el.innerHTML = `
    <div class="card">
      <h2>${t("today")}</h2>
      <div class="grid2">
        <div class="stat-box">
          <div class="stat-num">${todayTotal}</div>
          <div class="stat-label">${t("exercises")}</div>
        </div>
        <div class="stat-box">
          <div class="stat-num">${todayTotal ? pct(todayCorrect,todayTotal)+"%" : "—"}</div>
          <div class="stat-label">${t("accuracy")}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>${t("allTime")}</h2>
      <div class="grid2">
        <div class="stat-box">
          <div class="stat-num">${s.total}</div>
          <div class="stat-label">${t("exercises")}</div>
        </div>
        <div class="stat-box">
          <div class="stat-num">${pct(s.correct,s.total)}%</div>
          <div class="stat-label">${t("accuracy")}</div>
        </div>
        <div class="stat-box">
          <div class="stat-num">${s.bestStreak}</div>
          <div class="stat-label">${t("bestStreak")}</div>
        </div>
        <div class="stat-box">
          <div class="stat-num">${favCount}</div>
          <div class="stat-label">${t("favorites")}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>${t("byType")}</h2>
      ${Object.entries(s.byType || {}).map(([type, d]) => `
        <div class="bar-wrap">
          <div class="bar-label">
            <span>${t("types")[type] || type}</span>
            <span>${d.correct}/${d.total} (${pct(d.correct,d.total)}%)</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width:${pct(d.correct,d.total)}%"></div>
          </div>
        </div>
      `).join("")}
    </div>`;
}

RKLang.init(function(lang){
  currentLang = lang;
  render();
});
render();
