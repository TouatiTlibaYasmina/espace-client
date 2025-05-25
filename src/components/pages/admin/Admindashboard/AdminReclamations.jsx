import React, { useState, useEffect } from "react";
import { FiRefreshCw, FiCheck, FiX, FiMessageSquare } from "react-icons/fi";
import "./AdminReclamations.css";

function AdminReclamations() {
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [reponse, setReponse] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("all"); // "all", "pending", "processed"

  // Récupère la liste des réclamations depuis l'API
  const fetchReclamations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vous devez être connecté");
      
      const response = await fetch("https://backend-espace-client.onrender.com/api/reclamations", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Erreur lors de la récupération des réclamations");
      }
      
      setReclamations(data.reclamations);
    } catch (err) {
      setError(err.message);
      console.error("Erreur de chargement des réclamations:", err);
    } finally {
      setLoading(false);
    }
  };

  // Envoie la réponse à une réclamation spécifique
  const handleSubmitResponse = async (reclamationId) => {
    if (!reponse.trim()) {
      alert("Veuillez entrer une réponse");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vous devez être connecté");
      
      const response = await fetch("https://backend-espace-client.onrender.com/api/reclamations/${reclamationId}/answer", {

        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          reponse,
          statut: "traité"
        })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Erreur lors de la mise à jour de la réclamation");
      }
      
      // Met à jour l'état local après la réponse
      setReclamations(prevReclamations => 
        prevReclamations.map(rec => 
          rec._id === reclamationId 
            ? { ...rec, reponse, statut: "traité", dateReponse: new Date() } 
            : rec
        )
      );
      
      // Ferme la modal et réinitialise le formulaire
      setActiveModal(null);
      setReponse("");
      
    } catch (err) {
      alert(err.message);
      console.error("Erreur d'envoi de réponse:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Formate une date pour l'affichage
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Charge les réclamations au montage du composant
  useEffect(() => {
    fetchReclamations();
  }, []);

  // Filtre les réclamations selon le filtre sélectionné
  const filteredReclamations = reclamations.filter(rec => {
    if (filter === "all") return true;
    if (filter === "pending") return rec.statut === "en attente";
    if (filter === "processed") return rec.statut === "traité";
    return true;
  });

  return (
    <div className="rec-container">
      <div className="rec-header">
        <h1>Gestion des Réclamations</h1>
        <div className="rec-actions">
          <div className="rec-filter">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="rec-select"
            >
              <option value="all">Toutes les réclamations</option>
              <option value="pending">En attente</option>
              <option value="processed">Traitées</option>
            </select>
          </div>
          <button 
            className="rec-refresh-btn" 
            onClick={fetchReclamations}
            disabled={loading}
          >
            <FiRefreshCw className={loading ? "rec-spin" : ""} />
            {loading ? "Chargement..." : "Actualiser"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rec-error">
          <FiX className="rec-error-icon" />
          {error}
        </div>
      )}

      {loading && !error ? (
        <div className="rec-loading">Chargement des réclamations...</div>
      ) : (
        <>
          {filteredReclamations.length === 0 ? (
            <div className="rec-empty">
              Aucune réclamation {filter !== "all" ? `${filter === "pending" ? "en attente" : "traitée"}` : ""} disponible
            </div>
          ) : (
            <div className="rec-list">
              {filteredReclamations.map(reclamation => (
                <div 
                  key={reclamation._id} 
                  className={`rec-item ${reclamation.statut === "traité" ? "rec-processed" : "rec-pending"}`}
                >
                  <div className="rec-item-header">
                    <div className="rec-item-title">
                      <h3>{reclamation.sujet}</h3>
                      <span className={`rec-status ${reclamation.statut === "traité" ? "rec-status-done" : "rec-status-pending"}`}>
                        {reclamation.statut}
                      </span>
                    </div>
                    <div className="rec-item-user">
                      <span className="rec-user-info">
                        <strong>{reclamation.user?.username || "Utilisateur inconnu"}</strong>
                        {reclamation.user?.email && <span className="rec-user-email">({reclamation.user.email})</span>}
                      </span>
                      <span className="rec-date">
                        {formatDate(reclamation.dateCreation)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="rec-item-content">
                    <p>{reclamation.message}</p>
                  </div>
                  
                  {reclamation.statut === "traité" && reclamation.reponse && (
                    <div className="rec-response">
                      <div className="rec-response-header">
                        <FiMessageSquare className="rec-response-icon" />
                        <h4>Réponse</h4>
                        <span className="rec-response-date">
                          {reclamation.dateReponse && formatDate(reclamation.dateReponse)}
                        </span>
                      </div>
                      <p>{reclamation.reponse}</p>
                    </div>
                  )}
                  
                  <div className="rec-item-actions">
                    {reclamation.statut !== "traité" && (
                      <button 
                        className="rec-reply-btn"
                        onClick={() => setActiveModal(reclamation._id)}
                      >
                        Répondre
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal de réponse à une réclamation */}
      {activeModal && (
        <div className="rec-modal-overlay">
          <div className="rec-modal">
            <div className="rec-modal-header">
              <h3>Répondre à la réclamation</h3>
              <button 
                className="rec-modal-close"
                onClick={() => {
                  setActiveModal(null);
                  setReponse("");
                }}
              >
                <FiX />
              </button>
            </div>
            
            <div className="rec-modal-body">
              <div className="rec-modal-info">
                {reclamations.find(r => r._id === activeModal)?.sujet}
              </div>
              
              <textarea
                className="rec-response-input"
                value={reponse}
                onChange={(e) => setReponse(e.target.value)}
                placeholder="Saisissez votre réponse ici..."
                rows={5}
              ></textarea>
            </div>
            
            <div className="rec-modal-footer">
              <button 
                className="rec-modal-cancel"
                onClick={() => {
                  setActiveModal(null);
                  setReponse("");
                }}
                disabled={submitting}
              >
                Annuler
              </button>
              <button 
                className="rec-modal-submit"
                onClick={() => handleSubmitResponse(activeModal)}
                disabled={submitting}
              >
                {submitting ? "Envoi..." : "Envoyer la réponse"}
                {!submitting && <FiCheck className="rec-submit-icon" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminReclamations;