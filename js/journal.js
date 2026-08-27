var LANG = RKLang.get();
var PROMPTS = [];
var JOURNAL_KEY = 'RK_JOURNAL';
var JOURNAL_XP = 10;

var I18N = {
  ro: {
    title: 'Jurnal',
    sub: 'Scrie liber în coreeană, în fiecare zi',
    promptLabel: 'Subiectul zilei',
    save: '💾 Salvează',
    saved: '✅ Salvat!',
    charCount: 'caractere coreene',
    historyTitle: 'Jurnalul tău',
    historyEmpty: 'Nu ai încă însemnări. Scrie prima azi!',
    streakLabel: 'zile la rând',
    placeholder: 'Scrie aici, în coreeană...'
  },
  en: {
    title: 'Journal',
    sub: 'Write freely in Korean, every day',
    promptLabel: "Today's topic",
    save: '💾 Save',
    saved: '✅ Saved!',
    charCount: 'Korean characters',
    historyTitle: 'Your journal',
    historyEmpty: "You don't have any entries yet. Write your first one today!",
    streakLabel: 'day streak',
    placeholder: 'Write here, in Korean...'
  }
};

var STARTERS = ['오늘은', '저는 오늘', '왜냐하면', '기분이 좋아요', '기분이 안 좋아요', '그리고', '하지만', '그래서', '제 생각에는', '다음에는'];

function t(k) { return I18N[LANG][k]; }

function todayISO() { return RKUtils.todayISO(); }

function countHangul(text) {
  var m = text.match(/[가-힣]/g);
  return m ? m.length : 0;
}

function loadJournal() {
  return RKStorage.get(JOURNAL_KEY, {});
}
function saveJournal(all) {
  RKStorage.set(JOURNAL_KEY, all);
}

function pickTodayPrompt() {
  var epochDay = Math.floor(Date.now() / 86400000);
  return PROMPTS[epochDay % PROMPTS.length];
}

function renderStreak() {
  var el = document.getElementById('streakStrip');
  if (!el || !window.RKStreak) return;
  var s = RKStreak.get();
  el.innerHTML = '<span class="fire">🔥</span><span>' + (s.days || 0) + ' ' + t('streakLabel') + '</span>';
}

function renderPrompt() {
  var today = pickTodayPrompt();
  document.getElementById('promptLabel').textContent = t('promptLabel');
  document.getElementById('promptText').textContent = today[LANG];
}

function renderChips() {
  var row = document.getElementById('chipRow');
  row.innerHTML = '';
  STARTERS.forEach(function(s) {
    var chip = document.createElement('button');
    chip.className = 'chip';
    chip.type = 'button';
    chip.textContent = s;
    chip.onclick = function() {
      var ta = document.getElementById('journalText');
      var sep = ta.value && !/\s$/.test(ta.value) ? ' ' : '';
      ta.value += sep + s + ' ';
      ta.focus();
      updateMeta();
    };
    row.appendChild(chip);
  });
}

function updateMeta() {
  var ta = document.getElementById('journalText');
  document.getElementById('metaCount').textContent = countHangul(ta.value) + ' ' + t('charCount');
}

function loadTodayText() {
  var all = loadJournal();
  var entry = all[todayISO()];
  var ta = document.getElementById('journalText');
  ta.value = entry ? entry.text : '';
  updateMeta();
}

function saveEntry() {
  var ta = document.getElementById('journalText');
  var text = ta.value.trim();
  if (!text) return;
  var today = todayISO();
  var all = loadJournal();
  var existing = all[today];
  var promptOfDay = pickTodayPrompt();
  var xpAlready = !!(existing && existing.xpAwarded);
  all[today] = { prompt: promptOfDay, text: text, savedAt: Date.now(), xpAwarded: true };
  saveJournal(all);

  if (window.RKStreak) RKStreak.touch();
  if (!xpAlready && window.RKGamification) RKGamification.addXPBonus(JOURNAL_XP);

  var status = document.getElementById('saveStatus');
  status.textContent = t('saved');
  status.classList.add('on');
  clearTimeout(status._hideTimer);
  status._hideTimer = setTimeout(function() { status.classList.remove('on'); }, 2200);

  renderStreak();
  renderHistory();
}

function renderHistory() {
  var wrap = document.getElementById('historyList');
  document.getElementById('historyTitle').textContent = t('historyTitle');
  var all = loadJournal();
  var today = todayISO();
  var dates = Object.keys(all).filter(function(d) { return d !== today; }).sort().reverse();

  if (!dates.length) {
    wrap.innerHTML = '<div class="hist-empty">' + t('historyEmpty') + '</div>';
    return;
  }

  wrap.innerHTML = '';
  dates.forEach(function(date) {
    var entry = all[date];
    var div = document.createElement('div');
    div.className = 'hist-entry';
    var preview = entry.text.length > 60 ? entry.text.slice(0, 60) + '…' : entry.text;
    div.innerHTML =
      '<div class="hist-prompt">' + (entry.prompt ? entry.prompt[LANG] : '') + '</div>' +
      '<div class="hist-head"><span class="hist-date">' + date + '</span></div>' +
      '<div class="hist-preview">' + preview + '</div>' +
      '<div class="hist-full">' + entry.text.replace(/</g, '&lt;') + '</div>';
    div.onclick = function() { div.classList.toggle('open'); };
    wrap.appendChild(div);
  });
}

function applyLang(lang) {
  LANG = lang;
  document.documentElement.lang = lang;
  document.getElementById('pageTitle').textContent = t('title');
  document.getElementById('pageSub').textContent = t('sub');
  document.getElementById('saveBtn').textContent = t('save');
  document.getElementById('journalText').placeholder = t('placeholder');
  renderStreak();
  renderPrompt();
  renderChips();
  updateMeta();
  renderHistory();
}

document.getElementById('journalText').addEventListener('input', updateMeta);
document.getElementById('saveBtn').addEventListener('click', saveEntry);

fetch('./data/journal-prompts.json')
  .then(function(r) { return r.json(); })
  .then(function(data) {
    PROMPTS = data;
    RKLang.init(applyLang);
    applyLang(LANG);
    loadTodayText();
  })
  .catch(function() {
    document.getElementById('promptText').textContent = 'Error loading data.';
  });
