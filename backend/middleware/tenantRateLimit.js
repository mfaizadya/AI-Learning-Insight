/**
 * Per-Tenant Rate Limiting Middleware
 * 
 * Provides in-memory rate limiting per tenant for B2B API endpoints.
 * Uses fixed window counter algorithm for simplicity.
 * 
 * For production with multiple server instances, migrate to Redis.
 * 
 * @module middleware/tenantRateLimit
 * @see https://redis.io/commands/incr/#pattern-rate-limiter
 */

'use strict';

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Rate limiting configuration
 * @constant
 */
const CONFIG = Object.freeze({
    // Window duration in milliseconds
    WINDOW_MS: 60 * 1000, // 1 minute

    // Default limit if not specified per-tenant
    DEFAULT_LIMIT: 100,

    // Cleanup interval in milliseconds
    CLEANUP_INTERVAL_MS: 60 * 1000, // 1 minute

    // Keep records for this many windows before cleanup
    CLEANUP_WINDOW_MULTIPLIER: 2,

    // HTTP headers for rate limit info
    HEADERS: Object.freeze({
        LIMIT: 'X-RateLimit-Limit',
        REMAINING: 'X-RateLimit-Remaining',
        RESET: 'X-RateLimit-Reset'
    })
});

/**
 * Error response for rate limit exceeded
 * @constant
 */
const RATE_LIMIT_ERROR = Object.freeze({
    success: false,
    error: 'Rate limit exceeded. Please slow down your requests.',
    code: 'RATE_LIMIT_EXCEEDED'
});

// ============================================================================
// RATE LIMIT STORE
// ============================================================================

/**
 * In-memory store for rate limit tracking
 * Map<tenantId, RateLimitRecord>
 * 
 * @typedef {Object} RateLimitRecord
 * @property {number} count - Request count in current window
 * @property {number} windowStart - Window start timestamp
 */
const rateLimitStore = new Map();

// ============================================================================
// CORE RATE LIMITING LOGIC
// ============================================================================

/**
 * Get or create rate limit record for tenant
 * 
 * @param {number} tenantId - Tenant identifier
 * @param {number} now - Current timestamp
 * @returns {Object} Rate limit record
 * @private
 */
function getOrCreateRecord(tenantId, now) {
    let record = rateLimitStore.get(tenantId);

    // Create new record if none exists or window expired
    if (!record || (now - record.windowStart) >= CONFIG.WINDOW_MS) {
        record = {
            count: 0,
            windowStart: now
        };
    }

    return record;
}

/**
 * Calculate rate limit headers
 * 
 * @param {Object} record - Rate limit record
 * @param {number} limit - Request limit
 * @param {number} now - Current timestamp
 * @returns {Object} Header values
 * @private
 */
function calculateHeaders(record, limit, now) {
    const remaining = Math.max(0, limit - record.count);
    const resetInSeconds = Math.max(0,
        Math.ceil((record.windowStart + CONFIG.WINDOW_MS - now) / 1000)
    );

    return {
        limit: String(limit),
        remaining: String(remaining),
        reset: String(resetInSeconds)
    };
}

/**
 * Set rate limit headers on response
 * 
 * @param {Object} res - Express response
 * @param {Object} headers - Header values
 * @private
 */
function setRateLimitHeaders(res, headers) {
    res.set({
        [CONFIG.HEADERS.LIMIT]: headers.limit,
        [CONFIG.HEADERS.REMAINING]: headers.remaining,
        [CONFIG.HEADERS.RESET]: headers.reset
    });
}

// ============================================================================
// MIDDLEWARE
// ============================================================================

