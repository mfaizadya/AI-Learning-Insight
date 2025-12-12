const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');

/**
 * POST /api/admin/soal-pola
 * Create question for test_pola (admin only)
 * Requirements: 6.1
 */
router.post('/soal-pola', verifyToken, verifyAdmin, adminController.createPolaQuestion);

/**
 * POST /api/admin/pilihan-pola
 * Create choice for soal_pola (admin only)
 * Requirements: 6.2
 */
router.post('/pilihan-pola', verifyToken, verifyAdmin, adminController.createPolaChoice);

/**
 * POST /api/admin/soal-gaya
 * Create question for test_gaya (admin only)
 * Requirements: 6.3
 */
router.post('/soal-gaya', verifyToken, verifyAdmin, adminController.createGayaQuestion);

/**
 * POST /api/admin/pilihan-gaya
 * Create choice for soal_gaya (admin only)
 * Requirements: 6.4
 */
router.post('/pilihan-gaya', verifyToken, verifyAdmin, adminController.createGayaChoice);

// User Management Routes (Admin only)

/**
 * POST /api/admin/users
 * Create a new user (admin only)
 * Requirements: 1.1, 1.2
 */
router.post('/users', verifyToken, verifyAdmin, userController.createUser);

/**
 * GET /api/admin/users
 * Get all users with optional filtering and pagination (admin only)
 * Requirements: 2.1, 2.2
 */
router.get('/users', verifyToken, verifyAdmin, userController.getAllUsers);

/**
 * GET /api/admin/users/:id
 * Get user by ID (admin only)
 * Requirements: 2.1, 2.2
 */
router.get('/users/:id', verifyToken, verifyAdmin, userController.getUserById);

/**
 * PUT /api/admin/users/:id
 * Update user by ID (admin only)
 * Requirements: 2.1, 2.2
 */
router.put('/users/:id', verifyToken, verifyAdmin, userController.updateUser);

/**
 * DELETE /api/admin/users/:id
 * Delete user by ID - soft delete (admin only)
 * Requirements: 3.1, 3.2
 */
router.delete('/users/:id', verifyToken, verifyAdmin, userController.deleteUser);

module.exports = router;
