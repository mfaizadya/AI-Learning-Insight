const db = require("../db/connection");
const fs = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

/**
 * Retrieve authenticated user profile details
 * Fetches user information based on the ID from the verified token
 * * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getProfile(req, res, next) {
  try {
    const users = await db.query(
      "SELECT id, email, username, role, learning_style, learning_pattern, image as profile_picture_url FROM users WHERE id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const user = users[0];

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        learning_style: user.learning_style,
        learning_pattern: user.learning_pattern,
        profile_picture_url: user.profile_picture_url,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update User Profile Information
 * Updates the username and refreshes the updated_at timestamp
 */
async function updateProfile(req, res, next) {
  try {
    const { username } = req.body;
    const userId = req.user.id;

    // Validate input parameters
    if (!username || username.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Username cannot be empty",
      });
    }

    // Check if the username is already taken by another user
    const existingUser = await db.query(
      "SELECT id FROM users WHERE username = ? AND id != ?",
      [username, userId]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Username already taken",
      });
    }

    // Execute update query
    await db.execute(
      "UPDATE users SET username = ?, updated_at = NOW() WHERE id = ?",
      [username, userId]
    );

    res.status(200).json({
      success: true,
      data: {
        id: userId,
        username: username,
        message: "Profile updated successfully",
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Change User Password
 * Verifies the current password before hashing and storing the new password
 */
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Current password and new password are required",
      });
    }

    // Enforce minimum password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "New password must be at least 6 characters",
      });
    }

    // Confirm password match
    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "New password and confirmation do not match",
      });
    }

    // Retrieve current password hash from database
    const users = await db.query("SELECT password FROM users WHERE id = ?", [
      userId,
    ]);

    if (users.length === 0) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const storedHash = users[0].password;

    // Verify current password against stored hash
    const isMatch = await bcrypt.compare(currentPassword, storedHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Incorrect current password",
      });
    }

    // Generate new password hash
    const saltRounds = 10;
    const newHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password in database
    await db.execute(
      "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?",
      [newHash, userId]
    );

    res.status(200).json({
      success: true,
      data: {
        message: "Password changed successfully",
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Upload or Update Profile Picture
 * Handles file storage, deletes the previous image file to save space,
 * and updates the database record
 */
async function uploadProfilePicture(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file provided",
      });
    }

    const userId = req.user.id;
    // Construct the public URL for the new image
    const newFileUrl = `/api/users/profile/picture/${req.file.filename}`;

    // Retrieve the existing profile picture URL
    const users = await db.query(
      "SELECT image as profile_picture_url FROM users WHERE id = ?",
      [userId]
    );

    if (users.length === 0) {
      // Remove the uploaded file if the user does not exist
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const oldProfilePictureUrl = users[0].profile_picture_url;

    // Delete the old physical file if it exists
    if (oldProfilePictureUrl) {
      const oldFilename = oldProfilePictureUrl.split("/").pop();
      const oldFilePath = path.join("uploads", "profile-pictures", oldFilename);

      try {
        await fs.unlink(oldFilePath);
      } catch (error) {
        // Log error but proceed if file deletion fails (e.g., file already missing)
        if (error.code !== "ENOENT")
          console.error("Error deleting old pic:", error);
      }
    }

    // Update the database with the new image URL
    await db.execute(
      "UPDATE users SET image = ?, updated_at = NOW() WHERE id = ?",
      [newFileUrl, userId]
    );

    res.status(200).json({
      success: true,
      data: {
        profile_picture_url: newFileUrl,
        message: "Profile picture uploaded successfully",
      },
    });
  } catch (error) {
    // Cleanup the uploaded file if an error occurs during processing
    if (req.file && req.file.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePicture,
};
