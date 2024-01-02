const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config()

const requireAuth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: "Auth Error: No token provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userID;
    next();
  } catch (e) {
    res.status(500).json({message:'invalid token'});
    console.error(e);
  }
};
module.exports = requireAuth;