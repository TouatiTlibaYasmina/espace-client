import React, { useEffect, useState } from "react";
import "./Factures.css";
import { FiDownload, FiCreditCard } from "react-icons/fi";

function Factures() {
  // États pour gérer les factures, la sélection, le chargement, les erreurs, etc.
  const [factures, setFactures] = useState([]);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("CIB");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    // Récupère les factures de l'utilisateur à l'initialisation du composant
    const fetchFactures = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Veuillez vous connecter");
          setLoading(false);
          return;
        }

        const response = await fetch("https://backend-espace-client.onrender.com/api/factures/mesFactures", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Erreur serveur");
        }

        const data = await response.json();

        // Nettoie les données et ajoute une valeur par défaut pour la méthode de paiement
        const cleanedData = Array.isArray(data) ? data.map(f => ({
          ...f,
          paymentMethod: f.paymentMethod || "Non spécifié"
        })) : [];

        setFactures(cleanedData);
        setLoading(false);

      } catch (err) {
        console.error("Erreur fetchFactures:", err);
        setError("Impossible de charger les factures. Contactez le support.");
        setLoading(false);
        setFactures([]);
      }
    };

    fetchFactures();
  }, []);

  // Gère le téléchargement du PDF d'une facture
  const handleDownloadPDF = async (factureId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Veuillez vous reconnecter");
      return;
    }

    try {
      const apiUrl = `https://backend-espace-client.onrender.com/api/factures/${factureId}/pdf`;

      const response = await fetch(apiUrl, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Accept': 'application/pdf'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Le serveur a retourné une erreur ${response.status}: ${errorText || "Aucun détail"}`);
      }

      const blob = await response.blob();

      if (blob.type !== "application/pdf") {
        throw new Error("Le fichier reçu n'est pas un PDF valide");
      }

      const pdfUrl = URL.createObjectURL(blob);

      // Crée un lien temporaire pour lancer le téléchargement
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `facture-${factureId}-${new Date().toISOString().slice(0,10)}.pdf`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Libère l'URL du blob après 30 secondes
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 30000);

    } catch (error) {
      console.error("Échec du téléchargement:", error);
      alert(`Échec du téléchargement:\n${error.message}\n\nVeuillez réessayer ou contacter le support.`);
    }
  };

  // Affiche les détails d'une facture sélectionnée
  const handleViewFacture = (facture) => {
    setSelectedFacture(facture);
  };

  // Retourne à la liste des factures
  const handleBackToList = () => {
    setSelectedFacture(null);
  };

  // Formate une date au format français
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Ouvre la modale de paiement pour une facture
  const handlePaymentClick = (facture) => {
    setSelectedFacture(facture);
    setShowPaymentModal(true);
  };

  // Gère la confirmation du paiement
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`https://backend-espace-client.onrender.com/api/factures/${selectedFacture._id}/paiement`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ method: paymentMethod }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors du paiement");
      }

      // Met à jour le statut de la facture dans la liste après paiement
      setFactures(factures.map(f => 
        f._id === selectedFacture._id ? { ...f, statut: "Payée", datePaiement: new Date() } : f
      ));

      setShowPaymentModal(false);
      alert("Paiement effectué avec succès");
    } catch (err) {
      console.error("Erreur de paiement:", err);
      alert(`Erreur: ${err.message}`);
    }
  };

  // Ferme la modale de paiement sans valider
  const cancelPayment = () => {
    setShowPaymentModal(false);
  };

  // Composant pour la modale de paiement
  const PaymentModal = () => {
    if (!showPaymentModal) return null;

    return (
      <div className="facture-modal-overlay">
        <div className="facture-modal-box">
          <h3>Choisissez votre méthode de paiement</h3>
          <div className="facture-payment-methods">
            <div className="facture-payment-method">
              <input
                type="radio"
                id="cib"
                name="paymentMethod"
                value="CIB"
                checked={paymentMethod === "CIB"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="cib">Carte CIB</label>
            </div>
            <div className="facture-payment-method">
              <input
                type="radio"
                id="dahabia"
                name="paymentMethod"
                value="DAHABIA"
                checked={paymentMethod === "DAHABIA"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="dahabia">Carte DAHABIA</label>
            </div>
          </div>
          <div className="facture-payment-info">
            <div className="facture-payment-amount">
              <p>Montant à payer: <strong>{selectedFacture?.montant} DA</strong></p>
            </div>
          </div>
          <div className="facture-modal-buttons">
            <button className="facture-btn facture-btn-cancel" onClick={cancelPayment}>Annuler</button>
            <button className="facture-btn facture-btn-confirm" onClick={handlePayment}>Confirmer</button>
          </div>
        </div>
      </div>
    );
  };

  // Affiche un message de chargement
  if (loading) {
    return <div className="facture-loading">Chargement des factures...</div>;
  }

  // Affiche un message d'erreur si besoin
  if (error) {
    return <div className="facture-error">{error}</div>;
  }

  // Affiche les détails d'une facture sélectionnée
  if (selectedFacture && !showPaymentModal) {
    return (
      <div className="facture-detail-container">
        <button className="facture-back-button" onClick={handleBackToList}>
          ← Retour à la liste
        </button>
        
        <div className="facture-detail-card">
          <h2>Facture {selectedFacture.reference}</h2>
          
          <div className="facture-detail-header">
            <div className="facture-status">
              <span className={`facture-status-badge facture-status-${selectedFacture.statut.toLowerCase().replace(' ', '-')}`}>
                {selectedFacture.statut}
              </span>
            </div>
            <div className="facture-amount">
              <h3>{selectedFacture.montant} DA</h3>
            </div>
          </div>

          <div className="facture-detail-section">
            <h4>Informations Générales</h4>
            <div className="facture-detail-grid">
              <div className="facture-detail-item">
                <span className="facture-detail-label">Référence:</span>
                <span className="facture-detail-value">{selectedFacture.reference}</span>
              </div>
              <div className="facture-detail-item">
                <span className="facture-detail-label">Date d'émission:</span>
                <span className="facture-detail-value">{formatDate(selectedFacture.dateEmission)}</span>
              </div>
              <div className="facture-detail-item">
                <span className="facture-detail-label">Date d'échéance:</span>
                <span className="facture-detail-value">{formatDate(selectedFacture.dateEcheance)}</span>
              </div>
              {selectedFacture.datePaiement && (
                <div className="facture-detail-item">
                  <span className="facture-detail-label">Date de paiement:</span>
                  <span className="facture-detail-value">{formatDate(selectedFacture.datePaiement)}</span>
                </div>
              )}
              {selectedFacture.paymentMethod && (
                <div className="facture-detail-item">
                  <span className="facture-detail-label">Méthode de paiement:</span>
                  <span className="facture-detail-value">{selectedFacture.paymentMethod}</span>
                </div>
              )}
            </div>
          </div>

          <div className="facture-detail-section">
            <h4>Détails de l'Abonnement</h4>
            <div className="facture-detail-grid">
              <div className="facture-detail-item">
                <span className="facture-detail-label">Nom de l'offre:</span>
                <span className="facture-detail-value">{selectedFacture.details.nomOffre}</span>
              </div>
              <div className="facture-detail-item">
                <span className="facture-detail-label">Catégorie:</span>
                <span className="facture-detail-value">{selectedFacture.details.categorie}</span>
              </div>
              <div className="facture-detail-item">
                <span className="facture-detail-label">Type:</span>
                <span className="facture-detail-value">{selectedFacture.details.type}</span>
              </div>
              <div className="facture-detail-item">
                <span className="facture-detail-label">Débit ou volume:</span>
                <span className="facture-detail-value">{selectedFacture.details.debitOuVolume}</span>
              </div>
              <div className="facture-detail-item">
                <span className="facture-detail-label">Durée:</span>
                <span className="facture-detail-value">{selectedFacture.details.duree}</span>
              </div>
              <div className="facture-detail-item">
                <span className="facture-detail-label">Volume total:</span>
                <span className="facture-detail-value">{selectedFacture.details.volumeTotal}</span>
              </div>
              <div className="facture-detail-item">
                <span className="facture-detail-label">Volume consommé:</span>
                <span className="facture-detail-value">{selectedFacture.details.volumeConsomme}</span>
              </div>
              <div className="facture-detail-item">
                <span className="facture-detail-label">Période d'abonnement:</span>
                <span className="facture-detail-value">
                  {formatDate(selectedFacture.details.dateDebut)} - {formatDate(selectedFacture.details.dateExpiration)}
                </span>
              </div>
            </div>
          </div>

          <div className="facture-detail-actions">
            <button 
              className="facture-btn facture-btn-download"
               onClick={() => handleDownloadPDF(selectedFacture._id)}
               >
               <FiDownload /> View PDF
                </button>
            
            {selectedFacture.statut !== "Payée" && (
              <button 
                className="facture-btn facture-btn-pay"
                onClick={() => handlePaymentClick(selectedFacture)}
              >
                <FiCreditCard /> Payer maintenant
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Affiche la liste des factures ou un message si aucune n'est disponible
  return (
    <div className="facture-container">
      <h1 className="facture-title">Vos Factures</h1>
      
      {factures.length === 0 ? (
        <div className="facture-empty">
          <p>Vous n'avez aucune facture disponible actuellement.</p>
        </div>
      ) : (
        <div className="facture-list">
          {factures.map((facture) => (
            <div 
              key={facture._id} 
              className={`facture-card facture-status-${facture.statut.toLowerCase().replace(' ', '-')}`}
              onClick={() => handleViewFacture(facture)}
            >
              <div className="facture-card-header">
                <h3>Facture {facture.reference}</h3>
                <span className={`facture-status-badge facture-status-${facture.statut.toLowerCase().replace(' ', '-')}`}>
                  {facture.statut}
                </span>
              </div>
              
              <div className="facture-card-body">
                <div className="facture-card-info">
                  <p><strong>Montant:</strong> {facture.montant} DA</p>
                  <p><strong>Date d'émission:</strong> {formatDate(facture.dateEmission)}</p>
                  <p><strong>Date d'échéance:</strong> {formatDate(facture.dateEcheance)}</p>
                </div>
                
                <div className="facture-card-details">
                  <p><strong>Offre:</strong> {facture.details?.nomOffre}</p>
                  <p><strong>Type:</strong> {facture.details?.type}</p>
                </div>
              </div>
              
              <div className="facture-card-actions">
                <button 
                  className="facture-btn facture-btn-download"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadPDF(facture._id);
                  }}
                >
                  <FiDownload /> PDF
                </button>
                
                {facture.statut !== "Payée" && (
                  <button 
                    className="facture-btn facture-btn-pay"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePaymentClick(facture);
                    }}
                  >
                    <FiCreditCard /> Payer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <PaymentModal />
    </div>
  );
}

export default Factures;
