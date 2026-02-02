const DIESEL_EF = 2.68;
const EXPLOSIVES_EF = 0.6;

module.exports = ({ dieselLitres, stationaryFuel, explosivesKg }) => {
  const emissionsKg =
    dieselLitres * DIESEL_EF +
    stationaryFuel * DIESEL_EF +
    explosivesKg * EXPLOSIVES_EF;

  return {
    scope: "Scope 1",
    category: "Combustion & Chemicals",
    co2e: emissionsKg / 1000,
  };
};
