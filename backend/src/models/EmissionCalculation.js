const mongoose = require("mongoose");

const emissionCalculationSchema = new mongoose.Schema(
  {
    mineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mine",
      required: true,
    },

    corpId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    scope1CO2e: Number,
    scope2CO2e: Number,
    totalCO2e: Number,

    breakdown: [
      {
        scope: String,
        category: String,
        co2e: Number,
      },
    ],

    inputSnapshot: Object,

    emissionLevel: {
      type: String,
      enum: ["Green", "Yellow", "Red"],
    },

    calculatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "EmissionCalculation",
  emissionCalculationSchema
);
