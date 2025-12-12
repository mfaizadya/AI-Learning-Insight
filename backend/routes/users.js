const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const { verifyToken } = require("../middleware/auth");
const upload = require("../middleware/upload");
const userController = require("../controllers/userController");

/**
 * @route   GET /api/users/profile
 * @desc    Retrieve authenticated user profile details
 * @access  Private
 */
router.get("/profile", verifyToken, userController.getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile information (e.g., username)
 * @access  Private
 */
router.put("/profile", verifyToken, userController.updateProfile);

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
 */
router.post(
  "/profile/picture",
  verifyToken,
  upload.single("profilePicture"),
  userController.uploadProfilePicture
);

/**
 * Middleware: File Upload Error Handler
 * Captures Multer errors (e.g., file size limits) and custom file validation exceptions
 * to ensure a standardized JSON error response.
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

  // Pass unrelated errors to the global error handler
  next(err);
});

/**
 * @route   GET /api/users/profile/picture/:filename
 * @desc    Serve the uploaded profile picture file
 * @access  Public (Image resource)
 */
router.get("/profile/picture/:filename", (req, res) => {
  const filename = req.params.filename;
  // Resolve file path securely to prevent directory traversal attacks
  const filepath = path.join(
    __dirname,
    "..",
    "uploads",
    "profile-pictures",
    filename
  );

  // Send file with appropriate content-type headers
  res.sendFile(filepath, (err) => {
    if (err) {
      // Return 404 without exposing internal server paths on error
      res.status(404).json({
        success: false,
        error: "Image not found",
      });
    }
  });
});

module.exports = router;
