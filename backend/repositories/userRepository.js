const db = require('../db/connection');

/**
 * User Repository Layer
 * Provides database access methods for user CRUD operations
 * Requirements: 1.1, 1.2, 2.1, 2.2, 3.1, 3.2
 */
class UserRepository {
  
  /**
   * Create a new user in the database
   * Requirements: 1.1
   * @param {Object} userData - User data to insert
   * @returns {Promise<Object>} Created user with ID
   */
  static async create(userData) {
    try {
      const {
        email,
        username,
        password,
        role,
        learning_style,
        learning_pattern,
        image = null
      } = userData;
      
      const result = await db.execute(
        `INSERT INTO users (email, username, password, role, learning_style, learning_pattern, image) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [email, username, password, role, learning_style, learning_pattern, image]
      );
      
      // Return the created user with the new ID
      return await this.findById(result.insertId);
    } catch (error) {
      // Handle duplicate email error specifically
      if (error.code === 'ER_DUP_ENTRY') {
        const duplicateError = new Error('Email address already exists');
        duplicateError.code = 'DUPLICATE_EMAIL';
        throw duplicateError;
      }
      throw error;
    }
  }
  
  /**
   * Find user by ID (excluding soft deleted users)
   * Requirements: 2.1, 2.2
   * @param {number} id - User ID
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async findById(id) {
    try {
      const users = await db.query(
        `SELECT id, email, username, password, role, learning_style, learning_pattern, 
                image, created_at, updated_at, deleted_at
         FROM users 
         WHERE id = ? AND deleted_at IS NULL`,
        [id]
      );
      
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Find user by email (excluding soft deleted users)
   * Requirements: 1.2, 2.5
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async findByEmail(email) {
    try {
      const users = await db.query(
        `SELECT id, email, username, password, role, learning_style, learning_pattern, 
                image, created_at, updated_at, deleted_at
         FROM users 
         WHERE email = ? AND deleted_at IS NULL`,
        [email]
      );
      
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Update user by ID
   * Requirements: 2.1
   * @param {number} id - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated user object or null if not found
   */
  static async update(id, updateData) {
    try {
      // First check if user exists and is not deleted
      const existingUser = await this.findById(id);
      if (!existingUser) {
        return null;
      }
      
      // Build dynamic update query based on provided fields
      const updateFields = [];
      const updateValues = [];
      
      const allowedFields = ['email', 'username', 'password', 'role', 'learning_style', 'learning_pattern', 'image'];
      
      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          updateFields.push(`${field} = ?`);
          updateValues.push(updateData[field]);
        }
      }
      
      if (updateFields.length === 0) {
        // No fields to update, return existing user
        return existingUser;
      }
      
      // Add ID for WHERE clause
      updateValues.push(id);
      
      const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
      
      const result = await db.execute(updateQuery, updateValues);
      
      if (result.affectedRows === 0) {
        return null;
      }
      
      // Return updated user
      return await this.findById(id);
    } catch (error) {
      // Handle duplicate email error specifically
      if (error.code === 'ER_DUP_ENTRY') {
        const duplicateError = new Error('Email address already exists');
        duplicateError.code = 'DUPLICATE_EMAIL';
        throw duplicateError;
      }
      throw error;
    }
  }
  
  /**
   * Soft delete user by ID
   * Requirements: 3.1
   * @param {number} id - User ID
   * @returns {Promise<boolean>} True if user was deleted, false if not found
   */
  static async softDelete(id) {
    try {
      // Check if user exists and is not already deleted
      const existingUser = await this.findById(id);
      if (!existingUser) {
        return false;
      }
      
      // Perform soft delete by setting deleted_at timestamp
      const result = await db.execute(
        'UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Find all users with optional filters (excluding soft deleted users)
   * Requirements: 2.1
   * @param {Object} filters - Optional filters (role, learning_style, etc.)
   * @param {Object} options - Optional pagination and sorting options
   * @returns {Promise<Array>} Array of user objects
   */
  static async findAll(filters = {}, options = {}) {
    try {
      let query = `SELECT id, email, username, role, learning_style, learning_pattern, 
                          image, created_at, updated_at, deleted_at
                   FROM users 
                   WHERE deleted_at IS NULL`;
      
      const queryParams = [];
      
      // Apply filters
      if (filters.role) {
        query += ' AND role = ?';
        queryParams.push(filters.role);
      }
      
      if (filters.learning_style) {
        query += ' AND learning_style = ?';
        queryParams.push(filters.learning_style);
      }
      
      if (filters.learning_pattern) {
        query += ' AND learning_pattern = ?';
        queryParams.push(filters.learning_pattern);
      }
      
      // Apply sorting
      const sortBy = options.sortBy || 'id';
      const sortOrder = options.sortOrder || 'DESC';
      query += ` ORDER BY ${sortBy} ${sortOrder}`;
      
      // Apply pagination
      if (options.limit) {
        query += ' LIMIT ?';
        queryParams.push(parseInt(options.limit));
        
        if (options.offset) {
          query += ' OFFSET ?';
          queryParams.push(parseInt(options.offset));
        }
      }
      
      const users = await db.query(query, queryParams);
      return users;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Check if user exists by ID (excluding soft deleted users)
   * Requirements: 2.2, 3.2
   * @param {number} id - User ID
   * @returns {Promise<boolean>} True if user exists, false otherwise
   */
  static async exists(id) {
    try {
      const users = await db.query(
        'SELECT 1 FROM users WHERE id = ? AND deleted_at IS NULL',
        [id]
      );
      
      return users.length > 0;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Check if email is unique (excluding soft deleted users and optionally excluding a specific user)
   * Requirements: 1.2, 2.5
   * @param {string} email - Email to check
   * @param {number} excludeUserId - Optional user ID to exclude from check (for updates)
   * @returns {Promise<boolean>} True if email is unique, false if already exists
   */
  static async isEmailUnique(email, excludeUserId = null) {
    try {
      let query = 'SELECT 1 FROM users WHERE email = ? AND deleted_at IS NULL';
      const params = [email];
      
      if (excludeUserId) {
        query += ' AND id != ?';
        params.push(excludeUserId);
      }
      
      const users = await db.query(query, params);
      return users.length === 0;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Find user by ID including soft deleted users (for admin purposes)
   * Requirements: 3.1
   * @param {number} id - User ID
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async findByIdIncludingDeleted(id) {
    try {
      const users = await db.query(
        `SELECT id, email, username, password, role, learning_style, learning_pattern, 
                image, created_at, updated_at, deleted_at
         FROM users 
         WHERE id = ?`,
        [id]
      );
      
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Restore a soft deleted user
   * Requirements: 3.1
   * @param {number} id - User ID
   * @returns {Promise<boolean>} True if user was restored, false if not found
   */
  static async restore(id) {
    try {
      // Restore user by setting deleted_at to NULL
      const result = await db.execute(
        'UPDATE users SET deleted_at = NULL WHERE id = ? AND deleted_at IS NOT NULL',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Count total users (excluding soft deleted)
   * @param {Object} filters - Optional filters
   * @returns {Promise<number>} Total count of users
   */
  static async count(filters = {}) {
    try {
      let query = 'SELECT COUNT(*) as total FROM users WHERE deleted_at IS NULL';
      const queryParams = [];
      
      // Apply filters
      if (filters.role) {
        query += ' AND role = ?';
        queryParams.push(filters.role);
      }
      
      if (filters.learning_style) {
        query += ' AND learning_style = ?';
        queryParams.push(filters.learning_style);
      }
      
      if (filters.learning_pattern) {
        query += ' AND learning_pattern = ?';
        queryParams.push(filters.learning_pattern);
      }
      
      const result = await db.query(query, queryParams);
      return result[0].total;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get user's related data count for referential integrity checks
   * Requirements: 3.3
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Object containing counts of related data
   */
  static async getUserRelatedDataCount(userId) {
    try {
      const [testResults, insights] = await Promise.all([
        db.query('SELECT COUNT(*) as count FROM hasil_test WHERE user_id = ?', [userId]),
        db.query('SELECT COUNT(*) as count FROM insight WHERE user_id = ?', [userId])
      ]);
      
      return {
        testResults: testResults[0].count,
        insights: insights[0].count,
        hasRelatedData: testResults[0].count > 0 || insights[0].count > 0
      };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Check if user can be safely deleted (has no related data or cascade is acceptable)
   * Requirements: 3.3
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Object with canDelete boolean and related data info
   */
  static async canUserBeDeleted(userId) {
    try {
      const relatedData = await this.getUserRelatedDataCount(userId);
      
      // Since the database has CASCADE DELETE constraints, deletion is always safe
      // but we return the related data info for logging/confirmation purposes
      return {
        canDelete: true,
        relatedData: relatedData,
        cascadeInfo: {
          testResults: relatedData.testResults,
          insights: relatedData.insights,
          message: relatedData.hasRelatedData 
            ? 'User has related data that will be cascade deleted'
            : 'User has no related data'
        }
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserRepository;