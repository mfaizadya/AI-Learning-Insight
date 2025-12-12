const request = require('supertest');
const app = require('../server');
const db = require('../db/connection');
const { generateToken } = require('../utils/auth');

describe('Admin Routes', () => {
  let adminToken;
  let userToken;
  let testUserId;

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
    
    // Close database connection
    try {
      await db.close();
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('POST /api/admin/users', () => {
    test('should create user with admin token', async () => {
      const userData = {
        email: 'newuser@test.com',
        username: 'newuser',
        password: 'Password123!',
        role: 'user',
        learning_style: 'visual',
        learning_pattern: 'consistent'
      };

      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data.username).toBe(userData.username);
      expect(response.body.data.password).toBeUndefined(); // Password should not be in response
      
      testUserId = response.body.data.id;
    });

    test('should reject user creation with user token', async () => {
      const userData = {
        email: 'another@test.com',
        username: 'another',
        password: 'Password123!',
        role: 'user',
        learning_style: 'visual',
        learning_pattern: 'consistent'
      };

      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${userToken}`)
        .send(userData);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Admin access required');
    });

    test('should reject user creation without token', async () => {
      const userData = {
        email: 'noauth@test.com',
        username: 'noauth',
        password: 'Password123!',
        role: 'user',
        learning_style: 'visual',
        learning_pattern: 'consistent'
      };

      const response = await request(app)
        .post('/api/admin/users')
        .send(userData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/admin/users', () => {
    test('should get all users with admin token', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toBeDefined();
      expect(Array.isArray(response.body.data.users)).toBe(true);
      expect(response.body.data.pagination).toBeDefined();
    });

    test('should reject user list request with user token', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Admin access required');
    });
  });

  describe('GET /api/admin/users/:id', () => {
    test('should get user by ID with admin token', async () => {
      if (!testUserId) {
        // Skip if no test user was created
        return;
      }

      const response = await request(app)
        .get(`/api/admin/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testUserId);
    });

    test('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/admin/users/99999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('PUT /api/admin/users/:id', () => {
    test('should update user with admin token', async () => {
      if (!testUserId) {
        // Skip if no test user was created
        return;
      }

      const updateData = {
        username: 'updateduser'
      };

      const response = await request(app)
        .put(`/api/admin/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe(updateData.username);
    });
  });

  describe('DELETE /api/admin/users/:id', () => {
    test('should soft delete user with admin token', async () => {
      if (!testUserId) {
        // Skip if no test user was created
        return;
      }

      const response = await request(app)
        .delete(`/api/admin/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe('User deleted successfully');
      expect(response.body.data.deletedUserId).toBe(testUserId);
    });
  });
});