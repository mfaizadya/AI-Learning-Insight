const { verifyOwnershipOrAdmin, verifyToken } = require('../middleware/auth');
const UserRepository = require('../repositories/userRepository');
const { generateToken } = require('../utils/auth');

// Mock UserRepository
jest.mock('../repositories/userRepository');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: null,
      params: {},
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('verifyToken', () => {
    test('should return 401 if no authorization header', async () => {
      await verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Authorization header is missing'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 401 for invalid authorization header format', async () => {
      req.headers.authorization = 'InvalidFormat';

      await verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Authorization header must be in format: Bearer <token>'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 401 if user is deleted', async () => {
      // Create a valid token
      const validToken = generateToken({ id: 1, email: 'test@example.com', role: 'user' });
      req.headers.authorization = `Bearer ${validToken}`;
      
      // Mock UserRepository to return null (user not found/deleted)
      UserRepository.findById.mockResolvedValue(null);

      await verifyToken(req, res, next);

      expect(UserRepository.findById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'User account not found or has been deactivated'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should proceed if user exists and token is valid', async () => {
      // Create a valid token
      const validToken = generateToken({ id: 1, email: 'test@example.com', role: 'user' });
      req.headers.authorization = `Bearer ${validToken}`;
      
      // Mock UserRepository to return a valid user
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        role: 'user',
        deleted_at: null
      };
      UserRepository.findById.mockResolvedValue(mockUser);

      await verifyToken(req, res, next);

      expect(UserRepository.findById).toHaveBeenCalledWith(1);
      expect(req.user).toMatchObject({ id: 1, email: 'test@example.com', role: 'user' });
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should return 401 for invalid token', async () => {
      req.headers.authorization = 'Bearer invalid-token';

      await verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid token'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('verifyOwnershipOrAdmin', () => {
    test('should return 401 if no user in request', () => {
      verifyOwnershipOrAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Authentication required'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 400 for invalid user ID', () => {
      req.user = { id: 1, role: 'user' };
      req.params.id = 'invalid';

      verifyOwnershipOrAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid user ID',
        details: {
          field: 'id',
          code: 'INVALID_ID'
        }
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should allow admin to access any user', () => {
      req.user = { id: 1, role: 'admin' };
      req.params.id = '2';

      verifyOwnershipOrAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should allow user to access their own resource', () => {
      req.user = { id: 1, role: 'user' };
      req.params.id = '1';

      verifyOwnershipOrAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should deny user access to other users resources', () => {
      req.user = { id: 1, role: 'user' };
      req.params.id = '2';

      verifyOwnershipOrAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Access denied. You can only access your own profile.'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});