/* =========================================================
   🔊 GLOBAL AUDIO ENGINE (shared across app)
========================================================= */

window.AudioEngine = {
  slow: false,
  repeat: 2,
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

  speak(text, options = {}){
    if(!("speechSynthesis" in window)) return;

    const clean = (text || "").trim();
    if(!clean) return;

    const slow = options.slow ?? this.slow;
    const repeat = options.repeat ?? this.repeat;
    const voice = this._pickKoreanVoice();

    const speakOnce = ()=>{
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = "ko-KR";
      if(voice) u.voice = voice;
      u.rate = slow ? 0.7 : 1;
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
