/**
 * API Key Utility Module
 * 
 * Provides secure API key generation, hashing, and validation utilities.
 * Follows cryptographic best practices for API key management.
 * 
 * @module utils/apiKeyUtils
 * @see https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html
 */

'use strict';

const crypto = require('crypto');

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * API Key configuration constants
 * @constant
 */
const API_KEY_CONFIG = Object.freeze({
    // Byte length for random part generation
    RANDOM_BYTES_LENGTH: 24,

    // Minimum length for random part after encoding
    MIN_RANDOM_PART_LENGTH: 32,

    // Hash algorithm for secure storage
    HASH_ALGORITHM: 'sha256',

    // Hash output encoding
    HASH_ENCODING: 'hex'
});

/**
 * API Key environment prefixes
 * @constant
 */
const PREFIXES = Object.freeze({
    sandbox: 'ck_sandbox_',
    live: 'ck_live_'
});

/**
 * Valid environments for API key generation
 * @constant
 */
const VALID_ENVIRONMENTS = Object.freeze(Object.keys(PREFIXES));

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Generate a cryptographically secure API key
 * 
 * Creates a new API key with environment-specific prefix using
 * crypto.randomBytes for secure random generation.
 * 
 * @param {string} [environment='sandbox'] - Environment type ('sandbox' | 'live')
 * @returns {Object} Generated key data
 * @returns {string} returns.key - Full API key to provide to client
 * @returns {string} returns.prefix - Key prefix used
 * @returns {string} returns.hash - SHA256 hash for database storage
 * @throws {Error} If crypto.randomBytes fails
 * 
 * @example
 * const { key, hash } = generateApiKey('sandbox');
 * // key: 'ck_sandbox_abc123...' (share with client)
 * // hash: 'sha256...' (store in database)
 */
function generateApiKey(environment = 'sandbox') {
    // Validate and normalize environment
    const normalizedEnv = String(environment).toLowerCase();
    const prefix = PREFIXES[normalizedEnv] || PREFIXES.sandbox;

    // Generate cryptographically secure random bytes
    const randomBytes = crypto.randomBytes(API_KEY_CONFIG.RANDOM_BYTES_LENGTH);
    const randomPart = randomBytes.toString('base64url');

    // Construct full key
    const key = `${prefix}${randomPart}`;

    // Generate hash for secure storage
    const hash = hashApiKey(key);

    return Object.freeze({ key, prefix, hash });
}

/**
 * Hash an API key using SHA256
 * 
 * Used for secure database storage. Never store plain-text API keys.
 * 
 * @param {string} key - Plain-text API key to hash
 * @returns {string} SHA256 hash as 64-character hex string
 * @throws {TypeError} If key is not a string
 * 
 * @example
 * const hash = hashApiKey('ck_sandbox_abc123...');
 * // Returns: '64-character-hex-string'
 */
function hashApiKey(key) {
    if (typeof key !== 'string') {
        throw new TypeError('API key must be a string');
    }

    return crypto
        .createHash(API_KEY_CONFIG.HASH_ALGORITHM)
        .update(key)
        .digest(API_KEY_CONFIG.HASH_ENCODING);
}

/**
 * Validate API key format without database lookup
 * 
 * Performs structural validation of API key format.
 * This does NOT verify the key exists or is valid in the database.
 * 
 * @param {string} key - API key to validate
 * @returns {Object} Validation result
 * @returns {boolean} returns.valid - Whether format is valid
 * @returns {string|null} returns.environment - Detected environment or null
 * @returns {string|null} returns.error - Error message or null if valid
 * 
 * @example
 * const result = validateApiKeyFormat('ck_sandbox_abc123...');
 * if (!result.valid) {
 *   console.error(result.error);
 * }
 */
function validateApiKeyFormat(key) {
    // Type check
    if (!key || typeof key !== 'string') {
        return createValidationResult(false, null, 'API key is required and must be a string');
    }

    // Trim whitespace
    const trimmedKey = key.trim();

    // Detect environment from prefix
    const environment = detectEnvironment(trimmedKey);
    if (!environment) {
        return createValidationResult(false, null, 'Invalid API key prefix. Expected ck_sandbox_ or ck_live_');
    }

    // Validate minimum length
    const prefix = PREFIXES[environment];
    const randomPart = trimmedKey.slice(prefix.length);

    if (randomPart.length < API_KEY_CONFIG.MIN_RANDOM_PART_LENGTH) {
        return createValidationResult(false, environment, 'API key is too short');
    }

    // Validate random part contains only valid base64url characters
    if (!isValidBase64Url(randomPart)) {
        return createValidationResult(false, environment, 'API key contains invalid characters');
    }

    return createValidationResult(true, environment, null);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Detect environment from API key prefix
 * 
 * @param {string} key - API key to check
 * @returns {string|null} Environment name or null if not detected
 * @private
 */
function detectEnvironment(key) {
    for (const [env, prefix] of Object.entries(PREFIXES)) {
        if (key.startsWith(prefix)) {
            return env;
        }
    }
    return null;
}

/**
 * Validate base64url string format
 * 
 * @param {string} str - String to validate
 * @returns {boolean} True if valid base64url format
 * @private
 */
function isValidBase64Url(str) {
    // Base64url uses A-Z, a-z, 0-9, -, _
    const base64UrlRegex = /^[A-Za-z0-9_-]+$/;
    return base64UrlRegex.test(str);
}

/**
 * Create a standardized validation result object
 * 
 * @param {boolean} valid - Validation status
 * @param {string|null} environment - Detected environment
 * @param {string|null} error - Error message
 * @returns {Object} Frozen validation result
 * @private
 */
function createValidationResult(valid, environment, error) {
    return Object.freeze({ valid, environment, error });
}

/**
 * Compare two API keys in constant time
 * 
 * Uses timing-safe comparison to prevent timing attacks.
 * 
 * @param {string} keyA - First API key (or hash)
 * @param {string} keyB - Second API key (or hash)
 * @returns {boolean} True if keys match
 */
function secureCompare(keyA, keyB) {
    if (typeof keyA !== 'string' || typeof keyB !== 'string') {
        return false;
    }

    // Hash both to ensure equal length for timing-safe comparison
    const hashA = Buffer.from(hashApiKey(keyA), 'hex');
    const hashB = Buffer.from(hashApiKey(keyB), 'hex');

    return crypto.timingSafeEqual(hashA, hashB);
}

// ============================================================================
// MODULE EXPORTS
// ============================================================================

module.exports = Object.freeze({
    // Core functions
    generateApiKey,
    hashApiKey,
    validateApiKeyFormat,
    secureCompare,

    // Constants
    PREFIXES,
    VALID_ENVIRONMENTS,
    API_KEY_CONFIG
});
