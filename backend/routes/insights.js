const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const insightsController = require('../controllers/insightsController');

/**
 * GET /api/insights
 * Get user's insights
 * Requirements: 6.1, 6.2
 */
router.get('/', verifyToken, insightsController.getUserInsights);

/**
 * POST /api/insights
 * Create insight for a user (admin only)
 * Requirements: 6.1, 6.3, 6.4
 */
router.post('/', verifyToken, verifyAdmin, insightsController.createInsight);

module.exports = router;
