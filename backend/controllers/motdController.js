const db = require('../db/connection');

/**
 * Create new MOTD entry (admin only)
 * Requirements: 1.1, 1.2, 1.3
 * 
 * @param {Object} req - Express request object with message in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function createMotd(req, res, next) {
  try {
    const { message } = req.body;
    
    // Validate message field - reject empty or whitespace-only strings
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required and cannot be empty or contain only whitespace'
      });
    }
    
    // Insert MOTD entry into database
    const result = await db.execute(
      'INSERT INTO motd (message) VALUES (?)',
      [message]
    );
    
    // Return created MOTD entry with generated ID
    res.status(201).json({
      success: true,
      data: {
        motd_id: result.insertId,
        message
      }
    });
    
  } catch (error) {
    next(error);
  }
}

/**
 * Get all MOTD entries (authenticated users)
 * Requirements: 2.1, 2.2, 2.3
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getAllMotd(req, res, next) {
  try {
    // Retrieve all MOTD entries from database
    const motdEntries = await db.query('SELECT motd_id, message FROM motd');
    
    // Return all entries (empty array if none exist)
    res.status(200).json({
      success: true,
      data: motdEntries
    });
    
  } catch (error) {
    next(error);
  }
}

/**
 * Get single MOTD entry by ID (admin only)
 * Requirements: 3.1, 3.2, 3.3
 * 
 * @param {Object} req - Express request object with id in params
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getMotdById(req, res, next) {
  try {
    const { id } = req.params;
    
    // Retrieve MOTD entry by ID
    const motdEntries = await db.query(
      'SELECT motd_id, message FROM motd WHERE motd_id = ?',
      [id]
    );
    
    // Check if MOTD entry exists
    if (motdEntries.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'MOTD entry not found'
      });
    }
    
    // Return the MOTD entry
    res.status(200).json({
      success: true,
      data: motdEntries[0]
    });
    
  } catch (error) {
    next(error);
  }
}

/**
 * Update MOTD entry (admin only)
 * Requirements: 4.1, 4.2, 4.3, 4.4
 * 
 * @param {Object} req - Express request object with id in params and message in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function updateMotd(req, res, next) {
  try {
    const { id } = req.params;
    const { message } = req.body;
    
    // Validate message field - reject empty or whitespace-only strings
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required and cannot be empty or contain only whitespace'
      });
    }
    
    // Check if MOTD entry exists
    const existingMotd = await db.query(
      'SELECT motd_id FROM motd WHERE motd_id = ?',
      [id]
    );
    
    if (existingMotd.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'MOTD entry not found'
      });
    }
    
    // Update MOTD entry in database
    await db.execute(
      'UPDATE motd SET message = ? WHERE motd_id = ?',
      [message, id]
    );
    
    // Return updated MOTD entry
    res.status(200).json({
      success: true,
      data: {
        motd_id: parseInt(id),
        message
      }
    });
    
  } catch (error) {
    next(error);
  }
}

/**
 * Delete MOTD entry (admin only)
 * Requirements: 5.1, 5.2, 5.3
 * 
 * @param {Object} req - Express request object with id in params
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function deleteMotd(req, res, next) {
  try {
    const { id } = req.params;
    
    // Check if MOTD entry exists
    const existingMotd = await db.query(
      'SELECT motd_id FROM motd WHERE motd_id = ?',
      [id]
    );
    
    if (existingMotd.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'MOTD entry not found'
      });
    }
    
    // Delete MOTD entry from database
    await db.execute(
      'DELETE FROM motd WHERE motd_id = ?',
      [id]
    );
    
    // Return success confirmation
    res.status(200).json({
      success: true,
      message: 'MOTD deleted successfully'
    });
    
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createMotd,
  getAllMotd,
  getMotdById,
  updateMotd,
  deleteMotd
};
