import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SubmitEvent from "./pages/SubmitEvent";
import EventDetail from "./pages/EventDetail";
import Bookmarks from "./pages/Bookmarks";
import CalendarView from "./pages/CalendarView";
import Login from "./pages/Login";
import EditEvent from "./pages/EditEvent";
import NotFound from "./pages/NotFound";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Alarm from "./components/Alarm";
import Notifications from "./components/Notifications"; // ✅ ADD THIS
import { Toaster } from "react-hot-toast";

// 🔒 Protected Route
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">

      {/* 🔔 GLOBAL NOTIFICATIONS (🔥 ADD THIS) */}
      <Notifications />

      {/* 🔔 GLOBAL ALARM */}
      <Alarm />

      {/* 🧭 Navbar */}
      <Navbar />

      {/* 🔔 Toast */}
      <Toaster position="top-right" />

      {/* 🚀 Main */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full mt-16">
        <Routes>

          {/* 🏠 Home */}
          <Route path="/" element={<Home />} />

          {/* 📄 Public */}
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/login" element={<Login />} />

          {/* 🔒 Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/submit"
            element={
              <ProtectedRoute>
                <SubmitEvent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditEvent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <Bookmarks />
              </ProtectedRoute>
            }
          />

          {/* ❌ 404 */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </main>

      {/* 🏁 Footer */}
      <Footer />
    </div>
  );
}