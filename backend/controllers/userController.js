const db = require('../db/connection');
const fs = require('fs').promises;
const path = require('path');
const UserService = require('../services/userService');
const UserRepository = require('../repositories/userRepository');

/**
 * Retrieve authenticated user profile details
 * Fetches user information based on the ID from the verified token
 * * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getProfile(req, res, next) {
  try {
    // Use repository method to get user (handles soft deletion automatically)
    const user = await UserRepository.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    
    // Format response using service method
    const userResponse = UserService.formatUserResponse(user);
    
    res.status(200).json({
      success: true,
      data: userResponse
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

/**
 * Create a new user (Admin only)
 * Requirements: 1.1, 1.4, 1.5
 * 
 * @param {Object} req - Express request object with user data in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function createUser(req, res, next) {
  try {
    // Prepare and validate user data
    const userData = await UserService.prepareUserDataForStorage(req.body, false);
    
    // Check email uniqueness
    const isEmailUnique = await UserRepository.isEmailUnique(userData.email);
    if (!isEmailUnique) {
      return res.status(409).json({
        success: false,
        error: 'Email address already exists',
        details: {
          field: 'email',
          code: 'DUPLICATE_EMAIL'
        }
      });
    }
    
    // Create user
    const newUser = await UserRepository.create(userData);
    
    // Format response (exclude sensitive data)
    const userResponse = UserService.formatUserResponse(newUser);
    
    res.status(201).json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    if (error.validationErrors) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.validationErrors
      });
    }
    
    if (error.code === 'DUPLICATE_EMAIL') {
      return res.status(409).json({
        success: false,
        error: 'Email address already exists',
        details: {
          field: 'email',
          code: 'DUPLICATE_EMAIL'
        }
      });
    }
    
    next(error);
  }
}

/**
 * Update an existing user (Admin only)
 * Requirements: 2.1, 2.4, 1.5
 * 
 * @param {Object} req - Express request object with user ID in params and update data in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function updateUser(req, res, next) {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID',
        details: {
          field: 'id',
          code: 'INVALID_ID'
        }
      });
    }
    
    // Check if user exists
    const existingUser = await UserRepository.findById(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Prepare and validate update data
    const updateData = await UserService.prepareUserDataForStorage(req.body, true);
    
    // Check email uniqueness if email is being updated
    if (updateData.email && updateData.email !== existingUser.email) {
      const isEmailUnique = await UserRepository.isEmailUnique(updateData.email, userId);
      if (!isEmailUnique) {
        return res.status(409).json({
          success: false,
          error: 'Email address already exists',
          details: {
            field: 'email',
            code: 'DUPLICATE_EMAIL'
          }
        });
      }
    }
    
    // Update user
    const updatedUser = await UserRepository.update(userId, updateData);
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Format response (exclude sensitive data)
    const userResponse = UserService.formatUserResponse(updatedUser);
    
    res.status(200).json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    if (error.validationErrors) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.validationErrors
      });
    }
    
    if (error.code === 'DUPLICATE_EMAIL') {
      return res.status(409).json({
        success: false,
        error: 'Email address already exists',
        details: {
          field: 'email',
          code: 'DUPLICATE_EMAIL'
        }
      });
    }
    
    next(error);
  }
}

/**
 * Delete a user (Admin only) - Soft delete with referential integrity handling
 * Requirements: 3.1, 3.3, 3.4
 * 
 * @param {Object} req - Express request object with user ID in params
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function deleteUser(req, res, next) {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID',
        details: {
          field: 'id',
          code: 'INVALID_ID'
        }
      });
    }
    
    // Check if user exists
    const existingUser = await UserRepository.findById(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Prevent admin from deleting themselves
    if (req.user && req.user.id === userId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete your own account',
        details: {
          code: 'SELF_DELETE_FORBIDDEN'
        }
      });
    }
    
    // Check referential integrity and get related data info
    // Requirements: 3.3 - Referential integrity maintenance
    const deleteCheck = await UserRepository.canUserBeDeleted(userId);
    
    // Perform soft delete
    const deleted = await UserRepository.softDelete(userId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Requirements: 3.4 - Deletion confirmation response
    res.status(200).json({
      success: true,
      data: {
        message: 'User deleted successfully',
        deletedUserId: userId,
        referentialIntegrity: {
          relatedDataHandled: deleteCheck.relatedData.hasRelatedData,
          testResults: deleteCheck.relatedData.testResults,
          insights: deleteCheck.relatedData.insights,
          note: deleteCheck.cascadeInfo.message
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get user by ID (Admin or self)
 * Requirements: 2.1, 2.4
 * 
 * @param {Object} req - Express request object with user ID in params
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getUserById(req, res, next) {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID',
        details: {
          field: 'id',
          code: 'INVALID_ID'
        }
      });
    }
    
    // Authorization is handled by verifyOwnershipOrAdmin middleware
    
    // Find user
    const user = await UserRepository.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Format response (include private fields for admin)
    const userResponse = UserService.formatUserResponse(user, req.user.role === 'admin');
    
    res.status(200).json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all users (Admin only)
 * Requirements: 2.1, 2.4
 * 
 * @param {Object} req - Express request object with optional query parameters
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function getAllUsers(req, res, next) {
  try {
    // Parse query parameters for filtering and pagination
    const filters = {};
    const options = {};
    
    // Filter parameters
    if (req.query.role) {
      filters.role = req.query.role;
    }
    if (req.query.learning_style) {
      filters.learning_style = req.query.learning_style;
    }
    if (req.query.learning_pattern) {
      filters.learning_pattern = req.query.learning_pattern;
    }
    
    // Pagination parameters
    if (req.query.limit) {
      const limit = parseInt(req.query.limit);
      if (!isNaN(limit) && limit > 0 && limit <= 100) {
        options.limit = limit;
      }
    }
    
    if (req.query.offset) {
      const offset = parseInt(req.query.offset);
      if (!isNaN(offset) && offset >= 0) {
        options.offset = offset;
      }
    }
    
    // Sorting parameters
    if (req.query.sortBy) {
      const allowedSortFields = ['id', 'email', 'username', 'role', 'created_at', 'updated_at'];
      if (allowedSortFields.includes(req.query.sortBy)) {
        options.sortBy = req.query.sortBy;
      }
    }
    
    if (req.query.sortOrder) {
      const allowedSortOrders = ['ASC', 'DESC'];
      if (allowedSortOrders.includes(req.query.sortOrder.toUpperCase())) {
        options.sortOrder = req.query.sortOrder.toUpperCase();
      }
    }
    
    // Get users and total count
    const [users, totalCount] = await Promise.all([
      UserRepository.findAll(filters, options),
      UserRepository.count(filters)
    ]);
    
    // Format response data
    const usersResponse = users.map(user => UserService.formatUserResponse(user, true));
    
    res.status(200).json({
      success: true,
      data: {
        users: usersResponse,
        pagination: {
          total: totalCount,
          limit: options.limit || null,
          offset: options.offset || 0,
          hasMore: options.limit ? (options.offset || 0) + options.limit < totalCount : false
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update user profile (Self only)
 * Requirements: 4.1, 4.4
 * 
 * @param {Object} req - Express request object with update data in body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    
    // Restricted fields that users cannot update themselves
    const restrictedFields = ['role', 'id'];
    const hasRestrictedFields = restrictedFields.some(field => req.body[field] !== undefined);
    
    if (hasRestrictedFields) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Cannot update restricted fields.',
        details: {
          restrictedFields: restrictedFields,
          code: 'RESTRICTED_FIELD_UPDATE'
        }
      });
    }
    
    // Check if user exists
    const existingUser = await UserRepository.findById(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Prepare and validate update data
    const updateData = await UserService.prepareUserDataForStorage(req.body, true);
    
    // Check email uniqueness if email is being updated
    if (updateData.email && updateData.email !== existingUser.email) {
      const isEmailUnique = await UserRepository.isEmailUnique(updateData.email, userId);
      if (!isEmailUnique) {
        return res.status(409).json({
          success: false,
          error: 'Email address already exists',
          details: {
            field: 'email',
            code: 'DUPLICATE_EMAIL'
          }
        });
      }
      
      // TODO: Requirement 4.5 - Implement email verification before applying email changes
      // Currently email changes are applied immediately without verification
      // This should be enhanced to send verification email and only update after confirmation
    }
    
    // Update user profile
    const updatedUser = await UserRepository.update(userId, updateData);
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Format response (exclude sensitive data)
    const userResponse = UserService.formatUserResponse(updatedUser);
    
    res.status(200).json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    if (error.validationErrors) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.validationErrors
      });
    }
    
    if (error.code === 'DUPLICATE_EMAIL') {
      return res.status(409).json({
        success: false,
        error: 'Email address already exists',
        details: {
          field: 'email',
          code: 'DUPLICATE_EMAIL'
        }
      });
    }
    
    next(error);
  }
}

/**
 * Delete user profile (Self only) - Soft delete with referential integrity handling
 * Requirements: 3.1, 3.3, 3.4, 3.5
 * 
 * @param {Object} req - Express request object with authenticated user
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function deleteProfile(req, res, next) {
  try {
    const userId = req.user.id;
    
    // Check if user exists
    const existingUser = await UserRepository.findById(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check referential integrity and get related data info
    // Requirements: 3.3 - Referential integrity maintenance
    const deleteCheck = await UserRepository.canUserBeDeleted(userId);
    
    // Perform soft delete
    const deleted = await UserRepository.softDelete(userId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Requirements: 3.4 - Deletion confirmation response
    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully',
      data: {
        deletedUserId: userId,
        referentialIntegrity: {
          relatedDataHandled: deleteCheck.relatedData.hasRelatedData,
          testResults: deleteCheck.relatedData.testResults,
          insights: deleteCheck.relatedData.insights,
          note: deleteCheck.cascadeInfo.message
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  uploadProfilePicture,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getAllUsers,
  updateProfile,
  deleteProfile
};
