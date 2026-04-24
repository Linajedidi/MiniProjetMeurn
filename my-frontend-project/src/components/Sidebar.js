import React, { useState, useEffect, useRef } from 'react';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaBriefcase, 
  FaBuilding,   
  FaUserTie, 
  FaUser, 
  FaSignOutAlt,
  FaBell,
  FaChevronDown
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

  // Style avec dégradé bleu vers violet pour l'item actif
  const menuStyle = (path) => ({
    padding: '10px 16px',
    margin: '2px 8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: location.pathname === path 
      ? 'linear-gradient(135deg, #2563eb, #7c3aed)' 
      : 'transparent',
    color: location.pathname === path ? '#fff' : '#475569',
    fontWeight: location.pathname === path ? '600' : '500',
    borderRadius: '10px',
    transition: 'all 0.2s ease',
    fontSize: '13px',
    boxShadow: location.pathname === path ? '0 2px 8px rgba(37,99,235,0.2)' : 'none'
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

  useEffect(() => {
    window.refreshNotif = fetchNotifCount;
  }, []);

  useEffect(() => {
    fetchNotifCount();
    const interval = setInterval(fetchNotifCount, 30000);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F7F6F2' }}>
      
      {/* SIDEBAR - Version avec fond blanc et accents bleu/violet */}
      <div style={{
        width: '250px',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '2px 0 12px rgba(0,0,0,0.04)',
        borderRight: '1px solid #e2e8f0',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto'
      }}>

        {/* Logo Section - Dégradé bleu/violet */}
        <div>
          <div style={{ 
            padding: '20px 20px 16px 20px',
            borderBottom: '1px solid #e2e8f0',
            marginBottom: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34,
                height: 34,
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(37,99,235,0.2)'
              }}>
                <FaBriefcase size={16} color="#fff" />
              </div>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 18,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em'
              }}>
                JobBoard
              </span>
            </div>
            <p style={{
              fontSize: 10,
              color: '#94a3b8',
              marginTop: 8,
              marginBottom: 0
            }}>
              Interface d'administration
            </p>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>

            <li 
              style={menuStyle('/pages/AdminDashboard')} 
              onClick={() => navigate('/pages/AdminDashboard')}
              onMouseEnter={e => {
                if (location.pathname !== '/pages/AdminDashboard') {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.08))';
                }
              }}
              onMouseLeave={e => {
                if (location.pathname !== '/pages/AdminDashboard') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FaTachometerAlt size={15} style={{ color: location.pathname === '/pages/AdminDashboard' ? '#fff' : '#6366f1' }} /> 
                Tableau de bord
              </span>
            </li>

            <li 
              style={menuStyle('/users')} 
              onClick={() => navigate('/users')}
              onMouseEnter={e => {
                if (location.pathname !== '/users') {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.08))';
                }
              }}
              onMouseLeave={e => {
                if (location.pathname !== '/users') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FaUsers size={15} style={{ color: location.pathname === '/users' ? '#fff' : '#6366f1' }} /> 
                Utilisateurs
              </span>
            </li>

            <li 
              style={menuStyle('/offres')} 
              onClick={() => navigate('/offres')}
              onMouseEnter={e => {
                if (location.pathname !== '/offres') {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.08))';
                }
              }}
              onMouseLeave={e => {
                if (location.pathname !== '/offres') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FaBriefcase size={15} style={{ color: location.pathname === '/offres' ? '#fff' : '#6366f1' }} /> 
                Offres
              </span>
            </li>

            <li 
              style={menuStyle('/entreprise')} 
              onClick={() => navigate('/entreprise')}
              onMouseEnter={e => {
                if (location.pathname !== '/entreprise') {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.08))';
                }
              }}
              onMouseLeave={e => {
                if (location.pathname !== '/entreprise') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FaBuilding size={15} style={{ color: location.pathname === '/entreprise' ? '#fff' : '#6366f1' }} /> 
                Entreprises
              </span>
            </li>

            {/* 🔔 NOTIFICATIONS */}
            <li 
              style={menuStyle('/NotifAdmin')} 
              onClick={() => navigate('/NotifAdmin')}
              onMouseEnter={e => {
                if (location.pathname !== '/NotifAdmin') {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.08))';
                }
              }}
              onMouseLeave={e => {
                if (location.pathname !== '/NotifAdmin') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FaBell size={15} style={{ color: location.pathname === '/NotifAdmin' ? '#fff' : '#6366f1' }} /> 
                Validation
              </span>

              {notifCount > 0 && (
                <span style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  borderRadius: '12px',
                  padding: '2px 6px',
                  fontSize: '10px',
                  fontWeight: '600',
                  color: '#fff',
                  minWidth: '20px',
                  textAlign: 'center'
                }}>
                  {notifCount > 99 ? "99+" : notifCount}
                </span>
              )}
            </li>

            <li 
              style={menuStyle('/Candidat')} 
              onClick={() => navigate('/Candidat')}
              onMouseEnter={e => {
                if (location.pathname !== '/Candidat') {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.08))';
                }
              }}
              onMouseLeave={e => {
                if (location.pathname !== '/Candidat') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FaUserTie size={15} style={{ color: location.pathname === '/Candidat' ? '#fff' : '#6366f1' }} /> 
                Candidats
              </span>
            </li>

            <li 
              style={menuStyle('/profile')} 
              onClick={() => navigate('/profile')}
              onMouseEnter={e => {
                if (location.pathname !== '/profile') {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.08))';
                }
              }}
              onMouseLeave={e => {
                if (location.pathname !== '/profile') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FaUser size={15} style={{ color: location.pathname === '/profile' ? '#fff' : '#6366f1' }} /> 
                Profil
              </span>
            </li>

          </ul>
        </div>

        {/* LOGOUT Section */}
        <div style={{ padding: '16px 20px 24px', borderTop: '1px solid #e2e8f0', marginTop: 'auto' }}>
          <div 
            onClick={handleLogout} 
            style={{
              padding: '10px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              borderRadius: '10px',
              transition: 'all 0.2s ease',
              color: '#64748b',
              fontSize: '13px',
              fontWeight: 500
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(220,38,38,0.08))';
              e.currentTarget.style.color = '#dc2626';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#64748b';
            }}
          >
            <FaSignOutAlt size={15} /> Déconnexion
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div style={{ 
        flex: 1, 
        marginLeft: '250px',
        minHeight: '100vh',
        background: '#F7F6F2'
      }}>

        {/* HEADER AVEC PROFIL - Dégradé bleu/violet */}
        <div style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '14px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 99
        }}>

          <div>
            <h3 style={{ 
              margin: 0,
              fontFamily: "'Inter', sans-serif",
              fontSize: 18,
              fontWeight: 600,
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {getTitle()}
            </h3>
            <p style={{ 
              margin: '2px 0 0',
              fontSize: 12,
              color: '#64748b'
            }}>
              {getSubtitle()}
            </p>
          </div>

          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                padding: '4px 12px',
                borderRadius: '30px',
                background: dropdownOpen ? 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.08))' : 'transparent',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ 
                fontSize: 13,
                fontWeight: 500,
                color: '#334155'
              }}>
                {user.username}
              </span>

              <img
                src={getImageUrl(user.profileImage)}
                alt="profile"
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #e2e8f0"
                }}
              />
              
              <FaChevronDown size={11} style={{ color: '#94a3b8' }} />
            </div>

            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '46px',
                right: 0,
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.02)',
                width: '180px',
                zIndex: 1000,
                overflow: 'hidden',
                border: '1px solid #e2e8f0'
              }}>
                <div
                  onClick={() => {
                    navigate('/profile');
                    setDropdownOpen(false);
                  }}
                  style={{ 
                    padding: '10px 14px', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'background 0.2s ease',
                    fontSize: 13,
                    color: '#334155'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(37,99,235,0.05), rgba(124,58,237,0.05))'}
                  onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
                >
                  <FaUser size={13} style={{ color: '#6366f1' }} /> Mon profil
                </div>

                <div style={{ height: '1px', background: '#e2e8f0' }} />

                <div
                  onClick={() => {
                    handleLogout();
                    setDropdownOpen(false);
                  }}
                  style={{ 
                    padding: '10px 14px', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'background 0.2s ease',
                    fontSize: 13,
                    color: '#dc2626'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                  onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
                >
                  <FaSignOutAlt size={13} /> Déconnexion
                </div>
              </div>
            )}
          </div>

        </div>

        {/* MAIN CONTENT */}
        <div style={{ padding: '24px 28px' }}>
          {children}
        </div>

      </div>
    </div>
  );
};

export default Sidebar;