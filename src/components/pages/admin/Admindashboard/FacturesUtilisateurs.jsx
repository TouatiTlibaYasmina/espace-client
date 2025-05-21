import React, { useEffect, useState } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./FacturesUtilisateurs.css";

function FacturesUtilisateurs() {
  // States
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1
  });

  // Filter states
  const [userId, setUserId] = useState("");
  const [statutFilter, setStatutFilter] = useState("");
  const [dateDebutFilter, setDateDebutFilter] = useState("");
  const [dateFinFilter, setDateFinFilter] = useState("");

  // Fetch factures with filters
  const fetchFactures = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token non trouvé");
      }

      // Build query params
      const params = new URLSearchParams();
      if (userId) params.append("userId", userId);
      if (statutFilter) params.append("statutFilter", statutFilter);
      if (dateDebutFilter) params.append("dateDebutFilter", dateDebutFilter);
      if (dateFinFilter) params.append("dateFinFilter", dateFinFilter);
      params.append("page", pagination.page);
      params.append("limit", 10);

      const response = await fetch(`/api/factures/admin?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des factures");
      }

      const data = await response.json();
      setFactures(data.factures);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and when filters change
  useEffect(() => {
    fetchFactures();
  }, [pagination.page]);

  // Handle filter submission
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    // Reset page to 1 when applying new filters
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchFactures();
  };

  // Handle pagination change
  const changePage = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Format price for display
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('fr-DZ', { 
      style: 'currency', 
      currency: 'DZD',
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Get status class based on status value
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'payée':
        return 'fu-status-paid';
      case 'en attente':
        return 'fu-status-pending';
      case 'en retard':
        return 'fu-status-late';
      default:
        return 'fu-status-default';
    }
  };

  return (
    <div className="fu-container">
      <div className="fu-header">
        <h1 className="fu-title">Factures Utilisateurs</h1>
        <p className="fu-description">
          Consultez et filtrez les factures de tous les utilisateurs
        </p>
      </div>

      {/* Filters */}
      <div className="fu-filters-container">
        <form onSubmit={handleFilterSubmit} className="fu-filters-form">
          <div className="fu-form-group">
            <label htmlFor="userId" className="fu-label">Numéro Client</label>
            <input
              type="text"
              id="userId"
              className="fu-input"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Numéro client..."
            />
          </div>

          <div className="fu-form-group">
            <label htmlFor="statutFilter" className="fu-label">Statut</label>
            <select
              id="statutFilter"
              className="fu-select"
              value={statutFilter}
              onChange={(e) => setStatutFilter(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="Payée">Payée</option>
              <option value="En attente">En attente</option>
              <option value="En retard">En retard</option>
            </select>
          </div>

          <div className="fu-form-group">
            <label htmlFor="dateDebutFilter" className="fu-label">Date début</label>
            <input
              type="date"
              id="dateDebutFilter"
              className="fu-input"
              value={dateDebutFilter}
              onChange={(e) => setDateDebutFilter(e.target.value)}
            />
          </div>

          <div className="fu-form-group">
            <label htmlFor="dateFinFilter" className="fu-label">Date fin</label>
            <input
              type="date"
              id="dateFinFilter"
              className="fu-input"
              value={dateFinFilter}
              onChange={(e) => setDateFinFilter(e.target.value)}
            />
          </div>

          <button type="submit" className="fu-button fu-button-primary">
            <FiSearch className="fu-button-icon" />
            Filtrer
          </button>
        </form>
      </div>

      {/* Results */}
      <div className="fu-results-container">
        {loading ? (
          <div className="fu-loading">
            <div className="fu-spinner"></div>
            <p>Chargement des factures...</p>
          </div>
        ) : error ? (
          <div className="fu-error">
            <p>Une erreur s'est produite: {error}</p>
            <button 
              onClick={fetchFactures} 
              className="fu-button fu-button-secondary"
            >
              Réessayer
            </button>
          </div>
        ) : factures.length === 0 ? (
          <div className="fu-empty">
            <p>Aucune facture trouvée avec les filtres actuels.</p>
          </div>
        ) : (
          <>
            <div className="fu-table-container">
              <table className="fu-table">
                <thead>
                  <tr>
                    <th>N° Facture</th>
                    <th>Date d'émission</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Montant</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {factures.map((facture) => (
                    <tr key={facture._id}>
                      <td>{facture._id.slice(-8).toUpperCase()}</td>
                      <td>{formatDate(facture.dateEmission)}</td>
                      <td>{facture.userId?.numClient || "N/A"}</td>
                      <td>{facture.userId?.email || "N/A"}</td>
                      <td className="fu-amount">{formatPrice(facture.montantTotal)}</td>
                      <td>
                        <span className={`fu-status ${getStatusClass(facture.statut)}`}>
                          {facture.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="fu-pagination">
                <button 
                  onClick={() => changePage(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="fu-pagination-button"
                >
                  <FiChevronLeft />
                </button>
                
                <div className="fu-pagination-pages">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === pagination.pages || 
                      Math.abs(page - pagination.page) <= 1
                    )
                    .map((page, index, array) => {
                      // Add ellipsis
                      if (index > 0 && page - array[index - 1] > 1) {
                        return (
                          <React.Fragment key={`ellipsis-${page}`}>
                            <span className="fu-pagination-ellipsis">...</span>
                            <button
                              key={page}
                              onClick={() => changePage(page)}
                              className={`fu-pagination-number ${pagination.page === page ? 'fu-pagination-active' : ''}`}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        );
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => changePage(page)}
                          className={`fu-pagination-number ${pagination.page === page ? 'fu-pagination-active' : ''}`}
                        >
                          {page}
                        </button>
                      );
                    })}
                </div>
                
                <button 
                  onClick={() => changePage(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="fu-pagination-button"
                >
                  <FiChevronRight />
                </button>
              </div>
            )}

            <div className="fu-results-summary">
              Affichage de {((pagination.page - 1) * 10) + 1} à {Math.min(pagination.page * 10, pagination.total)} sur {pagination.total} factures
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FacturesUtilisateurs;