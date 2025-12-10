const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

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

module.exports = router;
