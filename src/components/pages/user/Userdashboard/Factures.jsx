import React, { useEffect, useState } from "react";
import "./Factures.css";
import { FiDownload, FiCreditCard } from "react-icons/fi";

function Factures() {
  const [factures, setFactures] = useState([]);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("CIB");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
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
      // Gestion spéciale pour les erreurs 400/500
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erreur serveur");
    }

    const data = await response.json();
    
    // Correction temporaire : Nettoie les données invalides
    const cleanedData = Array.isArray(data) ? data.map(f => ({
      ...f,
      paymentMethod: f.paymentMethod || "Non spécifié" // Valeur par défaut frontend
    })) : [];

    setFactures(cleanedData);
    setLoading(false);

  } catch (err) {
    console.error("Erreur fetchFactures:", err);
    setError("Impossible de charger les factures. Contactez le support.");
    setLoading(false);
    // Solution de repli : Tableau vide pour éviter de casser l'UI
    setFactures([]);
  }
};

    fetchFactures();
  }, []);


const handleDownloadPDF = async (factureId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch('https://backend-espace-client.onrender.com/api/factures/${factureId}/pdf', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Failed to fetch PDF");

    const pdfBlob = await response.blob();
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
    
    // Clean up memory
    setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
  } catch (error) {
    console.error("PDF error:", error);
    alert("Could not open PDF");
  }
};
  const handleViewFacture = (facture) => {
    setSelectedFacture(facture);
  };

  const handleBackToList = () => {
    setSelectedFacture(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const handlePaymentClick = (facture) => {
    setSelectedFacture(facture);
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`/api/factures/${selectedFacture._id}/paiement`, {
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

      
      
      // Update the facture status in the list
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

  const cancelPayment = () => {
    setShowPaymentModal(false);
  };

  // Payment modal component
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

  if (loading) {
    return <div className="facture-loading">Chargement des factures...</div>;
  }

  if (error) {
    return <div className="facture-error">{error}</div>;
  }

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