const mysql = require('mysql2');
const config = require('../config/config.js');

let connection;

function connect() {
  connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
      // Retry connection after a delay
      setTimeout(connect, 5000); // Retry connection after 5 seconds
    } else {
      console.log('Database connected');
    }
  });

  connection.on('error', (err) => {
    console.error('Database connection error:', err.message);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('Reconnecting to database...');
      connect(); // Reconnect to the database
    } else {
      throw err;
    }
  });
}

// Initial connection
connect();

function query(sql, params, callback) {
  if (!connection || connection.state !== 'authenticated') {
    console.log('Reconnecting to database...');
    connect(); // Reconnect to the database if not connected
  }

  connection.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error executing database query:', err.message);
    }
    callback(err, results);
  });
}

module.exports = { query };
