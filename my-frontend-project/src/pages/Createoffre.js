import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SidebarEntrep from "../components/SidebarEntrep";

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid
} from "@mui/material";

function CreateOffre() {
  const [open, setOpen] = useState(true);

  const [form, setForm] = useState({
    titre: "",
    localisation: "",
    description: "",
    competences: "",
    experience: "",
    niveau: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/pages/MesOffresEntr");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // transformation des données
      const data = {
        ...form,
        competences: form.competences
          ? form.competences
              .split(",")
              .map((s) => s.trim().toLowerCase())
              .filter((s) => s !== "")
          : [],
        experience: Number(form.experience || 0),
        niveau: form.niveau?.toLowerCase()
      };

      // validation simple
      if (!data.titre || !data.localisation || !data.description) {
        return alert("Veuillez remplir tous les champs obligatoires");
      }

      await axios.post("http://localhost:3001/api/offres", data, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });

      navigate("/pages/MesOffresEntr");

    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création de l’offre");
    }
  };

  return (
    <SidebarEntrep>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: "center", color: "#1d9bf0" }}>
          Créez votre publication
        </DialogTitle>

        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={2}>

              {/* Titre */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Titre de poste"
                  name="titre"
                  value={form.titre}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              {/* Localisation */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Localisation"
                  name="localisation"
                  value={form.localisation}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              {/* Compétences */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Compétences (react, nodejs...)"
                  name="competences"
                  value={form.competences}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              {/* Expérience */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Expérience requise (années)"
                  name="experience"
                  type="number"
                  value={form.experience}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              {/* Niveau */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Niveau (licence, master...)"
                  name="niveau"
                  value={form.niveau}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                  required
                />
              </Grid>

            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Créer
          </Button>

          <Button variant="outlined" onClick={handleClose}>
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
    </SidebarEntrep>
  );
}

export default CreateOffre;