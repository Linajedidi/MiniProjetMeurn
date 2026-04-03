const mongoose = require("mongoose");

const CVSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  competences: [{ type: String }],
experiences: { type: Number },
niveaux: { type: String }
});

module.exports = mongoose.model("CV", CVSchema);