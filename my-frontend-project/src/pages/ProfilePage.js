import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../components/Sidebar";
import { FaUser, FaEnvelope, FaLock, FaCamera, FaSave, FaTimes, FaKey, FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";

const BASE_URL = "http://localhost:3001/api/users"; 

const ProfilePage = () => {
  const [user, setUser] = useState({ username: "", email: "", profileImage: "" });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMsg("Aucun token trouvé. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser({ 
          username: res.data.username, 
          email: res.data.email, 
          profileImage: res.data.profileImage 
        });
        
        localStorage.setItem("name", res.data.username);
        localStorage.setItem("email", res.data.email);
        localStorage.setItem("profileImage", res.data.profileImage || "");
        
        window.dispatchEvent(new Event('storage'));
      } catch (err) {
        console.error("Erreur chargement profil :", err);
        setErrorMsg(err.response?.data?.message || "Impossible de charger le profil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "http://localhost:3001/uploads/avatar.png";
    }
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    if (imagePath === "avatar.png" || imagePath === "uploads/avatar.png") {
      return "http://localhost:3001/uploads/avatar.png";
    }
    
    const cleanPath = imagePath.replace(/^\/+/, '');
    return `http://localhost:3001/${cleanPath}`;
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("L'image ne doit pas dépasser 5 Mo");
      return;
    }

    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleCancelImage = () => {
    setSelectedImage(null);
    setPreviewImage(null);
  };

  const handleSaveImage = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      setImageLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${BASE_URL}/profile/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setUser((prev) => ({
        ...prev,
        profileImage: res.data.profileImage
      }));
      
      localStorage.setItem("profileImage", res.data.profileImage);
      window.dispatchEvent(new Event('storage'));

      setSelectedImage(null);
      setPreviewImage(null);
      setSuccessMsg("Photo de profil mise à jour avec succès !");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Erreur lors de l'upload de l'image");
    } finally {
      setImageLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user.username.trim() || !user.email.trim()) {
      setErrorMsg("Nom d'utilisateur et email sont obligatoires");
      return;
    }

    setUpdateLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Aucun token trouvé");

      const res = await axios.put(
        `${BASE_URL}/profile/update`,
        { username: user.username.trim(), email: user.email.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser((prev) => ({ 
        username: res.data.username, 
        email: res.data.email,
        profileImage: res.data.profileImage || prev.profileImage 
      }));
      
      localStorage.setItem("name", res.data.username);
      localStorage.setItem("email", res.data.email);
      window.dispatchEvent(new Event('storage'));
      
      setSuccessMsg("Profil mis à jour avec succès !");
    } catch (err) {
      console.error("Erreur mise à jour :", err);
      setErrorMsg(err.response?.data?.message || "Erreur lors de la mise à jour du profil");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword) {
      setErrorMsg("Veuillez entrer votre mot de passe actuel");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMsg("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setErrorMsg("Le nouveau mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setPasswordLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Aucun token trouvé");

      await axios.put(
        `${BASE_URL}/profile/change-password`,
        { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMsg("Mot de passe modifié avec succès !");
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Erreur changement mot de passe :", err);
      setErrorMsg(err.response?.data?.message || "Erreur lors du changement de mot de passe");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={styles.loadingContainer}>
          <div className="loader"></div>
          <p style={{ marginTop: 16, color: '#64748b' }}>Chargement du profil...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        .profile-container {
          font-family: 'Inter', sans-serif;
          padding: 20px;
        }
        
        .profile-card {
          background: white;
          border-radius: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }
        
        .profile-header {
          background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
          padding: 30px;
          text-align: center;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .profile-avatar-container {
          position: relative;
          display: inline-block;
          cursor: pointer;
        }
        
        .profile-avatar {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: all 0.2s ease;
        }
        
        .profile-avatar:hover {
          transform: scale(1.02);
          box-shadow: 0 6px 16px rgba(0,0,0,0.15);
        }
        
        .avatar-overlay {
          position: absolute;
          bottom: 5px;
          right: 5px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          border: 2px solid white;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .avatar-overlay:hover {
          transform: scale(1.1);
        }
        
        .profile-body {
          padding: 32px;
        }
        
        .form-label-custom {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .form-control-custom {
          width: 100%;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s ease;
        }
        
        .form-control-custom:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        
        .form-control-custom:disabled {
          background: #f8fafc;
          color: #94a3b8;
        }
        
        .password-input-wrapper {
          position: relative;
        }
        
        .password-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #94a3b8;
          transition: color 0.2s ease;
        }
        
        .password-toggle:hover {
          color: #3b82f6;
        }
        
        .btn-primary-gradient {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          border: none;
          border-radius: 12px;
          padding: 12px 24px;
          font-weight: 600;
          font-size: 14px;
          color: white;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        
        .btn-primary-gradient:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37,99,235,0.3);
        }
        
        .btn-primary-gradient:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .btn-outline-gradient {
          background: transparent;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 24px;
          font-weight: 600;
          font-size: 14px;
          color: #475569;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        
        .btn-outline-gradient:hover:not(:disabled) {
          border-color: #3b82f6;
          color: #3b82f6;
          transform: translateY(-1px);
        }
        
        .btn-cancel {
          background: #f1f5f9;
          border: none;
          border-radius: 10px;
          padding: 10px 20px;
          font-weight: 600;
          font-size: 14px;
          color: #64748b;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .btn-cancel:hover {
          background: #e2e8f0;
          color: #475569;
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
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
        }
        
        .alert-success-custom {
          background: #dcfce7;
          border: 1px solid #bbf7d0;
          color: #166534;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .alert-danger-custom {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #991b1b;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .image-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 16px;
        }
        
        .btn-sm-custom {
          padding: 8px 16px;
          font-size: 13px;
          border-radius: 10px;
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
        
        .modal-content-custom {
          background: white;
          border-radius: 24px;
          width: 500px;
          max-width: 90%;
          max-height: 85vh;
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
        
        .modal-header-custom {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .modal-header-custom h4 {
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
        
        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #94a3b8;
          transition: color 0.2s ease;
        }
        
        .modal-close:hover {
          color: #475569;
        }
        
        .modal-body-custom {
          padding: 24px;
        }
        
        .modal-footer-custom {
          padding: 16px 24px 24px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
      `}</style>

      <div className="profile-container">
        {/*
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ 
            fontSize: 24, 
            fontWeight: 700, 
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 8
          }}>
            Mon Profil
          </h2>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
            Gérez vos informations personnelles et votre mot de passe
          </p>
        </div>*/}

        {errorMsg && (
          <div className="alert-danger-custom">
            <span>⚠️</span> {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="alert-success-custom">
            <FaCheckCircle size={16} /> {successMsg}
          </div>
        )}

        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar-container">
              <img
                src={previewImage || getImageUrl(user.profileImage)}
                alt="profile"
                className="profile-avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "http://localhost:3001/uploads/avatar.png";
                }}
              />
              <label className="avatar-overlay">
                <FaCamera size={14} />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageSelect}
                />
              </label>
            </div>
            <div className="mt-2">
              <span style={{ fontSize: 12, color: '#64748b' }}>Cliquez sur l'icône pour modifier la photo</span>
            </div>

            {selectedImage && (
              <div className="image-actions">
                <button
                  className="btn-cancel btn-sm-custom"
                  onClick={handleCancelImage}
                  disabled={imageLoading}
                >
                  <FaTimes size={12} /> Annuler
                </button>
                <button
                  className="btn-primary-gradient btn-sm-custom"
                  onClick={handleSaveImage}
                  disabled={imageLoading}
                  style={{ padding: '8px 16px' }}
                >
                  {imageLoading ? (
                    <div className="loader" style={{ width: 20, height: 20 }} />
                  ) : (
                    <>
                      <FaSave size={12} /> Sauvegarder
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="profile-body">
            <div style={{ marginBottom: 24 }}>
              <label className="form-label-custom">
                <FaUser size={14} /> Nom d'utilisateur
              </label>
              <input
                type="text"
                className="form-control-custom"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                disabled={updateLoading}
                placeholder="Votre nom d'utilisateur"
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="form-label-custom">
                <FaEnvelope size={14} /> Adresse email
              </label>
              <input
                type="email"
                className="form-control-custom"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                disabled={updateLoading}
                placeholder="votre@email.com"
              />
            </div>

            <div className="d-flex gap-3 mt-4">
              <button 
                className="btn-primary-gradient"
                onClick={handleProfileUpdate} 
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <div className="loader" style={{ width: 20, height: 20 }} />
                ) : (
                  <>
                    <FaSave size={14} /> Sauvegarder les modifications
                  </>
                )}
              </button>

              <button 
                className="btn-outline-gradient"
                onClick={() => setShowPasswordModal(true)} 
                disabled={passwordLoading}
              >
                <FaKey size={14} /> Changer le mot de passe
              </button>
            </div>
          </div>
        </div>

        {/* Modal changement mot de passe - Version personnalisée */}
        {showPasswordModal && (
          <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
            <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-custom">
                <h4>
                  <FaLock size={18} /> Modifier le mot de passe
                </h4>
                <button className="modal-close" onClick={() => setShowPasswordModal(false)}>
                  ✕
                </button>
              </div>

              <div className="modal-body-custom">
                <div style={{ marginBottom: 20 }}>
                  <label className="form-label-custom">
                    Mot de passe actuel
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      className="form-control-custom"
                      placeholder="Entrez votre mot de passe actuel"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      disabled={passwordLoading}
                    />
                    <span 
                      className="password-toggle"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label className="form-label-custom">
                    Nouveau mot de passe
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="form-control-custom"
                      placeholder="Minimum 6 caractères"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      disabled={passwordLoading}
                    />
                    <span 
                      className="password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label className="form-label-custom">
                    Confirmer le nouveau mot de passe
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control-custom"
                      placeholder="Retapez votre nouveau mot de passe"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      disabled={passwordLoading}
                    />
                    <span 
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </span>
                  </div>
                </div>
              </div>

              <div className="modal-footer-custom">
                <button className="btn-cancel" onClick={() => setShowPasswordModal(false)} disabled={passwordLoading}>
                  Annuler
                </button>
                <button className="btn-primary-gradient" onClick={handleChangePassword} disabled={passwordLoading}>
                  {passwordLoading ? (
                    <div className="loader" style={{ width: 20, height: 20 }} />
                  ) : (
                    <>
                      <FaKey size={14} /> Modifier
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px'
  }
};

export default ProfilePage;