const express = require("express");
const { getCorpAnalytics } = require("../controllers/analyticsController");

const router = express.Router();

// Get analytics for a corporation
router.get("/corp/:corpId", getCorpAnalytics);

module.exports = router;
