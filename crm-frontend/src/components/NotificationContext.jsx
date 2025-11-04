import { createContext, useContext, useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationAsSeen,
  markAllAsSeen,
} from "../services/notifications.js";
import { io } from "socket.io-client";

const NotificationContext = createContext();
let socket;

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

  // 📡 Setup socket connection
  useEffect(() => {
    // ✅ Connect socket
    socket = io("http://localhost:5000", { withCredentials: true });

    // ✅ Register user to their room
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { _id } = JSON.parse(storedUser);
      if (_id) {
        socket.emit("registerUser", _id);
      }
    }

    // ✅ Listen for new notifications
    socket.on("newNotification", (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
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
