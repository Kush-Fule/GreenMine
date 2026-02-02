const express = require("express");
const {
  getMyProfile,
  updateMyProfile,
  updatePassword,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.put("/update-password", protect, updatePassword);

module.exports = router;
