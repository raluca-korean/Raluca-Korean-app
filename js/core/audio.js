/* =========================================================
   🔊 GLOBAL AUDIO ENGINE (shared across app)
========================================================= */

window.AudioEngine = {
  slow: false,
  repeat: 1,
  _utterance: null, // kept as a live reference — Safari/WebKit can silently
                     // garbage-collect an utterance before it fires otherwise
  _token: 0,         // bumped on every speak() call; a delayed/repeat
                      // callback bails out once a newer call supersedes it
                      // (see speak() below — this is what the 30ms cancel-
                      // then-speak delay used to break on rapid repeat taps)

  // iPhone/iPad — iPadOS Safari reports itself as "Macintosh", so touch support
  // tells the two apart.
  _isIOS(){
    const ua = navigator.userAgent || "";
    return /iP(hone|ad|od)/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  },

  // Apple's novelty voices (Eddy, Flo, Grandma...) are listed for Korean too, and
  // on iOS they can be listed without being downloaded — assigning one gives silence.
  _NOVELTY: /\b(eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley|albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox)\b/i,

  _pickKoreanVoice(){
    // iOS: the most reliable path is lang="ko-KR" with no explicit voice — the OS
    // then uses the Korean voice chosen in Settings → Accessibility → Spoken
    // Content. An explicitly assigned voice object can play silently there.
    if(this._isIOS()) return null;
    const voices = speechSynthesis.getVoices();
    const ko = voices.filter(v => v.lang && v.lang.toLowerCase().replace("_","-").startsWith("ko") && !this._NOVELTY.test(v.name || ""));
    if(!ko.length) return null;
    // Prefer whichever installed voice is the higher-quality one — plain
    // lang-match alone often grabs a robotic default over a better voice
    // the OS also offers (Chrome's network-backed "Google" voice, Edge's
    // "Online (Natural)" voices).
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

  // Last utterance outcome, for the sound test page (sound-test.html).
  lastStatus: null,

  // Browsers (Chrome, Safari/iOS) silently drop speechSynthesis.speak() until the
  // user has touched the page — and a link click on the previous page doesn't
  // count. So an auto-played first prompt (e.g. exercises.html question 1) would
  // be lost. Instead it waits here and plays on the first tap, unless that tap
  // already triggers its own speak() call.
  _pending: null,
  _gateReady: false,
  _hasActivation(){
    if(this._gateReady) return true;
    const ua = navigator.userActivation;
    // isActive = a tap is happening right now; hasBeenActive alone is not trusted
    // until the gate has actually run once (iOS needs a speak() inside a tap).
    return ua ? (ua.isActive || (ua.hasBeenActive && !this._gateInit)) : false;
  },
  _initGate(){
    if(this._gateInit) return;
    this._gateInit = true;
    const onGesture = ()=>{
      this._gateReady = true;
      this._hideHint();
      // iOS Safari only lets speech start inside a touch/click, and only the first
      // speak() made inside the gesture unlocks the engine. So a waiting prompt is
      // spoken right here, synchronously; with nothing waiting, a silent utterance
      // does the unlocking. If the tap's own click handler then speaks, its speak()
      // simply cancels and replaces this one.
      const p = this._pending;
      this._pending = null;
      try {
        if(speechSynthesis.paused) speechSynthesis.resume();
        if(p){
          this.speak(p.text, p.options);
        } else {
          const u = new SpeechSynthesisUtterance(" ");
          u.volume = 0;
          speechSynthesis.speak(u);
        }
      } catch(e) {}
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

    // Chrome fills the voice list asynchronously; asking for it warms it up. We
    // don't wait for it: lang="ko-KR" still picks a Korean voice, and waiting would
    // move the speak() call outside the user's tap, which iOS Safari blocks.
    speechSynthesis.getVoices();
    // iOS Safari leaves the engine paused after the tab was in the background or
    // the screen locked — every later speak() then queues silently, forever.
    if(speechSynthesis.paused) speechSynthesis.resume();

    const slow = options.slow ?? this.slow;
    const repeat = options.repeat ?? this.repeat;
    const rate = options.rate ?? (slow ? 0.7 : 1);
    const voice = this._pickKoreanVoice();
    const myToken = ++this._token;

    const speakOnce = ()=>{
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = "ko-KR";
      if(voice) u.voice = voice;
      u.rate = rate;
      if(options.onboundary) u.onboundary = options.onboundary;
      u.onstart = ()=>{ this.lastStatus = "start"; };
      u.onend = (e)=>{ this.lastStatus = this.lastStatus === "start" ? "end" : "end-without-start"; if(options.onend) options.onend(e); };
      u.onerror = (e)=>{
        const err = (e && e.error) || "error";
        this.lastStatus = "error:" + err;
        // The browser refused speech outside a tap: wait for the next tap and say
        // it then (instead of staying silent for good).
        if(err === "not-allowed" && myToken === this._token){
          this._gateReady = false;
          this._gateInit = false;
          this._pending = { text: clean, options };
          this._initGate();
          this._showHint();
        }
        if(options.onerror) options.onerror(e);
      };
      this._utterance = u;
      speechSynthesis.speak(u);
    };

    const startRepeats = ()=>{
      let i = 1;
      const interval = setInterval(()=>{
        if(myToken !== this._token || i >= repeat){
          clearInterval(interval);
          return;
        }
        speakOnce();
        i++;
      }, 900);
    };

    // Nothing playing: speak right now, still inside the tap (needed on iOS).
    if(!speechSynthesis.speaking && !speechSynthesis.pending){
      speakOnce();
      startRepeats();
      return;
    }

    speechSynthesis.cancel();

    // iOS Safari can silently drop a speak() call made in the same tick as
    // cancel() — queue it a beat later instead of calling it synchronously.
    // That delay is exactly what broke rapid repeated taps: each speak()
    // used to schedule its own speakOnce() ~30ms later with no way to tell
    // whether a NEWER tap had since called cancel() again in between.
    // Tapping faster than 30ms apart left several delayed speakOnce() (and
    // their repeat intervals) firing on top of each other — overlapping or
    // truncated audio. myToken fixes that: the delayed callback (and every
    // repeat tick) bails out once a later speak() call has bumped _token,
    // so only the LAST tap in a rapid burst actually speaks.
    setTimeout(() => {
      if(myToken !== this._token) return;
      speakOnce();
      startRepeats();
    }, 30);
  }
};

// Listen for the first tap from page load on: if the gate were armed lazily inside
// the first speak() call, that same tap would not count yet on browsers without
// navigator.userActivation (older iOS Safari).
if ("speechSynthesis" in window) window.AudioEngine._initGate();
