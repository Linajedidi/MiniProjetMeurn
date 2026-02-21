import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import DashboardLayout from "../components/Sidebar";

const ProfilePage = () => {
  const [user, setUser] = useState({
    username: "",
    email: ""
  });

  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Charger les données du profil au montage du composant
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3001/users/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}` // ← important si ton auth utilise token
          }
        });
        setUser({
          username: res.data.username || "",
          email: res.data.email || ""
        });
      } catch (error) {
        console.error("Erreur chargement profil", error);
        alert("Impossible de charger le profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileUpdate = async () => {
    try {
      const res = await axios.put("http://localhost:3001/users/profile", user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      alert("Profil mis à jour ✅");
      
      // Optionnel : mettre à jour localStorage si tu l'utilises ailleurs
      localStorage.setItem("name", res.data.username);
      localStorage.setItem("email", res.data.email);
      
      // Optionnel : mettre à jour l'état avec les données renvoyées
      setUser({
        username: res.data.username,
        email: res.data.email
      });
    } catch (error) {
      alert("Erreur lors de la mise à jour");
      console.error(error);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas ❌");
      return;
    }

    try {
      await axios.put(
        "http://localhost:3001/users/change-password",
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      alert("Mot de passe modifié avec succès ✅");
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Erreur lors du changement de mot de passe");
    }
  };

  if (loading) {
    return <DashboardLayout><div>Chargement du profil...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        Mon Profil
      </h2>

      <div className="card p-4 shadow-sm">
        <Form>
          <Form.Group>
            <Form.Label>Nom d'utilisateur</Form.Label>
            <Form.Control
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </Form.Group>

          <div className="mt-4 d-flex gap-3">
            <Button variant="primary" onClick={handleProfileUpdate}>
              Sauvegarder
            </Button>

            <Button
              variant="warning"
              onClick={() => setShowPasswordModal(true)}
            >
              Changer mot de passe
            </Button>
          </div>
        </Form>
      </div>

      {/* Modal mot de passe – inchangé */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
        {/* ... reste identique ... */}
      </Modal>
    </DashboardLayout>
  );
};

export default ProfilePage;