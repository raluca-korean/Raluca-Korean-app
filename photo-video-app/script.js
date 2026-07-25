const CANVAS_W = 1280;
const CANVAS_H = 720;
const TRANSITION_DUR = 0.6; // seconds
const FPS = 30;

const els = {
  fileInput: document.getElementById('fileInput'),
  dropzone: document.getElementById('dropzone'),
  list: document.getElementById('photoList'),
  emptyState: document.getElementById('emptyState'),
  transition: document.getElementById('transition'),
  musicInput: document.getElementById('musicInput'),
  musicName: document.getElementById('musicName'),
  removeMusic: document.getElementById('removeMusic'),
  generateBtn: document.getElementById('generateBtn'),
  canvas: document.getElementById('canvas'),
  progressWrap: document.getElementById('progressWrap'),
  progressBar: document.getElementById('progressBar'),
  progressText: document.getElementById('progressText'),
  resultWrap: document.getElementById('resultWrap'),
  resultVideo: document.getElementById('resultVideo'),
  downloadLink: document.getElementById('downloadLink'),
};

let photos = [];
let idCounter = 0;
let musicFile = null;

els.fileInput.addEventListener('change', e => addPhotos(e.target.files));
els.dropzone.addEventListener('click', () => els.fileInput.click());
els.dropzone.addEventListener('dragover', e => {
  e.preventDefault();
  els.dropzone.classList.add('dragover');
});
els.dropzone.addEventListener('dragleave', () => els.dropzone.classList.remove('dragover'));
els.dropzone.addEventListener('drop', e => {
  e.preventDefault();
  els.dropzone.classList.remove('dragover');
  addPhotos(e.dataTransfer.files);
});

function addPhotos(fileList) {
  const files = Array.from(fileList).filter(f => f.type.startsWith('image/'));
  files.forEach(file => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    photos.push({ id: idCounter++, img, url, duration: 3, caption: '' });
  });
  renderList();
}

function renderList() {
  els.emptyState.style.display = photos.length ? 'none' : 'block';
  els.list.innerHTML = '';
  photos.forEach((p, i) => {
    const item = document.createElement('div');
    item.className = 'photoItem';
    item.innerHTML = `
      <img src="${p.url}" class="thumb" alt="">
      <div class="photoControls">
        <label>Duration (s)
          <input type="number" min="1" max="10" step="0.5" value="${p.duration}" data-id="${p.id}" class="durationInput">
        </label>
        <label>Caption
          <input type="text" maxlength="60" value="${p.caption}" data-id="${p.id}" class="captionInput" placeholder="Optional text">
        </label>
      </div>
      <div class="itemActions">
        <button type="button" data-id="${p.id}" class="upBtn" ${i === 0 ? 'disabled' : ''} title="Move up">▲</button>
        <button type="button" data-id="${p.id}" class="downBtn" ${i === photos.length - 1 ? 'disabled' : ''} title="Move down">▼</button>
        <button type="button" data-id="${p.id}" class="removeBtn" title="Remove">✕</button>
      </div>
    `;
    els.list.appendChild(item);
  });

  els.list.querySelectorAll('.durationInput').forEach(inp => inp.addEventListener('input', e => {
    const p = photos.find(p => p.id == e.target.dataset.id);
    p.duration = Math.max(1, parseFloat(e.target.value) || 3);
  }));
  els.list.querySelectorAll('.captionInput').forEach(inp => inp.addEventListener('input', e => {
    const p = photos.find(p => p.id == e.target.dataset.id);
    p.caption = e.target.value;
  }));
  els.list.querySelectorAll('.upBtn').forEach(btn => btn.addEventListener('click', e => moveItem(e.target.dataset.id, -1)));
  els.list.querySelectorAll('.downBtn').forEach(btn => btn.addEventListener('click', e => moveItem(e.target.dataset.id, 1)));
  els.list.querySelectorAll('.removeBtn').forEach(btn => btn.addEventListener('click', e => removeItem(e.target.dataset.id)));
}

function moveItem(id, dir) {
  const idx = photos.findIndex(p => p.id == id);
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= photos.length) return;
  [photos[idx], photos[newIdx]] = [photos[newIdx], photos[idx]];
  renderList();
}

function removeItem(id) {
  photos = photos.filter(p => p.id != id);
  renderList();
}

els.musicInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) {
    musicFile = file;
    els.musicName.textContent = file.name;
    els.removeMusic.style.display = 'inline-block';
  }
});
els.removeMusic.addEventListener('click', () => {
  musicFile = null;
  els.musicInput.value = '';
  els.musicName.textContent = '';
  els.removeMusic.style.display = 'none';
});

els.generateBtn.addEventListener('click', generateVideo);

function pickMimeType() {
  const candidates = [
    'video/mp4;codecs=avc1,mp4a',
    'video/mp4',
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
  ];
  return candidates.find(m => window.MediaRecorder && MediaRecorder.isTypeSupported(m)) || '';
}

function drawCover(ctx, img, scale, offsetXRatio, offsetYRatio) {
  const canvasRatio = CANVAS_W / CANVAS_H;
  const imgRatio = img.width / img.height;
  let drawW, drawH;
  if (imgRatio > canvasRatio) {
    drawH = CANVAS_H * scale;
    drawW = drawH * imgRatio;
  } else {
    drawW = CANVAS_W * scale;
    drawH = drawW / imgRatio;
  }
  const maxOffsetX = (drawW - CANVAS_W) / 2;
  const maxOffsetY = (drawH - CANVAS_H) / 2;
  const dx = -drawW / 2 + CANVAS_W / 2 + offsetXRatio * maxOffsetX;
  const dy = -drawH / 2 + CANVAS_H / 2 + offsetYRatio * maxOffsetY;
  ctx.drawImage(img, dx, dy, drawW, drawH);
}

