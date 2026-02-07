const generateCarbonReport = require("../utils/pdfGenerator");
const Mine = require("../models/Mine");
const User = require("../models/User");
const scope1Methane = require("../utils/scope1Methane");
const scope1Combustion = require("../utils/scope1Combustion");
const scope2Electricity = require("../utils/scope2Electricity");
const aggregateEmissions = require("../utils/aggregateEmissions");
const EmissionCalculation = require("../models/EmissionCalculation");
const EmissionReport = require("../models/EmissionReport");
// Add new mine
const createMine = async (req, res) => {
  try {
    const { corpId, mineName, location, mineType, coalType } = req.body;

    if (!corpId || !mineName || !location || !mineType || !coalType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const mine = await Mine.create({
      corpId,
      mineName,
      location,
      mineType,
      coalType,
    });

    res.status(201).json({ success: true, mine });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all mines for a corporation
const getMinesByCorp = async (req, res) => {
  try {
    const { corpId } = req.params;

    const mines = await Mine.find({ corpId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: mines.length, mines });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a mine
const deleteMine = async (req, res) => {
  try {
    const mine = await Mine.findById(req.params.id);

    if (!mine) return res.status(404).json({ message: "Mine not found" });

    await mine.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Mine deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all mines
const getAllMines = async (req, res) => {
  try {
    const mines = await Mine.find().populate(
      "corpId",
      "companyName email location",
    );
    res.status(200).json(mines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get individual mine by ID
const getMineById = async (req, res) => {
  try {
    const mine = await Mine.findById(req.params.mineId).populate(
      "corpId",
      "companyName email location",
    );

    if (!mine) return res.status(404).json({ message: "Mine not found" });

    res.status(200).json({ success: true, mine });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculate carbon footprint for a mine
const calculateMineEmission = async (req, res) => {
  try {
    const { mineId } = req.params;
    const { scope1, scope2 } = req.body;

    const mine = await Mine.findById(mineId);
    if (!mine) return res.status(404).json({ message: "Mine not found" });

    const results = [
      scope1Methane(scope1.methane),
      scope1Combustion(scope1.combustion),
      scope2Electricity(scope2),
    ];

    const aggregated = aggregateEmissions(results);

    const round = (n) => Number(n.toFixed(3));
    mine.scope1CO2e = round(aggregated.scope1CO2e);
    mine.scope2CO2e = round(aggregated.scope2CO2e);
    mine.totalCO2e = round(aggregated.totalCO2e);

    mine.emissionLevel =
      aggregated.totalCO2e < 1000
        ? "Green"
        : aggregated.totalCO2e <= 5000
          ? "Yellow"
          : "Red";
    mine.calculatedAt = new Date();
    await mine.save();
    const mines = await Mine.find({ corpId: mine.corpId });

    const totalCorpEmission = round(
      mines.reduce((sum, m) => sum + (m.totalCO2e || 0), 0),
    );

    // Determine corp emission level
    const corpEmissionLevel =
      totalCorpEmission < 5000
        ? "Green"
        : totalCorpEmission <= 20000
          ? "Yellow"
          : "Red";

    // Update user
    await User.findByIdAndUpdate(mine.corpId, {
      totalCO2e: totalCorpEmission,
      emissionLevel: corpEmissionLevel,
    });

    await EmissionCalculation.create({
      mineId: mine._id,
      corpId: mine.corpId,
      ...aggregated,
      inputSnapshot: req.body,
      emissionLevel: mine.emissionLevel,
    });

    res.status(200).json({ success: true, ...aggregated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  
};

const downloadMineReport = async (req, res) => {
  try {
    const { mineId } = req.params;
    const inputs = req.body; // all form data

    const mine = await Mine.findById(mineId);
    if (!mine) return res.status(404).json({ message: "Mine not found" });

    const company = await User.findById(mine.corpId);

    const result = {
      totalCO2e: mine.totalCO2e,
      emissionLevel: mine.emissionLevel,
    };

    // ✅ STORE REPORT DATA
    await EmissionReport.create({
      corpId: company._id,
      mineId: mine._id,
      inputSnapshot: inputs,
      totalCO2e: mine.totalCO2e,
      emissionLevel: mine.emissionLevel,
    });

    const doc = generateCarbonReport({
      company,
      mine,
      result,
      inputs,
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${mine.mineName}_carbon_report.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);
    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMine,
  getMinesByCorp,
  deleteMine,
  getAllMines,
  getMineById,
  calculateMineEmission,
  downloadMineReport,
};
