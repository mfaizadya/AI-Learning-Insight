const request = require('supertest');
const express = require('express');
const userRoutes = require('../routes/users');
const { verifyToken, verifyOwnershipOrAdmin } = require('../middleware/auth');

// Mock the middleware
jest.mock('../middleware/auth');
jest.mock('../controllers/userController');

const userController = require('../controllers/userController');

describe('User Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/users', userRoutes);
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock middleware to pass through
    verifyToken.mockImplementation((req, res, next) => {
      req.user = { id: 1, role: 'user' };
      next();
    });
    
    verifyOwnershipOrAdmin.mockImplementation((req, res, next) => {
      next();
    });
  });

  describe('GET /api/users/:id', () => {
    test('should call getUserById controller with proper middleware', async () => {
      userController.getUserById.mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: { id: 1, email: 'test@example.com' }
        });
      });

      const response = await request(app)
        .get('/api/users/1')
        .expect(200);

      expect(verifyToken).toHaveBeenCalled();
      expect(verifyOwnershipOrAdmin).toHaveBeenCalled();
      expect(userController.getUserById).toHaveBeenCalled();
      expect(response.body.success).toBe(true);
    });
  });

  describe('PUT /api/users/profile', () => {
    test('should call updateProfile controller with verifyToken middleware', async () => {
      userController.updateProfile.mockImplementation((req, res) => {
        res.status(200).json({
          success: true,
          data: { id: 1, email: 'updated@example.com' }
        });
      });

      const response = await request(app)
        .put('/api/users/profile')
        .send({ email: 'updated@example.com' })
        .expect(200);

      expect(verifyToken).toHaveBeenCalled();
      expect(userController.updateProfile).toHaveBeenCalled();
      expect(response.body.success).toBe(true);
    });
  });
});