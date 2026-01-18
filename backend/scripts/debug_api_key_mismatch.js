const crypto = require('crypto');
const db = require('../db/connection');
const { hashApiKey } = require('../utils/apiKeyUtils');

async function debug() {
    try {
        console.log('🔍 Starting API Key Mismatch Debug...');

        // 1. Simulate Generation (Logic copied from apiAccessService.js)
        const type = 'sandbox';
        const prefix = 'ck_sandbox_';

        // Service uses 'hex'
        const randomPartService = crypto.randomBytes(24).toString('hex');
        const keyService = `${prefix}${randomPartService}`;
        const hashService = crypto.createHash('sha256').update(keyService).digest('hex');

        console.log('\n--- Service Generation ---');
        console.log('Key (Service):', keyService);
        console.log('Hash (Service):', hashService);

        // 2. Simulate Insertion (Manual DB Insert)
        // We need a valid tenant_id. Let's find one or create dummy.
        // Assuming tenant_id=1 exists or we check.
        const tenants = await db.query('SELECT id FROM tenants LIMIT 1');
        if (tenants.length === 0) {
            console.error('❌ No tenants found. Cannot insert key.');
            process.exit(1);
        }
        const tenantId = tenants[0].id;
        console.log('Using Tenant ID:', tenantId);

        console.log('Inserting key into DB...');
        // Using db.execute (wrapper) like service does (via connection usually, but wrapper is close enough for test)
        await db.execute(
            `INSERT INTO api_keys (tenant_id, key_hash, key_prefix, name, scopes, rate_limit)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [tenantId, hashService, prefix, 'Debug Key', JSON.stringify(['predict']), 100]
        );
        console.log('✅ Insert Successful.');

        // 3. Simulate Validation (Logic from apiKeyAuth.js)
        console.log('\n--- Middleware Validation ---');
        // Middleware receives 'keyService' from header.

        // Middleware uses apiKeyUtils.hashApiKey
        const hashMiddleware = hashApiKey(keyService);
        console.log('Key Received:', keyService);
        console.log('Hash (Middleware):', hashMiddleware);

        if (hashService !== hashMiddleware) {
            console.error('❌ CRITICAL: Hash mismatch between Service and Middleware!');
            console.error(`Service: ${hashService}`);
            console.error(`Utils:   ${hashMiddleware}`);
        } else {
            console.log('✅ Hashes match in JS.');
        }

        // 4. Query DB (Logic from apiKeyAuth.js)
        const API_KEY_LOOKUP_QUERY = `
            SELECT id, key_hash FROM api_keys WHERE key_hash = ?
        `;
        const keys = await db.query(API_KEY_LOOKUP_QUERY, [hashMiddleware]);

        if (keys.length > 0) {
            console.log('✅ DB Lookup SUCCESS. Found key ID:', keys[0].id);
            console.log('DB Hash:', keys[0].key_hash);
        } else {
            console.error('❌ DB Lookup FAILED. Key not found in DB.');

            // Debug: Check what IS in the DB for this tenant
            const allKeys = await db.query('SELECT key_hash FROM api_keys WHERE tenant_id = ?', [tenantId]);
            console.log('All keys for tenant:', allKeys);
        }

        // Cleanup
        await db.execute('DELETE FROM api_keys WHERE key_hash = ?', [hashService]);
        console.log('\n🧹 Cleanup done.');
        process.exit(0);

    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

debug();
