const fs = require('fs');
const path = require('path');
const db = require('../db/connection');

/**
 * Migration runner script
 * Applies all SQL migrations in the Database/migrations directory
 * Requirements: 3.1, 3.5
 */

async function createMigrationsTable() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Migrations table ready');
  } catch (error) {
    console.error('Failed to create migrations table:', error);
    throw error;
  }
}

async function getAppliedMigrations() {
  try {
    const result = await db.query('SELECT filename FROM migrations ORDER BY applied_at');
    return result.map(row => row.filename);
  } catch (error) {
    console.error('Failed to get applied migrations:', error);
    throw error;
  }
}

async function applyMigration(filename, sqlContent) {
  try {
    console.log(`Applying migration: ${filename}`);
    
    // Split SQL content by semicolons and execute each statement
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        await db.execute(statement);
      }
    }
    
    // Record the migration as applied
    await db.execute('INSERT INTO migrations (filename) VALUES (?)', [filename]);
    console.log(`Migration ${filename} applied successfully`);
  } catch (error) {
    console.error(`Failed to apply migration ${filename}:`, error);
    throw error;
  }
}

async function runMigrations() {
  try {
    console.log('Starting database migrations...');
    
    // Ensure migrations table exists
    await createMigrationsTable();
    
    // Get list of applied migrations
    const appliedMigrations = await getAppliedMigrations();
    console.log(`Found ${appliedMigrations.length} previously applied migrations`);
    
    // Get list of migration files
    const migrationsDir = path.join(__dirname, '../Database/migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    console.log(`Found ${migrationFiles.length} migration files`);
    
    // Apply pending migrations
    let appliedCount = 0;
    for (const filename of migrationFiles) {
      if (!appliedMigrations.includes(filename)) {
        const filePath = path.join(migrationsDir, filename);
        const sqlContent = fs.readFileSync(filePath, 'utf8');
        await applyMigration(filename, sqlContent);
        appliedCount++;
      } else {
        console.log(`Migration ${filename} already applied, skipping`);
      }
    }
    
    console.log(`\nMigrations completed! Applied ${appliedCount} new migrations.`);
    
    // Verify soft delete schema
    const { checkSoftDeleteSchema } = require('./migrate_soft_delete');
    const schemaCheck = await checkSoftDeleteSchema();
    
    console.log('\nSoft delete schema verification:');
    console.log(`- Schema complete: ${schemaCheck.isComplete}`);
    console.log(`- Has deleted_at index: ${schemaCheck.hasIndex}`);
    console.log(`- Missing columns: ${schemaCheck.missingColumns.join(', ') || 'none'}`);
    
    if (schemaCheck.existingColumns.length > 0) {
      console.log('- Existing columns:');
      schemaCheck.existingColumns.forEach(col => {
        console.log(`  * ${col.COLUMN_NAME}: ${col.DATA_TYPE}, nullable: ${col.IS_NULLABLE}`);
      });
    }
    
  } catch (error) {
    console.error('Migration process failed:', error);
    throw error;
  }
}

// Run migrations if this script is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('\nMigration process completed successfully.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\nMigration process failed:', error);
      process.exit(1);
    });
}

module.exports = { runMigrations, createMigrationsTable, getAppliedMigrations, applyMigration };