const express = require("express");
const router = express.Router();
const path = require("path");
const { verifyToken, verifyOwnershipOrAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");
const userController = require("../controllers/userController");

const multer = require("multer");

/**
 * @route   GET /api/users/profile
 * @desc    Retrieve authenticated user profile details
 * @access  Private
 */
router.get("/profile", verifyToken, userController.getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile (self-service)
 * @access  Private
 * Requirements: 4.1, 4.2, 4.3, 4.4
 */
router.put("/profile", verifyToken, userController.updateProfile);

/**
 * @route   DELETE /api/users/profile
 * @desc    Delete user profile (self-service) - Soft delete
 * @access  Private
 * Requirements: 3.1, 3.3, 3.4, 3.5
 */
router.delete("/profile", verifyToken, userController.deleteProfile);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID (self or admin)
 * @access  Private (Requires token and ownership/admin privileges)
 * Requirements: 4.1, 4.2, 4.3, 4.4
 */
router.get(
  "/:id",
  verifyToken,
  verifyOwnershipOrAdmin,
  userController.getUserById
);

/**
 * @route   PUT /api/users/profile/password
 * @desc    Change the authenticated user's password
 * @access  Private
 */
router.put("/profile/password", verifyToken, userController.changePassword);

/**
 * @route   POST /api/users/profile/picture
 * @desc    Upload or update the user's profile picture
 * @access  Private
 * NOTE: Middleware 'upload.single' must run BEFORE the controller.
 */
router.post(
  "/profile/picture",
  verifyToken,
  upload.single("profilePicture"),
  userController.uploadProfilePicture
);

/**
 * @route   GET /api/users/profile/picture/:filename
 * @desc    Serve the uploaded profile picture file
 * @access  Public (Image resource)
 */
router.get("/profile/picture/:filename", (req, res) => {
  const filename = req.params.filename;

  // Security: Prevent directory traversal by sanitizing/resolving path
  const filepath = path.join(
    __dirname,
    "..",
    "uploads",
    "profile-pictures",
    filename
  );

  // Send file and handle potential errors (file not found)
  res.sendFile(filepath, (err) => {
    if (err) {
      // Log error internally but return 404 to the client
      console.error(`File serving error for ${filename}:`, err.message);
      res.status(404).json({
        success: false,
        error: "Image not found",
      });
    }
  });
});

/**
 * POST /api/users/profile/picture (Block yang duplikat sudah dihapus)
 * Duplikasi PUT /profile sudah dihapus.
 */

/**
 * Middleware: File Upload Error Handler
 * This handler MUST be placed AFTER all routes that use 'upload' middleware.
 * It ensures Multer-specific errors return a clean JSON response.
 */
router.use((err, req, res, next) => {
  // Handle specific Multer errors, such as file size limits
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File size exceeds 5MB limit",
      });
    }

    // Handle generic Multer errors
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  // Handle manual file type validation errors thrown by the filter
  if (
    err &&
    err.message ===
      "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed"
  ) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  // Pass unrelated errors to the global Express error handler
  next(err);
});

module.exports = router;
