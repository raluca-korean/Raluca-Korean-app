let sentences = [];
let actives = [];

function makeEmptySentence(){
  return {
    subject: "",
    verb: "",
    object: "",
    time: ""
  };
}

function makeAllActive(){
  return {
    subject: true,
    verb: true,
    object: true,
    time: true
  };
}
function renderAll(){

  const s = sentences[0];

  let result = "";

  if(s.time) result += s.time + " ";

  if(s.subject){
    result += s.subject + subjectParticle(s.subject) + " ";
  }

  if(s.place){
    result += s.place + placeParticle(s.place) + " ";
  }

  if(s.object){
    result += s.object + objectParticle(s.object) + " ";
  }

  if(s.verb){
  const conjugated = conjugateVerb(s.verb, "present");
  result += conjugated;
}
  const output = document.querySelector(".result-korean");

  if(output){
    output.textContent = result.trim();
  }

}
