const db = require('../db/connection');

/**
 * Get authenticated user's insights
 * Requirements: 6.1, 6.2, 8.1, 8.2, 8.3, 8.4, 8.5
 * 
 * @param {Object} req - Express request object with req.user set by verifyToken middleware
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getUserInsights(req, res, next) {
  try {
    const userId = req.user.id;
    
    // Query all insights for the authenticated user
    const insights = await db.query(
      'SELECT id, user_id, insight FROM insight WHERE user_id = ?',
      [userId]
    );
    
    // Return array of insights (empty if no insights)
    res.json({
      success: true,
      data: insights
    });
    
  } catch (error) {
    next(error);
  }
}

/**
 * Create insight for a user (admin only)
 * Requirements: 6.1, 6.3, 6.4, 8.1, 8.2, 8.3, 8.4
 * 
 * @param {Object} req - Express request object with user_id and insight in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function createInsight(req, res, next) {
  try {
    const { user_id, insight } = req.body;
    
    // Validate user_id and insight text
    if (!user_id || !insight) {
      return res.status(400).json({
        success: false,
        error: 'user_id and insight are required',
        details: [
          !user_id && 'user_id is required',
          !insight && 'insight is required'
        ].filter(Boolean)
      });
    }
    
    // Verify user exists
    const users = await db.query(
      'SELECT id FROM users WHERE id = ?',
      [user_id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Insert insight into database
    const result = await db.execute(
      'INSERT INTO insight (user_id, insight) VALUES (?, ?)',
      [user_id, insight]
    );
    
    // Return created insight
    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        user_id,
        insight
      }
    });
    
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUserInsights,
  createInsight
};
