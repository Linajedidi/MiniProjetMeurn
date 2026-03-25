const mongoose = require("mongoose");

const OffreSchema = new mongoose.Schema({
  entreprise: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  titre: { type: String, required: true },
  localisation: { type: String, required: true },
  description: { type: String, required: true },
  competences: [{ type: String }],
experience: { type: Number },
niveau: { type: String },

}, { timestamps: true });

module.exports = mongoose.model("Offre", OffreSchema);