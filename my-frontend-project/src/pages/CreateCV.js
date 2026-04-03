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

  // ✅ Validation
  const validate = () => {
    let newErrors = {};

    Object.keys(cv).forEach((key) => {
      if (!cv[key].trim()) {
        newErrors[key] = "Ce champ est obligatoire";
      }
    });

    // Email validation simple
    if (cv.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cv.email)) {
      newErrors.email = "Email invalide";
    }

    // Téléphone (8 chiffres Tunisie)
    if (cv.phone && !/^\d{8}$/.test(cv.phone)) {
      newErrors.phone = "Numéro invalide (8 chiffres)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle change + remove error instantly
  const handleChange = (e) => {
    setCv({ ...cv, [e.target.name]: e.target.value });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // ✅ Submit
  const generateAndSavePDF = async () => {
    if (!userId) {
      alert("Utilisateur non identifié");
      return;
    }

    if (!validate()) return;

    try {
      const check = await axios.get(
        `http://localhost:3001/api/cv/exists/${userId}`
      );

      if (check.data.exists) {
        const confirmReplace = window.confirm(
          "Vous avez déjà un CV enregistré.\nVoulez-vous le remplacer ?"
        );
        if (!confirmReplace) return;
      }

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text(cv.fullName, 20, 20);

      doc.setFontSize(11);
      doc.text(`Email : ${cv.email}`, 20, 30);
      doc.text(`Téléphone : ${cv.phone}`, 20, 36);
      doc.text(`Adresse : ${cv.address}`, 20, 42);

      doc.setFontSize(14);
      doc.text("Profil", 20, 55);
      doc.setFontSize(11);
      doc.text(cv.profile, 20, 62);

      doc.setFontSize(14);
      doc.text("Expériences", 20, 80);
      doc.setFontSize(11);
      doc.text(cv.experience, 20, 87);

      doc.setFontSize(14);
      doc.text("Niveaux", 20, 110);
      doc.setFontSize(11);
      doc.text(cv.education, 20, 117);

      doc.setFontSize(14);
      doc.text("Compétences", 20, 140);
      doc.setFontSize(11);
      doc.text(cv.skills, 20, 147);

      const pdfBlob = doc.output("blob");

      // download
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Mon_CV.pdf";
      link.click();

      const pdfFile = new File([pdfBlob], "Mon_CV.pdf", {
        type: "application/pdf",
      });

      const formData = new FormData();
      formData.append("cv", pdfFile);
      formData.append("userId", userId);
      formData.append("competences", cv.skills);       
formData.append("experiences", cv.experience);   
formData.append("niveaux", cv.education);   


      const res = await axios.post(
        "http://localhost:3001/api/cv/upload",
        formData
      );

      alert(res.data.message || "CV enregistré avec succès");

      navigate("/candidate-home");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création du CV");
    }
  };

  // ✅ Helper UI
  const inputClass = (field) =>
    `form-control ${errors[field] ? "is-invalid" : ""}`;

  return (
    <SidebarU>
      <div className="container">
        <h3 className="mb-4">Créer mon CV</h3>

        <div className="card shadow">
          <div className="card-body">
            <div className="row">

              <div className="col-md-6 mb-3">
                <label>Nom & Prénom</label>
                <input
                  name="fullName"
                  className={inputClass("fullName")}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.fullName}</div>
              </div>

              <div className="col-md-6 mb-3">
                <label>Email</label>
                <input
                  name="email"
                  className={inputClass("email")}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.email}</div>
              </div>

              <div className="col-md-6 mb-3">
                <label>Téléphone</label>
                <input
                  name="phone"
                  className={inputClass("phone")}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.phone}</div>
              </div>

              <div className="col-md-6 mb-3">
                <label>Adresse</label>
                <input
                  name="address"
                  className={inputClass("address")}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.address}</div>
              </div>

              <div className="col-12 mb-3">
                <label>Profil</label>
                <textarea
                  name="profile"
                  className={inputClass("profile")}
                  rows="3"
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.profile}</div>
              </div>

              <div className="col-12 mb-3">
                <label>Expériences</label>
                <textarea
                  name="experience"
                  className={inputClass("experience")}
                  rows="3"
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.experience}</div>
              </div>

              <div className="col-12 mb-3">
                <label>Niveaux</label>
                <textarea
                  name="education"
                  className={inputClass("education")}
                  rows="2"
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.education}</div>
              </div>

              <div className="col-12 mb-3">
                <label>Compétences</label>
                <textarea
                  name="skills"
                  className={inputClass("skills")}
                  rows="2"
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.skills}</div>
              </div>

            </div>

            <div className="text-center mt-4">
              <button
                className="btn btn-success btn-lg"
                onClick={generateAndSavePDF}
              >
                Créer, télécharger & enregistrer mon CV
              </button>

              <button
                className="btn btn-secondary btn-lg ms-3"
                onClick={() => navigate(-1)}
              >
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