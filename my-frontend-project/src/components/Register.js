import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "CANDIDAT", 
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!formData.username.trim() || !formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs obligatoires");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/users/register",
        formData
      );

      setMessage(response.data.msg || "Inscription réussie ! Vous pouvez maintenant vous connecter.");

      setTimeout(() => {
        navigate("/");
      }, 2200);


    } catch (err) {
      const errorMsg =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "Une erreur est survenue lors de l'inscription";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "420px", width: "100%" }}>
        <h3 className="text-center mb-4 fw-bold">Créer un compte</h3>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              placeholder="Votre nom d'utilisateur"
              value={formData.username}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="exemple@domaine.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="Au moins 6 caractères"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Rôle – optionnel : on peut le laisser caché ou proposer un choix */}
          {/* <div className="mb-3">
            <label htmlFor="role" className="form-label">Je suis :</label>
            <select
              id="role"
              name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="CANDIDAT">Candidat</option>
              <option value="ENTREPRISE">Entreprise</option>
              <option value="ADMIN">Administrateur (réservé)</option>
            </select>
          </div> */}

          <button
            type="submit"
            className="btn btn-primary w-100 mt-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Inscription en cours...
              </>
            ) : (
              "S'inscrire"
            )}
          </button>
        </form>

        {/* Messages */}
        {message && (
          <div className="alert alert-success mt-4 text-center">
            {message}
          </div>
        )}

        {error && (
          <div className="alert alert-danger mt-4 text-center">
            {error}
          </div>
        )}

        <div className="text-center mt-4">
          <p className="text-muted">
            Vous avez déjà un compte ?{" "}
            <Link to="/" className="text-primary fw-bold text-decoration-none">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;