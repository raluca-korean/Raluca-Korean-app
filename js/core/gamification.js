(function(window) {
  'use strict';

  var DAILY_GOAL = 10;

  var XP_LEVELS = [
    {level:1,  min:0,     title_ro:'🌱 Începător Hangul',    title_en:'🌱 Hangul Beginner'},
    {level:2,  min:100,   title_ro:'☕ Cafeneaua Coreeană',   title_en:'☕ Korean Café'},
    {level:3,  min:300,   title_ro:'🛍 Cumpărături în Seul',  title_en:'🛍 Seoul Shopping'},
    {level:4,  min:600,   title_ro:'🚇 Exploratorul Seulului', title_en:'🚇 Seoul Explorer'},
    {level:5,  min:1000,  title_ro:'🎤 Fan K-Pop',            title_en:'🎤 K-Pop Fan'},
    {level:6,  min:1500,  title_ro:'🏠 Viață Coreeană',       title_en:'🏠 Korean Life'},
    {level:7,  min:2200,  title_ro:'🎓 Expert TOPIK',         title_en:'🎓 TOPIK Expert'},
    {level:8,  min:3000,  title_ro:'💼 Profesionist în Seul', title_en:'💼 Seoul Professional'},
    {level:9,  min:5000,  title_ro:'🗣 Vorbitor de Coreeană', title_en:'🗣 Korean Speaker'},
    {level:10, min:10000, title_ro:'🏯 Maestru Coreean',      title_en:'🏯 Korean Master'},
  ];

  var BADGE_DEFS = [
    {id:'correct_1',   icon:'✅', title_ro:'Prima reușită!',         title_en:'First success!',       check:function(s)      { return s.correct >= 1;      }},
    {id:'streak_3',    icon:'🔥', title_ro:'3 la rând!',             title_en:'3 in a row!',          check:function(s)      { return s.bestStreak >= 3;   }},
    {id:'streak_5',    icon:'⚡', title_ro:'5 la rând!',             title_en:'5 in a row!',          check:function(s)      { return s.bestStreak >= 5;   }},
    {id:'streak_10',   icon:'💥', title_ro:'10 la rând!',            title_en:'10 in a row!',         check:function(s)      { return s.bestStreak >= 10;  }},
    {id:'streak_20',   icon:'🌟', title_ro:'20 la rând!',            title_en:'20 in a row!',         check:function(s)      { return s.bestStreak >= 20;  }},
    {id:'correct_10',  icon:'🎯', title_ro:'10 corecte',             title_en:'10 correct',           check:function(s)      { return s.correct >= 10;     }},
    {id:'correct_50',  icon:'🏆', title_ro:'50 corecte',             title_en:'50 correct',           check:function(s)      { return s.correct >= 50;     }},
    {id:'correct_100', icon:'💯', title_ro:'100 corecte',            title_en:'100 correct',          check:function(s)      { return s.correct >= 100;    }},
    {id:'correct_500', icon:'👑', title_ro:'500 corecte',            title_en:'500 correct',          check:function(s)      { return s.correct >= 500;    }},
    {id:'xp_100',      icon:'⭐', title_ro:'100 XP acumulat',        title_en:'100 XP earned',        check:function(s,xp)   { return xp >= 100;           }},
    {id:'xp_500',      icon:'🌠', title_ro:'500 XP acumulat',        title_en:'500 XP earned',        check:function(s,xp)   { return xp >= 500;           }},
    {id:'xp_1000',     icon:'💫', title_ro:'1000 XP acumulat',       title_en:'1000 XP earned',       check:function(s,xp)   { return xp >= 1000;          }},
    {id:'quest_1',     icon:'📅', title_ro:'Prima misiune zilnică!', title_en:'First daily quest!',   check:function(s,xp,q) { return q >= 1;              }},
    {id:'quest_7',     icon:'🗓️', title_ro:'7 misiuni completate',  title_en:'7 quests completed',   check:function(s,xp,q) { return q >= 7;              }},
    {id:'quest_30',    icon:'📆', title_ro:'30 misiuni completate', title_en:'30 quests completed',   check:function(s,xp,q) { return q >= 30;             }},
  ];

  function getXPData() {
    return RKStorage.get('RK_XP', null) || {total:0};
  }
  function saveXPData(d) {
    RKStorage.set('RK_XP', d);
  }

  // ── SEOUL COINS ──────────────────────────────────────────────────
  function getCoins() {
    return RKStorage.get('RK_COINS', 0) || 0;
  }
  function addCoins(amount) {
    if (!amount || amount <= 0) return getCoins();
    var total = getCoins() + amount;
    RKStorage.set('RK_COINS', total);
    return total;
  }
  function spendCoins(amount) {
    var total = getCoins();
    if (amount <= 0 || total < amount) return false;
    RKStorage.set('RK_COINS', total - amount);
    return true;
  }
  function computeCoinGain(currentStreak) {
    if (currentStreak >= 20) return 6;
    if (currentStreak >= 10) return 5;
    if (currentStreak >= 5)  return 4;
    if (currentStreak >= 3)  return 3;
    return 2;
  }

  // ── XP BOOST (2x XP for a limited number of correct answers) ─────
  function getXPBoost() {
    return RKStorage.get('RK_XP_BOOST', {usesLeft:0}) || {usesLeft:0};
  }
  function addXPBoostUses(n) {
    var b = getXPBoost();
    b.usesLeft = (b.usesLeft || 0) + n;
    RKStorage.set('RK_XP_BOOST', b);
    return b;
  }
  function consumeXPBoostIfActive() {
    var b = getXPBoost();
    if (!b.usesLeft || b.usesLeft <= 0) return false;
    b.usesLeft -= 1;
    RKStorage.set('RK_XP_BOOST', b);
    return true;
  }

  function getEarnedBadges() {
    return RKStorage.get('RK_BADGES', []);
  }
  function saveEarnedBadges(list) {
    RKStorage.set('RK_BADGES', list);
  }

  function getQuestData() {
    var today = new Date().toISOString().slice(0, 10);
    var d = RKStorage.get('RK_DAILY_QUEST', null);
    if (!d || d.date !== today) {
      return {date:today, done:0, completedToday:false, questsDone: d ? (d.questsDone||0) : 0};
    }
    return d;
  }
  function saveQuestData(d) {
    RKStorage.set('RK_DAILY_QUEST', d);
  }

  /* Today's Mission — the literal daily checklist (vocab/sentences/
     listening/speaking). Vocab and sentences are counted here from real
     correct exercise answers; listening and speaking reuse the daily-
     challenge flags listening.js and pronunciation.js already track
     (RK_DAILY_LISTEN / RK_DAILY_PRON), read directly by the pages that
     render the mission — nothing here fabricates those two.
     Goals scale with audience (RK_AUDIENCE: 'student'|'adult') — students
     get a shorter 5-word target, adults the fuller 10-word review the
     dual-audience spec asks for. Same tracked data either way. */
  function dailyTaskGoals() {
    // RK_AUDIENCE is a plain string flag (like RK_LANG/RK_THEME) — not JSON, so
    // read it with a raw localStorage lookup rather than RKStorage.get.
    var audience = localStorage.getItem('RK_AUDIENCE') || 'adult';
    return audience === 'student' ? { vocab: 5, sentences: 3 } : { vocab: 10, sentences: 3 };
  }

  function getDailyTasks() {
    var today = new Date().toISOString().slice(0, 10);
    var d = RKStorage.get('RK_DAILY_TASKS', null);
    if (!d || d.date !== today) return { date: today, vocab: 0, sentences: 0 };
    return d;
  }
  function incrementDailyTask(category) {
    var goals = dailyTaskGoals();
    if (!goals[category]) return getDailyTasks();
    var d = getDailyTasks();
    if (d[category] < goals[category]) d[category]++;
    RKStorage.set('RK_DAILY_TASKS', d);
    return d;
  }

  function getLevelInfo(xp) {
    var info = XP_LEVELS[0];
    for (var i = 0; i < XP_LEVELS.length; i++) {
      if (xp >= XP_LEVELS[i].min) info = XP_LEVELS[i];
    }
    var next = info.level < 10 ? XP_LEVELS[info.level] : null;
    return {current:info, next:next};
  }

  function computeXPGain(currentStreak) {
    if (currentStreak >= 20) return 30;
    if (currentStreak >= 10) return 25;
    if (currentStreak >= 5)  return 20;
    if (currentStreak >= 3)  return 15;
    return 10;
  }

  function addXP(currentStreak, onLevelUp) {
    var gain = computeXPGain(currentStreak || 0);
    var boosted = consumeXPBoostIfActive();
    if (boosted) gain *= 2;
    var data = getXPData();
    var oldLevel = getLevelInfo(data.total).current.level;
    data.total += gain;
    saveXPData(data);
    var newLvlInfo = getLevelInfo(data.total);
    var newLevel = newLvlInfo.current.level;
    if (newLevel > oldLevel && typeof onLevelUp === 'function') {
      onLevelUp(newLevel, newLvlInfo.current);
    }
    var coinsGained = computeCoinGain(currentStreak || 0);
    addCoins(coinsGained);
    return {xpGained:gain, total:data.total, levelUp:newLevel > oldLevel, newLevel:newLevel, boosted:boosted, coinsGained:coinsGained};
  }

  function addXPBonus(amount) {
    if (!amount || amount <= 0) return;
    var data = getXPData();
    data.total += amount;
    saveXPData(data);
    return data.total;
  }

  function checkBadges(statsObj, currentXP, questsDone) {
    var earned = getEarnedBadges();
    var newBadges = [];
    BADGE_DEFS.forEach(function(def) {
      if (earned.indexOf(def.id) !== -1) return;
      try {
        if (def.check(statsObj || {}, currentXP || 0, questsDone || 0)) {
          earned.push(def.id);
          newBadges.push(def);
        }
      } catch(e) {}
    });
    if (newBadges.length) saveEarnedBadges(earned);
    return newBadges;
  }

  function incrementQuest() {
    var q = getQuestData();
    if (q.done < DAILY_GOAL) q.done++;
    var justCompleted = (q.done === DAILY_GOAL && !q.completedToday);
    if (justCompleted) {
      q.completedToday = true;
      q.questsDone = (q.questsDone || 0) + 1;
    }
    saveQuestData(q);
    return {done:q.done, goal:DAILY_GOAL, completed:justCompleted, total:q.questsDone||0};
  }

  window.RKGamification = {
    DAILY_GOAL:      DAILY_GOAL,
    getDailyTaskGoals: dailyTaskGoals,
    XP_LEVELS:       XP_LEVELS,
    BADGE_DEFS:      BADGE_DEFS,
    getXPData:       getXPData,
    getLevelInfo:    getLevelInfo,
    computeXPGain:   computeXPGain,
    addXP:           addXP,
    addXPBonus:      addXPBonus,
    checkBadges:     checkBadges,
    incrementQuest:  incrementQuest,
    getQuestData:    getQuestData,
    getDailyTasks:   getDailyTasks,
    incrementDailyTask: incrementDailyTask,
    getEarnedBadges: getEarnedBadges,
    getCoins:          getCoins,
    addCoins:          addCoins,
    spendCoins:        spendCoins,
    getXPBoost:        getXPBoost,
    addXPBoostUses:    addXPBoostUses,
  };

})(window);
