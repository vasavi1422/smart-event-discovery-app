import { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Connect to your backend port
    const socket = io("http://localhost:5000");

    socket.on("notification", (data) => {
      // Add the new notification to the top of the list
      setNotifications((prev) => [data, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  // ✅ The logic to remove a notification
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};