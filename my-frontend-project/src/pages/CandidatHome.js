import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarU from "../components/SidebarU";

const CandidatHome = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("name") || "Candidat";

  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [expandedOffre, setExpandedOffre] = useState(null);

  /* =========================
     Upload du CV
  ========================= */
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
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert(res.data.message);
    } catch (error) {
      console.error("Erreur upload CV :", error);
      alert("Erreur lors de l’import du CV");
    }
  };

  /* =========================
     Charger les offres
  ========================= */
  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:3001/api/offres-candidat",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOffres(res.data);
      } catch (error) {
        console.error("Erreur chargement offres :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffres();
  }, []);

  return (
    <SidebarU>
      <div className="container">
        <div className="card shadow">
          <div className="card-body">
            <h4 className="mb-4">Bienvenue, {username} !</h4>

            {/* ================= CV ================= */}
            <div className="row mt-4 justify-content-center">
              <div className="col-md-8">
                <div className="card text-center border-primary shadow-sm">
                  <div className="card-body">
                    <h3 className="card-title text-primary mb-3">Mon CV</h3>

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
            {/* ====================================== */}
          </div>
        </div>
      </div>

      {/* ================= Offres ================= */}
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="mb-3 text-primary">Offres disponibles</h4>

              {loading ? (
                <p>Chargement des offres...</p>
              ) : offres.length === 0 ? (
                <p className="text-muted">
                  Aucune offre disponible pour le moment.
                </p>
              ) : (
                <div className="row">
                  {offres.map((offre) => (
                    <div className="col-md-4 mb-3" key={offre._id}>
                      <div className="card h-100 border-secondary">
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title">{offre.titre}</h5>
                            <p className="text-muted mb-1">
                            📍 {offre.localisation}
                          </p>

                          <p className="card-text flex-grow-1"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: expandedOffre === offre._id ? "none" : 1,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              whiteSpace: "pre-line",
                            }}
                          >
                            {offre.description}
                          </p>

                          <button
                            className="btn btn-outline-primary w-100"
                            onClick={() => {
                              setSelectedOffre(offre);
                              setShowModal(true);
                            }}
                          >
                            Voir le détail
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
{showModal && selectedOffre && (
  <>
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">

          {/* Header */}
          <div className="modal-header">
            <div>
              <h5 className="modal-title mb-1">
                {selectedOffre.titre}
              </h5>
              <small className="text-muted">
                📍 {selectedOffre.localisation || selectedOffre.lieu}
              </small>
            </div>

            <button
              type="button"
              className="btn-close"
              onClick={() => setShowModal(false)}
            />
          </div>

          {/* Body */}
          <div
            className="modal-body"
            style={{ maxHeight: "60vh", overflowY: "auto" }}
          >
            <p style={{ whiteSpace: "pre-line" }}>
              {selectedOffre.description}
            </p>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Fermer
            </button>
          </div>

        </div>
      </div>
    </div>

    {/* Backdrop */}
    <div
      className="modal-backdrop fade show"
      onClick={() => setShowModal(false)}
    />
  </>
)}
{/* ======================================== */}
    </SidebarU>
  );
};

export default CandidatHome;