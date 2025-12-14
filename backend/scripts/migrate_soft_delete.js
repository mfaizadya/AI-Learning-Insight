const db = require('../db/connection');

/**
 * Migration script to add soft delete support to users table
 * Requirements: 3.1, 3.5
 */
async function runMigration() {
  try {
    console.log('Starting migration: Add soft delete support to users table...');
    
    // Get database name from connection or use default
    const dbName = process.env.DB_NAME || 'capstone-db';
    
    // Check if columns already exist
    const columns = await db.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME IN ('deleted_at', 'created_at', 'updated_at')
    `, [dbName]);
    
    const existingColumns = columns.map(col => col.COLUMN_NAME);
    
    // Add deleted_at column if it doesn't exist
    if (!existingColumns.includes('deleted_at')) {
      console.log('Adding deleted_at column...');
      await db.execute(`
        ALTER TABLE users 
        ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL
      `);
    } else {
      console.log('deleted_at column already exists, skipping...');
    }
    
    // Add created_at column if it doesn't exist
    if (!existingColumns.includes('created_at')) {
      console.log('Adding created_at column...');
      await db.execute(`
        ALTER TABLE users 
        ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
    } else {
      console.log('created_at column already exists, skipping...');
    }
    
    // Add updated_at column if it doesn't exist
    if (!existingColumns.includes('updated_at')) {
      console.log('Adding updated_at column...');
      await db.execute(`
        ALTER TABLE users 
        ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      `);
    } else {
      console.log('updated_at column already exists, skipping...');
    }
    
    // Add index for deleted_at if it doesn't exist
    const indexes = await db.query(`
      SELECT INDEX_NAME 
      FROM INFORMATION_SCHEMA.STATISTICS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'users' 
      AND INDEX_NAME = 'idx_deleted_at'
    `, [dbName]);
    
    if (indexes.length === 0) {
      console.log('Adding index for deleted_at...');
      await db.execute(`
        ALTER TABLE users 
        ADD INDEX idx_deleted_at (deleted_at)
      `);
    } else {
      console.log('Index idx_deleted_at already exists, skipping...');
    }
    
    // Update existing users to have created_at and updated_at values
    console.log('Updating existing users with timestamp values...');
    await db.execute(`
      UPDATE users 
      SET created_at = COALESCE(created_at, CURRENT_TIMESTAMP), 
          updated_at = COALESCE(updated_at, CURRENT_TIMESTAMP) 
      WHERE created_at IS NULL OR updated_at IS NULL
    `);
    
    console.log('Migration completed successfully!');
    
    // Verify the migration
    const finalColumns = await db.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME IN ('deleted_at', 'created_at', 'updated_at')
      ORDER BY COLUMN_NAME
    `, [dbName]);
    
    console.log('\nMigration verification:');
    finalColumns.forEach(col => {
      console.log(`- ${col.COLUMN_NAME}: ${col.DATA_TYPE}, nullable: ${col.IS_NULLABLE}, default: ${col.COLUMN_DEFAULT}`);
    });
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

/**
 * Check if soft delete schema is properly applied
 */
async function checkSoftDeleteSchema() {
  try {
    const dbName = process.env.DB_NAME || 'capstone-db';
    
    // Check required columns
    const columns = await db.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME IN ('deleted_at', 'created_at', 'updated_at')
      ORDER BY COLUMN_NAME
    `, [dbName]);
    
    // Check required index
    const indexes = await db.query(`
      SELECT INDEX_NAME 
      FROM INFORMATION_SCHEMA.STATISTICS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'users' 
      AND INDEX_NAME = 'idx_deleted_at'
    `, [dbName]);
    
    const requiredColumns = ['created_at', 'deleted_at', 'updated_at'];
    const existingColumns = columns.map(col => col.COLUMN_NAME);
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
    
    return {
      isComplete: missingColumns.length === 0 && indexes.length > 0,
      missingColumns,
      hasIndex: indexes.length > 0,
      existingColumns: columns
    };
  } catch (error) {
    console.error('Schema check failed:', error);
    throw error;
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('\nMigration script completed successfully.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\nMigration script failed:', error);
      process.exit(1);
    });
}

module.exports = { runMigration, checkSoftDeleteSchema };