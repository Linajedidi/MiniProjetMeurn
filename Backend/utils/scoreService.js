const Offre = require("../models/offre");
const CV = require("../models/cv");
const calculateScore = require("./Calcscore");
const extractCandidateData = require("./cvDataExtractor");

async function computeCandidateScore(candidatId, offreId) {

  const offre = await Offre.findById(offreId);
  if (!offre) throw new Error("Offre non trouvée");

  const cvDoc = await CV.findOne({ user: candidatId });
  if (!cvDoc) throw new Error("CV introuvable");

  //  NOUVEAU
  const candidat = await extractCandidateData(cvDoc);

  console.log("CANDIDAT DATA:", candidat);
  console.log("OFFRE:", offre);

  const score = calculateScore(offre, candidat);

  return score;
}

module.exports = computeCandidateScore;