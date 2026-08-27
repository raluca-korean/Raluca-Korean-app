/**
 * RKSrs — shared spaced-repetition scheduling logic.
 *
 * Two scheduling profiles, both previously duplicated across feature files:
 *   - stepClassic()         — plain SM-2 (used by exercises.js and flashcards.js,
 *                              byte-identical formulas before this extraction)
 *   - stepWithLearningSteps() — SM-2 variant with short early "learning steps"
 *                              (10 min → 1 day → SM-2 growth), used by hanja-book.js
 *
 * The step*() functions are pure: they take the current state and return the
 * next state, with no localStorage access — callers stay in charge of their
 * own read/write/caching so existing per-feature data flows are untouched.
 * load()/save()/updateClassic()/statusClassic() are convenience helpers for
 * features that don't keep their own in-memory cache.
 */
(function (window) {
  'use strict';

  function load(key) {
    return RKStorage.get(key, {});
  }
  function save(key, data) {
    RKStorage.set(key, data);
  }

  /* Classic SM-2. quality: 1=wrong, 2=hint/partial, 4=correct, 5=perfect. */
  function stepClassic(current, quality) {
    var c = Object.assign({ n: 0, I: 1, EF: 2.5, due: 0 }, current || {});
    if (quality >= 3) {
      if      (c.n === 0) c.I = 1;
      else if (c.n === 1) c.I = 6;
      else                c.I = Math.round(c.I * c.EF);
      c.n++;
    } else {
      c.n = 0;
      c.I = 1;
    }
    c.EF  = Math.max(1.3, c.EF + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    c.due = Date.now() + c.I * 86400000;
    return c;
  }

  /* SM-2 with early learning steps (10 min, then 1 day, then normal growth). */
  function stepWithLearningSteps(current, correct) {
    var s = Object.assign({ reps: 0, ease: 2.5, interval: 1, due: 0 }, current || {});
    var MIN = 60000, DAY = 86400000;
    if (correct) {
      s.reps++;
      if      (s.reps === 1) { s.interval = 1; s.due = Date.now() + 10 * MIN; }
      else if (s.reps === 2) { s.interval = 1; s.due = Date.now() + DAY; }
      else {
        s.interval = Math.round(s.interval * s.ease);
        s.ease     = Math.min(2.9, s.ease + 0.05);
        s.due      = Date.now() + s.interval * DAY;
      }
    } else {
      s.ease = Math.max(1.3, s.ease - 0.15);
      s.reps = 0;
      s.interval = 1;
      s.due  = Date.now() + MIN;
    }
    return s;
  }

  /* Convenience wrapper for features with no local cache of their own. */
  function updateClassic(key, itemId, quality) {
    var all = load(key);
    var c = stepClassic(all[itemId], quality);
    all[itemId] = c;
    save(key, all);
    return c;
  }

  function statusClassic(key, itemId) {
    var c = load(key)[itemId];
    if (!c) return 'new';
    return c.due <= Date.now() ? 'due' : 'learning';
  }

  window.RKSrs = {
    load: load,
    save: save,
    stepClassic: stepClassic,
    stepWithLearningSteps: stepWithLearningSteps,
    updateClassic: updateClassic,
    statusClassic: statusClassic,
  };
})(window);
