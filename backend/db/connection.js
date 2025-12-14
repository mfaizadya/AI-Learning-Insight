const mysql = require("mysql2");
require("dotenv").config();

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
  console.warn(
    "PERINGATAN: database environment variable belum lengkap."
  );
}

// pool config
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  // keep alive
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // connectTimeout: 60000,

  ssl: {
    rejectUnauthorized: false,
  },
});

const promisePool = pool.promise();

pool.getConnection((err, connection) => {
  if (err) {
    console.error("FATAL: Gagal terhubung ke Database RDS.");
    console.error(`Code: ${err.code}`);
    console.error(`Message: ${err.message}`);

    // error
    switch (err.code) {
      case "PROTOCOL_CONNECTION_LOST":
        console.error(
          "Koneksi diputus oleh server. Cek konfigurasi wait_timeout di RDS."
        );
        break;
      case "ER_CON_COUNT_ERROR":
        console.error("Database memiliki terlalu banyak koneksi aktif.");
        break;
      case "ECONNREFUSED":
        console.error(
          "Koneksi ditolak. Pastikan Port benar dan DB Server berjalan."
        );
        break;
      case "ETIMEDOUT":
        console.error(
          "Koneksi Timeout. SANGAT MUNGKIN masalah AWS Security Group (Inbound Rules) belum mengizinkan IP ini."
        );
        break;
      case "ER_ACCESS_DENIED_ERROR":
        console.error("Username atau Password salah.");
        break;
      case "ER_BAD_DB_ERROR":
        console.error(
          `Database '${process.env.DB_NAME}' tidak ditemukan. Pastikan nama database benar.`
        );
        break;
      default:
        console.error("Terjadi kesalahan jaringan atau konfigurasi lainnya.");
    }
  } else {
    console.log("Berhasil terhubung ke AWS RDS");
    // console.log(`Host: ${process.env.DB_HOST}`);
    // console.log(`Database: ${process.env.DB_NAME}`);
    connection.release();
  }
});

// handle pool errors
pool.on("error", (err) => {
  console.error("Unexpected Database Error:", err.code);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.error(
      "Koneksi terputus. Pool akan mencoba reconnect otomatis saat query berikutnya."
    );
  } else {
    console.error(err);
  }
});

// Export query interface
module.exports = {
  // Promise-based query method
  query: async (sql, params) => {
    try {
      const [rows] = await promisePool.query(sql, params);
      return rows;
    } catch (error) {
      console.error("Query Error:", error.message);
      // console.error('    SQL:', sql);
      throw error;
    }
  },

  // Execute method for operations that don't return rows (INSERT, UPDATE, DELETE)
  execute: async (sql, params) => {
    try {
      const [result] = await promisePool.execute(sql, params);
      return result;
    } catch (error) {
      console.error("Execute Error:", error.message);
      throw error;
    }
  },

  // Get connection from pool for transactions (BEGIN, COMMIT, ROLLBACK)
  getConnection: async () => {
    try {
      return await promisePool.getConnection();
    } catch (error) {
      console.error("Connection Pool Error:", error.message);
      throw error;
    }
  },

  // Close pool (for graceful shutdown)
  close: () => {
    return new Promise((resolve, reject) => {
      pool.end((err) => {
        if (err) {
          console.error("Error closing database pool:", err.message);
          reject(err);
        } else {
          console.log("Database pool closed");
          resolve();
        }
      });
    });
  },

  // Direct access to pool
  pool: promisePool,
};
