function buildNaturalRomanian(state, active){
  const use = (k) =>
    active?.[k] !== false &&
    (typeof isColumnVisible === "function" ? isColumnVisible(k) : true);

  const parts = [];

  const subjectKo = state.subject || "";
  const subjectRo = translations.subject?.[subjectKo] || "";

  let subjectText = subjectRo;
  if(state.subjectAdjs?.length && subjectText){
    subjectText = state.subjectAdjs.map(x => translations.subjectAdj?.[x] || x).join(" ") + " " + subjectText;
  }

  const timeRo = state.time ? (translations.time?.[state.time] || state.time) : "";
  const placeRo = state.place ? (translations.place?.[state.place] || state.place) : "";
 const modRo = state.mod ? (translations.mod?.[state.mod] || state.mod) : "";
  const objectRoBase = state.object ? (translations.object?.[state.object] || state.object) : "";
  const verbRoInf = state.verb ? (translations.verb?.[state.verb] || state.verb) : "";

  let objectText = objectRoBase;
  if(state.objectAdjs?.length && objectText){
    objectText = state.objectAdjs.map(x => translations.objectAdj?.[x] || x).join(" ") + " " + objectText;
  }

  if(use("time") && timeRo) parts.push(timeRo);
  if(use("subject") && subjectText && !state.hideSubject) parts.push(subjectText);
  if(use("place") && placeRo) parts.push(placeRo);
  if(use("object") && objectText) parts.push(objectText);
  if(use("mod") && modRo) parts.push(modRo);

  if(use("verb") || use("conjug")){
    const verbText = buildRoVerbPhrase(verbRoInf, state.conjug, subjectKo);
    if(verbText) parts.push(verbText);
  }

  return parts.join(" ").replace(/\s+/g, " ").trim();
}

/* =========================
   13) COLUMN UI
========================= */
function getColumnDisplayValue(state, key){
  if(key === "subject") return state.subject || "";
  if(key === "time") return state.time || "";
  if(key === "place") return state.place || "";
  if(key === "mod") return state.mod || "";
  if(key === "object") return state.object || "";
  if(key === "subjectAdj") return (state.subjectAdjs || []).join(", ");
  if(key === "objectAdj") return (state.objectAdjs || []).join(", ");
  if(key === "verb") return state.verb || "";
  if(key === "conjug") return state.conjug || "";
  if(key === "numeral") return state.numeral || "";
  if(key === "counter") return state.counter || "";
  return "";
}

function renderClauseRow(container, activeMap, state, clauseIndex){
  if(!container) return;

  container.innerHTML = "";

  columns.forEach(col => {
    if(isColumnVisible(col.key) === false) return;

    const colDiv = document.createElement("div");
    colDiv.className = "col";
    colDiv.dataset.key = col.key;
    colDiv.dataset.clauseIndex = clauseIndex;

    if(activeMap[col.key] === false){
      colDiv.classList.add("dimmed");
    }

    const header = document.createElement("div");
    header.className = "col-header";

    const title = document.createElement("span");
    title.textContent = col.title + (col.ko ? " (" + col.ko + ")" : "");
    header.appendChild(title);

    const toggle = document.createElement("input");
    toggle.type = "checkbox";
    toggle.className = "col-toggle";
    toggle.checked = activeMap[col.key] !== false;
    toggle.addEventListener("change", () => {
      activeMap[col.key] = toggle.checked;
      renderAll();
    });

    header.appendChild(toggle);
    colDiv.appendChild(header);

    const label = document.createElement("div");
    label.className = "col-body-label";
    label.textContent = col.hint || "";
    colDiv.appendChild(label);

    const main = document.createElement("div");
    main.className = "col-body-main";
    main.textContent = getColumnDisplayValue(state, col.key);
    colDiv.appendChild(main);

    const extra = document.createElement("div");
    extra.className = "col-body-extra";

    if(col.key === "conjug" && state?.[col.key] && isLinkingConj(state[col.key])){
      extra.textContent = "⭐ cere propoziția următoare";
    }

    colDiv.appendChild(extra);
    container.appendChild(colDiv);
  });
}

/* =========================
   14) TOGGLES
========================= */
function createToggleChips(){
  if(!DOM.togglesP1 || !DOM.togglesP2) return;

  DOM.togglesP1.innerHTML = "";
  DOM.togglesP2.innerHTML = "";

  const createFor = (wrapper, clauseIndex) => {
    columns.forEach(col => {
      const chip = document.createElement("label");
      chip.className = "chip";

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = actives[clauseIndex]?.[col.key] !== false;
      cb.dataset.key = col.key;
      cb.dataset.clauseIndex = String(clauseIndex);

      chip.appendChild(cb);
      chip.append(col.title);
      wrapper.appendChild(chip);
    });

    wrapper.addEventListener("change", (e) => {
      const cb = e.target;
      if(!cb || cb.tagName !== "INPUT") return;

      const key = cb.dataset.key;
      const idx = Number(cb.dataset.clauseIndex);

      if(!actives[idx]) return;

      actives[idx][key] = cb.checked;
      cb.parentElement.classList.toggle("chip-off", !cb.checked);
      renderAll();
    });

    $$("input[type='checkbox']", wrapper).forEach(cb => {
      cb.parentElement.classList.toggle("chip-off", !cb.checked);
    });
  };

  createFor(DOM.togglesP1, 0);
  createFor(DOM.togglesP2, 1);
}

