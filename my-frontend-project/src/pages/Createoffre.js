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
  Grid,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  alpha,
  Chip,
  Stack,
  Alert,
  Snackbar
} from "@mui/material";

const steps = ["Informations générales", "Compétences & Expérience", "Description détaillée"];

function CreateOffre() {
  const [open, setOpen] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [form, setForm] = useState({
    titre: "",
    localisation: "",
    description: "",
    competences: "",
    experience: "",
    niveau: ""
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/pages/MesOffresEntr");
  };

  const validateStep = () => {
    const newErrors = {};

    if (activeStep === 0) {
      if (!form.titre.trim()) newErrors.titre = "Le titre est requis";
      if (!form.localisation.trim()) newErrors.localisation = "La localisation est requise";
    } else if (activeStep === 1) {
      if (form.experience && (form.experience < 0 || form.experience > 50)) {
        newErrors.experience = "L'expérience doit être entre 0 et 50 ans";
      }
    } else if (activeStep === 2) {
      if (!form.description.trim()) newErrors.description = "La description est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      const data = {
        titre: form.titre,
        localisation: form.localisation,
        description: form.description,
        competences: form.competences
          ? form.competences
              .split(",")
              .map((s) => s.trim().toLowerCase())
              .filter((s) => s !== "")
          : [],
        experience: Number(form.experience || 0),
        niveau: form.niveau?.toLowerCase() || ""
      };

      await axios.post("http://localhost:3001/api/offres", data, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });

      setSnackbar({
        open: true,
        message: "Offre créée avec succès !",
        severity: "success"
      });

      setTimeout(() => {
        navigate("/pages/MesOffresEntr");
      }, 1500);

    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Erreur lors de la création de l'offre",
        severity: "error"
      });
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Titre du poste"
                name="titre"
                value={form.titre}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.titre}
                helperText={errors.titre}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    transition: "all 0.2s",
                    "&:hover fieldset": {
                      borderColor: "#3b82f6"
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3b82f6",
                      borderWidth: 2
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Localisation"
                name="localisation"
                value={form.localisation}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.localisation}
                helperText={errors.localisation}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    transition: "all 0.2s",
                    "&:hover fieldset": {
                      borderColor: "#3b82f6"
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3b82f6",
                      borderWidth: 2
                    }
                  }
                }}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Compétences requises"
                name="competences"
                value={form.competences}
                onChange={handleChange}
                fullWidth
                placeholder="React, Node.js, MongoDB, ..."
                helperText="Séparez les compétences par des virgules"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    transition: "all 0.2s",
                    "&:hover fieldset": {
                      borderColor: "#3b82f6"
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3b82f6",
                      borderWidth: 2
                    }
                  }
                }}
              />
              {form.competences && (
                <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}>
                  {form.competences.split(",").map((skill, index) => 
                    skill.trim() && (
                      <Chip
                        key={index}
                        label={skill.trim()}
                        size="small"
                        sx={{
                          bgcolor: "#f1f5f9",
                          color: "#475569",
                          "&:hover": { bgcolor: "#e2e8f0" }
                        }}
                      />
                    )
                  )}
                </Stack>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Expérience requise (années)"
                name="experience"
                type="number"
                value={form.experience}
                onChange={handleChange}
                fullWidth
                error={!!errors.experience}
                helperText={errors.experience}
                InputProps={{
                  inputProps: { min: 0, max: 50 }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    transition: "all 0.2s",
                    "&:hover fieldset": {
                      borderColor: "#3b82f6"
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3b82f6",
                      borderWidth: 2
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Niveau d'étude requis"
                name="niveau"
                value={form.niveau}
                onChange={handleChange}
                fullWidth
                placeholder="Bac+5, Master, Licence, ..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    transition: "all 0.2s",
                    "&:hover fieldset": {
                      borderColor: "#3b82f6"
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3b82f6",
                      borderWidth: 2
                    }
                  }
                }}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Description du poste"
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={8}
                required
                error={!!errors.description}
                helperText={errors.description || "Décrivez les missions, responsabilités et avantages du poste"}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    transition: "all 0.2s",
                    "&:hover fieldset": {
                      borderColor: "#3b82f6"
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3b82f6",
                      borderWidth: 2
                    }
                  }
                }}
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <SidebarEntrep>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            maxHeight: "90vh"
          }
        }}
      >
        {/* Header avec gradient */}
        <Box sx={{ 
          background: "linear-gradient(135deg, #2563eb, #7c3aed)",
          p: 2,
          position: "relative"
        }}>
          <Button
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "#ffffff",
              minWidth: "auto",
              textTransform: "none",
              "&:hover": {
                bgcolor: alpha("#ffffff", 0.1)
              }
            }}
          >
            Fermer
          </Button>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              color: "#ffffff",
              textAlign: "center"
            }}
          >
            Créer une nouvelle offre
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: alpha("#ffffff", 0.9),
              textAlign: "center",
              mt: 0.5
            }}
          >
            Remplissez les informations ci-dessous
          </Typography>
        </Box>

        {/* Stepper */}
        <Box sx={{ px: 3, pt: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      "&.Mui-active": {
                        color: "#3b82f6"
                      },
                      "&.Mui-completed": {
                        color: "#10b981"
                      }
                    }
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <DialogContent sx={{ p: 3 }}>
          <Box component="form" sx={{ mt: 2 }}>
            {getStepContent(activeStep)}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0, justifyContent: "space-between" }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{
              textTransform: "none",
              color: "#64748b",
              borderRadius: 2,
              "&:hover": {
                bgcolor: alpha("#64748b", 0.1)
              }
            }}
          >
            Retour
          </Button>
          
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  textTransform: "none",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  borderRadius: 2,
                  px: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "linear-gradient(135deg, #059669, #047857)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
                  }
                }}
              >
                Publier l'offre
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
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
                Suivant
              </Button>
            )}
          </Box>
        </DialogActions>

        {/* Aperçu rapide des informations */}
        {(form.titre || form.localisation || form.competences) && activeStep < 2 && (
          <Paper
            elevation={0}
            sx={{
              m: 2,
              mt: 0,
              p: 2,
              bgcolor: "#f8fafc",
              borderRadius: 2,
              border: "1px solid #e2e8f0"
            }}
          >
            <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
              Aperçu :
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}>
              {form.titre && <Chip label={form.titre} size="small" />}
              {form.localisation && <Chip label={form.localisation} size="small" />}
              {form.competences && <Chip label={`${form.competences.split(",").length} compétences`} size="small" />}
            </Stack>
          </Paper>
        )}
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ 
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SidebarEntrep>
  );
}

export default CreateOffre;