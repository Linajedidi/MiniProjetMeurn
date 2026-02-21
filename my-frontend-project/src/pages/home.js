import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return; 
    }

    if (role === 'ADMIN') {
      navigate('/pages/AdminDashboard');
    } else if (role === 'CANDIDAT') {
      navigate('/pages/CandidatHome');
    } else if (role === 'ENTREPRISE') {
      navigate('/pages/EntrepriseHome');
    }
  }, [navigate]);

  const username = localStorage.getItem('name') || 'Utilisateur';

  return (
    <div className="container mt-5 text-center">
      <h1>Bienvenue sur la plateforme</h1>
      <p className="lead mt-4">
        Vous êtes connecté en tant que : <strong className="text-primary">{username}</strong>
      </p>

      <div className="mt-5">
        <button
          className="btn btn-outline-danger btn-lg px-5"
          onClick={() => {
            localStorage.clear();
            navigate('/');
          }}
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
};

export default Home;