const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.userId = decoded.id;

      // Proceed to the next middleware/route handler
      return next();
    } catch (err) {
      // Token verification failed
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // No token provided
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
