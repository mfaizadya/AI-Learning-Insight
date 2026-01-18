/**
 * API Key Authentication Middleware
 * 
 * Provides API Key validation and scope-based authorization for B2B API endpoints.
 * Implements secure lookup using hashed keys and attaches tenant context to requests.
 * 
 * @module middleware/apiKeyAuth
 * @see https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html
 */

'use strict';

const db = require('../db/connection');
const { hashApiKey } = require('../utils/apiKeyUtils');

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Error codes for authentication failures
 * @constant
 */
const AUTH_ERROR_CODES = Object.freeze({
    MISSING_API_KEY: 'MISSING_API_KEY',
    INVALID_API_KEY: 'INVALID_API_KEY',
    API_KEY_DEACTIVATED: 'API_KEY_DEACTIVATED',
    API_KEY_EXPIRED: 'API_KEY_EXPIRED',
    TENANT_DEACTIVATED: 'TENANT_DEACTIVATED',
    NO_AUTH_CONTEXT: 'NO_AUTH_CONTEXT',
    INSUFFICIENT_SCOPE: 'INSUFFICIENT_SCOPE',
    AUTH_SERVICE_ERROR: 'AUTH_SERVICE_ERROR'
});

/**
 * SQL query for API key lookup with tenant information
 * @constant
 */
const API_KEY_LOOKUP_QUERY = `
    SELECT 
        ak.id AS api_key_id,
        ak.tenant_id,
        ak.scopes,
        ak.rate_limit,
        ak.is_active AS key_active,
        ak.expires_at,
        t.name AS tenant_name,
        t.slug AS tenant_slug,
        t.tier,
        t.is_active AS tenant_active
    FROM api_keys ak
    JOIN tenants t ON ak.tenant_id = t.id
    WHERE ak.key_hash = ?
`;

/**
 * Default rate limit if not specified in API key
 * @constant
 */
const DEFAULT_RATE_LIMIT = 100;

/**
 * Default scopes if parsing fails
 * @constant
 */
const DEFAULT_SCOPES = Object.freeze(['predict']);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Extract API key from request headers
 * 
 * @param {Object} req - Express request object
 * @returns {string|null} API key or null if not found
 * @private
 */
function extractApiKey(req) {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || typeof apiKey !== 'string') {
        return null;
    }

    return apiKey.trim();
}

/**
 * Parse scopes from database value
 * Handles both JSON string and already-parsed array
 * 
 * @param {string|Array} scopesValue - Scopes from database
 * @returns {Array} Array of scope strings
 * @private
 */
function parseScopes(scopesValue) {
    if (Array.isArray(scopesValue)) {
        return scopesValue;
    }

    if (typeof scopesValue === 'string') {
        try {
            const parsed = JSON.parse(scopesValue);
            return Array.isArray(parsed) ? parsed : DEFAULT_SCOPES;
        } catch {
            return DEFAULT_SCOPES;
        }
    }

    return DEFAULT_SCOPES;
}

/**
 * Check if API key has expired
 * 
 * @param {Date|string|null} expiresAt - Expiration date
 * @returns {boolean} True if expired
 * @private
 */
function isExpired(expiresAt) {
    if (!expiresAt) return false;

    const expirationDate = new Date(expiresAt);
    return expirationDate < new Date();
}

/**
 * Create error response object
 * 
 * @param {string} message - Error message
 * @param {string} code - Error code from AUTH_ERROR_CODES
 * @param {Object} [extra={}] - Additional fields to include
 * @returns {Object} Error response object
 * @private
 */
function createErrorResponse(message, code, extra = {}) {
    return {
        success: false,
        error: message,
        code,
        ...extra
    };
}

/**
 * Create tenant context object from database row
 * 
 * @param {Object} keyData - Database row with key and tenant data
 * @returns {Object} Tenant context object
 * @private
 */
function createTenantContext(keyData) {
    return Object.freeze({
        id: keyData.tenant_id,
        name: keyData.tenant_name,
        slug: keyData.tenant_slug,
        tier: keyData.tier,
        apiKeyId: keyData.api_key_id,
        scopes: parseScopes(keyData.scopes),
        rateLimit: keyData.rate_limit || DEFAULT_RATE_LIMIT
    });
}

/**
 * Update last_used_at timestamp for API key (non-blocking)
 * 
 * @param {number} apiKeyId - API key ID
 * @private
 */
function updateLastUsedAsync(apiKeyId) {
    setImmediate(() => {
        db.execute(
            'UPDATE api_keys SET last_used_at = NOW() WHERE id = ?',
            [apiKeyId]
        ).catch(err => {
            console.error('[ApiKeyAuth] Failed to update last_used_at:', err.message);
        });
    });
}

