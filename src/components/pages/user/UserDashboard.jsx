import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './UserDashboard.css';
import logo from '../../../assets/logos/logo.svg';
import welcomeIllustration from '../../../assets/illustrations/undraw_welcome_nk8k.svg';
import menuIcon from '../../../assets/icons/icons8-sidebar-menu-24.png';
import idoomLogo from "../../../assets/logos/idoom_market_logomono.png";
import ePaiementLogo from "../../../assets/logos/e-paiement-logo.png";
import facebookIcon from '../../../assets/icons/icons8-facebook.svg';
import instagramIcon from '../../../assets/icons/icons8-instagram.svg';
import twitterIcon from '../../../assets/icons/icons8-x.svg';

import { CgProfile } from "react-icons/cg";
import { MdSubscriptions, MdReportGmailerrorred } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { IoNotificationsOutline } from "react-icons/io5";

import { FiChevronDown, FiChevronUp, FiLogOut, FiSearch, FiSidebar } from "react-icons/fi";
import ModifierProfile from "./Userdashboard/ModifierProfile";
import ChangerMotDePasse from "./Userdashboard/ChangerMotDePasse";
import ChoisirOffre from "./Userdashboard/ChoisirOffre";
import Reclamation from "./Userdashboard/Reclamation";
import HistoriqueAbonnements from "./Userdashboard/HistoriqueAbonnement";
import Notifications from "./Userdashboard/Notifications";
import Factures from "./Userdashboard/Factures";

function ConfirmLogoutModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="ud-modal-overlay">
      <div className="ud-modal-box">
        <h3>Êtes-vous sûr de vouloir vous déconnecter ?</h3>
        <div className="ud-modal-buttons">
          <button className="ud-btn ud-btn-cancel" onClick={onCancel}>Annuler</button>
          <button className="ud-btn ud-btn-confirm" onClick={onConfirm}>Se déconnecter</button>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ title, Icon, submenu = [] }) {
  const [open, setOpen] = useState(false);
  const hasSubmenu = submenu.length > 0;

  return (
    <div className={`ud-sidebar-item ${open ? "open" : ""}`}>
      <div className="ud-sidebar-title" onClick={() => setOpen(!open)}>
        <div className="ud-title-left">
          {Icon && <Icon className="ud-sidebar-icon" />}
          {title}
        </div>
        {hasSubmenu && (
          <span className="ud-arrow">
            {open ? <FiChevronUp /> : <FiChevronDown />}
          </span>
        )}
      </div>
      {open && (
        hasSubmenu ? (
          <ul className="ud-sidebar-submenu">
            {submenu.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <div className="ud-sidebar-empty">Aucune donnée disponible</div>
        )
      )}
    </div>
  );
}

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  // Safe JWT parsing
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error("Failed to parse JWT:", e);
      return null;
    }
  };

  // Fetch user data with hybrid approach
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    // First set basic data from JWT (instant display)
    const decoded = parseJwt(token);
    if (decoded) {
      setUser({
        name: decoded.username || decoded.fullName || decoded.email?.split('@')[0] || "Utilisateur",
        email: decoded.email || "user@example.com",
        initials: (decoded.username?.[0] || decoded.fullName?.[0] || decoded.email?.[0] || "U").toUpperCase()
      });
    }

    // Then fetch fresh data from API
    const fetchUserData = async () => {
      try {
        const response = await fetch("https://backend-espace-client.onrender.com/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        
        if (data?.success && data.user) {
          setUser({
            name: data.user.username || data.user.fullName || data.user.email?.split('@')[0] || "Utilisateur",
            email: data.user.email || "user@example.com",
            initials: (data.user.username?.[0] || data.user.fullName?.[0] || data.user.email?.[0] || "U").toUpperCase(),
            // Add any other user fields you need
            ...data.user
          });
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        // Silently fail - we already have JWT fallback
      }
    };

    fetchUserData();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    try {
      await fetch("https://backend-espace-client.onrender.com/api/users/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case "modifier-profile":
        return <ModifierProfile user={user} />;
      case "changer-mdp":
        return <ChangerMotDePasse user={user} />;
      case "choisir-offre":
        return <ChoisirOffre />;
      case "historique-abonnements":
        return <HistoriqueAbonnements />;
      case "ajouter-reclamation":
        return <Reclamation view="ajouter" />;
      case "voir-reclamations":
        return <Reclamation view="voir" />;
      case "notifications":
        return <Notifications />;
      case "factures":
        return <Factures />;
     default:
  return (
    <div className="ud-dashboard-welcome">
      <div className="ud-welcome-container">
        <div className="ud-welcome-content">
          <div className="ud-welcome-text">
            <h1 className="ud-welcome-title">
              Bienvenue dans votre espace client
            </h1>
            <p className="ud-welcome-subtitle">
              Gérez facilement vos abonnements, factures et réclamations en toute simplicité
            </p>
          </div>
          <div className="ud-welcome-illustration">
            <img src={welcomeIllustration} alt="Welcome illustration" className="ud-illustration-img" />
          </div>
        </div>
      </div>
    </div>
  );
}
  };

  return (
    <div className="user-page">
      <header className="ud-user-header">
        <div className="ud-left-section">
          <Link to="/">
            <img src={logo} alt="Algérie Télécom" className="ud-logo" />
          </Link>
          <button onClick={toggleSidebar} className="ud-sidebar-toggle">
              <FiSidebar className="ud-menu-icon" />
           </button>
        </div>

        <div className="ud-search-bar">
          <FiSearch className="ud-search-icon" />
          <div className="ud-search-wrapper">
            <input
              type="text"
              placeholder="Rechercher..."
              className="ud-search-input"
            />
          </div>
        </div>

        <div className="ud-right-section">
          <div className="ud-icon-circle">
            <a href="https://idoom-market.com.dz/" target="_blank" rel="noopener noreferrer" title="Idoom Market">
              <img src={idoomLogo} alt="Idoom Market" className="ud-icon-img" />
            </a>
          </div>
          <div className="ud-icon-circle">
            <a href="https://paiement.at.dz/index.php?p=voucher_internet&produit=in" target="_blank" rel="noopener noreferrer" title="e-Paiement">
              <img src={ePaiementLogo} alt="e-Paiement" className="ud-icon-img" />
            </a>
          </div>
          
          {user && (
            <div className="ud-user-info">
              <div className="ud-user-details">
                
                <span className="ud-user-email">{user.email}</span>
              </div>
              <div className="ud-user-avatar">
                {user.initials}
              </div>
            </div>
          )}

          <button className="ud-btn ud-logout-btn" onClick={handleLogoutClick}>
            Se déconnecter
            <FiLogOut className="ud-logout-icon" />
          </button>

          <ConfirmLogoutModal
            isOpen={showLogoutModal}
            onConfirm={confirmLogout}
            onCancel={cancelLogout}
          />
        </div>
      </header>

      <div className="ud-user-content">
        {isSidebarOpen && (
          <aside className="ud-sidebar">
            <div className="ud-sidebar-section">
              <SidebarItem
                title="Profil"
                Icon={CgProfile}
                submenu={[
                  <span key="modifier" onClick={() => setActiveSection("modifier-profile")}>Modifier profile</span>,
                  <span key="motdepasse" onClick={() => setActiveSection("changer-mdp")}>Changer mot de passe</span>,
                  <span key="logout" onClick={handleLogoutClick}>Se déconnecter</span>
                ]}
              />

              <SidebarItem
                title="Abonnement"
                Icon={MdSubscriptions}
                submenu={[
                  <span key="choisir" onClick={() => setActiveSection("choisir-offre")}>Choisir offre abonnement</span>,
                  <span key="historique" onClick={() => setActiveSection("historique-abonnements")}>Historique d'abonnements</span>,
                ]}
              />

              <SidebarItem 
                title="Facture" 
                Icon={HiOutlineDocumentText}
                submenu={[
                  <span key="voir" onClick={() => setActiveSection("factures")}>Voir mes factures</span>
                ]}
              />

              <SidebarItem
                title="Réclamation"
                Icon={MdReportGmailerrorred}
                submenu={[
                  <span key="ajouter" onClick={() => setActiveSection("ajouter-reclamation")}>Ajouter une réclamation</span>,
                  <span key="voir" onClick={() => setActiveSection("voir-reclamations")}>Voir mes réclamations</span>
                ]}
              />

              <SidebarItem
                title="Notification"
                Icon={IoNotificationsOutline}
                submenu={[
                  <span key="notif" onClick={() => setActiveSection("notifications")}>Voir les notifications</span>,
                ]}
              />

              
            </div>

            <div className="ud-sidebar-footer">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <img src={facebookIcon} alt="Facebook" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <img src={twitterIcon} alt="Twitter" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <img src={instagramIcon} alt="Instagram" />
              </a>
            </div>
          </aside>
        )}

        <main className="ud-dashboard">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}

export default UserDashboard;