/* =========================
   15) PANEL
========================= */
let panelClauseIndex = 0;
let panelKey = "subject";

function renderPanelList(col){
  if(!DOM.panelList) return;

  DOM.panelList.innerHTML = "";

  const key = col.key;
  const map = translations[key] || {};
  const filter = (DOM.panelSearchInput?.value || "").trim().toLowerCase();

  const words = col.data.filter(w => {
    if(!w) return false;
    if(!filter) return true;
    return w.toLowerCase().startsWith(filter);
  });

  if(!words.length){
    const empty = document.createElement("div");
    empty.className = "panel-item";
    empty.textContent = "Nu există cuvinte pentru filtrul introdus.";
    DOM.panelList.appendChild(empty);
    return;
  }

  words.forEach(word => {
    const item = document.createElement("div");
    item.className = "panel-item";

    const main = document.createElement("div");
    main.className = "panel-item-main";
    main.textContent = word;
    item.appendChild(main);

    const extra = document.createElement("div");
    extra.className = "panel-item-extra";

    const ro = map[word];
    if(ro){
      const tag = document.createElement("div");
      tag.className = "panel-item-tag";
      tag.textContent = ro;
      extra.appendChild(tag);
    }

    if(key === "conjug" && isLinkingConj(word)){
      const star = document.createElement("div");
      star.className = "panel-item-tag";
      star.textContent = "⭐ P2";
      extra.appendChild(star);
    }

    item.appendChild(extra);

    if(key === "subject"){
      const addBtn = document.createElement("button");
      addBtn.textContent = "➕";
      addBtn.className = "panel-add-btn";
      addBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if(!sentences[panelClauseIndex].subjects){
          sentences[panelClauseIndex].subjects = [];
        }
        if(!sentences[panelClauseIndex].subjects.includes(word)){
          sentences[panelClauseIndex].subjects.push(word);
        }
        hide(DOM.overlay);
        renderAll();
      });
      item.appendChild(addBtn);
    }

    if(key === "subjectAdj"){
      const addBtn = document.createElement("button");
      addBtn.textContent = "➕";
      addBtn.className = "panel-add-btn";
      addBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if(!sentences[panelClauseIndex].subjectAdjs){
          sentences[panelClauseIndex].subjectAdjs = [];
        }
        if(!sentences[panelClauseIndex].subjectAdjs.includes(word)){
          sentences[panelClauseIndex].subjectAdjs.push(word);
        }
        hide(DOM.overlay);
        renderAll();
      });
      item.appendChild(addBtn);
    }

    if(key === "objectAdj"){
      const addBtn = document.createElement("button");
      addBtn.textContent = "➕";
      addBtn.className = "panel-add-btn";
      addBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if(!sentences[panelClauseIndex].objectAdjs){
          sentences[panelClauseIndex].objectAdjs = [];
        }
        if(!sentences[panelClauseIndex].objectAdjs.includes(word)){
          sentences[panelClauseIndex].objectAdjs.push(word);
        }
        hide(DOM.overlay);
        renderAll();
      });
      item.appendChild(addBtn);
    }

    item.addEventListener("click", () => {
      if(!sentences[panelClauseIndex]){
        sentences[panelClauseIndex] = makeEmptySentence();
        actives[panelClauseIndex] = makeAllActive();
      }

      sentences[panelClauseIndex][key] = word;

      if(key === "conjug" && isLinkingConj(word)){
        showExtraClauses = true;
        ensureLinkedSentences();
      }

      hide(DOM.overlay);
      renderAll();
    });

    DOM.panelList.appendChild(item);
  });
}

function openPanel(clauseIndex, key){
  panelClauseIndex = clauseIndex;
  panelKey = key;

  const col = columns.find(c => c.key === key);
  if(!col) return;

  if(DOM.panelTitle) DOM.panelTitle.textContent = `Propoziția ${clauseIndex + 1} – ${col.title}`;
  if(DOM.panelSub) DOM.panelSub.textContent = col.hint || "";
  if(DOM.panelSearchInput) DOM.panelSearchInput.value = "";
  if(DOM.newWordInput) DOM.newWordInput.value = "";
  if(DOM.newWordTransInput) DOM.newWordTransInput.value = "";

  renderPanelList(col);
  show(DOM.overlay);
  DOM.panelSearchInput?.focus();
}

