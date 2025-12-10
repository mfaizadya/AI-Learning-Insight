const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const resultsController = require('../controllers/resultsController');

/**
 * POST /api/results/pola
 * Submit test_pola answers
 * Requirements: 5.1, 5.2, 5.5
 */
router.post('/pola', verifyToken, resultsController.submitPolaTest);

/**
 * POST /api/results/gaya
 * Submit test_gaya answers
 * Requirements: 5.1, 5.2, 5.5
 */
router.post('/gaya', verifyToken, resultsController.submitGayaTest);

/**
 * GET /api/results/history
 * Get user's test history
 * Requirements: 5.1, 5.3
 */
router.get('/history', verifyToken, resultsController.getTestHistory);

/**
 * GET /api/results/:id
 * Get specific test result details
 * Requirements: 5.1, 5.3, 5.4
 */
router.get('/:id', verifyToken, resultsController.getTestResultById);


module.exports = router;
