import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../user/UserDashboard.css';
import logo from '../../../assets/logos/logo.svg';
import menuIcon from '../../../assets/icons/icons8-sidebar-menu-24.png';
import facebookIcon from '../../../assets/icons/icons8-facebook.svg';
import instagramIcon from '../../../assets/icons/icons8-instagram.svg';
import twitterIcon from '../../../assets/icons/icons8-x.svg';

import { FiChevronDown, FiChevronUp, FiLogOut, FiSearch, FiSidebar } from "react-icons/fi";
import { MdPeople, MdBarChart, MdOutlineManageAccounts, MdLibraryBooks } from "react-icons/md";
import welcomeIllustration from '../../../assets/illustrations/undraw_data-processing_z2q6.svg';
import TousLesUtilisateurs from "./Admindashboard/TousLesUtilisateurs";
import AdminReclamations from "./Admindashboard/AdminReclamations";
import FacturesUtilisateurs from "./Admindashboard/FacturesUtilisateurs";
import FactureStatistiques from "./Admindashboard/FactureStatistiques";

// Composant pour un élément de la barre latérale (Sidebar)
function SidebarItem({ title, Icon, submenu = [], activeSection, setActiveSection }) {
  const [open, setOpen] = useState(false);
  const hasSubmenu = submenu.length > 0;

  // Ouvre le sous-menu si la section active correspond à un de ses éléments
  useEffect(() => {
    if (hasSubmenu && submenu.some(item => item.id === activeSection)) {
      setOpen(true);
    }
  }, [activeSection, hasSubmenu, submenu]);

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
              <li 
                key={index} 
                className={activeSection === item.id ? "active" : ""}
                onClick={() => setActiveSection(item.id)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        ) : (
          <div className="ud-sidebar-empty">Aucune donnée disponible</div>
        )
      )}
    </div>
  );
}

// Composant principal du tableau de bord administrateur
function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");

  // Fonction utilitaire pour décoder un JWT
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error("Échec du décodage du JWT :", e);
      return null;
    }
  };

  // Récupération des informations de l'administrateur au chargement du composant
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Aucun token trouvé");
      return;
    }

    const decoded = parseJwt(token);
    if (decoded) {
      setAdmin({
        name: decoded.username || decoded.email?.split('@')[0] || "Admin",
        email: decoded.email || "admin@example.com",
        role: decoded.role || "admin",
        initials: (decoded.username?.[0] || decoded.email?.[0] || "A").toUpperCase()
      });
    }

    // Récupère les données de profil de l'administrateur depuis l'API
    const fetchAdminData = async () => {
      try {
        const response = await fetch("https://backend-espace-client.onrender.com/api/users/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`Erreur HTTP ! statut : ${response.status}`);

        const data = await response.json();
        
        if (data?.success && data.user) {
          setAdmin({
            name: data.user.username || data.user.email?.split('@')[0] || "Admin",
            email: data.user.email || "admin@example.com",
            role: data.user.role || "admin",
            initials: (data.user.username?.[0] || data.user.email?.[0] || "A").toUpperCase()
          });
        }
      } catch (err) {
        console.error("Échec de la récupération du profil admin :", err);
      }
    };

    fetchAdminData();
  }, []);

  // Gère l'ouverture/fermeture de la barre latérale
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Affiche la section active du tableau de bord
  const renderActiveSection = () => {
    switch (activeSection) {
      case "tous-utilisateurs":
        return <TousLesUtilisateurs />;
      case "reclamations-attente":
        return <AdminReclamations />;
      case "factures-utilisateurs":
        return <FacturesUtilisateurs />;
      case "statistiques-factures":
        return <FactureStatistiques />;
      case "dashboard":
      default:
        return (
            <div className="ud-dashboard-welcome">
              <div className="ud-welcome-container">
                <div className="ud-welcome-content">
                  <div className="ud-welcome-text">
                    <h1 className="ud-welcome-title">
                      Bienvenue dans votre espace administrateur
                    </h1>
                    <p className="ud-welcome-subtitle">
                      Gérez facilement les utilisateurs, les réclamations et la facturation.
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
      {/* En-tête du tableau de bord */}
      <header className="ud-user-header">
        <div className="ud-left-section">
          <Link to="/">
            <img src={logo} alt="Algérie Télécom" className="ud-logo" />
          </Link>
          <button onClick={toggleSidebar} className="ud-sidebar-toggle">
            <FiSidebar className="ud-menu-icon" style={{ color: '#28A745' }} />
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
          {admin && (
            <div className="ud-user-info">
              <div className="ud-user-details">
                <span className="ud-user-email">{admin.email}</span>
              </div>
              <div className="ud-user-avatar">
                {admin.initials}
              </div>
            </div>
          )}
          {/* Bouton de déconnexion */}
          <button
            className="ud-btn ud-logout-btn"
            onClick={async () => {
              const token = localStorage.getItem("token");
              if (!token) {
                window.location.href = "/";
                return;
              }

              try {
                await fetch("https://backend-espace-client.onrender.com/api/admin/logout", {
                  method: "POST",
                  headers: {
                    "Authorization": `Bearer ${token}`
                  }
                });
              } catch (err) {
                console.error("Erreur lors de la déconnexion :", err);
              } finally {
                localStorage.removeItem("token");
                window.location.href = "/";
              }
            }}
          >
            Se déconnecter
            <FiLogOut className="ud-logout-icon" />
          </button>
        </div>
      </header>

      <div className="ud-user-content">
        {/* Barre latérale (Sidebar) */}
        {isSidebarOpen && (
          <aside className="ud-sidebar">
            <div className="ud-sidebar-section">
              <SidebarItem 
                title="Utilisateurs" 
                Icon={MdPeople} 
                submenu={[
                  { id: "tous-utilisateurs", label: "Tous les utilisateurs" },
                ]} 
                activeSection={activeSection}
                setActiveSection={setActiveSection}
              />
              <SidebarItem 
                title="Réclamations" 
                Icon={MdLibraryBooks} 
                submenu={[
                  { id: "reclamations-attente", label: "Réclamations en attente" },
                ]} 
                activeSection={activeSection}
                setActiveSection={setActiveSection}
              />
              <SidebarItem 
                title="Facturation" 
                Icon={MdBarChart} 
                submenu={[
                  { id: "factures-utilisateurs", label: "Factures utilisateurs" },
                  { id: "statistiques-factures", label: "Statistiques facturation" }
                ]} 
                activeSection={activeSection}
                setActiveSection={setActiveSection}
              />
            </div>

            {/* Pied de la barre latérale avec liens réseaux sociaux */}
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

        {/* Section principale du tableau de bord */}
        <main className="ud-dashboard">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;