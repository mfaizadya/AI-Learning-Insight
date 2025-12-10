/**
 * Global Error Handler Middleware
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 * 
 * Catches all errors from routes and maps them to appropriate HTTP status codes
 * Sanitizes error messages for production and logs errors with stack traces
 */

/**
 * Error handler middleware
 * Must be registered last in the middleware chain
 */
function errorHandler(err, req, res, next) {
  // Log errors with stack traces for debugging
  console.error('Error occurred:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    error: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
  });

  // Default error response
  let statusCode = 500;
  let errorMessage = 'Internal server error';
  let details = undefined;

  // Database connection errors (Requirement 7.1)
  if (err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_CONNECTION_LOST') {
    statusCode = 500;
    errorMessage = 'Database connection error';
  }
  // Database errors (Requirement 7.1)
  else if (err.code && err.code.startsWith('ER_')) {
    // Duplicate entry
    if (err.code === 'ER_DUP_ENTRY') {
      statusCode = 400;
      errorMessage = 'Duplicate entry';
    }
    // Foreign key constraint violation
    else if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_ROW_IS_REFERENCED_2') {
      statusCode = 400;
      errorMessage = 'Invalid reference: related record does not exist';
    }
    // Other database errors
    else {
      statusCode = 500;
      errorMessage = 'Database error';
    }
  }
  // Malformed JSON (Requirement 7.2)
  else if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    errorMessage = 'Malformed JSON in request body';
  }
  // Validation errors (Requirement 7.5)
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    errorMessage = 'Validation error';
    details = err.details || [];
  }
  // JWT errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorMessage = 'Invalid token';
  }
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorMessage = 'Token expired';
  }
  // Custom status code from routes
  else if (err.statusCode) {
    statusCode = err.statusCode;
    errorMessage = err.message;
    details = err.details;
  }
  // Unhandled exceptions (Requirement 7.4)
  else {
    statusCode = 500;
    // In production, don't expose internal error details (Requirement 7.4)
    errorMessage = process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message;
  }

  // Return standardized error response format
  const response = {
    success: false,
    error: errorMessage
  };

  // Include details if available (Requirement 7.5)
  if (details && details.length > 0) {
    response.details = details;
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
