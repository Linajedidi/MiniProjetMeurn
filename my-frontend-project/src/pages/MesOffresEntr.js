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
  InputLabel,
  Pagination,
  Chip,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Slide
} from "@mui/material";

import {
  Add,
  Delete,
  LocationOn,
  Work,
  Warning,
  Visibility
} from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function MesOffresEntr() {
  const [offres, setOffres] = useState([]);
  const [searchTitre, setSearchTitre] = useState("");
  const [searchLocalisation, setSearchLocalisation] = useState("");
  const [sortDate, setSortDate] = useState("recent");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [offreToDelete, setOffreToDelete] = useState(null);
  const [descriptionDialogOpen, setDescriptionDialogOpen] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState(null);

  const [page, setPage] = useState(1);
  const offresParPage = 6;

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

  const handleDeleteClick = (offre) => {
    setOffreToDelete(offre);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!offreToDelete) return;

    try {
      await axios.delete(`${API}/offres/${offreToDelete._id}`, {
        headers: { Authorization: "Bearer " + token }
      });
      loadOffres();
      setDeleteDialogOpen(false);
      setOffreToDelete(null);
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert("Erreur lors de la suppression");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setOffreToDelete(null);
  };

  const handleViewDescription = (offre) => {
    setSelectedOffre(offre);
    setDescriptionDialogOpen(true);
  };

  const handleCloseDescription = () => {
    setDescriptionDialogOpen(false);
    setSelectedOffre(null);
  };

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

  const indexOfLast = page * offresParPage;
  const indexOfFirst = indexOfLast - offresParPage;
  const offresActuelles = offresFiltrees.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(offresFiltrees.length / offresParPage);

  useEffect(() => {
    setPage(1);
  }, [searchTitre, searchLocalisation, sortDate]);

  const getCandidatsColor = (count) => {
    if (count >= 10) return { bg: "#10b981", text: "#ffffff" };
    if (count >= 5) return { bg: "#3b82f6", text: "#ffffff" };
    if (count >= 1) return { bg: "#f59e0b", text: "#ffffff" };
    return { bg: "#e2e8f0", text: "#64748b" };
  };

  // ✅ SOLUTION RADICALE : Forcer la coupure du texte manuellement
  const forceBreakText = (text, maxLength = 50) => {
    if (!text) return "Aucune description disponible.";
    
    let result = "";
    for (let i = 0; i < text.length; i += maxLength) {
      result += text.slice(i, i + maxLength) + "\n";
    }
    return result.trim();
  };

  return (
    <SidebarEntrep>
      <Box sx={{ p: 4 }}>
        {/* Header */}
       

        {/* Barre de filtres */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/pages/CreateOffre")}
            sx={{
              textTransform: "none",
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              borderRadius: 2,
              px: 3,
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #1d4ed8, #6d28d9)",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)"
              }
            }}
          >
            Créer une offre
          </Button>

          <TextField
            size="small"
            label="Filtrer par titre"
            value={searchTitre}
            onChange={(e) => setSearchTitre(e.target.value)}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                transition: "all 0.2s",
                "&:hover fieldset": { borderColor: "#3b82f6" },
                "&.Mui-focused fieldset": { borderColor: "#3b82f6", borderWidth: 2 }
              }
            }}
          />

          <TextField
            size="small"
            label="Filtrer par localisation"
            value={searchLocalisation}
            onChange={(e) => setSearchLocalisation(e.target.value)}
            InputProps={{
              startAdornment: <LocationOn sx={{ mr: 1, color: "#94a3b8", fontSize: 20 }} />
            }}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                transition: "all 0.2s",
                "&:hover fieldset": { borderColor: "#3b82f6" },
                "&.Mui-focused fieldset": { borderColor: "#3b82f6", borderWidth: 2 }
              }
            }}
          />

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Trier par date</InputLabel>
            <Select
              value={sortDate}
              label="Trier par date"
              onChange={(e) => setSortDate(e.target.value)}
              sx={{ 
                borderRadius: 2,
                "&:hover": {
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#3b82f6" }
                }
              }}
            >
              <MenuItem value="recent">Plus récent</MenuItem>
              <MenuItem value="ancien">Plus ancien</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* Stats rapides */}
        {offres.length > 0 && (
          <Box sx={{ mb: 3, display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
            <Chip 
              label={`${offres.length} offre${offres.length > 1 ? 's' : ''}`}
              sx={{ bgcolor: "#f1f5f9", color: "#475569", fontWeight: 500, borderRadius: 2 }}
            />
            {offresFiltrees.length !== offres.length && (
              <Chip 
                label={`${offresFiltrees.length} résultat${offresFiltrees.length > 1 ? 's' : ''}`}
                sx={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", color: "#fff", fontWeight: 500, borderRadius: 2 }}
              />
            )}
          </Box>
        )}

        {/* Grid Offres */}
        {offresActuelles.length === 0 ? (
          <Box sx={{ 
            textAlign: "center", 
            py: 8,
            bgcolor: "#f8fafc",
            borderRadius: 3,
            border: "1px solid #e2e8f0"
          }}>
            <Work sx={{ fontSize: 64, color: "#cbd5e1", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#475569", mb: 1 }}>
              Aucune offre trouvée
            </Typography>
            <Typography variant="body2" sx={{ color: "#94a3b8", mb: 3 }}>
              {searchTitre || searchLocalisation 
                ? "Aucune offre ne correspond à vos critères de recherche"
                : "Commencez par créer votre première offre d'emploi"}
            </Typography>
            {!searchTitre && !searchLocalisation && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate("/pages/CreateOffre")}
                sx={{
                  textTransform: "none",
                  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "linear-gradient(135deg, #1d4ed8, #6d28d9)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)"
                  }
                }}
              >
                Créer une offre
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={3}>
            {offresActuelles.map((offre) => {
              const candidatsColor = getCandidatsColor(offre.candidatsCount || 0);
              const rawDescription = offre.description || "Aucune description disponible.";
              // ✅ FORCER LA COUPURE APRÈS 40 CARACTÈRES
              const forcedBreakText = forceBreakText(rawDescription, 40);
              
              return (
                <Grid item xs={12} sm={6} md={4} key={offre._id}>
                  <Card sx={{ 
                    borderRadius: 3,
                    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
                    border: "1px solid #e2e8f0",
                    transition: "all 0.3s ease",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
                      borderColor: "#3b82f6",
                      transform: "translateY(-4px)"
                    }
                  }}>
                    <CardContent sx={{ 
                      p: 3, 
                      display: "flex", 
                      flexDirection: "column",
                      height: "100%"
                    }}>
                      {/* Titre */}
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        color: "#0f172a",
                        fontSize: "1rem",
                        lineHeight: 1.3,
                        mb: 2,
                        wordBreak: "break-word"
                      }}>
                        {offre.titre}
                      </Typography>

                      {/* Localisation */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <LocationOn sx={{ fontSize: 18, color: "#3b82f6" }} />
                        <Typography variant="body2" color="#475569" sx={{ wordBreak: "break-word" }}>
                          {offre.localisation}
                        </Typography>
                      </Box>

                      {/* Description avec TEXTE FORCÉ À REVENIR À LA LIGNE */}
                      <Box sx={{
                        bgcolor: "#f8fafc",
                        p: 2,
                        borderRadius: 2,
                        mb: 2,
                        minHeight: 120,
                        maxHeight: 120,
                        overflow: "hidden"
                      }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "0.75rem",
                            lineHeight: 1.5,
                            color: "#475569",
                            whiteSpace: "pre-wrap", // ✅ Respecte les \n ajoutés
                            wordBreak: "break-all",
                            fontFamily: "monospace", // ✅ Pour mieux voir les coupures
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 5,
                            WebkitBoxOrient: "vertical"
                          }}
                        >
                          {forcedBreakText}
                        </Typography>
                        
                        <Button
                          size="small"
                          startIcon={<Visibility sx={{ fontSize: 14 }} />}
                          onClick={() => handleViewDescription(offre)}
                          sx={{
                            textTransform: "none",
                            color: "#3b82f6",
                            fontWeight: 500,
                            fontSize: "0.7rem",
                            p: 0,
                            mt: 1,
                            minWidth: "auto",
                            "&:hover": {
                              bgcolor: "transparent",
                              textDecoration: "underline"
                            }
                          }}
                        >
                          Voir la description complète
                        </Button>
                      </Box>

                      {/* Date et candidats */}
                      <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="caption" color="#94a3b8">
                          Publié le {new Date(offre.createdAt).toLocaleDateString('fr-FR')}
                        </Typography>
                        
                        <Box sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: candidatsColor.bg,
                          color: candidatsColor.text,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 20,
                          fontSize: "0.75rem",
                          fontWeight: 600
                        }}>
                          {offre.candidatsCount || 0} candidat{(offre.candidatsCount || 0) > 1 ? 's' : ''}
                        </Box>
                      </Stack>

                      {/* Actions */}
                      <Stack direction="row" spacing={2}>
                        <Button
                          fullWidth
                          size="small"
                          variant="contained"
                          onClick={() => navigate(`/pages/edit-offre/${offre._id}`)}
                          sx={{
                            textTransform: "none",
                            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                            borderRadius: 2,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: "linear-gradient(135deg, #1d4ed8, #6d28d9)",
                              transform: "translateY(-2px)"
                            }
                          }}
                        >
                          Modifier
                        </Button>

                        <Button
                          fullWidth
                          size="small"
                          variant="outlined"
                          startIcon={<Delete />}
                          onClick={() => handleDeleteClick(offre)}
                          sx={{
                            textTransform: "none",
                            color: "#475569",
                            borderColor: "#e2e8f0",
                            borderRadius: 2,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              color: "#ef4444",
                              borderColor: "#ef4444",
                              bgcolor: alpha("#ef4444", 0.05)
                            }
                          }}
                        >
                          Supprimer
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(event, value) => setPage(value)}
              shape="rounded"
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: 2,
                  color: "#64748b",
                  transition: "all 0.2s",
                  "&:hover": { bgcolor: alpha("#3b82f6", 0.1) }
                },
                "& .Mui-selected": {
                  background: "linear-gradient(135deg, #2563eb, #7c3aed) !important",
                  color: "#ffffff",
                  "&:hover": {
                    background: "linear-gradient(135deg, #1d4ed8, #6d28d9) !important"
                  }
                }
              }}
            />
          </Box>
        )}

        {/* Dialog de confirmation suppression */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          TransitionComponent={Transition}
          PaperProps={{ sx: { borderRadius: 3, padding: 1 } }}
        >
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, color: "#ef4444" }}>
            <Warning />
            Confirmer la suppression
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: "#475569" }}>
              Êtes-vous sûr de vouloir supprimer l'offre "{offreToDelete?.titre}" ?
              <br />
              Cette action est irréversible et supprimera également toutes les candidatures associées.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button 
              onClick={handleDeleteCancel}
              sx={{ textTransform: "none", color: "#64748b", "&:hover": { bgcolor: alpha("#64748b", 0.1) } }}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleDeleteConfirm}
              variant="contained"
              sx={{ textTransform: "none", bgcolor: "#ef4444", "&:hover": { bgcolor: "#dc2626" } }}
            >
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog pour afficher la description complète */}
        <Dialog
          open={descriptionDialogOpen}
          onClose={handleCloseDescription}
          TransitionComponent={Transition}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
        >
          <DialogTitle sx={{ 
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            color: "#ffffff",
            fontWeight: 700,
            pb: 2
          }}>
            Description complète
          </DialogTitle>
          <DialogContent sx={{ mt: 2, p: 3 }}>
            <Typography variant="subtitle1" sx={{ 
              color: "#2563eb", 
              mb: 2, 
              fontWeight: 600,
              pb: 1,
              borderBottom: "2px solid #e2e8f0"
            }}>
              {selectedOffre?.titre}
            </Typography>
            <Typography variant="body1" sx={{ 
              color: "#334155", 
              lineHeight: 1.8,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word"
            }}>
              {selectedOffre?.description}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: "1px solid #e2e8f0" }}>
            <Button 
              onClick={handleCloseDescription}
              variant="contained"
              sx={{
                textTransform: "none",
                background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                borderRadius: 2,
                px: 3,
                "&:hover": { background: "linear-gradient(135deg, #1d4ed8, #6d28d9)" }
              }}
            >
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </SidebarEntrep>
  );
}

export default MesOffresEntr;