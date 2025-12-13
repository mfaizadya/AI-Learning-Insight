const { verifyToken } = require("../utils/auth");
const UserRepository = require("../repositories/userRepository");

/**
 * Middleware to verify JWT token from Authorization header and check if user is not deleted
 * Requirements: 3.5
 */
async function verifyTokenMiddleware(req, res, next) {
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
    
    // Check if user exists and is not deleted
    // Requirements: 3.5 - Deleted user authentication rejection
    const user = await UserRepository.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User account not found or has been deactivated",
      });
    }
    
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

/**
 * Middleware to verify user ownership or admin access
 * Allows users to access their own resources or admins to access any resource
 * Expects user ID in req.params.id
 */
function verifyOwnershipOrAdmin(req, res, next) {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, error: "Authentication required" });
  }

  const userId = parseInt(req.params.id);
  
  if (isNaN(userId)) {
    return res.status(400).json({
      success: false,
      error: "Invalid user ID",
      details: {
        field: "id",
        code: "INVALID_ID"
      }
    });
  }

  // Allow access if user is admin or accessing their own resource
  if (req.user.role === "admin" || req.user.id === userId) {
    return next();
  }

  return res.status(403).json({
    success: false,
    error: "Access denied. You can only access your own profile."
  });
}

module.exports = {
  verifyToken: verifyTokenMiddleware,
  verifyAdmin,
  verifyOwnershipOrAdmin,
};
