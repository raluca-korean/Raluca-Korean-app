/**
 * RKBackup — shared export/import + periodic reminder for the app's
 * localStorage progress data. There is no cloud sync: clearing the
 * browser or switching devices loses everything unless the user
 * exports a backup, so this nudges them to do it every so often.
 */
(function (window) {
  'use strict';

  /* Every RK_ progress/preference key except RK_SCHEMA_VER, which
     storage.js deliberately excludes so a restored backup re-runs
     migrations on the next load. */
  var KEYS = [
    'RK_STATS','RK_LESSON_DONE','RK_LEARNED_EX','RK_LEARNED','RK_LEVEL',
    'RK_EX_SRS','RK_WRONG_LOG','RK_SPEED','RK_DONE_NEURAL','RK_STREAK',
    'RK_XP','RK_BADGES','RK_DAILY_QUEST','RK_DAILY_POPUP',
    'RK_FAV_WORDS','RK_VOCAB_USER','RK_WORD_USAGE','RK_DICT_RECENT','RK_SAVED_SENTENCES',
    'RK_FC_SRS','RK_FC_SORT','RK_FC_STATS','RK_FC_DAY_STREAK','RK_FC_LAST_DATE',
    'RK_HJ_LEARNED','RK_HJ_QUEUE','RK_HJ_SRS','RK_HJ_STREAK',
    'RK_RD_READ','RK_RD_SAVED','RK_RD_FONT','RK_STORIES','RK_SFP_DONE','RK_SFP_SHOWN','RK_SLOT_SPINS',
    'RK_EXAM_HISTORY','RK_CONV_SCORES','RK_SPOKE_EVER','RK_TOPIK_GOAL',
    'RK_COMPOSITIONS','RK_DAILY_PRON','RK_LAST_BACKUP','RK_NEURAL_FATE',
    'RK_LANG','RK_THEME'
  ];

  var LAST_BACKUP_KEY  = 'RK_LAST_BACKUP';
  var DISMISS_KEY      = 'RK_BACKUP_REMIND_DISMISS';
  var REMIND_AFTER_MS  = 14 * 24 * 60 * 60 * 1000; // nudge if no backup in 14 days
  var SNOOZE_MS        = 7  * 24 * 60 * 60 * 1000; // don't re-nag for 7 days after "later"

  function exportNow() {
    var payload = { version: 1, exported: new Date().toISOString() };
    KEYS.forEach(function (k) {
      var v = localStorage.getItem(k);
      if (v !== null) payload[k] = v;
    });
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href     = url;
    a.download = 'raluca-korean-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    try { localStorage.setItem(LAST_BACKUP_KEY, new Date().toISOString()); } catch (e) {}
    return payload;
  }

  function importFromFile(file, cb) {
    if (!file) { cb(new Error('no file')); return; }
    var reader = new FileReader();
    reader.onload = function (e) {
      try {
        var data = JSON.parse(e.target.result);
        if (!data.version) throw new Error('not a backup');
        var count = 0;
        KEYS.forEach(function (k) {
          if (data[k] !== undefined) { localStorage.setItem(k, data[k]); count++; }
        });
        try { localStorage.setItem(LAST_BACKUP_KEY, new Date().toISOString()); } catch (e2) {}
        cb(null, count);
      } catch (err) { cb(err); }
    };
    reader.onerror = function () { cb(new Error('read error')); };
    reader.readAsText(file);
  }

  function getLastBackup() {
    try { return localStorage.getItem(LAST_BACKUP_KEY); } catch (e) { return null; }
  }

  function hasMeaningfulData() {
    try {
      var stats = JSON.parse(localStorage.getItem('RK_STATS') || 'null');
      if (stats && stats.total > 0) return true;
      if (parseInt(localStorage.getItem('RK_XP') || '0', 10) > 0) return true;
      var streak = JSON.parse(localStorage.getItem('RK_STREAK') || 'null');
      if (streak && streak.days > 0) return true;
      var fc = JSON.parse(localStorage.getItem('RK_FC_SRS') || '{}');
      if (Object.keys(fc).length) return true;
      var hj = JSON.parse(localStorage.getItem('RK_HJ_SRS') || '{}');
      if (Object.keys(hj).length) return true;
    } catch (e) {}
    return false;
  }

  function shouldRemind() {
    if (!hasMeaningfulData()) return false;
    var last   = getLastBackup();
    var lastMs = last ? new Date(last).getTime() : 0;
    if (Date.now() - lastMs < REMIND_AFTER_MS) return false;
    var dismissed = parseInt(localStorage.getItem(DISMISS_KEY) || '0', 10);
    if (Date.now() - dismissed < SNOOZE_MS) return false;
    return true;
  }

  function dismissReminder() {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch (e) {}
  }

  /* Self-contained fixed banner — hardcodes colors instead of reading
     page CSS vars, since it's mounted both on index.html (custom dark-
     space theme, no theme-anime.css) and on regular theme-anime pages. */
  function renderReminderBanner() {
    if (document.getElementById('rkBackupReminder')) return;
    if (!shouldRemind()) return;

    var lang = ((localStorage.getItem('RK_LANG') || 'ro') === 'en') ? 'en' : 'ro';
    var T = lang === 'ro'
      ? { msg: '💾 Nu ai făcut backup progresului de un timp. Dacă pierzi datele browserului, pierzi tot progresul.', now: 'Backup acum', later: 'Mai târziu' }
      : { msg: "💾 You haven't backed up your progress in a while. Losing browser data means losing all of it.", now: 'Back up now', later: 'Later' };

    if (!document.getElementById('rkBackupReminderStyle')) {
      var style = document.createElement('style');
      style.id = 'rkBackupReminderStyle';
      style.textContent =
        '@keyframes rkBackupIn{from{opacity:0;transform:translateX(-50%) translateY(12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
      document.head.appendChild(style);
    }

    var bar = document.createElement('div');
    bar.id = 'rkBackupReminder';
    bar.style.cssText =
      'position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:9999;' +
      'max-width:92vw;width:480px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;' +
      'padding:12px 16px;border-radius:16px;font-family:inherit;font-size:13px;color:#fff;' +
      'background:linear-gradient(135deg,#db2777,#7c3aed);box-shadow:0 10px 30px rgba(0,0,0,.35);' +
      'animation:rkBackupIn .3s ease;';
    bar.innerHTML =
      '<span style="flex:1;min-width:200px;line-height:1.4">' + T.msg + '</span>' +
      '<button id="rkBackupNowBtn" style="background:#fff;color:#7c3aed;border:none;border-radius:10px;padding:8px 14px;font-weight:800;font-size:12px;cursor:pointer;white-space:nowrap;font-family:inherit">' + T.now + '</button>' +
      '<button id="rkBackupLaterBtn" style="background:rgba(255,255,255,.15);color:#fff;border:none;border-radius:10px;padding:8px 12px;font-weight:700;font-size:12px;cursor:pointer;white-space:nowrap;font-family:inherit">' + T.later + '</button>';

    document.body.appendChild(bar);
    // Reserve space so the fixed banner never sits on top of page content
    // (buttons, cards) near the bottom of the viewport.
    var prevPadding = document.body.style.paddingBottom;
    document.body.style.paddingBottom = (bar.offsetHeight + 34) + 'px';
    function dismiss() {
      bar.remove();
      document.body.style.paddingBottom = prevPadding;
    }

    document.getElementById('rkBackupNowBtn').addEventListener('click', function () {
      exportNow();
      dismiss();
    });
    document.getElementById('rkBackupLaterBtn').addEventListener('click', function () {
      dismissReminder();
      dismiss();
    });
  }

  window.RKBackup = {
    KEYS: KEYS,
    exportNow: exportNow,
    importFromFile: importFromFile,
    getLastBackup: getLastBackup,
    hasMeaningfulData: hasMeaningfulData,
    shouldRemind: shouldRemind,
    dismissReminder: dismissReminder,
    renderReminderBanner: renderReminderBanner
  };
})(window);
