import React, { useState, useEffect } from "react";
import axios from "axios";
import SidebarEntrep from "../components/SidebarEntrep";
import { Modal, Button, Form, Spinner } from "react-bootstrap";

const BASE_URL = "http://localhost:3001/api/users";

const ProfileEntreprise = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    profileImage: ""
  });

  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(res.data);

        localStorage.setItem("name", res.data.username);
        localStorage.setItem("profileImage", res.data.profileImage || "");

      } catch (err) {
        console.error("Erreur chargement profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "http://localhost:3001/uploads/avatar.png";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:3001/${imagePath.replace(/^\/+/, "")}`;
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
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

      setUser(prev => ({
        ...prev,
        profileImage: res.data.profileImage
      }));

      localStorage.setItem("profileImage", res.data.profileImage);
      setSelectedImage(null);
      setPreviewImage(null);

      alert("Image mise à jour ✓");

    } catch (err) {
      alert("Erreur upload image");
    } finally {
      setImageLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${BASE_URL}/profile/update`,
        {
          username: user.username,
          email: user.email
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Profil mis à jour ✓");

    } catch (err) {
      alert("Erreur mise à jour");
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${BASE_URL}/profile/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Mot de passe modifié ✓");
      setShowPasswordModal(false);

    } catch (err) {
      alert("Erreur changement mot de passe");
    }
  };

  if (loading) {
    return (
      <SidebarEntrep>
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Spinner animation="border" />
        </div>
      </SidebarEntrep>
    );
  }

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#f0f0f0",
    marginTop: "8px"
  };

  return (
    <SidebarEntrep>
      <div style={{ padding: "40px" }}>

        <h2 style={{ fontWeight: "bold", marginBottom: "30px" }}>
          Mon Profil
        </h2>

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "40px"
        }}>

          <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
            <label style={{ cursor: "pointer" }}>
              <img
                src={previewImage || getImageUrl(user.profileImage)}
                alt="profile"
                style={{
                  width: "130px",
                  height: "130px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "4px solid #1e73be"
                }}
              />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageSelect}
              />
            </label>

            <div>
              <h3 style={{ margin: 0, fontWeight: "bold" }}>
                {user.username}
              </h3>
              <span style={{ color: "#777" }}>Entreprise</span>

              {selectedImage && (
                <div style={{ marginTop: "10px" }}>
                  <Button size="sm" onClick={handleSaveImage} disabled={imageLoading}>
                    {imageLoading ? "Upload..." : "Sauvegarder image"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleProfileUpdate}
            style={{
              backgroundColor: "#1e73be",
              color: "white",
              border: "none",
              padding: "8px 18px",
              borderRadius: "20px",
              cursor: "pointer"
            }}
          >
            ✏ Edit
          </button>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
          maxWidth: "800px"
        }}>

          <div>
            <label>Nom*</label>
            <input
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div>
            <label>Email*</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{
          marginTop: "50px",
          borderTop: "1px solid #ddd",
          paddingTop: "30px",
          maxWidth: "800px"
        }}>
          <h5>Sécurité du compte</h5>

          <button
            onClick={() => setShowPasswordModal(true)}
            style={{
              backgroundColor: "#1e73be",
              color: "white",
              border: "none",
              padding: "8px 18px",
              borderRadius: "20px",
              cursor: "pointer"
            }}
          >
            Modifier mot de passe
          </button>
        </div>

        {/* MODAL */}
        <Modal
          show={showPasswordModal}
          onHide={() => setShowPasswordModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Modifier le mot de passe</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <Form.Control
                type="password"
                placeholder="Mot de passe actuel"
                className="mb-2"
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
              />
              <Form.Control
                type="password"
                placeholder="Nouveau mot de passe"
                className="mb-2"
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
              />
              <Form.Control
                type="password"
                placeholder="Confirmer mot de passe"
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
              />
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={handleChangePassword}>
              Valider
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    </SidebarEntrep>
  );
};

export default ProfileEntreprise;