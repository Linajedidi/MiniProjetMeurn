const router = require("express").Router();
const candidatureController = require("../../controllers/candidatureController");
const auth = require("../../middleware/authMiddleware"); // Si vous avez un middleware d'auth

// Routes publiques (si nécessaire)
// router.get("/public", candidatureController.getPublicCandidatures);

// Routes protégées (avec authentification)
router.get("/", auth, candidatureController.getAllCandidatures);
router.get("/stats", auth, candidatureController.getCandidaturesStats);
router.get("/:id", auth, candidatureController.getCandidatureById);
router.get("/candidat/:candidatId", auth, candidatureController.getCandidaturesByCandidat);
router.get("/offre/:offreId", auth, candidatureController.getCandidaturesByOffre);

router.post("/", auth, candidatureController.createCandidature);
router.put("/:id", auth, candidatureController.updateCandidature);
router.put("/:id/score", auth, candidatureController.updateScore);
router.delete("/:id", auth, candidatureController.deleteCandidature);

module.exports = router;

/* const router = require("express").Router();
const Candidature = require("../../models/Candidature");
const Offre = require("../../models/offre");

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
router.get("/", async (req, res) => {
  try {
    const list = await Candidature.find()
      .populate("candidat", "username")  
      .populate("offre", "titre");      

    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur serveur" });
  }
});


module.exports = router; */