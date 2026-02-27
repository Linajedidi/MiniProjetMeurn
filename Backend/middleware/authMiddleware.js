const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("AUTH HEADER:", authHeader); // DEBUG

  if (!authHeader) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Format Authorization invalide" });
  }

  const token = parts[1];

  try {
    const secret = config.get("jwtSecret"); 
    console.log("JWT SECRET (config):", secret); 

    const decoded = jwt.verify(token, secret);
    console.log("DECODED TOKEN:", decoded); // DEBUG

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    console.error("JWT ERROR:", err.message); // DEBUG
    return res.status(401).json({ message: "Token invalide" });
  }
};