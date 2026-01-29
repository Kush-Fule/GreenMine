const express = require("express");
const { getCorpAnalytics } = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Get analytics for a corporation
router.get("/corp/:corpId", protect, getCorpAnalytics);

module.exports = router;
