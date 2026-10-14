/* =========================================================
   🔊 GLOBAL AUDIO ENGINE (shared across app)
========================================================= */

window.AudioEngine = {
  slow: false,
  repeat: 1,
  _utterance: null, // kept as a live reference — Safari/WebKit can silently
                     // garbage-collect an utterance before it fires otherwise

  _pickKoreanVoice(){
    const voices = speechSynthesis.getVoices();
    const ko = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith("ko"));
    if(!ko.length) return null;
    // Prefer whichever installed voice is the higher-quality one — plain
    // lang-match alone often grabs a robotic default over a better voice
    // the OS also offers (iOS "Enhanced/Premium" Siri voices, Chrome's
    // network-backed "Google" voice, Edge's "Online (Natural)" voices).
    const score = v => {
      const n = (v.name || "").toLowerCase();
      let s = 0;
      if(n.includes("enhanced") || n.includes("premium")) s += 3;
      if(n.includes("neural") || n.includes("natural")) s += 3;
      if(n.includes("google")) s += 2;
      if(!v.localService) s += 1;
      return s;
    };
    return ko.slice().sort((a, b) => score(b) - score(a))[0];
  },

  // Browsers (Chrome, Safari/iOS) silently drop speechSynthesis.speak() until the
  // user has touched the page — and a link click on the previous page doesn't
  // count. So an auto-played first prompt (e.g. exercises.html question 1) would
  // be lost. Instead it waits here and plays on the first tap, unless that tap
  // already triggers its own speak() call.
  _pending: null,
  _gateReady: false,
  _hasActivation(){
    const ua = navigator.userActivation;
    return ua ? ua.hasBeenActive : this._gateReady;
  },
  _initGate(){
    if(this._gateInit) return;
    this._gateInit = true;
    const onGesture = ()=>{
      this._gateReady = true;
      // Let the tap's own click handlers run first: if they speak, _pending is cleared.
      setTimeout(()=>{
        const p = this._pending;
        this._pending = null;
        this._hideHint();
        if(p) this.speak(p.text, p.options);
      }, 0);
      ["click","keydown","touchend"].forEach(ev => window.removeEventListener(ev, onGesture, true));
    };
    ["click","keydown","touchend"].forEach(ev => window.addEventListener(ev, onGesture, true));
  },
  _showHint(){
    if(this._hintEl || !document.body) return;
    const ro = (localStorage.getItem("RK_LANG") || "ro") !== "en";
    const el = document.createElement("div");
    el.setAttribute("role", "status");
    el.textContent = ro ? "🔊 Atinge ecranul ca să auzi pronunția" : "🔊 Tap the screen to hear the audio";
    el.style.cssText = "position:fixed;left:50%;top:calc(12px + env(safe-area-inset-top));transform:translateX(-50%);white-space:nowrap;" +
      "z-index:99998;background:rgba(24,29,50,.92);color:#fff;font:700 13px/1.3 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;" +
      "padding:10px 16px;border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,.25);pointer-events:none;max-width:90vw;text-align:center";
    document.body.appendChild(el);
    this._hintEl = el;
    setTimeout(()=>this._hideHint(), 5000);
  },
  _hideHint(){
    if(this._hintEl){ this._hintEl.remove(); this._hintEl = null; }
  },

  speak(text, options = {}){
    if(!("speechSynthesis" in window)) return;

    const clean = (text || "").trim();
    if(!clean) return;

    this._initGate();
    this._pending = null;
    if(!this._hasActivation()){
      this._pending = { text: clean, options };
      this._showHint();
      return;
    }

    // First call after load: Chrome fills the voice list asynchronously, so wait
    // briefly for it instead of speaking with the default (often non-Korean) voice.
    if(!speechSynthesis.getVoices().length && !options._waited){
      let done = false;
      const go = ()=>{ if(done) return; done = true; speechSynthesis.removeEventListener && speechSynthesis.removeEventListener("voiceschanged", go); this.speak(clean, Object.assign({}, options, { _waited: true })); };
      if(speechSynthesis.addEventListener) speechSynthesis.addEventListener("voiceschanged", go);
      setTimeout(go, 700);
      return;
    }

    const slow = options.slow ?? this.slow;
    const repeat = options.repeat ?? this.repeat;
    const rate = options.rate ?? (slow ? 0.7 : 1);
    const voice = this._pickKoreanVoice();

    const speakOnce = ()=>{
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = "ko-KR";
      if(voice) u.voice = voice;
      u.rate = rate;
      if(options.onboundary) u.onboundary = options.onboundary;
      if(options.onend) u.onend = options.onend;
      this._utterance = u;
      speechSynthesis.speak(u);
    };

    speechSynthesis.cancel();

    // iOS Safari can silently drop a speak() call made in the same tick as
    // cancel() — queue it a beat later instead of calling it synchronously.
    setTimeout(() => {
      speakOnce();

      let i = 1;
      const interval = setInterval(()=>{
        if(i >= repeat){
          clearInterval(interval);
          return;
        }
        speakOnce();
        i++;
      }, 900);
    }, 30);
  }
};
