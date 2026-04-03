const Candidature = require("../models/Candidature");
const Offre = require("../models/offre");

// Récupérer toutes les candidatures
// Récupérer toutes les candidatures
exports.getAllCandidatures = async (req, res) => {
  try {
    const list = await Candidature.find()
      .populate("candidat", "username email profileImage")
      .populate({
        path: "offre",
        populate: {
          path: "entreprise",
          select: "username email"
        }
      })
      .sort("-createdAt");

    // Transformer les données pour le frontend
    const transformedData = list.map(item => {
      const candidature = item.toObject();
      
      // Construire le chemin complet du CV
      if (candidature.cv) {
        // Si le cv n'a pas d'extension, ajouter .pdf
        const cvFileName = candidature.cv.endsWith('.pdf') 
          ? candidature.cv 
          : `${candidature.cv}.pdf`;
        
        candidature.cvPath = `/uploads/cv/${cvFileName}`;
        candidature.cvFullUrl = `http://localhost:3001/uploads/cv/${cvFileName}`;
      }
      
      return candidature;
    });

    res.json(transformedData);
  } catch (err) {
    console.error("Erreur getAllCandidatures:", err);
    res.status(500).json({ 
      msg: "Erreur serveur lors de la récupération des candidatures",
      error: err.message 
    });
  }
};

// Récupérer une candidature par ID
exports.getCandidatureById = async (req, res) => {
  try {
    const candidature = await Candidature.findById(req.params.id)
      .populate("candidat", "username email profileImage")
      .populate({
        path: "offre",
        populate: {
          path: "entreprise",
          select: "username email"
        }
      });

    if (!candidature) {
      return res.status(404).json({ msg: "Candidature non trouvée" });
    }

    res.json(candidature);
  } catch (err) {
    console.error("Erreur getCandidatureById:", err);
    res.status(500).json({ 
      msg: "Erreur serveur",
      error: err.message 
    });
  }
};



// Récupérer les candidatures par candidat
exports.getCandidaturesByCandidat = async (req, res) => {
  try {
    const candidatures = await Candidature.find({ candidat: req.params.candidatId })
      .populate("candidat", "username email")
      .populate({
        path: "offre",
        populate: {
          path: "entreprise",
          select: "username email"
        }
      })
      .sort("-createdAt");

    res.json(candidatures);
  } catch (err) {
    console.error("Erreur getCandidaturesByCandidat:", err);
    res.status(500).json({ 
      msg: "Erreur serveur",
      error: err.message 
    });
  }
};

// Récupérer les candidatures par offre
exports.getCandidaturesByOffre = async (req, res) => {
  try {
    const candidatures = await Candidature.find({ offre: req.params.offreId })
      .populate("candidat", "username email")
      .populate({
        path: "offre",
        populate: {
          path: "entreprise",
          select: "username email"
        }
      })
      .sort("-createdAt");

    res.json(candidatures);
  } catch (err) {
    console.error("Erreur getCandidaturesByOffre:", err);
    res.status(500).json({ 
      msg: "Erreur serveur",
      error: err.message 
    });
  }
};



// Statistiques des candidatures
exports.getCandidaturesStats = async (req, res) => {
  try {
    const total = await Candidature.countDocuments();
    
    const stats = await Candidature.aggregate([
      {
        $group: {
          _id: null,
          scoreMoyen: { $avg: "$score" },
          scoreMin: { $min: "$score" },
          scoreMax: { $max: "$score" },
          totalCandidatures: { $sum: 1 }
        }
      }
    ]);

    const candidaturesParOffre = await Candidature.aggregate([
      {
        $group: {
          _id: "$offre",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "offres",
          localField: "_id",
          foreignField: "_id",
          as: "offreDetails"
        }
      }
    ]);

    res.json({
      total,
      moyennes: stats[0] || { scoreMoyen: 0, scoreMin: 0, scoreMax: 0 },
      topOffres: candidaturesParOffre
    });
  } catch (err) {
    console.error("Erreur getCandidaturesStats:", err);
    res.status(500).json({ 
      msg: "Erreur serveur lors de la récupération des statistiques",
      error: err.message 
    });
  }
};