const db = require('../db/connection');

async function resetMigration() {
    try {
        console.log('🗑️  Deleting 003 from migrations table...');
        await db.execute("DELETE FROM migrations WHERE filename LIKE '003%'");
        console.log('✅ Deleted.');

        // Also drop the table if it exists (partial creation?)
        try {
            await db.execute("DROP TABLE IF EXISTS api_access_requests");
            console.log('✅ Dropped api_access_requests if existed.');
        } catch (e) {
            console.log('⚠️ Could not drop table:', e.message);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

resetMigration();
