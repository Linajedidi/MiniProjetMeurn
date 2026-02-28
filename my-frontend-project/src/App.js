import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/Register";     
import AdminDashboard from "./pages/AdminDashboard";
import CandidatHome from "./pages/CandidatHome";
import EntrepriseHome from "./pages/EntrepriseHome";
import AdminLayout from './components/Sidebar';

import UsersPage from "./pages/UsersPage";
import Home from "./pages/home";                   
import ProfilePage from "./pages/ProfilePage";
import MesOffresEntr from "./pages/MesOffresEntr";
import CreateOffre from "./pages/Createoffre.js";
import EditOffre from "./pages/EditOffre.js";



import OffresPage from "./pages/OffresPage";
import CandidatsPage from "./pages/CandidatsPage";
import EntreprisePage from "./pages/EntreprisePage";
import CreateCV from "./pages/CreateCV";

import CandidaturesPage from "./pages/CandidaturesPage";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Routes protégées */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/pages/AdminDashboard" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/pages/CandidatHome" element={<ProtectedRoute role="CANDIDAT"><CandidatHome /></ProtectedRoute>} />
        <Route path="/pages/EntrepriseHome" element={<ProtectedRoute role="ENTREPRISE"><EntrepriseHome /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminLayout /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute role="ADMIN"><UsersPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/offres" element={<ProtectedRoute><OffresPage /></ProtectedRoute>} />
        <Route path="/candidat" element={<ProtectedRoute><CandidatsPage /></ProtectedRoute>} />
        <Route path="/entreprise" element={<ProtectedRoute><EntreprisePage /></ProtectedRoute>} />
      <Route path="/pages/MesOffresEntr"element={<ProtectedRoute role="ENTREPRISE"><MesOffresEntr /> </ProtectedRoute>}/>
        <Route path="/pages/CreateOffre" element={<CreateOffre />} />
        <Route path="/pages/edit-offre/:id" element={<EditOffre />} />
       
        <Route path="/create-cv" element={<CreateCV />} />
        <Route path="/candidaturesPage"element={<ProtectedRoute role="ENTREPRISE"><CandidaturesPage /></ProtectedRoute>}/>

      
       

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// Composant de protection simple (côté front – pas 100% sécurisé)
function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default App;