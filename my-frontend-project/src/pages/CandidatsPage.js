import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const CandidatsPage = () => {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCandidatures, setFilteredCandidatures] = useState([]);
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // États pour la pagination
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
        cand.offre?.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cand.candidat?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCandidatures(filtered);
    }
    setCurrentPage(1); // Revenir à la première page après recherche
  }, [searchTerm, candidatures]);

  const fetchCandidatures = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3001/api/candidatures', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidatures(res.data);
      setFilteredCandidatures(res.data);
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
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#17a2b8';
    if (score >= 40) return '#ffc107';
    return '#dc3545';
  };

  
  const indexOfLastCandidature = currentPage * candidaturesPerPage;
  const indexOfFirstCandidature = indexOfLastCandidature - candidaturesPerPage;
  const currentCandidatures = filteredCandidatures.slice(indexOfFirstCandidature, indexOfLastCandidature);
  const totalPages = Math.ceil(filteredCandidatures.length / candidaturesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Styles
  const styles = {
    container: {
      padding: '20px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '15px'
    },
    title: {
      color: '#333',
      margin: 0
    },
    searchBox: {
      padding: '10px 15px',
      width: '300px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '25px'
    },
    statsCard: {
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderLeft: '4px solid #17a2b8'
    },
    statsNumber: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
      margin: '5px 0'
    },
    statsLabel: {
      color: '#666',
      fontSize: '14px',
      margin: 0
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      overflow: 'hidden'
    },
    th: {
      backgroundColor: '#17a2b8',
      color: 'white',
      padding: '12px',
      textAlign: 'left',
      fontWeight: 'bold',
      fontSize: '14px'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #ddd',
      verticalAlign: 'middle'
    },
    tr: {
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    downloadBtn: {
      backgroundColor: '#28a745',
      color: 'white',
      textDecoration: 'none',
      display: 'inline-block',
      padding: '6px 12px',
      borderRadius: '4px',
      fontSize: '12px'
    },
    scoreBadge: {
      padding: '4px 8px',
      borderRadius: '4px',
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      display: 'inline-block',
      minWidth: '40px'
    },
    // Styles pour la pagination
    paginationContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
      marginTop: '25px',
      flexWrap: 'wrap'
    },
    pageButton: {
      padding: '8px 12px',
      border: '1px solid #ddd',
      backgroundColor: 'white',
      cursor: 'pointer',
      borderRadius: '4px',
      minWidth: '40px',
      transition: 'all 0.2s'
    },
    activePageButton: {
      backgroundColor: '#17a2b8',
      color: 'white',
      borderColor: '#17a2b8'
    },
    pageInfo: {
      color: '#666',
      fontSize: '14px',
      marginTop: '10px',
      textAlign: 'center'
    }
  };

  if (loading) {
    return (
      <Sidebar>
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Chargement des candidatures...
        </div>
      </Sidebar>
    );
  }

  // Calcul des statistiques
  const totalCandidatures = candidatures.length;
  const scoreMoyen = candidatures.length > 0 
    ? Math.round(candidatures.reduce((acc, curr) => acc + (curr.score || 0), 0) / candidatures.length) 
    : 0;
  const candidaturesHauteScore = candidatures.filter(c => c.score >= 70).length;
  const offresDistinctes = new Set(candidatures.map(c => c.offre?._id)).size;

  return (
    <Sidebar>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Gestion des Candidatures</h2>
          <input
            type="text"
            placeholder="Rechercher ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchBox}
          />
        </div>

        {/* Statistiques */}
        <div style={styles.statsContainer}>
          <div style={styles.statsCard}>
            <p style={styles.statsLabel}>Total candidatures</p>
            <p style={styles.statsNumber}>{totalCandidatures}</p>
          </div>
          <div style={{...styles.statsCard, borderLeftColor: '#28a745'}}>
            <p style={styles.statsLabel}>Score moyen</p>
            <p style={styles.statsNumber}>{scoreMoyen}%</p>
          </div>
          <div style={{...styles.statsCard, borderLeftColor: '#ffc107'}}>
            <p style={styles.statsLabel}>Scores ≥ 70%</p>
            <p style={styles.statsNumber}>{candidaturesHauteScore}</p>
          </div>
          <div style={{...styles.statsCard, borderLeftColor: '#dc3545'}}>
            <p style={styles.statsLabel}>Offres distinctes</p>
            <p style={styles.statsNumber}>{offresDistinctes}</p>
          </div>
        </div>

        {filteredCandidatures.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <p>Aucune candidature trouvée</p>
          </div>
        ) : (
          <>
            {/* Information sur le nombre d'éléments affichés */}
            <div style={styles.pageInfo}>
              Affichage {indexOfFirstCandidature + 1} à {Math.min(indexOfLastCandidature, filteredCandidatures.length)} sur {filteredCandidatures.length} candidatures
            </div>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Candidat</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Offre</th>
                  <th style={styles.th}>Entreprise</th>
                  <th style={styles.th}>CV</th>
                  <th style={styles.th}>Score</th>
                  {/*<th style={styles.th}>Date</th>      */}    
                </tr>
              </thead>
              <tbody>
                {currentCandidatures.map((candidature) => (
                  <tr 
                    key={candidature._id} 
                    style={styles.tr}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={styles.td}>
                      <strong>{candidature.candidat?.username || 'N/A'}</strong>
                    </td>
                    <td style={styles.td}>{candidature.candidat?.email || 'N/A'}</td>
                    <td style={styles.td}>{candidature.offre?.titre || 'N/A'}</td>
                    <td style={styles.td}>{candidature.offre?.entreprise?.username || 'N/A'}</td>
                    <td style={styles.td}>
                      {candidature.cv ? (
                        <a 
                         href={`http://localhost:3001/${candidature.cv}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{...styles.downloadBtn, backgroundColor: '#17a2b8'}}
                        >
                          📄 Voir CV
                        </a>
                      ) : (
                        <span style={{ color: '#999' }}>Non fourni</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.scoreBadge,
                        backgroundColor: getScoreColor(candidature.score || 0)
                      }}>
                        {candidature.score || 0}%
                      </span>
                    </td>
                   {/* <td style={styles.td}>
                      {new Date(candidature.createdAt).toLocaleDateString('fr-FR')}
                    </td>*/}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={styles.paginationContainer}>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    ...styles.pageButton,
                    opacity: currentPage === 1 ? 0.5 : 1,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Précédent
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    style={{
                      ...styles.pageButton,
                      ...(currentPage === number ? styles.activePageButton : {})
                    }}
                  >
                    {number}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    ...styles.pageButton,
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
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

export default CandidatsPage;
/* import React from 'react';
import Sidebar from '../components/Sidebar';

const CandidatsPage = () => {
  return (
    <Sidebar>
      <h2>Page des candidats</h2>
      <p>Cette page sera développée plus tard.</p>
    </Sidebar>
  );
};

export default CandidatsPage; */