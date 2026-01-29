const express = require("express");
const {
  getAllUsers,
  deleteUserAndMines,
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const router = express.Router();

// Get all corporation users
router.get("/users", protect, adminOnly, getAllUsers);

// Delete a corporation and its mines
router.delete("/users/:userId", protect, adminOnly, deleteUserAndMines);

module.exports = router;
