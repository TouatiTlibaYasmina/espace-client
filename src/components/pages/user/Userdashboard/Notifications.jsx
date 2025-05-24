import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const api = axios.create({
    baseURL: 'https://backend-espace-client.onrender.com/api',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    withCredentials: true
  });

  // Récupérer les notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setMessage(null);
      const response = await api.get('/notifications');
      
      if (response.data.success) {
        setNotifications(response.data.notifications || []);
      } else if (response.data.message) {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Erreur de récupération :', error);
      if (error.response?.status === 403) {
        setMessage('Accès refusé - veuillez vous reconnecter');
        toast.error('Session expirée');
      } else {
        setMessage('Impossible de charger les notifications');
        toast.error('Problème de connexion au serveur');
      }
    } finally {
      setLoading(false);
    }
  }, [api]);

  // Marquer comme lue
  const markAsRead = async (id) => {
    try {
      const response = await api.patch(`/notifications/${id}/lue`);
      if (response.data.success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === id ? { ...notif, lu: true } : notif
          )
        );
        toast.success('Marquée comme lue');
      }
    } catch (error) {
      toast.error('Échec du marquage');
      console.error('Erreur:', error);
    }
  };

  // Tout marquer comme lu
  const markAllAsRead = async () => {
    try {
      const response = await api.patch('/notifications/markAllAsRead');
      if (response.data.success) {
        setNotifications(prev => prev.map(notif => ({ ...notif, lu: true })));
        toast.success('Toutes marquées comme lues');
      }
    } catch (error) {
      toast.error('Échec du marquage global');
      console.error('Erreur:', error);
    }
  };

  // Supprimer notification
  const deleteNotification = async (id) => {
    try {
      const response = await api.delete(`/notifications/delete/${id}`);
      if (response.data.message) {
        setNotifications(prev => prev.filter(notif => notif._id !== id));
        toast.success('Notification supprimée');
      }
    } catch (error) {
      toast.error('Échec de la suppression');
      console.error('Erreur:', error);
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Date invalide";
      
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return "N/A";
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className="notif__container">
      <div className="notif__header">
        <h2>Mes Notifications</h2>
        {notifications.length > 0 && (
          <button 
            className="notif__btn notif__btn-mark-all"
            onClick={markAllAsRead}
            disabled={loading}
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      {loading ? (
        <div className="notif__loading">Chargement en cours...</div>
      ) : message ? (
        <div className="notif__empty-message">{message}</div>
      ) : notifications.length === 0 ? (
        <div className="notif__empty-message">Aucune notification disponible</div>
      ) : (
        <div className="notif__list">
          {notifications.map(notification => (
            <div 
              key={notification._id} 
              className={`notif__item ${!notification.lu ? 'notif__item-unread' : ''}`}
            >
              <div className="notif__content">
                <div className="notif__title">{notification.titre}</div>
                <div className="notif__message">{notification.message}</div>
                <div className="notif__date">
                  {formatDate(notification.createdAt)}
                </div>
              </div>
              <div className="notif__actions">
                {!notification.lu && (
                  <button
                    className="notif__btn notif__btn-read"
                    onClick={() => markAsRead(notification._id)}
                    title="Marquer comme lue"
                  >
                    <span className="material-icons">check_circle_outline</span>
                  </button>
                )}
                <button
                  className="notif__btn notif__btn-delete"
                  onClick={() => deleteNotification(notification._id)}
                  title="Supprimer"
                >
                  <span className="material-icons">delete_outline</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;