const oracledb = require('oracledb');
const dotenv = require('dotenv');
dotenv.config();

async function getConnection() {
  return await oracledb.getConnection({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectionString: process.env.ORACLE_CONNECT_STRING,
  });
}

module.exports = { getConnection };

