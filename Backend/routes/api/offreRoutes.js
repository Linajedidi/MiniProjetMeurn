const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authMiddleware");
const ctrl = require("../../controllers/offreController");

router.get("/offres/public", ctrl.getPublicOffres);


router.post("/offres", auth, ctrl.createOffre);
router.get("/offres/mes-offres", auth, ctrl.getMesOffres);
router.get("/offres/:id", auth, ctrl.getOffreById);
router.put("/offres/:id", auth, ctrl.updateOffre);
router.delete("/offres/:id", auth, ctrl.deleteOffre);
router.get("/offres/:id/candidatures", auth, ctrl.getCandidaturesByOffre);
router.get("/admin/all", auth, ctrl.getAllOffres);
router.get("/offres-candidat", auth, ctrl.getOffresCandidat);


module.exports = router;