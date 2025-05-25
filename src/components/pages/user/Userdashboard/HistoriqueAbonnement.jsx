import React, { useState, useEffect } from "react";
import "./Abonnement.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdError } from "react-icons/md";
import { BsCalendarDate } from "react-icons/bs";
import { FaHistory } from "react-icons/fa";

function HistoriqueAbonnements() {
  // États pour la gestion du chargement, des erreurs et des données d'historique
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historique, setHistorique] = useState([]);
  const [filteredHistorique, setFilteredHistorique] = useState([]);
  const [filterType, setFilterType] = useState("tous");

  // Récupération de l'historique des abonnements à l'initialisation du composant
  useEffect(() => {
    const fetchHistorique = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Vous devez être connecté pour accéder à l'historique des abonnements");
          setLoading(false);
          return;
        }

        const response = await fetch("https://backend-espace-client.onrender.com/api/abonnements/historique/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success) {
          setHistorique(data.data);
          setFilteredHistorique(data.data);
        } else {
          setError(data.message || "Erreur lors du chargement de l'historique");
        }
      } catch (err) {
        console.error("Erreur de récupération de l'historique:", err);
        setError("Une erreur de connexion est survenue. Veuillez réessayer ultérieurement.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistorique();
  }, []);

  // Filtrage de l'historique selon le type sélectionné
  useEffect(() => {
    if (filterType === "tous") {
      setFilteredHistorique(historique);
    } else if (filterType === "actifs") {
      setFilteredHistorique(historique.filter(item => item.isActive));
    } else if (filterType === "expires") {
      setFilteredHistorique(historique.filter(item => !item.isActive));
    } else if (filterType === "internet") {
      setFilteredHistorique(historique.filter(item => item.type === "Internet"));
    } else if (filterType === "telephonie") {
      setFilteredHistorique(historique.filter(item => item.type === "Téléphonie"));
    }
  }, [filterType, historique]);

  // Formatage de la date au format français
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  return (
    <div className="historique-abonnements">
      <h1>Historique des abonnements</h1>

      {/* Affichage du chargement, de l'erreur ou de la liste filtrée */}
      {loading ? (
        <div className="loading-container">
          <AiOutlineLoading3Quarters className="loading-icon spin" />
          <p>Chargement de votre historique...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <MdError /> {error}
        </div>
      ) : (
        <>
          {/* Contrôles de filtrage */}
          <div className="filter-controls">
            <h3>Filtrer par :</h3>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filterType === "tous" ? "active" : ""}`} 
                onClick={() => setFilterType("tous")}
              >
                Tous
              </button>
              <button 
                className={`filter-btn ${filterType === "actifs" ? "active" : ""}`} 
                onClick={() => setFilterType("actifs")}
              >
                Actifs
              </button>
              <button 
                className={`filter-btn ${filterType === "expires" ? "active" : ""}`} 
                onClick={() => setFilterType("expires")}
              >
                Expirés
              </button>
              <button 
                className={`filter-btn ${filterType === "internet" ? "active" : ""}`} 
                onClick={() => setFilterType("internet")}
              >
                Internet
              </button>
              <button 
                className={`filter-btn ${filterType === "telephonie" ? "active" : ""}`} 
                onClick={() => setFilterType("telephonie")}
              >
                Téléphonie
              </button>
            </div>
          </div>

          {/* Affichage si aucun abonnement ne correspond au filtre */}
          {filteredHistorique.length === 0 ? (
            <div className="empty-history">
              <FaHistory className="empty-icon" />
              <p>Aucun abonnement ne correspond à votre filtre.</p>
            </div>
          ) : (
            // Affichage de la liste des abonnements filtrés
            <div className="historique-list">
              {filteredHistorique.map((abonnement) => (
                <div 
                  key={abonnement._id} 
                  className={`historique-item ${abonnement.isActive ? "actif" : "expire"}`}
                >
                  <div className="historique-header">
                    <div className="historique-title">
                      <h3>{abonnement.type} - {abonnement.offre}</h3>
                      <span className={`status-badge ${abonnement.isActive ? "active" : "expired"}`}>
                        {abonnement.isActive ? "Actif" : "Expiré"}
                      </span>
                    </div>
                    <div className="historique-price">
                      {abonnement.prix}
                    </div>
                  </div>
                  
                  <div className="historique-details">
                    <div className="detail-col">
                      <div className="detail-item">
                        <span className="detail-label">Option:</span>
                        <span className="detail-value">{abonnement.debitOuVolume}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Catégorie:</span>
                        <span className="detail-value">{abonnement.categorie}</span>
                      </div>
                    </div>
                    
                    <div className="detail-col">
                      <div className="detail-item">
                        <span className="detail-label">Date début:</span>
                        <span className="detail-value">{formatDate(abonnement.dateDebut)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Date expiration:</span>
                        <span className="detail-value">{formatDate(abonnement.dateExpiration)}</span>
                      </div>
                    </div>
                    
                    <div className="detail-col">
                      <div className="detail-item">
                        <span className="detail-label">Durée:</span>
                        <span className="detail-value">{abonnement.duree}</span>
                      </div>
                      {abonnement.statut && (
                        <div className="detail-item">
                          <span className="detail-label">Statut:</span>
                          <span className="detail-value">{abonnement.statut}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="historique-footer">
                    <BsCalendarDate /> Souscrit le {formatDate(abonnement.dateCreation || abonnement.dateDebut)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HistoriqueAbonnements;