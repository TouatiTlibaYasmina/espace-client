import React, { useState } from 'react';
import './Header.css';
import { Link as ScrollLink } from 'react-scroll';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logos/logo.svg';
import idoomLogo from "../../../assets/logos/idoom_market_logomono.png";
import ePaiementLogo from "../../../assets/logos/e-paiement-logo.png";

const Header = ({ 
  userType, 
  setUserType, 
  openInscriptionModal, 
  openConnexionModal,
  isAuthenticated,
  userEmail
}) => {
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

const handleLogout = () => {
  // Clear all auth-related items
  localStorage.removeItem('token');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('role');
  
  // Redirect to home with full refresh to clear all states
  window.location.href = '/';
};

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  return (
    <header className="at-header">
      <div className="left-section">
        <Link to="/">
          <img src={logo} alt="Algérie Télécom" className="at-logo" />
        </Link>
        <div className="user-switch">
          <span
            className={`user-link ${userType === "particulier" ? "active" : ""}`}
            onClick={() => setUserType("particulier")}
          >
            Particuliers
          </span>
          <span className="divider">|</span>
          <span
            className={`user-link ${userType === "professionnel" ? "active" : ""}`}
            onClick={() => setUserType("professionnel")}
          >
            Professionnels
          </span>
        </div>
      </div>

      <nav className="center-nav">
        <ScrollLink to="accueil" smooth={true} duration={500} offset={-70}>Accueil</ScrollLink>
        <ScrollLink to="offres" smooth={true} duration={500} offset={-70}>Offres</ScrollLink>
        <ScrollLink to="services" smooth={true} duration={500} offset={-70}>Services</ScrollLink>
        <ScrollLink to="contact" smooth={true} duration={500} offset={-70}>Contact</ScrollLink>
      </nav>

      <div className="right-section">
        <div className="icon-circle">
          <a href="https://idoom-market.com.dz/" target="_blank" rel="noopener noreferrer" title="Idoom Market">
            <img src={idoomLogo} alt="Idoom Market" className="icon-img" />
          </a>
        </div>
        <div className="icon-circle">
          <a href="https://paiement.at.dz/index.php?p=voucher_internet&produit=in" target="_blank" rel="noopener noreferrer" title="e-Paiement">
            <img src={ePaiementLogo} alt="e-Paiement" className="icon-img" />
          </a>
        </div>

        {isAuthenticated ? (
          <div className="header-user-info">
            <div className="header-user-email" onClick={toggleUserDropdown}>
              {userEmail}
              <span className="header-user-dropdown-arrow">▼</span>
            </div>
            {showUserDropdown && (
              <div className="header-user-dropdown">
                <Link to="/espace-client" className="header-user-dropdown-item">
                  Mon espace client
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="header-user-dropdown-item header-user-dropdown-logout"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button onClick={openConnexionModal} className="btn white">
              Se connecter
            </button>
            <button className="btn green" onClick={openInscriptionModal}>
              Créer Espace client
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;