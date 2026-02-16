import jwt from "jsonwebtoken";

/**
 * Permissive token verification — sets req.user if valid token present,
 * sets null and continues if no token, only rejects if token is invalid/expired.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

/**
 * Requires authenticated user with one of the specified roles.
 * Use after verifyToken in the middleware chain.
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required." });
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions." });
    }

    next();
  };
};

export { verifyToken, requireRole };
