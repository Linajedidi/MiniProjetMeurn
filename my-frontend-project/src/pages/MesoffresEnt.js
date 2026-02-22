import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SidebarEntrep from "../components/SidebarEntrep";

const MesoffresEnt = () => {
  const [offres, setOffres] = useState([]);
  const navigate = useNavigate();
  const entrepriseId = localStorage.getItem("userId");

  const fetchOffres = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/offres/entreprise/${entrepriseId}`
      );
      setOffres(res.data);
    } catch (err) {
      console.error(err);
      alert("Erreur lors du chargement des offres");
    }
  };

  /*useEffect(() => {
    fetchOffres();
  }, []);

  const deleteOffre = async (id) => {
    if (!window.confirm("Supprimer cette offre ?")) return;

    try {
      await axios.delete(`http://localhost:3001/api/offres/${id}`);
      fetchOffres(); // rafraîchir la liste
    } catch (err) {
      alert("Erreur suppression");
    } 
  };*/

  return (
    <SidebarEntrep>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <h2>Mes offres</h2>
          <button className="btn btn-primary" onClick={() => navigate("/CreateOffre")}>
            Créez votre publication
          </button>
        </div>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {offres.map((offre) => (
            <div key={offre._id} className="card p-3" style={{ width: 300 }}>
              <h5>{offre.titre}</h5>
              <p><b>Localisation :</b> {offre.localisation}</p>
              <p>{offre.description}</p>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button className="btn btn-sm btn-info">Modifier</button>
               {/* /<button className="btn btn-sm btn-danger" onClick={() => deleteOffre(offre._id)}>
                  Supprimer
                </button> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SidebarEntrep>
  );
};

export default MesoffresEnt;