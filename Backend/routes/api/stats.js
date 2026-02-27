const express = require("express");
const router = express.Router();
const User = require("../../models/User");

router.get("/", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCandidates = await User.countDocuments({ role: "CANDIDAT" });
    const totalEnterprises = await User.countDocuments({ role: "ENTREPRISE" }); 
    console.log({ totalUsers, totalCandidates, totalEnterprises }); 

    //const totalOffers = await Offer.countDocuments();

    res.json({
      totalUsers,
      totalCandidates,
    totalEnterprises,
    //totalOffers
    });
  } catch (err) {
    console.error("Erreur stats:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;