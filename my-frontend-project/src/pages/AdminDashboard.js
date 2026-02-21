import React from 'react';
import Sidebar from '../components/Sidebar';

const AdminDashboard = () => {
  const username = localStorage.getItem('name') || 'Administrateur';

  return (
    <Sidebar>
      <div className="container">
        <div className="card shadow">
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
              <button
                className="btn btn-danger btn-lg"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default AdminDashboard;