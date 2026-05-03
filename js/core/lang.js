(function(){
  const ACTIVE_BG   = "linear-gradient(135deg,#f472b6,#a855f7,#6366f1)";
  const INACTIVE_BG = "linear-gradient(160deg,#fff,#fdf4ff)";
  const ACTIVE_SH   = "0 8px 20px rgba(168,85,247,.25)";
  const INACTIVE_SH = "0 4px 12px rgba(219,39,119,.10)";

  window.RKLang = {
    current: localStorage.getItem("RK_LANG") || "ro",

    updateButtons: function(){
      const ro = document.getElementById("langRo");
      const en = document.getElementById("langEn");
      if(!ro || !en) return;
      const isRo = this.current === "ro";
      ro.style.background = isRo ? ACTIVE_BG   : INACTIVE_BG;
      ro.style.color       = isRo ? "#fff"      : "var(--text)";
      ro.style.boxShadow   = isRo ? ACTIVE_SH   : INACTIVE_SH;
      en.style.background  = isRo ? INACTIVE_BG : ACTIVE_BG;
      en.style.color       = isRo ? "var(--text)": "#fff";
      en.style.boxShadow   = isRo ? INACTIVE_SH  : ACTIVE_SH;
    },

    set: function(lang){
      this.current = lang;
      localStorage.setItem("RK_LANG", lang);
      this.updateButtons();
    },

    init: function(onChange){
      this.updateButtons();
      const self = this;
      const ro = document.getElementById("langRo");
      const en = document.getElementById("langEn");
      if(ro) ro.addEventListener("click", function(){ self.set("ro"); if(onChange) onChange("ro"); });
      if(en) en.addEventListener("click", function(){ self.set("en"); if(onChange) onChange("en"); });
    }
  };
})();
