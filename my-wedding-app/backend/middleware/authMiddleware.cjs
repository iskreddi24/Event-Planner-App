const jwt = require("jsonwebtoken");

/**
 * @desc Middleware to verify JWT and attach user info to req.user
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Allow "Authorization: Bearer <token>" or "Authorization: <token>"
    if (req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      token = parts.length === 2 ? parts[1] : parts[0];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");

    // Extract user ID and role from payload
    const userId =
      decoded._id ||
      decoded.id ||
      decoded.userId ||
      decoded.user?._id ||
      decoded.user?.id;

    if (!userId) {
      console.error("JWT Decode Error: User ID not found in payload.");
      return res.status(401).json({ message: "Token payload missing user identifier." });
    }

    // Attach user info to the request object
    req.user = {
      _id: userId,
      role: decoded.role || decoded.user?.role || "user",
    };

    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(401).json({ message: "Not authorized, token invalid or expired." });
  }
};

/**
 * @desc Middleware to verify admin privileges
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized. Admin privileges required." });
  }
};

module.exports = { protect, admin };
