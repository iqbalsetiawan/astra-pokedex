const colors = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

const lightColors = {
  normal: "#C0C0A0",
  fire: "#F8A878",
  water: "#A8C0F0",
  electric: "#FAD74A",
  grass: "#A0C864",
  ice: "#B8E8E8",
  fighting: "#E05048",
  poison: "#C058A8",
  ground: "#E8D878",
  flying: "#C8A0F8",
  psychic: "#FC92B6",
  bug: "#C0D860",
  rock: "#D8C068",
  ghost: "#8A78B8",
  dragon: "#B468F8",
  dark: "#8A6878",
  steel: "#C0C0D8",
  fairy: "#F4B3C2",
};

const getCardBackground = (types) => {
  if (!types || types.length === 0) {
    return "transparent";
  }

  if (types.length === 1) {
    return lightColors[types[0]?.type?.name];
  }

  const gradientColors = types.map((type) => lightColors[type.type.name]);
  return `linear-gradient(${gradientColors.join(", ")})`;
};

export { colors, getCardBackground };
