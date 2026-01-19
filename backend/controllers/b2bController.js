/**
 * B2B API Controller
 * 
 * Provides RESTful endpoints for external integrations (LMS, Schools).
 * All endpoints require API Key authentication via middleware.
 * 
 * @module controllers/b2bController
 */

'use strict';

const axios = require('axios');
const db = require('../db/connection');

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Configuration constants for B2B API
 * @constant
 */
const CONFIG = Object.freeze({
    FEATURES_REQUIRED_LENGTH: 9,
    ML_TIMEOUT_MS: 30000,
    DEFAULT_CONFIDENCE: 0.5,
    BALANCED_THRESHOLD_PERCENT: 0.2,
    API_VERSION: '1.0.0'
});

/**
 * Pattern labels mapping
 * @constant
 */
const PATTERN_LABELS = Object.freeze({
    consistent: 'Consistent Learner',
    fast: 'Fast Learner',
    reflective: 'Reflective Learner',
    balanced: 'Balanced Learner'
});

/**
 * Error codes for B2B API
 * @constant
 */
const ERROR_CODES = Object.freeze({
    MISSING_FEATURES: 'MISSING_FEATURES',
    INVALID_FEATURES_LENGTH: 'INVALID_FEATURES_LENGTH',
    INVALID_FEATURE_TYPE: 'INVALID_FEATURE_TYPE',
    ML_SERVICE_ERROR: 'ML_SERVICE_ERROR',
    INTERNAL_ERROR: 'INTERNAL_ERROR'
});

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate features array for prediction
 * 
 * @param {*} features - Input to validate
 * @returns {Object} { valid: boolean, error?: Object }
 * @private
 */
function validateFeatures(features) {
    // Check if features exists
    if (features === undefined || features === null) {
        return {
            valid: false,
            error: {
                status: 400,
                success: false,
                error: 'Features array is required',
                code: ERROR_CODES.MISSING_FEATURES
            }
        };
    }

    // Check if features is an array with correct length
    if (!Array.isArray(features) || features.length !== CONFIG.FEATURES_REQUIRED_LENGTH) {
        return {
            valid: false,
            error: {
                status: 400,
                success: false,
                error: `Features must be an array of exactly ${CONFIG.FEATURES_REQUIRED_LENGTH} numeric values`,
                code: ERROR_CODES.INVALID_FEATURES_LENGTH,
                received_length: Array.isArray(features) ? features.length : 0,
                expected_length: CONFIG.FEATURES_REQUIRED_LENGTH
            }
        };
    }

    // Check if all elements are valid numbers
    const hasInvalidFeatures = features.some(f =>
        typeof f !== 'number' || !Number.isFinite(f)
    );

    if (hasInvalidFeatures) {
        return {
            valid: false,
            error: {
                status: 400,
                success: false,
                error: 'All features must be finite numeric values',
                code: ERROR_CODES.INVALID_FEATURE_TYPE
            }
        };
    }

    return { valid: true };
}

/**
 * Sanitize student external ID
 * 
 * @param {*} studentId - Raw student ID input
 * @returns {string|null} Sanitized ID or null
 * @private
 */
function sanitizeStudentId(studentId) {
    if (!studentId) return null;

    // Convert to string and trim
    const sanitized = String(studentId).trim();

    // Return null if empty after sanitization
    return sanitized.length > 0 ? sanitized : null;
}

// ============================================================================
// PREDICTION LOGIC
// ============================================================================

/**
 * Call ML service for prediction
 * 
 * @param {number[]} features - Feature array
 * @returns {Promise<Object>} Prediction result
 * @private
 */
async function callMLService(features) {
    const endpoint = process.env.ML_ENDPOINT;

    if (!endpoint) {
        return null;
    }

    try {
        const response = await axios.post(
            `${endpoint}/predict`,
            { features },
            {
                timeout: CONFIG.ML_TIMEOUT_MS,
                headers: { 'Content-Type': 'application/json' }
            }
        );

        const label = Array.isArray(response.data.prediction_label)
            ? response.data.prediction_label[0]
            : response.data.prediction_label;

        return {
            label,
            confidence: response.data.confidence || null,
            source: 'ml_service',
            raw: response.data
        };

    } catch (error) {
        console.error('[B2B] ML Service Error:', error.message);
        return null;
    }
}

/**
 * Calculate learning pattern using rule-based fallback algorithm
 * 
 * Features are grouped into pattern categories:
 * - Features 0-2: Consistent pattern indicators
 * - Features 3-5: Fast pattern indicators
 * - Features 6-8: Reflective pattern indicators
 * 
 * @param {number[]} features - Array of 9 feature scores
 * @returns {Object} Prediction result with label and confidence
 */
