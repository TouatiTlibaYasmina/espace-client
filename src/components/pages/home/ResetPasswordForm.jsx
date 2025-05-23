import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './ConnexionForm.css';

function ResetPasswordForm() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState(""); // Added
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch("https://backend-espace-client.onrender.com/api/users/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }), // Include email
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Mot de passe réinitialisé avec succès !");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setError(data.message || "Une erreur est survenue.");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="conteneur">
        <h2 className="sous_titre">Réinitialisation du mot de passe</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirmez le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          <button className= "cf-button" type="submit">Réinitialiser</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordForm;
