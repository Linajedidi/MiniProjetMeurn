import React from 'react';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaBriefcase, 
  FaUserTie, 
  FaUser, 
  FaSignOutAlt 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ children }) => {
  const navigate = useNavigate();
  const username = localStorage.getItem('name') || 'Administrateur';

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
            Admin
          </h3>

          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={menuStyle(true)} onClick={() => navigate('/pages/AdminDashboard')}>
              <FaTachometerAlt /> Tableau de bord
            </li>
            <li style={menuStyle()} onClick={() => navigate('/users')}>
              <FaUsers /> Utilisateurs
            </li>
            <li style={menuStyle()} onClick={() => navigate('/offres')}>
              <FaBriefcase /> Mes Offres
            </li>
            <li style={menuStyle()} onClick={() => navigate('/candidats')}>
              <FaUserTie /> Candidats
            </li>
            <li style={menuStyle()} onClick={() => navigate('/profile')}>
              <FaUser /> Profil
            </li>
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

        {/* TOPBAR BLEU */}
        <div style={{
          backgroundColor: '#1e73be',
          color: 'white',
          padding: '15px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: 0 }}>Tableau de bord</h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>{username}</span>
            <img
              src="https://i.pravatar.cc/40"
              alt="admin"
              style={{ borderRadius: '50%' }}
            />
          </div>
        </div>

        {/* CONTENT DYNAMIQUE */}
        <div style={{ padding: '30px' }}>
          {children}
        </div>

      </div>
    </div>
  );
};

export default Sidebar;