const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { getConnection } = require("../config/db");
require("dotenv").config();

const router = express.Router();

/**
 * 🧑‍💼 SAMPLE USERS (for testing)
 * In real use, fetch from DB instead.
 */
const sampleUsers = [
  {
    username: "admin",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
  },
  {
    username: "officer",
    password: bcrypt.hashSync("officer123", 10),
    role: "officer",
  },
];

/**
 * @route POST /api/auth/login
 * @desc Login user (admin/officer)
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = sampleUsers.find((u) => u.username === username);
  if (!user) return res.status(401).json({ error: "User not found" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(401).json({ error: "Invalid password" });

  const token = jwt.sign(
    { username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
  );

  res.json({
    message: "Login successful",
    token,
    user: {
      username: user.username,
      role: user.role,
    },
  });
});

module.exports = router;
