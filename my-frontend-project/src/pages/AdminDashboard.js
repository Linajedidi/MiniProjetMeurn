import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Link } from "react-router-dom";

import axios from 'axios';

const AdminDashboard = () => {
  const username = localStorage.getItem('name') || 'Administrateur';

  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCandidates: 0,
    totalEnterprises: 0,
    totalOffers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Erreur fetchStats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <Sidebar>
      <div className="container">
        <div className="card shadow">
          <div className="card-body">
            <h4 className="mb-4">Bienvenue, {username} !</h4>
            <p className="lead">Espace administration</p>

            <div className="row mt-4">
              {/* Utilisateurs */}
              <div className="col-md-3">
                <div className="card text-center border-primary">
                  <div className="card-body">
                    <h5 className="card-title">Utilisateurs</h5>
                    <p className="card-text">{stats.totalUsers} utilisateurs</p>
                    <Link to="/users" className="btn btn-primary">Voir</Link>
                  </div>
                </div>
              </div>

              {/* Candidats */}
              <div className="col-md-3">
                <div className="card text-center border-success">
                  <div className="card-body">
                    <h5 className="card-title">Candidats</h5>
                    <p className="card-text">{stats.totalCandidates} candidats</p>
                    <Link to="/candidat" className="btn btn-success">Voir</Link>
                  </div>
                </div>
              </div>

              {/* Entreprises */}
              <div className="col-md-3">
                <div className="card text-center border-info">
                  <div className="card-body">
                    <h5 className="card-title">Entreprises</h5>
                    <p className="card-text">{stats.totalEnterprises} entreprises</p>
                    <Link to="/entreprise" className="btn btn-info">Voir</Link>
                  </div>
                </div>
              </div>

              {/* Offres */}
              <div className="col-md-3">
                <div className="card text-center border-warning">
                  <div className="card-body">
                    <h5 className="card-title">Offres</h5>
                    <p className="card-text">{stats.totalOffers} offres</p>
                    <Link to="/offres" className="btn btn-warning">Voir</Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default AdminDashboard;