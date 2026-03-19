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
    time: "",
    conjugation: ""
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

  const s = sentences[0] || makeEmptySentence();
  let result = "";

  // TIME
  if(s.time){
    result += s.time + " ";
  }

  // SUBJECT
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

  // PLACES
  if(s.places && s.places.length){

    if(s.places.length === 1){
      result += s.places[0] + placeParticle(s.places[0]) + " ";
    } else {
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

  // OBJECTS
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

  // VERBS
  if(s.verbs && s.verbs.length){

    s.verbs.forEach((v, i) => {

      let verb = v;

      if(!verb.endsWith("다")){
        verb += "다";
      }

      if(s.conjugation){
        if(i === s.verbs.length - 1){
          result += applyGrammar(verb, s.conjugation);
        } else {
          result += verb.replace("다","") + "고 ";
        }
      } else {
        if(i < s.verbs.length - 1){
          result += verb.replace("다","") + "고 ";
        } else {
          result += conjugateVerb(verb, "present");
        }
      }

    });

  }

  // 🔥 OUTPUT FINAL
  const output = document.querySelector(".result-korean");

  if(output){
    output.textContent = result.trim();
  }
}
 
