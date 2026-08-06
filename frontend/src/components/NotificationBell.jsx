import { useContext, useState, useRef, useEffect } from "react";
import { NotificationContext } from "../context/NotificationContext";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotificationBell() {
  const { notifications, unread, markAllRead } =
    useContext(NotificationContext);

  const [open, setOpen] = useState(false);
  const ref = useRef();

  // close when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggle = () => {
    setOpen(!open);
    markAllRead();
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      
      {/* 🔔 Bell */}
      <button onClick={toggle} style={{ position: "relative" }}>
        <Bell size={22} />

        {unread > 0 && (
          <span
            style={{
              position: "absolute",
              top: -5,
              right: -5,
              background: "red",
              color: "white",
              borderRadius: "50%",
              fontSize: "10px",
              padding: "3px 6px"
            }}
          >
            {unread}
          </span>
        )}
      </button>

      {/* 📜 Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "35px",
            width: "250px",
            background: "white",
            color: "black",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            maxHeight: "300px",
            overflowY: "auto",
            zIndex: 1000
          }}
        >
          {notifications.length === 0 ? (
            <p style={{ padding: "10px" }}>No notifications</p>
          ) : (
            notifications.map((n) => (
              <Link
                key={n.id}
                to={`/event/${n.eventId}`}
                style={{
                  display: "block",
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                  textDecoration: "none",
                  color: "black"
                }}
                onClick={() => setOpen(false)}
              >
                {n.message}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}