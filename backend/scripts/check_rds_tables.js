const db = require('../db/connection');

async function checkTables() {
    try {
        console.log('🔍 Checking RDS Tables...');
        const rows = await db.query('SHOW TABLES');

        console.log('----------------------------------------');
        console.log(`Found ${rows.length} tables:`);

        const tables = rows.map(r => Object.values(r)[0]);
        tables.forEach(t => console.log(` - ${t}`));

        console.log('----------------------------------------');

        const expected = 'api_access_requests';
        if (tables.includes(expected)) {
            console.log(`✅ Table '${expected}' detected!`);
        } else {
            console.error(`❌ MISSING TABLE: '${expected}'`);
            console.error('⚠️  Migration 003 has NOT been applied yet.');
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Connection Failed:', err.message);
        process.exit(1);
    }
}

if (require.main === module) {
    checkTables();
}
