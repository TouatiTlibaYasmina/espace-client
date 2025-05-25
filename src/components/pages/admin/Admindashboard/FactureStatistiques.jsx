import React, { useState, useEffect } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./FactureStatistiques.css";

function FactureStatistiques() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('montants');

  // Fonction pour récupérer les statistiques depuis l'API
  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Veuillez vous connecter");
      }

      const response = await fetch("https://backend-espace-client.onrender.com/api/factures/admin/statistiques", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur: ${response.status}`);
      }

      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Charger les statistiques au montage du composant
  useEffect(() => {
    fetchStats();
  }, []);

  // Préparer les données pour le graphique mensuel
  const getMonthlyChartData = () => {
    if (!stats || !stats.parMois) return [];
    
    const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
    
    return stats.parMois.map((mois, index) => ({
      name: monthNames[index],
      "Montant Total": mois.montantTotal,
      "Montant Payé": mois.montantPaye,
      "Factures Émises": mois.totalFactures,
      "Factures Payées": mois.totalPayees,
    }));
  };

  // Affichage du chargement
  if (loading) {
    return (
      <div className="fs-loading">
        <div className="fs-spinner"></div>
        <p>Chargement des statistiques...</p>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="fs-error">
        <h2>Erreur de chargement des statistiques</h2>
        <p>{error}</p>
        <button className="fs-refresh-btn" onClick={fetchStats}>
          <FiRefreshCw /> Réessayer
        </button>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="fs-container">
      <div className="fs-header">
        <h1>Statistiques de Facturation</h1>
        <button className="fs-refresh-btn" onClick={fetchStats}>
          <FiRefreshCw /> Actualiser
        </button>
      </div>

      {/* Affichage des statistiques globales */}
      <section className="fs-section">
        <h2>Aperçu Global</h2>
        <div className="fs-stats-grid">
          <div className="fs-card fs-card-primary">
            <h3>Factures Totales</h3>
            <div className="fs-card-value">{stats.global.totalFactures}</div>
          </div>
          <div className="fs-card fs-card-success">
            <h3>Factures Payées</h3>
            <div className="fs-card-value">{stats.global.totalPayees}</div>
            <div className="fs-card-percentage">
              {stats.global.tauxPaiement}%
            </div>
          </div>
          <div className="fs-card fs-card-warning">
            <h3>En Attente</h3>
            <div className="fs-card-value">{stats.global.totalEnAttente}</div>
          </div>
          <div className="fs-card fs-card-danger">
            <h3>En Retard</h3>
            <div className="fs-card-value">{stats.global.totalEnRetard}</div>
          </div>
          <div className="fs-card fs-card-secondary">
            <h3>Montant Payé</h3>
            <div className="fs-card-value">
              {new Intl.NumberFormat("fr-DZ", {
                style: "currency",
                currency: "DZD",
              }).format(stats.global.montantTotalPaye)}
            </div>
          </div>
          <div className="fs-card fs-card-secondary">
            <h3>Montant En Attente</h3>
            <div className="fs-card-value">
              {new Intl.NumberFormat("fr-DZ", {
                style: "currency",
                currency: "DZD",
              }).format(stats.global.montantTotalEnAttente)}
            </div>
          </div>
        </div>
      </section>

      {/* Affichage des statistiques par type d'abonnement */}
      <section className="fs-section">
        <h2>Statistiques par Type d'Abonnement</h2>
        <div className="fs-table-responsive">
          <table className="fs-table">
            <thead>
              <tr>
                <th>Type d'Abonnement</th>
                <th>Factures</th>
                <th>Montant Total</th>
                <th>Factures Payées</th>
                <th>Montant Payé</th>
                <th>Taux de Paiement</th>
              </tr>
            </thead>
            <tbody>
              {stats.parType &&
                Object.entries(stats.parType).map(([type, data]) => (
                  <tr key={type}>
                    <td>{type}</td>
                    <td>{data.totalFactures}</td>
                    <td>
                      {new Intl.NumberFormat("fr-DZ", {
                        style: "currency",
                        currency: "DZD",
                      }).format(data.totalMontant)}
                    </td>
                    <td>{data.totalPayees}</td>
                    <td>
                      {new Intl.NumberFormat("fr-DZ", {
                        style: "currency",
                        currency: "DZD",
                      }).format(data.montantPaye)}
                    </td>
                    <td>
                      {data.totalFactures
                        ? ((data.totalPayees / data.totalFactures) * 100).toFixed(2)
                        : 0}
                      %
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Affichage des statistiques mensuelles avec graphique */}
      <section className="fs-section">
        <h2>Statistiques Mensuelles</h2>
        <div className="fs-chart-container">
          <div className="fs-tabs">
            <button 
              className={`fs-tab ${activeTab === 'montants' ? 'fs-tab-active' : ''}`}
              onClick={() => setActiveTab('montants')}
            >
              Montants
            </button>
            <button 
              className={`fs-tab ${activeTab === 'factures' ? 'fs-tab-active' : ''}`}
              onClick={() => setActiveTab('factures')}
            >
              Nombre de Factures
            </button>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={getMonthlyChartData()}
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                 formatter={(value) => activeTab === 'montants' 
                  ? new Intl.NumberFormat("fr-DZ", {
                    style: "currency",
                    currency: "DZD",
                  }).format(value)
                  : value
                }
              />
              <Legend />
              {activeTab === 'montants' ? (
                <>
                  <Bar dataKey="Montant Total" fill="#1e3a8a" />
                  <Bar dataKey="Montant Payé" fill="#28A745" />
                </>
              ) : (
                <>
                  <Bar dataKey="Factures Émises" fill="#1e3a8a" />
                  <Bar dataKey="Factures Payées" fill="#28A745" />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

export default FactureStatistiques;