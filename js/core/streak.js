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
  var MILESTONES_KEY = 'RK_STREAK_MILESTONES';
  var FREEZES_KEY = 'RK_STREAK_FREEZES';
  var MILESTONE_XP = { 3:15, 7:40, 14:70, 30:120, 50:200, 100:400, 365:1500 };
  var MILESTONE_COINS = { 3:5, 7:15, 14:25, 30:50, 50:80, 100:150, 365:500 };

  function getFreezeCount() {
    return RKStorage.get(FREEZES_KEY, 0) || 0;
  }
  function addFreeze(n) {
    var count = getFreezeCount() + (n || 1);
    RKStorage.set(FREEZES_KEY, count);
    return count;
  }
  function useFreeze() {
    var count = getFreezeCount();
    if (count <= 0) return false;
    RKStorage.set(FREEZES_KEY, count - 1);
    return true;
  }

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function load() {
    var s = RKStorage.get(KEY, null);
    if (s && typeof s.days === 'number') return s;
    return { days: 0, best: 0, lastDate: '' };
  }

  function save(s) {
    RKStorage.set(KEY, s);
  }

  function getEarnedMilestones() {
    return RKStorage.get(MILESTONES_KEY, []);
  }

  /* Self-contained toast — no dependency on any page's CSS, so it works
     identically from every one of the ~15 call sites (flashcards, exercises,
     hangul, listening, journal, ...). */
  function celebrateMilestone(days, xpGained, coinsGained, lang) {
    var isRo = lang !== 'en';
    if (!document.getElementById('rkStreakMilestoneStyle')) {
      var style = document.createElement('style');
      style.id = 'rkStreakMilestoneStyle';
      style.textContent =
        '@keyframes rkStreakPop{0%{opacity:0;transform:scale(.7)}60%{opacity:1;transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}' +
        '@keyframes rkStreakFade{from{opacity:1}to{opacity:0}}';
      document.head.appendChild(style);
    }
    var backdrop = document.createElement('div');
    backdrop.style.cssText = 'position:fixed;inset:0;z-index:999999;background:rgba(10,6,4,.7);' +
      'display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;cursor:pointer';
    var card = document.createElement('div');
    card.style.cssText = 'background:linear-gradient(145deg,#ff9600,#c84b2f);border-radius:24px;' +
      'padding:36px 44px;text-align:center;color:#fff;box-shadow:0 20px 60px rgba(200,75,47,.5);' +
      'animation:rkStreakPop .5s cubic-bezier(.34,1.56,.64,1) both;max-width:90vw';
    card.innerHTML =
      '<div style="font-size:52px;line-height:1">🔥</div>' +
      '<div style="font-size:28px;font-weight:900;margin-top:6px">' + (isRo ? days + ' ' + (days===1?'ZI':'ZILE') + ' LA RÂND!' : days + '-DAY STREAK!') + '</div>' +
      '<div style="font-size:15px;opacity:.9;margin-top:8px">' + (isRo ? 'Ai câștigat' : 'You earned') + ' +' + xpGained + ' XP · 🪙+' + coinsGained + '</div>' +
      '<div style="font-size:12px;opacity:.7;margin-top:14px">' + (isRo ? 'Atinge oriunde pentru a continua' : 'Tap anywhere to continue') + '</div>';
    backdrop.appendChild(card);
    document.body.appendChild(backdrop);
    function dismiss() {
      backdrop.style.animation = 'rkStreakFade .3s ease both';
      setTimeout(function () { backdrop.remove(); }, 300);
    }
    backdrop.addEventListener('click', dismiss);
    setTimeout(dismiss, 5000);
  }

  function checkMilestone(days) {
    if (!MILESTONE_XP[days]) return;
    var earned = getEarnedMilestones();
    if (earned.indexOf(days) !== -1) return;
    earned.push(days);
    RKStorage.set(MILESTONES_KEY, earned);
    var xpGained = MILESTONE_XP[days];
    var coinsGained = MILESTONE_COINS[days] || 0;
    if (window.RKGamification) {
      RKGamification.addXPBonus(xpGained);
      RKGamification.addCoins(coinsGained);
    }
    var lang = localStorage.getItem('RK_LANG') || 'ro';
    /* Defer so it never fights a page's own initial-render/animation work. */
    setTimeout(function () { celebrateMilestone(days, xpGained, coinsGained, lang); }, 400);
  }

  /* Call on any real study activity. No-ops after the first call each day. */
  function touch() {
    var today = todayStr();
    var s = load();
    if (s.lastDate === today) return s;

    var yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    var twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);

    if (s.lastDate === yesterday) {
      s.days = s.days + 1;
    } else if (s.lastDate === twoDaysAgo && useFreeze()) {
      /* Missed exactly one day but had a Streak Freeze (bought in the shop) — covers the gap. */
      s.days = s.days + 1;
    } else {
      s.days = 1;
    }
    s.lastDate = today;
    s.best = Math.max(s.days, s.best || 0);
    save(s);
    checkMilestone(s.days);
    return s;
  }

  function get() {
    return load();
  }

  window.RKStreak = { touch: touch, get: get, getFreezes: getFreezeCount, addFreeze: addFreeze };
})(window);
