const mysql = require('mysql2/promise');
const config = require('../config/config.js');

// Create a connection pool
const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  waitForConnections: true, // Wait for available connection if pool is exhausted
  connectionLimit: 10, // Maximum number of concurrent connections (adjust based on needs)
  queueLimit: 0, // Unlimited queue for waiting connections (can be adjusted if needed)
});

// Function to execute a database query using a connection from the pool
async function executeQuery(sql, params = []) {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query(sql, params);
    await connection.release(); // Release the connection back to the pool
    return results;
  } catch (error) {
    console.error('Error during database query:', error);
    throw error; // Re-throw the error for proper handling
  }
}

// Usage example:
async function someDatabaseOperation() {
  try {
    // ... your database interaction using executeQuery ...
  } catch (error) {
    console.error('Error during database operation:', error);
  }
}

someDatabaseOperation();

module.exports = { executeQuery }; // Export the executeQuery function
