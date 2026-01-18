/**
 * Usage Logger Service
 * 
 * Provides non-blocking, async logging of API usage for billing, analytics, and audit.
 * Implements response interception pattern to capture metrics after response completion.
 * 
 * @module services/usageLogger
 */

'use strict';

const db = require('../db/connection');

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Configuration for usage logging
 * @constant
 */
const CONFIG = Object.freeze({
    // Status code ranges for success/failure classification
    SUCCESS_STATUS_MIN: 200,
    SUCCESS_STATUS_MAX: 399,

    // Default token calculation
    DEFAULT_TOKENS_SUCCESS: 1,
    DEFAULT_TOKENS_FAILURE: 0,

    // Maximum endpoint length to store
    MAX_ENDPOINT_LENGTH: 100,

    // Maximum IP length (IPv6)
    MAX_IP_LENGTH: 45
});

/**
 * SQL queries used by the logger
 * @constant
 */
const QUERIES = Object.freeze({
    INSERT_LOG: `
        INSERT INTO usage_logs 
        (tenant_id, api_key_id, endpoint, method, status_code, response_time_ms, request_ip, tokens_used, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `,

    GET_STATS: `
        SELECT 
            COUNT(*) as total_requests,
            COALESCE(SUM(tokens_used), 0) as total_tokens,
            ROUND(AVG(response_time_ms), 2) as avg_response_time,
            SUM(CASE WHEN status_code >= 200 AND status_code < 400 THEN 1 ELSE 0 END) as successful_requests,
            SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as failed_requests
        FROM usage_logs
        WHERE tenant_id = ?
          AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    `,

    GET_DAILY: `
        SELECT 
            DATE(created_at) as date,
            COUNT(*) as requests,
            COALESCE(SUM(tokens_used), 0) as tokens
        FROM usage_logs
        WHERE tenant_id = ?
          AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        GROUP BY DATE(created_at)
        ORDER BY date DESC
    `
});

// ============================================================================
// IP EXTRACTION UTILITIES
// ============================================================================

/**
 * Extract client IP address from request
 * 
 * Handles proxy headers in order of preference:
 * 1. X-Forwarded-For (first IP in list)
 * 2. X-Real-IP
 * 3. Direct connection IP
 * 
 * @param {Object} req - Express request object
 * @returns {string} Client IP address or 'unknown'
 */
function getClientIp(req) {
    // Check X-Forwarded-For (common for proxies and load balancers)
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor && typeof forwardedFor === 'string') {
        const firstIp = forwardedFor.split(',')[0];
        const trimmed = firstIp.trim();
        if (trimmed) return truncateString(trimmed, CONFIG.MAX_IP_LENGTH);
    }

    // Check X-Real-IP (nginx style)
    const realIp = req.headers['x-real-ip'];
    if (realIp && typeof realIp === 'string') {
        const trimmed = realIp.trim();
        if (trimmed) return truncateString(trimmed, CONFIG.MAX_IP_LENGTH);
    }

    // Fallback to direct connection IP
    const directIp = req.ip
        || req.connection?.remoteAddress
        || req.socket?.remoteAddress;

    return directIp ? truncateString(String(directIp), CONFIG.MAX_IP_LENGTH) : 'unknown';
}

// ============================================================================
// TOKEN CALCULATION
// ============================================================================

/**
 * Calculate tokens/units used for billing purposes
 * 
 * Current implementation:
 * - Successful requests (2xx, 3xx): 1 token
 * - Failed requests (4xx, 5xx): 0 tokens
 * 
 * Can be extended for more complex billing models.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {number} Number of tokens consumed
 */
function calculateTokensUsed(req, res) {
    const statusCode = res.statusCode;

    if (statusCode >= CONFIG.SUCCESS_STATUS_MIN && statusCode <= CONFIG.SUCCESS_STATUS_MAX) {
        return CONFIG.DEFAULT_TOKENS_SUCCESS;
    }

    return CONFIG.DEFAULT_TOKENS_FAILURE;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Truncate string to maximum length
 * 
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} Truncated string
 * @private
 */
function truncateString(str, maxLength) {
    if (!str || typeof str !== 'string') return '';
    return str.length > maxLength ? str.substring(0, maxLength) : str;
}

/**
 * Create usage log data object with validated fields
 * 
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @returns {Object} Validated log data
 * @private
 */
