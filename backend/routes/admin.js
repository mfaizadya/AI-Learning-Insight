const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');
const apiAccessService = require('../services/apiAccessService');

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

// ============================================================================
// API Access Request Management (Admin only)
// ============================================================================

/**
 * GET /api/admin/api-requests
 * Get all API access requests with pagination
 * Query params: status (pending/approved/rejected), page, limit
 */
router.get('/api-requests', verifyToken, verifyAdmin, async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const result = await apiAccessService.getAllRequests({
            status,
            page: parseInt(page),
            limit: parseInt(limit)
        });

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/admin/api-requests/:id
 * Get single API access request details
 */
router.get('/api-requests/:id', verifyToken, verifyAdmin, async (req, res, next) => {
    try {
        const request = await apiAccessService.getRequestById(req.params.id);

        res.json({
            success: true,
            data: request
        });
    } catch (error) {
        next(error);
    }
});

/**
 * PATCH /api/admin/api-requests/:id/approve
 * Approve an API access request
 * Creates tenant and generates API key
 */
router.patch('/api-requests/:id/approve', verifyToken, verifyAdmin, async (req, res, next) => {
    try {
        const result = await apiAccessService.approveRequest(
            req.params.id,
            req.user.id
        );

        res.json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * PATCH /api/admin/api-requests/:id/reject
 * Reject an API access request
 * Body: { reason: string }
 */
router.patch('/api-requests/:id/reject', verifyToken, verifyAdmin, async (req, res, next) => {
    try {
        const { reason } = req.body;

        const result = await apiAccessService.rejectRequest(
            req.params.id,
            req.user.id,
            reason
        );

        res.json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;

