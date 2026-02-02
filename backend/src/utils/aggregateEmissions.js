module.exports = (results) => {
  const scope1 = results
    .filter(r => r.scope === "Scope 1")
    .reduce((s, r) => s + r.co2e, 0);

  const scope2 = results
    .filter(r => r.scope === "Scope 2")
    .reduce((s, r) => s + r.co2e, 0);

  return {
    scope1CO2e: scope1,
    scope2CO2e: scope2,
    totalCO2e: scope1 + scope2,
    breakdown: results,
  };
};
