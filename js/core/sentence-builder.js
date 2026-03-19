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

  // 1. TIME
  if(s.time){
    result += s.time + " ";
  }

  // 2. SUBJECT + ADJ
  if(s.subject){

    let subj = s.subject;

    if(s.subjectAdj){
      subj = s.subjectAdj + " " + subj;
    }

    if(subj === "저"){
      result += "제가 ";
    } else {
      result += subj + subjectParticle(subj) + " ";
    }
  }

  // 3. PLACES (multiple, coreean corect)
  if(s.places && s.places.length){

    if(s.places.length === 1){
      result += s.places[0] + placeParticle(s.places[0]) + " ";
    } else {
      // legăm cu "와/과"
      s.places.forEach((p, i) => {

        if(i === 0){
          result += p;
        } else if(i < s.places.length - 1){
          result += "와 " + p;
        } else {
          result += "와 " + p + placeParticle(p) + " ";
        }

      });
    }
  }

  // 4. OBJECTS + ADJ
  if(s.objects && s.objects.length){

    s.objects.forEach((obj, i) => {

      let fullObj = obj;

      if(s.objectAdj){
        fullObj = s.objectAdj + " " + obj;
      }

      if(i === s.objects.length - 1){
        result += fullObj + objectParticle(obj) + " ";
      } else {
        result += fullObj + " ";
      }

    });
  }

  // 5. VERBS (multiple corect coreean)
  if(s.verbs && s.verbs.length){

    s.verbs.forEach((v, i) => {

      let verb = v.endsWith("다") ? v : v + "다";

      // multiple → -고
      if(i < s.verbs.length - 1){
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
