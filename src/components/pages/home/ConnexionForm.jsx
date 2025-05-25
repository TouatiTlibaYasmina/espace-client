import React, { useState } from "react";
import "./ConnexionForm.css";
import logo from "../../../assets/logos/logo.svg"; 
import {useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaLightbulb } from 'react-icons/fa';

// Composant de formulaire de connexion
const ConnexionForm = ({ closeModal, openInscriptionModal, openForgotPasswordModal }) => {  
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // États pour les champs du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Gestion de la soumission du formulaire de connexion
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
  
    try {
      const response = await fetch('https://backend-espace-client.onrender.com/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: email,
          password,
          ...(twoFactorRequired && { twoFactorCode })
        })
      });
  
      const data = await response.json();
  
      // Si la double authentification est requise
      if (response.status === 202 && data.requiresTwoFactor) {
        setTwoFactorRequired(true);
      } else if (data.success) {
        // Connexion réussie, stockage du token et redirection selon le rôle
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.userType);
        localStorage.setItem("userId", data.userId);
  
        if (data.userType === "admin") {
          navigate("/admin");
        } else {
          navigate("/espace-client");
        }
      } else {
        setErrorMessage(data.message || 'Erreur inconnue');
      }
  
    } catch (err) {
      setErrorMessage('Erreur de connexion au serveur');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="conteneur" onClick={(e) => e.stopPropagation()}>
        <span className="close-x" onClick={closeModal}>×</span>
  
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="titre">Espace Client</h2>
        <h3 className="sous_titre">Bienvenue !</h3>
        
        <form className="form-container" onSubmit={handleLogin}>
          {/* Champ email */}
          <input 
            type="email" 
            placeholder="Saisir votre adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={twoFactorRequired}
          />

          {/* Champ mot de passe avec affichage/masquage */}
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Saisir mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button" 
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Champ code 2FA si nécessaire */}
          {twoFactorRequired && (
            <input
              type="text"
              placeholder="Code de vérification (2FA)"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
            />
          )}

          {/* Lien mot de passe oublié */}
          <div className="forgot-password-container">
            <a className="lien-mdp-oublie" onClick={openForgotPasswordModal}>
              Mot de passe oublié ?
            </a>
          </div>

          {/* Affichage des erreurs */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          {/* Bouton de connexion */}
          <button type="submit" className="cf-button">Se connecter</button>
  
          {/* Lien pour créer un compte */}
          <div className="create-account-container">
            <span
              onClick={() => {
                closeModal();
                openInscriptionModal();
              }}
              className="creer-compte"
            >
              Créer un compte ?
            </span>
          </div>

          {/* Astuce d'accueil */}
          <p className="welcome-tip">
            <FaLightbulb className="lamp-icon" />En cas de difficultés, veuillez consulter notre section d'assistance.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ConnexionForm;
