require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Police Crime Management API running..."));

// ✅ Add all routes here
app.use("/api/auth", require("./routes/auth"));
app.use("/api/crimes", require("./routes/crimes"));
app.use("/api/officers", require("./routes/officers"));
app.use("/api/suspects", require("./routes/suspects"));
app.use("/api/cases", require("./routes/cases"));
app.use("/api/firs", require("./routes/firs"));
console.log("📁 FIR routes registered at /api/firs");
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
