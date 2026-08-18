import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockNotifications } from '../services/mockData';
import api from '../services/api';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [unreadCount, setUnreadCount] = useState(mockNotifications.filter(n => !n.isRead).length);
  const [toast, setToast] = useState(null);

  const showToast = (title, message, type = 'info') => {
    setToast({ title, message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    api.patch(`/notifications/${id}/read`).catch(() => {});
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
    api.patch('/notifications/mark-all-read').catch(() => {});
  };

  const addNotification = (notif) => {
    const newNotif = { id: Date.now(), isRead: false, createdAt: new Date().toISOString(), ...notif };
    setNotifications(prev => [newNotif, ...prev]);
    setUnreadCount(prev => prev + 1);
    showToast(notif.title, notif.message, 'success');
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      toast,
      showToast,
      markAsRead,
      markAllAsRead,
      addNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
