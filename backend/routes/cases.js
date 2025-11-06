const express = require("express");
const { getConnection } = require("../config/db");
const { mapResult } = require("../utils/oracleHelper");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// GET all cases
router.get("/", authenticateToken, async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`SELECT * FROM CASES ORDER BY CASE_ID`);
        const data = mapResult(result).map((row) => ({
            ...row,
            DATE_ASSIGNED: row.DATE_ASSIGNED
                ? row.DATE_ASSIGNED.toISOString().substring(0, 10)
                : null,
        }));
        res.json(data);
    } catch (err) {
        console.error("GET /cases error:", err);
        res.status(500).json({ error: "Failed to fetch cases" });
    } finally {
        if (conn) await conn.close();
    }
});

// POST
router.post("/", authenticateToken, authorizeRoles("admin", "officer"), async (req, res) => {
    const { CRIME_ID, OFFICER_ID, FIR_NO, DATE_ASSIGNED, STATUS } = req.body;
    let conn;
    try {
        conn = await getConnection();
        await conn.execute(
            `INSERT INTO CASES (CASE_ID, CRIME_ID, OFFICER_ID, FIR_NO, DATE_ASSIGNED, STATUS)
       VALUES (case_seq.NEXTVAL, :1, :2, :3, TO_DATE(:4,'YYYY-MM-DD'), :5)`,
            [CRIME_ID, OFFICER_ID, FIR_NO, DATE_ASSIGNED, STATUS],
            { autoCommit: true }
        );
        res.json({ message: "✅ Case added successfully" });
    } catch (err) {
        console.error("POST /cases error:", err);
        res.status(500).json({ error: "Failed to add case" });
    } finally {
        if (conn) await conn.close();
    }
});

// PUT
router.put("/:id", authenticateToken, authorizeRoles("admin", "officer"), async (req, res) => {
    const { id } = req.params;
    const { CRIME_ID, OFFICER_ID, FIR_NO, DATE_ASSIGNED, STATUS } = req.body;
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(
            `UPDATE CASES
       SET CRIME_ID=:1, OFFICER_ID=:2, FIR_NO=:3, DATE_ASSIGNED=TO_DATE(:4,'YYYY-MM-DD'), STATUS=:5
       WHERE CASE_ID=:6`,
            [CRIME_ID, OFFICER_ID, FIR_NO, DATE_ASSIGNED, STATUS, id],
            { autoCommit: true }
        );

        if (result.rowsAffected === 0)
            return res.status(404).json({ error: "Case not found" });

        res.json({ message: "✅ Case updated successfully" });
    } catch (err) {
        console.error("PUT /cases error:", err);
        res.status(500).json({ error: "Failed to update case" });
    } finally {
        if (conn) await conn.close();
    }
});

// DELETE
router.delete("/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
    const { id } = req.params;
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`DELETE FROM CASES WHERE CASE_ID = :1`, [id], { autoCommit: true });

        if (result.rowsAffected === 0)
            return res.status(404).json({ error: "Case not found" });

        res.json({ message: "🗑️ Case deleted successfully" });
    } catch (err) {
        console.error("DELETE /cases error:", err);
        res.status(500).json({ error: "Failed to delete case" });
    } finally {
        if (conn) await conn.close();
    }
});

module.exports = router;
