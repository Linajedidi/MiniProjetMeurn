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

  const handleChange = (e) => {
    setCv({ ...cv, [e.target.name]: e.target.value });
  };

  // ✅ Générer PDF + Télécharger + Enregistrer
  const generateAndSavePDF = async () => {
    if (!userId) {
      alert("Utilisateur non identifié");
      return;
    }

    try {
      // 1️⃣ Vérifier si un CV existe déjà
      const check = await axios.get(
        `http://localhost:3001/api/cv/exists/${userId}`
      );

      if (check.data.exists) {
        const confirmReplace = window.confirm(
          "Vous avez déjà un CV enregistré.\nVoulez-vous le remplacer ?"
        );
        if (!confirmReplace) return;
      }

      // 2️⃣ Génération du PDF
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text(cv.fullName || "Nom Prénom", 20, 20);

      doc.setFontSize(11);
      doc.text(`Email : ${cv.email}`, 20, 30);
      doc.text(`Téléphone : ${cv.phone}`, 20, 36);
      doc.text(`Adresse : ${cv.address}`, 20, 42);

      doc.setFontSize(14);
      doc.text("Profil", 20, 55);
      doc.setFontSize(11);
      doc.text(cv.profile || "-", 20, 62);

      doc.setFontSize(14);
      doc.text("Expériences", 20, 80);
      doc.setFontSize(11);
      doc.text(cv.experience || "-", 20, 87);

      doc.setFontSize(14);
      doc.text("Formation", 20, 110);
      doc.setFontSize(11);
      doc.text(cv.education || "-", 20, 117);

      doc.setFontSize(14);
      doc.text("Compétences", 20, 140);
      doc.setFontSize(11);
      doc.text(cv.skills || "-", 20, 147);

      // 3️⃣ PDF → Blob
      const pdfBlob = doc.output("blob");

      // 4️⃣ ⬇️ TÉLÉCHARGEMENT AUTOMATIQUE
      const downloadUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "Mon_CV.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      // 5️⃣ Blob → File
      const pdfFile = new File([pdfBlob], "Mon_CV.pdf", {
        type: "application/pdf",
      });

      // 6️⃣ Upload vers backend
      const formData = new FormData();
      formData.append("cv", pdfFile);
      formData.append("userId", userId);

      const res = await axios.post(
        "http://localhost:3001/api/cv/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert(res.data.message || "CV enregistré avec succès");

      // 7️⃣ Redirection
      navigate("/candidate-home");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création du CV");
    }
  };

  return (
    <SidebarU>
      <div className="container">
        <h3 className="mb-4">Créer mon CV</h3>

        <div className="card shadow">
          <div className="card-body">
            <div className="row">

              <div className="col-md-6 mb-3">
                <label>Nom & Prénom</label>
                <input name="fullName" className="form-control" onChange={handleChange} />
              </div>

              <div className="col-md-6 mb-3">
                <label>Email</label>
                <input name="email" className="form-control" onChange={handleChange} />
              </div>

              <div className="col-md-6 mb-3">
                <label>Téléphone</label>
                <input name="phone" className="form-control" onChange={handleChange} />
              </div>

              <div className="col-md-6 mb-3">
                <label>Adresse</label>
                <input name="address" className="form-control" onChange={handleChange} />
              </div>

              <div className="col-12 mb-3">
                <label>Profil</label>
                <textarea name="profile" className="form-control" rows="3" onChange={handleChange} />
              </div>

              <div className="col-12 mb-3">
                <label>Expériences</label>
                <textarea name="experience" className="form-control" rows="3" onChange={handleChange} />
              </div>

              <div className="col-12 mb-3">
                <label>Formation</label>
                <textarea name="education" className="form-control" rows="2" onChange={handleChange} />
              </div>

              <div className="col-12 mb-3">
                <label>Compétences</label>
                <textarea name="skills" className="form-control" rows="2" onChange={handleChange} />
              </div>

            </div>

            <div className="text-center mt-4">
              <button className="btn btn-success btn-lg" onClick={generateAndSavePDF}>
                Créer, télécharger & enregistrer mon CV
              </button>

              <button className="btn btn-secondary btn-lg ms-3" onClick={() => navigate(-1)}>
                Annuler
              </button>
            </div>

          </div>
        </div>
      </div>
    </SidebarU>
  );
};

export default CreateCV;