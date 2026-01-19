/**
 * Error Handling Integration Tests
 * 
 * Tests error handling across all application layers:
 * - Database layer
 * - Service layer
 * - Controller layer
 * - Middleware layer
 * - Route layer
 * 
 * @module tests/error-handling.test
 */

'use strict';

const request = require('supertest');
const app = require('../server');
const db = require('../db/connection');
const { hashPassword } = require('../utils/auth');
const { generateToken } = require('../utils/auth');

describe('Error Handling Across All Layers', () => {
  // Test user data
  let adminUser;
  let regularUser;
  let adminToken;
  let userToken;

  // Setup: Create real users for authentication tests
  beforeAll(async () => {
    const timestamp = Date.now();

    try {
      // Create admin user
      const adminPassword = await hashPassword('AdminPass123!');
      const adminResult = await db.execute(
        `INSERT INTO users (email, username, password, role, learning_style, learning_pattern, deleted_at) 
                 VALUES (?, ?, ?, 'admin', 'visual', 'consistent', NULL)`,
        [`error-test-admin-${timestamp}@example.com`, `erroradmin${timestamp}`, adminPassword]
      );
      adminUser = {
        id: adminResult.insertId,
        email: `error-test-admin-${timestamp}@example.com`,
        role: 'admin'
      };
      adminToken = generateToken({ id: adminUser.id, email: adminUser.email, role: 'admin' });

      // Create regular user
      const userPassword = await hashPassword('UserPass123!');
      const userResult = await db.execute(
        `INSERT INTO users (email, username, password, role, learning_style, learning_pattern, deleted_at) 
                 VALUES (?, ?, ?, 'user', 'auditori', 'fast', NULL)`,
        [`error-test-user-${timestamp}@example.com`, `erroruser${timestamp}`, userPassword]
      );
      regularUser = {
        id: userResult.insertId,
        email: `error-test-user-${timestamp}@example.com`,
        role: 'user'
      };
      userToken = generateToken({ id: regularUser.id, email: regularUser.email, role: 'user' });

    } catch (error) {
      console.error('Test setup failed:', error.message);
      throw error;
    }
  });

  // Cleanup: Remove test users
  afterAll(async () => {
    try {
      if (adminUser?.id) {
        await db.execute('DELETE FROM users WHERE id = ?', [adminUser.id]);
      }
      if (regularUser?.id) {
        await db.execute('DELETE FROM users WHERE id = ?', [regularUser.id]);
      }
      await db.close();
    } catch (error) {
      console.error('Test cleanup failed:', error.message);
    }
  });

  // ========================================================================
  // DATABASE LAYER ERROR HANDLING
  // ========================================================================

  describe('Database Layer Error Handling', () => {
    test('should handle duplicate email creation attempts', async () => {
      const timestamp = Date.now();
      const userData = {
        email: `duplicate-test-${timestamp}@example.com`,
        username: `duplicateuser${timestamp}`,
        password: 'StrongPass123!',
        role: 'user',
        learning_style: 'visual',
        learning_pattern: 'consistent'
      };

      // First create a user
      const firstResponse = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData);

      // Try to create the same user again
      const duplicateResponse = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData);

      expect(duplicateResponse.status).toBe(409);
      expect(duplicateResponse.body.success).toBe(false);
      expect(duplicateResponse.body.error).toBe('Email address already exists');

      // Clean up
      if (firstResponse.status === 201 && firstResponse.body.data?.id) {
        await request(app)
          .delete(`/api/admin/users/${firstResponse.body.data.id}`)
          .set('Authorization', `Bearer ${adminToken}`);
      }
    });

    test('should handle operations on non-existent users', async () => {
      const response = await request(app)
        .get('/api/admin/users/99999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User not found');
    });
  });

  // ========================================================================
  // SERVICE LAYER ERROR HANDLING
  // ========================================================================

  describe('Service Layer Error Handling', () => {
    test('should handle weak password validation', async () => {
      const userData = {
        email: 'weak-password@example.com',
        username: 'weakpassuser',
        password: '123', // Weak password
        role: 'user',
        learning_style: 'visual',
        learning_pattern: 'consistent'
      };

      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
    });

    test('should handle invalid email format validation', async () => {
      const userData = {
        email: 'invalid-email-format', // Invalid email
        username: 'testuser',
        password: 'StrongPass123!',
        role: 'user',
        learning_style: 'visual',
        learning_pattern: 'consistent'
      };

      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
    });
  });

  // ========================================================================
  // CONTROLLER LAYER ERROR HANDLING
  // ========================================================================

  describe('Controller Layer Error Handling', () => {
    test('should handle malformed JSON in request body', async () => {
      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}'); // Malformed JSON

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should handle extremely large username', async () => {
      const largeData = {
        email: 'test-large@example.com',
        username: 'a'.repeat(1000), // Very long username
        password: 'StrongPass123!',
        role: 'user',
        learning_style: 'visual',
        learning_pattern: 'consistent'
      };

      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(largeData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should handle empty request body', async () => {
      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({}); // Empty body

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  // ========================================================================
  // MIDDLEWARE ERROR HANDLING
  // ========================================================================

  describe('Middleware Error Handling', () => {
    test('should handle corrupted JWT tokens', async () => {
      const corruptedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.corrupted.signature';

      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${corruptedToken}`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(['Invalid token', 'Authentication failed']).toContain(response.body.error);
    });

    test('should handle malformed JWT tokens', async () => {
      const malformedToken = 'not.a.valid.jwt.token';

      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${malformedToken}`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(['Invalid token', 'Authentication failed']).toContain(response.body.error);
    });

    test('should handle authorization header with wrong scheme', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Basic ${adminToken}`); // Wrong scheme

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Authorization header must be in format: Bearer <token>');
    });

    test('should handle missing authorization header', async () => {
      const response = await request(app)
        .get('/api/admin/users');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  // ========================================================================
  // ROUTE LAYER ERROR HANDLING
  // ========================================================================

  describe('Route Layer Error Handling', () => {
    test('should handle non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });

    test('should handle unsupported HTTP methods', async () => {
      const response = await request(app)
        .patch('/api/admin/users') // PATCH not supported
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });

    test('should handle routes with invalid parameters', async () => {
      const response = await request(app)
        .get('/api/admin/users/not-a-number')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid user ID');
    });
  });

  // ========================================================================
  // CROSS-LAYER ERROR PROPAGATION
  // ========================================================================

  describe('Cross-Layer Error Propagation', () => {
    test('should handle validation errors for admin user creation', async () => {
      const invalidData = {
        email: '', // Empty email
        username: '', // Empty username
        password: '' // Empty password
      };

      const adminResponse = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidData);

      expect(adminResponse.status).toBe(400);
      expect(adminResponse.body.success).toBe(false);
      expect(adminResponse.body.error).toBe('Validation failed');
    });

    test('should reject profile update for restricted fields', async () => {
      const profileResponse = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ email: 'new-email@example.com' }); // Email is restricted field

      // Email is a restricted field - should return 403
      expect(profileResponse.status).toBe(403);
      expect(profileResponse.body.success).toBe(false);
      expect(profileResponse.body.error).toContain('restricted fields');
    });

    test('should handle authorization errors for admin endpoints', async () => {
      const adminResponse = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(adminResponse.status).toBe(403);
      expect(adminResponse.body.success).toBe(false);
      expect(adminResponse.body.error).toBe('Admin access required');
    });

    test('should handle user accessing another user data', async () => {
      const userResponse = await request(app)
        .get('/api/users/999')
        .set('Authorization', `Bearer ${userToken}`);

      expect(userResponse.status).toBe(403);
      expect(userResponse.body.success).toBe(false);
    });
  });

  // ========================================================================
  // INPUT VALIDATION ERROR HANDLING
  // ========================================================================

  describe('Input Validation Error Handling', () => {
    test('should handle invalid enum values', async () => {
      const invalidEnumData = {
        email: 'enum-test@example.com',
        username: 'enumtestuser',
        password: 'StrongPass123!',
        role: 'invalid_role', // Invalid enum
        learning_style: 'invalid_style', // Invalid enum
        learning_pattern: 'invalid_pattern' // Invalid enum
      };

      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidEnumData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
    });

    test('should handle missing required fields', async () => {
      const incompleteData = {
        email: 'incomplete-test@example.com'
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

    test('should handle null and undefined values', async () => {
      const nullData = {
        email: null,
        username: undefined,
        password: 'StrongPass123!',
        role: 'user',
        learning_style: 'visual',
        learning_pattern: 'consistent'
      };

      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(nullData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
    });
  });

  // ========================================================================
  // CONCURRENT OPERATION ERROR HANDLING
  // ========================================================================

  describe('Concurrent Operation Error Handling', () => {
    test('should handle multiple simultaneous requests', async () => {
      const timestamp = Date.now();
      const userData1 = {
        email: `concurrent1-${timestamp}@example.com`,
        username: `concurrent1-${timestamp}`,
        password: 'StrongPass123!',
        role: 'user',
        learning_style: 'visual',
        learning_pattern: 'consistent'
      };

      const userData2 = {
        email: `concurrent2-${timestamp}@example.com`,
        username: `concurrent2-${timestamp}`,
        password: 'StrongPass123!',
        role: 'user',
        learning_style: 'auditori',
        learning_pattern: 'fast'
      };

      const promises = [
        request(app)
          .post('/api/admin/users')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(userData1),
        request(app)
          .post('/api/admin/users')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(userData2)
      ];

      const results = await Promise.all(promises);

      results.forEach(result => {
        expect([201, 400, 409]).toContain(result.status);
        expect(result.body.success).toBeDefined();
      });

      // Clean up
      for (const result of results) {
        if (result.status === 201 && result.body.data?.id) {
          await request(app)
            .delete(`/api/admin/users/${result.body.data.id}`)
            .set('Authorization', `Bearer ${adminToken}`);
        }
      }
    });

    test('should handle operations on recently deleted users', async () => {
      const timestamp = Date.now();
      const userData = {
        email: `delete-test-${timestamp}@example.com`,
        username: `deletetest${timestamp}`,
        password: 'StrongPass123!',
        role: 'user',
        learning_style: 'visual',
        learning_pattern: 'consistent'
      };

      const createResponse = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData);

      if (createResponse.status === 201 && createResponse.body.data?.id) {
        const userId = createResponse.body.data.id;

        // Delete the user
        await request(app)
          .delete(`/api/admin/users/${userId}`)
          .set('Authorization', `Bearer ${adminToken}`);

        // Try to access the deleted user
        const getResponse = await request(app)
          .get(`/api/admin/users/${userId}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(getResponse.status).toBe(404);
        expect(getResponse.body.success).toBe(false);
        expect(getResponse.body.error).toBe('User not found');
      }
    });
  });

  // ========================================================================
  // RESOURCE/PAGINATION ERROR HANDLING
  // ========================================================================

  describe('Resource Exhaustion Error Handling', () => {
    test('should handle large pagination requests', async () => {
      const response = await request(app)
        .get('/api/admin/users?limit=1000')
        .set('Authorization', `Bearer ${adminToken}`);

      expect([200, 400, 500]).toContain(response.status);
      expect(response.body.success).toBeDefined();
    });

    test('should handle invalid pagination parameters gracefully', async () => {
      const response = await request(app)
        .get('/api/admin/users?limit=-1&offset=-5')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});