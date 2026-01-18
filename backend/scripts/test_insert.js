const db = require('../db/connection');

async function testInsert() {
    try {
        console.log('🧪 Testing Direct Insert...');

        // Use a dummy user ID that definitely exists? 
        // I need a user ID. 
        // Let's create one or get one first.
        const [users] = await db.query('SELECT id FROM users LIMIT 1');
        if (users.length === 0) {
            console.error('No users found.');
            process.exit(1);
        }
        const userId = users[0].id;
        console.log('Using User ID:', userId);

        const [result] = await db.execute(
            `INSERT INTO api_access_requests 
             (user_id, organization_name, contact_email, use_case, expected_requests, description)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, 'Test Org', 'test@test.com', 'lms_integration', '1000', 'Direct DB Test']
        );

        console.log('✅ Insert Success! ID:', result.insertId);
        process.exit(0);
    } catch (error) {
        console.error('❌ Insert Failed:', error.message);
        process.exit(1);
    }
}

testInsert();
