const mysql = require('mysql2/promise');

const config = require('../config/config.js');

let pool;

async function connect() {
  pool = await mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    // Optional: Set connection pool size and idle timeout
    connectionLimit: 10, // Maximum number of connections in the pool
    queueLimit: 0, // No waiting queue for connections
    waitForConnections: true, // Wait if pool is full
    idleTimeoutMillis: 10000, // Close idle connections after 10 seconds
  });
  console.log('Database connected');
}

async function query(sql, params) {
  try {
    const [results] = await pool.query(sql, params);
    return results;
  } catch (err) {
    console.error('Error executing database query:', err.message); }
}

connect();

module.exports = { query };
