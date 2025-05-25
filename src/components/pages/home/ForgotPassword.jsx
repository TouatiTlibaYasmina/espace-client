import React, { useState } from 'react';
import "./ConnexionForm.css";

// Composant pour le formulaire de réinitialisation du mot de passe
function ForgotPasswordForm({ closeModal }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Gère la soumission du formulaire d'email
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      // Envoie la requête POST à l'API pour demander la réinitialisation
      const response = await fetch("https://backend-espace-client.onrender.com/api/users/forgotPassword",  {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      // Affiche un message de succès ou d'erreur selon la réponse
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
    // Overlay du modal, ferme le modal au clic à l'extérieur
    <div className="modal-overlay" onClick={closeModal}>
      {/* Contenu du modal, empêche la propagation du clic */}
      <div className="modal-content conteneur" onClick={(e) => e.stopPropagation()}>
        {/* Bouton pour fermer le modal */}
        <span className="close-x" onClick={closeModal}>×</span>

        <h2 className="sous_titre">Mot de passe oublié ?</h2>
        <p>Saisissez votre email pour recevoir un lien de réinitialisation.</p>
        {/* Formulaire de saisie de l'email */}
        <form onSubmit={handleEmailSubmit}>
          <input
            type="email"
            placeholder="Votre adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* Affiche un message d'erreur si besoin */}
          {error && <div className="error-message">{error}</div>}
          {/* Affiche un message de succès si besoin */}
          {message && <div className="success-message">{message}</div>}
          <button className="cf-button" type="submit">Envoyer</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;
