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
    if (!userId) return alert("Utilisateur non identifié");
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
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'import du CV");
    }
  };

  const handleApply = async (offreId) => {
    const candidat = localStorage.getItem("userId");
    if (!candidat) return alert("Utilisateur non identifié");
    try {
      const check = await axios.get(`http://localhost:3001/api/cv/exists/${candidat}`);
      if (!check.data.exists) {
        alert("Veuillez créer ou importer votre CV avant de postuler");
        return;
      }
      await axios.post("http://localhost:3001/api/candidatures", {
        candidat,
        offre: offreId,
        score: 0,
      });
      alert("Candidature envoyée avec succès ✅");
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.msg || "Erreur lors de la postulation";
      alert(message);
    }
  };

  const companyColors = [
    { bg: "#E6F1FB", color: "#185FA5" },
    { bg: "#E1F5EE", color: "#0F6E56" },
    { bg: "#EEEDFE", color: "#534AB7" },
    { bg: "#FBEAF0", color: "#993556" },
    { bg: "#FAEEDA", color: "#854F0B" },
    { bg: "#EAF3DE", color: "#3B6D11" },
  ];

  const getInitials = (title) =>
    title
      ? title.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
      : "??";

  const s = {
    page: {
      minHeight: "100vh",
      backgroundColor: "#f5f5f3",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "28px 32px",
    },
    topbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "24px",
    },
    pageTitle: {
      fontSize: "20px",
      fontWeight: "500",
      color: "#1a1a1a",
      margin: 0,
    },
    pageSub: {
      fontSize: "13px",
      color: "#888",
      marginTop: "3px",
    },
    cvCard: {
      backgroundColor: "white",
      border: "0.5px solid rgba(0,0,0,0.1)",
      borderRadius: "12px",
      padding: "20px 24px",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "14px",
    },
    cvLeft: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
    },
    cvIconBox: {
      width: "42px",
      height: "42px",
      borderRadius: "10px",
      backgroundColor: "#E6F1FB",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      flexShrink: 0,
    },
    cvTitle: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#1a1a1a",
      margin: 0,
    },
    cvSub: {
      fontSize: "12px",
      color: "#888",
      marginTop: "2px",
    },
    cvBtns: {
      display: "flex",
      gap: "10px",
    },
    btnPrimary: {
      padding: "8px 18px",
      borderRadius: "8px",
      border: "none",
      backgroundColor: "#185FA5",
      color: "white",
      fontSize: "13px",
      fontWeight: "500",
      cursor: "pointer",
    },
    btnOutline: {
      padding: "8px 18px",
      borderRadius: "8px",
      border: "0.5px solid rgba(0,0,0,0.2)",
      backgroundColor: "white",
      color: "#444",
      fontSize: "13px",
      fontWeight: "500",
      cursor: "pointer",
    },
    searchWrap: {
      position: "relative",
      marginBottom: "20px",
    },
    searchIcon: {
      position: "absolute",
      left: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      fontSize: "14px",
      color: "#aaa",
      pointerEvents: "none",
    },
    searchInput: {
      width: "100%",
      padding: "10px 14px 10px 36px",
      border: "0.5px solid rgba(0,0,0,0.15)",
      borderRadius: "8px",
      fontSize: "13.5px",
      backgroundColor: "white",
      color: "#1a1a1a",
      outline: "none",
    },
    sectionHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "16px",
    },
    sectionTitle: {
      fontSize: "15px",
      fontWeight: "500",
      color: "#1a1a1a",
      margin: 0,
    },
    countBadge: {
      padding: "3px 10px",
      borderRadius: "20px",
      backgroundColor: "#E6F1FB",
      color: "#0C447C",
      fontSize: "12px",
      fontWeight: "500",
      border: "0.5px solid #B5D4F4",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: "14px",
    },
    offreCard: {
      backgroundColor: "white",
      border: "0.5px solid rgba(0,0,0,0.1)",
      borderRadius: "12px",
      padding: "18px",
      display: "flex",
      flexDirection: "column",
      gap: "0",
      transition: "border-color 0.15s",
      cursor: "default",
    },
    cardTop: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      marginBottom: "12px",
    },
    companyIcon: {
      width: "38px",
      height: "38px",
      borderRadius: "9px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "13px",
      fontWeight: "500",
      flexShrink: 0,
    },
    offreTitre: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#1a1a1a",
      margin: 0,
      lineHeight: "1.3",
    },
    offreLoc: {
      fontSize: "12px",
      color: "#888",
      marginTop: "3px",
    },
    offreDesc: {
      fontSize: "13px",
      color: "#555",
      lineHeight: "1.5",
      overflow: "hidden",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      marginBottom: "14px",
      flexGrow: 1,
    },
    divider: {
      height: "0.5px",
      backgroundColor: "rgba(0,0,0,0.07)",
      margin: "0 0 14px 0",
    },
    cardBtns: {
      display: "flex",
      gap: "8px",
    },
    btnDetail: {
      flex: 1,
      padding: "8px 0",
      borderRadius: "7px",
      border: "0.5px solid rgba(0,0,0,0.15)",
      backgroundColor: "white",
      color: "#444",
      fontSize: "12.5px",
      fontWeight: "500",
      cursor: "pointer",
      textAlign: "center",
    },
    btnApply: {
      flex: 1,
      padding: "8px 0",
      borderRadius: "7px",
      border: "none",
      backgroundColor: "#185FA5",
      color: "white",
      fontSize: "12.5px",
      fontWeight: "500",
      cursor: "pointer",
      textAlign: "center",
    },
    emptyState: {
      textAlign: "center",
      padding: "60px 20px",
      backgroundColor: "white",
      borderRadius: "12px",
      border: "0.5px solid rgba(0,0,0,0.1)",
      color: "#888",
      fontSize: "13.5px",
    },
    loadingState: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#aaa",
      fontSize: "13.5px",
    },
    // Modal overlay using normal flow trick
    modalOverlay: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.35)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modalBox: {
      backgroundColor: "white",
      borderRadius: "14px",
      width: "100%",
      maxWidth: "520px",
      margin: "20px",
      overflow: "hidden",
    },
    modalHeader: {
      padding: "18px 22px",
      borderBottom: "0.5px solid rgba(0,0,0,0.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    modalTitle: {
      fontSize: "15px",
      fontWeight: "500",
      color: "#1a1a1a",
      margin: 0,
    },
    modalClose: {
      width: "28px",
      height: "28px",
      borderRadius: "50%",
      border: "0.5px solid rgba(0,0,0,0.15)",
      backgroundColor: "white",
      cursor: "pointer",
      fontSize: "14px",
      color: "#666",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    modalBody: {
      padding: "20px 22px",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
    },
    modalRow: {
      display: "flex",
      flexDirection: "column",
      gap: "3px",
    },
    modalLabel: {
      fontSize: "11px",
      color: "#aaa",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      fontWeight: "500",
    },
    modalValue: {
      fontSize: "13.5px",
      color: "#1a1a1a",
      lineHeight: "1.5",
    },
    skillsWrap: {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px",
      marginTop: "2px",
    },
    skillPill: {
      padding: "3px 10px",
      borderRadius: "20px",
      backgroundColor: "#E6F1FB",
      color: "#0C447C",
      fontSize: "12px",
      border: "0.5px solid #B5D4F4",
    },
    modalFooter: {
      padding: "14px 22px",
      borderTop: "0.5px solid rgba(0,0,0,0.08)",
      display: "flex",
      justifyContent: "flex-end",
      gap: "10px",
    },
  };

  return (
    <SidebarU>
      <div style={s.page}>

        {/* Header */}
        <div style={s.topbar}>
          <div>
            <h2 style={s.pageTitle}>Bienvenue, {username} !</h2>
            <p style={s.pageSub}>Retrouvez vos offres et gérez votre CV</p>
          </div>
        </div>

        {/* CV Card */}
        <div style={s.cvCard}>
          <div style={s.cvLeft}>
            <div style={s.cvIconBox}>📄</div>
            <div>
              <p style={s.cvTitle}>Mon CV</p>
              <p style={s.cvSub}>Créez ou importez votre CV pour postuler aux offres</p>
            </div>
          </div>
          <div style={s.cvBtns}>
            <button style={s.btnPrimary} onClick={() => navigate("/create-cv")}>
              Créer mon CV
            </button>
            <button
              style={s.btnOutline}
              onClick={() => document.getElementById("cvUpload").click()}
            >
              Importer mon CV
            </button>
            <input
              type="file"
              id="cvUpload"
              accept="application/pdf"
              hidden
              onChange={handleCVUpload}
            />
          </div>
        </div>

        {/* Search */}
        <div style={s.searchWrap}>
          <span style={s.searchIcon}>🔍</span>
          <input
            type="text"
            style={s.searchInput}
            placeholder="Rechercher une offre par titre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Section header */}
        <div style={s.sectionHeader}>
          <h3 style={s.sectionTitle}>Offres disponibles</h3>
          {!loading && (
            <span style={s.countBadge}>
              {offres.length} offre{offres.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Offres */}
        {loading ? (
          <div style={s.loadingState}>Chargement des offres...</div>
        ) : offres.length === 0 ? (
          <div style={s.emptyState}>Aucune offre trouvée pour cette recherche.</div>
        ) : (
          <div style={s.grid}>
            {offres.map((offre, index) => {
              const iconColor = companyColors[index % companyColors.length];
              return (
                <div
                  key={offre._id}
                  style={s.offreCard}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(0,0,0,0.22)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)")
                  }
                >
                  <div style={s.cardTop}>
                    <div
                      style={{
                        ...s.companyIcon,
                        backgroundColor: iconColor.bg,
                        color: iconColor.color,
                      }}
                    >
                      {getInitials(offre.titre)}
                    </div>
                    <div>
                      <p style={s.offreTitre}>{offre.titre}</p>
                      <p style={s.offreLoc}>📍 {offre.localisation}</p>
                    </div>
                  </div>

                  <p style={s.offreDesc}>{offre.description}</p>

                  <div style={s.divider} />

                  <div style={s.cardBtns}>
                    <button
                     style={s.btnDetail}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = "#E1F5EE";
    e.currentTarget.style.borderColor = "#1D9E75";
    e.currentTarget.style.color = "#0F6E56";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = "white";
    e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)";
    e.currentTarget.style.color = "#444";
  }}
  onClick={() => {
    setSelectedOffre(offre);
    setShowModal(true);
  }}
>
  Voir le détail
                    </button>
                    <button
                      style={s.btnApply}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = "#1D9E75";
    e.currentTarget.style.boxShadow = "0 0 0 2px #9FE1CB";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = "#185FA5";
    e.currentTarget.style.boxShadow = "none";
  }}
  onClick={() => handleApply(offre._id)}
>
  Postuler
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedOffre && (
        <div style={s.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h5 style={s.modalTitle}>{selectedOffre.titre}</h5>
              <button style={s.modalClose} onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <div style={s.modalBody}>
              <div style={s.modalRow}>
                <span style={s.modalLabel}>Description</span>
                <span style={s.modalValue}>{selectedOffre.description}</span>
              </div>

              <div style={s.modalRow}>
                <span style={s.modalLabel}>Compétences requises</span>
                {selectedOffre.competences && selectedOffre.competences.length > 0 ? (
                  <div style={s.skillsWrap}>
                    {selectedOffre.competences.map((c, i) => (
                      <span key={i} style={s.skillPill}>{c}</span>
                    ))}
                  </div>
                ) : (
                  <span style={s.modalValue}>Non spécifiées</span>
                )}
              </div>

              <div style={{ display: "flex", gap: "24px" }}>
                <div style={s.modalRow}>
                  <span style={s.modalLabel}>Expérience</span>
                  <span style={s.modalValue}>{selectedOffre.experience || 0} ans</span>
                </div>
                <div style={s.modalRow}>
                  <span style={s.modalLabel}>Niveau</span>
                  <span style={s.modalValue}>{selectedOffre.niveau || "Non spécifié"}</span>
                </div>
              </div>
            </div>

            <div style={s.modalFooter}>
              <button style={s.btnOutline} onClick={() => setShowModal(false)}>
                Fermer
              </button>
              <button
  style={s.btnPrimary}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = "#1D9E75";
    e.currentTarget.style.boxShadow = "0 0 0 2px #9FE1CB";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = "#185FA5";
    e.currentTarget.style.boxShadow = "none";
  }}
  onClick={() => {
    handleApply(selectedOffre._id);
    setShowModal(false);
  }}
>
  Postuler
</button>
            </div>
          </div>
        </div>
      )}
    </SidebarU>
  );
};

export default CandidatHome;