const User = require("../models/User");
const Mine = require("../models/Mine");

// ============================
// Get all corporation users
// ============================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "corp" }).select(
      "-passwordHash"
    );

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// Delete corporation user + all its mines
// ==========================================
const deleteUserAndMines = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all mines of this corporation
    await Mine.deleteMany({ corpId: userId });

    // Delete user
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "Corporation and its mines deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUserAndMines,
};