/* =========================
   16) PRESS HANDLERS
========================= */
function cycleColumnValue(clauseIndex, key){
  const col = columns.find(c => c.key === key);
  if(!col) return;

  const arr = col.data;
  const state = sentences[clauseIndex];
  if(!state) return;

  const cur = state[key];
  let idx = arr.indexOf(cur);
  if(idx === -1) idx = 0;

  const nextIdx = (idx + 1) % arr.length;
  state[key] = arr[nextIdx] || "";

  if(key === "conjug" && isLinkingConj(state[key])){
    ensureLinkedSentences();
    if(DOM.enableP2){
      DOM.enableP2.checked = true;
      DOM.enableP2.dispatchEvent(new Event("change"));
    }
  }

  renderAll();
}

function attachPressHandlers(tableEl, clauseIndex){
  if(!tableEl) return;

  let longPressTimer = null;
  let pressTarget = null;

  tableEl.addEventListener("pointerdown", (e) => {
    const colDiv = e.target.closest(".col");
    if(!colDiv) return;
    if(e.target && e.target.matches("input.col-toggle")) return;

    e.preventDefault();
    pressTarget = colDiv;

    longPressTimer = setTimeout(() => {
      if(pressTarget === colDiv){
        openPanel(clauseIndex, colDiv.dataset.key);
        pressTarget = null;
      }
    }, 450);
  });

  tableEl.addEventListener("pointerup", (e) => {
    const colDiv = e.target.closest(".col");

    if(e.target && e.target.matches("input.col-toggle")){
      if(longPressTimer) clearTimeout(longPressTimer);
      longPressTimer = null;
      pressTarget = null;
      return;
    }

    if(longPressTimer) clearTimeout(longPressTimer);
    longPressTimer = null;

    if(pressTarget && colDiv === pressTarget){
      cycleColumnValue(clauseIndex, colDiv.dataset.key);
    }

    pressTarget = null;
  });

  tableEl.addEventListener("pointerleave", () => {
    if(longPressTimer) clearTimeout(longPressTimer);
    longPressTimer = null;
    pressTarget = null;
  });
}

/* =========================
   17) FAVORITES / AUDIO
========================= */
const favorites = [];

function renderFavorites(){
  if(!DOM.favoritesListEl) return;

  DOM.favoritesListEl.innerHTML = "";

  if(!favorites.length){
    const div = document.createElement("div");
    div.className = "small-label";
    div.textContent = "Nu ai salvat încă nicio propoziție.";
    DOM.favoritesListEl.appendChild(div);
    return;
  }

  favorites.forEach(f => {
    const item = document.createElement("div");
    item.className = "fav-item";

    const ko = document.createElement("div");
    ko.className = "fav-ko";
    ko.textContent = f.ko;

    const ro = document.createElement("div");
    ro.className = "fav-ro";
    ro.textContent = f.ro;

    item.appendChild(ko);
    item.appendChild(ro);
    DOM.favoritesListEl.appendChild(item);
  });
}

