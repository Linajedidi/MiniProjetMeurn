import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/Register";     // renomme ton App en Register
import AdminDashboard from "./pages/AdminDashboard";
import CandidatHome from "./pages/CandidatHome";
import EntrepriseHome from "./pages/EntrepriseHome";
import Home from "./pages/home";                   // page par défaut après login

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/pages/AdminDashboard" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/pages/CandidatHome" element={<ProtectedRoute role="CANDIDAT"><CandidatHome /></ProtectedRoute>} />
        <Route path="/pages/EntrepriseHome" element={<ProtectedRoute role="ENTREPRISE"><EntrepriseHome /></ProtectedRoute>} />
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