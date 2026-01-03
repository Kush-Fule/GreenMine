const express = require("express");
const {
  createMine,
  getMinesByCorp,
  deleteMine,
  getAllMines
} = require("../controllers/mineController");

const router = express.Router();

router.post("/", createMine);
router.get("/", getAllMines);
router.get("/:corpId", getMinesByCorp);
router.delete("/:id", deleteMine);

module.exports = router;
