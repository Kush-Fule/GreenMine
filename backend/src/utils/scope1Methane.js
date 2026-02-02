const CH4_DENSITY = 0.0007168;
const GWP_CH4 = 25;

module.exports = ({ airFlowRate, ch4Concentration, operatingHours }) => {
  const volume =
    airFlowRate *
    (ch4Concentration / 100) *
    operatingHours *
    3600;

  const ch4Mass = volume * CH4_DENSITY;
  const co2e = ch4Mass * GWP_CH4;

  return {
    scope: "Scope 1",
    category: "Fugitive Methane",
    co2e,
  };
};
