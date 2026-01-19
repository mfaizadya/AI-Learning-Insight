const fs = require('fs');
const path = require('path');
const db = require('../db/connection');
const { runMigrations, createMigrationsTable } = require('./run_migrations');

/**
 * DATABASE SETUP SCRIPT
 * ---------------------
 * Usage: node scripts/setup_db.js
 * 
 * This script will:
 * 1. Initialize the database schema from Database/schema.sql
 * 2. Mark initial migrations (001, 002) as applied (since schema.sql covers them)
 * 3. Run any pending incremental migrations
 */

async function setupDatabase() {
    try {
        console.log('🚀 Starting Database Setup...');

        // 1. Read and Apply Schema (Base Structure)
        const schemaPath = path.join(__dirname, '../Database/schema.sql');
        console.log(`\n📂 Reading schema from: ${schemaPath}`);

        if (!fs.existsSync(schemaPath)) {
            throw new Error('Schema file not found!');
        }

        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Split by semicolon but ignore comments and empty lines
        // Note: Simple split, might need more robust parsing for complex stored procs
        const statements = schemaSql
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0);

        console.log(`\n⚡ Executing ${statements.length} schema statements...`);

        // Execute sequentially
        for (const stmt of statements) {
            // Skip comments that might be parsed as statements
            if (stmt.startsWith('--') || stmt.startsWith('/*')) continue;

            try {
                await db.execute(stmt);
            } catch (err) {
                // Ignore "table already exists" or similar for idempotency if needed
                // But for setup, we might want to be strict or allow overwrites if schema.sql has DROP
                // schema.sql has DROP TABLE IF EXISTS, so it should be fine.
                // However, "CREATE DATABASE" might fail if user doesn't have privileges, usually we skip it or warn
                if (err.code === 'ER_DB_CREATE_EXISTS' || err.code === 'ER_DB_DROP_EXISTS') {
                    // ignore
                } else if (stmt.includes('CREATE DATABASE') && err.code === 'ER_ACCESS_DENIED_ERROR') {
                    console.warn('⚠️  Skipping CREATE DATABASE (Access Denied). Assuming DB exists.');
                } else {
                    console.warn(`⚠️  Statement warning: ${err.message}`);
                    // Continue... many statements might fail if DB connection user is limited, but we try best effort
                }
            }
        }
        console.log('✅ Base Schema Applied.');

        // 2. Ensure Migrations Table and Baseline
        await createMigrationsTable();

        // Mark 001 and 002 as applied since they are part of schema.sql definition
        // (This prevents "Duplicate column" errors when running migrations)
        const baselineMigrations = [
            '001_add_soft_delete_support.sql',
            '002_ensure_soft_delete_schema.sql'
        ];

        console.log('\n🔖 Marking baseline migrations as applied...');
        for (const migration of baselineMigrations) {
            // Check if already applied to avoid duplicates
            const [rows] = await db.query('SELECT id FROM migrations WHERE filename = ?', [migration]);
            if (rows.length === 0) {
                await db.execute('INSERT INTO migrations (filename) VALUES (?)', [migration]);
                console.log(`   - Marked ${migration}`);
            } else {
                console.log(`   - ${migration} (already marked)`);
            }
        }

        // 3. Run Remaining Migrations (e.g. 003_add_api_access...)
        console.log('\n🔄 Running Migration Runner for incremental updates...');
        await runMigrations();

        console.log('\n🎉 Database Setup Completed Successfully!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Setup Failed:', error);
        process.exit(1);
    }
}

// Execute
if (require.main === module) {
    setupDatabase();
}
