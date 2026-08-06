import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";

const Notifications = () => {
  // 1. Get context safely
  const context = useContext(NotificationContext) || {};
  
  // 2. Force notifications to be an array so .map() never fails
  const rawData = context.notifications;
  const notifications = Array.isArray(rawData) ? rawData : [];
  const removeNotification = context.removeNotification || (() => {});

  return (
    <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 999 }}>
      {notifications.length === 0 ? (
        null // Keeps screen clean when no alerts exist
      ) : (
        notifications.map((n, index) => (
          <div
            key={n._id || index}
            style={{
              background: "#1f2937",
              color: "#fff",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "12px",
              width: "260px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.1)"
            }}
          >
            <h4 style={{ margin: "0 0 5px 0", color: "#60a5fa" }}>
              {n.title || "Campus Alert"}
            </h4>
            <p style={{ fontSize: "13px", margin: "0 0 10px 0", color: "#d1d5db" }}>
              {n.message || "New update available."}
            </p>
            <button
              onClick={() => removeNotification(n._id || index)}
              style={{
                background: "#ef4444",
                color: "#fff",
                border: "none",
                padding: "5px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: "bold"
              }}
            >
              Dismiss
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;