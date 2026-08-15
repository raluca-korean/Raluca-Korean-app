/**
 * RKStreak — one shared daily-activity streak for the whole app.
 *
 * Replaces four separate per-feature streaks (flashcards' RK_FC_DAY_STREAK,
 * lesson-neural's RK_STREAK_DAYS, hanja-book's RK_HJ_STREAK, plus whatever
 * a given page tracked only in memory) with a single RK_STREAK key: any
 * page that represents real study calls touch() once per session/activity,
 * and every page that displays a streak reads get().
 *
 * Existing users' streaks are carried over by the storage.js v3→v4
 * migration, which seeds RK_STREAK from whichever legacy source had the
 * longest streak before this module existed.
 */
(function (window) {
  'use strict';

  var KEY = 'RK_STREAK';

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (s && typeof s.days === 'number') return s;
    } catch (e) {}
    return { days: 0, best: 0, lastDate: '' };
  }

  function save(s) {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  }

  /* Call on any real study activity. No-ops after the first call each day. */
  function touch() {
    var today = todayStr();
    var s = load();
    if (s.lastDate === today) return s;

    var yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    s.days = (s.lastDate === yesterday) ? s.days + 1 : 1;
    s.lastDate = today;
    s.best = Math.max(s.days, s.best || 0);
    save(s);
    return s;
  }

  function get() {
    return load();
  }

  window.RKStreak = { touch: touch, get: get };
})(window);
