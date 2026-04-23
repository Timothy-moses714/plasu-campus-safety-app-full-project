const register = async (req, res) => {
  const { name, email, password, phone, matricNumber, department, role } = req.body;
  try {
    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return sendError(res, 400, "Email already registered");

    const user = await User.create({ 
      name, 
      email, 
      password, 
      phone: phone || "", 
      matricNumber: matricNumber || "", 
      department: department || "", 
      role: role || "student" 
    });
    
    const token = generateToken(user._id);
    sendResponse(res, 201, { user, token }, "Registration successful");
  } catch (err) {
    console.error("Register error:", err.message);
    sendError(res, 500, err.message);
  }
};
