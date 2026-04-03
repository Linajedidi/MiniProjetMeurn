const router = require("express").Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../../models/User");
// Import du service email
const nodemailer = require("nodemailer");

// Configuration du transporteur email (Mailtrap)
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
     user: "f09afbb7fd45b3",
    pass: "75d2b854d3bdc5",
  }
});

// Fonction pour envoyer l'email
const sendResetPasswordEmail = async (email, resetToken, username) => {
  const resetUrl = `${config.get("frontendUrl")}/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: '"Plateforme Recrutement" <noreply@recrutement.com>',
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Réinitialisation du mot de passe</h2>
        <p>Bonjour ${username || 'Utilisateur'},</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous :</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">
          Réinitialiser mon mot de passe
        </a>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès à:', email);
    return true;
  } catch (error) {
    console.error('Erreur d\'envoi d\'email:', error);
    return false;
  }
};

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
      { expiresIn: config.get("tokenExpire") || "30d" },
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
    // Vérifier si c'est un compte Google
    if (user.googleId && !user.password) {
        return res.status(400).json({ 
            msg: "Ce compte est uniquement connecté via Google. Veuillez utiliser Google pour vous connecter." 
        });
    }
    // **Vérifier si le compte est actif**
    if (user.isActive === false) {
      return res.status(403).json({ msg: "Compte désactivé. Contactez l'administrateur." });
    }

    // Sinon vérifier le mot de passe

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
      { expiresIn: config.get("tokenExpire") || "30d" }
    );

    res.json({
      token,
      _id: user._id,
      username: user.username,
      role: user.role, 
      email: user.email,   
         
    });
    console.log({
  token: localStorage.getItem("token"),
  userId: localStorage.getItem("userId"),
  role: localStorage.getItem("role"),
  name: localStorage.getItem("name"),
});
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur serveur" });
  }
});


// FORGOT PASSWORD - ROUTE AJOUTÉE
router.post("/forgot-password", async (req, res) => {
  try {
    console.log("=== Route forgot-password appelée ===");
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Veuillez fournir un email" 
      });
    }

    const user = await User.findOne({ email });
    console.log("Email recherché:", email);
    console.log("Utilisateur trouvé:", user ? "Oui" : "Non");

    if (!user) {
      return res.status(200).json({ 
        success: true, 
        message: "Si cet email existe, un lien de réinitialisation a été envoyé." 
      });
    }

    // Générer un token
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    // Hasher le token
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    
    user.resetPasswordExpire = Date.now() + 3600000; // 1 heure

    await user.save();
    console.log("Token sauvegardé pour l'utilisateur");

    // Envoyer l'email
    console.log("Token généré:", resetToken);

const emailSent = await sendResetPasswordEmail(email, resetToken, user.username);

if (!emailSent) {
  return res.status(500).json({
    success: false,
    message: "Erreur envoi email"
  });
}

res.status(200).json({ 
  success: true, 
  message: "Un email de réinitialisation a été envoyé." 
});

  } catch (error) {
    console.error("Erreur forgot-password:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur: " + error.message 
    });
  }
});

// RESET PASSWORD
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Les mots de passe ne correspondent pas" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: "Le mot de passe doit contenir au moins 6 caractères" 
      });
    }

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: "Lien invalide ou expiré" 
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Mot de passe réinitialisé avec succès !" 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur" 
    });
  }
});

// VERIFY TOKEN
router.get("/verify-reset-token/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ valid: false });
    }

    res.status(200).json({ valid: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ valid: false });
  }
});


//pour le mot de passe et google 
router.post("/set-password", async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.googleId) {
    return res.status(400).json({ msg: "Utilisateur non trouvé ou pas compte Google" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  res.json({ msg: "Mot de passe défini avec succès" });
});

module.exports = router;