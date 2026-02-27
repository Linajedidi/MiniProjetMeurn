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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const [user, setUser] = useState({
    username: localStorage.getItem("name") || "Administrateur",
    profileImage: localStorage.getItem("profileImage") || "uploads/avatar.png"
  });

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
    '/users': 'Gestion des comptes utilisateurs',
    '/offres': "Consultez les offres d'emploi",
    '/entreprise': 'Gestion des entreprises ',
    '/Candidat': 'Gestion des candidats',
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
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:3001/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        setUser({
          username: data.username || "Administrateur",
          profileImage: data.profileImage || "uploads/avatar.png"
        });
        
        localStorage.setItem("name", data.username);
        localStorage.setItem("profileImage", data.profileImage || "uploads/avatar.png");
      } catch (error) {
        console.error("Erreur récupération profil:", error);
      }
    };

    fetchProfile();

    const handleStorageChange = () => {
      setUser({
        username: localStorage.getItem("name") || "Administrateur",
        profileImage: localStorage.getItem("profileImage") || "uploads/avatar.png"
      });
    };

    window.addEventListener("storage", handleStorageChange);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "http://localhost:3001/uploads/avatar.png";
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3001/${imagePath.replace(/^\/+/, '')}`;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      
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

      <div style={{ flex: 1, backgroundColor: '#f4f6f9' }}>
        
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

          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            >
              <span>{user.username}</span>
              <img
                src={getImageUrl(user.profileImage)}
                alt="profile"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid white"
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "http://localhost:3001/uploads/avatar.png";
                }}
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

        <div style={{ padding: '30px' }}>
          {children}
        </div>

      </div>
    </div>
  );
};

export default Sidebar;