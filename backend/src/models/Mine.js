const mongoose = require("mongoose");

const mineSchema = new mongoose.Schema(
  {
    corpId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    mineName: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    mineType: {
      type: String,
      enum: ["Opencast", "Underground"],
      required: true,
    },

    coalType: {
      type: String,
      required: true,
    },

    // Latest calculated footprint only
    totalCO2e: {
      type: Number,
      default: 0,
    },

    
    emissionLevel: {
      type: String,
      enum: ["Green", "Yellow", "Red"],
      default: "Green",
    },

    calculatedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mine", mineSchema);
