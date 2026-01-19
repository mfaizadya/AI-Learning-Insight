/**
 * B2B API Integration Tests
 * 
 * Comprehensive test suite for B2B API endpoints including:
 * - API Key authentication
 * - Rate limiting
 * - Prediction endpoint
 * - Usage logging
 * - Utility functions
 * 
 * @module tests/b2b.integration.test
 */

'use strict';

const request = require('supertest');
const app = require('../server');
const db = require('../db/connection');
const {
    generateApiKey,
    hashApiKey,
    validateApiKeyFormat,
    PREFIXES
} = require('../utils/apiKeyUtils');
const { resetRateLimit } = require('../middleware/tenantRateLimit');

// ============================================================================
// TEST CONFIGURATION
// ============================================================================

const TEST_CONFIG = {
    TENANT_NAME: 'B2B Test Tenant',
    TENANT_SLUG: `b2b-test-tenant-${Date.now()}`,
    ASYNC_WAIT_MS: 200
};

// ============================================================================
// TEST SUITE
// ============================================================================

describe('B2B API Integration Tests', () => {
    // Test data holders
    let testTenantId;
    let testApiKeyId;
    let testApiKey;
    let expiredApiKeyId;
    let expiredApiKey;
    let noScopeApiKey;
    let noScopeApiKeyId;

    // ========================================================================
    // SETUP & TEARDOWN
    // ========================================================================

    beforeAll(async () => {
        try {
            // Create test tenant
            const tenantResult = await db.execute(
                `INSERT INTO tenants (name, slug, tier, contact_email) 
                 VALUES (?, ?, 'sandbox', 'test@example.com')`,
                [TEST_CONFIG.TENANT_NAME, TEST_CONFIG.TENANT_SLUG]
            );
            testTenantId = tenantResult.insertId;

            // Create valid API key with full scopes
            const keyData = generateApiKey('sandbox');
            testApiKey = keyData.key;

            const keyResult = await db.execute(
                `INSERT INTO api_keys (tenant_id, key_hash, key_prefix, name, scopes, rate_limit) 
                 VALUES (?, ?, ?, 'Full Access Test Key', ?, 100)`,
                [testTenantId, keyData.hash, keyData.prefix, JSON.stringify(['predict', 'usage:read'])]
            );
            testApiKeyId = keyResult.insertId;

            // Create expired API key
            const expiredKeyData = generateApiKey('sandbox');
            expiredApiKey = expiredKeyData.key;

            const expiredKeyResult = await db.execute(
                `INSERT INTO api_keys (tenant_id, key_hash, key_prefix, name, scopes, expires_at) 
                 VALUES (?, ?, ?, 'Expired Key', ?, DATE_SUB(NOW(), INTERVAL 1 DAY))`,
                [testTenantId, expiredKeyData.hash, expiredKeyData.prefix, JSON.stringify(['predict'])]
            );
            expiredApiKeyId = expiredKeyResult.insertId;

            // Create API key without predict scope
            const noScopeKeyData = generateApiKey('sandbox');
            noScopeApiKey = noScopeKeyData.key;

            const noScopeResult = await db.execute(
                `INSERT INTO api_keys (tenant_id, key_hash, key_prefix, name, scopes) 
                 VALUES (?, ?, ?, 'No Scope Key', ?)`,
                [testTenantId, noScopeKeyData.hash, noScopeKeyData.prefix, JSON.stringify(['other:read'])]
            );
            noScopeApiKeyId = noScopeResult.insertId;

        } catch (error) {
            console.error('Test setup failed:', error.message);
            throw error;
        }
    });

    afterAll(async () => {
        try {
            // Clean up in correct order (foreign key constraints)
            await db.execute('DELETE FROM usage_logs WHERE tenant_id = ?', [testTenantId]);
            await db.execute('DELETE FROM api_keys WHERE tenant_id = ?', [testTenantId]);
            await db.execute('DELETE FROM tenants WHERE id = ?', [testTenantId]);

            // Close database connection
            await db.close();
        } catch (error) {
            console.error('Test cleanup failed:', error.message);
        }
    });

    beforeEach(() => {
        // Reset rate limit before each test to ensure isolation
        if (testTenantId) {
            resetRateLimit(testTenantId);
        }
    });

    // ========================================================================
    // API KEY VALIDATION TESTS
    // ========================================================================

    describe('API Key Validation', () => {
        test('should reject requests without API key', async () => {
            const response = await request(app)
                .post('/api/v1/predict')
                .send({ features: [1, 2, 3, 4, 5, 6, 7, 8, 9] });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.code).toBe('MISSING_API_KEY');
        });

        test('should reject invalid API key', async () => {
            const response = await request(app)
                .post('/api/v1/predict')
                .set('X-API-Key', 'invalid-key-12345')
                .send({ features: [1, 2, 3, 4, 5, 6, 7, 8, 9] });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.code).toBe('INVALID_API_KEY');
        });

        test('should reject expired API key', async () => {
            const response = await request(app)
                .get('/api/v1/health')
                .set('X-API-Key', expiredApiKey);

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.code).toBe('API_KEY_EXPIRED');
        });

        test('should accept valid API key', async () => {
            const response = await request(app)
                .get('/api/v1/health')
                .set('X-API-Key', testApiKey);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.status).toBe('healthy');
            expect(response.body.data.tenant.name).toBe(TEST_CONFIG.TENANT_NAME);
        });
    });

    // ========================================================================
    // SCOPE AUTHORIZATION TESTS
    // ========================================================================

    describe('Scope Authorization', () => {
        test('should allow access with correct scope', async () => {
            const response = await request(app)
                .post('/api/v1/predict')
                .set('X-API-Key', testApiKey)
                .send({ features: [4, 3, 5, 2, 4, 3, 5, 4, 3] });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        test('should reject access without required scope', async () => {
            const response = await request(app)
                .post('/api/v1/predict')
                .set('X-API-Key', noScopeApiKey)
                .send({ features: [4, 3, 5, 2, 4, 3, 5, 4, 3] });

            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body.code).toBe('INSUFFICIENT_SCOPE');
            expect(response.body.required_scope).toBe('predict');
        });
    });

    // ========================================================================
    // HEALTH CHECK TESTS
    // ========================================================================

    describe('Health Check Endpoint', () => {
        test('should return health status with tenant info', async () => {
            const response = await request(app)
                .get('/api/v1/health')
                .set('X-API-Key', testApiKey);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toMatchObject({
                status: 'healthy',
                version: expect.any(String)
            });
            expect(response.body.data.tenant).toBeDefined();
            expect(response.body.data.tenant.id).toBe(testTenantId);
            expect(response.body.data.timestamp).toBeDefined();
        });
    });

    // ========================================================================
    // PREDICT ENDPOINT TESTS
    // ========================================================================

    describe('Predict Endpoint', () => {
        test('should return prediction for valid features', async () => {
            const response = await request(app)
                .post('/api/v1/predict')
                .set('X-API-Key', testApiKey)
                .send({
                    features: [4, 3, 5, 2, 4, 3, 5, 4, 3],
                    student_external_id: 'student-test-123'
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.learning_pattern).toBeDefined();
            expect(response.body.data.student_external_id).toBe('student-test-123');
            expect(response.body.data.tenant_id).toBe(testTenantId);
            expect(response.body.data.processed_at).toBeDefined();
        });

        test('should reject missing features', async () => {
            const response = await request(app)
                .post('/api/v1/predict')
                .set('X-API-Key', testApiKey)
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.code).toBe('MISSING_FEATURES');
        });

        test('should reject invalid features array length', async () => {
            const response = await request(app)
                .post('/api/v1/predict')
                .set('X-API-Key', testApiKey)
                .send({ features: [1, 2, 3] });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.code).toBe('INVALID_FEATURES_LENGTH');
            expect(response.body.expected_length).toBe(9);
        });

        test('should reject non-numeric features', async () => {
            const response = await request(app)
                .post('/api/v1/predict')
                .set('X-API-Key', testApiKey)
                .send({ features: [1, 2, 'three', 4, 5, 6, 7, 8, 9] });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.code).toBe('INVALID_FEATURE_TYPE');
        });

        test('should work without student_external_id', async () => {
            const response = await request(app)
                .post('/api/v1/predict')
                .set('X-API-Key', testApiKey)
                .send({ features: [4, 3, 5, 2, 4, 3, 5, 4, 3] });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.student_external_id).toBeNull();
        });

        test('should handle edge case with all zeros', async () => {
            const response = await request(app)
                .post('/api/v1/predict')
                .set('X-API-Key', testApiKey)
                .send({ features: [0, 0, 0, 0, 0, 0, 0, 0, 0] });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.learning_pattern).toBeDefined();
        });
    });

    // ========================================================================
    // RATE LIMITING TESTS
    // ========================================================================

    describe('Rate Limiting', () => {
        test('should include rate limit headers', async () => {
            const response = await request(app)
                .get('/api/v1/health')
                .set('X-API-Key', testApiKey);

            expect(response.headers['x-ratelimit-limit']).toBeDefined();
            expect(response.headers['x-ratelimit-remaining']).toBeDefined();
            expect(response.headers['x-ratelimit-reset']).toBeDefined();
        });

        test('should decrement remaining count', async () => {
            const first = await request(app)
                .get('/api/v1/health')
                .set('X-API-Key', testApiKey);

            const remainingFirst = parseInt(first.headers['x-ratelimit-remaining'], 10);

            const second = await request(app)
                .get('/api/v1/health')
                .set('X-API-Key', testApiKey);

            const remainingSecond = parseInt(second.headers['x-ratelimit-remaining'], 10);

            expect(remainingSecond).toBe(remainingFirst - 1);
        });
    });

    // ========================================================================
    // USAGE LOGGING TESTS
    // ========================================================================

    describe('Usage Logging', () => {
        test('should log API usage to database', async () => {
            // Make a unique request
            const uniqueStudentId = `usage-test-${Date.now()}`;

            await request(app)
                .post('/api/v1/predict')
                .set('X-API-Key', testApiKey)
                .send({
                    features: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    student_external_id: uniqueStudentId
                });

            // Wait for async logging
            await new Promise(resolve => setTimeout(resolve, TEST_CONFIG.ASYNC_WAIT_MS));

            // Check usage log
            const logs = await db.query(
                `SELECT * FROM usage_logs 
                 WHERE tenant_id = ? AND endpoint LIKE '%predict%' 
                 ORDER BY created_at DESC LIMIT 1`,
                [testTenantId]
            );

            expect(logs.length).toBeGreaterThan(0);
            expect(logs[0].method).toBe('POST');
            expect(logs[0].status_code).toBe(200);
            expect(logs[0].tokens_used).toBe(1);
        });

        test('should not charge tokens for failed requests', async () => {
            await request(app)
                .post('/api/v1/predict')
                .set('X-API-Key', testApiKey)
                .send({ features: [1, 2, 3] }); // Invalid - will fail

            await new Promise(resolve => setTimeout(resolve, TEST_CONFIG.ASYNC_WAIT_MS));

            const logs = await db.query(
                `SELECT * FROM usage_logs 
                 WHERE tenant_id = ? AND status_code = 400 
                 ORDER BY created_at DESC LIMIT 1`,
                [testTenantId]
            );

            if (logs.length > 0) {
                expect(logs[0].tokens_used).toBe(0);
            }
        });
    });
});

