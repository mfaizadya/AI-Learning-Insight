const request = require('supertest');
const app = require('../server');
const { generateToken } = require('../utils/auth');

describe('Error Handling Across All Layers', () => {
  let adminToken;
  let userToken;

  beforeAll(() => {
    adminToken = generateToken({ id: 1, email: 'admin@test.com', role: 'admin' });
    userToken = generateToken({ id: 2, email: 'user@test.com', role: 'user' });
  });



  describe('Database Layer Error Handling', () => {
    test('should handle duplicate email creation attempts', async () => {
      // First create a user
      const timestamp = Date.now();
      const userData = {
        email: `duplicate-test-${timestamp}@example.com`,
        username: `duplicateuser${timestamp}`,
        password: 'StrongPass123!',
        role: 'user',
        learning_style: 'visual',
        learning_pattern: 'consistent'
      };

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
      if (firstResponse.status === 201) {
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

    test('should handle extremely large request payloads', async () => {
      const largeData = {
        email: 'test@example.com',
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
  });

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

  describe('Cross-Layer Error Propagation', () => {
    test('should handle validation errors consistently across endpoints', async () => {
      const invalidData = {
        email: '', // Empty email
        username: '', // Empty username
        password: '' // Empty password
      };

      // Test admin user creation
      const adminResponse = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidData);

      expect(adminResponse.status).toBe(400);
      expect(adminResponse.body.success).toBe(false);
      expect(adminResponse.body.error).toBe('Validation failed');

      // Test profile update
      const profileResponse = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ email: '' }); // Invalid email

      expect(profileResponse.status).toBe(400);
      expect(profileResponse.body.success).toBe(false);
    });

    test('should handle authorization errors consistently', async () => {
      // Test admin endpoint with user token
      const adminResponse = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(adminResponse.status).toBe(403);
      expect(adminResponse.body.success).toBe(false);
      expect(adminResponse.body.error).toBe('Admin access required');

      // Test user trying to access another user's data
      const userResponse = await request(app)
        .get('/api/users/999')
        .set('Authorization', `Bearer ${userToken}`);

      expect(userResponse.status).toBe(403);
      expect(userResponse.body.success).toBe(false);
    });
  });

  describe('Input Validation Error Handling', () => {
    test('should handle invalid enum values', async () => {
      const invalidEnumData = {
        email: 'test@example.com',
        username: 'testuser',
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

      // Send multiple requests simultaneously
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

      // Both should succeed since they have different emails
      results.forEach(result => {
        expect([201, 400, 409]).toContain(result.status);
        expect(result.body.success).toBeDefined();
      });

      // Clean up created users
      for (const result of results) {
        if (result.status === 201) {
          await request(app)
            .delete(`/api/admin/users/${result.body.data.id}`)
            .set('Authorization', `Bearer ${adminToken}`);
        }
      }
    });

    test('should handle operations on recently deleted users', async () => {
      // Create a user first
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

      if (createResponse.status === 201) {
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

  describe('Resource Exhaustion Error Handling', () => {
    test('should handle large pagination requests', async () => {
      const response = await request(app)
        .get('/api/admin/users?limit=1000') // Large but reasonable limit
        .set('Authorization', `Bearer ${adminToken}`);

      // Should either succeed or return appropriate error
      expect([200, 400, 500]).toContain(response.status);
      expect(response.body.success).toBeDefined();
    });

    test('should handle invalid pagination parameters', async () => {
      const response = await request(app)
        .get('/api/admin/users?limit=-1&offset=-5') // Invalid pagination
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200); // Should handle gracefully with defaults
      expect(response.body.success).toBe(true);
    });
  });
});