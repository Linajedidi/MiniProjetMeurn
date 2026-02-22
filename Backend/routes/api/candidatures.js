const router = require("express").Router();
const Candidature = require("../../models/Candidature");

// ➕ Ajouter une candidature (pour test Postman)
router.post("/", async (req, res) => {
  try {
    const { candidat, offre, cv, score } = req.body;

    const newCand = new Candidature({
      candidat,
      offre,
      cv,
      score
    });

    await newCand.save();
    res.status(201).json({ msg: "Candidature ajoutée", data: newCand });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur serveur" });
  }
});

// 📄 Récupérer toutes les candidatures (pour dashboard entreprise)
router.get("/", async (req, res) => {
  try {
    const list = await Candidature.find().populate("candidat", "username");
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur serveur" });
  }
});

module.exports = router;