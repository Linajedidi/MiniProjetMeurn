const router = require("express").Router();
const User = require("../../models/User");
const { sendEntrepriseStatusEmail } = require("../../services/emailService");


// récupérer toutes les entreprises
router.get("/", async (req, res) => {
  try {
    const entreprises = await User.find({ role: "ENTREPRISE" }).sort({ createdAt: -1 });
    res.json(entreprises);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}); 

//  entreprises en attente
router.get("/en-attente", async (req, res) => {
  try {
    const entreprises = await User.find({
      role: "ENTREPRISE",
      status: "EN_ATTENTE",
        isActive: true

    });

    res.json(entreprises);
  } catch (err) {
    res.status(500).json({ msg: "Erreur serveur" });
  }
});

//  nombre notifications
router.get("/count", async (req, res) => {
  try {
    const count = await User.countDocuments({
      role: "ENTREPRISE",
      status: "EN_ATTENTE",
      isActive: true   

    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ msg: "Erreur serveur" });
  }
});

//  accepter
router.put("/:id/accepter", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.status = "ACCEPTE";
    user.isActive= true ;  

    await user.save();

    await sendEntrepriseStatusEmail(user.email, user.username, "ACCEPTE");

    res.json({ message: "Entreprise acceptée et email envoyé" });

  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});
//  refuser
router.put("/:id/refuser", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    user.status = "REFUSE";
    user.isActive= false ;
    await user.save(); 
    

    //  envoyer email AVANT suppression
    await sendEntrepriseStatusEmail(user.email, user.username, "REFUSE");

    //  supprimer utilisateur
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "Entreprise refusée, supprimée et email envoyé" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;