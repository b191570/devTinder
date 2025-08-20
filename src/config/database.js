
const mysql = require("mysql2/promise");
// password : fNZ0I2myfcaXB
const db = mysql.createPool({
  host: "localhost",
  user: "root",        // your MySQL username
  password: "mysql@123", // your MySQL password
  database: "project",   // your DB name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;

