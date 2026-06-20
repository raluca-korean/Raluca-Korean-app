let currentLang = RKLang.get();

const UI = {
  ro:{
    title:"📊 Statistici", subtitle:"Progresul tău de învățare",
    today:"Azi", allTime:"Total",
    exercises:"Exerciții", correct:"Corecte", accuracy:"Acuratețe",
    bestStreak:"Cel mai lung streak", favorites:"Favorite",
    byType:"Per tip de exercițiu",
    weakTitle:"⚠ Puncte slabe",
    weakSub:"Tipuri cu acuratețe sub 65% (min. 5 exerciții). Concentrează-te pe acestea!",
    weakLink:"Practică →",
    noData:"Nu există date încă. Fă câteva exerciții mai întâi!",
    goExercise:"Mergi la exerciții →",
    types:{ "ko-ro":"KO→RO","ro-ko":"RO→KO","particle":"Particulă (1)","particlePlus":"Particule multiple","conjug":"Conjugare","puzzle":"Puzzle","chain":"Chain" },
    backupTitle:"Backup & Restaurare",
    backupSub:"Exportă progresul înainte de a șterge browserul, sau importă un backup anterior.",
    exportBtn:"⬇ Exportă JSON",
    importBtn:"⬆ Importă JSON",
    importOk:n => `✓ ${n} chei restaurate. Reîncărcând…`,
    importBad:"⚠ Fișier invalid sau corupt.",
    exportDone:"✓ Backup descărcat."
  },
  en:{
    title:"📊 Statistics", subtitle:"Your learning progress",
    today:"Today", allTime:"All Time",
    exercises:"Exercises", correct:"Correct", accuracy:"Accuracy",
    bestStreak:"Best Streak", favorites:"Favorites",
    byType:"Per exercise type",
    weakTitle:"⚠ Weak spots",
    weakSub:"Types with accuracy below 65% (min. 5 exercises). Focus on these!",
    weakLink:"Practice →",
    noData:"No data yet. Do some exercises first!",
    goExercise:"Go to exercises →",
    types:{ "ko-ro":"KO→RO","ro-ko":"RO→KO","particle":"Particle (1)","particlePlus":"Multiple particles","conjug":"Conjugation","puzzle":"Puzzle","chain":"Chain" },
    backupTitle:"Backup & Restore",
    backupSub:"Export your progress before clearing the browser, or import a previous backup.",
    exportBtn:"⬇ Export JSON",
    importBtn:"⬆ Import JSON",
    importOk:n => `✓ ${n} keys restored. Reloading…`,
    importBad:"⚠ Invalid or corrupt file.",
    exportDone:"✓ Backup downloaded."
  }
};

const BACKUP_KEYS = [
  "RK_STATS","RK_LESSON_DONE","RK_LEARNED_EX",
  "RK_FAV_WORDS","RK_FC_SRS","RK_FC_SORT","RK_FC_STATS",
  "RK_HJ_LEARNED","RK_LEARNED","RK_LEVEL","RK_LANG","RK_THEME"
];

function t(k){ return UI[currentLang][k]; }
function pct(c, tot){ return tot === 0 ? 0 : Math.round(c/tot*100); }

function showBackupMsg(msg, ok){
  const el = document.getElementById("backupMsg");
  if(!el) return;
  el.textContent = msg;
  el.className = "backup-msg " + (ok ? "ok" : "err");
}

