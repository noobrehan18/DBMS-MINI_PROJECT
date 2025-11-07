// testConnection.js
const oracledb = require("oracledb");
require("dotenv").config();

(async () => {
    try {
        const conn = await oracledb.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectionString: process.env.ORACLE_CONNECT_STRING,
        });

        console.log("✅ Connected as:", conn.user);

        const result = await conn.execute("SELECT COUNT(*) AS TOTAL FROM CASES");
        console.log("🧾 CASES count:", result.rows[0]);

        const sample = await conn.execute("SELECT * FROM CASES FETCH FIRST 5 ROWS ONLY");
        console.log("📊 Sample rows:", sample.rows);

        await conn.close();
    } catch (err) {
        console.error("❌ Connection or query error:", err);
    }
})();
