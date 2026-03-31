// db.js
const oracledb = require('oracledb');
require('dotenv').config();

// oracledb.initOracleClient({
//   libDir: 'C:\\Users\\liderdesarrollo\\Downloads\\instantclient_21_20'
// });

if (process.platform === 'win32') {
  oracledb.initOracleClient({ 
    libDir: 'C:\\Users\\liderdesarrollo\\Downloads\\instantclient_21_20' 
  });
} else {
  // Ruta en Render (Linux)
  oracledb.initOracleClient({ 
    libDir: '/opt/oracle/instantclient_21_20' 
  });
}

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT; // resultados como objetos JS

let pool;

async function iniciarPool() {
  pool = await oracledb.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING,
    poolMin: 2,
    poolMax: 10,
    poolIncrement: 1
  });
  console.log('Pool de conexiones Oracle iniciado');
}

async function getConexion() {
  return await pool.getConnection();
}

module.exports = { iniciarPool, getConexion };