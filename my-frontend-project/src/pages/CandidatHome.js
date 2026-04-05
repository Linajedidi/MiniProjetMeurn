
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarU from "../components/SidebarU";

const CandidatHome = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("name") || "Candidat";

  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState(null);
  
  // État pour la notification toast
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Fonction pour afficher une notification
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "CANDIDAT") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const fetchOffres = async (search = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3001/api/offres-candidat", {
        params: { search },
        headers: { Authorization: `Bearer ${token}` },
      });
      setOffres(res.data);
    } catch (error) {
      console.error("Erreur chargement offres :", error);
      showToast("Erreur lors du chargement des offres", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffres();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOffres(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const userId = localStorage.getItem("userId");
    if (!userId) {
      showToast("Utilisateur non identifié", "error");
      return;
    }
    try {
      const check = await axios.get(`http://localhost:3001/api/cv/exists/${userId}`);
      if (check.data.exists) {
        const confirmReplace = window.confirm(
          "Vous avez déjà un CV enregistré.\nVoulez-vous le remplacer ?"
        );
        if (!confirmReplace) return;
      }
      const formData = new FormData();
      formData.append("cv", file);
      formData.append("userId", userId);
      const res = await axios.post("http://localhost:3001/api/cv/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast(res.data.message || "CV importé avec succès", "success");
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de l'import du CV", "error");
    }
  };

  const handleApply = async (offreId) => {
    const candidat = localStorage.getItem("userId");
    if (!candidat) {
      showToast("Utilisateur non identifié", "error");
      return;
    }
    try {
      const check = await axios.get(`http://localhost:3001/api/cv/exists/${candidat}`);
      if (!check.data.exists) {
        showToast("Veuillez créer ou importer votre CV avant de postuler", "warning");
        return;
      }
      await axios.post("http://localhost:3001/api/candidatures", {
        candidat,
        offre: offreId,
        score: 0,
      });
      showToast("Candidature envoyée avec succès ✅", "success");
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.msg || "Erreur lors de la postulation";
      showToast(message, "error");
    }
  };

  const companyColors = [
    { bg: "#f0fdf4", color: "#166534" },
    { bg: "#eff6ff", color: "#1e40af" },
    { bg: "#fef3c7", color: "#92400e" },
    { bg: "#fce7f3", color: "#9d174d" },
    { bg: "#f3e8ff", color: "#6b21a5" },
    { bg: "#ffe4e6", color: "#9f1239" },
  ];

  const getInitials = (title) =>
    title
      ? title.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
      : "??";

  // Styles pour les différentes couleurs de toast
  const toastColors = {
    success: { bg: "#d1fae5", border: "#10b981", text: "#065f46", icon: "✅" },
    error: { bg: "#fee2e2", border: "#ef4444", text: "#991b1b", icon: "❌" },
    warning: { bg: "#fef3c7", border: "#f59e0b", text: "#92400e", icon: "⚠️" },
  };

  return (
    <SidebarU>
      <div style={{ padding: "32px", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        
        {/* Toast Notification */}
        {toast.show && (
          <div
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              zIndex: 9999,
              animation: "slideInRight 0.3s ease"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 20px",
                backgroundColor: toastColors[toast.type].bg,
                borderLeft: `4px solid ${toastColors[toast.type].border}`,
                borderRadius: "12px",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.02)",
                minWidth: "280px",
                maxWidth: "380px"
              }}
            >
              <span style={{ fontSize: "20px" }}>{toastColors[toast.type].icon}</span>
              <span style={{ fontSize: "13px", fontWeight: "500", color: toastColors[toast.type].text, flex: 1 }}>
                {toast.message}
              </span>
              <button
                onClick={() => setToast({ show: false, message: "", type: "success" })}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: toastColors[toast.type].text,
                  opacity: 0.6
                }}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Titre de la page */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>
            Bonjour, {username} 
          </h1>
          <p style={{ margin: "8px 0 0", fontSize: "15px", color: "#64748b" }}>
            Trouvez l'opportunité qui correspond à vos ambitions
          </p>
        </div>

        {/* Section CV */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            padding: "20px 28px",
            marginBottom: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            border: "1px solid #e2e8f0"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "16px",
                backgroundColor: "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px"
              }}
            >
              📄
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#0f172a" }}>
                Mon CV
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>
                Créez ou importez votre CV pour postuler
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => navigate("/create-cv")}
              style={{
                padding: "10px 22px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #6d28d9, #1d4ed8)";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(124,58,237,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #7c3aed, #2563eb)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "translateY(1px)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
            >
              Créer mon CV
            </button>
            <button
              onClick={() => document.getElementById("cvUpload").click()}
              style={{
                padding: "10px 22px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#ffffff",
                color: "#475569",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f8fafc";
                e.currentTarget.style.borderColor = "#7c3aed";
                e.currentTarget.style.color = "#7c3aed";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.borderColor = "#cbd5e1";
                e.currentTarget.style.color = "#475569";
              }}
            >
              Importer mon CV
            </button>
            <input type="file" id="cvUpload" accept="application/pdf" hidden onChange={handleCVUpload} />
          </div>
        </div>

        {/* Barre de recherche */}
        <div style={{ marginBottom: "32px" }}>
          <input
            type="text"
            placeholder="Rechercher une offre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 20px",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              fontSize: "14px",
              backgroundColor: "#ffffff",
              color: "#0f172a",
              outline: "none",
              transition: "all 0.2s"
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#7c3aed";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* En-tête des offres */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: "20px"
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#0f172a" }}>
              Offres disponibles
            </h2>
          </div>
          {!loading && offres.length > 0 && (
            <span style={{ fontSize: "13px", color: "#64748b" }}>
              {offres.length} résultat{offres.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Contenu principal */}
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px",
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              border: "1px solid #e2e8f0"
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>⏳</div>
            <p style={{ color: "#64748b", margin: 0 }}>Chargement des offres...</p>
          </div>
        ) : offres.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px",
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              border: "1px solid #e2e8f0"
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: "600", color: "#0f172a" }}>
              Aucune offre trouvée
            </h3>
            <p style={{ margin: 0, color: "#64748b" }}>Essayez de modifier votre recherche</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "20px"
            }}
          >
            {offres.map((offre, index) => {
              const iconColor = companyColors[index % companyColors.length];

              return (
                <div
                  key={offre._id}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "20px",
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                    transition: "all 0.25s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px -12px rgba(124,58,237,0.15)";
                    e.currentTarget.style.borderColor = "#cbd5e1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "#e2e8f0";
                  }}
                >
                  <div style={{ padding: "20px" }}>
                    {/* En-tête de la carte */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "14px",
                          backgroundColor: iconColor.bg,
                          color: iconColor.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "15px",
                          fontWeight: "600"
                        }}
                      >
                        {getInitials(offre.titre)}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: "#0f172a" }}>
                          {offre.titre}
                        </h3>
                        <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#94a3b8" }}>
                           {offre.localisation}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#475569",
                        lineHeight: "1.5",
                        margin: "0 0 16px 0",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}
                    >
                      {offre.description}
                    </p>

                    {/* Infos complémentaires */}
                    <div
                      style={{
                        display: "flex",
                        gap: "16px",
                        padding: "12px 0",
                        borderTop: "1px solid #f1f5f9",
                        borderBottom: "1px solid #f1f5f9",
                        marginBottom: "16px",
                        fontSize: "12px",
                        color: "#64748b"
                      }}
                    >
                      <span> {offre.experience || 0} ans exp.</span>
                      <span> {offre.niveau || "Non spécifié"}</span>
                    </div>

                    {/* Boutons */}
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button
                        onClick={() => {
                          setSelectedOffre(offre);
                          setShowModal(true);
                        }}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "12px",
                          border: "1px solid #cbd5e1",
                          backgroundColor: "#ffffff",
                          color: "#475569",
                          fontSize: "13px",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#f8fafc";
                          e.currentTarget.style.borderColor = "#7c3aed";
                          e.currentTarget.style.color = "#7c3aed";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#ffffff";
                          e.currentTarget.style.borderColor = "#cbd5e1";
                          e.currentTarget.style.color = "#475569";
                        }}
                      >
                        Détails
                      </button>
                      <button
                        onClick={() => handleApply(offre._id)}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "12px",
                          border: "none",
                          background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                          color: "#ffffff",
                          fontSize: "13px",
                          fontWeight: "500",
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "linear-gradient(135deg, #6d28d9, #1d4ed8)";
                          e.currentTarget.style.transform = "translateY(-1px)";
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(124,58,237,0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "linear-gradient(135deg, #7c3aed, #2563eb)";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        onMouseDown={(e) => {
                          e.currentTarget.style.transform = "translateY(1px)";
                        }}
                        onMouseUp={(e) => {
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                      >
                        Postuler
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedOffre && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            animation: "fadeIn 0.2s ease"
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "520px",
              margin: "20px",
              overflow: "hidden",
              animation: "slideUp 0.3s ease"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header avec dégradé */}
            <div
              style={{
                background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                padding: "24px",
                color: "white"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>
                  {selectedOffre.titre}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "18px",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)";
                  }}
                >
                  ✕
                </button>
              </div>
              <p style={{ margin: "12px 0 0", fontSize: "14px", opacity: 0.9 }}>
                 {selectedOffre.localisation}
              </p>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px" }}>
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: "600", color: "#64748b" }}>
                  Description
                </h4>
                <p style={{ margin: 0, fontSize: "14px", color: "#475569", lineHeight: "1.6" }}>
                  {selectedOffre.description}
                </p>
              </div>

              {selectedOffre.competences && selectedOffre.competences.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <h4 style={{ margin: "0 0 10px", fontSize: "13px", fontWeight: "600", color: "#64748b" }}>
                    Compétences requises
                  </h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {selectedOffre.competences.map((c, i) => (
                      <span
                        key={i}
                        style={{
                          padding: "4px 12px",
                          borderRadius: "20px",
                          backgroundColor: "#f3e8ff",
                          color: "#7c3aed",
                          fontSize: "12px",
                          fontWeight: "500"
                        }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  padding: "16px 0",
                  borderTop: "1px solid #f1f5f9",
                  borderBottom: "1px solid #f1f5f9",
                  marginBottom: "24px"
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Expérience</div>
                  <div style={{ fontSize: "14px", fontWeight: "500", color: "#0f172a" }}>
                    {selectedOffre.experience || 0} ans
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>Niveau</div>
                  <div style={{ fontSize: "14px", fontWeight: "500", color: "#0f172a" }}>
                    {selectedOffre.niveau || "Non spécifié"}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "14px",
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#ffffff",
                    color: "#475569",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f8fafc";
                    e.currentTarget.style.borderColor = "#7c3aed";
                    e.currentTarget.style.color = "#7c3aed";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.borderColor = "#cbd5e1";
                    e.currentTarget.style.color = "#475569";
                  }}
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    handleApply(selectedOffre._id);
                    setShowModal(false);
                  }}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "14px",
                    border: "none",
                    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, #6d28d9, #1d4ed8)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(124,58,237,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, #7c3aed, #2563eb)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = "translateY(1px)";
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                >
                  Postuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(100px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
    </SidebarU>
  );
};

export default CandidatHome; 
