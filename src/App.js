import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import HomePage from './components/pages/home/HomePage';
import UserDashboard from './components/pages/user/UserDashboard';
import ResetPasswordForm from './components/pages/home/ResetPasswordForm';
import AdminDashboard from './components/pages/admin/AdminDashboard';

// Composant pour protéger les routes réservées à l'admin
const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Redirige vers la page d'accueil si l'utilisateur n'est pas admin ou non authentifié
  if (!token || role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Composant pour protéger les routes nécessitant une authentification
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // Redirige vers la page d'accueil si l'utilisateur n'est pas authentifié
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Route pour la page d'accueil */}
        <Route path="/" element={<HomePage />} />
        {/* Route pour le formulaire de réinitialisation du mot de passe */}
        <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
        {/* Route protégée pour l'admin */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        {/* Route protégée pour l'espace client */}
        <Route
          path="/espace-client"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
