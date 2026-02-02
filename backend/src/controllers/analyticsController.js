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

    // ----------------------------
    // Mine-wise analytics
    // ----------------------------
    const mineAnalytics = mines.map((mine) => ({
      mineId: mine._id,
      mineName: mine.mineName,
      totalCO2e: mine.totalCO2e,
      emissionLevel: mine.emissionLevel,
    }));

    // ----------------------------
    // Scope-wise aggregation
    // (safe even if fields missing)
    // ----------------------------
    const scope1Total = mines.reduce(
      (sum, m) => sum + (m.scope1CO2e || 0),
      0
    );

    const scope2Total = mines.reduce(
      (sum, m) => sum + (m.scope2CO2e || 0),
      0
    );

    // ----------------------------
    // Emission level distribution
    // ----------------------------
    const emissionLevels = {
      Green: 0,
      Yellow: 0,
      Red: 0,
    };

    mines.forEach((m) => {
      if (emissionLevels[m.emissionLevel] !== undefined) {
        emissionLevels[m.emissionLevel]++;
      }
    });

    // ----------------------------
    // Average emission per mine
    // ----------------------------
    const avgEmissionPerMine =
      mines.length > 0
        ? Number((user.totalCO2e / mines.length).toFixed(3))
        : 0;

    // ----------------------------
    // RESPONSE
    // ----------------------------
    res.status(200).json({
      success: true,

      corporation: {
        corpId: user._id,
        companyName: user.companyName,
        totalCO2e: Number(user.totalCO2e.toFixed(3)),
        emissionLevel: user.emissionLevel,
      },

      analytics: {
        scope1Total: Number(scope1Total.toFixed(3)),
        scope2Total: Number(scope2Total.toFixed(3)),
        avgEmissionPerMine,
        emissionLevels,
      },

      mines: mineAnalytics,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCorpAnalytics };
