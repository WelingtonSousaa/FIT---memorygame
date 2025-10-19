const mysql = require('mysql2/promise');
require('dotenv').config();

//* Pool de conexões para otimizar o BD
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log("MySQL Pool de conexão criada com sucesso!")

module.exports = pool;