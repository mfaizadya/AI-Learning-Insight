const express = require('express');
const router = express.Router();
const path = require('path');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const userController = require('../controllers/userController');

/**
 * GET /api/users/profile
 * Get authenticated user profile
 * Requirements: 3.1, 4.1, 4.3
 */
router.get('/profile', verifyToken, userController.getProfile);

/**
 * POST /api/users/profile/picture
 * Upload or update user profile picture
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 4.1, 4.3, 5.5
 */
router.post('/profile/picture', verifyToken, upload.single('profilePicture'), userController.uploadProfilePicture);

/**
 * Multer error handling middleware
 * Requirements: 5.1, 5.2, 5.3, 5.4
 * 
 * Catches and handles multer-specific errors:
 * - MulterError for file size limit exceeded
 * - File filter errors for invalid file types
 * - Other multer-related errors
 */
router.use((err, req, res, next) => {
  // Handle MulterError (file size limit exceeded)
  if (err instanceof require('multer').MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds 5MB limit'
      });
    }
    // Handle other MulterErrors
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
  
  // Handle file filter errors (invalid file type)
  if (err && err.message === 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed') {
    return res.status(400).json({
      success: false,
      error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed'
    });
  }
  
  // Pass other errors to the next error handler
  next(err);
});

/**
 * GET /api/users/profile/picture/:filename
 * Serve uploaded profile picture
 * Requirements: 3.3, 4.1, 4.3
 */
router.get('/profile/picture/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, '..', 'uploads', 'profile-pictures', filename);
  
  // Send file with appropriate content-type headers
  res.sendFile(filepath, (err) => {
    if (err) {
      res.status(404).json({
        success: false,
        error: 'Image not found'
      });
    }
  });
});

module.exports = router;
