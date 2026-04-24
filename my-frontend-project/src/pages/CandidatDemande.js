
import React, { useEffect, useState } from "react";
import Sidebar from "../components/SidebarU";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBriefcase } from "react-icons/fa";

const DemandeC = () => {
  const navigate = useNavigate();
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    if (!token || role !== "CANDIDAT") {
      navigate("/", { replace: true });
      return;
    }

    const fetchDemandes = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/candidatures/public");
        const mesDemandes = res.data.filter((d) => d.candidat?._id === userId);
        setDemandes(mesDemandes);
      } catch (err) {
        console.error("Erreur chargement demandes :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDemandes();
  }, [navigate]);

  const map = new Map();
  demandes.forEach((d) => {
    const offreId = d.offre?._id;
    if (!map.has(offreId)) {
      map.set(offreId, d);
    } else {
      const existing = map.get(offreId);
      if ((d.score ?? 0) > (existing.score ?? 0)) {
        map.set(offreId, d);
      }
    }
  });
  const unique = Array.from(map.values());

  const scoreMoyen =
    unique.length > 0
      ? Math.round(unique.reduce((acc, d) => acc + (d.score ?? 0), 0) / unique.length)
      : 0;
  const meilleurScore =
    unique.length > 0 ? Math.max(...unique.map((d) => d.score ?? 0)) : 0;

  const getScoreConfig = (score) => {
    if (score >= 70)
      return { bar: "linear-gradient(90deg, #10b981, #34d399)", pill: { bg: "#d1fae5", color: "#065f46" }, label: "Excellent", num: "#059669" };
    if (score >= 40)
      return { bar: "linear-gradient(90deg, #f59e0b, #fbbf24)", pill: { bg: "#fef3c7", color: "#92400e" }, label: "Moyen", num: "#d97706" };
    return { bar: "linear-gradient(90deg, #ef4444, #f87171)", pill: { bg: "#fee2e2", color: "#991b1b" }, label: "À améliorer", num: "#dc2626" };
  };

  const getInitials = (name) =>
    name ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : "??";

  const companyColors = [
    { bg: "#eff6ff", color: "#1e40af" },
    { bg: "#ecfdf5", color: "#065f46" },
    { bg: "#f5f3ff", color: "#5b21b6" },
    { bg: "#fdf2f8", color: "#9d174d" },
    { bg: "#fffbeb", color: "#92400e" },
    { bg: "#f0fdf4", color: "#166534" },
  ];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <Sidebar>
      <div style={{ minHeight: "100vh" }}>
        {/* Header avec gradient */}
        <div
          style={{
            background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
            borderRadius: "16px",
            padding: "28px 32px",
            marginBottom: "28px",
            color: "white"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "600", display: "flex", alignItems: "center", gap: "12px" }}>
                <FaBriefcase size={28} /> Mes demandes
              </h1>
              <p style={{ margin: "8px 0 0", opacity: 0.9, fontSize: "14px" }}>
                Suivi complet de vos candidatures
              </p>
            </div>
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                padding: "8px 18px",
                borderRadius: "40px",
                fontSize: "14px",
                fontWeight: "500"
              }}
            >
              {unique.length} candidature{unique.length !== 1 ? "s" : ""} active{unique.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px",
              backgroundColor: "white",
              borderRadius: "16px",
              border: "1px solid #e2e8f0"
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  border: "3px solid #e2e8f0",
                  borderTopColor: "#2563eb",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 16px"
                }}
              />
              <p style={{ color: "#64748b", margin: 0 }}>Chargement de vos candidatures...</p>
            </div>
          </div>
        ) : unique.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 40px",
              backgroundColor: "white",
              borderRadius: "16px",
              border: "1px solid #e2e8f0"
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: "36px"
              }}
            >
              📄
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>
              Aucune candidature
            </h3>
            <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
              Vous n'avez encore postulé à aucune offre d'emploi.
            </p>
          </div>
        ) : (
          <>
            {/* Cartes statistiques */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "20px",
                marginBottom: "32px"
              }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  padding: "20px",
                  border: "1px solid #e2e8f0"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ fontSize: "28px", fontWeight: "700", color: "#1e293b" }}>{unique.length}</span>
                </div>
                <div style={{ fontSize: "14px", fontWeight: "500", color: "#475569", marginBottom: "4px" }}>
                  Total postulé
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                  Offres auxquelles vous avez candidaté
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  padding: "20px",
                  border: "1px solid #e2e8f0"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ fontSize: "28px", fontWeight: "700", color: "#1e293b" }}>{scoreMoyen}%</span>
                </div>
                <div style={{ fontSize: "14px", fontWeight: "500", color: "#475569", marginBottom: "4px" }}>
                  Score moyen
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                  Performance globale de votre CV
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  padding: "20px",
                  border: "1px solid #e2e8f0"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ fontSize: "28px", fontWeight: "700", color: "#1e293b" }}>{meilleurScore}%</span>
                </div>
                <div style={{ fontSize: "14px", fontWeight: "500", color: "#475569", marginBottom: "4px" }}>
                  Meilleur score
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                  Votre candidature la plus performante
                </div>
              </div>
            </div>

            {/* Grille des cartes d'offres */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: "24px"
              }}
            >
              {unique.map((d, index) => {
                const sc = getScoreConfig(d.score ?? 0);
                const iconColor = companyColors[index % companyColors.length];
                const initials = getInitials(d.offre?.entreprise?.username);
                const fillWidth = `${d.score ?? 0}%`;

                return (
                  <div
                    key={d._id}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "16px",
                      border: "1px solid #e2e8f0",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 12px 24px -8px rgba(0,0,0,0.1)";
                      e.currentTarget.style.borderColor = "#cbd5e1";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = "#e2e8f0";
                    }}
                  >
                    <div
                      style={{
                        background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
                        padding: "20px",
                        borderBottom: "1px solid #e2e8f0"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "12px",
                            backgroundColor: iconColor.bg,
                            color: iconColor.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                            fontWeight: "600"
                          }}
                        >
                          {initials}
                        </div>
                        <div
                          style={{
                            backgroundColor: sc.pill.bg,
                            color: sc.pill.color,
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "600"
                          }}
                        >
                          {sc.label}
                        </div>
                      </div>
                      <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>
                        {d.offre?.titre || "Offre inconnue"}
                      </h3>
                      <div style={{ marginTop: "8px", fontSize: "13px", color: "#64748b" }}>
                        <div>{d.offre?.entreprise?.username || "Entreprise inconnue"}</div>
                        <div style={{ fontSize: "12px", marginTop: "4px" }}>{d.offre?.entreprise?.email || "Non disponible"}</div>
                      </div>
                    </div>

                    <div style={{ padding: "20px" }}>
                      <div style={{ marginBottom: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ fontSize: "12px", fontWeight: "500", color: "#64748b" }}>Score de compatibilité</span>
                          <span style={{ fontSize: "18px", fontWeight: "700", color: sc.num }}>{d.score ?? 0}%</span>
                        </div>
                        <div
                          style={{
                            height: "8px",
                            borderRadius: "4px",
                            backgroundColor: "#f1f5f9",
                            overflow: "hidden"
                          }}
                        >
                          <div
                            style={{
                              width: fillWidth,
                              height: "100%",
                              background: sc.bar,
                              borderRadius: "4px",
                              transition: "width 0.5s ease"
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
                        Postulé le {formatDate(d.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </Sidebar>
  );
};

export default DemandeC;
