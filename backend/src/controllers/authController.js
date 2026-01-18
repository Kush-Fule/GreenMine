const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ================= REGISTER (CORP ONLY) =================
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      companyName,
      registrationId,
      location,
      phone,
      establishedYear,
      industryType,
    } = req.body;

    if (!name || !email || !password || !companyName || !registrationId) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      role: "corp",
      name,
      email,
      passwordHash,
      companyName,
      registrationId,
      location,
      phone,
      establishedYear,
      industryType,
    });

    res.status(201).json({
      success: true,
      message: "Corporation registered successfully",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN (ADMIN + CORP) =================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        emissionLevel: user.emissionLevel,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };
