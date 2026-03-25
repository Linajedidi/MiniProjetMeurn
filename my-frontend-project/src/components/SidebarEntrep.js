import React, { useState, useEffect, useRef } from 'react';
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
  const dropdownRef = useRef();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState({
    username: localStorage.getItem("name") || "Entreprise",
    profileImage: localStorage.getItem("profileImage") || "uploads/avatar.png"
  });

  const menuItems = [
    { label: "Tableau de bord", path: "/pages/EntrepriseHome", icon: <FaTachometerAlt /> },
    { label: "Mes Offres", path: "/pages/MesOffresEntr", icon: <FaBriefcase /> },
    { label: "Candidats", path: "/candidaturesPage", icon: <FaUserTie /> },
     { label:"Notifications", path: "/Notif", icon: <FaUserTie /> },
    { label: "Profile", path: "/profile-entreprise", icon: <FaUser /> },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  const currentTitle =
    menuItems.find(item => location.pathname.startsWith(item.path))?.label
    || "Tableau de bord";

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
          username: data.username,
          profileImage: data.profileImage || "uploads/avatar.png"
        });

        localStorage.setItem("name", data.username);
        localStorage.setItem("profileImage", data.profileImage || "");
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();

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
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3001/${imagePath.replace(/^\/+/, '')}`;
  };

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
          <h3 style={{ textAlign: 'center', padding: '20px 0', color: 'white' }}>
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
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, backgroundColor: '#f4f6f9' }}>

        {/* TOPBAR */}
        <div style={{
          backgroundColor: '#1e73be',
          color: 'white',
          padding: '20px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative'
        }}>

          <h3 style={{ margin: 0 }}>{currentTitle}</h3>

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
                  onClick={() => { navigate('/profile-entreprise'); setDropdownOpen(false); }}
                  style={{ padding: '10px', cursor: 'pointer', display: 'flex', gap: '10px' }}
                >
                  <FaUser /> Profil
                </div>

                <div
                  onClick={() => { handleLogout(); setDropdownOpen(false); }}
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

export default SidebarEntrep;