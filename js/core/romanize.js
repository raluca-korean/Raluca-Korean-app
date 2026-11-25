/* =========================================================
   🔤 ROMANIZATION (shared) — Hangul → approximate Revised
   Romanization, syllable by syllable, no sound-change rules.
   Same table already used in lesson-neural.html's own romanize();
   pulled out here so other pages (Glossary, Flashcards, …) can
   show a reading aid for someone who hasn't learned Hangul yet,
   without duplicating the lookup tables.
========================================================= */
window.RKRomanize = (function () {
  var L = ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'];
  var V = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];
  var T = ['','k','k','k','n','n','n','t','l','k','m','l','l','l','p','l','m','p','p','t','t','ng','t','t','k','t','p','t'];

  function toRoman(text) {
    return String(text || '').split(/(\s+)/).map(function (word) {
      var out = [], buf = '';
      for (var i = 0; i < word.length; i++) {
        var ch = word[i];
        var c = ch.charCodeAt(0) - 0xAC00;
        if (c >= 0 && c < 11172) {
          if (buf) { out.push(buf); buf = ''; }
          out.push(L[Math.floor(c / 588)] + V[Math.floor((c % 588) / 28)] + T[c % 28]);
        } else {
          buf += ch;
        }
      }
      if (buf) out.push(buf);
      // hyphen only between syllables, not before punctuation
      return out.reduce(function (acc, part, i) {
        return acc + (i && /^[a-z]/.test(part) && /[a-z]$/.test(out[i - 1]) ? '-' : '') + part;
      }, '');
    }).join('');
  }

  return { toRoman: toRoman };
})();
