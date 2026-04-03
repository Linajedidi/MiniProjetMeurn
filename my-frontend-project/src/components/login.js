import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

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
      localStorage.setItem("userId", res.data._id);
      localStorage.setItem("name", res.data.username);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("userId", res.data._id);
      localStorage.setItem("profileImage",res.data.profileImage|| "");

    // notifier toute l'app (SidebarU)
    window.dispatchEvent(new Event("userUpdated"));
      setMessage(`Bienvenue ${res.data.username} !`);

      switch (res.data.role) {
        case "ADMIN":
          navigate("/pages/AdminDashboard");
          break;
        case "CANDIDAT":
          navigate("/candidate-home");
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
              alt="Illustration de connexion"
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
              Bienvenue
            </h3>
            <p
              style={{
                color: "#6c757d",
                fontSize: "0.9rem",
                lineHeight: 1.5,
              }}
            >
              Connectez-vous pour accéder à votre espace personnel
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
              Connexion
            </h2>
            <p style={{ color: "#6B7280", fontSize: "0.9rem", margin: 0 }}>
              Entrez vos identifiants pour continuer
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

            {/* Champ Mot de passe */}
            <div style={{ marginBottom: "1rem" }}>
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
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
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

            {/* Lien Mot de passe oublié */}
            <div style={{ textAlign: "right", marginBottom: "1.75rem" }}>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: "0.8rem",
                  color: "#2D3E50",
                  textDecoration: "none",
                  fontWeight: 600,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.target.style.opacity = "1")}
              >
                Mot de passe oublié ? <strong>CLIQUEZ ICI</strong>
              </Link>
            </div>

            {/* Bouton Connexion */}
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
                marginBottom: "1.5rem",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) e.target.style.background = "#1672ce";
              }}
              onMouseLeave={(e) => {
                if (!isLoading) e.target.style.background = "#1672ce";
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
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
<GoogleLogin
  onSuccess={async (credentialResponse) => {
    try {
      if (!credentialResponse || !credentialResponse.credential) {
        alert("Impossible de récupérer le token Google.");
        return;
      }

      // Affiche l'objet complet pour debug
      console.log(
        "Google credentialResponse complet :",
        JSON.stringify(credentialResponse, null, 2)
      );

      // Envoie le token au backend pour login / fusion
      const res = await axios.post("http://localhost:3001/auth/google", {
        tokenId: credentialResponse.credential,
      });

      // Sauvegarde les infos dans localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data._id);
      localStorage.setItem("name", res.data.username);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("profileImage", res.data.profileImage || "");

      // Notifier l'app pour mise à jour
      window.dispatchEvent(new Event("userUpdated"));

      // Redirection selon rôle
      switch (res.data.role) {
        case "CANDIDAT":
          navigate("/candidate-home");
          break;
        case "ENTREPRISE":
          navigate("/pages/EntrepriseHome");
          break;
        case "ADMIN":
          navigate("/pages/AdminDashboard");
          break;
        default:
          navigate("/home");
      }
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.msg ||
          "Erreur lors de la connexion Google. Si l'email existe déjà, votre compte sera fusionné automatiquement si configuré côté serveur."
      );
    }
  }}
  onError={() => alert("Échec connexion Google")}
/>

            {/* Message d'erreur/succès */}
            {message && (
              <div
                style={{
                  padding: "0.875rem",
                  borderRadius: "12px",
                  textAlign: "center",
                  fontSize: "0.85rem",
                  marginBottom: "1rem",
                  background: message.includes("Bienvenue") 
                    ? "#D1FAE5" 
                    : "#FEE2E2",
                  color: message.includes("Bienvenue") 
                    ? "#065F46" 
                    : "#991B1B",
                  border: `1px solid ${
                    message.includes("Bienvenue") ? "#A7F3D0" : "#FECACA"
                  }`,
                }}
              >
                {message}
              </div>
            )}
          </form>

          {/* Lien Créer un compte */}
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#6B7280", fontSize: "0.85rem", margin: 0 }}>
              Pas encore de compte ?{" "}
              <a
                href="/register"
                style={{
                  color: "#2D3E50",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.target.style.opacity = "1")}
              >
                Créer un compte
              </a>
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

export default Login;