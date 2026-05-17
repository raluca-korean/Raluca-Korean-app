(function(window) {
  'use strict';

  var DAILY_GOAL = 10;

  var XP_LEVELS = [
    {level:1,  min:0,     title_ro:'Începător',    title_en:'Beginner'},
    {level:2,  min:100,   title_ro:'Student',      title_en:'Student'},
    {level:3,  min:300,   title_ro:'Explorator',   title_en:'Explorer'},
    {level:4,  min:600,   title_ro:'Practician',   title_en:'Practitioner'},
    {level:5,  min:1000,  title_ro:'Cunoscător',   title_en:'Enthusiast'},
    {level:6,  min:1500,  title_ro:'Avansat',      title_en:'Advanced'},
    {level:7,  min:2200,  title_ro:'Expert TOPIK', title_en:'TOPIK Expert'},
    {level:8,  min:3000,  title_ro:'Master',       title_en:'Master'},
    {level:9,  min:5000,  title_ro:'Grand Master', title_en:'Grand Master'},
    {level:10, min:10000, title_ro:'Korean Guru',  title_en:'Korean Guru'},
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
    try { return JSON.parse(localStorage.getItem('RK_XP') || 'null') || {total:0}; }
    catch(e) { return {total:0}; }
  }
  function saveXPData(d) {
    try { localStorage.setItem('RK_XP', JSON.stringify(d)); } catch(e) {}
  }

  function getEarnedBadges() {
    try { return JSON.parse(localStorage.getItem('RK_BADGES') || '[]'); }
    catch(e) { return []; }
  }
  function saveEarnedBadges(list) {
    try { localStorage.setItem('RK_BADGES', JSON.stringify(list)); } catch(e) {}
  }

  function getQuestData() {
    var today = new Date().toISOString().slice(0, 10);
    try {
      var d = JSON.parse(localStorage.getItem('RK_DAILY_QUEST') || 'null');
      if (!d || d.date !== today) {
        return {date:today, done:0, completedToday:false, questsDone: d ? (d.questsDone||0) : 0};
      }
      return d;
    } catch(e) {
      return {date:today, done:0, completedToday:false, questsDone:0};
    }
  }
  function saveQuestData(d) {
    try { localStorage.setItem('RK_DAILY_QUEST', JSON.stringify(d)); } catch(e) {}
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
    var data = getXPData();
    var oldLevel = getLevelInfo(data.total).current.level;
    data.total += gain;
    saveXPData(data);
    var newLvlInfo = getLevelInfo(data.total);
    var newLevel = newLvlInfo.current.level;
    if (newLevel > oldLevel && typeof onLevelUp === 'function') {
      onLevelUp(newLevel, newLvlInfo.current);
    }
    return {xpGained:gain, total:data.total, levelUp:newLevel > oldLevel, newLevel:newLevel};
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
    getEarnedBadges: getEarnedBadges,
  };

})(window);