// ============================================================================
// API KEY UTILITY TESTS
// ============================================================================

describe('API Key Utilities', () => {
    describe('generateApiKey', () => {
        test('should generate valid sandbox API key', () => {
            const result = generateApiKey('sandbox');

            expect(result.key).toMatch(/^ck_sandbox_/);
            expect(result.prefix).toBe(PREFIXES.sandbox);
            expect(result.hash).toHaveLength(64);
        });

        test('should generate valid live API key', () => {
            const result = generateApiKey('live');

            expect(result.key).toMatch(/^ck_live_/);
            expect(result.prefix).toBe(PREFIXES.live);
            expect(result.hash).toHaveLength(64);
        });

        test('should default to sandbox for invalid environment', () => {
            const result = generateApiKey('invalid');

            expect(result.key).toMatch(/^ck_sandbox_/);
        });

        test('should generate unique keys', () => {
            const key1 = generateApiKey('sandbox');
            const key2 = generateApiKey('sandbox');

            expect(key1.key).not.toBe(key2.key);
            expect(key1.hash).not.toBe(key2.hash);
        });
    });

    describe('hashApiKey', () => {
        test('should produce consistent hash for same key', () => {
            const key = 'ck_sandbox_test123456789';
            const hash1 = hashApiKey(key);
            const hash2 = hashApiKey(key);

            expect(hash1).toBe(hash2);
        });

        test('should produce different hash for different keys', () => {
            const hash1 = hashApiKey('ck_sandbox_key1');
            const hash2 = hashApiKey('ck_sandbox_key2');

            expect(hash1).not.toBe(hash2);
        });

        test('should throw for non-string input', () => {
            expect(() => hashApiKey(null)).toThrow(TypeError);
            expect(() => hashApiKey(123)).toThrow(TypeError);
        });
    });

    describe('validateApiKeyFormat', () => {
        test('should validate sandbox key format', () => {
            const result = validateApiKeyFormat('ck_sandbox_' + 'x'.repeat(32));

            expect(result.valid).toBe(true);
            expect(result.environment).toBe('sandbox');
            expect(result.error).toBeNull();
        });

        test('should validate live key format', () => {
            const result = validateApiKeyFormat('ck_live_' + 'x'.repeat(32));

            expect(result.valid).toBe(true);
            expect(result.environment).toBe('live');
        });

        test('should reject invalid prefix', () => {
            const result = validateApiKeyFormat('invalid_' + 'x'.repeat(32));

            expect(result.valid).toBe(false);
            expect(result.environment).toBeNull();
        });

        test('should reject short key', () => {
            const result = validateApiKeyFormat('ck_sandbox_short');

            expect(result.valid).toBe(false);
        });

        test('should reject null/undefined', () => {
            expect(validateApiKeyFormat(null).valid).toBe(false);
            expect(validateApiKeyFormat(undefined).valid).toBe(false);
        });
    });
});

