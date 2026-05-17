/**
 * RKLang — language picker + home button module.
 *
 * Utilizare simplă (HTML minim pe pagină):
 *   <div id="pageControls"></div>
 *   → modulul injectează automat: butonul Home + selectorul ro/en
 *
 * Sau cu buton extra înainte (ex: writing.html):
 *   <a href="./hangul.html" class="homeBtn" title="Hangul">가</a>
 *   <div id="pageControls"></div>
 *   → modulul injectează Home + ro/en, butonul extra rămâne al paginii
 *
 * API:
 *   RKLang.get()          → limba curentă ("ro" | "en")
 *   RKLang.init(onChange) → injectează HTML dacă e nevoie, configurează
 *                           evenimentele; onChange(lang) e apelat la schimbare
 */
window.RKLang = (function () {
  var KEY = "RK_LANG";

  var HOME_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';

  function get() {
    return localStorage.getItem(KEY) || "ro";
  }

  function _inject(container) {
    if (!container.hasAttribute("data-no-home")) {
      container.setAttribute("style",
        "display:flex;gap:8px;align-items:center;flex-shrink:0");
    }
    var home = container.hasAttribute("data-no-home") ? "" :
      '<a href="./index.html" class="homeBtn" aria-label="Acasă">' + HOME_ICON + '</a>';
    container.innerHTML =
      home +
      '<div style="position:relative">' +
        '<button type="button" id="langBtn"></button>' +
        '<div id="langPicker" class="lang-picker">' +
          '<button type="button" id="pickRo">ro</button>' +
          '<button type="button" id="pickEn">en</button>' +
        '</div>' +
      '</div>';
  }

  function _syncBtns(lang) {
    var lb  = document.getElementById("langBtn");
    var pRo = document.getElementById("pickRo");
    var pEn = document.getElementById("pickEn");
    if (lb)  lb.textContent = lang;
    if (pRo) pRo.classList.toggle("active", lang === "ro");
    if (pEn) pEn.classList.toggle("active", lang === "en");
  }

  function _open() {
    var p = document.getElementById("langPicker");
    if (p) p.classList.add("open");
  }

  function _close() {
    var p = document.getElementById("langPicker");
    if (p) p.classList.remove("open");
  }

  function init(onChange) {
    var container = document.getElementById("pageControls");
    if (container) _inject(container);

    _syncBtns(get());

    var lb    = document.getElementById("langBtn");
    var timer = null;

    if (lb) {
      lb.addEventListener("pointerdown", function () {
        timer = setTimeout(function () { timer = null; _open(); }, 450);
      });
      lb.addEventListener("pointerup",    function () { clearTimeout(timer); timer = null; });
      lb.addEventListener("pointerleave", function () { clearTimeout(timer); timer = null; });
    }

    function _pick(lang) {
      localStorage.setItem(KEY, lang);
      _syncBtns(lang);
      _close();
      if (onChange) onChange(lang);
    }

    var pRo = document.getElementById("pickRo");
    var pEn = document.getElementById("pickEn");
    if (pRo) pRo.addEventListener("click", function () { _pick("ro"); });
    if (pEn) pEn.addEventListener("click", function () { _pick("en"); });

    document.addEventListener("pointerdown", function (e) {
      if (!e.target.closest("#langBtn,#langPicker")) _close();
    });
  }

  return { get: get, init: init };
})();
