function normalizeRo(text) {
  return (text || "")
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:]/g, "")
    .replace(/ă/g, "a")
    .replace(/â/g, "a")
    .replace(/î/g, "i")
    .replace(/ș/g, "s")
    .replace(/ş/g, "s")
    .replace(/ț/g, "t")
    .replace(/ţ/g, "t");
}

function splitRoParts(text) {
  return normalizeRo(text)
    .split(/\s+/)
    .filter(Boolean);
}

function parseRomanianToSentence(text) {
  const words = splitRoParts(text);

  const s = makeEmptySentence();

  words.forEach(word => {
    if (word === "azi" || word === "astazi") s.time = "오늘";
    if (word === "ieri") s.time = "어제";
    if (word === "maine") s.time = "내일";

    if (word === "eu") s.subject = "저";
    if (word === "noi") s.subject = "우리";

    if (word === "acasa") {
      if (!s.places.includes("집")) s.places.push("집");
    }

    if (word === "scoala") {
      if (!s.places.includes("학교")) s.places.push("학교");
    }

    if (word === "restaurant") {
      if (!s.places.includes("식당")) s.places.push("식당");
    }

    if (word === "carte") {
      if (!s.objects.includes("책")) s.objects.push("책");
    }

    if (word === "apa") {
      if (!s.objects.includes("물")) s.objects.push("물");
    }

    if (word === "mancare") {
      if (!s.objects.includes("음식")) s.objects.push("음식");
    }

    if (word === "frumos" || word === "frumoasa") {
      s.subjectAdj = "예쁜";
    }

    if (word === "bun" || word === "buna") {
      s.objectAdj = "좋은";
    }

    if (word === "bine") {
      s.mod = "잘";
    }

    if (word === "citim" || word === "citesc") {
      if (!s.verbs.includes("읽다")) s.verbs.push("읽다");
    }

    if (word === "venim" || word === "vin") {
      if (!s.verbs.includes("오다")) s.ver
