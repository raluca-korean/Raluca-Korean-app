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

  renderAll();
} 

function loadModelRow(indexModelRow){

  const table = DOM.tableP1;
  table.innerHTML = "";

  const model = MODEL_ROWS[indexModelRow];

  model.parts.forEach(part => {

    const col = document.createElement("div");
    col.className = "col";

    let index = 0;

    
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

  else {
    s[key] = value;
  }

  renderAll();
}
function buildTableFromVocab(){

  const table = DOM.tableP1;
  table.innerHTML = "";

  const map = {
    subject: subjects,
    time: times,
    place: places,
    object: objects,
    verb: verbs
  };

  Object.entries(map).forEach(([type, list]) => {

    if(!list || !list.length) return;

    const col = document.createElement("div");
    col.className = "col";

    let index = 0;

    function updateUI(){
      const word = list[index];
      col.textContent = word;
      col.dataset.type = type;
      col.dataset.value = word;
    }

    col.addEventListener("click", () => {

      index = (index + 1) % list.length;

      updateUI();

      updateSentence(type, list[index]); // 🔥 DIRECT, fără dataset

    });

    updateUI();
    table.appendChild(col);

  });

}
