const mysql = require('mysql2/promise');
const config = require('../config/config.js');

// Create a connection
const connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});

// Function to execute a database query using the connection
async function query(sql, params = []) {
  try {
    const [results] = await connection.query(sql, params);
    return results;
  } catch (error) {
    console.error('Error during database query:', error);
    throw error;
  }
}

module.exports = { query };
