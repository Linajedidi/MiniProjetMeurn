import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const NotifAdmin = () => {
  const [entreprises, setEntreprises] = useState([]);
  const [selectedEntreprise, setSelectedEntreprise] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchEntreprises = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/admin/entreprises/en-attente");
      setEntreprises(res.data);
    } catch (err) {
      console.error("Erreur fetch:", err);
    }
  };

  useEffect(() => {
    fetchEntreprises();
  }, []);

  const accepter = async (id) => {
    try {
      setEntreprises(prev => prev.filter(e => e._id !== id));

      await axios.put(`http://localhost:3001/api/admin/entreprises/${id}/accepter`);

      if (window.refreshNotif) {
        window.refreshNotif();
      }

    } catch (err) {
      console.error("Erreur accepter:", err);
    }
  };

  const refuser = async (id) => {
    try {
      setEntreprises(prev => prev.filter(e => e._id !== id));

      await axios.put(`http://localhost:3001/api/admin/entreprises/${id}/refuser`);

      if (window.refreshNotif) {
        window.refreshNotif();
      }

    } catch (err) {
      console.error("Erreur refuser:", err);
    }
  };

  return (
    <Sidebar>
      <div className="container mt-4">
        <h3>Entreprises en attente</h3>

        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Entreprise</th>
              <th>Secteur</th>
              <th>Adresse</th>
              <th>Code Fiscal</th> 
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {entreprises.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">
                  Aucune entreprise en attente
                </td>
              </tr>
            ) : (
              entreprises.map((e) => (
                <tr key={e._id}>
                  <td>{e.username}</td>
                  <td>{e.email}</td>
                  <td>{e.tel}</td>
                  <td>{e.nomEntreprise}</td>
                  <td>{e.secteur}</td>
                  <td>{e.adresse}</td>

                  {/* ✅ CODE FISCAL */}
                  <td>{e.codeFiscal || "—"}</td>

                  {/* DESCRIPTION CLIQUABLE */}
                  <td
                    style={{
                      cursor: "pointer",
                      color: "#0d6efd",
                      textDecoration: "underline"
                    }}
                    onClick={() => {
                      setSelectedEntreprise(e);
                      setShowModal(true);
                    }}
                  >
                    {e.description?.slice(0, 40)}...
                  </td>

                  <td>
                    <button
                      className="btn btn-success me-2"
                      onClick={() => accepter(e._id)}
                    >
                      Accepter
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => refuser(e._id)}
                    >
                      Refuser
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* MODAL */}
        {showModal && selectedEntreprise && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000
            }}
          >
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                width: "400px"
              }}
            >
              <h4>Détails de l'entreprise</h4>

              <p><strong>Nom:</strong> {selectedEntreprise.nomEntreprise}</p>
              <p><strong>Email:</strong> {selectedEntreprise.email}</p>
              <p><strong>Téléphone:</strong> {selectedEntreprise.tel}</p>
              <p><strong>Secteur:</strong> {selectedEntreprise.secteur}</p>
              <p><strong>Adresse:</strong> {selectedEntreprise.adresse}</p>

              {/*  CODE FISCAL DANS MODAL */}
              <p><strong>Code fiscal:</strong> {selectedEntreprise.codeFiscal || "—"}</p>

              <hr />

              <p><strong>Description:</strong></p>
              <p>{selectedEntreprise.description}</p>

              <button
                className="btn btn-secondary mt-2"
                onClick={() => setShowModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default NotifAdmin;