/**
 * Rate limiting middleware for B2B API
 * 
 * Must be used AFTER validateApiKey middleware to access req.tenant.
 * 
 * Implements fixed window counter algorithm:
 * - Each tenant has a counter that resets every minute
 * - Limit is configurable per-tenant via API key settings
 * 
 * @param {Object} req - Express request (must have req.tenant)
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */
function tenantRateLimit(req, res, next) {
    // Skip if no tenant context
    if (!req.tenant) {
        return next();
    }

    const tenantId = req.tenant.id;
    const limit = req.tenant.rateLimit || CONFIG.DEFAULT_LIMIT;
    const now = Date.now();

    // Get or create record
    const record = getOrCreateRecord(tenantId, now);

    // Increment counter
    record.count++;
    rateLimitStore.set(tenantId, record);

    // Calculate and set headers
    const headers = calculateHeaders(record, limit, now);
    setRateLimitHeaders(res, headers);

    // Check if limit exceeded
    if (record.count > limit) {
        return res.status(429).json({
            ...RATE_LIMIT_ERROR,
            limit,
            retry_after: parseInt(headers.reset, 10)
        });
    }

    next();
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get current rate limit status for a tenant
 * 
 * @param {number} tenantId - Tenant ID
 * @param {number} [customLimit] - Optional custom limit to use
 * @returns {Object} Current status
 * @returns {number} returns.count - Current request count
 * @returns {number} returns.limit - Rate limit
 * @returns {number} returns.remaining - Remaining requests
 * @returns {number} returns.resetIn - Seconds until reset
 */
function getRateLimitStatus(tenantId, customLimit) {
    const limit = customLimit || CONFIG.DEFAULT_LIMIT;
    const now = Date.now();
    const record = rateLimitStore.get(tenantId);

    if (!record || (now - record.windowStart) >= CONFIG.WINDOW_MS) {
        return {
            count: 0,
            limit,
            remaining: limit,
            resetIn: 0
        };
    }

    const headers = calculateHeaders(record, limit, now);

    return {
        count: record.count,
        limit,
        remaining: parseInt(headers.remaining, 10),
        resetIn: parseInt(headers.reset, 10)
    };
}

/**
 * Reset rate limit for a specific tenant
 * 
 * @param {number} tenantId - Tenant ID
 * @returns {boolean} True if record was deleted
 */
function resetRateLimit(tenantId) {
    return rateLimitStore.delete(tenantId);
}

/**
 * Reset all rate limits (use with caution)
 * 
 * @returns {void}
 */
function resetAllRateLimits() {
    rateLimitStore.clear();
}

/**
 * Get store size for monitoring
 * 
 * @returns {number} Number of tenants in store
 */
function getStoreSize() {
    return rateLimitStore.size;
}

// ============================================================================
// CLEANUP
// ============================================================================

/**
 * Cleanup expired rate limit records
 * 
 * Removes records that are older than 2 windows to prevent memory leaks.
 * Called automatically at configured interval.
 * 
 * @returns {number} Number of records removed
 */
function cleanupExpiredRecords() {
    const now = Date.now();
    const expiryThreshold = CONFIG.WINDOW_MS * CONFIG.CLEANUP_WINDOW_MULTIPLIER;
    let removedCount = 0;

    for (const [tenantId, record] of rateLimitStore.entries()) {
        if (now - record.windowStart >= expiryThreshold) {
            rateLimitStore.delete(tenantId);
            removedCount++;
        }
    }

    if (removedCount > 0) {
        console.log(`[RateLimit] Cleaned up ${removedCount} expired records`);
    }

    return removedCount;
}

// ============================================================================
// AUTO-CLEANUP INITIALIZATION
// ============================================================================

/**
 * Cleanup interval reference
 * @private
 */
let cleanupIntervalId = null;

/**
 * Start automatic cleanup interval
 * 
 * @returns {void}
 */
function startCleanupInterval() {
    if (cleanupIntervalId) {
        return; // Already running
    }

    cleanupIntervalId = setInterval(cleanupExpiredRecords, CONFIG.CLEANUP_INTERVAL_MS);

    // Prevent interval from keeping Node.js process alive
    if (cleanupIntervalId.unref) {
        cleanupIntervalId.unref();
    }
}

/**
 * Stop automatic cleanup interval
 * 
 * @returns {void}
 */
function stopCleanupInterval() {
    if (cleanupIntervalId) {
        clearInterval(cleanupIntervalId);
        cleanupIntervalId = null;
    }
}

// Start cleanup on module load
startCleanupInterval();

// ============================================================================
// MODULE EXPORTS
// ============================================================================

module.exports = Object.freeze({
    // Middleware
    tenantRateLimit,

    // Status utilities
    getRateLimitStatus,
    resetRateLimit,
    resetAllRateLimits,
    getStoreSize,

    // Cleanup
    cleanupExpiredRecords,
    startCleanupInterval,
    stopCleanupInterval,

    // Constants (for testing)
    CONFIG
});
