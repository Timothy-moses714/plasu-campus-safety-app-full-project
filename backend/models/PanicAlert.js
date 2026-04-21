const mongoose = require("mongoose");

const panicAlertSchema = new mongoose.Schema(
  {
    triggeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ["active", "responded", "dismissed"],
      default: "active",
    },
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    respondedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PanicAlert", panicAlertSchema);
