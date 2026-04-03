const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const config = require("config");

const GOOGLE_CLIENT_ID = config.get("googleClientId");
const JWT_SECRET = config.get("jwtSecret");             
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  const { tokenId } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Nouvel utilisateur Google
      user = new User({
        username: name,
        email,
        profileImage: picture,
        role: "CANDIDAT",
        googleId: sub,
      });
      await user.save();
    } else {
      // Mise à jour googleId et image si déjà existant
      user.googleId = sub;
      user.profileImage = picture;
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage || "",
      token,
    });
  } catch (err) {
    console.error("Erreur Google OAuth :", err);
    res.status(400).json({ msg: "Erreur Google OAuth" });
  }
});

module.exports = router;