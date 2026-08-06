import { useState, useEffect, useContext } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import {
  Calendar,
  MapPin,
  CheckCircle,
  Heart,
  AlertTriangle
} from "lucide-react";

export default function EventCard({ event }) {
  const { user, isStudentEmail } = useContext(AuthContext);

  // ✅ SAFETY CHECK
  if (!event || !(event._id || event.id)) return null;

  const eventId = event._id || event.id;

  const [saved, setSaved] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [interestCount, setInterestCount] = useState(0);

  // ✅ Format date safely
  const formatDate = (date) => {
    if (!date) return "TBA";
    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch {
      return "TBA";
    }
  };

  const isExpired =
    event.end_date && new Date(event.end_date) < new Date();

  useEffect(() => {
    if (user && eventId) {
      checkSaved();
      fetchInterestCount();
    }
  }, [user, eventId]);

  // ✅ Check bookmark safely
  const checkSaved = async () => {
    try {
      const res = await API.get("/bookmarks");
      const exists = res.data?.some(
        (b) =>
          (b.event_id === eventId ||
            b.event_id?._id === eventId) &&
          b.user_email === user?.email
      );
      setSaved(!!exists);
    } catch {
      setSaved(false);
    }
  };

  // ✅ Interest count
  const fetchInterestCount = async () => {
    try {
      const res = await API.get(`/bookmarks/count/${eventId}`);
      setInterestCount(res.data?.count || 0);
    } catch {
      setInterestCount(0);
    }
  };

  // ✅ Toggle bookmark
  const toggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return toast.error("Login required");

    const prev = saved;
    setSaved(!prev);

    try {
      if (prev) {
        await API.delete("/bookmarks", {
          data: {
            event_id: eventId,
            user_email: user.email
          }
        });
        toast("Removed from bookmarks");
      } else {
        await API.post("/bookmarks", {
          event_id: eventId,
          user_email: user.email
        });
        toast.success("Saved!");
      }
    } catch {
      setSaved(prev);
      toast.error("Failed to update bookmark");
    }
  };

  // ✅ Report event
  const handleReport = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return toast.error("Login required");

    setIsReporting(true);

    try {
      await API.post(`/events/${eventId}/report`);
      toast.success("Reported successfully");
    } catch {
      toast.error("Already reported");
    } finally {
      setIsReporting(false);
    }
  };

  // ✅ Verified check safe
  const isVerified =
    typeof isStudentEmail === "function"
      ? isStudentEmail(
          event.submitter_email || event.user_email
        )
      : false;

  return (
    <Link to={`/event/${eventId}`} className="block">
      <div className="border rounded-xl overflow-hidden hover:shadow-lg transition bg-white">

        {/* IMAGE */}
        <div className="h-40 bg-gray-200 relative">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Calendar />
            </div>
          )}

          {/* 🔥 Trending */}
          {interestCount > 5 && (
            <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
              🔥 Trending
            </span>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-4">
          <h3 className="font-bold text-lg">
            {event.title || "Untitled Event"}
          </h3>

          <p className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {event.city || "Unknown"}
          </p>

          <p className="text-sm mt-1">
            {formatDate(event.start_date)}
          </p>

          {/* VERIFIED */}
          {isVerified && (
            <span className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <CheckCircle className="w-3 h-3" />
              Verified
            </span>
          )}

          {/* ACTIONS */}
          <div className="flex gap-3 mt-3">
            <button onClick={toggleSave}>
              <Heart
                className={`w-5 transition ${
                  saved ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </button>

            <button
              onClick={handleReport}
              disabled={isReporting}
            >
              <AlertTriangle className="w-5 text-gray-500" />
            </button>
          </div>

          {/* EXPIRED */}
          {isExpired && (
            <p className="text-red-500 text-xs mt-2">
              Expired
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}