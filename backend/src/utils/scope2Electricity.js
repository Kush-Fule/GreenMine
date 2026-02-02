const GRID_EF = 0.82;

module.exports = ({ gridElectricity, renewableOffset }) => {
  const net = Math.max(gridElectricity - renewableOffset, 0);
  const co2e = (net * GRID_EF) / 100;
  return {
    scope: "Scope 2",
    category: "Purchased Electricity",
    co2e: (net * GRID_EF) / 100,
  };
};
