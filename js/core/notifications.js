/**
 * RKNotifications — client-side push notification management.
 *
 * Uses Periodic Background Sync (Chrome) so notifications fire even when
 * the app is closed, without needing a push server.
 * Fallback for other browsers: in-app nudge on next page load.
 *
 * Study data is relayed to the SW via postMessage → Cache API
 * (localStorage is not accessible from the SW context).
 */
(function(window) {
  'use strict';

  function isSupported() {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  function getPermission() {
    if (!isSupported()) return 'unsupported';
    return Notification.permission;
  }

  function registerPeriodicSync(reg) {
    if (!('periodicSync' in reg)) return Promise.resolve();
    return reg.periodicSync.register('rk-daily-reminder', {
      minInterval: 20 * 60 * 60 * 1000   // 20 h — browser may clamp higher
    }).catch(function() {});
  }

  function request() {
    if (!isSupported()) return Promise.resolve('unsupported');
    if (Notification.permission === 'granted') {
      return navigator.serviceWorker.ready
        .then(function(reg) { return registerPeriodicSync(reg); })
        .then(function() { return 'granted'; })
        .catch(function() { return 'granted'; });
    }
    return Notification.requestPermission().then(function(result) {
      if (result !== 'granted') return result;
      return navigator.serviceWorker.ready
        .then(function(reg) { return registerPeriodicSync(reg); })
        .then(function() { return result; })
        .catch(function() { return result; });
    });
  }

  // Called after each correct answer — persists study date + streak in SW Cache
  function syncStudy(streak) {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.ready.then(function(reg) {
      if (reg.active) reg.active.postMessage({
        type:   'RK_STUDY_UPDATE',
        date:   new Date().toISOString().slice(0, 10),
        streak: streak || 0,
        lang:   localStorage.getItem('RK_LANG') || 'ro'
      });
    }).catch(function() {});
  }

  // Render a small toggle button into containerId
  function renderToggle(containerId) {
    if (!isSupported()) return;
    var container = document.getElementById(containerId);
    if (!container) return;

    var btn = document.createElement('button');
    btn.id        = 'rkNotifBtn';
    btn.className = 'rk-notif-btn';
    _updateBtn(btn, Notification.permission);

    btn.addEventListener('click', function() {
      if (Notification.permission === 'denied') {
        var lang = document.documentElement.lang || 'ro';
        alert(lang === 'ro'
          ? 'Notificările sunt blocate în browser. Accesează Setări → Site-uri și permite notificările.'
          : 'Notifications are blocked. Go to browser Settings → Sites and allow notifications.');
        return;
      }
      request().then(function(result) { _updateBtn(btn, result); });
    });

    container.appendChild(btn);
  }

  function _updateBtn(btn, perm) {
    var lang = document.documentElement.lang || 'ro';
    if (perm === 'granted') {
      btn.textContent   = lang === 'ro' ? '🔔 Remindere active' : '🔔 Reminders on';
      btn.dataset.state = 'granted';
    } else if (perm === 'denied') {
      btn.textContent   = lang === 'ro' ? '🔕 Blocate' : '🔕 Blocked';
      btn.dataset.state = 'denied';
    } else {
      btn.textContent   = lang === 'ro' ? '🔔 Remindere zilnice' : '🔔 Daily reminders';
      btn.dataset.state = 'default';
    }
  }

  window.RKNotifications = { isSupported, getPermission, request, syncStudy, renderToggle };
})(window);
