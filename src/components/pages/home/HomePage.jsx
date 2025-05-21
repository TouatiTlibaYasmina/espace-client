import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
// Component imports
import Header from './Header';
import FAQ from './FAQ';
import InscriptionForm from './InscriptionForm';
import ConnexionForm from './ConnexionForm';
import ForgotPasswordForm from './ForgotPassword';// Matches ForgotPassword.jsx
// Illustration imports - use direct relative paths
import questionsIllustration from '../../../assets/illustrations/questions.svg';
import serviceIllustration from '../../../assets/illustrations/undraw_selected-options.svg';
import heroIllustration from '../../../assets/illustrations/undraw_hello_ccwj.svg';
import offresIllustration from '../../../assets/illustrations/undraw_select-option_a16s.svg';
import contactIllustration from '../../../assets/illustrations/undraw_contact-us.svg';

// Icon imports - use direct relative paths
import facebookIcon from '../../../assets/icons/icons8-facebook.svg';
import instagramIcon from '../../../assets/icons/icons8-instagram.svg';
import twitterIcon from '../../../assets/icons/icons8-x.svg';
import youtubeIcon from '../../../assets/icons/icons8-youtube.svg';

// Style import
import './HomePage.css';






function HomePage() {
  const [userType, setUserType] = useState("particulier");
  const [triggerAnim, setTriggerAnim] = useState(true);
  const [isInscriptionOpen, setIsInscriptionOpen] = useState(false);
  const openInscriptionModal = () => setIsInscriptionOpen(true);
  const closeInscriptionModal = () => setIsInscriptionOpen(false);

  const [isConnexionOpen, setIsConnexionOpen] = useState(false);
  const openConnexionModal = () => setIsConnexionOpen(true);
  const closeConnexionModal = () => setIsConnexionOpen(false);

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const openForgotPasswordModal = () => setIsForgotPasswordOpen(true);
  const closeForgotPasswordModal = () => setIsForgotPasswordOpen(false);

  

  useEffect(() => {
    setTriggerAnim(true); // Reset triggerAnim to true on page load
  }, []);

  const handleAccueilClick = () => {
    setTriggerAnim(false);
    setTimeout(() => setTriggerAnim(true), 1000); // Reset animation after 1 second
  };

  return (
    <div >
      <Header 
        onAccueilClick={handleAccueilClick}
        userType={userType}
        setUserType={setUserType} 
        openInscriptionModal={openInscriptionModal}  
        openConnexionModal={openConnexionModal}      
      />
      
      {isInscriptionOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <InscriptionForm closeModal={closeInscriptionModal} />
          </div>
        </div>
      )}

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

      {isForgotPasswordOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <ForgotPasswordForm closeModal={closeForgotPasswordModal} />
          </div>
        </div>
      )}

<section className="hero">
  {/* Left column: title + image */}
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

  {/* Right column: description */}
  <motion.div
    className="hero-description-container"
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.5, duration: 0.6 }}
  >
    <p className="hero-description">
      Explorez les services et offres d’Algérie Télécom, conçus pour répondre à vos besoins.
      <br /><br />
      Que vous soyez un particulier ou un professionnel, nous vous accompagnons à chaque étape avec des solutions fiables, innovantes et faciles à utiliser.
      <br /><br />
      Gérez vos abonnements, suivez votre consommation, accédez à une assistance rapide — tout cela depuis un espace client simple et centralisé.
    </p>
  </motion.div>
</section>





      <section id="accueil" className="section">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
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

      <section id="offres" className="section offres-section">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Offres Disponibles
        </motion.h2>
        <motion.div
          className="image-top"
          initial={{ opacity: 0, y: -50 }}
          animate={triggerAnim ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ duration: 1.2 }}
        >
          <img src={offresIllustration} alt="Illustration" />
        </motion.div>

        <div className="offres-cards">
          {['Téléphonie', 'Internet'].map((category, categoryIndex) => (
            <div key={categoryIndex} className="category-section">
              <h3 className="category-title">{category}</h3>

              <div className="category-offres">
                {(userType === "particulier" ? [
                  {
                    categorie: "Téléphonie",
                    titre: "IDOOM FIXE",
                    description: "Téléphonie fixe avec appels illimités.",
                    avantages: ["Appels nationaux illimités", "Service 24/7", "Qualité sonore exceptionnelle"]
                  },
                  {
                    categorie: "Internet",
                    titre: "IDOOM FIBRE",
                    description: "Internet ultra-rapide avec la fibre optique.",
                    avantages: ["Jusqu'à 100 Mbps", "Installation rapide", "Meilleure stabilité"]
                  },
                  {
                    categorie: "Internet",
                    titre: "IDOOM FIBRE Gamers",
                    description: "Connexion fibre dédiée aux joueurs.",
                    avantages: ["Ping faible", "Débit jusqu'à 200 Mbps", "Stabilité optimale"]
                  },
                  {
                    categorie: "Internet",
                    titre: "IDOOM 4G LTE",
                    description: "Connexion sans fil haut débit où que vous soyez.",
                    avantages: ["Mobilité", "Forfaits flexibles", "Activation rapide"]
                  },
                  {
                    categorie: "Internet",
                    titre: "IDOOM VDSL",
                    description: "Connexion à haut débit pour plus de performance.",
                    avantages: ["Vitesse de connexion accrue", "Connexion fiable", "Service rapide"]
                  },
                   
                ] : [
                  {
                    categorie: "Téléphonie",
                    titre: "Téléphonie Fixe",
                    description: "Solution de téléphonie fixe professionnelle.",
                    avantages: ["Appels illimités", "Support professionnel", "Solutions sur mesure"]
                  },
                  {
                    categorie: "Internet",
                    titre: "IDOOM FIBRE Pro",
                    description: "Internet ultra-rapide dédié aux professionnels.",
                    avantages: ["Jusqu'à 500 Mbps", "Service prioritaire", "Support 24/7"]
                  },
                  {
                    categorie: "Internet",
                    titre: "IDOOM ADSL Pro",
                    description: "Connexion haut débit dédiée aux entreprises.",
                    avantages: ["Débit stable", "Support dédié", "Service rapide"]
                  },
                  {
                    categorie: "Internet",
                    titre: "IDOOM 4G Pro",
                    description: "Solution mobile haut débit pour les professionnels.",
                    avantages: ["Mobilité", "Vitesse de connexion élevée", "Offres flexibles"]
                  },
                  
                   
                    
                ]).filter(offre => offre.categorie === category).map((offre, index) => (
                  <motion.div 
                    key={index}
                    className="offre-card"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.2 }}
                  >
                    <h4>{offre.titre}</h4>
                    <p>{offre.description}</p>
                    <ul>
                      {offre.avantages.map((adv, i) => (
                        <li key={i}>• {adv}</li>
                      ))}
                    </ul>
                    <button className="btn-choisir">Choisir cette offre</button>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section id="services" className="section-services">
      <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Services Disponibles
        </motion.h2>
        <motion.div
          className="image-top"
          initial={{ opacity: 0, y: -50 }}
          animate={triggerAnim ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ duration: 1.2 }}
        >
          <img src={serviceIllustration} alt="Illustration" />
        </motion.div>

  <div className="offres-cards">
    {(userType === "particulier" ? [
      {
        categorie: "Services",
        titre: "My Idoom",
        description: "Gestion personnalisée de votre abonnement Idoom.",
        avantages: ["Suivi de consommation", "Services personnalisés", "Support rapide"]
      },
      {
        categorie: "Services",
        titre: "Idoomly",
        description: "La solution idéale pour la gestion des abonnements.",
        avantages: ["Notifications en temps réel", "Abonnements flexibles", "Réduction des coûts"]
      },
      {
        categorie: "Services",
        titre: "E-paiement",
        description: "Solution de paiement en ligne sécurisée.",
        avantages: ["Facilité de paiement", "Sécurisation des transactions", "Paiement instantané"]
      }
    ] : [
      {
        categorie: "Services",
        titre: "Big Business",
        description: "Solutions sur mesure pour les grandes entreprises.",
        avantages: ["Service personnalisé", "Support exclusif", "Infrastructures robustes"]
      },
      {
        categorie: "Services",
        titre: "Startup",
        description: "Offre pour les startups avec des solutions flexibles.",
        avantages: ["Forfaits adaptatifs", "Support technique", "Services à la carte"]
      },
      {
        categorie: "Services",
        titre: "Pack MOHTARIF",
        description: "Pack tout-en-un pour une communication optimale.",
        avantages: ["Services téléphonie, internet et cloud", "Installation rapide", "Service premium"]
      },
      {
        categorie: "Services",
        titre: "ROOM VIDEO CALL",
        description: "Solution de visioconférence pour les entreprises.",
        avantages: ["Haute qualité audio/vidéo", "Plateforme sécurisée", "Support dédié"]
      },
      {
        categorie: "Services",
        titre: "Hébergement de Sites Web (Spécial Médias Nationaux)",
        description: "Hébergement de sites internet pour les médias nationaux.",
        avantages: ["Serveurs haute performance", "Support dédié", "Soutien au contenu national"]
      },
      {
        categorie: "Services",
        titre: "Événement à la Demande",
        description: "Organisation d'événements virtuels sur demande.",
        avantages: ["Flexibilité totale", "Support technique", "Visibilité accrue"]
      },
      {
        categorie: "Services",
        titre: "Packs Anti-DDoS",
        description: "Protection avancée contre les attaques DDoS.",
        avantages: ["Haute disponibilité", "Protection en temps réel", "Support 24/7"]
      },
      {
        categorie: "Services",
        titre: "Packs Cybersecurite",
        description: "Sécurisez vos données avec des solutions adaptées.",
        avantages: ["Audit de sécurité", "Prévention des intrusions", "Sécurisation des réseaux"]
      },
      {
        categorie: "Services",
        titre: "Centre de Contacts",
        description: "Gestion des appels et de la relation client.",
        avantages: ["Technologie avancée", "Support dédié", "Optimisation de la relation client"]
      },
      {
        categorie: "Services",
        titre: "Visioconférence",
        description: "Solution de visioconférence pour entreprises.",
        avantages: ["Haute qualité", "Plateforme sécurisée", "Support dédié"]
      },
      {
        categorie: "Services",
        titre: "Conception de Sites Web",
        description: "Création de sites internet adaptés aux besoins de votre entreprise.",
        avantages: ["Design sur mesure", "Sites performants", "Optimisation SEO"]
      },
      {
        categorie: "Services",
        titre: "Hébergement de Site Web",
        description: "Hébergement de sites web sécurisé et performant.",
        avantages: ["Serveurs haute performance", "Support technique", "Scalabilité"]
      }
    ]).map((offre, index) => (
      <motion.div 
        key={index}
        className="offre-card"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
      >
        <h4>{offre.titre}</h4>
        <p>{offre.description}</p>
        <ul>
          {offre.avantages.map((adv, i) => (
            <li key={i}>• {adv}</li>
          ))}
        </ul>
        <button className="btn-choisir">Découvrir</button>
      </motion.div>
    ))}
  </div>
</section>
<section className="contact" id="contact">
  <div className="contact-container">
    <div className="contact-text">
    <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
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

  
        <footer className="footer">
          <div className="footer-content">
            <p>&copy; 2023 Algérie Télécom. Tous droits réservés.</p>
            <p>Développé par [TALMAT AMMAR Amira & TOUATI TLIBA Yasmina]</p>
          </div>
        </footer>
    </div>
  );
}

export default HomePage;