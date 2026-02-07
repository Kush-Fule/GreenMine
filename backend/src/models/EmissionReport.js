const mongoose = require("mongoose");

const emissionReportSchema = new mongoose.Schema(
  {
    corpId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    mineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mine",
      required: true,
    },

    // stores all inputs user entered
    inputSnapshot: {
      type: Object,
      required: true,
    },

    totalCO2e: {
      type: Number,
      required: true,
    },

    emissionLevel: {
      type: String,
      enum: ["Green", "Yellow", "Red"],
      required: true,
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmissionReport", emissionReportSchema);
