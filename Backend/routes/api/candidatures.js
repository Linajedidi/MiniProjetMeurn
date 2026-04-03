const router = require("express").Router();
const candidatureController = require("../../controllers/candidatureController");
const auth = require("../../middleware/authMiddleware"); // Si vous avez un middleware d'auth

const Candidature = require("../../models/Candidature");
const Offre = require("../../models/offre");
const CV = require("../../models/cv");


router.post("/", async (req, res) => {
  try {
    const { candidat, offre, score } = req.body;

    if (!candidat || !offre) {
      return res.status(400).json({ msg: "Données manquantes" });
    }

    // Vérifier l’offre
    const offreExiste = await Offre.findById(offre);
    if (!offreExiste) {
      return res.status(400).json({ msg: "Offre invalide" });
    }

    //  Récupérer le CV du candidat
    const cvDoc = await CV.findOne({ user: candidat });
    if (!cvDoc) {
      return res.status(400).json({ msg: "Aucun CV trouvé pour ce candidat" });
    }

    //  Créer la candidature avec le filePath du CV
    const newCand = new Candidature({
      candidat,
      offre,
      cv: cvDoc.filePath, // ICI la solution
      score: score || 0
    });

    await newCand.save();

    res.status(201).json(newCand);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur serveur", err: err.message });
  }
});
router.get("/public", async (req, res) => {
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

// Routes publiques (si nécessaire)
// router.get("/public", candidatureController.getPublicCandidatures);

// Routes protégées (avec authentification)
router.get("/", auth, candidatureController.getAllCandidatures);
router.get("/stats", auth, candidatureController.getCandidaturesStats);
router.get("/:id", auth, candidatureController.getCandidatureById);
router.get("/candidat/:candidatId", auth, candidatureController.getCandidaturesByCandidat);
router.get("/offre/:offreId", auth, candidatureController.getCandidaturesByOffre);


module.exports = router;



