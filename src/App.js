import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// src/App.js
import HomePage from './components/pages/home/HomePage';
import UserDashboard from './components/pages/user/UserDashboard';
import ResetPasswordForm from './components/pages/home/ResetPasswordForm';
import AdminDashboard from './components/pages/admin/AdminDashboard';


const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};


// ✅ You can define ProtectedRoute right here
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
         <Route
              path="/admin"
              element={
              <AdminProtectedRoute>
                <AdminDashboard />
            </AdminProtectedRoute>
                      }
         />

        
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
