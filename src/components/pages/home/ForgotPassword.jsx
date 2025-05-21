import React, { useState } from 'react';
import "./ConnexionForm.css";

function ForgotPasswordForm({ closeModal }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch("https://backend-espace-client.onrender.com/api/users/forgotPassword",  {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Un email de réinitialisation vous a été envoyé.");
      } else {
        setError(data.message || "Erreur lors de l'envoi.");
      }
    } catch (err) {
      setError("Erreur serveur.");
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content conteneur" onClick={(e) => e.stopPropagation()}>
        <span className="close-x" onClick={closeModal}>×</span>

        <h2 className="sous_titre">Mot de passe oublié ?</h2>
        <p>Saisissez votre email pour recevoir un lien de réinitialisation.</p>
        <form onSubmit={handleEmailSubmit}>
          <input
            type="email"
            placeholder="Votre adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
          <button type="submit">Envoyer</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;
