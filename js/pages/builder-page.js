document.addEventListener("DOMContentLoaded", async () => {

  try {

    await loadVocabulary();

    initBuilderPage();

  } catch(err){

    console.error("BOOT ERROR", err);

  }

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
