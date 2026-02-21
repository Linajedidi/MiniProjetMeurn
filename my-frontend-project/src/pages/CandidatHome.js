import React from 'react';
import { useNavigate } from 'react-router-dom';

const CandidatHome = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('name') || 'Candidat';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Espace Candidat</h1>
      <div className="card shadow">
        <div className="card-body text-center">
          <h3>Bienvenue, {username} !</h3>
          <p className="lead mt-4">Vous pouvez maintenant :</p>

          <ul className="list-group list-group-flush mt-4">
            <li className="list-group-item">Consulter les offres d'emploi</li>
            <li className="list-group-item">Postuler à des offres</li>
            <li className="list-group-item">Gérer votre profil et CV</li>
            <li className="list-group-item">Suivre vos candidatures</li>
          </ul>

          <div className="mt-5">
            <button className="btn btn-primary btn-lg me-3">Voir les offres</button>
            <button className="btn btn-danger btn-lg" onClick={handleLogout}>
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatHome;