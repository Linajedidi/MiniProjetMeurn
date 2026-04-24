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
  Paper,
  Pagination,
  Button,
  Skeleton,
  Avatar,
  Chip,
  Tooltip,
  alpha
} from "@mui/material";

import {
  Users,
  Briefcase,
  TrendingUp,
  Download,
  Calendar,
  Mail
} from "lucide-react";

const EntrepriseHome = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("name") || "Entreprise";

  const [candidatures, setCandidatures] = useState([]);
  const [totalOffres, setTotalOffres] = useState(0);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const candidaturesParPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const [candidaturesRes, offresRes] = await Promise.all([
          axios.get("http://localhost:3001/api/candidatures/mes-candidatures", {
            headers: { Authorization: "Bearer " + localStorage.getItem("token") }
          }),
          axios.get("http://localhost:3001/api/offres/mes-offres", {
            headers: { Authorization: "Bearer " + localStorage.getItem("token") }
          })
        ]);
        
        setCandidatures(candidaturesRes.data);
        setTotalOffres(offresRes.data.length);
      } catch (err) {
        console.error("Erreur chargement données:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const indexOfLast = page * candidaturesParPage;
  const indexOfFirst = indexOfLast - candidaturesParPage;
  const candidaturesActuelles = candidatures.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(candidatures.length / candidaturesParPage);

  const moyenneScore = candidatures.length > 0
    ? Math.round(candidatures.reduce((acc, c) => acc + (c.score || 0), 0) / candidatures.length)
    : 0;

  const statsCards = [
    {
      title: "Candidatures",
      value: candidatures.length,
      icon: Users,
      subtitle: "candidatures reçues",
      iconColor: "#3b82f6"
    },
    {
      title: "Offres actives",
      value: totalOffres,
      icon: Briefcase,
      subtitle: "offres publiées",
      iconColor: "#8b5cf6"
    },
    {
      title: "Score moyen",
      value: `${moyenneScore}%`,
      icon: TrendingUp,
      subtitle: "des candidats",
      iconColor: "#10b981"
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 70) return { bg: "#10b981", gradient: "linear-gradient(135deg, #059669, #10b981)" };
    if (score >= 50) return { bg: "#f59e0b", gradient: "linear-gradient(135deg, #d97706, #f59e0b)" };
    return { bg: "#ef4444", gradient: "linear-gradient(135deg, #dc2626, #ef4444)" };
  };

  const getInitials = (name) => {
    if (!name) return "C";
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return "Date inconnue";
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <SidebarEntrep>
      <Box sx={{ p: 4 }}>
        {/* Header - Bienvenue entreprise uniquement */}
        <Box sx={{ mb: 5 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1
            }}
          >
            Bienvenue, {username}
          </Typography>
        </Box>

        {/* Stats Cards - Background blanc, couleurs sur les icônes uniquement */}
        <Grid 
          container 
          spacing={3} 
          sx={{ 
            mb: 5,
            display: "flex",
            justifyContent: "center"
          }}
        >
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ 
                  borderRadius: 3,
                  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
                  border: "1px solid #e5e7eb",
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
                    borderColor: "#d1d5db",
                    transform: "translateY(-2px)"
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: "#6b7280",
                            fontWeight: 600,
                            mb: 1,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            fontSize: "0.75rem"
                          }}
                        >
                          {stat.title}
                        </Typography>
                        {loading ? (
                          <Skeleton width={100} height={48} />
                        ) : (
                          <Typography 
                            variant="h3" 
                            sx={{ 
                              fontWeight: 700,
                              color: "#111827",
                              fontSize: "2.5rem",
                              lineHeight: 1.2,
                              mb: 0.5
                            }}
                          >
                            {stat.value}
                          </Typography>
                        )}
                        <Typography 
                          variant="caption" 
                          sx={{ color: "#9ca3af" }}
                        >
                          {stat.subtitle}
                        </Typography>
                      </Box>
                      <Box sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "#f3f4f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <Icon size={20} color={stat.iconColor} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Tableau des candidatures - sans titre */}
        <TableContainer 
          component={Paper} 
          sx={{ 
            borderRadius: 3,
            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
            border: "1px solid #e5e7eb",
            overflow: "hidden"
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: "#f9fafb" }}>
              <TableRow>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  color: "#4b5563",
                  borderBottom: "1px solid #e5e7eb",
                  fontSize: "0.875rem"
                }}>
                  Candidat
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  color: "#4b5563",
                  borderBottom: "1px solid #e5e7eb",
                  fontSize: "0.875rem"
                }}>
                  Poste
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  color: "#4b5563",
                  borderBottom: "1px solid #e5e7eb",
                  fontSize: "0.875rem"
                }}>
                  Score
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  color: "#4b5563",
                  borderBottom: "1px solid #e5e7eb",
                  fontSize: "0.875rem"
                }}>
                  Date
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600, 
                  color: "#4b5563",
                  borderBottom: "1px solid #e5e7eb",
                  fontSize: "0.875rem"
                }}>
                  CV
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                [...Array(6)].map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Skeleton variant="circular" width={40} height={40} /></TableCell>
                    <TableCell><Skeleton variant="text" width={160} height={32} /></TableCell>
                    <TableCell><Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} /></TableCell>
                    <TableCell><Skeleton variant="text" width={100} height={32} /></TableCell>
                    <TableCell><Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 1 }} /></TableCell>
                  </TableRow>
                ))
              ) : candidatures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Box sx={{ textAlign: "center" }}>
                      <Users size={48} strokeWidth={1.5} color="#d1d5db" />
                      <Typography sx={{ mt: 2, color: "#6b7280", mb: 2, fontWeight: 500 }}>
                        Aucune candidature pour le moment
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => navigate("/pages/MesOffresEntr")}
                        sx={{
                          textTransform: "none",
                          background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                          borderRadius: 2,
                          "&:hover": { 
                            background: "linear-gradient(135deg, #1d4ed8, #6d28d9)",
                            transform: "translateY(-2px)"
                          }
                        }}
                      >
                        Publier une offre
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                candidaturesActuelles.map((c) => {
                  const score = c.score || 0;
                  const scoreColor = getScoreColor(score);
                  
                  return (
                    <TableRow 
                      key={c._id}
                      sx={{
                        "&:hover": {
                          bgcolor: "#f9fafb",
                          transition: "background-color 0.2s"
                        }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar 
                            sx={{ 
                              width: 40, 
                              height: 40,
                              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                              fontSize: "1rem",
                              fontWeight: 600
                            }}
                          >
                            {getInitials(c.candidat?.username)}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600} color="#111827" fontSize="0.875rem">
                              {c.candidat?.username || "Candidat"}
                            </Typography>
                            <Typography variant="caption" color="#6b7280" sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                              <Mail size={12} />
                              {c.candidat?.email || "Email non disponible"}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Box>
                          <Typography fontWeight={500} color="#111827" fontSize="0.875rem">
                            {c.offre?.titre || "Poste non spécifié"}
                          </Typography>
                          {c.offre?.entreprise && (
                            <Typography variant="caption" color="#6b7280" sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                              <Briefcase size={12} />
                              {c.offre.entreprise}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Tooltip title={`Score de correspondance: ${score}%`}>
                          <Chip
                            label={`${score}%`}
                            size="small"
                            sx={{
                              background: scoreColor.gradient,
                              color: "#ffffff",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              borderRadius: 2
                            }}
                          />
                        </Tooltip>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2" color="#6b7280" fontSize="0.75rem" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Calendar size={14} />
                          {formatDate(c.createdAt)}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Tooltip title="Télécharger le CV">
                          <Button
                            size="small"
                            startIcon={<Download size={14} />}
                            onClick={() => window.open(`http://localhost:3001/${c.cv}`, "_blank")}
                            sx={{
                              textTransform: "none",
                              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                              color: "#ffffff",
                              borderRadius: 2,
                              fontSize: "0.75rem",
                              "&:hover": {
                                background: "linear-gradient(135deg, #1d4ed8, #6d28d9)",
                                transform: "translateY(-1px)"
                              }
                            }}
                          >
                            Télécharger
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && !loading && candidatures.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              shape="rounded"
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: 2,
                  color: "#6b7280"
                },
                "& .Mui-selected": {
                  background: "linear-gradient(135deg, #2563eb, #7c3aed) !important",
                  color: "#ffffff"
                }
              }}
            />
          </Box>
        )}
      </Box>
    </SidebarEntrep>
  );
};

export default EntrepriseHome; 