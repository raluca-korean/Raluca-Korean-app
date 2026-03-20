document.addEventListener("DOMContentLoaded", async () => {

  await loadVocabulary();

  initBuilderPage();   // 🔥 ASTA E CHEIA

});

 
function initBuilderPage(){

  sentences = [ makeEmptySentence() ];
  actives = [ makeAllActive() ];

  loadModelRow(indexModelRow);

  setupUI();
  createToggleChips();

  attachPressHandlers(DOM.tableP1,0);
  attachPressHandlers(DOM.tableP2,1);

  renderAll();

}
console.log("VOCAB:", GLOBAL_VOCAB);
console.log("INDEX:", dictionaryIndex);
function loadModelRow(indexModelRow){

  const table = DOM.tableP1;
  table.innerHTML = "";

  const model = MODEL_ROWS[indexModelRow];

  model.parts.forEach(part => {

    const col = document.createElement("div");
    col.className = "col";

    let index = 0;

    function updateUI(){
      const value = part.values[index];

      col.textContent = value.ko;

      col.dataset.type = part.type;
      col.dataset.value = value.ko;
    }

    // click = NEXT WORD + updateSentence
    col.addEventListener("click", () => {

      index = (index + 1) % part.values.length;

      updateUI();

      updateSentence(part.type, col.dataset.value);

    });

    // LONG PRESS = list completă (opțional)
    col.addEventListener("contextmenu", (e) => {
      e.preventDefault();

      console.log("LISTĂ:", part.values);
      // aici poți deschide panelul tău existent
    });

    updateUI();
    table.appendChild(col);

  });

}
function updateSentence(key, value){

  const s = sentences[0];

  if(key === "place"){
    if(!s.places.includes(value)){
      s.places.push(value);
    }
  }

  else if(key === "object"){
    if(!s.objects.includes(value)){
      s.objects.push(value);
    }
  }

  else if(key === "verb"){
    if(!s.verbs.includes(value)){
      s.verbs.push(value);
    }
  }

  else if(key === "subject"){
    s.subject = value;
  }

  else if(key === "time"){
    s.time = value;
  }

  renderAll();
}

