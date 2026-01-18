const Mine = require("../models/Mine");
const calculateEmission = require("../utils/calculateEmission");
const User = require("../models/User");
// Add new mine
const createMine = async (req, res) => {
  try {
    const { corpId, mineName, location, mineType, coalType } = req.body;

    if (!corpId || !mineName || !location || !mineType || !coalType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const mine = await Mine.create({ corpId, mineName, location, mineType, coalType });

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

    res.status(200).json({ success: true, message: "Mine deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all mines
const getAllMines = async (req, res) => {
  try {
    const mines = await Mine.find().populate("corpId", "companyName email location");
    res.status(200).json(mines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get individual mine by ID
const getMineById = async (req, res) => {
  try {
    const mine = await Mine.findById(req.params.mineId).populate("corpId", "companyName email location");

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

    const mine = await Mine.findById(mineId);
    if (!mine) return res.status(404).json({ message: "Mine not found" });

    const {
      dieselLitres,
      electricityKwh,
      methaneTons,
      coalExtractedTons,
      transportDistanceKm,
      explosivesKg,
      coalGrade,
    } = req.body;

    if (
      dieselLitres == null ||
      electricityKwh == null ||
      methaneTons == null ||
      coalExtractedTons == null ||
      transportDistanceKm == null ||
      explosivesKg == null ||
      !coalGrade
    ) {
      return res.status(400).json({ message: "All calculation fields required" });
    }

    const result = calculateEmission({
      dieselLitres,
      electricityKwh,
      methaneTons,
      coalExtractedTons,
      transportDistanceKm,
      explosivesKg,
      mineType: mine.mineType,
      coalGrade,
    });

    // Update mine
    mine.totalCO2e = result.totalCO2e;
    mine.emissionLevel = result.emissionLevel;
    mine.calculatedAt = new Date();
    await mine.save();

    // Update corporation total
    const mines = await Mine.find({ corpId: mine.corpId });
    const totalCorpEmission = mines.reduce(
      (sum, m) => sum + (m.totalCO2e || 0),
      0
    );

    const corpEmissionLevel =
      totalCorpEmission < 5000
        ? "Green"
        : totalCorpEmission <= 20000
        ? "Yellow"
        : "Red";

    await User.findByIdAndUpdate(mine.corpId, {
      totalCO2e: totalCorpEmission,
      emissionLevel: corpEmissionLevel,
    });

    res.status(200).json({
      success: true,
      mineEmission: result,
      corpTotalEmission: totalCorpEmission,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { createMine, getMinesByCorp, deleteMine, getAllMines, getMineById, calculateMineEmission};
