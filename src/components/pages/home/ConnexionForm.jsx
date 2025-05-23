import React, { useState } from "react";
import "./ConnexionForm.css";
import logo from "../../../assets/logos/logo.svg"; 
import {useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaLightbulb } from 'react-icons/fa';
const ConnexionForm = ({ closeModal, openInscriptionModal, openForgotPasswordModal }) => {  // <-- on prépare closeModal pour fermer si besoin
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // States pour les inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
 
  
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
  
      if (response.status === 202 && data.requiresTwoFactor) {
        setTwoFactorRequired(true);
      } else if (data.success) {
        console.log("Login réussi avec token :", data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.userType); // "admin" or "client"
        localStorage.setItem("userId", data.userId); // Optional
  
        // Redirection based on role
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
        <input 
            type="email" 
            placeholder="Saisir votre adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={twoFactorRequired}
        />

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
          {twoFactorRequired && (
            <input
              type="text"
               placeholder="Code de vérification (2FA)"
                 value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
            />
              )}

  
  <div className="forgot-password-container">
  <a className="lien-mdp-oublie" onClick={openForgotPasswordModal}>
    Mot de passe oublié ?
  </a>
</div>
{errorMessage && <div className="error-message">{errorMessage}</div>}

  
          <button type="submit" className="cf-button">Se connecter</button>
  
          <div className="create-account-container">
          <span
               onClick={() => {
                  closeModal();           // ferme la modale de connexion
                  openInscriptionModal(); // ouvre celle d'inscription
                   }}
                        className="creer-compte"
                >Créer un compte ?
              </span>

          </div>
          <p className="welcome-tip">
  <FaLightbulb className="lamp-icon" />En cas de difficultés, veuillez consulter notre section d'assistance.
</p>
        </form>
      </div>
    </div>
  );
  
};

export default ConnexionForm;
