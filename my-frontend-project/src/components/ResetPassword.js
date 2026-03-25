import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [verifying, setVerifying] = useState(true);

  // Vérifier la validité du token
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/users/verify-reset-token/${token}`);
        
        if (response.data.valid) {
          setValidToken(true);
        } else {
          setError("Ce lien de réinitialisation est invalide ou a expiré.");
        }
      } catch (err) {
        setError("Ce lien de réinitialisation est invalide ou a expiré.");
      } finally {
        setVerifying(false);
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(`http://localhost:3001/users/reset-password/${token}`, {
        password,
        confirmPassword
      });
      
      if (response.data.success) {
        setMessage(response.data.message);
        // Redirection après 3 secondes
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(response.data.message);
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
    e.target.src = "https://via.placeholder.com/280x280?text=Réinitialisation+mot+de+passe";
  };

  if (verifying) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "3px solid #f3f3f3",
              borderTop: "3px solid #2D3E50",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          />
          <p style={{ color: "#6B7280" }}>Vérification du lien...</p>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  if (!validToken) {
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
            maxWidth: "500px",
            width: "100%",
            background: "white",
            borderRadius: "32px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
            padding: "2.5rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "#FEE2E2",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <span style={{ fontSize: "40px" }}>⚠️</span>
          </div>
          <h2 style={{ color: "#1F2937", marginBottom: "10px" }}>Lien invalide</h2>
          <p style={{ color: "#6B7280", marginBottom: "30px" }}>
            {error || "Ce lien de réinitialisation est invalide ou a expiré."}
          </p>
          <button
            onClick={() => navigate("/forgot-password")}
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
            }}
            onMouseEnter={(e) => (e.target.style.background = "#1672ce")}
            onMouseLeave={(e) => (e.target.style.background = "#2D3E50")}
          >
            Demander un nouveau lien
          </button>
        </div>
      </div>
    );
  }

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
              alt="Réinitialisation mot de passe"
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
              Nouveau mot de passe
            </h3>
            <p
              style={{
                color: "#6c757d",
                fontSize: "0.9rem",
                lineHeight: 1.5,
              }}
            >
              Choisissez un mot de passe sécurisé
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
              Réinitialisation
            </h2>
            <p style={{ color: "#6B7280", fontSize: "0.9rem", margin: 0 }}>
              Entrez votre nouveau mot de passe
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Champ Nouveau mot de passe */}
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
                Nouveau mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {/* Champ Confirmer mot de passe */}
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
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                <div style={{ marginTop: "8px", fontSize: "0.75rem" }}>
                  Redirection vers la page de connexion...
                </div>
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

            {/* Bouton Réinitialiser */}
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
                  Réinitialisation...
                </>
              ) : (
                "Réinitialiser le mot de passe"
              )}
            </button>
          </form>
        </div>
      </div>

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

export default ResetPassword;