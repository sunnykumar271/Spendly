// middleware/authMiddleware.js
// ─────────────────────────────────────────────
// "Middleware" is a function that runs BETWEEN a request
// arriving and the controller handling it.
//
// This middleware checks: "Does this request have a valid JWT?"
// If yes → attach user info and continue.
// If no  → send 401 Unauthorized and stop.
// ─────────────────────────────────────────────

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // JWT is sent in the Authorization header as:
    // "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]; // extract the token part
    }

    // If no token found, reject the request
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided. Please log in.",
      });
    }

    // Verify the token using our secret key
    // If tampered or expired, jwt.verify() will throw an error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user to the request object so controllers can use it
    // We exclude password from the query using .select("-password") equivalent
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Token is valid but user no longer exists.",
      });
    }

    next(); // ✅ All good — move to the next middleware or controller
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again.",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please log in again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error during authentication.",
    });
  }
};

module.exports = { protect };
