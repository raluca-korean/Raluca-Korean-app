/* Faint fixed Seoul skyline drawing (sun, birds, cloud, kite, pagoda,
   ridges, Namsan/N Seoul Tower, hanok gate, city skyline) behind the
   whole page. Injected via JS so the ~30 theme-anime.css pages don't
   each carry a copy of the markup — see index.html for the original,
   hand-tuned version this was lifted from. */
(function(){
  if(document.getElementById('rkSeoulBg')) return;

  var STYLE =
    '.rk-seoul-bg{position:fixed;inset:0;width:100vw;height:100vh;z-index:-1;pointer-events:none;opacity:.32;transition:opacity .25s ease}' +
    '.rk-seoul-bg path,.rk-seoul-bg polygon,.rk-seoul-bg rect{fill:none;stroke:var(--rk-violet,#6C5CE7);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}' +
    '.rk-seoul-bg .seoul-fill{fill:var(--rk-violet,#6C5CE7);stroke:none}' +
    'body.dark-mode .rk-seoul-bg{opacity:.42}';

  var SVG =
    '<svg id="rkSeoulBg" class="rk-seoul-bg" viewBox="0 0 400 860" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">' +
      '<circle class="seoul-fill" cx="325" cy="90" r="12"/>' +
      '<path d="M341,90 L346,90 M336,101 L340,105 M325,106 L325,111 M314,101 L310,105 M309,90 L304,90 M314,79 L310,75 M325,74 L325,69 M336,79 L340,75" stroke-width="2"/>' +
      '<path d="M44,150 q6,-12 12,0 q6,-12 12,0" stroke-width="2"/>' +
      '<path d="M94,200 q6,-10 11,0 q6,-10 11,0" stroke-width="2"/>' +
      '<circle class="seoul-fill" cx="44" cy="260" r="10"/>' +
      '<circle class="seoul-fill" cx="59" cy="248" r="13"/>' +
      '<circle class="seoul-fill" cx="78" cy="252" r="11"/>' +
      '<circle class="seoul-fill" cx="94" cy="262" r="9"/>' +
      '<polygon points="250,170 263,200 250,230 238,200"/>' +
      '<path d="M250,230 q4,10 -3,16 q4,10 -3,16 q4,10 -3,16" stroke-width="2"/>' +
      '<rect x="144" y="440" width="38" height="24"/>' +
      '<rect x="149" y="416" width="28" height="24"/>' +
      '<rect x="154" y="394" width="18" height="22"/>' +
      '<rect x="158" y="376" width="10" height="18"/>' +
      '<path d="M163,376 L163,358"/>' +
      '<circle class="seoul-fill" cx="163" cy="356" r="2"/>' +
      '<path d="M0,540 Q38,520 75,535 T163,528 T250,538 T325,525 T400,536" stroke-width="2"/>' +
      '<path d="M0,790 Q25,765 50,782 T100,775 T150,786 T200,768 T250,782 T300,772 T350,786 T400,776" stroke-width="2"/>' +
      '<path d="M0,810 Q31,795 63,806 T138,802 T213,812 T288,800 T350,810 T400,802" stroke-width="2"/>' +
      '<path d="M22,840 Q38,810 53,818 Q69,810 84,840"/>' +
      '<path d="M28,850 L28,838 M78,850 L78,838"/>' +
      '<path d="M161,850 L188,795 L214,850 Z"/>' +
      '<path d="M188,795 L188,766"/>' +
      '<path d="M183,774 L193,774"/>' +
      '<circle class="seoul-fill" cx="188" cy="764" r="4"/>' +
      '<rect x="245" y="812" width="11" height="38"/>' +
      '<rect x="260" y="790" width="10" height="60"/>' +
      '<polygon points="275,850 275,780 279,760 284,780 284,850"/>' +
      '<rect x="289" y="800" width="10" height="50"/>' +
      '<rect x="304" y="816" width="11" height="34"/>' +
      '<rect x="323" y="796" width="9" height="54"/>' +
      '<rect x="338" y="820" width="10" height="30"/>' +
    '</svg>';

  function inject(){
    var styleEl = document.createElement('style');
    styleEl.textContent = STYLE;
    document.head.appendChild(styleEl);

    var wrap = document.createElement('div');
    wrap.innerHTML = SVG;
    document.body.insertBefore(wrap.firstChild, document.body.firstChild);
  }

  if(document.body) inject();
  else document.addEventListener('DOMContentLoaded', inject);
})();
