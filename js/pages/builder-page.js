document.addEventListener("DOMContentLoaded", async () => {

  await loadVocabulary();   // 🔥 OBLIGATORIU

  initApp();               // apoi render

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
    if(!s.places) s.places = [];
    if(!s.places.includes(value)) s.places.push(value);
  }

  else if(key === "object"){
    if(!s.objects) s.objects = [];
    if(!s.objects.includes(value)) s.objects.push(value);
  }

  else if(key === "verb"){
    if(!s.verbs) s.verbs = [];
    if(!s.verbs.includes(value)) s.verbs.push(value);
  }

  else if(key === "subject"){
    s.subject = value;
  }

  else if(key === "time"){
    s.time = value;
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
window.KOREAN_VOCAB = {

  subjects: [
    "저","나","너","우리","너희","사람","학생","선생님","직원","전문가"
  ],

  subjectAdjectives: [
    "예쁜","착한","똑똑한","키가 큰","젊은","늙은"
  ],

  times: [
    "오늘","어제","내일","지금","방금","곧","요즘","항상","자주"
  ],

  places: [
    "집","학교","회사","카페","병원","공항","은행"
  ],

  modifiers: [
    "잘","열심히","조용히","천천히","빨리","정말","아주","너무"
  ],

  objects: [
    "책","커피","물","음식","영화","데이터","문제","결과"
  ],

  objectAdjectives: [
    "예쁜","맛있는","큰","작은","새로운","오래된"
  ],

  numerals: new Array(60).fill(""),

  counters: [
    "개","명","권","장","대","병","잔"
  ],

  verbs: [
    "가다","오다","먹다","마시다","보다","읽다","쓰다","공부하다","일하다"
  ],

  conjugations: [
    "-아요/어요","-았어요/었어요","-고 있어요","-고 싶어요",
    "-(으)ㄹ 거예요","-고","-기 때문에","-(으)면서"
  ]

};
