const router = require("express").Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

//registre
router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ status: "notok", msg: "Veuillez remplir tous les champs obligatoires" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ status: "notokmail", msg: "Cet email est déjà utilisé" });
    }

    user = new User({
      username,
      email,
      password,
      role: role || "CANDIDAT", 
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      id: user.id,
      role: user.role,
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: config.get("tokenExpire") || "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({
          status: "ok",
          msg: "Inscription réussie",
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", msg: "Erreur serveur" });
  }
});

//login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email et mot de passe requis" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Utilisateur non trouvé" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Mot de passe incorrect" });
    }

    const payload = {
      id: user.id,
      role: user.role,
    };

    const token = jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: config.get("tokenExpire") || "7d" }
    );

    res.json({
      token,
      username: user.username,
      role: user.role, 
      email: user.email,   // ⚠️ CECI EST OBLIGATOIRE
         
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur serveur" });
  }
});



module.exports = router;