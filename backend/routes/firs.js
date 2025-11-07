const express = require("express");
const { getConnection } = require("../config/db");
const { mapResult } = require("../utils/oracleHelper");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

//  GET all FIRs
router.get("/", authenticateToken, async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(`SELECT * FROM FIRS ORDER BY FIR_NO`);
        const data = mapResult(result).map((r) => ({
            ...r,
            FIR_DATE: r.FIR_DATE ? r.FIR_DATE.toISOString().substring(0, 10) : null,
        }));
        res.json(data);
    } catch (err) {
        console.error("❌ GET /firs error:", err);
        res.status(500).json({ error: "Failed to fetch FIRs" });
    } finally {
        if (conn) await conn.close();
    }
});

//  POST add FIR
router.post("/", authenticateToken, authorizeRoles("admin", "officer"), async (req, res) => {
    const {
        COMPLAINT_ID,
        FIR_DATE,
        CRIME_TYPE,
        CRIME_LOCATION,
        DESCRIPTION,
        COMPLAINANT_NAME,
        COMPLAINANT_CONTACT,
    } = req.body;

    let conn;
    try {
        conn = await getConnection();
        await conn.execute(
            `INSERT INTO FIRS (
                FIR_NO,
                COMPLAINT_ID,
                FIR_DATE,
                CRIME_TYPE,
                CRIME_LOCATION,
                DESCRIPTION,
                COMPLAINANT_NAME,
                COMPLAINANT_CONTACT
            )
            VALUES (
                fir_seq.NEXTVAL,
                :1,
                TO_DATE(:2, 'YYYY-MM-DD'),
                :3,
                :4,
                :5,
                :6,
                :7
            )`,
            [
                COMPLAINT_ID,
                FIR_DATE,
                CRIME_TYPE,
                CRIME_LOCATION,
                DESCRIPTION,
                COMPLAINANT_NAME,
                COMPLAINANT_CONTACT,
            ],
            { autoCommit: true }
        );

        res.json({ message: "✅ FIR added successfully" });
    } catch (err) {
        console.error("❌ POST /firs error:", err);
        res.status(500).json({ error: "Failed to add FIR" });
    } finally {
        if (conn) await conn.close();
    }
});

//  PUT update FIR
router.put("/:id", authenticateToken, authorizeRoles("admin", "officer"), async (req, res) => {
    const { id } = req.params;
    const {
        COMPLAINT_ID,
        FIR_DATE,
        CRIME_TYPE,
        CRIME_LOCATION,
        DESCRIPTION,
        COMPLAINANT_NAME,
        COMPLAINANT_CONTACT,
    } = req.body;

    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(
            `UPDATE FIRS
            SET COMPLAINT_ID = :1,
                FIR_DATE = TO_DATE(:2, 'YYYY-MM-DD'),
                CRIME_TYPE = :3,
                CRIME_LOCATION = :4,
                DESCRIPTION = :5,
                COMPLAINANT_NAME = :6,
                COMPLAINANT_CONTACT = :7
            WHERE FIR_NO = :8`,
            [
                COMPLAINT_ID,
                FIR_DATE,
                CRIME_TYPE,
                CRIME_LOCATION,
                DESCRIPTION,
                COMPLAINANT_NAME,
                COMPLAINANT_CONTACT,
                id,
            ],
            { autoCommit: true }
        );

        if (result.rowsAffected === 0)
            return res.status(404).json({ error: "FIR not found" });

        res.json({ message: "✅ FIR updated successfully" });
    } catch (err) {
        console.error("❌ PUT /firs error:", err);
        res.status(500).json({ error: "Failed to update FIR" });
    } finally {
        if (conn) await conn.close();
    }
});

//  DELETE FIR
router.delete("/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
    const { id } = req.params;
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(
            `DELETE FROM FIRS WHERE FIR_NO = :1`,
            [id],
            { autoCommit: true }
        );

        if (result.rowsAffected === 0)
            return res.status(404).json({ error: "FIR not found" });

        res.json({ message: "🗑️ FIR deleted successfully" });
    } catch (err) {
        console.error("❌ DELETE /firs error:", err);
        res.status(500).json({ error: "Failed to delete FIR" });
    } finally {
        if (conn) await conn.close();
    }
});

module.exports = router;
