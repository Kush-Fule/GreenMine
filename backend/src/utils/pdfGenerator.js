const PDFDocument = require("pdfkit");

const generateCarbonReport = ({
  company,
  mine,
  inputs,
  result,
}) => {
  const doc = new PDFDocument({ margin: 50 });

  // Title
  doc.fontSize(20).text("Carbon Footprint Report", { align: "center" });
  doc.moveDown();

  // Company Info
  doc.fontSize(14).text("Company Information");
  doc.moveDown(0.5);
  doc.fontSize(12)
    .text(`Company: ${company.companyName}`)
    .text(`Registration ID: ${company.registrationId}`)
    .text(`Location: ${company.location || "N/A"}`);
  doc.moveDown();

  // Mine Info
  doc.fontSize(14).text("Mine Information");
  doc.moveDown(0.5);
  doc.fontSize(12)
    .text(`Mine Name: ${mine.mineName}`)
    .text(`Mine Type: ${mine.mineType}`)
    .text(`Coal Type: ${mine.coalType}`)
    .text(`Location: ${mine.location}`);
  doc.moveDown();

  // Inputs
  doc.fontSize(14).text("Calculation Inputs");
  doc.moveDown(0.5);
  Object.entries(inputs).forEach(([key, value]) => {
    doc.fontSize(12).text(`${key}: ${value}`);
  });
  doc.moveDown();

  // Results
  doc.fontSize(14).text("Emission Results");
  doc.moveDown(0.5);
  doc.fontSize(12)
    .text(`Total CO₂e: ${result.totalCO2e} tons`)
    .text(`Emission Level: ${result.emissionLevel}`);

  doc.moveDown(2);
  doc.fontSize(10).text(
    `Generated on: ${new Date().toLocaleString()}`,
    { align: "right" }
  );

  return doc;
};

module.exports = generateCarbonReport;
