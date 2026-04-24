const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name:               { type: String, required: true, trim: true },
    email:              { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:           { type: String, required: true, minlength: 6 },
    phone:              { type: String, default: "" },
    role:               { type: String, enum: ["student", "security", "admin"], default: "student" },
    matricNumber:       { type: String, default: "" },
    department:         { type: String, default: "" },
    isActive:           { type: Boolean, default: true },
    resetPasswordToken: { type: String },
    resetPasswordExpire:{ type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
  return resetToken;
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpire;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
