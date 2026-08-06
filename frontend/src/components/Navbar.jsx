import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/NotificationContext";
import toast from "react-hot-toast";
import { 
  Bell, LogOut, LayoutDashboard, 
  Bookmark, PlusCircle, Calendar, CheckCircle 
} from "lucide-react";

export default function Navbar() {
  const { user, logout, isStudentEmail } = useContext(AuthContext);
  const { notifications = [], unread = 0, markAllRead } = useContext(NotificationContext);

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef();
  const profileRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    navigate("/");
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isActive = (path) => location.pathname === path;

  // ✅ SAFE USER VALUES
  const userEmail = user?.email || "";
  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "U";
  const userName = userEmail ? userEmail.split("@")[0] : "User";

  return (
    <nav className="sticky top-0 z-[100] bg-background/80 backdrop-blur-md border-b px-6 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xl">C</span>
          </div>
          <h1 className="text-xl font-bold hidden md:block">
            Campus<span className="text-primary">Alert</span>
          </h1>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex gap-2">
          {[
            { name: "Explore", path: "/", icon: LayoutDashboard },
            { name: "Post Event", path: "/submit", icon: PlusCircle },
            { name: "Bookmarks", path: "/bookmarks", icon: Bookmark },
            { name: "Calendar", path: "/calendar", icon: Calendar },
          ].map((item) => (
            <Link key={item.path} to={item.path} className="px-3 py-2 text-sm">
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotifOpen(!notifOpen); markAllRead(); }}
              className="p-2 border rounded"
            >
              <Bell className="w-5 h-5" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border rounded shadow">
                {notifications.length === 0 ? (
                  <p className="p-4 text-sm">No notifications</p>
                ) : (
                  notifications.map((n, i) => (
                    <div
                      key={n.id || i}   // ✅ SAFE KEY
                      onClick={() => {
                        setNotifOpen(false);
                        if (n.eventId) navigate(`/event/${n.eventId}`);
                      }}
                      className="p-3 border-b cursor-pointer"
                    >
                      {n.message}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Profile */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 border px-3 py-1 rounded"
              >
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                  {userInitial} {/* ✅ FIX */}
                </div>

                <span className="hidden sm:block text-sm">
                  {userName} {/* ✅ FIX */}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border rounded shadow p-2">

                  <p className="text-sm font-bold">{userEmail}</p>

                  {isStudentEmail?.(userEmail) && (
                    <div className="flex items-center gap-1 text-green-600 text-xs">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </div>
                  )}

                  <button
                    onClick={handleLogout}
                    className="mt-2 w-full text-left text-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded">
              Login
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}