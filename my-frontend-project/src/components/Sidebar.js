import React, { useState, useEffect, useRef } from 'react';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaBriefcase, 
  FaBuilding,   
  FaUserTie, 
  FaUser, 
  FaSignOutAlt 
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const username = localStorage.getItem('name') || 'Administrateur';
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();



  const pageTitles = {
    '/pages/AdminDashboard': 'Tableau de bord',
    '/users': 'Gestion des utilisateurs',
    '/offres': 'Gestion des offres',
    '/entreprise': 'Gestion des entreprises',
    '/Candidat': 'Gestion des candidats',
    '/profile': 'Mon profil'
  };

  const pageSubtitles = {
    '/pages/AdminDashboard': 'Vue générale et statistiques de la plateforme',
    '/users': ' gestion des comptes utilisateurs',
    '/offres': "Consultez  les offres d'emploi",
    '/entreprise': 'Gestion des entreprises ',
    '/Candidat': 'Gestion des  candidats',
    '/profile': 'Informations et paramètres de votre compte'
  };

  const getTitle = () => pageTitles[location.pathname] || 'Administration';
  const getSubtitle = () => pageSubtitles[location.pathname] || '';

 

  const menuStyle = (path) => ({
    padding: '15px 20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: location.pathname === path ? '#1e73be' : 'transparent',
    color: 'white',
    fontWeight: location.pathname === path ? 'bold' : 'normal',
    borderRadius: '5px',
    transition: '0.3s'
  });

  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      
      {/* ================= SIDEBAR ================= */}
      <div style={{
        width: '250px',
        backgroundColor: '#155a96',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{ textAlign: 'center', padding: '20px 0', color: 'white' }}>
            Admin
          </h3>

          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={menuStyle('/pages/AdminDashboard')} onClick={() => navigate('/pages/AdminDashboard')}>
              <FaTachometerAlt /> Tableau de bord
            </li>

            <li style={menuStyle('/users')} onClick={() => navigate('/users')}>
              <FaUsers /> Utilisateurs
            </li>

            <li style={menuStyle('/offres')} onClick={() => navigate('/offres')}>
              <FaBriefcase /> Mes Offres
            </li>

            <li style={menuStyle('/entreprise')} onClick={() => navigate('/entreprise')}>
              <FaBuilding /> Entreprise
            </li>

            <li style={menuStyle('/Candidat')} onClick={() => navigate('/Candidat')}>
              <FaUserTie /> Candidats
            </li>

            <li style={menuStyle('/profile')} onClick={() => navigate('/profile')}>
              <FaUser /> Profil
            </li>
          </ul>
        </div>

        {/* ================= DECONNEXION ================= */}
        <div
          onClick={handleLogout}
          style={{
            padding: '15px 20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            borderTop: '1px solid rgba(255,255,255,0.2)',
            color: 'white'
          }}
        >
          <FaSignOutAlt /> Déconnexion
        </div>
      </div>

      {/* ================= CONTENU PRINCIPAL ================= */}
      <div style={{ flex: 1, backgroundColor: '#f4f6f9' }}>
        
        {/* ================= TOPBAR ================= */}
        <div style={{
          backgroundColor: '#1e73be',
          color: 'white',
          padding: '20px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          position: 'relative'
        }}>
          
          {/* TITRE + SOUS TITRE */}
          <div>
            <h3 style={{ margin: 0 }}>{getTitle()}</h3>
            <p style={{ 
              margin: 0, 
              fontSize: '14px', 
              opacity: 0.85 
            }}>
              {getSubtitle()}
            </p>
          </div>

          {/* DROPDOWN PROFIL */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            >
              <span>{username}</span>
              <img
                src="https://i.pravatar.cc/40"
                alt="admin"
                style={{ borderRadius: '50%' }}
              />
            </div>

            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '55px',
                right: 0,
                backgroundColor: 'white',
                color: '#333',
                borderRadius: '5px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                width: '160px',
                zIndex: 1000
              }}>
                <div
                  onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
                  style={{ padding: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <FaUser /> Profil
                </div>

                <div
                  onClick={() => { handleLogout(); setDropdownOpen(false); }}
                  style={{ padding: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <FaSignOutAlt /> Déconnexion
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= CONTENU PAGE ================= */}
        <div style={{ padding: '30px' }}>
          {children}
        </div>

      </div>
    </div>
  );
};

export default Sidebar;