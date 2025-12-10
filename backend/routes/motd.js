const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const motdController = require('../controllers/motdController');

/**
 * GET /api/motd
 * Retrieve all MOTD entries (accessible to all authenticated users)
 * Requirements: 2.1, 2.2, 2.3, 2.4
 */
router.get('/', verifyToken, motdController.getAllMotd);

/**
 * POST /api/motd
 * Create a new MOTD entry (admin only)
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */
router.post('/', verifyToken, verifyAdmin, motdController.createMotd);

/**
 * GET /api/motd/:id
 * Retrieve a specific MOTD entry by ID (admin only)
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */
router.get('/:id', verifyToken, verifyAdmin, motdController.getMotdById);

/**
 * PUT /api/motd/:id
 * Update an existing MOTD entry (admin only)
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */
router.put('/:id', verifyToken, verifyAdmin, motdController.updateMotd);

/**
 * DELETE /api/motd/:id
 * Delete an MOTD entry (admin only)
 * Requirements: 5.1, 5.2, 5.3, 5.4
 */
router.delete('/:id', verifyToken, verifyAdmin, motdController.deleteMotd);

module.exports = router;
