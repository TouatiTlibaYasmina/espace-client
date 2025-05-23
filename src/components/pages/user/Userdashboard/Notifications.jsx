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
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  // Safe date formatting (original function kept)
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

  // Rest of your component logic remains identical...
  // Only added safety checks without changing structure

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
        <div className="notif__loading">Chargement...</div>
      ) : message ? (
        <div className="notif__empty-message">{message}</div>
      ) : notifications.length === 0 ? (
        <div className="notif__empty-message">Aucune notification</div>
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