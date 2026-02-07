const EmissionReport = require("../models/EmissionReport");
const generateCarbonReport = require("../utils/pdfGenerator");

const getAllReports = async (req, res) => {
  const reports = await EmissionReport.find()
    .populate("corpId", "companyName")
    .populate("mineId", "mineName")
    .sort({ createdAt: -1 });

  res.json({ reports });
};

const downloadReportById = async (req, res) => {
  const report = await EmissionReport.findById(req.params.reportId)
    .populate("corpId")
    .populate("mineId");

  const doc = generateCarbonReport({
    company: report.corpId,
    mine: report.mineId,
    result: {
      totalCO2e: report.totalCO2e,
      emissionLevel: report.emissionLevel,
    },
    inputs: report.inputSnapshot,
  });

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${report.mineId.mineName}_report.pdf`
  );
  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);
  doc.end();
};

const deleteReport = async (req, res) => {
  await EmissionReport.findByIdAndDelete(req.params.reportId);
  res.json({ success: true });
};

module.exports = {
  getAllReports,
  downloadReportById,
  deleteReport,
};
