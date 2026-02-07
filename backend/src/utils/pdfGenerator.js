const PDFDocument = require("pdfkit");

module.exports = ({ company, mine, result, inputs }) => {
  const doc = new PDFDocument({ margin: 50 });

  doc.fontSize(20).text("Carbon Footprint Assessment Report", {
    align: "center",
  });
  doc.moveDown(2);

  doc.fontSize(12);
  doc.text(`Company: ${company.companyName}`);
  doc.text(`Mine: ${mine.mineName}`);
  doc.text(`Location: ${mine.location}`);
  doc.text(`Generated On: ${new Date().toLocaleString()}`);
  doc.moveDown(2);

  doc.fontSize(14).text("1. Executive Summary", { underline: true });
  doc.moveDown();
  doc.fontSize(11).text(
    `Total emissions: ${result.totalCO2e} tons CO₂e. 
Emission Level: ${result.emissionLevel}.`
  );
  doc.moveDown(2);

  doc.fontSize(14).text("2. Scope 1 – Methane Emissions", { underline: true });
  doc.moveDown();
  doc.text(`Air Flow Rate: ${inputs.scope1.methane.airFlowRate}`);
  doc.text(`CH₄ Concentration: ${inputs.scope1.methane.ch4Concentration}`);
  doc.text(`Operating Hours: ${inputs.scope1.methane.operatingHours}`);
  doc.moveDown();

  doc.fontSize(14).text("3. Scope 1 – Combustion", { underline: true });
  doc.moveDown();
  doc.text(`Diesel Used: ${inputs.scope1.combustion.dieselLitres}`);
  doc.text(`Explosives Used: ${inputs.scope1.combustion.explosivesKg}`);
  doc.moveDown();

  doc.fontSize(14).text("4. Scope 2 – Electricity", { underline: true });
  doc.moveDown();
  doc.text(`Grid Electricity: ${inputs.scope2.gridElectricity}`);
  doc.text(`Renewable Offset: ${inputs.scope2.renewableOffset}`);
  doc.moveDown(2);

  doc.fontSize(9).text(
    "This report follows GHG Protocol and IPCC guidelines."
  );

  return doc;
};
