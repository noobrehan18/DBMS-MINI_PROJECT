const express = require("express");
const { getConnection } = require("../config/db");
const { mapResult } = require("../utils/oracleHelper");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

/**
 *  GET all crimes
 */
router.get("/", authenticateToken, async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(`SELECT * FROM CRIME ORDER BY CRIME_ID`);
    const crimes = mapResult(result).map((row) => ({
      ...row,
      CRIME_DATE: row.CRIME_DATE
        ? row.CRIME_DATE.toISOString().substring(0, 10)
        : null,
    }));
    res.json(crimes);
  } catch (err) {
    console.error("❌ GET /crimes error:", err);
    res.status(500).json({ error: "Failed to fetch crimes" });
  } finally {
    if (conn) await conn.close();
  }
});

/**
 *  POST add crime
 */
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin", "officer"),
  async (req, res) => {
    const { CRIME_TYPE, CRIME_DATE, CRIME_LOCATION, DESCRIPTION, VICTIM_NAME } =
      req.body;

    if (!CRIME_TYPE || !CRIME_DATE || !CRIME_LOCATION) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let conn;
    try {
      conn = await getConnection();
      await conn.execute(
        `INSERT INTO CRIME 
         (CRIME_ID, CRIME_TYPE, CRIME_DATE, CRIME_LOCATION, DESCRIPTION, VICTIM_NAME)
         VALUES (crime_seq.NEXTVAL, :1, TO_DATE(:2, 'YYYY-MM-DD'), :3, :4, :5)`,
        [CRIME_TYPE, CRIME_DATE, CRIME_LOCATION, DESCRIPTION, VICTIM_NAME],
        { autoCommit: true }
      );
      res.json({ message: "✅ Crime added successfully" });
    } catch (err) {
      console.error("❌ POST /crimes error:", err);
      res.status(500).json({ error: "Failed to add crime" });
    } finally {
      if (conn) await conn.close();
    }
  }
);

/**
 *  PUT update crime
 */
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "officer"),
  async (req, res) => {
    const { id } = req.params;
    const { CRIME_TYPE, CRIME_DATE, CRIME_LOCATION, DESCRIPTION, VICTIM_NAME } =
      req.body;

    let conn;
    try {
      conn = await getConnection();
      const result = await conn.execute(
        `UPDATE CRIME 
         SET CRIME_TYPE=:1, CRIME_DATE=TO_DATE(:2, 'YYYY-MM-DD'),
             CRIME_LOCATION=:3, DESCRIPTION=:4, VICTIM_NAME=:5
         WHERE CRIME_ID=:6`,
        [CRIME_TYPE, CRIME_DATE, CRIME_LOCATION, DESCRIPTION, VICTIM_NAME, id],
        { autoCommit: true }
      );

      if (result.rowsAffected === 0)
        return res.status(404).json({ error: "Crime not found" });

      res.json({ message: "✅ Crime updated successfully" });
    } catch (err) {
      console.error("❌ PUT /crimes error:", err);
      res.status(500).json({ error: "Failed to update crime" });
    } finally {
      if (conn) await conn.close();
    }
  }
);

/**
 *  DELETE crime
 */
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    const { id } = req.params;

    let conn;
    try {
      conn = await getConnection();
      const result = await conn.execute(
        `DELETE FROM CRIME WHERE CRIME_ID = :1`,
        [id],
        { autoCommit: true }
      );

      if (result.rowsAffected === 0) {
        return res.status(404).json({ error: "Crime not found" });
      }

      res.json({ message: "🗑️ Crime deleted successfully" });
    } catch (err) {
      console.error("❌ DELETE /crimes error:", err);
      res.status(500).json({ error: "Failed to delete crime" });
    } finally {
      if (conn) await conn.close();
    }
  }
);

module.exports = router;
