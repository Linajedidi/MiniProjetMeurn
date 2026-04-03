import React, { useEffect, useState } from "react";
import Sidebar from "../components/SidebarU";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      return { bar: "#1D9E75", pill: { bg: "#E1F5EE", color: "#085041" }, label: "Excellent", num: "#0F6E56" };
    if (score >= 40)
      return { bar: "#EF9F27", pill: { bg: "#FAEEDA", color: "#633806" }, label: "Moyen", num: "#BA7517" };
    return { bar: "#E24B4A", pill: { bg: "#FCEBEB", color: "#791F1F" }, label: "Faible", num: "#A32D2D" };
  };

  const getInitials = (name) =>
    name ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : "??";

  const companyColors = [
    { bg: "#E6F1FB", color: "#185FA5" },
    { bg: "#E1F5EE", color: "#0F6E56" },
    { bg: "#EEEDFE", color: "#534AB7" },
    { bg: "#FBEAF0", color: "#993556" },
    { bg: "#FAEEDA", color: "#854F0B" },
    { bg: "#EAF3DE", color: "#3B6D11" },
  ];

  const styles = {
    page: {
      minHeight: "100vh",
      backgroundColor: "#f5f5f3",
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    main: {
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
    topbarBadge: {
      padding: "5px 14px",
      borderRadius: "20px",
      background: "#E6F1FB",
      color: "#0C447C",
      fontSize: "12px",
      fontWeight: "500",
      border: "0.5px solid #B5D4F4",
    },
    summaryStrip: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "12px",
      marginBottom: "24px",
    },
    sumCard: {
      backgroundColor: "#ebebea",
      borderRadius: "8px",
      padding: "14px 16px",
    },
    sumLabel: {
      fontSize: "12px",
      color: "#888",
      marginBottom: "4px",
    },
    sumValue: {
      fontSize: "22px",
      fontWeight: "500",
      color: "#1a1a1a",
    },
    cardsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: "14px",
    },
    card: {
      backgroundColor: "white",
      border: "0.5px solid rgba(0,0,0,0.1)",
      borderRadius: "12px",
      padding: "18px",
      display: "flex",
      flexDirection: "column",
      cursor: "pointer",
      transition: "border-color 0.15s",
    },
    cardTop: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: "12px",
    },
    companyIcon: {
      width: "36px",
      height: "36px",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "12px",
      fontWeight: "500",
      flexShrink: 0,
    },
    badgePostule: {
      fontSize: "11px",
      fontWeight: "500",
      padding: "3px 9px",
      borderRadius: "20px",
      background: "#E6F1FB",
      color: "#0C447C",
      border: "0.5px solid #B5D4F4",
    },
    cardJob: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#1a1a1a",
      marginBottom: "4px",
      lineHeight: "1.3",
    },
    cardCompany: {
      fontSize: "12.5px",
      color: "#666",
      marginBottom: "2px",
    },
    cardEmail: {
      fontSize: "11.5px",
      color: "#999",
    },
    divider: {
      height: "0.5px",
      backgroundColor: "rgba(0,0,0,0.08)",
      margin: "14px 0",
    },
    scoreHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "8px",
    },
    scoreLabel: {
      fontSize: "11.5px",
      color: "#888",
    },
    scoreTrack: {
      height: "5px",
      borderRadius: "3px",
      backgroundColor: "#ebebea",
      marginBottom: "8px",
    },
    scorePill: {
      display: "inline-block",
      padding: "2px 9px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: "500",
    },
    cardDate: {
      fontSize: "11.5px",
      color: "#aaa",
      marginTop: "12px",
    },
    emptyState: {
      textAlign: "center",
      padding: "60px 20px",
      backgroundColor: "white",
      borderRadius: "12px",
      border: "0.5px solid rgba(0,0,0,0.1)",
    },
    emptyIcon: {
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      backgroundColor: "#ebebea",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 14px",
      fontSize: "20px",
    },
    emptyTitle: {
      fontSize: "15px",
      fontWeight: "500",
      color: "#1a1a1a",
      marginBottom: "6px",
    },
    emptyText: {
      fontSize: "13px",
      color: "#888",
    },
  };

  return (
    <Sidebar>
      <div style={styles.page}>
        <div style={styles.main}>
          {/* Header */}
          <div style={styles.topbar}>
            <div>
              <h2 style={styles.pageTitle}>Mes demandes</h2>
              <p style={styles.pageSub}>Suivi de vos candidatures en cours</p>
            </div>
            <span style={styles.topbarBadge}>
              {unique.length} candidature{unique.length !== 1 ? "s" : ""} active{unique.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
              Chargement...
            </div>
          ) : unique.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📄</div>
              <div style={styles.emptyTitle}>Aucune candidature</div>
              <p style={styles.emptyText}>Vous n'avez encore postulé à aucune offre.</p>
            </div>
          ) : (
            <>
              {/* Summary strip */}
              <div style={styles.summaryStrip}>
                <div style={styles.sumCard}>
                  <div style={styles.sumLabel}>Total postulé</div>
                  <div style={styles.sumValue}>{unique.length}</div>
                </div>
                <div style={styles.sumCard}>
                  <div style={styles.sumLabel}>Score moyen</div>
                  <div style={styles.sumValue}>{scoreMoyen}%</div>
                </div>
                <div style={styles.sumCard}>
                  <div style={styles.sumLabel}>Meilleur score</div>
                  <div style={styles.sumValue}>{meilleurScore}%</div>
                </div>
              </div>

              {/* Cards */}
              <div style={styles.cardsGrid}>
                {unique.map((d, index) => {
                  const sc = getScoreConfig(d.score ?? 0);
                  const iconColor = companyColors[index % companyColors.length];
                  const initials = getInitials(d.offre?.entreprise?.username);
                  const fillWidth = `${d.score ?? 0}%`;

                  return (
                    <div
                      key={d._id}
                      style={styles.card}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.25)")}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)")}
                    >
                      {/* Top */}
                      <div style={styles.cardTop}>
                        <div style={{ ...styles.companyIcon, backgroundColor: iconColor.bg, color: iconColor.color }}>
                          {initials}
                        </div>
                        <span style={styles.badgePostule}>Postulé</span>
                      </div>

                      {/* Info */}
                      <div style={styles.cardJob}>{d.offre?.titre || "Offre inconnue"}</div>
                      <div style={styles.cardCompany}>
                        {d.offre?.entreprise?.username || "Entreprise inconnue"}
                      </div>
                      <div style={styles.cardEmail}>
                        {d.offre?.entreprise?.email || "Non disponible"}
                      </div>

                      <div style={styles.divider} />

                      {/* Score */}
                      <div>
                        <div style={styles.scoreHeader}>
                          <span style={styles.scoreLabel}>Score CV</span>
                          <span style={{ fontSize: "14px", fontWeight: "500", color: sc.num }}>
                            {d.score ?? 0}%
                          </span>
                        </div>
                        <div style={styles.scoreTrack}>
                          <div style={{ width: fillWidth, height: "100%", borderRadius: "3px", backgroundColor: sc.bar }} />
                        </div>
                        <span style={{ ...styles.scorePill, backgroundColor: sc.pill.bg, color: sc.pill.color }}>
                          {sc.label}
                        </span>
                      </div>

                      {/* Date */}
                      <div style={styles.cardDate}>
                        Postulé le {new Date(d.createdAt).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default DemandeC;