const mysql = require('mysql2/promise');
const config = require('../config/config.js');

// Create a connection pool
const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Function to execute a database query using a connection from the pool
async function query(sql, params = []) {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query(sql, params);
    await connection.release();
    return results;
  } catch (error) {
    console.error('Error during database query:', error);
    throw error;
  }
}

module.exports = { query };
