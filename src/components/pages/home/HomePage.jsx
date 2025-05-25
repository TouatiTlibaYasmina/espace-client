import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from './Header';
import FAQ from './FAQ';
import InscriptionForm from './InscriptionForm';
import ConnexionForm from './ConnexionForm';
import ForgotPasswordForm from './ForgotPassword';
import questionsIllustration from '../../../assets/illustrations/questions.svg';
import serviceIllustration from '../../../assets/illustrations/undraw_selected-options.svg';
import heroIllustration from '../../../assets/illustrations/undraw_hello_ccwj.svg';
import offresIllustration from '../../../assets/illustrations/undraw_select-option_a16s.svg';
import contactIllustration from '../../../assets/illustrations/undraw_contact-us.svg';
import facebookIcon from '../../../assets/icons/icons8-facebook.svg';
import instagramIcon from '../../../assets/icons/icons8-instagram.svg';
import twitterIcon from '../../../assets/icons/icons8-x.svg';
import youtubeIcon from '../../../assets/icons/icons8-youtube.svg';
import { FaHeadset,FaLightbulb } from 'react-icons/fa';
import './HomePage.css';

function HomePage() {
  // Type d'utilisateur sélectionné (particulier ou professionnel)
  const [userType, setUserType] = useState("particulier");
  // Contrôle de l'animation du titre
  const [triggerAnim, setTriggerAnim] = useState(true);

  // Gestion de l'ouverture/fermeture du modal d'inscription
  const [isInscriptionOpen, setIsInscriptionOpen] = useState(false);
  const openInscriptionModal = () => setIsInscriptionOpen(true);
  const closeInscriptionModal = () => setIsInscriptionOpen(false);

  // Gestion de l'ouverture/fermeture du modal de connexion
  const [isConnexionOpen, setIsConnexionOpen] = useState(false);
  const openConnexionModal = () => setIsConnexionOpen(true);
  const closeConnexionModal = () => setIsConnexionOpen(false);

  // Gestion de l'ouverture/fermeture du modal mot de passe oublié
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const openForgotPasswordModal = () => setIsForgotPasswordOpen(true);
  const closeForgotPasswordModal = () => setIsForgotPasswordOpen(false);

  // Vérifie si un modal est ouvert
  const isAnyModalOpen = isInscriptionOpen || isConnexionOpen || isForgotPasswordOpen;

  // Réinitialise l'animation au chargement de la page
  useEffect(() => {
    setTriggerAnim(true);
  }, []);

  // Gère le clic sur "Accueil" pour relancer l'animation
  const handleAccueilClick = () => {
    setTriggerAnim(false);
    setTimeout(() => setTriggerAnim(true), 1000);
  };

  // Fait défiler la page vers le haut et relance l'animation
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    handleAccueilClick();
  };

  return (
    <div >
      {/* En-tête de la page */}
      <Header 
        onAccueilClick={handleAccueilClick}
        userType={userType}
        setUserType={setUserType} 
        openInscriptionModal={openInscriptionModal}  
        openConnexionModal={openConnexionModal}
        isAuthenticated={!!localStorage.getItem('token')}
        userEmail={localStorage.getItem('userEmail')}
        isAnyModalOpen={isAnyModalOpen}      
      />
      
      {/* Modal d'inscription */}
      {isInscriptionOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <InscriptionForm closeModal={closeInscriptionModal} />
          </div>
        </div>
      )}

      {/* Modal de connexion */}
      {isConnexionOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <ConnexionForm closeModal={closeConnexionModal}
              openInscriptionModal={openInscriptionModal}
              openForgotPasswordModal={openForgotPasswordModal}
            />
          </div>
        </div>
      )}

      {/* Modal mot de passe oublié */}
      {isForgotPasswordOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <ForgotPasswordForm closeModal={closeForgotPasswordModal} />
          </div>
        </div>
      )}

      {/* Section Accueil (Héros) */}
      <section id="accueil" className="hero">
        {/* Colonne gauche : titre animé et illustration */}
        <div className="hero-text">
          <motion.h1 className="hero-title">
            {[..."Toujours plus proche."].map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={triggerAnim ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  display: 'inline-block',
                  whiteSpace: char === " " ? "pre" : "normal",
                  marginRight: char === " " ? "4px" : "0"
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>

          <motion.div
            className="hero-image"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <img src={heroIllustration} alt="Illustration accueil" />
          </motion.div>
        </div>

        {/* Colonne droite : description et bouton CTA */}
        <motion.div
          className="hero-description-container"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <p className="hero-description">
            <strong style={{ color: '#1e3a8a' }}>Particulier ou professionnel, reprenez le contrôle de vos services télécom.</strong>
            <br /><br />
            L'Espace Client Algérie Télécom centralise tous vos besoins : gestion des abonnements, suivi de consommation, consultation des factures et assistance — accessibles 24h/24, où que vous soyez.
          </p>

          <motion.button
            onClick={openInscriptionModal}
            className="cta-button"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 6px 20px rgba(40, 167, 69, 0.4)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="button-text">
              Créer Espace Client
            </span>
            <div className="glaze-effect" />
          </motion.button>
        </motion.div>
      </section>

      {/* Section Assistance & FAQ */}
      <section id="assistance" className="section">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FaLightbulb className="title-icon" />
          Assistance & FAQ
        </motion.h2>
        <motion.div
          className="image-top"
          initial={{ opacity: 0, y: -50 }}
          animate={triggerAnim ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ duration: 1.2 }}
        >
          <img src={questionsIllustration} alt="Illustration" />
        </motion.div>

        <div className="faq-content-centered">
          <FAQ />
        </div>
      </section>

      {/* Section Contact */}
      <section className="contact" id="contact">
        <div className="contact-container">
          <div className="contact-text">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <FaHeadset className="title-icon" />
              Contactez-nous
            </motion.h2>
            <p className="contact-description">
              Pour toute assistance ou information, contactez notre service clientèle en composant le <strong>12</strong> (appel gratuit).
              <br /><br />
              Vous pouvez également nous retrouver sur nos canaux officiels :
            </p>
            <ul className="contact-channels">
              <li>
                <strong>Numéro gratuit :</strong> 12
              </li>
              <li>
                <img src={facebookIcon}  alt="Facebook icon" className="channel-icon" />
                <strong>Facebook :</strong> @algerietelecom
              </li>
              <li>
                <img src={instagramIcon} alt="Instagram icon" className="channel-icon" />
                <strong>Instagram :</strong> @algerietelecom
              </li>
              <li>
                <img src={twitterIcon} alt="Twitter/X icon" className="channel-icon" />
                <strong>Twitter / X :</strong> @at_dz
              </li>
              <li>
                <img src={youtubeIcon}  alt="YouTube icon" className="channel-icon" />
                <strong>YouTube :</strong> Algérie Télécom Officiel
              </li>
            </ul>
          </div>
          <motion.div
            className="contact-illustration"
            initial={{ opacity: 0, y: -50 }}
            animate={triggerAnim ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
            transition={{ duration: 1.2 }}
          >
            <img src={contactIllustration} alt="Illustration contact" />
          </motion.div>
        </div>  
      </section>

      {/* Pied de page */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 Algérie Télécom. Tous droits réservés.</p>
          <p>Développé par [TALMAT AMMAR Amira & TOUATI TLIBA Yasmina]</p>
        </div>
      </footer>
      
      {/* Bouton pour remonter en haut de la page */}
      <button 
        className="scroll-to-top"
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#1e3a8a',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          zIndex: '1000',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#003a73';
          e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#1e3a8a';
          e.target.style.transform = 'translateY(0)';
        }}
      >
        ↑
      </button>
    </div>
  );
}

export default HomePage;