import React from 'react';
import { useNavigate } from 'react-router-dom';

const EntrepriseHome = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('name') || 'Entreprise';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Espace Entreprise</h1>
      <div className="card shadow">
        <div className="card-body text-center">
          <h3>Bienvenue, {username} !</h3>
          <p className="lead mt-4">Gestion de votre espace recruteur</p>

          <ul className="list-group list-group-flush mt-4">
            <li className="list-group-item">Publier une nouvelle offre</li>
            <li className="list-group-item">Consulter les candidatures reçues</li>
            <li className="list-group-item">Gérer vos annonces actives</li>
            <li className="list-group-item">Voir les profils des candidats</li>
          </ul>

          <div className="mt-5">
            <button className="btn btn-success btn-lg me-3">Publier une offre</button>
            <button className="btn btn-danger btn-lg" onClick={handleLogout}>
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntrepriseHome;