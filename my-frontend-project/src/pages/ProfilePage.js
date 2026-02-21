import React, { useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import DashboardLayout from "../components/Sidebar";

const ProfilePage = () => {
  const [user, setUser] = useState({
    username: localStorage.getItem("name") || "",
    email: localStorage.getItem("email") || ""
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // ✅ Modifier profil
  const handleProfileUpdate = async () => {
    try {
      await axios.put("http://localhost:3001/users/profile", user);
      alert("Profil mis à jour avec succès ✅");
      localStorage.setItem("name", user.username);
      localStorage.setItem("email", user.email);
    } catch (error) {
      alert("Erreur lors de la mise à jour");
    }
  };

  // ✅ Changer mot de passe
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas ❌");
      return;
    }

    try {
      await axios.put("http://localhost:3001/users/change-password", passwordData);
      alert("Mot de passe modifié avec succès ✅");
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      alert("Erreur mot de passe ❌");
    }
  };

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
              onChange={(e) =>
                setUser({ ...user, username: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={user.email}
              onChange={(e) =>
                setUser({ ...user, email: e.target.value })
              }
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

      {/* 🔥 MODAL CHANGER MOT DE PASSE */}
      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Changer mot de passe</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Mot de passe actuel</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Nouveau mot de passe</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Confirmer mot de passe</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPasswordModal(false)}
          >
            Annuler
          </Button>
          <Button variant="primary" onClick={handleChangePassword}>
            Modifier
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
};

export default ProfilePage;