import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../user/UserDashboard.css';
import logo from '../../../assets/logos/logo.svg';
import menuIcon from '../../../assets/icons/icons8-sidebar-menu-24.png';
import facebookIcon from '../../../assets/icons/icons8-facebook.svg';
import instagramIcon from '../../../assets/icons/icons8-instagram.svg';
import twitterIcon from '../../../assets/icons/icons8-x.svg';
import youtubeIcon from '../../../assets/icons/icons8-youtube.svg';
import { FiChevronDown, FiChevronUp, FiLogOut, FiSearch } from "react-icons/fi";
import { MdPeople, MdBarChart, MdOutlineManageAccounts, MdLibraryBooks } from "react-icons/md";
import { AiOutlineDatabase } from "react-icons/ai";
import TousLesUtilisateurs from "./Admindashboard/TousLesUtilisateurs";
import AdminReclamations from "./Admindashboard/AdminReclamations";
import FacturesUtilisateurs from "./Admindashboard/FacturesUtilisateurs";
import FactureStatistiques from "./Admindashboard/FactureStatistiques";

function SidebarItem({ title, Icon, submenu = [], activeSection, setActiveSection }) {
  const [open, setOpen] = useState(false);
  const hasSubmenu = submenu.length > 0;

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

function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error("Failed to parse JWT:", e);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
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

    const fetchAdminData = async () => {
      try {
        const response = await fetch("https://backend-espace-client.onrender.com/api/users/profile", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

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
        console.error("Failed to fetch admin profile:", err);
      }
    };

    fetchAdminData();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
          <>
            <h1>Bienvenue sur votre espace administrateur</h1>
            <div className="ud-cards">
              <div className="ud-card">
                <h3>Utilisateurs inscrits</h3>
                <p>Nombre total des comptes utilisateurs.</p>
              </div>
              <div className="ud-card">
                <h3>Réclamations ouvertes</h3>
                <p>Réclamations en attente de traitement.</p>
              </div>
              <div className="ud-card">
                <h3>Offres actives</h3>
                <p>Gestion des abonnements disponibles.</p>
              </div>
            </div>
          </>
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
            <img src={menuIcon} alt="Menu" className="ud-menu-icon" />
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
                <span className="ud-user-name">{admin.name}</span>
                <span className="ud-user-email">{admin.email}</span>
              </div>
              <div className="ud-user-avatar">
                {admin.initials}
              </div>
            </div>
          )}
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
                console.error("Logout error:", err);
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
                  { id: "reclamations-historique", label: "Historique" }
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
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;