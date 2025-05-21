import React, { useEffect, useState } from "react";
import "./TousLesUtilisateurs.css";
import { FiRefreshCw, FiAlertCircle, FiPhone, FiMail, FiFileText } from "react-icons/fi";

function TousLesUtilisateurs() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

 const fetchUsers = async () => {
  setLoading(true);
  setError(null);

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token d'authentification non trouvé");
    }

    const response = await fetch("https://backend-espace-client.onrender.com/api/users/admin/allUsers", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    // Get the raw text response (not parsed yet)
    const text = await response.text();

    console.log("Raw response from server:", text);  // <-- this logs the exact server response to your browser console

    if (!response.ok) {
      // Try to parse JSON error message if possible
      try {
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || "Erreur lors de la récupération des utilisateurs");
      } catch {
        throw new Error(text || "Erreur serveur inconnue");
      }
    }

    // Parse JSON only if response was ok
    const data = JSON.parse(text);
    setUsers(data.users);

  } catch (err) {
    console.error("Erreur:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  const toggleUserDetails = (userId) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
    }
  };

  if (loading) {
    return (
      <div className="tu-loading-container">
        <div className="tu-loading-spinner"></div>
        <p>Chargement des utilisateurs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tu-error-container">
        <FiAlertCircle className="tu-error-icon" />
        <h3>Erreur de chargement</h3>
        <p>{error}</p>
        <button className="tu-retry-button" onClick={fetchUsers}>
          <FiRefreshCw /> Réessayer
        </button>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="tu-empty-container">
        <FiAlertCircle className="tu-empty-icon" />
        <h3>Aucun utilisateur trouvé</h3>
        <p>Il n'y a pas d'utilisateurs à afficher pour le moment.</p>
        <button className="tu-retry-button" onClick={fetchUsers}>
          <FiRefreshCw /> Actualiser
        </button>
      </div>
    );
  }

  return (
    <div className="tu-container">
      <div className="tu-header">
        <h2>Liste des utilisateurs</h2>
        <button className="tu-refresh-button" onClick={fetchUsers}>
          <FiRefreshCw /> Actualiser
        </button>
      </div>

      <div className="tu-table-container">
        <table className="tu-users-table">
          <thead>
            <tr>
              <th>Nom complet</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Réclamations</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <React.Fragment key={user._id}>
                <tr className="tu-user-row">
                  <td>{user.firstName} {user.lastName}</td>
                  <td>
                    <div className="tu-email-cell">
                      <FiMail className="tu-cell-icon" />
                      {user.email}
                    </div>
                  </td>
                  <td>
                    <div className="tu-phone-cell">
                      <FiPhone className="tu-cell-icon" />
                      {user.phoneNumber || "Non spécifié"}
                    </div>
                  </td>
                  <td>
                    <div className="tu-claims-count">
                      <FiFileText className="tu-cell-icon" />
                      {user.reclamations?.length || 0}
                    </div>
                  </td>
                  <td>
                    <button 
                      className="tu-details-button"
                      onClick={() => toggleUserDetails(user._id)}
                    >
                      {expandedUser === user._id ? "Masquer" : "Détails"}
                    </button>
                  </td>
                </tr>
                {expandedUser === user._id && (
                  <tr className="tu-details-row">
                    <td colSpan="5">
                      <div className="tu-user-details">
                        <div className="tu-details-section">
                          <h4>Informations personnelles</h4>
                          <ul>
                            <li><strong>ID:</strong> {user._id}</li>
                            <li><strong>Date d'inscription:</strong> {new Date(user.createdAt).toLocaleDateString('fr-FR')}</li>
                            <li><strong>Dernière mise à jour:</strong> {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('fr-FR') : 'N/A'}</li>
                          </ul>
                        </div>
                        
                        <div className="tu-details-section">
                          <h4>Réclamations ({user.reclamations?.length || 0})</h4>
                          {user.reclamations && user.reclamations.length > 0 ? (
                            <div className="tu-claims-list">
                              {user.reclamations.map(claim => (
                                <div key={claim._id} className="tu-claim-item">
                                  <h5>{claim.title || 'Sans titre'}</h5>
                                  <p><strong>Statut:</strong> <span className={`tu-status tu-status-${claim.status}`}>{claim.status}</span></p>
                                  <p><strong>Date:</strong> {new Date(claim.createdAt).toLocaleDateString('fr-FR')}</p>
                                  <p className="tu-claim-description">{claim.description || 'Aucune description'}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="tu-no-claims">Aucune réclamation</p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TousLesUtilisateurs;