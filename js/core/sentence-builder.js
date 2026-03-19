let sentences = [];
let actives = [];
function makeEmptySentence(){
  return {
    subject: "",
    subjectAdj: "",
    places: [],
    objects: [],
    objectAdj: "",
    verbs: [],
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

  // PLACE (acceptă și nou, și vechi)
  if(s.places && s.places.length){
    s.places.forEach(p => {
      result += p + placeParticle(p) + " ";
    });
  } else if(s.place){
    result += s.place + placeParticle(s.place) + " ";
  }

  // OBJECT (acceptă și nou, și vechi)
  if(s.objects && s.objects.length){
    s.objects.forEach((obj, index) => {
      if(index === s.objects.length - 1){
        result += obj + objectParticle(obj) + " ";
      } else {
        result += obj + " ";
      }
    });
  } else if(s.object){
    result += s.object + objectParticle(s.object) + " ";
  }

  // 🔥 fallback dacă lipsește obiectul pentru "먹다"
  const firstVerb = (s.verbs && s.verbs[0]) || s.verb;
  if((!s.objects || s.objects.length === 0) && !s.object && firstVerb === "먹다"){
    result += "밥을 ";
  }

  // VERBS (acceptă și nou, și vechi)
  if(s.verbs && s.verbs.length){

    s.verbs.forEach((v, index) => {

      let verb = v;
      if(!verb.endsWith("다")) verb += "다";

      if(index < s.verbs.length - 1){
        result += verb.replace("다","") + "고 ";
      } else {
        result += conjugateVerb(verb, "present");
      }

    });

  } else if(s.verb){

    let verb = s.verb;
    if(!verb.endsWith("다")) verb += "다";

    result += conjugateVerb(verb, "present");
  }

  const output = document.querySelector(".result-korean");
  if(output){
    output.textContent = result.trim();
  }
}
