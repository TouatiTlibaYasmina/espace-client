import React, { useState, useEffect } from "react";
import "./Abonnement.css";
import { FiCheckCircle } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdError } from "react-icons/md";

function ChoisirOffre() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [offres, setOffres] = useState({
    particulier: {
      telephonie: {
        "IDOOM FIXE": [
          { offre: "250 DA /mois", prix: 250, duree: "1 mois", volumeTotal: "100 minutes" },
          { offre: "500 DA /mois", prix: 500, duree: "1 mois", volumeTotal: "250 minutes" },
          { offre: "750 DA /mois", prix: 750, duree: "1 mois", volumeTotal: "500 minutes" },
        ],
      },
      internet: {
        "IDOOM FIBRE": [
          { offre: "15 Mega", prix: 2000, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "30 Mega", prix: 2200, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "60 Mega", prix: 2400, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "120 Mega", prix: 2600, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "240 Mega", prix: 2800, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "300 Mega", prix: 3000, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "500 Mega", prix: 3600, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "1,2 Giga", prix: 4200, duree: "1 mois", volumeTotal: "Illimité" },
        ],
        "IDOOM FIBRE Gamers": [
          { offre: "2500 DA/Mois", prix: 2500, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "2800 DA/Mois", prix: 2800, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "3000 DA/Mois", prix: 3000, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "3400 DA/Mois", prix: 3400, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "4000 DA/Mois", prix: 4000, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "4600 DA/Mois", prix: 4600, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "5200 DA/Mois", prix: 5200, duree: "1 mois", volumeTotal: "Illimité" },
        ],
        "IDOOM 4G LTE": [
          { offre: "15 GO", prix: 500, duree: "15 jours", volumeTotal: "15 Go" },
          { offre: "40 GO", prix: 1000, duree: "1 mois", volumeTotal: "40 Go" },
          { offre: "150 GO", prix: 1500, duree: "1 mois", volumeTotal: "150 Go" },
          { offre: "300 GO", prix: 2500, duree: "2 mois", volumeTotal: "300 Go" },
          { offre: "450 GO", prix: 3500, duree: "3 mois", volumeTotal: "450 Go" },
          { offre: "1000 GO", prix: 6500, duree: "6 mois", volumeTotal: "1000 Go" },
        ],
        "IDOOM ADSL": [
          { offre: "10Mbps", prix: 1600, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "15Mbps", prix: 2000, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "20Mbps", prix: 2150, duree: "1 mois", volumeTotal: "Illimité" },
        ],
        "IDOOM VDSL": [
          { offre: "50Mbps", prix: 2350, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "100Mbps", prix: 2550, duree: "1 mois", volumeTotal: "Illimité" },
        ],
      },
    },
    professionnel: {
      internet: {
        "Pack MOOHTARIF": [
          { offre: "15 Mbps", prix: 2500, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "20 Mbps", prix: 2650, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "30 Mbps", prix: 2700, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "50 Mbps", prix: 2850, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "60 Mbps", prix: 2900, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "100 Mbps", prix: 3050, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "120 Mbps", prix: 3100, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "240 Mbps", prix: 3300, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "300 Mbps", prix: 3500, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "500 Mbps", prix: 4500, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "1.2 Gbps", prix: 5200, duree: "1 mois", volumeTotal: "Illimité" },
        ],
        "Big Business": [
          { offre: "Contactez-nous pour le prix", prix: null, duree: "Personnalisé", volumeTotal: "Personnalisé" },
        ],
        "Startup": [
          { offre: "15 Mbps", prix: 1250, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "20 Mbps", prix: 1550, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "50 Mbps", prix: 1650, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "100 Mbps", prix: 2050, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "300 Mbps", prix: 2250, duree: "1 mois", volumeTotal: "Illimité" },
        ],
        "IDOOM Fibre Pro": [
          { offre: "15 Mbps", prix: 8000, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "20 Mbps", prix: 10000, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "50 Mbps", prix: 12000, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "100 Mbps", prix: 15000, duree: "1 mois", volumeTotal: "Illimité" },
        ],
        "IDOOM ADSL Pro": [
          { offre: "15 Mbps", prix: 8000, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "20 Mbps", prix: 10000, duree: "1 mois", volumeTotal: "Illimité" },
          { offre: "50 Mbps", prix: 12000, duree: "1 mois", volumeTotal: "Illimité" },
        ],
        "IDOOM 4G Pro": [
          { offre: "40 GO", prix: 1000, duree: "1 mois", volumeTotal: "40 Go" },
          { offre: "150 GO", prix: 1500, duree: "1 mois", volumeTotal: "150 Go" },
          { offre: "300 GO", prix: 2500, duree: "1 mois", volumeTotal: "300 Go" },
          { offre: "450 GO", prix: 3500, duree: "1 mois", volumeTotal: "450 Go" },
          { offre: "1 To", prix: 6500, duree: "1 mois", volumeTotal: "1024 Go" },
        ],
      },
    },
  });
  
  const [clientType, setClientType] = useState("particulier");
  const [selectedCategory, setSelectedCategory] = useState("internet");
  const [selectedOffreGlobale, setSelectedOffreGlobale] = useState("");
  const [selectedOffreSpecifique, setSelectedOffreSpecifique] = useState(null);
  const [currentAbonnement, setCurrentAbonnement] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [profileResponse, abonnementResponse] = await Promise.all([
        fetch("https://backend-espace-client.onrender.com/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch("https://backend-espace-client.onrender.com/api/abonnements/current", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (!profileResponse.ok) throw new Error("Profile fetch failed");
      const profileData = await profileResponse.json();
      
      if (profileData?.user?.clientType) {
        setClientType(profileData.user.clientType.toLowerCase());
      }

      // Handle subscription response - 404 is expected for new users
      if (abonnementResponse.status === 404) {
        setCurrentAbonnement(null); // No active subscription
      } else if (!abonnementResponse.ok) {
        throw new Error("Subscription fetch failed");
      } else {
        const abonnementData = await abonnementResponse.json();
        if (abonnementData?.success && abonnementData.data) {
          setCurrentAbonnement(abonnementData.data);
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedOffreGlobale("");
    setSelectedOffreSpecifique(null);
  };

  const handleOffreGlobaleSelect = (offreGlobale) => {
    setSelectedOffreGlobale(offreGlobale);
    setSelectedOffreSpecifique(null);
  };

  const handleOffreSpecifiqueSelect = (offre) => {
    setSelectedOffreSpecifique(offre);
  };

  const handleConfirmationToggle = () => {
    if (selectedOffreSpecifique) {
      setShowConfirmation(!showConfirmation);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vous devez être connecté pour souscrire à un abonnement");
        setLoading(false);
        return;
      }
      
      if (!selectedOffreGlobale || !selectedOffreSpecifique) {
        setError("Veuillez sélectionner une offre complète");
        setLoading(false);
        return;
      }
      
      // Skip confirmation for "Contactez-nous" offers
      if (selectedOffreSpecifique.offre.includes("Contactez-nous")) {
        setSuccess("Un commercial vous contactera bientôt pour finaliser votre abonnement.");
        setLoading(false);
        setShowConfirmation(false);
        return;
      }
      
      const response = await fetch("https://backend-espace-client.onrender.com/api/abonnements/choisir", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          categorie: selectedCategory,
          offreGlobale: selectedOffreGlobale,
          offreSpecifique: selectedOffreSpecifique.offre,
          prix: selectedOffreSpecifique.prix,
          duree: selectedOffreSpecifique.duree
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || "Request failed");
      
      if (data.success) {
        setSuccess(`Félicitations ! Votre abonnement ${selectedOffreGlobale} - ${selectedOffreSpecifique.offre} a été activé avec succès.`);
        
        setTimeout(async () => {
          try {
            const refreshResponse = await fetch("https://backend-espace-client.onrender.com/api/abonnements/current", {
              headers: { Authorization: `Bearer ${token}` }
            });
            const refreshData = await refreshResponse.json();
            if (refreshData?.success && refreshData.data) {
              setCurrentAbonnement(refreshData.data);
            }
          } catch (err) {
            console.error("Refresh error:", err);
          }
          setSelectedOffreSpecifique(null);
          setShowConfirmation(false);
        }, 3000);
      } else {
        setError(data.message || "Une erreur est survenue");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setError(err.message || "Une erreur de connexion est survenue");
    } finally {
      setLoading(false);
    }
  };

  const availableOffers = offres[clientType]?.[selectedCategory] || {};

  return (
    <div className="choisir-offre">
      <h1>Choisir une offre d'abonnement</h1>
      
      {currentAbonnement ? (
  <div className="current-subscription">
    <h3>Votre abonnement actuel</h3>
    <div className="subscription-details">
      <p><strong>Type:</strong> {currentAbonnement.type}</p>
      <p><strong>Offre:</strong> {currentAbonnement.offre} {currentAbonnement.debitOuVolume}</p>
      <p><strong>Prix:</strong> {currentAbonnement.prix}</p>
      <p><strong>Date d'expiration:</strong> {new Date(currentAbonnement.dateExpiration).toLocaleDateString()}</p>
    </div>
  </div>
) : (
  <div className="current-subscription">
    <h3>Vous n'avez pas d'abonnement actif</h3>
    <p>Veuillez choisir une offre ci-dessous</p>
  </div>
)}
      
      {error && (
        <div className="error-message">
          <MdError /> {error}
        </div>
      )}
      
      {success && (
        <div className="success-message">
          <FiCheckCircle /> {success}
        </div>
      )}

      <div className="offre-categories">
        <button 
          className={`category-btn ${selectedCategory === "internet" ? "active" : ""}`} 
          onClick={() => handleCategorySelect("internet")}
          disabled={loading}
        >
          Internet
        </button>
        <button 
          className={`category-btn ${selectedCategory === "telephonie" ? "active" : ""}`} 
          onClick={() => handleCategorySelect("telephonie")}
          disabled={loading}
        >
          Téléphonie
        </button>
      </div>

      <div className="offres-container">
        <div className="offres-globales">
          <h3>Offres {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</h3>
          <div className="offres-list">
            {Object.keys(availableOffers).map((offreGlobale) => (
              <button
                key={offreGlobale}
                className={`offre-btn ${selectedOffreGlobale === offreGlobale ? "active" : ""}`}
                onClick={() => handleOffreGlobaleSelect(offreGlobale)}
                disabled={loading}
              >
                {offreGlobale}
              </button>
            ))}
          </div>
        </div>

        {selectedOffreGlobale && availableOffers[selectedOffreGlobale] && (
          <div className="offres-specifiques">
            <h3>Options disponibles</h3>
            <div className="offres-cards">
              {availableOffers[selectedOffreGlobale].map((offre, index) => (
                <div 
                  key={index}
                  className={`offre-card ${selectedOffreSpecifique?.offre === offre.offre ? "selected" : ""}`}
                  onClick={() => !loading && handleOffreSpecifiqueSelect(offre)}
                >
                  <h4>{offre.offre}</h4>
                  <div className="offre-details">
                    <p className="offre-price">
                      {offre.prix ? `${offre.prix} DA` : "Contactez-nous"}
                    </p>
                    <p>Durée: {offre.duree}</p>
                    <p>Volume: {offre.volumeTotal}</p>
                  </div>
                  {selectedOffreSpecifique?.offre === offre.offre && (
                    <div className="card-selected-mark">
                      <FiCheckCircle />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedOffreSpecifique && (
        <div className="offre-action">
          <button 
            className="select-btn"
            onClick={handleConfirmationToggle}
            disabled={loading}
          >
            {loading ? <AiOutlineLoading3Quarters className="loading-icon" /> : "Sélectionner cette offre"}
          </button>
        </div>
      )}

      {showConfirmation && selectedOffreSpecifique && (
        <div className="confirmation-modal">
          <div className="confirmation-content">
            <h3>Confirmer votre choix</h3>
            <p>Vous avez sélectionné l'offre suivante :</p>
            <div className="selected-offre-summary">
              <p><strong>Catégorie:</strong> {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</p>
              <p><strong>Type:</strong> {selectedOffreGlobale}</p>
              <p><strong>Offre:</strong> {selectedOffreSpecifique.offre}</p>
              <p><strong>Prix:</strong> {selectedOffreSpecifique.prix ? `${selectedOffreSpecifique.prix} DA` : "Contactez-nous"}</p>
              <p><strong>Durée:</strong> {selectedOffreSpecifique.duree}</p>
              <p><strong>Volume:</strong> {selectedOffreSpecifique.volumeTotal}</p>
            </div>
            <p className="confirmation-note">En confirmant, vous acceptez les conditions d'utilisation de l'offre.</p>
            <div className="confirmation-buttons">
              <button 
                className="cancel-btn" 
                onClick={() => setShowConfirmation(false)}
                disabled={loading}
              >
                Annuler
              </button>
              <button 
                className="confirm-btn" 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <AiOutlineLoading3Quarters className="loading-icon" /> : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChoisirOffre;