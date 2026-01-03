const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["admin", "corp"],
      default: "corp",
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    // Corporation details
    companyName: {
      type: String,
      required: true,
    },

    registrationId: {
      type: String,
      required: true,
    },

    location: String,
    phone: String,

    establishedYear: Number,
    industryType: String,

    totalCO2e: {
      type: Number,
      default: 0,
    },

    emissionLevel: {
      type: String,
      enum: ["Green", "Yellow", "Red"],
      default: "Green",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
