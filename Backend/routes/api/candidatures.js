const router = require("express").Router();
const candidatureController = require("../../controllers/candidatureController");
const auth = require("../../middleware/authMiddleware"); // Si vous avez un middleware d'auth

const Candidature = require("../../models/Candidature");
const Offre = require("../../models/offre");
const CV = require("../../models/cv");
const offreController = require("../../controllers/offreController");

const computeCandidateScore = require("../../utils/scoreService");



//notif 
const Notification = require("../../models/Notification");
const User = require("../../models/User");



router.post("/", async (req, res) => {
  try {
    const { candidat, offre, score } = req.body;
    //  BLOQUER DOUBLE CANDIDATURE
const exist = await Candidature.findOne({ candidat, offre });

if (exist) {
  return res.status(400).json({
    msg: "Vous avez déjà postulé à cette offre"
  });
}

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
   const computedScore = await computeCandidateScore(candidat, offre);

    console.log("SCORE CALCULÉ =", computedScore);

    const newCand = new Candidature({
      candidat,
      offre,
      cv: cvDoc.filePath,
      score: computedScore
    });

    await newCand.save();
    // récupérer candidat + offre
const candidatUser = await User.findById(candidat);
const offreData = await Offre.findById(offre);

// créer message
const message = `${candidatUser.username} a postulé à "${offreData.titre}" avec score ${computedScore}`;

// créer notification
await Notification.create({
  entreprise: offreData.entreprise,
  message
}); 



    res.status(201).json(newCand);

  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
    return res.status(400).json({
      msg: "Tu es déjà postulé à cette offre"
    });
  }

  res.status(500).json({
    msg: "Erreur serveur"
  });
}
});



//  GET candidatures entreprise 
router.get(
  "/mes-candidatures",
  auth,
  offreController.getCandidaturesEntreprise
);


router.get("/", async (req, res) => {
  try {
    const list = await Candidature.find()
  .populate("candidat", "username")
  .populate("offre", "titre")
  .sort({ createdAt: -1 });
      

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

router.post("/", auth, candidatureController.createCandidature);
router.put("/:id", auth, candidatureController.updateCandidature);
router.put("/:id/score", auth, candidatureController.updateScore);
router.delete("/:id", auth, candidatureController.deleteCandidature);

module.exports = router;



