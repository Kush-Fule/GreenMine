const express = require("express");
const {
  getAllUsers,
  deleteUserAndMines,
} = require("../controllers/adminController");

const router = express.Router();

// Get all corporation users
router.get("/users", getAllUsers);

// Delete a corporation and its mines
router.delete("/users/:userId", deleteUserAndMines);

module.exports = router;
