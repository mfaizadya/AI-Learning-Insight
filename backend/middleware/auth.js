const { verifyToken } = require("../utils/auth");

/**
 * Middleware to verify JWT token from Authorization header
 */
function verifyTokenMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: "Authorization header is missing",
      });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        error: "Authorization header must be in format: Bearer <token>",
      });
    }

    const token = parts[1];
    const decoded = verifyToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, error: "Token has expired" });
    }

    return res
      .status(401)
      .json({ success: false, error: "Authentication failed" });
  }
}

function verifyAdmin(req, res, next) {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, error: "Authentication required" });
  }

  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, error: "Admin access required" });
  }

  next();
}

module.exports = {
  verifyToken: verifyTokenMiddleware,
  verifyAdmin,
};