// ============================================================================
// MIDDLEWARE FUNCTIONS
// ============================================================================

/**
 * Validate API Key from X-API-Key header
 * 
 * This middleware:
 * 1. Extracts API key from X-API-Key header
 * 2. Validates key against database (using secure hash lookup)
 * 3. Checks key and tenant active status
 * 4. Checks expiration
 * 5. Attaches tenant context to req.tenant
 * 6. Updates last_used_at timestamp asynchronously
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
async function validateApiKey(req, res, next) {
    const startTime = Date.now();

    // Extract API key from header
    const apiKey = extractApiKey(req);

    if (!apiKey) {
        return res.status(401).json(
            createErrorResponse(
                'API Key required. Provide X-API-Key header.',
                AUTH_ERROR_CODES.MISSING_API_KEY
            )
        );
    }

    try {
        // Hash key for secure database lookup
        const keyHash = hashApiKey(apiKey);

        // Query database
        const keys = await db.query(API_KEY_LOOKUP_QUERY, [keyHash]);

        // Check if key exists
        if (!keys || keys.length === 0) {
            return res.status(401).json(
                createErrorResponse(
                    'Invalid API Key',
                    AUTH_ERROR_CODES.INVALID_API_KEY
                )
            );
        }

        const keyData = keys[0];

        // Validate key is active
        if (!keyData.key_active) {
            return res.status(403).json(
                createErrorResponse(
                    'API Key has been deactivated',
                    AUTH_ERROR_CODES.API_KEY_DEACTIVATED
                )
            );
        }

        // Validate tenant is active
        if (!keyData.tenant_active) {
            return res.status(403).json(
                createErrorResponse(
                    'Tenant account has been deactivated',
                    AUTH_ERROR_CODES.TENANT_DEACTIVATED
                )
            );
        }

        // Check expiration
        if (isExpired(keyData.expires_at)) {
            return res.status(401).json(
                createErrorResponse(
                    'API Key has expired',
                    AUTH_ERROR_CODES.API_KEY_EXPIRED
                )
            );
        }

        // Attach tenant context to request
        req.tenant = createTenantContext(keyData);

        // Store start time for response timing
        req.startTime = startTime;

        // Update last_used_at asynchronously
        updateLastUsedAsync(keyData.api_key_id);

        next();

    } catch (error) {
        console.error('[ApiKeyAuth] Validation error:', error.message);

        return res.status(500).json(
            createErrorResponse(
                'Authentication service error',
                AUTH_ERROR_CODES.AUTH_SERVICE_ERROR
            )
        );
    }
}

/**
 * Create middleware to require specific scope
 * 
 * Factory function that returns middleware checking for required scope.
 * Supports wildcard scope '*' for admin access.
 * 
 * @param {string} requiredScope - The scope required for the endpoint
 * @returns {Function} Express middleware function
 * 
 * @example
 * router.post('/predict', requireScope('predict'), controller.predict);
 * router.get('/admin', requireScope('admin:read'), controller.adminPanel);
 */
function requireScope(requiredScope) {
    // Validate input at creation time
    if (!requiredScope || typeof requiredScope !== 'string') {
        throw new Error('requireScope: requiredScope must be a non-empty string');
    }

    return function scopeMiddleware(req, res, next) {
        // Ensure tenant context exists
        if (!req.tenant) {
            return res.status(401).json(
                createErrorResponse(
                    'Authentication required',
                    AUTH_ERROR_CODES.NO_AUTH_CONTEXT
                )
            );
        }

        const scopes = req.tenant.scopes || [];

        // Check for wildcard or specific scope
        if (scopes.includes('*') || scopes.includes(requiredScope)) {
            return next();
        }

        return res.status(403).json(
            createErrorResponse(
                `Insufficient permissions. Scope '${requiredScope}' required.`,
                AUTH_ERROR_CODES.INSUFFICIENT_SCOPE,
                {
                    required_scope: requiredScope,
                    your_scopes: scopes
                }
            )
        );
    };
}

/**
 * Check if request has specific scope (non-middleware version)
 * 
 * @param {Object} req - Express request with tenant context
 * @param {string} scope - Scope to check
 * @returns {boolean} True if request has the scope
 */
function hasScope(req, scope) {
    if (!req.tenant || !req.tenant.scopes) {
        return false;
    }

    const scopes = req.tenant.scopes;
    return scopes.includes('*') || scopes.includes(scope);
}

// ============================================================================
// MODULE EXPORTS
// ============================================================================

module.exports = Object.freeze({
    // Middleware
    validateApiKey,
    requireScope,

    // Utility
    hasScope,

    // Constants (exported for testing)
    AUTH_ERROR_CODES,
    DEFAULT_RATE_LIMIT,
    DEFAULT_SCOPES
});
