const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

// ✅ Verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT verification failed:", err.message);
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user; // attach decoded user data
    next();
  });
}

// ✅ Role-based Access Control
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user?.role;

    // Check if the user's role is in the list of allowed roles
    if (!userRole || !allowedRoles.includes(userRole)) {
      console.warn(
        `403 Forbidden: Role '${userRole}' not allowed. Allowed roles: ${allowedRoles}`
      );
      return res
        .status(403)
        .json({ error: "Forbidden: insufficient privileges" });
    }

    next();
  };
}

module.exports = { authenticateToken, authorizeRoles };
