const Mine = require("../models/Mine");

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

// ✅ Export all functions at once
module.exports = { createMine, getMinesByCorp, deleteMine, getAllMines };
