const db = require('../db/connection');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');

/**
 * Register a new user
 * Requirements: 2.1, 2.2, 2.3, 2.4, 8.1, 8.2, 8.3, 8.4
 * 
 * Validates required fields, checks for duplicate email,
 * hashes password, and creates user record with default values
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function register(req, res, next) {
  try {
    const { email, username, password, role } = req.body;
    
    // Validate required fields
    if (!email || !username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email, username, and password are required',
        details: [
          !email && 'Email is required',
          !username && 'Username is required',
          !password && 'Password is required'
        ].filter(Boolean)
      });
    }
    
    // Check for duplicate email
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }
    
    // Hash password before storing
    const hashedPassword = await hashPassword(password);
    
    // Insert user into database with default role 'user' and default learning values
    const userRole = role === 'admin' ? 'admin' : 'user';
    const result = await db.execute(
      `INSERT INTO users (email, username, password, role, learning_style, learning_pattern) 
       VALUES (?, ?, ?, ?, 'visual', 'consistent')`,
      [email, username, hashedPassword, userRole]
    );
    
    // Return success response (excluding password)
    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        email,
        username,
        role: userRole
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Login user and return JWT token
 * Requirements: 2.1, 2.3, 2.4, 8.1, 8.2, 8.3, 8.4
 * 
 * Validates credentials, compares password hashes,
 * and generates JWT token on successful authentication
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    
    // Validate email and password fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
        details: [
          !email && 'Email is required',
          !password && 'Password is required'
        ].filter(Boolean)
      });
    }
    
    // Query user by email
    const users = await db.query(
      'SELECT id, email, username, password, role, learning_style, learning_pattern FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    const user = users[0];
    
    // Compare password with bcrypt
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    // Generate JWT token on success
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });
    
    // Return token and user data (excluding password)
    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          learning_style: user.learning_style,
          learning_pattern: user.learning_pattern
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login
};
