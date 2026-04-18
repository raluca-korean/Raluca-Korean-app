/* ============================================================
   VOCAB WIDGET — panel flotant de căutare vocabular
   Folosit de: index, exercises, lessons, builder
   Auto-conținut: injectează CSS + HTML, fără dependențe externe
   ============================================================ */

(function () {
  'use strict';

  /* ---- Etichete categorii (ro / en) ---- */
  const CAT_LABELS = {
    subjects:     { ro: 'Subiecte',     en: 'Subjects' },
    objects:      { ro: 'Obiecte',      en: 'Objects' },
    verbs:        { ro: 'Verbe',        en: 'Verbs' },
    times:        { ro: 'Timp',         en: 'Time' },
    places:       { ro: 'Locuri',       en: 'Places' },
    modifiers:    { ro: 'Modificatori', en: 'Modifiers' },
    conjugations: { ro: 'Conjugări',    en: 'Conjugations' },
    nouns:        { ro: 'Substantive',  en: 'Nouns' },
    adjectives:   { ro: 'Adjective',    en: 'Adjectives' },
    adverbs:      { ro: 'Adverbe',      en: 'Adverbs' },
    connectors:   { ro: 'Conectori',    en: 'Connectors' },
    grammar:      { ro: 'Gramatică',    en: 'Grammar' },
  };

  /* ---- Stare internă ---- */
  let vocabLoaded = false;
  let allWords = [];       // { ko, ro, en, cat }
  let knownCats = [];      // categorii găsite în JSON
  let panelOpen = false;

  function getLang() {
    return localStorage.getItem('RK_LANG') || 'ro';
  }

  /* ================================================================
     CSS — injectat o singură dată în <head>
  ================================================================ */
  function injectCSS() {
    if (document.getElementById('vw-styles')) return;
    const s = document.createElement('style');
    s.id = 'vw-styles';
    s.textContent = `
/* --- buton flotant --- */
#vw-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 52px;
  height: 52px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #db2777, #7c3aed);
  color: #fff;
  font-size: 22px;
  cursor: pointer;
  z-index: 9010;
  box-shadow: 0 8px 24px rgba(219,39,119,.38);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform .15s, box-shadow .15s;
}
#vw-fab:hover { transform: scale(1.09); box-shadow: 0 12px 30px rgba(219,39,119,.48); }

/* --- overlay semi-transparent --- */
#vw-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26,5,51,.32);
  z-index: 9011;
  opacity: 0;
  pointer-events: none;
  transition: opacity .2s;
}
#vw-overlay.vw-open { opacity: 1; pointer-events: auto; }

/* --- panel slide-up --- */
#vw-panel {
  position: fixed;
  bottom: 0;
  right: 0;
  width: min(430px, 100vw);
  height: min(82vh, 700px);
  background: linear-gradient(180deg, #fdf4ff 0%, #fdf4ff 100%);
  border-radius: 22px 22px 0 0;
  box-shadow: 0 -16px 48px rgba(219,39,119,.20);
  z-index: 9012;
  display: flex;
  flex-direction: column;
  transform: translateY(100%);
  transition: transform .27s cubic-bezier(.4,0,.2,1);
}
#vw-panel.vw-open { transform: translateY(0); }

/* --- header panel --- */
.vw-hdr {
  padding: 16px 16px 10px;
  border-bottom: 1.5px solid rgba(219,39,119,.13);
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.vw-hdr-title {
  flex: 1;
  font-weight: 800;
  font-size: 16px;
  background: linear-gradient(135deg, #db2777, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.vw-hdr-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: rgba(126,58,110,.65);
  line-height: 1;
  padding: 4px 6px;
  border-radius: 8px;
}
.vw-hdr-close:hover { background: rgba(219,39,119,.09); }

/* --- input căutare --- */
.vw-search-wrap { padding: 10px 16px 0; flex-shrink: 0; }
.vw-search {
  width: 100%;
  padding: 10px 14px;
  border-radius: 14px;
  border: 1.5px solid rgba(219,39,119,.2);
  background: #fff;
  font: inherit;
  font-size: 14px;
  outline: none;
  color: #1a0533;
}
.vw-search:focus {
  border-color: rgba(219,39,119,.48);
  box-shadow: 0 0 0 4px rgba(219,39,119,.10);
}

/* --- filtre categorii --- */
.vw-cats {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  padding: 8px 16px 4px;
  flex-shrink: 0;
}
.vw-cat {
  padding: 4px 12px;
  border-radius: 999px;
  border: 1.5px solid rgba(219,39,119,.22);
  background: #fff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  color: rgba(126,58,110,.88);
  transition: background .12s, color .12s;
}
.vw-cat.vw-active {
  background: linear-gradient(135deg, #db2777, #7c3aed);
  color: #fff;
  border-color: transparent;
}

/* --- lista cuvinte --- */
.vw-list {
  flex: 1;
  overflow-y: auto;
  padding: 6px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.vw-word {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1.5px solid rgba(219,39,119,.10);
  background: linear-gradient(160deg, #fff, #fdf4ff);
  box-shadow: 0 2px 8px rgba(219,39,119,.06);
}
.vw-ko {
  font-weight: 900;
  font-size: 17px;
  background: linear-gradient(135deg, #db2777, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  min-width: 90px;
}
.vw-tr {
  flex: 1;
  font-size: 13px;
  color: rgba(126,58,110,.85);
}
.vw-speak {
  background: none;
  border: 1.5px solid rgba(219,39,119,.22);
  border-radius: 999px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 13px;
  flex-shrink: 0;
  transition: background .12s;
}
.vw-speak:hover { background: rgba(219,39,119,.09); }

.vw-empty, .vw-loading {
  text-align: center;
  color: rgba(126,58,110,.58);
  font-size: 14px;
  padding: 40px 0;
}
    `;
    document.head.appendChild(s);
  }

  /* ================================================================
     Încărcare vocab
  ================================================================ */
  async function loadVocab() {
    if (vocabLoaded) return;
    try {
      const res = await fetch('./data/vocab-korean.json');
      if (!res.ok) throw new Error('fetch fail');
      const data = await res.json();
      allWords = flattenVocab(data);
      knownCats = discoverCats(data);
    } catch (e) {
      allWords = [];
      knownCats = [];
    }
    vocabLoaded = true;
  }

  function flattenVocab(data) {
    const seen = new Set();
    const out = [];
    for (const cat of Object.keys(data)) {
      const arr = data[cat];
      if (!Array.isArray(arr)) continue;
      for (const item of arr) {
        if (!item || typeof item !== 'object') continue;
        if (!item.ko) continue;
        if (seen.has(item.ko + cat)) continue;
        seen.add(item.ko + cat);
        out.push({ ko: item.ko, ro: item.ro || '', en: item.en || '', cat });
      }
    }
    return out;
  }

  function discoverCats(data) {
    return Object.keys(data).filter(k => {
      const arr = data[k];
      return Array.isArray(arr) && arr.some(i => i && typeof i === 'object' && i.ko);
    });
  }

  /* ================================================================
     Redare listă
  ================================================================ */
  function renderList(listEl, query, cat) {
    const lang = getLang();
    const q = query.trim().toLowerCase();
    let words = cat === 'all' ? allWords : allWords.filter(w => w.cat === cat);
    if (q) {
      words = words.filter(w =>
        w.ko.includes(q) ||
        w.ro.toLowerCase().includes(q) ||
        w.en.toLowerCase().includes(q)
      );
    }

    listEl.innerHTML = '';

    if (!words.length) {
      listEl.innerHTML = `<div class="vw-empty">${lang === 'en' ? 'No results' : 'Niciun rezultat'}</div>`;
      return;
    }

    const frag = document.createDocumentFragment();
    const limit = Math.min(words.length, 150);
    for (let i = 0; i < limit; i++) {
      const w = words[i];
      const tr = lang === 'en' ? (w.en || w.ro) : (w.ro || w.en);
      const el = document.createElement('div');
      el.className = 'vw-word';
      el.innerHTML =
        `<span class="vw-ko">${w.ko}</span>` +
        `<span class="vw-tr">${tr}</span>` +
        `<button class="vw-speak" title="Pronunție">🔊</button>`;
      el.querySelector('.vw-speak').addEventListener('click', ev => {
        ev.stopPropagation();
        speakKo(w.ko);
      });
      frag.appendChild(el);
    }
    listEl.appendChild(frag);
  }

  function speakKo(text) {
    if (!window.speechSynthesis || !text) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ko-KR';
    u.rate = 0.9;
    speechSynthesis.speak(u);
  }

  /* ================================================================
     Construire widget
  ================================================================ */
  function buildWidget() {
    /* -- FAB -- */
    const fab = document.createElement('button');
    fab.id = 'vw-fab';
    fab.title = 'Vocabular';
    fab.innerHTML = '📖';
    document.body.appendChild(fab);

    /* -- Overlay -- */
    const overlay = document.createElement('div');
    overlay.id = 'vw-overlay';
    document.body.appendChild(overlay);

    /* -- Panel -- */
    const panel = document.createElement('div');
    panel.id = 'vw-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Vocabular');
    panel.innerHTML =
      `<div class="vw-hdr">` +
        `<span class="vw-hdr-title">📖 Vocabular</span>` +
        `<button class="vw-hdr-close" aria-label="Închide">✕</button>` +
      `</div>` +
      `<div class="vw-search-wrap">` +
        `<input class="vw-search" type="search" placeholder="Caută (ko / ro / en)…" autocomplete="off">` +
      `</div>` +
      `<div class="vw-cats" id="vw-cats-bar"></div>` +
      `<div class="vw-list" id="vw-list"><div class="vw-loading">Se încarcă…</div></div>`;
    document.body.appendChild(panel);

    const listEl   = panel.querySelector('#vw-list');
    const searchEl = panel.querySelector('.vw-search');
    const catsBar  = panel.querySelector('#vw-cats-bar');

    let activeCat = 'all';
    let searchVal = '';

    function refresh() {
      renderList(listEl, searchVal, activeCat);
    }

    function buildCatButtons() {
      const lang = getLang();
      catsBar.innerHTML = '';

      const makeBtn = (catKey, label) => {
        const b = document.createElement('button');
        b.className = 'vw-cat' + (catKey === activeCat ? ' vw-active' : '');
        b.dataset.cat = catKey;
        b.textContent = label;
        b.addEventListener('click', () => {
          activeCat = catKey;
          catsBar.querySelectorAll('.vw-cat').forEach(x => x.classList.remove('vw-active'));
          b.classList.add('vw-active');
          refresh();
        });
        catsBar.appendChild(b);
      };

      makeBtn('all', lang === 'en' ? 'All' : 'Toate');
      for (const cat of knownCats) {
        const labels = CAT_LABELS[cat];
        makeBtn(cat, labels ? labels[lang] : cat);
      }
    }

    async function openPanel() {
      panelOpen = true;
      overlay.classList.add('vw-open');
      panel.classList.add('vw-open');

      if (!vocabLoaded) {
        listEl.innerHTML = '<div class="vw-loading">Se încarcă…</div>';
        await loadVocab();
        buildCatButtons();
      }

      refresh();
      searchEl.focus();
    }

    function closePanel() {
      panelOpen = false;
      overlay.classList.remove('vw-open');
      panel.classList.remove('vw-open');
      speechSynthesis && speechSynthesis.cancel();
    }

    /* -- Events -- */
    fab.addEventListener('click', () => { panelOpen ? closePanel() : openPanel(); });
    overlay.addEventListener('click', closePanel);
    panel.querySelector('.vw-hdr-close').addEventListener('click', closePanel);

    searchEl.addEventListener('input', () => {
      searchVal = searchEl.value;
      refresh();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && panelOpen) closePanel();
    });
  }

  /* ================================================================
     Init
  ================================================================ */
  injectCSS();
  if (document.body) {
    buildWidget();
  } else {
    document.addEventListener('DOMContentLoaded', buildWidget);
  }

})();
