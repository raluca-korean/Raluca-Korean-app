/**
 * RKLevelProgress — the learner's TOPIK progression level (1-6).
 *
 * It only goes up, and only when the current level is actually mastered:
 *   - LESSON_THRESHOLD of the level's grammar lessons are finished (RK_LESSON_DONE), and
 *   - EXERCISE_THRESHOLD of the level's exercises were last answered correctly
 *     (RK_EX_SRS reps >= 1) or marked as learned (RK_LEARNED_EX).
 *
 * Stored in RK_TOPIK_PROGRESS, separate from RK_LEVEL (the level selector in
 * exercises.html), so browsing a harder level there never skips ahead here.
 * The first read seeds it from RK_LEVEL — the placement level picked in onboarding.
 *
 * The learner can also pick a level by hand (chooseLevel). Picking a level that is
 * already mastered pins it (RK_TOPIK_PINNED) so auto-advance doesn't undo the choice;
 * resumeAuto() clears the pin and lets the mastery rule decide again.
 */
(function (window) {
  'use strict';

  var PROGRESS_KEY = 'RK_TOPIK_PROGRESS';
  var PIN_KEY = 'RK_TOPIK_PINNED';
  var MAX_LEVEL = 6;
  var LESSON_THRESHOLD = 0.8;
  var EXERCISE_THRESHOLD = 0.7;
  // Kept for callers that compare the combined pct (today.html "maxed" check).
  var ADVANCE_THRESHOLD = 0.75;

  function clamp(v) { return (v >= 1 && v <= MAX_LEVEL) ? v : null; }

  function getLevel() {
    var v = clamp(parseInt(localStorage.getItem(PROGRESS_KEY), 10));
    if (v) return v;
    var seed = clamp(parseInt(localStorage.getItem('RK_LEVEL'), 10)) || 1;
    localStorage.setItem(PROGRESS_KEY, String(seed));
    return seed;
  }
  function setLevel(n) {
    var v = clamp(n);
    if (v) localStorage.setItem(PROGRESS_KEY, String(v));
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

  function readJSON(key, fallback) {
    try { var v = JSON.parse(localStorage.getItem(key) || 'null'); return v == null ? fallback : v; }
    catch (e) { return fallback; }
  }

  function isMastered(type, item, exSrs, learned) {
    var k = exerciseKey(type, item);
    var c = exSrs[k];
    return (c && c.reps >= 1) || learned.indexOf(k) !== -1;
  }

  function computeLevelStats(level, lessons, exJson) {
    var lessonsInLevel = (lessons || []).filter(function (l) { return l.topik === level; });
    var doneLessons = readJSON('RK_LESSON_DONE', []);
    var lessonsDone = lessonsInLevel.filter(function (l) { return doneLessons.indexOf(l.id) !== -1; }).length;

    var exSrs = window.RKSrs ? RKSrs.load('RK_EX_SRS') : readJSON('RK_EX_SRS', {});
    var learned = readJSON('RK_LEARNED_EX', []);
    var exTotal = 0, exDone = 0;
    Object.keys(exJson || {}).forEach(function (type) {
      (exJson[type] || []).forEach(function (item) {
        if (item.topik !== level) return;
        exTotal++;
        if (isMastered(type, item, exSrs, learned)) exDone++;
      });
    });

    var lessonPct = lessonsInLevel.length ? lessonsDone / lessonsInLevel.length : 1;
    var exPct = exTotal ? exDone / exTotal : 1;
    // Progress bar: each requirement counts until it is met, so 100% == ready to advance.
    var pct = (Math.min(1, lessonPct / LESSON_THRESHOLD) + Math.min(1, exPct / EXERCISE_THRESHOLD)) / 2;
    return {
      lessonsDone: lessonsDone, lessonsTotal: lessonsInLevel.length,
      exDone: exDone, exTotal: exTotal,
      lessonsNeeded: Math.ceil(lessonsInLevel.length * LESSON_THRESHOLD),
      exNeeded: Math.ceil(exTotal * EXERCISE_THRESHOLD),
      lessonPct: lessonPct, exPct: exPct,
      pct: pct,
      mastered: lessonPct >= LESSON_THRESHOLD && exPct >= EXERCISE_THRESHOLD
    };
  }

  // First lesson of the level that still has unmastered exercises (for "practice" suggestions).
  function weakestLesson(level, lessons, exJson) {
    var exSrs = window.RKSrs ? RKSrs.load('RK_EX_SRS') : readJSON('RK_EX_SRS', {});
    var learned = readJSON('RK_LEARNED_EX', []);
    var open = {};
    Object.keys(exJson || {}).forEach(function (type) {
      (exJson[type] || []).forEach(function (item) {
        if (item.topik === level && item.lessonId && !isMastered(type, item, exSrs, learned)) {
          open[item.lessonId] = (open[item.lessonId] || 0) + 1;
        }
      });
    });
    var inLevel = (lessons || []).filter(function (l) { return l.topik === level && open[l.id]; });
    return inLevel.length ? inLevel[0] : null;
  }

  function isPinned() { return localStorage.getItem(PIN_KEY) === '1'; }

  // Manual pick from the level picker. Returns the level actually set.
  function chooseLevel(n, lessons, exJson) {
    var v = clamp(n);
    if (!v) return getLevel();
    setLevel(v);
    var mastered = lessons ? computeLevelStats(v, lessons, exJson).mastered : false;
    if (mastered) localStorage.setItem(PIN_KEY, '1');
    else localStorage.removeItem(PIN_KEY);
    // A manual change should not trigger the "level unlocked" celebration.
    localStorage.setItem('RK_LEVELUP_CELEBRATED', String(Math.max(v, parseInt(localStorage.getItem('RK_LEVELUP_CELEBRATED'), 10) || 0)));
    return v;
  }

  // Back to automatic: restart from the first level that isn't mastered yet.
  function resumeAuto(lessons, exJson) {
    localStorage.removeItem(PIN_KEY);
    var level = 1;
    while (level < MAX_LEVEL && computeLevelStats(level, lessons, exJson).mastered) level++;
    setLevel(level);
    return level;
  }

  // Call with the level-tagged datasets already fetched. Advances while the
  // current level is mastered (unless the learner pinned it); never goes down.
  function checkAdvance(lessons, exJson) {
    var start = getLevel();
    var level = start;
    var stats = computeLevelStats(level, lessons, exJson);
    while (!isPinned() && level < MAX_LEVEL && stats.mastered) {
      level += 1;
      stats = computeLevelStats(level, lessons, exJson);
    }
    if (level !== start) setLevel(level);
    return { level: level, leveledUp: level > start, from: start, stats: stats, pinned: isPinned() };
  }

  window.RKLevelProgress = {
    MAX_LEVEL: MAX_LEVEL,
    ADVANCE_THRESHOLD: ADVANCE_THRESHOLD,
    LESSON_THRESHOLD: LESSON_THRESHOLD,
    EXERCISE_THRESHOLD: EXERCISE_THRESHOLD,
    getLevel: getLevel,
    setLevel: setLevel,
    exerciseKey: exerciseKey,
    computeLevelStats: computeLevelStats,
    weakestLesson: weakestLesson,
    chooseLevel: chooseLevel,
    resumeAuto: resumeAuto,
    isPinned: isPinned,
    checkAdvance: checkAdvance
  };
})(window);