// ============================================================================
// CONTROLLER UNIT TESTS
// ============================================================================

describe('B2B Controller Functions', () => {
    const { calculatePatternFromFeatures, validateFeatures } = require('../controllers/b2bController');

    describe('calculatePatternFromFeatures', () => {
        test('should return Consistent Learner for high first-third features', () => {
            const result = calculatePatternFromFeatures([5, 5, 5, 1, 1, 1, 1, 1, 1]);

            expect(result.label).toBe('Consistent Learner');
            expect(result.confidence).toBeGreaterThan(0);
        });

        test('should return Fast Learner for high middle features', () => {
            const result = calculatePatternFromFeatures([1, 1, 1, 5, 5, 5, 1, 1, 1]);

            expect(result.label).toBe('Fast Learner');
        });

        test('should return Reflective Learner for high last-third features', () => {
            const result = calculatePatternFromFeatures([1, 1, 1, 1, 1, 1, 5, 5, 5]);

            expect(result.label).toBe('Reflective Learner');
        });

        test('should return Balanced Learner for even distribution', () => {
            const result = calculatePatternFromFeatures([3, 3, 3, 3, 3, 3, 3, 3, 3]);

            expect(result.label).toBe('Balanced Learner');
        });

        test('should handle all zeros gracefully', () => {
            const result = calculatePatternFromFeatures([0, 0, 0, 0, 0, 0, 0, 0, 0]);

            expect(result.label).toBeDefined();
            expect(result.confidence).toBeDefined();
        });
    });

    describe('validateFeatures', () => {
        test('should accept valid features array', () => {
            const result = validateFeatures([1, 2, 3, 4, 5, 6, 7, 8, 9]);

            expect(result.valid).toBe(true);
        });

        test('should reject null features', () => {
            const result = validateFeatures(null);

            expect(result.valid).toBe(false);
            expect(result.error.code).toBe('MISSING_FEATURES');
        });

        test('should reject wrong length array', () => {
            const result = validateFeatures([1, 2, 3]);

            expect(result.valid).toBe(false);
            expect(result.error.code).toBe('INVALID_FEATURES_LENGTH');
        });

        test('should reject non-numeric values', () => {
            const result = validateFeatures([1, 2, 'three', 4, 5, 6, 7, 8, 9]);

            expect(result.valid).toBe(false);
            expect(result.error.code).toBe('INVALID_FEATURE_TYPE');
        });

        test('should reject NaN values', () => {
            const result = validateFeatures([1, 2, NaN, 4, 5, 6, 7, 8, 9]);

            expect(result.valid).toBe(false);
        });

        test('should reject Infinity values', () => {
            const result = validateFeatures([1, 2, Infinity, 4, 5, 6, 7, 8, 9]);

            expect(result.valid).toBe(false);
        });
    });
});
