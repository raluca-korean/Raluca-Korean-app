/**
 * RKLevelProgress — automatic TOPIK level (1-6) that advances on its own as
 * the learner clears enough of the current level's lessons + exercises.
 *
 * Reuses RK_LEVEL, the plain (non-JSON) localStorage key exercises.html/
 * js/exercises.js already reads/writes for its own level selector — so
 * picking a level there (or here) is the same "current level" everywhere.
 */
(function (window) {
  'use strict';

  var LEVEL_KEY = 'RK_LEVEL';
  var MAX_LEVEL = 6;
  var ADVANCE_THRESHOLD = 0.8;

  function getLevel() {
    var v = parseInt(localStorage.getItem(LEVEL_KEY), 10);
    return (v >= 1 && v <= MAX_LEVEL) ? v : 1;
  }
  function setLevel(n) {
    localStorage.setItem(LEVEL_KEY, String(n));
  }

  // Same key format exercises.js/today.html use for RK_EX_SRS.
  function exerciseKey(type, item) {
    if (type === "ko-ro")      return "ko-ro||" + (item.q || "");
    if (type === "ro-ko")      return "ro-ko||" + (item.correct || "");
    if (type === "particle")   return "particle||" + (item.template || "") + "|" + (item.correct || "");
    if (type === "particlePlus") return "pp||" + (item.template || "") + "|" + (Array.isArray(item.correct) ? item.correct.join() : item.correct || "");
    if (type === "conjug")     return "conjug||" + (item.correct || "");
    if (type === "puzzle")     return "puzzle||" + (Array.isArray(item.correct) ? item.correct[0] : "");
    if (type === "chain")      return "chain||" + (Array.isArray(item.correct) ? item.correct[0] : "");
    return type + "||" + JSON.stringify(item.correct);
  }

  function computeLevelStats(level, lessons, exJson) {
    var lessonsInLevel = lessons.filter(function (l) { return l.topik === level; });
    var doneLessons = JSON.parse(localStorage.getItem('RK_LESSON_DONE') || '[]');
    var lessonsDone = lessonsInLevel.filter(function (l) { return doneLessons.indexOf(l.id) !== -1; }).length;

    var exSrs = window.RKSrs ? RKSrs.load('RK_EX_SRS') : {};
    var exTotal = 0, exDone = 0;
    Object.keys(exJson || {}).forEach(function (type) {
      (exJson[type] || []).forEach(function (item) {
        if (item.topik !== level) return;
        exTotal++;
        if (exSrs[exerciseKey(type, item)]) exDone++;
      });
    });

    var total = lessonsInLevel.length + exTotal;
    var done = lessonsDone + exDone;
    return {
      lessonsDone: lessonsDone, lessonsTotal: lessonsInLevel.length,
      exDone: exDone, exTotal: exTotal,
      pct: total ? done / total : 1
    };
  }

  // Call once per page load with the level-tagged datasets already fetched.
  // Advances RK_LEVEL by one when the current level is mostly cleared.
  function checkAdvance(lessons, exJson) {
    var level = getLevel();
    var stats = computeLevelStats(level, lessons, exJson);
    if (level < MAX_LEVEL && stats.pct >= ADVANCE_THRESHOLD) {
      level += 1;
      setLevel(level);
      stats = computeLevelStats(level, lessons, exJson);
      return { level: level, leveledUp: true, from: level - 1, stats: stats };
    }
    return { level: level, leveledUp: false, stats: stats };
  }

  window.RKLevelProgress = {
    MAX_LEVEL: MAX_LEVEL,
    ADVANCE_THRESHOLD: ADVANCE_THRESHOLD,
    getLevel: getLevel,
    setLevel: setLevel,
    exerciseKey: exerciseKey,
    computeLevelStats: computeLevelStats,
    checkAdvance: checkAdvance
  };
})(window);
