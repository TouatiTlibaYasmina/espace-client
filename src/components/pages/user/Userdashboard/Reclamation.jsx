import React, { useState, useEffect } from "react";
import "./Reclamation.css";

// Composant pour ajouter une nouvelle réclamation
function AjouterReclamation() {
  const [sujet, setSujet] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [statusType, setStatusType] = useState(""); // "success" ou "error"

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("https://backend-espace-client.onrender.com/api/reclamations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sujet, message }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("Réclamation envoyée avec succès !");
        setStatusType("success");
        setSujet("");
        setMessage("");
      } else {
        setStatus("Erreur lors de l'envoi.");
        setStatusType("error");
      }
    } catch (error) {
      setStatus("Erreur serveur.");
      setStatusType("error");
    }
  };

  return (
    <div className="urc-container">
      <h2 className="urc-title">Ajouter une réclamation</h2>
      <form className="urc-form" onSubmit={handleSubmit}>
        <div className="urc-form-group">
          <label className="urc-label">Sujet:</label>
          <input
            className="urc-input"
            type="text"
            value={sujet}
            onChange={(e) => setSujet(e.target.value)}
            required
          />
        </div>
        <div className="urc-form-group">
          <label className="urc-label">Message:</label>
          <textarea
            className="urc-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button className="urc-button" type="submit">
          Envoyer
        </button>
      </form>
      {status && (
        <div className={`urc-status ${
          statusType === "success" ? "urc-status-success" : "urc-status-error"
        }`}>
          {status}
        </div>
      )}
    </div>
  );
}

// Composant pour afficher la liste des réclamations de l'utilisateur
function VoirReclamations() {
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Chargement des réclamations à l'initialisation du composant
  useEffect(() => {
    const fetchReclamations = async () => {
      try {
        const res = await fetch("https://backend-espace-client.onrender.com/api/reclamations/allReclamations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setReclamations(data.reclamations);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des réclamations:", error);
      }
      setLoading(false);
    };

    fetchReclamations();
  }, [token]);

  if (loading) return <div className="urc-container urc-loading">Chargement des réclamations...</div>;

  return (
    <div className="urc-container">
      <h2 className="urc-title">Vos réclamations</h2>
      {reclamations.length === 0 ? (
        <div className="urc-empty">Aucune réclamation trouvée.</div>
      ) : (
        <ul className="urc-list">
          {reclamations.map((rec) => {
            const isProcessed = rec.statut === "Traité" || rec.reponse;
            return (
              <li 
                key={rec._id} 
                className={`urc-item ${
                  isProcessed ? "urc-item-processed" : "urc-item-pending"
                }`}
              >
                <div className="urc-item-header">
                  <h3 className="urc-item-title">{rec.sujet}</h3>
                  <span 
                    className={`urc-status-badge ${
                      isProcessed ? "urc-status-badge-done" : "urc-status-badge-pending"
                    }`}
                  >
                    {rec.statut || "En attente"}
                  </span>
                </div>
                <div className="urc-item-content">
                  {rec.message}
                </div>
                {rec.reponse && (
                  <div className="urc-response">
                    <div className="urc-response-header">Réponse:</div>
                    <p className="urc-response-content">{rec.reponse}</p>
                  </div>
                )}
                <div className="urc-item-footer">
                  <span>
                    {new Date(rec.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// Composant principal qui affiche soit l'ajout soit la liste des réclamations selon la prop "view"
export default function Reclamation({ view }) {
  return view === "ajouter" ? <AjouterReclamation /> : <VoirReclamations />;
}