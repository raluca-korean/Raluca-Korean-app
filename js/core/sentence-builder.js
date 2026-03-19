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
if(!s.object && s.verb){
  if(s.verb === "먹다"){
    result += "밥을 ";
  }
}
   // 🔥 VERB — CONTROL TOTAL
  if(s.object){
    // dacă există obiect → folosim verb logic
    const verb = "읽다"; // pentru 책
    result += conjugateVerb(verb, "present");
  } else if(s.verb){
    let verb = s.verb;

    if(!verb.endsWith("다")){
      verb += "다";
    }

    result += conjugateVerb(verb, "present");
  }

  const output = document.querySelector(".result-korean");
  if(output){
    output.textContent = result.trim();
  }
}
