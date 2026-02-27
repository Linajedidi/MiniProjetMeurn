import React from 'react';
import { 
  FaTachometerAlt, 
  FaBriefcase, 
  FaUserTie, 
  FaUser, 
  FaSignOutAlt 
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarEntrep = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('name') || 'Entreprise';

  // 🔹 Définition des routes + titres
  const menuItems = [
    { label: "Tableau de bord", path: "/pages/EntrepriseHome", icon: <FaTachometerAlt /> },
    { label: "Mes Offres", path: "/pages/MesOffresEntr", icon: <FaBriefcase /> },
    { label: "Candidats", path: "/candidats", icon: <FaUserTie /> },
    { label: "Notifications", path: "/Notifications", icon: <FaBriefcase /> },
    { label: "Profile", path: "/Profile", icon: <FaUser /> },
  ];

  // 🔹 Déterminer le menu actif
  const isActive = (path) => location.pathname.startsWith(path);

  // 🔹 Déterminer le titre dynamique
  const currentTitle =
    menuItems.find(item => location.pathname.startsWith(item.path))?.label
    || "Tableau de bord";

  const menuStyle = (active = false) => ({
    padding: '15px 20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: active ? '#1e73be' : 'transparent',
    color: 'white',
    fontWeight: active ? 'bold' : 'normal'
  });

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
          <h3 style={{
            textAlign: 'center',
            padding: '20px 0',
            color: 'white'
          }}>
            Entreprise
          </h3>

          <ul style={{ listStyle: 'none', padding: 0 }}>
            {menuItems.map(item => (
              <li
                key={item.path}
                style={menuStyle(isActive(item.path))}
                onClick={() => navigate(item.path)}
              >
                {item.icon} {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div
          onClick={() => {
            localStorage.clear();
            navigate('/');
          }}
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

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, backgroundColor: '#f4f6f9' }}>

        {/* TOPBAR */}
        <div style={{
          backgroundColor: '#1e73be',
          color: 'white',
          padding: '15px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          {/* 🔥 TITRE DYNAMIQUE */}
          <h3 style={{ margin: 0 }}>{currentTitle}</h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>{username}</span>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ padding: '30px' }}>
          {children}
        </div>

      </div>
    </div>
  );
};

export default SidebarEntrep;