function speakKorean(textToSpeak){
  if(!("speechSynthesis" in window)) return;

  const t = (textToSpeak || "").trim();
  if(!t) return;

  const u = new SpeechSynthesisUtterance(t);
  u.lang = "ko-KR";

  const voices = window.speechSynthesis.getVoices();
  const koVoices = voices.filter(v => (v.lang || "").toLowerCase().startsWith("ko"));
  if(koVoices.length) u.voice = koVoices[0];

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

/* =========================
   18) PARSER RO / EN
========================= */
function stripDiacritics(s){
  return (s || "")
    .replace(/ă/g, "a").replace(/â/g, "a").replace(/î/g, "i")
    .replace(/ș/g, "s").replace(/ş/g, "s")
    .replace(/ț/g, "t").replace(/ţ/g, "t");
}

function normRo(s){
  return stripDiacritics(
    (s || "")
      .toLowerCase()
      .replace(/[.,!?;:()[\]"]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

const SEMANTIC_MAP = {
  "consume":"먹다","drink":"마시다","study":"공부하다","learn":"배우다","buy":"사다",
  "walk":"걷다","run":"달리다","go":"가다","come":"오다","read":"읽다","write":"쓰다",
  "eat":"먹다","merge":"가다","veni":"오다","citi":"읽다","scrie":"쓰다","bea":"마시다","manca":"먹다"
};

function normalizeVerbForms(text){
  let t = normRo(text);

  const EN_MAP = {
    "going":"go","went":"go","gone":"go",
    "comes":"come","coming":"come","came":"come",
    "eating":"eat","ate":"eat",
    "drinking":"drink","drank":"drink",
    "reading":"read","writing":"write","wrote":"write",
    "studying":"study","studied":"study",
    "learning":"learn","learned":"learn",
    "bought":"buy","buying":"buy",
    "walking":"walk","walked":"walk",
    "running":"run","ran":"run"
  };

  Object.entries(EN_MAP).forEach(([k,v])=>{
    t = t.replace(new RegExp(`\\b${k}\\b`, "g"), v);
  });

  const RO_MAP = {
    "merg":"merge","mergi":"merge","mergeam":"merge","mergeai":"merge","mergea":"merge","mergeau":"merge","mergem":"merge","mergeti":"merge","mergeți":"merge",
    "vin":"veni","vii":"veni","vine":"veni","veneam":"veni","venea":"veni","veneau":"veni","venim":"veni","veniti":"veni","veniți":"veni",
    "mananc":"manca","mănânc":"manca","mananci":"manca","mănânci":"manca","manca":"manca","mancam":"manca","mâncam":"manca","mancati":"manca","mâncați":"manca",
    "beau":"bea","bei":"bea","bea":"bea","beam":"bea","beti":"bea","beți":"bea",
    "citesc":"citi","citesti":"citi","citești":"citi","citeste":"citi","citește":"citi","citeam":"citi","citea":"citi","citim":"citi","cititi":"citi","citiți":"citi",
    "scriu":"scrie","scrii":"scrie","scrie":"scrie","scriam":"scrie","scria":"scrie","scriem":"scrie","scrieti":"scrie","scrieți":"scrie"
  };

  Object.entries(RO_MAP).forEach(([k,v])=>{
    t = t.replace(new RegExp(`\\b${k}\\b`, "g"), v);
  });

  return t;
}

function detectImplicitSubject(text){
  const t = normalizeVerbForms(text);

  if(/\bmerg\b|\bfac\b|\bmanca\b|\bbea\b|\bciti\b|\bscrie\b|\bvreau\b|\bpot\b/.test(t)) return "저";
  if(/\bmergi\b|\bfaci\b/.test(t)) return "너";
  if(/\bmergem\b|\bfacem\b/.test(t)) return "우리";

  return "";
}

function detectTense(text){
  const t = normalizeVerbForms(text);

  if(/\bieri\b|\byesterday\b|\bmergeam\b|\bveneam\b|\bciteam\b|\bscriam\b|\bmancam\b|\bbeam\b/.test(t)) return "past";
  if(/\bmaine\b|\bmâine\b|\btomorrow\b|\bvoi\b|\bwill\b/.test(t)) return "future";

  return "present";
}

function detectInputLang(text){
  const t = normRo(text);

  const enHints = [" and "," but "," because "," after "," before "," while "," i "," we "," you "," they "," he "," she "];
  const roHints = [" si "," și "," dar "," pentru ca "," pentru că "," dupa "," după "," eu "," noi "," tu "," ei "," ea "];

  let enScore = 0;
  let roScore = 0;

  enHints.forEach(x => {
    if((" " + t + " ").includes(normRo(x))) enScore++;
  });

  roHints.forEach(x => {
    if((" " + t + " ").includes(normRo(x))) roScore++;
  });

  return enScore > roScore ? "en" : "ro";
}

function buildVocabIndex(vocab){
  const index = {};

  const KEY_MAP = {
    subjects:"subject",
    objects:"object",
    verbs:"verb",
    times:"time",
    time:"time",
    places:"place",
    modifiers:"mod",
    subjectAdjectives:"subjectAdj",
    objectAdjectives:"objectAdj",
    adjectives:"objectAdj",
    adverbs:"mod",
    grammar:"conjug",
    conjugations:"conjug",
    connectors:"conjug",
    nouns:"object"
  };

  Object.entries(vocab || {}).forEach(([category, list])=>{
    if(!Array.isArray(list)) return;

    const normalized = KEY_MAP[category] || category;

    if(!index[normalized]) index[normalized] = {};

    list.forEach(entry=>{
      if(!entry || !entry.ko) return;

      const ko = entry.ko.trim();

      if(entry.ro){
        const ro = normRo(entry.ro);
        if(ro) index[normalized][ro] = ko;
      }

      if(entry.en){
        const en = normRo(entry.en);
        if(en) index[normalized][en] = ko;
      }
    });
  });

  Object.entries(SEMANTIC_MAP).forEach(([k,v])=>{
    if(!index.verb) index.verb = {};
    index.verb[normRo(k)] = v;
  });

  return index;
}

function findMatchesAdvanced(text, category){
  const results = [];
  const dict = VOCAB_INDEX[category] || {};
  const clean = normalizeVerbForms(text);

  Object.entries(dict)
    .sort((a,b) => b[0].length - a[0].length)
    .forEach(([key,ko])=>{
      const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${safeKey}\\b`, "g");

      if(regex.test(clean) && !results.includes(ko)){
        results.push(ko);
      }
    });

  return results;
}

function splitInputClauses(text){
  const clean = normRo(text);

  return clean
    .split(/\b(dupa ce|după ce|inainte|înainte|pentru ca|pentru că|ca sa|ca să|si|și|dar|apoi|and|but|then|after|before|because|while)\b/)
    .map(s => normRo(s))
    .filter(Boolean)
    .filter(s => ![
      "si","și","dar","apoi","dupa ce","după ce","inainte","înainte",
      "pentru ca","pentru că","ca sa","ca să",
      "and","but","then","after","before","because","while"
    ].includes(s));
}

function detectConjFromText(chunk){
  const t = normalizeVerbForms(chunk);

  if(/\bdupa ce\b|\bdupă ce\b|\bafter\b/.test(t)) return "-고 나서";
  if(/\binainte\b|\bînainte\b|\bbefore\b/.test(t)) return "-기 전에";
  if(/\bin timp ce\b|\bwhile\b/.test(t)) return "-(으)면서";
  if(/\bpentru ca\b|\bpentru că\b|\bbecause\b/.test(t)) return "-기 때문에";
  if(/\bca sa\b|\bca să\b|\bin order to\b/.test(t)) return "-고자 하다";
  if(/\bvreau sa\b|\bvreau să\b/.test(t)) return "-고 싶어요";
  if(/\btrebuie sa\b|\btrebuie să\b|\bmust\b/.test(t)) return "-아/어야 돼요";
  if(/\bnu pot sa\b|\bnu pot să\b|\bcannot\b|\bcan't\b/.test(t)) return "-(으)ㄹ 수 없어요";
  if(/\bpot sa\b|\bpot să\b|\bcan\b/.test(t)) return "-(으)ㄹ 수 있어요";

  const tense = detectTense(t);
  if(tense === "past") return "-았어요/었어요";
  if(tense === "future") return "-(으)ㄹ 거예요";

  return "-아요/어요";
}

function buildSentenceFromChunk(chunk){
  const s = makeEmptySentence();
  const clean = normalizeVerbForms(chunk);

  const subjectMatches = findMatchesAdvanced(clean, "subject");
  if(subjectMatches.length){
    s.subject = subjectMatches[0];
    s.subjects = [...subjectMatches];
  } else {
    const implicit = detectImplicitSubject(clean);
    if(implicit){
      s.subject = implicit;
      s.subjects = [implicit];
    }
  }

  const timeMatches = findMatchesAdvanced(clean, "time");
  if(timeMatches.length){
    s.time = timeMatches[0];
    s.times = [...timeMatches];
  }

  const placeMatches = findMatchesAdvanced(clean, "place");
  if(placeMatches.length){
    s.place = placeMatches[0];
    s.places = [...placeMatches];
  }

  const objectMatches = findMatchesAdvanced(clean, "object");
  if(objectMatches.length){
    s.object = objectMatches[0];
    s.objects = [...objectMatches];
  }

  const objectAdjMatches = findMatchesAdvanced(clean, "objectAdj");
  if(objectAdjMatches.length){
    s.objectAdjs = [...objectAdjMatches];
  }

  const subjectAdjMatches = findMatchesAdvanced(clean, "subjectAdj");
  if(subjectAdjMatches.length){
    s.subjectAdjs = [...subjectAdjMatches];
  }

  const modMatches = findMatchesAdvanced(clean, "mod");
  if(modMatches.length){
    s.mod = modMatches[0];
    s.mods = [...modMatches];
  }

  const verbMatches = findMatchesAdvanced(clean, "verb");
  if(verbMatches.length){
    s.verb = verbMatches[0];
    s.verbs = [...verbMatches];
  }

  const grammarMatches = findMatchesAdvanced(clean, "conjug");
  if(grammarMatches.length){
    s.conjug = grammarMatches[0];
  } else {
    s.conjug = detectConjFromText(clean);
  }

  if(s.conjug === "-기 때문에" || /\bpentru ca\b|\bpentru că\b|\bbecause\b/.test(clean)){
    s.reason = true;
  }

  if(s.conjug === "-면" || /\bdaca\b|\bdacă\b|\bif\b/.test(clean)){
    s.condition = true;
  }

  if(/\bdar\b|\bbut\b/.test(clean)){
    s.contrast = true;
  }

  if(/\bdupa\b|\bdupă\b|\bafter\b/.test(clean)){
    s.sequence = true;
  }

  return s;
}

function translateRoToKo(text){
  const lang = detectInputLang(text);
  const parts = splitInputClauses(text);

  sentences = [];
  actives = [];

  parts.forEach(chunk=>{
    const s = buildSentenceFromChunk(chunk);
    sentences.push(s);
    actives.push(makeAllActive());
  });

  if(!sentences.length){
    sentences = [makeEmptySentence()];
    actives = [makeAllActive()];
  }

  showExtraClauses = sentences.length > 1;

  renderAll();

  return {
    lang,
    ko: buildComplexSentence(),
    roFixed: buildFullRomanian()
  };
}

/* =========================
   19) LINKING / COMPLEX SENTENCES
========================= */
const linkingConjugations = new Set([
  "-고","-고 나서","-기 전에","-(으)면서","-(으)며",
  "-(으)나","-(으)므로","-(으)ㄴ/는 만큼","-(으)ㄹ수록",
  "-(으)ㄴ/는데도","-(으)ㄹ지라도","-(으)ㄴ/는 반면에",
  "-도록 하다","-기에","-길래","-고 말다","-고자 하다"
]);

function isLinkingConj(v){
  return linkingConjugations.has(v);
}

function ensureLinkedSentences(){
  if(!Array.isArray(sentences)) sentences = [makeEmptySentence()];
  if(!Array.isArray(actives)) actives = [makeAllActive()];

  let requiredLength = 1;

  for(let i = 0; i < sentences.length; i++){
    const conj = sentences[i]?.conjug || "";
    if(isLinkingConj(conj)){
      requiredLength = Math.max(requiredLength, i + 2);
    }
  }

  while(sentences.length < requiredLength){
    sentences.push(makeEmptySentence());
  }

  while(actives.length < requiredLength){
    actives.push(makeAllActive());
  }

  showExtraClauses = requiredLength > 1;
}

function detectRelation(a,b){
  if(a.time && b.time) return "sequence";
  if(a.object && b.object && a.verb !== b.verb) return "contrast";
  if(a.reason) return "cause";
  if(a.condition) return "condition";
  if(a.verb === b.verb) return "parallel";
  return "background";
}

function pickAdvancedConnector(a,b){
  if(a.conjug && isLinkingConj(a.conjug)) return a.conjug;

  const relation = detectRelation(a,b);

  if(relation === "sequence") return "-고 나서";
  if(relation === "contrast") return "-지만";
  if(relation === "cause") return "-기에";
  if(relation === "parallel") return "-(으)면서";
  if(relation === "condition") return "-(으)면";
  return "-고";
}

function transformVerbForConnector(verb, connector){
  if(!verb) return "";
  const stem = getVerbStem(verb);

  if(connector === "-고") return stem + "고";
  if(connector === "-고 나서") return stem + "고 나서";
  if(connector === "-기 전에") return stem + "기 전에";
  if(connector === "-(으)면서") return stem + "면서";
  if(connector === "-(으)며") return stem + "며";
  if(connector === "-지만") return stem + "지만";
  if(connector === "-기에") return stem + "기에";
  if(connector === "-길래") return stem + "길래";
  if(connector === "-고자 하다") return stem + "고자";
  if(connector === "-고 말다") return stem + "고 말고";
  if(connector === "-(으)면") return stem + "면";

  return stem + "고";
}

function applyConnector(sentence, connector){
  if(!sentence) return "";

  const match = sentence.match(/([가-힣]+(?:요|다))$/);
  if(!match) return sentence;

  const verbPart = match[0];
  const base = sentence.slice(0, -verbPart.length).trim();

  let sourceVerb = "";

  for(let i = verbs.length - 1; i >= 0; i--){
    const vb = verbs[i];
    if(
      verbPart === presentPolite(vb) ||
      verbPart === pastPolite(vb) ||
      verbPart === getVerbStem(vb) + "고 있어요" ||
      verbPart === getVerbStem(vb) + "고 싶어요"
    ){
      sourceVerb = vb;
      break;
    }
  }

  if(!sourceVerb){
    sourceVerb = verbPart.endsWith("요") ? verbPart.replace(/요$/, "다") : verbPart;
  }

  const transformed = transformVerbForConnector(sourceVerb, connector);
  return (base + " " + transformed).trim();
}

function buildComplexSentence(){
  if(!sentences.length) return "";

  let result = "";

  for(let i = 0; i < sentences.length; i++){
    const s = sentences[i];
    if(!s) continue;

    let clause = planKoreanSentence(s, actives[i]);
    if(!clause) continue;

    if(i < sentences.length - 1){
      const next = sentences[i + 1];
      const connector = pickAdvancedConnector(s, next);
      clause = applyConnector(clause, connector);
      result += clause + " ";
    } else {
      result += clause;
    }
  }

  return result.replace(/\s+/g," ").trim();
}

/* =========================
   20) PREVIEW / EXTRA
========================= */
function updateNaturalHint(textValue){
  if(!DOM.naturalHint) return;
  if(!textValue){
    DOM.naturalHint.textContent = "";
    return;
  }
  DOM.naturalHint.textContent = textValue.includes("고") ? "⭐ propoziție compusă" : "";
}

function updatePreviewCardState(){
  const card = document.querySelector(".preview-card");
  if(!card) return;

  const txt = DOM.previewKo?.textContent || "";
  if(txt && !txt.includes("alege")){
    card.classList.add("has-content");
  }else{
    card.classList.remove("has-content");
  }
}

function updatePreview(){
  if(!DOM.previewKo) return;

  normalizeSubjects();

  let ko = "";
  try{
    ko = buildComplexSentence();
  }catch(err){
    console.error("buildComplexSentence error:", err);
    ko = "";
  }

  DOM.previewKo.textContent = ko || "(alege cuvinte din tabel)";

  if(DOM.previewRo && showRo){
    DOM.previewRo.textContent = buildFullRomanian();
  }

  if(DOM.roInput){
    DOM.roInput.value = buildFullRomanian();
  }

  updateNaturalHint(ko);
  updatePreviewCardState();
}

function renderExtraClauses(){
  if(!DOM.extraClauses) return;

  DOM.extraClauses.innerHTML = "";

  for(let i = 2; i < sentences.length; i++){
    const wrapper = document.createElement("div");
    wrapper.className = "table-block";

    const title = document.createElement("div");
    title.className = "table-title";
    title.innerHTML = `<span>Propoziția ${i + 1}</span>`;
    wrapper.appendChild(title);

    const table = document.createElement("div");
    table.className = "table-horizontal";
    wrapper.appendChild(table);

    DOM.extraClauses.appendChild(wrapper);

    renderClauseRow(table, actives[i], sentences[i], i);
    attachPressHandlers(table, i);
  }
}

function buildFullRomanian(){
  const parts = [];

  let prevSubject = null;
  let prevTime = null;
  let prevPlace = null;

  for(let i = 0; i < sentences.length; i++){
    const s = sentences[i];
    if(!s) continue;

    const sameSubject = s.subject === prevSubject;
    const sameTime = s.time === prevTime;
    const samePlace = s.place === prevPlace;

    const hideSubject = i > 0 && sameSubject && sameTime && samePlace;

    let ro = buildNaturalRomanian(
      {...s, hideSubject},
      actives[i]
    );

    if(!ro) continue;

    if(isLinkingConj(s.conjug || "")){
      ro = ro.replace(/[.]$/, "");
    }

    parts.push(ro);

    prevSubject = s.subject || null;
    prevTime = s.time || null;
    prevPlace = s.place || null;
  }

  return parts.join(" ").replace(/\s+/g," ").replace(/și\s+și/g,"și").trim();
}

/* =========================
   21) MODEL NAV
========================= */
function loadModelRow(i){
  sentences.forEach(s=>{
    columns.forEach(col=>{
      if(!col.data.length) return;
      const value = col.data[i % col.data.length] || "";
      s[col.key] = value;
    });
  });
}

function updateModelNav(){
  if(DOM.pageInfoEl) DOM.pageInfoEl.textContent = `Rând model: ${indexModelRow + 1} / ${maxLen}`;
  if(DOM.prevBtn) DOM.prevBtn.disabled = indexModelRow === 0;
  if(DOM.nextBtn) DOM.nextBtn.disabled = indexModelRow === maxLen - 1;
}

/* =========================
   22) VOCAB LOADER
========================= */
async function loadVocabulary(){
  try{
    const res = await fetch("./data/vocab-korean.json");
    vocabJson = await res.json();

    VOCAB_INDEX = buildVocabIndex(vocabJson);

    const map = {
      subject:"subjects",
      object:"objects",
      verb:"verbs",
      time:"times",
      place:"places",
      mod:"modifiers",
      conjug:Array.isArray(vocabJson.conjugations) ? "conjugations" : "grammar",
      subjectAdj:"subjectAdjectives",
      objectAdj:"objectAdjectives"
    };

    Object.entries(map).forEach(([colKey, jsonKey])=>{
      const col = columns.find(c => c.key === colKey);
      const list = vocabJson[jsonKey];
      if(!col || !Array.isArray(list)) return;

      list.forEach(entry=>{
        if(!entry || !entry.ko) return;

        const word = entry.ko.trim();
        if(!word) return;

        if(!col.data.includes(word)){
          col.data.push(word);
        }

        if(!translations[colKey]) translations[colKey] = {};
        translations[colKey][word] = entry.ro || entry.en || "";
      });
    });

    console.log("VOCAB OK");
  }catch(err){
    console.error("Vocabulary load error:", err);
  }
}

/* =========================
   23) UI EVENTS
========================= */
function setupUI(){
  DOM.modeButtons.forEach(btn=>{
    on(btn, "click", ()=>{
      currentMode = btn.dataset.mode || "topik";
      DOM.modeButtons.forEach(b => b.classList.toggle("active", b === btn));
      renderAll();
    });
  });

  on(DOM.prevBtn, "click", ()=>{
    if(indexModelRow > 0){
      indexModelRow--;
      loadModelRow(indexModelRow);
      renderAll();
    }
  });

  on(DOM.nextBtn, "click", ()=>{
    if(indexModelRow < maxLen - 1){
      indexModelRow++;
      loadModelRow(indexModelRow);
      renderAll();
    }
  });

  on(DOM.resetBtn, "click", ()=>{
    actives = actives.map(() => makeAllActive());
    createToggleChips();
    renderAll();
  });

  on(DOM.toggleRoBtn, "click", ()=>{
    showRo = !showRo;
    if(DOM.toggleRoBtn){
      DOM.toggleRoBtn.textContent = showRo ? "Ascunde traducerea" : "Arată traducerea";
    }
    updatePreview();
  });

  on(DOM.randomBtn, "click", ()=>{
    const s = sentences[0];
    const a = actives[0];

    columns.forEach(col=>{
      if(!isColumnVisible(col.key)) return;
      if(a[col.key] === false) return;

      const arr = col.data.filter(Boolean);
      if(!arr.length) return;

      s[col.key] = arr[Math.floor(Math.random() * arr.length)];
    });

    renderAll();
  });

  on(DOM.speakBtn, "click", ()=>{
    const ko = (DOM.previewKo?.textContent || "").trim();
    if(!ko || ko.includes("alege")) return;
    speakKorean(ko);
  });

  on(DOM.favBtn, "click", ()=>{
    const ko = (DOM.previewKo?.textContent || "").trim();
    const ro = (DOM.previewRo?.textContent || "").trim();

    if(!ko || ko.includes("alege")) return;

    const exists = favorites.some(f => f.ko === ko);
    if(!exists) favorites.push({ko, ro});

    renderFavorites();
  });

  on(DOM.closePanelBtn, "click", ()=> hide(DOM.overlay));
  on(DOM.overlay, "click", (e)=>{
    if(e.target === DOM.overlay) hide(DOM.overlay);
  });

  on(DOM.panelSearchInput, "input", ()=>{
    const col = columns.find(c => c.key === panelKey);
    if(col) renderPanelList(col);
  });

  on(DOM.addWordBtn, "click", ()=>{
    const txt = (DOM.newWordInput?.value || "").trim();
    if(!txt) return;

    const roTxt = (DOM.newWordTransInput?.value || "").trim();
    const col = columns.find(c => c.key === panelKey);
    if(!col || !col.allowCustom) return;

    if(!col.data.includes(txt)) col.data.push(txt);
    if(!translations[panelKey]) translations[panelKey] = {};
    if(roTxt) translations[panelKey][txt] = roTxt;

    if(customData[panelKey]){
      customData[panelKey].push({word:txt, ro:roTxt});
      saveCustomData();
    }

    DOM.newWordInput.value = "";
    DOM.newWordTransInput.value = "";

    renderPanelList(col);
  });

  on(DOM.enableP2, "change", ()=>{
    const onOff = DOM.enableP2.checked;

    if(onOff && !sentences[1]){
      sentences[1] = makeEmptySentence();
      actives[1] = makeAllActive();
    }

    if(DOM.tableP2) onOff ? show(DOM.tableP2) : hide(DOM.tableP2);
    if(DOM.titleP2) onOff ? show(DOM.titleP2) : hide(DOM.titleP2);

    renderAll();
  });

  on(DOM.roTranslateBtn, "click", ()=>{
    const txt = (DOM.roInput?.value || "").trim();
    if(!txt) return;
    translateRoToKo(txt);
    updatePreview();
    if(DOM.roInput) DOM.roInput.value = buildFullRomanian();
  });

  on(DOM.refreshBtn, "click", ()=> location.reload());
  on(DOM.homeBtn, "click", ()=> { window.location.href = "index.html"; });
}

/* =========================
   24) RENDER ALL
========================= */
function renderAll(){
  ensureLinkedSentences();

  if(!sentences.length){
    sentences = [makeEmptySentence()];
    actives = [makeAllActive()];
  }

  if(DOM.tableP1){
    renderClauseRow(DOM.tableP1, actives[0], sentences[0], 0);
  }

  if(DOM.tableP2 && sentences[1]){
    if(showExtraClauses){
      show(DOM.tableP2);
      DOM.titleP2 && show(DOM.titleP2);
      renderClauseRow(DOM.tableP2, actives[1], sentences[1], 1);
    }else{
      hide(DOM.tableP2);
      DOM.titleP2 && hide(DOM.titleP2);
    }
  }

  renderExtraClauses();
  updateModelNav();
  updatePreview();
}

/* =========================
   25) BOOTSTRAP
========================= */
document.addEventListener("DOMContentLoaded", async () => {
  try{
    await loadVocabulary();

    sentences = [makeEmptySentence()];
    actives = [makeAllActive()];

    loadModelRow(indexModelRow);
    setupUI();
    createToggleChips();

    attachPressHandlers(DOM.tableP1, 0);
    attachPressHandlers(DOM.tableP2, 1);

    renderAll();
  }catch(err){
    console.error("APP BOOT ERROR", err);
  }
});
