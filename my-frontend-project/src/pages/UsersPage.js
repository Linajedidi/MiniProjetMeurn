import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Modal, Button, Form } from "react-bootstrap";
import { FaSearch, FaUserPlus, FaEdit, FaPowerOff, FaCheck, FaTimes, FaTrash, FaInfoCircle } from "react-icons/fa";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const [currentPage, setCurrentPage] = useState(1); 
  const usersPerPage = 6; 

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "CANDIDAT",
    password: ""
  });

  // Fonction pour afficher les notifications
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/users", {
        params: { search, role: roleFilter }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Erreur fetchUsers:", err);
      showNotification("Erreur lors du chargement des utilisateurs", "error");
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchUsers();
  }, [search, roleFilter]);

  const indexOfLastUser = currentPage * usersPerPage; 
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser); 

  const totalPages = Math.ceil(users.length / usersPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSave = async () => {
    if (!formData.username || !formData.email || (!editingUser && !formData.password)) {
      showNotification("Veuillez remplir tous les champs !", "error");
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
        showNotification(`Utilisateur "${formData.username}" modifié avec succès !`, "success");
      } else {
        await axios.post("http://localhost:3001/api/users", formData);
        showNotification(`Utilisateur "${formData.username}" ajouté avec succès !`, "success");
      }

      setShow(false);
      setEditingUser(null);
      setFormData({ username: "", email: "", role: "CANDIDAT", password: "" });
      fetchUsers();
    } catch (err) {
      console.error("Erreur handleSave:", err);
      showNotification("Impossible d'ajouter/modifier l'utilisateur. Vérifiez les champs.", "error");
    }
  };

  const handleToggleStatus = async (user) => {
    const token = localStorage.getItem("token");
    if (!token) return showNotification("Vous devez être connecté !", "error");

    try {
      const res = await axios.put(
        `http://localhost:3001/api/users/toggle/${user._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === user._id ? { ...u, isActive: res.data.isActive } : u
        )
      );
      if (window.refreshNotif) {
        window.refreshNotif();
      }
      
      const statusMessage = res.data.isActive ? "activé" : "désactivé";
      showNotification(`Utilisateur "${user.username}" ${statusMessage} avec succès !`, "success");
    } catch (err) {
      console.error("Erreur toggle:", err.response?.data || err.message);
      showNotification(err.response?.data?.message || "Impossible de changer le statut de l'utilisateur", "error");
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

  const getRoleBadgeStyle = (role) => {
    switch(role) {
      case 'ADMIN':
        return { background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff' };
      case 'ENTREPRISE':
        return { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff' };
      case 'CANDIDAT':
        return { background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' };
      default:
        return { background: '#e2e8f0', color: '#475569' };
    }
  };

  return (
    <Sidebar>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        .users-container {
          font-family: 'Inter', sans-serif;
          position: relative;
        }
        
        /* Notification Center Styles */
        .notification-center {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 400px;
          animation: slideInRight 0.3s ease;
        }
        
        .notification-toast {
          background: white;
          border-radius: 12px;
          padding: 16px 20px;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
          display: flex;
          align-items: center;
          gap: 12px;
          animation: slideIn 0.3s ease;
          border-left: 4px solid;
        }
        
        .notification-toast.success {
          border-left-color: #10b981;
          background: linear-gradient(135deg, #ffffff, #f0fdf4);
        }
        
        .notification-toast.error {
          border-left-color: #ef4444;
          background: linear-gradient(135deg, #ffffff, #fef2f2);
        }
        
        .notification-toast.info {
          border-left-color: #3b82f6;
          background: linear-gradient(135deg, #ffffff, #eff6ff);
        }
        
        .notification-icon {
          font-size: 20px;
        }
        
        .notification-content {
          flex: 1;
        }
        
        .notification-message {
          font-size: 14px;
          font-weight: 500;
          color: #1f2937;
          margin: 0;
        }
        
        .notification-close {
          cursor: pointer;
          color: #9ca3af;
          font-size: 14px;
          transition: color 0.2s;
        }
        
        .notification-close:hover {
          color: #4b5563;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        .search-input {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 10px 16px 10px 40px;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        
        .filter-select {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 10px 16px;
          font-size: 14px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .filter-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        
        .btn-primary-gradient {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          border: none;
          border-radius: 12px;
          padding: 10px 20px;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .btn-primary-gradient:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(242, 244, 250, 0.3);
        }
        
        .users-table {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
          min-height: 500px;
        }
        
        .users-table table {
          width: 100%;
          border-collapse: collapse;
          height: 100%;
        }
        
        .users-table thead {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
        }
        
        .users-table th {
          padding: 16px 20px;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .users-table td {
          padding: 16px 20px;
          font-size: 14px;
          color: #334155;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }
        
        .users-table tr:hover {
          background: #f8fafc;
        }
        
        .role-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        
        .action-btn {
          border: none;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.2s ease;
          margin-right: 8px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        
        .action-btn:hover {
          transform: translateY(-1px);
        }
        
        .pagination {
          gap: 6px;
        }
        
        .page-link-custom {
          padding: 8px 14px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #475569;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .page-link-custom:hover {
          border-color: #3b82f6;
          color: #3b82f6;
          transform: translateY(-1px);
        }
        
        .page-active {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          border-color: transparent;
          color: white;
        }
        
        .page-active:hover {
          background: linear-gradient(135deg, #1d4ed8, #6d28d9);
          color: white;
        }
        
        .modal-custom .modal-content {
          border-radius: 20px;
          border: none;
          box-shadow: 0 20px 40px rgba(246, 244, 244, 0.1);
        }
        
        .modal-custom .modal-header {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-bottom: 1px solid #e2e8f0;
          border-radius: 20px 20px 0 0;
          padding: 20px 24px;
        }
        
        .modal-custom .modal-title {
          font-weight: 700;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .modal-custom .form-label {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 6px;
        }
        
        .modal-custom .form-control,
        .modal-custom .form-select {
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        
        .modal-custom .form-control:focus,
        .modal-custom .form-select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
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
        }
        
        .btn-cancel:hover {
          background: #e2e8f0;
          color: #475569;
        }
        
        .btn-save {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          border: none;
          border-radius: 10px;
          padding: 10px 20px;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        
        .btn-save:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37,99,235,0.3);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .table-row {
          animation: fadeIn 0.3s ease forwards;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
        }
      `}</style>

      <div className="users-container">
        {/* Notification Center */}
        {notification.show && (
          <div className="notification-center">
            <div className={`notification-toast ${notification.type}`}>
              <div className="notification-icon">
                {notification.type === "success" && <FaCheck style={{ color: '#10b981' }} />}
                {notification.type === "error" && <FaTimes style={{ color: '#ef4444' }} />}
                {notification.type === "info" && <FaInfoCircle style={{ color: '#3b82f6' }} />}
              </div>
              <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
              </div>
              <div 
                className="notification-close"
                onClick={() => setNotification({ show: false, message: "", type: "" })}
              >
                <FaTimes size={14} />
              </div>
            </div>
          </div>
        )}

        {/* Header Section */}
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
            Gestion des Utilisateurs
          </h2>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
            Gérez les comptes utilisateurs, modifiez leurs rôles et activez/désactivez leurs accès
          </p>
        </div>*/}

        {/* Filters Section */}
        <div style={{ 
          display: 'flex', 
          gap: 12, 
          marginBottom: 24,
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <FaSearch style={{ 
              position: 'absolute', 
              left: 14, 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#94a3b8',
              fontSize: 16
            }} />
            <input
              className="search-input"
              style={{ width: '100%' }}
              placeholder="Rechercher ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <select
            className="filter-select"
            style={{ width: 200 }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">Tous les rôles</option>
            <option value="ADMIN">Administrateurs</option>
            <option value="ENTREPRISE">Entreprises</option>
            <option value="CANDIDAT">Candidats</option>
          </select>
          
          <button className="btn-primary-gradient" onClick={openAdd}>
            <FaUserPlus size={14} /> 
            
          </button>
        </div>

        {/* Table Section */}
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ 
                    textAlign: 'center', 
                    verticalAlign: 'middle',
                    height: '400px'
                  }}>
                    <div className="empty-state">
                      <FaSearch size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                      <p style={{ fontSize: '16px', margin: 0 }}>Aucun utilisateur trouvé</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentUsers.map((user, index) => (
                  <tr key={user._id} className="table-row" style={{ animationDelay: `${index * 0.05}s` }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 600,
                          color: '#4338ca'
                        }}>
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#475569' }}>{user.email}</td>
                    <td>
                      <span className="role-badge" style={getRoleBadgeStyle(user.role)}>
                        {user.role === 'ADMIN' ? 'Admin' : user.role === 'ENTREPRISE' ? 'Entreprise' : 'Candidat'}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4px 10px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        background: user.isActive ? '#dcfce7' : '#fee2e2',
                        color: user.isActive ? '#166534' : '#991b1b'
                      }}>
                        {user.isActive ? <FaCheck size={10} /> : <FaTimes size={10} />}
                        {user.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="action-btn"
                        style={{ background: '#eff6ff', color: '#2563eb' }}
                        onClick={() => openEdit(user)}
                      >
                        <FaEdit size={12} /> 
                        
                      </button>
                      <button
                        className="action-btn"
                        style={{ 
                          background: user.isActive ? '#ef808096' : '#dcfce7',
                          color: user.isActive ? '#92400e' : '#166534'
                        }}
                        onClick={() => handleToggleStatus(user)}
                      >
                        <FaPowerOff size={12} />
                      {/*  {user.isActive ? 'Désactiver' : 'Activer'}*/}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {users.length > usersPerPage && (
          <div className="pagination" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginTop: 28 
          }}>
            <button
              className="page-link-custom"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              ← Précédent
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`page-link-custom ${currentPage === index + 1 ? 'page-active' : ''}`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="page-link-custom"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              Suivant →
            </button>
          </div>
        )}

        {/* Modal */}
        <Modal show={show} onHide={() => setShow(false)} className="modal-custom" centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body style={{ padding: '24px' }}>
            <Form>
              <Form.Group style={{ marginBottom: 16 }}>
                <Form.Label>Nom d'utilisateur</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Entrez le nom d'utilisateur"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </Form.Group>

              <Form.Group style={{ marginBottom: 16 }}>
                <Form.Label>Adresse email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="exemple@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Form.Group>

              <Form.Group style={{ marginBottom: 16 }}>
                <Form.Label>Rôle</Form.Label>
                <Form.Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="ADMIN">Administrateur</option>
                  <option value="ENTREPRISE">Entreprise</option>
                  <option value="CANDIDAT">Candidat</option>
                </Form.Select>
              </Form.Group>

              {!editingUser && (
                <Form.Group style={{ marginBottom: 16 }}>
                  <Form.Label>Mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Entrez un mot de passe sécurisé"
                    value={formData.password || ""}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </Form.Group>
              )}
            </Form>
          </Modal.Body>

          <Modal.Footer style={{ padding: '20px 24px', borderTop: '1px solid #e2e8f0' }}>
            <Button className="btn-cancel" onClick={() => setShow(false)}>
              Annuler
            </Button>
            <Button className="btn-save" onClick={handleSave}>
              {editingUser ? "Mettre à jour" : "Créer"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Sidebar>
  );
};

export default UsersPage;