const db = require('../db/connection');

async function checkRequests() {
    try {
        console.log('🔍 Debugging Config...');
        console.log('   Host:', process.env.DB_HOST);
        console.log('   Database:', process.env.DB_NAME);

        console.log('\n🔍 Debugging Tables (All)...');
        const [tables] = await db.query('SHOW TABLES');
        // Map to just table names for easier reading
        const tableNames = tables.map(t => Object.values(t)[0]);
        console.log('   Tables Found:', tableNames);

        if (tableNames.includes('api_access_requests')) {
            console.log('\n✅ Table api_access_requests EXISTS.');
            const [rows] = await db.query('SELECT * FROM api_access_requests LIMIT 5');
            console.table(rows);
        } else {
            console.error('\n❌ Table api_access_requests DOES NOT EXIST.');

            // Attempt to FIX it right here
            console.log('🛠️  Attempting to create table manually...');
            const sql = `
             CREATE TABLE IF NOT EXISTS \`api_access_requests\` (
                  \`id\` INT NOT NULL AUTO_INCREMENT,
                  \`user_id\` INT NOT NULL COMMENT 'FK to users table',
                  \`organization_name\` VARCHAR(255) NOT NULL,
                  \`contact_email\` VARCHAR(255) NOT NULL,
                  \`use_case\` VARCHAR(50) NOT NULL,
                  \`expected_requests\` VARCHAR(50) NOT NULL,
                  \`description\` TEXT DEFAULT NULL,
                  \`status\` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
                  \`reviewed_by\` INT DEFAULT NULL,
                  \`reviewed_at\` TIMESTAMP NULL DEFAULT NULL,
                  \`rejection_reason\` TEXT DEFAULT NULL,
                  \`tenant_id\` INT DEFAULT NULL,
                  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  PRIMARY KEY (\`id\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
             `;
            // Note: I modified FKs to be INT for user_id/reviewed_by to match users.id (INT) instead of CHAR(36) in the migration file if that was a mismatch?
            // Checking schema.sql: users.id is INT.
            // Checking migration 003: user_id CHAR(36).
            // AHA! MISMATCH! schema.sql uses INT Auto Increment. Migration 003 uses CHAR(36).
            // This might be why migration failed (Foreign Key Error) but error was swallowed or missed?

            await db.execute(sql);
            console.log('✅ Table created manually (Corrected FK types to INT).');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkRequests();
