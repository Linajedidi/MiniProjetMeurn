import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SidebarEntrep from '../components/SidebarEntrep';

const EntrepriseHome = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('name') || 'Entreprise';
  


  const [candidatures, setCandidatures] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/api/candidatures")
      .then(res => setCandidatures(res.data))
      .catch(err => console.error("Erreur chargement candidatures:", err));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <SidebarEntrep>
      <div className="container mt-5">
        <h1 className="text-center mb-4">Espace Entreprise</h1>
        <div className="card shadow">
          <div className="card-body text-center">
            <h3>Bienvenue, {username} !</h3>
            <p className="lead mt-4">Gestion de votre espace recruteur</p>

            {/* Tableau des candidatures */}
            <div className="mt-5 text-start">
              <h4>Liste des candidatures</h4>

              <table className="table table-bordered mt-3">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>CV</th>
                    <th>Offre</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {candidatures.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center">Aucune candidature</td>
                    </tr>
                  ) : (
                    candidatures.map(c => (
                      <tr key={c._id}>
                        <td>{c.candidat?.username || "—"}</td>
                        <td>{c.cv}</td>
                        <td>{c.offre}</td>
                        <td>{c.score}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-5">
              <button className="btn btn-success btn-lg me-3">Publier une offre</button>
              <button className="btn btn-danger btn-lg" onClick={handleLogout}>
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </SidebarEntrep>
  );
};

export default EntrepriseHome;