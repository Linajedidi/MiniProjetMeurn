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
        const res = await axios.get(
          "http://localhost:3001/api/candidatures/public"
        );

        // Seules les requêtes de l'utilisateur actuel
        const mesDemandes = res.data.filter(
          (d) => d.candidat?._id === userId
        );

        setDemandes(mesDemandes);
      } catch (err) {
        console.error("Erreur chargement demandes :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDemandes();
  }, [navigate]);

  return (
    <Sidebar>
      <h2 className="mb-4">Mes demandes</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : demandes.length === 0 ? (
        <p className="text-muted">
          Vous n’avez encore postulé à aucune offre.
        </p>
      ) : (
        <div className="row">
          {demandes.map((d) => (
            <div className="col-md-4 mb-3" key={d._id}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  
                  {/*  Titre offre */}
                  <h5 className="card-title">
                    {d.offre?.titre}
                  </h5>

              

                  {/* Score CV */}
                  <p className="mb-2">
                    Score CV :
                    <span className="fw-bold ms-1">
                      {d.score ?? 0}
                    </span>
                  </p>

                  {/* Badge score */}
                  <span
                    className={`badge ${
                      d.score >= 70
                        ? "bg-success"
                        : d.score >= 40
                        ? "bg-warning text-dark"
                        : "bg-danger"
                    }`}
                  >
                    {d.score >= 70
                      ? "Excellent"
                      : d.score >= 40
                      ? "Moyen"
                      : "Faible"}
                  </span>

                  {/*  Statut */}
                  <span className="badge bg-primary mt-2 align-self-start">
                    Postulé
                  </span>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Sidebar>
  );
};

export default DemandeC;