function calculatePatternFromFeatures(features) {
    // Calculate pattern scores
    const patternScores = {
        consistent: sumRange(features, 0, 3),
        fast: sumRange(features, 3, 6),
        reflective: sumRange(features, 6, 9)
    };

    const total = Object.values(patternScores).reduce((sum, v) => sum + v, 0);

    // Handle edge case: all zeros
    if (total === 0) {
        return {
            label: PATTERN_LABELS.balanced,
            confidence: CONFIG.DEFAULT_CONFIDENCE,
            source: 'fallback'
        };
    }

    const avgScore = total / 3;
    const threshold = avgScore * CONFIG.BALANCED_THRESHOLD_PERCENT;

    // Check for balanced pattern
    const isBalanced = Object.values(patternScores).every(
        score => Math.abs(score - avgScore) <= threshold
    );

    if (isBalanced) {
        return {
            label: PATTERN_LABELS.balanced,
            confidence: 0.7,
            source: 'fallback'
        };
    }

    // Find dominant pattern
    const [dominantPattern, dominantScore] = Object.entries(patternScores)
        .sort((a, b) => b[1] - a[1])[0];

    return {
        label: PATTERN_LABELS[dominantPattern],
        confidence: Math.round((dominantScore / total) * 100) / 100,
        source: 'fallback'
    };
}

/**
 * Sum elements in array range
 * 
 * @param {number[]} arr - Source array
 * @param {number} start - Start index (inclusive)
 * @param {number} end - End index (exclusive)
 * @returns {number} Sum of elements
 * @private
 */
function sumRange(arr, start, end) {
    return arr.slice(start, end).reduce((sum, val) => sum + (val || 0), 0);
}

// ============================================================================
// RESPONSE BUILDERS
// ============================================================================

/**
 * Build successful prediction response
 * 
 * @param {Object} params - Response parameters
 * @returns {Object} Formatted response object
 * @private
 */
function buildPredictionResponse({ studentId, prediction, tenantId }) {
    const response = {
        student_external_id: studentId,
        learning_pattern: prediction.label,
        confidence: prediction.confidence,
        tenant_id: tenantId,
        processed_at: new Date().toISOString()
    };

    if (prediction.source === 'fallback') {
        response.note = 'Prediction generated using fallback algorithm';
    }

    return response;
}

// ============================================================================
// ENDPOINT HANDLERS
// ============================================================================

/**
 * Health Check Endpoint
 * GET /api/v1/health
 * 
 * Returns API status and tenant information.
 * No specific scope required - just valid API key.
 * 
 * @param {Object} req - Express request with tenant context
 * @param {Object} res - Express response
 */
async function healthCheck(req, res) {
    const tenant = req.tenant || {};

    res.status(200).json({
        success: true,
        data: {
            status: 'healthy',
            version: CONFIG.API_VERSION,
            tenant: {
                id: tenant.id || null,
                name: tenant.name || null,
                tier: tenant.tier || null
            },
            timestamp: new Date().toISOString()
        }
    });
}

/**
 * Predict Learning Pattern
 * POST /api/v1/predict
 * 
 * Accepts feature array and returns learning pattern prediction.
 * Uses ML service when available, falls back to rule-based algorithm.
 * 
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */
async function predict(req, res, next) {
    try {
        const { features, student_external_id } = req.body;

        // Validate input
        const validation = validateFeatures(features);
        if (!validation.valid) {
            return res.status(validation.error.status).json(validation.error);
        }

        // Sanitize student ID
        const studentId = sanitizeStudentId(student_external_id);

        // Attempt ML prediction, fall back to rule-based
        let prediction = await callMLService(features);

        if (!prediction) {
            prediction = calculatePatternFromFeatures(features);
        }

        // Build and send response
        const responseData = buildPredictionResponse({
            studentId,
            prediction,
            tenantId: req.tenant.id
        });

        res.status(200).json({
            success: true,
            data: responseData
        });

    } catch (error) {
        console.error('[B2B] Predict endpoint error:', error);
        next(error);
    }
}

/**
 * Get Usage Statistics
 * GET /api/v1/usage
 * 
 * Returns usage statistics for the authenticated tenant.
 * Requires 'usage:read' scope.
 * 
 * @param {Object} req - Express request with tenant context
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */
async function getUsageStats(req, res, next) {
    try {
        const tenantId = req.tenant.id;
        const days = Math.min(Math.max(parseInt(req.query.days) || 30, 1), 365);

        const statsQuery = `
            SELECT 
                COUNT(*) as total_requests,
                COALESCE(SUM(tokens_used), 0) as total_tokens,
                ROUND(AVG(response_time_ms), 2) as avg_response_time,
                SUM(CASE WHEN status_code >= 200 AND status_code < 400 THEN 1 ELSE 0 END) as successful_requests,
                SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as failed_requests
            FROM usage_logs
            WHERE tenant_id = ?
              AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        `;

        const stats = await db.query(statsQuery, [tenantId, days]);
        const result = stats[0] || {};

        res.status(200).json({
            success: true,
            data: {
                period_days: days,
                tenant_id: tenantId,
                total_requests: Number(result.total_requests) || 0,
                total_tokens: Number(result.total_tokens) || 0,
                avg_response_time: Number(result.avg_response_time) || 0,
                successful_requests: Number(result.successful_requests) || 0,
                failed_requests: Number(result.failed_requests) || 0
            }
        });

    } catch (error) {
        console.error('[B2B] Usage stats error:', error);
        next(error);
    }
}

// ============================================================================
// MODULE EXPORTS
// ============================================================================

module.exports = Object.freeze({
    // Endpoint handlers
    healthCheck,
    predict,
    getUsageStats,

    // Exported for testing
    calculatePatternFromFeatures,
    validateFeatures,

    // Constants (for testing)
    CONFIG,
    PATTERN_LABELS,
    ERROR_CODES
});
