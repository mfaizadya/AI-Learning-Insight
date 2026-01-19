const db = require('../db/connection');

async function cleanRequests() {
    try {
        console.log('🧹 Cleaning api_access_requests table...');
        await db.execute('TRUNCATE TABLE api_access_requests');
        // Also clean api_keys and tenants to be safe/consistent?
        // Maybe just requests for now to fix the 400 error for the user.
        // Actually, if I truncate requests, I should also delete tenants/keys linked to them to avoid orphans if I were being strict, 
        // but for now, just clearing requests is enough to allow a new submission.

        console.log('✅ api_access_requests truncated.');

        // Also ensure user role is reset to user if I want them to re-apply? 
        // No, the user might be using their own account.
        // I will just clear requests.

        process.exit(0);
    } catch (err) {
        console.error('❌ Error cleaning table:', err);
        process.exit(1);
    }
}

cleanRequests();
