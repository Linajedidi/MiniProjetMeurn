import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarU from "../components/SidebarU";

const CandidatHome = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("name") || "Candidat";

  // Upload du CV avec vérification
  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Utilisateur non identifié");
      return;
    }

    try {
      
      const check = await axios.get(
        `http://localhost:3001/api/cv/exists/${userId}`
      );

      if (check.data.exists) {
        const confirmReplace = window.confirm(
          "Vous avez déjà un CV enregistré.\n\nVoulez-vous le remplacer ?"
        );

        if (!confirmReplace) {
         
          e.target.value = null;
          return;
        }
      }

     
      const formData = new FormData();
      formData.append("cv", file);
      formData.append("userId", userId);

      const res = await axios.post(
        "http://localhost:3001/api/cv/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(res.data.message);
    } catch (error) {
      console.error("❌ Erreur upload CV :", error);
      alert("Erreur lors de l’import du CV");
    }
  };

  // 🔹 Déconnexion
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <SidebarU>
      <div className="container">
        <div className="card shadow">
          <div className="card-body">
            <h4 className="mb-4">Bienvenue, {username} !</h4>

            {/* Section Mon CV */}
            <div className="row mt-4 justify-content-center">
              <div className="col-md-8">
                <div className="card text-center border-primary shadow-sm">
                  <div className="card-body">
                    <h3 className="card-title text-primary mb-3">
                      Mon CV
                    </h3>

                    <p className="card-text fs-5">
                      Créez ou téléversez votre CV pour postuler plus rapidement
                      aux offres qui vous intéressent.
                    </p>

                    <div className="d-flex justify-content-center gap-3 mt-4">
                      <button
                        className="btn btn-primary btn-lg"
                        onClick={() => navigate("/create-cv")}
                      >
                        Créer mon CV
                      </button>

                      <button
                        className="btn btn-outline-secondary btn-lg"
                        onClick={() =>
                          document.getElementById("cvUpload").click()
                        }
                      >
                        Importer mon CV
                      </button>
                    </div>

                    {/*  Input caché */}
                    <input
                      type="file"
                      id="cvUpload"
                      accept="application/pdf"
                      style={{ display: "none" }}
                      onChange={handleCVUpload}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </SidebarU>
  );
};

export default CandidatHome;