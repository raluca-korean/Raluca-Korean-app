/* =========================================================
   🔊 GLOBAL AUDIO ENGINE (shared across app)
========================================================= */

window.AudioEngine = {
  slow: false,
  repeat: 2,

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
      speechSynthesis.speak(u);
    };

    speechSynthesis.cancel();

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
  }
};
