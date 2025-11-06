const express = require("express");
const { getConnection } = require("../config/db");
const { mapResult } = require("../utils/oracleHelper");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// 🔹 GET all officers
router.get("/", authenticateToken, async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`SELECT * FROM OFFICERS ORDER BY OFFICER_ID`);
        res.json(mapResult(result));
    } catch (err) {
        console.error("GET /officers error:", err);
        res.status(500).json({ error: "Failed to fetch officers" });
    } finally {
        if (conn) await conn.close();
    }
});

// 🔹 POST (Add)
router.post("/", authenticateToken, authorizeRoles("admin"), async (req, res) => {
    const { NAME, RANK, CONTACT_NO, STATION_ID } = req.body;
    let conn;
    try {
        conn = await getConnection();
        await conn.execute(
            `INSERT INTO OFFICERS (OFFICER_ID, NAME, RANK, CONTACT_NO, STATION_ID)
       VALUES (officer_seq.NEXTVAL, :1, :2, :3, :4)`,
            [NAME, RANK, CONTACT_NO, STATION_ID],
            { autoCommit: true }
        );
        res.json({ message: "Officer added successfully" });
    } catch (err) {
        console.error("POST /officers error:", err);
        res.status(500).json({ error: "Failed to add officer" });
    } finally {
        if (conn) await conn.close();
    }
});

// 🔹 PUT (Update)
router.put("/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
    const { id } = req.params;
    const { NAME, RANK, CONTACT_NO, STATION_ID } = req.body;
    let conn;
    try {
        conn = await getConnection();
        await conn.execute(
            `UPDATE OFFICERS
       SET NAME = :1, RANK = :2, CONTACT_NO = :3, STATION_ID = :4
       WHERE OFFICER_ID = :5`,
            [NAME, RANK, CONTACT_NO, STATION_ID, id],
            { autoCommit: true }
        );
        res.json({ message: "Officer updated successfully" });
    } catch (err) {
        console.error("PUT /officers error:", err);
        res.status(500).json({ error: "Failed to update officer" });
    } finally {
        if (conn) await conn.close();
    }
});

// 🔹 DELETE
router.delete("/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
    const { id } = req.params;
    let conn;
    try {
        conn = await getConnection();
        await conn.execute(`DELETE FROM OFFICERS WHERE OFFICER_ID = :1`, [id], { autoCommit: true });
        res.json({ message: "Officer deleted successfully" });
    } catch (err) {
        console.error("DELETE /officers error:", err);
        res.status(500).json({ error: "Failed to delete officer" });
    } finally {
        if (conn) await conn.close();
    }
});

module.exports = router;
