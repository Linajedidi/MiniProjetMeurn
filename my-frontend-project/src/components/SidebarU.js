import React, { useEffect, useState } from "react";
import {
  FaTachometerAlt,
  FaBriefcase,
  FaUser,
  FaSignOutAlt
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const SidebarU = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [user, setUser] = useState({
    username: localStorage.getItem("name") || "Candidat",
    profileImage: localStorage.getItem("profileImage") || "uploads/avatar.png"
  });

  /* 
     FETCH PROFIL
  */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:3001/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        setUser({
          username: data.username || "Candidat",
          profileImage: data.profileImage || "uploads/avatar.png"
        });

        localStorage.setItem("name", data.username);
        localStorage.setItem(
          "profileImage",
          data.profileImage || "uploads/avatar.png"
        );
      } catch (err) {
        console.error("Erreur récupération profil candidat :", err);
      }
    };

    fetchProfile();
  }, []);

  /*  UTILS */
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "http://localhost:3001/uploads/avatar.png";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:3001/${imagePath.replace(/^\/+/, "")}`;
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const menuStyle = (path) => ({
    padding: "15px 20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: location.pathname === path ? "#1e73be" : "transparent",
    color: "white",
    fontWeight: location.pathname === path ? "bold" : "normal"
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <div
        style={{
          width: "250px",
          backgroundColor: "#155a96",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <div>
          <h3 style={{ textAlign: "center", padding: "20px 0", color: "white" }}>
            Candidat
          </h3>

          <ul style={{ listStyle: "none", padding: 0 }}>
            <li
              style={menuStyle("/candidate-home")}
              onClick={() => navigate("/candidate-home")}
            >
              <FaTachometerAlt /> Tableau de bord
            </li>

            <li
              style={menuStyle("/DemandeC")}
              onClick={() => navigate("/DemandeC")}
            >
              <FaBriefcase /> Mes Demandes
            </li>

            <li
              style={menuStyle("/ProfilePageC")}
              onClick={() => navigate("/ProfilePageC")}
            >
              <FaUser /> Profil
            </li>
          </ul>
        </div>

        <div
          onClick={handleLogout}
          style={{
            padding: "15px 20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            borderTop: "1px solid rgba(255,255,255,0.2)",
            color: "white"
          }}
        >
          <FaSignOutAlt /> Déconnexion
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, backgroundColor: "#f4f6f9" }}>
        {/* TOPBAR */}
        <div
          style={{
            backgroundColor: "#1e73be",
            color: "white",
            padding: "15px 30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}
        >
          <h3 style={{ margin: 0 }}>Tableau de bord</h3>

          {/* USER + DROPDOWN */}
          <div style={{ position: "relative" }}>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer"
              }}
            >
              <span>{user.username}</span>
              <img
                src={getImageUrl(user.profileImage)}
                alt="profil"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid white"
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "http://localhost:3001/uploads/avatar.png";
                }}
              />
            </div>

            {/* DROPDOWN */}
            {dropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "55px",
                  right: 0,
                  backgroundColor: "white",
                  color: "#333",
                  borderRadius: "5px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  width: "160px",
                  zIndex: 1000
                }}
              >
                <div
                  onClick={() => {
                    navigate("/ProfilePageC");
                    setDropdownOpen(false);
                  }}
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}
                >
                  <FaUser /> Profil
                </div>

                <div
                  onClick={() => {
                    handleLogout();
                    setDropdownOpen(false);
                  }}
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}
                >
                  <FaSignOutAlt /> Déconnexion
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: "30px" }}>{children}</div>
      </div>
    </div>
  );
};

export default SidebarU;