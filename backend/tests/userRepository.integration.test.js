const UserRepository = require('../repositories/userRepository');
const UserService = require('../services/userService');

describe('UserRepository Integration Tests', () => {
  let testUserId;
  let db;
  
  // Clean up any existing test data before starting
  beforeAll(async () => {
    try {
      // Hard delete any existing test user to ensure clean state
      db = require('../db/connection');
      await db.execute('DELETE FROM users WHERE email = ?', ['test-repo@example.com']);
      console.log('Cleaned up existing test data');
    } catch (error) {
      // Ignore cleanup errors
      console.log('Cleanup note: No existing test data to clean');
    }
  });

  afterAll(async () => {
    // Close database connection
    try {
      if (db && db.close) {
        await db.close();
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  });
  
  describe('CRUD Operations', () => {
    test('should create a new user successfully', async () => {
      const userData = {
        email: 'test-repo@example.com',
        username: 'testrepouser',
        password: await UserService.hashUserPassword('TestPass123!'),
        role: 'user',
        learning_style: 'visual',
        learning_pattern: 'consistent'
      };
      
      const createdUser = await UserRepository.create(userData);
      
      expect(createdUser).toBeTruthy();
      expect(createdUser.id).toBeDefined();
      expect(createdUser.email).toBe('test-repo@example.com');
      expect(createdUser.username).toBe('testrepouser');
      expect(createdUser.role).toBe('user');
      expect(createdUser.learning_style).toBe('visual');
      expect(createdUser.learning_pattern).toBe('consistent');
      
      testUserId = createdUser.id;
    });
    
    test('should find the created user by ID', async () => {
      const user = await UserRepository.findById(testUserId);
      
      expect(user).toBeTruthy();
      expect(user.id).toBe(testUserId);
      expect(user.email).toBe('test-repo@example.com');
      expect(user.username).toBe('testrepouser');
    });
    
    test('should find the created user by email', async () => {
      const user = await UserRepository.findByEmail('test-repo@example.com');
      
      expect(user).toBeTruthy();
      expect(user.id).toBe(testUserId);
      expect(user.email).toBe('test-repo@example.com');
      expect(user.username).toBe('testrepouser');
    });
    
    test('should update user information', async () => {
      const updateData = {
        username: 'updatedrepouser',
        learning_style: 'auditori'
      };
      
      const updatedUser = await UserRepository.update(testUserId, updateData);
      
      expect(updatedUser).toBeTruthy();
      expect(updatedUser.id).toBe(testUserId);
      expect(updatedUser.username).toBe('updatedrepouser');
      expect(updatedUser.learning_style).toBe('auditori');
      expect(updatedUser.email).toBe('test-repo@example.com'); // Should remain unchanged
    });
    
    test('should check if user exists', async () => {
      const exists = await UserRepository.exists(testUserId);
      expect(exists).toBe(true);
      
      const notExists = await UserRepository.exists(999999);
      expect(notExists).toBe(false);
    });
    
    test('should check email uniqueness', async () => {
      // Email should not be unique (already exists)
      const notUnique = await UserRepository.isEmailUnique('test-repo@example.com');
      expect(notUnique).toBe(false);
      
      // Email should be unique when excluding the current user
      const uniqueWithExclusion = await UserRepository.isEmailUnique('test-repo@example.com', testUserId);
      expect(uniqueWithExclusion).toBe(true);
      
      // New email should be unique
      const newEmailUnique = await UserRepository.isEmailUnique('new-unique@example.com');
      expect(newEmailUnique).toBe(true);
    });
    
    test('should handle duplicate email creation', async () => {
      const duplicateUserData = {
        email: 'test-repo@example.com', // Same email as created user
        username: 'anotheruser',
        password: await UserService.hashUserPassword('TestPass123!'),
        role: 'user',
        learning_style: 'visual',
        learning_pattern: 'consistent'
      };
      
      await expect(UserRepository.create(duplicateUserData)).rejects.toThrow('Email address already exists');
    });
    
    test('should delete the created user', async () => {
      const deleted = await UserRepository.softDelete(testUserId);
      expect(deleted).toBe(true);
      
      // User should no longer exist
      const user = await UserRepository.findById(testUserId);
      expect(user).toBeNull();
      
      const exists = await UserRepository.exists(testUserId);
      expect(exists).toBe(false);
    });
    
    test('should return false when trying to delete non-existent user', async () => {
      const deleted = await UserRepository.softDelete(999999);
      expect(deleted).toBe(false);
    });
  });
  
  describe('Query Operations', () => {
    test('should find all users with filters', async () => {
      const adminUsers = await UserRepository.findAll({ role: 'admin' });
      expect(Array.isArray(adminUsers)).toBe(true);
      
      adminUsers.forEach(user => {
        expect(user.role).toBe('admin');
      });
    });
    
    test('should count users with filters', async () => {
      const totalCount = await UserRepository.count();
      expect(typeof totalCount).toBe('number');
      expect(totalCount).toBeGreaterThanOrEqual(0);
      
      const adminCount = await UserRepository.count({ role: 'admin' });
      expect(typeof adminCount).toBe('number');
      expect(adminCount).toBeLessThanOrEqual(totalCount);
    });
    
    test('should handle pagination', async () => {
      const firstPage = await UserRepository.findAll({}, { limit: 2, offset: 0 });
      expect(Array.isArray(firstPage)).toBe(true);
      expect(firstPage.length).toBeLessThanOrEqual(2);
      
      const secondPage = await UserRepository.findAll({}, { limit: 2, offset: 2 });
      expect(Array.isArray(secondPage)).toBe(true);
      expect(secondPage.length).toBeLessThanOrEqual(2);
    });
  });
});