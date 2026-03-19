let GLOBAL_VOCAB = null;

async function loadVocabulary(){
  try{

    const res = await fetch("./data/vocab-korean.json");

    if(!res.ok){
      throw new Error("Nu s-a putut încărca vocabularul");
    }

    GLOBAL_VOCAB = await res.json();

    console.log("VOCAB LOADED:", GLOBAL_VOCAB);

    return GLOBAL_VOCAB;

  }catch(err){
    console.error("VOCAB ERROR:", err);
  }
}
