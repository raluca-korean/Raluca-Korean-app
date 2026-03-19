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
  console.log("Rendering sentences:", sentences);
}
