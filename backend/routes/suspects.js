const express = require("express");
const { getConnection } = require("../config/db");
const { mapResult } = require("../utils/oracleHelper");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`SELECT * FROM SUSPECTS ORDER BY SUSPECT_ID`);
        res.json(mapResult(result));
    } catch (err) {
        console.error("GET /suspects error:", err);
        res.status(500).json({ error: "Failed to fetch suspects" });
    } finally {
        if (conn) await conn.close();
    }
});

router.post("/", authenticateToken, authorizeRoles("admin", "officer"), async (req, res) => {
    const { NAME, AGE, GENDER, ADDRESS, CRIME_RECORD_STATUS } = req.body;
    let conn;
    try {
        conn = await getConnection();
        await conn.execute(
            `INSERT INTO SUSPECTS (SUSPECT_ID, NAME, AGE, GENDER, ADDRESS, CRIME_RECORD_STATUS)
       VALUES (suspect_seq.NEXTVAL, :1, :2, :3, :4, :5)`,
            [NAME, AGE, GENDER, ADDRESS, CRIME_RECORD_STATUS],
            { autoCommit: true }
        );
        res.json({ message: "Suspect added successfully" });
    } catch (err) {
        console.error("POST /suspects error:", err);
        res.status(500).json({ error: "Failed to add suspect" });
    } finally {
        if (conn) await conn.close();
    }
});

//  PUT update suspect
router.put("/:id", authenticateToken, authorizeRoles("admin", "officer"), async (req, res) => {
    const { id } = req.params;
    const { NAME, AGE, GENDER, ADDRESS, CRIME_RECORD_STATUS } = req.body;
    let conn;
    try {
        conn = await getConnection();
        await conn.execute(
            `UPDATE SUSPECTS SET NAME=:1, AGE=:2, GENDER=:3, ADDRESS=:4, CRIME_RECORD_STATUS=:5 WHERE SUSPECT_ID=:6`,
            [NAME, AGE, GENDER, ADDRESS, CRIME_RECORD_STATUS, id],
            { autoCommit: true }
        );
        res.json({ message: "Suspect updated successfully" });
    } catch (err) {
        console.error("PUT /suspects error:", err);
        res.status(500).json({ error: "Failed to update suspect" });
    } finally {
        if (conn) await conn.close();
    }
});

//  DELETE suspect
router.delete("/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
    const { id } = req.params;
    let conn;
    try {
        conn = await getConnection();
        await conn.execute(`DELETE FROM SUSPECTS WHERE SUSPECT_ID = :1`, [id], { autoCommit: true });
        res.json({ message: "Suspect deleted successfully" });
    } catch (err) {
        console.error("DELETE /suspects error:", err);
        res.status(500).json({ error: "Failed to delete suspect" });
    } finally {
        if (conn) await conn.close();
    }
});

module.exports = router;
