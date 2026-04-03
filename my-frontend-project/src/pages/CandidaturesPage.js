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
  Button
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CandidaturesPage = () => {
  const [groupedData, setGroupedData] = useState({});
  const [pages, setPages] = useState({}); // pagination candidats par offre

  //  Pagination offres (globale)
  const [pageOffres, setPageOffres] = useState(1);
  const offresParPage = 4;

  const candidaturesParPage = 5;

  useEffect(() => {
    axios.get("http://localhost:3001/api/candidatures/mes-candidatures", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
      .then(res => {
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
      })
      .catch(err => console.error(err));
  }, []);

  const handlePageChange = (offreTitre, value) => {
    setPages(prev => ({
      ...prev,
      [offreTitre]: value
    }));
  };

  const offresTitres = Object.keys(groupedData);

  //  Pagination globale des offres
  const indexLastOffre = pageOffres * offresParPage;
  const indexFirstOffre = indexLastOffre - offresParPage;
  const offresActuelles = offresTitres.slice(indexFirstOffre, indexLastOffre);
  const totalPagesOffres = Math.ceil(offresTitres.length / offresParPage);

  return (
    <SidebarEntrep>
      <Box>
        <Typography variant="h5" gutterBottom>
          Candidats
        </Typography>

        {offresActuelles.length === 0 ? (
          <Typography>Aucune candidature</Typography>
        ) : (
          offresActuelles.map((offreTitre, index) => {

            const currentPage = pages[offreTitre] || 1;
            const indexOfLast = currentPage * candidaturesParPage;
            const indexOfFirst = indexOfLast - candidaturesParPage;

            const candidaturesActuelles =
              groupedData[offreTitre].slice(indexOfFirst, indexOfLast);

            const totalPages = Math.ceil(
              groupedData[offreTitre].length / candidaturesParPage
            );

            return (
              <Accordion key={index} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">
                    Candidats pour le poste {offreTitre}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Nom</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>CV</TableCell>
                          <TableCell>Score</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {candidaturesActuelles.map(c => (
                          <TableRow key={c._id}>
                            <TableCell>{c.candidat?.username}</TableCell>
                            <TableCell>{c.candidat?.email}</TableCell>
                                <TableCell>
                      <Button variant="contained" size="small" onClick={() =>window.open(`http://localhost:3001/${c.cv}`, "_blank")}>📄 Voir CV</Button>
                    </TableCell>
                            <TableCell>{c.score}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Pagination candidats */}
                  {totalPages > 1 && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(e, value) =>
                          handlePageChange(offreTitre, value)
                        }
                        color="primary"
                      />
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })
        )}

        {/*  Pagination globale offres */}
        {totalPagesOffres > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPagesOffres}
              page={pageOffres}
              onChange={(e, value) => setPageOffres(value)}
              color="primary"
            />
          </Box>
        )}

      </Box>
    </SidebarEntrep>
  );
};

export default CandidaturesPage;