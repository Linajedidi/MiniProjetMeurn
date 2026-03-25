const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Offre = require("../../models/offre");

router.get("/", async (req, res) => {
  try {
    // Exécuter toutes les requêtes en parallèle pour de meilleures performances
    const [totalUsers, totalCandidates, totalEnterprises, totalOffers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "CANDIDAT" }),
      User.countDocuments({ role: "ENTREPRISE" }),
      Offre.countDocuments()
    ]);

    console.log("📊 Statistiques récupérées:", {
      totalUsers,
      totalCandidates,
      totalEnterprises,
      totalOffers
    });

    res.json({
      success: true,
      totalUsers,
      totalCandidates,
      totalEnterprises,
      totalOffers
    });
    
  } catch (err) {
    console.error("❌ Erreur stats:", err);
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);
    
    res.status(500).json({ 
      success: false,
      message: "Erreur serveur lors de la récupération des statistiques",
      error: err.message 
    });
  }
});

module.exports = router;