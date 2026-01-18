const service = require('../services/apiAccessService');
const db = require('../db/connection');

async function testService() {
    try {
        console.log('🧪 Testing Service Directly...');

        const rows = await db.query('SELECT id, email FROM users LIMIT 1');
        console.log('Rows returned:', rows);

        if (!rows || rows.length === 0) {
            throw new Error('No users found to test with');
        }
        const user = rows[0];
        console.log('User:', user);

        const data = {
            organizationName: "Debug Org " + Date.now(),
            contactEmail: "debug@test.com",
            useCase: "lms_integration",
            expectedRequests: "1000",
            description: "Direct Service Test"
        };

        console.log('Calling createRequest...');
        const result = await service.createRequest(data, user.id);

        console.log('✅ Service Success!', result);
        process.exit(0);

    } catch (error) {
        console.error('❌ Service Failed:', error);
        process.exit(1);
    }
}

testService();
