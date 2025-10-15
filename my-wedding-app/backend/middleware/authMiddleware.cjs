const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1] || req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        req.user = decoded.user;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Not authorized, token invalid or expired.' });
    }
};

const admin = (req, res, next) => {
    if (req.user?.role === 'admin') next();
    else res.status(403).json({ message: 'Not authorized. Admin privileges required.' });
};

module.exports = { protect, admin };
