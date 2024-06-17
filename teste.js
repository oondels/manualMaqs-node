const levenshtein = require("js-levenshtein");

const stringsArray = ["apple", "banana", "cherry", "date"];
const searchString = "ap";

if (stringsArray.includes(searchString)) {
  console.log(`${searchString} está no array`);
} else {
  console.log(`${searchString} não está no array`);

  // Encontrar as strings mais próximas
  const distances = stringsArray.map((str) => ({
    string: str,
    distance: levenshtein(searchString, str),
  }));

  // Ordenar por distância
  distances.sort((a, b) => a.distance - b.distance);

  // Obter as strings mais próximas (por exemplo, as 3 mais próximas)
  const closestMatches = distances.slice(0, 3);

  console.log("Strings mais próximas:");
  closestMatches.forEach((match) =>
    console.log(`${match.string} (distância: ${match.distance})`)
  );
}