function exportData(){
  const payload = { version:1, exported:new Date().toISOString() };
  BACKUP_KEYS.forEach(k => {
    const v = localStorage.getItem(k);
    if(v !== null) payload[k] = v;
  });
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type:"application/json"});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `raluca-korean-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showBackupMsg(t("exportDone"), true);
}

function importFile(file){
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(e){
    try {
      const data = JSON.parse(e.target.result);
      if(!data.version) throw new Error("not a backup");
      let count = 0;
      BACKUP_KEYS.forEach(k => {
        if(data[k] !== undefined){
          localStorage.setItem(k, data[k]);
          count++;
        }
      });
      showBackupMsg(t("importOk")(count), true);
      setTimeout(() => location.reload(), 1400);
    } catch(_){
      showBackupMsg(t("importBad"), false);
    }
  };
  reader.readAsText(file);
}

function render(){
  document.getElementById("pageTitle").textContent    = t("title");
  document.getElementById("pageSubtitle").textContent = t("subtitle");

  let s;
  try { s = JSON.parse(localStorage.getItem("RK_STATS") || "null"); } catch(e){ s = null; }
  const favCount = (JSON.parse(localStorage.getItem("RK_FAV_WORDS") || "[]")).length;
  const el = document.getElementById("mainStats");

  let statsHtml;
  if(!s || s.total === 0){
    statsHtml = `
      <div class="card">
        <div class="empty">${t("noData")}</div>
        <div style="text-align:center;margin-top:12px">
          <a href="./exercises.html" style="color:#db2877;font-weight:900">${t("goExercise")}</a>
        </div>
      </div>`;
  } else {
    const todayDate    = new Date().toISOString().slice(0,10);
    const todayTotal   = s.today === todayDate ? s.todayTotal   : 0;
    const todayCorrect = s.today === todayDate ? s.todayCorrect : 0;

    statsHtml = `
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
        ${Object.entries(s.byType || {}).map(([type, d]) => {
          const p = pct(d.correct, d.total);
          const fillColor = p >= 75 ? 'var(--rk-green)' : p >= 55 ? '#f59e0b' : 'var(--rk-red)';
          const isWeak = p < 65 && d.total >= 5;
          return `<div class="bar-wrap">
            <div class="bar-label">
              <span>${isWeak ? '⚠ ' : ''}${t("types")[type] || type}</span>
              <span style="color:${fillColor};font-weight:900">${d.correct}/${d.total} (${p}%)</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill" style="width:${p}%;background:${fillColor}"></div>
            </div>
          </div>`;
        }).join("")}
      </div>

      ${(() => {
        const WEAK_THRESHOLD = 65;
        const WEAK_MIN = 5;
        const weakTypes = Object.entries(s.byType || {})
          .filter(([, d]) => d.total >= WEAK_MIN && pct(d.correct, d.total) < WEAK_THRESHOLD)
          .sort(([,a],[,b]) => pct(a.correct,a.total) - pct(b.correct,b.total))
          .slice(0, 3);
        if (!weakTypes.length) return '';
        return `<div class="card weak-card">
          <h2>${t("weakTitle")}</h2>
          <p class="sub" style="margin:0 0 14px">${t("weakSub")}</p>
          ${weakTypes.map(([type, d]) => {
            const p = pct(d.correct, d.total);
            return `<div class="weak-spot">
              <div class="weak-spot-icon">⚠️</div>
              <div class="weak-spot-info">
                <div class="weak-spot-name">${t("types")[type] || type}</div>
                <div class="weak-spot-acc">${p}% ${t("accuracy").toLowerCase()} · ${d.total} ${t("exercises").toLowerCase()}</div>
              </div>
              <div class="weak-spot-bar-wrap">
                <div class="weak-spot-bar-fill" style="width:${p}%"></div>
              </div>
              <a href="exercises.html" class="weak-spot-link">${t("weakLink")}</a>
            </div>`;
          }).join("")}
        </div>`;
      })()}`;
  }

  el.innerHTML = statsHtml + `
    <div class="card">
      <h2>${t("backupTitle")}</h2>
      <p class="sub" style="margin:0 0 14px">${t("backupSub")}</p>
      <div class="backup-row">
        <button type="button" id="exportBtn">${t("exportBtn")}</button>
        <button type="button" id="importBtn">${t("importBtn")}</button>
        <input type="file" id="importFile" accept=".json" style="display:none">
      </div>
      <div id="backupMsg" class="backup-msg"></div>
    </div>`;

  document.getElementById("exportBtn").addEventListener("click", exportData);
  document.getElementById("importBtn").addEventListener("click", () =>
    document.getElementById("importFile").click()
  );
  document.getElementById("importFile").addEventListener("change", e =>
    importFile(e.target.files[0])
  );
}

RKLang.init(function(lang){
  currentLang = lang;
  render();
});
render();
