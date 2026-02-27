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
    description: ""
  });

  useEffect(() => {
    axios.get(`${API}/offres/${id}`, {
      headers: { Authorization: "Bearer " + token }
    })
    .then(res => {
      const { titre, localisation, description } = res.data;   // ✅ on extrait seulement les champs utiles
      setForm({ titre, localisation, description });
    })
    .catch(() => alert("Impossible de charger l’offre"));
  }, [id, token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await axios.put(`${API}/offres/${id}`, form, {
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
        <DialogTitle>Modifier l’offre</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titre"
                name="titre"
                value={form.titre}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Localisation"
                name="localisation"
                value={form.localisation}
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
        <DialogActions>
          <Button onClick={() => navigate("/pages/MesOffresEntr")}>Annuler</Button>
          <Button variant="contained" onClick={handleSubmit}>Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </SidebarEntrep>
  );
}

export default EditOffre;