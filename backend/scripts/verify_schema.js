const db = require('../db/connection');

/**
 * Schema verification script
 * Verifies that the users table has all required columns for soft deletion
 * Requirements: 3.1, 3.5
 */

async function verifyUsersTableSchema() {
  try {
    console.log('Verifying users table schema...');
    
    const dbName = process.env.DB_NAME || 'capstone-db';
    
    // Get table structure
    const columns = await db.query(`
      SELECT 
        COLUMN_NAME,
        DATA_TYPE,
        IS_NULLABLE,
        COLUMN_DEFAULT,
        EXTRA
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'users' 
      ORDER BY ORDINAL_POSITION
    `, [dbName]);
    
    // Get indexes
    const indexes = await db.query(`
      SELECT 
        INDEX_NAME,
        COLUMN_NAME,
        NON_UNIQUE
      FROM INFORMATION_SCHEMA.STATISTICS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'users'
      ORDER BY INDEX_NAME, SEQ_IN_INDEX
    `, [dbName]);
    
    console.log('\n=== USERS TABLE STRUCTURE ===');
    console.log('Columns:');
    columns.forEach(col => {
      console.log(`  ${col.COLUMN_NAME}: ${col.DATA_TYPE} ${col.IS_NULLABLE === 'NO' ? 'NOT NULL' : 'NULL'} ${col.COLUMN_DEFAULT ? `DEFAULT ${col.COLUMN_DEFAULT}` : ''} ${col.EXTRA || ''}`);
    });
    
    console.log('\nIndexes:');
    const groupedIndexes = indexes.reduce((acc, idx) => {
      if (!acc[idx.INDEX_NAME]) {
        acc[idx.INDEX_NAME] = [];
      }
      acc[idx.INDEX_NAME].push(idx.COLUMN_NAME);
      return acc;
    }, {});
    
    Object.entries(groupedIndexes).forEach(([indexName, columns]) => {
      console.log(`  ${indexName}: (${columns.join(', ')})`);
    });
    
    // Verify required columns exist
    const requiredColumns = ['id', 'email', 'username', 'password', 'role', 'learning_style', 'learning_pattern', 'created_at', 'updated_at', 'deleted_at'];
    const existingColumns = columns.map(col => col.COLUMN_NAME);
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
    
    console.log('\n=== VERIFICATION RESULTS ===');
    if (missingColumns.length === 0) {
      console.log('✅ All required columns are present');
    } else {
      console.log('❌ Missing columns:', missingColumns.join(', '));
    }
    
    // Check for soft delete specific requirements
    const deletedAtColumn = columns.find(col => col.COLUMN_NAME === 'deleted_at');
    if (deletedAtColumn) {
      if (deletedAtColumn.IS_NULLABLE === 'YES' && deletedAtColumn.DATA_TYPE === 'timestamp') {
        console.log('✅ deleted_at column is properly configured (TIMESTAMP NULL)');
      } else {
        console.log('❌ deleted_at column configuration is incorrect');
      }
    }
    
    // Check for deleted_at index
    const hasDeletedAtIndex = Object.keys(groupedIndexes).includes('idx_deleted_at');
    if (hasDeletedAtIndex) {
      console.log('✅ deleted_at index exists');
    } else {
      console.log('❌ deleted_at index is missing');
    }
    
    // Check for audit trail columns
    const createdAtColumn = columns.find(col => col.COLUMN_NAME === 'created_at');
    const updatedAtColumn = columns.find(col => col.COLUMN_NAME === 'updated_at');
    
    if (createdAtColumn && createdAtColumn.DATA_TYPE === 'timestamp') {
      console.log('✅ created_at column is properly configured');
    } else {
      console.log('❌ created_at column is missing or misconfigured');
    }
    
    if (updatedAtColumn && updatedAtColumn.DATA_TYPE === 'timestamp' && updatedAtColumn.EXTRA.includes('on update')) {
      console.log('✅ updated_at column is properly configured with ON UPDATE');
    } else {
      console.log('❌ updated_at column is missing or misconfigured');
    }
    
    console.log('\n=== SCHEMA VERIFICATION COMPLETE ===');
    
  } catch (error) {
    console.error('Schema verification failed:', error);
    throw error;
  }
}

// Run verification if this script is executed directly
if (require.main === module) {
  verifyUsersTableSchema()
    .then(() => {
      console.log('\nSchema verification completed.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\nSchema verification failed:', error);
      process.exit(1);
    });
}

module.exports = { verifyUsersTableSchema };