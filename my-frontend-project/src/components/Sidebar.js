import React, { useState, useEffect, useRef } from 'react';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaBriefcase, 
  FaBuilding,   
  FaUserTie, 
  FaUser, 
  FaSignOutAlt,
  FaBell
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";

const Sidebar = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const [notifCount, setNotifCount] = useState(0);

  const [user, setUser] = useState({
    username: localStorage.getItem("name") || "Administrateur",
    profileImage: localStorage.getItem("profileImage") || "uploads/avatar.png"
  });

  const pageTitles = {
    '/pages/AdminDashboard': 'Tableau de bord',
    '/users': 'Gestion des utilisateurs',
    '/offres': 'Gestion des offres',
    '/entreprise': 'Gestion des entreprises',
    '/NotifAdmin': 'Validation entreprises',
    '/Candidat': 'Gestion des candidats',
    '/profile': 'Mon profil'
  };

  const pageSubtitles = {
    '/pages/AdminDashboard': 'Vue générale et statistiques',
    '/users': 'Gestion des comptes utilisateurs',
    '/offres': "Consultez les offres",
    '/entreprise': 'Gestion des entreprises',
    '/NotifAdmin': 'Valider les comptes entreprises',
    '/Candidat': 'Gestion des candidats',
    '/profile': 'Paramètres du compte'
  };

  const getTitle = () => pageTitles[location.pathname] || 'Administration';
  const getSubtitle = () => pageSubtitles[location.pathname] || '';

  const menuStyle = (path) => ({
    padding: '15px 20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: location.pathname === path ? '#1e73be' : 'transparent',
    color: 'white',
    fontWeight: location.pathname === path ? 'bold' : 'normal',
    borderRadius: '5px'
  });

  // 🔔 Notifications count
  const fetchNotifCount = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/admin/entreprises/count");
      setNotifCount(res.data.count);
    } catch (err) {
      console.error("Erreur notif:", err);
    }
  };

  // refresh externe
  useEffect(() => {
    window.refreshNotif = fetchNotifCount;
  }, []);

  useEffect(() => {
    fetchNotifCount();
    const interval = setInterval(fetchNotifCount, 2000);
    return () => clearInterval(interval);
  }, []);

  // 👤 Profil
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
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  // fermer dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "http://localhost:3001/uploads/avatar.png";
    return `http://localhost:3001/${imagePath}`;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      
      {/* SIDEBAR */}
      <div style={{
        width: '250px',
        backgroundColor: '#155a96',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>

        <div>
          <h3 style={{ textAlign: 'center', padding: '20px', color: 'white' }}>
            Admin
          </h3>

          <ul style={{ listStyle: 'none', padding: 0 }}>

            <li style={menuStyle('/pages/AdminDashboard')} onClick={() => navigate('/pages/AdminDashboard')}>
              <span><FaTachometerAlt /> Tableau de bord</span>
            </li>

            <li style={menuStyle('/users')} onClick={() => navigate('/users')}>
              <span><FaUsers /> Utilisateurs</span>
            </li>

            <li style={menuStyle('/offres')} onClick={() => navigate('/offres')}>
              <span><FaBriefcase /> Offres</span>
            </li>

            <li style={menuStyle('/entreprise')} onClick={() => navigate('/entreprise')}>
              <span><FaBuilding /> Entreprises</span>
            </li>

            {/* 🔔 NOTIFICATIONS */}
            <li style={menuStyle('/NotifAdmin')} onClick={() => navigate('/NotifAdmin')}>
              <span><FaBell /> Validation entreprises</span>

              {notifCount > 0 && (
                <span style={{
                  backgroundColor: "red",
                  borderRadius: "50%",
                  padding: "4px 10px",
                  fontSize: "12px"
                }}>
                  {notifCount > 99 ? "99+" : notifCount}
                </span>
              )}
            </li>

            <li style={menuStyle('/Candidat')} onClick={() => navigate('/Candidat')}>
              <span><FaUserTie /> Candidats</span>
            </li>

            <li style={menuStyle('/profile')} onClick={() => navigate('/profile')}>
              <span><FaUser /> Profil</span>
            </li>

          </ul>
        </div>

        {/* LOGOUT */}
        <div onClick={handleLogout} style={{
          padding: '15px',
          cursor: 'pointer',
          color: 'white'
        }}>
          <FaSignOutAlt /> Déconnexion
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, backgroundColor: '#f4f6f9' }}>

        {/* HEADER AVEC PROFIL */}
        <div style={{
          backgroundColor: '#1e73be',
          color: 'white',
          padding: '20px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative'
        }}>

          <div>
            <h3 style={{ margin: 0 }}>{getTitle()}</h3>
            <p style={{ margin: 0 }}>{getSubtitle()}</p>
          </div>

          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer'
              }}
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
                  onClick={() => {
                    navigate('/profile');
                    setDropdownOpen(false);
                  }}
                  style={{ padding: '10px', cursor: 'pointer', display: 'flex', gap: '10px' }}
                >
                  <FaUser /> Profil
                </div>

                <div
                  onClick={() => {
                    handleLogout();
                    setDropdownOpen(false);
                  }}
                  style={{ padding: '10px', cursor: 'pointer', display: 'flex', gap: '10px' }}
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