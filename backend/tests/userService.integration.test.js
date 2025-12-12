const UserService = require('../services/userService');

describe('UserService Integration Tests', () => {
  describe('hashUserPassword', () => {
    test('should hash password successfully', async () => {
      const password = 'StrongPass123!';
      const hashedPassword = await UserService.hashUserPassword(password);
      
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(50); // bcrypt hashes are typically 60 chars
    });
    
    test('should throw error for invalid password', async () => {
      await expect(UserService.hashUserPassword(null)).rejects.toThrow('Password is required for hashing');
      await expect(UserService.hashUserPassword('')).rejects.toThrow('Password is required for hashing');
    });
  });
  
  describe('prepareUserDataForStorage', () => {
    test('should prepare valid user data with hashed password', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'StrongPass123!',
        role: 'user',
        learning_style: 'visual',
        learning_pattern: 'consistent'
      };
      
      const prepared = await UserService.prepareUserDataForStorage(userData);
      
      expect(prepared.email).toBe('test@example.com');
      expect(prepared.username).toBe('testuser');
      expect(prepared.password).not.toBe('StrongPass123!'); // Should be hashed
      expect(prepared.password.length).toBeGreaterThan(50); // bcrypt hash length
      expect(prepared.role).toBe('user');
    });
    
    test('should throw validation error for invalid data', async () => {
      const invalidData = {
        email: 'invalid-email',
        username: 'ab', // too short
        password: 'weak'
      };
      
      await expect(UserService.prepareUserDataForStorage(invalidData)).rejects.toThrow('Validation failed');
    });
  });
  
  describe('formatUserResponse', () => {
    test('should format user response excluding sensitive data', () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashed_password_here',
        role: 'user',
        learning_style: 'visual',
        learning_pattern: 'consistent',
        image: '/path/to/image.jpg',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        deleted_at: null
      };
      
      const formatted = UserService.formatUserResponse(user);
      
      expect(formatted.id).toBe(1);
      expect(formatted.email).toBe('test@example.com');
      expect(formatted.password).toBeUndefined(); // Should not include password
      expect(formatted.profile_picture_url).toBe('/path/to/image.jpg');
      expect(formatted.deleted_at).toBeUndefined(); // Should not include deleted_at by default
    });
    
    test('should include private fields when requested', () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        role: 'user',
        learning_style: 'visual',
        learning_pattern: 'consistent',
        deleted_at: '2024-01-01T00:00:00Z'
      };
      
      const formatted = UserService.formatUserResponse(user, true);
      
      expect(formatted.deleted_at).toBe('2024-01-01T00:00:00Z');
    });
  });
});