function kenBurnsFrame(ctx, img, tRatio, variant) {
  const zoomIn = variant % 2 === 0;
  const scale = zoomIn ? 1.0 + 0.15 * tRatio : 1.15 - 0.15 * tRatio;
  const panX = (variant % 4 < 2 ? 1 : -1) * 0.06 * tRatio;
  const panY = (variant % 3 === 0 ? 1 : -1) * 0.04 * tRatio;
  drawCover(ctx, img, scale, panX, panY);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawCaption(ctx, text, elapsedInPhoto) {
  if (!text) return;
  const alpha = Math.min(1, elapsedInPhoto / 0.4);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = 'bold 40px system-ui, sans-serif';
  ctx.textAlign = 'center';
  const metrics = ctx.measureText(text);
  const paddingX = 30, paddingY = 18;
  const boxW = metrics.width + paddingX * 2;
  const boxH = 40 + paddingY * 2 - 10;
  const boxX = CANVAS_W / 2 - boxW / 2;
  const boxY = CANVAS_H - 120;
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  roundRect(ctx, boxX, boxY, boxW, boxH, 12);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillText(text, CANVAS_W / 2, boxY + boxH / 2 + 14);
  ctx.restore();
}

function drawSegment(ctx, idx, localT, transitionType, tDur) {
  const p = photos[idx];
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  const isTransitioningOut = tDur > 0 && idx < photos.length - 1 && localT > p.duration - tDur;

  if (isTransitioningOut) {
    const next = photos[idx + 1];
    const transProgress = Math.min(1, (localT - (p.duration - tDur)) / tDur);

    kenBurnsFrame(ctx, p.img, Math.min(1, localT / p.duration), idx);
    drawCaption(ctx, p.caption, localT);

    ctx.save();
    if (transitionType === 'fade') {
      ctx.globalAlpha = transProgress;
      kenBurnsFrame(ctx, next.img, 0, idx + 1);
      if (next.caption) drawCaption(ctx, next.caption, 0);
    } else if (transitionType === 'slide') {
      ctx.beginPath();
      ctx.rect(CANVAS_W * (1 - transProgress), 0, CANVAS_W * transProgress, CANVAS_H);
      ctx.clip();
      ctx.translate(CANVAS_W * (1 - transProgress), 0);
      kenBurnsFrame(ctx, next.img, 0, idx + 1);
    }
    ctx.restore();
  } else {
    kenBurnsFrame(ctx, p.img, Math.min(1, localT / p.duration), idx);
    drawCaption(ctx, p.caption, localT);
  }
}

async function generateVideo() {
  if (!photos.length) return;
  els.generateBtn.disabled = true;
  els.resultWrap.style.display = 'none';
  els.progressWrap.style.display = 'block';
  els.progressBar.style.width = '0%';
  els.progressText.textContent = 'Rendering... 0%';

  const canvas = els.canvas;
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext('2d');

  const transitionType = els.transition.value;
  const tDur = transitionType === 'none' ? 0 : TRANSITION_DUR;
  const totalDuration = photos.reduce((s, p) => s + p.duration, 0);

  let audioEl = null;
  let audioTracks = [];
  if (musicFile) {
    audioEl = new Audio(URL.createObjectURL(musicFile));
    audioEl.loop = true;
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaElementSource(audioEl);
    const destNode = audioCtx.createMediaStreamDestination();
    source.connect(destNode);
    source.connect(audioCtx.destination);
    audioTracks = destNode.stream.getAudioTracks();
  }

  const videoStream = canvas.captureStream(FPS);
  const combined = new MediaStream([...videoStream.getVideoTracks(), ...audioTracks]);

  const mimeType = pickMimeType();
  const recorder = new MediaRecorder(combined, mimeType ? { mimeType } : undefined);
  const chunks = [];
  recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };

  const stopped = new Promise(resolve => { recorder.onstop = resolve; });

  recorder.start();
  if (audioEl) {
    try { await audioEl.play(); } catch (err) { /* autoplay blocked, continue silently */ }
  }

  const startTime = performance.now();

  function render() {
    const elapsed = (performance.now() - startTime) / 1000;

    if (elapsed >= totalDuration) {
      drawSegment(ctx, photos.length - 1, photos[photos.length - 1].duration, transitionType, tDur);
      finish();
      return;
    }

    let acc = 0, idx = 0, localT = 0;
    for (let i = 0; i < photos.length; i++) {
      if (elapsed < acc + photos[i].duration) {
        idx = i;
        localT = elapsed - acc;
        break;
      }
      acc += photos[i].duration;
    }
    drawSegment(ctx, idx, localT, transitionType, tDur);

    const pct = Math.min(100, Math.round((elapsed / totalDuration) * 100));
    els.progressBar.style.width = pct + '%';
    els.progressText.textContent = `Rendering... ${pct}%`;

    requestAnimationFrame(render);
  }

  function finish() {
    recorder.stop();
    if (audioEl) audioEl.pause();
    stopped.then(() => {
      const blob = new Blob(chunks, { type: mimeType || 'video/webm' });
      const url = URL.createObjectURL(blob);
      els.progressWrap.style.display = 'none';
      els.resultWrap.style.display = 'flex';
      els.resultVideo.src = url;
      const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
      els.downloadLink.href = url;
      els.downloadLink.download = `photo-video.${ext}`;
      els.generateBtn.disabled = false;
    });
  }

  requestAnimationFrame(render);
}
