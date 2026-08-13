/* =========================================================
   🔊 GLOBAL AUDIO ENGINE (shared across app)
========================================================= */

window.AudioEngine = {
  slow: false,
  repeat: 2,
  _utterance: null, // kept as a live reference — Safari/WebKit can silently
                     // garbage-collect an utterance before it fires otherwise

  speak(text, options = {}){
    if(!("speechSynthesis" in window)) return;

    const clean = (text || "").trim();
    if(!clean) return;

    const slow = options.slow ?? this.slow;
    const repeat = options.repeat ?? this.repeat;

    const speakOnce = (rate=1)=>{
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = "ko-KR";

      const voices = speechSynthesis.getVoices();
      const ko = voices.find(v => v.lang && v.lang.includes("ko"));

      if(ko) u.voice = ko;

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
