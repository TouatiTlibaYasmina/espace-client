import React, { useState } from "react";
import { FiEye, FiEyeOff, FiKey, FiCheck } from "react-icons/fi";
import "./ChangerMotDePasse.css";

// Composant pour changer le mot de passe de l'utilisateur
function ChangerMotDePasse() {
  // États pour gérer les champs du formulaire
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  // États pour gérer la visibilité des mots de passe
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  // État pour afficher les messages d'erreur
  const [error, setError] = useState("");
  // État pour afficher le message de succès
  const [successMessage, setSuccessMessage] = useState("");
  // État pour indiquer le chargement
  const [loading, setLoading] = useState(false);

  // Gère la modification des champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Permet d'afficher ou masquer le mot de passe pour chaque champ
  const togglePasswordVisibility = (field) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Gère la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validation du mot de passe actuel
    if (!formData.currentPassword) {
      setError("Veuillez entrer votre mot de passe actuel");
      return;
    }

    // Vérifie la longueur du nouveau mot de passe
    if (formData.newPassword.length < 10) {
      setError("Le mot de passe doit contenir au moins 10 caractères");
      return;
    }

    // Vérifie la complexité du nouveau mot de passe
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/.test(formData.newPassword)) {
      setError("Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial");
      return;
    }

    // Vérifie la correspondance des mots de passe
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);

    try {
      // Récupère le token d'authentification
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vous devez être connecté");
        setLoading(false);
        return;
      }

      // Envoie la requête pour changer le mot de passe
      const response = await fetch("https://backend-espace-client.onrender.com/api/users/profile/changePassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      // Gère les erreurs de la réponse
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors du changement de mot de passe");
      }

      // Affiche le message de succès et réinitialise le formulaire
      setSuccessMessage("Mot de passe changé avec succès!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

    } catch (err) {
      // Affiche le message d'erreur en cas d'échec
      console.error("Erreur:", err);
      setError(err.message || "Erreur lors de la mise à jour du mot de passe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cmp-profile-container">
      <h2 className="cmp-title">Changer le mot de passe</h2>

      {/* Affiche le message d'erreur si présent */}
      {error && (
        <div className="cmp-alert cmp-error">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
      )}

      {/* Affiche le message de succès si présent */}
      {successMessage && (
        <div className="cmp-alert cmp-success">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="cmp-form">
        {/* Champ pour le mot de passe actuel */}
        <div className="cmp-form-group">
          <label className="cmp-label">
            <FiKey className="cmp-input-icon" /> Mot de passe actuel
          </label>
          <div className="cmp-input-group">
            <input
              type={passwordVisibility.currentPassword ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              className="cmp-input"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("currentPassword")}
              className="cmp-eye-button"
            >
              {passwordVisibility.currentPassword ? (
                <FiEyeOff size={20} className="cmp-eye-icon" />
              ) : (
                <FiEye size={20} className="cmp-eye-icon" />
              )}
            </button>
          </div>
        </div>

        {/* Champ pour le nouveau mot de passe */}
        <div className="cmp-form-group">
          <label className="cmp-label">
            <FiKey className="cmp-input-icon" /> Nouveau mot de passe
          </label>
          <div className="cmp-input-group">
            <input
              type={passwordVisibility.newPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              minLength={10}
              className="cmp-input"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("newPassword")}
              className="cmp-eye-button"
            >
              {passwordVisibility.newPassword ? (
                <FiEyeOff size={20} className="cmp-eye-icon" />
              ) : (
                <FiEye size={20} className="cmp-eye-icon" />
              )}
            </button>
          </div>
        </div>

        {/* Champ pour confirmer le nouveau mot de passe */}
        <div className="cmp-form-group">
          <label className="cmp-label">
            <FiKey className="cmp-input-icon" /> Confirmer le mot de passe
          </label>
          <div className="cmp-input-group">
            <input
              type={passwordVisibility.confirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={10}
              className="cmp-input"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirmPassword")}
              className="cmp-eye-button"
            >
              {passwordVisibility.confirmPassword ? (
                <FiEyeOff size={20} className="cmp-eye-icon" />
              ) : (
                <FiEye size={20} className="cmp-eye-icon" />
              )}
            </button>
          </div>
        </div>

        {/* Bouton de soumission */}
        <button type="submit" className="cmp-submit-btn" disabled={loading}>
          {loading ? (
            <>
              <span className="cmp-loading-spinner"></span>
              En cours...
            </>
          ) : (
            <>
              <FiCheck size={18} />
              Confirmer le changement
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default ChangerMotDePasse;