
const jwt = require("jsonwebtoken");

// JWT Authentication Middleware
module.exports = (req, res, next) => {
  // Extract token from Authorization header
  const token = (
    req.headers.authorization || ""
  ).replace(/^Bearer\s+/i, "");

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      message: "Login required",
    });
  }

  try {
    // Verify JWT token
    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Continue to next middleware or route
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// Admin Authorization Middleware
module.exports.admin = (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    message: "Admin only",
  });
};
