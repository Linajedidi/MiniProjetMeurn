import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { FaCheckCircle, FaTimesCircle, FaEye, FaBuilding, FaEnvelope, FaPhone, FaMapMarkerAlt, FaIndustry, FaFileInvoice, FaUser, FaChevronLeft, FaChevronRight, FaCheck, FaBan } from "react-icons/fa";

const NotifAdmin = () => {
  const [entreprises, setEntreprises] = useState([]);
  const [selectedEntreprise, setSelectedEntreprise] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  
  // États pour le toast de notification
  const [toast, setToast] = useState({ show: false, message: "", type: "", entrepriseName: "" });

  const fetchEntreprises = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3001/api/admin/entreprises/en-attente");
      setEntreprises(res.data);
    } catch (err) {
      console.error("Erreur fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntreprises();
  }, []);

  // Fonction pour afficher le toast
  const showToast = (message, type, entrepriseName) => {
    setToast({ show: true, message, type, entrepriseName });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "", entrepriseName: "" });
    }, 3000);
  };

  const accepter = async (id, entrepriseName) => {
    try {
      setEntreprises(prev => prev.filter(e => e._id !== id));
      await axios.put(`http://localhost:3001/api/admin/entreprises/${id}/accepter`);
      if (window.refreshNotif) {
        window.refreshNotif();
      }
      showToast(`L'entreprise "${entrepriseName}" a été acceptée avec succès`, "success", entrepriseName);
    } catch (err) {
      console.error("Erreur accepter:", err);
      showToast(`Erreur lors de l'acceptation de l'entreprise`, "error", entrepriseName);
    }
  };

  const refuser = async (id, entrepriseName) => {
    try {
      setEntreprises(prev => prev.filter(e => e._id !== id));
      await axios.put(`http://localhost:3001/api/admin/entreprises/${id}/refuser`);
      if (window.refreshNotif) {
        window.refreshNotif();
      }
      showToast(`L'entreprise "${entrepriseName}" a été refusée`, "error", entrepriseName);
    } catch (err) {
      console.error("Erreur refuser:", err);
      showToast(`Erreur lors du refus de l'entreprise`, "error", entrepriseName);
    }
  };

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentEntreprises = entreprises.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(entreprises.length / itemsPerPage);

  return (
    <Sidebar>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        .notif-container {
          font-family: 'Inter', sans-serif;
        }
        
        /* Toast Notification Styles */
        .toast-notification {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9999;
          animation: toastIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        
        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        @keyframes toastOut {
          from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
        }
        
        .toast-content {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 32px;
          border-radius: 20px;
          min-width: 380px;
          max-width: 500px;
          background: white;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .toast-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        
        .toast-icon.success {
          background: linear-gradient(135deg, #dcfce7, #bbf7d0);
          color: #166534;
        }
        
        .toast-icon.error {
          background: linear-gradient(135deg, #fee2e2, #fecaca);
          color: #991b1b;
        }
        
        .toast-text {
          flex: 1;
        }
        
        .toast-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        
        .toast-title.success {
          color: #166534;
        }
        
        .toast-title.error {
          color: #991b1b;
        }
        
        .toast-message {
          font-size: 13px;
          color: #475569;
        }
        
        .toast-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          font-size: 20px;
          transition: color 0.2s ease;
        }
        
        .toast-close:hover {
          color: #475569;
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
        
        .description-link {
          cursor: pointer;
          color: #3b82f6;
          font-weight: 500;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        
        .description-link:hover {
          color: #2563eb;
          gap: 8px;
        }
        
        .btn-accept {
          background: linear-gradient(135deg, #10b981, #059669);
          border: none;
          border-radius: 10px;
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-right: 8px;
        }
        
        .btn-accept:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16,185,129,0.3);
        }
        
        .btn-refuse {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border: none;
          border-radius: 10px;
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        
        .btn-refuse:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239,68,68,0.3);
        }
        
        .actions-cell {
          white-space: nowrap;
          text-align: center;
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
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .modal-content {
          background: white;
          border-radius: 24px;
          width: 500px;
          max-width: 90%;
          max-height: 80vh;
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
          font-size: 15px;
          color: #0f172a;
          font-weight: 500;
        }
        
        .description-text {
          background: #f8fafc;
          padding: 16px;
          border-radius: 12px;
          line-height: 1.6;
          color: #334155;
          font-size: 14px;
          margin-top: 8px;
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
        
        .header-gradient {
          margin-bottom: 28px;
        }
        
        .header-title {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }
        
        .header-subtitle {
          color: #64748b;
          font-size: 14px;
          margin: 0;
        }
      `}</style>

      <div className="notif-container">
        {/* Toast Notification */}
        {toast.show && (
          <div className="toast-notification">
            <div className="toast-content">
              <div className={`toast-icon ${toast.type}`}>
                {toast.type === "success" ? <FaCheck size={24} /> : <FaBan size={24} />}
              </div>
              <div className="toast-text">
                <div className={`toast-title ${toast.type}`}>
                  {toast.type === "success" ? "✓ Accepté !" : "✗ Refusé !"}
                </div>
                <div className="toast-message">{toast.message}</div>
              </div>
              <button 
                className="toast-close"
                onClick={() => setToast({ show: false, message: "", type: "", entrepriseName: "" })}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        {/*
        <div className="header-gradient">
          <h2 className="header-title">
            Validation des Entreprises
          </h2>
          <p className="header-subtitle">
            Examinez et validez les nouvelles inscriptions d'entreprises
          </p>
        </div>**/}

       

        {loading ? (
          <div className="loading-container">
            <div className="loader" />
            <p style={{ marginTop: 16, color: '#64748b' }}>Chargement des entreprises...</p>
          </div>
        ) : entreprises.length === 0 ? (
          <div className="empty-state">
            <div className="empty-title">Aucune entreprise en attente</div>
            <div className="empty-subtitle">Toutes les inscriptions ont été traitées</div>
          </div>
        ) : (
          <>
            <div className="entreprise-table">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th>Entreprise</th>
                    <th>Contact</th>
                    <th>Secteur</th>
                    <th>Code Fiscal</th>
                    <th>Description</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEntreprises.map((entreprise, index) => (
                    <tr key={entreprise._id} className="table-row" style={{ animationDelay: `${index * 0.05}s` }}>
                      <td>
                        <div className="entreprise-info">
                          <div className="entreprise-avatar">
                            {(entreprise.nomEntreprise || entreprise.username || "E").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="entreprise-nom">
                              {entreprise.nomEntreprise || entreprise.username}
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
                          <span>{entreprise.email}</span>
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
                        {entreprise.codeFiscal ? (
                          <div className="info-row">
                            <FaFileInvoice size={12} />
                            <span>{entreprise.codeFiscal}</span>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: 13 }}>—</span>
                        )}
                      </td>
                      <td>
                        <div 
                          className="description-link"
                          onClick={() => {
                            setSelectedEntreprise(entreprise);
                            setShowModal(true);
                          }}
                        >
                          <FaEye size={12} />
                          <span>Aperçu</span>
                        </div>
                      </td>
                      <td className="actions-cell">
                        <button
                          className="btn-accept"
                          onClick={() => accepter(entreprise._id, entreprise.nomEntreprise || entreprise.username)}
                          title="Accepter l'entreprise"
                        >
                          <FaCheckCircle size={12} /> 
                        </button>
                        <button
                          className="btn-refuse"
                          onClick={() => refuser(entreprise._id, entreprise.nomEntreprise || entreprise.username)}
                          title="Refuser l'entreprise"
                        >
                          <FaTimesCircle size={12} /> 
                        </button>
                      </td>
                    </tr>
                  ))}
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

        {/* Modal Détails Entreprise */}
        {showModal && selectedEntreprise && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h4>
                  <FaBuilding size={20} />
                  {selectedEntreprise.nomEntreprise || selectedEntreprise.username}
                </h4>
              </div>
              
              <div className="modal-body">
                <div className="detail-section">
                  <div className="detail-label">Informations de contact</div>
                  <div className="detail-value">
                    <div className="info-row" style={{ marginBottom: 8 }}>
                      <FaUser size={12} />
                      <span>{selectedEntreprise.username}</span>
                    </div>
                    <div className="info-row" style={{ marginBottom: 8 }}>
                      <FaEnvelope size={12} />
                      <span>{selectedEntreprise.email}</span>
                    </div>
                    {selectedEntreprise.tel && (
                      <div className="info-row">
                        <FaPhone size={12} />
                        <span>{selectedEntreprise.tel}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="detail-section">
                  <div className="detail-label">Informations professionnelles</div>
                  <div className="detail-value">
                    {selectedEntreprise.secteur && (
                      <div className="info-row" style={{ marginBottom: 8 }}>
                        <FaIndustry size={12} />
                        <span>Secteur : {selectedEntreprise.secteur}</span>
                      </div>
                    )}
                    {selectedEntreprise.adresse && (
                      <div className="info-row" style={{ marginBottom: 8 }}>
                        <FaMapMarkerAlt size={12} />
                        <span>Adresse : {selectedEntreprise.adresse}</span>
                      </div>
                    )}
                    {selectedEntreprise.codeFiscal && (
                      <div className="info-row">
                        <FaFileInvoice size={12} />
                        <span>Code fiscal : {selectedEntreprise.codeFiscal}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedEntreprise.description && (
                  <div className="detail-section">
                    <div className="detail-label">Description de l'entreprise</div>
                    <div className="description-text">
                      {selectedEntreprise.description}
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button className="btn-close-modal" onClick={() => setShowModal(false)}>
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

export default NotifAdmin;