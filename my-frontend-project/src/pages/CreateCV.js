import React, { useState } from "react";
import { jsPDF } from "jspdf";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SidebarU from "../components/SidebarU";

const CreateCV = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [cv, setCv] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    profile: "",
    experience: "",
    education: "",
    skills: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let newErrors = {};
    Object.keys(cv).forEach((key) => {
      if (!cv[key].trim()) newErrors[key] = "Ce champ est obligatoire";
    });
    if (cv.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cv.email))
      newErrors.email = "Email invalide";
    if (cv.phone && !/^\d{8}$/.test(cv.phone))
      newErrors.phone = "Numéro invalide (8 chiffres)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setCv({ ...cv, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // PDF Style CV classique
  const buildClassicPDF = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = 210;
    const H = 297;
    const marginX = 20;
    const marginY = 25;
    const contentW = W - marginX * 2;

    // Fond blanc
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, W, H, "F");

    // Vérifier si le nom existe
    const fullNameValue = cv.fullName && cv.fullName.trim() ? cv.fullName.toUpperCase() : "CV";
    
    // === EN-TÊTE : NOM en grand ===
    doc.setFontSize(32);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(fullNameValue, marginX, marginY + 8);

    // Sous-titre / Intitulé de poste
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Candidat", marginX, marginY + 22);

    // Ligne séparatrice sous l'en-tête
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(marginX, marginY + 30, W - marginX, marginY + 30);

    let currentY = marginY + 45;

    // === SECTION PROFIL ===
    const drawSection = (title, content, yPos) => {
      if (!content || !content.trim()) return yPos;

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(title.toUpperCase(), marginX, yPos);

      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(marginX, yPos + 2, marginX + 40, yPos + 2);

      doc.setFontSize(10.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);

      const lines = doc.splitTextToSize(content, contentW);
      let y = yPos + 8;

      lines.forEach((line) => {
        if (y > H - 30) {
          doc.addPage();
          y = marginY;
        }
        doc.text(line, marginX, y);
        y += 5.5;
      });

      return y + 8;
    };

    // === SECTION FORMATION ===
    const drawFormation = (content, yPos) => {
      if (!content || !content.trim()) return yPos;

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("FORMATION", marginX, yPos);
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(marginX, yPos + 2, marginX + 40, yPos + 2);

      doc.setFontSize(10.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);

      const formationLines = doc.splitTextToSize(content, contentW);
      let y = yPos + 8;

      formationLines.forEach((line) => {
        if (y > H - 30) {
          doc.addPage();
          y = marginY;
        }
        if (line.includes("•") || line.match(/[A-Z]{2,}/)) {
          doc.setFont("helvetica", "bold");
          doc.text(line, marginX, y);
          doc.setFont("helvetica", "normal");
        } else {
          doc.text(line, marginX, y);
        }
        y += 5.5;
      });

      return y + 8;
    };

    // === SECTION EXPÉRIENCE ===
    const drawExperience = (content, yPos) => {
      if (!content || !content.trim()) return yPos;

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("EXPÉRIENCE PROFESSIONNELLE", marginX, yPos);
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(marginX, yPos + 2, marginX + 60, yPos + 2);

      doc.setFontSize(10.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);

      const expLines = doc.splitTextToSize(content, contentW);
      let y = yPos + 8;

      expLines.forEach((line) => {
        if (y > H - 30) {
          doc.addPage();
          y = marginY;
        }
        if (line.match(/^[A-Z\s]{3,}/) || line.includes("•")) {
          doc.setFont("helvetica", "bold");
          doc.text(line, marginX, y);
          doc.setFont("helvetica", "normal");
        } else {
          doc.text(line, marginX, y);
        }
        y += 5.5;
      });

      return y + 8;
    };

    // === SECTION COMPÉTENCES ===
    const drawCompetences = (content, yPos) => {
      if (!content || !content.trim()) return yPos;

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("COMPÉTENCES", marginX, yPos);
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(marginX, yPos + 2, marginX + 45, yPos + 2);

      doc.setFontSize(10.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);

      const skills = content.split(/[,;\n]+/).filter(s => s.trim());
      let y = yPos + 8;

      skills.forEach((skill) => {
        if (y > H - 30) {
          doc.addPage();
          y = marginY;
        }
        doc.text(`• ${skill.trim()}`, marginX, y);
        y += 5.5;
      });

      return y + 8;
    };

    // Génération du contenu formaté
    currentY = drawSection("PROFIL", cv.profile, currentY);
    currentY = drawFormation(cv.education, currentY);
    currentY = drawExperience(cv.experience, currentY);
    currentY = drawCompetences(cv.skills, currentY);

    // Footer
    if (currentY < H - 15) {
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(marginX, H - 15, W - marginX, H - 15);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(150, 150, 150);
      doc.text("CV généré via JobBoard", W / 2, H - 8, { align: "center" });
    }

    return doc;
  };

  const generateAndSavePDF = async () => {
    if (!userId) { alert("Utilisateur non identifié"); return; }
    if (!validate()) return;

    setLoading(true);
    try {
      const check = await axios.get(`http://localhost:3001/api/cv/exists/${userId}`);
      if (check.data.exists) {
        const confirmReplace = window.confirm(
          "Vous avez déjà un CV enregistré.\nVoulez-vous le remplacer ?"
        );
        if (!confirmReplace) { setLoading(false); return; }
      }

      const doc = buildClassicPDF();
      const pdfBlob = doc.output("blob");

      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Mon_CV.pdf";
      link.click();

      const pdfFile = new File([pdfBlob], "Mon_CV.pdf", { type: "application/pdf" });
      const formData = new FormData();
      formData.append("cv", pdfFile);
      formData.append("userId", userId);
      formData.append("competences", cv.skills);
      formData.append("experiences", cv.experience);
      formData.append("niveaux", cv.education);

      const res = await axios.post("http://localhost:3001/api/cv/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(res.data.message || "CV enregistré avec succès");
      navigate("/candidate-home");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création du CV");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarU>
      <div style={{ padding: "32px", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                borderRadius: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                boxShadow: "0 8px 20px rgba(124,58,237,0.25)"
              }}
            >
              📄
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>
                Créer mon CV
              </h1>
              <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#64748b" }}>
                Remplissez le formulaire pour générer un CV professionnel
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "24px",
            border: "1px solid #e2e8f0",
            overflow: "hidden"
          }}
        >
          {/* Section 1 */}
          <div
            style={{
              padding: "20px 28px",
              borderBottom: "1px solid #f1f5f9",
              backgroundColor: "#fafcff"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                  borderRadius: "50%"
                }}
              />
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#64748b" }}>
                Informations personnelles
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", padding: "24px 28px" }}>
            {[
              { name: "fullName", label: "Nom complet" },
              { name: "email", label: "Email" },
              { name: "phone", label: "Téléphone" },
              { name: "address", label: "Adresse" },
            ].map(({ name, label }) => (
              <div key={name} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>
                  {label} <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  name={name}
                  value={cv[name]}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: errors[name] ? "1.5px solid #ef4444" : "1.5px solid #e2e8f0",
                    backgroundColor: "#fafafa",
                    fontSize: "14px",
                    color: "#0f172a",
                    outline: "none",
                    transition: "all 0.2s"
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#7c3aed";
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)";
                  }}
                  onBlur={(e) => {
                    if (!errors[name]) e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.backgroundColor = "#fafafa";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {errors[name] && <span style={{ fontSize: "11px", color: "#ef4444" }}>⚠ {errors[name]}</span>}
              </div>
            ))}
          </div>

          {/* Section 2 */}
          <div
            style={{
              padding: "20px 28px",
              borderTop: "1px solid #f1f5f9",
              borderBottom: "1px solid #f1f5f9",
              backgroundColor: "#fafcff"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "8px", height: "8px", background: "linear-gradient(135deg, #7c3aed, #2563eb)", borderRadius: "50%" }} />
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", color: "#64748b" }}>
                Profil & Parcours
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "24px 28px" }}>
            {[
              { name: "profile", label: "Profil", rows: 4 },
              { name: "experience", label: "Expérience professionnelle", rows: 6 },
              { name: "education", label: "Formation", rows: 4 },
              { name: "skills", label: "Compétences", rows: 3 },
            ].map(({ name, label, rows }) => (
              <div key={name} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#1e293b" }}>
                  {label} <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <textarea
                  name={name}
                  rows={rows}
                  value={cv[name]}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: errors[name] ? "1.5px solid #ef4444" : "1.5px solid #e2e8f0",
                    backgroundColor: "#fafafa",
                    fontSize: "14px",
                    color: "#0f172a",
                    outline: "none",
                    transition: "all 0.2s",
                    resize: "vertical",
                    fontFamily: "inherit"
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#7c3aed";
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)";
                  }}
                  onBlur={(e) => {
                    if (!errors[name]) e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.backgroundColor = "#fafafa";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {errors[name] && <span style={{ fontSize: "11px", color: "#ef4444" }}>⚠ {errors[name]}</span>}
              </div>
            ))}
          </div>

          {/* Tip */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 24px", margin: "0 28px 20px", background: "#f1f5f9", borderRadius: "14px" }}>
            <span style={{ fontSize: "12px", fontWeight: "500", color: "#334155" }}>
              CV classique · Format professionnel avec sections distinctes
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", padding: "24px 28px", borderTop: "1px solid #f1f5f9", backgroundColor: "#fafcff" }}>
            <button
              onClick={generateAndSavePDF}
              disabled={loading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px 32px",
                background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                color: "#ffffff",
                border: "none",
                borderRadius: "14px",
                fontSize: "14px",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.65 : 1,
                transition: "all 0.25s ease",
                boxShadow: "0 4px 14px rgba(124,58,237,0.3)"
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(124,58,237,0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(124,58,237,0.3)";
              }}
            >
              {loading ? (
                <>
                  <span style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#ffffff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                  Génération en cours...
                </>
              ) : (
                " Créer mon CV"
              )}
            </button>
            <button
              onClick={() => navigate(-1)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 28px",
                background: "transparent",
                color: "#64748b",
                border: "1.5px solid #e2e8f0",
                borderRadius: "14px",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#7c3aed";
                e.currentTarget.style.color = "#7c3aed";
                e.currentTarget.style.backgroundColor = "#f8fafc";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.color = "#64748b";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
               Annuler
            </button>
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
    </SidebarU>
  );
};

export default CreateCV;