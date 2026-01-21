const User = require("../models/User");
const Mine = require("../models/Mine");

// ============================
// Corporation Analytics
// ============================
const getCorpAnalytics = async (req, res) => {
  try {
    const { corpId } = req.params;

    const user = await User.findById(corpId);
    if (!user) {
      return res.status(404).json({ message: "Corporation not found" });
    }

    const mines = await Mine.find({ corpId });

    const mineAnalytics = mines.map((mine) => ({
      mineId: mine._id,
      mineName: mine.mineName,
      totalCO2e: mine.totalCO2e,
      emissionLevel: mine.emissionLevel,
    }));

    res.status(200).json({
      success: true,
      corporation: {
        corpId: user._id,
        companyName: user.companyName,
        totalCO2e: user.totalCO2e,
        emissionLevel: user.emissionLevel,
      },
      mines: mineAnalytics,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCorpAnalytics };
