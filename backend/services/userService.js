const { hashPassword } = require('../utils/auth');

/**
 * User Service Layer
 * Provides validation methods and business logic for user management operations
 * Requirements: 5.1, 5.2, 5.3, 5.5
 */
class UserService {
  
  /**
   * Validate email format according to RFC standards
   * Requirements: 5.1
   * @param {string} email - Email address to validate
   * @returns {boolean} True if email format is valid
   */
  static validateEmailFormat(email) {
    if (!email || typeof email !== 'string') {
      return false;
    }
    
    // RFC 5322 compliant email regex (simplified but comprehensive)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    return emailRegex.test(email) && email.length <= 254; // RFC 5321 length limit
  }
  
  /**
   * Validate password security requirements
   * Requirements: 5.2
   * @param {string} password - Password to validate
   * @returns {Object} Validation result with isValid boolean and errors array
   */
  static validatePasswordSecurity(password) {
    const errors = [];
    
    if (!password || typeof password !== 'string') {
      errors.push('Password is required');
      return { isValid: false, errors };
    }
    
    // Minimum 8 characters
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    // Maximum reasonable length to prevent DoS
    if (password.length > 128) {
      errors.push('Password must be less than 128 characters');
    }
    
    // At least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    // At least one lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    // At least one number
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    // At least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Sanitize user input to prevent injection attacks
   * Requirements: 5.3
   * @param {string} input - Input string to sanitize
   * @returns {string} Sanitized input
   */
  static sanitizeInput(input) {
    if (!input || typeof input !== 'string') {
      return '';
    }
    
    // Remove null bytes
    let sanitized = input.replace(/\0/g, '');
    
    // Trim whitespace
    sanitized = sanitized.trim();
    
    // Remove or escape potentially dangerous characters for SQL injection prevention
    // Note: We rely on parameterized queries as primary defense, this is additional layer
    sanitized = sanitized.replace(/[<>'"&]/g, (match) => {
      const escapeMap = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return escapeMap[match];
    });
    
    return sanitized;
  }
  
  /**
   * Sanitize user data object
   * Requirements: 5.3
   * @param {Object} userData - User data object to sanitize
   * @returns {Object} Sanitized user data object
   */
  static sanitizeUserData(userData) {
    if (!userData || typeof userData !== 'object') {
      return {};
    }
    
    const sanitized = {};
    
    // Sanitize string fields
    const stringFields = ['email', 'username', 'learning_style', 'learning_pattern', 'role'];
    
    for (const field of stringFields) {
      if (userData[field] !== undefined) {
        sanitized[field] = this.sanitizeInput(userData[field]);
      }
    }
    
    // Password should not be sanitized (only validated) as it may contain special chars intentionally
    if (userData.password !== undefined) {
      sanitized.password = userData.password;
    }
    
    // Image field (URL) - basic sanitization
    if (userData.image !== undefined) {
      sanitized.image = this.sanitizeInput(userData.image);
    }
    
    return sanitized;
  }
  
  /**
   * Validate required fields for user creation
   * Requirements: 1.3, 5.1, 5.2
   * @param {Object} userData - User data to validate
   * @param {boolean} isUpdate - Whether this is an update operation (makes some fields optional)
   * @returns {Object} Validation result with isValid boolean and errors object
   */
  static validateUserData(userData, isUpdate = false) {
    const errors = {};
    let isValid = true;
    
    if (!userData || typeof userData !== 'object') {
      return {
        isValid: false,
        errors: { general: 'User data is required and must be an object' }
      };
    }
    
    // Required fields for creation
    const requiredFields = ['email', 'username', 'password', 'role', 'learning_style', 'learning_pattern'];
    
    // Check required fields (only for creation, not updates)
    if (!isUpdate) {
      for (const field of requiredFields) {
        if (!userData[field] || (typeof userData[field] === 'string' && userData[field].trim() === '')) {
          errors[field] = `${field} is required`;
          isValid = false;
        }
      }
    }
    
    // Validate email format if provided
    if (userData.email !== undefined) {
      if (!this.validateEmailFormat(userData.email)) {
        errors.email = 'Invalid email format';
        isValid = false;
      }
    }
    
    // Validate password security if provided
    if (userData.password !== undefined) {
      const passwordValidation = this.validatePasswordSecurity(userData.password);
      if (!passwordValidation.isValid) {
        errors.password = passwordValidation.errors;
        isValid = false;
      }
    }
    
    // Validate username length and format
    if (userData.username !== undefined) {
      if (userData.username.length < 3 || userData.username.length > 50) {
        errors.username = 'Username must be between 3 and 50 characters';
        isValid = false;
      }
      
      // Username should only contain alphanumeric characters, underscores, and hyphens
      if (!/^[a-zA-Z0-9_-]+$/.test(userData.username)) {
        errors.username = 'Username can only contain letters, numbers, underscores, and hyphens';
        isValid = false;
      }
    }
    
    // Validate role
    if (userData.role !== undefined) {
      const validRoles = ['admin', 'user'];
      if (!validRoles.includes(userData.role)) {
        errors.role = 'Role must be either "admin" or "user"';
        isValid = false;
      }
    }
    
    // Validate learning_style
    if (userData.learning_style !== undefined) {
      const validLearningStyles = ['visual', 'auditori', 'kinestetik'];
      if (!validLearningStyles.includes(userData.learning_style)) {
        errors.learning_style = 'Learning style must be "visual", "auditori", or "kinestetik"';
        isValid = false;
      }
    }
    
    // Validate learning_pattern
    if (userData.learning_pattern !== undefined) {
      const validLearningPatterns = ['consistent', 'fast', 'reflective', 'balanced'];
      if (!validLearningPatterns.includes(userData.learning_pattern)) {
        errors.learning_pattern = 'Learning pattern must be "consistent", "fast", "reflective", or "balanced"';
        isValid = false;
      }
    }
    
    return { isValid, errors };
  }
  
  /**
   * Hash password for secure storage
   * Requirements: 5.5
   * @param {string} password - Plain text password
   * @returns {Promise<string>} Hashed password
   */
  static async hashUserPassword(password) {
    if (!password || typeof password !== 'string') {
      throw new Error('Password is required for hashing');
    }
    
    return await hashPassword(password);
  }
  
  /**
   * Format user response data (exclude sensitive information)
   * @param {Object} user - User data from database
   * @param {boolean} includePrivate - Whether to include private fields (for admin)
   * @returns {Object} Formatted user response
   */
  static formatUserResponse(user, includePrivate = false) {
    if (!user) {
      return null;
    }
    
    const response = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      learning_style: user.learning_style,
      learning_pattern: user.learning_pattern,
      profile_picture_url: user.image || user.profile_picture_url || null,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
    
    // Include additional fields for admin or private access
    if (includePrivate) {
      response.deleted_at = user.deleted_at || null;
    }
    
    return response;
  }
  
  /**
   * Prepare user data for database insertion/update
   * Requirements: 5.3, 5.5
   * @param {Object} userData - Raw user data
   * @param {boolean} isUpdate - Whether this is an update operation
   * @returns {Promise<Object>} Prepared user data with hashed password
   */
  static async prepareUserDataForStorage(userData, isUpdate = false) {
    // Sanitize input data
    const sanitizedData = this.sanitizeUserData(userData);
    
    // Validate data
    const validation = this.validateUserData(sanitizedData, isUpdate);
    if (!validation.isValid) {
      const error = new Error('Validation failed');
      error.validationErrors = validation.errors;
      throw error;
    }
    
    // Hash password if provided
    if (sanitizedData.password) {
      sanitizedData.password = await this.hashUserPassword(sanitizedData.password);
    }
    
    return sanitizedData;
  }
}

module.exports = UserService;