import { createContext, useContext, useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationAsSeen,
  markAllAsSeen,
} from "../services/notifications.js";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Count unseen notifications
  const unseenCount = notifications.filter((n) => !n.seen).length;

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Mark single notification as seen
  const markOneSeen = async (id) => {
    try {
      await markNotificationAsSeen(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, seen: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification as seen:", err);
    }
  };

  // Mark all as seen
  const markAllSeen = async () => {
    try {
      await markAllAsSeen();
      setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
    } catch (err) {
      console.error("Error marking all notifications as seen:", err);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Optionally auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unseenCount,
        loading,
        fetchNotifications,
        markOneSeen,
        markAllSeen,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook
export const useNotifications = () => useContext(NotificationContext);
