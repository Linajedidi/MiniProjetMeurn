const jwt = require("jsonwebtoken");
const config = require("config");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization; 

  if (!authHeader) {
    return res.status(401).json({ message: "Accès refusé : aucun token fourni" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Format du token invalide" });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

module.exports = authMiddleware;