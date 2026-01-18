#!/usr/bin/env node

/**
 * API Key Generation Script
 * 
 * Usage:
 *   node scripts/generateApiKey.js [environment]
 * 
 * Arguments:
 *   environment - 'sandbox' (default) or 'live'
 * 
 * Example:
 *   node scripts/generateApiKey.js sandbox
 *   node scripts/generateApiKey.js live
 * 
 * Output:
 *   Generates a new API key and displays:
 *   - Full API key (to share with tenant)
 *   - Key hash (to store in database)
 *   - SQL INSERT statement for easy database insertion
 */

const { generateApiKey } = require('../utils/apiKeyUtils');

// Get environment from command line args
const environment = process.argv[2] || 'sandbox';

if (!['sandbox', 'live'].includes(environment)) {
    console.error('Error: Environment must be "sandbox" or "live"');
    console.error('Usage: node scripts/generateApiKey.js [sandbox|live]');
    process.exit(1);
}

console.log('\n========================================');
console.log('   CerdasKu AI - API Key Generator');
console.log('========================================\n');

// Generate the API key
const result = generateApiKey(environment);

console.log(`Environment:  ${environment.toUpperCase()}`);
console.log(`Prefix:       ${result.prefix}`);
console.log('');
console.log('----------------------------------------');
console.log('IMPORTANT: Save these values securely!');
console.log('----------------------------------------\n');

console.log(`🔑 API Key (share with tenant):`);
console.log(`   ${result.key}\n`);

console.log(`🔒 Key Hash (store in database):`);
console.log(`   ${result.hash}\n`);

console.log('----------------------------------------');
console.log('SQL INSERT Statement:');
console.log('----------------------------------------\n');

console.log(`-- Replace <TENANT_ID> with actual tenant ID`);
console.log(`INSERT INTO api_keys (tenant_id, key_hash, key_prefix, name, scopes, rate_limit)`);
console.log(`VALUES (`);
console.log(`    <TENANT_ID>,`);
console.log(`    '${result.hash}',`);
console.log(`    '${result.prefix}',`);
console.log(`    'Generated Key ${new Date().toISOString().split('T')[0]}',`);
console.log(`    '["predict"]',`);
console.log(`    100`);
console.log(`);\n`);

console.log('========================================');
console.log('⚠️  Never share the API Key Hash publicly');
console.log('⚠️  The full API Key is shown ONLY ONCE');
console.log('========================================\n');
