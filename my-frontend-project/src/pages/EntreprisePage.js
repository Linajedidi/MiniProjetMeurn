import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { FaSearch, FaBuilding, FaEnvelope, FaMapMarkerAlt, FaIndustry, FaPhone,FaCheckCircle, FaHourglassHalf, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const EntreprisePage = () => {
  const [entreprises, setEntreprises] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntreprises();
  }, []);

  const fetchEntreprises = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3001/api/admin/entreprises");
      setEntreprises(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des entreprises :", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntreprises = entreprises.filter(
    (e) =>
      (e.nomEntreprise?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (e.email?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (e.secteur?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (e.adresse?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (e.username?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentEntreprises = filteredEntreprises.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredEntreprises.length / itemsPerPage);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'ACCEPTE':
        return { bg: '#dcfce7', color: '#166534', icon: <FaCheckCircle size={12} />, label: 'Accepté' };
      case 'EN_ATTENTE':
        return { bg: '#fef3c7', color: '#92400e', icon: <FaHourglassHalf size={12} />, label: 'En attente' };
      default:
        return { bg: '#f1f5f9', color: '#475569', icon: null, label: status || 'Inconnu' };
    }
  };

  return (
    <Sidebar>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        .entreprise-container {
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
        
        .entreprise-table {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
        }
        
        .entreprise-table thead {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
        }
        
        .entreprise-table th {
          padding: 16px 20px;
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .entreprise-table td {
          padding: 20px;
          font-size: 14px;
          color: #334155;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }
        
        .entreprise-table tr {
          transition: all 0.2s ease;
        }
        
        .entreprise-table tr:hover {
          background: #f8fafc;
        }
        
        .entreprise-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .entreprise-avatar {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 18px;
          color: #4338ca;
          flex-shrink: 0;
        }
        
        .entreprise-nom {
          font-weight: 700;
          font-size: 16px;
          color: #0f172a;
          margin-bottom: 4px;
        }
        
        .info-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #64748b;
          margin-top: 4px;
        }
        
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
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
      `}</style>

      <div className="entreprise-container">
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
            Gestion des Entreprises
          </h2>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
            Consultez et gérez toutes les entreprises inscrites sur la plateforme
          </p>
        </div>*/}

        {/* Search Bar */}
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        {loading ? (
          <div className="loading-container">
            <div className="loader" />
            <p style={{ marginTop: 16, color: '#64748b' }}>Chargement des entreprises...</p>
          </div>
        ) : filteredEntreprises.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏢</div>
            <div className="empty-title">
              {search ? "Aucune entreprise trouvée" : "Aucune entreprise disponible"}
            </div>
            <div className="empty-subtitle">
              {search ? "Essayez d'autres mots-clés" : "Les entreprises apparaîtront ici lorsqu'elles s'inscriront"}
            </div>
          </div>
        ) : (
          <>
            <div className="entreprise-table">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ width: '30%' }}>Entreprise</th>
                    <th style={{ width: '25%' }}>Contact</th>
                    <th style={{ width: '20%' }}>Secteur</th>
                    <th style={{ width: '15%' }}>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEntreprises.map((entreprise, index) => {
                    const statusStyle = getStatusStyle(entreprise.status);
                    return (
                      <tr key={entreprise._id} className="table-row" style={{ animationDelay: `${index * 0.05}s` }}>
                        <td>
                          <div className="entreprise-info">
                            <div className="entreprise-avatar">
                              {(entreprise.nomEntreprise || entreprise.username || "E").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="entreprise-nom">
                                {entreprise.nomEntreprise || entreprise.username || "—"}
                              </div>
                              {entreprise.adresse && (
                                <div className="info-row">
                                  <FaMapMarkerAlt size={12} />
                                  <span>{entreprise.adresse}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="info-row">
                            <FaEnvelope size={12} />
                            <span>{entreprise.email || "—"}</span>
                          </div>
                          {entreprise.tel && (
                            
                            <div className="info-row" style={{ marginTop: 6 }}>
                            <FaPhone size={12} />
                              
                              <span>{entreprise.tel}</span>
                            </div>
                          )}
                        </td>
                        <td>
                          {entreprise.secteur ? (
                            <div className="info-row">
                            <FaIndustry size={12} />  
                              <span>{entreprise.secteur}</span>
                            </div>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: 13 }}>—</span>
                          )}
                        </td>
                        <td>
                          <span 
                            className="status-badge"
                            style={{ 
                              background: statusStyle.bg, 
                              color: statusStyle.color 
                            }}
                          >
                           {/* {statusStyle.icon}*/}
                            {statusStyle.label}
                          </span>
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
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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

export default EntreprisePage;