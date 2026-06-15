// ── STROKE ORDER DATA ─────────────────────────────────────────
const SD = {
  'ㄱ':[{p:[[30,48],[168,48]],n:1},{p:[[168,48],[168,168]],n:2}],
  'ㄴ':[{p:[[38,42],[38,165]],n:1},{p:[[38,165],[165,165]],n:2}],
  'ㄷ':[{p:[[30,42],[165,42]],n:1},{p:[[30,42],[30,162]],n:2},{p:[[30,162],[165,162]],n:3}],
  'ㄹ':[{p:[[30,48],[165,48]],n:1},{p:[[165,48],[165,103]],n:2},{p:[[165,103],[30,103]],n:3},{p:[[30,103],[30,158]],n:4},{p:[[30,158],[165,158]],n:5}],
  'ㅁ':[{p:[[32,42],[165,42]],n:1},{p:[[32,42],[32,163]],n:2},{p:[[165,42],[165,163]],n:3},{p:[[32,163],[165,163]],n:4}],
  'ㅂ':[{p:[[40,42],[40,165]],n:1},{p:[[158,42],[158,165]],n:2},{p:[[40,103],[158,103]],n:3},{p:[[40,165],[158,165]],n:4}],
  'ㅅ':[{p:[[100,38],[40,168]],n:1},{p:[[100,38],[160,168]],n:2}],
  'ㅇ':[{circle:true,cx:100,cy:108,r:56,n:1}],
  'ㅈ':[{p:[[30,68],[168,68]],n:1},{p:[[100,68],[40,168]],n:2},{p:[[100,68],[160,168]],n:3}],
  'ㅊ':[{p:[[82,30],[118,30]],n:1},{p:[[30,70],[168,70]],n:2},{p:[[100,70],[40,168]],n:3},{p:[[100,70],[160,168]],n:4}],
  'ㅋ':[{p:[[30,48],[168,48]],n:1},{p:[[168,48],[168,168]],n:2},{p:[[30,108],[168,108]],n:3}],
  'ㅌ':[{p:[[30,43],[165,43]],n:1},{p:[[30,43],[30,163]],n:2},{p:[[30,103],[165,103]],n:3},{p:[[30,163],[165,163]],n:4}],
  'ㅍ':[{p:[[28,42],[172,42]],n:1},{p:[[65,42],[65,160]],n:2},{p:[[135,42],[135,160]],n:3},{p:[[28,160],[172,160]],n:4}],
  'ㅎ':[{p:[[82,28],[118,28]],n:1},{p:[[30,68],[168,68]],n:2},{p:[[100,68],[100,108]],n:3},{circle:true,cx:100,cy:148,r:40,n:4}],
  'ㄲ':[{p:[[10,48],[82,48]],n:1},{p:[[82,48],[82,168]],n:2},{p:[[100,48],[172,48]],n:3},{p:[[172,48],[172,168]],n:4}],
  'ㄸ':[{p:[[10,42],[80,42]],n:1},{p:[[10,42],[10,162]],n:2},{p:[[10,162],[80,162]],n:3},{p:[[100,42],[170,42]],n:4},{p:[[100,42],[100,162]],n:5},{p:[[100,162],[170,162]],n:6}],
  'ㅃ':[{p:[[10,42],[10,165]],n:1},{p:[[82,42],[82,165]],n:2},{p:[[10,103],[82,103]],n:3},{p:[[10,165],[82,165]],n:4},{p:[[100,42],[100,165]],n:5},{p:[[172,42],[172,165]],n:6},{p:[[100,103],[172,103]],n:7},{p:[[100,165],[172,165]],n:8}],
  'ㅆ':[{p:[[46,40],[10,165]],n:1},{p:[[46,40],[82,165]],n:2},{p:[[136,40],[100,165]],n:3},{p:[[136,40],[172,165]],n:4}],
  'ㅉ':[{p:[[10,68],[82,68]],n:1},{p:[[46,68],[15,162]],n:2},{p:[[46,68],[79,162]],n:3},{p:[[100,68],[172,68]],n:4},{p:[[136,68],[105,162]],n:5},{p:[[136,68],[169,162]],n:6}],
  'ㅏ':[{p:[[100,30],[100,170]],n:1},{p:[[100,100],[165,100]],n:2}],
  'ㅐ':[{p:[[80,30],[80,170]],n:1},{p:[[148,30],[148,170]],n:2},{p:[[80,100],[148,100]],n:3}],
  'ㅑ':[{p:[[100,30],[100,170]],n:1},{p:[[100,77],[165,77]],n:2},{p:[[100,120],[165,120]],n:3}],
  'ㅒ':[{p:[[70,30],[70,170]],n:1},{p:[[125,30],[125,170]],n:2},{p:[[70,77],[125,77]],n:3},{p:[[70,120],[125,120]],n:4}],
  'ㅓ':[{p:[[100,30],[100,170]],n:1},{p:[[100,100],[35,100]],n:2}],
  'ㅔ':[{p:[[55,30],[55,170]],n:1},{p:[[120,30],[120,130]],n:2},{p:[[120,100],[55,100]],n:3}],
  'ㅕ':[{p:[[100,30],[100,170]],n:1},{p:[[100,77],[35,77]],n:2},{p:[[100,120],[35,120]],n:3}],
  'ㅖ':[{p:[[55,30],[55,170]],n:1},{p:[[120,30],[120,140]],n:2},{p:[[120,77],[55,77]],n:3},{p:[[120,120],[55,120]],n:4}],
  'ㅗ':[{p:[[30,130],[170,130]],n:1},{p:[[100,130],[100,30]],n:2}],
  'ㅛ':[{p:[[30,130],[170,130]],n:1},{p:[[73,130],[73,30]],n:2},{p:[[127,130],[127,30]],n:3}],
  'ㅜ':[{p:[[30,70],[170,70]],n:1},{p:[[100,70],[100,170]],n:2}],
  'ㅠ':[{p:[[30,70],[170,70]],n:1},{p:[[73,70],[73,170]],n:2},{p:[[127,70],[127,170]],n:3}],
  'ㅡ':[{p:[[25,100],[175,100]],n:1}],
  'ㅣ':[{p:[[100,25],[100,175]],n:1}],
  'ㅘ':[{p:[[22,130],[90,130]],n:1},{p:[[55,130],[55,28]],n:2},{p:[[118,28],[118,170]],n:3},{p:[[118,100],[168,100]],n:4}],
  'ㅙ':[{p:[[18,130],[85,130]],n:1},{p:[[50,130],[50,28]],n:2},{p:[[100,28],[100,170]],n:3},{p:[[142,28],[142,130]],n:4},{p:[[100,100],[142,100]],n:5}],
  'ㅚ':[{p:[[20,130],[98,130]],n:1},{p:[[58,130],[58,28]],n:2},{p:[[148,25],[148,175]],n:3}],
  'ㅝ':[{p:[[18,72],[90,72]],n:1},{p:[[54,72],[54,170]],n:2},{p:[[128,28],[128,170]],n:3},{p:[[128,100],[92,100]],n:4}],
  'ㅞ':[{p:[[22,75],[92,75]],n:1},{p:[[57,75],[57,168]],n:2},{p:[[108,28],[108,170]],n:3},{p:[[150,28],[150,132]],n:4},{p:[[150,100],[108,100]],n:5}],
  'ㅟ':[{p:[[18,72],[98,72]],n:1},{p:[[58,72],[58,170]],n:2},{p:[[148,25],[148,175]],n:3}],
  'ㅢ':[{p:[[25,100],[175,100]],n:1},{p:[[130,25],[130,175]],n:2}],
};

