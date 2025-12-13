const UserService = require('../services/userService');

describe('UserService', () => {
  describe('validateEmailFormat', () => {
    test('should validate correct email formats', () => {
      expect(UserService.validateEmailFormat('test@example.com')).toBe(true);
      expect(UserService.validateEmailFormat('user.name+tag@domain.co.uk')).toBe(true);
      expect(UserService.validateEmailFormat('user123@test-domain.org')).toBe(true);
    });
    
    test('should reject invalid email formats', () => {
      expect(UserService.validateEmailFormat('invalid-email')).toBe(false);
      expect(UserService.validateEmailFormat('test@')).toBe(false);
      expect(UserService.validateEmailFormat('@domain.com')).toBe(false);
      expect(UserService.validateEmailFormat('')).toBe(false);
      expect(UserService.validateEmailFormat(null)).toBe(false);
    });
  });
  
  describe('validatePasswordSecurity', () => {
    test('should validate strong passwords', () => {
      const result = UserService.validatePasswordSecurity('StrongPass123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    test('should reject weak passwords', () => {
      const result = UserService.validatePasswordSecurity('weak');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
    
    test('should require minimum 8 characters', () => {
      const result = UserService.validatePasswordSecurity('Short1!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });
  });
  
  describe('sanitizeInput', () => {
    test('should sanitize dangerous characters', () => {
      const input = '<script>alert("xss")</script>';
      const sanitized = UserService.sanitizeInput(input);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('&lt;script&gt;');
    });
    
    test('should trim whitespace', () => {
      const input = '  test  ';
      const sanitized = UserService.sanitizeInput(input);
      expect(sanitized).toBe('test');
    });
    
    test('should handle null and undefined inputs', () => {
      expect(UserService.sanitizeInput(null)).toBe('');
      expect(UserService.sanitizeInput(undefined)).toBe('');
    });
  });
  
  describe('validateUserData', () => {
    const validUserData = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'StrongPass123!',
      role: 'user',
      learning_style: 'visual',
      learning_pattern: 'consistent'
    };
    
    test('should validate complete user data', () => {
      const result = UserService.validateUserData(validUserData);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });
    
    test('should require all fields for creation', () => {
      const incompleteData = { email: 'test@example.com' };
      const result = UserService.validateUserData(incompleteData);
      expect(result.isValid).toBe(false);
      expect(result.errors.username).toBeDefined();
      expect(result.errors.password).toBeDefined();
    });
    
    test('should allow partial data for updates', () => {
      const updateData = { email: 'newemail@example.com' };
      const result = UserService.validateUserData(updateData, true);
      expect(result.isValid).toBe(true);
    });
  });
  
  describe('sanitizeUserData', () => {
    test('should sanitize user data object', () => {
      const userData = {
        email: 'test@example.com',
        username: '<script>alert("xss")</script>',
        password: 'StrongPass123!',
        role: 'user'
      };
      
      const sanitized = UserService.sanitizeUserData(userData);
      expect(sanitized.username).not.toContain('<script>');
      expect(sanitized.password).toBe('StrongPass123!'); // Password should not be sanitized
    });
  });
});