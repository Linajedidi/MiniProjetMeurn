import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:3001/users/forgot-password", { email });
      
      if (res.data.success) {
        setMessage(res.data.message);
        setEmail(""); // Vider le champ email
      } else {
        setError(res.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour gérer les erreurs de chargement d'image
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://via.placeholder.com/280x280?text=Mot+de+passe+oublié";
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
              alt="Mot de passe oublié"
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
              Besoin d'aide ?
            </h3>
            <p
              style={{
                color: "#6c757d",
                fontSize: "0.9rem",
                lineHeight: 1.5,
              }}
            >
              Entrez votre email pour recevoir un lien de réinitialisation
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
              Mot de passe oublié
            </h2>
            <p style={{ color: "#6B7280", fontSize: "0.9rem", margin: 0 }}>
              Nous vous enverrons un lien pour réinitialiser votre mot de passe
            </p>
          </div>

          <form onSubmit={handleSubmit}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            {/* Message de succès */}
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

            {/* Message d'erreur */}
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

            {/* Bouton Envoyer */}
            <button
              type="submit"
              disabled={isLoading}
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
                marginBottom: "1rem",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) e.target.style.background = "#1672ce";
              }}
              onMouseLeave={(e) => {
                if (!isLoading) e.target.style.background = "#2D3E50";
              }}
            >
              {isLoading ? (
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
                  Envoi en cours...
                </>
              ) : (
                "Envoyer le lien"
              )}
            </button>

            {/* Bouton Retour */}
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={{
                width: "100%",
                padding: "0.875rem",
                background: "transparent",
                color: "#2D3E50",
                border: "2px solid #E5E7EB",
                borderRadius: "12px",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#F9FAFB";
                e.target.style.borderColor = "#2D3E50";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.borderColor = "#E5E7EB";
              }}
            >
              Retour à la connexion
            </button>
          </form>
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

export default ForgotPassword;