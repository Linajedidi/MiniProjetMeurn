const Offre = require("../models/Offre");
const Candidature = require("../models/Candidature");

// CREATE
exports.createOffre = async (req, res) => {
  try {
    const offre = new Offre({
      ...req.body,
      entreprise: req.user.id
    });
    await offre.save();
    res.status(201).json(offre);
  } catch (err) {
    res.status(500).json({ message: "Erreur création", err: err.message });
  }
};

// READ (mes offres) + nombre de candidats


exports.getMesOffres = async (req, res) => {
  try {
    const offres = await Offre.find({ entreprise: req.user.id }).sort({ createdAt: -1 });

    const offresAvecCandidats = await Promise.all(
      offres.map(async (offre) => {
        const count = await Candidature.countDocuments({ offre: offre._id }); 
        return { 
          ...offre.toObject(), 
          candidatsCount: count 
        };
      })
    );

    res.json(offresAvecCandidats);
  } catch (err) {
    console.error("ERREUR getMesOffres:", err);
    res.status(500).json({ message: "Erreur récupération", err: err.message });
  }
};
// READ (une offre par id)
exports.getOffreById = async (req, res) => {
  try {
    const offre = await Offre.findOne({ _id: req.params.id, entreprise: req.user.id });
    if (!offre) return res.status(404).json({ message: "Offre non trouvée" });
    res.json(offre);
  } catch (err) {
    res.status(500).json({ message: "Erreur chargement offre", err: err.message });
  }
};

// UPDATE
exports.updateOffre = async (req, res) => {
  try {
    const offre = await Offre.findOneAndUpdate(
      { _id: req.params.id, entreprise: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!offre) return res.status(404).json({ message: "Offre non trouvée" });
    res.json(offre);
  } catch (err) {
    res.status(500).json({ message: "Erreur modification", err: err.message });
  }
};

// GET candidatures de mes offres (DEBUG VERSION)
exports.getCandidaturesEntreprise = async (req, res) => {
  try {
    console.log("===== DEBUG CANDIDATURES ENTREPRISE =====");
    console.log("Entreprise connectée (req.user.id):", req.user.id);

    // 1️Récupérer les offres de cette entreprise
    const offres = await Offre.find({ entreprise: req.user.id });

    console.log("Offres trouvées:", offres);

    const offresIds = offres.map(o => o._id);
    console.log("IDs des offres:", offresIds);

    //  Récupérer les candidatures liées à ces offres
    const candidatures = await Candidature.find({
      offre: { $in: offresIds }
    })
      .populate("candidat", "username")
      .populate("offre", "titre");

    console.log("Candidatures trouvées:", candidatures);
    

    res.json(candidatures);

  } catch (err) {
    console.error("Erreur getCandidaturesEntreprise:", err);
    res.status(500).json({ message: "Erreur chargement candidatures" });
  }
};

exports.getCandidaturesByOffre = async (req, res) => {
  try {
    const offre = await Offre.findOne({
      _id: req.params.id,
      entreprise: req.user.id
    });

    if (!offre) {
      return res.status(404).json({ message: "Offre non trouvée" });
    }

    const candidatures = await Candidature.find({
      offre: offre._id
    })
      .populate("candidat", "username email")
      .populate("offre", "titre");

    res.json({
      titre: offre.titre,
      candidatures
    });

  } catch (err) {
    res.status(500).json({ message: "Erreur chargement" });
  }
};



// DELETE
exports.deleteOffre = async (req, res) => {
  try {
    const offre = await Offre.findOne({
      _id: req.params.id,
      entreprise: req.user.id
    });

    if (!offre) {
      return res.status(404).json({ message: "Offre non trouvée" });
    }

    // Supprimer toutes les candidatures liées à cette offre
    await Candidature.deleteMany({ offre: offre._id });

    //  Supprimer l’offre
    await Offre.deleteOne({ _id: offre._id });

    res.json({ message: "Offre et candidatures supprimées" });

  } catch (err) {
    res.status(500).json({
      message: "Erreur suppression",
      err: err.message
    });
  }
};