// ── STROKE ANIMATION ──────────────────────────────────────────
let _animTimers = [];

function _pLen(s) {
  if (s.circle) return Math.ceil(2 * Math.PI * s.r) + 1;
  let len = 0;
  for (let i = 1; i < s.p.length; i++) {
    len += Math.hypot(s.p[i][0] - s.p[i-1][0], s.p[i][1] - s.p[i-1][1]);
  }
  return Math.ceil(len) + 1;
}

function numCircle(cx, cy, n, badge) {
  const col = badge || '#3730A3';
  return `<circle cx="${cx}" cy="${cy}" r="10" fill="${col}" opacity=".88"/>
  <text x="${cx}" y="${cy+4}" text-anchor="middle" fill="white" font-size="11"
    font-weight="bold" font-family="sans-serif">${n}</text>`;
}

function showStrokesStatic(char, svgId) {
  if (!char) return;
  _animTimers.forEach(clearTimeout);
  _animTimers = [];
  const svg = document.getElementById(svgId || 'mWriteArrows');
  if (!svg) return;
  const data = SD[char];
  if (!data || !data.length) { svg.innerHTML = ''; return; }
  const isDark = document.body.classList.contains('dark-mode');
  const stroke = isDark ? '#F472B6' : '#DB2777';
  const badge  = isDark ? '#818CF8' : '#3730A3';
  const AID    = 'wArrowS';
  let h = `<defs><marker id="${AID}" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
    <polygon points="0 0,8 3,0 6" fill="${stroke}" opacity=".9"/>
  </marker></defs>`;
  data.forEach(s => {
    if (s.circle) {
      h += `<circle cx="${s.cx}" cy="${s.cy}" r="${s.r}" fill="none"
        stroke="${stroke}" stroke-width="3" opacity=".38"/>`;
      h += `<g opacity=".55">${numCircle(s.cx, s.cy - s.r - 14, s.n, badge)}</g>`;
    } else {
      const d = s.p.map((p, j) => `${j ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
      h += `<path d="${d}" fill="none" stroke="${stroke}"
        stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity=".38"
        marker-end="url(#${AID})"/>`;
      h += `<g opacity=".55">${numCircle(s.p[0][0], s.p[0][1], s.n, badge)}</g>`;
    }
  });
  svg.innerHTML = h;
}

function animateStrokes(char, svgId) {
  if (!char) return;
  _animTimers.forEach(clearTimeout);
  _animTimers = [];
  const svg  = document.getElementById(svgId || 'mWriteArrows');
  if (!svg) return;
  const data = SD[char];
  if (!data || !data.length) { svg.innerHTML = ''; return; }
  const isDark = document.body.classList.contains('dark-mode');
  const stroke = isDark ? '#F472B6' : '#DB2777';
  const badge  = isDark ? '#818CF8' : '#3730A3';
  const AID    = 'wArrow2';
  let h = `<defs><marker id="${AID}" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
    <polygon points="0 0,8 3,0 6" fill="${stroke}" opacity=".9"/>
  </marker></defs>`;
  data.forEach((s, i) => {
    const len = _pLen(s);
    if (s.circle) {
      h += `<circle id="as${i}" cx="${s.cx}" cy="${s.cy}" r="${s.r}" fill="none"
        stroke="${stroke}" stroke-width="2.5" opacity=".9"
        style="stroke-dasharray:${len};stroke-dashoffset:${len}"/>`;
      h += `<g id="ab${i}" style="opacity:0">${numCircle(s.cx, s.cy - s.r - 14, s.n, badge)}</g>`;
    } else {
      const d = s.p.map((p, j) => `${j ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
      h += `<path id="as${i}" d="${d}" fill="none" stroke="${stroke}"
        stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity=".9"
        marker-end="url(#${AID})"
        style="stroke-dasharray:${len};stroke-dashoffset:${len}"/>`;
      h += `<g id="ab${i}" style="opacity:0">${numCircle(s.p[0][0], s.p[0][1], s.n, badge)}</g>`;
    }
  });
  svg.innerHTML = h;
  const DUR = 480, GAP = 120;
  data.forEach((s, i) => {
    const t0 = i * (DUR + GAP);
    _animTimers.push(setTimeout(() => {
      const el = svg.querySelector(`#as${i}`);
      if (!el) return;
      el.style.transition = `stroke-dashoffset ${DUR}ms ease-in-out`;
      el.getBoundingClientRect();
      el.style.strokeDashoffset = '0';
    }, t0));
    _animTimers.push(setTimeout(() => {
      const bl = svg.querySelector(`#ab${i}`);
      if (bl) { bl.style.transition = 'opacity 200ms'; bl.style.opacity = '1'; }
    }, t0 + DUR));
  });
}
