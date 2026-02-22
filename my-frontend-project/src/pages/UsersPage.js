import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Modal, Button, Form } from "react-bootstrap";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "CANDIDAT",
    password: ""
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/users", {
        params: { search, role: roleFilter }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Erreur fetchUsers:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  // SAVE USER
  const handleSave = async () => {
    if (!formData.username || !formData.email || (!editingUser && !formData.password)) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    try {
      if (editingUser) {
        const updateData = {
          username: formData.username,
          email: formData.email,
          role: formData.role
        };
        await axios.put(`http://localhost:3001/api/users/${editingUser._id}`, updateData);
      } else {
        await axios.post("http://localhost:3001/api/users", formData);
      }

      setShow(false);
      setEditingUser(null);
      setFormData({ username: "", email: "", role: "CANDIDAT", password: "" });
      fetchUsers();
    } catch (err) {
      console.error("Erreur handleSave:", err);
      alert("Impossible d'ajouter/modifier l'utilisateur. Vérifiez les champs.");
    }
  };

  // DELETE USER
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3001/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Erreur handleDelete:", err);
      alert("Impossible de supprimer l'utilisateur.");
    }
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      password: ""
    });
    setShow(true);
  };

  const openAdd = () => {
    setEditingUser(null);
    setFormData({ username: "", email: "", role: "CANDIDAT", password: "" });
    setShow(true);
  };

  return (
    <Sidebar>

      <div className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Recherche..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">Tous les rôles</option>
          <option value="ADMIN">Admin</option>
          <option value="ENTREPRISE">Entreprise</option>
          <option value="CANDIDAT">Candidat</option>
        </select>
        <button className="btn btn-primary" onClick={openAdd}>
          Ajouter
        </button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                Aucun utilisateur trouvé
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => openEdit(user)}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(user._id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingUser ? "Modifier Utilisateur" : "Ajouter Utilisateur"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="ADMIN">Admin</option>
                <option value="ENTREPRISE">Entreprise</option>
                <option value="CANDIDAT">Candidat</option>
              </Form.Select>
            </Form.Group>

            {/* MOT DE PASSE seulement lors de l'ajout */}
            {!editingUser && (
              <Form.Group className="mt-2">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control
                  type="password"
                  value={formData.password || ""}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Entrez un mot de passe"
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Sauvegarder
          </Button>
        </Modal.Footer>
      </Modal>
    </Sidebar>
  );
};

export default UsersPage;