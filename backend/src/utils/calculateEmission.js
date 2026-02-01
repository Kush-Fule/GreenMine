const factors = require("./emissionFactors");

const getMineTypeFactor = (mineType) => {
  if (mineType === "Underground") return 1.3;
  return 1.0; // Opencast
};

const getCoalGradeFactor = (coalGrade) => {
  if (coalGrade === "High") return 1.1;
  if (coalGrade === "Low") return 0.9;
  return 1.0; // Medium
};

const getEmissionLevel = (co2e) => {
  if (co2e < 1000) return "Green";
  if (co2e <= 5000) return "Yellow";
  return "Red";
};

const calculateEmission = ({
  dieselLitres,
  electricityKwh,
  methaneTons,
  coalExtractedTons,
  transportDistanceKm,
  explosivesKg,
  mineType,
  coalGrade,
}) => {
  // Base emissions (kg CO2e)
  const fuelEmission = dieselLitres * factors.DIESEL;
  const electricityEmission = electricityKwh * factors.ELECTRICITY;
  const methaneEmission = methaneTons * factors.METHANE;
  const transportEmission =
    coalExtractedTons * transportDistanceKm * factors.TRANSPORT;
  const explosivesEmission = explosivesKg * factors.EXPLOSIVES;

  const baseEmission =
    fuelEmission +
    electricityEmission +
    methaneEmission +
    transportEmission +
    explosivesEmission;

  // Adjustment factors
  const mineFactor = getMineTypeFactor(mineType);
  const coalFactor = getCoalGradeFactor(coalGrade);

  const adjustedEmission = baseEmission * mineFactor * coalFactor;

  const finalCO2e = Number((adjustedEmission / 1000).toFixed(2)); // tons

 return {
  totalCO2e: finalCO2e,
  emissionLevel: getEmissionLevel(finalCO2e),
  breakdown: {
    diesel: fuelEmission / 1000,
    electricity: electricityEmission / 1000,
    methane: methaneEmission / 1000,
    transport: transportEmission / 1000,
    explosives: explosivesEmission / 1000,
  },
};
};

module.exports = calculateEmission;
