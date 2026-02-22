const express = require("express");
const router = express.Router();
const Offre = require("../../models/offre");
const authMiddleware = require("../../middleware/authMiddleware");

// CREATE OFFRE
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { titre, localisation, description, entreprise } = req.body;

    if (!titre || !localisation || !description || !entreprise) {
      return res.status(400).json({ msg: "Champs obligatoires manquants" });
    }

    const nouvelleOffre = new Offre({
      titre: titre.trim(),
      localisation: localisation.trim(),
      description: description.trim(),
      entreprise: entreprise.trim(),
      createdBy: req.user.id
    });

    await nouvelleOffre.save();

    res.status(201).json({
      msg: "Offre créée avec succès",
      data: nouvelleOffre
    });

  } catch (err) {
    console.error("CREATE OFFRE ERROR:", err);
    res.status(500).json({ msg: "Erreur serveur" });
  }
});

module.exports = router;