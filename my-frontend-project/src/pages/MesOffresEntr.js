import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SidebarEntrep from "../components/SidebarEntrep";

import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";

function MesOffresEntr() {
  const [offres, setOffres] = useState([]);
  const [searchTitre, setSearchTitre] = useState("");
  const [searchLocalisation, setSearchLocalisation] = useState("");
  const [sortDate, setSortDate] = useState("recent"); // recent | ancien

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API = "http://localhost:3001/api";

  const loadOffres = async () => {
    try {
      const res = await axios.get(`${API}/offres/mes-offres`, {
        headers: { Authorization: "Bearer " + token }
      });
      setOffres(res.data);
    } catch (err) {
      console.error("Erreur chargement offres:", err);
    }
  };

  useEffect(() => {
    loadOffres();
  }, []);

  const supprimerOffre = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette offre ?")) return;

    try {
      await axios.delete(`${API}/offres/${id}`, {
        headers: { Authorization: "Bearer " + token }
      });
      loadOffres();
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert("Erreur lors de la suppression");
    }
  };

  // 🔎 Filtres + tri
  const offresFiltrees = offres
    .filter(offre =>
      offre.titre.toLowerCase().includes(searchTitre.toLowerCase())
    )
    .filter(offre =>
      offre.localisation.toLowerCase().includes(searchLocalisation.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortDate === "recent" ? dateB - dateA : dateA - dateB;
    });

  return (
    <SidebarEntrep>
      <Box sx={{ p: 2 }}>

        {/* Barre de filtres */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Button
            variant="contained"
            onClick={() => navigate("/pages/CreateOffre")}
          >
            Créez votre publication
          </Button>

          <TextField
            size="small"
            label="Filtrer par titre"
            value={searchTitre}
            onChange={(e) => setSearchTitre(e.target.value)}
          />

          <TextField
            size="small"
            label="Filtrer par localisation"
            value={searchLocalisation}
            onChange={(e) => setSearchLocalisation(e.target.value)}
          />

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Tri par date</InputLabel>
            <Select
              value={sortDate}
              label="Tri par date"
              onChange={(e) => setSortDate(e.target.value)}
            >
              <MenuItem value="recent">Plus récent</MenuItem>
              <MenuItem value="ancien">Plus ancien</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Grid container spacing={2}>
          {offresFiltrees.length === 0 && (
            <Typography sx={{ ml: 2 }}>
              Aucune offre trouvée.
            </Typography>
          )}

          {offresFiltrees.map((offre) => (
            <Grid item xs={12} sm={6} md={4} key={offre._id}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {offre.titre}
                  </Typography>

                  <Box
                    sx={{
                      bgcolor: "primary.main",
                      color: "#fff",
                      p: 2,
                      borderRadius: 2,
                      mb: 1
                    }}
                  >
                    <Typography variant="body2">
                      <b>Localisation :</b> {offre.localisation}
                    </Typography>
                    <Typography variant="body2">
                      {offre.description}
                    </Typography>
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Publié le {new Date(offre.createdAt).toLocaleDateString()}
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Candidats : {offre.candidatsCount || 0}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="space-between"
                    sx={{ mt: 2 }}
                  >
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => navigate(`/pages/EditOffre/${offre._id}`)}
                    >
                      Modifier
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => supprimerOffre(offre._id)}
                    >
                      Supprimer
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </SidebarEntrep>
  );
}

export default MesOffresEntr;