function createLogData(req, res) {
    const responseTime = Date.now() - (req.startTime || Date.now());
    const endpoint = truncateString(req.originalUrl || req.url, CONFIG.MAX_ENDPOINT_LENGTH);

    return {
        tenantId: req.tenant.id,
        apiKeyId: req.tenant.apiKeyId,
        endpoint,
        method: req.method,
        statusCode: res.statusCode,
        responseTimeMs: Math.max(0, responseTime),
        requestIp: getClientIp(req),
        tokensUsed: calculateTokensUsed(req, res)
    };
}

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

/**
 * Insert usage log record into database
 * 
 * @param {Object} data - Usage log data
 * @param {number} data.tenantId - Tenant ID
 * @param {number} data.apiKeyId - API Key ID
 * @param {string} data.endpoint - Request endpoint
 * @param {string} data.method - HTTP method
 * @param {number} data.statusCode - HTTP status code
 * @param {number} data.responseTimeMs - Response time in milliseconds
 * @param {string} data.requestIp - Client IP address
 * @param {number} data.tokensUsed - Tokens consumed
 * @returns {Promise<void>}
 */
async function logToDatabase(data) {
    await db.execute(QUERIES.INSERT_LOG, [
        data.tenantId,
        data.apiKeyId,
        data.endpoint,
        data.method,
        data.statusCode,
        data.responseTimeMs,
        data.requestIp,
        data.tokensUsed || 0
    ]);
}

/**
 * Get aggregated usage statistics for a tenant
 * 
 * @param {number} tenantId - Tenant ID
 * @param {Object} [options={}] - Query options
 * @param {number} [options.days=30] - Number of days to look back
 * @returns {Promise<Object>} Usage statistics
 */
async function getUsageStats(tenantId, options = {}) {
    const days = Math.min(Math.max(Number(options.days) || 30, 1), 365);

    try {
        const results = await db.query(QUERIES.GET_STATS, [tenantId, days]);

        const stats = results[0] || {};

        return {
            total_requests: Number(stats.total_requests) || 0,
            total_tokens: Number(stats.total_tokens) || 0,
            avg_response_time: Number(stats.avg_response_time) || 0,
            successful_requests: Number(stats.successful_requests) || 0,
            failed_requests: Number(stats.failed_requests) || 0
        };

    } catch (error) {
        console.error('[UsageLogger] Failed to get stats:', error.message);
        throw error;
    }
}

/**
 * Get daily usage breakdown for a tenant
 * 
 * @param {number} tenantId - Tenant ID
 * @param {number} [days=7] - Number of days to look back
 * @returns {Promise<Array>} Array of daily usage records
 */
async function getDailyUsage(tenantId, days = 7) {
    const safeDays = Math.min(Math.max(Number(days) || 7, 1), 90);

    try {
        return await db.query(QUERIES.GET_DAILY, [tenantId, safeDays]);
    } catch (error) {
        console.error('[UsageLogger] Failed to get daily usage:', error.message);
        throw error;
    }
}

// ============================================================================
// MIDDLEWARE
// ============================================================================

/**
 * Express middleware to log API usage after response completion
 * 
 * This middleware intercepts the response end to capture timing and status.
 * Logging is performed asynchronously to avoid blocking the response.
 * 
 * Must be placed AFTER authentication middleware (req.tenant must exist).
 * 
 * @param {Object} req - Express request (must have req.tenant)
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */
function logUsage(req, res, next) {
    // Skip if no tenant context
    if (!req.tenant) {
        return next();
    }

    // Store original end function
    const originalEnd = res.end;

    // Override res.end to capture completion
    res.end = function (chunk, encoding) {
        // Restore and call original end first
        res.end = originalEnd;
        res.end(chunk, encoding);

        // Log usage asynchronously (fire-and-forget)
        setImmediate(() => {
            try {
                const logData = createLogData(req, res);

                logToDatabase(logData).catch(err => {
                    console.error('[UsageLogger] Database write failed:', err.message);
                });

            } catch (err) {
                console.error('[UsageLogger] Error creating log data:', err.message);
            }
        });
    };

    next();
}

// ============================================================================
// MODULE EXPORTS
// ============================================================================

module.exports = Object.freeze({
    // Middleware
    logUsage,

    // Database operations
    logToDatabase,
    getUsageStats,
    getDailyUsage,

    // Utilities (exported for testing)
    getClientIp,
    calculateTokensUsed,

    // Constants (exported for testing)
    CONFIG,
    QUERIES
});
