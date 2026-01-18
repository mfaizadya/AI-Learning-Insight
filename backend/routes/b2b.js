/**
 * B2B API Routes (v1)
 * 
 * Defines versioned API endpoints for external integrations (LMS, Schools).
 * All routes require API Key authentication via X-API-Key header.
 * 
 * Base path: /api/v1
 * 
 * @module routes/b2b
 */

'use strict';

const express = require('express');

// Middleware
const { validateApiKey, requireScope } = require('../middleware/apiKeyAuth');
const { tenantRateLimit } = require('../middleware/tenantRateLimit');
const { logUsage } = require('../services/usageLogger');

// Controller
const b2bController = require('../controllers/b2bController');

// ============================================================================
// ROUTER SETUP
// ============================================================================

const router = express.Router();

// ============================================================================
// MIDDLEWARE CHAIN
// ============================================================================

/**
 * Apply middleware chain for all B2B routes
 * 
 * Order is important:
 * 1. validateApiKey - Authenticates request and attaches tenant context
 * 2. tenantRateLimit - Applies per-tenant rate limiting
 * 3. logUsage - Records API usage for billing/analytics
 */
router.use(validateApiKey);
router.use(tenantRateLimit);
router.use(logUsage);

// ============================================================================
// ROUTES
// ============================================================================

/**
 * Health Check
 * GET /api/v1/health
 * 
 * Returns API status and basic tenant information.
 * No specific scope required - just valid API key.
 * 
 * @name GetHealth
 * @route {GET} /health
 * @authentication API Key required
 */
router.get('/health', b2bController.healthCheck);

/**
 * Predict Learning Pattern
 * POST /api/v1/predict
 * 
 * Accepts feature array and returns learning pattern prediction.
 * Uses ML service when available, falls back to rule-based algorithm.
 * 
 * @name PostPredict
 * @route {POST} /predict
 * @authentication API Key required
 * @scope predict
 * 
 * @bodyparam {number[]} features - Array of 9 numeric feature values
 * @bodyparam {string} [student_external_id] - Optional external student identifier
 */
router.post('/predict', requireScope('predict'), b2bController.predict);

/**
 * Get Usage Statistics
 * GET /api/v1/usage
 * 
 * Returns usage statistics for the authenticated tenant.
 * Useful for monitoring and billing purposes.
 * 
 * @name GetUsage
 * @route {GET} /usage
 * @authentication API Key required
 * @scope usage:read
 * 
 * @queryparam {number} [days=30] - Number of days to look back (1-365)
 */
router.get('/usage', requireScope('usage:read'), b2bController.getUsageStats);

// ============================================================================
// MODULE EXPORTS
// ============================================================================

module.exports = router;
