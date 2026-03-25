import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const OffresPage = () => {
  const [offres, setOffres] = useState([]);
  const [filteredOffres, setFilteredOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOffres, setExpandedOffres] = useState({});
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [offresPerPage] = useState(2);
  
  // État pour la recherche
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOffres();
  }, []);

  useEffect(() => {
    // Filtrer les offres quand le terme de recherche change
    if (!searchTerm.trim()) {
      setFilteredOffres(offres);
    } else {
      const searchLower = searchTerm.toLowerCase().trim();
      const filtered = offres.filter(offre => 
        (offre.titre && offre.titre.toLowerCase().includes(searchLower)) ||
        (offre.entreprise?.username && offre.entreprise.username.toLowerCase().includes(searchLower)) ||
        (offre.localisation && offre.localisation.toLowerCase().includes(searchLower))
      );
      setFilteredOffres(filtered);
    }
    setCurrentPage(1); // Revenir à la première page après recherche
  }, [searchTerm, offres]);

  const fetchOffres = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3001/api/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOffres(res.data);
      setFilteredOffres(res.data);
    } catch (err) {
      console.error("Erreur chargement offres", err);
      alert("Erreur chargement offres. Vérifie le backend et ton token.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDescription = (id) => {
    setExpandedOffres(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Pagination
  const indexOfLastOffre = currentPage * offresPerPage;
  const indexOfFirstOffre = indexOfLastOffre - offresPerPage;
  const currentOffres = filteredOffres.slice(indexOfFirstOffre, indexOfLastOffre);
  const totalPages = Math.ceil(filteredOffres.length / offresPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const tableStyle = {
    borderCollapse: "collapse",
    width: "100%",
    marginTop: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  };

  const thStyle = {
    border: "1px solid #ddd",
    padding: "12px",
    backgroundColor: "#f2f2f2",
    textAlign: "left",
    fontWeight: "bold"
  };

  const tdStyle = {
    border: "1px solid #ddd",
    padding: "10px",
    verticalAlign: "top"
  };

  const searchStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    boxSizing: "border-box"
  };

  const paginationStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px",
    flexWrap: "wrap"
  };

  const pageButtonStyle = {
    padding: "8px 12px",
    border: "1px solid #ddd",
    backgroundColor: "white",
    cursor: "pointer",
    borderRadius: "4px"
  };

  const activePageButtonStyle = {
    ...pageButtonStyle,
    backgroundColor: "#007bff",
    color: "white",
    borderColor: "#007bff"
  };

  return (
    <Sidebar>
      <div style={{ padding: "20px" }}>
        <h2 style={{ marginBottom: "20px", color: "#333" }}>Liste des offres</h2>

        {/* Barre de recherche simple */}
        <input
          type="text"
          placeholder="Recherchero ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchStyle}
        />

        {loading ? (
          <p style={{ textAlign: "center", fontSize: "18px" }}>Chargement des offres...</p>
        ) : filteredOffres.length === 0 ? (
          <p style={{ textAlign: "center", fontSize: "18px" }}>
            {searchTerm ? "Aucune offre trouvée" : "Aucune offre disponible"}
          </p>
        ) : (
          <>
            <p style={{ marginBottom: "10px", color: "#666" }}>
              {filteredOffres.length} offre{filteredOffres.length > 1 ? 's' : ''} trouvée{filteredOffres.length > 1 ? 's' : ''}
            </p>

            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Titre</th>
                  <th style={thStyle}>Localisation</th>
                  <th style={{...thStyle, width: "35%"}}>Description</th>
                  <th style={thStyle}>Entreprise</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Date</th>
                </tr>
              </thead>
              <tbody>
                {currentOffres.map((offre) => (
                  <tr key={offre._id}>
                    <td style={tdStyle}>
                      <strong>{offre.titre}</strong>
                    </td>
                    <td style={tdStyle}>{offre.localisation}</td>
                    <td style={tdStyle}>
                      {offre.description ? (
                        <div>
                          <div>
                            {expandedOffres[offre._id] 
                              ? offre.description 
                              : truncateText(offre.description, 120)}
                          </div>
                          {offre.description.length > 120 && (
                            <button
                              onClick={() => toggleDescription(offre._id)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#007bff",
                                cursor: "pointer",
                                padding: "5px 0",
                                textDecoration: "underline",
                                fontSize: "12px"
                              }}
                            >
                              {expandedOffres[offre._id] ? "Voir moins" : "Voir plus"}
                            </button>
                          )}
                        </div>
                      ) : (
                        <em style={{ color: "#999" }}>Aucune description</em>
                      )}
                    </td>
                    <td style={tdStyle}>
                      {offre.entreprise?.username || "—"}
                    </td>
                    <td style={tdStyle}>
                      {offre.entreprise?.email || "—"}
                    </td>
                    <td style={tdStyle}>
                      {offre.createdAt 
                        ? new Date(offre.createdAt).toLocaleDateString('fr-FR')
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={paginationStyle}>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    ...pageButtonStyle,
                    opacity: currentPage === 1 ? 0.5 : 1
                  }}
                >
                  Précédent
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    style={currentPage === number ? activePageButtonStyle : pageButtonStyle}
                  >
                    {number}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    ...pageButtonStyle,
                    opacity: currentPage === totalPages ? 0.5 : 1
                  }}
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Sidebar>
  );
};

export default OffresPage;