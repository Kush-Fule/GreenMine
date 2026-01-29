const express = require("express");

const {
  createMine,
  getMinesByCorp,
  deleteMine,
  getAllMines,
  getMineById,
  calculateMineEmission
} = require("../controllers/mineController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, createMine);
router.get("/", protect, getAllMines); // admin-style (later restrict)
router.get("/mine/:mineId", protect, getMineById);
router.post("/:mineId/calculate", protect, calculateMineEmission);
router.get("/:corpId", protect, getMinesByCorp);
router.delete("/:id", protect, deleteMine);

module.exports = router;
