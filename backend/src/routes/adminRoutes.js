const express = require("express");
const {
  getAllUsers,
  deleteUserAndMines,
} = require("../controllers/adminController");
const {
  getAllReports,
  downloadReportById,
  deleteReport,
} = require("../controllers/reportController")
const { protect, adminOnly } = require("../middleware/authMiddleware");
const router = express.Router();

// Get all corporation users
router.get("/users", protect, adminOnly, getAllUsers);

//Manage reports
router.get("/reports", protect, adminOnly, getAllReports);
router.get("/reports/:reportId/download", protect, adminOnly, downloadReportById);
router.delete("/reports/:reportId", protect, adminOnly, deleteReport);

// Delete a corporation and its mines
router.delete("/users/:userId", protect, adminOnly, deleteUserAndMines);

module.exports = router;
