import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import DashboardLayout from "../components/Sidebar";

const BASE_URL = "http://localhost:3001/api/users"; 

const ProfilePage = () => {
  const [user, setUser] = useState({ username: "", email: "", profileImage: "" });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

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

      alert("Image mise à jour avec succès ✓");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors de l'upload de l'image");
    } finally {
      setImageLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user.username.trim() || !user.email.trim()) {
      alert("Nom d'utilisateur et email sont obligatoires");
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
      
      alert("Profil mis à jour avec succès ✓");
    } catch (err) {
      console.error("Erreur mise à jour :", err);
      alert(err.response?.data?.message || "Erreur lors de la mise à jour du profil");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Le nouveau mot de passe doit contenir au moins 6 caractères");
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

      alert("Mot de passe modifié avec succès ✓");
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Erreur changement mot de passe :", err);
      alert(err.response?.data?.message || "Erreur lors du changement de mot de passe");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center mt-5">
          <Spinner animation="border" role="status" />
          <div>Chargement du profil...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mt-4">
        <h2 className="text-center mb-4">Mon Profil</h2>

        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

        <div className="card shadow-sm p-4">
          <div className="text-center mb-4">
            <label style={{ cursor: "pointer" }}>
              <img
                src={previewImage || getImageUrl(user.profileImage)}
                alt="profile"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #1e73be"
                }}
                onError={(e) => {
                  // En cas d'erreur de chargement, on affiche l'avatar par défaut
                  e.target.onerror = null;
                  e.target.src = "http://localhost:3001/uploads/avatar.png";
                }}
              />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageSelect}
              />
            </label>
            <div className="mt-2 text-muted small">
              Cliquez sur l'image pour la modifier
            </div>

            {selectedImage && (
              <div className="mt-3 d-flex justify-content-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCancelImage}
                  disabled={imageLoading}
                >
                  Annuler
                </Button>

                <Button
                  variant="success"
                  size="sm"
                  onClick={handleSaveImage}
                  disabled={imageLoading}
                >
                  {imageLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Sauvegarder l'image"
                  )}
                </Button>
              </div>
            )}
          </div>
          
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nom d'utilisateur</Form.Label>
              <Form.Control
                type="text"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                disabled={updateLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                disabled={updateLoading}
              />
            </Form.Group>

            <div className="d-flex gap-3 mt-4">
              <Button variant="primary" onClick={handleProfileUpdate} disabled={updateLoading}>
                {updateLoading ? <Spinner animation="border" size="sm" /> : "Sauvegarder les modifications"}
              </Button>

              <Button variant="outline-warning" onClick={() => setShowPasswordModal(true)} disabled={passwordLoading}>
                Changer le mot de passe
              </Button>
            </div>
          </Form>
        </div>

        {/* Modal changement mot de passe */}
        <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>Modifier le mot de passe</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Mot de passe actuel</Form.Label>
                <Form.Control
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  disabled={passwordLoading}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nouveau mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  disabled={passwordLoading}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirmer le nouveau mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  disabled={passwordLoading}
                />
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPasswordModal(false)} disabled={passwordLoading}>
              Annuler
            </Button>
            <Button variant="primary" onClick={handleChangePassword} disabled={passwordLoading}>
              {passwordLoading ? <Spinner animation="border" size="sm" /> : "Modifier le mot de passe"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;