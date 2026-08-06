import { Outlet, Link, useLocation } from "react-router-dom";
import { Zap, Plus, Bookmark, Calendar, CalendarDays, Menu, X, Bell } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // 🔥 connect backend

export default function Layout() {
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const notifRef = useRef(null);

  // 🔔 SOCKET NOTIFICATIONS
  useEffect(() => {
    socket.on("newEvent", (data) => {
      const newNotif = {
        id: Date.now(),
        message: data.message,
        event_id: data.event_id,
      };

      setNotifications((prev) => [newNotif, ...prev].slice(0, 20));
      setUnreadCount((c) => c + 1);
    });

    return () => socket.off("newEvent");
  }, []);

  // 🔹 close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navLinks = [
    { to: "/", label: "Events", icon: Calendar },
    { to: "/calendar", label: "Calendar", icon: CalendarDays },
    { to: "/submit", label: "Post Event", icon: Plus },
    { to: "/bookmarks", label: "Saved", icon: Bookmark },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-black/80 backdrop-blur">

        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <Zap className="text-blue-500" />
            Campus Alert
          </Link>

          {/* 🔔 NOTIFICATION BELL */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setNotifOpen(!notifOpen);
                setUnreadCount(0);
              }}
              className="relative p-2 hover:bg-gray-800 rounded"
            >
              <Bell />

              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {/* DROPDOWN */}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded shadow-lg">

                <div className="p-3 border-b border-gray-700 flex justify-between">
                  <span>Notifications</span>
                  <X onClick={() => setNotifOpen(false)} className="cursor-pointer" />
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-gray-400">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <Link
                        key={n.id}
                        to={`/event/${n.event_id}`}
                        onClick={() => setNotifOpen(false)}
                        className="block p-3 hover:bg-gray-800 border-b border-gray-700"
                      >
                        {n.message}
                      </Link>
                    ))
                  )}
                </div>

              </div>
            )}
          </div>

          {/* NAV LINKS */}
          <nav className="hidden md:flex gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={isActive(link.to) ? "text-blue-400" : "text-gray-400"}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-400"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

      </header>

      {/* PAGE CONTENT */}
      <main className="max-w-7xl mx-auto p-4">
        <Outlet />
      </main>

    </div>
  );
}