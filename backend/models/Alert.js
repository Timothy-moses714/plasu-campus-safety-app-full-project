const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    message:   { type: String, required: true },
    severity:  { type: String, enum: ["info", "warning", "critical"], default: "info" },
    location: {
      lat:     { type: Number },
      lng:     { type: Number },
      address: { type: String, default: "" },
    },
    issuedBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    expiresAt: { type: Date },
    isActive:  { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);
