import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  IoCheckmarkCircleOutline, 
  IoTrashOutline, 
  IoTimeOutline, 
  IoCheckmarkDoneOutline,
  IoNotificationsOutline 
} from 'react-icons/io5';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Création de l'instance Axios pour les requêtes API
  const api = useMemo(() => {
    return axios.create({
      baseURL: 'https://backend-espace-client.onrender.com/api',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
  }, []);

  // Récupération des notifications depuis l'API
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

  // Marquer une notification comme lue
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

  // Marquer toutes les notifications comme lues
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

  // Supprimer une notification
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

  // Formater la date d'une notification pour l'affichage
  const formatDate = (dateString) => {
    if (!dateString) {
      console.warn('Date string is null or undefined:', dateString);
      return "Date non disponible";
    }
    try {
      let date;
      if (typeof dateString === 'string') {
        date = new Date(dateString);
      } else if (dateString instanceof Date) {
        date = dateString;
      } else {
        console.warn('Format de date invalide:', typeof dateString, dateString);
        return "Format de date invalide";
      }
      if (isNaN(date.getTime())) {
        console.warn('Date invalide après parsing:', dateString);
        return "Date invalide";
      }
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      if (diffInMinutes < 1) {
        return "À l'instant";
      } else if (diffInMinutes < 60) {
        return `Il y a ${diffInMinutes} min`;
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        return `Il y a ${hours}h`;
      } else {
        return new Intl.DateTimeFormat('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }).format(date);
      }
    } catch (error) {
      console.error('Erreur lors du formatage de la date:', error, dateString);
      return "Erreur de date";
    }
  };

  // Chargement des notifications au montage du composant
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
            <IoCheckmarkDoneOutline size={18} />
            Tout marquer comme lu
          </button>
        )}
      </div>

      {loading ? (
        <div className="notif__loading">
          <div className="notif__spinner"></div>
          Chargement en cours...
        </div>
      ) : message ? (
        <div className="notif__empty-message">
          <IoNotificationsOutline size={48} />
          {message}
        </div>
      ) : notifications.length === 0 ? (
        <div className="notif__empty-message">
          <IoNotificationsOutline size={48} />
          Aucune notification disponible
        </div>
      ) : (
        <div className="notif__list">
          {notifications.map(notification => (
            <div 
              key={notification._id} 
              className={`notif__item ${!notification.lu ? 'notif__item-unread' : ''}`}
            >
              <div className="notif__content">
                <div className="notif__title">
                  {!notification.lu && <span className="notif__unread-dot"></span>}
                  {notification.titre}
                </div>
                <div className="notif__message">{notification.message}</div>
                <div className="notif__date">
                  <IoTimeOutline size={16} />
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
                    <IoCheckmarkCircleOutline size={20} />
                  </button>
                )}
                <button
                  className="notif__btn notif__btn-delete"
                  onClick={() => deleteNotification(notification._id)}
                  title="Supprimer"
                >
                  <IoTrashOutline size={20} />
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
