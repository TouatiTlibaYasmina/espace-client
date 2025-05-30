import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Save, AlertCircle, CheckCircle } from "lucide-react";
import "./ModifierProfile.css";

const ModifierProfile = () => {
  // États pour les données du formulaire
  const [formData, setFormData] = useState({
    email: "",
    numTel: "",
    mobile: "",
    MSISDN: "",
  });

  // États pour le chargement, les messages et l'édition
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState({
    email: false,
    numTel: false,
    mobile: false,
    MSISDN: false
  });

  // Récupérer le profil utilisateur au montage du composant
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("https://backend-espace-client.onrender.com/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.success) {
          const { email, numTel, mobile, MSISDN } = response.data.user;
          setFormData({ email, numTel, mobile, MSISDN });
        } else {
          setError("Erreur lors du chargement du profil");
        }
      } catch (err) {
        console.error("Erreur lors du chargement du profil :", err.response || err.message);
        setError("Erreur serveur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Activer/désactiver le mode édition pour un champ
  const toggleEdit = (field) => {
    setIsEditing(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Soumettre les modifications du profil
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put("https://backend-espace-client.onrender.com/api/users/profile/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setMessage("Profil mis à jour avec succès !");
        // Réinitialiser les états d'édition
        setIsEditing({
          email: false,
          numTel: false,
          mobile: false,
          MSISDN: false
        });
      } else {
        setError("Échec de la mise à jour");
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err.response || err.message);
      setError("Erreur serveur lors de la mise à jour");
    }
  };

  // Affichage du chargement
  if (loading) return (
    <div className="mpu-loading-container">
      <div className="mpu-loading-spinner"></div>
      <p>Chargement...</p>
    </div>
  );

  return (
    <div className="mpu-profile-container">
      <div className="mpu-header">
        <h2 className="mpU-title">Modifier mon profil</h2>
      </div>
      
      {/* Affichage du message de succès */}
      {message && (
        <div className="mpu-alert mpu-success">
          <CheckCircle size={18} />
          <span>{message}</span>
        </div>
      )}
      
      {/* Affichage du message d'erreur */}
      {error && (
        <div className="mpu-alert mpu-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
      
      {/* Formulaire de modification du profil */}
      <form onSubmit={handleSubmit} className="mpu-form">
        <div className="mpu-form-group">
          <label className="mpu-label">Email:</label>
          <div className="mpu-input-group">
            <input
              type="email"
              name="email"
              className={`mpu-input ${isEditing.email ? 'mpu-active' : ''}`}
              value={formData.email || ""}
              onChange={handleChange}
              disabled={!isEditing.email}
              required
            />
            <Pencil 
              size={16} 
              className="mpu-edit-icon"
              onClick={() => toggleEdit('email')}
            />
          </div>
        </div>
        
        <div className="mpu-form-group">
          <label className="mpu-label">Numéro de téléphone:</label>
          <div className="mpu-input-group">
            <input
              type="text"
              name="numTel"
              className={`mpu-input ${isEditing.numTel ? 'mpu-active' : ''}`}
              value={formData.numTel || ""}
              onChange={handleChange}
              disabled={!isEditing.numTel}
            />
            <Pencil 
              size={16} 
              className="mpu-edit-icon"
              onClick={() => toggleEdit('numTel')}
            />
          </div>
        </div>
        
        <div className="mpu-form-group">
          <label className="mpu-label">Mobile:</label>
          <div className="mpu-input-group">
            <input
              type="text"
              name="mobile"
              className={`mpu-input ${isEditing.mobile ? 'mpu-active' : ''}`}
              value={formData.mobile || ""}
              onChange={handleChange}
              disabled={!isEditing.mobile}
            />
            <Pencil 
              size={16} 
              className="mpu-edit-icon"
              onClick={() => toggleEdit('mobile')}
            />
          </div>
        </div>
        
        <div className="mpu-form-group">
          <label className="mpu-label">MSISDN:</label>
          <div className="mpu-input-group">
            <input
              type="text"
              name="MSISDN"
              className={`mpu-input ${isEditing.MSISDN ? 'mpu-active' : ''}`}
              value={formData.MSISDN || ""}
              onChange={handleChange}
              disabled={!isEditing.MSISDN}
            />
            <Pencil 
              size={16} 
              className="mpu-edit-icon"
              onClick={() => toggleEdit('MSISDN')}
            />
          </div>
        </div>
        
        <button type="submit" className="mpu-submit-btn">
          <Save size={18} />
          <span>Enregistrer</span>
        </button>
      </form>
    </div>
  );
};

export default ModifierProfile;