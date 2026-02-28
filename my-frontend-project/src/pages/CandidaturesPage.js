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
  Paper
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CandidaturesPage = () => {
  const [groupedData, setGroupedData] = useState({});

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
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <SidebarEntrep>
      <Box>
        <Typography variant="h5" gutterBottom>
          Candidats
        </Typography>

        {Object.keys(groupedData).length === 0 ? (
          <Typography>Aucune candidature</Typography>
        ) : (
          Object.keys(groupedData).map((offreTitre, index) => (
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
                      {groupedData[offreTitre].map(c => (
                        <TableRow key={c._id}>
                          <TableCell>{c.candidat?.username}</TableCell>
                          <TableCell>{c.candidat?.email}</TableCell>
                          <TableCell>{c.cv}</TableCell>
                          <TableCell>{c.score}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Box>
    </SidebarEntrep>
  );
};

export default CandidaturesPage;