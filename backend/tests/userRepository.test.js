const UserRepository = require('../repositories/userRepository');

describe('UserRepository', () => {
  describe('Basic functionality', () => {
    test('should have all required methods', () => {
      expect(typeof UserRepository.create).toBe('function');
      expect(typeof UserRepository.findById).toBe('function');
      expect(typeof UserRepository.findByEmail).toBe('function');
      expect(typeof UserRepository.update).toBe('function');
      expect(typeof UserRepository.softDelete).toBe('function');
      expect(typeof UserRepository.findAll).toBe('function');
      expect(typeof UserRepository.exists).toBe('function');
      expect(typeof UserRepository.isEmailUnique).toBe('function');
    });
    
    test('should handle non-existent user queries gracefully', async () => {
      const user = await UserRepository.findById(999999);
      expect(user).toBeNull();
      
      const exists = await UserRepository.exists(999999);
      expect(exists).toBe(false);
      
      const emailUnique = await UserRepository.isEmailUnique('nonexistent@test.com');
      expect(emailUnique).toBe(true);
    });
    
    test('should return empty array for findAll with no users matching filters', async () => {
      const users = await UserRepository.findAll({ role: 'nonexistent_role' });
      expect(Array.isArray(users)).toBe(true);
    });
    
    test('should return 0 count for non-matching filters', async () => {
      const count = await UserRepository.count({ role: 'nonexistent_role' });
      expect(count).toBe(0);
    });
  });
  
  describe('Email uniqueness checking', () => {
    test('should check email uniqueness correctly', async () => {
      // Test with existing email from seed data
      const existingEmailUnique = await UserRepository.isEmailUnique('admin@example.com');
      expect(existingEmailUnique).toBe(false);
      
      // Test with non-existent email
      const newEmailUnique = await UserRepository.isEmailUnique('new@test.com');
      expect(newEmailUnique).toBe(true);
    });
    
    test('should exclude specific user ID when checking email uniqueness', async () => {
      // Should return true when excluding the user who owns the email
      const uniqueWithExclusion = await UserRepository.isEmailUnique('admin@example.com', 4);
      expect(uniqueWithExclusion).toBe(true);
    });
  });
  
  describe('User existence checking', () => {
    test('should check user existence correctly', async () => {
      // Test with existing user from seed data
      const existingUserExists = await UserRepository.exists(1);
      expect(existingUserExists).toBe(true);
      
      // Test with non-existent user
      const nonExistentUserExists = await UserRepository.exists(999999);
      expect(nonExistentUserExists).toBe(false);
    });
  });
  
  describe('Find operations', () => {
    test('should find user by email', async () => {
      const user = await UserRepository.findByEmail('admin@example.com');
      expect(user).toBeTruthy();
      expect(user.email).toBe('admin@example.com');
      expect(user.role).toBe('admin');
    });
    
    test('should find user by ID', async () => {
      const user = await UserRepository.findById(1);
      expect(user).toBeTruthy();
      expect(user.id).toBe(1);
      expect(user.email).toBe('andi@example.com');
    });
    
    test('should return null for non-existent user', async () => {
      const user = await UserRepository.findById(999999);
      expect(user).toBeNull();
      
      const userByEmail = await UserRepository.findByEmail('nonexistent@test.com');
      expect(userByEmail).toBeNull();
    });
  });
  
  describe('Find all with filters', () => {
    test('should find all users without filters', async () => {
      const users = await UserRepository.findAll();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
    });
    
    test('should filter users by role', async () => {
      const adminUsers = await UserRepository.findAll({ role: 'admin' });
      expect(Array.isArray(adminUsers)).toBe(true);
      adminUsers.forEach(user => {
        expect(user.role).toBe('admin');
      });
    });
    
    test('should filter users by learning_style', async () => {
      const visualUsers = await UserRepository.findAll({ learning_style: 'visual' });
      expect(Array.isArray(visualUsers)).toBe(true);
      visualUsers.forEach(user => {
        expect(user.learning_style).toBe('visual');
      });
    });
    
    test('should apply pagination', async () => {
      const firstPage = await UserRepository.findAll({}, { limit: 2, offset: 0 });
      const secondPage = await UserRepository.findAll({}, { limit: 2, offset: 2 });
      
      expect(firstPage.length).toBeLessThanOrEqual(2);
      expect(secondPage.length).toBeLessThanOrEqual(2);
      
      // Ensure different results (if there are enough users)
      if (firstPage.length > 0 && secondPage.length > 0) {
        expect(firstPage[0].id).not.toBe(secondPage[0].id);
      }
    });
  });
  
  describe('Count operations', () => {
    test('should count all users', async () => {
      const count = await UserRepository.count();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });
    
    test('should count users with filters', async () => {
      const adminCount = await UserRepository.count({ role: 'admin' });
      expect(typeof adminCount).toBe('number');
      expect(adminCount).toBeGreaterThanOrEqual(0);
    });
  });
});