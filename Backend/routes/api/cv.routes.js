const express = require("express");
const router = express.Router();
const upload = require("../../middleware/uploadCV");
const CV = require("../../models/cv");
const path = require("path");
const fs = require("fs");
const auth = require("../../middleware/authMiddleware");
const Candidature = require("../../models/Candidature");
const computeCandidateScore = require("../../utils/scoreService");
//ma sta"mltch lauth lezmni nzid fel front axios khater ma ykhoch f token 
// Vérifier si l'utilisateur a déjà un CV
router.get("/exists/:userId", async (req, res) => {
  try {
    const cv = await CV.findOne({ user: req.params.userId });

    res.json({
      exists: !!cv,
      cvId: cv ? cv._id : null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post("/upload", upload.single("cv"), async (req, res) => {
  try {
    //const { userId } = req.body;
    console.log("REQ BODY:", req.body); 
    const { userId, competences, experiences, niveaux } = req.body;

    //  Supprimer l’ancien CV s’il existe
    const oldCV = await CV.findOne({ user: userId });
    if (oldCV) {
      await CV.deleteOne({ user: userId });
    }

    // ➕ Enregistrer le nouveau CV
   const cv = new CV({
  user: userId,
  fileName: req.file?.originalname,
  filePath: req.file?.path,

  competences: competences ? competences.split(",") : [],
  experiences: experiences ? Number(experiences) : 0,
  niveaux: niveaux || ""
});

    await cv.save();
    // 🔄 recalcul score après changement CV
const candidatures = await Candidature.find({ candidat: userId });

for (let cand of candidatures) {
  const newScore = await computeCandidateScore(userId, cand.offre);

  cand.score = newScore;
  cand.cv = cv.filePath;

  await cand.save();
}

    res.status(201).json({
      message: oldCV
        ? "CV remplacé avec succès"
        : "CV enregistré avec succès",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/view/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const cv = await CV.findOne({ user: userId });
    if (!cv) {
      return res.status(404).json({ message: "CV non trouvé" });
    }

    const filePath = path.join(__dirname, "../../", cv.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Fichier CV introuvable" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${cv.fileName}"`
    );

    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    console.error("Erreur view CV :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;