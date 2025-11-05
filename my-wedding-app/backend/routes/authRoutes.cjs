const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User.cjs");


// --- JWT TOKEN CREATION ---
const signTokenAndRespond = (user, res, statusCode = 200) => {
  const payload = { _id: user._id, name: user.name, role: user.role };
  const secret = process.env.JWT_SECRET || "fallback_secret";
  const token = jwt.sign(payload, secret, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

  res.status(statusCode).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};
const generateResetToken = async (user) => {
  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetTokenExp = Date.now() + 60 * 60 * 1000; // expires in 1 hour

  await user.save();
  return resetToken;
};
// --- REGISTER ---
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password)
      return res.status(400).json({ message: "Please enter all fields." });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const isAdminEmail = email === process.env.ADMIN_EMAIL;
    user = new User({
      name,
      email,
      password,
      role: isAdminEmail ? "admin" : "user",
    });

    await user.save();
    signTokenAndRespond(user, res, 201);
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// --- LOGIN ---
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    signTokenAndRespond(user, res);
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- FORGOT PASSWORD ---


// --- FORGOT PASSWORD ---
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "No account found with that email." });

    const resetToken = await generateResetToken(user);

    // ✅ Return the unhashed token (for EmailJS) and name
    res.json({
      message: "Password reset token generated successfully.",
      token: resetToken,
      name: user.name,
    });

  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Server error while generating reset token." });
  }
});

// --- RESET PASSWORD ---
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExp: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired reset token." });

    // ✅ Hash the new password
    user.password = await bcrypt.hash(password, 10);

    // Clear token fields
    user.resetToken = undefined;
    user.resetTokenExp = undefined;

    await user.save();

    res.json({
      message: "✅ Password has been reset successfully. You can now log in.",
    });

  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Server error while resetting password." });
  }
});

module.exports = router;
