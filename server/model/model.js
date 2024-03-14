const mysql = require("mysql2/promise");
const config = require("../config/config.js");

let pool;

async function connect() {
  pool = await mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    connectionLimit: 10,
    queueLimit: 0,
    waitForConnections: true,
    idleTimeoutMillis: 10000,
  });
  console.log("Database connected");
}

async function query(sql, params) {
  try {
    const [results] = await pool.query(sql, params);
    return results;
  } catch (err) {
    console.error("Error executing database query:", err.message);
    throw err; // Rethrow the error to handle it elsewhere
  }
}

connect();

module.exports = { query };
