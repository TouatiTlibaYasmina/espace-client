import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Add axios instance with base URL and auth header
  const api = axios.create({
    baseURL: '/https://backend-espace-client.onrender.com/api',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  // Function to fetch user notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      
      if (response.data.success) {
        if (response.data.notifications) {
          setNotifications(response.data.notifications);
        } else if (response.data.message) {
          setMessage(response.data.message);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (error.response?.status === 403) {
        toast.error('Accès refusé - veuillez vous reconnecter');
      } else {
        toast.error('Impossible de récupérer vos notifications');
      }
    } finally {
      setLoading(false);
    }
  }, [api]);

  // Fetch notifications when component mounts
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Mark a single notification as read
  const markAsRead = async (id) => {
    try {
      const response = await api.patch(`/notifications/${id}/lue`);
      
      if (response.data.success) {
        setNotifications(prevNotifications => 
          prevNotifications.map(notif => 
            notif._id === id ? { ...notif, lu: true } : notif
          )
        );
        toast.success('Notification marquée comme lue');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Erreur lors du marquage de la notification');
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await api.patch('/notifications/markAllAsRead');
      
      if (response.data.success) {
        setNotifications(prevNotifications => 
          prevNotifications.map(notif => ({ ...notif, lu: true }))
        );
        toast.success('Toutes les notifications ont été marquées comme lues');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Erreur lors du marquage des notifications');
    }
  };

  // Delete a notification
  const deleteNotification = async (id) => {
    try {
      const response = await api.delete(`/notifications/delete/${id}`);
      
      if (response.data.message) {
        setNotifications(prevNotifications => 
          prevNotifications.filter(notif => notif._id !== id)
        );
        toast.success('Notification supprimée');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Erreur lors de la suppression de la notification');
    }
  };

  // Format date to display in a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="notif__container">
      <div className="notif__header">
        <h2>Mes Notifications</h2>
        {notifications.length > 0 && (
          <button 
            className="notif__btn notif__btn-mark-all"
            onClick={markAllAsRead}
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      {loading ? (
        <div className="notif__loading">Chargement des notifications...</div>
      ) : message ? (
        <div className="notif__empty-message">{message}</div>
      ) : notifications.length === 0 ? (
        <div className="notif__empty-message">Aucune notification pour le moment.</div>
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
                <div className="notif__date">{formatDate(notification.createdAt)}</div>
              </div>
              <div className="notif__actions">
                {!notification.lu && (
                  <button
                    className="notif__btn notif__btn-read"
                    onClick={() => markAsRead(notification._id)}
                    title="Marquer comme lu"
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