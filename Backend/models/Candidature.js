const mongoose = require("mongoose");

const CandidatureSchema = new mongoose.Schema({
  candidat: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  offre: { type: mongoose.Schema.Types.ObjectId, ref: "Offre", required: true }, 
  cv: { type: String, default: "cv.pdf" },
  score: { type: Number, default: 55 }
}, { timestamps: true });

module.exports = mongoose.model("Candidature", CandidatureSchema);