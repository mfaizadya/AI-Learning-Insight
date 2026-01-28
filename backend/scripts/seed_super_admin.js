const db = require('../db/connection');
const bcrypt = require('bcrypt');

/**
 * PRODUCTION SEEDER: Super Admin
 * Usage: node scripts/seed_super_admin.js
 */

const SEED_ADMIN = {
    name: 'Super Admin',
    email: 'admin@ai-insight.com',
    password: 'admin_password_123!', // Change this after login!
    role: 'admin'
};

async function seedAdmin() {
    try {
        console.log('🔒 Checking specific Super Admin account...');

        // 1. Check if ANY admin exists (Safety check)
        const [existingAdmins] = await db.query('SELECT id, email FROM users WHERE role = ?', ['admin']);

        if (existingAdmins.length > 0) {
            console.log('⚠️  Admin accounts already exist in database:');
            existingAdmins.forEach(u => console.log(`   - ${u.email} (ID: ${u.id})`));

            // Check if specific email exists
            const specificAdmin = existingAdmins.find(u => u.email === SEED_ADMIN.email);
            if (specificAdmin) {
                console.log(`\n✅ Account '${SEED_ADMIN.email}' already exists. No action needed.`);
                process.exit(0);
            }
        }

        // 2. Create the Admin if missing
        console.log(`\n✨ Creating Super Admin: ${SEED_ADMIN.email}...`);

        const salt = await bcrypt.genSalt(10);
        const method = 'local';
        const hashedPassword = await bcrypt.hash(SEED_ADMIN.password, salt);

        await db.execute(
            `INSERT INTO users (username, email, password, role, created_at, updated_at) 
             VALUES (?, ?, ?, ?, NOW(), NOW())`,
            [SEED_ADMIN.name, SEED_ADMIN.email, hashedPassword, SEED_ADMIN.role]
        );

        console.log('\n🎉 Super Admin Created Successfully!');
        console.log('------------------------------------------------');
        console.log(`📧 Email:    ${SEED_ADMIN.email}`);
        console.log(`🔑 Password: ${SEED_ADMIN.password}`);
        console.log('------------------------------------------------');
        console.log('⚠️  IMPORTANT: Please login and change this password immediately.');

        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding Failed:', error);
        process.exit(1);
    }
}

// Run
if (require.main === module) {
    seedAdmin();
}
