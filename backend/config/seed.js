const User = require("../models/User");

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      await User.create({
        name: "PLASU Admin",
        email: process.env.ADMIN_EMAIL || "admin@plasu.edu.ng",
        password: process.env.ADMIN_PASSWORD || "PlasuAdmin@2024",
        role: "admin",
      });
      console.log("✅ Admin account created automatically");
    } else {
      console.log("✅ Admin account already exists");
    }

    const securityExists = await User.findOne({ role: "security" });
    if (!securityExists) {
      await User.create({
        name: "PLASU Security",
        email: process.env.SECURITY_EMAIL || "security@plasu.edu.ng",
        password: process.env.SECURITY_PASSWORD || "PlasuSecurity@2024",
        role: "security",
      });
      console.log("✅ Security account created automatically");
    } else {
      console.log("✅ Security account already exists");
    }
  } catch (err) {
    console.error("Seed error:", err.message);
  }
};

module.exports = seedAdmin;
