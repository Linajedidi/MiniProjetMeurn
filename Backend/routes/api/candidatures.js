const router = require("express").Router();
const Candidature = require("../../models/Candidature");
const Offre = require("../../models/Offre");
const authMiddleware = require("../../middleware/authMiddleware");
const offreController = require("../../controllers/offreController");



// POST créer candidature
router.post("/", async (req, res) => {
  try {
    const { candidat, offre, cv, score } = req.body;

    const offreExiste = await Offre.findById(offre);
    if (!offreExiste) {
      return res.status(400).json({ msg: "Offre invalide" });
    }

    const newCand = new Candidature({ candidat, offre, cv, score });
    await newCand.save();

    res.status(201).json(newCand);
  } catch (err) {
    res.status(500).json({ msg: "Erreur serveur", err: err.message });
  }
});



// GET toutes candidatures (admin/debug)

router.get("/", async (req, res) => {
  try {
    const list = await Candidature.find()
      .populate("candidat", "username")
      .populate("offre", "titre");

    res.json(list);
  } catch (err) {
    res.status(500).json({ msg: "Erreur serveur" });
  }
});



//  GET candidatures entreprise connectée
router.get(
  "/mes-candidatures",
  authMiddleware,
  offreController.getCandidaturesEntreprise
);


module.exports = router;