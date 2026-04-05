import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { FaSearch, FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaEnvelope, FaEye, FaEyeSlash, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const OffresPage = () => {
  const [offres, setOffres] = useState([]);
  const [filteredOffres, setFilteredOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOffres, setExpandedOffres] = useState({});
  
  const [currentPage, setCurrentPage] = useState(1);
  const [offresPerPage] = useState(5);
  
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOffres();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOffres(offres);
    } else {
      const searchLower = searchTerm.toLowerCase().trim();
      const filtered = offres.filter(offre => 
        (offre.titre && offre.titre.toLowerCase().includes(searchLower)) ||
        (offre.entreprise?.username && offre.entreprise.username.toLowerCase().includes(searchLower)) ||
        (offre.localisation && offre.localisation.toLowerCase().includes(searchLower)) ||
        (offre.domaine && offre.domaine.toLowerCase().includes(searchLower))
      );
      setFilteredOffres(filtered);
    }
    setCurrentPage(1);
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

  const indexOfLastOffre = currentPage * offresPerPage;
  const indexOfFirstOffre = indexOfLastOffre - offresPerPage;
  const currentOffres = filteredOffres.slice(indexOfFirstOffre, indexOfLastOffre);
  const totalPages = Math.ceil(filteredOffres.length / offresPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getTypeColor = (type) => {
    const colors = {
      'CDI': { bg: '#dcfce7', color: '#166534' },
      'CDD': { bg: '#fff7ed', color: '#9a3412' },
      'Stage': { bg: '#eff6ff', color: '#1e40af' },
      'Freelance': { bg: '#faf5ff', color: '#6b21a8' }
    };
    return colors[type] || { bg: '#f1f5f9', color: '#475569' };
  };

  return (
    <Sidebar>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        .offres-container {
          font-family: 'Inter', sans-serif;
        }
        
        .search-wrapper {
          position: relative;
          margin-bottom: 28px;
        }
        
        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 18px;
        }
        
        .search-input {
          width: 100%;
          padding: 12px 16px 12px 48px;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s ease;
          background: white;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        
        .search-input::placeholder {
          color: #94a3b8;
        }
        
        .stats-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: linear-gradient(135deg, #eff6ff, #faf5ff);
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          color: #4b5563;
          margin-bottom: 20px;
        }
        
        .offres-table {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
        }
        
        .offres-table thead {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
        }
        
        .offres-table th {
          padding: 16px 20px;
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .offres-table td {
          padding: 20px;
          font-size: 14px;
          color: #334155;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: top;
        }
        
        .offres-table tr {
          transition: all 0.2s ease;
        }
        
        .offres-table tr:hover {
          background: #f8fafc;
        }
        
        .entreprise-badge {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .entreprise-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          color: #4338ca;
        }
        
        .offre-titre {
          font-weight: 700;
          font-size: 16px;
          color: #0f172a;
          margin-bottom: 6px;
        }
        
        .offre-type {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        
        .info-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #64748b;
          margin-bottom: 4px;
        }
        
        .description-text {
          line-height: 1.6;
          color: #475569;
        }
        
        .btn-toggle {
          background: none;
          border: none;
          color: #3b82f6;
          cursor: pointer;
          padding: 6px 0;
          font-size: 12px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s ease;
        }
        
        .btn-toggle:hover {
          color: #2563eb;
          gap: 8px;
        }
        
        .pagination-wrapper {
          display: flex;
          justify-content: center;
          margin-top: 32px;
        }
        
        .pagination {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .page-btn {
          padding: 8px 14px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .page-btn:hover:not(:disabled) {
          border-color: #3b82f6;
          color: #3b82f6;
          transform: translateY(-1px);
        }
        
        .page-btn.active {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          border-color: transparent;
          color: white;
        }
        
        .page-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
        }
        
        .loader {
          width: 48px;
          height: 48px;
          border: 3px solid #e2e8f0;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .table-row {
          animation: fadeInUp 0.4s ease forwards;
        }
        
        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }
        
        .empty-icon {
          font-size: 64px;
          color: #cbd5e1;
          margin-bottom: 16px;
        }
        
        .empty-title {
          font-size: 18px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 8px;
        }
        
        .empty-subtitle {
          font-size: 14px;
          color: #94a3b8;
        }
      `}</style>

      <div className="offres-container">
        {/* Header */}
        {/*
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ 
            fontSize: 24, 
            fontWeight: 700, 
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 8
          }}>
            Gestion des Offres
          </h2>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
            Consultez et gérez toutes les offres d'emploi publiées sur la plateforme
          </p>
        </div>*/}

        {/* Search Bar */}
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>


        {loading ? (
          <div className="loading-container">
            <div className="loader" />
            <p style={{ marginTop: 16, color: '#64748b' }}>Chargement des offres...</p>
          </div>
        ) : filteredOffres.length === 0 ? (
          <div className="empty-state">
            <div className="empty-title">
              {searchTerm ? "Aucune offre trouvée" : "Aucune offre disponible"}
            </div>
            <div className="empty-subtitle">
              {searchTerm ? "Essayez d'autres mots-clés" : "Les offres apparaîtront ici lorsqu'elles seront publiées"}
            </div>
          </div>
        ) : (
          <>
            <div className="offres-table">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                  <th style={{ width: '15%' }}>Entreprise</th>
                    <th style={{ width: '25%' }}>Offre</th>
                    <th style={{ width: '15%' }}>Localisation</th>
                    <th style={{ width: '30%' }}>Description</th>
                    <th style={{ width: '15%' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  
                  {currentOffres.map((offre, index) => {
                    const typeColor = getTypeColor(offre.type);
                    return (
                      <tr key={offre._id} className="table-row" style={{ animationDelay: `${index * 0.05}s` }}>
                         <td>
                          <div className="entreprise-badge">
                            <div className="entreprise-avatar">
                              {(offre.entreprise?.username || "E").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: '#0f172a' }}>
                                {offre.entreprise?.username || "—"}
                              </div>
                              {offre.entreprise?.email && (
                                <div className="info-row" style={{ marginTop: 4 }}>
                                  <FaEnvelope size={10} />
                                  <span style={{ fontSize: 11 }}>{offre.entreprise.email}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="offre-titre">{offre.titre || "Titre non défini"}</div>
                          {offre.type && (
                            <span className="offre-type" style={typeColor}>
                              {offre.type}
                            </span>
                          )}
                          {offre.domaine && (
                            <div className="info-row" style={{ marginTop: 8 }}>
                              <span>{offre.domaine}</span>
                            </div>
                          )}
                          {offre.salaire && (
                            <div className="info-row">
                              <span>{offre.salaire}</span>
                            </div>
                          )}
                        </td>
                        
                        <td>
                          <div className="info-row">
                            <FaMapMarkerAlt size={12} />
                            <span>{offre.localisation || "Non spécifiée"}</span>
                          </div>
                        </td>
                        <td>
                          {offre.description ? (
                            <div>
                              <div className="description-text">
                                {expandedOffres[offre._id] 
                                  ? offre.description 
                                  : truncateText(offre.description, 120)}
                              </div>
                              {offre.description.length > 120 && (
                                <button
                                  className="btn-toggle"
                                  onClick={() => toggleDescription(offre._id)}
                                >
                                  {expandedOffres[offre._id] ? (
                                    <>Voir moins <FaEyeSlash size={12} /></>
                                  ) : (
                                    <>Voir plus <FaEye size={12} /></>
                                  )}
                                </button>
                              )}
                            </div>
                          ) : (
                            <em style={{ color: '#94a3b8', fontSize: 13 }}>Aucune description</em>
                          )}
                        </td>
                       
                        <td>
                          <div className="info-row">
                            <FaCalendarAlt size={12} />
                            <span>
                              {offre.createdAt 
                                ? new Date(offre.createdAt).toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  })
                                : "—"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-wrapper">
                <div className="pagination">
                  <button
                    className="page-btn"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <FaChevronLeft size={12} /> Précédent
                  </button>
                  
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 7) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 4) {
                      pageNumber = i + 1;
                      if (i === 6) pageNumber = '...';
                    } else if (currentPage >= totalPages - 3) {
                      pageNumber = totalPages - 6 + i;
                      if (i === 0) pageNumber = '...';
                    } else {
                      pageNumber = currentPage - 3 + i;
                      if (i === 0) pageNumber = '...';
                      if (i === 6) pageNumber = '...';
                    }
                    
                    if (pageNumber === '...') {
                      return (
                        <span key={i} className="page-btn" style={{ cursor: 'default', border: 'none' }}>
                          ...
                        </span>
                      );
                    }
                    
                    return (
                      <button
                        key={i}
                        className={`page-btn ${currentPage === pageNumber ? 'active' : ''}`}
                        onClick={() => paginate(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button
                    className="page-btn"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Suivant <FaChevronRight size={12} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Sidebar>
  );
};

export default OffresPage;