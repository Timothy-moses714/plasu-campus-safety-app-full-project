const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    description: { type: String, default: "" },
    type: {
      type: String,
      enum: ["theft", "assault", "suspicious_activity", "fire", "other"],
      required: true,
    },
    location: {
      lat:     { type: Number },
      lng:     { type: Number },
      address: { type: String, default: "" },
    },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "acknowledged", "resolved"],
      default: "pending",
    },
    mediaUrl: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Incident", incidentSchema);
