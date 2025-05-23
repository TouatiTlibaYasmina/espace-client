import React, { useState, useEffect } from 'react';
import { FaUser, FaSignOutAlt, FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';
import { Link as ScrollLink } from 'react-scroll';
import { Link } from "react-router-dom";
import logo from '../../../assets/logos/logo.svg';
import idoomLogo from "../../../assets/logos/idoom_market_logomono.png";
import ePaiementLogo from "../../../assets/logos/e-paiement-logo.png";
import './Header.css';

const Header = ({ 
  isAnyModalOpen,
  userType, 
  setUserType, 
  openInscriptionModal, 
  openConnexionModal,
  isAuthenticated,
  userEmail
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  return (
    <header className="at-header"
    style={{
        position: isAnyModalOpen ? "static" : "sticky",
        top: isAnyModalOpen ? "unset" : "0",
      }}>
      <div className="at-header__container">
        <div className="at-header__left">
          <Link to="/" className="at-header__logo-link">
            <img src={logo} alt="Algérie Télécom" className="at-header__logo" />
          </Link>
          
          <div className="at-header__user-switch">
            <button
              className={`at-header__user-link ${userType === "particulier" ? "at-header__user-link--active" : ""}`}
              onClick={() => setUserType("particulier")}
            >
              Particuliers
            </button>
            <span className="at-header__divider">|</span>
            <button
              className={`at-header__user-link ${userType === "professionnel" ? "at-header__user-link--active" : ""}`}
              onClick={() => setUserType("professionnel")}
            >
              Professionnels
            </button>
          </div>
        </div>

        <button 
          className="at-header__mobile-toggle" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
<nav className="at-header__nav">
            <ScrollLink 
              to="accueil" 
              smooth={true} 
              duration={500} 
              offset={-70}
              className="at-header__nav-link"
            >
              Accueil
            </ScrollLink>
            <ScrollLink 
              to="assistance" 
              smooth={true} 
              duration={500} 
              offset={-70}
              className="at-header__nav-link"
            >
              Assistance
            </ScrollLink>
          
            <ScrollLink 
              to="contact" 
              smooth={true} 
              duration={500} 
              offset={-70}
              className="at-header__nav-link"
            >
              Contact
            </ScrollLink>
          </nav>
        <div className={`at-header__right ${isMobileMenuOpen ? 'at-header__right--open' : ''}`}>
          

          <div className="at-header__actions">
            <div className="at-header__icons">
              <a 
                href="https://idoom-market.com.dz/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="at-header__icon"
                title="Idoom Market"
              >
                <img src={idoomLogo} alt="Idoom Market" className="at-header__icon-img" />
              </a>
              <a 
                href="https://paiement.at.dz/index.php?p=voucher_internet&produit=in" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="at-header__icon"
                title="e-Paiement"
              >
                <img src={ePaiementLogo} alt="e-Paiement" className="at-header__icon-img" />
              </a>
            </div>

            {isAuthenticated ? (
  <div className="at-header__user-menu">
    <button 
      className="at-header__user-trigger"
      onClick={() => setShowUserDropdown(!showUserDropdown)}
      aria-expanded={showUserDropdown}
    >
      {/* NEW USER INFO SECTION - REPLACE JUST THIS PART */}
      <div className="at-header__user-info">
        <div className="at-header__user-avatar">
          {userEmail ? userEmail[0].toUpperCase() : 'U'}
        </div>
        <div className="at-header__user-details">
          <span className="at-header__user-email">{userEmail}</span>
        </div>
      </div>
      {/* END OF NEW SECTION */}
      <FaChevronDown className={`at-header__dropdown-arrow ${showUserDropdown ? 'at-header__dropdown-arrow--open' : ''}`} />
    </button>
    
    {/* KEEP THE EXISTING DROPDOWN MENU BELOW EXACTLY AS IS */}
    {showUserDropdown && (
      <div className="at-header__dropdown">
        <Link 
          to="/espace-client" 
          className="at-header__dropdown-item"
          onClick={() => setShowUserDropdown(false)}
        >
          <FaUser className="at-header__dropdown-icon" />
          <span>Mon espace client</span>
        </Link>
        <button 
          onClick={handleLogout}
          className="at-header__dropdown-item at-header__dropdown-item--logout"
        >
          <FaSignOutAlt className="at-header__dropdown-icon" />
          <span>Déconnexion</span>
        </button>
      </div>
    )}
  </div>
) : (
  /* KEEP EXISTING AUTH BUTTONS */
  <div className="at-header__auth">
    <button onClick={openConnexionModal} className="at-header__btn at-header__btn--login">
      Se connecter
    </button>
    <button onClick={openInscriptionModal} className="at-header__btn at-header__btn--signup">
      Créer Espace client
    </button>
  </div>
)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;