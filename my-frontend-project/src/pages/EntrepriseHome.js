import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarEntrep from "../components/SidebarEntrep";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";

const EntrepriseHome = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("name") || "Entreprise";

  const [candidatures, setCandidatures] = useState([]);
  const [totalOffres, setTotalOffres] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:3001/api/candidatures/mes-candidatures", {
  headers: { Authorization: "Bearer " + localStorage.getItem("token") }
})
      .then(res => setCandidatures(res.data))
      .catch(err => console.error("Erreur chargement candidatures:", err));

    axios.get("http://localhost:3001/api/offres/mes-offres", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
      .then(res => setTotalOffres(res.data.length))
      .catch(err => console.error("Erreur chargement offres:", err));
  }, []);

  return (
    <SidebarEntrep>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Tableau de bord
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Gérez vos offres d’emploi et vos candidats
        </Typography>

        {/* Stats centrées et agrandies */}
        <Grid
          container
          spacing={4}
          sx={{ my: 4 }}
          justifyContent="center"
        >
          <Grid item xs={12} sm={6} md={5}>
            <Card
              sx={{
                bgcolor: "primary.main",
                color: "#fff",
                borderRadius: 3,
                minHeight: 140,
                display: "flex",
                alignItems: "center"
              }}
            >
              <CardContent sx={{ px: 4, py: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Total des candidats
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                  {candidatures.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={5}>
            <Card
              sx={{
                bgcolor: "primary.main",
                color: "#fff",
                borderRadius: 3,
                minHeight: 140,
                display: "flex",
                alignItems: "center"
              }}
            >
              <CardContent sx={{ px: 4, py: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Offres d’emploi
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                  {totalOffres}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tableau */}
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Liste des candidatures
        </Typography>

        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: "primary.main" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff" }}>Nom</TableCell>
                <TableCell sx={{ color: "#fff" }}>CV</TableCell>
                <TableCell sx={{ color: "#fff" }}>Offre</TableCell>
                <TableCell sx={{ color: "#fff" }}>Score</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {candidatures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Aucune candidature
                  </TableCell>
                </TableRow>
              ) : (
                candidatures.map(c => (
                  <TableRow key={c._id}>
                    <TableCell>{c.candidat?.username || "—"}</TableCell>
                    <TableCell>{c.cv}</TableCell>
                    <TableCell>{c.offre?.titre || "—"}</TableCell>
                    <TableCell>{c.score}%</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </SidebarEntrep>
  );
};

export default EntrepriseHome;