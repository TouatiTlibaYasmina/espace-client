import React, { useState } from 'react';
import "./ConnexionForm.css"; // Keeping the same style as ConnexionForm
import logo from "../../../assets/logos/logo.svg";




const InscriptionForm = ({ closeModal }) => {
  
  const [showPassword, setShowPassword] = useState(false);

  // Add state for form inputs
  const [phoneNumber, setPhoneNumber] = useState('');
  const [clientNumber, setClientNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const rawPhone = phoneNumber.replace(/\s+/g, '');
  
    // Simple frontend check for 10-digit DZ number
    if (!/^0[5-7][0-9]{8}$/.test(rawPhone)) {
      alert("❌ Numéro de téléphone invalide. Format attendu : 0xxxxxxxxx");
      return;
    }
  
    const newUser = {
      numTel: rawPhone,
      MSISDN: `213${rawPhone.slice(1)}`,
      numClient: clientNumber,
      mobile: mobileNumber,
      email,
      password,
      clientType: "particulier",
      role: "client"
    };
  
    try {
      const response = await fetch("https://backend-espace-client.onrender.com/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("🎉 Compte créé avec succès !");
        closeModal();
      } else {
        alert(`❌ ${data.message || "Erreur"} (${data.code || "?"})`);
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      alert("❌ Erreur réseau, veuillez réessayer.");
    }
  };
  
  

  // Handle form input changes
  const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value);
  const handleClientNumberChange = (e) => setClientNumber(e.target.value);
  const handleMobileNumberChange = (e) => setMobileNumber(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="conteneur" onClick={(e) => e.stopPropagation()}>
        <span className="close-x" onClick={closeModal}>×</span>
        
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="titre">Espace Client</h2>
        <h3 className="sous_titre">Créer mon Espace Client</h3>
  
        <div className="input-group">
          <input
            type="text"
            placeholder="Saisir N° Tel / MSISDN"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
          />
          <p className="info-type">Exemple : 0xxxxxxxx / 4GLTE: 213xxxxxxxxx</p>
  
          <input
            type="text"
            placeholder="Saisir N° Client"
            value={clientNumber}
            onChange={handleClientNumberChange}
          />
          <input
            type="text"
            placeholder="Saisir N° Mobile"
            value={mobileNumber}
            onChange={handleMobileNumberChange}
          />
          <input
            type="email"
            placeholder="Saisir Email"
            value={email}
            onChange={handleEmailChange}
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Saisir mot de passe"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
  
        <button className="button" onClick={handleSubmit}>
                     Créer
      </button>

      </div>
    </div>
  );
  
};

export default InscriptionForm;
