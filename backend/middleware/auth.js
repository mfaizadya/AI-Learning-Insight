const { verifyToken } = require('../utils/auth');

/**
 * Middleware to verify JWT token from Authorization header
 * Attaches decoded user data to req.user
 * Returns 401 for invalid or missing tokens
 */
function verifyTokenMiddleware(req, res, next) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Authorization header is missing'
      });
    }
    
    // Check if header follows "Bearer <token>" format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        error: 'Authorization header must be in format: Bearer <token>'
      });
    }
    
    const token = parts[1];
    
    // Verify and decode token
    const decoded = verifyToken(token);
    
    // Attach user data to request object
    req.user = decoded;
    
    next();
  } catch (error) {
    // Handle JWT verification errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token has expired'
      });
    }
    
    // Handle other errors
    return res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
}

/**
 * Middleware to verify user has admin role
 * Must be used after verifyTokenMiddleware
 * Returns 403 for non-admin users
 */
function verifyAdmin(req, res, next) {
  // Check if user data exists (should be set by verifyTokenMiddleware)
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }
  
  // Check if user has admin role
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
  }
  
  next();
}

module.exports = {
  verifyToken: verifyTokenMiddleware,
  verifyAdmin
};
