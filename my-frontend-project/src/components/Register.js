import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CANDIDAT",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // États pour afficher/masquer les mots de passe
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    if (!formData.username.trim() || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Veuillez remplir tous les champs obligatoires");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/users/register",
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }
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

  // Fonction pour gérer les erreurs de chargement d'image
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://via.placeholder.com/280x280?text=Image+non+trouvée";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          width: "100%",
          background: "white",
          borderRadius: "32px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
        }}
      >
        {/* Section Image - Côté gauche */}
        <div
          style={{
            flex: 1,
            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
            padding: "2.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Décoration de fond */}
          <div
            style={{
              position: "absolute",
              top: "-20%",
              right: "-20%",
              width: "250px",
              height: "250px",
              background: "rgba(0,0,0,0.02)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-15%",
              left: "-15%",
              width: "200px",
              height: "200px",
              background: "rgba(0,0,0,0.02)",
              borderRadius: "50%",
            }}
          />
          
          {/* Espace pour l'image */}
          <div
            style={{
              width: "100%",
              maxWidth: "280px",
              height: "auto",
              textAlign: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <img
              src="http://localhost:3001/uploads/login.jpg"
              alt="Illustration d'inscription"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "20px",
                display: "block",
                objectFit: "cover",
              }}
              onError={handleImageError}
            />
            <h3
              style={{
                color: "#2D3E50",
                fontSize: "1.5rem",
                fontWeight: 600,
                marginTop: "1.5rem",
                marginBottom: "0.5rem",
              }}
            >
              Inscription
            </h3>
            <p
              style={{
                color: "#6c757d",
                fontSize: "0.9rem",
                lineHeight: 1.5,
              }}
            >
              Créez votre compte pour commencer
            </p>
          </div>
        </div>

        {/* Section Formulaire - Côté droit */}
        <div style={{ flex: 1, padding: "2.5rem" }}>
          <div style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "#1F2937",
                marginBottom: "0.5rem",
                letterSpacing: "-0.3px",
              }}
            >
              Créer un compte
            </h2>
            <p style={{ color: "#6B7280", fontSize: "0.9rem", margin: 0 }}>
              Remplissez vos informations pour vous inscrire
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Champ Nom d'utilisateur */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                htmlFor="username"
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                Nom d'utilisateur
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Votre nom d'utilisateur"
                value={formData.username}
                onChange={handleChange}
                required
                autoFocus
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  fontSize: "0.95rem",
                  border: "2px solid #E5E7EB",
                  borderRadius: "12px",
                  outline: "none",
                  transition: "all 0.2s",
                  background: "#F9FAFB",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#2D3E50";
                  e.target.style.background = "white";
                }}
                onBlur={(e) => {
                  if (!e.target.value) {
                    e.target.style.borderColor = "#E5E7EB";
                    e.target.style.background = "#F9FAFB";
                  }
                }}
              />
            </div>

            {/* Champ Email */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="exemple@domaine.com"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  fontSize: "0.95rem",
                  border: "2px solid #E5E7EB",
                  borderRadius: "12px",
                  outline: "none",
                  transition: "all 0.2s",
                  background: "#F9FAFB",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#2D3E50";
                  e.target.style.background = "white";
                }}
                onBlur={(e) => {
                  if (!e.target.value) {
                    e.target.style.borderColor = "#E5E7EB";
                    e.target.style.background = "#F9FAFB";
                  }
                }}
              />
            </div>

            {/* Champ Mot de passe avec icône œil */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                Mot de passe
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Au moins 6 caractères"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.875rem 2.5rem 0.875rem 1rem",
                    fontSize: "0.95rem",
                    border: "2px solid #E5E7EB",
                    borderRadius: "12px",
                    outline: "none",
                    transition: "all 0.2s",
                    background: "#F9FAFB",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#2D3E50";
                    e.target.style.background = "white";
                  }}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      e.target.style.borderColor = "#E5E7EB";
                      e.target.style.background = "#F9FAFB";
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#9CA3AF",
                  }}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Champ Confirmer mot de passe avec icône œil */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                htmlFor="confirmPassword"
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                Confirmer le mot de passe
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirmez votre mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.875rem 2.5rem 0.875rem 1rem",
                    fontSize: "0.95rem",
                    border: "2px solid #E5E7EB",
                    borderRadius: "12px",
                    outline: "none",
                    transition: "all 0.2s",
                    background: "#F9FAFB",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#2D3E50";
                    e.target.style.background = "white";
                  }}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      e.target.style.borderColor = "#E5E7EB";
                      e.target.style.background = "#F9FAFB";
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#9CA3AF",
                  }}
                >
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Bouton Inscription */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.875rem",
                background: "#2D3E50",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                marginBottom: "1.5rem",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.background = "#1672ce";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.background = "#1672ce";
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      display: "inline-block",
                      width: "16px",
                      height: "16px",
                      border: "2px solid white",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 0.6s linear infinite",
                      marginRight: "8px",
                    }}
                  />
                  Inscription en cours...
                </>
              ) : (
                "S'inscrire"
              )}
            </button>

            {/* Messages */}
            {message && (
              <div
                style={{
                  padding: "0.875rem",
                  borderRadius: "12px",
                  textAlign: "center",
                  fontSize: "0.85rem",
                  marginBottom: "1rem",
                  background: "#D1FAE5",
                  color: "#065F46",
                  border: "1px solid #A7F3D0",
                }}
              >
                {message}
              </div>
            )}

            {error && (
              <div
                style={{
                  padding: "0.875rem",
                  borderRadius: "12px",
                  textAlign: "center",
                  fontSize: "0.85rem",
                  marginBottom: "1rem",
                  background: "#FEE2E2",
                  color: "#991B1B",
                  border: "1px solid #FECACA",
                }}
              >
                {error}
              </div>
            )}
          </form>

          {/* Lien Se connecter */}
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#6B7280", fontSize: "0.85rem", margin: 0 }}>
              Vous avez déjà un compte ?{" "}
              <Link
                to="/login"
                style={{
                  color: "#2D3E50",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.target.style.opacity = "1")}
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Animation pour le spinner */}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Register;