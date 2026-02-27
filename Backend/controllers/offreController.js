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

// DELETE
exports.deleteOffre = async (req, res) => {
  try {
    const deleted = await Offre.findOneAndDelete({ _id: req.params.id, entreprise: req.user.id });
    if (!deleted) return res.status(404).json({ message: "Offre non trouvée" });
    res.json({ message: "Offre supprimée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur suppression", err: err.message });
  }
};