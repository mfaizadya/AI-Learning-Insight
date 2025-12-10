const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool with configuration from environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get promise-based pool for async/await support
const promisePool = pool.promise();

// Test connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }
  } else {
    console.log('Database connected successfully');
    connection.release();
  }
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Database connection was lost. Reconnecting...');
  }
});

// Export query interface for executing SQL statements
module.exports = {
  // Promise-based query method
  query: async (sql, params) => {
    try {
      const [rows] = await promisePool.query(sql, params);
      return rows;
    } catch (error) {
      console.error('Database query error:', error.message);
      throw error;
    }
  },
  
  // Execute method for operations that don't return rows
  execute: async (sql, params) => {
    try {
      const [result] = await promisePool.execute(sql, params);
      return result;
    } catch (error) {
      console.error('Database execute error:', error.message);
      throw error;
    }
  },
  
  // Get connection from pool for transactions
  getConnection: async () => {
    try {
      return await promisePool.getConnection();
    } catch (error) {
      console.error('Error getting connection from pool:', error.message);
      throw error;
    }
  },
  
  // Close pool (for graceful shutdown)
  close: () => {
    return new Promise((resolve, reject) => {
      pool.end((err) => {
        if (err) {
          console.error('Error closing database pool:', err.message);
          reject(err);
        } else {
          console.log('Database pool closed');
          resolve();
        }
      });
    });
  },
  
  // Direct access to pool for advanced usage
  pool: promisePool
};
