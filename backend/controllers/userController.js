const db = require('../db/connection');
const fs = require('fs').promises;
const path = require('path');

/**
 * Get authenticated user profile
 * Requirements: 3.1, 3.2, 4.4
 * 
 * @param {Object} req - Express request object with req.user set by verifyToken middleware
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getProfile(req, res, next) {
  try {
    // Query user by req.user.id (set by verifyToken middleware)
    const users = await db.query(
      'SELECT id, email, username, role, learning_style, learning_pattern, image as profile_picture_url FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    const user = users[0];
    
    // Return user data including profile_picture_url (null if not set)
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        learning_style: user.learning_style,
        learning_pattern: user.learning_pattern,
        profile_picture_url: user.profile_picture_url
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Upload or update user profile picture
 * Requirements: 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 4.2, 4.4
 * 
 * Handles file upload, deletes old profile picture if exists,
 * updates database with new profile picture URL
 * 
 * @param {Object} req - Express request object with req.file set by multer middleware
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function uploadProfilePicture(req, res, next) {
  try {
    // Check if file was uploaded (multer sets req.file)
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file provided'
      });
    }
    
    const userId = req.user.id;
    const newFilePath = req.file.path;
    const newFileUrl = `/api/users/profile/picture/${req.file.filename}`;
    
    // Get current profile picture URL from database
    const users = await db.query(
      'SELECT image as profile_picture_url FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      // Clean up uploaded file if user not found
      await fs.unlink(newFilePath).catch(err => {
        console.error('Error deleting uploaded file:', err);
      });
      
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    const oldProfilePictureUrl = users[0].profile_picture_url;
    
    // Delete old profile picture file if it exists
    if (oldProfilePictureUrl) {
      // Extract filename from URL (format: /api/users/profile/picture/{filename})
      const oldFilename = oldProfilePictureUrl.split('/').pop();
      const oldFilePath = path.join('uploads', 'profile-pictures', oldFilename);
      
      // Attempt to delete old file (don't fail if file doesn't exist)
      try {
        await fs.unlink(oldFilePath);
      } catch (error) {
        // File might not exist, log but continue
        if (error.code !== 'ENOENT') {
          console.error('Error deleting old profile picture:', error);
        }
      }
    }
    
    // Update database with new profile picture URL
    await db.execute(
      'UPDATE users SET image = ? WHERE id = ?',
      [newFileUrl, userId]
    );
    
    // Return success response with new profile picture URL
    res.status(200).json({
      success: true,
      data: {
        profile_picture_url: newFileUrl,
        message: 'Profile picture uploaded successfully'
      }
    });
  } catch (error) {
    // If database or file system error occurs, try to clean up uploaded file
    if (req.file && req.file.path) {
      await fs.unlink(req.file.path).catch(err => {
        console.error('Error cleaning up uploaded file:', err);
      });
    }
    
    // Check if it's a storage error
    if (error.code === 'ENOSPC' || error.code === 'EROFS') {
      return res.status(500).json({
        success: false,
        error: 'Failed to upload image'
      });
    }
    
    // Pass other errors to error handler middleware
    next(error);
  }
}

module.exports = {
  getProfile,
  uploadProfilePicture
};
