import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('name') || 'Administrateur';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow">
            <div className="card-header bg-danger text-white">
              <h3 className="mb-0">Tableau de bord Administrateur</h3>
            </div>
            <div className="card-body">
              <h4 className="mb-4">Bienvenue, {username} !</h4>
              <p className="lead">Espace administration</p>

              <div className="row mt-4">
                <div className="col-md-4">
                  <div className="card text-center border-primary">
                    <div className="card-body">
                      <h5 className="card-title">Utilisateurs</h5>
                      <p className="card-text">Gérer les comptes</p>
                      <button className="btn btn-primary">Voir</button>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card text-center border-success">
                    <div className="card-body">
                      <h5 className="card-title">Offres</h5>
                      <p className="card-text">Superviser les annonces</p>
                      <button className="btn btn-success">Voir</button>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card text-center border-warning">
                    <div className="card-body">
                      <h5 className="card-title">Statistiques</h5>
                      <p className="card-text">Rapports et analytics</p>
                      <button className="btn btn-warning">Voir</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 text-center">
                <button className="btn btn-danger btn-lg" onClick={handleLogout}>
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;