import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarEntrep from "../components/SidebarEntrep";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Button,
  Chip,
  CircularProgress,
  Fade,
  Grow
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  FaUsers,
  FaFileAlt,
  FaChartLine,
  FaEnvelope,
  FaUserCheck
} from "react-icons/fa";

const CandidaturesPage = () => {
  const [groupedData, setGroupedData] = useState({});
  const [pages, setPages] = useState({});
  const [loading, setLoading] = useState(true);
  const [pageOffres, setPageOffres] = useState(1);
  const offresParPage = 4;
  const candidaturesParPage = 5;

  useEffect(() => {
    fetchCandidatures();
  }, []);

  const fetchCandidatures = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3001/api/candidatures/mes-candidatures", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      });

      const grouped = res.data.reduce((acc, item) => {
        const titre = item.offre?.titre || "Offre inconnue";
        if (!acc[titre]) {
          acc[titre] = [];
        }
        acc[titre].push(item);
        return acc;
      }, {});

      setGroupedData(grouped);

      const initialPages = {};
      Object.keys(grouped).forEach(titre => {
        initialPages[titre] = 1;
      });
      setPages(initialPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (offreTitre, value) => {
    setPages(prev => ({
      ...prev,
      [offreTitre]: value
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const offresTitres = Object.keys(groupedData);
  const indexLastOffre = pageOffres * offresParPage;
  const indexFirstOffre = indexLastOffre - offresParPage;
  const offresActuelles = offresTitres.slice(indexFirstOffre, indexLastOffre);
  const totalPagesOffres = Math.ceil(offresTitres.length / offresParPage);

  if (loading) {
    return (
      <SidebarEntrep>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '60vh'
        }}>
          <CircularProgress 
            size={48}
            sx={{
              color: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              mb: 2
            }}
          />
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Chargement des candidatures...
          </Typography>
        </Box>
      </SidebarEntrep>
    );
  }

  return (
    <SidebarEntrep>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        .candidatures-container {
          font-family: 'Inter', sans-serif;
        }
        
        .stats-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }
        
        .stats-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px -5px rgba(0,0,0,0.08);
        }
        
        .accordion-custom {
          background: white !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 16px !important;
          margin-bottom: 16px !important;
          box-shadow: none !important;
          transition: all 0.3s ease !important;
        }
        
        .accordion-custom:hover {
          border-color: #cbd5e1 !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
        }
        
        .accordion-custom.Mui-expanded {
          margin-bottom: 16px !important;
        }
        
        .MuiAccordionSummary-root {
          border-radius: 16px !important;
          padding: 0 20px !important;
        }
        
        .MuiAccordionSummary-content {
          padding: 16px 0 !important;
        }
        
        .MuiAccordionDetails-root {
          padding: 20px !important;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
          border-radius: 0 0 16px 16px;
        }
        
        .table-custom {
          border-radius: 12px !important;
          overflow: hidden !important;
        }
        
        .MuiTableHead-root .MuiTableCell-root {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          font-weight: 600;
          color: #1e293b;
          border-bottom: 2px solid #e2e8f0;
          font-size: 13px;
        }
        
        .MuiTableCell-root {
          padding: 14px 16px !important;
          font-size: 13px;
          color: #334155;
        }
        
        .MuiTableRow-root:hover {
          background: #f8fafc;
        }
        
        .btn-view-cv {
          background: linear-gradient(135deg, #2563eb, #7c3aed) !important;
          border-radius: 10px !important;
          padding: 6px 14px !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          text-transform: none !important;
          box-shadow: 0 2px 4px rgba(37,99,235,0.2) !important;
          transition: all 0.2s ease !important;
        }
        
        .btn-view-cv:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(37,99,235,0.3) !important;
        }
        
        .score-chip {
          font-weight: 700;
          font-size: 13px;
          padding: 4px 10px;
          border-radius: 20px;
          display: inline-block;
        }
        
        .pagination-custom .MuiPaginationItem-root {
          border-radius: 10px;
          font-weight: 500;
        }
        
        .pagination-custom .Mui-selected {
          background: linear-gradient(135deg, #2563eb, #7c3aed) !important;
          color: white !important;
        }
      `}</style>

      <Box className="candidatures-container">
        {/* Header avec gradient */}
        <Box sx={{ mb: 4 }}>
        {/*  <Typography variant="h4" sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 1,
            fontFamily: "'Inter', sans-serif"
          }}>
            Gestion des Candidatures
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', fontFamily: "'Inter', sans-serif" }}>
            Consultez et gérez les candidatures reçues pour vos offres
          </Typography>*/}
        </Box>

       

         

         

        {/* Liste des offres avec candidatures */}
        {offresActuelles.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            background: 'white',
            borderRadius: '16px',
            border: '1px solid #e2e8f0'
          }}>
            <FaFileAlt size={48} style={{ color: '#cbd5e1', marginBottom: 16 }} />
            <Typography variant="h6" sx={{ color: '#475569', mb: 1 }}>
              Aucune candidature
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Vous n'avez pas encore reçu de candidatures pour vos offres
            </Typography>
          </Box>
        ) : (
          <Grow in={true}>
            <Box>
              {offresActuelles.map((offreTitre, index) => {
                const currentPage = pages[offreTitre] || 1;
                const indexOfLast = currentPage * candidaturesParPage;
                const indexOfFirst = indexOfLast - candidaturesParPage;
                const candidaturesActuelles = groupedData[offreTitre].slice(indexOfFirst, indexOfLast);
                const totalPages = Math.ceil(groupedData[offreTitre].length / candidaturesParPage);

                return (
                  <Fade in={true} key={index} timeout={index * 100}>
                    <Accordion className="accordion-custom" defaultExpanded={index === 0}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#64748b' }} />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                            {offreTitre}
                          </Typography>
                          <Chip
                            label={`${groupedData[offreTitre].length} candidat${groupedData[offreTitre].length > 1 ? 's' : ''}`}
                            size="small"
                            sx={{
                              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                              color: 'white',
                              fontWeight: 600,
                              borderRadius: '12px'
                            }}
                          />
                        </Box>
                      </AccordionSummary>

                      <AccordionDetails>
                        <TableContainer component={Paper} className="table-custom" elevation={0}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell> Candidat</TableCell>
                                <TableCell> Email</TableCell>
                                <TableCell>CV</TableCell>
                                <TableCell>Score de correspondance</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {candidaturesActuelles.map((c, idx) => (
                                <TableRow key={c._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Box sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: 14,
                                        fontWeight: 600
                                      }}>
                                        {c.candidat?.username?.charAt(0).toUpperCase() || '?'}
                                      </Box>
                                      <Typography sx={{ fontWeight: 500 }}>
                                        {c.candidat?.username || 'N/A'}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <FaEnvelope size={12} style={{ color: '#94a3b8' }} />
                                      <Typography>{c.candidat?.email || 'N/A'}</Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      className="btn-view-cv"
                                      onClick={() => window.open(`http://localhost:3001/${c.cv}`, "_blank")}
                                      startIcon={<FaFileAlt size={12} />}
                                    >
                                      Voir CV
                                    </Button>
                                  </TableCell>
                                  <TableCell>
                                    <Box className="score-chip" sx={{
                                      background: `${getScoreColor(c.score)}15`,
                                      color: getScoreColor(c.score),
                                      border: `1px solid ${getScoreColor(c.score)}30`
                                    }}>
                                      {c.score || 0}%
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>

                        {totalPages > 1 && (
                          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                            <Pagination
                              count={totalPages}
                              page={currentPage}
                              onChange={(e, value) => handlePageChange(offreTitre, value)}
                              color="primary"
                              className="pagination-custom"
                              shape="rounded"
                            />
                          </Box>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </Fade>
                );
              })}
            </Box>
          </Grow>
        )}

        {/* Pagination globale offres */}
        {totalPagesOffres > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPagesOffres}
              page={pageOffres}
              onChange={(e, value) => setPageOffres(value)}
              color="primary"
              className="pagination-custom"
              shape="rounded"
              size="large"
            />
          </Box>
        )}
      </Box>
    </SidebarEntrep>
  );
};

export default CandidaturesPage;