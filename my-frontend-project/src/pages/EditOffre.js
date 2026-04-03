import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import SidebarEntrep from "../components/SidebarEntrep";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid
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

  useEffect(() => {
    axios.get(`${API}/offres/${id}`, {
      headers: { Authorization: "Bearer " + token }
    })
    .then(res => {
      const {
        titre,
        localisation,
        description,
        competences,
        experience,
        niveau
      } = res.data;

      setForm({
        titre,
        localisation,
        description,
        competences: competences?.join(", ") || "",
        experience: experience || "",
        niveau: niveau || ""
      });
    })
    .catch(() => alert("Impossible de charger l’offre"));
  }, [id, token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
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

      await axios.put(`${API}/offres/${id}`, data, {
        headers: { Authorization: "Bearer " + token }
      });

      navigate("/pages/MesOffresEntr");

    } catch (err) {
      console.error(err);
      alert("Erreur lors de la modification");
    }
  };

  return (
    <SidebarEntrep>
      <Dialog open maxWidth="sm" fullWidth onClose={() => navigate("/pages/MesOffresEntr")}>
        <DialogTitle sx={{ textAlign: "center", color: "#1d9bf0" }}>
          Modifier l'offre
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Titre de poste"
                name="titre"
                value={form.titre}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Localisation"
                name="localisation"
                value={form.localisation}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Compétences (react, nodejs...)"
                name="competences"
                value={form.competences}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Expérience (années)"
                name="experience"
                value={form.experience}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Niveau"
                name="niveau"
                value={form.niveau}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </Grid>

          </Grid>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button variant="contained" onClick={handleSubmit}>
            Enregistrer
          </Button>

          <Button variant="outlined" onClick={() => navigate("/pages/MesOffresEntr")}>
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
    </SidebarEntrep>
  );
}

export default EditOffre;