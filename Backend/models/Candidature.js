const mongoose = require("mongoose");

const CandidatureSchema = new mongoose.Schema({
  candidat: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  offre: { type: String, required: true },   // pour l’instant simple string
  cv: { type: String, default: "cv.pdf" },   
  score: { type: Number, default: 55 }
});

module.exports = mongoose.model("Candidature", CandidatureSchema);