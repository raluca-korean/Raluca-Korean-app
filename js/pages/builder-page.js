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
col.dataset.type = part.type;     // 🔥 subject / verb / place / object
col.dataset.value = value.ko;     // 🔥 cuvântul coreean
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

function attachPressHandlers(table){

  const columns = table.querySelectorAll(".col");

  columns.forEach(col => {

    col.addEventListener("click", () => {

      const type = col.dataset.type;     // 🔥 trebuie să existe
      const value = col.dataset.value;   // 🔥 trebuie să existe

      if(!type || !value){
        console.log("LIPSEȘTE DATASET", col);
        return;
      }

      updateSentence(type, value);  // 🔥 AICI SE REZOLVĂ TOT

    });

  });

}
