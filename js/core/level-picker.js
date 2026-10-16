/**
 * RKLevelPicker — bottom sheet for choosing the TOPIK progression level by hand
 * (or going back to automatic). Shared by index.html and today.html.
 *
 *   RKLevelPicker.open({ lessons, exJson, lang: 'ro'|'en', onChange: function(level){} })
 *
 * Needs js/core/level-progress.js. Brings its own styles (light + body.dark-mode).
 * Options are div[role=button], not <button>: theme-anime.css restyles every dark-mode
 * <button> with !important, which would hide the selected state on older pages.
 */
(function (window, document) {
  'use strict';

  var TXT = {
    ro: {
      title: 'Alege nivelul TOPIK',
      sub: 'Lecțiile și exercițiile zilnice vor fi de nivelul ales. Poți reveni oricând la modul automat.',
      auto: 'Automat (recomandat)', autoSub: 'Pornești de la primul nivel nestăpânit și urci singur',
      mastered: '✓ Stăpânit', progress: function (p) { return 'În curs · ' + p + '%'; }, fresh: 'Nou',
      lessons: 'lecții', close: 'Închide',
      names: ['Începător', 'Începător+', 'Intermediar', 'Intermediar+', 'Avansat', 'Avansat+']
    },
    en: {
      title: 'Choose your TOPIK level',
      sub: 'Daily lessons and exercises will match the level you pick. You can switch back to automatic anytime.',
      auto: 'Automatic (recommended)', autoSub: 'Start at your first unmastered level and climb on your own',
      mastered: '✓ Mastered', progress: function (p) { return 'In progress · ' + p + '%'; }, fresh: 'New',
      lessons: 'lessons', close: 'Close',
      names: ['Beginner', 'Beginner+', 'Intermediate', 'Intermediate+', 'Advanced', 'Advanced+']
    }
  };

  var CSS =
    '.rklp{--lp-card:#fff;--lp-text:#202124;--lp-mid:#6B6B73;--lp-low:#9C9CA3;--lp-border:#E7E5E1;--lp-soft:#EFEBFC;--lp-acc:#6C5CE7;--lp-bar:#EFEDE9;' +
      'position:fixed;inset:0;z-index:9999;background:rgba(18,19,28,.55);backdrop-filter:blur(3px);display:flex;align-items:flex-end;justify-content:center}' +
    'body.dark-mode .rklp{--lp-card:#181D32;--lp-text:#F7F4FA;--lp-mid:#B8B9C5;--lp-low:#7D7E93;--lp-border:rgba(255,255,255,.1);--lp-soft:rgba(139,124,255,.16);--lp-acc:#8B7CFF;--lp-bar:rgba(255,255,255,.08)}' +
    '.rklp-panel{background:var(--lp-card);color:var(--lp-text);width:100%;max-width:560px;border-radius:24px 24px 0 0;box-sizing:border-box;' +
      'padding:18px 16px calc(20px + env(safe-area-inset-bottom));max-height:88vh;overflow-y:auto;animation:rklpUp .25s ease both;' +
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;text-align:left}' +
    '@keyframes rklpUp{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}' +
    '.rklp-panel h3{margin:4px 4px 2px;font-size:17px;font-weight:900;color:var(--lp-text)}' +
    '.rklp-panel p{margin:0 4px 14px;font-size:12.5px;color:var(--lp-mid)}' +
    '.rklp-opt{box-sizing:border-box;width:100%;display:flex;align-items:center;gap:12px;text-align:left;border:1.5px solid var(--lp-border);background:var(--lp-card);' +
      'color:var(--lp-text);border-radius:14px;padding:11px 12px;margin:0 0 8px;cursor:pointer;font:inherit;box-shadow:none;text-transform:none;letter-spacing:normal}' +
    '.rklp-opt.on{border-color:var(--lp-acc);background:var(--lp-soft)}' +
    '.rklp-badge{flex-shrink:0;width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;' +
      'font-size:15px;font-weight:900;color:#fff;background:linear-gradient(135deg,#6C5CE7,#E96A9A)}' +
    '.rklp-badge.auto{background:linear-gradient(135deg,#2FB67C,#4A90A4);font-size:20px}' +
    '.rklp-txt{flex:1;min-width:0}' +
    '.rklp-t{font-size:14px;font-weight:800}' +
    '.rklp-s{font-size:12px;color:var(--lp-mid);margin-top:2px}' +
    '.rklp-mini{height:4px;background:var(--lp-bar);border-radius:3px;overflow:hidden;margin-top:6px}' +
    '.rklp-mini i{display:block;height:100%;background:linear-gradient(90deg,#6C5CE7,#E96A9A);border-radius:3px}' +
    '.rklp-check{flex-shrink:0;font-size:16px;color:var(--lp-acc);font-weight:900}' +
    '.rklp-close{box-sizing:border-box;text-align:center;width:100%;border:none;background:none;color:var(--lp-low);font:inherit;font-weight:800;font-size:13px;padding:10px;cursor:pointer;box-shadow:none}';

  function ensureStyle() {
    if (document.getElementById('rklpStyle')) return;
    var st = document.createElement('style');
    st.id = 'rklpStyle';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  var sheet = null;
  function onKey(e) { if (e.key === 'Escape') close(); }
  function close() {
    if (sheet) { sheet.remove(); sheet = null; }
    document.removeEventListener('keydown', onKey);
  }

  function open(opts) {
    if (!window.RKLevelProgress || !opts || !opts.lessons) return;
    ensureStyle();
    close();
    var P = window.RKLevelProgress;
    var t = TXT[opts.lang === 'en' ? 'en' : 'ro'];
    var cur = P.getLevel(), pinned = P.isPinned();

    var html = '<div class="rklp-panel" role="dialog" aria-modal="true" aria-labelledby="rklpTitle">' +
      '<h3 id="rklpTitle">' + t.title + '</h3><p>' + t.sub + '</p>' +
      '<div role="button" tabindex="0" class="rklp-opt' + (pinned ? '' : ' on') + '" data-auto="1">' +
        '<span class="rklp-badge auto">🔄</span>' +
        '<span class="rklp-txt"><div class="rklp-t">' + t.auto + '</div><div class="rklp-s">' + t.autoSub + '</div></span>' +
        '<span class="rklp-check">' + (pinned ? '' : '✓') + '</span>' +
      '</div>';
    for (var n = 1; n <= P.MAX_LEVEL; n++) {
      var st = P.computeLevelStats(n, opts.lessons, opts.exJson);
      var p = Math.min(100, Math.round(st.pct * 100));
      var status = st.mastered ? t.mastered : (p > 0 ? t.progress(p) : t.fresh);
      var on = n === cur;
      html += '<div role="button" tabindex="0" class="rklp-opt' + (on ? ' on' : '') + '" data-level="' + n + '"' + (on ? ' aria-current="true"' : '') + '>' +
        '<span class="rklp-badge">' + n + '</span>' +
        '<span class="rklp-txt"><div class="rklp-t">TOPIK ' + n + ' · ' + t.names[n - 1] + '</div>' +
          '<div class="rklp-s">' + status + ' · ' + st.lessonsTotal + ' ' + t.lessons + '</div>' +
          '<div class="rklp-mini"><i style="width:' + p + '%"></i></div></span>' +
        '<span class="rklp-check">' + (on ? '✓' : '') + '</span>' +
      '</div>';
    }
    html += '<div role="button" tabindex="0" class="rklp-close" data-close="1">' + t.close + '</div></div>';

    sheet = document.createElement('div');
    sheet.className = 'rklp';
    sheet.innerHTML = html;
    document.body.appendChild(sheet);

    function activate(e) {
      var b = e.target.closest('[data-auto],[data-level],[data-close]');
      if (e.target === sheet || (b && b.dataset.close)) { close(); return; }
      if (!b) return;
      if (b.dataset.auto) P.resumeAuto(opts.lessons, opts.exJson);
      else if (b.dataset.level) P.chooseLevel(parseInt(b.dataset.level, 10), opts.lessons, opts.exJson);
      else return;
      var lv = P.getLevel();
      // A manual change never triggers the "level unlocked" celebration.
      var cel = parseInt(localStorage.getItem('RK_LEVELUP_CELEBRATED'), 10) || 0;
      localStorage.setItem('RK_LEVELUP_CELEBRATED', String(Math.max(lv, cel)));
      localStorage.setItem('RK_LEVEL', String(lv)); // exercises.html opens on the same level
      close();
      if (opts.onChange) opts.onChange(lv);
    }
    sheet.addEventListener('click', activate);
    sheet.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(e); }
    });
    document.addEventListener('keydown', onKey);
    var first = sheet.querySelector('.rklp-opt.on[data-level]') || sheet.querySelector('.rklp-opt');
    if (first) first.focus();
  }

  window.RKLevelPicker = { open: open, close: close };
})(window, document);
