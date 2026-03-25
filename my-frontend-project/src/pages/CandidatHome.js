import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarU from "../components/SidebarU";

const CandidatHome = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("name") || "Candidat";

  // STATES
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState(null);
  // SÉCURITÉ 
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "CANDIDAT") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // CHARGER OFFRES (BACKEND SEARCH)
  const fetchOffres = async (search = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:3001/api/offres-candidat",
        {
          params: { search },
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

  // premier chargement
  useEffect(() => {
    fetchOffres();
  }, []);

  // recherche avec debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOffres(searchTerm);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // UPLOAD CV 
  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const userId = localStorage.getItem("userId");
    if (!userId) return alert("Utilisateur non identifié");

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

      const formData = new FormData();
      formData.append("cv", file);
      formData.append("userId", userId);

      const res = await axios.post(
        "http://localhost:3001/api/cv/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l’import du CV");
    }
  };

  // ================== APPLY ==================
  const handleApply = async (offreId) => {
    const candidat = localStorage.getItem("userId");
    if (!candidat) return alert("Utilisateur non identifié");

    try {
      const check = await axios.get(
        `http://localhost:3001/api/cv/exists/${candidat}`
      );

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
      alert("Erreur lors de la postulation");
    }
  };

  // ================== RENDER ==================
  return (
    <SidebarU>
      <div className="container">
        <h4 className="mb-4">Bienvenue, {username} !</h4>

        {/* ================= CV ================= */}
        <div className="card shadow mb-4">
          <div className="card-body text-center">
            <h3 className="text-primary mb-3">Mon CV</h3>

            <div className="d-flex justify-content-center gap-3">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate("/create-cv")}
              >
                Créer mon CV
              </button>

              <button
                className="btn btn-outline-secondary btn-lg"
                onClick={() => document.getElementById("cvUpload").click()}
              >
                Importer mon CV
              </button>
            </div>

            <input
              type="file"
              id="cvUpload"
              accept="application/pdf"
              hidden
              onChange={handleCVUpload}
            />
          </div>
        </div>

        {/* ================= SEARCH ================= */}
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder=" Rechercher une offre par titre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* ================= OFFRES ================= */}
        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="text-primary mb-3">Offres disponibles</h4>

            {loading ? (
              <p>Chargement des offres...</p>
            ) : offres.length === 0 ? (
              <p className="text-muted">Aucune offre trouvée</p>
            ) : (
              <div className="row">
                {offres.map((offre) => (
                  <div className="col-md-4 mb-3" key={offre._id}>
                    <div className="card h-100">
                      <div className="card-body d-flex flex-column">
                        <h5>{offre.titre}</h5>
                        <p className="text-muted">📍 {offre.localisation}</p>

                        <p
                          className="flex-grow-1"
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {offre.description}
                        </p>

                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-outline-primary flex-fill"
                            onClick={() => {
                              setSelectedOffre(offre);
                              setShowModal(true);
                            }}
                          >
                            Voir le détail
                          </button>

                          <button
                            className="btn btn-outline-success flex-fill"
                            onClick={() => handleApply(offre._id)}
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && selectedOffre && (
        <>
          <div className="modal fade show d-block">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5>{selectedOffre.titre}</h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
                </div>

                <div className="modal-body">
                  <p>{selectedOffre.description}</p>
                </div>

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
          <div
            className="modal-backdrop fade show"
            onClick={() => setShowModal(false)}
          />
        </>
      )}
    </SidebarU>
  );
};

export default CandidatHome;