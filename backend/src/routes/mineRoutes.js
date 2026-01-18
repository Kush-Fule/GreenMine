const express = require("express");

const {
  createMine,
  getMinesByCorp,
  deleteMine,
  getAllMines,
  getMineById,
  calculateMineEmission
} = require("../controllers/mineController");

const router = express.Router();

router.post("/", createMine);
router.get("/", getAllMines);
router.get("/mine/:mineId", getMineById);
router.post("/:mineId/calculate", calculateMineEmission);
router.get("/:corpId", getMinesByCorp);
router.delete("/:id", deleteMine);

module.exports = router;
