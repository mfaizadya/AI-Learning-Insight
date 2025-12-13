const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerLimiter, loginLimiter } = require('../middleware/rateLimit');

/**
 * POST /api/auth/register
 * Register a new user
 * Requirements: 1.1, 1.2, 2.1
 */
router.post('/register', registerLimiter, authController.register);

/**
 * POST /api/auth/login
 * Login user and return JWT token
 * Requirements: 1.1, 1.2, 2.1
 */
router.post('/login', loginLimiter, authController.login);

// router.post('/logout', authController.logout);

module.exports = router;
