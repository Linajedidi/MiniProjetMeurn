import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:3001/users/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.username);
      localStorage.setItem("role", res.data.role);
      //localStorage.setItem("email", res.data.email);

      setMessage(`Bienvenue ${res.data.username} !`);

      // Redirection selon rôle (majuscules comme dans la base)
      switch (res.data.role) {
        case "ADMIN":
          navigate("/pages/AdminDashboard");
          break;
        case "CANDIDAT":
          navigate("/pages/CandidatHome");
          break;
        case "ENTREPRISE":
          navigate("/pages/EntrepriseHome");
          break;
        default:
          navigate("/home");
      }
    } catch (error) {
      setMessage(error.response?.data?.msg || "Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "1rem",
      }}
    >
      <div
        className="card shadow-lg border-0 rounded-4 overflow-hidden"
        style={{
          maxWidth: "420px",
          width: "100%",
          background: "#ffffff",
          borderRadius: "16px",
        }}
      >
        {/* Header Material-like */}
        <div
          className="p-4 text-white text-center"
          style={{
            background: "linear-gradient(90deg, #3f51b5 0%, #5c6bc0 100%)",
          }}
        >
          <h4 className="mb-1 fw-semibold">Bienvenue</h4>
          <p className="mb-0 opacity-75">Connectez-vous à votre compte</p>
        </div>

        <div className="card-body p-4 p-md-5">
          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="form-label fw-medium text-muted">
                Adresse e-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control form-control-lg rounded-3"
                placeholder="exemple@domaine.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoFocus
                style={{
                  border: "1px solid #d1d9e6",
                  transition: "all 0.2s",
                }}
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-medium text-muted">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control form-control-lg rounded-3"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  border: "1px solid #d1d9e6",
                  transition: "all 0.2s",
                }}
              />
            </div>

            {/* Bouton Material-like */}
            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold shadow-sm"
              disabled={isLoading}
              style={{
                background: "#3f51b5",
                border: "none",
                padding: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                transition: "all 0.3s",
              }}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </button>

            {/* Message */}
            {message && (
              <div
                className={`alert mt-4 text-center ${
                  message.includes("Bienvenue") ? "alert-success" : "alert-danger"
                }`}
                role="alert"
                style={{ borderRadius: "8px" }}
              >
                {message}
              </div>
            )}
          </form>

          {/* Lien inscription */}
          <div className="text-center mt-4">
            <p className="text-muted mb-0">
              Pas encore de compte ?{" "}
              <a
                href="/register"
                className="text-primary fw-medium text-decoration-none"
                style={{ color: "#3f51b5" }}
              >
                Créer un compte
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;