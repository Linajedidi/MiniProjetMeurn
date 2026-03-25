const mongoose = require("mongoose");

const CandidatureSchema = new mongoose.Schema({
  candidat: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  offre: { type: mongoose.Schema.Types.ObjectId, ref: "Offre", required: true }, 
  cv: { type: String },
  score: { type: Number, default: 55 }
}, { timestamps: true });

CandidatureSchema.virtual('cvUrl').get(function() {
  if (!this.cv) return null;
  const cvFileName = this.cv.endsWith('.pdf') ? this.cv : `${this.cv}.pdf`;
  return `cv/${cvFileName}`;
});

module.exports = mongoose.model("Candidature", CandidatureSchema);