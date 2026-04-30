const mongoose = require("mongoose");

const riskZoneSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    description: { type: String, default: "" },
    level:       { type: String, enum: ["low", "medium", "high"], default: "medium" },
    location: {
      lat:    { type: Number, required: true },
      lng:    { type: Number, required: true },
      radius: { type: Number, default: 100 }, // metres
    },
    features: {
      timeOfDay:    { type: String, default: "night" },
      lighting:     { type: String, default: "poor" },
      incidentCount:{ type: Number, default: 0 },
      isolated:     { type: Boolean, default: false },
    },
    isActive: { type: Boolean, default: true },
    createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RiskZone", riskZoneSchema);
