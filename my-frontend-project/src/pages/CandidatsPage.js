import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { FaSearch, FaFileAlt, FaUser, FaEnvelope, FaBuilding, FaBriefcase, FaChartLine, FaUsers, FaStar, FaEye, FaChevronLeft, FaChevronRight, FaDownload } from 'react-icons/fa';

const CandidatsPage = () => {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCandidatures, setFilteredCandidatures] = useState([]);
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [candidaturesPerPage] = useState(3);

  useEffect(() => {
    fetchCandidatures();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCandidatures(candidatures);
    } else {
      const filtered = candidatures.filter(cand => 
        cand.candidat?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cand.candidatGoogle?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cand.offre?.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cand.candidat?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cand.candidatGoogle?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCandidatures(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, candidatures]);

  const fetchCandidatures = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3001/api/candidatures', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const clean = res.data.filter(c => c.candidat && c.offre);
      setCandidatures(clean);
      setFilteredCandidatures(clean);
    } catch (err) {
      console.error('Erreur chargement candidatures:', err);
      alert('Erreur lors du chargement des candidatures');
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = (candidature) => {
    setSelectedCandidature(candidature);
    setShowDetails(true);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return { bg: '#dcfce7', color: '#166534' };
    if (score >= 60) return { bg: '#e0f2fe', color: '#0369a1' };
    if (score >= 40) return { bg: '#fef3c7', color: '#92400e' };
    return { bg: '#fee2e2', color: '#991b1b' };
  };
  
  const indexOfLastCandidature = currentPage * candidaturesPerPage;
  const indexOfFirstCandidature = indexOfLastCandidature - candidaturesPerPage;
  const currentCandidatures = filteredCandidatures.slice(indexOfFirstCandidature, indexOfLastCandidature);
  const totalPages = Math.ceil(filteredCandidatures.length / candidaturesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Statistiques
  const totalCandidatures = candidatures.length;
  const scoreMoyen = candidatures.length > 0 
    ? Math.round(candidatures.reduce((acc, curr) => acc + (curr.score || 0), 0) / candidatures.length) 
    : 0;
  const candidaturesHauteScore = candidatures.filter(c => c.score >= 70).length;
  const offresDistinctes = new Set(candidatures.map(c => c.offre?._id)).size;

  return (
    <Sidebar>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        .candidats-container {
          font-family: 'Inter', sans-serif;
        }
        
        .search-wrapper {
          position: relative;
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
          width: 300px;
          padding: 10px 16px 10px 42px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
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
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }
        
        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }
        
        .stat-number {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
          margin: 8px 0 4px;
        }
        
        .stat-label {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
          margin: 0;
        }
        
        .candidats-table {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
        }
        
        .candidats-table thead {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
        }
        
        .candidats-table th {
          padding: 16px 20px;
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .candidats-table td {
          padding: 20px;
          font-size: 14px;
          color: #334155;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }
        
        .candidats-table tr {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .candidats-table tr:hover {
          background: #f8fafc;
        }
        
        .candidat-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .candidat-avatar {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          color: #4338ca;
          flex-shrink: 0;
        }
        
        .candidat-name {
          font-weight: 700;
          font-size: 15px;
          color: #0f172a;
          margin-bottom: 4px;
        }
        
        .info-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #64748b;
        }
        
        .score-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
        }
        
        .btn-view-cv {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          border: none;
          border-radius: 10px;
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
        }
        
        .btn-view-cv:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37,99,235,0.3);
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
          background: white;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
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
          display: inline-flex;
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
        
        .page-info {
          text-align: center;
          margin-bottom: 16px;
          font-size: 13px;
          color: #64748b;
        }
        
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }
        
        .modal-content {
          background: white;
          border-radius: 24px;
          width: 550px;
          max-width: 90%;
          max-height: 85vh;
          overflow-y: auto;
          animation: modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .modal-header {
          background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
          border-radius: 24px 24px 0 0;
        }
        
        .modal-header h4 {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .modal-body {
          padding: 24px;
        }
        
        .detail-section {
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .detail-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #94a3b8;
          margin-bottom: 8px;
        }
        
        .detail-value {
          font-size: 14px;
          color: #0f172a;
          font-weight: 500;
        }
        
        .modal-footer {
          padding: 16px 24px 24px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-end;
        }
        
        .btn-close-modal {
          background: #f1f5f9;
          border: none;
          border-radius: 10px;
          padding: 10px 24px;
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-close-modal:hover {
          background: #e2e8f0;
          color: #475569;
        }
      `}</style>

      <div className="candidats-container" style={{ padding: '20px' }}>
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
            Gestion des Candidatures
          </h2>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
            Consultez et gérez toutes les candidatures reçues sur vos offres
          </p>
        </div>*/}

        {/* Header avec recherche */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 28,
          flexWrap: 'wrap',
          gap: 15
        }}>
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Statistiques */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)' }}>
              <FaUsers size={24} color="#4338ca" />
            </div>
            <p className="stat-number">{totalCandidatures}</p>
            <p className="stat-label">Total candidatures</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)' }}>
              <FaChartLine size={24} color="#166534" />
            </div>
            <p className="stat-number">{scoreMoyen}%</p>
            <p className="stat-label">Score moyen</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)' }}>
              <FaStar size={24} color="#92400e" />
            </div>
            <p className="stat-number">{candidaturesHauteScore}</p>
            <p className="stat-label">Scores ≥ 70%</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)' }}>
              <FaBriefcase size={24} color="#0369a1" />
            </div>
            <p className="stat-number">{offresDistinctes}</p>
            <p className="stat-label">Offres distinctes</p>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loader" />
            <p style={{ marginTop: 16, color: '#64748b' }}>Chargement des candidatures...</p>
          </div>
        ) : filteredCandidatures.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <div className="empty-title">Aucune candidature trouvée</div>
            <div className="empty-subtitle">
              {searchTerm ? "Essayez d'autres mots-clés" : "Les candidatures apparaîtront ici"}
            </div>
          </div>
        ) : (
          <>
            <div className="page-info">
              Affichage {indexOfFirstCandidature + 1} à {Math.min(indexOfLastCandidature, filteredCandidatures.length)} sur {filteredCandidatures.length} candidatures
            </div>

            <div className="candidats-table">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th>Candidat</th>
                    <th>Email</th>
                    <th>Offre</th>
                    <th>Entreprise</th>
                    <th>CV</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCandidatures.map((candidature, index) => {
                    const scoreStyle = getScoreColor(candidature.score || 0);
                    return (
                      <tr 
                        key={candidature._id} 
                        className="table-row"
                        style={{ animationDelay: `${index * 0.05}s` }}
                        onClick={() => viewDetails(candidature)}
                      >
                        <td>
                          <div className="candidat-info">
                            <div className="candidat-avatar">
                              {(candidature.candidat?.username || candidature.candidatGoogle?.name || "C").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="candidat-name">
                                {candidature.candidat?.username || candidature.candidatGoogle?.name || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="info-row">
                            <FaEnvelope size={12} />
                            <span>{candidature.candidat?.email || candidature.candidatGoogle?.email || 'N/A'}</span>
                          </div>
                        </td>
                        <td>
                          <div className="info-row">
                            <FaBriefcase size={12} />
                            <span>{candidature.offre?.titre || 'N/A'}</span>
                          </div>
                        </td>
                        <td>
                          <div className="info-row">
                            <FaBuilding size={12} />
                            <span>{candidature.offre?.entreprise?.username || 'N/A'}</span>
                          </div>
                        </td>
                        <td>
                          {candidature.cv ? (
                            <a 
                              href={`http://localhost:3001/${candidature.cv}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-view-cv"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FaFileAlt size={12} /> Voir CV
                            </a>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: 12 }}>Non fourni</span>
                          )}
                        </td>
                        <td>
                          <span className="score-badge" style={scoreStyle}>
                            {candidature.score || 0}%
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

        {/* Modal Détails Candidature */}
        {showDetails && selectedCandidature && (
          <div className="modal-overlay" onClick={() => setShowDetails(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h4>
                  <FaUser size={20} />
                  Détails de la candidature
                </h4>
              </div>
              
              <div className="modal-body">
                <div className="detail-section">
                  <div className="detail-label">Informations candidat</div>
                  <div className="detail-value">
                    <div className="info-row" style={{ marginBottom: 8 }}>
                      <FaUser size={12} />
                      <span><strong>Nom:</strong> {selectedCandidature.candidat?.username || selectedCandidature.candidatGoogle?.name || 'N/A'}</span>
                    </div>
                    <div className="info-row" style={{ marginBottom: 8 }}>
                      <FaEnvelope size={12} />
                      <span><strong>Email:</strong> {selectedCandidature.candidat?.email || selectedCandidature.candidatGoogle?.email || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <div className="detail-label">Informations offre</div>
                  <div className="detail-value">
                    <div className="info-row" style={{ marginBottom: 8 }}>
                      <FaBriefcase size={12} />
                      <span><strong>Titre:</strong> {selectedCandidature.offre?.titre || 'N/A'}</span>
                    </div>
                    <div className="info-row" style={{ marginBottom: 8 }}>
                      <FaBuilding size={12} />
                      <span><strong>Entreprise:</strong> {selectedCandidature.offre?.entreprise?.username || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <div className="detail-label">Score de correspondance</div>
                  <div className="detail-value">
                    <span className="score-badge" style={getScoreColor(selectedCandidature.score || 0)}>
                      {selectedCandidature.score || 0}%
                    </span>
                  </div>
                </div>

                {selectedCandidature.cv && (
                  <div className="detail-section">
                    <div className="detail-label">CV du candidat</div>
                    <div className="detail-value">
                      <a 
                        href={`http://localhost:3001/${selectedCandidature.cv}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-view-cv"
                      >
                        <FaDownload size={12} /> Télécharger le CV
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button className="btn-close-modal" onClick={() => setShowDetails(false)}>
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default CandidatsPage;