const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.cjs'); 

const signTokenAndRespond = (user, res, statusCode = 200) => {
    const payload = {
        user: { id: user._id, name: user.name, role: user.role }
    };
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    res.status(statusCode).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
};

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password)
            return res.status(400).json({ message: 'Please enter all fields.' });

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const isAdminEmail = email === process.env.ADMIN_EMAIL;
        user = new User({ name, email, password, role: isAdminEmail ? 'admin' : 'user' });

        await user.save();
        signTokenAndRespond(user, res, 201);
    } catch (err) {
        console.error("Registration Error:", err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error during registration' });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        return signTokenAndRespond(user, res);

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
