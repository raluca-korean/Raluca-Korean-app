/**
 * Caiet coreean — digital lined notebook.
 *
 * Replică designul caietelor de scris coreene: pagini cu grilă de căsuțe
 * pătrate, fiecare cu un ghidaj punctat în cruce (pentru poziționarea
 * componentelor unei silabe), de la liniatură mare (începători) la
 * liniatură mică (mai mult spațiu de scris pe pagină).
 */
(function () {
  var LANG = RKLang.get();

  var I18N = {
    ro: {
      title: 'Caiet coreean',
      sub: 'Liniatură specifică pentru exersat scrisul de mână',
      lvlLabel: 'Mărime liniatură pentru pagina nouă',
      lvlLarge: 'Mare · Începător',
      lvlMedium: 'Medie',
      lvlSmall: 'Mică · Scrii mai mult',
      addPage: '+ Pagină nouă',
      print: '🖨 Printează',
      clear: '↺ Curăță',
      download: '⬇ Descarcă',
      remove: '🗑 Șterge',
      confirmRemove: 'Ștergi această pagină din caiet?',
      saved: 'Salvat ✓',
      hint: 'Scrie direct pe pagină cu mouse-ul, degetul sau un stylus. Fiecare căsuță are un ghidaj punctat în cruce, ca în caietele coreene reale, ca să poți poziționa corect componentele silabei.',
      tagLarge: 'Mare',
      tagMedium: 'Medie',
      tagSmall: 'Mică'
    },
    en: {
      title: 'Korean Notebook',
      sub: 'Korean-style ruling for handwriting practice',
      lvlLabel: 'Line size for new page',
      lvlLarge: 'Large · Beginner',
      lvlMedium: 'Medium',
      lvlSmall: 'Small · More writing space',
      addPage: '+ New page',
      print: '🖨 Print',
      clear: '↺ Clear',
      download: '⬇ Download',
      remove: '🗑 Remove',
      confirmRemove: 'Remove this page from the notebook?',
      saved: 'Saved ✓',
      hint: 'Write directly on the page with your mouse, finger, or a stylus. Every cell has a dotted cross guide, just like real Korean notebooks, to help you position the parts of each syllable.',
      tagLarge: 'Large',
      tagMedium: 'Medium',
      tagSmall: 'Small'
    }
  };

  function t(k) { return I18N[LANG][k]; }

  var LEVELS = {
    large:  { cell: 84, rows: 3, crossFrac: .62, dash: 7 },
    medium: { cell: 54, rows: 5, crossFrac: .60, dash: 5 },
    small:  { cell: 32, rows: 9, crossFrac: .58, dash: 3 }
  };
  var LEVEL_ORDER = ['large', 'medium', 'small'];

  var STORE_KEY = 'RK_CAIET';
  var selectedLevel = 'large';
  var pageSeq = 0;

  function isDark() { return document.body.classList.contains('dark-mode'); }

  function guideColors() {
    return isDark()
      ? { border: 'rgba(167,139,250,.30)', cross: 'rgba(167,139,250,.55)' }
      : { border: 'rgba(124,58,237,.22)',  cross: 'rgba(124,58,237,.48)' };
  }
  function inkColor() { return isDark() ? '#f0e8ff' : '#1a0533'; }

  // ── STORAGE ────────────────────────────────────────────────────
  function loadState() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) { return null; }
  }

  var saveTimer = null;
  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(persistState, 500);
  }

  function persistState() {
    var pages = [];
    document.querySelectorAll('.nb-page').forEach(function (pageEl) {
      var ink = pageEl.querySelector('.nb-ink-canvas');
      var hasInk = ink && ink.dataset.hasInk === '1';
      pages.push({
        id: pageEl.dataset.id,
        level: pageEl.dataset.level,
        ink: hasInk ? ink.toDataURL('image/png') : null
      });
    });
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ selectedLevel: selectedLevel, pages: pages }));
      flashSaved();
    } catch (e) { /* quota exceeded — silently skip persistence */ }
  }

  var flashTimer = null;
  function flashSaved() {
    var el = document.getElementById('nbSavedFlash');
    if (!el) {
      el = document.createElement('div');
      el.id = 'nbSavedFlash';
      el.className = 'nb-saved-flash';
      document.body.appendChild(el);
    }
    el.textContent = t('saved');
    el.classList.add('show');
    if (flashTimer) clearTimeout(flashTimer);
    flashTimer = setTimeout(function () { el.classList.remove('show'); }, 1100);
  }

  // ── GUIDE DRAWING ─────────────────────────────────────────────
  function drawGuide(canvas, cols, rows, cellSize, cfg) {
    var dpr = window.devicePixelRatio || 1;
    var cssW = cols * cellSize, cssH = rows * cellSize;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);
    var colors = guideColors();

    ctx.lineWidth = 1;
    ctx.strokeStyle = colors.border;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        ctx.strokeRect(c * cellSize + .5, r * cellSize + .5, cellSize - 1, cellSize - 1);
      }
    }

    ctx.strokeStyle = colors.cross;
    ctx.lineWidth = Math.max(1, cellSize * .012);
    ctx.setLineDash([cfg.dash, cfg.dash]);
    var crossLen = cellSize * cfg.crossFrac;
    for (var rr = 0; rr < rows; rr++) {
      for (var cc = 0; cc < cols; cc++) {
        var cx = cc * cellSize + cellSize / 2;
        var cy = rr * cellSize + cellSize / 2;
        ctx.beginPath();
        ctx.moveTo(cx - crossLen / 2, cy);
        ctx.lineTo(cx + crossLen / 2, cy);
        ctx.moveTo(cx, cy - crossLen / 2);
        ctx.lineTo(cx, cy + crossLen / 2);
        ctx.stroke();
      }
    }
    ctx.setLineDash([]);
  }

  function sizeInkCanvas(canvas, cssW, cssH, preserveDataUrl) {
    var dpr = window.devicePixelRatio || 1;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (preserveDataUrl) {
      var img = new Image();
      img.onload = function () { ctx.drawImage(img, 0, 0, cssW, cssH); };
      img.src = preserveDataUrl;
      canvas.dataset.hasInk = '1';
    }
  }

  // ── DRAWING INTERACTION ─────────────────────────────────────────
  function wireDrawing(canvas) {
    var drawing = false;
    var lastX = 0, lastY = 0;

    function pos(e) {
      var rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    canvas.addEventListener('pointerdown', function (e) {
      drawing = true;
      canvas.setPointerCapture(e.pointerId);
      var p = pos(e);
      lastX = p.x; lastY = p.y;
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = inkColor();
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
      ctx.fill();
      canvas.dataset.hasInk = '1';
    });

    canvas.addEventListener('pointermove', function (e) {
      if (!drawing) return;
      var p = pos(e);
      var ctx = canvas.getContext('2d');
      ctx.strokeStyle = inkColor();
      ctx.lineWidth = 2.6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      lastX = p.x; lastY = p.y;
    });

    function endStroke(e) {
      if (!drawing) return;
      drawing = false;
      try { canvas.releasePointerCapture(e.pointerId); } catch (err) {}
      scheduleSave();
    }
    canvas.addEventListener('pointerup', endStroke);
    canvas.addEventListener('pointercancel', endStroke);
    canvas.addEventListener('pointerleave', function (e) { if (drawing) endStroke(e); });
  }

  // ── PAGE BUILDING ────────────────────────────────────────────
  function buildPageShell(id, level) {
    var cfg = LEVELS[level];
    var el = document.createElement('div');
    el.className = 'nb-page';
    el.dataset.id = id;
    el.dataset.level = level;
    el.innerHTML =
      '<div class="nb-page-bar">' +
        '<span class="nb-page-tag ' + level + '">' + t('tag' + level.charAt(0).toUpperCase() + level.slice(1)) + '</span>' +
        '<div class="nb-page-btns">' +
          '<button type="button" class="nb-mini-btn" data-act="download">' + t('download') + '</button>' +
          '<button type="button" class="nb-mini-btn" data-act="clear">' + t('clear') + '</button>' +
          '<button type="button" class="nb-mini-btn danger" data-act="remove">' + t('remove') + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="nb-canvas-wrap">' +
        '<div class="nb-canvas-inner">' +
          '<canvas class="nb-guide-canvas"></canvas>' +
          '<canvas class="nb-ink-canvas"></canvas>' +
        '</div>' +
      '</div>';
    return el;
  }

  function renderPageCanvases(pageEl, inkDataUrl) {
    var level = pageEl.dataset.level;
    var cfg = LEVELS[level];
    var wrap = pageEl.querySelector('.nb-canvas-wrap');
    var inner = pageEl.querySelector('.nb-canvas-inner');
    var guide = pageEl.querySelector('.nb-guide-canvas');
    var ink = pageEl.querySelector('.nb-ink-canvas');

    var availW = wrap.clientWidth || 600;
    var cols = Math.max(2, Math.floor(availW / cfg.cell));
    var cssW = cols * cfg.cell, cssH = cfg.rows * cfg.cell;
    inner.style.width = cssW + 'px';
    inner.style.height = cssH + 'px';

    drawGuide(guide, cols, cfg.rows, cfg.cell, cfg);
    sizeInkCanvas(ink, cssW, cssH, inkDataUrl);
    if (!inkDataUrl) ink.dataset.hasInk = '0';

    if (!ink.dataset.wired) {
      wireDrawing(ink);
      ink.dataset.wired = '1';
    }
  }

  function addPage(level, inkDataUrl, skipSave) {
    var id = 'p' + (++pageSeq) + '_' + Date.now();
    var el = buildPageShell(id, level);
    document.getElementById('notebookPages').appendChild(el);
    renderPageCanvases(el, inkDataUrl);
    wirePageButtons(el);
    if (!skipSave) scheduleSave();
    return el;
  }

  function wirePageButtons(pageEl) {
    pageEl.querySelectorAll('.nb-mini-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var act = btn.getAttribute('data-act');
        if (act === 'clear') {
          var ink = pageEl.querySelector('.nb-ink-canvas');
          var ctx = ink.getContext('2d');
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, ink.width, ink.height);
          ctx.restore();
          ink.dataset.hasInk = '0';
          scheduleSave();
        } else if (act === 'remove') {
          if (document.querySelectorAll('.nb-page').length <= 1) {
            var ink2 = pageEl.querySelector('.nb-ink-canvas');
            var ctx2 = ink2.getContext('2d');
            ctx2.clearRect(0, 0, ink2.width, ink2.height);
            ink2.dataset.hasInk = '0';
            scheduleSave();
            return;
          }
          if (window.confirm(t('confirmRemove'))) {
            pageEl.remove();
            scheduleSave();
          }
        } else if (act === 'download') {
          downloadPage(pageEl);
        }
      });
    });
  }

  function downloadPage(pageEl) {
    var guide = pageEl.querySelector('.nb-guide-canvas');
    var ink = pageEl.querySelector('.nb-ink-canvas');
    var out = document.createElement('canvas');
    out.width = guide.width;
    out.height = guide.height;
    var ctx = out.getContext('2d');
    ctx.fillStyle = '#fffdf8';
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(guide, 0, 0);
    ctx.drawImage(ink, 0, 0);
    var a = document.createElement('a');
    a.href = out.toDataURL('image/png');
    a.download = 'caiet-coreean-' + pageEl.dataset.level + '.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // ── LEVEL SELECTOR ───────────────────────────────────────────
  function syncLevelButtons() {
    document.querySelectorAll('.lvl-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-level') === selectedLevel);
    });
  }

  function wireLevelButtons() {
    document.querySelectorAll('.lvl-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectedLevel = btn.getAttribute('data-level');
        syncLevelButtons();
      });
    });
  }

  // ── TEXT SYNC ─────────────────────────────────────────────────
  function applyTexts() {
    document.getElementById('pageTitle').textContent = t('title');
    document.getElementById('pageSub').textContent = t('sub');
    document.getElementById('lvlLabel').textContent = t('lvlLabel');
    document.getElementById('lvlNameLarge').textContent = t('lvlLarge');
    document.getElementById('lvlNameMedium').textContent = t('lvlMedium');
    document.getElementById('lvlNameSmall').textContent = t('lvlSmall');
    document.getElementById('btnAddPageLbl').textContent = t('addPage');
    document.getElementById('btnPrintLbl').textContent = t('print');
    document.getElementById('nbHint').textContent = t('hint');
    document.querySelectorAll('.nb-page').forEach(function (pageEl) {
      var level = pageEl.dataset.level;
      var tag = pageEl.querySelector('.nb-page-tag');
      if (tag) tag.textContent = t('tag' + level.charAt(0).toUpperCase() + level.slice(1));
      var btns = pageEl.querySelectorAll('.nb-mini-btn');
      btns.forEach(function (b) {
        var act = b.getAttribute('data-act');
        if (act === 'clear') b.textContent = t('clear');
        else if (act === 'remove') b.textContent = t('remove');
        else if (act === 'download') b.textContent = t('download');
      });
    });
  }

  function onLangChange(l) {
    LANG = l;
    applyTexts();
  }

  // ── REDRAW GUIDES ON THEME CHANGE ──────────────────────────────
  function redrawAllGuides() {
    document.querySelectorAll('.nb-page').forEach(function (pageEl) {
      var level = pageEl.dataset.level;
      var cfg = LEVELS[level];
      var guide = pageEl.querySelector('.nb-guide-canvas');
      var inner = pageEl.querySelector('.nb-canvas-inner');
      var cols = Math.round(parseInt(inner.style.width, 10) / cfg.cell);
      drawGuide(guide, cols, cfg.rows, cfg.cell, cfg);
    });
  }

  var themeObserver = new MutationObserver(function () { redrawAllGuides(); });
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // ── INIT ────────────────────────────────────────────────────
  function init() {
    RKLang.init(onLangChange);
    wireLevelButtons();

    var state = loadState();
    if (state && state.pages && state.pages.length) {
      selectedLevel = LEVEL_ORDER.indexOf(state.selectedLevel) !== -1 ? state.selectedLevel : 'large';
      state.pages.forEach(function (p) {
        var level = LEVELS[p.level] ? p.level : 'large';
        addPage(level, p.ink, true);
      });
    } else if (state === null) {
      // First-ever visit: show the large → medium → small progression.
      LEVEL_ORDER.forEach(function (level) { addPage(level, null, true); });
      persistState();
    }
    syncLevelButtons();
    applyTexts();

    document.getElementById('btnAddPage').addEventListener('click', function () {
      addPage(selectedLevel, null);
    });
    document.getElementById('btnPrint').addEventListener('click', function () {
      window.print();
    });

    window.addEventListener('resize', function () {
      clearTimeout(window.__nbResizeT);
      window.__nbResizeT = setTimeout(function () {
        document.querySelectorAll('.nb-page').forEach(function (pageEl) {
          var ink = pageEl.querySelector('.nb-ink-canvas');
          var dataUrl = ink.dataset.hasInk === '1' ? ink.toDataURL('image/png') : null;
          renderPageCanvases(pageEl, dataUrl);
        });
      }, 250);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
