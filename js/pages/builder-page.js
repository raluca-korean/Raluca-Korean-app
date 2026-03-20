document.addEventListener("DOMContentLoaded", async () => {

  await loadVocabulary();   // 🔥 obligatoriu

  console.log("TEST VOCAB:", GLOBAL_VOCAB);

  // exemplu test manual (ca să vezi că merge)
  sentences[0] = {
    subject: "저",
    place: "학교",
    object: "밥",
    verb: "먹다",
    time: "오늘"
  };

  renderAll();

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
