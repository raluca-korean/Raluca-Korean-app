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

  // 🔥 PLACES (array)
  if(s.places && s.places.length){
    s.places.forEach(p => {
      result += p + placeParticle(p) + " ";
    });
  }

  // 🔥 OBJECTS (array)
  if(s.objects && s.objects.length){
    s.objects.forEach((obj, index) => {
      if(index === s.objects.length - 1){
        result += obj + objectParticle(obj) + " ";
      } else {
        result += obj + " ";
      }
    });
  }

  // 🔥 fallback dacă nu există obiect
  if((!s.objects || s.objects.length === 0) && s.verbs && s.verbs.length){
    if(s.verbs[0] === "먹다"){
      result += "밥을 ";
    }
  }

  // 🔥 VERBS (array)
  if(s.verbs && s.verbs.length){

    s.verbs.forEach((v, index) => {

      let verb = v;

      if(!verb.endsWith("다")){
        verb += "다";
      }

      // NU ultimul → -고
      if(index < s.verbs.length - 1){
        const stem = verb.replace("다", "");
        result += stem + "고 ";
      } else {
        // ultimul → conjugat
        result += conjugateVerb(verb, "present");
      }

    });

  }

  // OUTPUT
  const output = document.querySelector(".result-korean");
  if(output){
    output.textContent = result.trim();
  }
}
