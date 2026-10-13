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

  speak(text, options = {}){
    if(!("speechSynthesis" in window)) return;

    const clean = (text || "").trim();
    if(!clean) return;

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
      if(options.onend) u.onend = options.onend;
      this._utterance = u;
      speechSynthesis.speak(u);
    };

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

      let i = 1;
      const interval = setInterval(()=>{
        if(myToken !== this._token || i >= repeat){
          clearInterval(interval);
          return;
        }
        speakOnce();
        i++;
      }, 900);
    }, 30);
  }
};
