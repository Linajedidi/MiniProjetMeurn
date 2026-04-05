import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import SidebarEntrep from "../components/SidebarEntrep";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, Typography, Box, alpha,
  Chip, Stack, Alert, Snackbar
} from "@mui/material";

function EditOffre() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API = "http://localhost:3001/api";

  const [form, setForm] = useState({
    titre: "",
    localisation: "",
    description: "",
    competences: "",
    experience: "",
    niveau: ""
  });

  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get(`${API}/offres/${id}`, {
      headers: { Authorization: "Bearer " + token }
    })
    .then(res => {
      const { titre, localisation, description, competences, experience, niveau } = res.data;
      setForm({
        titre: titre || "",
        localisation: localisation || "",
        description: description ? description.substring(0, 500) : "",
        competences: competences?.join(", ") || "",
        experience: experience || "",
        niveau: niveau || ""
      });
      setLoading(false);
    })
    .catch(() => {
      alert("Impossible de charger l'offre");
      navigate("/pages/MesOffresEntr");
    });
  }, [id, token, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.titre.trim()) newErrors.titre = "Le titre est requis";
    if (!form.localisation.trim()) newErrors.localisation = "La localisation est requise";
    if (!form.description.trim()) newErrors.description = "La description est requise";
    if (form.experience && (form.experience < 0 || form.experience > 50)) {
      newErrors.experience = "L'expérience doit être entre 0 et 50 ans";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const data = {
        titre: form.titre,
        localisation: form.localisation,
        description: form.description,
        competences: form.competences
          ? form.competences.split(",").map((s) => s.trim().toLowerCase()).filter((s) => s !== "")
          : [],
        experience: Number(form.experience || 0),
        niveau: form.niveau?.toLowerCase() || ""
      };

      await axios.put(`${API}/offres/${id}`, data, {
        headers: { Authorization: "Bearer " + token }
      });

      setSnackbar({ open: true, message: "Offre modifiée avec succès !", severity: "success" });
      setTimeout(() => { navigate("/pages/MesOffresEntr"); }, 1500);

    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Erreur lors de la modification",
        severity: "error"
      });
    }
  };

  const handleClose = () => {
    navigate("/pages/MesOffresEntr");
  };

  if (loading) {
    return (
      <SidebarEntrep>
        <Dialog open maxWidth="sm" fullWidth>
          <DialogContent>
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography>Chargement de l'offre...</Typography>
            </Box>
          </DialogContent>
        </Dialog>
      </SidebarEntrep>
    );
  }

  const descLength = form.description.length;
  const isNearLimit = descLength >= 450;

  return (
    <SidebarEntrep>
      <Dialog 
        open 
        maxWidth="md" 
        fullWidth 
        onClose={handleClose}
        PaperProps={{
          sx: { borderRadius: 3, overflow: "hidden", maxHeight: "90vh" }
        }}
      >

        {/* Header */}
        <Box sx={{ 
          background: "linear-gradient(135deg, #2563eb, #7c3aed)",
          p: 2,
          position: "relative"
        }}>
          <Button
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 12,
              top: 10,
              color: "#ffffff",
              textTransform: "none"
            }}
          >
            Fermer
          </Button>

          <Typography variant="h5" sx={{ fontWeight: 700, color: "#ffffff", textAlign: "center" }}>
            Modifier l'offre
          </Typography>

          <Typography variant="body2" sx={{ color: alpha("#ffffff", 0.9), textAlign: "center", mt: 0.5 }}>
            Modifiez les informations de votre offre d'emploi
          </Typography>
        </Box>

        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3} sx={{ mt: 1 }}>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Titre du poste"
                name="titre"
                value={form.titre}
                onChange={handleChange}
                required
                error={!!errors.titre}
                helperText={errors.titre}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Localisation"
                name="localisation"
                value={form.localisation}
                onChange={handleChange}
                required
                error={!!errors.localisation}
                helperText={errors.localisation}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Compétences"
                name="competences"
                value={form.competences}
                onChange={handleChange}
                placeholder="React, Node.js..."
              />

              {form.competences && (
                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                  {form.competences.split(",").map((skill, index) =>
                    skill.trim() && (
                      <Chip key={index} label={skill.trim()} size="small" />
                    )
                  )}
                </Stack>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Expérience (années)"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                error={!!errors.experience}
                helperText={errors.experience}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Niveau d'étude"
                name="niveau"
                value={form.niveau}
                onChange={handleChange}
                placeholder="Licence, Master..."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={5}
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                error={!!errors.description}
                helperText={
                  errors.description ||
                  `${descLength}/500`
                }
                inputProps={{ maxLength: 500 }}
              />
            </Grid>

          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, justifyContent: "center", gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              px: 4
            }}
          >
            Enregistrer
          </Button>

          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{ px: 4 }}
          >
            Annuler
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SidebarEntrep>
  );
}

export default EditOffre;