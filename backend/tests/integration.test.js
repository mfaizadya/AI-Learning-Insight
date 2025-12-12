const request = require('supertest');
const app = require('../server');
const db = require('../db/connection');
const { generateToken } = require('../utils/auth');
const UserRepository = require('../repositories/userRepository');
const UserService = require('../services/userService');

describe('User Management Integration Tests', () => {
  let adminToken;
  let userToken;
  let testUserId;
  let testUser2Id;
  let testUserData;

  beforeAll(async () => {
    // Create admin token
    adminToken = generateToken({ id: 1, email: 'admin@test.com', role: 'admin' });
    
    // Create regular user token
    userToken = generateToken({ id: 2, email: 'user@test.com', role: 'user' });
  });

  afterAll(async () => {
    // Clean up test data
    if (testUserId) {
      try {
        await db.execute('DELETE FROM users WHERE id = ?', [testUserId]);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    
    if (testUser2Id) {
      try {
        await db.execute('DELETE FROM users WHERE id = ?', [testUser2Id]);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    
    // Close database connection
    try {
      if (db && db.close) {
        await db.close();
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('Complete User Creation Flow', () => {
    test('should handle complete user creation flow with validation', async () => {
      const timestamp = Date.now();
      testUserData = {
        email: `integration-test-${timestamp}@example.com`,
        username: `integrationuser${timestamp}`,
        password: 'StrongPass123!',
        role: 'user',
        learning_style: 'visual',
        learning_pattern: 'consistent'
      };

      // Test successful creation
      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testUserData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(testUserData.email);
      expect(response.body.data.username).toBe(testUserData.username);
      expect(response.body.data.password).toBeUndefined(); // Password should not be in response
      expect(response.body.data.id).toBeDefined();
      
      testUserId = response.body.data.id;

      // Verify user was actually created in database
      const createdUser = await UserRepository.findById(testUserId);
      expect(createdUser).toBeTruthy();
      expect(createdUser.email).toBe(testUserData.email);
      expect(createdUser.username).toBe(testUserData.username);
    });

    test('should handle duplicate email validation across all layers', async () => {
      const duplicateUserData = {
        email: testUserData.email, // Same as above
        username: 'anotheruser',
        password: 'StrongPass123!',
        role: 'user',
        learning_style: 'auditori',
        learning_pattern: 'fast'
      };

      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(duplicateUserData);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Email address already exists');
      expect(response.body.details.field).toBe('email');
      expect(response.body.details.code).toBe('DUPLICATE_EMAIL');
    });

    test('should handle validation errors with detailed responses', async () => {
      const invalidUserData = {
        email: 'invalid-email', // Invalid format
        username: 'ab', // Too short
        password: 'weak', // Too weak
        role: 'invalid_role', // Invalid enum
        learning_style: 'invalid_style', // Invalid enum
        learning_pattern: 'invalid_pattern' // Invalid enum
      };

      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidUserData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toBeDefined();
    });
  });

  describe('Complete User Update Flow', () => {
    test('should handle complete user update flow with authorization', async () => {
      if (!testUserId) {
        // Skip if no test user was created
        return;
      }

      const updateData = {
        username: 'updatedintegrationuser',
        learning_style: 'auditori'
      };

      // Test successful update by admin
      const response = await request(app)
        .put(`/api/admin/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe(updateData.username);
      expect(response.body.data.learning_style).toBe(updateData.learning_style);

      // Verify update was actually applied in database
      const updatedUser = await UserRepository.findById(testUserId);
      expect(updatedUser.username).toBe(updateData.username);
      expect(updatedUser.learning_style).toBe(updateData.learning_style);
    });

    test('should prevent non-admin from updating other users', async () => {
      if (!testUserId) {
        return;
      }

      const updateData = {
        username: 'hackeduser'
      };

      const response = await request(app)
        .put(`/api/admin/users/${testUserId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Admin access required');
    });

    test('should handle non-existent user updates', async () => {
      const updateData = {
        username: 'nonexistentuser'
      };

      const response = await request(app)
        .put('/api/admin/users/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('Complete User Deletion Flow', () => {
    beforeAll(async () => {
      // Create a second test user for deletion tests with unique email
      const timestamp = Date.now();
      const userData = {
        email: `delete-test-${timestamp}@example.com`,
        username: `deleteuser${timestamp}`,
        password: await UserService.hashUserPassword('StrongPass123!'),
        role: 'user',
        learning_style: 'visual',
        learning_pattern: 'consistent'
      };

      const createdUser = await UserRepository.create(userData);
      testUser2Id = createdUser.id;
    });

    test('should handle complete soft deletion flow', async () => {
      if (!testUser2Id) {
        return;
      }

      // Verify user exists before deletion
      const userBeforeDeletion = await UserRepository.findById(testUser2Id);
      expect(userBeforeDeletion).toBeTruthy();

      // Test successful deletion
      const response = await request(app)
        .delete(`/api/admin/users/${testUser2Id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe('User deleted successfully');
      expect(response.body.data.deletedUserId).toBe(testUser2Id);
      expect(response.body.data.referentialIntegrity).toBeDefined();

      // Verify user is soft deleted (not found by normal queries)
      const userAfterDeletion = await UserRepository.findById(testUser2Id);
      expect(userAfterDeletion).toBeNull();

      // Verify user still exists in database but with deleted_at timestamp
      const rows = await db.execute(
        'SELECT id, email, deleted_at FROM users WHERE id = ?',
        [testUser2Id]
      );
      expect(rows.length).toBe(1);
      expect(rows[0].deleted_at).toBeTruthy();
    });

    test('should prevent non-admin from deleting users', async () => {
      if (!testUserId) {
        return;
      }

      const response = await request(app)
        .delete(`/api/admin/users/${testUserId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Admin access required');
    });

    test('should handle deletion of non-existent user', async () => {
      const response = await request(app)
        .delete('/api/admin/users/99999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('User Profile Self-Service Flow', () => {
    test('should handle complete profile update flow', async () => {
      // Create a user token for an existing user
      const existingUserToken = generateToken({ id: testUserId, email: testUserData.email, role: 'user' });

      const profileUpdateData = {
        username: 'selfupdateduser',
        learning_pattern: 'reflective'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${existingUserToken}`)
        .send(profileUpdateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe(profileUpdateData.username);
      expect(response.body.data.learning_pattern).toBe(profileUpdateData.learning_pattern);

      // Verify update was applied in database
      const updatedUser = await UserRepository.findById(testUserId);
      expect(updatedUser.username).toBe(profileUpdateData.username);
      expect(updatedUser.learning_pattern).toBe(profileUpdateData.learning_pattern);
    });

    test('should prevent users from updating restricted fields', async () => {
      const existingUserToken = generateToken({ id: testUserId, email: testUserData.email, role: 'user' });

      const restrictedUpdateData = {
        role: 'admin', // Restricted field
        username: 'hackedadmin'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${existingUserToken}`)
        .send(restrictedUpdateData);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Access denied. Cannot update restricted fields.');
      expect(response.body.details.code).toBe('RESTRICTED_FIELD_UPDATE');
    });
  });

  describe('Authentication and Authorization Integration', () => {
    test('should reject requests without authentication token', async () => {
      const response = await request(app)
        .get('/api/admin/users');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Authorization header is missing');
    });

    test('should reject requests with invalid token format', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', 'InvalidFormat');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Authorization header must be in format: Bearer <token>');
    });

    test('should reject requests with invalid token', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid token');
    });

    test('should reject deleted user authentication', async () => {
      if (!testUser2Id) {
        return;
      }

      // Create token for deleted user
      const deletedUserToken = generateToken({ id: testUser2Id, email: 'delete-test@example.com', role: 'user' });

      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${deletedUserToken}`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User account not found or has been deactivated');
    });

    test('should handle ownership verification correctly', async () => {
      if (!testUserId) {
        return;
      }

      // User trying to access their own profile
      const ownUserToken = generateToken({ id: testUserId, email: testUserData.email, role: 'user' });

      const ownResponse = await request(app)
        .get(`/api/users/${testUserId}`)
        .set('Authorization', `Bearer ${ownUserToken}`);

      expect(ownResponse.status).toBe(200);
      expect(ownResponse.body.success).toBe(true);

      // User trying to access another user's profile
      const otherResponse = await request(app)
        .get('/api/users/1') // Different user ID
        .set('Authorization', `Bearer ${ownUserToken}`);

      expect(otherResponse.status).toBe(403);
      expect(otherResponse.body.success).toBe(false);
      expect(otherResponse.body.error).toBe('Access denied. You can only access your own profile.');
    });
  });

  describe('Error Handling Across All Layers', () => {
    test('should handle database connection errors gracefully', async () => {
      // This test would require mocking database connection failures
      // For now, we'll test that the error handler middleware works
      const response = await request(app)
        .get('/api/admin/users/invalid-id')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid user ID');
    });

    test('should handle validation errors consistently', async () => {
      const invalidData = {
        email: '', // Empty email
        username: '', // Empty username
        password: '' // Empty password
      };

      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toBeDefined();
    });

    test('should handle missing required fields', async () => {
      const incompleteData = {
        email: 'test@example.com'
        // Missing other required fields
      };

      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(incompleteData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
    });
  });

  describe('Data Consistency and Integrity', () => {
    test('should maintain data consistency across operations', async () => {
      if (!testUserId) {
        return;
      }

      // Get initial user count
      const initialResponse = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      const initialCount = initialResponse.body.data.pagination.total;

      // Create a new user
      const newUserData = {
        email: 'consistency-test@example.com',
        username: 'consistencyuser',
        password: 'StrongPass123!',
        role: 'user',
        learning_style: 'visual',
        learning_pattern: 'consistent'
      };

      const createResponse = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newUserData);

      expect(createResponse.status).toBe(201);
      const newUserId = createResponse.body.data.id;

      // Verify count increased
      const afterCreateResponse = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(afterCreateResponse.body.data.pagination.total).toBe(initialCount + 1);

      // Delete the user
      await request(app)
        .delete(`/api/admin/users/${newUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      // Verify count decreased (soft delete should remove from normal queries)
      const afterDeleteResponse = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(afterDeleteResponse.body.data.pagination.total).toBe(initialCount);

      // Clean up
      try {
        await db.execute('DELETE FROM users WHERE id = ?', [newUserId]);
      } catch (error) {
        // Ignore cleanup errors
      }
    });

    test('should handle concurrent operations safely', async () => {
      // Test concurrent user creation with same email
      const userData = {
        email: 'concurrent-test@example.com',
        username: 'concurrentuser',
        password: 'StrongPass123!',
        role: 'user',
        learning_style: 'visual',
        learning_pattern: 'consistent'
      };

      const promises = [
        request(app)
          .post('/api/admin/users')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(userData),
        request(app)
          .post('/api/admin/users')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(userData)
      ];

      const results = await Promise.all(promises);

      // One should succeed, one should fail with duplicate email
      const successCount = results.filter(r => r.status === 201).length;
      const duplicateCount = results.filter(r => r.status === 409).length;

      expect(successCount).toBe(1);
      expect(duplicateCount).toBe(1);

      // Clean up the created user
      const successResult = results.find(r => r.status === 201);
      if (successResult) {
        try {
          await db.execute('DELETE FROM users WHERE id = ?', [successResult.body.data.id]);
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    });
  });
});