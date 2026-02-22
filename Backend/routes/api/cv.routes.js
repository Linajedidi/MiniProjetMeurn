const express = require("express");
const router = express.Router();
const upload = require("../../middleware/uploadCV");
const CV = require("../../models/cv");
// 🔍 Vérifier si l'utilisateur a déjà un CV
router.get("/exists/:userId", async (req, res) => {
  try {
    const cv = await CV.findOne({ user: req.params.userId });

    res.json({
      exists: !!cv, // true ou false
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post("/upload", upload.single("cv"), async (req, res) => {
  try {
    const { userId } = req.body;

    // 🔁 Supprimer l’ancien CV s’il existe
    const oldCV = await CV.findOne({ user: userId });
    if (oldCV) {
      await CV.deleteOne({ user: userId });
    }

    // ➕ Enregistrer le nouveau CV
    const cv = new CV({
      user: userId,
      fileName: req.file.originalname,
      filePath: req.file.path,
    });

    await cv.save();

    res.status(201).json({
      message: oldCV
        ? "CV remplacé avec succès"
        : "CV enregistré avec succès",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;