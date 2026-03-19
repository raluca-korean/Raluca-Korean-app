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

  // TIME
  if(s.time){
    result += s.time + " ";
  }

  // SUBJECT
  if(s.subject){
    if(s.subject === "저"){
      result += "제가 ";
    } else {
      result += s.subject + subjectParticle(s.subject) + " ";
    }
  }

  // PLACE
  if(s.place){
    result += s.place + placeParticle(s.place) + " ";
  }

  // OBJECT
  if(s.object){
    result += s.object + objectParticle(s.object) + " ";
  }

  // 🔥 fallback obiect (dacă lipsește)
  if(!s.object && s.verb){
    if(s.verb === "먹다"){
      result += "밥을 ";
    }
  }

  // 🔥 VERB — logic corect
  let verb = s.verb;

  // dacă NU avem verb → îl deducem din obiect
  if(!verb){
    if(s.object === "책") verb = "읽다";
    else if(s.object === "밥") verb = "먹다";
    else if(s.object === "물") verb = "마시다";
    else verb = "하다"; // fallback
  }

  // siguranță: adaugă "다"
  if(!verb.endsWith("다")){
    verb += "다";
  }

  // conjugare
  result += conjugateVerb(verb, "present");

  // OUTPUT
  const output = document.querySelector(".result-korean");
  if(output){
    output.textContent = result.trim();
  }
}
